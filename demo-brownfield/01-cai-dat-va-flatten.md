[⬅ Bước trước](./00-boi-canh.md) · [Chỉ mục](./README.md) · [Bước sau ➡](./02-phan-loai-va-dinh-tuyen.md)

# Bước 1 — Cài framework + làm phẳng codebase

## 1.1 Cài BMad

```bash
cd D:\projects\banhang
npx bmad-method install
```

Luồng hỏi đáp giống greenfield — nhưng có **một điểm khác quan trọng**:

```text
? Enter the full path to your project directory:
👤 D:\projects\banhang

🤖 [detectInstallationState()]
   - không có .bmad-core/install-manifest.yaml
   - không có bmad-agent/
   - nhưng thư mục CÓ 42 file khác
   ⇒ state.type = 'clean' nhưng state.hasOtherFiles = true
   ⇒ vẫn cài mới, không cảnh báo gì thêm
```

⚙️ **Cơ chế**: installer phân biệt "thư mục rỗng" và "thư mục có file khác nhưng không có BMad". Cả hai đều là `clean` ⇒ cài bình thường, **không ghi đè mã nguồn của bạn**. Nó chỉ tạo `.bmad-core/` và `.claude/`.

⚠️ Nếu thư mục có `.bmad-core/` mà **thiếu** manifest (ví dụ ai đó copy tay), state là `unknown_existing` và installer sẽ hỏi: cài đè / đổi thư mục / huỷ.

Các câu hỏi còn lại — trả lời như greenfield:

| Câu hỏi | Trả lời | Vì sao |
|---|---|---|
| Chọn thành phần | ☑ BMad Agile Core System | |
| PRD sharded? | `Y` | |
| Architecture sharded? | `Y` | |
| IDE | ☑ Claude Code | |
| Web bundles? | **`y`** 🔴 | Xem 1.3 — brownfield hay cần web UI với context lớn |

Kết quả:

```text
banhang/
├── .bmad-core/        ← 71 file framework
├── .claude/commands/BMad/
├── web-bundles/       ← nếu bạn chọn y ở câu cuối
├── routes/ models/ views/ ...   ← mã nguồn CŨ, không bị chạm
└── README.md
```

## 1.2 Cấu hình `core-config.yaml` cho dự án brownfield

Mở `.bmad-core/core-config.yaml`. Giá trị mặc định vẫn dùng được, nhưng 🔴 **hai điều cần chú ý với brownfield**:

```yaml
devLoadAlwaysFiles:
  - docs/architecture/coding-standards.md      # ← CHƯA tồn tại
  - docs/architecture/tech-stack.md            #    sẽ có sau bước 5-6
  - docs/architecture/source-tree.md
```

⚠️ Ba file này **chưa tồn tại**, và với brownfield chúng sẽ được sinh ra từ tài liệu kiến trúc mà bạn viết ở [bước 5](./05-architect-brownfield.md) — chứ **không** phải từ codebase. Đừng để Dev agent chạy trước khi có chúng.

🔴 Với brownfield, `coding-standards.md` phải mô tả **chuẩn code thật của hệ thống cũ**, không phải chuẩn bạn muốn. Nếu codebase dùng `var` và callback, đừng ghi "dùng const và async/await" — trừ khi bạn quyết định modernize và ghi rõ điều đó là một phần của enhancement.

## 1.3 Điền `technical-preferences.md` — với ràng buộc của hệ thống cũ

🔴 Đây là điểm khác biệt lớn. Với greenfield bạn ghi "công nghệ tôi thích". Với brownfield bạn ghi **"công nghệ tôi bị buộc phải dùng"**:

```markdown
# User-Defined Preferred Patterns and Preferences

## RÀNG BUỘC BẮT BUỘC của hệ thống hiện có (không được đổi ở enhancement này)
- Node 16 (VPS chưa nâng được, không có Docker)
- Express 4 + Mongoose 5 + MongoDB 4.4
- View: EJS + jQuery — KHÔNG đưa React/Vue vào
- Deploy: git pull + pm2 restart — KHÔNG có CI/CD, KHÔNG có staging
- Không có TypeScript. Đừng đề xuất chuyển đổi trong phạm vi enhancement này.

## Pattern PHẢI theo (đã có trong codebase)
- Route handler dạng `router.post('/path', async (req, res) => {...})`
- Model Mongoose đặt trong models/, một file một model
- Trả lỗi dạng `res.status(4xx).json({ message: '...' })`

## Được phép thêm mới
- Jest cho test (hệ thống chưa có test nào — đây là cải thiện đáng làm)
- Biến môi trường qua dotenv (hiện đang hardcode connection string ⚠️)

## Anti-pattern CẦN TRÁNH
- KHÔNG refactor lớn ngoài phạm vi enhancement
- KHÔNG đổi shape của response API đang có (app mobile đang dùng)
- KHÔNG thêm dependency nặng — VPS chỉ có 1GB RAM
```

⚙️ **Cơ chế**: file này được `pm`, `architect`, `ux-expert`, `qa` đọc. Với brownfield nó trở thành **hàng rào bảo vệ**: nó ngăn Architect đề xuất "chuyển sang TypeScript + NestJS" — điều nghe hay nhưng sẽ giết dự án của bạn.

## 1.4 Làm phẳng codebase 🔴

Đây là bước **chỉ có ở brownfield**.

```bash
npx bmad-method flatten
```

### Diễn biến

```text
🤖 Phát hiện project root: D:\projects\banhang (tìm thấy .git, package.json)
   Terminal là TTY ⇒ xác nhận đường dẫn?

   Input:  D:\projects\banhang
   Output: D:\projects\banhang\flattened-codebase.xml
👤 [Enter để xác nhận]

   Đang phát hiện file... (dùng git ls-files vì đang trong git repo)
   Đang áp bộ lọc: .gitignore + bộ mặc định + .bmad-flattenignore (nếu có)
   Đang phát hiện file binary...
   Đang đọc và gom nội dung...
   Đang sinh XML...

📊 Completion Summary:
✅ Successfully processed 42 files into flattened-codebase.xml
📁 Output file: D:\projects\banhang\flattened-codebase.xml
📏 Total source size: 612 KB
📄 Generated XML size: 620 KB
📝 Total lines of code: 18,043
🔢 Estimated tokens: 156,204
📊 File breakdown: 39 text, 3 binary, 0 errors
```

### Loại trừ thêm file không muốn đưa vào

🔴 Với brownfield bạn thường có thứ **phải giữ trong git** nhưng **không nên đưa cho AI**: dữ liệu seed, script riêng tư, snapshot lớn. Tạo `.bmad-flattenignore` ở gốc project (cú pháp gitignore):

```text
seeds/**
scripts/deploy-prod.sh
public/vendor/**
**/*.min.js
docs/legacy-notes/**
```

Bộ lọc được áp theo thứ tự: `.gitignore` → bộ mặc định (`node_modules`, build output, cache, log, thư mục IDE, lockfile, media lớn, `.env*`, file XML đã sinh) → `.bmad-flattenignore`.

Chạy lại:

```bash
npx bmad-method flatten
# 📊 Successfully processed 31 files ... 🔢 Estimated tokens: 98,412
```

### Định dạng đầu ra

📂 `flattened-codebase.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<files>
  <file path="routes/orders.js"><![CDATA[
    const express = require('express');
    const router = express.Router();
    const Order = require('../models/Order');
    // ... 620 dòng
  ]]></file>
  <file path="models/Order.js"><![CDATA[
    // ...
  ]]></file>
  ...
</files>
```

⚙️ **Cơ chế**: mỗi file text là một `<file path="...">` với nội dung trong `<![CDATA[...]]>`. Công cụ xử lý an toàn trường hợp nội dung có chứa chuỗi `]]>` bằng cách chẻ CDATA. File binary được **đếm** trong thống kê nhưng **không** nhúng nội dung.

