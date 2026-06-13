# Prompt engineering for Pixil

## Write prompts in English

Pixil's models are trained primarily on English captions. Even when chatting with the user in another language, **send the model an English prompt**. Translate intent, don't transliterate.

## Image prompt structure

Layer the prompt: **subject → context/setting → composition → lighting → style/medium → quality cues.**

> `a matte-black ceramic coffee mug on a weathered oak table, shallow depth of field, morning window light from the left, minimalist product photography, soft shadows, high detail`

Tips:
- Name the **shot** (close-up, wide, overhead/flat-lay, 3/4 view) and **lens/light** (softbox, golden hour, hard rim light) for control.
- For **text in the image** (posters, packaging, signage) use Ideogram v3 or GPT Image, and put the exact words in quotes: `a poster that says "GRAND OPENING"`.
- For **logos/vector** use Recraft v3.
- Negatives: describe what you want, not long "no X" lists — these models respond better to positive description.

## Exact logos / real assets

Generative models **repaint** anything they draw, so a generated logo won't match the real one. To keep a brand asset pixel-exact, generate the background first, then `edit` with the real logo/screenshot as a reference image and instruct "keep it unchanged":

```bash
pixil edit "composite this logo into the top-left corner, do not alter the logo" scene.png logo.png
```

## Video prompts

- Describe **motion and the subject's action**, plus mood and pacing: `slow push-in on a steaming bowl of ramen, gentle steam rising, warm cozy light, cinematic`.
- Use `--motion` for camera moves instead of stuffing them into the prompt (up to 2): `--motion dolly-in,orbit`.
- Keep a single clear action per clip; multi-action prompts drift.
- `--duration 5` is a safe default; `10` costs the same credits here but is harder to keep coherent.

## Aspect ratio by placement

| Use | Aspect |
|---|---|
| Instagram/Facebook feed, square ad | `1:1` |
| Story / Reel / TikTok / vertical | `9:16` |
| YouTube thumb, banner, landscape | `16:9` |
| Print-ish / standard | `4:3` |

## Iterating

- Change **one variable at a time** (lighting *or* angle *or* style) so you can tell what helped.
- Re-run with the same prompt for variations (each generation is a fresh seed).
- Start cheap (Nano Banana) to lock composition, then re-run the winner on Nano Banana Pro / Seedream for the final.
