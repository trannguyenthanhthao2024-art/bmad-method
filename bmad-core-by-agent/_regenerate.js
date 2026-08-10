#!/usr/bin/env node
/* Sắp xếp bmad-core theo agent: copy (không di chuyển), nhân bản file dùng chung. */
const fs = require('node:fs');
const path = require('node:path');

const ROOT = process.argv[2];
const SRC_CORE = path.join(ROOT, 'bmad-core');
const SRC_COMMON = path.join(ROOT, 'common');
const OUT = path.join(ROOT, 'bmad-core-by-agent');

// Tên thư mục đích cho từng agent
const AGENT_DIRS = {
  analyst: '01-analyst-mary-business-analyst',
  pm: '02-pm-john-product-manager',
  architect: '03-architect-winston',
  'ux-expert': '04-ux-expert-sally',
  po: '05-po-sarah-product-owner',
  sm: '06-sm-bob-scrum-master',
  dev: '07-dev-james-developer',
  qa: '08-qa-quinn-test-architect',
  'bmad-master': '09-bmad-master',
  'bmad-orchestrator': '10-bmad-orchestrator',
};

// Bổ sung thủ công: file thuộc chức năng của agent nhưng KHÔNG được khai báo trong dependencies
const EXTRAS = {
  qa: { data: ['test-levels-framework.md', 'test-priorities-matrix.md'] },
  sm: { tasks: ['create-brownfield-story.md'] },
  pm: { tasks: ['create-brownfield-story.md', 'shard-doc_vn.md'] },
  po: { tasks: ['shard-doc_vn.md'] },
  'bmad-master': { tasks: ['shard-doc_vn.md'] },
};

// Biến thể/bản dịch của file agent: copy thêm vào cùng thư mục agent gốc
const AGENT_VARIANTS = {
  analyst: ['analyst_vn.md'],
  pm: ['pm_vn.md'],
};

const DEP_TYPES = ['tasks', 'templates', 'checklists', 'data', 'utils', 'workflows'];

function rmrf(p) { fs.rmSync(p, { recursive: true, force: true }); }
function mkdirp(p) { fs.mkdirSync(p, { recursive: true }); }

/** Trích block dependencies từ file agent (parse theo dòng, không cần js-yaml) */
function extractDeps(agentContent) {
  const yamlMatch = agentContent.match(/```ya?ml\n([\s\S]*?)\n```/);
  if (!yamlMatch) throw new Error('không tìm thấy block YAML');
  const lines = yamlMatch[1].split('\n');
  const deps = {};
  let inDeps = false, currentType = null;
  for (const line of lines) {
    if (/^dependencies:\s*$/.test(line)) { inDeps = true; continue; }
    if (!inDeps) continue;
    if (/^\S/.test(line) && !/^dependencies:/.test(line)) break; // hết block dependencies
    const typeMatch = line.match(/^ {2}(\w+):\s*$/);
    if (typeMatch) { currentType = typeMatch[1]; deps[currentType] = []; continue; }
    const itemMatch = line.match(/^ {4}- (.+?)\s*$/);
    if (itemMatch && currentType) deps[currentType].push(itemMatch[1]);
  }
  return deps;
}

/** Tìm file tài nguyên: bmad-core/<type>/<name> rồi common/<type>/<name> */
function resolveResource(type, name) {
  const candidates = [path.join(SRC_CORE, type, name), path.join(SRC_COMMON, type, name)];
  for (const c of candidates) if (fs.existsSync(c)) return c;
  return null;
}

// ---------- Bắt đầu ----------
// Chỉ xoá các THƯ MỤC CON (giữ lại README.md và _regenerate.js ở cấp gốc)
mkdirp(OUT);
for (const e of fs.readdirSync(OUT, { withFileTypes: true })) {
  if (e.isDirectory()) rmrf(path.join(OUT, e.name));
}

const copiedFrom = new Map();   // đường dẫn nguồn -> [đích...]
const missing = [];
let copyCount = 0;

function copyInto(srcAbs, destDir, destName) {
  mkdirp(destDir);
  const destAbs = path.join(destDir, destName);
  fs.copyFileSync(srcAbs, destAbs);
  copyCount++;
  const rel = path.relative(ROOT, srcAbs).split(path.sep).join('/');
  if (!copiedFrom.has(rel)) copiedFrom.set(rel, []);
  copiedFrom.get(rel).push(path.relative(OUT, destAbs).split(path.sep).join('/'));
}

// --- 00-shared: tài nguyên không thuộc riêng agent nào ---
const sharedDir = path.join(OUT, '00-shared-dung-chung');
copyInto(path.join(SRC_CORE, 'core-config.yaml'), sharedDir, 'core-config.yaml');

