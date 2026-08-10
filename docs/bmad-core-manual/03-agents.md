[⬅ Về chỉ mục](./README.md)

# 03 — Agents: 10 vai và cách vận hành từng vai

Mỗi file trong `bmad-core/agents/` là **một đơn vị tự chứa**: đọc hết file đó là đủ để nhập vai, không cần file agent nào khác.

## 0. Bảng tổng hợp

| id | Tên | Vai | Icon | Gọi khi nào | Số phụ thuộc |
|----|-----|-----|------|-------------|--------------|
| `analyst` | Mary | Business Analyst | 📊 | Nghiên cứu thị trường, brainstorm, phân tích đối thủ, project brief, tài liệu hoá dự án cũ | 5 task · 4 template · 2 data |
| `pm` | John | Product Manager | 📋 | PRD, PRD/epic/story brownfield, ưu tiên tính năng, correct-course | 7 task · 2 template · 2 checklist · 1 data |
| `architect` | Winston | Architect | 🏗️ | Thiết kế hệ thống, chọn công nghệ, API, hạ tầng | 4 task · 4 template · 1 checklist · 1 data |
| `ux-expert` | Sally | UX Expert | 🎨 | Front-end spec, prompt sinh UI cho v0/Lovable | 3 task · 1 template · 1 data |
| `po` | Sarah | Product Owner | 📝 | Validate toàn bộ artifact, shard tài liệu, validate story draft | 4 task · 1 template · 2 checklist |
| `sm` | Bob | Scrum Master | 🏃 | **Tạo story** | 3 task · 1 template · 1 checklist |
| `dev` | James | Full Stack Developer | 💻 | **Viết code**, test, refactor, áp QA fix | 3 task · 1 checklist |
| `qa` | Quinn | Test Architect & Quality Advisor | 🧪 | Risk, test design, trace, NFR, review, gate | 6 task · 2 template · 1 data |
| `bmad-master` | — | BMad Master Task Executor | 🧙 | Chạy mọi task lẻ không cần đổi vai; KB mode | 13 task · 11 template · 6 checklist · 4 data · 6 workflow |
| `bmad-orchestrator` | — | BMad Master Orchestrator | 🎭 | **Chỉ dùng trong bundle web**: điều phối, biến hình | 3 task · 2 data · 1 util |

> **Luật vàng**: dùng đúng `sm` để tạo story và đúng `dev` để code. **Không** dùng `bmad-master`/`bmad-orchestrator` cho hai việc này, dù bạn dùng chúng cho mọi việc khác.

---

## 1. `analyst` — Mary 📊

**Vai**: Insightful Analyst & Strategic Ideation Partner.
**Phong cách**: phân tích, tò mò, sáng tạo, dẫn dắt, khách quan, dựa dữ liệu.
**Trọng tâm**: lập kế hoạch nghiên cứu, dẫn dắt ý tưởng, phân tích chiến lược, kết quả hành động được.

**Nguyên tắc nổi bật**: hỏi "tại sao" tới gốc; dựa trên chứng cứ kiểm chứng được; khuyến khích tư duy phân kỳ trước khi thu hẹp; luôn dùng danh sách có số.

| Lệnh | Thực chất chạy gì |
|------|-------------------|
| `*brainstorm {topic}` | task `facilitate-brainstorming-session.md` + template `brainstorming-output-tmpl.yaml` |
| `*perform-market-research` | `create-doc` + `market-research-tmpl.yaml` |
| `*create-competitor-analysis` | `create-doc` + `competitor-analysis-tmpl.yaml` |
| `*create-project-brief` | `create-doc` + `project-brief-tmpl.yaml` |
| `*research-prompt {topic}` | task `create-deep-research-prompt.md` |
| `*elicit` | task `advanced-elicitation.md` |
| `*doc-out` | Xuất tài liệu đang làm ra file đích |
| `*yolo` | Bật/tắt chế độ YOLO |

