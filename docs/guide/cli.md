# CLI: create-nusa-admin

```bash
bun create nusa-admin my-admin
# or
npm create nusa-admin@latest my-admin
```

Options (all optional; you're asked for anything missing when running in a terminal):

| Flag | Meaning |
| --- | --- |
| `--template starter \| full` | `starter`: shell, dashboard, users CRUD, sign-in, 404. `full`: the complete demo (74 routes). |
| `--name <package-name>` | `package.json` name (default: the folder name). |
| `--no-ai` | Skip the agent skill (`.claude/skills/nusa-admin`) and `.mcp.json`. |
| `--install` | Run `bun install` (or npm) after creating. |
| `--kit <path>` | Use a local checkout of the kit (`file:` dependency) instead of the npm version — for kit development. |
| `--yes` | Accept defaults without asking. |

The generated project is a plain Vite + Vue app with `dev`, `build`, `preview` and `typecheck` scripts. Everything it needs comes from the `nusa-admin` package; nothing is copied from the kit's source.
