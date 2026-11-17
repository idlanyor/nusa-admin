import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

const cli = resolve(import.meta.dirname, '../index.mjs')
const kit = resolve(import.meta.dirname, '../../ui')
const work = join(tmpdir(), `create-nusa-admin-test-${process.pid}`)
const run = (cmd: string, args: string[], cwd = work) => {
  const r = spawnSync(cmd, args, { cwd, encoding: 'utf8', env: { ...process.env, CI: '1' } })
  return { code: r.status, out: `${r.stdout}${r.stderr}` }
}

beforeAll(() => {
  rmSync(work, { recursive: true, force: true })
  mkdirSync(work, { recursive: true })
  expect(run('bun', ['scripts/sync-templates.ts'], resolve(import.meta.dirname, '..')).code).toBe(0)
})
afterAll(() => rmSync(work, { recursive: true, force: true }))

describe('create-nusa-admin', () => {
  it('prints help', () => {
    const r = run('node', [cli, '--help'])
    expect(r.code).toBe(0)
    expect(r.out).toContain('--template <starter|full>')
  })

  it('refuses bad input', () => {
    expect(run('node', [cli, 'x', '--template', 'nope', '--yes']).code).toBe(1)
    expect(run('node', [cli, 'x', '--bogus']).code).toBe(1)
    mkdirSync(join(work, 'busy'))
    writeFileSync(join(work, 'busy/file.txt'), 'x')
    const busy = run('node', [cli, 'busy', '--yes'])
    expect(busy.code).toBe(1)
    expect(busy.out).toContain('not empty')
  })

  it('creates a starter with AI files, and skips them with --no-ai', () => {
    const r = run('node', [cli, 'Shop Admin', '--yes'])
    expect(r.code).toBe(0)
    expect(r.out).toContain('Created shop-admin (starter)')
    const dir = join(work, 'Shop Admin')
    const pkg = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'))
    expect(pkg.name).toBe('shop-admin')
    expect(pkg.dependencies['nusa-admin']).toMatch(/^\^\d/)
    expect(readFileSync(join(dir, 'index.html'), 'utf8')).toContain('<title>Shop Admin</title>')
    expect(readFileSync(join(dir, 'src/layouts/AppShell.vue'), 'utf8')).toContain('brand="Shop Admin"')
    expect(existsSync(join(dir, '.gitignore'))).toBe(true)
    expect(readFileSync(join(dir, '.claude/skills/nusa-admin/SKILL.md'), 'utf8')).toMatch(/^---\nname: nusa-admin/)
    expect(existsSync(join(dir, '.claude/skills/nusa-admin/references/components.md'))).toBe(true)
    expect(JSON.parse(readFileSync(join(dir, '.mcp.json'), 'utf8')).mcpServers['nusa-admin'].args.join(' ')).toContain('nusa-admin-mcp@')
    expect(readFileSync(join(dir, 'AGENTS.md'), 'utf8')).toContain('SKILL.md')

    expect(run('node', [cli, 'plain', '--yes', '--no-ai']).code).toBe(0)
    expect(existsSync(join(work, 'plain/.claude'))).toBe(false)
    expect(existsSync(join(work, 'plain/.mcp.json'))).toBe(false)
  })

  for (const template of ['starter', 'full']) {
    it(`${template}: installs, type-checks and builds against the local kit`, () => {
      const name = `app-${template}`
      const r = run('node', [cli, name, '--template', template, '--kit', kit, '--yes'])
      expect(r.code, r.out).toBe(0)
      const dir = join(work, name)
      const mcp = JSON.parse(readFileSync(join(dir, '.mcp.json'), 'utf8')).mcpServers['nusa-admin']
      expect(mcp.command).toBe('node')
      expect(existsSync(resolve(dir, mcp.args[0])), 'local MCP server path').toBe(true)
      expect(run('bun', ['install'], dir).code).toBe(0)
      const tc = run('bun', ['run', 'typecheck'], dir)
      expect(tc.code, tc.out).toBe(0)
      const build = run('bun', ['run', 'build'], dir)
      expect(build.code, build.out).toBe(0)
      expect(existsSync(join(dir, 'dist/index.html'))).toBe(true)
    }, 240_000)
  }
})
