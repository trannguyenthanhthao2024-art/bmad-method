[⬅ Về chỉ mục](./README.md)

# 02 — `core-config.yaml`: bản đồ dự án

Đây là file **quan trọng nhất** của `bmad-core` khi vận hành. Nó nói cho agent biết tài liệu của bạn nằm ở đâu và được tổ chức thế nào. Thiếu file này, task `create-next-story` và `validate-next-story` sẽ **HALT ngay**.

## 1. Nội dung mặc định

```yaml
markdownExploder: true
qa:
  qaLocation: docs/qa
prd:
  prdFile: docs/prd.md
  prdVersion: v4
  prdSharded: true
  prdShardedLocation: docs/prd
  epicFilePattern: epic-{n}*.md
architecture:
  architectureFile: docs/architecture.md
  architectureVersion: v4
  architectureSharded: true
  architectureShardedLocation: docs/architecture
customTechnicalDocuments: null
devLoadAlwaysFiles:
  - docs/architecture/coding-standards.md
  - docs/architecture/tech-stack.md
  - docs/architecture/source-tree.md
devDebugLog: .ai/debug-log.md
devStoryLocation: docs/stories
slashPrefix: BMad
```

## 2. Bảng giải thích từng khoá — và ai đọc nó

| Khoá | Ý nghĩa | Ai đọc | Hậu quả nếu sai |
|------|---------|--------|-----------------|
| `markdownExploder` | Có dùng công cụ `md-tree` để shard tự động hay không | task `shard-doc` | `true` mà chưa cài công cụ → task **dừng** và yêu cầu bạn cài; nó **không** tự chẻ tay |
| `qa.qaLocation` | Thư mục gốc cho đầu ra QA | mọi task QA (`risk-profile`, `test-design`, `trace-requirements`, `nfr-assess`, `review-story`, `qa-gate`, `apply-qa-fixes`) | Gate/assessment ghi sai chỗ; `apply-qa-fixes` không tìm thấy gate |
| `prd.prdFile` | Đường dẫn PRD nguyên khối | `shard-doc`, `create-next-story` | Không tìm được yêu cầu |
| `prd.prdVersion` | `v3` (epic nhúng trong PRD) hoặc `v4` | `create-next-story` | Đọc sai vị trí epic |
| `prd.prdSharded` | PRD đã chẻ thành nhiều file chưa | `create-next-story` | Tìm epic sai chỗ |
| `prd.prdShardedLocation` | Thư mục chứa PRD đã chẻ | `create-next-story` | idem |
| `prd.epicFilePattern` | Mẫu tên file epic, ví dụ `epic-{n}*.md` | `create-next-story` | Không nhận diện được epic |
| `architecture.architectureFile` | Đường dẫn tài liệu kiến trúc nguyên khối | `shard-doc`, `create-next-story` | SM không có ngữ cảnh kỹ thuật |
| `architecture.architectureVersion` | `v3` nguyên khối / `v4` đã chẻ | `create-next-story` | Chọn sai chiến lược đọc |
| `architecture.architectureSharded` | Kiến trúc đã chẻ chưa | `create-next-story` | idem |
| `architecture.architectureShardedLocation` | Thư mục kiến trúc đã chẻ | `create-next-story` (đọc `index.md` rồi theo thứ tự) | idem |
| `customTechnicalDocuments` | Khai báo tài liệu kỹ thuật ngoài chuẩn | `create-next-story` | Bỏ sót nguồn |
| `devLoadAlwaysFiles` | **Danh sách file `dev` LUÔN nạp mọi task** | `dev` (bước kích hoạt) | File không tồn tại → dev thiếu luật; file quá dài → tốn ngữ cảnh vô ích |
| `devDebugLog` | Nơi `dev` ghi log khi thất bại lặp lại | `dev` | Mất dấu vết chẩn đoán |
| `devStoryLocation` | Thư mục chứa story | `create-next-story`, `validate-next-story`, mọi task QA, `apply-qa-fixes` | Story tạo/tìm sai chỗ |
| `slashPrefix` | Tiền tố slash command khi sinh cấu hình IDE | tooling `ide-setup` | Command IDE nằm sai namespace |

