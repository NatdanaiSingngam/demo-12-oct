export type Status = 'todo' | 'doing' | 'done';
export type Priority = 'low' | 'medium' | 'high';
export type Page = 'dashboard' | 'calendar' | 'tasks' | 'projects' | 'create' | 'detail' | 'notifications';
export interface DemoUser { id: string; name: string; email: string; role?: 'student' | 'admin'; status?: 'active' | 'suspended'; createdAt?: string; lastLoginAt?: string }
export interface Project { id: string; name: string; description: string; color: string; start: string; due: string; archived: boolean; createdAt: string }
export interface Task { id: string; projectId: string; title: string; status: Status; priority: Priority; start: string; end: string; due: string; reminderBase: 'start' | 'due'; reminderMinutes: number; remindAt: string; reminded: boolean }
export interface Notice { id: string; taskId: string; title: string; message: string; createdAt: string; read: boolean; simulated: boolean }
export interface Data { projects: Project[]; tasks: Task[]; notices: Notice[] }
export const COLORS = ['#41765c', '#7386bd', '#ce9b48', '#bd7a78', '#8b74ac', '#519d9f'];
export const STATUS_LABEL: Record<Status, string> = { todo: 'ยังไม่เริ่ม', doing: 'กำลังทำ', done: 'เสร็จแล้ว' };
export const PRIORITY_LABEL: Record<Priority, string> = { low: 'ต่ำ', medium: 'ปานกลาง', high: 'สูง' };
export const uid = () => crypto.randomUUID();
export const emptyData = (): Data => ({ projects: [], tasks: [], notices: [] });
export const today = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Bangkok', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
export function shiftDate(date: string, days: number) {
  const d = new Date(`${date}T12:00:00+07:00`); d.setUTCDate(d.getUTCDate() + days);
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Bangkok', year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
}
export function inputTime(iso: string) {
  if (!iso) return '';
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Bangkok', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date(iso));
  const part = (type: string) => parts.find(p => p.type === type)?.value;
  return `${part('year')}-${part('month')}-${part('day')}T${part('hour')}:${part('minute')}`;
}
export const toISO = (value: string) => value ? new Date(`${value}:00+07:00`).toISOString() : '';
export const datePart = (iso: string) => iso ? inputTime(iso).slice(0, 10) : '';
export function dateLabel(value: string, full = false) {
  if (!value) return 'ยังไม่กำหนด';
  return new Intl.DateTimeFormat('th-TH', { timeZone: 'Asia/Bangkok', day: 'numeric', month: full ? 'long' : 'short', ...(full ? { year: 'numeric' } : {}) }).format(new Date(value.length === 10 ? `${value}T12:00:00+07:00` : value));
}
export const timeLabel = (value: string) => value ? new Intl.DateTimeFormat('th-TH', { timeZone: 'Asia/Bangkok', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(new Date(value)) : '';
export const overdue = (task: Task) => task.status !== 'done' && !!task.due && new Date(task.due).getTime() < Date.now();
export const progress = (tasks: Task[]) => tasks.length ? Math.round(tasks.filter(t => t.status === 'done').length / tasks.length * 100) : 0;
export function updateReminder(task: Task): Task {
  const base = task.reminderBase === 'start' ? task.start : task.due;
  return { ...task, remindAt: task.reminderMinutes >= 0 && base && task.status !== 'done' ? new Date(new Date(base).getTime() - task.reminderMinutes * 60000).toISOString() : '', reminded: false };
}
export function makeNotice(task: Task, simulated = false): Notice {
  return { id: uid(), taskId: task.id, title: task.title, message: `${task.reminderBase === 'start' ? 'ถึงเวลาเตรียมเริ่มงาน' : 'งานใกล้ถึงกำหนดส่ง'}${task.reminderBase === 'start' && task.start ? ` · ${timeLabel(task.start)} น.` : task.due ? ` · ${dateLabel(task.due)} ${timeLabel(task.due)} น.` : ''}`, createdAt: new Date().toISOString(), read: false, simulated };
}
export function seedData(): Data {
  const day = today();
  const projects: Project[] = [
    { id: 'p-se', name: 'ProjectRecord · SE Project', description: 'ระบบวางแผนโปรเจ็คสำหรับนักศึกษา เตรียมเดโมและนำเสนอในวิชา Software Engineering', color: COLORS[0], start: shiftDate(day, -7), due: shiftDate(day, 7), archived: false, createdAt: new Date().toISOString() },
    { id: 'p-ux', name: 'ออกแบบ Portfolio', description: 'รวบรวมผลงานและออกแบบเว็บไซต์ส่วนตัว', color: COLORS[1], start: shiftDate(day, -3), due: shiftDate(day, 12), archived: false, createdAt: new Date().toISOString() },
    { id: 'p-data', name: 'Data Science Assignment', description: 'วิเคราะห์ชุดข้อมูลและสรุปผลการทดลอง', color: COLORS[2], start: shiftDate(day, -5), due: shiftDate(day, 4), archived: false, createdAt: new Date().toISOString() }
  ];
  const specs: [string, string, Status, Priority, number, string, string, number][] = [
    ['p-se', 'ออกแบบหน้าปฏิทินและ To-do list', 'doing', 'high', 0, '13:00', '15:00', 1],
    ['p-se', 'เชื่อมข้อมูลระหว่างหน้าจอ', 'todo', 'high', 1, '10:00', '12:00', 2],
    ['p-se', 'เตรียมสไลด์นำเสนอเดโม', 'todo', 'medium', 3, '14:00', '16:00', 5],
    ['p-se', 'วิเคราะห์ความต้องการผู้ใช้', 'done', 'medium', -3, '10:00', '12:00', -2],
    ['p-ux', 'รวบรวมผลงานที่ต้องการนำเสนอ', 'done', 'low', -2, '09:00', '11:00', -1],
    ['p-ux', 'ออกแบบหน้าแนะนำตัว', 'todo', 'medium', 0, '16:00', '17:30', 3],
    ['p-ux', 'จัดทำต้นแบบหน้ารวมผลงาน', 'todo', 'medium', 4, '09:00', '11:00', 8],
    ['p-data', 'ตรวจสอบและทำความสะอาดข้อมูล', 'todo', 'high', -1, '10:00', '12:00', -1],
    ['p-data', 'สร้างกราฟและสรุปผลการวิเคราะห์', 'todo', 'high', 2, '13:00', '15:00', 3],
    ['p-data', 'เลือกชุดข้อมูลสำหรับทดลอง', 'done', 'low', -4, '14:00', '15:00', -3]
  ];
  const tasks = specs.map(([projectId, title, status, priority, offset, start, end, deadline], index) => updateReminder({ id: `t-${index}`, projectId, title, status, priority, start: toISO(`${shiftDate(day, offset)}T${start}`), end: toISO(`${shiftDate(day, offset)}T${end}`), due: toISO(`${shiftDate(day, deadline)}T17:00`), reminderBase: 'start', reminderMinutes: 10, remindAt: '', reminded: false }));
  // Sample tasks in the past should not create a burst of old reminders on first launch.
  tasks.forEach(t => { if (t.remindAt && new Date(t.remindAt).getTime() < Date.now()) t.reminded = true; });
  return { projects, tasks, notices: [] };
}
export const DATA_PREFIX = 'projectrecord.demo.v1.';
export function loadData(user: DemoUser): Data {
  try {
    const raw = localStorage.getItem(DATA_PREFIX + user.id);
    if (!raw) return user.id === 'demo-user' ? seedData() : emptyData();
    const data = JSON.parse(raw);
    if (!Array.isArray(data.projects) || !Array.isArray(data.tasks) || !Array.isArray(data.notices)) throw new Error('invalid data');
    return data;
  } catch { throw new Error('อ่านข้อมูลเดโมไม่ได้ กรุณาตรวจพื้นที่จัดเก็บของเบราว์เซอร์'); }
}