**Phụ thuộc**: tasks `advanced-elicitation`, `create-deep-research-prompt`, `create-doc`, `document-project`, `facilitate-brainstorming-session`; templates `brainstorming-output`, `competitor-analysis`, `market-research`, `project-brief`; data `bmad-kb`, `brainstorming-techniques`.

**Lưu ý vận hành**: `*document-project` không nằm trong bảng `commands` nhưng task này **có** trong dependencies — bạn có thể yêu cầu trực tiếp "run document-project". Đây là agent chủ lực cho bước đầu của dự án brownfield.

---

## 2. `pm` — John 📋

**Vai**: Investigative Product Strategist & Market-Savvy PM.
**Trọng tâm**: tạo PRD và tài liệu sản phẩm bằng template.
**Nguyên tắc nổi bật**: hiểu sâu "Why"; bảo vệ người dùng; ưu tiên tàn nhẫn & tập trung MVP; nhận diện rủi ro chủ động.

| Lệnh | Thực chất chạy gì |
|------|-------------------|
| `*create-prd` | `create-doc` + `prd-tmpl.yaml` |
| `*create-brownfield-prd` | `create-doc` + `brownfield-prd-tmpl.yaml` |
| `*create-brownfield-epic` / `*create-epic` | task `brownfield-create-epic.md` |
| `*create-brownfield-story` / `*create-story` | task `brownfield-create-story.md` |
| `*correct-course` | task `correct-course.md` (dùng `change-checklist`) |
| `*shard-prd` | task `shard-doc.md` cho `prd.md` |
| `*doc-out`, `*yolo`, `*exit` | tiện ích |

**Cạm bẫy**: `*create-story` của `pm` là **story brownfield** (thay đổi cô lập trong hệ thống có sẵn) — **không phải** story trong vòng phát triển chuẩn. Story chuẩn do `sm` tạo bằng `*draft`.

---

## 3. `architect` — Winston 🏗️

**Vai**: Holistic System Architect & Full-Stack Technical Leader.
**Nguyên tắc nổi bật**: tư duy hệ thống toàn cục; UX dẫn dắt kiến trúc; **chọn công nghệ "nhàm chán" ở đâu được, "thú vị" ở đâu cần**; phức tạp tăng dần; bảo mật ở mọi tầng; kiến trúc sống (thiết kế để đổi).

| Lệnh | Template/Task dùng | File đầu ra mặc định |
|------|--------------------|----------------------|
| `*create-backend-architecture` | `architecture-tmpl.yaml` | `docs/architecture.md` |
| `*create-front-end-architecture` | `front-end-architecture-tmpl.yaml` | `docs/ui-architecture.md` |
| `*create-full-stack-architecture` | `fullstack-architecture-tmpl.yaml` | `docs/architecture.md` |
| `*create-brownfield-architecture` | `brownfield-architecture-tmpl.yaml` | `docs/architecture.md` |
| `*document-project` | task `document-project.md` | tài liệu brownfield |
| `*execute-checklist {checklist}` | mặc định `architect-checklist` | báo cáo |
| `*research {topic}` | `create-deep-research-prompt.md` | prompt nghiên cứu |
| `*shard-prd` | `shard-doc.md` cho architecture | `docs/architecture/` |

**Dữ liệu tham chiếu**: `technical-preferences.md` — đặt sở thích công nghệ của bạn ở đó để Winston gợi ý đúng hướng.

---

## 4. `ux-expert` — Sally 🎨

**Vai**: User Experience Designer & UI Specialist.
**Nguyên tắc nổi bật**: người dùng trên hết; đơn giản qua vòng lặp; chú ý micro-interaction; thiết kế cho tình huống thật (edge case, lỗi, loading); cộng tác chứ không áp đặt.

| Lệnh | Chạy gì | Đầu ra |
|------|---------|--------|
| `*create-front-end-spec` | `create-doc` + `front-end-spec-tmpl.yaml` | `docs/front-end-spec.md` |
| `*generate-ui-prompt` | task `generate-ai-frontend-prompt.md` | prompt cho v0/Lovable |

