[⬅ Bước trước](./03-document-project.md) · [Chỉ mục](./README.md) · [Bước sau ➡](./05-architect-brownfield.md)

# Bước 4 — PM: brownfield PRD

Template `brownfield-prd-tmpl.yaml` khác `prd-tmpl.yaml` ở ba chỗ then chốt: nó bắt đầu bằng **phân tích hệ thống hiện có**, nó có mục **Compatibility Requirements**, và nó có mục **Risk Assessment and Mitigation**.

## Lệnh

```text
👤 Bạn: @pm

🤖 Xin chào! Tôi là John 📋 — Product Manager.
   [hiện 12 lệnh]

👤 Bạn: *create-brownfield-prd
```

## Agent nạp gì

```text
.bmad-core/agents/pm.md
.bmad-core/core-config.yaml
.bmad-core/tasks/create-doc.md
.bmad-core/templates/brownfield-prd-tmpl.yaml    ← 6 section cấp 1
.bmad-core/data/elicitation-methods.md
.bmad-core/data/technical-preferences.md          ← ràng buộc hệ thống cũ
docs/brownfield-architecture.md                   ← 🔴 ĐẦU VÀO CHÍNH
```

⚙️ **Cơ chế**: `working-in-the-brownfield.md` ghi rõ PM lấy ngữ cảnh dự án thế nào:
> *In Gemini Web: đã có full project context từ Phase 1. **In IDE: sẽ hỏi "Please provide the path to your existing project documentation"**.*

Trong IDE, hãy đưa đường dẫn `docs/brownfield-architecture.md`.

## Cấu trúc template — 6 section cấp 1

```text
1. Intro Project Analysis and Context     ← 🔴 chỉ có ở brownfield
   ├── Existing Project Overview
   ├── Available Documentation Analysis
   ├── Enhancement Scope Definition
   ├── Goals and Background Context
   └── Change Log
2. Requirements
   ├── Functional
   ├── Non Functional
   └── Compatibility Requirements          ← 🔴 chỉ có ở brownfield
3. User Interface Enhancement Goals        ← 🔴 tích hợp với UI hiện có
   ├── Integration with Existing UI
   ├── Modified/New Screens and Views
   └── UI Consistency Requirements
4. Technical Constraints and Integration Requirements   ← 🔴
   ├── Existing Technology Stack
   ├── Integration Approach
   ├── Code Organization and Standards
   ├── Deployment and Operations
   └── Risk Assessment and Mitigation      ← 🔴
5. Epic and Story Structure
   └── Epic Approach
6. Epic 1: {{enhancement_title}}
   └── Story 1.{{n}}
```

## Diễn biến — trích 5 section quan trọng

### Section 1 — Intro Project Analysis and Context 🔴

