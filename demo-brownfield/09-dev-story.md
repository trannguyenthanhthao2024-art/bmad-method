[⬅ Bước trước](./08-qa-risk-design.md) · [Chỉ mục](./README.md) · [Bước sau ➡](./10-qa-review.md)

# Bước 9 — Dev triển khai Story 1.1

> ⚠️ **MỞ CHAT MỚI.**

## Lệnh

```text
👤 Bạn: @dev
```

## Agent nạp gì

```text
🤖 [STEP 1] Đọc toàn bộ .bmad-core/agents/dev.md
   [STEP 2] Nhập vai James — Full Stack Developer
   [STEP 3] Nạp .bmad-core/core-config.yaml
   [CRITICAL] Nạp devLoadAlwaysFiles:
       ✓ docs/architecture/coding-standards.md      (62 dòng)
       ✓ docs/architecture/tech-stack.md            (38 dòng)
       ✓ docs/architecture/source-tree.md           (44 dòng)
```

🔴 **Chú ý điều Dev KHÔNG nạp**: `docs/brownfield-architecture.md` (400 dòng thực trạng hệ thống). Dev **không** đọc nó — mọi thứ Dev cần đã được SM nén vào Dev Notes của story ở [bước 7](./07-story-sm.md).

⚙️ **Cơ chế**: đây là lý do mục *"Hành vi HIỆN TẠI mà regression test phải khoá lại"* trong Dev Notes phải chính xác. Nếu SM ghi sai `total_amount`/`totalAmount`, Dev sẽ viết test sai và **không có cách nào phát hiện** — vì nó không được phép đọc tài liệu gốc.

## Triển khai

```text
👤 Bạn: *develop-story docs/stories/1.1.nen-tang-cong-tac-test-luoi-an-toan.md
```

```text
🤖 Đã đọc story. Status: Approved ✓

   Tôi thấy ba điều đặc biệt trong story này:
   1. Đây là brownfield — có mục Integration Verification, không chỉ AC
   2. Dev Notes yêu cầu tôi khoá lại hành vi HIỆN TẠI, kể cả khi không nhất quán
      (`total_amount` ở POST, `totalAmount` ở GET) và kể cả bug VAT
   3. Có Critical Integration Rules cấm sửa/xoá key trong response /api/orders*

   Tôi sẽ đặc biệt cẩn thận với Task 3 (sửa server.js) — story ghi đây là thay
   đổi DUY NHẤT được phép trong file đó.

   ─── Task 1: Cài Jest và supertest ───
```

### Task 1–2

