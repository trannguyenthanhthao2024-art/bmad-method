[⬅ Bước trước](./00-boi-canh.md) · [Chỉ mục](./README.md) · [Bước sau ➡](./02-analyst-brief.md)

# Bước 1 — Cài framework vào project

## Lệnh

```bash
cd D:\projects\chitieu
npx bmad-method install
```

## Diễn biến

```text
██████╗ ███╗   ███╗ █████╗ ██████╗       ███╗   ███╗███████╗████████╗██╗  ██╗ ██████╗ ██████╗
██╔══██╗████╗ ████║██╔══██╗██╔══██╗      ████╗ ████║██╔════╝╚══██╔══╝██║  ██║██╔═══██╗██╔══██╗
...

🚀 Universal AI Agent Framework for Any Domain
✨ Installer v4.44.2

⚠️  You are installing BMad v4 (stable but frozen)
   v4 receives critical patches only - no new features

💡 Want the latest features? Try BMad v6 Alpha:
   npx bmad-method@alpha install
```

### Câu hỏi 1 — Thư mục

```text
? Enter the full path to your project directory where BMad should be installed:
👤 D:\projects\chitieu
```

Installer chạy `detectInstallationState()`:
- không có `.bmad-core/install-manifest.yaml` → không phải v4 cũ
- không có `bmad-agent/` → không phải v3
- thư mục rỗng → **`state.type = 'clean'`** ⇒ cài mới

### Câu hỏi 2 — Chọn thành phần

```text
? Select what to install/update (use space to select, enter to continue):
❯◉ BMad Agile Core System (v4.44.2) .bmad-core
 ◯ Godot Game Dev Pack (v1.0.0) .bmad-godot-game-dev
 ◯ Creative Writing Studio (v1.1.1) .bmad-creative-writing
 ◯ ...

👤 [chỉ tick BMad Agile Core System] → Enter
```

### Câu hỏi 3 & 4 — Sharding

```text
📋 Document Organization Settings

? Will the PRD be sharded into multiple files? (Y/n)
👤 Y

? Will the architecture documentation be sharded into multiple files? (Y/n)
👤 Y
```

⚠️ Nếu bạn trả lời **`n`** cho câu về architecture, installer sẽ in cảnh báo dài về `devLoadAlwaysFiles` và **bắt bạn xác nhận**; không xác nhận thì huỷ cài. Lý do: Dev agent luôn nạp `coding-standards.md`, `tech-stack.md`, `source-tree.md` — không shard thì ba file đó không tồn tại.

### Câu hỏi 5 — IDE

```text
🛠️  IDE Configuration
 ⚠️  IMPORTANT: This is a MULTISELECT! Use SPACEBAR to toggle each IDE!
🔸 Use arrow keys to navigate
🔸 Use SPACEBAR to select/deselect IDEs
🔸 Press ENTER when finished selecting

? Which IDE(s) do you want to configure?
 ◯ Cursor
❯◉ Claude Code
 ◯ iFlow CLI
 ◯ Windsurf
 ... (16 lựa chọn)

👤 [SPACEBAR trên Claude Code] → Enter
```

⚠️ **Cạm bẫy phổ biến nhất**: nhấn Enter mà quên SPACEBAR ⇒ không chọn IDE nào. Installer sẽ hỏi lại xác nhận: *"You have NOT selected any IDEs… Is this correct?"* → trả lời `n` để quay lại.

### Câu hỏi 6 — Web bundle

```text
? Would you like to include pre-built web bundles? (y/N)
👤 N
```

*(Chọn `N` vì demo làm trong IDE. Nếu muốn hoạch định trên Gemini/ChatGPT thì chọn `y` rồi chọn `team-fullstack`.)*

## Kết quả trên đĩa

📂 Sau khi cài:

```text
chitieu/
├── .bmad-core/
│   ├── agents/                     10 file: analyst · pm · architect · ux-expert
│   │                               po · sm · dev · qa · bmad-master · bmad-orchestrator
│   ├── agent-teams/                4 file .yaml
│   ├── workflows/                  6 file .yaml
│   ├── tasks/                      23 file (21 core + create-doc + execute-checklist)
│   ├── templates/                  13 file .yaml
│   ├── checklists/                 6 file .md
│   ├── data/                       6 file .md
│   ├── utils/                      bmad-doc-template.md · workflow-management.md
│   ├── core-config.yaml            ← BẢN ĐỒ dự án
│   ├── install-manifest.yaml       ← 71 file + hash SHA-256 (16 hex)
│   ├── user-guide.md
│   ├── enhanced-ide-development-workflow.md
│   └── working-in-the-brownfield.md
└── .claude/
    └── commands/
        └── BMad/
            ├── agents/             10 file .md  → tạo ra /analyst, /pm, /dev…
            └── tasks/              23 file .md  → tạo ra /create-doc, /shard-doc…
```

## Thông báo kết thúc

