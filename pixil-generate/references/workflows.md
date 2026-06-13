# Workflows — chaining tools (the "Drobė" / canvas pattern)

Pixil's canvas (Drobė) is just **tools chained together**: the output URL of one
generation feeds the next. You can do the exact same thing from the skill by
passing a previous result's `image_url` into the next tool. Always wait for one
step's URL before starting the next.

## Product ad (image → motion)
```bash
IMG=$(pixil image "matte-black water bottle on wet stone, studio softbox, product photography" --aspect 9:16)
pixil animate "slow push-in, water droplets glistening, subtle steam" "$IMG"
```

## Exact-logo composite (generate → edit)
Generative models repaint anything they draw, so never let them "draw" a logo.
Generate the scene, then composite the real logo with `edit`:
```bash
SCENE=$(pixil image "cozy morning cafe counter, warm light, empty top-left space" --aspect 1:1)
pixil edit "place this logo top-left, keep it crisp and unchanged" "$SCENE" https://brand.com/logo.png
```

## Storyboard / multi-shot (fan-out then animate)
Generate several frames, then animate the ones you want:
```bash
A=$(pixil image "astronaut floating above earth, cinematic, sci-fi" --aspect 16:9)
B=$(pixil image "abandoned space station interior, red emergency light" --aspect 16:9)
pixil animate "slow dolly forward, debris drifting" "$A"
pixil animate "camera pans across the dark corridor" "$B"
```

## Talking presenter (image → lipsync)
```bash
FACE=$(pixil image "friendly presenter, neutral studio background, looking at camera" --aspect 1:1)
pixil lipsync --image "$FACE" --audio https://.../voice.mp3 --prompt "warm, upbeat delivery"
```
(You supply the audio URL — Pixil generates the visuals, not the voice. See TTS note below.)

## Branded ad (brand profile → ad)
```bash
pixil brands                       # find a brand_profile_id, or create one
pixil call pixil_generate_ad '{"brand_profile_id":"<id>","ad_type":"instagram-post","ad_goal":"sale","product":"20% off Ethiopian beans"}'
```

## Picking newer models
Every generate tool accepts `--model`. The newest options (run `pixil models` for the live list):
- Image: `fal-ai/bytedance/seedream/v4/text-to-image`
- Video: `fal-ai/bytedance/seedance/v1/pro/fast/text-to-video` (cheap), `.../pro/text-to-video` (1080p), `fal-ai/wan-25-preview/text-to-video`

## Notes / current limits
- **Audio (TTS):** the lipsync tool needs an `audio_url` you provide — Pixil does not yet generate speech. (Planned: a fal TTS model so the agent can voice the line itself.)
- **Video templates** (branded animated ad templates) are a Pixil web feature and are **not** exposed as a tool — they render in the browser, not via the API.
- Reference URLs (`edit`, `animate`, `lipsync`) must be public `https` URLs the model can fetch.