### Dùng file XML để làm gì

| Cách dùng | Khi nào |
|---|---|
| **Upload lên Gemini Web** (1M+ context) | Codebase lớn, muốn tiết kiệm chi phí ở pha hoạch định |
| Upload lên ChatGPT / Claude Project | Tương tự, tuỳ giới hạn nền tảng |
| **Không dùng** — để agent tự đọc file trong IDE | Codebase nhỏ/vừa, IDE có context lớn và model tốt |

🔴 `working-in-the-brownfield.md` nêu hai lối:

> **Web**: upload `flattened-codebase.xml` + `dist/agents/architect.txt` lên Gemini → `*document-project`
> **IDE**: chọn architect agent trong Claude Code → `*document-project`, agent tự đọc file
>
> Và ghi rõ: *"Its important to use quality models for this process for the best results."*

**Demo này dùng lối IDE** để liền mạch. Nhưng 156k token cho một lần phân tích là chi phí thật — với codebase 100k dòng, lối web (Gemini) sẽ rẻ hơn nhiều.

## 1.5 Chuẩn bị an toàn trước khi làm bất cứ gì 🔴

Đây không phải bước của BMad, nhưng brownfield thì bắt buộc:

```bash
# 1. Chắc chắn mã nguồn hiện tại đã được commit và tag lại
git status                      # phải sạch
git tag pre-loyalty-baseline    # mốc để rollback
git push --tags

# 2. Sao lưu database production
mongodump --uri="$MONGO_URI" --out=./backup-$(date +%F)

# 3. Ghi lại baseline hiệu năng để so sau này
#    (sẽ dùng ở bước *nfr — brownfield yêu cầu "maintain or improve current metrics")
curl -w "@curl-format.txt" -o /dev/null -s "https://banhang.local/api/orders?limit=20"
#    → ghi lại: 240ms
```

⚙️ **Cơ chế** — vì sao baseline hiệu năng quan trọng: `working-in-the-brownfield.md` định nghĩa một chuẩn brownfield mà QA sẽ cưỡng chế:

> **Performance Baselines**: Must maintain or improve current metrics

Không có số liệu "trước", `*nfr` không thể kết luận là bạn có làm chậm hệ thống hay không — nó sẽ phải đánh **CONCERNS** với ghi chú *"Target unknown"*.

## Trạng thái sau bước 1

📂

```text
banhang/
├── .bmad-core/                 ← MỚI: framework
├── .claude/commands/BMad/      ← MỚI: command IDE
├── web-bundles/                ← MỚI (nếu chọn)
├── flattened-codebase.xml      ← MỚI: 31 file, 98k token
├── .bmad-flattenignore         ← MỚI
├── routes/ models/ views/ ...  ← mã nguồn cũ, KHÔNG bị chạm
└── README.md
```

Ngoài git: tag `pre-loyalty-baseline`, dump DB, baseline hiệu năng 240ms.

## Bạn tự làm gì ở bước này

- [ ] Cài BMad — xác nhận mã nguồn cũ **không** bị chạm (`git status` chỉ thấy file mới)
- [ ] Điền `technical-preferences.md` với **ràng buộc của hệ thống cũ**, không phải mong muốn của bạn
- [ ] Chạy `flatten`, tạo `.bmad-flattenignore` để loại file không nên đưa cho AI
- [ ] **Tag git + dump DB + đo baseline hiệu năng** trước khi làm gì tiếp
- [ ] Quyết định lối làm: Web UI (rẻ, context lớn) hay IDE (liền mạch, đắt hơn)

---

[⬅ Bước trước](./00-boi-canh.md) · [Chỉ mục](./README.md) · [Bước sau: phân loại & định tuyến ➡](./02-phan-loai-va-dinh-tuyen.md)
