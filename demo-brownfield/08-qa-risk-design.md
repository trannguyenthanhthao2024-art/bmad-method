[⬅ Bước trước](./07-story-sm.md) · [Chỉ mục](./README.md) · [Bước sau ➡](./09-dev-story.md)

# Bước 8 — QA vào sớm: `*risk` + `*design` 🔴

> `docs/working-in-the-brownfield.md` viết hoa ở mục này: **"CRITICAL FOR BROWNFIELD - Run These First"**.

Với greenfield, hai lệnh này là tuỳ chọn cho story rủi ro cao. Với brownfield, chúng là **bước bắt buộc** — vì rủi ro lớn nhất không phải "làm sai tính năng mới" mà là **"làm vỡ tính năng cũ"**, và bạn không thể thấy rủi ro đó bằng cách đọc story.

> ⚠️ **MỞ CHAT MỚI.**

## 8.1 `*risk` — ma trận rủi ro

```text
👤 Bạn: @qa

🤖 Xin chào, tôi là Quinn 🧪 — Test Architect & Quality Advisor.

👤 Bạn: *risk docs/stories/1.1.nen-tang-cong-tac-test-luoi-an-toan.md
```

### Agent nạp gì

```text
.bmad-core/agents/qa.md
.bmad-core/core-config.yaml
.bmad-core/tasks/risk-profile.md
docs/stories/1.1.*.md
docs/brownfield-architecture.md            ← 🔴 để biết nợ kỹ thuật và gotcha
docs/prd/requirements.md                    ← CR1-CR4
docs/architecture/coding-standards.md       ← Critical Integration Rules
```

### 🔴 Chấm điểm rủi ro theo cách brownfield

`working-in-the-brownfield.md` định nghĩa 4 nhóm rủi ro brownfield với **công thức riêng**:

| Nhóm rủi ro | Yếu tố brownfield | Ảnh hưởng gate |
|---|---|---|
| **Regression Risk** | số điểm tích hợp × tuổi của code | score ≥ 9 = **FAIL** |
| **Data Risk** | độ phức tạp migration × khối lượng dữ liệu | score ≥ 6 = **CONCERNS** |
| **Performance Risk** | tải hiện tại × độ phức tạp thêm vào | score ≥ 6 = **CONCERNS** |
| **Compatibility Risk** | số consumer của API × mức thay đổi contract | score ≥ 9 = **FAIL** |

### Kết quả

