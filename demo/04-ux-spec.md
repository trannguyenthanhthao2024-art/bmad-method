[⬅ Bước trước](./03-pm-prd.md) · [Chỉ mục](./README.md) · [Bước sau ➡](./05-architect.md)

# Bước 4 — UX Expert: UI/UX Specification

## Lệnh

```text
👤 Bạn: @ux-expert

🤖 Xin chào! Tôi là Sally 🎨 — UX Expert.

   Các lệnh khả dụng:
     1. *help
     2. *create-front-end-spec    — đặc tả UI/UX
     3. *generate-ui-prompt       — sinh prompt cho v0/Lovable
     4. *exit

👤 Bạn: *create-front-end-spec
```

## Agent nạp gì

```text
.bmad-core/agents/ux-expert.md                       ← persona (lúc kích hoạt)
.bmad-core/core-config.yaml                          ← (lúc kích hoạt)
.bmad-core/tasks/create-doc.md                       ← engine
.bmad-core/templates/front-end-spec-tmpl.yaml        ← khuôn: 12 section
.bmad-core/data/elicitation-methods.md
.bmad-core/data/technical-preferences.md
docs/prd.md                                          ← ĐẦU VÀO: FR + UI Design Goals
```

## Diễn biến — trích 3 section tiêu biểu

### Section `information-architecture` — có sơ đồ Mermaid

```text
🤖 ## Information Architecture

   ### Site Map

   ```mermaid
   flowchart TD
       A[/ — Landing] --> B[/dang-ky]
       A --> C[/dang-nhap]
       C -->|thành công| D[/tong-quan  ⭐ màn hình chính]
       B -->|thành công| D
       D --> E[/giao-dich — danh sách theo tháng]
       D -.->|modal| F[Thêm nhanh]
       E -.->|modal| G[Sửa giao dịch]
       D --> H[/dang-xuat]
   ```

   ### Navigation Structure
   - **Primary nav** (3 mục, luôn hiện ở bottom bar trên mobile):
     Tổng quan · Giao dịch · Tài khoản
   - **Không có** menu hamburger — chỉ 3 mục thì bottom bar nhanh hơn

   ---
   **Rationale:**
   - **Quyết định quan trọng**: `/tong-quan` là màn hình đích sau đăng nhập,
     KHÔNG phải danh sách giao dịch. Điều này bám đúng insight của brief:
     giá trị là "nhìn ra vấn đề", không phải "xem lịch sử".
   - **Trade-off**: "Thêm nhanh" là modal chứ không phải trang riêng. Được:
     không mất ngữ cảnh, đóng modal là thấy tổng quan cập nhật ngay. Mất:
     không deep-link được vào form thêm.
   - **Cần xác thực**: bottom bar 3 mục — bạn có định thêm mục nào sau MVP
     không? Quá 5 mục là phải đổi pattern.

   [9 lựa chọn]
```

### Section `accessibility` — mục mà `pm-checklist` đã cảnh báo thiếu

```text
🤖 ## Accessibility Requirements

   **Compliance target:** WCAG 2.1 Level AA

   ### Key Requirements
   - **Visual:** tỉ lệ tương phản text ≥ 4.5:1; không dùng riêng màu để
     truyền tải thông tin (biểu đồ theo loại phải có nhãn text, không chỉ màu)
   - **Interaction:** toàn bộ form thao tác được bằng bàn phím; focus ring
     luôn nhìn thấy; nút có vùng chạm ≥ 44×44px
   - **Content:** mọi input có `<label>` liên kết; lỗi form gắn với input qua
     `aria-describedby`; biểu đồ có `aria-label` mô tả số liệu
   - **Testing:** kiểm bằng axe-core trong test e2e cho 2 trang chính

   ---
   **Rationale:**
   - Mục này được thêm vì `pm-checklist` §3 báo ⚠️ PARTIAL: PRD chưa có yêu
     cầu accessibility. Bây giờ nó thành yêu cầu kiểm được, và sẽ đi vào
     `testing-strategy` của kiến trúc.
```

⚙️ **Cơ chế**: đây là ví dụ **vòng lặp chất lượng giữa các bước** — checklist ở bước 3 phát hiện lỗ hổng, bước 4 bịt lại. Không có ai phải nhớ; checklist làm việc đó.

### Section `component-library`

```text
🤖 ## Component Library / Design System

   **Design System Approach:** dùng shadcn/ui (Radix + Tailwind) — copy component
   vào repo thay vì cài dependency, để tự kiểm soát và sửa được.

   ### Core Components

   | Component        | Mục đích | Variants | States |
   |------------------|----------|----------|--------|
   | QuickAddForm     | Thêm giao dịch nhanh | modal · inline | idle · submitting · error |
   | CategoryPicker   | Chọn 1 trong 7 loại | grid · dropdown | default · selected |
   | MonthSummaryCard | Tổng chi tháng | — | loading · empty · loaded |
   | CategoryBreakdown| Phân bố theo loại | bar · donut | loading · empty · loaded |
   | TransactionRow   | Một dòng giao dịch | — | default · editing · deleting |

   ---
   **Rationale:**
   - **Trạng thái `empty` được nêu tường minh** cho MonthSummaryCard và
     CategoryBreakdown — vì tháng đầu tiên chưa có dữ liệu, và đây chính là
     rủi ro mà phần phản biện ở bước 2 đã chỉ ra. Không thiết kế trạng thái
     rỗng thì tháng đầu app trông như bị lỗi.
```

