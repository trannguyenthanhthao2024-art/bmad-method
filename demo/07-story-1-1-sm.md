[⬅ Bước trước](./06-po-validate-va-shard.md) · [Chỉ mục](./README.md) · [Bước sau ➡](./08-story-1-1-dev.md)

# Bước 7 — SM tạo Story 1.1

> ⚠️ **MỞ CHAT MỚI** trước bước này. Và chọn **model suy luận mạnh nhất** — đây là bước tốn trí tuệ nhất của toàn bộ quy trình, vì nó quyết định Dev agent có đủ ngữ cảnh hay không.

## Lệnh

```text
👤 Bạn: @sm

🤖 Xin chào! Tôi là Bob 🏃 — Scrum Master.

   Tôi chuẩn bị story chi tiết để AI dev agent triển khai không bị nhầm lẫn.
   Lưu ý: tôi KHÔNG được phép viết code hay sửa code, bao giờ cũng vậy.

   Các lệnh khả dụng:
     1. *help
     2. *correct-course     — xử lý thay đổi giữa dòng
     3. *draft              — tạo story kế tiếp
     4. *story-checklist    — kiểm story draft
     5. *exit

👤 Bạn: *draft
```

## Agent đọc gì — theo đúng 6 bước của `create-next-story`

### Bước 0 — Nạp cấu hình

```text
🤖 Đang nạp .bmad-core/core-config.yaml...
   ✓ devStoryLocation: docs/stories
   ✓ prdSharded: true, prdShardedLocation: docs/prd, epicFilePattern: epic-{n}*.md
   ✓ architectureSharded: true, architectureShardedLocation: docs/architecture
```

⚠️ Nếu file này không có: task **HALT** ngay với thông điệp hướng dẫn copy từ GitHub hoặc chạy installer. Không có ngoại lệ.

### Bước 1 — Xác định story kế tiếp

```text
🤖 Đang kiểm docs/stories/... → thư mục rỗng.

   ⇒ Theo quy tắc: khi chưa có story nào, story kế tiếp LUÔN là 1.1.

   Đang đọc docs/prd/epic-1-nen-tang-xac-thuc.md...

   Identified next story for preparation: 1.1 - Khởi tạo dự án và pipeline
```

⚙️ **Cơ chế** — 3 nhánh của bước này:

| Tình huống | Hành vi |
|---|---|
| `docs/stories/` rỗng | Story = **1.1**, không hỏi |
| Story cao nhất chưa `Done` | **Cảnh báo**: *"ALERT: Found incomplete story! File: 1.3.story.md Status: Review. You should fix this story first, but would you like to accept risk & override to create the next story in draft?"* |
| Epic đã hết story | Hỏi **3 lựa chọn**: bắt đầu Epic N+1 / chọn story cụ thể / huỷ. **TUYỆT ĐỐI không tự nhảy epic** |

### Bước 2 — Ngữ cảnh từ story trước

```text
🤖 Không có story trước (đây là story đầu tiên) ⇒ bỏ qua bước thu thập
   Dev Agent Record.
```

*(Từ story 1.2 trở đi, bước này đọc Completion Notes + Debug Log của story trước — xem [bước 10](./10-story-1-2-rui-ro-cao.md).)*

### Bước 3 — Đọc kiến trúc theo loại story

```text
🤖 Story 1.1 là story hạ tầng/nền tảng.

   Đọc cho MỌI story:
     ✓ docs/architecture/tech-stack.md
     ✓ docs/architecture/unified-project-structure.md
     ✓ docs/architecture/coding-standards.md
     ✓ docs/architecture/testing-strategy.md

   Story này không chạm data model hay UI component ⇒ không cần đọc
   data-models.md, api-spec.md, frontend-architecture.md.
```

⚙️ **Cơ chế** — bảng đọc theo loại story:

| Loại story | Đọc thêm |
|---|---|
| MỌI story | `tech-stack` · `unified-project-structure` · `coding-standards` · `testing-strategy` |
| + Backend/API | `data-models` · `database-schema` · `backend-architecture` · `rest-api-spec` · `external-apis` |
| + Frontend/UI | `frontend-architecture` · `components` · `core-workflows` · `data-models` |
| Full-stack | cả hai nhóm |

Đây là lý do sharding quan trọng: SM chỉ đọc **4 file nhỏ** thay vì cả tài liệu 1400 dòng.

### Bước 4 — Kiểm khớp cấu trúc dự án

```text
🤖 Đối chiếu với docs/architecture/unified-project-structure.md:
   ✓ Các file story 1.1 tạo ra đều nằm ở gốc project — khớp
   ✓ .github/workflows/ci.yml có trong cấu trúc — khớp
   ⚠️ Ghi nhận: cấu trúc có thư mục tests/{unit,integration,e2e} nhưng
     story 1.1 chỉ cần tạo tests/unit để có test mẫu. Sẽ ghi vào
     Project Structure Notes.
```

## File sinh ra

📂 `docs/stories/1.1.khoi-tao-du-an-va-pipeline.md`

```markdown
# Story 1.1: Khởi tạo dự án và pipeline

## Status
Draft

## Story
**As a** nhà phát triển,
**I want** một dự án Next.js chạy được với TypeScript, lint, test và CI,
**so that** mọi story sau đều có nền tảng nhất quán để xây tiếp.

## Acceptance Criteria
1. Chạy `npm run dev` mở được trang chủ ở localhost và hiển thị tên app.
2. Chạy `npm run lint` không có lỗi và không có cảnh báo.
3. Chạy `npm test` thực thi được và pass với ít nhất một test mẫu.
4. Có GitHub Actions workflow chạy lint + test trên mọi pull request.
5. README ghi rõ cách chạy dự án ở máy local.
6. Người dùng tạo project Supabase và điền `.env.local` theo `.env.example`.

## Tasks / Subtasks

- [ ] Task 1: Khởi tạo dự án Next.js (AC: 1)
  - [ ] Chạy `npx create-next-app@14.2 . --ts --tailwind --app --eslint`
  - [ ] Xác nhận cấu trúc khớp `docs/architecture/unified-project-structure.md`
  - [ ] Sửa `app/page.tsx` hiển thị tên app "ChiTieu"
  - [ ] Xác nhận `npm run dev` mở được localhost:3000

- [ ] Task 2: Thiết lập validate biến môi trường (AC: 6)
  - [ ] Tạo `lib/env.ts` dùng Zod validate `NEXT_PUBLIC_SUPABASE_URL`
        và `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [ ] Tạo `.env.example` liệt kê 2 biến trên (không có giá trị thật)
  - [ ] Thêm `.env.local` vào `.gitignore`
  - [ ] Viết unit test cho `lib/env.ts`: 1 case hợp lệ, 2 case thiếu biến

- [ ] Task 3: Cấu hình lint đạt zero-warning (AC: 2)
  - [ ] Cấu hình ESLint với `--max-warnings=0`
  - [ ] Thêm script `"lint": "next lint --max-warnings=0"` vào package.json
  - [ ] Chạy và sửa hết cảnh báo hiện có

- [ ] Task 4: Thiết lập Vitest và test mẫu (AC: 3)
  - [ ] Cài Vitest 2.0 + cấu hình `vitest.config.ts`
  - [ ] Tạo `tests/unit/env.test.ts` (test của Task 2)
  - [ ] Thêm script `"test": "vitest run"` vào package.json
  - [ ] Xác nhận `npm test` pass

- [ ] Task 5: Pipeline CI (AC: 4)
  - [ ] Tạo `.github/workflows/ci.yml`: trigger trên pull_request
  - [ ] Job chạy Node 20, `npm ci`, `npm run lint`, `npm test`
  - [ ] Xác nhận workflow hợp lệ về cú pháp YAML

- [ ] Task 6: Tài liệu (AC: 5)
  - [ ] Viết README: yêu cầu môi trường, cách cài, cách chạy, cách test
  - [ ] Ghi rõ bước tạo project Supabase và copy `.env.example` → `.env.local`

