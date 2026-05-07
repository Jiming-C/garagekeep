# Design

## Theme

Light surface, warm bone neutral, deep ink type. The scene: a collector at a leather-topped desk, late evening, a single warm lamp, leafing through the service log. Light but not stark, warm but not dim.

Light theme is primary. Dark mode is deferred.

## Color (OKLCH)

Strategy: **Restrained**. Warm-tinted neutrals carry ~90% of every surface. One deliberate accent (deep oxblood) appears at decision points only. Three named status colors are tuned, not pure.

```css
/* Surface & ink — all tinted toward warm 80deg hue */
--bone-50:   oklch(98%  0.005 80);  /* page surface */
--bone-100:  oklch(95%  0.008 80);  /* card surface */
--bone-200:  oklch(90%  0.010 80);  /* dividers, soft fill */
--bone-300:  oklch(82%  0.010 80);  /* hairlines */
--bone-500:  oklch(58%  0.012 80);  /* secondary text */
--bone-700:  oklch(38%  0.012 80);  /* body text */
--bone-900:  oklch(18%  0.012 80);  /* display ink */

/* Accent — deep oxblood, used sparingly (CTAs, focused state, single hero detail) */
--accent:    oklch(42%  0.13  25);

/* Status — muted, named, never pure RGB */
--good:      oklch(58%  0.06  145); /* sage */
--soon:      oklch(70%  0.10   80); /* amber */
--overdue:   oklch(50%  0.12   30); /* terracotta */
```

No `#000`, no `#fff`. All neutrals tint toward the warm hue.

## Typography

Two-family pairing, both Google Fonts (satisfies the CSS Google-font requirement).

- **Display:** Fraunces — variable serif, expressive at large optical sizes. Used for car nicknames, big numbers, page titles, status moments.
- **Body & UI:** Inter — variable sans. Used for everything else.
- **Numerals:** Inter tabular numerals (`font-variant-numeric: tabular-nums`) for any aligned numeric column (odometer, cost, mileage delta).

Scale (modular, ratio ~1.333):

| Step       | Size | Line | Weight | Family   | Use                                      |
|------------|------|------|--------|----------|------------------------------------------|
| Display L  | 64px | 0.95 | 500 italic | Fraunces opt 144 | Hero numbers, car nicknames at the top |
| Display M  | 44px | 1.05 | 500 | Fraunces opt 96  | Page titles                              |
| Display S  | 28px | 1.15 | 500 | Fraunces opt 36  | Section headers, car-card title          |
| Body L     | 18px | 1.55 | 400 | Inter            | Long-form copy                           |
| Body       | 15px | 1.55 | 400 | Inter            | Default                                  |
| Body S     | 13px | 1.50 | 400 | Inter            | Secondary, captions                      |
| Eyebrow    | 11px | 1.20 | 500 uppercase, +0.08em tracking | Inter | Section eyebrow labels |

Letter-spacing: −0.02em on Fraunces display sizes, 0 on body, +0.08em on uppercase eyebrows.

## Layout

12-column grid with generous outer margin: 10% each side at >=1280px, 24px at mobile. Section rhythm 96 / 64 / 48 / 32 / 24 / 16 / 12 / 8 px.

Asymmetric grid is welcomed: a hero number can take 7 cols while a supporting block takes 4 cols with a 1-col gutter. No more than two visual hierarchies per fold.

## Motion

Easing:
- `--ease-out-quart: cubic-bezier(0.22, 1, 0.36, 1);` — default for transforms.
- `--ease-out-expo:  cubic-bezier(0.16, 1, 0.3, 1);` — hero entrances.

Durations:
- `--dur-micro: 180ms;` — toggles, hover.
- `--dur-card:  320ms;` — card transitions, modal-less reveals.
- `--dur-hero:  600ms;` — page enter, big reveals.

Patterns:
- **Page enter:** content elements rise 16px and fade in, staggered 60ms apart, 600ms ease-out-expo.
- **Card hover:** 1.5px lift via translate3d, 200ms; image inside scales to 1.02; hairline border thickens to accent.
- **Status badge entrance:** scale 0.92 → 1.0 with opacity, 320ms.
- **Form field focus:** underline draws in left → right, 200ms.

Reduced motion: when `prefers-reduced-motion: reduce`, all transforms collapse to fade-only, 200ms.

Never animate layout properties (width, height, left, top). Only `transform` and `opacity`.

## Components

### Car Card

Aspect 5:4. Imagin.studio render is the dominant visual, top-anchored, generous bottom space. Below the render: car nickname (Display S italic Fraunces), make/model/year (Body, bone-500), then a hairline divider, then a three-row stat strip:

```
ODOMETER     54,283 mi
NEXT DUE     Oil change · in 800 mi
STATUS       ● Due soon
```

Each label is Eyebrow type, value is Inter tabular. No nested boxes, no inner cards.

### Status Badge

A pill, but quiet. No filled background. `bone-100` chip with a 6px filled dot in the status hue, label text in `bone-700`, label always present. Variants: `good` (sage), `soon` (amber), `overdue` (terracotta). Color is supplementary; the label carries the meaning.

### Service Timeline (Car Detail)

Vertical timeline. Each entry is a single row, no surrounding card:

```
─────────────────────────────────────────
2025-12-04   Oil change       54,000 mi    $48
─────────────────────────────────────────
2025-08-12   Tire rotation    51,200 mi    $0
─────────────────────────────────────────
```

Date in tabular Inter, type in Inter body, mileage and cost right-aligned in tabular Inter. Hairline divider above each row. The timeline is the page; nothing wraps it.

### Forms (Add Car, Log Service)

- Floating-label inputs.
- Underline only — 1px bone-300 default, 2px accent on focus, drawn from left.
- Field group spacing: 32px vertical between groups, 16px between label-input pairs.
- Submit button: bone-900 fill, bone-50 text, no border, no shadow. Ghost variant: bone-900 text, bone-300 1px hairline.

### Navigation

Top bar only. Wordmark left (Fraunces, italic), three text links right (Garage / Add Car / About). 1px hairline below at scroll. No drawer, no sidebar — this is an editorial publication, not a CMS.

## Imagery

- Imagin.studio renders only. No stock photography, no illustrations.
- Render against bone-100 surface where possible.
- Optional 1.5% SVG noise overlay on hero containers — quiet materiality, never decorative.

## Materiality

- Hairlines (1px bone-300) for divisions. Never heavy borders.
- Shadows: one shadow token, used sparingly on lift states only:
  `--shadow-lift: 0 8px 32px -16px oklch(18% 0.012 80 / 0.18);`
- Corners: 4px on inputs and small chips, 12px on cards, 20px on hero containers.
- No glassmorphism. No gradients on surfaces. No gradient text — ever.
