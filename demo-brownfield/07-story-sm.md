[⬅ Bước trước](./06-po-validate-va-shard.md) · [Chỉ mục](./README.md) · [Bước sau ➡](./08-qa-risk-design.md)

# Bước 7 — SM tạo Story 1.1

> ⚠️ **MỞ CHAT MỚI** + chọn **model suy luận mạnh nhất**.

Story 1.1 của brownfield này không tạo ra tính năng nào cho người dùng. Nó tạo ra **lưới an toàn**: test framework, regression test cho luồng đơn hàng hiện tại, và công tắc bật/tắt.

## Lệnh

```text
👤 Bạn: @sm

🤖 Xin chào! Tôi là Bob 🏃 — Scrum Master.
   Lưu ý: tôi KHÔNG được phép implement story hay sửa code, bao giờ cũng vậy.

👤 Bạn: *draft
```

## Agent đọc gì

```text
🤖 [Bước 0] .bmad-core/core-config.yaml ✓
   devStoryLocation: docs/stories · prdShardedLocation: docs/prd
   epicFilePattern: epic-{n}*.md · architectureShardedLocation: docs/architecture

   [Bước 1] docs/stories/ → rỗng ⇒ story kế tiếp LUÔN là 1.1
   Đọc docs/prd/epic-1-chuong-trinh-khach-hang-than-thiet.md...
   Identified next story for preparation: 1.1 - Nền tảng: công tắc, test, lưới an toàn

   [Bước 2] Không có story trước ⇒ bỏ qua Dev Agent Record

   [Bước 3] Story 1.1 là story hạ tầng + test. Đọc:
     MỌI story:  ✓ tech-stack.md
                 ✓ source-tree.md
                 ✓ coding-standards.md
                 ✓ testing-strategy.md
   🔴 Brownfield bổ sung — tôi đọc thêm 2 nguồn không có ở greenfield:
                 ✓ docs/brownfield-architecture.md  (để biết hành vi HIỆN TẠI
                   mà regression test phải khoá lại)
                 ✓ docs/architecture/api-design-and-integration.md  (CR1: field
                   nào phải bảo toàn)

   [Bước 4] Đối chiếu source-tree.md:
     ✓ tests/ là thư mục MỚI — chưa tồn tại, khớp với New File Organization
     ✓ config/ hoặc lib/ cho module cấu hình — source-tree đề xuất `config/index.js`
     ⚠️ Ghi nhận: source-tree.md nói `services/loyalty.js` nhưng story 1.1 chưa
       tạo file đó (story 1.3 mới tạo). Sẽ ghi vào Project Structure Notes.
```

⚙️ **Cơ chế brownfield**: SM đọc thêm `brownfield-architecture.md` vì regression test cần biết **hành vi hiện tại chính xác** — ví dụ `POST /api/orders` trả `total_amount` (snake_case) còn `GET /api/orders/:id` trả `totalAmount` (camelCase). Nếu SM không biết điều này, story sẽ yêu cầu Dev "viết test cho API" một cách chung chung, và Dev sẽ viết test khoá **sai** hành vi.

## File sinh ra

📂 `docs/stories/1.1.nen-tang-cong-tac-test-luoi-an-toan.md`

