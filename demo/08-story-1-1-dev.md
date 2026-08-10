[⬅ Bước trước](./07-story-1-1-sm.md) · [Chỉ mục](./README.md) · [Bước sau ➡](./09-story-1-1-qa.md)

# Bước 8 — Dev triển khai Story 1.1

> ⚠️ **MỞ CHAT MỚI.** Không dùng lại chat của SM.

## Lệnh

```text
👤 Bạn: @dev
```

## Agent nạp gì — chú ý sự khác biệt

```text
🤖 [STEP 1] Đọc toàn bộ .bmad-core/agents/dev.md
   [STEP 2] Nhập vai James — Full Stack Developer
   [STEP 3] Nạp .bmad-core/core-config.yaml
   [CRITICAL] Nạp toàn bộ file trong devLoadAlwaysFiles:
       ✓ docs/architecture/coding-standards.md            (48 dòng)
       ✓ docs/architecture/tech-stack.md                  (32 dòng)
       ✓ docs/architecture/unified-project-structure.md   (41 dòng)
```

**Chỉ 3 file + core-config + agent file.** Dev **không** nạp `prd.md`, **không** nạp `architecture.md`, **không** nạp `front-end-spec.md`.

⚙️ **Cơ chế** — nguyên tắc CRITICAL trong `dev.md`:

> *"Story has ALL info you will need aside from what you loaded during the startup commands. **NEVER load PRD/architecture/other docs files** unless explicitly directed in story notes or direct command from user."*

Đây là toàn bộ lý do bước 7 phải làm kỹ. Nếu Dev phải đi đọc kiến trúc, story đã thất bại.

### Agent chào

```text
🤖 Xin chào, tôi là James 💻 — Full Stack Developer.

   Đã nạp: core-config.yaml + 3 file devLoadAlwaysFiles.

   Các lệnh khả dụng:
     1. *help
     2. *develop-story   — triển khai story
     3. *explain         — giảng lại vừa làm gì và tại sao
     4. *review-qa       — áp fix từ kết quả QA
     5. *run-tests       — chạy lint + test
     6. *exit

   Chọn số hoặc gõ lệnh.
```

Rồi **HALT**.

---

## Triển khai

```text
👤 Bạn: *develop-story docs/stories/1.1.khoi-tao-du-an-va-pipeline.md
```

*(Bạn có thể dán luôn nội dung story vào chat để tiết kiệm thời gian agent tra cứu — `bmad-kb.md` khuyên vậy.)*

```text
🤖 Đã đọc story. Status: Approved ✓ (không phải Draft ⇒ được phép bắt đầu)

   Tôi sẽ theo order-of-execution: đọc task → implement → viết test →
   chạy validation → CHỈ KHI tất cả pass thì tick [x] → cập nhật File List → lặp.

   ─── Task 1: Khởi tạo dự án Next.js (AC: 1) ───
```

### Vòng lặp Task 1

```text
🤖 $ npx create-next-app@14.2 . --ts --tailwind --app --eslint
   ✓ Đã tạo dự án

   Sửa app/page.tsx:
   ```tsx
   export default function Home() {
     return (
       <main className="flex min-h-screen items-center justify-center">
         <h1 className="text-4xl font-bold">ChiTieu</h1>
       </main>
     );
   }
   ```

   $ npm run dev
   ✓ ready on http://localhost:3000 — hiển thị "ChiTieu"

   Validation: AC1 đạt.
   ✓ Tick Task 1 → [x]
   ✓ Cập nhật File List: app/page.tsx, app/layout.tsx, package.json, ...

   ─── Task 2: Thiết lập validate biến môi trường (AC: 6) ───

   Theo coding standards luật #1: "Không truy cập process.env trực tiếp —
   luôn qua lib/env.ts (đã validate bằng Zod)."

   lib/env.ts:
   ```ts
   import { z } from 'zod';

   const envSchema = z.object({
     NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
     NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
   });

   export type Env = z.infer<typeof envSchema>;

   export function parseEnv(raw: NodeJS.ProcessEnv = process.env): Env {
     const result = envSchema.safeParse(raw);
     if (!result.success) {
       const missing = result.error.issues.map((i) => i.path.join('.')).join(', ');
       throw new Error(`Biến môi trường không hợp lệ hoặc thiếu: ${missing}`);
     }
     return result.data;
   }

   export const env = parseEnv();
   ```

   .env.example:
   ```text
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

   Story yêu cầu 3 test case (1 hợp lệ, 2 sai) — viết ở Task 4.

   ⏸ CHƯA tick Task 2 vì test chưa viết. Theo order-of-execution, chỉ tick
     khi implement + test + validation đều pass.
