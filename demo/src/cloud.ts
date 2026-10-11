import { createClient } from '@supabase/supabase-js';
import { emptyData, type Data, type DemoUser } from './model';
import type { AuditEntry } from './accounts';

// Supabase mode is enabled only when both public values are provided at build time (see .env.example).
// The anon key is meant for browsers; access control is enforced by RLS in supabase/schema.sql.
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
export const supabase = url && anonKey ? createClient(url, anonKey) : null;
export const cloudMode = !!supabase;
function client() { if (!supabase) throw new Error('ยังไม่ได้ตั้งค่า Supabase'); return supabase; }

interface ProfileRow { id: string; name: string; email: string; role: 'student' | 'admin'; status: 'active' | 'suspended'; created_at: string; last_login_at: string | null }
const toUser = (row: ProfileRow): DemoUser => ({ id: row.id, name: row.name, email: row.email, role: row.role, status: row.status, createdAt: row.created_at, lastLoginAt: row.last_login_at || undefined });
function validData(value: unknown): Data {
  const data = value as Data | null;
  return data && Array.isArray(data.projects) && Array.isArray(data.tasks) && Array.isArray(data.notices) ? data : emptyData();
}
function authMessage(message: string) {
  if (/invalid login credentials/i.test(message)) return 'อีเมลหรือรหัสผ่านไม่ถูกต้อง';
  if (/already registered/i.test(message)) return 'อีเมลนี้มีบัญชีแล้ว กรุณาเข้าสู่ระบบ';
  if (/email not confirmed/i.test(message)) return 'กรุณายืนยันอีเมลจากลิงก์ที่ส่งไปก่อนเข้าสู่ระบบ';
  if (/failed to fetch|network/i.test(message)) return 'เชื่อมต่อ Supabase ไม่ได้ กรุณาตรวจ URL ของโปรเจ็คและอินเทอร์เน็ต';
  return message;
}

/** Returns the active signed-in profile, or null. Suspended accounts are signed out. */
export async function currentUser(): Promise<DemoUser | null> {
  const { data: { session } } = await client().auth.getSession();
  if (!session) return null;
  const { data, error } = await client().from('profiles').select('*').eq('id', session.user.id).maybeSingle<ProfileRow>();
  if (error) throw new Error(error.message);
  if (!data || data.status !== 'active') { await client().auth.signOut(); return null; }
  return toUser(data);
}
async function startSession(): Promise<DemoUser> {
  const { data, error } = await client().rpc('record_login').single<ProfileRow>();
  if (error || !data?.id) { await client().auth.signOut(); throw new Error('ไม่พบข้อมูลบัญชี กรุณาติดต่อแอดมิน'); }
  if (data.status !== 'active') { await client().auth.signOut(); throw new Error('บัญชีนี้ถูกระงับ กรุณาติดต่อแอดมิน'); }
  return toUser(data);
}
export async function signIn(email: string, password: string): Promise<DemoUser> {
  const { error } = await client().auth.signInWithPassword({ email, password });
  if (error) throw new Error(authMessage(error.message));
  return startSession();
}
/** Returns null when the project requires email confirmation before the first sign-in. */
export async function signUp(name: string, email: string, password: string): Promise<DemoUser | null> {
  const { data, error } = await client().auth.signUp({ email, password, options: { data: { name } } });
  if (error) throw new Error(authMessage(error.message));
  if (!data.session) return null;
  return startSession();
}
export async function signOut() { await client().auth.signOut(); }

export async function loadCloudData(userId: string): Promise<Data> {
  const { data, error } = await client().from('user_data').select('data').eq('user_id', userId).maybeSingle<{ data: Data }>();
  if (error) throw new Error('อ่านข้อมูลจาก Supabase ไม่ได้');
  return validData(data?.data);
}
// Saves are chained so an older snapshot never overwrites a newer one.
let saveQueue: Promise<void> = Promise.resolve();
export function saveCloudData(userId: string, data: Data): Promise<void> {
  const run = async () => {
    const { error } = await client().from('user_data').upsert({ user_id: userId, data, updated_at: new Date().toISOString() });
    if (error) throw new Error('บันทึกข้อมูลไปยัง Supabase ไม่ได้');
  };
  const next = saveQueue.then(run, run);
  saveQueue = next.catch(() => undefined);
  return next;
}

export interface AdminSnapshot { accounts: DemoUser[]; logs: AuditEntry[]; rows: { account: DemoUser; data: Data }[]; errors: string[] }

// Admin operations go through the Express API (server/app.ts), which verifies this access token
// and the caller's admin role before using the service_role key.
async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const { data: { session } } = await client().auth.getSession();
  if (!session) throw new Error('เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่');
  let response: Response;
  try { response = await fetch(`/api${path}`, { ...init, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` } }); }
  catch { throw new Error('เชื่อมต่อ API ไม่ได้ กรุณาตรวจว่าเซิร์ฟเวอร์ทำงานอยู่'); }
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || `คำขอไม่สำเร็จ (${response.status})`);
  return body as T;
}
export async function loadAdminSnapshot(): Promise<AdminSnapshot> {
  const { profiles, userData, audit } = await api<{ profiles: ProfileRow[]; userData: { user_id: string; data: Data }[]; audit: Record<string, string>[] }>('/admin/snapshot');
  const accounts = profiles.map(toUser);
  const dataByUser = new Map(userData.map(row => [row.user_id, validData(row.data)]));
  const logs: AuditEntry[] = audit.map(row => ({ id: row.id, actorId: row.actor_id || '', actorName: row.actor_name, action: row.action, targetId: row.target_id, targetName: row.target_name, targetEmail: row.target_email, reason: row.reason, createdAt: row.created_at }));
  return { accounts, logs, rows: accounts.map(account => ({ account, data: dataByUser.get(account.id) || emptyData() })), errors: [] };
}
export async function manageCloudAccount(targetId: string, action: 'suspend' | 'restore' | 'delete' | 'admin' | 'student', reason: string) {
  await api(`/admin/accounts/${encodeURIComponent(targetId)}/${action}`, { method: 'POST', body: JSON.stringify({ reason }) });
}
