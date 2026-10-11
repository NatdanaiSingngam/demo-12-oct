import express, { type NextFunction, type Request, type Response } from 'express';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Admin API. The browser never holds the service_role key: it sends its Supabase access token,
// this server verifies it and re-checks that the caller is an active admin before doing anything.
const ACTIONS = { suspend: 'ระงับบัญชี', restore: 'เปิดใช้งานบัญชี', delete: 'ลบบัญชี', admin: 'เปลี่ยนบทบาทเป็นแอดมิน', student: 'เปลี่ยนบทบาทเป็นนักศึกษา' } as const;
type Action = keyof typeof ACTIONS;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

class HttpError extends Error { constructor(public status: number, message: string) { super(message); } }
interface Profile { id: string; name: string; email: string; role: 'student' | 'admin'; status: 'active' | 'suspended' }

let cached: SupabaseClient | null = null;
function service(): SupabaseClient {
  if (cached) return cached;
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new HttpError(503, 'ยังไม่ได้ตั้งค่า SUPABASE_URL และ SUPABASE_SERVICE_ROLE_KEY บนเซิร์ฟเวอร์');
  cached = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  return cached;
}

const wrap = (handler: (req: Request, res: Response) => Promise<void>) => (req: Request, res: Response, next: NextFunction) => { handler(req, res).catch(next); };

export type Db = () => SupabaseClient;
const requireAdmin = (db: Db) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = /^Bearer (.+)$/i.exec(req.header('authorization') || '')?.[1];
    if (!token) throw new HttpError(401, 'กรุณาเข้าสู่ระบบ');
    const { data: { user }, error } = await db().auth.getUser(token);
    if (error || !user) throw new HttpError(401, 'เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่');
    const { data: actor } = await db().from('profiles').select('id, name, email, role, status').eq('id', user.id).maybeSingle<Profile>();
    if (!actor || actor.role !== 'admin' || actor.status !== 'active') throw new HttpError(403, 'บัญชีนี้ไม่มีสิทธิ์จัดการผู้ใช้');
    res.locals.actor = actor;
    next();
  } catch (error) { next(error); }
};

/** `db` is injected so tests can run against an in-memory fake instead of Supabase. */
export function createApp(db: Db = service) {
const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '10kb' }));
app.use((_req, res, next) => { res.setHeader('Cache-Control', 'no-store'); next(); });

app.get('/api/health', (_req, res) => { res.json({ ok: true }); });

app.get('/api/admin/snapshot', requireAdmin(db), wrap(async (_req, res) => {
  const sb = db();
  const [profiles, userData, audit] = await Promise.all([
    sb.from('profiles').select('*').order('created_at'),
    sb.from('user_data').select('user_id, data'),
    sb.from('admin_audit').select('*').order('created_at', { ascending: false }).limit(500)
  ]);
  if (profiles.error || userData.error || audit.error) throw new HttpError(500, 'อ่านข้อมูลจากฐานข้อมูลไม่ได้');
  res.json({ profiles: profiles.data, userData: userData.data, audit: audit.data });
}));

app.post('/api/admin/accounts/:id/:action', requireAdmin(db), wrap(async (req, res) => {
  const actor = res.locals.actor as Profile;
  const { id, action } = req.params;
  if (!UUID.test(id) || !(action in ACTIONS)) throw new HttpError(400, 'คำขอไม่ถูกต้อง');
  const reason = typeof req.body?.reason === 'string' ? req.body.reason.trim() : '';
  if (reason.length < 2) throw new HttpError(400, 'กรุณาระบุเหตุผลอย่างน้อย 2 ตัวอักษร');
  if (reason.length > 500) throw new HttpError(400, 'เหตุผลยาวเกิน 500 ตัวอักษร');
  if (id === actor.id) throw new HttpError(403, 'ไม่สามารถเปลี่ยนสิทธิ์ ระงับ หรือลบบัญชีแอดมินที่กำลังใช้งาน');

  const sb = db();
  const { data: target } = await sb.from('profiles').select('id, name, email, role, status').eq('id', id).maybeSingle<Profile>();
  if (!target) throw new HttpError(404, 'ไม่พบบัญชีนี้ อาจถูกลบไปแล้ว');

  if (action === 'suspend' || action === 'restore') {
    const { error } = await sb.from('profiles').update({ status: action === 'suspend' ? 'suspended' : 'active' }).eq('id', id);
    if (error) throw new HttpError(500, 'บันทึกไม่ได้');
  } else if (action === 'admin' || action === 'student') {
    const { error } = await sb.from('profiles').update({ role: action }).eq('id', id);
    if (error) throw new HttpError(500, 'บันทึกไม่ได้');
  } else {
    // Deleting the auth user cascades to profiles and user_data.
    const { error } = await sb.auth.admin.deleteUser(id);
    if (error) throw new HttpError(500, 'ลบบัญชีไม่ได้');
  }

  const { error } = await sb.from('admin_audit').insert({ actor_id: actor.id, actor_name: actor.name, action: ACTIONS[action as Action], target_id: target.id, target_name: target.name, target_email: target.email, reason });
  if (error) throw new HttpError(500, 'ดำเนินการแล้ว แต่บันทึกประวัติไม่สำเร็จ กรุณาแจ้งผู้ดูแลระบบ');
  res.json({ ok: true });
}));

app.use('/api', (_req, res) => { res.status(404).json({ error: 'ไม่พบ API นี้' }); });
app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof HttpError) { res.status(error.status).json({ error: error.message }); return; }
  if (error instanceof SyntaxError) { res.status(400).json({ error: 'รูปแบบข้อมูลไม่ถูกต้อง' }); return; }
  console.error(error);
  res.status(500).json({ error: 'เกิดข้อผิดพลาดบนเซิร์ฟเวอร์' });
});
return app;
}

export const app = createApp();
export default app;
