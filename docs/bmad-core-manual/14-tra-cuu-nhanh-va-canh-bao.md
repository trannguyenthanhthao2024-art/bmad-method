[⬅ Về chỉ mục](./README.md)

# 14 — Tra cứu nhanh & cảnh báo

## PHẦN A — TRA CỨU NHANH

### A1. Toàn bộ lệnh theo agent

```text
analyst   (Mary 📊)  *brainstorm {topic} · *perform-market-research · *create-competitor-analysis
                     *create-project-brief · *research-prompt {topic} · *elicit · *doc-out · *yolo · *exit
pm        (John 📋)  *create-prd · *create-brownfield-prd · *create-brownfield-epic · *create-epic
                     *create-brownfield-story · *create-story · *correct-course · *shard-prd
                     *doc-out · *yolo · *exit
architect (Winston 🏗️) *create-backend-architecture · *create-front-end-architecture
                     *create-full-stack-architecture · *create-brownfield-architecture
                     *document-project · *execute-checklist {checklist} · *research {topic}
                     *shard-prd · *doc-out · *yolo · *exit
ux-expert (Sally 🎨) *create-front-end-spec · *generate-ui-prompt · *exit
po        (Sarah 📝) *execute-checklist-po · *shard-doc {doc} {dest} · *validate-story-draft {story}
                     *correct-course · *create-epic · *create-story · *doc-out · *yolo · *exit
sm        (Bob 🏃)   *draft · *story-checklist · *correct-course · *exit
dev       (James 💻) *develop-story · *run-tests · *explain · *review-qa · *exit
qa        (Quinn 🧪) *risk-profile {story} · *test-design {story} · *trace {story}
                     *nfr-assess {story} · *review {story} · *gate {story} · *exit
bmad-master   (🧙)   *task {task} · *create-doc {template} · *execute-checklist {checklist}
                     *shard-doc {doc} {dest} · *document-project · *kb · *doc-out · *yolo · *exit
orchestrator  (🎭)   *help · *agent [name] · *task [name] · *checklist [name] · *workflow [name]
                     *workflow-guidance · *plan · *plan-status · *plan-update · *kb-mode
                     *chat-mode · *party-mode · *status · *doc-out · *yolo · *exit
```

**Alias QA**: `*risk`→`*risk-profile` · `*design`→`*test-design` · `*nfr`→`*nfr-assess` · `*trace`→`*trace-requirements`

### A2. Tra: tôi muốn X → dùng gì

