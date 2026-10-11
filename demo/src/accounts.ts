import { AccountBlockedError, DATA_PREFIX, emptyData, loadData, uid, type Data, type DemoUser } from './model';

export const SESSION = 'projectrecord.demo.session';
export const ACCOUNTS = 'projectrecord.demo.accounts';
export const AUDIT_KEY = 'projectrecord.demo.admin.audit';
export const DEMO_USER: DemoUser = { id: 'demo-user', name: 'พุฒิ ศรีสุข', email: 'demo@projectrecord.local', role: 'user', status: 'active' };
export const ADMIN_USER: DemoUser = { id: 'demo-admin', name: 'ภัทรพล จันทร์ประเสริฐ', email: 'admin@projectrecord.local', role: 'admin', status: 'active' };
export interface AuditEntry { id: string; actorId: string; actorName: string; action: string; targetId: string; targetName: string; targetEmail: string; reason: string; createdAt: string }

// This is a device-local demo registry, not a security boundary or real authentication.
export function readAccounts(): DemoUser[] {
  const raw = JSON.parse(localStorage.getItem(ACCOUNTS) || '[]');
  if (!Array.isArray(raw)) throw new Error('อ่านบัญชีจำลองไม่ได้');
  const stored: DemoUser[] = raw.filter(u => u && typeof u.id === 'string' && typeof u.name === 'string' && typeof u.email === 'string').map(u => ({ ...u, role: u.role === 'admin' ? 'admin' : 'user', status: u.status === 'suspended' ? 'suspended' : 'active' }));
  const builtins = [DEMO_USER, ADMIN_USER].map(builtin => {
    const override = stored.find(u => u.id === builtin.id);
    return { ...builtin, ...override, id: builtin.id, email: builtin.email, role: builtin.role, ...(builtin.id === ADMIN_USER.id ? { status: 'active' as const } : {}) };
  });
  return [...builtins, ...stored.filter(u => !builtins.some(b => b.id === u.id || b.email.toLowerCase() === u.email.toLowerCase()))];
}
export function saveAccounts(users: DemoUser[]) { localStorage.setItem(ACCOUNTS, JSON.stringify(users)); }
export function getAccount(id: string) { return readAccounts().find(u => u.id === id); }
export function readUser(): DemoUser | null {
  try { const session = JSON.parse(localStorage.getItem(SESSION) || 'null'); if (!session || typeof session.id !== 'string') return null; const user = getAccount(session.id); return user?.status === 'active' ? user : null; } catch { return null; }
}
export function readAudit(): AuditEntry[] { const raw = JSON.parse(localStorage.getItem(AUDIT_KEY) || '[]'); if (!Array.isArray(raw)) throw new Error('อ่านประวัติไม่ได้'); return raw; }
export function registerAccount(name: string, email: string): DemoUser {
  const users = readAccounts(); if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) throw new Error('อีเมลนี้มีบัญชีจำลองแล้ว กรุณาเข้าสู่ระบบ');
  const user: DemoUser = { id: uid(), name, email, role: 'user', status: 'active', createdAt: new Date().toISOString() };
  saveAccounts([...users, user]); return user;
}
export function recordLogin(user: DemoUser): DemoUser {
  const canonical = getAccount(user.id); if (!canonical) throw new AccountBlockedError({ kind: 'removed' }, 'บัญชีนี้ถูกลบแล้ว กรุณาสมัครสมาชิกใหม่'); if (canonical.status !== 'active') throw new AccountBlockedError({ kind: 'suspended', reason: canonical.statusReason, at: canonical.statusChangedAt }, 'บัญชีนี้ถูกระงับ กรุณาติดต่อแอดมิน');
  const next = { ...canonical, lastLoginAt: new Date().toISOString() }; saveAccounts(readAccounts().map(u => u.id === next.id ? next : u)); return next;
}
export function initializeAdminDemo() {
  const users = readAccounts(); saveAccounts(users);
  if (!localStorage.getItem(DATA_PREFIX + DEMO_USER.id)) localStorage.setItem(DATA_PREFIX + DEMO_USER.id, JSON.stringify(loadData(DEMO_USER)));
}
export function storedData(user: DemoUser): Data {
  if (!localStorage.getItem(DATA_PREFIX + user.id)) return emptyData();
  return loadData(user);
}
export function manageAccount(actor: DemoUser, targetId: string, action: 'suspend' | 'restore' | 'delete' | 'admin' | 'user', reason: string) {
  const canonicalActor = getAccount(actor.id);
  if (canonicalActor?.role !== 'admin' || canonicalActor.status !== 'active') throw new Error('บัญชีนี้ไม่มีสิทธิ์จัดการผู้ใช้');
  const users = readAccounts(); const target = users.find(u => u.id === targetId);
  if (!target) throw new Error('ไม่พบบัญชีนี้ อาจถูกลบจากอีกแท็บแล้ว');
  if (target.id === actor.id || target.id === ADMIN_USER.id) throw new Error('ไม่สามารถเปลี่ยนสิทธิ์ ระงับ หรือลบบัญชีแอดมินที่กำลังใช้งาน');
  if (target.id === DEMO_USER.id && ['delete', 'admin', 'user'].includes(action)) throw new Error('บัญชีตัวอย่างหลักเปลี่ยนบทบาทหรือลบไม่ได้ แต่ระงับและเปิดใช้งานได้');
  if (reason.trim().length < 2) throw new Error('กรุณาระบุเหตุผลอย่างน้อย 2 ตัวอักษร');
  const labels = { suspend: 'ระงับบัญชี', restore: 'เปิดใช้งานบัญชี', delete: 'ลบบัญชี', admin: 'เปลี่ยนบทบาทเป็นแอดมิน', user: 'เปลี่ยนบทบาทเป็นผู้ใช้งาน' };
  const nextUsers = action === 'delete' ? users.filter(u => u.id !== targetId) : users.map(u => u.id === targetId ? { ...u, ...(['suspend', 'restore'].includes(action) ? { status: action === 'suspend' ? 'suspended' as const : 'active' as const, statusReason: action === 'suspend' ? reason.trim() : undefined, statusChangedAt: new Date().toISOString() } : { role: action === 'admin' ? 'admin' as const : 'user' as const }) } : u);
  const nextAudit = [{ id: uid(), actorId: actor.id, actorName: canonicalActor.name, action: labels[action], targetId, targetName: target.name, targetEmail: target.email, reason: reason.trim(), createdAt: new Date().toISOString() }, ...readAudit()];
  // Save all related records together; roll back on localStorage failure.
  const keys = [ACCOUNTS, AUDIT_KEY, DATA_PREFIX + targetId]; const snapshot = keys.map(key => [key, localStorage.getItem(key)] as const);
  try { saveAccounts(nextUsers); localStorage.setItem(AUDIT_KEY, JSON.stringify(nextAudit)); if (action === 'delete') localStorage.removeItem(DATA_PREFIX + targetId); }
  catch (error) { snapshot.forEach(([key, value]) => { try { if (value === null) localStorage.removeItem(key); else localStorage.setItem(key, value); } catch { /* Preserve the original failure. */ } }); throw error; }
}
/** Demo mode only: edits the device-local registry. The two built-in accounts keep their fixed e-mail addresses. */
export function updateLocalProfile(userId: string, changes: { name: string; email: string }): DemoUser {
  const users = readAccounts(); const target = users.find(u => u.id === userId);
  if (!target || target.status !== 'active') throw new Error('ไม่พบบัญชีนี้');
  const email = changes.email.trim().toLowerCase(); const builtin = userId === DEMO_USER.id || userId === ADMIN_USER.id;
  if (builtin && email !== target.email.toLowerCase()) throw new Error('บัญชีตัวอย่างหลักเปลี่ยนอีเมลไม่ได้');
  if (users.some(u => u.id !== userId && u.email.toLowerCase() === email)) throw new Error('อีเมลนี้มีบัญชีอยู่แล้ว');
  const next = { ...target, name: changes.name.trim(), email: builtin ? target.email : email };
  saveAccounts(users.map(u => u.id === userId ? next : u)); return next;
}
