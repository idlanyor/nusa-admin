# nusa-admin-mcp

[Model Context Protocol](https://modelcontextprotocol.io) server (stdio) that teaches AI coding assistants the [`nusa-admin`](https://www.npmjs.com/package/nusa-admin) Vue kit: component APIs generated from the source, real usage examples, guides, design tokens and page scaffolds.

## Use

Claude Code — add to your project's `.mcp.json` (apps created with `create-nusa-admin` already have it):

```json
{ "mcpServers": { "nusa-admin": { "command": "npx", "args": ["-y", "nusa-admin-mcp"] } } }
```

Any MCP client: run `npx -y nusa-admin-mcp` as a stdio server. Requires Node 18+.

## Tools

| Tool | Returns |
| --- | --- |
| `list_components` | All components with group and description (optional `group` filter) |
| `get_component` | Props (type, default, description), events, slots, real examples with the demo route |
| `search` | Matching components, composables/helpers and guide sections |
| `get_guide` | getting-started, layout, theming, forms, tables, i18n, auth-and-menu, cli, ai — or `api` |
| `get_tokens` | CSS design tokens with their values |
| `scaffold_page` | A page SFC (`list`, `form`, `detail`, `dashboard`) that type-checks against the kit |

Guides and component docs are also exposed as resources (`nusa-admin://guide/<slug>`, `nusa-admin://component/<Name>`).

## AI skill

```bash
npx skills add idlanyor/nusa-admin
```

Installs the Nusa Admin agent skill (components, page recipes, conventions) for Claude Code, Cursor, Codex and other agents.

## License

MIT © 2026 Roynaldi (Antidonasi Creative) — https://roynaldi.website
