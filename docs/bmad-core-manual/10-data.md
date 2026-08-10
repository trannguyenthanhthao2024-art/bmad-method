[⬅ Về chỉ mục](./README.md)

# 10 — Data: 6 file tri thức tham chiếu

`bmad-core/data/` là nơi chứa **tri thức nền** mà agent và task tra khi cần. Đây không phải tài liệu để đọc tuần tự — hãy dùng như sách tra.

| File | Dòng | Ai dùng | Vai trò |
|------|------|---------|---------|
| [`bmad-kb.md`](#1-bmad-kbmd) | 809 | analyst, bmad-master, orchestrator | **Knowledge base chuẩn** về toàn bộ phương pháp |
| [`elicitation-methods.md`](#2-elicitation-methodsmd) | 156 | `create-doc`, `advanced-elicitation` | 25+ phương pháp tinh chỉnh nội dung |
| [`brainstorming-techniques.md`](#3-brainstorming-techniquesmd) | 38 | analyst, `facilitate-brainstorming-session` | 20 kỹ thuật brainstorm |
| [`technical-preferences.md`](#4-technical-preferencesmd) | 5 | pm, architect, ux-expert, qa, bmad-master | **Hồ sơ kỹ thuật của BẠN** |
| [`test-levels-framework.md`](#5-test-levels-frameworkmd) | 148 | `test-design` | Tiêu chí chọn unit/integration/E2E |
| [`test-priorities-matrix.md`](#6-test-priorities-matrixmd) | 174 | `test-design` | Phân loại P0/P1/P2/P3 |

---

## 1. `bmad-kb.md`

**Knowledge base chuẩn** — 809 dòng, là nguồn chân lý về cách phương pháp hoạt động. Được nạp khi bật KB mode (`*kb` của bmad-master hoặc `*kb-mode` của orchestrator).

### Bố cục

| Mục | Nội dung |
|-----|----------|
| Overview | Đặc điểm chính, khi nào dùng BMad |
| **How BMad Works** | Phương pháp cốt lõi · **hai pha** · **vòng phát triển** · vì sao nó hiệu quả |
| Getting Started | Web UI vs IDE, hướng dẫn chọn môi trường, cân nhắc IDE-only |
| **Core Configuration** | Giải thích `core-config.yaml` và vì sao nó quan trọng |
| **Core Philosophy** | **Vibe CEO'ing** · 8 nguyên tắc cốt lõi · 5 nguyên tắc workflow |
| Agent System | Bảng đội phát triển lõi + meta agent · cú pháp gọi theo IDE |
| Team Configurations | Team All / Fullstack / No-UI |
| Core Architecture | Tổng quan hệ thống, thành phần, kiến trúc hai môi trường, hệ thống template, quy trình build |
| **Complete Development Workflow** | Pha hoạch định · **chuyển pha then chốt** · vòng phát triển IDE 4 bước · theo dõi trạng thái |
| Workflow Types | Greenfield · **Brownfield (2 phương án + tài nguyên riêng)** |
| Document Creation Best Practices | Quy ước tên file · quy trình tiết kiệm chi phí · sharding |
| Usage Patterns | Dùng theo môi trường · QA · tối ưu hiệu năng |
| Success Tips | 5 mẹo |
| Contributing | Hướng dẫn góp code |
| Expansion Packs | Là gì, vì sao, danh mục, cách dùng, cách tạo |

### Ba khái niệm quan trọng nhất trong KB

**1. "Vibe CEO"** — bạn tư duy như một CEO có nguồn lực vô hạn và một tầm nhìn duy nhất. Ba việc của bạn: **Direct** (chỉ dẫn rõ ràng) · **Refine** (lặp để đạt chất lượng) · **Oversee** (giữ định hướng chiến lược).

**2. Tám nguyên tắc cốt lõi**

| # | Nguyên tắc | Nghĩa |
|---|-----------|-------|
| 1 | MAXIMIZE_AI_LEVERAGE | Đẩy AI làm nhiều hơn; thách thức đầu ra và lặp |
| 2 | QUALITY_CONTROL | **Bạn** là trọng tài chất lượng cuối cùng |
| 3 | STRATEGIC_OVERSIGHT | Giữ tầm nhìn cấp cao, đảm bảo nhất quán |
| 4 | ITERATIVE_REFINEMENT | Sẽ phải quay lại các bước — đây không phải quy trình tuyến tính |
| 5 | CLEAR_INSTRUCTIONS | Yêu cầu chính xác → đầu ra tốt hơn |
| 6 | DOCUMENTATION_IS_KEY | Đầu vào tốt (brief, PRD) → đầu ra tốt |
| 7 | START_SMALL_SCALE_FAST | Thử nghiệm ý tưởng rồi mở rộng |
| 8 | EMBRACE_THE_CHAOS | Thích ứng và vượt qua |

**3. Vì sao vòng phát triển hiệu quả**

- **Context Optimization** — chat sạch = AI hoạt động tốt hơn
- **Role Clarity** — agent không phải nhảy vai = chất lượng cao hơn
- **Incremental Progress** — story nhỏ = độ phức tạp quản lý được
- **Human Oversight** — bạn xác thực mỗi bước = kiểm soát chất lượng
- **Document-Driven** — đặc tả dẫn dắt mọi thứ = nhất quán

### Luật CRITICAL trong KB về phát triển

> - **LUÔN dùng agent `sm` để tạo story** — không bao giờ dùng `bmad-master` hay `bmad-orchestrator`
> - **LUÔN dùng agent `dev` để triển khai** — không bao giờ dùng `bmad-master` hay `bmad-orchestrator`
> - **Không có ngoại lệ**: dù bạn dùng `bmad-master` cho mọi thứ khác, vẫn phải chuyển sang SM → Dev khi triển khai

---

## 2. `elicitation-methods.md`

Danh mục phương pháp mà `create-doc` (option 2–9) và `advanced-elicitation` (option 0–8) chọn từ đó. **Agent không được tự sáng tác phương pháp mới.**

### 8 nhóm phương pháp

**Core Reflective Methods**

| Phương pháp | Làm gì |
|------------|--------|
| Expand or Contract for Audience | Hỏi bạn muốn 'expand' (thêm chi tiết) hay 'contract' (đơn giản hoá); xác định đối tượng đọc; điều chỉnh độ sâu |
| Explain Reasoning (CoT Step-by-Step) | Trình bày lập luận từng bước, lộ giả định và điểm quyết định |
| Critique and Refine | Tìm lỗi, mâu thuẫn, chỗ cần cải thiện; đề xuất bản tinh chỉnh |

**Structural Analysis Methods**

| Phương pháp | Làm gì |
|------------|--------|
| Analyze Logical Flow and Dependencies | Kiểm tiến trình logic, tính nhất quán nội tại, phụ thuộc, thứ tự |
| Assess Alignment with Overall Goals | Đánh giá đóng góp vào mục tiêu, tìm lệch hướng và khoảng trống |

**Risk and Challenge Methods**

| Phương pháp | Làm gì |
|------------|--------|
| Identify Potential Risks and Unforeseen Issues | Brainstorm rủi ro, edge case bị bỏ sót, hệ quả không lường, thách thức triển khai |
| Challenge from Critical Perspective | Đóng vai phản biện, lập luận **chống lại** đề xuất; **áp dụng YAGNI** để cắt phạm vi khi phù hợp |

**Creative Exploration Methods**

| Phương pháp | Làm gì |
|------------|--------|
| Tree of Thoughts Deep Dive | Chẻ vấn đề thành các "thought", khám phá nhiều nhánh lập luận, tự đánh giá "sure/likely/impossible", dùng BFS/DFS tìm đường tối ưu |
| Hindsight is 20/20: The 'If Only…' Reflection | Tưởng tượng hồi tưởng: "nếu chỉ cần biết/làm X…", rút bài học hành động được |

**Multi-Persona Collaboration Methods**

| Phương pháp | Làm gì |
|------------|--------|
| Agile Team Perspective Shift | Luân phiên góc nhìn PO (giá trị người dùng) → SM (quy trình, động lực nhóm) → Developer (khả thi kỹ thuật) → QA (kịch bản test) |
| Stakeholder Round Table | Họp ảo nhiều persona, tìm xung đột và cộng hưởng, tổng hợp thành khuyến nghị |
| Meta-Prompting Analysis | Lùi lại phân tích chính cấu trúc/logic của cách tiếp cận; đề xuất framework khác; tối ưu chính quá trình elicitation |

**Advanced 2025 Techniques**

| Phương pháp | Làm gì |
|------------|--------|
| Self-Consistency Validation | Sinh nhiều đường lập luận cho cùng vấn đề, so tính nhất quán, chọn giải pháp bền nhất |
| ReWOO (Reasoning Without Observation) | Tách lập luận nội tại khỏi hành động dùng công cụ; xác định gì giải được bằng lập luận thuần; tối ưu token |
| Persona-Pattern Hybrid | Kết hợp vai + mẫu: Architect + Risk Analysis · UX Expert + User Journey · PM + Stakeholder Analysis |
| Emergent Collaboration Discovery | Để nhiều góc nhìn tự nảy sinh, bắt các phát hiện tình cờ |

**Game-Based Elicitation Methods**

| Phương pháp | Làm gì |
|------------|--------|
| Red Team vs Blue Team | Red công (tìm lỗ hổng), Blue thủ (củng cố) → lộ điểm mù → giải pháp "đã qua thực chiến" |
| Innovation Tournament | Cho các phương án đấu nhau, chấm theo tiêu chí, chọn tổ hợp thắng |
| Escape Room Challenge | Coi nội dung là ràng buộc, tìm giải pháp trong giới hạn ngặt → tìm cách tiếp cận tối giản khả thi |

**Process Control**

| Phương pháp | Làm gì |
|------------|--------|
| Proceed / No Further Actions | Chốt công việc hiện tại, đi tiếp |

### Cách dùng thủ công

Khi bạn tự chạy `create-doc` thủ công, hãy **dán cả file này** vào ngữ cảnh để LLM chọn đúng 8 phương pháp phù hợp. Nếu không có file này, agent sẽ tự bịa phương pháp — vi phạm quy trình.

---

## 3. `brainstorming-techniques.md`

20 kỹ thuật, 5 nhóm. Đặc điểm chung: mỗi kỹ thuật được viết theo lối **"làm một bước, đợi người dùng, rồi tiếp"** — đúng tinh thần facilitator.

**Creative Expansion**

1. **What If Scenarios** — hỏi một câu khiêu khích, nghe trả lời, rồi hỏi câu tiếp
2. **Analogical Thinking** — cho một ví dụ tương tự, yêu cầu họ tìm 2–3 cái khác
3. **Reversal/Inversion** — đặt câu hỏi ngược lại, để họ tự xử lý
4. **First Principles Thinking** — hỏi "cái căn bản là gì?" rồi dẫn họ chẻ nhỏ

**Structured Frameworks**

5. **SCAMPER Method** — đi **từng chữ cái một**, đợi ý của họ trước khi sang chữ kế
6. **Six Thinking Hats** — trình bày một chiếc mũ, hỏi ý họ, rồi sang mũ tiếp
7. **Mind Mapping** — bắt đầu từ khái niệm trung tâm, yêu cầu họ đề xuất nhánh

**Collaborative Techniques**

8. **"Yes, And…" Building** — họ nêu ý, bạn "yes and", họ "yes and" lại — luân phiên
9. **Brainwriting/Round Robin** — họ nêu ý, bạn xây thêm, yêu cầu họ xây trên ý của bạn
10. **Random Stimulation** — cho một từ/gợi ý ngẫu nhiên, yêu cầu họ tìm liên hệ

**Deep Exploration**

11. **Five Whys** — hỏi "tại sao" và **đợi câu trả lời** trước khi hỏi "tại sao" tiếp
12. **Morphological Analysis** — yêu cầu họ liệt kê tham số trước, rồi cùng khám phá tổ hợp
13. **Provocation Technique (PO)** — nêu một phát biểu khiêu khích, yêu cầu họ rút ý hữu ích

**Advanced Techniques**

14. **Forced Relationships** — nối hai khái niệm không liên quan, yêu cầu họ tìm cầu nối
15. **Assumption Reversal** — thách thức giả định cốt lõi của họ, yêu cầu xây lại từ đó
16. **Role Playing** — brainstorm từ góc nhìn các bên liên quan khác nhau
17. **Time Shifting** — "bạn sẽ giải quyết việc này thế nào ở năm 1995? năm 2030?"
18. **Resource Constraints** — "nếu chỉ có 10 đô và 1 giờ thì sao?"
19. **Metaphor Mapping** — dùng ẩn dụ mở rộng để khám phá giải pháp
20. **Question Storming** — sinh **câu hỏi** trước, thay vì sinh câu trả lời

---

## 4. `technical-preferences.md`

Nội dung gốc trong repo:

```markdown
# User-Defined Preferred Patterns and Preferences

None Listed
```

**Đây là file bạn PHẢI tự điền.** Nó là lớp cá nhân hoá xuyên suốt mọi dự án.

### Vì sao nó quan trọng

| Lợi ích | Cơ chế |
|---------|--------|
| **Nhất quán** | Mọi agent tham chiếu cùng một hồ sơ kỹ thuật |
| **Hiệu quả** | Không phải nhắc lại công nghệ ưa dùng mỗi lần |
| **Cá nhân hoá** | PM và Architect gợi ý theo đúng hướng bạn muốn |
| **Học tích lũy** | Ghi lại bài học và sở thích tiến hoá theo thời gian |

### Nội dung nên có

```markdown
# User-Defined Preferred Patterns and Preferences

## Stack ưa dùng
- Backend: …  · Frontend: …  · DB: …  · Hosting: …

## Design pattern ưa dùng
- …

## Dịch vụ ngoài quen dùng
- Auth: …  · Payment: …  · Email: …  · Monitoring: …

## Chuẩn code
- …

## Anti-pattern CẦN TRÁNH          ← rất quan trọng, đừng bỏ
- …

## Trọng số quality_score riêng (nếu muốn khác mặc định)
- FAIL: −20 · CONCERNS: −10       ← nếu đổi, các task QA sẽ dùng trọng số của bạn
```

### Ba điểm tích hợp

1. Template có thể tham chiếu preferences lúc sinh tài liệu
2. Agent gợi ý công nghệ ưa dùng khi phù hợp với yêu cầu dự án; **khi không phù hợp, agent phải giải thích phương án thay thế**
3. Task `nfr-assess` và `review-story` **đọc trọng số `quality_score` riêng** từ file này nếu bạn định nghĩa

### Dùng với bundle web

Khi tạo bundle web tuỳ biến hoặc upload lên nền tảng AI, **hãy chèn nội dung file này** để agent có preference của bạn ngay từ câu đầu tiên.

### Tiến hoá theo thời gian

Sau mỗi dự án, thêm vào file: công nghệ đã dùng tốt, công nghệ đã gây rắc rối (đưa vào mục anti-pattern), pattern đã hiệu quả. Đây là cách bạn "dạy" hệ thống.

---

## 5. `test-levels-framework.md`

Khung quyết định chọn mức test. `test-design` nạp file này ở bước 2.

### Unit Tests

**Khi dùng**: hàm thuần và business logic · tính đúng của thuật toán · kiểm tra & biến đổi dữ liệu đầu vào · xử lý lỗi trong component cô lập · tính toán phức tạp hoặc state machine.

**Đặc điểm**: chạy nhanh (phản hồi tức thì) · **không có phụ thuộc ngoài** (DB, API, file system) · dễ bảo trì và ổn định · dễ debug khi fail.

```yaml
unit_test:
  component: 'PriceCalculator'
  scenario: 'Calculate discount with multiple rules'
  justification: 'Complex business logic with multiple branches'
  mock_requirements: 'None - pure function'
```

### Integration Tests

**Khi dùng**: xác minh tương tác giữa component · thao tác và transaction DB · hợp đồng API endpoint · giao tiếp service-to-service · hành vi middleware/interceptor.

**Đặc điểm**: thời gian chạy trung bình · test **ranh giới** component · có thể dùng test DB hoặc container · xác thực điểm tích hợp hệ thống.

```yaml
integration_test:
  components: ['UserService', 'AuthRepository']
  scenario: 'Create user with role assignment'
  justification: 'Critical data flow between service and persistence'
  test_environment: 'In-memory database'
```

### End-to-End Tests

**Khi dùng**: hành trình người dùng then chốt · luồng liên hệ thống · visual regression · yêu cầu tuân thủ/quy định.

**Nguyên tắc chi phối**: **shift left** — ưu tiên unit hơn integration, integration hơn E2E. E2E đắt, chậm, dễ flaky; chỉ dùng cho những gì thực sự cần chạy end-to-end.

---

## 6. `test-priorities-matrix.md`

Khung phân loại ưu tiên. `test-design` nạp file này ở bước 3.

### P0 — Critical (Must Test)

**Tiêu chí**: ảnh hưởng doanh thu · đường dẫn quan trọng về bảo mật · thao tác toàn vẹn dữ liệu · yêu cầu tuân thủ quy định · **chức năng từng bị lỗi (chống hồi quy)**.

**Ví dụ**: xử lý thanh toán · authentication/authorization · tạo/xoá dữ liệu người dùng · tính toán tài chính · tuân thủ GDPR/quyền riêng tư.

**Yêu cầu test**: phủ toàn diện ở **mọi mức** · cả happy path và unhappy path · edge case và kịch bản lỗi · hiệu năng dưới tải.

> **Liên hệ với gate**: thiếu P0 test → gate **CONCERNS**; thiếu P0 test về security/data-loss → gate **FAIL**.

### P1 — High (Should Test)

**Tiêu chí**: hành trình người dùng cốt lõi · tính năng dùng thường xuyên · tính năng có logic phức tạp · điểm tích hợp giữa hệ thống · tính năng ảnh hưởng trải nghiệm.

**Ví dụ**: luồng đăng ký · tìm kiếm · import/export dữ liệu · hệ thống thông báo · dashboard.

**Yêu cầu test**: happy path chính là bắt buộc · kịch bản lỗi then chốt · edge case quan trọng · xác thực hiệu năng cơ bản.

### P2 — Medium (Nice to Test)

Tính năng phụ, chức năng admin.

### P3 — Low

Có thì tốt, ít dùng.

### Thứ tự thực thi khuyến nghị (từ `test-design`)

```text
1. P0 Unit tests        (fail fast — phát hiện lỗi sớm nhất, rẻ nhất)
2. P0 Integration tests
3. P0 E2E tests
4. P1 tests theo thứ tự
5. P2+ nếu còn thời gian
```

---

## 7. Ba cách dùng thư mục `data/` khi làm thủ công

| Tình huống | Dán file nào vào ngữ cảnh |
|-----------|---------------------------|
| Chạy `create-doc` thủ công | `elicitation-methods.md` (**bắt buộc**, nếu không agent sẽ bịa phương pháp) |
| Chạy phiên brainstorm thủ công | `brainstorming-techniques.md` |
| Chạy `test-design` thủ công | `test-levels-framework.md` + `test-priorities-matrix.md` (**cả hai**) |
| Muốn agent gợi ý theo sở thích của bạn | `technical-preferences.md` (sau khi đã điền) |
| Muốn hỏi về chính phương pháp BMad | `bmad-kb.md` |

---

**Tiếp theo**: [11 — Workflows](./11-workflows.md)