## 3. `devLoadAlwaysFiles` — khoá cần chăm sóc nhất

Đây là "hiến pháp" của Dev agent. Ba quy tắc vận hành:

1. **Phải tồn tại thật.** Sau khi shard architecture, mở thư mục `docs/architecture/` kiểm tra đúng ba file (hoặc sửa danh sách theo tên thật của bạn).
2. **Phải gọn.** Chỉ giữ những quy tắc agent **bắt buộc** tuân thủ. Mỗi dòng thừa là ngữ cảnh mất đi cho việc code.
3. **Phải teo dần theo thời gian.** Khi codebase đã có pattern nhất quán, rút gọn `coding-standards.md` — agent sẽ tự suy chuẩn từ code xung quanh. Đây là lời khuyên trực tiếp trong `docs/user-guide.md`.

Nếu bạn **tắt** sharding kiến trúc (`architectureSharded: false`): bạn vẫn phải tự tạo ba file này, **hoặc** xoá chúng khỏi `devLoadAlwaysFiles`. Installer sẽ cảnh báo đúng điều này và yêu cầu xác nhận.

## 4. Ba cấu hình mẫu

**Dự án v4 chuẩn (mặc định)** — như mục 1.

**Dự án legacy v3 (chưa chẻ tài liệu):**

```yaml
prd:
  prdVersion: v3
  prdSharded: false
architecture:
  architectureVersion: v3
  architectureSharded: false
```

**Dự án dùng cấu trúc docs riêng:**

```yaml
qa:
  qaLocation: docs/project/qa
prd:
  prdFile: docs/product/requirements.md
  prdShardedLocation: docs/product/requirements
  epicFilePattern: 'E{n}-*.md'
architecture:
  architectureFile: docs/tech/architecture.md
  architectureShardedLocation: docs/tech/architecture
devLoadAlwaysFiles:
  - docs/tech/architecture/standards.md
  - docs/tech/architecture/stack.md
devStoryLocation: docs/product/stories
```

> Lưu ý: dù đổi được đường dẫn, **tên `docs/prd.md` và `docs/architecture.md` vẫn là quy ước được khuyến nghị mạnh** vì nhiều tài liệu, prompt handoff và task viết cứng theo tên này.

## 5. Cấu hình của expansion pack

Mỗi expansion pack có `config.yaml` đóng vai trò như một `core-config.yaml` thu nhỏ, ví dụ pack Godot:

```yaml
name: bmad-godot-game-dev
version: 1.0.0
short-title: Godot Game Dev Pack
slashPrefix: BmadG
markdownExploder: true
qa: { qaLocation: docs/qa }
prd: { ... }
architecture: { ... }
devLoadAlwaysFiles:
  - docs/architecture/coding-standards.md
  - docs/architecture/tech-stack.md
  - docs/architecture/source-tree.md
  - docs/architecture/testing-strategy-and-standards.md
qaLoadAlwaysFiles:                       # khoá riêng của pack
  - docs/architecture/testing-strategy-and-standards.md
devDebugLog: .ai/debug-log.md
devStoryLocation: docs/stories
```

Schema là **mở**: pack có thể thêm khoá mới (như `qaLoadAlwaysFiles`) và agent của pack tự hiểu khoá đó.

## 6. Checklist kiểm tra cấu hình

- [ ] File tồn tại tại `{root}/core-config.yaml`
- [ ] Mọi đường dẫn trong file trỏ tới thư mục/file **thật tồn tại**
- [ ] `prdSharded`/`architectureSharded` phản ánh đúng trạng thái thật (đã shard hay chưa)
- [ ] `epicFilePattern` khớp tên file epic thật
- [ ] Mọi file trong `devLoadAlwaysFiles` tồn tại và **gọn**
- [ ] `markdownExploder: true` ⇒ đã cài `npm install -g @kayvan/markdown-tree-parser`
- [ ] `qaLocation` khớp nơi bạn muốn gate/assessment nằm

---

**Tiếp theo**: [03 — Agents](./03-agents.md)