```markdown
# Story 1.1: Nền tảng — công tắc tính năng, test framework, lưới an toàn

## Status
Draft

## Story
**As a** người bảo trì hệ thống BanHang,
**I want** có Jest, regression test cho luồng đơn hàng hiện tại, và một công tắc
bật/tắt tính năng loyalty,
**so that** mọi thay đổi sau đó đều có lưới an toàn và có thể tắt tức thì mà
không cần rollback code.

## Acceptance Criteria
1. `npm test` chạy được với Jest; có ít nhất một test pass.
2. Có regression test cho `POST /api/orders`: tạo đơn thành công trả đúng shape
   response hiện tại, **bao gồm field `total_amount` (snake_case)**.
3. Có regression test cho `PUT /api/orders/:id`: sửa đơn giữ nguyên hành vi hiện tại.
4. Có regression test cho `GET /api/orders/:id`: trả đúng field `totalAmount`
   (camelCase) và 5 field mà app mobile đang dùng: `_id`, `customerName`,
   `totalAmount`, `status`, `createdAt`.
5. Biến môi trường `LOYALTY_ENABLED` được đọc qua module cấu hình; mặc định `false`.
6. `.env.example` liệt kê biến mới; `.env` có trong `.gitignore`.

## Integration Verification 🔴
IV1: Chạy toàn bộ regression test mới trên code **CHƯA sửa gì** — tất cả phải
     pass. Đây là bằng chứng test phản ánh đúng hành vi hiện tại, không phải
     hành vi mong muốn.
IV2: `npm start` vẫn chạy được; trang chủ, trang danh sách đơn, trang chi tiết
     khách hàng vẫn hiển thị đúng (kiểm tay).
IV3: Thời gian phản hồi `POST /api/orders` không đổi so với baseline 240ms
     (dung sai ±10ms).

## Tasks / Subtasks

- [ ] Task 1: Cài Jest và supertest (AC: 1)
  - [ ] `npm i -D jest@29 supertest@6` — **Jest 29, KHÔNG phải 30** (Jest 30
        yêu cầu Node 18+, hệ thống đang Node 16)
  - [ ] Thêm script `"test": "jest"` vào package.json
  - [ ] Tạo `jest.config.js` với `testEnvironment: 'node'`
  - [ ] Tạo `tests/smoke.test.js` với một test trivial để xác nhận Jest chạy

- [ ] Task 2: Module cấu hình và biến môi trường (AC: 5, 6)
  - [ ] `npm i dotenv@16`
  - [ ] Tạo `config/index.js` export object cấu hình; đọc `LOYALTY_ENABLED`
        (chuỗi `'true'` mới là bật, mọi giá trị khác là tắt)
  - [ ] `require('dotenv').config()` ở **dòng đầu tiên** của `server.js`
  - [ ] Tạo `.env.example` với `LOYALTY_ENABLED=false`
  - [ ] Thêm `.env` vào `.gitignore`
  - [ ] Unit test cho `config/index.js`: mặc định tắt · `'true'` → bật ·
        `'TRUE'`/`'1'`/rỗng → tắt
  - [ ] ⚠️ KHÔNG chạm `utils/db.js` — connection string hardcode nằm ngoài
        phạm vi story này

- [ ] Task 3: Hạ tầng test cho API (AC: 2, 3, 4)
  - [ ] Tách app Express ra khỏi `server.listen()` để supertest dùng được:
        `server.js` export `app`; việc `listen` chuyển vào khối
        `if (require.main === module)`
  - [ ] ⚠️ Đây là thay đổi DUY NHẤT được phép trong `server.js` ở story này.
        Kiểm chứng: `npm start` vẫn chạy được (IV2)
  - [ ] Tạo `tests/helpers/db.js`: kết nối MongoDB test, dọn collection sau mỗi test
  - [ ] Tạo `tests/helpers/fixtures.js`: hàm tạo Customer và Product mẫu

- [ ] Task 4: Regression test POST /api/orders (AC: 2)
  - [ ] Test: tạo đơn với 2 item → response 200/201, có field `total_amount`
        (snake_case), giá trị = tổng `price × qty`, **KHÔNG có VAT**
  - [ ] Test: tạo đơn thiếu `customerId` → response 4xx với `{ message }`
  - [ ] Test: shape response được snapshot lại để so về sau

- [ ] Task 5: Regression test PUT /api/orders/:id (AC: 3)
  - [ ] Test: sửa số lượng item → `total_amount` được tính lại đúng
  - [ ] Test: sửa đơn không tồn tại → 404 với `{ message }`

- [ ] Task 6: Regression test GET /api/orders/:id (AC: 4)
  - [ ] Test: trả đủ 5 field app mobile dùng: `_id`, `customerName`,
        `totalAmount`, `status`, `createdAt`
  - [ ] Test: khẳng định **`totalAmount` camelCase** (KHÔNG phải `total_amount`)
        — đây là sự không nhất quán đã tồn tại, test phải khoá nó lại

- [ ] Task 7: Xác minh tích hợp (IV1, IV2, IV3)
  - [ ] Chạy `npm test` trên code chưa sửa logic → tất cả pass
  - [ ] `npm start` + kiểm tay 3 trang
  - [ ] Đo `POST /api/orders` 10 lần, lấy trung vị, so với 240ms

## Dev Notes

### Previous Story Insights
Không có — đây là story đầu tiên.

### 🔴 Hành vi HIỆN TẠI mà regression test phải khoá lại
Đây là phần quan trọng nhất của story này. Các giá trị dưới đây là **thực tế của
hệ thống**, không phải điều nên có:

| Endpoint | Field trả về | Ghi chú |
|----------|--------------|---------|
| `POST /api/orders` | `total_amount` (**snake_case**) | không nhất quán đã tồn tại |
| `GET /api/orders/:id` | `totalAmount` (**camelCase**) | khác endpoint trên |
| `GET /api/orders` | array, có `?limit` và `?skip` | app mobile dùng |

- Tổng tiền khi **tạo/sửa đơn**: `sum(item.price × item.qty)`, **KHÔNG cộng VAT**
- Tổng tiền khi **xuất báo cáo** (`utils/helpers.js:88`): **CÓ cộng VAT 10%**
- ⚠️ Chênh lệch này là **BUG đã được chủ dự án xác nhận**, nhưng **KHÔNG sửa
  trong story này**. Regression test phải khoá lại hành vi hiện tại, kể cả khi
  hành vi đó sai. Sửa bug là việc riêng, ngoài phạm vi enhancement.
[Source: docs/brownfield-architecture.md#technical-debt-and-known-issues]
[Source: architecture/api-design-and-integration.md#api-strategy]

### Tương thích bắt buộc (CR1)
App mobile đã được xác nhận dùng **đúng 2 endpoint**: `GET /api/orders` và
`GET /api/orders/:id`, đọc **5 field**: `_id`, `customerName`, `totalAmount`,
`status`, `createdAt`. Test phải khoá cả 5 field này.
`POST /api/orders` **không** có consumer ngoài web UI.
[Source: prd/requirements.md#compatibility-requirements]

### Tech Stack (phiên bản bắt buộc)
- Node 16.x — **không dùng cú pháp mới hơn**, không có transpile
- Jest **29.7** (không phải 30 — yêu cầu Node 18+)
- supertest 6.3, dotenv 16.4
- Mongoose **5.12** — API v5, không phải v6+
[Source: architecture/tech-stack.md#new-technology-additions]

### File Locations
Story này tạo:
- `jest.config.js`
- `config/index.js`
- `tests/smoke.test.js`
- `tests/helpers/{db,fixtures}.js`
- `tests/integration/orders-regression.test.js`
- `tests/unit/config.test.js`
- `.env.example`

Story này sửa (chỉ 2 file, thay đổi tối thiểu):
- `server.js` — export `app`, chuyển `listen` vào `if (require.main === module)`
- `package.json` — thêm script test và 3 devDependency
- `.gitignore` — thêm `.env`
[Source: architecture/source-tree.md#new-file-organization]

### Coding Standards phải tuân thủ
- CommonJS `require`/`module.exports` — **không ESM**
- Lỗi: `res.status(4xx).json({ message: '...' })`
- Field mới: camelCase (⚠️ **không** bắt chước `total_amount`)
- Indent 2 space, single quote, có semicolon
- **Critical Integration Rules**: cấm sửa/xoá key trong response `/api/orders*`
[Source: architecture/coding-standards.md#existing-standards-compliance]
[Source: architecture/coding-standards.md#critical-integration-rules]

### Testing Requirements
- Unit: `tests/unit/<module>.test.js`
- Integration: `tests/integration/<endpoint>.test.js`
- 🔴 **Regression test cho mọi module legacy bị chạm** — chuẩn brownfield bắt buộc
- Test stateless, chạy song song được, tự dọn dữ liệu
- Cần MongoDB test riêng; **KHÔNG** chạy test trên DB production
[Source: architecture/testing-strategy.md#new-testing-requirements]

### Technical Constraints
- **Không có staging** ⇒ mọi thay đổi phải an toàn ngay lần đầu
- Deploy = `git pull` + `pm2 restart`, không build step
- VPS 1GB RAM ⇒ 3 dependency mới, 2 trong đó là devDependency
- ⚠️ Gotcha: PM2 báo "online" kể cả khi app crash lúc khởi động ⇒ luôn kiểm
  `pm2 logs` sau deploy
[Source: docs/brownfield-architecture.md#workarounds-and-gotchas]

### API Specifications
Story này **không tạo endpoint mới**. Nó chỉ viết test cho endpoint đang có.

### Data Models
Story này **không đổi schema**. Story 1.2 mới làm việc đó.
No specific guidance found in architecture docs cho phần data model ở story này.

### Component Specifications
Không áp dụng — story này không tạo UI.

### Project Structure Notes
- `tests/` là thư mục mới, khớp `source-tree.md#new-file-organization`
- `config/index.js` khớp cấu trúc đã định
- ⚠️ `source-tree.md` có nêu `services/loyalty.js` nhưng story này **chưa** tạo
  (story 1.3 sẽ tạo). Không phải xung đột, chỉ là thứ tự triển khai.
