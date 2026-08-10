[⬅ Bước trước](./05-architect-brownfield.md) · [Chỉ mục](./README.md) · [Bước sau ➡](./07-story-sm.md)

# Bước 6 — PO chốt kiểm an toàn tích hợp + chẻ tài liệu

Với brownfield, `po-master-checklist` bật thêm một section mà greenfield để `N/A`: **§7 RISK MANAGEMENT [[BROWNFIELD ONLY]]**.

## 6.1 PO chốt kiểm

```text
👤 Bạn: @po

🤖 Xin chào! Tôi là Sarah 📝 — Product Owner.

👤 Bạn: *execute-checklist-po
```

### Agent nạp gì

```text
.bmad-core/agents/po.md
.bmad-core/core-config.yaml
.bmad-core/tasks/execute-checklist.md
.bmad-core/checklists/po-master-checklist.md
docs/brownfield-architecture.md      ← 🔴 thực trạng
docs/prd.md
docs/architecture.md
```

### Kết quả

```text
🤖 ## PO Master Validation Checklist — BanHang Loyalty Enhancement

   Phát hiện loại dự án: **BROWNFIELD** (có docs/brownfield-architecture.md và
   PRD dùng brownfield template)
   ⇒ §7 RISK MANAGEMENT [[BROWNFIELD ONLY]] **được kích hoạt**
   ⇒ §4 UI/UX [[UI/UX ONLY]] cũng áp dụng (có thay đổi view)

   | # | Section                                 | Pass rate |
   |---|----------------------------------------|-----------|
   | 1 | PROJECT SETUP & INITIALIZATION          | 5/6   83% |
   | 2 | INFRASTRUCTURE & DEPLOYMENT             | 7/7  100% |
   | 3 | EXTERNAL DEPENDENCIES & INTEGRATIONS    | 4/5   80% |
   | 4 | UI/UX CONSIDERATIONS [[UI/UX ONLY]]     | 5/6   83% |
   | 5 | USER/AGENT RESPONSIBILITY               | 4/4  100% |
   | 6 | FEATURE SEQUENCING & DEPENDENCIES       | 6/6  100% |
   | 7 | **RISK MANAGEMENT [[BROWNFIELD ONLY]]** | **5/7   71%** 🔴 |
   | 8 | MVP SCOPE ALIGNMENT                     | 5/5  100% |
   | 9 | DOCUMENTATION & HANDOFF                 | 5/5  100% |
   |10 | POST-MVP CONSIDERATIONS                 | 2/2  100% |
   |   | **TỔNG**                                 | **48/53  91%** |
```

### §7 — chi tiết section brownfield 🔴

```text
🤖 ### §7 RISK MANAGEMENT [[BROWNFIELD ONLY]] — 5/7

   ✅ Rủi ro với hệ thống hiện có đã được nhận diện
      → PRD mục Risk Assessment: 3 nhóm (Technical/Integration/Deployment)
   ✅ Có chiến lược rollback rõ ràng
      → architecture.md mục Rollback Strategy: 4 mức, có thời gian ước tính
   ✅ Yêu cầu tương thích ngược được nêu tường minh
      → CR1–CR4 trong PRD, cụ thể hoá thành quy tắc kỹ thuật trong architecture
   ✅ Có kế hoạch xác minh chức năng hiện có không vỡ
      → mỗi story có mục Integration Verification
   ✅ Thứ tự story giảm thiểu rủi ro
      → Story 1.1 tạo lưới an toàn (test + công tắc) trước khi chạm code cũ

   ❌ **Chiến lược migration dữ liệu chưa được kiểm chứng trên dữ liệu THẬT**
      → PRD và architecture nói migration idempotent, nhưng chưa ai chạy thử
        trên bản copy của 4.200 customer + 31.000 order.
      → Với 31.000 document, `updateMany` có thể mất vài phút và lock. Không có
        staging ⇒ không biết trước.
      → **Đề xuất**: thêm AC vào Story 1.2: "Chạy migration trên bản restore từ
        mongodump của production, ghi lại thời gian thực thi và xác nhận không
        lock quá 5 giây".

   ⚠️ **Người dùng bên ngoài chưa được thông báo về thay đổi**
      → App mobile của shipper: PRD ghi "CHƯA biết dùng field nào" và chọn cách
        bảo thủ. Nhưng chưa ai LIÊN LẠC với bên mobile.
      → Đây là việc **con người** phải làm, agent không làm được.
      → **Đề xuất**: thêm vào §5 USER/AGENT RESPONSIBILITY một việc cho bạn:
        "Xác nhận với bên mobile danh sách endpoint và field đang dùng, TRƯỚC
        khi deploy Pha 1".
```