## File sinh ra

📂 `docs/front-end-spec.md`

```text
# ChiTieu UI/UX Specification
## Introduction                    (UX goals, personas, design principles)
## Information Architecture        (site map Mermaid + navigation)
## User Flows                      (3 flow: đăng ký · thêm giao dịch · xem tổng quan)
## Wireframes & Mockups            (mô tả layout từng màn hình)
## Component Library               (5 component + variants + states)
## Branding & Style Guide          (màu, typography, spacing, iconography)
## Accessibility Requirements      (WCAG 2.1 AA)
## Responsiveness Strategy         (breakpoint 360 / 768 / 1024)
## Animation & Micro-interactions
## Performance Considerations
## Next Steps
## Checklist Results
```

## Bước tuỳ chọn — sinh prompt cho công cụ AI UI

Workflow `greenfield-fullstack` có bước tuỳ chọn `v0_prompt` với điều kiện `user_wants_ai_generation`:

```text
👤 Bạn: *generate-ui-prompt

🤖 [nạp .bmad-core/tasks/generate-ai-frontend-prompt.md]

   Tôi sẽ dựng prompt theo khung 4 phần. Đây là prompt cho màn hình Tổng quan:

   ─────────────────────────────────────────────────────────
   **1. HIGH-LEVEL GOAL**
   Create a responsive monthly expense overview page with a quick-add modal,
   mobile-first, using Next.js App Router + TypeScript + Tailwind + shadcn/ui.

   **2. DETAILED, STEP-BY-STEP INSTRUCTIONS**
   1. Create `app/tong-quan/page.tsx` as a Server Component.
   2. Render a `MonthSummaryCard` showing total spend for the current month.
   3. Below it render `CategoryBreakdown` as a horizontal bar list — each row
      shows category name, amount, and percentage. Text labels are required;
      do NOT rely on colour alone.
   4. Add a floating action button bottom-right that opens `QuickAddForm`
      in a Radix Dialog.
   5. `QuickAddForm` has exactly two required fields: amount (numeric) and
      category (7 fixed options). Date defaults to today, editable.
   6. Handle three states for both cards: loading (skeleton), empty
      ("Chưa có giao dịch nào trong tháng này"), loaded.

   **3. CODE EXAMPLES, DATA STRUCTURES & CONSTRAINTS**
   Transaction shape:
   ```ts
   type Transaction = {
     id: string; amount: number; category: Category;
     occurredOn: string; // ISO date
   };
   type Category = 'an-uong'|'di-lai'|'nha-cua'|'suc-khoe'|'giai-tri'|'hoc-tap'|'khac';
   ```
   - Use Tailwind only; do NOT add a CSS-in-JS library.
   - Do NOT implement authentication — assume the user is already logged in.
   - Do NOT create a global state store; pass data via props.
   - All touch targets minimum 44×44px.

   **4. STRICT SCOPE**
   Only create: `app/tong-quan/page.tsx`, `components/MonthSummaryCard.tsx`,
   `components/CategoryBreakdown.tsx`, `components/QuickAddForm.tsx`.
   Do NOT modify `app/layout.tsx`, any auth file, or any API route.
   ─────────────────────────────────────────────────────────

   ⚠️ Lưu ý: mọi mã do AI sinh ra CẦN được con người review, test và tinh chỉnh
   trước khi coi là production-ready.
```

⚙️ **Cơ chế**: khung 4 phần là bắt buộc theo task. Phần 3 **phải nêu điều KHÔNG được làm**, phần 4 **phải giới hạn file được sửa** — hai điều này ngăn công cụ AI đi sửa lung tung khắp codebase.

Nếu bạn dùng prompt này ở v0/Lovable rồi tải project về, workflow có bước `project_setup_guidance` hướng dẫn đặt nó vào đâu (monorepo → `apps/web`; polyrepo → repo frontend riêng).

## Trạng thái sau bước 4

📂

```text
docs/
├── brainstorming-session-results.md
├── project-brief.md
├── prd.md
└── front-end-spec.md               ← MỚI
```

## Câu bàn giao

`handoff_prompts.ux_to_architect`:

> *"UI/UX spec complete. Save it as `docs/front-end-spec.md` in your project, then create the fullstack architecture."*

## Bạn tự làm gì ở bước này

- [ ] Duyệt site map — thứ tự điều hướng có khớp cách bạn thực sự dùng app không?
- [ ] Kiểm **trạng thái rỗng và trạng thái lỗi** của từng component — đây là chỗ hay bị bỏ quên nhất
- [ ] Kiểm accessibility có thành yêu cầu **kiểm được** chưa (ví dụ "kiểm bằng axe-core"), hay chỉ là lời hứa
- [ ] Nếu muốn dùng v0/Lovable: chạy `*generate-ui-prompt`, sinh UI ở công cụ ngoài, rồi nói cho Architect biết ở bước sau

---

[⬅ Bước trước](./03-pm-prd.md) · [Chỉ mục](./README.md) · [Bước sau: Architect ➡](./05-architect.md)