```text
🤖 $ npm i -D jest@29 supertest@6
   ✓ added 3 packages

   ⚠️ Tôi cố định `jest@29` theo story, KHÔNG dùng `@latest`. Story ghi rõ:
     Jest 30 yêu cầu Node 18+, hệ thống đang Node 16.

   jest.config.js:
   ```js
   module.exports = {
     testEnvironment: 'node',
     testMatch: ['**/tests/**/*.test.js'],
     testTimeout: 10000,
   };
   ```

   package.json — thêm script:
   ```json
   "scripts": {
     "start": "node server.js",
     "test": "jest"
   }
   ```

   tests/smoke.test.js — test trivial để xác nhận Jest chạy:
   ```js
   describe('Jest setup', () => {
     it('chạy được', () => { expect(1 + 1).toBe(2); });
   });
   ```

   $ npm test
   ✓ tests/smoke.test.js (1 test) 8ms
   ✓ Tick Task 1

   ─── Task 2: Module cấu hình ───

   $ npm i dotenv@16

   config/index.js:
   ```js
   'use strict';

   function parseBool(raw) {
     // CHỈ chuỗi 'true' chính xác mới bật. Mọi giá trị khác → false.
     // Đây là mặc định an toàn: cấu hình sai ⇒ tính năng TẮT, không phải BẬT.
     return raw === 'true';
   }

   function loadConfig(env = process.env) {
     if (!env.MONGO_URI) {
       throw new Error('Thiếu biến môi trường MONGO_URI');
     }
     return {
       mongoUri: env.MONGO_URI,
       loyaltyEnabled: parseBool(env.LOYALTY_ENABLED),
     };
   }

   module.exports = { loadConfig, parseBool };
   ```

   ⚠️ Tôi dùng pattern `loadConfig(env = process.env)` — nhận tham số có default.
     Coding standards mục Enhancement-Specific Standards luật #2 yêu cầu điều này
     để test được mà không phải sửa biến global.

   ⚠️ Tôi KHÔNG chạm utils/db.js. Story ghi rõ connection string hardcode nằm
     ngoài phạm vi. `MONGO_URI` là biến mới, sẽ được dùng khi có story riêng
     để chuyển utils/db.js sang dùng nó.

   server.js — dòng ĐẦU TIÊN:
   ```js
   require('dotenv').config();
   ```

   .env.example:
   ```text
   MONGO_URI=mongodb://localhost:27017/banhang
   MONGO_URI_TEST=mongodb://localhost:27017/banhang_test
   LOYALTY_ENABLED=false
   ```

   .gitignore — thêm `.env`

   tests/unit/config.test.js:
   ```js
   const { loadConfig, parseBool } = require('../../config');

   describe('parseBool', () => {
     it('chỉ chuỗi "true" mới cho true', () => {
       expect(parseBool('true')).toBe(true);
     });
     it.each(['TRUE', '1', '', 'yes', undefined, 'True'])(
       'giá trị %p cho false (mặc định an toàn)',
       (raw) => { expect(parseBool(raw)).toBe(false); },
     );
   });

   describe('loadConfig', () => {
     it('mặc định loyaltyEnabled = false', () => {
       const cfg = loadConfig({ MONGO_URI: 'mongodb://x/y' });
       expect(cfg.loyaltyEnabled).toBe(false);
     });
     it('bật khi LOYALTY_ENABLED=true', () => {
       const cfg = loadConfig({ MONGO_URI: 'mongodb://x/y', LOYALTY_ENABLED: 'true' });
       expect(cfg.loyaltyEnabled).toBe(true);
     });
     it('ném lỗi rõ ràng khi thiếu MONGO_URI', () => {
       expect(() => loadConfig({})).toThrow(/MONGO_URI/);
     });
   });
   ```

   $ npm test  → ✓ 10 tests pass
   ✓ Tick Task 2
```

### Task 3 — thay đổi file legacy 🔴

```text
🤖 ─── Task 3: Hạ tầng test cho API ───

   Đây là task rủi ro nhất của story (REG-001, score 6). Tôi làm cẩn thận.

   **Trạng thái hiện tại của server.js (3 dòng cuối):**
   ```js
   const PORT = 3000;
   app.listen(PORT, () => console.log('BanHang chạy ở cổng ' + PORT));
   ```

   **Thay đổi tối thiểu:**
   ```js
   const PORT = process.env.PORT || 3000;

   // Chỉ listen khi chạy trực tiếp (node server.js).
   // Khi được require từ test, chỉ export app để supertest dùng.
   if (require.main === module) {
     app.listen(PORT, () => console.log('BanHang chạy ở cổng ' + PORT));
   }

   module.exports = app;
   ```

   ⚠️ Ba điều tôi cố ý KHÔNG làm:
   - KHÔNG đổi `const PORT = 3000` thành đọc từ config/index.js — story không
     yêu cầu, và đổi sẽ làm diff lớn hơn cần thiết
   - KHÔNG sắp xếp lại import, KHÔNG format lại file
   - KHÔNG sửa gì khác trong 340 dòng còn lại

   Diff thực tế: **+5 −1 dòng**.

   **Xác minh REG-001 ngay lập tức:**
   $ npm start
   ✓ BanHang chạy ở cổng 3000
   $ curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/
   ✓ 200

   tests/helpers/db.js:
   ```js
   const mongoose = require('mongoose');

   const TEST_URI = process.env.MONGO_URI_TEST;

   async function connect() {
     if (!TEST_URI) throw new Error('Thiếu MONGO_URI_TEST — từ chối chạy test');
     if (!/test/i.test(TEST_URI)) {
       // Bảo vệ OPS-001: không bao giờ chạy test trên DB không có chữ "test"
       throw new Error('MONGO_URI_TEST phải trỏ tới database có chữ "test"');
     }
     await mongoose.connect(TEST_URI, { useNewUrlParser: true, useUnifiedTopology: true });
   }

   async function clear() {
     const { collections } = mongoose.connection;
     for (const key of Object.keys(collections)) {
       await collections[key].deleteMany({});
     }
   }

   async function disconnect() { await mongoose.connection.close(); }

   module.exports = { connect, clear, disconnect };
   ```

   ⚠️ Hàm `connect()` từ chối chạy nếu URI không chứa chữ "test". Đây là mitigation
     cho OPS-001 (test xoá dữ liệu production). Rẻ và hiệu quả.

   ⚠️ `useNewUrlParser` + `useUnifiedTopology` là API của **Mongoose 5**. Với
     Mongoose 6+ hai option này bị bỏ. Story ghi rõ hệ thống dùng Mongoose 5.12.

   ✓ Tick Task 3
```

