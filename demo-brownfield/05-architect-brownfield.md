[⬅ Bước trước](./04-pm-brownfield-prd.md) · [Chỉ mục](./README.md) · [Bước sau ➡](./06-po-validate-va-shard.md)

# Bước 5 — Architect: kiến trúc tích hợp

Template `brownfield-architecture-tmpl.yaml` có 14 section, và **mỗi section đều tách "cái đang có" khỏi "cái thêm mới"**. Đó là điểm khác biệt cốt lõi so với template greenfield.

## Lệnh

```text
👤 Bạn: @architect

🤖 Xin chào! Tôi là Winston 🏗️ — Architect.

👤 Bạn: *create-brownfield-architecture
```

## Agent nạp gì

```text
.bmad-core/agents/architect.md
.bmad-core/core-config.yaml
.bmad-core/tasks/create-doc.md
.bmad-core/templates/brownfield-architecture-tmpl.yaml   ← 14 section
.bmad-core/data/technical-preferences.md                 ← 🔴 ràng buộc hệ thống cũ
.bmad-core/data/elicitation-methods.md
docs/prd.md                                              ← FR/NFR/CR + 5 story
docs/brownfield-architecture.md                          ← 🔴 thực trạng hệ thống
```

## Cấu trúc template — chú ý cặp "existing / new" 🔴

```text
1.  Introduction                    → intro-content · existing-project-analysis · changelog
2.  Enhancement Scope and Integration Strategy
                                    → enhancement-overview · integration-approach
                                      · compatibility-requirements
3.  Tech Stack                      → existing-stack │ new-tech-additions        🔴
4.  Data Models and Schema Changes  → new-models │ schema-integration            🔴
5.  Component Architecture          → new-components · interaction-diagram
6.  API Design and Integration      → api-strategy · new-endpoints
7.  External API Integration        → external-api
8.  Source Tree                     → existing-structure │ new-file-organization
                                      · integration-guidelines                    🔴
9.  Infrastructure and Deployment Integration
                                    → existing-infrastructure │ enhancement-deployment
                                      · rollback-strategy                         🔴
10. Coding Standards                → existing-standards │ enhancement-standards
                                      · integration-rules                         🔴
11. Testing Strategy                → existing-test-integration │ new-testing     🔴
12. Security Integration            → existing-security │ enhancement-security
                                      · security-testing                          🔴
13. Checklist Results Report
14. Next Steps                      → story-manager-handoff · developer-handoff   🔴
```

## Diễn biến — trích 7 section quyết định

### Section 1 — `existing-project-analysis`

```text
🤖 ## Introduction

   Tài liệu này định nghĩa cách tiếp cận kiến trúc cho việc **bổ sung** chương
   trình khách hàng thân thiết vào hệ thống BanHang đang chạy. Mục tiêu chính:
   đảm bảo tích hợp liền mạch với hệ thống hiện có mà không phá vỡ chức năng
   đang hoạt động.

   ### Existing Project Analysis

   **Current Project State** (nguồn: docs/brownfield-architecture.md)
   - Kiến trúc: monolith Express, logic nghiệp vụ trong route handler
   - **Không có tầng service** — đây là khoảng trống mà enhancement phải xử lý
   - Không có test — enhancement phải tự tạo lưới an toàn
   - Không có staging — enhancement phải có công tắc tắt nhanh

   **Available Documentation**: brownfield-architecture.md (đầy đủ) + PRD.
   Không có API spec chính thức; danh sách endpoint được trích từ code.

   **Identified Constraints**
   1. Node 16, không transpile ⇒ chỉ dùng cú pháp Node 16 hỗ trợ
   2. Mongoose 5 (không phải 6+) ⇒ API khác, ví dụ `strictQuery` mặc định khác
   3. Deploy = git pull + pm2 restart ⇒ không có build step
   4. VPS 1GB RAM ⇒ không thêm dependency nặng
   5. **CHƯA biết app mobile dùng field nào** ⇒ CR1 bảo thủ: chỉ thêm, không sửa
   6. Tổng tiền tính ở 3 chỗ khác nhau (bug đã ghi nhận) ⇒ logic điểm phải
      chọn đúng một nguồn chân lý
```

