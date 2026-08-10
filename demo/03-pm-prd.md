[⬅ Bước trước](./02-analyst-brief.md) · [Chỉ mục](./README.md) · [Bước sau ➡](./04-ux-spec.md)

# Bước 3 — PM: tạo PRD

Đây là tài liệu **quan trọng nhất** của pha hoạch định: nó chứa các epic và story mà SM sẽ đọc để tạo story ở pha phát triển.

## Lệnh

```text
👤 Bạn: @pm

🤖 Xin chào! Tôi là John 📋 — Product Manager.
   [hiện 12 lệnh có số]

👤 Bạn: *create-prd
```

## Agent nạp gì

| File | Vai trò |
|---|---|
| `.bmad-core/agents/pm.md` | Persona (nạp lúc kích hoạt) |
| `.bmad-core/core-config.yaml` | Bản đồ dự án (nạp lúc kích hoạt) |
| `.bmad-core/tasks/create-doc.md` | Engine sinh tài liệu |
| `.bmad-core/templates/prd-tmpl.yaml` | Khuôn: 8 section |
| `.bmad-core/data/elicitation-methods.md` | Phương pháp tinh chỉnh |
| `.bmad-core/data/technical-preferences.md` | Sở thích kỹ thuật của bạn |
| `docs/project-brief.md` | **Đầu vào chính** — bạn kéo file này vào chat hoặc agent tự đọc |

⚙️ **"Fast track"**: `bmad-kb.md` ghi rõ — có brief thì PM đi nhanh (ít câu hỏi); không có brief thì PM phải hỏi nhiều hơn để tự dựng ngữ cảnh.

## Diễn biến — 8 section

```text
🤖 Tôi đã đọc docs/project-brief.md. Vì đã có brief, tôi sẽ đi fast track.
   Chế độ: Interactive. File đầu ra: docs/prd.md

   ## Goals and Background Context
   [nội dung + rationale + 9 lựa chọn]

👤 1

   ## Requirements
   ...
```

### Section `requirements` — chỗ tạo ra FR/NFR có số

Template `prd-tmpl.yaml` dùng `prefix: FR` và `prefix: NFR` để đánh số tự động:

```text
🤖 ## Requirements

   ### Functional

   FR1: Người dùng đăng ký tài khoản bằng email và mật khẩu.
   FR2: Người dùng đăng nhập và duy trì session qua các lần mở app.
   FR3: Người dùng thêm giao dịch gồm số tiền, loại chi, ngày.
   FR4: Người dùng sửa và xoá giao dịch của chính mình.
   FR5: Hệ thống cung cấp 6 loại chi cố định: Ăn uống, Đi lại, Nhà cửa,
        Sức khoẻ, Giải trí, Khác.
   FR6: Người dùng xem danh sách giao dịch của một tháng, sắp theo ngày giảm dần.
   FR7: Người dùng xem tổng quan tháng: tổng chi và phân bố theo loại.

   ### Non Functional

   NFR1: Thao tác thêm một giao dịch hoàn tất trong dưới 5 giây trên 4G.
   NFR2: Mật khẩu được hash bằng thuật toán chuẩn; không lưu plaintext.
   NFR3: Người dùng chỉ truy cập được dữ liệu của chính mình (row-level).
   NFR4: Endpoint đăng nhập có giới hạn tần suất để chống dò mật khẩu.
   NFR5: App dùng được trên màn hình từ 360px trở lên.

   ---
   **Rationale:**
   - **Trade-off**: tôi cố định 6 loại (FR5) thay vì cho tự tạo loại. Đánh đổi
     tính linh hoạt để lấy tốc độ nhập liệu — khớp mục tiêu "< 5 giây".
   - **Giả định**: chỉ có chi, không có thu. Brief không nhắc tới thu nhập.
   - **Quyết định đáng chú ý**: NFR4 (rate limiting) tôi thêm dù brief không nêu
     — vì có endpoint đăng nhập công khai thì đây là yêu cầu bắt buộc, không
     phải tuỳ chọn.
   - **Cần xác thực**: FR5 — 6 loại này có đủ cho bạn không?

   1. Proceed to next section
   2. Critique and Refine
   ...
   Select 1-9 or just type your question/feedback:

👤 Bạn: FR5 thêm loại "Học tập". Còn lại ok.

🤖 Đã cập nhật: 7 loại (thêm Học tập). Chuyển section tiếp theo.
```