```text
🤖 Tôi đã đọc docs/brownfield-architecture.md. Đây là section đầu tiên.

   ## Intro Project Analysis and Context

   ### Existing Project Overview

   **Analysis Source**: `docs/brownfield-architecture.md` do Architect tạo
   bằng task document-project ngày 2026-08-12.

   **Current Project State**: BanHang là hệ thống bán hàng nội bộ chạy
   production 3 năm, phục vụ 12 nhân viên bán hàng và một app mobile cho
   shipper. Monolith Express 4 + MongoDB 4.4, server-side rendering EJS +
   jQuery. Logic nghiệp vụ nằm trực tiếp trong route handler, không có tầng
   service. Không có test tự động, không có CI/CD, chỉ có môi trường production.

   ### Available Documentation Analysis

   | Tài liệu | Có? | Ghi chú |
   |----------|-----|---------|
   | Tech Stack Documentation | ✓ | trong brownfield-architecture.md |
   | Source Tree/Architecture | ✓ | trong brownfield-architecture.md |
   | Coding Standards | ⚠️ | không có tài liệu chính thức; pattern được suy từ code |
   | API Documentation | ⚠️ | không có; danh sách endpoint được trích từ code |
   | External API Documentation | ❌ | app mobile chưa xác định dùng endpoint nào |
   | UX/UI Guidelines | ❌ | không có |
   | Technical Debt Documentation | ✓ | 7 mục, có trong brownfield-architecture.md |

   ⚠️ Hai khoảng trống ảnh hưởng tới PRD này:
   - Chưa biết app mobile dùng endpoint/field nào ⇒ Compatibility Requirements
     phải bảo thủ: KHÔNG đổi bất kỳ response shape nào
   - Không có coding standards chính thức ⇒ Architect sẽ phải ghi lại pattern
     hiện có thành tài liệu

   ### Enhancement Scope Definition

   **Enhancement Type**: New Feature Addition
   **Enhancement Description**: Chương trình khách hàng thân thiết — tự động
   tích điểm khi đơn hàng hoàn tất, cho phép dùng điểm giảm giá cho đơn sau,
   và cho nhân viên xem lịch sử điểm của khách.

   **Impact Assessment**: **Significant Impact** — chạm vào luồng đặt hàng
   (đường dẫn quan trọng nhất của hệ thống), thêm collection mới, sửa 2
   collection đang có.

   ### Goals and Background Context

   **Goals**
   - Tăng tỉ lệ khách mua lại bằng cơ chế tích điểm minh bạch
   - Nhân viên bán hàng tra được điểm của khách trong dưới 5 giây
   - **Không làm gián đoạn** luồng đặt hàng đang chạy

   **Background Context**
   Hệ thống đã chạy 3 năm với ~4.200 khách hàng và ~31.000 đơn hàng lịch sử.
   Ban giám đốc muốn giữ khách bằng chương trình điểm. Do không có môi trường
   staging và không có test tự động, ưu tiên cao nhất của enhancement này là
   **an toàn**: mọi thay đổi phải có thể tắt nhanh và không được phá luồng
   đơn hàng.

   ---
   **Rationale:**
   - **Trade-off lớn nhất**: tôi đặt "không gián đoạn" là **goal** ngang hàng với
     các goal nghiệp vụ, chứ không phải một ràng buộc phụ. Với brownfield không
     có staging, đây là quyết định đúng — nhưng nó sẽ làm phạm vi nhỏ hơn và
     tiến độ chậm hơn so với việc "cứ làm rồi sửa".
   - **Giả định**: 31.000 đơn hàng lịch sử **KHÔNG** được tích điểm hồi tố. Nếu
     sai giả định này thì phát sinh một story migration lớn và rủi ro dữ liệu.
   - **Cần xác thực**: có tích điểm hồi tố cho đơn cũ không?

   [9 lựa chọn elicitation]

👤 Bạn: Không tích hồi tố. Bắt đầu từ ngày bật tính năng.

🤖 Đã ghi vào Goals and Background Context. Điều này loại bỏ một rủi ro
   migration lớn — tốt.
```

⚙️ **Cơ chế**: câu hỏi "có tích hồi tố không?" trông nhỏ nhưng quyết định **cả một epic**. Đây là loại câu hỏi mà template brownfield ép ra ở section đầu tiên, trước khi bạn kịp viết một dòng yêu cầu nào.

### Section 2 — Requirements, có `Compatibility Requirements` 🔴