### Các mục khác cần xử lý

```text
🤖 ### Ba việc còn lại

   **§1 PROJECT SETUP** ⚠️
   `.bmad-core/core-config.yaml` mục `devLoadAlwaysFiles` trỏ tới
   `docs/architecture/source-tree.md`. Template brownfield-architecture đặt tên
   section là "Source Tree" ⇒ sau khi shard sẽ ra ĐÚNG tên đó. ✓ Khớp.
   Nhưng: `docs/architecture/coding-standards.md` và `tech-stack.md` cũng khớp.
   ⇒ Thực ra mục này PASS. Điều còn thiếu là: **Dev agent chưa có gì để đọc cho
     tới khi shard xong.** Cần đảm bảo thứ tự: shard TRƯỚC khi gọi @dev.

   **§3 EXTERNAL DEPENDENCIES** ⚠️
   Chưa xác nhận app mobile — trùng với phát hiện ở §7. Cùng một việc.

   **§4 UI/UX** ⚠️
   Partial EJS mới `_points.ejs` sẽ include vào `views/customers/detail.ejs`.
   Nhưng PRD/architecture không nói **vị trí chính xác** trong trang (trên/dưới
   phần nào). Với view 200 dòng, Dev agent sẽ phải đoán.
   ⇒ **Đề xuất**: thêm vào Story 1.5 một AC nêu rõ vị trí, hoặc kèm mô tả layout.

   **Kết luận: CHƯA đồng bộ.** 3 việc phải xử lý (2 việc là một vấn đề chung).
```

⚙️ **Cơ chế** — chú ý PO tìm ra hai loại vấn đề khác nhau:

| Loại | Ví dụ | Ai xử lý |
|---|---|---|
| **Thiếu trong tài liệu** | vị trí partial EJS chưa rõ; migration chưa được kiểm chứng | Agent (pm/architect) bổ sung |
| **Việc con người phải làm** | liên lạc bên mobile để xác nhận field | **Bạn** — agent không làm được |

🔴 §5 USER/AGENT RESPONSIBILITY tồn tại chính là để bắt loại thứ hai. Với brownfield, loại này nhiều hơn hẳn: xác nhận với bên tích hợp, xin cửa sổ bảo trì, backup DB, thông báo người dùng.

### Vòng sửa

```text
👤 Bạn: [gọi bên mobile]
   Xác nhận: app mobile chỉ dùng GET /api/orders và GET /api/orders/:id.
   Nó đọc field: _id, customerName, totalAmount, status, createdAt.
   KHÔNG dùng POST /api/orders (đó là web UI).

👤 Bạn: @pm
👤 Bạn: Cập nhật PRD: đã xác nhận app mobile dùng 2 endpoint GET, đọc 5 field
   cụ thể. Nới CR1: được phép thêm field vào response, và POST /api/orders
   không có consumer ngoài web UI. Thêm AC vào Story 1.2 về việc kiểm chứng
   migration trên bản restore. Thêm AC vào Story 1.5 về vị trí partial.

🤖 [PM cập nhật docs/prd.md]
   - §1 Available Documentation Analysis: External API Documentation ❌ → ✓
   - CR1 cập nhật: liệt kê chính xác 2 endpoint + 5 field phải bảo toàn
   - Story 1.2 thêm AC6: kiểm chứng migration trên bản restore, ghi thời gian
   - Story 1.5 thêm AC: partial đặt ngay dưới khối thông tin liên hệ

👤 Bạn: @po → *execute-checklist-po

🤖 ## Kết quả lần 2
   | § 7 RISK MANAGEMENT | 7/7  100% |
   | **TỔNG**             | **53/53  100%** |

   **Kết luận: ĐỒNG BỘ.** An toàn tích hợp đã được xác lập.

   🔴 Ghi nhận thêm cho brownfield: việc xác nhận với bên mobile đã biến một
   ràng buộc "bảo thủ vì không biết" thành "chính xác vì đã biết". Điều này
   giúp Dev agent tự tin hơn và giảm rủi ro thừa.
```

