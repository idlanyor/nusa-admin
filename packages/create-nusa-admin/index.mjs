#!/usr/bin/env node
/**
 * create-nusa-admin — scaffold a Vue 3 + Vite admin app with Nusa Admin.
 *   bun create nusa-admin my-admin [--template starter|full] [--name pkg] [--no-ai] [--install] [--kit <path>] [--yes]
 * No dependencies: runs on Node ≥ 18 and Bun.
 */
import { spawnSync } from 'node:child_process'
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { basename, dirname, join, relative, resolve } from 'node:path'
import { createInterface } from 'node:readline/promises'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const tpl = (...p) => join(here, 'templates', ...p)
const bold = (s) => (process.stdout.isTTY ? `\x1b[1m${s}\x1b[22m` : s)
const dim = (s) => (process.stdout.isTTY ? `\x1b[2m${s}\x1b[22m` : s)
const green = (s) => (process.stdout.isTTY ? `\x1b[32m${s}\x1b[39m` : s)
const fail = (msg) => {
  console.error(`\n✖ ${msg}\n`)
  process.exit(1)
}

// ---- args ----
const HELP = `Usage: create-nusa-admin [dir] [options]

Options:
  --template <starter|full>  starter: shell, dashboard, users, settings, auth, 403/404
                             full: the complete demo (65 routes)
  --name <package-name>      package.json name (default: folder name)
  --no-ai                    skip the Claude Code skill, .mcp.json and AGENTS.md
  --install                  install dependencies after creating
  --kit <path>               depend on a local nusa-admin checkout (file:) instead of npm
  --force                    allow a non-empty target folder
  --yes, -y                  accept defaults, don't ask
  --help, -h                 show this help`

const args = { _: [] }
const argv = process.argv.slice(2)
for (let i = 0; i < argv.length; i++) {
  const a = argv[i]
  if (a === '--help' || a === '-h') (console.log(HELP), process.exit(0))
  else if (a === '--yes' || a === '-y') args.yes = true
  else if (a === '--no-ai') args.ai = false
  else if (a === '--install') args.install = true
  else if (a === '--force') args.force = true
  else if (['--template', '--name', '--kit'].includes(a)) {
    const v = argv[++i]
    if (!v || v.startsWith('--')) fail(`${a} needs a value`)
    args[a.slice(2)] = v
  } else if (a.startsWith('--template=') || a.startsWith('--name=') || a.startsWith('--kit=')) {
    const [k, v] = a.slice(2).split('=')
    args[k] = v
  } else if (a.startsWith('-')) fail(`Unknown option ${a}\n\n${HELP}`)
  else args._.push(a)
}

const interactive = process.stdin.isTTY && !args.yes
const rl = interactive ? createInterface({ input: process.stdin, output: process.stdout }) : null
async function ask(question, fallback) {
  if (!rl) return fallback
  const answer = (await rl.question(`${question} ${dim(`(${fallback})`)} `)).trim()
  return answer || fallback
}

