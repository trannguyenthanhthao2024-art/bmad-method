[⬅ Bước trước](./04-ux-spec.md) · [Chỉ mục](./README.md) · [Bước sau ➡](./06-po-validate-va-shard.md)

# Bước 5 — Architect: kiến trúc full-stack

Đây là tài liệu mà **Dev agent sẽ sống trong đó** — ba section của nó (`coding-standards`, `tech-stack`, `source-tree`) sẽ được Dev nạp ở **mọi** task sau khi shard.

## Lệnh

```text
👤 Bạn: @architect

🤖 Xin chào! Tôi là Winston 🏗️ — Architect.
   [hiện 11 lệnh]

👤 Bạn: *create-full-stack-architecture
```

## Agent nạp gì

```text
.bmad-core/agents/architect.md                          ← persona
.bmad-core/core-config.yaml
.bmad-core/tasks/create-doc.md                          ← engine
.bmad-core/templates/fullstack-architecture-tmpl.yaml    ← khuôn LỚN NHẤT: 21 section
.bmad-core/data/technical-preferences.md                 ← ⭐ sở thích của bạn
.bmad-core/data/elicitation-methods.md
docs/prd.md                                             ← FR/NFR + epic
docs/front-end-spec.md                                  ← component + accessibility
```

## Diễn biến — trích 4 section quyết định

### `tech-stack` — nơi `technical-preferences.md` phát huy tác dụng

```text
🤖 ## Tech Stack

   Tôi đã đọc technical-preferences.md của bạn. Stack bạn ưa dùng khớp tốt với
   yêu cầu dự án này, nên tôi giữ nguyên và chỉ chốt phiên bản cụ thể.

   | Category        | Technology            | Version | Purpose | Rationale |
   |-----------------|-----------------------|---------|---------|-----------|
   | Language        | TypeScript            | 5.5     | Toàn stack | Type an toàn giữa FE-BE |
   | Framework       | Next.js (App Router)  | 14.2    | FE + API | Một codebase, deploy một chỗ |
   | UI Library      | shadcn/ui + Radix     | latest  | Component | Copy vào repo, kiểm soát được |
   | Styling         | Tailwind CSS          | 3.4     | CSS | Theo preference |
   | Database        | Postgres (Supabase)   | 15      | Lưu dữ liệu | Managed, có RLS sẵn |
   | Auth            | Supabase Auth         | 2.x     | Xác thực | KHÔNG tự viết auth (anti-pattern của bạn) |
   | Validation      | Zod                   | 3.23    | Validate | Dùng chung schema FE-BE |
   | Unit/Int Test   | Vitest                | 2.0     | Test | Theo preference |
   | E2E Test        | Playwright            | 1.46    | Test | Kèm axe-core cho accessibility |
   | Hosting         | Vercel                | —       | Deploy | Native với Next.js |
   | CI              | GitHub Actions        | —       | Pipeline | Miễn phí cho repo nhỏ |

   ---
   **Rationale:**
   - **Nguyên tắc "chọn công nghệ nhàm chán ở đâu được"**: không có gì mới lạ
     trong bảng trên. Rủi ro kỹ thuật gần như bằng 0, đúng cho dự án 2-3 tuần
     một người làm.
   - **Trade-off lớn nhất — Supabase**: được auth + DB + RLS gần như miễn phí
     công sức, mất tính di động (khoá vào vendor). Với MVP một người dùng, tôi
     cho rằng đánh đổi này đúng. Nếu bạn có ý định tự host về sau, nói ngay để
     tôi tách tầng truy cập dữ liệu.
   - **Quyết định đáng chú ý**: KHÔNG tách backend riêng. Route Handlers của
     Next.js là đủ. Tách service riêng cho app này là over-engineering.
   - **NFR4 (rate limiting)**: Supabase Auth có rate limit sẵn ở tầng của nó,
     NHƯNG tôi vẫn sẽ thêm một lớp giới hạn ở Route Handler, vì AC 1.2.5 yêu
     cầu con số cụ thể (5 lần / 15 phút / IP) mà mặc định của Supabase khác.

   [9 lựa chọn]

👤 1
```

⚙️ **Cơ chế**: nếu bạn để `technical-preferences.md` trống (`None Listed`), section này biến thành 10 câu hỏi và bạn phải tự quyết từng dòng. Điền file đó một lần ⇒ tiết kiệm ở mọi dự án.

### `data-models` + `database-schema`