```

⚙️ **Cơ chế**: Dev **không** tick checkbox sớm. Thứ tự bắt buộc là *implement → viết test → chạy validation → chỉ khi TẤT CẢ pass mới tick*.

### Task 3–5

```text
🤖 ─── Task 3: Cấu hình lint zero-warning (AC: 2) ───
   package.json: "lint": "next lint --max-warnings=0"
   $ npm run lint
   ✗ 2 cảnh báo: unused import trong app/layout.tsx
   → Đã sửa
   $ npm run lint
   ✓ 0 lỗi, 0 cảnh báo
   ✓ Tick Task 3

   ─── Task 4: Vitest + test mẫu (AC: 3) ───
   tests/unit/env.test.ts:
   ```ts
   import { describe, it, expect } from 'vitest';
   import { parseEnv } from '@/lib/env';

   describe('parseEnv', () => {
     it('trả về env khi đủ và hợp lệ', () => {
       const result = parseEnv({
         NEXT_PUBLIC_SUPABASE_URL: 'https://abc.supabase.co',
         NEXT_PUBLIC_SUPABASE_ANON_KEY: 'key-123',
       } as NodeJS.ProcessEnv);
       expect(result.NEXT_PUBLIC_SUPABASE_URL).toBe('https://abc.supabase.co');
     });

     it('ném lỗi khi thiếu ANON_KEY', () => {
       expect(() => parseEnv({
         NEXT_PUBLIC_SUPABASE_URL: 'https://abc.supabase.co',
       } as NodeJS.ProcessEnv)).toThrow(/ANON_KEY/);
     });

     it('ném lỗi khi URL không đúng định dạng', () => {
       expect(() => parseEnv({
         NEXT_PUBLIC_SUPABASE_URL: 'không-phải-url',
         NEXT_PUBLIC_SUPABASE_ANON_KEY: 'key-123',
       } as NodeJS.ProcessEnv)).toThrow(/URL/);
     });
   });
   ```

   $ npm test
   ✓ tests/unit/env.test.ts (3 tests) 12ms
     Test Files 1 passed (1) · Tests 3 passed (3)

   ✓ Tick Task 4
   ✓ Tick Task 2 (giờ mới đủ điều kiện: implement + test + validation pass)

   ─── Task 5: CI (AC: 4) ───
   .github/workflows/ci.yml:
   ```yaml
   name: CI
   on:
     pull_request:
       branches: [main]
   jobs:
     validate:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: actions/setup-node@v4
           with: { node-version: '20', cache: npm }
         - run: npm ci
         - run: npm run lint
         - run: npm test
   ```
   ✓ Tick Task 5

   ─── Task 6: README (AC: 5) ───
   ✓ Đã viết README với 4 mục: yêu cầu môi trường, cài đặt, chạy, test
   ✓ Ghi rõ bước tạo project Supabase và copy .env.example → .env.local
   ✓ Tick Task 6