⚙️ **Cơ chế** — chú ý ba hành vi của Dev ở task này, đều là kỷ luật brownfield:

| Hành vi | Vì sao quan trọng |
|---|---|
| Diff tối thiểu (+5 −1) trong file legacy | Diff nhỏ = dễ review, dễ rollback, ít rủi ro regression |
| Từ chối "dọn dẹp" thêm (không format, không sắp import) | Mỗi dòng thay đổi ngoài phạm vi là một rủi ro không có test bảo vệ |
| Kiểm `npm start` **ngay** sau khi sửa | REG-001 nói rủi ro là "app không khởi động" ⇒ xác minh ngay, không đợi tới cuối |

### Task 4–6 — regression test khoá hành vi hiện tại 🔴

```text
🤖 ─── Task 4: Regression test POST /api/orders ───

   tests/integration/orders-regression.test.js:
   ```js
   const request = require('supertest');
   const app = require('../../server');
   const db = require('../helpers/db');
   const { makeCustomer, makeProduct } = require('../helpers/fixtures');

   // ═══════════════════════════════════════════════════════════════
   // CÁC TEST DƯỚI ĐÂY KHOÁ LẠI HÀNH VI HIỆN TẠI CỦA HỆ THỐNG,
   // KHÔNG PHẢI HÀNH VI ĐÚNG.
   //
   // Cụ thể, hai điều dưới đây là KHÔNG NHẤT QUÁN nhưng CỐ Ý giữ:
   //   - POST /api/orders   trả `total_amount`  (snake_case)
   //   - GET  /api/orders/:id trả `totalAmount` (camelCase)
   // App mobile của shipper đang đọc `totalAmount` từ endpoint GET.
   //
   // Ngoài ra: tổng tiền ở đây KHÔNG cộng VAT, trong khi báo cáo
   // (utils/helpers.js:88) CÓ cộng VAT 10%. Đây là BUG đã biết,
   // KHÔNG sửa trong enhancement này.
   //
   // ⛔ KHÔNG "sửa" code để khớp với hình dung của bạn về cái đúng.
   //    Nếu test này fail, nghĩa là hành vi hệ thống đã đổi — điều tra trước.
   // ═══════════════════════════════════════════════════════════════

   beforeAll(db.connect);
   afterEach(db.clear);
   afterAll(db.disconnect);

   describe('POST /api/orders — hành vi hiện tại', () => {
     it('trả về key `total_amount` (snake_case), KHÔNG phải totalAmount', async () => {
       const customer = await makeCustomer();
       const p1 = await makeProduct({ price: 50000 });
       const p2 = await makeProduct({ price: 30000 });

       const res = await request(app).post('/api/orders').send({
         customerId: customer._id.toString(),
         items: [
           { productId: p1._id.toString(), qty: 2 },
           { productId: p2._id.toString(), qty: 1 },
         ],
       });

       expect(res.status).toBeLessThan(300);
       expect(res.body).toHaveProperty('total_amount');
       expect(res.body).not.toHaveProperty('totalAmount');
     });

     it('total_amount = Σ(price×qty), KHÔNG cộng VAT', async () => {
       const customer = await makeCustomer();
       const p = await makeProduct({ price: 100000 });

       const res = await request(app).post('/api/orders').send({
         customerId: customer._id.toString(),
         items: [{ productId: p._id.toString(), qty: 3 }],
       });

       // 300000 — nếu có VAT 10% sẽ là 330000
       expect(res.body.total_amount).toBe(300000);
     });

     it('thiếu customerId → 4xx với { message }', async () => {
       const res = await request(app).post('/api/orders').send({ items: [] });
       expect(res.status).toBeGreaterThanOrEqual(400);
       expect(res.status).toBeLessThan(500);
       expect(res.body).toHaveProperty('message');
     });
   });

   describe('GET /api/orders/:id — 5 field app mobile dùng', () => {
     it('trả đúng 5 field, và totalAmount là camelCase', async () => {
       const customer = await makeCustomer({ name: 'Trần Văn A' });
       const p = await makeProduct({ price: 75000 });
       const created = await request(app).post('/api/orders').send({
         customerId: customer._id.toString(),
         items: [{ productId: p._id.toString(), qty: 2 }],
       });

       const res = await request(app).get(`/api/orders/${created.body._id}`);

       expect(res.status).toBe(200);
       // 5 field mà app mobile của shipper đang đọc — CR1
       expect(res.body).toHaveProperty('_id');
       expect(res.body).toHaveProperty('customerName');
       expect(res.body).toHaveProperty('totalAmount');
       expect(res.body).toHaveProperty('status');
       expect(res.body).toHaveProperty('createdAt');
       // khoá lại: endpoint NÀY dùng camelCase, khác POST
       expect(res.body).not.toHaveProperty('total_amount');
     });
   });
   ```

   ─── Task 5, 6: PUT và GET danh sách ───
   [thêm 5 test: PUT tính lại tổng · PUT 404 · GET ?limit&skip · GET rỗng trả [] ]

   ─── Task 8: Smoke test + biến môi trường sai ───
   tests/integration/smoke.test.js:
   ```js
   it('GET / trả 200 — app khởi động được', async () => {
     const res = await request(app).get('/');
     expect(res.status).toBe(200);
   });
   ```
```