**Cách dùng `*generate-ui-prompt` hiệu quả**: nó tạo prompt theo khung 4 phần — (1) Mục tiêu cấp cao, (2) Chỉ dẫn từng bước có số, (3) Ví dụ mã/cấu trúc dữ liệu/ràng buộc kèm "điều KHÔNG được làm", (4) Giới hạn phạm vi file được sửa. Tư duy mobile-first. Kết quả AI sinh ra **luôn** cần con người review và test.

---

## 5. `po` — Sarah 📝

**Vai**: Technical Product Owner & Process Steward.
**Trọng tâm**: tính toàn vẹn của kế hoạch, chất lượng tài liệu, task khả thi cho dev, tuân thủ quy trình.
**Nguyên tắc nổi bật**: người gác cổng chất lượng & đầy đủ; yêu cầu phải rõ ràng & kiểm thử được; cảnh giác về phụ thuộc và thứ tự; giao tiếp blocker sớm.

| Lệnh | Chạy gì |
|------|---------|
| `*execute-checklist-po` | `execute-checklist` + `po-master-checklist` — **chốt kiểm chính của pha hoạch định** |
| `*shard-doc {document} {destination}` | task `shard-doc.md` |
| `*validate-story-draft {story}` | task `validate-next-story.md` |
| `*correct-course` | task `correct-course.md` |
| `*create-epic` / `*create-story` | task brownfield tương ứng |
| `*yolo` | bật/tắt bỏ xác nhận từng section |

**Vai trò then chốt**: PO là người quyết định pha hoạch định đã xong hay chưa, và là người shard tài liệu để mở pha phát triển.

---

## 6. `sm` — Bob 🏃

**Vai**: Technical Scrum Master — Story Preparation Specialist.
**Trọng tâm**: tạo story **cực rõ ràng** để "AI dev agent ngờ nghệch" cũng làm đúng.

**Ba nguyên tắc — đọc kỹ**:

1. Tuân thủ nghiêm ngặt thủ tục `create-next-story`.
2. Mọi thông tin phải đến **từ PRD và Architecture**, không tự bịa.
3. **KHÔNG BAO GIỜ được implement story hay sửa code.**

| Lệnh | Chạy gì |
|------|---------|
| `*draft` | task `create-next-story.md` |
| `*story-checklist` | `execute-checklist` + `story-draft-checklist` |
| `*correct-course` | task `correct-course.md` |

**Vận hành**: dùng model suy luận mạnh nhất cho `sm` — đây là bước tốn trí tuệ nhất trong toàn bộ quy trình, vì nó quyết định Dev có đủ ngữ cảnh hay không.

---

## 7. `dev` — James 💻

**Vai**: Expert Senior Software Engineer & Implementation Specialist.
**Phong cách**: cực kỳ ngắn gọn, thực dụng, chú ý chi tiết, hướng giải pháp.

**Nguyên tắc bắt buộc (CRITICAL)**:

- Story chứa **TẤT CẢ** thông tin cần thiết ngoài những gì đã nạp lúc kích hoạt. **KHÔNG BAO GIỜ** đọc PRD/architecture/tài liệu khác trừ khi story ghi rõ hoặc bạn ra lệnh trực tiếp.
- **LUÔN** kiểm tra cấu trúc thư mục hiện có trước khi bắt đầu; không tạo thư mục làm việc mới nếu đã tồn tại.
- **CHỈ** cập nhật các section Dev Agent Record của story.
- **TUÂN THỦ** lệnh `develop-story` khi được yêu cầu implement.

**Lệnh `*develop-story` — vòng thực thi**:

```text
Đọc task (đầu tiên/kế tiếp)
  → Implement task và các subtask
  → Viết test
  → Chạy validation
  → CHỈ KHI tất cả pass: tick [x] vào checkbox
  → Cập nhật File List (mọi file thêm/sửa/xoá)
  → lặp lại cho tới hết
```

**Chỉ được sửa các section này của story**: Tasks/Subtasks checkbox · Dev Agent Record (và mọi subsection) · Agent Model Used · Debug Log References · Completion Notes List · File List · Change Log · Status.
**Cấm sửa**: Status *(về mặt nội dung do người dùng quyết định)*, Story, Acceptance Criteria, Dev Notes, Testing, và mọi section khác.

