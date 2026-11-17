# __NAME__

Admin app built with [Nusa Admin](https://www.npmjs.com/package/nusa-admin) (Vue 3 + Vite).

```bash
__PM__ install
__PM__ run dev        # http://localhost:5173 — sign in with any email/password and pick a role
__PM__ run build
__PM__ run typecheck
```

- Pages live in `src/pages/`, routes in `src/router.ts`, the sidebar/top-nav/command-palette menu in `src/menu.ts`.
- `src/auth.ts` is a mock session (roles: admin, editor, viewer) — replace `login()` with your API.
- Theme, layout and language options: the gear button (bottom right) or `createNusaAdmin({...})` in `src/main.ts`.

## AI assistants

- `.claude/skills/nusa-admin/` teaches Claude Code the kit's components and conventions.
- `.mcp.json` registers the `nusa-admin` MCP server (component API, examples, guides, page scaffolds).
- `AGENTS.md` points other coding agents at the same material.
