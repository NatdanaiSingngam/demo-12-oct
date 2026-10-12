# The Project Record — สารบัญโปรเจ็ค

ทีม 04 (sec 2) · วิชา Software Engineering · ระบบบันทึกการทำโปรเจ็ค **ProjectRecord**

> **หมายเหตุ:** ไฟล์นี้เป็นสารบัญของโปรเจ็คทั้งหมดของทีม (repo ทีมเป็น private) repo นี้เก็บเฉพาะส่วนเดโม (`demo/` และ `.github/workflows/deploy.yml`) ลิงก์ในหมวดอื่นที่ชี้ไปยังไฟล์ซึ่งไม่ได้อยู่ใน repo นี้จะเปิดไม่ได้

| ลิงก์ | รายละเอียด |
|---|---|
| 🌐 [demo-12-oct.vercel.app](https://demo-12-oct.vercel.app/) | เว็บเดโมที่ใช้งานจริง (React + Supabase + Express บน Vercel) |
| 💻 [repo นี้ (demo-12-oct)](https://github.com/NatdanaiSingngam/demo-12-oct) | โค้ดเต็มของเดโม |
| 📄 [ข้อตกลงการทำงานของทีม](#ways-of-working) | Ways of Working (อยู่ด้านล่างของไฟล์นี้) |

## สารบัญ

1. [ไฟล์ที่ root ของโปรเจ็ค](#s1)
2. [docs/ — เอกสารของโปรเจ็ค](#s2)
3. [demo/ — เดโม ProjectRecord](#s3)
4. [prototypes/ และ sprint1/ — ต้นแบบหน้าจอ Sprint 1](#s4)
5. [services/ และ docker/ — Stats Service](#s5)
6. [src/ และ tests/ — โค้ดและเทสต์ Python](#s6)
7. [labs/ และ feature/ — งานแล็บ](#s7)
8. [team/ — ข้อมูลสมาชิก](#s8)
9. [.github/ — PR template และ CI](#s9)

---

<a id="s1"></a>
## 1. ไฟล์ที่ root ของโปรเจ็ค

| ไฟล์ | คืออะไร |
|---|---|
| [README.md](README.md) | ไฟล์นี้: สารบัญโปรเจ็ค + ข้อตกลงการทำงานของทีม |
| [team.md](team.md) | รายชื่อและรหัสนิสิตของสมาชิกทีม 4 คน |
| [scoring.md](scoring.md) | ตารางคะแนนรายแล็บของทีม (อ้างอิง Gradebook และหลักฐาน PR) |
| [AI_USAGE.md](AI_USAGE.md) | บันทึกการใช้ Generative AI: ใช้เครื่องมืออะไร ให้ช่วยอะไร |
| [requirements.txt](requirements.txt) | dependency ของเทสต์ Python (`pytest`, `pytest-cov`, `hypothesis`) |
| [Dockerfile](Dockerfile) | สร้าง Docker image ของ Stats Service (multi-stage, `python:3.12-slim`) |
| [.dockerignore](.dockerignore) | ไฟล์ที่ไม่ถูกคัดลอกเข้า Docker image |
| [.gitignore](.gitignore) | ไฟล์ที่ไม่ขึ้น git (`.env`, `node_modules`, `dist`, `__pycache__` ฯลฯ) |
| [.coverage](.coverage) | ผลวัด test coverage (สร้างอัตโนมัติโดย `pytest-cov` ไม่ต้องแก้ด้วยมือ) |
| [.vscode/settings.json](.vscode/settings.json) | ตั้งค่า VS Code ของโปรเจ็ค (ตอนนี้แทบว่าง) |
| `se-sec2-team-04` | git บันทึกไว้เป็น submodule pointer เปล่า ๆ (ไม่มี `.gitmodules` โฟลเดอร์จึงว่างตอน clone) ไม่ได้ใช้งาน น่าจะเกิดจากการ add repo ซ้อนโดยไม่ตั้งใจ |

<a id="s2"></a>
## 2. docs/ — เอกสารของโปรเจ็ค

### เอกสารหลัก
| ไฟล์ | คืออะไร |
|---|---|
| [docs/project-proposal.md](docs/project-proposal.md) | ข้อเสนอโครงการ: theme, persona หลัก, value proposition, MoSCoW, ความเสี่ยง |
| [docs/definition-of-done.md](docs/definition-of-done.md) | เกณฑ์ที่ถือว่างานเสร็จ (review, acceptance criteria, ห้ามทำของเดิมพัง, เอกสาร, ลิงก์ Issue) |
| [docs/safety-net.md](docs/safety-net.md) | Safety Net: ฟังก์ชัน `calculate_goal_stats` ที่เลือกป้องกันด้วยเทสต์ |
| [docs/refactoring-journal.md](docs/refactoring-journal.md) | บันทึกการ refactor: code smell ที่เจอ และการใช้ AI ช่วย |

### docs/requirements/ — ความต้องการ
| ไฟล์ | คืออะไร |
|---|---|
| [user-stories.md](docs/requirements/user-stories.md) | User Story 8 เรื่อง (US-01 ถึง US-08) พร้อม Acceptance Criteria |
| [NFRs.md](docs/requirements/NFRs.md) | ความต้องการเชิงคุณภาพ (ความปลอดภัย ประสิทธิภาพ ฯลฯ) |
| [scenario1.md](docs/requirements/scenario1.md) | สถานการณ์ของพุฒิ: เช้าวันจันทร์กับงานที่กองเต็มหน้าจอ |
| [scenario2.md](docs/requirements/scenario2.md) | สถานการณ์ของอาจารย์: ข้อมูลขยะในระบบและการแจ้งเตือนกลางดึก |
| [scenario3.md](docs/requirements/scenario3.md) | สถานการณ์ของแอดมิน: คำถามด่วนจากผู้บริหารกับตัวเลขที่ต้องรู้เดี๋ยวนี้ |
| [personas/persona1.md](docs/requirements/personas/persona1.md) | Persona พุฒิ (นิสิต / ผู้ใช้หลัก) |
| [personas/persona2.md](docs/requirements/personas/persona2.md) | Persona ดร.ศรัณย์ (อาจารย์ / ผู้ดูแลโครงการ) |
| [personas/persona3.md](docs/requirements/personas/persona3.md) | Persona ภัทรพล (System Admin) |
| [personas/img/](docs/requirements/personas/img) | รูปประกอบ persona |

### docs/architecture/ — สถาปัตยกรรม
| ไฟล์ | คืออะไร |
|---|---|
| [README.md](docs/architecture/README.md) | ภาพรวมสถาปัตยกรรมและไดอะแกรม C4 |
| [tech_stack.md](docs/architecture/tech_stack.md) | ตาราง tech stack และเหตุผลที่เลือก (React, Express, Supabase, Vercel) |
| [uml_models.md](docs/architecture/uml_models.md) | แม่แบบ UML / Use Case (ยังไม่ได้กรอก) |
| [c4-context.md](docs/architecture/c4-context.md) | C4 Level 1: System Context |
| [c4-container.md](docs/architecture/c4-container.md) | C4 Level 2: Container (Mermaid) |
| [diagrams/](docs/architecture/diagrams) | ภาพ PNG ของไดอะแกรม C4 ทั้งสองระดับ |
| [adr/0001-tech-stack-selection.md](docs/architecture/adr/0001-tech-stack-selection.md) | ADR เลือก tech stack หลัก (React, Node/Express, Supabase) |
| [adr/0001-monolith-vs-microservices.md](docs/architecture/adr/0001-monolith-vs-microservices.md) | ADR อีกฉบับ (ชื่อไฟล์พูดถึง monolith vs microservices แต่เนื้อหาเป็นเรื่อง React + Tailwind SPA) |

### อื่น ๆ ใน docs/
| ไฟล์ | คืออะไร |
|---|---|
| [docs/reflections/](docs/reflections) | บันทึกสะท้อนการเรียนรายคน (4 ไฟล์) |
| [docs/testing/readme.md](docs/testing/readme.md) | ที่เก็บ Test Case / Test Report (ยังเป็นไฟล์เปล่า) |

<a id="s3"></a>
## 3. demo/ — เดโม ProjectRecord

ระบบวางแผนโปรเจ็ค งาน ปฏิทิน และการแจ้งเตือน มีบัญชีผู้ใช้และแอดมิน (React + Vite + Tailwind, Supabase Auth/RLS, Express API บน Vercel)

🌐 **ใช้งานจริง:** https://demo-12-oct.vercel.app/ · คู่มือติดตั้งและ deploy: [demo/README.md](demo/README.md)

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

<a id="s4"></a>
## 4. prototypes/ และ sprint1/ — ต้นแบบหน้าจอ Sprint 1

| ไฟล์ | คืออะไร |
|---|---|
| [prototypes/sprint1/](prototypes/sprint1) | ต้นแบบหน้าจอ Sprint 1 (HTML/CSS/JS): GoalTrack, หน้าแจ้งเตือนการทำงานล่วงเวลาอัจฉริยะ (พร้อม wireframe), หน้าภาพรวมโปรเจ็ค |
| [sprint1/](sprint1) | ต้นแบบหน้า Time Tracker Insight (HTML/CSS/JS) |

<a id="s5"></a>
## 5. services/ และ docker/ — Stats Service

| ไฟล์ | คืออะไร |
|---|---|
| [services/stats-service/app.py](services/stats-service/app.py) | API ด้วย FastAPI: `POST /api/stats` คำนวณจำนวนเป้าหมายที่สำเร็จและ % ความคืบหน้า, `GET /` แสดงหน้าเว็บ |
| [services/stats-service/Dockerfile](services/stats-service/Dockerfile) | Dockerfile ของ service นี้ |
| [services/stats-service/requirements.txt](services/stats-service/requirements.txt) | dependency ของ service |
| [docker/README.md](docker/README.md) | บันทึกการตั้งค่า Docker: ชื่อ image, base image, ขนาด, registry |

<a id="s6"></a>
## 6. src/ และ tests/ — โค้ดและเทสต์ Python

| ไฟล์ | คืออะไร |
|---|---|
| [src/calc.py](src/calc.py) | `calculate_discount` และ `calculate_total` (ตัวอย่างฝึกเขียนเทสต์) |
| [src/email_service.py](src/email_service.py) | `EmailService` และ `send_welcome_email` (ฝึก test double) |
| [src/fizzbuzz.py](src/fizzbuzz.py) | ฟังก์ชัน `fizzbuzz` (ฝึก TDD) |
| [src/store.py](src/store.py) | `User` และ `FakeDB` (ฐานข้อมูลจำลอง) |
| [src/__init__.py](src/__init__.py), [tests/__init__.py](tests/__init__.py) | ไฟล์ว่างที่ทำให้ `src/` และ `tests/` เป็น Python package (import ข้ามกันได้) |
| [tests/test_unit.py](tests/test_unit.py) | unit test ของ `calculate_discount` (7 เทสต์) |
| [tests/test_fizzbuzz.py](tests/test_fizzbuzz.py) | เทสต์ `fizzbuzz` (4 เทสต์) |
| [tests/test_property.py](tests/test_property.py) | property-based test ด้วย Hypothesis กับ `calculate_discount` และ `fizzbuzz` (4 เทสต์) |
| [tests/test_doubles.py](tests/test_doubles.py) | เทสต์ที่ใช้ test double (3 เทสต์) |
| [tests/test_goal_stats.py](tests/test_goal_stats.py) | เทสต์ของ Stats Service (6 เทสต์) |

<a id="s7"></a>
## 7. labs/ และ feature/ — งานแล็บ

| ไฟล์ | คืออะไร |
|---|---|
| [labs/lab12b-sample-starter/](labs/lab12b-sample-starter) | Lab 12B Safety Net Sprint (ตัวอย่าง Campus Eats): [README](labs/lab12b-sample-starter/README.md), [pytest.ini](labs/lab12b-sample-starter/pytest.ini), [src/calc.py](labs/lab12b-sample-starter/src/calc.py), [tests/test_calc.py](labs/lab12b-sample-starter/tests/test_calc.py) (10 เทสต์), [docs/safety-net.md](labs/lab12b-sample-starter/docs/safety-net.md) |
| [feature/exit-ticket-4/reflect7.md](feature/exit-ticket-4/reflect7.md) | Exit ticket 7.1 Duplication Hunt: หา code ซ้ำ 3 ประเภท |
| [feature/exit-ticket-4/lab7-refactor-Procedural-Duplication](feature/exit-ticket-4/lab7-refactor-Procedural-Duplication) | ไฟล์ประกอบ Lab 7 (ขนาด 0 ไบต์ ยังเป็นไฟล์เปล่า) |

<a id="s8"></a>
## 8. team/ — ข้อมูลสมาชิก

| ไฟล์ | คืออะไร |
|---|---|
| [team/](team) | ข้อมูลและ Pragmatic Promise รายบุคคลของสมาชิก 4 คน (4 ไฟล์) |

<a id="s9"></a>
## 9. .github/ — PR template และ CI

| ไฟล์ | คืออะไร |
|---|---|
| [.github/pull_request_template.md](.github/pull_request_template.md) | แม่แบบ PR: What / Why / Pragmatic Promise / Reviewer / Checklist |
| [.github/workflows/ci.yml](.github/workflows/ci.yml) | CI บน PR และ push เข้า `main`: lint ด้วย ruff และรัน pytest ของ Stats Service และ Lab 12B |
| [.github/workflows/test.yml](.github/workflows/test.yml) | ทุก push/PR: `ruff check src/` แล้วรัน pytest พร้อมเกณฑ์ coverage อย่างน้อย 90% |
| [.github/workflows/readme.md](.github/workflows/readme.md) | โน้ตประจำโฟลเดอร์ workflows |

---

<a id="ways-of-working"></a>
# 🛠️ Team Ways of Working (ข้อตกลงในการทำงานร่วมกัน)

ยินดีต้อนรับสู่ทีมพัฒนาโปรเจกต์ **The project record (ระบบบันทึกการทำโปรเจ็ค)** เพื่อให้การทำงานร่วมกันเป็นไปได้อย่างมีประสิทธิภาพ รวดเร็ว และลดความขัดแย้ง ทีมของเราจะยึดถือข้อตกลงร่วมกัน (Ways of Working) ดังต่อไปนี้:

---

## 1. Meeting Cadence (วงรอบการประชุม)
เพื่อให้ทีมมีทิศทางเดียวกันและคุมเวลาการส่งมอบได้ เราจะใช้กรอบการทำงานแบบ Agile (Scrum/Kanban) แบบยืดหยุ่น โดยกำหนดการประชุมรายสัปดาห์ดังนี้:

*   **Weekly Sprint Planning & Review :**
    *   **เป้าหมาย:** รีวิวเดโมงานที่ทำเสร็จในสัปดาห์ที่ผ่านมา และวางแผนงาน (Sprint Planning) สำหรับสัปดาห์ถัดไป รวมถึงแจกจ่ายงานลงบน Kanban Board (GitHub Projects/Trello)
*   **Mid-week Sync :**
    *   *ทดแทน Daily Stand-up ด้วยการนัดคุยสั้น ๆ กลางสัปดาห์*
    *   **เป้าหมาย:** สมาชิกทุกคนตอบคำถาม 3 ข้อ: 
        1. ทำอะไรเสร็จไปแล้วบ้าง?
        2. จะทำอะไรต่อ?
        3. เจอปัญหาอะไรที่ต้องการความช่วยเหลือไหม (Blockers)?
*   **Sprint Retrospective  :**
    *   **เป้าหมาย:** สะท้อนการทำงานร่วมกัน (อะไรที่ทำได้ดี, อะไรที่เป็นปัญหา, และเราจะปรับปรุงกระบวนการทำงานร่วมกันในสัปดาห์หน้าอย่างไร)

---

## 2. Communication Rules (หลักการสื่อสาร)
เราใช้ **[ระบุชื่อแอปพลิเคชัน เช่น Discord / Teams / Messenger]** เป็นช่องทางหลักในการสื่อสาร โดยมีกฎร่วมกันดังนี้:

*   **Public Over Private (เน้นคุยในห้องสาธารณะ):** หลีกเลี่ยงการคุยงานผ่าน DM (Direct Message) ส่วนตัว ให้ถาม-ตอบในห้องพิมพ์รวม (เช่น #dev, #design, #general) เพื่อให้ทุกคนในทีมรับรู้สถานะของงานและเรียนรู้ไปพร้อมกัน
*   **Thread-focused (ใช้ Threads ในการคุยเฉพาะเรื่อง):** หากคุยเรื่องเฉพาะเจาะจง (เช่น บั๊กหน้า Dashboard, การเชื่อมต่อ Database API) ให้สร้าง Thread ใต้ข้อความนั้น ๆ เสมอ เพื่อไม่ให้ข้อความอื่นโดนดันหาย
*   **Response Time Expectations (เวลาในการตอบกลับ):**
    *   **วันธรรมดา (จันทร์ - ศุกร์):** คาดหวังการตอบกลับภายใน **12 ชั่วโมง**
    *   **วันหยุด (เสาร์ - อาทิตย์) หรือวันใกล้ส่งเดโม:** คาดหวังการตอบกลับภายใน **4 ชั่วโมง**
    *   *หมายเหตุ: หากใครติดภารกิจ/ติดเรียน/สอบ ให้ส่งสติกเกอร์หรือแจ้งไว้ล่วงหน้าในช่องทางรวม*

---

## 3. Git Workflow (กระบวนการจัดการโค้ด)
เพื่อไม่ให้โค้ดพังและทำงานทับซ้อนกัน เราจะใช้ระบบ **Git Feature Branching Workflow** อย่างเคร่งครัด:

*   **Branching Strategy:**
    *   `main` (หรือ `master`): เก็บโค้ดที่เสถียรที่สุดและพร้อมใช้งาน/เดโมเท่านั้น ห้าม Commit โค้ดตรงไปยัง Branch นี้เด็ดขาด
    *   `develop` (ถ้ามี): โค้ดที่รวมฟีเจอร์ต่าง ๆ เพื่อรอการทดสอบ
    *   `feature/<feature-name>`: แตกออกจาก `develop` หรือ `main` เพื่อพัฒนาฟีเจอร์ย่อย (เช่น `feature/sleep-tracker-api`, `feature/ui-dashboard`)
*   **Pull Request (PR) & Code Review Rules:**
    *   ห้าม Merge โค้ดของตัวเองเข้าสู่ `main` โดยตรงเด็ดขาด
    *   การจะ Merge ได้ ต้องสร้าง Pull Request และต้องได้รับ **Approve อย่างน้อย 1 คน** จากเพื่อนร่วมทีมหลังจากทำ Code Review
    *   ผู้รีวิวต้องตักเตือนด้วยความสุภาพ และแนะนำแนวทางแก้ไขหากพบข้อผิดพลาด

---

## 4. Decision Making (กระบวนการตัดสินใจ)
เมื่อมีความเห็นที่แตกต่างกันในด้านเทคนิค (เช่น การเลือกฐานข้อมูล) หรือด้านการออกแบบ (เช่น โทนสีของ Dashboard) เราใช้หลักการดังนี้เรียงตามลำดับ:

1.  **Consensus (ความเห็นพ้องต้องกัน):** พูดคุย แลกเปลี่ยนข้อดี-ข้อเสีย (Pros & Cons) และหาจุดร่วมที่ทุกคนยอมรับได้เป็นอันดับแรก
2.  **Time-boxed Debate (จำกัดเวลาถกเถียง):** หากไม่สามารถหาข้อสรุปได้ภายใน 15 นาที ให้จำกัดเวลาและหาข้อมูลอ้างอิงทางเทคนิคมาประกอบ
3.  **Democratic Vote (การลงคะแนนเสียง):** หากเสียงยังแตก ให้ทำการโหวตโดยยึดเสียงข้างมาก (Majority Vote) เป็นข้อยุติ
4.  **Escalation to Role Lead (ให้สิทธิ์การตัดสินใจขั้นสุดท้าย):** ในกรณีที่ผลโหวตเสมอกัน ให้สิทธิ์ขาดในการตัดสินใจอยู่ที่ผู้รับผิดชอบบทบาทหลักในเรื่องนั้น ๆ เช่น
    *   เรื่องสถาปัตยกรรมระบบ/โค้ด -> ตัดสินใจโดย **Tech Lead [หรือระบุชื่อเพื่อน]**
    *   เรื่องหน้าตาและการใช้งาน UI/UX -> ตัดสินใจโดย **Design Lead [หรือระบุชื่อเพื่อน]**

---
ข้อตกลงนี้สามารถปรับปรุงได้เสมอในเซสชัน Sprint Retrospective ของทีม เพื่อให้เหมาะสมกับสไตล์การทำงานจริงของเราในระยะยาว 🚀