⚙️ **Cơ chế — khối comment đầu file test là quan trọng nhất trong toàn bộ story này.**

Nó tồn tại vì rủi ro REG-002 (`*risk` phát hiện ở [bước 8](./08-qa-risk-design.md)): sáu tháng sau, một người (hoặc một agent) sẽ mở file này, thấy `total_amount` vs `totalAmount` không nhất quán, và "sửa cho đẹp". Comment đó là thứ duy nhất ngăn họ lại.

### IV1 — xác minh cốt lõi của brownfield 🔴

```text
🤖 ─── Task 7: Xác minh tích hợp ───

   **IV1: Chạy toàn bộ suite trên code CHƯA sửa logic**

   Đây là bước xác minh quan trọng nhất. Tôi đã sửa server.js (+5 −1 dòng) nhưng
   KHÔNG sửa routes/orders.js. Nếu test khoá đúng hành vi hiện tại, tất cả phải
   pass ngay.

   $ npm test

   PASS tests/unit/config.test.js          (9 tests)
   PASS tests/integration/smoke.test.js    (1 test)
   PASS tests/integration/orders-regression.test.js  (8 tests)
     ✓ trả về key `total_amount` (snake_case), KHÔNG phải totalAmount    142ms
     ✓ total_amount = Σ(price×qty), KHÔNG cộng VAT                        89ms
     ✓ thiếu customerId → 4xx với { message }                             31ms
     ✓ trả đúng 5 field, và totalAmount là camelCase                     156ms
     ✓ PUT sửa số lượng → total_amount tính lại đúng                     134ms
     ✓ PUT đơn không tồn tại → 404 với { message }                        28ms
     ✓ GET danh sách có ?limit và ?skip hoạt động                          97ms
     ✓ GET danh sách rỗng trả [], không phải null                         24ms

   Test Suites: 3 passed, 3 total
   Tests:       18 passed, 18 total

   ✅ **IV1 ĐẠT** — 18/18 pass trên code chưa sửa logic.
      ⇒ Bằng chứng: test phản ánh đúng hành vi hiện tại của hệ thống.

   ⚠️ Nếu có test fail ở bước này, tôi PHẢI sửa TEST, không sửa CODE. Test fail
     nghĩa là tôi đã hiểu sai hành vi hệ thống.

   **IV2: Kiểm tay 3 trang**
   $ npm start
   ✓ http://localhost:3000/            → trang chủ hiển thị đúng
   ✓ http://localhost:3000/orders      → danh sách đơn, cột "Tổng tiền" có số
   ✓ http://localhost:3000/customers/<id> → chi tiết khách, chưa có phần điểm
                                            (đúng — story 1.5 mới thêm)
   ✅ **IV2 ĐẠT**

   **IV3: Đo hiệu năng so baseline 240ms**
   $ for i in {1..10}; do curl -w "%{time_total}\n" -o /dev/null -s \
       -X POST http://localhost:3000/api/orders -d '...'; done
   Kết quả (ms): 238 241 236 244 239 242 237 240 243 238
   Trung vị: **239ms**  (baseline 240ms, dung sai ±10ms)
   ✅ **IV3 ĐẠT** — không có suy giảm. Hợp lý: story này không thêm logic runtime.
```

