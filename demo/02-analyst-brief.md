[⬅ Bước trước](./01-cai-dat.md) · [Chỉ mục](./README.md) · [Bước sau ➡](./03-pm-prd.md)

# Bước 2 — Analyst: brainstorm + Project Brief

## 2.1 Kích hoạt agent

```text
👤 Bạn: @analyst
```

### Agent nạp gì

| Thứ tự | File | Vì sao |
|---|---|---|
| 1 | `.bmad-core/agents/analyst.md` | Toàn bộ persona — **đọc hết, không đọc một phần** |
| 2 | `.bmad-core/core-config.yaml` | STEP 3: phải đọc **trước khi** chào |

**Không** nạp gì khác. Task/template chỉ nạp khi bạn ra lệnh.

### Agent trả lời

```text
🤖 Xin chào! Tôi là Mary 📊 — Business Analyst.

Tôi là đối tác phân tích chiến lược của bạn: nghiên cứu thị trường, dẫn dắt
brainstorming, phân tích đối thủ, và soạn project brief.

Các lệnh khả dụng:

  1. *help                          — hiện danh sách này
  2. *brainstorm {topic}            — dẫn dắt phiên brainstorming có cấu trúc
  3. *create-competitor-analysis    — báo cáo phân tích đối thủ
  4. *create-project-brief          — tài liệu nền của dự án
  5. *perform-market-research       — báo cáo nghiên cứu thị trường
  6. *research-prompt {topic}       — tạo prompt nghiên cứu sâu
  7. *elicit                        — tinh chỉnh nội dung nâng cao
  8. *doc-out                       — xuất tài liệu đang làm
  9. *yolo                          — bật/tắt chế độ YOLO
 10. *exit                          — thoát vai Business Analyst

Chọn số hoặc gõ lệnh.
```

Rồi agent **DỪNG**, đợi bạn.

⚙️ **Cơ chế**: đây là `activation-instructions` STEP 4 — chào + tự chạy `*help` + HALT. Nếu agent tự nhảy vào làm việc gì đó, nó đã vi phạm giao thức.

---

## 2.2 Brainstorm

```text
👤 Bạn: *brainstorm "app web ghi chi tiêu cá nhân"
```

### Agent nạp thêm

```text
.bmad-core/tasks/facilitate-brainstorming-session.md    ← thủ tục
.bmad-core/data/brainstorming-techniques.md             ← 20 kỹ thuật
.bmad-core/templates/brainstorming-output-tmpl.yaml     ← khuôn ghi kết quả
```

### Diễn biến

```text
🤖 Trước khi bắt đầu, tôi cần rõ 4 điều:

  1. Chủ đề cụ thể là gì?
  2. Có ràng buộc nào không (thời gian, ngân sách, công nghệ)?
  3. Mục tiêu: khám phá rộng hay thu hẹp vào một hướng?
  4. Bạn có muốn tôi ghi kết quả ra tài liệu không? (mặc định: có)

👤 1. App ghi chi tiêu cá nhân. 2. Làm trong 2-3 tuần, một mình.
   3. Khám phá rộng trước rồi thu hẹp. 4. Có.

🤖 Tôi sẽ dùng cách tiếp cận nào? Chọn một:

  1. Tôi chọn kỹ thuật phù hợp và dẫn bạn qua từng bước
  2. Bạn chọn kỹ thuật từ danh sách 20 kỹ thuật
  3. Bắt đầu rộng rồi thu hẹp dần
  4. Kết hợp linh hoạt

👤 3

🤖 Tốt. Bắt đầu với **First Principles Thinking**.

Câu hỏi: khi bạn ghi một khoản chi tiêu, **điều gì thực sự làm bạn thấy có
giá trị** — bản thân việc ghi lại, hay điều bạn nhìn thấy sau khi ghi?

👤 Là điều nhìn thấy sau đó. Tôi muốn biết tháng này tiêu quá tay ở đâu.

🤖 Vậy giá trị cốt lõi không phải "ghi chép" mà là **"phát hiện chỗ tiêu quá tay"**.
Điều này đổi thứ tự ưu tiên: báo cáo/phân loại là trung tâm, form nhập liệu chỉ
là phương tiện — nó phải nhanh đến mức không gây ma sát.

Tiếp theo, một câu **What If**: nếu app chỉ được có **đúng một** màn hình,
màn hình đó là gì?

👤 Màn hình tổng quan tháng, có nút thêm nhanh.

🤖 [tiếp tục: Resource Constraints → "nếu chỉ có 3 ngày?"
    rồi Assumption Reversal → "nếu KHÔNG cần phân loại thủ công?"]
    ...
```

