[⬅ Bước trước](./10-story-1-2-rui-ro-cao.md) · [Chỉ mục](./README.md) · [Bước sau ➡](./12-tong-ket-so-do.md)

# Bước 11 — Lặp hết epic → hoàn thành dự án

Story 1.1 và 1.2 đã cho bạn thấy **cả hai kiểu vòng lặp**: đường thẳng (PASS ngay) và có sự cố (FAIL → fix → PASS). Năm story còn lại lặp lại đúng khuôn đó.

## Bảng tiến độ 7 story

| Story | Tên | Vòng QA đã dùng | Gate | Score | Ghi chú đáng nhớ |
|-------|-----|----------------|------|-------|------------------|
| 1.1 | Khởi tạo dự án và pipeline | `*review` | PASS | 100 | Nợ: `env` top-level |
| 1.2 | Đăng ký và đăng nhập | `*risk` `*design` `*trace` `*nfr` `*review`×2 | FAIL → **PASS** | 70 → 100 | SEC-001 rate limiting |
| 1.3 | Bảo vệ route và đăng xuất | `*review` | **CONCERNS** | 90 | Middleware chưa test redirect loop |
| 2.1 | Thêm giao dịch | `*design` `*review` | PASS | 100 | Zod schema dùng chung FE-BE |
| 2.2 | Danh sách, sửa, xoá giao dịch | `*risk` `*review` | **CONCERNS** | 90 | DATA-002: xoá không có xác nhận |
| 2.3 | Phân loại chi | `*review` | PASS | 100 | Đơn giản nhất, 1 vòng |
| 2.4 | Tổng quan tháng | `*design` `*nfr` `*review` | PASS | 100 | Đã test trạng thái rỗng |

**Tổng: 7/7 Done · 2 gate CONCERNS được chấp nhận có ý thức · 1 gate từng FAIL và đã sửa.**

---

## Hai tình huống mới xuất hiện ở các story sau

### Tình huống A — Story 1.3: gate CONCERNS, bạn chọn đi tiếp

```text
🤖 [@qa *review story 1.3]

   Áp thuật toán gate:
   1. Risk — không chạy *risk cho story này ⇒ bỏ qua
   2. Test coverage — không chạy *design ⇒ không có hợp đồng P0 để so
   3. Issue severity — TEST-002 severity **medium**
      "Middleware bảo vệ route chưa có test cho trường hợp redirect loop:
       user chưa đăng nhập vào /tong-quan → redirect /dang-nhap → nếu
       middleware cũng chặn /dang-nhap thì vòng lặp vô hạn"
      ⇒ **gate = CONCERNS**
   4. NFR — tất cả PASS

   quality_score = 100 − 0 − 10 = **90**

   ### Recommended Status
   ✗ Changes Required — hoặc chấp nhận CONCERNS và đi tiếp
   (Story owner decides final status)
```

```text
👤 Bạn: Tôi đã test tay: /dang-nhap nằm trong danh sách loại trừ của
   middleware nên không có loop. Chấp nhận CONCERNS, thêm test vào story sau.
```

**Bạn quyết định gì**: đi tiếp, nhưng phải ghi nhận. Hai cách:

**Cách 1 — chấp nhận và theo dõi** (demo chọn cách này):

```text
👤 [đổi Status: Done, và thêm vào Completion Notes của story:]
   "Chấp nhận gate CONCERNS: TEST-002 (redirect loop) đã kiểm bằng tay,
    /dang-nhap có trong matcher loại trừ. Test tự động sẽ thêm ở story 2.1
    khi có e2e đầu tiên."
```

**Cách 2 — waive chính thức** (khi cần dấu vết cho đội/audit):

```text
👤 @qa → *gate docs/stories/1.3.bao-ve-route-va-dang-xuat.md
   Ghi waiver: đã kiểm tay, hoãn test tự động sang story 2.1.
```

```yaml
gate: WAIVED
status_reason: 'TEST-002 đã kiểm bằng tay; test tự động hoãn sang story 2.1.'
waiver:
  active: true
  reason: 'Redirect loop đã xác minh bằng tay; matcher middleware loại trừ /dang-nhap'
  approved_by: 'Chủ dự án'
top_issues:
  - id: 'TEST-002'
    severity: medium
    finding: 'Chưa có test tự động cho redirect loop của middleware'
    suggested_action: 'Thêm e2e test ở story 2.1'
    suggested_owner: dev
```

