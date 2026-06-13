# Repo guide (for agents editing this repo)

This repo packages **Pixil** as Claude Code skills. It is a plugin/marketplace repo, not an app.

## Layout

```
.claude-plugin/marketplace.json   marketplace + plugin + skills manifest
.claude-plugin/plugin.json        plugin metadata
pixil-generate/SKILL.md           core image/video/edit/i2v/lipsync skill
pixil-generate/references/*.md    model catalog, prompt tips, troubleshooting
pixil-ads/SKILL.md                branded ad creatives skill
scripts/pixil.mjs                 zero-dep Node MCP client (the "CLI" skills wrap)
```

## Rules

- **No secrets.** Never commit a `pixil_` token or any key. Auth is the user's `PIXIL_TOKEN` env var.
- The MCP endpoint is `https://www.pixil.space/api/mcp` (www only; the apex 307-redirects POSTs).
- `scripts/pixil.mjs` is **dependency-free** and targets Node 18+ (global `fetch`). Keep it that way.
- Pixil is the source of truth for models/credits. If you change `references/model-catalog.md`, keep credit costs in sync with what `pixil models` returns.
- Bump `version` in `VERSION`, both `.claude-plugin/*.json`, and each `SKILL.md` frontmatter together.
- Skill `description` fields drive auto-invocation — keep the "Use when …" trigger phrases concrete and the "NOT for …" boundaries explicit.

## Test the client

```bash
node scripts/pixil.mjs --help               # no token needed
PIXIL_TOKEN=bad node scripts/pixil.mjs credits   # should print Unauthorized
PIXIL_TOKEN=pixil_real node scripts/pixil.mjs credits   # real check
```