⚙️ **Cơ chế**: agent **dẫn dắt** chứ không brainstorm thay bạn — đây là nguyên tắc số 1 của task: *"YOU ARE A FACILITATOR: Guide the user to brainstorm, don't brainstorm for them"*. Và **một kỹ thuật một lúc**, không trộn.

### File sinh ra

📂 `docs/brainstorming-session-results.md`

```markdown
# Brainstorming Session Results

**Session Date:** 2026-08-10
**Facilitator:** Business Analyst Mary
**Participant:** Chủ dự án

## Executive Summary

**Topic:** App web ghi chi tiêu cá nhân
**Session Goals:** Khám phá rộng rồi thu hẹp vào MVP làm được trong 2–3 tuần
**Techniques Used:** First Principles · What If Scenarios · Resource Constraints · Assumption Reversal
**Total Ideas Generated:** 23

### Key Themes Identified:
- Giá trị cốt lõi là **phát hiện chỗ tiêu quá tay**, không phải việc ghi chép
- Form nhập liệu phải **không ma sát** — dưới 5 giây mỗi khoản
- Báo cáo tháng là trung tâm, không phải phụ lục
- Dùng một mình ⇒ bỏ hết tính năng chia sẻ/nhóm khỏi MVP

## Idea Categorization

### Immediate Opportunities (làm ngay được)
1. Màn hình tổng quan tháng: tổng chi + biểu đồ theo loại
2. Nút "thêm nhanh" ngay trên tổng quan (số tiền + loại, 2 field)
3. 6 loại chi mặc định, không cho tự tạo loại ở MVP
4. Đăng nhập email/mật khẩu (một người dùng vẫn cần bảo vệ dữ liệu)

### Future Innovations (cần nghiên cứu thêm)
5. Tự phân loại theo mô tả (ML nhẹ hoặc rule-based)
6. Nhập từ ảnh hoá đơn (OCR)
7. Ngân sách theo loại + cảnh báo khi gần chạm

### Moonshots
8. Kết nối API ngân hàng để tự đồng bộ giao dịch

### Insights & Learnings
- **Bỏ tính năng phân loại tự động khỏi MVP**: nghe hay nhưng chỉ 6 loại thì
  chọn tay nhanh hơn chờ đoán sai rồi sửa
- **Ràng buộc 3 ngày** cho thấy MVP thật sự chỉ cần: auth + thêm giao dịch +
  tổng quan tháng. Mọi thứ khác là "nice to have"

## Action Planning
...
```

---

## 2.3 Project Brief

```text
👤 Bạn: *create-project-brief
```

### Agent nạp thêm

```text
.bmad-core/tasks/create-doc.md                     ← ENGINE sinh tài liệu
.bmad-core/templates/project-brief-tmpl.yaml        ← khuôn (9 section)
.bmad-core/data/elicitation-methods.md              ← 25+ phương pháp tinh chỉnh
docs/brainstorming-session-results.md               ← kết quả bước trước
```

### Diễn biến — đây là chỗ bạn thấy elicitation làm việc