```text
🤖 ## Data Models

   ### Transaction
   **Purpose:** một khoản chi của người dùng

   ```ts
   export const CATEGORIES = ['an-uong','di-lai','nha-cua','suc-khoe',
                              'giai-tri','hoc-tap','khac'] as const;
   export type Category = typeof CATEGORIES[number];

   export interface Transaction {
     id: string;          // uuid
     userId: string;      // FK → auth.users.id
     amount: number;      // VND, số nguyên dương
     category: Category;
     occurredOn: string;  // ISO date (YYYY-MM-DD)
     note?: string;       // tối đa 200 ký tự
     createdAt: string;
     updatedAt: string;
   }
   ```

   **Relationships:** Transaction *N* → *1* User (Supabase `auth.users`)

   ## Database Schema

   ```sql
   create table public.transactions (
     id          uuid primary key default gen_random_uuid(),
     user_id     uuid not null references auth.users(id) on delete cascade,
     amount      integer not null check (amount > 0),
     category    text not null check (category in
                   ('an-uong','di-lai','nha-cua','suc-khoe','giai-tri','hoc-tap','khac')),
     occurred_on date not null,
     note        text check (char_length(note) <= 200),
     created_at  timestamptz not null default now(),
     updated_at  timestamptz not null default now()
   );

   create index transactions_user_month_idx
     on public.transactions (user_id, occurred_on desc);

   -- NFR3: người dùng chỉ truy cập dữ liệu của chính mình
   alter table public.transactions enable row level security;

   create policy "own rows only" on public.transactions
     for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
   ```

   ---
   **Rationale:**
   - **`amount` là integer, không phải float**: VND không có phần thập phân, và
     float gây sai số khi cộng dồn báo cáo. Đây là quyết định không thể sửa dễ
     về sau (phải migrate dữ liệu).
   - **RLS thay vì kiểm quyền ở tầng ứng dụng**: NFR3 được thực thi ở tầng DB
     ⇒ ngay cả khi code app có lỗi, dữ liệu vẫn không rò rỉ. Đây là "defense
     in depth".
   - **Index `(user_id, occurred_on desc)`**: khớp đúng truy vấn chính
     "giao dịch của tôi trong tháng, mới nhất trước".
```

### `coding-standards` — sẽ thành file Dev LUÔN nạp

