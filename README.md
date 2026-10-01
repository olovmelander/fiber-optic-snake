# Good Vibes Only

A Swedish vision board for Olov and Susanna, October–December 2026. All 17 visions have original generated illustrations, responsive image variants and short Swedish captions.

## Run and check

```sh
npm ci
npm run dev
npm run check
```

The production website is plain static HTML, CSS and JavaScript under `dist/`. Vite is a local preview dependency only. No external services or API keys are required to run the page.

## Editing

Edit `visions.json`, then run `python3 scripts/render-page.py` to update `dist/index.html`. Layout and visual tokens are in `dist/styles.css`; the native-dialog artwork viewer is in `dist/app.js`. Original generation briefs are recorded in `assets-provenance.json`. Image files use 480, 960 and 1440 pixel WebP variants.

The original Snake game is retained unchanged at `snake/index.html`. The repository root links directly into the vision board, so branch-based GitHub Pages also resolves the page through `dist/`.

## Typography

The font stack is `Helvetica Neue, Helvetica, Arial, sans-serif`. No proprietary font software is bundled. Devices with Helvetica Neue use it; other devices use a compatible system fallback. Add a properly licensed webfont to guarantee identical typography on all devices.

## Publishing

The `.openai/hosting.json` manifest identifies the associated private Site and its static `dist/` output. GitHub remains the requested source repository. Publishing the feature branch to GitHub does not change the current `main` deployment until it is merged.

## Validation

The source check verifies all 17 visions, 51 artwork variants, local asset paths, main-landmark coverage and the first-screen image budget. JavaScript syntax and artwork subjects were also reviewed. The cloud preview browser was blocked in the build environment, so rendered viewport and native-dialog interaction testing remain a follow-up check.