```text
🤖 ## Requirements

   ### Functional

   FR1: Hệ thống tự động tích điểm cho khách khi đơn hàng chuyển sang trạng
        thái hoàn tất, theo tỉ lệ 1 điểm cho mỗi 10.000đ giá trị đơn (trước VAT).
   FR2: Mỗi lần tích hoặc trừ điểm được ghi vào lịch sử với lý do, mã đơn liên
        quan, và thời điểm.
   FR3: Khi tạo đơn mới, nhân viên có thể dùng điểm của khách để giảm giá; tỉ lệ
        1 điểm = 1.000đ giảm.
   FR4: Nhân viên xem được số điểm hiện tại và lịch sử điểm trên trang chi tiết
        khách hàng.
   FR5: Hệ thống chặn việc dùng điểm vượt quá số điểm khách đang có.
   FR6: Có công tắc bật/tắt toàn bộ tính năng điểm không cần deploy lại.

   ### Non Functional

   NFR1: Việc tích điểm KHÔNG được làm tăng thời gian phản hồi của thao tác tạo
         đơn quá 15% so với baseline hiện tại (240ms → tối đa 276ms).
   NFR2: Tích điểm phải idempotent — cùng một đơn không bao giờ được tích điểm
         hai lần, kể cả khi request bị gọi lại.
   NFR3: Nếu việc tích điểm thất bại, đơn hàng VẪN phải được tạo thành công.
   NFR4: Mọi thay đổi điểm phải có audit trail không xoá được.

   ### Compatibility Requirements  🔴

   CR1: **API Compatibility** — shape response của mọi endpoint `/api/orders*`
        phải giữ nguyên tuyệt đối. Được phép THÊM field mới, KHÔNG được đổi tên,
        đổi kiểu, hay xoá field đang có.
   CR2: **Database Schema Compatibility** — chỉ thêm field mới với giá trị mặc
        định; không đổi kiểu field đang có; không xoá field. Mọi field mới phải
        an toàn khi đọc bởi code cũ (nullable hoặc có default).
   CR3: **UI/UX Consistency** — trang chi tiết khách hàng phải giữ layout hiện
        tại; phần điểm được thêm vào như một khối mới, dùng đúng style EJS +
        jQuery hiện có, KHÔNG đưa framework mới vào.
   CR4: **Performance Compatibility** — mọi truy vấn hiện có phải giữ hoặc cải
        thiện thời gian thực thi. Field mới phải có index nếu được dùng để lọc.

   ---
   **Rationale:**
   - **CR1 là bảo thủ có chủ ý**: vì chúng ta CHƯA biết app mobile đọc field nào
     (khoảng trống đã ghi ở section 1), quy tắc an toàn duy nhất là "chỉ thêm,
     không sửa". Nếu sau này xác nhận được với bên mobile, có thể nới lỏng.
   - **NFR3 tách rời việc tích điểm khỏi việc tạo đơn**: đây là quyết định kiến
     trúc quan trọng — tích điểm là hiệu ứng phụ, không được làm hỏng nghiệp vụ
     chính. Architect sẽ phải hiện thực điều này.
   - **FR6 (công tắc)** không phải yêu cầu nghiệp vụ, mà là **yêu cầu an toàn vận
     hành** sinh ra từ ràng buộc "không có staging". Nếu có staging thì FR6 có
     thể bỏ.
   - **Cần xác thực**: tỉ lệ 1 điểm/10.000đ và 1 điểm = 1.000đ — con số này do
     tôi đề xuất, bạn cần chốt với ban giám đốc.

   [9 lựa chọn]
```

⚙️ **Cơ chế** — `Compatibility Requirements` là section **không tồn tại** trong PRD greenfield. Nó biến "đừng làm vỡ hệ thống" từ một lời nhắc mơ hồ thành **4 yêu cầu kiểm được**, mà QA sẽ dùng làm cơ sở cho gate ở [bước 10](./10-qa-review.md).

### Section 4 — Technical Constraints, có `Risk Assessment and Mitigation` 🔴