for (const f of fs.readdirSync(path.join(SRC_CORE, 'agent-teams')))
  copyInto(path.join(SRC_CORE, 'agent-teams', f), path.join(sharedDir, 'agent-teams'), f);

for (const f of fs.readdirSync(path.join(SRC_CORE, 'workflows')))
  copyInto(path.join(SRC_CORE, 'workflows', f), path.join(sharedDir, 'workflows'), f);

for (const f of fs.readdirSync(path.join(SRC_COMMON, 'utils')))
  copyInto(path.join(SRC_COMMON, 'utils', f), path.join(sharedDir, 'utils'), f);

// --- Từng agent ---
const perAgentReport = [];
for (const [agentId, dirName] of Object.entries(AGENT_DIRS)) {
  const agentSrc = path.join(SRC_CORE, 'agents', `${agentId}.md`);
  const agentDir = path.join(OUT, dirName);
  copyInto(agentSrc, agentDir, `AGENT-${agentId}.md`);

  // Bản dịch / biến thể của cùng agent
  for (const variant of AGENT_VARIANTS[agentId] || []) {
    const vSrc = path.join(SRC_CORE, 'agents', variant);
    if (fs.existsSync(vSrc)) copyInto(vSrc, agentDir, `AGENT-${variant}`);
    else missing.push(`${agentId}: KHÔNG tìm thấy biến thể agents/${variant}`);
  }

  const deps = extractDeps(fs.readFileSync(agentSrc, 'utf8'));
  const extras = EXTRAS[agentId] || {};
  const allTypes = new Set([...Object.keys(deps), ...Object.keys(extras)]);
  const counts = {};

  for (const type of allTypes) {
    if (!DEP_TYPES.includes(type)) { missing.push(`${agentId}: loại dependency lạ "${type}"`); continue; }
    const declared = deps[type] || [];
    const added = extras[type] || [];
    const names = [...new Set([...declared, ...added])];
    counts[type] = names.length;
    for (const name of names) {
      const srcAbs = resolveResource(type, name);
      if (!srcAbs) { missing.push(`${agentId}: KHÔNG tìm thấy ${type}/${name}`); continue; }
      copyInto(srcAbs, path.join(agentDir, type), name);
    }
  }
  perAgentReport.push({ agentId, dirName, counts, extras });
}

// --- Kiểm tra phủ: mọi file nguồn phải xuất hiện ít nhất 1 lần ---
function listSourceFiles(dir) {
  const out = [];
  (function walk(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p); else out.push(p);
    }
  })(dir);
  return out;
}

const sourceFiles = [...listSourceFiles(SRC_CORE), ...listSourceFiles(SRC_COMMON)]
  .map((p) => path.relative(ROOT, p).split(path.sep).join('/'));

const notCopied = sourceFiles.filter((f) => !copiedFrom.has(f));

// --- Xuất báo cáo ---
const report = {
  tongFileNguon: sourceFiles.length,
  tongLuotCopy: copyCount,
  soFileNguonDaPhu: copiedFrom.size,
  soFileChuaPhu: notCopied.length,
  fileChuaPhu: notCopied,
  loi: missing,
  perAgent: perAgentReport,
  nhanBan: [...copiedFrom.entries()]
    .filter(([, dests]) => dests.length > 1)
    .map(([src, dests]) => ({ src, soBanSao: dests.length, dests }))
    .sort((a, b) => b.soBanSao - a.soBanSao),
};

fs.writeFileSync(
  path.join(process.env.TMPDIR || require('node:os').tmpdir(), 'organize-report.json'),
  JSON.stringify(report, null, 2),
);

console.log(`Tổng file nguồn (bmad-core + common): ${report.tongFileNguon}`);
console.log(`Tổng lượt copy:                        ${report.tongLuotCopy}`);
console.log(`File nguồn đã được phủ:                ${report.soFileNguonDaPhu}`);
console.log(`File nguồn CHƯA phủ:                   ${report.soFileChuaPhu}`);
if (notCopied.length) { console.log('\n!! CHƯA PHỦ:'); for (const f of notCopied) console.log('   - ' + f); }
if (missing.length) { console.log('\n!! LỖI:'); for (const m of missing) console.log('   - ' + m); }
console.log('\n--- Số tài nguyên theo agent ---');
for (const a of perAgentReport) {
  const c = Object.entries(a.counts).map(([k, v]) => `${k}:${v}`).join(' · ');
  console.log(`${a.dirName.padEnd(38)} ${c}`);
}
console.log('\n--- File được nhân bản nhiều nhất ---');
for (const d of report.nhanBan.slice(0, 12)) console.log(`${String(d.soBanSao).padStart(2)}× ${d.src}`);
console.log(`\nReport JSON: ${path.join(require('node:os').tmpdir(), 'organize-report.json')}`);
