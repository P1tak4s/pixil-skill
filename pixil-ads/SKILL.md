---
version: 0.1.0
name: pixil-ads
description: |
  Create branded ad creatives with Pixil from a saved brand
  profile (colors, voice, audience, logo). Use when: "make
  an ad for my brand", "Instagram ad", "story ad", "Facebook
  banner", "sale creative", "product launch ad", "set up my
  brand", "create a brand profile". Produces platform-sized
  ad images on-brand. NOT for: one-off images/videos with no
  brand (use pixil-generate), or animated video templates.
argument-hint: "[product/offer] [--type instagram-post|story|...] [--goal sale|launch|...]"
allowed-tools: Bash
---

# Pixil Ads

Generate on-brand ad creatives. An ad ties a **brand profile** (colors, voice, audience, logo) to an **ad type** (size/placement) and a **goal**. Uses the same bundled client as pixil-generate.

## Step 0 — Bootstrap

Same as pixil-generate: ensure `PIXIL_TOKEN` is set (https://www.pixil.space/mcp) and define:
```bash
PIXIL="node ${CLAUDE_PLUGIN_ROOT:-.}/scripts/pixil.mjs"
$PIXIL credits   # verify
```

## Workflow

1. **Find or create a brand profile.**
   ```bash
   $PIXIL brands
   ```
   If none fits, create one (only `name` is required):
   ```bash
   $PIXIL call pixil_create_brand '{
     "name": "Acme Coffee",
     "primary_color": "#1b1b1b",
     "accent_color": "#c8a25a",
     "voice": "premium",
     "audience": "specialty coffee drinkers, 25-40, urban",
     "logo_url": "https://.../logo.png"
   }'
   ```
   `voice` ∈ `premium, playful, minimal, bold, vintage, tech, organic, corporate`. Note the returned brand `id`.

2. **Generate the ad.**
   ```bash
   $PIXIL call pixil_generate_ad '{
     "brand_profile_id": "<brand id>",
     "ad_type": "instagram-post",
     "ad_goal": "sale",
     "product": "single-origin Ethiopian beans, 20% off this week",
     "extras": "warm morning light, steam, hand holding the cup"
   }'
   ```
   The client prints the finished image URL.

## Fields

- **ad_type** (size/placement): `instagram-post` (1:1), `instagram-story` (9:16), `facebook-banner` (16:9), `square-post` (1:1), `youtube-thumb` (16:9).
- **ad_goal** (angle): `brand-awareness`, `product-launch`, `sale`, `event`, `lead-magnet`.
- **product** (required): what's being advertised, in one line.
- **extras** (optional): art-direction notes (scene, mood, props).
- **model** (optional): override the image model (see pixil-generate's [model-catalog.md](../pixil-generate/references/model-catalog.md)); defaults to a strong image model.

## Rules

1. Confirm the brand profile exists before generating — don't invent a `brand_profile_id`.
2. Pick the `ad_type` from where the user will post it; pick `ad_goal` from their intent (discount → `sale`, new product → `product-launch`, etc.).
3. Keep `product` to a single clear offer line; put styling in `extras`.
4. Exact logos: the brand's stored `logo_url` is used for on-brand context, but generative models repaint drawn elements. For a **pixel-exact** logo, generate the ad then composite the real logo with pixil-generate's `edit` command.
5. Print the image URL; reply in the user's language with a one-line note on what you made.