### DoD checklist

```text
🤖 Đang chạy execute-checklist với story-dod-checklist...

   **1. Requirements Met**
   - [x] 6/6 AC đạt
   - [x] 🔴 3/3 Integration Verification đạt (IV1, IV2, IV3)

   **2. Coding Standards & Project Structure**
   - [x] CommonJS, không ESM ✓
   - [x] Lỗi dạng `{ message }` ✓
   - [x] camelCase cho code mới; KHÔNG bắt chước `total_amount` ✓
   - [x] Critical Integration Rules: không sửa/xoá key nào trong response ✓
   - [x] Enhancement standard #2: `loadConfig(env = process.env)` nhận dependency ✓
   - [x] Không lỗi/cảnh báo mới (không có linter trong dự án — kiểm bằng mắt)

   **3. Testing**
   - [x] 18 test, đúng số scenario mà *design đề ra
   - [x] 🔴 Regression test cho mọi module legacy bị chạm:
         server.js ✓ · routes/orders.js ✓
   - [x] Mọi test pass
   - [N/A] Ngưỡng coverage — dự án chưa đặt

   **4. Functionality & Verification**
   - [x] Đã tự chạy và kiểm tay 3 trang
   - [x] Edge case: biến môi trường sai giá trị (5 case), DB rỗng, đơn không tồn tại

   **5. Story Administration**
   - [x] Mọi task [x]
   - [x] Quyết định trong lúc phát triển đã ghi vào Completion Notes
   - [x] Wrap-up: model dùng, changelog

   **6. Dependencies, Build & Configuration**
   - [x] Không có build step (đúng ràng buộc) — `npm start` chạy được
   - [N/A] Linting — dự án không có
   - [x] 3 dependency mới ĐÃ được nêu trong story và tech-stack ⇒ pre-approved
   - [x] Đã ghi vào package.json với phiên bản cố định
   - [x] `npm audit`: 0 vulnerabilities
   - [x] Biến môi trường mới ghi trong `.env.example`

   **7. Documentation**
   - [x] Comment giải thích trong `config/index.js` và khối cảnh báo trong file test
   - [N/A] Tài liệu người dùng — story không có tính năng hướng người dùng
   - [x] Cần cập nhật README (hướng dẫn chạy test) — ĐÃ làm

   ### Tóm tắt DoD

   1. **Đã hoàn thành**: Jest 29 + supertest, 18 test (9 unit + 9 integration/smoke),
      module cấu hình với công tắc `LOYALTY_ENABLED` mặc định tắt, regression test
      khoá lại hành vi hiện tại của 3 endpoint `/api/orders*`.
   2. **Mục [ ] Not Done**: không có. Các mục [N/A] do dự án chưa có linter/coverage.
   3. **Nợ kỹ thuật ghi nhận**:
      - `views/*.ejs` vẫn không có test tự động (cần Playwright — ngoài phạm vi)
      - `utils/db.js` vẫn hardcode credential (ngoài phạm vi, đã có `MONGO_URI`
        sẵn sàng cho story riêng)
      - `const PORT = 3000` chưa đọc từ config (cố ý giữ diff nhỏ)
   4. **Bài học cho story sau**:
      - Pattern `loadConfig(env = process.env)` và `checkX(key, now = Date.now())`
        nên dùng cho mọi module mới — test được mà không mock global
      - Hàm `db.connect()` từ chối URI không chứa "test" — rẻ và ngăn được sự cố
        nghiêm trọng. Nên áp dụng cho mọi helper test
      - `require.main === module` là pattern chuẩn để vừa chạy được vừa test được
   5. **Story sẵn sàng review**: CÓ.

   - [x] I, the Developer Agent, confirm that all applicable items above have
         been addressed.

   → Status: Ready for Review → HALT.
```

## Story sau khi Dev cập nhật

```markdown
## Status
Ready for Review

## Dev Agent Record

### Agent Model Used
Claude Opus 5 (claude-opus-5)

### Debug Log References
- `npm test` lần 1: fail 1 test (GET danh sách rỗng trả `null` thay vì `[]`)
  → điều tra: `routes/orders.js:52` trả trực tiếp kết quả `find()`, Mongoose 5
    trả `[]` nhưng handler có `if (!orders) return res.json(null)` — code chết
  → **KHÔNG sửa code**, sửa test cho khớp hành vi thật: trả `[]`
  → 🔴 đây chính là tình huống REG-002 cảnh báo. Test phải theo code, không
    phải code theo test
- `npm start` sau khi sửa server.js: ✓ cổng 3000, `GET /` trả 200
- `npm test` cuối: 18/18 pass
- Đo hiệu năng POST /api/orders: trung vị 239ms (baseline 240ms) ✓
- `npm audit`: 0 vulnerabilities

### Completion Notes List
- **Diff trong file legacy tối thiểu**: `server.js` chỉ +5 −1 dòng. Cố ý KHÔNG
  format lại, KHÔNG sắp xếp import, KHÔNG đổi `const PORT = 3000` — mỗi dòng
  thay đổi ngoài phạm vi là rủi ro không có test bảo vệ.
- **Khối comment cảnh báo ở đầu file regression test** là phần quan trọng nhất
  của story này. Nó ngăn người sau "sửa cho đẹp" sự không nhất quán
  `total_amount`/`totalAmount` và làm chết app mobile.
- **`db.connect()` từ chối URI không chứa "test"** — mitigation cho rủi ro
  OPS-001 (test xoá dữ liệu production). 3 dòng code, ngăn được sự cố nghiêm trọng.
- **Phát hiện code chết**: `routes/orders.js:52` có nhánh `if (!orders)` không
  bao giờ chạy được với Mongoose 5. Đã ghi nhận, KHÔNG sửa (ngoài phạm vi).
- **Không chạm `utils/db.js`** dù `MONGO_URI` đã sẵn sàng — để dành cho story riêng.

### File List
**Thêm mới:**
- `jest.config.js`
- `config/index.js`
- `tests/smoke.test.js`
- `tests/helpers/db.js`
- `tests/helpers/fixtures.js`
- `tests/unit/config.test.js`
- `tests/integration/smoke.test.js`
- `tests/integration/orders-regression.test.js`
- `.env.example`

**Sửa:**
- `server.js` (+5 −1: export app, `require.main` guard, `require('dotenv')`)
- `package.json` (script test + 3 devDependency)
- `.gitignore` (thêm `.env`)
- `README.md` (mục hướng dẫn chạy test)

**Xoá:** không có
```

## Trạng thái đĩa sau bước 9

📂

```text
banhang/
├── config/index.js               ← MỚI
├── jest.config.js                ← MỚI
├── tests/                        ← MỚI: 18 test, thư mục test đầu tiên của dự án
│   ├── helpers/{db,fixtures}.js
│   ├── unit/config.test.js
│   ├── integration/{smoke,orders-regression}.test.js
│   └── smoke.test.js
├── .env.example                  ← MỚI
├── server.js                     ← SỬA (+5 −1)
├── package.json .gitignore README.md   ← SỬA
├── routes/ models/ views/ utils/       ← KHÔNG chạm
└── docs/...
```

🔴 **Điều đáng chú ý**: sau story đầu tiên của một enhancement brownfield, thứ bạn có **không phải tính năng** — mà là **lưới an toàn**. `LOYALTY_ENABLED` vẫn `false`, người dùng không thấy gì thay đổi. Đó là thiết kế đúng.

## Nếu Dev HALT — tình huống brownfield điển hình

```text
🤖 ⛔ HALT — điều kiện blocking: "Ambiguous after story check"

   Ở Task 6, tôi cần test `GET /api/orders?limit=20&skip=0`. Nhưng khi đọc
   routes/orders.js:45, tôi thấy:

   ```js
   const limit = parseInt(req.query.limit) || 20;
   const skip = parseInt(req.query.skip) || 0;
   ```

   `parseInt('abc')` cho `NaN`, và `NaN || 20` cho `20`. Nghĩa là `?limit=abc`
   được xử lý như `?limit=20`, không báo lỗi.

   Story không nói tôi phải khoá lại hành vi này (im lặng chấp nhận input sai)
   hay coi nó là bug.

   Tôi cần bạn quyết định:
   1. Khoá lại hành vi hiện tại: `?limit=abc` → trả 20 phần tử, không lỗi
   2. Coi là bug, tạo story riêng để sửa, story này chỉ test input hợp lệ
   3. Sửa luôn trong story này (⚠️ mở rộng phạm vi, và có thể phá app mobile
      nếu nó đang gửi limit không hợp lệ)

👤 Bạn: 1. Khoá lại hành vi hiện tại. Ghi vào Completion Notes là hành vi này
   đáng xem lại, nhưng không sửa bây giờ.

🤖 Rõ. Thêm test:
   it('?limit=abc được xử lý như limit mặc định 20, không báo lỗi', ...)
   Và ghi vào Completion Notes.
```

⚙️ **Cơ chế**: đây là lần HALT **đúng đắn**. Dev không tự quyết định "input sai thì nên báo lỗi" — vì với brownfield, hành vi lạ có thể là thứ mà consumer đang dựa vào. Lựa chọn 3 nghe hợp lý nhất về kỹ thuật nhưng là lựa chọn nguy hiểm nhất.

## Bạn tự làm gì ở bước này

- [ ] Mở **chat mới**
- [ ] Kiểm **diff trong file legacy** — càng nhỏ càng tốt. `server.js` +5 −1 là tốt; +80 −40 là dấu hiệu Dev đang "dọn dẹp"
- [ ] Kiểm **IV1**: test có pass trên code chưa sửa logic không? Đây là bằng chứng test khoá đúng hành vi
- [ ] Nếu test fail ở IV1: yêu cầu Dev **sửa test, không sửa code**
- [ ] Kiểm **khối comment cảnh báo** ở đầu file regression test — có đủ rõ để người sau không "sửa cho đẹp"?
- [ ] Tự chạy `npm test` và **kiểm tay** các trang không có test tự động (IV2)
- [ ] Tự đo hiệu năng, so baseline (IV3)
- [ ] Khi Dev HALT về hành vi lạ của hệ thống cũ: mặc định chọn **"khoá lại hành vi hiện tại"**, ghi nhận để xử lý riêng
- [ ] **CHƯA commit.** Đợi QA ở bước 10

---

[⬅ Bước trước](./08-qa-risk-design.md) · [Chỉ mục](./README.md) · [Bước sau: QA review + gate ➡](./10-qa-review.md)