| Tôi muốn | Agent | Lệnh | Task/Template |
|----------|-------|------|---------------|
| Brainstorm ý tưởng | analyst | `*brainstorm {topic}` | `facilitate-brainstorming-session` + `brainstorming-output-tmpl` |
| Nghiên cứu thị trường | analyst | `*perform-market-research` | `market-research-tmpl` |
| Phân tích đối thủ | analyst | `*create-competitor-analysis` | `competitor-analysis-tmpl` |
| Tài liệu nền dự án | analyst | `*create-project-brief` | `project-brief-tmpl` |
| Prompt nghiên cứu sâu | analyst/architect | `*research-prompt` / `*research` | `create-deep-research-prompt` |
| PRD mới | pm | `*create-prd` | `prd-tmpl` |
| PRD cho hệ thống có sẵn | pm | `*create-brownfield-prd` | `brownfield-prd-tmpl` |
| Spec UI/UX | ux-expert | `*create-front-end-spec` | `front-end-spec-tmpl` |
| Prompt sinh UI (v0/Lovable) | ux-expert | `*generate-ui-prompt` | `generate-ai-frontend-prompt` |
| Kiến trúc backend/service | architect | `*create-backend-architecture` | `architecture-tmpl` |
| Kiến trúc frontend | architect | `*create-front-end-architecture` | `front-end-architecture-tmpl` |
| Kiến trúc full-stack | architect | `*create-full-stack-architecture` | `fullstack-architecture-tmpl` |
| Kiến trúc nâng cấp hệ thống cũ | architect | `*create-brownfield-architecture` | `brownfield-architecture-tmpl` |
| Tài liệu hoá codebase có sẵn | analyst/architect | `*document-project` | `document-project` |
| Kiểm tra tài liệu đồng bộ | po | `*execute-checklist-po` | `po-master-checklist` |
| Chẻ tài liệu | po | `*shard-doc {doc} {dest}` | `shard-doc` |
| Lập chỉ mục docs | bmad-master | `*task index-docs` | `index-docs` |
| **Tạo story** | **sm** | **`*draft`** | **`create-next-story` + `story-tmpl`** |
| Kiểm story draft | po | `*validate-story-draft {story}` | `validate-next-story` |
| **Triển khai story** | **dev** | **`*develop-story`** | **`story-dod-checklist`** |
| Giải thích code vừa viết | dev | `*explain` | — |
| Chạy test | dev | `*run-tests` | — |
| Áp fix từ QA | dev | `*review-qa` | `apply-qa-fixes` |
| Đánh giá rủi ro story | qa | `*risk {story}` | `risk-profile` |
| Thiết kế chiến lược test | qa | `*design {story}` | `test-design` + 2 file data test |
| Truy vết AC ↔ test | qa | `*trace {story}` | `trace-requirements` |
| Đánh giá NFR | qa | `*nfr {story}` | `nfr-assess` |
| **Review + gate** | **qa** | **`*review {story}`** | **`review-story` + `qa-gate-tmpl`** |
| Cập nhật gate | qa | `*gate {story}` | `qa-gate` |
| Xử lý thay đổi phạm vi | pm/po/sm | `*correct-course` | `correct-course` + `change-checklist` |
| Epic nhỏ cho hệ thống cũ | pm/po | `*create-brownfield-epic` | `brownfield-create-epic` |
| Story lẻ cho hệ thống cũ | pm/po | `*create-brownfield-story` | `brownfield-create-story` |
| Hỏi về phương pháp BMad | bmad-master | `*kb` | `kb-mode-interaction` + `bmad-kb` |
| Được tư vấn chọn workflow | orchestrator | `*workflow-guidance` | `workflow-management` |
| Retrospective đa góc nhìn | orchestrator | `*party-mode` | — |

### A3. Tra: file đầu ra nằm ở đâu

```text
docs/project-brief.md            analyst  (template mặc định ghi docs/brief.md — xem B5)
docs/market-research.md          analyst
docs/competitor-analysis.md      analyst
docs/brainstorming-session-results.md   analyst
docs/prd.md                      pm       → shard → docs/prd/{index.md, epic-*.md, …}
docs/front-end-spec.md           ux-expert
docs/architecture.md             architect → shard → docs/architecture/{coding-standards.md,
                                                      tech-stack.md, source-tree.md, …}
docs/ui-architecture.md          architect (front-end-architecture-tmpl)
docs/stories/{e}.{s}.{slug}.md   sm       → dev cập nhật Dev Agent Record → qa append QA Results
docs/qa/assessments/{e}.{s}-risk-{YYYYMMDD}.md          qa *risk
docs/qa/assessments/{e}.{s}-test-design-{YYYYMMDD}.md   qa *design
docs/qa/assessments/{e}.{s}-trace-{YYYYMMDD}.md         qa *trace
docs/qa/assessments/{e}.{s}-nfr-{YYYYMMDD}.md           qa *nfr
docs/qa/gates/{e}.{s}-{slug}.yml                        qa *review / *gate
docs/index.md                    bmad-master (index-docs)
.ai/debug-log.md                 dev
```

### A4. Tra: quyền ghi section story

| Section | sm | dev | qa | bạn |
|---------|:--:|:---:|:--:|:---:|
| Status | ✅ tạo | ✅ cập nhật* | ❌ chỉ khuyến nghị | ✅ quyết định |
| Story · Acceptance Criteria | ✅ | ❌ | ❌ | ✅ |
| Tasks / Subtasks | ✅ tạo | ✅ tick `[x]` | ❌ | ✅ |
| Dev Notes · Testing | ✅ | ❌ | ❌ | ✅ |
| Dev Agent Record (+ File List, Completion Notes, Debug Log, Agent Model) | ❌ | ✅ | ❌ | — |
| Change Log | ✅ | ✅ | ⚠️* | ✅ |
| QA Results | ❌ | ❌ | ✅ append | — |
| `docs/qa/gates/*.yml` | ❌ | ❌ | ✅ sở hữu | — |

