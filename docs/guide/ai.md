# AI: skill and MCP server

Nusa Admin ships two things that teach coding assistants how to use it correctly.

## Agent skill

`skills/nusa-admin/` is a Claude Code skill: `SKILL.md` (conventions, page recipes, do/don't) plus a generated component reference. Projects created with `create-nusa-admin` get it at `.claude/skills/nusa-admin/`, so Claude Code loads it whenever you work on admin pages.

To add it to an existing project, use the [skills](https://github.com/vercel-labs/skills) CLI:

```bash
npx skills add idlanyor/nusa-admin              # pick agents interactively
npx skills add idlanyor/nusa-admin -a claude-code -y
npx skills add idlanyor/nusa-admin -g           # for every project (user level)
```

It works with Claude Code, Cursor, Codex and the other agents the CLI supports, and records the source in
`skills-lock.json` so `npx skills update` pulls new versions. Copying `skills/nusa-admin` into `.claude/skills/` by hand works too.

## MCP server

`nusa-admin-mcp` is a Model Context Protocol server (stdio) with these tools:

| Tool | What it returns |
| --- | --- |
| `list_components` | Every component with group and one-line description (optional `group` filter). |
| `get_component` | Props (type, default, description), events, slots, and real examples with the demo route. |
| `search` | Components, composables and guide sections matching a query. |
| `get_guide` | A guide: getting-started, layout, theming, forms, tables, i18n, auth-and-menu, ai, cli. |
| `get_tokens` | The design tokens with their light-mode values. |
| `scaffold_page` | A ready-to-edit page SFC: `list`, `form`, `detail` or `dashboard`. |

Projects created with the CLI include `.mcp.json`:

```json
{ "mcpServers": { "nusa-admin": { "command": "bunx", "args": ["nusa-admin-mcp"] } } }
```

Inside this repository, `.mcp.json` points at the local build: `bun packages/mcp/src/server.ts`.

## llms.txt

The docs site serves `/llms.txt` (an index) and `/llms-full.txt` (everything in one file) for tools that read those.
