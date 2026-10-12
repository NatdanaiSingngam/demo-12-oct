# ProjectRecord Demo

เดโมระบบวางแผนโปรเจ็ค งาน ปฏิทิน และการแจ้งเตือน พร้อมระบบบัญชีผู้ใช้และแอดมิน

🌐 **เว็บที่ใช้งานจริง:** https://demo-12-oct.vercel.app/

โค้ดทั้งหมดอยู่ในโฟลเดอร์ `demo/` รายละเอียดการตั้งค่าและการรันอยู่ที่ [demo/README.md](demo/README.md)

## สารบัญ

### โค้ดหน้าเว็บ (React + Vite + Tailwind)
| ไฟล์ | หน้าที่ |
|---|---|
| [demo/src/main.tsx](demo/src/main.tsx) | จุดเริ่มต้นของแอป โหลดฟอนต์และ CSS |
| [demo/src/App.tsx](demo/src/App.tsx) | หน้าจอหลักของผู้ใช้งาน: ภาพรวม, ปฏิทิน, To-do, โปรเจ็ค, แจ้งเตือน, สมัคร/เข้าสู่ระบบ |
| [demo/src/AdminApp.tsx](demo/src/AdminApp.tsx) | หน้าจอแอดมิน: ภาพรวมระบบ, จัดการผู้ใช้, ประวัติการจัดการ |
| [demo/src/Profile.tsx](demo/src/Profile.tsx) | หน้าโปรไฟล์: แก้ชื่อ อีเมล และเปลี่ยนรหัสผ่าน |
| [demo/src/model.ts](demo/src/model.ts) | ชนิดข้อมูล วันที่ การคำนวณความคืบหน้า และตรรกะการแจ้งเตือน |
| [demo/src/accounts.ts](demo/src/accounts.ts) | บัญชีในเครื่อง (โหมดเดโม localStorage) บทบาท และประวัติการจัดการ |
| [demo/src/cloud.ts](demo/src/cloud.ts) | เชื่อมต่อ Supabase: Auth, อ่าน/บันทึกข้อมูล, เรียก API แอดมิน |
| [demo/src/ui.ts](demo/src/ui.ts) | ชุด class Tailwind ที่ใช้ซ้ำ (ปุ่ม, การ์ด, badge, sidebar, modal) |
| [demo/src/index.css](demo/src/index.css) | ธีมสี ฟอนต์ breakpoint ของ Tailwind v4 |
| [demo/src/vite-env.d.ts](demo/src/vite-env.d.ts) | ชนิดของตัวแปรสภาพแวดล้อม `VITE_*` |
| [demo/index.html](demo/index.html) | หน้า HTML หลักและ metadata |
| [demo/public/favicon.svg](demo/public/favicon.svg) | ไอคอนของเว็บ |

### Backend API (Express บน Vercel)
| ไฟล์ | หน้าที่ |
|---|---|
| [demo/server/app.ts](demo/server/app.ts) | API แอดมิน: ดูข้อมูลทั้งหมด ระงับ/เปิดใช้ เปลี่ยนบทบาท ลบบัญชี ตรวจ token และสิทธิ์ทุกครั้ง |
| [demo/server/dev.ts](demo/server/dev.ts) | รัน API ในเครื่องที่พอร์ต 3001 (`npm run dev:api`) |
| [demo/api/index.ts](demo/api/index.ts) | จุดเข้าของ Vercel Function ส่งต่อไปที่ `server/app.ts` |
| [demo/vercel.json](demo/vercel.json) | ตั้งค่า build และส่ง `/api/*` ไปที่ฟังก์ชัน |

### ฐานข้อมูลและความปลอดภัย (Supabase)
| ไฟล์ | หน้าที่ |
|---|---|
| [demo/supabase/schema.sql](demo/supabase/schema.sql) | สร้างตาราง `profiles`, `user_data`, `admin_audit`, RLS policy, trigger สร้างโปรไฟล์อัตโนมัติ และฟังก์ชันแก้ชื่อ |

### การทดสอบ
| ไฟล์ | หน้าที่ |
|---|---|
| [demo/server/app.test.ts](demo/server/app.test.ts) | ทดสอบ API แอดมิน 17 ข้อ (ใช้ฐานข้อมูลจำลอง รันได้โดยไม่ต้องมี Supabase) |
| [demo/tests/demo.spec.ts](demo/tests/demo.spec.ts) | ทดสอบ end-to-end ของผู้ใช้งาน (Playwright) |
| [demo/tests/admin.spec.ts](demo/tests/admin.spec.ts) | ทดสอบ end-to-end ของแอดมินและโปรไฟล์ (Playwright) |
| [demo/tests/capture.mjs](demo/tests/capture.mjs) | สคริปต์บันทึกภาพหน้าจอเพื่อเทียบดีไซน์ |
| [demo/playwright.config.ts](demo/playwright.config.ts) | ตั้งค่า Playwright (ใช้ Chrome, ภาษาไทย, เขตเวลา Asia/Bangkok) |

### ตั้งค่าโปรเจ็คและการ deploy
| ไฟล์ | หน้าที่ |
|---|---|
| [demo/package.json](demo/package.json) | รายการ dependency และสคริปต์ (`dev`, `build`, `test`, `dev:api`, `test:api`) |
| [demo/package-lock.json](demo/package-lock.json) | ล็อกเวอร์ชัน dependency (npm สร้างอัตโนมัติ) |
| [demo/tsconfig.json](demo/tsconfig.json) | ตั้งค่า TypeScript |
| [demo/vite.config.ts](demo/vite.config.ts) | ตั้งค่า Vite, Tailwind และ proxy `/api` ไปที่ API ในเครื่อง |
| [demo/.env.example](demo/.env.example) | ตัวอย่างตัวแปรสภาพแวดล้อม (ช่องว่างทั้งหมด ไม่มี key จริง) |
| [demo/.gitignore](demo/.gitignore) | ไฟล์ที่ไม่ควรขึ้น git เช่น `.env.local`, `node_modules`, `.vercel` |
| [demo/README.md](demo/README.md) | คู่มือเต็ม: ติดตั้ง รันในเครื่อง ตั้งค่า Supabase และ deploy |
| [demo/deploy/github-pages.yml](demo/deploy/github-pages.yml) | ต้นฉบับ workflow ของ GitHub Pages (ถูกคัดลอกไปที่ `.github/workflows/`) |
| [.github/workflows/deploy.yml](.github/workflows/deploy.yml) | workflow ที่รันจริง: build และ deploy ไป GitHub Pages ทุกครั้งที่ push `main` |

## เริ่มต้นอย่างรวดเร็ว

```powershell
cd demo
npm.cmd install
npm.cmd run dev        # หน้าเว็บที่ http://127.0.0.1:5173
```

รันโหมดเดโมได้ทันที ไม่ต้องมี Supabase เมื่อต้องการโหมดที่เชื่อม Supabase ให้ดู [demo/README.md](demo/README.md)