```text
🤖 ## Risk Matrix — Story 1.1

   | Risk ID  | Description | Prob | Impact | Score | Priority |
   |----------|-------------|------|--------|-------|----------|
   | REG-001  | Sửa `server.js` (tách app khỏi listen) làm app không khởi động trên VPS | Medium (2) | High (3) | **6** | High |
   | REG-002  | Regression test khoá SAI hành vi ⇒ về sau Dev "sửa" code cho khớp test và phá app mobile | Medium (2) | High (3) | **6** | High |
   | TECH-001 | Jest/dotenv không tương thích Node 16 ⇒ npm ci fail trên VPS | Low (1) | High (3) | 3 | Low |
   | OPS-001  | Test chạy trên DB production do cấu hình sai ⇒ xoá dữ liệu thật | Low (1) | High (3) | 3 | Low |
   | DATA-001 | Không có (story này không đổi schema) | — | — | — | — |
   | COMP-001 | Không có (story này không đổi response) | — | — | — | — |

   ## Critical Risks Requiring Immediate Attention

   ### 1. REG-001: Sửa `server.js` làm app không khởi động
   - **Score 6 (High)** — Regression Risk. `server.js` là entry point, 340 dòng,
     3 năm tuổi, không có test. Tuy thay đổi nhỏ (tách `app` khỏi `listen`) nhưng
     nếu sai thì **toàn bộ hệ thống chết**, không chỉ tính năng mới.
   - 🔴 Yếu tố brownfield khuếch đại rủi ro: gotcha đã ghi trong
     brownfield-architecture.md — **PM2 báo "online" kể cả khi app crash lúc
     khởi động**. Nghĩa là bạn deploy, thấy "online", tưởng ổn, và 12 nhân viên
     phát hiện hệ thống chết trước bạn.
   - **Mitigation (preventive + detective):**
     - Pattern chuẩn: `module.exports = app;` + `if (require.main === module) { app.listen(...) }`
     - **Bắt buộc** kiểm `npm start` ở local trước khi commit
     - **Bắt buộc** kiểm `pm2 logs banhang --lines 50` sau deploy, không tin
       trạng thái "online"
     - Thêm smoke test: `GET /` trả 200
   - **Testing requirements:**
     - Integration test: `require('../server')` không tự listen (không treo test)
     - Smoke test: `GET /` trả 200
   - **Residual risk:** Low
   - **Owner:** dev · **Timeline:** trong story này

   ### 2. REG-002: Regression test khoá SAI hành vi
   - **Score 6 (High)** — 🔴 rủi ro **đặc thù brownfield**, không tồn tại ở greenfield.
   - Cơ chế gây hại: Dev viết test theo hành vi *nó cho là đúng* (chuẩn hoá
     `totalAmount` cho cả 3 endpoint) → test pass → về sau ai đó thấy code không
     khớp test và "sửa" code → app mobile đọc `total_amount` bị null → shipper
     không thấy tiền đơn hàng.
   - **Mitigation (preventive):**
     - Story đã ghi rõ bảng hành vi hiện tại — Dev phải đọc và tuân theo
     - **IV1 là bước xác minh cốt lõi**: chạy test trên code **chưa sửa logic**.
       Nếu test fail ⇒ test đang khoá hành vi sai, phải sửa test, không sửa code.
     - Thêm comment trong file test: `// KHOÁ hành vi hiện tại, KHÔNG phải hành vi đúng`
   - **Testing requirements:**
     - Test khẳng định tường minh `total_amount` ở POST và `totalAmount` ở GET
     - Test khẳng định tổng tiền **không** cộng VAT
   - **Residual risk:** Low nếu IV1 được thực hiện đúng
   - **Owner:** dev · **Timeline:** trong story này

   ## Risk Distribution
   ### By Category
   - Regression (REG): 2 (cả hai đều High) 🔴
   - Technical (TECH): 1
   - Operational (OPS): 1
   - Data (DATA): 0 · Compatibility (COMP): 0 · Security (SEC): 0

   ### By Component
   - `server.js`: 1 rủi ro High
   - `tests/`: 1 rủi ro High
   - `package.json` / môi trường: 2 rủi ro Low

   ## Risk Scoring
   Base 100 − 10 (REG-001 high) − 10 (REG-002 high) − 2 − 2 = **76**

   ## Integration with Quality Gates
   Điểm cao nhất là **6** (không có 9) ⇒ theo quy tắc tất định:
   **nếu hai rủi ro High chưa được giảm nhẹ tại thời điểm review, gate = CONCERNS**
   (không phải FAIL).

   ## Risk-Based Testing Strategy
   **Priority 1 — High risk tests:**
   - smoke test `GET /` (REG-001)
   - test khẳng định tên field chính xác từng endpoint (REG-002)
   - IV1: chạy toàn bộ suite trên code chưa sửa logic (REG-002)

   **Priority 2 — Medium:** không có

   **Priority 3 — Low:**
   - `npm ci` trên Node 16 (TECH-001)
   - cấu hình DB test tách biệt (OPS-001)

   ## Risk Acceptance Criteria
   ### Must Fix Before Production
   - REG-001: pattern export app đúng + kiểm `npm start` + kiểm `pm2 logs`
   - REG-002: IV1 phải được thực hiện và ghi kết quả

   ### Can Deploy with Mitigation
   - TECH-001: khoá phiên bản trong package.json, test `npm ci` ở local
   - OPS-001: biến `MONGO_URI_TEST` riêng, khác production

   ### Accepted Risks
   Không có.

   ## Monitoring Requirements
   Sau deploy story này: `pm2 logs banhang --lines 100` — xác nhận không có
   lỗi khởi động. Không cần monitoring dài hạn vì story này không đổi hành vi
   runtime (LOYALTY_ENABLED=false).

   Risk profile: docs/qa/assessments/1.1-risk-20260813.md
