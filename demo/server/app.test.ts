import { after, before, beforeEach, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import type { Server } from 'node:http';
import type { SupabaseClient } from '@supabase/supabase-js';
import { createApp } from './app';

type Row = Record<string, unknown>;
const ADMIN = '00000000-0000-4000-8000-000000000001';
const STUDENT = '00000000-0000-4000-8000-000000000002';
const OTHER = '00000000-0000-4000-8000-000000000003';
const GONE = '00000000-0000-4000-8000-0000000000ff';
const profile = (id: string, name: string, role: string, status = 'active') => ({ id, name, email: `${name}@example.com`, role, status, created_at: '2026-10-01T00:00:00Z', last_login_at: null });

// Minimal in-memory stand-in for the parts of the Supabase client that server/app.ts uses.
function fakeDb() {
  const tables: Record<string, Row[]> = { profiles: [], user_data: [], admin_audit: [] };
  const tokens = new Map<string, string>();
  const failures = new Set<string>();
  const query = (table: string) => {
    let rows = tables[table]; let patch: Row | null = null;
    const q = {
      select: () => q,
      order: () => q,
      limit: () => q,
      eq: (column: string, value: unknown) => { rows = rows.filter(r => r[column] === value); return q; },
      update: (values: Row) => { patch = values; return q; },
      insert: async (values: Row) => { if (failures.has(`insert:${table}`)) return { error: { message: 'boom' } }; tables[table].push({ id: crypto.randomUUID(), created_at: new Date().toISOString(), ...values }); return { error: null }; },
      maybeSingle: async () => ({ data: rows[0] ?? null, error: null }),
      then: (resolve: (value: unknown) => void) => {
        if (patch) { rows.forEach(r => Object.assign(r, patch)); resolve({ data: null, error: failures.has(`update:${table}`) ? { message: 'boom' } : null }); } else resolve({ data: rows, error: null });
      }
    };
    return q;
  };
  const db = {
    from: query,
    auth: {
      getUser: async (token: string) => { const id = tokens.get(token); return id ? { data: { user: { id } }, error: null } : { data: { user: null }, error: { message: 'bad jwt' } }; },
      admin: { deleteUser: async (id: string) => { if (failures.has('deleteUser')) return { error: { message: 'boom' } }; tables.profiles = tables.profiles.filter(r => r.id !== id); tables.user_data = tables.user_data.filter(r => r.user_id !== id); return { error: null }; } }
    }
  } as unknown as SupabaseClient;
  return { db, tables, tokens, failures };
}

describe('admin API', () => {
  const fake = fakeDb(); let server: Server; let base = '';
  before(async () => { server = createApp(() => fake.db).listen(0, '127.0.0.1'); await new Promise(resolve => server.once('listening', resolve)); base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`; });
  after(() => { server.close(); });
  beforeEach(() => {
    fake.failures.clear(); fake.tokens.clear();
    fake.tables.profiles = [profile(ADMIN, 'admin', 'admin'), profile(STUDENT, 'student', 'student'), profile(OTHER, 'other', 'student')];
    fake.tables.user_data = [{ user_id: STUDENT, data: { projects: [], tasks: [], notices: [] } }];
    fake.tables.admin_audit = [];
    fake.tokens.set('admin-token', ADMIN); fake.tokens.set('student-token', STUDENT);
  });
  const call = (path: string, token?: string, body?: unknown) => fetch(base + path, { method: body === undefined ? 'GET' : 'POST', headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: body === undefined ? undefined : typeof body === 'string' ? body : JSON.stringify(body) });
  const manage = (id: string, action: string, reason: unknown = 'ทดสอบ', token = 'admin-token') => call(`/api/admin/accounts/${id}/${action}`, token, { reason });
  const find = (id: string) => fake.tables.profiles.find(r => r.id === id);

  it('answers the health check without authentication', async () => {
    assert.equal((await call('/api/health')).status, 200);
  });

  describe('authentication', () => {
    it('rejects a missing token', async () => assert.equal((await call('/api/admin/snapshot')).status, 401));
    it('rejects an unknown token', async () => assert.equal((await call('/api/admin/snapshot', 'nope')).status, 401));
    it('rejects a student with 403 on every admin route', async () => {
      assert.equal((await call('/api/admin/snapshot', 'student-token')).status, 403);
      assert.equal((await manage(OTHER, 'delete', 'x1', 'student-token')).status, 403);
      assert.ok(find(OTHER));
    });
    it('rejects a suspended admin', async () => {
      find(ADMIN)!.status = 'suspended';
      assert.equal((await call('/api/admin/snapshot', 'admin-token')).status, 403);
    });
    it('rejects a valid token whose profile no longer exists', async () => {
      fake.tokens.set('ghost', GONE);
      assert.equal((await call('/api/admin/snapshot', 'ghost')).status, 403);
    });
  });

  it('returns every profile, data row, and audit entry to an admin', async () => {
    const res = await call('/api/admin/snapshot', 'admin-token');
    assert.equal(res.status, 200);
    const body = await res.json() as { profiles: Row[]; userData: Row[]; audit: Row[] };
    assert.equal(body.profiles.length, 3); assert.equal(body.userData.length, 1); assert.deepEqual(body.audit, []);
  });

  describe('account actions', () => {
    it('suspends and restores an account and records both in the audit log', async () => {
      assert.equal((await manage(STUDENT, 'suspend', 'ละเมิดกฎ')).status, 200);
      assert.equal(find(STUDENT)!.status, 'suspended');
      assert.equal((await manage(STUDENT, 'restore', 'อุทธรณ์ผ่าน')).status, 200);
      assert.equal(find(STUDENT)!.status, 'active');
      assert.deepEqual(fake.tables.admin_audit.map(r => r.action), ['ระงับบัญชี', 'เปิดใช้งานบัญชี']);
      assert.equal(fake.tables.admin_audit[0].actor_id, ADMIN); assert.equal(fake.tables.admin_audit[0].reason, 'ละเมิดกฎ');
    });
    it('changes roles', async () => {
      await manage(STUDENT, 'admin'); assert.equal(find(STUDENT)!.role, 'admin');
      await manage(STUDENT, 'student'); assert.equal(find(STUDENT)!.role, 'student');
    });
    it('deletes the account and its data but keeps the audit entry', async () => {
      assert.equal((await manage(STUDENT, 'delete')).status, 200);
      assert.equal(find(STUDENT), undefined); assert.equal(fake.tables.user_data.length, 0);
      assert.equal(fake.tables.admin_audit.length, 1); assert.equal(fake.tables.admin_audit[0].target_email, 'student@example.com');
    });
    it('refuses to act on the caller’s own account', async () => {
      for (const action of ['suspend', 'delete', 'student']) assert.equal((await manage(ADMIN, action)).status, 403);
      assert.equal(find(ADMIN)!.role, 'admin'); assert.equal(fake.tables.admin_audit.length, 0);
    });
    it('validates the reason (2–500 characters after trimming)', async () => {
      for (const reason of ['', ' a ', 123, null, 'x'.repeat(501)]) assert.equal((await manage(STUDENT, 'suspend', reason)).status, 400);
      assert.equal((await call(`/api/admin/accounts/${STUDENT}/suspend`, 'admin-token', {})).status, 400);
      assert.equal(find(STUDENT)!.status, 'active');
      assert.equal((await manage(STUDENT, 'suspend', 'x'.repeat(500))).status, 200);
    });
    it('rejects bad ids, unknown actions, and malformed bodies', async () => {
      assert.equal((await manage('not-a-uuid', 'suspend')).status, 400);
      assert.equal((await manage(STUDENT, 'promote-to-god')).status, 400);
      assert.equal((await call(`/api/admin/accounts/${STUDENT}/suspend`, 'admin-token', '{bad')).status, 400);
      assert.equal(find(STUDENT)!.status, 'active');
    });
    it('returns 404 for an account that does not exist', async () => {
      assert.equal((await manage(GONE, 'suspend')).status, 404);
    });
    it('does not write an audit entry when the change itself fails', async () => {
      fake.failures.add('update:profiles'); assert.equal((await manage(STUDENT, 'suspend')).status, 500);
      fake.failures.clear(); fake.failures.add('deleteUser'); assert.equal((await manage(STUDENT, 'delete')).status, 500);
      assert.equal(fake.tables.admin_audit.length, 0);
    });
    it('reports a failed audit write explicitly', async () => {
      fake.failures.add('insert:admin_audit');
      const res = await manage(STUDENT, 'suspend');
      assert.equal(res.status, 500); assert.match((await res.json() as { error: string }).error, /บันทึกประวัติไม่สำเร็จ/);
    });
  });

  it('answers unknown API paths with 404 JSON', async () => {
    const res = await call('/api/nope'); assert.equal(res.status, 404); assert.ok((await res.json() as { error: string }).error);
  });
});