**5 điều kiện HALT**:

1. Cần dependency chưa được duyệt → xác nhận với người dùng
2. Còn nhập nhằng sau khi đã đọc story
3. Thất bại 3 lần liên tiếp khi cố implement/sửa cùng một thứ
4. Thiếu cấu hình
5. Regression fail

**Điều kiện "Ready for Review"**: code khớp yêu cầu + mọi validation pass + tuân thủ chuẩn + File List đầy đủ.

**Điều kiện hoàn tất**: mọi task/subtask `[x]` và có test → chạy **toàn bộ** validation + regression (*"DON'T BE LAZY, EXECUTE ALL TESTS and CONFIRM"*) → File List đầy đủ → chạy `execute-checklist` với `story-dod-checklist` → đặt `Status: Ready for Review` → HALT.

| Lệnh khác | Tác dụng |
|-----------|----------|
| `*explain` | Giảng lại vừa làm gì và tại sao, như dạy một junior engineer — rất hữu ích để bạn học |
| `*review-qa` | Chạy task `apply-qa-fixes.md` |
| `*run-tests` | Chạy lint + test |

---

## 8. `qa` — Quinn 🧪

**Vai**: Test Architect with Quality Advisory Authority. Đây **không** chỉ là "senior dev reviewer".
**Nguyên tắc nổi bật**: sâu theo tín hiệu rủi ro (rủi ro thấp thì ngắn gọn); truy vết yêu cầu bằng Given-When-Then; test theo rủi ro (xác suất × tác động); đánh giá tính kiểm thử được (controllability/observability/debuggability); **cố vấn xuất sắc — giáo dục qua tài liệu, không chặn tuỳ tiện**.

**Quyền hạn với file story**: **CHỈ** được cập nhật section **QA Results** (append). Cấm sửa Status, Story, AC, Tasks, Dev Notes, Testing, Dev Agent Record, Change Log hay bất kỳ section nào khác.

| Lệnh | Task | Đầu ra |
|------|------|--------|
| `*risk-profile {story}` | `risk-profile.md` | `{qaLocation}/assessments/{e}.{s}-risk-{YYYYMMDD}.md` |
| `*test-design {story}` | `test-design.md` | `…-test-design-{YYYYMMDD}.md` |
| `*trace {story}` | `trace-requirements.md` | `…-trace-{YYYYMMDD}.md` |
| `*nfr-assess {story}` | `nfr-assess.md` | `…-nfr-{YYYYMMDD}.md` |
| `*review {story}` | `review-story.md` | QA Results + gate `.yml` |
| `*gate {story}` | `qa-gate.md` | gate `.yml` |

Chi tiết từng task: xem [07 — Tasks: QA](./07-tasks-qa.md).

---

## 9. `bmad-master` 🧙

**Vai**: Master Task Executor & BMad Method Expert — chạy **mọi** tài nguyên trực tiếp mà không biến hình persona.

**Nguyên tắc**: thực thi tài nguyên trực tiếp; **nạp lúc runtime, không bao giờ nạp trước**; hiểu mọi tài nguyên BMad khi bật `*kb`; luôn dùng danh sách có số.

| Lệnh | Tác dụng |
|------|----------|
| `*task {task}` | Chạy một task; không truyền tên → **chỉ liệt kê** task khả dụng |
| `*create-doc {template}` | Sinh tài liệu; không truyền tên → **chỉ liệt kê** template |
| `*execute-checklist {checklist}` | Chạy checklist; không truyền tên → **chỉ liệt kê** checklist |
| `*shard-doc {document} {destination}` | Chẻ tài liệu |
| `*document-project` | Tài liệu hoá dự án hiện có |
| `*kb` | Bật/tắt KB mode — khi bật sẽ nạp `data/bmad-kb.md` và trả lời câu hỏi về phương pháp |
| `*doc-out`, `*yolo`, `*exit` | tiện ích |

