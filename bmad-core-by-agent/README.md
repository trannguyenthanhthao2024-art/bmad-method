# `bmad-core` sắp xếp theo agent

Thư mục này là **bản copy** của `bmad-core/` + `common/`, được sắp xếp lại theo **chức năng của từng agent** để bạn xem một chỗ, không phải nhảy qua lại giữa các thư mục.

> ⚠️ **Đây chỉ là bản để đọc.** Framework vẫn chạy từ `bmad-core/` gốc — thư mục đó **không bị thay đổi gì**. Đừng sửa file ở đây và mong framework nhận thay đổi.

## Nguyên tắc sắp xếp

1. Mỗi agent có **một thư mục riêng**, chứa: file agent (`AGENT-<id>.md`) + toàn bộ `tasks/`, `templates/`, `checklists/`, `data/`, `utils/`, `workflows/` mà agent đó khai báo trong `dependencies`.
2. File dùng chung ở nhiều agent được **nhân bản** vào từng thư mục (không phải symlink, không di chuyển) — ví dụ `create-doc.md` có mặt trong 6 thư mục.
3. Tài nguyên **không thuộc riêng agent nào** (cấu hình, team, workflow, util) nằm ở `00-shared-dung-chung/`.
4. Dependency được trích **tự động từ chính block YAML của file agent**, không nhập tay.

## Số liệu kiểm chứng

| Chỉ số | Giá trị |
|---|---|
| File nguồn (`bmad-core/` + `common/`) | **74** |
| File nguồn đã được sắp xếp | **74** (100%) |
| File nguồn **bị bỏ sót** | **0** |
| Tổng số bản copy trong cây này | **141** |
| Bản copy khớp hash SHA-256 với file gốc | **141 / 141** |
| File gốc bị thay đổi | **0** |

Bao gồm cả 3 file bản dịch tiếng Việt mới thêm vào repo: `agents/analyst_vn.md`, `agents/pm_vn.md`, `tasks/shard-doc_vn.md`.

## Bảng thư mục

| Thư mục | Agent | Tài nguyên |
|---|---|---|
| [`00-shared-dung-chung/`](./00-shared-dung-chung/) | — (dùng chung) | 1 config · 4 agent-teams · 6 workflows · 2 utils |
| [`01-analyst-mary-business-analyst/`](./01-analyst-mary-business-analyst/) | Mary 📊 Business Analyst | 5 tasks · 4 templates · 2 data · +bản dịch `AGENT-analyst_vn.md` |
| [`02-pm-john-product-manager/`](./02-pm-john-product-manager/) | John 📋 Product Manager | 9 tasks · 2 templates · 2 checklists · 1 data · +bản dịch `AGENT-pm_vn.md` |
| [`03-architect-winston/`](./03-architect-winston/) | Winston 🏗️ Architect | 4 tasks · 4 templates · 1 checklist · 1 data |
| [`04-ux-expert-sally/`](./04-ux-expert-sally/) | Sally 🎨 UX Expert | 3 tasks · 1 template · 1 data |
| [`05-po-sarah-product-owner/`](./05-po-sarah-product-owner/) | Sarah 📝 Product Owner | 5 tasks · 1 template · 2 checklists |
| [`06-sm-bob-scrum-master/`](./06-sm-bob-scrum-master/) | Bob 🏃 Scrum Master | 4 tasks · 1 template · 1 checklist |
| [`07-dev-james-developer/`](./07-dev-james-developer/) | James 💻 Full Stack Developer | 3 tasks · 1 checklist |
| [`08-qa-quinn-test-architect/`](./08-qa-quinn-test-architect/) | Quinn 🧪 Test Architect | 6 tasks · 2 templates · 3 data |
| [`09-bmad-master/`](./09-bmad-master/) | 🧙 BMad Master | 14 tasks · 11 templates · 6 checklists · 4 data · 6 workflows |
| [`10-bmad-orchestrator/`](./10-bmad-orchestrator/) | 🎭 BMad Orchestrator | 3 tasks · 2 data · 1 util |

---

## Nội dung từng thư mục