```

### Hoàn tất — chạy DoD checklist

```text
🤖 Mọi task đã [x] và có test. Chạy validation toàn bộ:

   $ npm run lint     → ✓ 0 lỗi, 0 cảnh báo
   $ npm test         → ✓ 3/3 pass
   $ npm run build    → ✓ build thành công

   Đang chạy execute-checklist với story-dod-checklist...

   ## Story DoD Checklist — Kết quả

   **1. Requirements Met**
   - [x] Mọi yêu cầu chức năng đã hiện thực
   - [x] Mọi AC đã đạt (6/6)

   **2. Coding Standards & Project Structure**
   - [x] Tuân thủ coding standards: không truy cập process.env trực tiếp (luật #1),
         tên file theo kebab-case (luật #6)
   - [x] Khớp unified-project-structure: lib/env.ts, tests/unit/, .github/workflows/
   - [x] Đúng phiên bản tech stack: Next 14.2, TS 5.5, Zod 3.23, Vitest 2.0
   - [N/A] Api Reference / Data Models — story không chạm tới
   - [x] Best practice bảo mật: không hardcode secret; .env.local đã vào .gitignore
   - [x] Không có lỗi/cảnh báo linter mới
   - [x] Comment ở nơi cần thiết

   **3. Testing**
   - [x] Unit test theo yêu cầu story: 3 case cho lib/env.ts
   - [N/A] Integration test — story chưa có endpoint
   - [x] Mọi test pass
   - [N/A] Độ phủ test — dự án chưa đặt ngưỡng

   **4. Functionality & Verification**
   - [x] Đã tự chạy và kiểm chứng bằng tay: mở localhost:3000, thấy "ChiTieu"
   - [x] Edge case: đã xét trường hợp thiếu biến môi trường (2 test case)

   **5. Story Administration**
   - [x] Mọi task đánh dấu hoàn thành
   - [x] Quyết định trong lúc phát triển đã ghi vào Completion Notes
   - [x] Đã hoàn tất wrap-up: model dùng, changelog

   **6. Dependencies, Build & Configuration**
   - [x] Build thành công
   - [x] Linting pass
   - [x] Dependency mới: zod, vitest — ĐÃ được nêu trong story (tech-stack)
         ⇒ thuộc diện "pre-approved in the story requirements"
   - [x] Đã ghi vào package.json
   - [x] Không có lỗ hổng bảo mật đã biết (npm audit: 0 vulnerabilities)
   - [x] Biến môi trường mới đã ghi tài liệu trong .env.example và README

   **7. Documentation**
   - [x] Tài liệu inline cho parseEnv
   - [N/A] Tài liệu người dùng — chưa có tính năng hướng người dùng
   - [x] README đã cập nhật

   ### Tóm tắt DoD

   1. **Đã hoàn thành:** dựng nền dự án Next.js 14.2 + TS + Tailwind, validate env
      bằng Zod, lint zero-warning, Vitest với 3 test, CI trên PR, README.
   2. **Mục [ ] Not Done:** không có. Các mục [N/A] đều do phạm vi story.
   3. **Nợ kỹ thuật:** `lib/env.ts` gọi `parseEnv()` ở top-level ⇒ import module
      này trong test khác sẽ ném lỗi nếu chưa set env. Nên tách lazy ở story sau.
   4. **Bài học cho story sau:** pattern `parseEnv(raw = process.env)` cho phép
      test không cần mock global — nên dùng lại cho các module đọc cấu hình khác.
   5. **Story sẵn sàng review:** CÓ.

   - [x] I, the Developer Agent, confirm that all applicable items above have
         been addressed.

   → Đặt Status: Ready for Review
   → HALT.
```

⚙️ **Cơ chế**: chỉ dẫn nhúng trong `story-dod-checklist.md` nói thẳng: *"Be honest - it's better to flag issues now than have them discovered later."* Ghi chú nợ kỹ thuật ở mục 3 là ví dụ của sự trung thực đó — và nó sẽ được SM đọc lại khi tạo story kế tiếp.

---

## Story sau khi Dev cập nhật

Chỉ **các section được phép của Dev** thay đổi:

```markdown
## Status
Ready for Review                    ← ĐÃ ĐỔI

## Tasks / Subtasks
- [x] Task 1: Khởi tạo dự án Next.js (AC: 1)      ← ĐÃ TICK
  - [x] Chạy npx create-next-app...
  ...
- [x] Task 6: Tài liệu (AC: 5)

## Change Log
| Date       | Version | Description                    | Author     |
|------------|---------|--------------------------------|------------|
| 2026-08-10 | 1.0     | Tạo story ban đầu              | Bob (SM)   |
| 2026-08-10 | 1.1     | Triển khai xong, chờ review    | James (Dev)|   ← MỚI

## Dev Agent Record

### Agent Model Used
Claude Opus 5 (claude-opus-5)

### Debug Log References
- `npm run lint` lần 1: 2 cảnh báo unused import trong app/layout.tsx → đã sửa
- `npm test`: 3/3 pass, 12ms
- `npm run build`: thành công, không cảnh báo
- `npm audit`: 0 vulnerabilities

### Completion Notes List
- Dùng `create-next-app@14.2` để khoá đúng phiên bản trong tech-stack thay vì
  `@latest` — tránh lệch phiên bản với tài liệu kiến trúc.
- `parseEnv(raw = process.env)` nhận tham số để test được mà không phải mock
  biến global. Pattern này nên dùng lại.
- **Nợ kỹ thuật đã ghi nhận**: `export const env = parseEnv()` chạy ở top-level
  module ⇒ bất kỳ file import `lib/env.ts` trong test đều cần env hợp lệ. Đề xuất
  chuyển sang lazy getter ở story sau khi có nhiều module dùng tới.
- Không thêm dependency nào ngoài danh sách đã nêu trong tech-stack.

### File List
**Thêm mới:**
- `app/page.tsx`
- `app/layout.tsx`
- `app/globals.css`
- `lib/env.ts`
- `tests/unit/env.test.ts`
- `vitest.config.ts`
- `.env.example`
- `.github/workflows/ci.yml`
- `README.md`
- `package.json`, `package-lock.json`, `tsconfig.json`,
  `tailwind.config.ts`, `postcss.config.mjs`, `.eslintrc.json`, `next.config.mjs`

**Sửa:**
- `.gitignore` (thêm `.env.local`)

**Xoá:** không có

## QA Results
_(chờ QA)_
```

⚠️ **Dev KHÔNG được sửa**: `Story`, `Acceptance Criteria`, `Dev Notes`, `Testing`, `QA Results`. Nếu bạn thấy nội dung các section đó thay đổi ⇒ agent đã vi phạm, hãy hoàn nguyên.

---

## Trạng thái đĩa sau bước 8 — lần đầu có code

📂

```text
chitieu/
├── .bmad-core/  .claude/
├── app/                      ← MỚI
│   ├── page.tsx  layout.tsx  globals.css
├── lib/env.ts                ← MỚI
├── tests/unit/env.test.ts    ← MỚI
├── .github/workflows/ci.yml  ← MỚI
├── .env.example              ← MỚI
├── README.md                 ← MỚI
├── vitest.config.ts, package.json, tsconfig.json, ...
└── docs/
    ├── prd.md + prd/
    ├── architecture.md + architecture/
    └── stories/1.1.*.md      ← Status: Ready for Review
```

---

## Nếu Dev gặp vấn đề — 5 điều kiện HALT

Demo trên chạy trơn. Thực tế Dev sẽ **HALT** trong 5 trường hợp:

| Điều kiện | Ví dụ ở dự án này | Bạn làm gì |
|---|---|---|
| **Cần dependency chưa được duyệt** | Dev muốn thêm `date-fns` nhưng tech-stack không nêu | Quyết định: duyệt (rồi ghi vào story + tech-stack) hoặc yêu cầu dùng API sẵn có |
| **Còn nhập nhằng sau khi đã đọc story** | Story không nói dùng App Router hay Pages Router | Trả lời; và sửa story/kiến trúc để lần sau không lặp lại |
| **Thất bại 3 lần cho cùng một việc** | Cấu hình Vitest với path alias `@/` không nhận, thử 3 cách đều fail | Đọc `.ai/debug-log.md`, tự chẩn đoán rồi hướng dẫn lại. **Đừng** bảo "thử tiếp đi" |
| **Thiếu cấu hình** | `.env.local` chưa có, không chạy được dev server | Tạo file theo `.env.example` |
| **Regression fail** | Test story trước bị vỡ | Sửa nguyên nhân gốc trước khi tiếp tục |

⚠️ Ép agent bỏ qua HALT là cách nhanh nhất để có code sai. Mỗi lần HALT là hệ thống đang bảo vệ bạn.

---

## Học từ Dev

```text
👤 Bạn: *explain

🤖 Tôi sẽ giảng lại như dạy một junior engineer.

   **Vì sao lib/env.ts nhận tham số thay vì đọc process.env trực tiếp?**

   Nếu viết `const url = process.env.NEXT_PUBLIC_SUPABASE_URL!`, có 3 vấn đề:
   1. Dấu `!` nói với TypeScript "tin tôi, nó có" — nhưng lúc chạy có thể
      `undefined`, và lỗi xuất hiện ở chỗ khác, xa nguyên nhân.
   2. Không test được: muốn test case "thiếu biến" thì phải sửa `process.env`
      toàn cục, ảnh hưởng các test chạy song song.
   3. Vi phạm luật #1 của coding standards dự án này.

   Cách tôi làm: `parseEnv(raw: NodeJS.ProcessEnv = process.env)`. Mặc định vẫn
   đọc env thật nên code gọi không phải đổi gì; nhưng test truyền vào object
   giả được, và Zod cho lỗi rõ ràng nêu đúng biến nào thiếu.

   **Vì sao dùng `safeParse` thay vì `parse`?**
   `parse` ném ZodError với cấu trúc khó đọc. `safeParse` cho tôi cơ hội gói
   lại thành thông điệp tiếng Việt nêu rõ tên biến — người chạy dự án lần đầu
   sẽ biết ngay phải sửa gì.
```

---

## Bạn tự làm gì ở bước này

- [ ] Mở **chat mới**
- [ ] Đưa story cho Dev (dán nội dung hoặc chỉ đường dẫn)
- [ ] Khi Dev HALT: xử lý **nguyên nhân gốc**, không ép bỏ qua
- [ ] Khi Dev báo xong: yêu cầu chạy `story-dod-checklist` một cách **trung thực**
- [ ] Kiểm **File List** có đầy đủ không — QA sẽ dựa vào nó để review
- [ ] Dùng `*explain` để học — đây là tính năng bị bỏ qua nhiều nhất
- [ ] **CHƯA commit.** Đợi QA xong ở bước 9

---

[⬅ Bước trước](./07-story-1-1-sm.md) · [Chỉ mục](./README.md) · [Bước sau: QA review ➡](./09-story-1-1-qa.md)