```text
🤖 Chế độ: Interactive. File đầu ra: docs/brief.md
   Tôi sẽ đi từng section một. Bắt đầu.

   ## Executive Summary

   ChiTieu là web app ghi chi tiêu cá nhân, tập trung vào việc giúp người dùng
   phát hiện nhanh mình đang tiêu quá tay ở đâu trong tháng. Khác với các app
   ghi chép truyền thống đặt trọng tâm vào việc nhập liệu đầy đủ, ChiTieu đặt
   báo cáo tháng làm màn hình chính và tối giản form nhập xuống 2 trường.

   Đối tượng: cá nhân tự quản lý chi tiêu, không cần chia sẻ với ai.
   Giá trị cốt lõi: từ "ghi chép" chuyển sang "nhìn ra vấn đề".

   ---
   **Rationale — vì sao tôi viết như trên:**

   - **Trade-off**: tôi cố tình đặt "phát hiện tiêu quá tay" lên trước "ghi chép
     đầy đủ", theo insight từ phiên brainstorm. Đánh đổi: nếu sau này bạn muốn
     app phục vụ mục đích kế toán chính xác, định vị này sẽ phải viết lại.
   - **Giả định**: người dùng chỉ có một người (bạn). Nếu sai, toàn bộ phần
     multi-tenant và phân quyền phải thêm vào — ảnh hưởng lớn tới kiến trúc.
   - **Quyết định đáng chú ý**: tôi KHÔNG nhắc tới phân loại tự động dù nó xuất
     hiện trong brainstorm, vì bạn đã kết luận nó không thuộc MVP.
   - **Cần bạn xác thực**: cụm "không cần chia sẻ với ai" — có chắc không bao giờ
     cần cho vợ/chồng xem cùng?

   1. Proceed to next section
   2. Expand or Contract for Audience
   3. Critique and Refine
   4. Identify Potential Risks and Unforeseen Issues
   5. Assess Alignment with Overall Goals
   6. Challenge from Critical Perspective
   7. Stakeholder Round Table
   8. Hindsight is 20/20: The 'If Only...' Reflection
   9. Tree of Thoughts Deep Dive

   Select 1-9 or just type your question/feedback:
```

Bạn chọn `6` để thử phản biện:

```text
👤 Bạn: 6

🤖 **Challenge from Critical Perspective** (áp dụng YAGNI)

Tôi đóng vai người phản biện dự án này:

1. **"Phát hiện tiêu quá tay" cần dữ liệu nhiều tháng.** Tháng đầu tiên app
   hoàn toàn vô dụng — không có gì để so sánh. Bạn đã tính chuyện đó chưa?
2. **Google Sheets làm được 90% việc này trong 30 phút.** Lý do tồn tại của
   app là gì? Nếu chỉ là "nhập nhanh hơn", đó là lý do yếu.
3. **Auth cho một người dùng là over-engineering?** Nếu chỉ bạn dùng trên máy
   bạn, một file JSON local có thể đủ — cắt được cả DB, cả auth, cả hosting.

Đề xuất cắt phạm vi (YAGNI): bỏ auth khỏi MVP, dùng local storage, chỉ giữ
form nhập + tổng quan tháng. Rút từ 3 tuần xuống 4 ngày.

  1. Apply changes and update section
  2. Return to elicitation menu
  3. Ask any questions or engage further with this elicitation

👤 Bạn: 3 — điểm 3 sai vì tôi muốn dùng trên cả điện thoại và laptop,
   nên phải có server. Điểm 1 đúng, tôi cần xử lý.

🤖 Đã hiểu. Vậy:
   - Auth + server: GIỮ, vì yêu cầu đa thiết bị. Đây là ràng buộc quan trọng
     mà brief phải nói rõ, tôi sẽ thêm vào Technical Considerations.
   - Vấn đề "tháng đầu vô dụng": tôi sẽ thêm vào Goals & Metrics một mục
     "giá trị ngay lập tức" — tổng quan tháng hiện tại vẫn hữu ích ngay cả
     khi chưa có tháng trước để so, vì nó cho thấy phân bố theo loại.

   Cập nhật section? (1 = có)

👤 Bạn: 1
```

⚙️ **Cơ chế — bạn vừa thấy 3 quy tắc cứng của `create-doc` hoạt động:**

| Quy tắc | Biểu hiện ở trên |
|---|---|
| **Rationale bắt buộc 4 nội dung** | trade-off · giả định · quyết định đáng chú ý · vùng cần xác thực |
| **Đúng 9 lựa chọn có số**, option 1 luôn là "Proceed" | danh sách 1–9, kết bằng *"Select 1-9 or just type your question/feedback:"* |
| **Option 2–9 lấy TỪ `data/elicitation-methods.md`** | "Challenge from Critical Perspective" là một phương pháp có thật trong file đó, kèm ghi chú *"Apply YAGNI principles when appropriate"* |

⚠️ Nếu agent hỏi bạn *"Bạn có muốn tôi tiếp tục không? (có/không)"* → **sai định dạng**, yêu cầu nó trình bày lại đúng 9 lựa chọn.