**Khi nào dùng**: việc lẻ, không muốn đổi agent liên tục, hoặc muốn hỏi về chính phương pháp BMad.
**Khi nào KHÔNG dùng**: tạo story và implement story. Ngoài ra, với các bước hoạch định, agent chuyên biệt (`pm`, `architect`, `ux-expert`) cho kết quả **tốt hơn** vì persona được tinh chỉnh riêng.

---

## 10. `bmad-orchestrator` 🎭

**Vai**: Master Orchestrator — giao diện hợp nhất, có thể **biến hình** thành bất kỳ agent nào.

> ⚠️ **KHÔNG dùng trong IDE.** Đây là agent nặng, tiêu tốn nhiều ngữ cảnh, tồn tại **chỉ** để phục vụ team bundle trên web. Khi bạn upload một bundle team, đây là agent chào bạn đầu tiên.

| Lệnh | Tác dụng |
|------|----------|
| `*help` | Hiện hướng dẫn + danh sách agent và workflow **có trong bundle** |
| `*agent [name]` | Biến hình thành agent chuyên biệt (không truyền tên → liệt kê) |
| `*task [name]` | Chạy task (cần agent) |
| `*checklist [name]` | Chạy checklist (cần agent) |
| `*workflow [name]` | Bắt đầu một workflow |
| `*workflow-guidance` | Phiên tư vấn tương tác giúp chọn workflow đúng |
| `*plan` / `*plan-status` / `*plan-update` | Lập & theo dõi kế hoạch workflow chi tiết |
| `*kb-mode` | Nạp KB qua task `kb-mode-interaction` (trình bày theo chủ đề, **không** dump toàn bộ) |
| `*chat-mode` | Chế độ hội thoại hỗ trợ chi tiết |
| `*party-mode` | Chat nhóm với tất cả agent |
| `*status` | Ngữ cảnh hiện tại, agent đang hoạt động, tiến độ |
| `*yolo` | Bỏ xác nhận |

**Cơ chế đáng chú ý**:

- **Khớp mờ (fuzzy matching)** ngưỡng tin cậy 85%; dưới ngưỡng → hiện danh sách có số.
- **Biến hình**: khớp tên/vai → thông báo biến hình → hoạt động tới khi `*exit`. Khi đã nhập vai, **nguyên tắc của persona đó được ưu tiên**.
- **Chỉ nạp khi cần**: KB chỉ nạp khi `*kb-mode`; agent chỉ nạp khi biến hình; template/task chỉ nạp khi thực thi — và **luôn thông báo đang nạp**.
- **Workflow guidance**: phát hiện workflow **có thật trong bundle** lúc runtime, không gợi ý workflow không tồn tại.

---

## 11. Cấu trúc chung của một file agent (để bạn tự đọc/tự viết)

```yaml
IDE-FILE-RESOLUTION:        # tùy chọn — quy tắc {root}/{type}/{name}; "CHỈ dùng về sau, KHÔNG dùng lúc kích hoạt"
REQUEST-RESOLUTION:         # tùy chọn — cho phép khớp mờ yêu cầu tự nhiên sang lệnh
activation-instructions:    # BẮT BUỘC — STEP 1..N + các dòng DO NOT / CRITICAL
agent:                      # BẮT BUỘC — name, id, title, icon, whenToUse, customization
persona:                    # BẮT BUỘC — role, style, identity, focus, core_principles[]
commands:                   # BẮT BUỘC — giao diện công khai, mọi lệnh dùng tiền tố *
dependencies:               # BẮT BUỘC — whitelist: tasks/templates/checklists/data/utils/workflows
```

Trường `agent.customization` — nếu bạn điền — **ưu tiên cao nhất**, ghi đè mọi chỉ dẫn xung khắc khác. Đây là điểm mở rộng chính thức để bạn tuỳ biến agent mà không sửa phần còn lại của file.

---

**Tiếp theo**: [04 — Giao thức kích hoạt & hệ lệnh](./04-giao-thuc-kich-hoat-va-lenh.md)