### `00-shared-dung-chung/` — không thuộc riêng agent nào

```text
core-config.yaml                     ← bản đồ dự án, MỌI agent đọc khi kích hoạt
agent-teams/  team-all · team-fullstack · team-ide-minimal · team-no-ui
workflows/    greenfield-{fullstack,service,ui} · brownfield-{fullstack,service,ui}
utils/        bmad-doc-template.md (đặc tả cú pháp template)
              workflow-management.md (quản lý workflow cho orchestrator)
```

`core-config.yaml` **cố ý chỉ để ở đây** thay vì nhân bản vào 10 thư mục, vì nó là một file duy nhất mà mọi agent đều đọc — nhân bản 10 lần chỉ gây nhầm lẫn về việc đâu là bản thật.

### `01-analyst-mary-business-analyst/`

```text
AGENT-analyst.md
AGENT-analyst_vn.md   ← bản dịch tiếng Việt
tasks/      advanced-elicitation · create-deep-research-prompt · create-doc
            document-project · facilitate-brainstorming-session
templates/  brainstorming-output · competitor-analysis · market-research · project-brief
data/       bmad-kb · brainstorming-techniques
```

### `02-pm-john-product-manager/`

```text
AGENT-pm.md
AGENT-pm_vn.md        ← bản dịch tiếng Việt
tasks/       brownfield-create-epic · brownfield-create-story · correct-course
             create-deep-research-prompt · create-doc · execute-checklist · shard-doc
             create-brownfield-story ⚠️(bổ sung thủ công — xem mục Ghi chú)
             shard-doc_vn ⚠️(bản dịch, bổ sung thủ công)
templates/   brownfield-prd · prd
checklists/  change-checklist · pm-checklist
data/        technical-preferences
```

### `03-architect-winston/`

```text
AGENT-architect.md
tasks/       create-deep-research-prompt · create-doc · document-project · execute-checklist
templates/   architecture · brownfield-architecture · front-end-architecture · fullstack-architecture
checklists/  architect-checklist
data/        technical-preferences
```

### `04-ux-expert-sally/` — agent UI/UX

```text
AGENT-ux-expert.md
tasks/       create-doc · execute-checklist · generate-ai-frontend-prompt
templates/   front-end-spec
data/        technical-preferences
```

### `05-po-sarah-product-owner/`

```text
AGENT-po.md
tasks/       correct-course · execute-checklist · shard-doc · validate-next-story
             shard-doc_vn ⚠️(bản dịch, bổ sung thủ công)
templates/   story
checklists/  change-checklist · po-master-checklist
```

### `06-sm-bob-scrum-master/`

```text
AGENT-sm.md
tasks/       correct-course · create-next-story · execute-checklist
             create-brownfield-story ⚠️(bổ sung thủ công)
templates/   story
checklists/  story-draft-checklist
```

### `07-dev-james-developer/`

```text
AGENT-dev.md
tasks/       apply-qa-fixes · execute-checklist · validate-next-story
checklists/  story-dod-checklist
```

> Thư mục gọn nhất — **đúng thiết kế**: nguyên tắc "Dev agent phải gọn" (`docs/GUIDING-PRINCIPLES.md`). Ngữ cảnh kỹ thuật được nén vào file story thay vì vào agent.
> Dev agent còn nạp thêm 3 file **của dự án bạn** (không thuộc `bmad-core`): `docs/architecture/coding-standards.md`, `tech-stack.md`, `source-tree.md` — theo `devLoadAlwaysFiles` trong `core-config.yaml`.

### `08-qa-quinn-test-architect/`

```text
AGENT-qa.md
tasks/       nfr-assess · qa-gate · review-story · risk-profile · test-design · trace-requirements
templates/   qa-gate · story
data/        technical-preferences
             test-levels-framework ⚠️(bổ sung thủ công)
             test-priorities-matrix ⚠️(bổ sung thủ công)
```

### `09-bmad-master/`