⚙️ **Cơ chế** — điều PO vừa làm cho bạn: với greenfield, checklist kiểm *tài liệu có đầy đủ không*. Với brownfield, nó kiểm thêm *bạn đã làm đủ việc bảo vệ hệ thống đang chạy chưa* — và một phần trong đó là việc ngoài code.

## 6.2 Chẻ tài liệu

```text
👤 Bạn: *shard-doc docs/prd.md docs/prd

🤖 markdownExploder = true ⇒ thử md-tree...
   $ md-tree explode docs/prd.md docs/prd
   ✓ Đã chẻ thành công 6 file. DỪNG.

👤 Bạn: *shard-doc docs/architecture.md docs/architecture

🤖 $ md-tree explode docs/architecture.md docs/architecture
   ✓ Đã chẻ thành công 14 file. DỪNG.
```

### 🔴 Câu hỏi brownfield: có shard `brownfield-architecture.md` không?

```text
👤 Bạn: Còn docs/brownfield-architecture.md thì sao?

🤖 Không cần shard, và đây là lý do:

   | Tài liệu | Ai đọc | Đọc thế nào | Cần shard? |
   |----------|--------|-------------|-----------|
   | prd.md | SM (mỗi story) | chỉ file epic liên quan | ✅ CÓ |
   | architecture.md | SM + **Dev (mỗi task)** | chỉ vài section liên quan | ✅ CÓ |
   | brownfield-architecture.md | SM (khi cần tra thực trạng), bạn | tra khi cần, không nạp thường xuyên | ❌ KHÔNG |

   `brownfield-architecture.md` là **tài liệu tra cứu**, không phải tài liệu
   được nạp vào ngữ cảnh mỗi task. Shard nó chỉ tạo thêm file mà không giảm
   ngữ cảnh cho ai.

   Nếu nó rất lớn (> 1500 dòng) và SM phải tra nhiều lần, khi đó shard sẽ có ích.
   Với 400 dòng như hiện tại thì không.
```

⚙️ **Cơ chế**: `shard-doc` không phải "càng shard càng tốt". Mục đích của sharding là **giảm ngữ cảnh cho agent nạp thường xuyên**. Tài liệu chỉ tra thỉnh thoảng thì để nguyên.

## Kết quả trên đĩa

📂

```text
docs/
├── brownfield-architecture.md          ← KHÔNG shard, để nguyên
├── prd.md                              ← file gốc giữ nguyên
├── prd/                                ← MỚI
│   ├── index.md
│   ├── intro-project-analysis-and-context.md
│   ├── requirements.md                                  (FR·NFR·CR)
│   ├── user-interface-enhancement-goals.md
│   ├── technical-constraints-and-integration-requirements.md
│   ├── epic-and-story-structure.md
│   └── epic-1-chuong-trinh-khach-hang-than-thiet.md      ⭐ SM đọc file này
├── architecture.md                     ← file gốc giữ nguyên
└── architecture/                       ← MỚI
    ├── index.md
    ├── introduction.md
    ├── enhancement-scope-and-integration-strategy.md
    ├── tech-stack.md                              ⭐ devLoadAlwaysFiles
    ├── data-models-and-schema-changes.md
    ├── component-architecture.md
    ├── api-design-and-integration.md
    ├── external-api-integration.md
    ├── source-tree.md                             ⭐ devLoadAlwaysFiles ✓ khớp tên!
    ├── infrastructure-and-deployment-integration.md
    ├── coding-standards.md                        ⭐ devLoadAlwaysFiles
    ├── testing-strategy.md                        ⭐ create-next-story đọc
    ├── security-integration.md
    ├── checklist-results-report.md
    └── next-steps.md
```

