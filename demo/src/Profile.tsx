import { useState, type FormEvent } from 'react';
import { Check, KeyRound, UserRound } from 'lucide-react';
import { ADMIN_USER, DEMO_USER, updateLocalProfile } from './accounts';
import { changeMyEmail, changeMyPassword, cloudMode, updateMyName } from './cloud';
import { ROLE_LABEL, dateLabel, timeLabel, type DemoUser } from './model';
import * as ui from './ui';

type Msg = { ok: boolean; text: string } | null;
const SUCCESS = 'mb-4.25 rounded-lg border border-[#d5e5c8] bg-[#f1f7ea] px-3.5 py-3 text-14 leading-[1.8] text-[#4f6b40]';
const notice = (m: Msg) => m && <div role={m.ok ? 'status' : 'alert'} className={m.ok ? SUCCESS : ui.formError}>{m.text}</div>;
const EMAIL = /^\S+@\S+\.\S+$/;

function Card({ icon, title, hint, children }: { icon: React.ReactNode; title: string; hint?: string; children: React.ReactNode }) {
  return <section className={ui.panel}><div className={ui.sectionHeading()}><div><h2 className={ui.sectionTitle}>{title}</h2>{hint && <p className={ui.sectionSub}>{hint}</p>}</div><span className={ui.sectionIcon}>{icon}</span></div><div className="px-5.75 pb-5.5 max-sm:px-5">{children}</div></section>;
}

