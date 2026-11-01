# CilikLab — Mobile Landing Header CTA Layout Fix

## Issue
On narrow phones, the landing-page header compressed the "Start learning" CTA into a tall narrow button. The label wrapped across several lines, as the brand logo, language picker and CTA were forced into one fixed-height row.

## Changes
- The public landing header uses a two-row layout at **540 px and below**: logo and language selector on the top row; Start learning CTA on the second row.
- The CTA has a minimum 44 px touch target, centered nonwrapping text, and a fixed inline arrow.
- Long localized CTA labels may ellipsize without breaking layout. Their full text remains in the underlying button for accessibility.
- Wider screen layout, Student/Teacher/Operator views, lessons, coding activities, Arcade, RoboLab and other components were not changed.

## Files edited
- `src/pages/LandingPage.tsx` — layout-specific classes, CTA text and icon wrappers
- `src/main.tsx` — load mobile header CSS last
- `src/website-v40-mobile-landing-header.css` — new scoped responsive rules
- `package.json` — `test:landing:mobile-cta` test command

## Verification performed
- `npm run test:landing:mobile-cta` — passed
- `npm run test:site:v29`, `npm run test:site:v38` — passed
- `npm run test:operator`, `npm run test:robolab`, `npm run test:arcade`, `npm run test:hero` — passed
- Isolated Chromium layout check: widths 320, 360, 375, 390, 430, 458, 540, 541, 640, 768 and 1024 px — no overflow, and <=540px CTA height 44px.

A full Vite build and end-to-end running-site browser check was not performed in this environment because the frontend dependencies were not installed.

## Run locally
```bash
npm install
npm run dev
```
Visit `http://localhost:3000/` and inspect the header on mobile. The start button continues to enter Student View.