Quá trình lặp lại cho 8 section còn lại: Introduction → Executive Summary → Problem Statement → Proposed Solution → Target Users → Goals & Metrics → MVP Scope → Post-MVP Vision → Technical Considerations.

### File sinh ra

📂 `docs/project-brief.md` *(template mặc định ghi `docs/brief.md` — xem cảnh báo cuối trang)*

```markdown
# Project Brief: ChiTieu

## Executive Summary
ChiTieu là web app ghi chi tiêu cá nhân, tập trung giúp người dùng phát hiện
nhanh mình đang tiêu quá tay ở đâu trong tháng...

## Problem Statement
Người dùng hiện ghi chi tiêu bằng Google Sheets hoặc không ghi gì. Vấn đề:
- Nhập liệu trên điện thoại quá chậm (mở app, tìm sheet, gõ vào ô)
- Không có cái nhìn tổng quan tức thời theo loại chi
- Không đồng bộ được giữa điện thoại và laptop

## Proposed Solution
Web app responsive, mở là thấy ngay tổng quan tháng + nút thêm nhanh 2 trường.
Đăng nhập bằng email để đồng bộ đa thiết bị.

## Target Users
**Primary:** Cá nhân 25–40 tuổi, có thu nhập ổn định, muốn kiểm soát chi tiêu
nhưng đã từ bỏ các app phức tạp vì mất công nhập liệu.

## Goals & Success Metrics
- **Giá trị tức thời:** tổng quan tháng hữu ích ngay tháng đầu (phân bố theo loại)
- Thời gian nhập một khoản: **< 5 giây**
- Tỉ lệ ngày có ghi ít nhất 1 khoản: **> 70%** sau 1 tháng dùng

## MVP Scope
**In scope:**
1. Đăng ký / đăng nhập email + mật khẩu
2. Thêm giao dịch: số tiền + loại (6 loại cố định) + ngày
3. Sửa / xoá giao dịch
4. Danh sách giao dịch theo tháng
5. Tổng quan tháng: tổng chi + phân bố theo loại

**Out of scope (MVP):**
- Phân loại tự động, OCR hoá đơn, ngân sách + cảnh báo
- Chia sẻ / nhiều người dùng, xuất báo cáo, đa tiền tệ

## Post-MVP Vision
Ngân sách theo loại + cảnh báo → phân loại tự động → kết nối ngân hàng

## Technical Considerations
- **Ràng buộc bắt buộc:** phải đồng bộ đa thiết bị (điện thoại + laptop)
  ⇒ cần backend + auth, KHÔNG dùng local storage
- Ràng buộc thời gian: 2–3 tuần, một người làm
- Ưu tiên: dùng dịch vụ quản lý (managed) để giảm việc hạ tầng
```

## Trạng thái sau bước 2

📂

```text
chitieu/
├── .bmad-core/
├── .claude/
└── docs/
    ├── brainstorming-session-results.md    ← MỚI
    └── project-brief.md                    ← MỚI
```

## Câu bàn giao sang bước sau

Workflow `greenfield-fullstack.yaml` có sẵn câu này trong `handoff_prompts.analyst_to_pm`:

> *"Project brief is complete. Save it as `docs/project-brief.md` in your project, then create the PRD."*

## Bạn tự làm gì ở bước này

- [ ] Trả lời 4 câu hỏi setup của brainstorming
- [ ] Ở mỗi section: đọc rationale, chọn `1` nếu đồng ý, chọn `2–9` nếu muốn đào sâu, hoặc gõ góp ý trực tiếp
- [ ] **Đọc lại brief** trước khi sang PM — brief sai thì PRD sai theo
- [ ] Lưu file đúng tên `docs/project-brief.md`

---

⚠️ **Cảnh báo tên file**: `project-brief-tmpl.yaml` khai báo `output.filename: docs/brief.md`, nhưng workflow và các handoff prompt đều nói `docs/project-brief.md`. Chọn **một** tên và dùng nhất quán. Demo dùng `docs/project-brief.md`.

---

[⬅ Bước trước](./01-cai-dat.md) · [Chỉ mục](./README.md) · [Bước sau: PM tạo PRD ➡](./03-pm-prd.md)