## Kiểm tra sau khi shard — 7 việc (2 việc thêm so với greenfield)

```bash
# 1. File epic khớp epicFilePattern: epic-{n}*.md ?
ls docs/prd/epic-*.md
#   docs/prd/epic-1-chuong-trinh-khach-hang-than-thiet.md   ✓

# 2. Ba file devLoadAlwaysFiles tồn tại?
ls docs/architecture/coding-standards.md \
   docs/architecture/tech-stack.md \
   docs/architecture/source-tree.md                          ✓ (khớp mặc định!)

# 3. index.md?
ls docs/prd/index.md docs/architecture/index.md              ✓

# 4. Code fence cân bằng (số ``` chẵn)?
grep -c '```' docs/architecture/coding-standards.md          # chẵn ✓

# 5. 🔴 Mục Critical Integration Rules còn nguyên trong coding-standards?
grep -A3 "Critical Integration Rules" docs/architecture/coding-standards.md   ✓

# 6. 🔴 Rollback Strategy còn nguyên?
grep -c "Rollback Strategy" \
  docs/architecture/infrastructure-and-deployment-integration.md              ✓

# 7. Không mất nội dung?
wc -l docs/prd.md                # 428
cat docs/prd/*.md | wc -l        # 437  (chênh do index.md)  ✓
```

🔴 Việc **5 và 6** là kiểm tra riêng của brownfield: hai mục quan trọng nhất về an toàn (integration rules + rollback) phải còn nguyên sau khi chẻ. Nếu mất, Dev agent sẽ không biết luật.

## Trạng thái sau bước 6 — điểm chuyển pha

📂

```text
banhang/
├── .bmad-core/ .claude/
├── flattened-codebase.xml
├── routes/ models/ views/ utils/      ← mã nguồn CŨ, vẫn chưa bị chạm
└── docs/
    ├── brownfield-architecture.md     ← thực trạng (không shard)
    ├── prd.md          + prd/         (7 file)
    └── architecture.md + architecture/ (15 file)
```

**Vẫn chưa sửa một dòng mã nguồn nào.** Và với brownfield, điều đó càng đúng đắn hơn.

| Có | Chưa có |
|---|---|
| ✅ Hiểu thực trạng hệ thống, kể cả 7 nợ kỹ thuật và 4 gotcha | ❌ Mã nguồn mới |
| ✅ 6 FR · 4 NFR · **4 CR (tương thích)** | ❌ Test (0 test — story 1.1 sẽ tạo) |
| ✅ Chiến lược tích hợp có so sánh 3 phương án | ❌ `docs/stories/` |
| ✅ **Rollback strategy 4 mức** | ❌ `docs/qa/` |
| ✅ Quy tắc tích hợp cụ thể cho Dev | |
| ✅ Xác nhận chính xác app mobile dùng gì | |
| ✅ Thứ tự story theo rủi ro tăng dần | |
| ✅ PO xác nhận 53/53 an toàn tích hợp | |

## Bạn tự làm gì ở bước này

- [ ] Đọc **§7 RISK MANAGEMENT** thật kỹ — đây là section quan trọng nhất với brownfield
- [ ] Làm **việc của con người** mà §5 chỉ ra: liên lạc bên tích hợp, xin cửa sổ bảo trì, backup DB
- [ ] Sửa hết mục ❌/⚠️ rồi **chạy lại checklist**
- [ ] Shard `prd.md` và `architecture.md`; **không** shard `brownfield-architecture.md`
- [ ] Chạy 7 lệnh kiểm tra, đặc biệt việc 5 và 6
- [ ] **Commit toàn bộ `docs/`** — 3 tài liệu này có giá trị độc lập với enhancement
- [ ] **MỞ CHAT MỚI** trước bước 7

---

[⬅ Bước trước](./05-architect-brownfield.md) · [Chỉ mục](./README.md) · [Bước sau: SM tạo story ➡](./07-story-sm.md)
