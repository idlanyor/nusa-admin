# create-nusa-admin

Create a Vue 3 + Vite admin app with [Nusa Admin](https://www.npmjs.com/package/nusa-admin).

```bash
bun create nusa-admin my-admin
# or
npm create nusa-admin@latest my-admin
```

| Option | Meaning |
| --- | --- |
| `--template starter \| full` | `starter`: shell, dashboard, users CRUD, settings, auth and error pages. `full`: the complete demo (65 routes). |
| `--name <package-name>` | `package.json` name (default: the folder name) |
| `--no-ai` | Skip the Claude Code skill, `.mcp.json` and `AGENTS.md` |
| `--install` | Install dependencies after creating |
| `--force` | Allow a non-empty folder |
| `--yes`, `-y` | Accept defaults without asking |

Then `cd my-admin && npm install && npm run dev`, and sign in with any email and password (pick a role to try the access rules).

No dependencies; runs on Node 18+ and Bun.

## License

MIT © 2026 Roynaldi (Antidonasi Creative) — https://roynaldi.website