```

⚙️ **Cơ chế** — hai điều đáng chú ý:

1. **REG-002 là loại rủi ro chỉ brownfield có**: "test khoá sai hành vi". Ở greenfield không có "hành vi cũ" nào để khoá sai. QA nhận diện được nó vì nó đọc `brownfield-architecture.md` và thấy sự không nhất quán `total_amount`/`totalAmount`.
2. **Gotcha PM2 khuếch đại rủi ro**: bản thân việc tách `app` khỏi `listen` là thay đổi 3 dòng, bình thường score sẽ là 2–3. Nhưng vì có gotcha "PM2 báo online khi app đã chết", tác động được nâng lên High. Đây là ví dụ tài liệu thực trạng ảnh hưởng trực tiếp tới chấm điểm rủi ro.

## 8.2 `*design` — chiến lược test

```text
👤 Bạn: *design docs/stories/1.1.nen-tang-cong-tac-test-luoi-an-toan.md
```

```text
🤖 Đang nạp test-design.md + test-levels-framework.md + test-priorities-matrix.md...

   ## Test Strategy Overview
   - Total test scenarios: **18**
   - Unit: 6 (33%) · Integration: 11 (61%) · E2E: 1 (6%)
   - Priority: P0: 9 · P1: 6 · P2: 3

   🔴 Tỉ lệ integration cao (61%) là **bình thường với brownfield**: mục tiêu
   chính của story này là khoá lại hành vi của các endpoint đang chạy, và điều
   đó chỉ kiểm được ở mức integration.

   ## Test Scenarios by Acceptance Criteria

   ### AC2: Regression test POST /api/orders (giữ `total_amount` snake_case)
   | ID | Level | Priority | Test | Justification |
   |----|-------|----------|------|---------------|
   | 1.1-INT-001 | Integration | **P0** | Tạo đơn 2 item → response có key `total_amount` | Contract test — bảo vệ CR1 |
   | 1.1-INT-002 | Integration | **P0** | `total_amount` = Σ(price×qty), KHÔNG có VAT | Khoá hành vi hiện tại (bug VAT không sửa) |
   | 1.1-INT-003 | Integration | P1 | Thiếu customerId → 4xx + `{ message }` | Khoá shape lỗi hiện tại |
   → mitigates_risks: ['REG-002']

   ### AC4: Regression test GET /api/orders/:id (5 field app mobile dùng)
   | ID | Level | Priority | Test | Justification |
   |----|-------|----------|------|---------------|
   | 1.1-INT-004 | Integration | **P0** | Response có đúng 5 field: `_id`, `customerName`, `totalAmount`, `status`, `createdAt` | Contract test cho consumer thật |
   | 1.1-INT-005 | Integration | **P0** | Key là `totalAmount` (camelCase), KHÔNG phải `total_amount` | 🔴 khoá sự không nhất quán có thật |
   → mitigates_risks: ['REG-002'] · Compatibility: bảo vệ app mobile

   ### AC1 + IV2: Jest chạy được và app vẫn khởi động
   | ID | Level | Priority | Test | Justification |
   |----|-------|----------|------|---------------|
   | 1.1-INT-006 | Integration | **P0** | `require('../server')` KHÔNG tự listen | Nếu sai, test treo vô hạn |
   | 1.1-E2E-001 | E2E | **P0** | `GET /` trả 200 (smoke) | Phát hiện app chết lúc khởi động |
   → mitigates_risks: ['REG-001']

   ### AC5: Module cấu hình LOYALTY_ENABLED
   | ID | Level | Priority | Test | Justification |
   |----|-------|----------|------|---------------|
   | 1.1-UNIT-001 | Unit | **P0** | Không set biến → `enabled === false` | Mặc định an toàn |
   | 1.1-UNIT-002 | Unit | **P0** | `'true'` → `enabled === true` | |
   | 1.1-UNIT-003 | Unit | P1 | `'TRUE'`, `'1'`, `''`, `'yes'` → `false` | Chỉ đúng chuỗi `'true'` mới bật |
   | 1.1-UNIT-004 | Unit | P1 | Thiếu MONGO_URI → ném lỗi rõ ràng | |

   ### 🔴 Regression Testing — nhóm riêng của brownfield
   | ID | Level | Priority | Test | Justification |
   |----|-------|----------|------|---------------|
   | 1.1-INT-007 | Integration | **P0** | PUT sửa số lượng → `total_amount` tính lại đúng | Module legacy bị chạm |
   | 1.1-INT-008 | Integration | P1 | PUT đơn không tồn tại → 404 + `{ message }` | |
   | 1.1-INT-009 | Integration | P1 | GET danh sách có `?limit` và `?skip` hoạt động | App mobile dùng |
   | 1.1-INT-010 | Integration | P2 | GET danh sách rỗng → trả `[]`, không phải null | Edge case |
   | 1.1-INT-011 | Integration | P2 | Test dùng DB test, không phải production | Bảo vệ OPS-001 |

   ## 🔴 Existing Functionality Requiring Regression Tests
   Theo chuẩn brownfield **"Every touched legacy module needs tests"**:

   | Module legacy bị chạm | Có test chưa? | Test nào phủ |
   |----------------------|--------------|--------------|
   | `server.js` | ✅ | 1.1-INT-006, 1.1-E2E-001 |
   | `routes/orders.js` (không sửa nhưng test khoá lại) | ✅ | 1.1-INT-001..003, 007..010 |
   | `utils/db.js` | ❌ | **KHÔNG chạm** trong story này ⇒ không cần |
   | `views/*.ejs` | ❌ | không có test tự động; IV2 kiểm tay |

   ⚠️ `views/*.ejs` không có test — đây là **khoảng trống được ghi nhận có ý thức**.
   Viết e2e test cho EJS + jQuery đòi hỏi Playwright/Puppeteer, nằm ngoài phạm vi
   story này. Bù lại bằng IV2 (kiểm tay 3 trang).

   ## 🔴 Performance Baseline to Maintain
   Chuẩn brownfield: **"Must maintain or improve current metrics"**
   | Thao tác | Baseline | Ngưỡng cho phép |
   |---------|----------|-----------------|
   | `POST /api/orders` | 240ms | ≤ 250ms (story này không thêm logic runtime) |
   | `GET /api/orders?limit=20` | 180ms | ≤ 190ms |
   ⇒ IV3 phải đo và so.

   ## Recommended Execution Order
   1. **P0 Unit** (fail fast) — 1.1-UNIT-001, 002
   2. **P0 Integration** — INT-001, 002, 004, 005, 006, 007
   3. **P0 E2E** — E2E-001 (smoke)
   4. **P1** — 6 test
   5. **P2** — 3 test

   ## Gate YAML Block
   ```yaml
   test_design:
     scenarios_total: 18
     by_level: { unit: 6, integration: 11, e2e: 1 }
     by_priority: { p0: 9, p1: 6, p2: 3 }
     coverage_gaps:
       - 'views/*.ejs không có test tự động — bù bằng kiểm tay IV2'
   ```

   Test design matrix: docs/qa/assessments/1.1-test-design-20260813.md
   P0 tests identified: 9