## Dev Notes

### Previous Story Insights
Không có — đây là story đầu tiên của dự án.

### Tech Stack (bắt buộc dùng đúng phiên bản)
- TypeScript 5.5, Next.js 14.2 (App Router), Tailwind CSS 3.4
- Zod 3.23 để validate
- Vitest 2.0 cho unit/integration test
- Node 20 trong CI
- Hosting: Vercel; CI: GitHub Actions
[Source: architecture/tech-stack.md#tech-stack]

### File Locations
Story này tạo các file sau, đúng theo cấu trúc đã định:
- `app/page.tsx` — trang chủ
- `app/layout.tsx` — layout gốc (do create-next-app sinh)
- `lib/env.ts` — validate biến môi trường
- `tests/unit/env.test.ts` — unit test
- `vitest.config.ts` — cấu hình test
- `.github/workflows/ci.yml` — pipeline
- `.env.example`, `README.md`
[Source: architecture/unified-project-structure.md#unified-project-structure]

### Coding Standards phải tuân thủ
- **Không truy cập `process.env` trực tiếp** — luôn qua `lib/env.ts` đã validate
  bằng Zod. Vi phạm ⇒ app crash lúc build thay vì lúc chạy.
- Tên file: component `PascalCase.tsx`, còn lại `kebab-case.ts`
- Mọi input từ client phải qua Zod schema (chưa áp dụng ở story này vì chưa
  có input, nhưng `lib/env.ts` đặt nền cho pattern đó)
[Source: architecture/coding-standards.md#critical-rules]

### Testing Requirements
- Unit test đặt ở `tests/unit/<module>.test.ts`
- Mỗi Zod schema có unit test cho ít nhất 1 case hợp lệ và 2 case sai
  ⇒ `lib/env.ts` cần đúng 3 test case
- Test phải stateless, chạy song song được, tự dọn dữ liệu
[Source: architecture/testing-strategy.md#test-organization]

### API Specifications
Không áp dụng — story này không tạo endpoint nào.

### Data Models
Không áp dụng — story này không chạm database.
No specific guidance found in architecture docs cho phần data model ở story này.

### Component Specifications
Không áp dụng — story này không tạo UI component nào ngoài trang chủ tối giản.

### Technical Constraints
- Node 20 (khớp `engines` và CI)
- ESLint phải chạy với `--max-warnings=0` (AC 2 yêu cầu "không có cảnh báo")
[Source: architecture/tech-stack.md#tech-stack]

### Project Structure Notes
Cấu trúc kiến trúc định nghĩa `tests/{unit,integration,e2e}`. Story này chỉ tạo
`tests/unit/`; hai thư mục còn lại sẽ được tạo khi có story cần tới (2.x cho
integration, e2e ở story có UI hoàn chỉnh). Không có xung đột với cấu trúc đã định.

### Testing
List Relevant Testing Standards:
- Test file location: `tests/unit/env.test.ts`
- Framework: Vitest 2.0
- Pattern: `describe` theo module, `it` theo hành vi
- Yêu cầu riêng của story: 3 test case cho `lib/env.ts` (1 hợp lệ, 2 sai)
[Source: architecture/testing-strategy.md]

## Change Log
| Date       | Version | Description        | Author       |
|------------|---------|--------------------|--------------|
| 2026-08-10 | 1.0     | Tạo story ban đầu  | Bob (SM)     |

## Dev Agent Record
### Agent Model Used
_(Dev agent sẽ điền)_

### Debug Log References
_(Dev agent sẽ điền)_

### Completion Notes List
_(Dev agent sẽ điền)_

### File List
_(Dev agent sẽ điền)_

## QA Results
_(QA agent sẽ điền)_
```

## Bước 6 — SM tự chạy checklist

```text
🤖 Đang chạy execute-checklist với story-draft-checklist...

   | # | Section                            | Kết quả |
   |---|-----------------------------------|---------|
   | 1 | GOAL & CONTEXT CLARITY            | ✅ 4/4  |
   | 2 | TECHNICAL IMPLEMENTATION GUIDANCE | ✅ 5/5  |
   | 3 | REFERENCE EFFECTIVENESS           | ✅ 3/3  |
   | 4 | SELF-CONTAINMENT ASSESSMENT       | ✅ 4/4  |
   | 5 | TESTING GUIDANCE                  | ✅ 3/3  |
   | **VALIDATION RESULT**              | **READY** |

   ## Tóm tắt

   - **Story đã tạo:** docs/stories/1.1.khoi-tao-du-an-va-pipeline.md
   - **Status:** Draft
   - **Thành phần kỹ thuật đưa vào từ tài liệu kiến trúc:**
     tech stack (phiên bản cụ thể) · đường dẫn 8 file · 3 luật coding standards ·
     quy ước và yêu cầu test
   - **Sai lệch / xung đột giữa epic và kiến trúc:** không có
   - **Kết quả checklist:** READY
   - **Bước tiếp theo:** bạn xem lại story, đổi Status Draft → Approved.
     Story này đơn giản nên không cần PO validate.
```

---

## Bạn duyệt story

```text
👤 Bạn: [đọc story, sửa Status: Draft → Approved]
```

### Checklist duyệt của bạn — làm mỗi lần, đừng bỏ

- [x] Status = `Draft`
- [x] AC copy **nguyên** từ epic (6 AC, khớp `epic-1-*.md`)
- [x] **Mọi** chi tiết kỹ thuật có `[Source: …]` — đếm được 5 trích dẫn
- [x] Nhóm không có nguồn thì ghi rõ **"No specific guidance found in architecture docs"** — có ở mục Data Models
- [x] Tasks tuần tự, có subtask test tường minh (Task 2 và Task 4)
- [x] Task map AC: `(AC: 1)`, `(AC: 6)`, `(AC: 2)`…
- [x] Có "Project Structure Notes"

**Câu hỏi vàng**: *Nếu tôi đưa file story này cho một dev không biết gì về ChiTieu, họ làm được không?*
→ Có. Story ghi rõ phiên bản, đường dẫn file, luật code, số lượng test cần viết.
→ ⇒ **Duyệt.**

⚠️ Nếu câu trả lời là **không** ⇒ đừng duyệt. Yêu cầu SM bổ sung Dev Notes, hoặc chạy `@po *validate-story-draft` để có báo cáo chi tiết chỗ nào thiếu.

---

## Trạng thái sau bước 7

📂

```text
docs/
├── prd.md + prd/
├── architecture.md + architecture/
├── front-end-spec.md
├── project-brief.md
└── stories/
    └── 1.1.khoi-tao-du-an-va-pipeline.md    ← MỚI, Status: Approved
```

Vẫn **chưa có dòng code nào**.

---

⚙️ **Cơ chế — điều quan trọng nhất của bước này**

`create-next-story` biến "kiến trúc 1400 dòng + epic" thành **một file story tự chứa**. Ba luật cứng làm nên chất lượng:

| Luật | Câu trong task | Vì sao |
|---|---|---|
| Chỉ trích, không bịa | *"This section MUST contain ONLY information extracted from architecture documents. NEVER invent or assume technical details."* | Chống ảo giác |
| Bắt buộc trích nguồn | *"Every technical detail MUST include its source reference: `[Source: architecture/{filename}.md#{section}]`"* | Truy vết được, kiểm chứng được |
| Nói rõ khi không có | *"If information for a category is not found, explicitly state: 'No specific guidance found in architecture docs'"* | Lỗ hổng hiện ra thay vì bị lấp bằng phỏng đoán |

Và mục tiêu cuối, viết trong `story-tmpl.yaml`:

> *"Put enough information in this section so that the dev agent should **NEVER need to read the architecture documents**."*

---

[⬅ Bước trước](./06-po-validate-va-shard.md) · [Chỉ mục](./README.md) · [Bước sau: Dev triển khai ➡](./08-story-1-1-dev.md)