```text
🤖 ## Technical Constraints and Integration Requirements

   ### Existing Technology Stack
   [bảng lấy từ brownfield-architecture.md, không viết lại]
   Node 16 · Express 4.17 · Mongoose 5.12 · MongoDB 4.4 · EJS 3.1 · jQuery · PM2

   ### Integration Approach

   **Database Integration Strategy**: thêm collection `pointtransactions` mới;
   thêm field `loyaltyPoints` (Number, default 0) vào `customers`; thêm field
   `pointsAwarded` (Boolean, default false) vào `orders`. Dùng migration script
   riêng, chạy được nhiều lần (idempotent).

   **API Integration Strategy**: chỉ THÊM endpoint mới dưới `/api/loyalty/*`.
   Không sửa endpoint `/api/orders*` nào. Field mới trong response của
   `/api/orders*` được thêm ở cuối object (an toàn với client cũ).

   **Frontend Integration Strategy**: thêm một partial EJS mới
   `views/customers/_points.ejs`, include vào `detail.ejs`. jQuery cho tương
   tác đổi điểm. Không thêm bundler, không thêm framework.

   **Testing Integration Strategy**: thêm Jest — đây là test framework đầu tiên
   của dự án. Viết test cho code mới VÀ regression test cho `routes/orders.js`.

   ### Code Organization and Standards

   **File Structure Approach**: 🔴 enhancement này giới thiệu một pattern MỚI —
   thư mục `services/` chứa logic nghiệp vụ tách khỏi route handler. Lý do:
   logic điểm phức tạp và cần test độc lập; nhét vào `routes/orders.js` (đã 620
   dòng) sẽ làm tình hình tệ hơn. Đây là thay đổi kiến trúc ⇒ **cần Architect
   quyết định chính thức** ở bước architecture_decision.

   **Naming Conventions**: theo pattern hiện có — model PascalCase số ít
   (`PointTransaction`), file model cùng tên, route dùng kebab-case.
   ⚠️ Field mới dùng **camelCase** (`loyaltyPoints`), khớp phần lớn codebase.
   KHÔNG bắt chước `total_amount` (snake_case) — đó là không nhất quán đã tồn tại.

   **Coding Standards**: tuân theo pattern hiện có (CommonJS require, async/await
   trong route handler, trả lỗi `res.status(4xx).json({ message })`).

   ### Deployment and Operations

   **Build Process Integration**: không có build step, không được thêm.
   **Deployment Strategy**: git pull + pm2 restart. Bổ sung: chạy migration
   script TRƯỚC khi restart.
   **Monitoring and Logging**: dùng console.log theo pattern hiện có; thêm
   prefix `[loyalty]` để lọc được trong `pm2 logs`.
   **Configuration Management**: 🔴 công tắc tính năng (FR6) qua biến môi trường
   `LOYALTY_ENABLED`. Vì hiện chưa có `.env`, cần thêm dotenv — đây là dependency
   mới, đã được phê duyệt trong technical-preferences.md.

   ### Risk Assessment and Mitigation  🔴

   **Technical Risks**
   | Rủi ro | Giảm nhẹ |
   |--------|----------|
   | Sửa `routes/orders.js` (620 dòng, 0 test) gây regression luồng đơn hàng | Viết regression test cho luồng tạo/sửa đơn TRƯỚC khi sửa; tích điểm gọi qua service tách rời |
   | Field mới làm vỡ view EJS đang đọc tên field chính xác | Chỉ THÊM field, không đổi tên; kiểm từng view có include field mới |
   | Tích điểm chậm làm tạo đơn chậm | Tích điểm sau khi đã response, hoặc trong cùng request nhưng có timeout; đo và so baseline 240ms |

   **Integration Risks**
   | Rủi ro | Giảm nhẹ |
   |--------|----------|
   | App mobile vỡ vì response đổi | CR1: chỉ thêm field ở cuối object; xác nhận với bên mobile trước khi deploy |
   | Migration script chạy 2 lần gây lệch dữ liệu | Script idempotent: `updateMany` với điều kiện `field không tồn tại` |

   **Deployment Risks**
   | Rủi ro | Giảm nhẹ |
   |--------|----------|
   | **Không có staging** ⇒ lỗi phát hiện trên production | FR6 công tắc `LOYALTY_ENABLED=false` để tắt tức thì mà không rollback code |
   | PM2 báo online nhưng app chết (gotcha đã ghi) | Bắt buộc kiểm `pm2 logs` sau mỗi deploy; ghi vào checklist deploy |
   | Rollback | git tag `pre-loyalty-baseline` + mongodump trước khi bật tính năng |

   **Mitigation Strategies**
   1. **Feature flag trước tiên** — story đầu tiên phải tạo cơ chế công tắc
   2. **Regression test trước khi sửa** — không chạm `orders.js` khi chưa có lưới an toàn
   3. **Tách rời hiệu ứng phụ** — NFR3: tích điểm thất bại không được làm đơn thất bại
   4. **Migration idempotent + có script rollback**
```

⚙️ **Cơ chế**: mục **Risk Assessment and Mitigation** trong PRD là **đầu vào** cho `*risk` của QA ở [bước 8](./08-qa-risk-design.md). Hai bên nhìn cùng một danh sách rủi ro nhưng ở hai mức: PM nhìn ở mức sản phẩm, QA chấm điểm xác suất × tác động cho từng story.

### Section 5 — Epic and Story Structure 🔴

```text
🤖 ## Epic and Story Structure

   ### Epic Approach

   **Epic Structure Decision**: **MỘT epic duy nhất**.

   Lý do: đây là một tính năng gắn kết, các story phụ thuộc tuần tự vào nhau
   (không tích điểm được nếu chưa có chỗ lưu điểm; không đổi điểm được nếu chưa
   tích được). Chia thành nhiều epic sẽ tạo ra các mốc không giao được giá trị.

   🔴 **Nguyên tắc brownfield áp dụng ở đây**: thứ tự story được xếp theo **mức
   rủi ro tăng dần**, không theo giá trị nghiệp vụ giảm dần. Story đầu tiên là
   story ít rủi ro nhất nhưng tạo ra lưới an toàn cho các story sau.

   ## Epic 1: Chương trình khách hàng thân thiết

   **Epic Goal**: Khách hàng tích được điểm theo đơn hàng và dùng điểm giảm giá,
   mà không làm gián đoạn luồng đặt hàng đang chạy.

   **Integration Requirements**: mọi story phải giữ CR1–CR4; mọi story chạm
   `routes/orders.js` phải kèm regression test.

   ### Story 1.1 — Nền tảng: công tắc tính năng, test framework, lưới an toàn
   As một người bảo trì hệ thống,
   I want có Jest, regression test cho luồng đơn hàng hiện tại, và một công tắc
   bật/tắt tính năng,
   so that mọi thay đổi sau đó đều có lưới an toàn và có thể tắt tức thì.

   #### Acceptance Criteria
   1. `npm test` chạy được với Jest; có ít nhất một test pass.
   2. Có regression test cho `POST /api/orders`: tạo đơn thành công trả đúng
      shape response hiện tại (bao gồm field `total_amount`).
   3. Có regression test cho `PUT /api/orders/:id`: sửa đơn giữ nguyên hành vi.
   4. Có regression test cho `GET /api/orders/:id`: trả đúng field `totalAmount`.
   5. Biến môi trường `LOYALTY_ENABLED` được đọc qua module cấu hình; mặc định
      `false`.
   6. `.env.example` liệt kê biến mới; `.env` trong `.gitignore`.

   #### Integration Verification  🔴
   IV1: Chạy toàn bộ regression test mới trên code CHƯA sửa gì — tất cả phải pass.
        Đây là bằng chứng test phản ánh đúng hành vi hiện tại.
   IV2: `npm start` vẫn chạy được, trang chủ và trang đơn hàng vẫn hiển thị đúng.
   IV3: Thời gian phản hồi `POST /api/orders` không đổi (vẫn ~240ms).

   ### Story 1.2 — Mô hình dữ liệu điểm và migration
   #### Acceptance Criteria
   1. Model `PointTransaction` với các field: customerId, orderId, delta, reason,
      createdAt.
   2. Field `loyaltyPoints` (Number, default 0) được thêm vào `Customer`.
   3. Field `pointsAwarded` (Boolean, default false) được thêm vào `Order`.
   4. Migration script thêm field cho dữ liệu cũ, chạy nhiều lần cho cùng kết quả.
   5. Có script rollback đưa schema về trạng thái trước.
   #### Integration Verification
   IV1: Toàn bộ regression test của story 1.1 vẫn pass sau migration.
   IV2: Mọi view EJS hiện có vẫn render đúng với document đã thêm field.
   IV3: `GET /api/orders` với 20 đơn vẫn dưới 250ms (index không bị ảnh hưởng).

   ### Story 1.3 — Tích điểm khi đơn hoàn tất
   ...
   #### Integration Verification
   IV1: Nếu service tích điểm ném lỗi, đơn hàng VẪN được tạo (NFR3).
   IV2: Gọi tạo đơn hai lần với cùng dữ liệu không tích điểm hai lần (NFR2).
   IV3: Thời gian tạo đơn ≤ 276ms (NFR1: +15% so với 240ms).

   ### Story 1.4 — Dùng điểm giảm giá khi tạo đơn
   ### Story 1.5 — Hiển thị điểm và lịch sử trên trang khách hàng
```

⚙️ **Cơ chế — `Integration Verification`**: đây là mục mà template brownfield thêm vào mỗi story. Nó khác Acceptance Criteria: **AC kiểm tính năng mới hoạt động; IV kiểm tính năng cũ KHÔNG vỡ.** Greenfield không cần mục này vì không có "cũ".

## File sinh ra

📂 `docs/prd.md` — 6 section H2:

```text
# BanHang Brownfield Enhancement PRD
## Intro Project Analysis and Context
## Requirements                                        (FR1-6 · NFR1-4 · CR1-4)
## User Interface Enhancement Goals
## Technical Constraints and Integration Requirements   (có Risk Assessment)
## Epic and Story Structure
## Epic 1: Chương trình khách hàng thân thiết           (5 story, mỗi story có IV)
```

## Bước `architecture_decision` của workflow 🔴

Sau khi có PRD, workflow có một bước quyết định:

```text
🤖 [step: architecture_decision · agent: pm/architect · condition: after_prd_creation]

   Rà PRD để xác định có cần tài liệu kiến trúc riêng không:

   | Tín hiệu | Có trong PRD này? |
   |----------|-------------------|
   | Pattern kiến trúc mới | ✅ **CÓ** — thư mục services/ là tầng mới |
   | Thư viện/framework mới | ✅ **CÓ** — Jest, dotenv |
   | Thay đổi platform/hạ tầng | ⚠️ nhẹ — thêm bước migration vào deploy |
   | Chỉ theo pattern có sẵn | ❌ không |

   ⇒ **CẦN tài liệu kiến trúc.** Chuyển sang @architect →
     *create-brownfield-architecture
```

⚙️ **Cơ chế**: nếu enhancement của bạn **chỉ theo pattern có sẵn** (ví dụ "thêm một trang báo cáo nữa, giống các trang báo cáo hiện có"), workflow cho phép **bỏ qua** tài liệu kiến trúc và đi thẳng tới tạo story. Đó là tiết kiệm thật.

## Trạng thái sau bước 4

📂

```text
docs/
├── brownfield-architecture.md      ← thực trạng (bước 3)
└── prd.md                          ← MỚI: 6 FR · 4 NFR · 4 CR · 1 epic · 5 story
```

## Bạn tự làm gì ở bước này

- [ ] Cung cấp đường dẫn `docs/brownfield-architecture.md` khi PM hỏi
- [ ] Trả lời câu hỏi phạm vi ở section 1 — đặc biệt **"có xử lý hồi tố không?"**, nó quyết định cả epic
- [ ] Duyệt **Compatibility Requirements** thật kỹ: mỗi CR có kiểm được không?
- [ ] Chốt con số nghiệp vụ (tỉ lệ điểm) với người có quyền quyết định
- [ ] Đọc **Risk Assessment** — có rủi ro nào bạn biết mà PM không biết? Bổ sung
- [ ] Kiểm mỗi story có mục **Integration Verification** chưa
- [ ] Kiểm thứ tự story: story ít rủi ro và tạo lưới an toàn có đứng trước không?

⚠️ **Cạm bẫy brownfield điển hình**: viết PRD chỉ nói về tính năng mới, không nói gì về việc bảo vệ tính năng cũ. Nếu PRD của bạn không có Compatibility Requirements và Integration Verification, bạn đang viết PRD greenfield cho một dự án brownfield.

---

[⬅ Bước trước](./03-document-project.md) · [Chỉ mục](./README.md) · [Bước sau: kiến trúc tích hợp ➡](./05-architect-brownfield.md)