- ⚠️ Việc tách `app` khỏi `listen` trong `server.js` là thay đổi cấu trúc nhỏ
  **cần thiết** để test được API. Đã kiểm: không ảnh hưởng cách deploy hiện tại.

### Testing
List Relevant Testing Standards:
- Test file location: `tests/unit/` và `tests/integration/`
- Framework: Jest 29 + supertest 6
- Pattern: `describe` theo endpoint/module, `it` theo hành vi
- Yêu cầu riêng của story: regression test phải khoá **hành vi hiện tại**, kể cả
  khi hành vi đó không nhất quán (snake_case vs camelCase)
- DB test: MongoDB riêng, dọn sau mỗi test
[Source: architecture/testing-strategy.md]

## Change Log
| Date       | Version | Description       | Author   |
|------------|---------|-------------------|----------|
| 2026-08-13 | 1.0     | Tạo story ban đầu | Bob (SM) |

## Dev Agent Record
### Agent Model Used
_(Dev điền)_
### Debug Log References
_(Dev điền)_
### Completion Notes List
_(Dev điền)_
### File List
_(Dev điền)_

## QA Results
_(QA điền)_
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
   - **Story:** docs/stories/1.1.nen-tang-cong-tac-test-luoi-an-toan.md
   - **Status:** Draft
   - **Thành phần kỹ thuật từ tài liệu:** hành vi API hiện tại (3 endpoint, 5
     field bắt buộc bảo toàn) · phiên bản chính xác 3 dependency · 7 file tạo mới
     + 3 file sửa · 5 luật coding standards · gotcha PM2
   - 🔴 **Sai lệch cần bạn chú ý:** story yêu cầu regression test khoá lại hành
     vi KHÔNG nhất quán (`total_amount` vs `totalAmount`) và bug VAT. Đây là cố
     ý — sửa bug nằm ngoài phạm vi. Nếu bạn muốn sửa bug trong enhancement này,
     phải quay lại PM để thêm story riêng.
   - **Bước tiếp theo:** 🔴 với brownfield, tôi khuyên chạy `@qa *risk` và
     `@qa *design` TRƯỚC khi duyệt story — xem docs/working-in-the-brownfield.md
     mục "CRITICAL FOR BROWNFIELD - Run These First".
