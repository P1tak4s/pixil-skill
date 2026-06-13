# Pixil Skill

Claude Code (and Codex / Cursor) skills for **[Pixil](https://www.pixil.space)** — generate images and videos, edit and animate images, lip-sync, and create branded ad creatives, all through Pixil's AI studio (fal.ai models) via its MCP server.

> Inspired by the structure of [higgsfield-ai/skills](https://github.com/higgsfield-ai/skills), built for Pixil.

## Skills

| Skill | Invoke | What it does |
|---|---|---|
| **generate** | `/pixil:generate` | Text-to-image, image edit (1-6 refs), text-to-video, image-to-video with motion presets, lip sync. |
| **ads** | `/pixil:ads` | Branded ad creatives from a saved brand profile (colors, voice, audience, logo). |

## Install

**Claude Code plugin marketplace:**
```
/plugin marketplace add P1tak4s/pixil-skill
/plugin install pixil@pixil
```

**Or with the `skills` CLI:**
```bash
npx skills add P1tak4s/pixil-skill
```

**Or clone and point Claude Code at it** — see [INSTALL.md](INSTALL.md).

## Get a token

The skills need a Pixil token (your account's credits pay for generations):

1. Sign in at **https://www.pixil.space**
2. Go to **Account → MCP connectors** (`https://www.pixil.space/mcp`) and create a token
3. Export it:
   ```bash
   export PIXIL_TOKEN=pixil_xxx
   ```

## Quick start

Once installed, just ask Claude:

> "Generate a 1:1 product image of a matte black water bottle on wet stone, studio light."
> "Animate this photo with a slow zoom: https://…/hero.png"
> "Make an Instagram sale ad for my brand for 20% off Ethiopian beans."

Under the hood the skills call the bundled zero-dependency client, which also works standalone:

```bash
export PIXIL_TOKEN=pixil_xxx
node scripts/pixil.mjs credits
node scripts/pixil.mjs image "a red fox in falling snow, cinematic" --aspect 16:9
node scripts/pixil.mjs video "the fox runs through the snow" --duration 5 --motion dolly-in
node scripts/pixil.mjs --help
```

## How it works

Pixil exposes a stateless **MCP server** over HTTP (`https://www.pixil.space/api/mcp`). The bundled [`scripts/pixil.mjs`](scripts/pixil.mjs) (Node 18+, no dependencies) speaks JSON-RPC `tools/call` to it with your `PIXIL_TOKEN`, polling video/lip-sync jobs to completion. No CLI install, no API keys baked into the repo — you bring your own token.

Prefer native MCP tools? Add Pixil as an MCP server instead:
```bash
claude mcp add --transport http pixil "https://www.pixil.space/api/mcp?token=$PIXIL_TOKEN"
```

## License

MIT — see [LICENSE](LICENSE). Not affiliated with Higgsfield AI.