### Section 2 — `integration-approach` + `compatibility-requirements`

```text
🤖 ## Enhancement Scope and Integration Strategy

   ### Enhancement Overview
   **Enhancement Type**: New Feature Addition
   **Scope**: tích điểm theo đơn, đổi điểm giảm giá, xem lịch sử điểm
   **Integration Impact**: **Significant** — chạm luồng đơn hàng

   ### Integration Approach

   **Code Integration Strategy**: 🔴 **Additive with a thin new layer.**

   Tôi chọn cách này thay vì hai phương án khác:

   | Phương án | Ưu | Nhược | Quyết định |
   |-----------|-----|-------|-----------|
   | A. Nhét logic điểm vào `routes/orders.js` | không thêm pattern mới | file đã 620 dòng; không test độc lập được; tăng rủi ro regression | ❌ |
   | B. **Thêm `services/loyalty.js`, route chỉ gọi 1 hàm** | test độc lập được; thay đổi trong `orders.js` chỉ 3 dòng | giới thiệu pattern mới vào codebase | ✅ |
   | C. Tách microservice riêng | cô lập hoàn toàn | quá mức cho 18k dòng; VPS 1GB; thêm điểm chết mới | ❌ |

   **Database Integration**: chỉ thêm — một collection mới + hai field mới có
   default. Migration idempotent. Có script rollback.

   **API Integration**: endpoint mới dưới `/api/loyalty/*`. **Không sửa** endpoint
   `/api/orders*` nào. Field mới (nếu cần) thêm ở cuối object response.

   **UI Integration**: partial EJS mới, include vào view có sẵn. jQuery. Không
   thêm bundler.

   ### Compatibility Requirements
   [4 CR lấy từ PRD, cụ thể hoá thành quy tắc kỹ thuật]

   | CR | Quy tắc kỹ thuật |
   |----|------------------|
   | CR1 API | Mọi thay đổi response phải là **thêm key mới**. Cấm `delete`, cấm đổi tên, cấm đổi kiểu. Có contract test cho 3 endpoint `/api/orders*` |
   | CR2 Schema | Field mới phải có `default` trong Mongoose schema. Cấm `required: true` cho field mới trên collection có dữ liệu cũ |
   | CR3 UI | Partial mới; không sửa `views/layout.ejs`; không thêm CSS framework |
   | CR4 Performance | Field mới dùng để lọc phải có index. Đo lại `GET /api/orders` sau migration |

   ---
   **Rationale:**
   - **Vì sao B thắng**: điểm quyết định không phải "sạch hơn" mà là **giảm rủi ro
     regression**. Với phương án B, diff trong `routes/orders.js` chỉ khoảng 3
     dòng (`await loyalty.awardPoints(order)` trong try/catch). Với phương án A,
     diff là 60–80 dòng trong file 620 dòng không test.
   - **Trade-off của B**: chúng ta giới thiệu một pattern mới vào codebase. Điều
     này tạo ra sự **không nhất quán tạm thời** (3 route cũ không có service,
     1 luồng mới có). Tôi cho rằng đánh đổi này đúng, nhưng phải ghi vào
     coding-standards để người sau biết đây là hướng đi có chủ ý, không phải
     ai đó làm khác kiểu.
   - **Cần xác thực**: bạn có kế hoạch dần chuyển các route khác sang service
     không? Nếu có, ghi vào Next Steps; nếu không, `services/` sẽ mãi chỉ có
     một file và người sau sẽ thắc mắc.

👤 Bạn: Có, tôi muốn dần chuyển. Ghi vào Next Steps.
```

⚙️ **Cơ chế**: mục `integration-approach` ép Architect **so sánh phương án tích hợp** thay vì chỉ mô tả thiết kế. Với brownfield, câu hỏi "nhét vào chỗ cũ hay tạo chỗ mới" là quyết định quan trọng nhất — và nó phải dựa trên **rủi ro regression**, không dựa trên tính thẩm mỹ của code.

### Section 3 — Tech Stack: existing │ new 🔴

```text
🤖 ## Tech Stack

   ### Existing Technology Stack — KHÔNG ĐỔI
   | Category | Current Technology | Version | Usage in Enhancement | Notes |
   |----------|-------------------|---------|---------------------|-------|
   | Runtime | Node.js | 16.x | dùng nguyên | không transpile |
   | Framework | Express | 4.17.1 | dùng nguyên | |
   | ODM | Mongoose | 5.12.3 | dùng nguyên | ⚠️ API v5, không phải v6 |
   | Database | MongoDB | 4.4 | thêm 1 collection | |
   | View | EJS | 3.1.6 | thêm 1 partial | |
   | Client | jQuery | (CDN) | thêm 1 file js | |
   | Date | moment | 2.29.1 | dùng nguyên | ⚠️ deprecated nhưng 11 file import — KHÔNG đổi |

   ### New Technology Additions
   | Technology | Version | Purpose | Rationale | Integration Method |
   |-----------|---------|---------|-----------|-------------------|
   | Jest | 29.7 | test framework | hệ thống có 0 test; cần lưới an toàn trước khi sửa `orders.js` | devDependency; `npm test`; không ảnh hưởng runtime |
   | supertest | 6.3 | test HTTP endpoint | cần cho regression test của API | devDependency |
   | dotenv | 16.4 | biến môi trường | FR6 cần `LOYALTY_ENABLED`; hiện credential hardcode | require ở đầu `server.js` |

   ---
   **Rationale:**
   - **Chỉ 3 dependency mới, tất cả đều nhẹ và 2/3 là devDependency** ⇒ không
     ảnh hưởng RAM runtime của VPS 1GB.
   - **Jest 29 (không phải bản mới nhất)**: Jest 30 yêu cầu Node 18+. Đây là ví
     dụ ràng buộc Node 16 chi phối quyết định kỹ thuật.
   - **KHÔNG thêm**: TypeScript, ESLint, bundler, framework frontend — dù cả bốn
     đều "nên có". Chúng nằm ngoài phạm vi và làm tăng rủi ro. Ghi vào Next Steps.
```

### Section 4 — Data Models: new-models │ schema-integration 🔴

```text
🤖 ## Data Models and Schema Changes

   ### New Data Models

   **PointTransaction**
   - **Purpose**: audit trail không xoá được cho mọi thay đổi điểm (NFR4)
   - **Integration**: collection mới, không liên quan tới collection cũ ngoài
     việc tham chiếu bằng ObjectId

   | Field | Type | Notes |
   |-------|------|-------|
   | customerId | ObjectId ref Customer | indexed |
   | orderId | ObjectId ref Order, nullable | null với điều chỉnh thủ công |
   | delta | Number | dương = tích, âm = trừ |
   | reason | String enum | `order_award` · `order_redeem` · `manual_adjust` |
   | balanceAfter | Number | snapshot số dư sau giao dịch — giúp audit |
   | createdAt | Date | default now, indexed |

   **Relationships**
   - With Existing: `customerId` → `customers._id`; `orderId` → `orders._id`
   - With New: không có

   ### Schema Integration Strategy

   **Database Changes Required**
   - **New tables**: `pointtransactions`
   - **Modified tables**:
     - `customers`: thêm `loyaltyPoints` (Number, **default 0**)
     - `orders`: thêm `pointsAwarded` (Boolean, **default false**),
                 `pointsRedeemed` (Number, **default 0**)
   - **New indexes**:
     - `pointtransactions`: `{ customerId: 1, createdAt: -1 }`
     - `orders`: `{ pointsAwarded: 1 }` — dùng để tìm đơn chưa tích điểm
   - **Migration Strategy**: script `migrations/001-add-loyalty-fields.js`,
     idempotent bằng cách dùng điều kiện field chưa tồn tại:
     ```js
     await Customer.updateMany(
       { loyaltyPoints: { $exists: false } },
       { $set: { loyaltyPoints: 0 } }
     );
     ```
     Chạy lại lần 2 sẽ khớp 0 document ⇒ không thay đổi gì.

   **Backward Compatibility**
   - Mọi field mới có `default` ⇒ code cũ đọc document cũ vẫn hoạt động
   - **Không** đặt `required: true` cho field mới ⇒ document cũ chưa migrate
     vẫn `save()` được
   - Không đổi tên/kiểu field nào ⇒ 14 view EJS không bị ảnh hưởng
   - `orders.total_amount` (snake_case) **giữ nguyên** dù không nhất quán —
     view và app mobile đang dùng

   ---
   **Rationale:**
   - **`balanceAfter` là snapshot có chủ ý**: về lý thuyết có thể tính lại bằng
     cách cộng dồn `delta`, nhưng với audit trail thì snapshot cho phép phát hiện
     sai lệch (nếu `loyaltyPoints` của customer khác `balanceAfter` của giao dịch
     cuối ⇒ có gì đó đã ghi trực tiếp vào DB, cần điều tra).
   - **Quyết định không thể sửa dễ**: `delta` là Number nguyên (điểm), không phải
     tiền. Nếu sau này muốn điểm thập phân, phải migrate.
```

### Section 9 — `rollback-strategy` 🔴

```text
🤖 ## Infrastructure and Deployment Integration

   ### Existing Infrastructure
   **Current Deployment**: SSH → `git pull` → `pm2 restart banhang`
   **Infrastructure Tools**: PM2, nginx (reverse proxy + IP whitelist cho API mobile)
   **Environments**: **chỉ production** 🔴

   ### Enhancement Deployment Strategy
   **Deployment Approach**: triển khai theo 3 pha, tách rời việc **deploy code**
   khỏi việc **bật tính năng**:

   ```text
   Pha 1 — deploy code với LOYALTY_ENABLED=false
     git pull → npm ci → pm2 restart → kiểm pm2 logs
     ⇒ code mới đã ở production nhưng KHÔNG hoạt động. Hệ thống hành xử y như cũ.
     ⇒ Nếu có vấn đề: chỉ có thể là lỗi khởi động, phát hiện ngay ở pm2 logs.

   Pha 2 — chạy migration
     node migrations/001-add-loyalty-fields.js
     ⇒ thêm field với default. Code cũ vẫn chạy được vì mọi field có default.
     ⇒ Kiểm: GET /api/orders vẫn dưới 250ms; view khách hàng vẫn render đúng.

   Pha 3 — bật tính năng
     sửa .env: LOYALTY_ENABLED=true → pm2 restart
     ⇒ theo dõi pm2 logs với filter [loyalty] trong 30 phút đầu.
   ```

   **Infrastructure Changes**: thêm file `.env` trên VPS (không commit).
   **Pipeline Integration**: không có pipeline; bổ sung checklist deploy thủ công
   (xem Next Steps).

   ### Rollback Strategy  🔴

   | Mức | Tình huống | Cách rollback | Thời gian |
   |-----|-----------|---------------|-----------|
   | **1. Tắt tính năng** | logic điểm sai, nhưng hệ thống chạy | `LOYALTY_ENABLED=false` → `pm2 restart` | **< 1 phút** |
   | **2. Rollback code** | code mới gây lỗi khởi động hoặc regression | `git checkout pre-loyalty-baseline` → `pm2 restart` | ~3 phút |
   | **3. Rollback schema** | migration gây vấn đề dữ liệu | `node migrations/001-rollback.js` (xoá field mới, giữ collection mới) | ~5 phút |
   | **4. Restore DB** | dữ liệu bị hỏng | `mongorestore` từ dump trước Pha 2 | ~15 phút, **mất dữ liệu phát sinh** |

   **Risk Mitigation**: mức 1 là mức chính — đây là lý do FR6 (công tắc) tồn tại.
   Mức 4 là cuối cùng và có mất dữ liệu ⇒ phải tránh bằng cách migration chỉ thêm
   field, không sửa dữ liệu có sẵn.

   **Monitoring**: `pm2 logs banhang | grep '\[loyalty\]'` trong 30 phút sau
   khi bật. Đếm số lần tích điểm so với số đơn tạo mới — phải khớp.
```

⚙️ **Cơ chế**: `rollback-strategy` là section **không có** trong template greenfield. `working-in-the-brownfield.md` đặt nó thành chuẩn bắt buộc: **"Rollback Procedures: Every change needs a rollback plan"**. Bảng 4 mức ở trên chính là dạng cụ thể của yêu cầu đó.

### Section 10 — Coding Standards: existing │ enhancement │ integration-rules 🔴

```text
🤖 ## Coding Standards

   ### Existing Standards Compliance
   Không có tài liệu chuẩn code chính thức. Các pattern sau được **suy ra từ
   codebase** và phải tuân theo:
   - CommonJS `require`/`module.exports` (không ESM)
   - Route handler: `router.method('/path', async (req, res) => {...})`
   - Lỗi: `res.status(4xx).json({ message: '...' })`
   - Model: một file một model, PascalCase số ít
   - Field: camelCase (⚠️ trừ `orders.total_amount` đã tồn tại — không bắt chước)
   - Indent 2 space, single quote, có semicolon

   ### Enhancement-Specific Standards  🔴
   Ba luật MỚI, chỉ áp cho code của enhancement:
   1. **Logic nghiệp vụ của loyalty nằm trong `services/loyalty.js`**, không nằm
      trong route handler. Route chỉ gọi service và xử lý lỗi.
   2. **Mọi hàm trong `services/` phải nhận dependency qua tham số** để test được
      (ví dụ `awardPoints(order, { now = Date.now() } = {})`).
   3. **Mọi thay đổi điểm phải đi qua một hàm duy nhất** ghi cả `PointTransaction`
      và cập nhật `Customer.loyaltyPoints`. Cấm cập nhật `loyaltyPoints` trực tiếp.

   ### Critical Integration Rules  🔴
   - **Existing API Compatibility**: cấm sửa/xoá key trong response của
     `/api/orders*`. Thêm key mới thì thêm ở cuối object.
   - **Database Integration**: cấm `required: true` cho field mới; cấm đổi kiểu
     field cũ; mọi truy vấn mới phải có index tương ứng.
   - **Error Handling**: 🔴 lỗi trong service loyalty **không được** làm thất bại
     nghiệp vụ chính. Pattern bắt buộc:
     ```js
     try {
       await loyalty.awardPoints(order);
     } catch (err) {
       console.error('[loyalty] award failed, order still created', {
         orderId: order._id, error: err.message
       });
       // KHÔNG throw, KHÔNG đổi response
     }
     ```
   - **Logging Consistency**: mọi log của enhancement có prefix `[loyalty]` để
     lọc được trong `pm2 logs`.
```

⚙️ **Cơ chế quan trọng nhất của section này**: sau khi shard, nó thành `docs/architecture/coding-standards.md` — file mà **Dev agent nạp ở MỌI task**. Với brownfield, ba mục `existing / enhancement / integration-rules` cho Dev biết chính xác: *cái gì phải bắt chước, cái gì làm theo cách mới, cái gì tuyệt đối không được chạm.*

### Section 11 — Testing Strategy: existing-test-integration │ new-testing 🔴

```text
🤖 ## Testing Strategy

   ### Integration with Existing Tests
   **Existing Test Framework**: **không có** 🔴
   **Test Organization**: không có
   **Coverage Requirements**: hiện 0%

   ⇒ Enhancement này tạo ra hạ tầng test đầu tiên của dự án. Đây vừa là gánh
     nặng vừa là cơ hội.

   ### New Testing Requirements

   #### Unit Tests for New Components
   - Framework: Jest 29
   - Location: `tests/unit/`
   - Coverage: mọi hàm trong `services/loyalty.js` phải có test cho happy path,
     input sai, và trường hợp biên (điểm không đủ, điểm âm, đơn đã tích rồi)
   - Integration with Existing: không có gì để tích hợp — đây là test đầu tiên

   #### Integration Tests
   - Scope: endpoint `/api/loyalty/*` mới + **luồng tạo đơn có tích điểm**
   - Existing System Verification: 🔴 **regression test cho 3 endpoint
     `/api/orders*` PHẢI được viết TRƯỚC khi sửa `routes/orders.js`** — đây là
     nội dung Story 1.1
   - New Feature Testing: tạo đơn → kiểm điểm được tích; tạo đơn 2 lần → điểm
     chỉ tích 1 lần; service ném lỗi → đơn vẫn được tạo

   #### Regression Testing  🔴
   - **Existing Feature Verification**: contract test cho 3 endpoint
     `/api/orders*` — so response với snapshot đã ghi TRƯỚC khi sửa
   - **Automated Regression Suite**: `npm test` chạy toàn bộ; là cổng bắt buộc
     trước mọi deploy
   - **Manual Testing Requirements**: sau mỗi pha deploy, kiểm tay 4 luồng:
     tạo đơn · sửa đơn · xem danh sách đơn · xem chi tiết khách hàng
     (vì view EJS không có test tự động)
```

### Section 14 — Next Steps: hai handoff 🔴

```text
🤖 ## Next Steps

   ### Story Manager Handoff

   Gửi tới Scrum Master:

   > Bắt đầu tạo story cho enhancement "Khách hàng thân thiết" dựa trên:
   > - PRD: `docs/prd.md` (đặc biệt mục Compatibility Requirements CR1–CR4)
   > - Kiến trúc này: `docs/architecture.md`
   > - Thực trạng hệ thống: `docs/brownfield-architecture.md`
   >
   > **Ràng buộc tích hợp then chốt đã xác nhận với chủ dự án:**
   > - Không đổi shape response của `/api/orders*` (app mobile chưa xác định
   >   dùng field nào)
   > - Mọi field mới phải có default; không `required: true`
   > - Lỗi loyalty không được làm thất bại việc tạo đơn
   >
   > **Story ĐẦU TIÊN phải là Story 1.1** (Jest + regression test + công tắc) —
   > không được đảo thứ tự. Lý do: nó tạo lưới an toàn cho 4 story sau.
   >
   > Mỗi story phải có mục **Integration Verification** kiểm rằng chức năng
   > hiện có không vỡ.

   ### Developer Handoff

   Gửi tới Dev agent:

   > - Tuân thủ `docs/architecture/coding-standards.md`, chú ý mục
   >   **Critical Integration Rules**
   > - Ràng buộc kỹ thuật đã xác minh từ codebase thật: Node 16 (không cú pháp
   >   mới hơn), Mongoose 5 API, không build step
   > - **Yêu cầu tương thích với hệ thống cũ, kèm bước xác minh cụ thể**:
   >   sau mỗi story, chạy `npm test` (gồm regression suite) và kiểm tay 4 luồng
   > - **Thứ tự triển khai giảm thiểu rủi ro**: test trước → schema trước →
   >   logic sau → UI cuối
   > - Nếu phát hiện logic tính tiền (bug 3 chỗ) ảnh hưởng tới việc trừ điểm:
   >   **HALT và hỏi**, đừng tự quyết định sửa bug ngoài phạm vi
```

⚙️ **Cơ chế** — hai handoff này là section **chỉ có ở template brownfield**. Chúng đóng gói "những điều đã xác nhận với con người" thành lời nhắn cho agent tiếp theo, để ràng buộc không bị mất khi chuyển vai.

### Section 13 — Checklist Results

```text
🤖 Đang chạy architect-checklist (YOLO)...

   | Section                              | Pass rate |
   |--------------------------------------|-----------|
   | 1. REQUIREMENTS ALIGNMENT            | 5/5  100% |
   | 2. ARCHITECTURE FUNDAMENTALS         | 5/6   83% |
   | 3. TECHNICAL STACK & DECISIONS       | 7/7  100% |
   | 4. FRONTEND DESIGN [[FRONTEND ONLY]] | 5/7   71% |
   | 5. RESILIENCE & OPERATIONAL READINESS| 6/6  100% |
   | 6. SECURITY & COMPLIANCE             | 4/6   67% |
   | 7. IMPLEMENTATION GUIDANCE           | 6/6  100% |
   | 8. DEPENDENCY & INTEGRATION MGMT     | 4/4  100% |
   | 9. AI AGENT IMPLEMENTATION SUITABILITY| 5/5 100% |
   | 10. ACCESSIBILITY [[FRONTEND ONLY]]  | 1/3   33% |
   | **TỔNG**                              | **48/55  87%** |

   ⚠️ §2: kiến trúc tạo ra sự không nhất quán tạm thời (1 luồng có service, 3
      luồng cũ không có). Đã ghi nhận có chủ ý + kế hoạch chuyển dần ở Next Steps.
   ⚠️ §4: không có design system; UI mới bám theo style hiện có. Chấp nhận được
      với enhancement nội bộ.
   ⚠️ §6: credential vẫn hardcode trong `utils/db.js` — nằm NGOÀI phạm vi
      enhancement này nhưng là rủi ro thật. Đã thêm vào Next Steps như việc
      phải làm riêng.
   ⚠️ §10: hệ thống hiện không đạt accessibility; enhancement không làm tệ hơn
      nhưng cũng không sửa. Ghi nhận là nợ.
```

⚙️ **Cơ chế brownfield**: 87% và **đó là chấp nhận được**. Với brownfield, một số mục checklist sẽ **không bao giờ** đạt vì hệ thống cũ vốn không đạt. Việc của bạn là phân biệt: *mục này fail vì enhancement của tôi làm sai*, hay *fail vì hệ thống vốn đã vậy*. Loại thứ hai → ghi nhận vào Next Steps, không sửa trong phạm vi này.

## File sinh ra

📂 `docs/architecture.md` — 14 section H2. Ba section sẽ thành `devLoadAlwaysFiles`:

```text
## Introduction
## Enhancement Scope and Integration Strategy
## Tech Stack                                   ⭐ → architecture/tech-stack.md
## Data Models and Schema Changes
## Component Architecture
## API Design and Integration
## External API Integration
## Source Tree                                  ⭐ → architecture/source-tree.md ✓
## Infrastructure and Deployment Integration
## Coding Standards                             ⭐ → architecture/coding-standards.md
## Testing Strategy
## Security Integration
## Checklist Results Report
## Next Steps
```

🔴 **Tin tốt cho brownfield**: template này đặt tên section là **"Source Tree"** — khớp **đúng** `devLoadAlwaysFiles` mặc định (`docs/architecture/source-tree.md`). Đây là điểm khác với template `fullstack-architecture` (dùng "Unified Project Structure" ⇒ lệch tên, xem [demo greenfield bước 5](../demo/05-architect.md)).

## Trạng thái sau bước 5

📂

```text
docs/
├── brownfield-architecture.md      ← thực trạng
├── prd.md                          ← yêu cầu enhancement
└── architecture.md                 ← MỚI: kiến trúc tích hợp
```

⚠️ Ba tài liệu, ba vai trò khác nhau — đừng lẫn:

| File | Trả lời câu hỏi | Ai dùng |
|---|---|---|
| `brownfield-architecture.md` | *Hệ thống hiện tại thực sự thế nào?* | Architect (khi thiết kế), SM (khi viết Dev Notes), QA (khi đánh giá rủi ro) |
| `prd.md` | *Cần thêm gì, và không được phá gì?* | Architect, PO, SM |
| `architecture.md` | *Thêm vào bằng cách nào cho an toàn?* | PO, SM, Dev (sau khi shard) |

## Bạn tự làm gì ở bước này

- [ ] Xác nhận lựa chọn **integration approach** — đây là quyết định quan trọng nhất của bước này
- [ ] Đọc **Rollback Strategy**: bạn có thực sự thực hiện được 4 mức đó không? Nếu không, sửa
- [ ] Kiểm **Critical Integration Rules** trong Coding Standards — có đủ cụ thể để Dev làm theo không?
- [ ] Kiểm mục **New Technology Additions**: mỗi dependency mới có thực sự cần? Có tương thích Node 16?
- [ ] Với các mục checklist fail: phân loại "lỗi của enhancement" vs "hệ thống vốn vậy"
- [ ] Đọc **hai handoff** ở Next Steps — chúng có nêu đủ ràng buộc bạn đã xác nhận không?

---

[⬅ Bước trước](./04-pm-brownfield-prd.md) · [Chỉ mục](./README.md) · [Bước sau: PO chốt kiểm + shard ➡](./06-po-validate-va-shard.md)