⚙️ **Cơ chế**: `WAIVED` là **trạng thái duy nhất** yêu cầu bắt buộc có `reason` + `approved_by`. Đây là cách hệ thống ép bạn để lại dấu vết khi chấp nhận rủi ro — thay vì im lặng bỏ qua.

⚠️ Đừng waive khi bạn **chưa hiểu** rủi ro. Waive là quyết định có ý thức, không phải nút "bỏ qua".

---

### Tình huống B — Story 2.2: phát sinh thay đổi giữa dòng → `*correct-course`

Đang làm story 2.2 (danh sách + sửa + xoá), bạn nhận ra một vấn đề nghiệp vụ:

```text
👤 Bạn: Tôi vừa nhận ra: xoá giao dịch không có xác nhận thì rất dễ mất dữ
   liệu do bấm nhầm trên mobile. Nhưng PRD không có AC nào về việc này.
   Sửa thế nào cho đúng quy trình?
```

Đây **không** phải việc bảo Dev thêm code. Đó là **thay đổi phạm vi** ⇒ dùng `*correct-course`:

```text
👤 [CHAT MỚI] @pm → *correct-course
```

```text
🤖 Đang nạp correct-course.md + checklists/change-checklist.md...

   Xác nhận đầu vào: trigger là "xoá giao dịch thiếu bước xác nhận, rủi ro mất
   dữ liệu do bấm nhầm". Tôi có quyền truy cập PRD, epic 2, story 2.2,
   architecture, front-end-spec ✓

   Chế độ tương tác: bạn muốn
     1. Incrementally (mặc định, khuyến nghị) — đi từng section của change-checklist
     2. YOLO — phân tích theo lô

👤 1

🤖 ### Section 1 — Understand the Trigger & Context
   - Trigger: phát hiện trong lúc phát triển story 2.2
   - Nguồn gốc: PRD FR4 chỉ ghi "người dùng sửa và xoá giao dịch", không nêu
     yêu cầu xác nhận. Front-end-spec cũng không có state `confirming` cho
     TransactionRow (chỉ có `default | editing | deleting`)
   - Đây là **thiếu sót của yêu cầu**, không phải lỗi triển khai

   ### Section 2 — Epic Impact Assessment
   - Epic 2 vẫn giao được giá trị; đây là bổ sung nhỏ trong phạm vi story 2.2
   - **Không** cần epic mới, **không** cần đổi thứ tự story

   ### Section 3 — Artifact Conflict & Impact Analysis
   | Artifact | Ảnh hưởng | Sửa gì |
   |----------|-----------|--------|
   | `docs/prd.md` | FR4 chưa đủ | Thêm AC cho story 2.2 |
   | `docs/front-end-spec.md` | TransactionRow thiếu state | Thêm state `confirming` |
   | `docs/stories/2.2.*.md` | Đang InProgress | Thêm AC + task tương ứng |
   | `docs/architecture.md` | Không ảnh hưởng | — |

   ### Section 4 — Path Forward Evaluation
   Ba phương án:
   1. **Thêm AC vào story 2.2 đang làm** — nhanh, nhưng làm phình story đang chạy
   2. **Tạo story 2.5 riêng** — sạch, nhưng để lỗ hổng mất dữ liệu tồn tại giữa 2.2 và 2.5
   3. Bỏ qua, xử lý sau MVP — không nên với rủi ro mất dữ liệu

   **Khuyến nghị: phương án 1.** Thay đổi nhỏ (một dialog xác nhận), và để lỗ
   hổng mất dữ liệu tồn tại là rủi ro không đáng.

👤 Đồng ý phương án 1.

🤖 ### Sprint Change Proposal

   **Analysis Summary**
   Yêu cầu FR4 thiếu bước xác nhận khi xoá, dẫn tới rủi ro mất dữ liệu do bấm
   nhầm trên mobile (vùng chạm nhỏ). Ảnh hưởng: PRD, front-end-spec, story 2.2.
   Không ảnh hưởng kiến trúc, không ảnh hưởng thứ tự story. Chọn bổ sung ngay
   vào story 2.2 vì thay đổi nhỏ và rủi ro tồn tại là không chấp nhận được.

   **Specific Proposed Edits**

   1. `docs/prd.md` — Story 2.2, thêm AC:
      > **Change Story 2.2 — thêm AC 5:**
      > "5. Khi người dùng bấm xoá, hiện dialog xác nhận nêu rõ số tiền và ngày
      >  của giao dịch; chỉ xoá sau khi người dùng xác nhận. Dialog đóng được
      >  bằng phím Esc và bằng nút Huỷ."

   2. `docs/front-end-spec.md` — Component Library:
      > **Change TransactionRow states from:** `default · editing · deleting`
      > **To:** `default · editing · confirming · deleting`

   3. `docs/stories/2.2.*.md` — thêm AC5 và Task 6:
      > **Add Task 6 (AC: 5):**
      > - [ ] Thêm ConfirmDialog dùng Radix AlertDialog
      > - [ ] Nội dung dialog hiện số tiền + ngày của giao dịch
      > - [ ] Đóng bằng Esc và bằng nút Huỷ
      > - [ ] Unit test: dialog render đúng nội dung
      > - [ ] E2E test: xoá chỉ xảy ra sau khi xác nhận

   Bạn phê duyệt proposal này?

👤 Phê duyệt.

🤖 ### Finalize & Next Steps
   Thay đổi đủ nhỏ để xử lý trực tiếp — không cần replan nền tảng.
   Bạn có thể: cập nhật 3 artifact theo proposal, rồi để Dev tiếp tục story 2.2
   với AC5 và Task 6 mới. Không cần quay lại Architect.
```