const validName = (n) => /^(?:@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(n) && n.length <= 214
const toName = (s) => s.toLowerCase().replace(/[^a-z0-9-._~]+/g, '-').replace(/^[-._]+|-+$/g, '') || 'nusa-admin-app'

console.log(`\n${bold('Nusa Admin')} ${dim('— Vue 3 admin template')}\n`)

const dirArg = args._[0] ?? (await ask('Project folder:', 'nusa-admin-app'))
const target = resolve(process.cwd(), dirArg)
if (existsSync(target)) {
  if (!statSync(target).isDirectory()) fail(`${dirArg} exists and is not a folder`)
  const entries = readdirSync(target).filter((f) => f !== '.git' && f !== '.DS_Store')
  if (entries.length && !args.force) fail(`${dirArg} is not empty. Use another folder or pass --force.`)
}

let template = args.template ?? (await ask('Template — starter or full:', 'starter'))
if (!['starter', 'full'].includes(template)) fail(`Unknown template "${template}" (use starter or full)`)
const name = args.name ?? toName(basename(target))
if (!validName(name)) fail(`"${name}" is not a valid package name`)
const ai = args.ai ?? ((await ask('Add AI assistant support (Claude Code skill + MCP)? y/n', 'y')).toLowerCase().startsWith('y'))
const title = basename(target).replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
rl?.close()

// ---- package manager ----
const usingBun = !!process.versions.bun || /bun/.test(process.env.npm_config_user_agent ?? '')
const pm = usingBun ? 'bun' : (process.env.npm_config_user_agent ?? '').split('/')[0] || 'npm'

// ---- files ----
mkdirSync(target, { recursive: true })
const fill = (text) => text.replaceAll('__TITLE__', title).replaceAll('__NAME__', name).replaceAll('__PM__', pm)
function copyDir(from, to) {
  mkdirSync(to, { recursive: true })
  for (const entry of readdirSync(from)) {
    const src = join(from, entry)
    const dest = join(to, entry === 'gitignore' ? '.gitignore' : entry)
    if (statSync(src).isDirectory()) {
      mkdirSync(dest, { recursive: true })
      copyDir(src, dest)
    } else if (/\.(vue|ts|html|md|json|css)$/.test(entry) || entry === 'gitignore') {
      writeFileSync(dest, fill(readFileSync(src, 'utf8')))
    } else cpSync(src, dest)
  }
}
if (!existsSync(tpl(template, 'src'))) fail(`Template files are missing (${relative(process.cwd(), tpl(template))}). Run "bun run sync" in packages/create-nusa-admin.`)
copyDir(tpl('base'), target)
copyDir(tpl(template), target)
if (template === 'full') {
  // The demo's HTML has its own title; make it the project's.
  const html = join(target, 'index.html')
  writeFileSync(html, readFileSync(html, 'utf8').replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`))
}

// ---- package.json ----
const versions = JSON.parse(readFileSync(tpl('versions.json'), 'utf8'))
const kitDep = args.kit ? `file:${relative(target, resolve(process.cwd(), args.kit)).replaceAll('\\', '/')}` : versions['nusa-admin']
const pkg = {
  name,
  private: true,
  version: '0.1.0',
  type: 'module',
  scripts: {
    dev: 'vite',
    build: 'vite build',
    preview: 'vite preview',
    typecheck: 'vue-tsc --noEmit -p tsconfig.json',
  },
  dependencies: {
    'lucide-vue-next': '^1.0.0',
    'nusa-admin': kitDep,
    vue: '^3.5.0',
    'vue-router': '^5.0.0',
    ...(template === 'full' ? { 'topojson-client': '^3.1.0', 'world-atlas': '^2.0.2' } : {}),
  },
  devDependencies: {
    '@types/node': '^24.0.0',
    '@vitejs/plugin-vue': '^6.0.0',
    typescript: '^6.0.0',
    vite: '^8.0.0',
    'vue-tsc': '^3.3.0',
    ...(template === 'full' ? { '@types/topojson-client': '^3.1.0' } : {}),
  },
}
writeFileSync(join(target, 'package.json'), JSON.stringify(pkg, null, 2) + '\n')

// ---- AI assistants ----
if (ai) {
  copyDir(tpl('ai/skill'), join(target, '.claude/skills/nusa-admin'))
  const mcpCmd = args.kit
    ? { command: 'node', args: [relative(target, resolve(process.cwd(), args.kit, '../mcp/dist/server.js')).replaceAll('\\', '/')] }
    : { command: 'npx', args: ['-y', `nusa-admin-mcp@${versions['nusa-admin-mcp']}`] }
  writeFileSync(join(target, '.mcp.json'), JSON.stringify({ mcpServers: { 'nusa-admin': mcpCmd } }, null, 2) + '\n')
  writeFileSync(
    join(target, 'AGENTS.md'),
    `# Notes for coding agents\n\nThis is a Vue 3 + Vite admin app built on the \`nusa-admin\` component kit.\n\n` +
      `- Read \`.claude/skills/nusa-admin/SKILL.md\` before building pages; component APIs are in \`.claude/skills/nusa-admin/references/\`.\n` +
      `- If the \`nusa-admin\` MCP server is available (\`.mcp.json\`), use \`get_component\`, \`search\` and \`scaffold_page\`.\n` +
      `- Pages: \`src/pages\`; routes: \`src/router.ts\`; menu (sidebar, top nav, command palette): \`src/menu.ts\`; session/roles: \`src/auth.ts\`.\n` +
      `- Check your work with \`${pm} run typecheck\`.\n`,
  )
}

// ---- install ----
let installed = false
if (args.install) {
  console.log(`\nInstalling with ${pm}…`)
  const res = spawnSync(pm, ['install'], { cwd: target, stdio: 'inherit', shell: process.platform === 'win32' })
  if (res.status !== 0) console.warn(`\n! ${pm} install failed — run it yourself inside ${dirArg}.`)
  else installed = true
}

const rel = relative(process.cwd(), target) || '.'
console.log(`\n${green('✔')} Created ${bold(name)} (${template}) in ${rel}${ai ? ' — with AI skill + MCP' : ''}\n`)
console.log('Next:')
if (rel !== '.') console.log(`  cd ${rel.includes(' ') ? `"${rel}"` : rel}`)
if (!installed) console.log(`  ${pm} install`)
console.log(`  ${pm} run dev\n`)
console.log(dim('Sign in with any email and password, and pick a role to try the access rules.\n'))
