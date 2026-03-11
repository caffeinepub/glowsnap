# GlowCam

## Current State
The app is named GlowSnap and features:
- Live camera with canvas rendering and CSS filter overlays
- 15 filters: 12 beauty (Natural Glow, Soft Glow, Soft Makeup, Golden Hour, Rose Blush, Dewy Skin, Peach Velvet, Mocha Glow, Champagne, Saffron Glow, Bridal Glow, None) and 3 ornament filters (Bridal Jewels, Nath & Bindi, Kundan Glam)
- Photo capture and save to backend gallery
- Front/back camera toggle
- Gallery modal with delete
- Photo preview modal

## Requested Changes (Diff)

### Add
- Rename app to GlowCam throughout UI
- New Beauty Filters:
  - Natural Skin Smooth (subtle brightening + blur to smooth skin)
  - Soft Pink Blush (pink hue-shift warm tones)
  - Glossy Lip Tint (warm rosy saturation)
  - Eye Brightening (higher brightness + contrast)
  - Soft Glow Lighting (dreamy warm glow)
- New Individual Ornament Filters (canvas-drawn):
  - Maang Tikka Only (centered forehead ornament with chain)
  - Small Nose Ring (tiny elegant nose ring)
  - Jhumka Earrings (hanging earring drops on both sides)
  - Simple Gold Necklace (thin arc necklace at neck area)
  - Bindi Only (single decorative bindi)
- New Special Filters:
  - Bridal Glow (luminous warm gold skin tone)
  - Festive Sparkle (canvas sparkles overlay + warm tone)
  - Minimal Makeup Look (subtle natural enhancement)
- Favorite filters feature: heart/star button per filter to mark favorites, favorites shown first in carousel
- Favorites stored in localStorage

### Modify
- Existing ornament filters kept and improved with better canvas drawings
- Filter carousel to show category grouping (Beauty / Ornaments / Special)
- App title header renamed from GlowSnap to GlowCam with sparkle icon

### Remove
- Nothing removed, all existing filters kept

## Implementation Plan
1. Rename all GlowSnap references to GlowCam in App.tsx, title, and page title
2. Add new filters to FILTERS array in FilterSelector.tsx with appropriate CSS filters and ornament types
3. Implement canvas drawing for new individual ornament filters: maang-tikka-only, nose-ring-only, jhumka-only, necklace-only, bindi-only
4. Add sparkle animation particles for Festive Sparkle filter
5. Add favorites state (localStorage) and heart toggle on each filter chip
6. Show starred filters at top of carousel
7. Add category labels in filter carousel (Beauty, Ornaments, Special)
