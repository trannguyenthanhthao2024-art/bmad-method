[⬅ Bước trước](./02-phan-loai-va-dinh-tuyen.md) · [Chỉ mục](./README.md) · [Bước sau ➡](./04-pm-brownfield-prd.md)

# Bước 3 — `*document-project`: nắm thực trạng 🔴

Đây là bước **quan trọng nhất và đặc trưng nhất của brownfield**. Nó biến 18.000 dòng code không tài liệu thành ngữ cảnh mà AI agent đọc được.

## Lệnh

```text
👤 Bạn: @architect

🤖 Xin chào! Tôi là Winston 🏗️ — Architect.
   [hiện 11 lệnh]

👤 Bạn: *document-project
```

## Agent nạp gì

```text
.bmad-core/agents/architect.md              ← persona (lúc kích hoạt)
.bmad-core/core-config.yaml                 ← (lúc kích hoạt)
.bmad-core/tasks/document-project.md        ← thủ tục
.bmad-core/data/technical-preferences.md    ← ràng buộc hệ thống cũ bạn đã ghi
+ toàn bộ codebase (agent tự đọc file trong IDE)
   HOẶC flattened-codebase.xml (nếu làm trên web UI)
```

## Bước 1 của task — kiểm tra PRD trước

```text
🤖 [CRITICAL: kiểm tra xem có PRD hoặc tài liệu yêu cầu trong ngữ cảnh không]

   Tôi không thấy PRD hoặc tài liệu yêu cầu nào. Để tạo tài liệu tập trung và
   hữu ích hơn, tôi khuyên một trong các lựa chọn sau:

   1. **Tạo PRD trước** — bạn muốn tôi giúp tạo brownfield PRD trước khi tài
      liệu hoá? Việc này giúp tập trung tài liệu vào vùng liên quan.
   2. **Cung cấp yêu cầu có sẵn** — bạn có tài liệu yêu cầu, epic, hoặc mô tả
      tính năng nào để chia sẻ?
   3. **Mô tả trọng tâm** — bạn có thể mô tả ngắn enhancement đang dự định?
      Ví dụ: 'Adding payment processing to the user service'
   4. **Tài liệu hoá toàn bộ** — hoặc tôi cứ tài liệu hoá toàn bộ codebase?
      (Lưu ý: có thể tạo tài liệu quá nhiều cho dự án lớn)

👤 Bạn: Chọn 3. Trọng tâm: thêm chương trình khách hàng thân thiết — tích điểm
   theo đơn hàng, đổi điểm thành giảm giá. Nhưng codebase chỉ 18k dòng nên
   tôi muốn hiểu gần hết hệ thống, đừng bỏ qua nhiều.

🤖 Rõ. Tôi sẽ tài liệu hoá toàn bộ ở mức tổng quan, nhưng đi **sâu** vào:
   - luồng đặt hàng (nơi phải tích điểm)
   - model Customer và Order (nơi phải lưu điểm)
   - các endpoint API đang có (để biết cái gì không được phá)
   - logic tính tiền (nơi phải trừ điểm)
```

⚙️ **Cơ chế**: lựa chọn 3 là "sweet spot" — bạn không phải viết PRD trước, nhưng agent vẫn có trọng tâm để biết chỗ nào cần đào sâu. Nếu chọn 4 với codebase lớn, bạn sẽ nhận về 3000 dòng tài liệu mà 80% vô dụng.

## Câu hỏi elicitation của task

```text
🤖 Vài câu hỏi để tôi hiểu nhu cầu của bạn:

   1. Mục đích chính của dự án này là gì?
   2. Có vùng nào trong codebase đặc biệt phức tạp hoặc quan trọng để agent hiểu?
   3. Bạn kỳ vọng AI agent làm loại việc gì trên dự án này?
      (sửa lỗi, thêm tính năng, refactor, viết test)
   4. Có chuẩn hoặc định dạng tài liệu nào bạn muốn dùng?
   5. Tài liệu nên nhắm tới mức kỹ thuật nào? (junior / senior / hỗn hợp)
   6. Có tính năng hoặc enhancement cụ thể nào đang dự định?

👤 Bạn:
   1. Hệ thống bán hàng nội bộ: quản lý đơn hàng, khách hàng, sản phẩm, báo cáo.
   2. routes/orders.js — 620 dòng, tôi nghi ngờ logic tính tiền nằm rải rác ở đó.
      Và utils/helpers.js — người viết cũ nhét mọi thứ vào đây.
   3. Thêm tính năng, và viết test (hệ thống chưa có test nào).
   4. Không có chuẩn nào. Cứ theo template của bạn.
   5. Senior — tôi là người duy nhất bảo trì.
   6. Khách hàng thân thiết (đã nói ở trên).
```