Thư mục lớn nhất (40 file) — agent này chạy được mọi tài nguyên. Gồm gần như toàn bộ `bmad-core`, **trừ** các task riêng của QA (`nfr-assess`, `qa-gate`, `review-story`, `risk-profile`, `test-design`, `trace-requirements`), `apply-qa-fixes`, `validate-next-story`, `kb-mode-interaction`, `create-brownfield-story`, và template `qa-gate`.

### `10-bmad-orchestrator/`

```text
AGENT-bmad-orchestrator.md
tasks/   advanced-elicitation · create-doc · kb-mode-interaction
data/    bmad-kb · elicitation-methods
utils/   workflow-management
```

---

## Ma trận: file nào dùng ở những agent nào

Các file được nhân bản nhiều nhất (đây là lý do phải copy chứ không di chuyển):

| File nguồn | Số bản | Có mặt ở |
|---|:--:|---|
| `common/tasks/execute-checklist.md` | 7 | pm · architect · ux-expert · po · sm · dev · bmad-master |
| `common/tasks/create-doc.md` | 6 | analyst · pm · architect · ux-expert · bmad-master · orchestrator |
| `data/technical-preferences.md` | 5 | pm · architect · ux-expert · qa · bmad-master |
| `tasks/correct-course.md` | 4 | pm · po · sm · bmad-master |
| `tasks/create-deep-research-prompt.md` | 4 | analyst · pm · architect · bmad-master |
| `templates/story-tmpl.yaml` | 4 | po · sm · qa · bmad-master |
| `data/bmad-kb.md` | 3 | analyst · bmad-master · orchestrator |
| `tasks/advanced-elicitation.md` | 3 | analyst · bmad-master · orchestrator |
| `tasks/document-project.md` | 3 | analyst · architect · bmad-master |
| `tasks/shard-doc.md` | 3 | pm · po · bmad-master |
| `checklists/change-checklist.md` | 3 | pm · po · bmad-master |
| 6 file `workflows/*.yaml` | 2 | 00-shared · bmad-master |
| `data/{brainstorming-techniques, elicitation-methods}.md` | 2 | — xem từng thư mục |
| `tasks/{brownfield-create-epic, brownfield-create-story, create-next-story, facilitate-brainstorming-session, generate-ai-frontend-prompt, validate-next-story}.md` | 2 | — xem từng thư mục |
| `checklists/{architect, pm, po-master, story-dod, story-draft}-checklist.md` | 2 | — xem từng thư mục |
| 10 file `templates/*.yaml` | 2 | agent chủ + bmad-master |
| `utils/workflow-management.md` | 2 | 00-shared · orchestrator |

---

## Ghi chú: 7 file KHÔNG được agent nào khai báo

Trong quá trình sắp xếp, script phát hiện 7 file nằm trong `bmad-core` nhưng **không xuất hiện trong `dependencies` của bất kỳ agent nào**. Chúng vẫn được đưa vào thư mục hợp lý theo chức năng (đánh dấu ⚠️ "bổ sung thủ công"), nên **không có file nào bị bỏ sót**.

**Ba file bản dịch tiếng Việt** (mới thêm vào repo, chưa được nối vào hệ thống dependency):

| File | Đã đặt vào | Ghi chú |
|---|---|---|
| `agents/analyst_vn.md` | `01-analyst/AGENT-analyst_vn.md` | Bản dịch của `analyst.md`. Muốn gọi được trong IDE, cần chạy lại installer để sinh command cho agent id `analyst_vn` |
| `agents/pm_vn.md` | `02-pm/AGENT-pm_vn.md` | Bản dịch của `pm.md`, tương tự trên |
| `tasks/shard-doc_vn.md` | `02-pm` · `05-po` · `09-bmad-master` (`tasks/`) | Bản dịch của `shard-doc.md`. Chưa agent nào khai báo — muốn dùng qua lệnh, thêm vào `dependencies.tasks` của `pm.md`/`po.md` |

**Bốn file gốc chưa được khai báo:**