```text
🤖 ## Coding Standards

   ⚠️ Section này sẽ trở thành docs/architecture/coding-standards.md sau khi
   shard, và Dev agent nạp nó ở MỌI task. Vì vậy tôi giữ nó CỰC NGẮN — chỉ
   những luật mà agent bắt buộc tuân theo, không phải sách dạy code.

   ### Critical Rules
   1. **Không truy cập `process.env` trực tiếp** — luôn qua `lib/env.ts` (đã
      validate bằng Zod). Vi phạm ⇒ app crash lúc build thay vì lúc chạy.
   2. **Mọi input từ client phải qua Zod schema** trước khi tới DB. Schema đặt
      trong `lib/schemas/`, dùng chung cho cả form và Route Handler.
   3. **Không gọi Supabase client trực tiếp trong component.** Truy cập dữ liệu
      chỉ qua `lib/data/*.ts`.
   4. **Không bao giờ log giá trị của các field: `password`, `token`,
      `email`** (AC 1.2.6).
   5. **Số tiền luôn là integer VND.** Không dùng float ở bất kỳ đâu.
   6. **Tên file:** component `PascalCase.tsx`, còn lại `kebab-case.ts`.
   7. **Mọi Route Handler trả lỗi theo dạng** `{ error: { code, message } }`,
      không trả stack trace ra client.

   ### Naming Conventions
   | Element | Convention | Example |
   |---------|-----------|---------|
   | Component | PascalCase | `QuickAddForm.tsx` |
   | Hook | `use` + camelCase | `useTransactions.ts` |
   | Route Handler | `route.ts` trong thư mục tên endpoint | `app/api/transactions/route.ts` |
   | DB table/column | snake_case | `occurred_on` |
   | Zod schema | camelCase + `Schema` | `transactionSchema` |

   ---
   **Rationale:**
   - Tôi giới hạn ở **7 luật**. `docs/user-guide.md` khuyên: khi codebase đã có
     pattern nhất quán, hãy **rút gọn** file này — agent sẽ tự suy chuẩn từ code
     xung quanh. Mỗi dòng thừa ở đây là ngữ cảnh mất đi cho việc code.
```

⚙️ **Cơ chế — đây là section quan trọng nhất cho pha phát triển.** Nó cùng `tech-stack` và `source-tree` tạo thành `devLoadAlwaysFiles`. Viết dài ⇒ Dev agent tốn ngữ cảnh mỗi story. Viết mơ hồ ⇒ Dev agent tự bịa chuẩn.

### `unified-project-structure`

```text
🤖 ## Unified Project Structure

   ```text
   chitieu/
   ├── app/
   │   ├── (auth)/dang-ky/page.tsx
   │   ├── (auth)/dang-nhap/page.tsx
   │   ├── tong-quan/page.tsx
   │   ├── giao-dich/page.tsx
   │   ├── api/
   │   │   ├── auth/dang-nhap/route.ts      ← rate limiting ở đây (AC 1.2.5)
   │   │   └── transactions/route.ts
   │   ├── layout.tsx
   │   └── globals.css
   ├── components/
   │   ├── ui/                              ← shadcn/ui, không sửa tay
   │   ├── QuickAddForm.tsx
   │   ├── CategoryBreakdown.tsx
   │   ├── MonthSummaryCard.tsx
   │   └── TransactionRow.tsx
   ├── lib/
   │   ├── env.ts                           ← quy tắc #1 của coding standards
   │   ├── supabase/{client,server}.ts
   │   ├── schemas/transaction.ts           ← Zod, dùng chung FE-BE
   │   ├── data/transactions.ts             ← quy tắc #3
   │   └── rate-limit.ts
   ├── tests/
   │   ├── unit/
   │   ├── integration/
   │   └── e2e/
   ├── supabase/migrations/
   ├── .github/workflows/ci.yml
   └── docs/                                ← tài liệu BMad ở đây
   ```

   ---
   **Rationale:**
   - **`create-next-story` sẽ đọc section này ở bước 4 của nó** để kiểm tra
     đường dẫn file trong story có khớp cấu trúc thật hay không. Vì vậy tôi
     ghi đường dẫn **chính xác tới từng file**, không mô tả chung chung.
```

### `testing-strategy`

```text
🤖 ## Testing Strategy

   ### Testing Pyramid
   ```text
        E2E (Playwright)      ~5 test  — chỉ hành trình then chốt
      Integration (Vitest)   ~15 test  — Route Handler + DB (Supabase local)
        Unit (Vitest)        ~30 test  — logic thuần: validate, tính toán, format
   ```

   ### Test Organization
   - Unit: `tests/unit/<module>.test.ts`
   - Integration: `tests/integration/<endpoint>.test.ts`
   - E2E: `tests/e2e/<flow>.spec.ts`

   ### Yêu cầu bắt buộc
   - Mỗi Zod schema có unit test cho ít nhất 1 case hợp lệ và 2 case sai
   - Mỗi Route Handler có integration test cho: happy path · input sai · không auth
   - E2E chạy axe-core trên `/tong-quan` và `/dang-nhap` (accessibility, từ UX spec)
   - Test phải stateless và chạy song song được; tự dọn dữ liệu sau khi chạy
```

### `checklist-results`

```text
🤖 Đang chạy architect-checklist (YOLO)...

   | Section                              | Pass rate |
   |--------------------------------------|-----------|
   | 1. REQUIREMENTS ALIGNMENT            | 5/5  100% |
   | 2. ARCHITECTURE FUNDAMENTALS         | 6/6  100% |
   | 3. TECHNICAL STACK & DECISIONS       | 7/7  100% |
   | 4. FRONTEND DESIGN [[FRONTEND ONLY]] | 6/7   86% |
   | 5. RESILIENCE & OPERATIONAL READINESS| 4/6   67% |
   | 6. SECURITY & COMPLIANCE             | 6/6  100% |
   | 7. IMPLEMENTATION GUIDANCE           | 6/6  100% |
   | 8. DEPENDENCY & INTEGRATION MGMT     | 4/4  100% |
   | 9. AI AGENT IMPLEMENTATION SUITABILITY| 5/5 100% |
   | 10. ACCESSIBILITY [[FRONTEND ONLY]]  | 3/3  100% |
   | **TỔNG**                              | **52/55  95%** |

   ⚠️ §5 chưa đạt: chưa có chiến lược monitoring và chưa có kế hoạch backup DB.
      → Với MVP tôi đề xuất: dùng Vercel Analytics mặc định + Supabase daily
        backup (có sẵn ở plan miễn phí). Tôi đã thêm vào section Monitoring.

   ⚠️ §4: chưa nêu chiến lược quản lý state phía client.
      → Đã thêm: không dùng state store; dùng Server Component + revalidate.
```

⚙️ **Cơ chế**: **§9 "AI AGENT IMPLEMENTATION SUITABILITY"** là section đặc trưng của BMAD — kiến trúc không chỉ cần đúng kỹ thuật mà còn phải **tường minh, ít ngầm định** để AI agent triển khai được. Nếu section này fail, bạn sẽ thấy hậu quả ở mọi story sau.

## Architect có thể đề xuất sửa PRD

Workflow có bước `architect_review` với câu hỏi:

> *"Architecture complete. Do you suggest any changes to the PRD stories or need new stories added?"*

```text
🤖 Có một đề xuất: AC 1.2.5 yêu cầu rate limiting "5 lần / 15 phút / IP".
   Để làm được cần một store đếm lượt (in-memory không dùng được vì Vercel
   serverless không giữ state giữa các lần gọi).

   Đề xuất: thêm **Story 1.4 — Hạ tầng rate limiting** (dùng Upstash Redis),
   HOẶC đơn giản hoá AC 1.2.5 xuống "dùng rate limit mặc định của Supabase Auth".

👤 Bạn: Đơn giản hoá. MVP không cần thêm dịch vụ nữa.

🤖 Rõ. Vậy PM cần cập nhật AC 1.2.5 thành: "Tận dụng giới hạn tần suất của
   Supabase Auth; ghi tài liệu ngưỡng thực tế". Tôi ghi việc này vào Next Steps
   để bạn chuyển sang PM.
```

⇒ Bạn quay lại `@pm` → `*create-prd` (hoặc chỉ yêu cầu sửa AC 1.2.5) → re-export `docs/prd.md`. Đây là bước `architect_to_pm` trong workflow.

⚠️ Demo giữ AC 1.2.5 nguyên bản (5 lần/15 phút) để [bước 10](./10-story-1-2-rui-ro-cao.md) có thể minh hoạ gate **FAIL** vì thiếu rate limiting.

## File sinh ra

📂 `docs/architecture.md` — 21 section H2, trong đó 3 section sẽ thành `devLoadAlwaysFiles`:

```text
## Introduction
## High Level Architecture
## Tech Stack                        ⭐ → docs/architecture/tech-stack.md
## Data Models
## API Spec
## Components
## External APIs
## Core Workflows
## Database Schema
## Frontend Architecture
## Backend Architecture
## Unified Project Structure         ⭐ create-next-story đọc để kiểm cấu trúc
## Development Workflow
## Deployment Architecture
## Security and Performance
## Testing Strategy                  ⭐ create-next-story đọc cho mọi story
## Coding Standards                  ⭐ → docs/architecture/coding-standards.md
## Error Handling Strategy
## Monitoring and Observability
## Checklist Results Report
```

⚠️ **Vấn đề tên file cần xử lý ngay**: `devLoadAlwaysFiles` trong `core-config.yaml` trỏ tới `docs/architecture/source-tree.md`, nhưng template `fullstack-architecture` đặt tên section là **`Unified Project Structure`** ⇒ sau khi shard sẽ ra `unified-project-structure.md`, **không phải** `source-tree.md`.

Hai cách xử lý:

```yaml
# Cách A — sửa core-config.yaml cho khớp tên section thật (demo chọn cách này)
devLoadAlwaysFiles:
  - docs/architecture/coding-standards.md
  - docs/architecture/tech-stack.md
  - docs/architecture/unified-project-structure.md
```

```text
# Cách B — đổi tên section trong architecture.md thành "## Source Tree"
```

Không xử lý ⇒ ở [bước 8](./08-story-1-1-dev.md) Dev agent sẽ báo thiếu file.

## Trạng thái sau bước 5

📂

```text
docs/
├── brainstorming-session-results.md
├── project-brief.md
├── prd.md
├── front-end-spec.md
└── architecture.md                 ← MỚI: 21 section
```

## Bạn tự làm gì ở bước này

- [ ] Kiểm `tech-stack`: có **phiên bản cụ thể** cho từng công nghệ chưa? "Next.js latest" là không đủ
- [ ] Đọc `coding-standards` — nó có **ngắn** không? Quá 15 luật là dấu hiệu cần cắt
- [ ] Kiểm `unified-project-structure` có đường dẫn **chính xác tới từng file** chưa
- [ ] Đối chiếu `devLoadAlwaysFiles` với tên section thật ⇒ xử lý lệch tên ngay (mục ⚠️ trên)
- [ ] Trả lời câu `architect_review` — có cần sửa PRD không

---

[⬅ Bước trước](./04-ux-spec.md) · [Chỉ mục](./README.md) · [Bước sau: PO chốt kiểm + shard ➡](./06-po-validate-va-shard.md)