⚙️ **Cơ chế** — điều `*correct-course` bảo vệ bạn khỏi:

| Nếu không dùng `correct-course` | Hậu quả |
|---|---|
| Bảo Dev "thêm dialog xác nhận đi" | PRD và front-end-spec vẫn thiếu ⇒ story sau tham chiếu tài liệu cũ, lệch lần nữa |
| Sửa story mà không sửa PRD | `*trace` của QA sẽ so AC với test và không thấy vấn đề, nhưng tài liệu nguồn đã sai |
| Tự thêm AC vào story | Vi phạm quyền: AC thuộc `owner: scrum-master` |

⇒ Thay đổi được lan **đủ và đúng** tới mọi artifact liên quan, có dấu vết bằng một tài liệu Sprint Change Proposal.

---

## Hết Epic 1 → sang Epic 2

Sau khi story 1.3 `Done`:

```text
👤 [CHAT MỚI] @sm → *draft

🤖 [Bước 1] Story cao nhất: 1.3, Status = Done ✓
   Kiểm epic-1-nen-tang-xac-thuc.md: có 3 story (1.1, 1.2, 1.3), tất cả Done.

   **Epic 1 Complete:** All stories in Epic 1 have been completed.
   Would you like to:
     1. Begin Epic 2 with story 1
     2. Select a specific story to work on
     3. Cancel story creation

👤 1

🤖 Identified next story for preparation: 2.1 - Thêm giao dịch
```

⚙️ **Cơ chế quan trọng**: SM **TUYỆT ĐỐI không tự nhảy epic**. Task ghi rõ: *"CRITICAL: NEVER automatically skip to another epic. User MUST explicitly instruct which story to create."*

Lý do: hết epic là mốc để bạn quyết định — có thể bạn muốn deploy Epic 1 trước, hoặc đổi ưu tiên, hoặc làm retrospective.

---

## Retrospective cuối epic

Workflow có bước `epic_retrospective` (tuỳ chọn) — nhưng ⚠️ **task này chưa tồn tại**, workflow ghi *"NOTE: epic-retrospective task coming soon"*.

Hai cách làm thủ công:

### Cách 1 — `*party-mode` của orchestrator (đa góc nhìn)