## Bước 2 của task — phân tích sâu codebase

```text
🤖 Đang phân tích...

   [1] Project Structure Discovery
       ✓ 42 file, 6 thư mục chính
   [2] Technology Stack Identification
       ✓ package.json: Express 4.17, Mongoose 5.12, EJS 3.1, moment 2.29
       ✓ engines.node = 16.x
       ⚠️ moment đã deprecated (maintenance mode) — ghi nhận là nợ kỹ thuật
   [3] Build System Analysis
       ✓ scripts: chỉ có "start": "node server.js"
       ❌ không có test, lint, build script
       ❌ không có CI config
   [4] Existing Documentation Review
       ✓ README.md — 5 dòng
       ❌ không có docs/
   [5] Code Pattern Analysis — đang đọc file...

   ⚠️ Phát hiện 4 điều cần bạn xác nhận trước khi tôi ghi vào tài liệu:

   a) `utils/db.js` có connection string HARDCODE:
      mongoose.connect('mongodb://admin:P%40ssw0rd@10.0.0.5:27017/banhang')
      Đây là vấn đề bảo mật thật. Tôi có nên ghi vào tài liệu (nhưng che mật khẩu)?

   b) Tổng tiền đơn hàng được tính ở **3 chỗ khác nhau**, và chúng KHÔNG giống nhau:
      - routes/orders.js:187  (khi tạo đơn)
      - routes/orders.js:412  (khi sửa đơn)
      - utils/helpers.js:88   (khi xuất báo cáo — chỗ này có tính VAT, hai chỗ trên không)
      Đây là bug đang tồn tại hay là cố ý?

   c) `POST /api/orders` trả về object có field `total_amount`, nhưng
      `GET /api/orders/:id` trả về `totalAmount`. Không nhất quán.
      Bạn có biết app mobile đang dùng field nào?

   d) Có route `/admin/debug-reset` không có xác thực, xoá toàn bộ collection orders.
      Tôi đoán đây là code test còn sót. Xác nhận?

👤 Bạn:
   a) Có, ghi vào nhưng che mật khẩu. Đây là việc phải sửa.
   b) Là BUG. Báo cáo luôn lệch với đơn hàng, tôi tưởng do làm tròn.
      Ghi rõ vào tài liệu.
   c) Không biết. Tôi sẽ hỏi bên mobile. Ghi là "chưa xác định".
   d) Đúng là code test còn sót. Tôi sẽ xoá riêng, không thuộc phạm vi enhancement.
```

⚙️ **Cơ chế — đây là giá trị lớn nhất của bước này.** Bốn phát hiện trên đều là thứ **không ai biết** trước khi chạy `document-project`:

| Phát hiện | Nếu không biết trước |
|---|---|
| (a) Connection string hardcode | Bạn commit `.env` mới, code vẫn dùng string cũ, không hiểu vì sao |
| (b) Tính tiền ở 3 chỗ khác nhau | Bạn thêm logic trừ điểm ở 1 chỗ ⇒ báo cáo lệch thêm nữa |
| (c) Field name không nhất quán | Bạn "chuẩn hoá" tên field ⇒ app mobile chết |
| (d) Route xoá dữ liệu không auth | Có thể bị gọi nhầm khi bạn test |

Task ghi rõ mục tiêu: tài liệu phải phản ánh **"the actual state of the system (not idealized)"**.

## File sinh ra

📂 `docs/brownfield-architecture.md`