### Section `epic-details` — nơi story được sinh ra

Đây là section **repeatable lồng 3 cấp**: epic → story → acceptance criteria.

```text
🤖 ## Epic List

   - **Epic 1 — Nền tảng & Xác thực**: dựng project chạy được, có CI, người
     dùng đăng ký/đăng nhập và dữ liệu được bảo vệ.
   - **Epic 2 — Giao dịch & Báo cáo**: người dùng ghi được chi tiêu và nhìn
     thấy tổng quan tháng.

   ---
   **Rationale:**
   - **Quyết định quan trọng**: Epic 1 kết thúc bằng một app **đã deploy được và
     đăng nhập được**, chưa có tính năng nghiệp vụ nào. Đây là cố ý — mỗi epic
     phải giao được một mảnh giá trị chạy thật, và không có auth thì Epic 2
     không thể lưu dữ liệu theo người dùng.
   - **Trade-off**: có thể gộp thành 1 epic để "xong nhanh", nhưng khi đó
     không có mốc kiểm tra giữa đường.

   [9 lựa chọn]

👤 1

🤖 ## Epic 1 — Nền tảng & Xác thực

   ### Story 1.1 — Khởi tạo dự án và pipeline
   As a nhà phát triển,
   I want một dự án Next.js chạy được với TypeScript, lint, test và CI,
   so that mọi story sau đều có nền tảng nhất quán để xây tiếp.

   #### Acceptance Criteria
   1. Chạy `npm run dev` mở được trang chủ ở localhost và hiển thị tên app.
   2. Chạy `npm run lint` không có lỗi và không có cảnh báo.
   3. Chạy `npm test` thực thi được và pass với ít nhất một test mẫu.
   4. Có GitHub Actions workflow chạy lint + test trên mọi pull request.
   5. README ghi rõ cách chạy dự án ở máy local.

   ### Story 1.2 — Đăng ký và đăng nhập
   As một người dùng,
   I want đăng ký và đăng nhập bằng email + mật khẩu,
   so that dữ liệu chi tiêu của tôi được bảo vệ và đồng bộ đa thiết bị.

   #### Acceptance Criteria
   1. Người dùng đăng ký bằng email + mật khẩu; email trùng thì báo lỗi rõ ràng.
   2. Mật khẩu tối thiểu 8 ký tự, có ít nhất một chữ và một số; vi phạm thì
      hiện lỗi ngay trên form trước khi gửi.
   3. Đăng nhập đúng thì chuyển tới trang tổng quan; sai thì hiện thông báo
      không tiết lộ email có tồn tại hay không.
   4. Session được duy trì sau khi tải lại trang.
   5. Endpoint đăng nhập giới hạn 5 lần thử mỗi 15 phút cho mỗi IP.
   6. Mật khẩu không bao giờ xuất hiện trong log hay response.

   ### Story 1.3 — Bảo vệ route và đăng xuất
   ...

   ## Epic 2 — Giao dịch & Báo cáo
   ### Story 2.1 — Thêm giao dịch
   ### Story 2.2 — Danh sách, sửa, xoá giao dịch
   ### Story 2.3 — Phân loại chi
   ### Story 2.4 — Tổng quan tháng
```

⚙️ **Cơ chế — vì sao AC được viết kỹ thế**: AC trong PRD sẽ được `create-next-story` **copy nguyên văn** vào file story ở bước 7, rồi Dev dùng chúng làm điều kiện hoàn thành, rồi QA dùng chúng làm cơ sở truy vết test. AC mơ hồ ở đây ⇒ hỏng cả chuỗi phía sau.

Chú ý AC 1.2.5 và 1.2.6 — chúng chính là thứ khiến QA đánh giá story 1.2 là **rủi ro cao** ở [bước 10](./10-story-1-2-rui-ro-cao.md).

### Section `checklist-results`

Khi tới section này, agent tự chạy `pm-checklist`:

