# Rambhajo director card

A tap-to-open digital business card for the directors of **Rambhajo by Advit Jewels Limited** (est. 1921). The URL of a page here is written to an NTAG213 NFC card; tapping the card opens the page on the visitor's phone.

One page per director. Each page is a single static HTML file with no build step and no framework.

## Files

```
index.html                  the card (template + current placeholder director)
assets/brand/
  logo-cream.png            logo recoloured cream, used on the card
  logo-green.png            logo in brand green, for light backgrounds
  LogoUnit_Green-original.png  original logo as supplied — never edit
assets/photos/              director portraits go here
tools/check_fit.mjs         screen-fit test across iPhone/Android sizes
```

## Editing a director's details

All content lives in the `const CARD = { ... }` block near the bottom of `index.html`. Nothing above it needs to change for content edits.

- Any field set to `""` disappears from the page (icons, rows, footer line).
- `whatsapp` is digits only with the country code: `919876543210`.
- `gmail` opens a Gmail compose window addressed to the director (more reliable than `mailto:`).
- `photo` is a path such as `"assets/photos/firstname.jpg"`. Until it is set, the arch shows `initials`.
- Portraits: upright, chest up, at least 800×1000 px, face in the top third. The arch crops to 4:5 with `object-position: center 20%`.

## Adding another director

1. Copy `index.html` to `d/<slug>/index.html` (e.g. `d/arjun/index.html`).
2. Fix the asset paths in the copy: `assets/...` becomes `../../assets/...`.
3. Edit that copy's `CARD` block.
4. Run `node tools/check_fit.mjs d/<slug>/index.html`.
5. Write `https://<domain>/d/<slug>/` to the NFC card.

The URL on a card is permanent once written. Change page contents freely; never rename or move a published `d/<slug>/` folder.

## Design — keep these decisions

The user went through many iterations to reach this. Do not reintroduce rejected ideas.

**Brand**
- Brand green `#08342D` is sampled exactly from the logo. Surfaces use `--card-1 #0A3A31` and `--card-2 #062923` around it.
- Gold `#C9A961`, light gold `#F4E2AC`, cream text `#F3EEE1`.
- Type: **Marcellus** for the name (uppercase, wide tracking, matching the RAMBHAJO wordmark); **Jost** light for everything else.

**Layout**
- The whole card fits **one phone screen, no scrolling**. This is a hard requirement.
- Order, top to bottom: logo + "Est. 1921" → arched gold photo frame → name, role, company → five round icons (Instagram, WhatsApp, LinkedIn, Gmail, Maps) → solid gold **Save contact** button → phone number.
- Vertical only. On any window wider than 480 px, the card locks to a 9:19.5 phone shape with rounded corners, centred on a dark ground, with the satin kept inside it. Never switch to a side-by-side layout.
- Sizes are driven by `dvh` so the layout scales with screen height. The arch is sized from **width only** with `aspect-ratio: 4/5`; never give it both a height and a max-width, which distorts it on some phone ratios.

**Ornament**
- Background: live **emerald satin**, a WebGL fragment shader (in the `satin` IIFE) with gold specular light on the folds, at half resolution. It falls back to the CSS gradient if WebGL is missing.
- Around the photo: three thin gold **echo arches** stepping outward, fading towards the bottom.
- Gold sparkle: light travelling on the arch frame, ~14 four-point star glints twinkling around the arch, a glint sweep across the Save button, and the icon rings catching light in turn.
- Opening: two soft gold ripples out of the arch, then the arches and text rise in, all finished in ~2.5 s.

**Rejected — do not bring back**
- Lotus rosettes or lotus motifs (rejected twice).
- Thin stroked sine-wave lines across the background (looked cheap; crossed the text).
- Flat filled SVG "silk" layers (replaced by the shader).
- A flip/turn-over two-sided card.
- Long scrolling page sections, big ledger-style rows for channels.
- Grid of square icon tiles, rounded chip/pill tags, ornate dividers (paisley, bead chains, jaali), corner brackets.
- Side-by-side desktop layout.
- Brand-coloured social logos — icons are gold line glyphs only.

## Constraints when changing code

- Respect the iPhone safe areas. `:root` is padded by `env(safe-area-inset-top/bottom)`; don't add the inset a second time inside `.screen`.
- Keep `prefers-reduced-motion` support. Every animation has an entry in the reduced-motion block, and the shader renders a single still frame.
- The shader pauses when the tab is hidden. Keep it cheap: half resolution, 4 fbm octaves.
- Keep the page a single HTML file plus `assets/`. No build tools.
- **Save contact** generates a vCard (`.vcf`) client-side: name, title, company, mobile, email, website, address, Instagram and LinkedIn.

## Testing

```
npm i -D playwright
npx playwright install chromium
node tools/check_fit.mjs
```

Every row must say PASS: fits one screen, arch ratio 0.8, no script errors. Look at the screenshots in `tools/shots/` before calling a visual change done. Real-device check: open the URL on an iPhone in Safari, then tap the NFC card itself.

## Deploying

Any static host works (Netlify, Vercel, GitHub Pages, Cloudflare Pages, or the company server). Upload the folder as is. Use HTTPS. NFC tags open plain `https://` links on both iPhone and Android.

## Owner

The user works at Rambhajo by Advit Jewels Limited and speaks casually (Hinglish). Short, direct replies; show the result rather than describing it.
