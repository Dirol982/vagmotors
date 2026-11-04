---
name: VAGMOTORS — Showroom
description: The Group's showroom floor for an independent VAG specialist in Minsk.
colors:
  group-blue-950: "#050f22"
  group-blue: "#0a1b38"
  group-blue-850: "#0e2347"
  group-blue-800: "#132d59"
  group-blue-700: "#1d4380"
  group-blue-500: "#3d6fb8"
  group-blue-300: "#9db8e0"
  group-blue-200: "#c9d8ef"
  white: "#ffffff"
  floor: "#f2f4f7"
  floor-2: "#e8ecf1"
  steel-200: "#d3d9e1"
  steel-300: "#b9c2ce"
  steel-500: "#677487"
  steel-600: "#4e5a6b"
  ink: "#0d1626"
  wordmark-red: "#d33b40"
  wordmark-red-700: "#b42c31"
  light: "#eef5ff"
typography:
  display:
    fontFamily: "Geologica Variable, Geologica, Golos Text, system-ui, sans-serif"
    fontSize: "clamp(2.6rem, 6.4vw, 6rem)"
    fontWeight: 600
    lineHeight: 0.98
    letterSpacing: "-0.04em"
  section:
    fontFamily: "Geologica Variable, Geologica, system-ui, sans-serif"
    fontSize: "clamp(2.1rem, 4.6vw, 4.25rem)"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.035em"
  row-title:
    fontFamily: "Geologica Variable, Geologica, system-ui, sans-serif"
    fontSize: "clamp(1.375rem, 2.2vw, 2rem)"
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  lede:
    fontFamily: "Golos Text, system-ui, sans-serif"
    fontSize: "clamp(1.125rem, 1.5vw, 1.3125rem)"
    fontWeight: 400
    lineHeight: 1.55
  body:
    fontFamily: "Golos Text, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Golos Text, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: 1.4
rounded:
  sm: "2px"
  sheet: "12px"
  pill: "40px"
spacing:
  gutter: "clamp(16px, 4vw, 56px)"
  section: "clamp(88px, 12vw, 176px)"
  row: "26px"
  stack: "24px"
components:
  button-primary:
    backgroundColor: "{colors.wordmark-red}"
    textColor: "{colors.white}"
    rounded: "{rounded.sm}"
    padding: "0 28px"
    height: "56px"
  button-primary-hover:
    backgroundColor: "{colors.wordmark-red-700}"
  button-blue:
    backgroundColor: "{colors.group-blue}"
    textColor: "{colors.white}"
    rounded: "{rounded.sm}"
    padding: "0 28px"
    height: "56px"
  segment-selected:
    backgroundColor: "{colors.white}"
    textColor: "{colors.group-blue}"
    rounded: "{rounded.sm}"
    height: "48px"
  segment:
    backgroundColor: "{colors.group-blue-950}"
    textColor: "{colors.white}"
    height: "48px"
  field-on-blue:
    backgroundColor: "rgb(255 255 255 / 0.06)"
    textColor: "{colors.white}"
    rounded: "{rounded.sm}"
    height: "50px"
  receipt:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "28px"
---

# Design System: VAGMOTORS — Showroom

## Overview

The site is the Volkswagen Group's showroom floor rather than a garage flyer. Deep group-blue walls carry whole regions, a cool white "floor" carries the reading, and long thin luminous **light-lines** — taken from the workshop's own LED ceiling in the owner's photos — are the one signature material. The real workshop photographs are the proof; they sit inside the blue through a colour grade, never as stock decoration. Precision comes from type, hairlines and spacing, not ornament.

Key characteristics: region-scale colour (blue sections and floor sections alternate), type-only hierarchy (makes, services and warranty are billed by size alone), configurator-style segmented controls, 1px hairline rules, 2px corners, tabular numerals for every price and kilometre.

## Colors

### Primary
- **Group Blue** (`#0a1b38`, ramp 950–200): walls. Hero, calculator, workshop, business, header and footer are blue regions; text on blue uses white and `group-blue-200` for secondary copy.

### Secondary
- **Wordmark Red** (`#d33b40`): only the logo and the primary action (Записаться, Отправить предчек, the dock's pre-check button).

### Neutral
- **Floor** `#f2f4f7`, **White**, **Steel** 200–600 and **Ink** `#0d1626` for the reading sections and the receipt.

### Named Rules
- **The Wordmark Rule:** red appears only in the wordmark and the primary action. Selected states use white fill, blue-500 or light — never red.
- **The Light-Line Rule:** luminous light (`#eef5ff` with a blue glow) marks seams between floor and walls, the hero ceiling, the headline accent and focus on blue. It is a light source, so its glow is allowed; it is never used as a card shadow.

## Typography

Geologica (variable, self-hosted) for display and figures; Golos Text for body and UI. Display is tight (−0.04em) and never exceeds 6rem. Labels are 13px Golos 500, sentence case — never uppercase tracked kickers above headings.

### Hierarchy
display → section → row-title → lede → body → label. Prices and km use Geologica with `tabular-nums`, units in small Golos.

## Layout

Full-bleed colour regions, content in a 1440px wrap with a fluid gutter. Sections open with a two-column head (heading left, lede right, bottom-aligned) and then one dominant structure: a typographic lineup, a hairline index, an odometer table, a pinned horizontal gallery, a receipt. Section padding is `clamp(88px, 12vw, 176px)`.

## Elevation & Depth

Flat by default. Depth only for things that float over the world: the booking configurator over the hero photo (blur + soft drop), the service-index photo peek, the receipt and the mobile dock (soft, offset shadows). No hard offset shadows.

## Shapes

2px corners on buttons, fields, segments and panels; pills only for filter chips; circles only for icon buttons. The mobile pre-check sheet takes 12px top corners. The desktop receipt has a torn bottom edge.

## Components

### Buttons
Red primary (56px, 600 weight) with a light sweep on hover; blue and ghost variants; `link-arrow` for tertiary actions.

### Segmented controls
Make and messenger choosers: equal segments separated by 1px gaps; the selected segment fills white on blue (or blue on white).

### Inputs
50px fields: translucent white on blue, floor-grey on white; focus is a light (on blue) or blue-500 (on white) ring.

### Navigation
Transparent fixed header over the hero, frosted group-blue after scrolling, hidden on scroll down. Links underline with a light-line. On phones a full-screen blue menu, plus a pinned dock: Позвонить | Предчек.

### Pre-check (signature)
A white receipt with dashed hairlines, removable lines (× buttons), a heavy rule above the total, model field, messenger segments and the red send. On ≤1000px it becomes a bottom sheet called from the dock.

## Do's and Don'ts

### Do:
- Bill importance by type size; let headings stand without labels.
- Use the owner's real workshop photos, graded into the blue when they sit on blue.
- Put prices and km in tabular Geologica with "от".
- Keep content visible without JS; motion arrives with mass (springs) and respects reduced motion.

### Don't:
- Don't use red for selection, decoration or dividers.
- Don't use icon-tile card grids, eyebrows/kickers or decorative section numbers.
- Don't present the business as an official dealer or invent figures (ratings, years, car counts).