```markdown
# BanHang Brownfield Architecture Document

## Introduction

Tài liệu này ghi lại **trạng thái THỰC TẾ** của hệ thống BanHang tại thời điểm
2026-08-12, bao gồm cả nợ kỹ thuật và những chỗ chắp vá. Nó KHÔNG mô tả kiến
trúc lý tưởng.

### Document Scope
Tài liệu hoá toàn bộ hệ thống ở mức tổng quan, đi sâu vào các vùng liên quan
tới enhancement "Khách hàng thân thiết": luồng đặt hàng, model Customer/Order,
API đang có, logic tính tiền.

### Change Log
| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2026-08-12 | 1.0 | Tài liệu hoá ban đầu trước enhancement loyalty | Winston (Architect) |

## Quick Reference - Key Files and Entry Points

### Critical Files for Understanding the System
- **Entry point**: `server.js` — cấu hình Express, mount 4 router, connect DB
- **Luồng nghiệp vụ chính**: `routes/orders.js` (620 dòng) — TẤT CẢ logic đơn hàng
- **Model dữ liệu**: `models/{Order,Customer,Product}.js`
- **Hàm dùng chung**: `utils/helpers.js` (150 dòng) — grab bag, xem cảnh báo ở
  mục Technical Debt
- **DB connection**: `utils/db.js` — ⚠️ chứa credential hardcode
- **View**: `views/orders/*.ejs` + `public/js/orders.js` (jQuery)

### Enhancement Impact Areas — vùng sẽ bị chạm bởi loyalty
| Vùng | File | Mức độ chạm |
|------|------|------------|
| Tạo đơn hàng | `routes/orders.js:150-230` | **CAO** — phải tích điểm sau khi lưu đơn |
| Sửa đơn hàng | `routes/orders.js:380-450` | **CAO** — sửa đơn phải điều chỉnh điểm |
| Tính tổng tiền | 3 chỗ (xem Technical Debt #1) | **CAO** — phải trừ điểm khi đổi |
| Model Customer | `models/Customer.js` | TRUNG BÌNH — thêm field điểm |
| Model Order | `models/Order.js` | TRUNG BÌNH — thêm field đánh dấu đã tích điểm |
| View chi tiết khách | `views/customers/detail.ejs` | THẤP — hiển thị điểm |
| Báo cáo | `routes/reports.js` | THẤP — có thể cần báo cáo điểm |

## High Level Architecture

### Technical Summary
Monolith Express truyền thống, server-side rendering bằng EJS, jQuery cho tương
tác client. Không có tầng service — logic nghiệp vụ nằm trực tiếp trong route
handler. Không có tầng repository — route gọi Mongoose model trực tiếp.

### Actual Tech Stack (từ package.json)
| Category | Technology | Version | Notes |
|----------|-----------|---------|-------|
| Runtime | Node.js | 16.x | VPS chưa nâng được |
| Framework | Express | 4.17.1 | |
| ODM | Mongoose | 5.12.3 | v5, không phải v6+ — API khác |
| Database | MongoDB | 4.4 | trên cùng VPS |
| View | EJS | 3.1.6 | |
| Date | moment | 2.29.1 | ⚠️ deprecated, maintenance mode |
| Body parse | body-parser | 1.19.0 | ⚠️ Express 4.16+ đã có sẵn express.json() |
| Process | PM2 | (global) | không trong package.json |
| Test | **không có** | — | 0 test |
| CI | **không có** | — | deploy thủ công |

### Repository Structure Reality Check
- Type: single repo, không phải monorepo
- Package manager: npm, có `package-lock.json` (đã commit)
- Notable: **không có** thư mục `test/`, `docs/`, `.github/`

## Source Tree and Module Organization

### Project Structure (Actual)
```text
banhang/
├── server.js              # Express setup + mount router + connect DB (340 dòng)
├── routes/
│   ├── orders.js          # 620 dòng — QUÁ TO. Chứa cả logic nghiệp vụ, validate,
│   │                      #   tính tiền, và render view. Xem Technical Debt #2
│   ├── customers.js       # 210 dòng — CRUD khách hàng
│   ├── products.js        # 180 dòng — CRUD sản phẩm
│   └── reports.js         # 290 dòng — báo cáo doanh thu, dùng aggregate
├── models/                # Mongoose schema, không có method nghiệp vụ
├── views/                 # EJS, layout ở views/layout.ejs
├── public/js/             # jQuery thuần, không bundler
└── utils/
    ├── db.js              # ⚠️ credential hardcode
    └── helpers.js         # ⚠️ grab bag: format tiền, tính VAT, gửi email,
                           #   slugify, và tính tổng đơn (bản thứ 3)
```

### Key Modules and Their Purpose
- **Order creation**: `routes/orders.js` → `router.post('/')` dòng 150–230.
  Validate inline, tính tổng inline, `new Order(...).save()`, rồi `res.redirect`.
  **Không có transaction** — nếu save đơn thành công nhưng update tồn kho thất
  bại, dữ liệu lệch.
- **Customer lookup**: `routes/customers.js` → dùng `Customer.findOne({ phone })`.
  **`phone` không có unique index** ⇒ đã có khách trùng số điện thoại trong DB.
- **Report generation**: `routes/reports.js` → Mongoose aggregate pipeline,
  gọi `helpers.calcTotal()` (bản có VAT).

## Data Models and APIs

### Data Models
Xem trực tiếp file schema thay vì mô tả lại:
- **Order**: `models/Order.js` — có `items[]`, `customerId`, `total_amount`,
  `status`, `createdAt`
- **Customer**: `models/Customer.js` — có `name`, `phone`, `address`, `createdAt`
  **KHÔNG có** field nào liên quan điểm ⇒ enhancement phải thêm
- **Product**: `models/Product.js`

⚠️ Ghi chú quan trọng: `Order.total_amount` dùng **snake_case**, khác với phần
còn lại của codebase dùng camelCase. Đây là không nhất quán đã tồn tại.

### API Specifications
Không có đặc tả API. Danh sách endpoint trích từ code:

| Method | Path | File:line | Ai dùng | Ghi chú |
|--------|------|-----------|---------|---------|
| GET | `/api/orders` | orders.js:45 | app mobile (?) | trả array, có phân trang `?limit&skip` |
| GET | `/api/orders/:id` | orders.js:78 | app mobile (?) | ⚠️ trả `totalAmount` (camelCase) |
| POST | `/api/orders` | orders.js:150 | app mobile (?) | ⚠️ trả `total_amount` (snake_case) |
| PUT | `/api/orders/:id` | orders.js:380 | web UI | |
| GET | `/customers` | customers.js:20 | web UI | render EJS |
| POST | `/customers` | customers.js:60 | web UI | |
| GET | `/api/reports/revenue` | reports.js:40 | web UI | |
| POST | `/admin/debug-reset` | orders.js:598 | **KHÔNG AI** | ⚠️ xoá toàn bộ orders, KHÔNG có auth |

🔴 **CHƯA XÁC ĐỊNH**: app mobile đang dùng chính xác những endpoint nào và đọc
field nào. Cần xác nhận với bên mobile TRƯỚC KHI đổi bất kỳ response shape.

## Technical Debt and Known Issues

### Critical Technical Debt

1. **Tổng tiền được tính ở 3 chỗ, và KẾT QUẢ KHÁC NHAU** 🔴 **ĐÂY LÀ BUG**
   - `routes/orders.js:187` — khi tạo đơn: `sum(item.price * item.qty)`, **không VAT**
   - `routes/orders.js:412` — khi sửa đơn: giống trên, **copy-paste**
   - `utils/helpers.js:88` — `calcTotal()` khi xuất báo cáo: **có cộng VAT 10%**
   ⇒ Báo cáo doanh thu luôn cao hơn tổng đơn hàng 10%. Chủ dự án xác nhận đây
     là bug chưa từng được phát hiện, không phải cố ý.
   ⇒ **Ảnh hưởng tới enhancement**: logic trừ điểm phải áp ở đúng một chỗ, và
     phải quyết định trừ trước hay sau VAT.

2. **`routes/orders.js` 620 dòng** — trộn lẫn validate, nghiệp vụ, tính toán,
   render. Không có tầng service. Mọi thay đổi ở đây có rủi ro regression cao.

3. **`utils/helpers.js` là grab bag** — 8 hàm không liên quan gì nhau: format
   tiền, tính VAT, gửi email, slugify, tính tổng đơn, parse ngày, validate SĐT,
   sinh mã đơn. Import file này là import tất cả.

4. **Credential hardcode** — `utils/db.js`:
   `mongoose.connect('mongodb://admin:****@10.0.0.5:27017/banhang')`
   Không dùng biến môi trường. Có trong git history.

5. **Không có test** — 0 test. Mọi thay đổi được kiểm bằng cách click tay.

6. **Không có transaction** khi tạo đơn — save Order và update Product.stock là
   hai thao tác rời. Đã có trường hợp tồn kho lệch.

7. **`Customer.phone` không có unique index** — DB hiện có 7 cặp khách trùng SĐT.

### Workarounds and Gotchas 🔴

- **`moment` được import ở 11 file** — đổi sang thư viện khác là thay đổi lan rộng.
  Đừng làm trong phạm vi enhancement này.
- **View EJS phụ thuộc tên field CHÍNH XÁC** — `views/orders/list.ejs` dùng
  `order.total_amount`. Đổi tên field trong model ⇒ view hiển thị `undefined`,
  **không báo lỗi**.
- **PM2 không tự restart khi crash lúc khởi động** — nếu code lỗi cú pháp,
  `pm2 restart` sẽ báo online nhưng app chết. Luôn kiểm `pm2 logs` sau deploy.
- **`/admin/debug-reset` xoá toàn bộ orders và KHÔNG có auth** — đừng để lộ
  URL này. Nên xoá, nhưng ngoài phạm vi enhancement.
- **Deploy = `git pull` + `pm2 restart`** — không có build step, nên **không**
  được dùng cú pháp Node > 16, và **không** được thêm bước transpile.

## Integration Points and External Dependencies

### External Services
| Service | Purpose | Integration | Key Files |
|---------|---------|-------------|-----------|
| SMTP (Gmail) | gửi email xác nhận đơn | nodemailer qua helpers.js | `utils/helpers.js:120` |
| **App mobile shipper** | xem/tạo đơn | REST API | ⚠️ endpoint chưa xác định rõ |

### Internal Integration Points
- **Web UI ↔ Backend**: server-side render EJS + form POST truyền thống;
  một số chỗ dùng jQuery `$.ajax` gọi `/api/*`
- **App mobile ↔ Backend**: REST API, **không có versioning**, không có
  API key — chỉ dựa vào IP whitelist ở nginx

## Development and Deployment

### Local Development Setup
Các bước thực tế hoạt động (đã kiểm chứng):
1. `npm install`
2. Cần MongoDB local, hoặc sửa connection string trong `utils/db.js` ⚠️
3. `npm start` → http://localhost:3000
**Known issue**: không có `.env`, phải sửa file để trỏ DB khác.

### Build and Deployment Process
- **Build**: không có
- **Deploy**: SSH vào VPS → `git pull` → `pm2 restart banhang`
- **Environments**: chỉ **production**. Không có staging.
🔴 Không có staging là ràng buộc lớn nhất của enhancement này — mọi thay đổi
phải an toàn ngay lần đầu, hoặc phải có feature flag để tắt nhanh.

## Testing Reality

### Current Test Coverage
- Unit: **0%**
- Integration: **0%**
- E2E: **0%**
- Manual: đây là cách duy nhất hiện tại — nhân viên click thử sau mỗi deploy

### Running Tests
Không có lệnh test. `npm test` báo lỗi "no test specified".

🔴 Với enhancement này, `working-in-the-brownfield.md` yêu cầu:
**"Regression Test Coverage: Every touched legacy module needs tests"**
⇒ Chạm `routes/orders.js` thì phải viết regression test cho nó — kể cả phần
  không sửa.

## Enhancement Impact Analysis (loyalty)

### Files That Will Need Modification
- `models/Customer.js` — thêm field điểm
- `models/Order.js` — thêm field đánh dấu đã tích điểm
- `routes/orders.js:150-230` — tích điểm sau khi tạo đơn
- `routes/orders.js:380-450` — điều chỉnh điểm khi sửa đơn
- `views/customers/detail.ejs` — hiển thị điểm
- `package.json` — thêm jest

### New Files/Modules Needed
- `models/PointTransaction.js` — lịch sử tích/trừ điểm (audit trail)
- `services/loyalty.js` — 🔴 tầng service MỚI. Codebase hiện không có tầng này;
  đây là pattern mới, cần Architect quyết định (xem bước architecture_decision)
- `tests/` — thư mục test đầu tiên của dự án

### Integration Considerations
- **Không được đổi** shape response của `/api/orders*` — app mobile đang dùng
- Logic điểm phải **idempotent** — nếu tạo đơn bị gọi 2 lần (retry của mobile),
  không được tích điểm 2 lần
- Phải quyết định: trừ điểm trước VAT hay sau VAT (liên quan Technical Debt #1)
- Cần **feature flag** để tắt nhanh nếu có sự cố — vì không có staging

## Appendix - Useful Commands and Scripts

### Frequently Used Commands
```bash
npm start                          # chạy local
pm2 restart banhang                # deploy (sau git pull trên VPS)
pm2 logs banhang --lines 100       # xem log
mongo banhang --eval "db.orders.count()"   # kiểm nhanh DB
```

### Debugging and Troubleshooting
- **Logs**: `pm2 logs banhang`. Không có log file cấu trúc, chỉ console.log
- **Debug mode**: không có. Thêm `console.log` là cách duy nhất hiện tại
- **Common issue**: app "online" trong pm2 nhưng không phản hồi ⇒ crash lúc
  khởi động, xem `pm2 logs`
```

## Bước 5 của task — Quality Assurance

```text
🤖 Trước khi chốt tài liệu, tôi kiểm 5 điều:

   1. **Accuracy Check** — mọi chi tiết kỹ thuật khớp codebase thật?
      ✓ Đã đối chiếu số dòng, tên hàm, tên field với file thật
   2. **Completeness Review** — mọi thành phần chính đã được ghi?
      ✓ 4 router, 3 model, view, utils, deploy
   3. **Focus Validation** — vùng liên quan enhancement được nhấn mạnh?
      ✓ Có mục riêng "Enhancement Impact Areas" và "Enhancement Impact Analysis"
   4. **Clarity Assessment** — AI agent đọc hiểu được?
      ✓ Dùng đường dẫn file:dòng thật, không mô tả chung chung
   5. **Navigation** — có cấu trúc section rõ để tra?
      ✓ 11 section H2

   Áp dụng advanced-elicitation cho các section chính:
   [đưa 9 lựa chọn cho bạn tinh chỉnh]
```

## Trạng thái sau bước 3

📂

```text
banhang/
├── .bmad-core/ .claude/
├── flattened-codebase.xml
├── docs/
│   └── brownfield-architecture.md    ← MỚI: thực trạng hệ thống
├── routes/ models/ views/ utils/     ← không bị chạm
└── README.md
```

## Bạn vừa thu được gì

| Trước bước 3 | Sau bước 3 |
|---|---|
| 7 câu hỏi "❓" ở [bước 0](./00-boi-canh.md) | 6/7 đã có câu trả lời |
| Không biết logic tính tiền ở đâu | Biết chính xác 3 chỗ, và **phát hiện đó là bug** |
| Không biết cái gì không được phá | Có danh sách 8 endpoint + 4 gotcha |
| Không biết nợ kỹ thuật | Có 7 mục, xếp theo mức nghiêm trọng |
| Không biết rollback thế nào | Biết: git pull + pm2, không staging ⇒ **cần feature flag** |
| Không biết baseline test | 0% — mọi module bị chạm cần regression test |

Câu hỏi còn "❓": **app mobile dùng endpoint nào** — cần bạn hỏi bên mobile, agent không tự biết được.

## Bạn tự làm gì ở bước này

- [ ] Chọn lựa chọn **3** (mô tả trọng tâm) ở câu hỏi đầu, trừ khi codebase rất nhỏ
- [ ] Trả lời 6 câu elicitation — đặc biệt câu 2 (vùng phức tạp): chỉ đúng chỗ agent nên đào sâu
- [ ] **Xác nhận từng phát hiện** của agent: đó là bug hay cố ý? Đây là lúc bạn đóng góp nhiều nhất
- [ ] Đọc mục **Technical Debt** và **Workarounds and Gotchas** — đây là phần quý nhất
- [ ] Bổ sung điều agent không thể biết (ai gọi API, quyết định nghiệp vụ trong quá khứ)
- [ ] Lưu thành `docs/brownfield-architecture.md`, **commit ngay** — tài liệu này có giá trị độc lập với enhancement

⚠️ **Đừng để agent "làm đẹp" tài liệu.** Nếu nó viết *"hệ thống tuân theo kiến trúc MVC rõ ràng"* trong khi thực tế logic nằm hết trong route handler, hãy yêu cầu sửa. Task ghi rõ mục tiêu: **"Document reflects REALITY including technical debt and workarounds"**.

---

[⬅ Bước trước](./02-phan-loai-va-dinh-tuyen.md) · [Chỉ mục](./README.md) · [Bước sau: PM tạo brownfield PRD ➡](./04-pm-brownfield-prd.md)