```

⚙️ **Cơ chế** — ba điều `*design` vừa làm mà greenfield không có:

1. **Bảng "Existing Functionality Requiring Regression Tests"** — liệt kê từng module legacy bị chạm và test nào phủ nó. Đây là cách cưỡng chế chuẩn *"Every touched legacy module needs tests"*.
2. **Bảng Performance Baseline** — ghi số "trước" để `*nfr` có thể so "sau". Không có nó thì `*nfr` chỉ có thể nói "Target unknown".
3. **`coverage_gaps` ghi nhận khoảng trống có ý thức** — `views/*.ejs` không test được trong phạm vi này, và điều đó được ghi vào gate thay vì im lặng.

## 8.3 Bây giờ bạn mới duyệt story

```text
👤 Bạn: [đọc story + risk profile + test design]

   Hai điều tôi muốn sửa story:
   1. REG-001 nói phải kiểm `pm2 logs` sau deploy — thêm vào story thành một
      subtask tường minh, đừng để trong đầu.
   2. Test design có 18 scenario nhưng story chỉ có 7 task. Thêm task cho
      smoke test và test cấu hình biến sai.

👤 Bạn: @sm
👤 Bạn: Cập nhật story 1.1: thêm subtask "kiểm pm2 logs sau deploy" vào Task 7;
   thêm Task 8 cho smoke test GET / và các test biến môi trường sai giá trị.

🤖 [SM cập nhật story]
   - Task 7 thêm subtask: `pm2 logs banhang --lines 50` sau deploy, xác nhận
     không có lỗi khởi động (không tin trạng thái "online")
   - Task 8 mới: smoke test + test biến môi trường sai giá trị
     (`'TRUE'`, `'1'`, `''`, `'yes'` đều phải cho `false`)

👤 Bạn: [đổi Status: Draft → Approved]
```

## Trạng thái sau bước 8

📂

```text
docs/
├── stories/1.1.*.md                        ← Status: Approved (đã cập nhật)
└── qa/                                     ← MỚI
    └── assessments/
        ├── 1.1-risk-20260813.md            ← MỚI: 4 rủi ro, 2 High
        └── 1.1-test-design-20260813.md      ← MỚI: 18 scenario, 9 P0
```

## Bảng tra: chạy lệnh QA nào theo tình huống brownfield

Từ `docs/working-in-the-brownfield.md`:

| Tình huống | Lệnh, theo thứ tự | Vì sao |
|---|---|---|
| **Thêm tính năng vào code legacy** | `*risk` → `*design` → `*trace` → `*review` | Map hết phụ thuộc trước |
| **Sửa API** | `*risk` → `*design` → `*nfr` → `*review` | Tránh phá consumer |
| **Thay đổi ảnh hưởng hiệu năng** | `*nfr` sớm và thường xuyên → `*review` | Bắt suy giảm ngay |
| **Migration dữ liệu** | `*risk` → `*design` → `*trace` → `*review` → `*gate` | Đảm bảo toàn vẹn dữ liệu |
| **Sửa bug trong hệ thống phức tạp** | `*risk` → `*trace` → `*review` | Tránh hiệu ứng phụ |

Story 1.1 thuộc loại đầu tiên (thêm tính năng vào code legacy) ⇒ đã chạy `*risk` + `*design`; `*trace` sẽ chạy ở [bước 10](./10-qa-review.md).

## Bạn tự làm gì ở bước này

- [ ] Mở **chat mới** cho QA
- [ ] Chạy `*risk` **trước khi duyệt story** — với brownfield đây không phải tuỳ chọn
- [ ] Đọc mục **Critical Risks**: rủi ro nào là do **hệ thống cũ** (gotcha, nợ kỹ thuật) khuếch đại? Đó là loại bạn không thể đoán bằng cách đọc code mới
- [ ] Chạy `*design`, đọc bảng **Existing Functionality Requiring Regression Tests**
- [ ] Xác nhận **Performance Baseline** có số liệu thật (bạn đã đo ở [bước 1](./01-cai-dat-va-flatten.md))
- [ ] Đối chiếu số scenario của `*design` với số task của story — thiếu thì yêu cầu SM bổ sung
- [ ] **Bây giờ mới** đổi `Draft → Approved`

---

[⬅ Bước trước](./07-story-sm.md) · [Chỉ mục](./README.md) · [Bước sau: Dev triển khai ➡](./09-dev-story.md)