```

⚙️ **Cơ chế** — SM chủ động khuyên chạy QA trước. Với greenfield đây là tuỳ chọn; với brownfield `working-in-the-brownfield.md` viết hoa: **"CRITICAL FOR BROWNFIELD - Run These First"**.

## Bạn CHƯA duyệt story ngay 🔴

Khác greenfield: ở đây bạn **không** chuyển `Draft → Approved` luôn. Sang [bước 8](./08-qa-risk-design.md) chạy `*risk` + `*design` trước.

Lý do: `*risk` có thể phát hiện rủi ro khiến story phải sửa. Duyệt trước rồi sửa sau là làm việc hai lần.

## Trạng thái sau bước 7

📂

```text
docs/
├── brownfield-architecture.md
├── prd.md + prd/
├── architecture.md + architecture/
└── stories/
    └── 1.1.nen-tang-cong-tac-test-luoi-an-toan.md   ← MỚI, Status: Draft
```

## Bạn tự làm gì ở bước này

- [ ] Mở **chat mới**, dùng model mạnh nhất
- [ ] Đọc mục **"Hành vi HIỆN TẠI mà regression test phải khoá lại"** — đây là mục quan trọng nhất. Các giá trị có đúng thực tế không?
- [ ] Xác nhận quyết định **không sửa bug VAT** trong enhancement này
- [ ] Kiểm mục **Integration Verification** có kiểm được không (IV1 đặc biệt: test phải pass trên code chưa sửa)
- [ ] Kiểm **File Locations**: "story này sửa" chỉ có 3 file — càng ít càng tốt với brownfield
- [ ] **CHƯA duyệt.** Sang bước 8 chạy `*risk` + `*design` trước

⚠️ **Cạm bẫy brownfield lớn nhất ở bước này**: SM viết story yêu cầu Dev "viết test cho API" mà không nói rõ hành vi hiện tại là gì. Dev sẽ viết test theo **hành vi nó cho là đúng** (chuẩn hoá camelCase), test pass, rồi Dev "sửa" code cho khớp test — và app mobile chết. Story phải nói rõ: *khoá lại cái đang có, kể cả khi nó sai.*

---

[⬅ Bước trước](./06-po-validate-va-shard.md) · [Chỉ mục](./README.md) · [Bước sau: QA risk + design ➡](./08-qa-risk-design.md)