```text
👤 [nạp bundle team-all hoặc bmad-orchestrator] → *party-mode

🤖 Mời cả đội vào retrospective Epic 1.

   📋 John (PM): Phạm vi Epic 1 đúng — 3 story, không phình. Nhưng AC 1.2.5
      (rate limiting 5/15ph) tôi viết con số cụ thể mà không kiểm với Architect
      xem hạ tầng có làm được không. Lần sau tôi sẽ hỏi trước khi chốt số.

   🏗️ Winston (Architect): Tôi đã cảnh báo đúng chỗ đó ở bước architect_review
      và đề xuất đơn giản hoá. Quyết định giữ nguyên là của chủ dự án — ổn, nhưng
      tôi nên nêu rõ hơn cái giá phải trả (Map in-memory không chia sẻ được).

   🏃 Bob (SM): Story 1.2 tôi ghi rõ AC5 và trích nguồn api-spec, nhưng Dev vẫn
      suy luận rằng Supabase đã xử lý. Lần sau với AC có con số cụ thể, tôi sẽ
      thêm một dòng tường minh: "KHÔNG dựa vào giới hạn mặc định của dịch vụ".

   💻 James (Dev): Đó là lỗi của tôi — tôi lấp khoảng trống bằng phỏng đoán thay
      vì HALT và hỏi. Điều kiện HALT "ambiguous after story check" đúng ra phải
      được kích hoạt ở đây.

   🧪 Quinn (QA): Chuỗi *risk → *design → *trace hoạt động đúng như thiết kế:
      rủi ro được nhận diện trước khi code, và trace bắt được đúng lỗ hổng.
      Đề xuất: chạy *risk cho MỌI story chạm dữ liệu người dùng ở Epic 2.

   📝 Sarah (PO): po-master-checklist bắt được lỗi lệch tên file
      devLoadAlwaysFiles. Nếu bỏ qua bước đó, Dev đã fail ngay story 1.1.
```

### Cách 2 — tự viết file

📂 `docs/epic-1-retrospective.md`

```markdown
# Retrospective — Epic 1: Nền tảng & Xác thực

## Đã hoàn thành
3/3 story Done. App deploy được, đăng ký/đăng nhập hoạt động, route được bảo vệ.
25 test (13 unit + 10 integration + 2 e2e). CI xanh trên mọi PR.

## Gì không đúng kế hoạch
- Story 1.2 gate FAIL lần đầu (thiếu rate limiting) → mất thêm 1 vòng fix
- Story 1.3 gate CONCERNS, phải quyết định chấp nhận có ý thức

## Bài học
1. AC có **con số cụ thể** (5 lần/15 phút) cần một dòng tường minh trong Dev
   Notes: "KHÔNG dựa vào giới hạn mặc định của dịch vụ bên dưới"
2. `*risk` + `*design` trước khi code là **bắt buộc** với story chạm auth —
   nó bắt được SEC-001 trước khi có dòng code nào
3. Pattern "tham số hoá phụ thuộc ngoài" (`parseEnv(raw)`, `checkRateLimit(key, now)`)
   nên đưa vào `coding-standards.md` để mọi story sau đều dùng

## Cải thiện cho Epic 2
- [ ] Thêm luật #8 vào coding-standards: "Hàm phụ thuộc thời gian hoặc môi
      trường phải nhận giá trị đó qua tham số có default"
- [ ] Chạy `*risk` cho story 2.2 (xoá dữ liệu) và 2.4 (tính toán báo cáo)
- [ ] Cập nhật `technical-preferences.md`: ghi nhận Supabase Auth rate limit
      mặc định KHÔNG cấu hình được ⇒ luôn tự làm ở tầng app
```

⚙️ **Cơ chế cải thiện liên tục**: mục cuối ghi vào `coding-standards.md` và `technical-preferences.md` ⇒ bài học của Epic 1 trở thành **luật** cho Epic 2 và cho **mọi dự án sau**. Đây là cách hệ thống "học".

---

## Hoàn thành Epic 2 → dự án xong

Sau story 2.4:

```text
👤 [CHAT MỚI] @sm → *draft

🤖 Story cao nhất: 2.4, Status = Done ✓
   Kiểm epic-2-giao-dich-bao-cao.md: 4/4 story Done.
   Kiểm epic-list.md: chỉ có Epic 1 và Epic 2, cả hai đã hoàn tất.

   Không còn story nào trong PRD. Bạn muốn:
     1. Bắt đầu một epic mới (cần PM thêm vào PRD trước)
     2. Chọn một story cụ thể để làm lại
     3. Kết thúc

👤 3
```

Đây là bước `workflow_end` / `project_complete` của workflow.

---

## Trạng thái đĩa cuối cùng

📂

