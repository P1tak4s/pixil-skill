---
version: 0.1.0
name: pixil-generate
description: |
  Generate images and videos with Pixil's AI studio (fal.ai
  models). Use when: "generate an image", "make a picture",
  "create an ad image", "edit/restyle/combine these images",
  "change the background", "make a video", "animate this
  photo", "image-to-video", "produce a clip", "lip sync this
  video", "make this portrait talk", "check my Pixil
  credits", or "list Pixil models". Covers text-to-image,
  image editing (1-6 references), text-to-video, image-to-
  video with camera motion presets, and lip sync (video or
  portrait + audio). Defaults: Nano Banana 2 for images,
  Seedance Fast / Kling 3 for video. NOT for: branded ad
  creatives tied to a saved brand profile (use pixil-ads).
argument-hint: "[prompt] [--image|--video <path-or-url>] [--model <id>] [--aspect 1:1|16:9|9:16]"
allowed-tools: Bash
---

# Pixil Generate

Drive Pixil's image/video generation through its MCP server. All commands go through the bundled zero-dependency client `scripts/pixil.mjs` (Node 18+), which wraps Pixil's MCP `tools/call` endpoint.

## Step 0 — Bootstrap (do this before any generation)

1. **Token.** The client needs `PIXIL_TOKEN`. If it isn't set, ask the user to create one at **https://www.pixil.space/mcp** (Account → MCP connectors) and export it:
   ```bash
   export PIXIL_TOKEN=pixil_xxx
   ```
2. **Locate the client.** When installed as a plugin it's at `${CLAUDE_PLUGIN_ROOT}/scripts/pixil.mjs`. Define a shorthand for the session:
   ```bash
   PIXIL="node ${CLAUDE_PLUGIN_ROOT:-.}/scripts/pixil.mjs"
   ```
3. **Verify** connectivity and budget before generating:
   ```bash
   $PIXIL credits
   ```
   If this prints a credit balance, you're ready. A `401 / Unauthorized` means the token is missing or wrong.

> Alternative (MCP-native): if the user prefers, Pixil can be added as an MCP server with
> `claude mcp add --transport http pixil "https://www.pixil.space/api/mcp?token=$PIXIL_TOKEN"`,
> then the `pixil_*` tools are callable directly without the script. The script path below works everywhere and needs no MCP setup.

## UX rules

1. Be concise. Print the resulting **media URL**, not raw JSON or generation IDs.
2. Don't narrate "polling the job" / "calling the tool". Just do it and show the result.
3. Reply in the user's language. Keep technical args (`--aspect 16:9`) in English. Pixil's models give **better results with English prompts** — translate the user's intent into a rich English prompt for the model even when chatting in another language.
4. Pick a sensible default model; ask at most one question only if something essential is missing.
5. Don't pre-lecture about credits. Generate at a good default quality first; only mention cost if the user asks or credits run low.
6. Images return immediately. **Video and lip sync are async** — the client already polls to completion for you (1-4 min) and prints the final URL. Just wait.

## Commands

```bash
$PIXIL image  "<english prompt>" [--model <id>] [--aspect 1:1|16:9|9:16|4:3]
$PIXIL edit   "<what to change>" <url1> [url2 ...]          # 1-6 reference images
$PIXIL video  "<english prompt>" [--model <id>] [--aspect 16:9] [--duration 5|10] [--motion dolly-in,orbit]
$PIXIL animate "<motion description>" <image_url> [--motion ...]    # image-to-video
$PIXIL lipsync --audio <url> (--video <url> | --image <url>) [--prompt "..."]
$PIXIL get <id>                 # re-fetch / resume a generation
$PIXIL models                   # list models + credit costs
$PIXIL credits                  # balance
```

## Picking a model

Start from these defaults; only switch for a clear reason. Full list + credit costs in [references/model-catalog.md](references/model-catalog.md).

**Image**
- General / balanced → `fal-ai/nano-banana-2` (2 cr) — the default.
- Highest quality → `fal-ai/nano-banana-pro` (4 cr) or `fal-ai/bytedance/seedream/v4/text-to-image` (3 cr).
- Cheap / drafts → `fal-ai/nano-banana` (1 cr).
- Text **inside** the image / posters / typography → `fal-ai/ideogram/v3` or `fal-ai/gpt-image-1`.
- Logos / vector / branding → `fal-ai/recraft-v3`.

**Video (text-to-video)**
- Quick / cheap → `fal-ai/bytedance/seedance/v1/pro/fast/text-to-video` (5 cr, 720p).
- Quality → `fal-ai/kling-video/v3/standard/text-to-video` (8 cr) or `fal-ai/bytedance/seedance/v1/pro/text-to-video` (12 cr, 1080p).
- With **synced audio** → `fal-ai/veo3/fast` (10 cr).
- Omit `--model` to use Pixil's default.

**Image-to-video** → `fal-ai/minimax/hailuo-02/standard/image-to-video` (4 cr) or the Seedance i2v models. Aspect comes from the source image — don't pass `--aspect`.

**Lip sync** → existing video: `fal-ai/kling-video/lipsync/audio-to-video`; talking portrait photo: `fal-ai/infinitalk`. The client picks the right one from whether you pass `--video` or `--image`.

## Motion presets (video)

Up to 2, comma-separated via `--motion`:
`dolly-in, dolly-out, crash-zoom, orbit, fpv-drone, crane-up, tracking, handheld, whip-pan, bullet-time, slow-motion, static`.

## Examples

```bash
# Square product image
$PIXIL image "minimalist matte black water bottle on wet stone, soft studio light, product photography" --aspect 1:1

# Combine a logo onto a generated scene (exact reference pixels)
$PIXIL edit "place this logo, top-left, keep it crisp and unchanged" https://.../scene.png https://.../logo.png

# 9:16 story video with a push-in
$PIXIL video "snow falling over a quiet pine forest at dawn, cinematic" --aspect 9:16 --duration 5 --motion dolly-in

# Animate a still
$PIXIL animate "gentle parallax, slow zoom, drifting fog" https://.../hero.png

# Make a portrait speak
$PIXIL lipsync --image https://.../face.jpg --audio https://.../voice.mp3 --prompt "warm, friendly delivery"
```

See [references/prompt-engineering.md](references/prompt-engineering.md) for prompt structure and aspect-ratio choices, and [references/troubleshooting.md](references/troubleshooting.md) for errors (401, insufficient credits, video timeouts, unsupported aspect ratios).
