# Brand

Source assets live in [`brand/`](../brand/): `logo-sheet.jpeg` (logo lockups and mockups) and
`palette.jpeg` (the four-colour strip).

## Palette

Sampled directly from `brand/palette.jpeg` — these are the authoritative values.

| Token       | Hex       | Role                                                                  |
| ----------- | --------- | --------------------------------------------------------------------- |
| `navy`      | `#34385B` | Primary. Carries the page: headers, dark sections, body text on light |
| `slate`     | `#5C5F64` | Secondary. Muted text, borders, diagram strokes                       |
| `amber`     | `#FAB319` | Accent **only**. CTAs, focus rings, one highlight per view            |
| `off-white` | `#F6F8F7` | Surface. Default page background in light mode                        |

Ramps (`50`–`950`) are generated from these four in `packages/ui/src/tokens.css`. The base values
above are the `500` steps for navy, slate and amber.

### Discipline

Amber is an accent, not a theme. If a screen has more than one amber element competing for attention,
one of them is wrong. Navy and off-white do the work; amber points at the single next action.

Do not introduce new hues. Semantic states (success, warning, danger, info) are defined once in
`tokens.css` and chosen to sit beside the brand palette without fighting it.

## Contrast

Every text/background pair must meet **WCAG AA** (4.5:1 body, 3:1 large text). Two specific traps:

- Amber on off-white is **1.8:1** — never use amber for text on a light surface. Amber fills a button;
  navy or near-black sits on top of it.
- Slate on navy is too low for body copy. Use the `slate-200`/`300` steps on dark surfaces.

## Typography

Two self-hosted variable faces, no external CDN (faster, and keeps the CSP free of third-party hosts):

- **Display** — geometric sans for headings, tight tracking at large sizes.
- **Text** — humanist sans for body, optimised for long-form reading.

The wordmark uses wide letter-spacing on "TECH SOLUTION" beneath "APEX GLOBAL", matching the source
lockup.

## Mark

The logo is an `A` formed by a peak with three swept road/runway lines passing through it. It is
rebuilt as SVG in `packages/ui/src/brand/mark.tsx` so it stays crisp at any size, animates cleanly,
and drives the favicon and OG images from one source.

Approved lockups: navy on off-white, white on navy, amber wordmark on slate, navy on amber. Never
place the mark on a busy photograph, never recolour it outside these four combinations, never stretch
it.

## Tone in visual terms

Premium, minimal, engineered. Generous whitespace, strong type hierarchy, restrained motion.
No cheap gradients, no generic stock photography, no call-centre or vehicle imagery, no fake
"technology" visuals of glowing circuit boards. When a visual is needed, prefer a real screenshot or
a real architecture diagram over an illustration.