| File | Vấn đề | Đã đặt vào | Lý do |
|---|---|---|---|
| `tasks/create-brownfield-story.md` | Không agent nào khai báo | `02-pm` + `06-sm` | Nội dung task là tạo story brownfield khi tài liệu không chuẩn v4 → thuộc chức năng SM/PM. Muốn dùng được qua lệnh, phải thêm vào `dependencies.tasks` của `sm.md` hoặc `pm.md` |
| `data/test-levels-framework.md` | Không agent nào khai báo, dù `test-design.md` **yêu cầu** nạp nó | `08-qa` | `qa.md` chỉ khai báo `data: technical-preferences.md`. Nếu chạy `*design` mà không có file này trong ngữ cảnh, agent sẽ tự bịa tiêu chí chọn mức test |
| `data/test-priorities-matrix.md` | Không agent nào khai báo, dù `test-design.md` **yêu cầu** nạp nó | `08-qa` | Tương tự trên — thiếu file này thì phân loại P0/P1/P2/P3 sẽ không theo chuẩn |
| `common/utils/bmad-doc-template.md` | Không agent nào khai báo | `00-shared/utils` | Là **đặc tả cú pháp template**, dành cho người viết template đọc, không phải tài nguyên runtime của agent |

**Khuyến nghị nếu bạn muốn sửa gốc**: thêm vào `bmad-core/agents/qa.md`

```yaml
dependencies:
  data:
    - technical-preferences.md
    - test-levels-framework.md      # thêm
    - test-priorities-matrix.md     # thêm
```

để hai file này tự động có trong web bundle và trong ngữ cảnh của QA agent.

---

## Cách dùng thư mục này

| Bạn muốn | Làm gì |
|---|---|
| Hiểu một agent làm việc thế nào | Mở thư mục của agent đó, đọc `AGENT-*.md` trước, rồi các `tasks/` |
| Chạy agent thủ công với LLM | Dán `AGENT-*.md` + `00-shared/core-config.yaml` + file trong `tasks/`, `templates/`, `data/` mà lệnh cần |
| Biết dán những file nào | Xem [`../docs/bmad-core-manual/13-cong-thuc-van-hanh-thu-cong.md`](../docs/bmad-core-manual/13-cong-thuc-van-hanh-thu-cong.md) — có 4 "kit" copy sẵn |
| Hiểu ý nghĩa từng task/template | Xem [`../docs/bmad-core-manual/README.md`](../docs/bmad-core-manual/README.md) |
| **Thấy các agent này phối hợp thật** | [`../demo/README.md`](../demo/README.md) (dự án mới) · [`../demo-brownfield/README.md`](../demo-brownfield/README.md) (dự án đang chạy) |
| Hiểu kiến trúc/thuật toán bên dưới | [`../docs/specs/02-thiet-ke-he-thong.md`](../docs/specs/02-thiet-ke-he-thong.md) |
| Điểm vào cho mọi bộ tài liệu | [`../TAI-LIEU.md`](../TAI-LIEU.md) |
| Sửa hành vi agent thật | Sửa trong `../bmad-core/`, **không** sửa ở đây |

## Tái tạo lại thư mục này

Nếu `bmad-core/` thay đổi và bạn muốn dựng lại cây này:

```bash
node bmad-core-by-agent/_regenerate.js "<đường-dẫn-tuyệt-đối-tới-gốc-repo>"
```

Script `_regenerate.js` sẽ: xoá và tạo lại toàn bộ `bmad-core-by-agent/` → trích `dependencies` **tự động từ block YAML của từng file agent** → copy tài nguyên (tìm `bmad-core/<type>/` trước, rồi `common/<type>/`) → **kiểm tra phủ**: liệt kê mọi file trong `bmad-core/` + `common/` và báo bất kỳ file nào chưa được sắp xếp.

Danh sách "bổ sung thủ công" (4 file ở mục Ghi chú) nằm trong biến `EXTRAS` ở đầu script — sửa ở đó nếu bạn muốn đổi cách phân loại.

Lưu ý: script ghi đè `README.md` này không? **Không** — nó chỉ xoá/tạo lại các thư mục con và file copy; bạn cần tự cập nhật README nếu số liệu thay đổi. (Chạy script rồi đọc phần thống kê nó in ra.)