/** Own-account settings shared by the user and admin areas: name, e-mail, and password. */
export default function Profile({ user, onUserChange, notify }: { user: DemoUser; onUserChange: (user: DemoUser) => void; notify: (message: string) => void }) {
  const [name, setName] = useState(user.name); const [email, setEmail] = useState(user.email); const [emailPassword, setEmailPassword] = useState('');
  const [infoMsg, setInfoMsg] = useState<Msg>(null); const [infoBusy, setInfoBusy] = useState(false);
  const [current, setCurrent] = useState(''); const [next, setNext] = useState(''); const [confirm, setConfirm] = useState('');
  const [pwMsg, setPwMsg] = useState<Msg>(null); const [pwBusy, setPwBusy] = useState(false);
  const builtin = !cloudMode && (user.id === DEMO_USER.id || user.id === ADMIN_USER.id);
  const cleanEmail = email.trim().toLowerCase(); const emailChanged = cleanEmail !== user.email.toLowerCase(); const nameChanged = name.trim() !== user.name;

  async function saveInfo(e: FormEvent) {
    e.preventDefault(); setInfoMsg(null);
    const cleanName = name.trim();
    if (!cleanName) { setInfoMsg({ ok: false, text: 'กรุณากรอกชื่อ' }); return; }
    if (!nameChanged && !emailChanged) { setInfoMsg({ ok: false, text: 'ยังไม่มีการเปลี่ยนแปลง' }); return; }
    if (emailChanged && !EMAIL.test(cleanEmail)) { setInfoMsg({ ok: false, text: 'รูปแบบอีเมลไม่ถูกต้อง' }); return; }
    if (emailChanged && cloudMode && !emailPassword) { setInfoMsg({ ok: false, text: 'กรุณากรอกรหัสผ่านปัจจุบันเพื่อยืนยันการเปลี่ยนอีเมล' }); return; }
    setInfoBusy(true);
    let latest = user; const done: string[] = [];
    try {
      if (!cloudMode) { latest = updateLocalProfile(user.id, { name: cleanName, email: cleanEmail }); done.push('บันทึกข้อมูลแล้ว'); }
      else {
        if (nameChanged) { latest = await updateMyName(cleanName); onUserChange(latest); done.push('เปลี่ยนชื่อแล้ว'); }
        if (emailChanged) {
          const result = await changeMyEmail(emailPassword, cleanEmail); latest = result.user; onUserChange(latest);
          done.push(result.applied ? 'เปลี่ยนอีเมลแล้ว ใช้อีเมลใหม่นี้เข้าสู่ระบบครั้งถัดไป' : `ส่งลิงก์ยืนยันไปที่ ${cleanEmail} แล้ว กรุณากดลิงก์ในอีเมลเพื่อเปลี่ยนอีเมลให้เสร็จ (ถ้าเปิดการยืนยันสองฝั่ง อาจต้องกดลิงก์ที่อีเมลเดิมด้วย) จนกว่าจะยืนยัน ยังใช้อีเมลเดิมอยู่`);
        }
      }
      onUserChange(latest); setName(latest.name); setEmail(latest.email); setEmailPassword('');
      setInfoMsg({ ok: true, text: done.join(' · ') }); notify('บันทึกโปรไฟล์แล้ว');
    } catch (error) {
      // A name change may already have been saved before the e-mail step failed.
      if (cloudMode && latest !== user) { setName(latest.name); setEmail(latest.email); }
      setInfoMsg({ ok: false, text: `${done.length ? done.join(' · ') + ' แต่ ' : ''}${error instanceof Error ? error.message : 'บันทึกไม่ได้'}` });
    } finally { setInfoBusy(false); }
  }

  async function savePassword(e: FormEvent) {
    e.preventDefault(); setPwMsg(null);
    if (next.length < 6) { setPwMsg({ ok: false, text: 'รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร' }); return; }
    if (next !== confirm) { setPwMsg({ ok: false, text: 'รหัสผ่านใหม่ทั้งสองช่องไม่ตรงกัน' }); return; }
    if (next === current) { setPwMsg({ ok: false, text: 'รหัสผ่านใหม่ต้องไม่เหมือนรหัสผ่านปัจจุบัน' }); return; }
    setPwBusy(true);
    try { await changeMyPassword(current, next); setCurrent(''); setNext(''); setConfirm(''); setPwMsg({ ok: true, text: 'เปลี่ยนรหัสผ่านแล้ว ใช้รหัสผ่านใหม่ในการเข้าสู่ระบบครั้งถัดไป' }); notify('เปลี่ยนรหัสผ่านแล้ว'); }
    catch (error) { setPwMsg({ ok: false, text: error instanceof Error ? error.message : 'เปลี่ยนรหัสผ่านไม่ได้' }); }
    finally { setPwBusy(false); }
  }

  const role = user.role || 'user';
  return <div className="grid max-w-[760px] gap-5.5">
    <section className={ui.panel}><div className="flex items-center gap-4 px-5.75 py-5 max-sm:flex-wrap max-sm:px-5">
      <span className="grid size-14 shrink-0 place-items-center rounded-full bg-tint-3 text-[1.4rem] text-[#738652]">{user.name.slice(0, 1)}</span>
      <div className="min-w-0 flex-1"><strong className="block truncate text-[1.05rem] font-medium">{user.name}</strong><small className="block truncate text-13 text-muted">{user.email}</small></div>
      <div className="flex flex-wrap items-center gap-2"><span className={ui.badge(role === 'admin' ? 'doing' : 'todo')}>{ROLE_LABEL[role]}</span><span className={ui.badge('done')}>พร้อมใช้งาน</span></div>
    </div>{(user.createdAt || user.lastLoginAt) && <div className="flex flex-wrap gap-x-8 gap-y-1 border-t border-[#f0f2ec] px-5.75 py-3.25 text-12 text-muted max-sm:px-5">{user.createdAt && <span>สมัครเมื่อ {dateLabel(user.createdAt, true)}</span>}{user.lastLoginAt && <span>เข้าใช้ล่าสุด {dateLabel(user.lastLoginAt)} {timeLabel(user.lastLoginAt)} น.</span>}</div>}</section>

    <Card icon={<UserRound size={20} />} title="ข้อมูลส่วนตัว" hint="เปลี่ยนชื่อที่แสดงและอีเมลที่ใช้เข้าสู่ระบบ">
      <form onSubmit={saveInfo}>
        <label>ชื่อ <span className="text-[#856a4e]">*</span><input value={name} onChange={e => setName(e.target.value)} maxLength={80} autoComplete="name" required /></label>
        <label>อีเมล <span className="text-[#856a4e]">*</span><input type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" disabled={builtin} required />{builtin && <small className="mt-1.5 block">บัญชีตัวอย่างหลักเปลี่ยนอีเมลไม่ได้</small>}</label>
        {cloudMode && emailChanged && <label>รหัสผ่านปัจจุบัน <span className="text-[#856a4e]">*</span><small>ต้องกรอกเมื่อเปลี่ยนอีเมล</small><input type="password" value={emailPassword} onChange={e => setEmailPassword(e.target.value)} autoComplete="current-password" /></label>}
        {notice(infoMsg)}
        <button className={ui.btn('primary')} disabled={infoBusy}><Check size={17} /> บันทึกข้อมูล</button>
      </form>
    </Card>

    {cloudMode ? <Card icon={<KeyRound size={20} />} title="เปลี่ยนรหัสผ่าน" hint="ต้องกรอกรหัสผ่านปัจจุบันเพื่อยืนยันตัวตน">
      <form onSubmit={savePassword}>
        <label>รหัสผ่านปัจจุบัน<input type="password" value={current} onChange={e => setCurrent(e.target.value)} autoComplete="current-password" required /></label>
        <label>รหัสผ่านใหม่<small>อย่างน้อย 6 ตัวอักษร</small><input type="password" value={next} onChange={e => setNext(e.target.value)} autoComplete="new-password" minLength={6} required /></label>
        <label>ยืนยันรหัสผ่านใหม่<input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} autoComplete="new-password" minLength={6} required /></label>
        {notice(pwMsg)}
        <button className={ui.btn('primary')} disabled={pwBusy}><KeyRound size={17} /> เปลี่ยนรหัสผ่าน</button>
      </form>
    </Card> : <Card icon={<KeyRound size={20} />} title="รหัสผ่าน"><p className="text-14 leading-[1.8] text-[#69705f]">โหมดเดโมไม่มีรหัสผ่านจริง (ไม่เก็บและไม่ตรวจรหัสผ่าน) จึงไม่มีส่วนเปลี่ยนรหัสผ่าน ฟีเจอร์นี้ใช้ได้เมื่อเชื่อมต่อ Supabase</p></Card>}
  </div>;
}