\* Xem cảnh báo B1 và B3.

### A5. Tra: các ngưỡng số

| Ngưỡng | Giá trị | Nguồn |
|--------|---------|-------|
| Risk score | Xác suất (1–3) × Tác động (1–3) = 1…9 | `risk-profile` |
| Risk → gate FAIL | score **≥ 9** | `risk-profile`, `review-story` |
| Risk → gate CONCERNS | score **≥ 6** | `risk-profile`, `review-story` |
| Điểm rủi ro story | 100 − 20×Critical(9) − 10×High(6) − 5×Medium(4) − 2×Low(2–3) | `risk-profile` |
| quality_score | 100 − 20×FAIL − 10×CONCERNS, kẹp [0,100] | `nfr-assess`, `review-story` |
| Gate hết hạn | thường **2 tuần** từ ngày review | `review-story` |
| Deep review — diff | **> 500 dòng** | `review-story` |
| Deep review — số AC | **> 5** | `review-story` |
| Dev HALT — số lần thất bại | **3 lần** cho cùng một việc | `dev.md` |
| Story brownfield đơn lẻ | **< 4 giờ** | `brownfield-fullstack.yaml` |
| Epic brownfield nhỏ | **1–3 story** | `brownfield-create-epic` |
| Fuzzy matching orchestrator | ngưỡng tin cậy **85%** | `bmad-orchestrator.md` |
| Số elicitation trong `create-doc` | **1–9** (option 1 = proceed) | `create-doc` |
| Số elicitation trong `advanced-elicitation` | **0–9** (option 9 = proceed) | `advanced-elicitation` |
| Severity gate | chỉ `low` · `medium` · `high` | `qa-gate` |
| Test priority | `P0` · `P1` · `P2` · `P3` | `test-priorities-matrix` |

### A6. Tra: trạng thái story

```text
Draft ──(bạn duyệt)──> Approved ──(dev bắt đầu)──> InProgress
  │                                                    │
  └──(sm sửa)──┘                     ┌────────(HALT: 5 điều kiện)
                                      │
InProgress ──(DoD xong)──> Review ──(qa: FAIL/CONCERNS)──> InProgress
                              │
                              └──(qa: PASS/WAIVED + bạn xác nhận + đã commit)──> Done
```

Enum chính thức trong `story-tmpl.yaml`: `Draft` · `Approved` · `InProgress` · `Review` · `Done` — xem cảnh báo **B1**.

### A7. Tra: điểm dừng bắt buộc

| Chốt | Ai | Nội dung |
|------|-----|----------|
| `elicit: true` | `create-doc` | 9 lựa chọn có số, đợi bạn |
| Thiếu `core-config.yaml` | `create-next-story`, `validate-next-story` | HALT + hướng dẫn |
| Story trước chưa `Done` | `create-next-story` | Cảnh báo + hỏi chấp nhận rủi ro |
| Epic đã xong | `create-next-story` | 3 lựa chọn, không tự nhảy epic |
| Dev: dependency chưa duyệt | `dev` | HALT xác nhận với bạn |
| Dev: còn nhập nhằng | `dev` | HALT |
| Dev: 3 lần thất bại | `dev` | HALT |
| Dev: thiếu cấu hình | `dev` | HALT |
| Dev: regression fail | `dev` | HALT |
| Story chưa `Review` | `review-story` | Không review |
| File List rỗng/thiếu | `review-story` | Dừng, yêu cầu làm rõ |
| Không có artifact QA | `apply-qa-fixes` | HALT, yêu cầu tạo gate |
| `md-tree` không có mà cờ bật | `shard-doc` | DỪNG, không tự chẻ tay |
| Checklist thiếu artifact | `execute-checklist` | HALT và hỏi |
| Trước khi đánh `Done` | quy trình | Xác nhận regression + lint, **COMMIT trước** |

