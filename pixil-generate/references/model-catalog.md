# Pixil model catalog

Credit costs and IDs as of v0.1.0. Run `pixil models` for the live list (Pixil is the source of truth — credit costs can change).

Pass the **ID** to `--model`. Durations are seconds; the first is the default.

## Image — text-to-image

| Model | ID | Credits | Notes |
|---|---|---:|---|
| Nano Banana 2 | `fal-ai/nano-banana-2` | 2 | **Default.** Balanced quality/speed. |
| Nano Banana | `fal-ai/nano-banana` | 1 | Cheapest, good for drafts. |
| Nano Banana 2 Pro | `fal-ai/nano-banana-pro` | 4 | Highest quality, hard briefs. |
| Seedream 4 | `fal-ai/bytedance/seedream/v4/text-to-image` | 3 | ByteDance; very photoreal, strong text. |
| Flux Pro | `fal-ai/flux-pro` | 2 | Precise style. |
| Flux Pro Ultra | `fal-ai/flux-pro/v1.1-ultra` | 4 | 4MP, photoreal detail. |
| GPT Image | `fal-ai/gpt-image-1` | 5 | Strong at on-image text + structure. |
| Imagen 4 | `fal-ai/imagen4/preview` | 4 | Google; natural photoreal. |
| Recraft v3 | `fal-ai/recraft-v3` | 3 | Logos, vector, illustration, branding. |
| Ideogram v3 | `fal-ai/ideogram/v3` | 3 | Best for typography / text in images. |

## Image — edit (1-6 reference images)

| Model | ID | Credits |
|---|---|---:|
| Nano Banana Edit | `fal-ai/nano-banana/edit` | 1 |
| Nano Banana 2 Edit | `fal-ai/nano-banana-2/edit` | 2 |
| Nano Banana 2 Pro Edit | `fal-ai/nano-banana-pro/edit` | 4 |

The `edit` command picks an edit model automatically; pass `--model` only to override.

## Video — text-to-video

| Model | ID | Credits | Durations | Notes |
|---|---|---:|---|---|
| Seedance Fast | `fal-ai/bytedance/seedance/v1/pro/fast/text-to-video` | 5 | 5, 10 | 720p, quick. |
| Hailuo 02 | `fal-ai/minimax/hailuo-02/standard/text-to-video` | 4 | 6, 10 | Cheapest. |
| Kling 1.6 | `fal-ai/kling-video/v1.6/standard/text-to-video` | 5 | 5, 10 | |
| Kling 1.6 Pro | `fal-ai/kling-video/v1.6/pro/text-to-video` | 8 | 5, 10 | |
| Kling 3 | `fal-ai/kling-video/v3/standard/text-to-video` | 8 | 5, 10 | Best quality/speed balance. |
| Kling 3 Pro | `fal-ai/kling-video/v3/pro/text-to-video` | 12 | 5, 10 | |
| Veo 3 Fast | `fal-ai/veo3/fast` | 10 | 8 | **Synced audio.** |
| Seedance Pro | `fal-ai/bytedance/seedance/v1/pro/text-to-video` | 12 | 5, 10 | 1080p, cinematic. |
| Wan 2.5 | `fal-ai/wan-25-preview/text-to-video` | 10 | 5, 10 | 720p. Only 16:9/9:16/1:1. |
| Kling 2 Master | `fal-ai/kling-video/v2/master/text-to-video` | 15 | 5, 10 | Premium. |
| Ray 2 (Luma) | `fal-ai/luma-dream-machine/ray-2` | 20 | 5, 9 | Cinematic aesthetics. |

## Video — image-to-video (animate a still)

| Model | ID | Credits | Durations |
|---|---|---:|---|
| Hailuo 02 | `fal-ai/minimax/hailuo-02/standard/image-to-video` | 4 | 6, 10 |
| Seedance Fast | `fal-ai/bytedance/seedance/v1/pro/fast/image-to-video` | 5 | 5, 10 |
| Kling 1.6 | `fal-ai/kling-video/v1.6/standard/image-to-video` | 5 | 5, 10 |
| Kling 3 | `fal-ai/kling-video/v3/standard/image-to-video` | 8 | 5, 10 |
| Veo 3 Fast | `fal-ai/veo3/fast/image-to-video` | 10 | 8 |
| Kling 3 Pro | `fal-ai/kling-video/v3/pro/image-to-video` | 12 | 5, 10 |
| Seedance Pro | `fal-ai/bytedance/seedance/v1/pro/image-to-video` | 12 | 5, 10 |

## Lip sync

| Model | ID | Credits | Input | Cap |
|---|---|---:|---|---|
| Kling Lipsync | `fal-ai/kling-video/lipsync/audio-to-video` | 8 | video + audio | 30s |
| Sync Lipsync 2 | `fal-ai/sync-lipsync/v2` | 15 | video + audio | 20s |
| InfiniteTalk | `fal-ai/infinitalk` | 18 | portrait photo + audio | ~6s |

## Aspect ratios

`1:1` (square), `16:9` (wide/banner), `9:16` (vertical/story), `4:3` (standard). Wan 2.5 supports only `16:9`, `9:16`, `1:1`. Image-to-video takes the aspect from the source image.