```text
chitieu/
├── app/
│   ├── (auth)/dang-ky/page.tsx · (auth)/dang-nhap/page.tsx
│   ├── tong-quan/page.tsx · giao-dich/page.tsx
│   ├── api/auth/{dang-ky,dang-nhap}/route.ts
│   ├── api/transactions/route.ts
│   ├── layout.tsx · middleware.ts · globals.css
├── components/
│   ├── ui/ (shadcn)
│   ├── QuickAddForm.tsx · CategoryBreakdown.tsx
│   ├── MonthSummaryCard.tsx · TransactionRow.tsx · ConfirmDialog.tsx
├── lib/
│   ├── env.ts · rate-limit.ts
│   ├── supabase/{client,server}.ts
│   ├── schemas/{auth,transaction}.ts
│   └── data/transactions.ts
├── tests/
│   ├── unit/          (28 test)
│   ├── integration/   (18 test)
│   └── e2e/           (6 test)
├── supabase/migrations/0001_transactions.sql
├── .github/workflows/ci.yml
├── README.md · .env.example
│
├── .bmad-core/                    ← framework
├── .claude/                       ← command IDE
└── docs/
    ├── project-brief.md
    ├── brainstorming-session-results.md
    ├── prd.md          + prd/          (10 file)
    ├── architecture.md + architecture/ (21 file)
    ├── front-end-spec.md
    ├── epic-1-retrospective.md
    ├── epic-2-retrospective.md
    ├── stories/                        ← 7 file, tất cả Status: Done
    │   ├── 1.1.khoi-tao-du-an-va-pipeline.md
    │   ├── 1.2.dang-ky-va-dang-nhap.md
    │   ├── 1.3.bao-ve-route-va-dang-xuat.md
    │   ├── 2.1.them-giao-dich.md
    │   ├── 2.2.danh-sach-sua-xoa-giao-dich.md
    │   ├── 2.3.phan-loai-chi.md
    │   └── 2.4.tong-quan-thang.md
    └── qa/
        ├── assessments/                ← 9 file
        │   ├── 1.2-risk-20260810.md
        │   ├── 1.2-test-design-20260810.md
        │   ├── 1.2-trace-20260811.md
        │   ├── 1.2-nfr-20260810.md
        │   ├── 2.1-test-design-20260814.md
        │   ├── 2.2-risk-20260815.md
        │   ├── 2.4-test-design-20260818.md
        │   ├── 2.4-nfr-20260818.md
        │   └── ...
        └── gates/                      ← 7 file, một cho mỗi story
            ├── 1.1-khoi-tao-du-an-va-pipeline.yml    PASS  100
            ├── 1.2-dang-ky-va-dang-nhap.yml          PASS  100 (từng FAIL 70)
            ├── 1.3-bao-ve-route-va-dang-xuat.yml     CONCERNS 90
            ├── 2.1-them-giao-dich.yml                PASS  100
            ├── 2.2-danh-sach-sua-xoa.yml             CONCERNS 90
            ├── 2.3-phan-loai-chi.yml                 PASS  100
            └── 2.4-tong-quan-thang.yml               PASS  100
```

## Con số cuối

| Chỉ số | Giá trị |
|---|---|
| Story hoàn thành | 7 / 7 |
| Test tự động | 52 (28 unit · 18 integration · 6 e2e) |
| Gate PASS | 5 |
| Gate CONCERNS được chấp nhận có ý thức | 2 |
| Gate từng FAIL rồi được sửa | 1 |
| Rủi ro nghiêm trọng bị bắt **trước khi** lên production | 1 (SEC-001, score 9) |
| Sprint Change Proposal | 1 (xác nhận khi xoá) |
| Tài liệu nguồn được cập nhật khi có thay đổi | 3 artifact |
| Commit | 7 (một cho mỗi story) |
| Số chat đã dùng | ~24 (3–7 chat mỗi story) |

---

## Bạn tự làm gì ở giai đoạn này

- [ ] Lặp SM → Dev → QA cho từng story, **chat mới mỗi lần đổi agent**
- [ ] Với story chạm dữ liệu người dùng hoặc bảo mật: thêm `*risk` + `*design`
- [ ] Khi gate CONCERNS: **quyết định có ý thức** — chấp nhận (ghi vào Completion Notes) hoặc waive chính thức (có `reason` + `approved_by`)
- [ ] Khi phát sinh thay đổi phạm vi: dùng `*correct-course`, **đừng** bảo Dev sửa trực tiếp
- [ ] Khi hết epic: làm retrospective, và **đưa bài học vào `coding-standards.md` + `technical-preferences.md`**
- [ ] Commit sau **mỗi** story
- [ ] Nén hội thoại / chat mới sau mỗi story

---

[⬅ Bước trước](./10-story-1-2-rui-ro-cao.md) · [Chỉ mục](./README.md) · [Bước sau: tổng kết & sơ đồ ➡](./12-tong-ket-so-do.md)