### A8. Tra: bất biến cần giữ

1. Mọi chi tiết kỹ thuật trong Dev Notes **phải** có `[Source: …]`
2. Chỉ **1 story** `InProgress` tại một thời điểm
3. **Mở chat mới** mỗi lần đổi agent
4. Dùng **model mạnh nhất** cho `sm`
5. **Không** shard trên Web UI
6. Dev **không** đọc PRD/architecture trừ khi story chỉ định
7. QA **chỉ** sửa QA Results và file gate
8. Dev **không** sửa file gate
9. SM **không bao giờ** viết code
10. **Không** dùng `bmad-master`/`bmad-orchestrator` để tạo story hoặc implement
11. **Commit** sau mỗi story trước khi sang story kế
12. Mục N/A trong checklist **phải** có biện minh
13. Agent **không** tự sáng tác phương pháp elicitation
14. `agent.customization` **luôn** thắng mọi chỉ dẫn xung khắc
15. Tài nguyên chỉ nạp **khi cần**, không nạp trước

---

## PHẦN B — CẢNH BÁO: các điểm không nhất quán trong repo

Đây là những chỗ tài liệu/định nghĩa trong repo **tự mâu thuẫn hoặc lệch nhau**. Biết trước để không bị bối rối khi vận hành thủ công.

### B1. ⚠️ Enum trạng thái story không phủ hết giá trị thực dùng

| Nơi | Giá trị |
|-----|---------|
| `templates/story-tmpl.yaml` (`choices`) | `Draft`, `Approved`, `InProgress`, `Review`, `Done` |
| `agents/dev.md` (mục `completion`) | đặt **`Ready for Review`** |
| `tasks/apply-qa-fixes.md` (Status Rule) | đặt **`Ready for Done`** hoặc **`Ready for Review`** |
| `tasks/review-story.md` (Recommended Status) | khuyến nghị **`Ready for Done`** |

**⇒ 3 giá trị nằm ngoài enum.** Cách xử lý thực tế: coi `Ready for Review` ≡ `Review` và `Ready for Done` ≡ đề nghị chuyển `Done`. Chọn **một** quy ước và ghi vào `technical-preferences.md` để cả nhóm nhất quán.

### B2. ⚠️ `agents/dev.md` tự mâu thuẫn về quyền sửa `Status`

Trong cùng một khối `story-file-updates-ONLY`:

- Dòng cho phép: *"You are ONLY authorized to edit these specific sections … Change Log, **Status**"*
- Dòng ngay sau cấm: *"DO NOT modify **Status**, Story, Acceptance Criteria, Dev Notes, Testing sections…"*

**⇒ Cách xử lý**: cho Dev **được** đặt `Status: Ready for Review` khi hoàn tất (vì `completion` yêu cầu vậy), nhưng **bạn** là người quyết định chuyển sang `Done`.

### B3. ⚠️ Quyền của QA với `Change Log` bị lệch

| Nơi | Nói gì |
|-----|--------|
| `templates/story-tmpl.yaml` | `change-log.editors: [scrum-master, dev-agent, **qa-agent**]` |
| `agents/qa.md` | *"CRITICAL: … you are ONLY authorized to update the 'QA Results' section"* |

**⇒ Cách xử lý**: theo `qa.md` (nghiêm hơn) — QA chỉ ghi QA Results. Nếu muốn QA ghi Change Log, hãy sửa `qa.md` cho khớp.

### B4. ⚠️ `tasks/apply-qa-fixes.md` dính chặt một dự án Deno cụ thể

Nội dung hard-code: `deno lint` · `deno test -A` · *"keep imports centralized via `deps.ts`"* · *"follow DI boundaries in `src/core/di.ts`"* · `docs/project/typescript-rules.md` · ví dụ `docs/project/qa/gates/2.2-*.yml`.

**⇒ Bắt buộc làm**: sửa file này theo stack thật của bạn **trước khi dùng lần đầu**. Nếu không, Dev agent sẽ cố chạy lệnh không tồn tại.

### B5. ⚠️ Tên file đầu ra lệch giữa template và workflow