```text
✓ BMad Method installed successfully!

To use BMad agents in Claude Code:
# 1. Type /agent-name (e.g., "/dev", "/pm", "/architect")
# 2. Claude will switch to that agent's persona

🎯 Installation Summary:
✓ .bmad-core framework installed with all agents and workflows
✓ IDE rules and configurations set up for: Claude Code

📖 IMPORTANT: Please read the user guide at docs/user-guide.md
```

## Kiểm tra sau khi cài

```bash
npx bmad-method status
```

Ba việc bạn nên tự kiểm:

```bash
# 1. Manifest có tồn tại và đúng version?
cat .bmad-core/install-manifest.yaml | head -5
#   version: 4.44.2
#   installed_at: '2026-08-10T...'
#   install_type: full
#   ides_setup: [claude-code]

# 2. Không còn placeholder {root} nào chưa thay?
grep -r "{root}" .bmad-core/ | wc -l     # phải ra 0

# 3. Command của IDE đã được sinh?
ls .claude/commands/BMad/agents/          # phải thấy 10 file
```

## Nội dung `core-config.yaml` sau khi cài

```yaml
markdownExploder: true
qa:
  qaLocation: docs/qa
prd:
  prdFile: docs/prd.md
  prdVersion: v4
  prdSharded: true                    # ← từ câu trả lời của bạn
  prdShardedLocation: docs/prd
  epicFilePattern: epic-{n}*.md
architecture:
  architectureFile: docs/architecture.md
  architectureVersion: v4
  architectureSharded: true           # ← từ câu trả lời của bạn
  architectureShardedLocation: docs/architecture
customTechnicalDocuments: null
devLoadAlwaysFiles:
  - docs/architecture/coding-standards.md      # ← 3 file này CHƯA tồn tại
  - docs/architecture/tech-stack.md            #    sẽ có sau khi shard ở bước 6
  - docs/architecture/source-tree.md
devDebugLog: .ai/debug-log.md
devStoryLocation: docs/stories
slashPrefix: BMad
```

## Việc bạn nên làm ngay (nhưng hầu hết mọi người bỏ qua)

Mở `.bmad-core/data/technical-preferences.md` — nội dung mặc định chỉ là:

```markdown
# User-Defined Preferred Patterns and Preferences

None Listed
```

Điền sở thích của bạn vào. Với demo ChiTieu:

```markdown
# User-Defined Preferred Patterns and Preferences

## Stack ưa dùng
- Frontend: Next.js (App Router) + TypeScript + Tailwind CSS
- Backend: Next.js Route Handlers (không tách service riêng cho dự án nhỏ)
- DB + Auth: Supabase (Postgres + Supabase Auth)
- Hosting: Vercel
- Test: Vitest (unit/integration) + Playwright (e2e)

## Pattern ưa dùng
- Server Components mặc định, Client Component chỉ khi cần tương tác
- Validate input bằng Zod ở cả client và server
- Không dùng ORM nặng; dùng Supabase client + SQL thuần khi cần

## Anti-pattern CẦN TRÁNH
- Không dùng Redux cho app nhỏ
- Không tự viết auth từ đầu
- Không hardcode secret; luôn qua biến môi trường
```

**Vì sao quan trọng**: file này được `pm`, `architect`, `ux-expert`, `qa` đọc. Điền nó ⇒ Architect sẽ chọn đúng stack bạn muốn ở bước 5 thay vì phải hỏi bạn 10 câu.

---

⚙️ **Cơ chế bên dưới**

| Điều gì xảy ra | Ở đâu |
|---|---|
| Toàn bộ `bmad-core/` được copy vào `.bmad-core/`, mọi `{root}` thay bằng `.bmad-core` | `installer.js` → `copyDirectoryWithRootReplacement()` |
| `common/tasks/` và `common/utils/` được **gộp vào** `.bmad-core/tasks/` và `.bmad-core/utils/` | `copyCommonItems()` |
| 3 file tài liệu (`user-guide`, `enhanced-ide-development-workflow`, `working-in-the-brownfield`) copy vào `.bmad-core/` | `copyDocsItems()` |
| Với mỗi agent + task, sinh một command file có header `# /dev Command` + *"adopt the following agent persona:"* + nội dung agent | `ide-setup.js` → `setupClaudeCodeForPackage()` |
| Ghi `prdSharded`/`architectureSharded` theo câu trả lời của bạn | `file-manager.js` → `modifyCoreConfig()` |
| Ghi manifest: mỗi file kèm hash SHA-256 rút gọn 16 hex | `createManifest()` |

⚠️ File cấu hình IDE (`.claude/**`) **không** nằm trong manifest ⇒ chức năng repair không phục hồi chúng. Nếu hỏng, chạy lại `npx bmad-method install -f -i claude-code`.

---

[⬅ Bước trước](./00-boi-canh.md) · [Chỉ mục](./README.md) · [Bước sau: Analyst tạo Project Brief ➡](./02-analyst-brief.md)
