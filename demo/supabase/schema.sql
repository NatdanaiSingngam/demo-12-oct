-- ProjectRecord demo · Supabase schema
-- รันไฟล์นี้ใน Supabase Dashboard > SQL Editor (รันซ้ำได้)
-- แยกสิทธิ์ด้วย Row Level Security: ผู้ใช้ทุกคน (รวมแอดมิน) เห็น/แก้ได้เฉพาะข้อมูลของตนเองผ่านเบราว์เซอร์
-- งานแอดมิน (ดูทุกบัญชี ระงับ เปลี่ยนบทบาท ลบ ประวัติ) ทำผ่าน Express API (server/app.ts) ด้วย service_role key เท่านั้น

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '' check (char_length(name) <= 80),
  email text not null,
  role text not null default 'student' check (role in ('student', 'admin')),
  status text not null default 'active' check (status in ('active', 'suspended')),
  created_at timestamptz not null default now(),
  last_login_at timestamptz
);

-- เก็บโปรเจ็ค งาน และการแจ้งเตือนของแต่ละบัญชีเป็น JSON ก้อนเดียว (โครงสร้างเดียวกับ Data ใน src/model.ts)
create table if not exists public.user_data (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  data jsonb not null default '{"projects": [], "tasks": [], "notices": []}'::jsonb,
  updated_at timestamptz not null default now()
);

-- ประวัติการจัดการบัญชี เก็บไว้แม้บัญชีเป้าหมายถูกลบ
create table if not exists public.admin_audit (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id) on delete set null,
  actor_name text not null,
  action text not null,
  target_id uuid not null,
  target_name text not null,
  target_email text not null,
  reason text not null,
  created_at timestamptz not null default now()
);

-- ---------- Helper functions ----------
create or replace function public.is_active_user() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and status = 'active');
$$;

-- สร้าง profile และพื้นที่ข้อมูลว่างทุกครั้งที่มีผู้สมัครใหม่ บทบาทเริ่มต้นเป็นนักศึกษาเสมอ
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name, email)
  values (new.id, left(coalesce(nullif(trim(new.raw_user_meta_data->>'name'), ''), split_part(new.email, '@', 1)), 80), lower(new.email))
  on conflict (id) do nothing;
  insert into public.user_data (user_id) values (new.id) on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- Row Level Security ----------
alter table public.profiles enable row level security;
alter table public.user_data enable row level security;
alter table public.admin_audit enable row level security;

revoke all on public.profiles, public.user_data, public.admin_audit from anon;

drop policy if exists "profiles: read own or admin" on public.profiles;
drop policy if exists "profiles: read own" on public.profiles;
create policy "profiles: read own" on public.profiles
  for select to authenticated using (id = auth.uid());
-- ไม่มี policy insert/update/delete สำหรับ profiles: ผู้ใช้เปลี่ยน role/status ของตัวเองไม่ได้

drop policy if exists "user_data: read own or admin" on public.user_data;
drop policy if exists "user_data: read own" on public.user_data;
create policy "user_data: read own" on public.user_data
  for select to authenticated using (user_id = auth.uid() and public.is_active_user());

drop policy if exists "user_data: insert own" on public.user_data;
create policy "user_data: insert own" on public.user_data
  for insert to authenticated with check (user_id = auth.uid() and public.is_active_user());

drop policy if exists "user_data: update own" on public.user_data;
create policy "user_data: update own" on public.user_data
  for update to authenticated
  using (user_id = auth.uid() and public.is_active_user())
  with check (user_id = auth.uid() and public.is_active_user());

drop policy if exists "admin_audit: admin read" on public.admin_audit;
-- admin_audit ไม่มี policy สำหรับ authenticated: อ่าน/เขียนได้เฉพาะ service_role ผ่าน API

-- ---------- RPC ----------
-- บันทึกเวลาเข้าใช้ล่าสุด และคืน profile ของผู้ใช้ปัจจุบัน
create or replace function public.record_login() returns public.profiles
language plpgsql security definer set search_path = public as $$
declare result public.profiles;
begin
  update public.profiles set last_login_at = now() where id = auth.uid() and status = 'active' returning * into result;
  if result.id is null then
    select * into result from public.profiles where id = auth.uid();
  end if;
  return result;
end;
$$;

-- เวอร์ชันก่อนหน้ามี RPC สำหรับแอดมิน ซึ่งถูกแทนที่ด้วย Express API
drop function if exists public.admin_manage_account(uuid, text, text);
drop function if exists public.is_admin();

revoke execute on function public.record_login() from public, anon;
grant execute on function public.record_login() to authenticated;
grant execute on function public.is_active_user() to authenticated;

-- ---------- ตั้งแอดมินคนแรก ----------
-- สมัครบัญชีผ่านหน้าเว็บก่อน แล้วรันคำสั่งนี้ใน SQL Editor โดยเปลี่ยนอีเมล:
-- update public.profiles set role = 'admin' where email = 'your-admin@example.com';