| Artifact | Template ghi | Workflow / tài liệu ghi |
|----------|-------------|------------------------|
| Project brief | `docs/brief.md` | `docs/project-brief.md` |
| Frontend architecture | `docs/ui-architecture.md` | `front-end-architecture.md` |
| Fullstack architecture | `docs/architecture.md` | `fullstack-architecture.md` (trong `greenfield-fullstack.yaml`) |

**⇒ Cách xử lý**: chọn **một** tên cho mỗi artifact, dùng nhất quán, và đảm bảo `core-config.yaml` trỏ đúng. Ưu tiên `docs/prd.md` và `docs/architecture.md` vì nhiều task viết cứng theo hai tên này.

### B6. ⚠️ Vị trí epic đã shard lệch nhau

| Nơi | Nói gì |
|-----|--------|
| `core-config.yaml` | `prdShardedLocation: docs/prd` |
| `docs/user-guide.md` (Planning Artifacts) | `Sharded Epics → docs/epics/` |

**⇒ Tin `core-config.yaml`** — đó là file mà task thực sự đọc.

### B7. ⚠️ `review-story` trỏ tài liệu chuẩn ở gốc `docs/`, không phải `docs/architecture/`

`review-story.md` bước 4 ghi: `docs/coding-standards.md`, `docs/unified-project-structure.md`, `docs/testing-strategy.md`.
Nhưng sau khi shard, chúng nằm ở `docs/architecture/coding-standards.md`…

**⇒ Cách xử lý**: khi chạy QA review thủ công, dán đúng file ở `docs/architecture/`; hoặc sửa đường dẫn trong task cho khớp dự án của bạn.

### B8. ⚠️ Hai định dạng elicitation khác nhau

`create-doc` dùng **1–9** (option 1 = proceed); `advanced-elicitation` dùng **0–9** (option 9 = proceed).

**⇒ Cách xử lý**: đọc dòng nhắc mà agent in ra để biết đang ở định dạng nào. Cả hai đều hợp lệ.

### B9. ⚠️ `bmad-kb.md` mô tả `team-fullstack` không khớp file YAML

KB ghi Team Fullstack gồm "PM, Architect, Developer, QA, UX Expert".
File `agent-teams/team-fullstack.yaml` thực tế: `bmad-orchestrator`, `analyst`, `pm`, `ux-expert`, `architect`, `po` — **không có `dev`, `sm`, `qa`**.

**⇒ Tin file YAML.**

### B10. ⚠️ Hai task được workflow tham chiếu nhưng chưa tồn tại

| Tham chiếu | Trạng thái | Thay thế |
|-----------|-----------|----------|
| `story-review` | *"coming soon"* | Dùng `po *validate-story-draft` |
| `epic-retrospective` | *"coming soon"* | Chạy thủ công / dùng `*party-mode` |

### B11. ⚠️ `create-next-story` đọc khoá `workflow.*` không tồn tại

Bước 0 của `create-next-story.md` ghi: *"Extract key configurations: `devStoryLocation`, `prd.*`, `architecture.*`, `workflow.*`"* — nhưng `core-config.yaml` v4.44.2 **không có** nhóm khoá `workflow`.

**⇒ Vô hại** (agent chỉ bỏ qua), nhưng đừng mất thời gian đi tìm khoá đó.

### B12. ⚠️ Installer đọc `short-title` không có trong `core-config.yaml`

`tools/installer/bin/bmad.js` đọc `coreConfig['short-title']` và fallback về `'BMad Agile Core System'`. Khoá này chỉ tồn tại trong `config.yaml` của expansion pack.

**⇒ Vô hại**, nhưng nếu muốn tên hiển thị riêng khi cài, hãy thêm `short-title:` vào `core-config.yaml`.

### B13. ⚠️ Ghi lại `core-config.yaml` làm mất comment

Khi bạn chọn tuỳ chọn sharding lúc cài, installer đọc–sửa–ghi lại file bằng `yaml.dump`, làm **mất comment** `# <!-- Powered by BMAD™ Core -->` ở đầu file.

