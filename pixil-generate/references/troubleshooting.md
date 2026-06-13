# Troubleshooting

## `Unauthorized` / 401
The token is missing or invalid. Get a fresh one at **https://www.pixil.space/mcp** (Account → MCP connectors) and `export PIXIL_TOKEN=pixil_xxx`. Tokens are per-user and tied to that account's credits.

## `PIXIL_TOKEN is not set`
Export it in the shell that runs the client (see above).

## `Insufficient credits` / `Nepakanka kreditų`
The account is out of credits. Check with `pixil credits`; top up at https://www.pixil.space. Failed generations **auto-refund** credits, so a failure won't charge you.

## Video "timed out waiting"
Video and lip sync render in the background (typically 1-4 min, occasionally longer). The client polls for ~6 min. If it times out, the job may still finish — resume with:
```bash
pixil get <generation_id>
```
(The ID is shown in the timeout message.)

## A model ID is rejected (`Nežinomas modelis` / unknown model)
Use an exact ID from `pixil models` or [model-catalog.md](model-catalog.md). IDs are case-sensitive and full paths, e.g. `fal-ai/kling-video/v3/standard/text-to-video`.

## Wan 2.5 fails on a 4:3 request
Wan 2.5 only supports `16:9`, `9:16`, `1:1`. Pick one of those (the failed attempt is refunded).

## Image-to-video ignores `--aspect`
That's expected — i2v takes its aspect ratio from the source image. Crop the input image first if you need a different ratio.

## Reference image / audio URL rejected
Inputs must be **public `https` URLs** the model can fetch (the model downloads them server-side). Local file paths and private/expiring URLs won't work — host the asset somewhere publicly reachable first.

## Connection errors
The endpoint is `https://www.pixil.space/api/mcp` (the **www** host — the apex redirects POSTs and will fail). The bundled client already uses www; only change `PIXIL_BASE` if you're self-hosting Pixil.