```text
🤖 ## Checklist Results Report

   Đang chạy pm-checklist (chế độ YOLO)...

   | Section                          | Pass rate |
   |----------------------------------|-----------|
   | 1. PROBLEM DEFINITION & CONTEXT  | 8/8  100% |
   | 2. MVP SCOPE DEFINITION          | 7/8   88% |
   | 3. USER EXPERIENCE REQUIREMENTS  | 5/7   71% |
   | 4. FUNCTIONAL REQUIREMENTS       | 9/9  100% |
   | 5. NON-FUNCTIONAL REQUIREMENTS   | 6/8   75% |
   | 6. EPIC & STORY STRUCTURE        | 7/7  100% |
   | 7. TECHNICAL GUIDANCE            | 4/6   67% |
   | 8. CROSS-FUNCTIONAL REQUIREMENTS | 5/6   83% |
   | 9. CLARITY & COMMUNICATION       | 6/6  100% |
   | **TỔNG**                          | **57/65  88%** |

   ❌ FAIL / ⚠️ PARTIAL đáng chú ý:
   - ⚠️ §3: chưa có yêu cầu accessibility  → UX Expert sẽ xử lý ở bước sau
   - ⚠️ §5: NFR1 "< 5 giây" chưa nêu đo ở điều kiện mạng nào  → đã sửa: thêm "trên 4G"
   - ⚠️ §7: chưa nêu ràng buộc công nghệ  → Architect sẽ quyết ở bước sau
```

## File sinh ra

📂 `docs/prd.md` — cấu trúc heading (quan trọng cho bước shard):

```text
# ChiTieu Product Requirements Document (PRD)     ← H1
## Goals and Background Context                    ← H2 → sẽ thành 1 file khi shard
## Requirements                                    ← H2 → 1 file
## User Interface Design Goals                     ← H2 → 1 file
## Technical Assumptions                           ← H2 → 1 file
## Epic List                                       ← H2 → 1 file
## Epic 1 Nền tảng & Xác thực                       ← H2 → 1 file  ⭐
## Epic 2 Giao dịch & Báo cáo                       ← H2 → 1 file  ⭐
## Checklist Results Report                        ← H2 → 1 file
## Next Steps                                      ← H2 → 1 file
```

⚙️ **Cơ chế**: `shard-doc` chẻ theo **heading cấp 2**. Vì `epicFilePattern: epic-{n}*.md` trong `core-config.yaml`, hai section Epic sẽ thành `docs/prd/epic-1-nen-tang-xac-thuc.md` và `epic-2-giao-dich-bao-cao.md` — đúng mẫu mà `create-next-story` tìm kiếm.

## Trạng thái sau bước 3

📂

```text
docs/
├── brainstorming-session-results.md
├── project-brief.md
└── prd.md                          ← MỚI: 7 FR · 5 NFR · 2 epic · 7 story
```

## Câu bàn giao

`handoff_prompts.pm_to_ux`:

> *"PRD is ready. Save it as `docs/prd.md` in your project, then create the UI/UX specification."*

## Bạn tự làm gì ở bước này

- [ ] Duyệt từng section, đặc biệt **`requirements`** và **`epic-details`**
- [ ] Kiểm AC: mỗi AC có **đo được / kiểm được** không? "App phải nhanh" là AC tồi; "< 5 giây trên 4G" là AC tốt
- [ ] Kiểm thứ tự story: story sau có phụ thuộc story trước không? Có story nào chặn story khác?
- [ ] Đọc bảng checklist — mục ⚠️ nào thuộc trách nhiệm bước sau thì để đó, mục nào của PRD thì sửa ngay
- [ ] Lưu đúng tên `docs/prd.md` (tên này được viết cứng ở nhiều task)

---

⚠️ **Cạm bẫy**: đừng để PM viết AC kiểu *"hệ thống hoạt động đúng"*. Câu hỏi kiểm tra: **QA có thể viết một test tự động để chứng minh AC này đúng/sai không?** Nếu không → AC chưa xong.

---

[⬅ Bước trước](./02-analyst-brief.md) · [Chỉ mục](./README.md) · [Bước sau: UX Spec ➡](./04-ux-spec.md)
