/**
 * Copies the parts of the repo the CLI ships: the full demo, the demo pages the starter reuses,
 * and the AI skill. Run before publishing (and by the tests) so templates never drift.
 */
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'

const here = resolve(import.meta.dirname, '..')
const repo = resolve(here, '../..')
const t = (...p: string[]) => join(here, 'templates', ...p)
const copy = (from: string, to: string) => {
  mkdirSync(dirname(to), { recursive: true })
  cpSync(from, to, { recursive: true })
}

// full = the demo app as-is
rmSync(t('full'), { recursive: true, force: true })
copy(join(repo, 'apps/demo/src'), t('full/src'))
copy(join(repo, 'apps/demo/index.html'), t('full/index.html'))

// starter reuses a few self-contained demo files
for (const f of ['auth.ts', 'pages/Users.vue', 'pages/Settings.vue', 'pages/auth/Login.vue', 'pages/auth/Register.vue', 'pages/auth/ForgotPassword.vue', 'pages/auth/LockScreen.vue', 'pages/errors/NotFound.vue', 'pages/errors/Forbidden.vue']) {
  copy(join(repo, 'apps/demo/src', f), t('starter/src', f))
}

// AI: skill + versions
rmSync(t('ai'), { recursive: true, force: true })
copy(join(repo, 'skills/nusa-admin'), t('ai/skill'))
const kit = JSON.parse(readFileSync(join(repo, 'packages/ui/package.json'), 'utf8'))
const mcp = JSON.parse(readFileSync(join(repo, 'packages/mcp/package.json'), 'utf8'))
writeFileSync(t('versions.json'), JSON.stringify({ 'nusa-admin': `^${kit.version}`, 'nusa-admin-mcp': `^${mcp.version}` }, null, 2) + '\n')
console.log('templates synced → packages/create-nusa-admin/templates')
