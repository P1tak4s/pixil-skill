# Install

The skills need **Node 18+** and a **Pixil token**.

## 1. Get a token

1. Sign in at https://www.pixil.space
2. Open **Account → MCP connectors** (https://www.pixil.space/mcp) and create a token (`pixil_…`).
3. Export it in your shell (add to `~/.zshrc` / `~/.bashrc` to persist):
   ```bash
   export PIXIL_TOKEN=pixil_xxx
   ```

## 2. Install the skills

### Option A — Claude Code plugin marketplace (recommended)
```
/plugin marketplace add P1tak4s/pixil-skill
/plugin install pixil@pixil
```
Then invoke with `/pixil:generate` or `/pixil:ads`, or just describe what you want.

### Option B — `skills` CLI
```bash
npx skills add P1tak4s/pixil-skill
```

### Option C — Manual
Clone the repo and copy the skill folders into your Claude Code skills directory:
```bash
git clone https://github.com/P1tak4s/pixil-skill.git
cp -R pixil-skill/pixil-generate pixil-skill/pixil-ads ~/.claude/skills/
cp -R pixil-skill/scripts ~/.claude/skills/pixil-generate/   # keep the client next to the skill
```
(Adjust paths to your setup. The skills reference the client at `${CLAUDE_PLUGIN_ROOT}/scripts/pixil.mjs`, falling back to `./scripts/pixil.mjs`.)

## 3. Verify

```bash
node scripts/pixil.mjs credits
```
A credit balance means you're set. `Unauthorized` means the token is missing or wrong.

## Other agents

- **Codex / Cursor:** the bundled `scripts/pixil.mjs` works in any environment with Node + `PIXIL_TOKEN`; point your agent's shell tool at it.
- **Native MCP:** instead of the script, register the server directly:
  ```bash
  claude mcp add --transport http pixil "https://www.pixil.space/api/mcp?token=$PIXIL_TOKEN"
  ```

## Notes

- The endpoint is the **www** host (`https://www.pixil.space/api/mcp`); the apex redirects POSTs and won't work. The bundled client already uses www.
- No secrets are stored in this repo — generations are billed to the account behind your `PIXIL_TOKEN`.