**⇒ Vô hại về chức năng.** Nếu bạn thêm comment giải thích vào `core-config.yaml`, hãy sao lưu trước khi chạy lại installer.

### B14. ⚠️ File cấu hình IDE không được kiểm tra toàn vẹn

`install-manifest.yaml` chỉ ghi các file trong `.bmad-core/`. Các file rule/command của IDE (`.claude/commands/…`, `.cursor/rules/…`, `AGENTS.md`, `opencode.jsonc`, `.roomodes`…) **không** có trong manifest ⇒ chức năng repair **không** phục hồi chúng.

**⇒ Cách xử lý**: nếu cấu hình IDE bị hỏng, chạy lại `npx bmad-method install -f -i <ide>`.

### B15. ⚠️ `technical-preferences.md` mặc định trống

Nội dung gốc chỉ là `None Listed`. Nhiều agent phụ thuộc file này (pm, architect, ux-expert, qa) nhưng nó **không có nội dung** cho tới khi bạn điền.

**⇒ Đây là việc đầu tiên bạn nên làm** — xem [file 10 §4](./10-data.md#4-technical-preferencesmd).

### B16. ⚠️ Trùng lặp `bmad-kb.md` giữa core và expansion pack

`bmad-kb.md` xuất hiện ở `bmad-core/data/` và trong nhiều pack (`bmad-2d-phaser-game-dev`, `bmad-2d-unity-game-dev`, `bmad-creative-writing`, `bmad-godot-game-dev`). Nội dung có thể phân kỳ theo thời gian.

**⇒ Coi bản trong `bmad-core/data/` là chuẩn** khi có lệch.

### B17. ⚠️ Node version lệch giữa hai tài liệu

`package.json:engines` yêu cầu **≥ 20.10.0**; `docs/user-guide.md` ghi **≥ 18**.

**⇒ Lấy mốc 20.10.0.**

### B18. ⚠️ `reviewer` trong gate ghi hai cách

`qa-gate.md` dùng `reviewer: 'Quinn'`; `qa-gate-tmpl.yaml` và `review-story.md` dùng `reviewer: 'Quinn (Test Architect)'`.

**⇒ Vô hại**, chọn một cách và dùng nhất quán.

---

## PHẦN C — Checklist "sức khoẻ" trước khi bắt đầu

Chạy một lần khi thiết lập, và mỗi lần sau khi nâng cấp:

- [ ] Đã điền `technical-preferences.md` (B15)
- [ ] Đã sửa `apply-qa-fixes.md` theo stack thật (B4)
- [ ] Đã chọn quy ước tên artifact và cập nhật `core-config.yaml` (B5)
- [ ] Đã chọn quy ước trạng thái story và ghi lại (B1, B2)
- [ ] `core-config.yaml` trỏ đúng mọi đường dẫn tồn tại thật
- [ ] Mọi file trong `devLoadAlwaysFiles` tồn tại và **gọn**
- [ ] Nếu `markdownExploder: true` → đã cài `@kayvan/markdown-tree-parser` global
- [ ] `docs/prd/` có `index.md` + ít nhất một `epic-*.md`
- [ ] `docs/architecture/` có `coding-standards.md`, `tech-stack.md`, `source-tree.md`
- [ ] Gọi thử một agent → chào đúng tên/vai + hiện `*help` + dừng
- [ ] Không có story nào ở `InProgress` khi bắt đầu story mới

---

## Liên quan

- Chỉ mục cẩm nang: [README.md](./README.md)
- Đặc tả toàn hệ thống: [`../specs/01-dac-ta-he-thong.md`](../specs/01-dac-ta-he-thong.md)
- Thiết kế hệ thống: [`../specs/02-thiet-ke-he-thong.md`](../specs/02-thiet-ke-he-thong.md)
- Vận hành hệ thống (có installer/CI): [`../specs/03-van-hanh-he-thong.md`](../specs/03-van-hanh-he-thong.md)
- Luồng dữ liệu đầu–cuối: [`../specs/04-luong-du-lieu-end-to-end.md`](../specs/04-luong-du-lieu-end-to-end.md)
