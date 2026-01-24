# Pitfalls Research: Madplan v2

**Project:** Madplan App v2
**Researched:** 2025-01-24
**Confidence:** HIGH

## Critical Pitfalls

### 1. Service Worker Caching Wrong Content Types

**Problem:** Using cache-first for API data causes stale recipes. Users see old data even after updating.

**Warning signs:**
- Recipes don't update after edit
- New recipes don't appear
- Shopping list shows yesterday's items

**Prevention:**
- Use network-first for API routes
- Use cache-first only for static assets (JS, CSS, images)
- Add versioning to cache names

**Phase:** PWA setup

---

### 2. OCR Expecting Perfect Structured Output

**Problem:** AI vision responses are probabilistic. Sometimes ingredients are missed, formatting varies.

**Warning signs:**
- Recipe import "works" in testing but fails on user photos
- Missing ingredients in production
- JSON parse errors from AI responses

**Prevention:**
- Always validate AI response structure
- Provide fallback/manual edit flow
- Show user what was extracted for confirmation
- Retry logic for malformed responses

**Phase:** Smart import

---

### 3. URL Scraping Brittleness

**Problem:** Recipe sites have inconsistent markup. JSON-LD isn't always present or complete.

**Warning signs:**
- Some URLs work, others fail silently
- Missing fields (no ingredients, no image)
- Danish sites particularly problematic

**Prevention:**
- Fallback chain: JSON-LD → microdata → AI extraction
- Test with actual Danish sites (arla.dk, valdemarsro.dk, dk-kogebogen.dk)
- Show user what fields were found, allow manual completion

**Phase:** Smart import

---

### 4. PWA Install Prompt Mishandling

**Problem:** Safari/Firefox don't support `beforeinstallprompt`. Only Chrome does.

**Warning signs:**
- Install button only works on Chrome
- iOS users can't figure out how to install
- No feedback on Safari

**Prevention:**
- Detect browser and show appropriate instructions
- For iOS: "Tap Share → Add to Home Screen"
- Don't rely on `beforeinstallprompt` exclusively

**Phase:** PWA setup

---

### 5. Swipe Gestures Conflicting with System

**Problem:** iOS/Android reserve edge swipes for navigation (back gesture). App swipes compete.

**Warning signs:**
- Swipe triggers browser back instead of week change
- Inconsistent behavior across devices
- Users accidentally navigate away

**Prevention:**
- Add padding from screen edges (20-30px)
- Use horizontal swipe in center of card, not full-width
- Provide arrow buttons as alternative

**Phase:** UI/Gestures

---

### 6. shadcn/ui Treated as Installed Library

**Problem:** shadcn/ui copies code into your project. YOU maintain it. Updates don't auto-apply.

**Warning signs:**
- Assuming `npm update` will fix component bugs
- Components drift from upstream fixes
- Breaking changes surprise you

**Prevention:**
- Track which components you've customized
- Periodically check shadcn/ui changelog
- Document your modifications in component files

**Phase:** Foundation

---

## Moderate Pitfalls

### 7. Missing Offline Fallback for n8n API Failures

**Prevention:** Show cached data with "Last updated" timestamp. Retry button.

### 8. Gesture Actions Without Undo

**Prevention:** Swipe-to-delete should have "Undo" toast for 5 seconds.

### 9. OCR Processing Blocking UI

**Prevention:** Show spinner immediately. Process in n8n, not browser.

### 10. Recipe Image Quality Not Validated

**Prevention:** Check image dimensions before OCR. Warn user if too small/blurry.

### 11. Manifest Icons Wrong Size/Format

**Prevention:** Generate all sizes (192, 512, maskable). Use PNG, not SVG.

### 12. Danish Recipe Site-Specific Parsing Gaps

**Prevention:** Build test suite with 10 popular Danish recipe URLs.

---

## Minor Pitfalls

### 13. Loading States Missing/Inconsistent

**Prevention:** Use shadcn/ui Skeleton component. Always show loading for >200ms operations.

### 14. Week Navigation Edge Cases (ISO Weeks)

**Prevention:** Handle year transitions (week 52 → week 1). Use date-fns or Temporal.

### 15. Swipe Action Discoverability

**Prevention:** Show hint on first use. Maybe animated arrow or tooltip.

### 16. Recipe Image Storage/Display

**Prevention:** Compress images before storing. Lazy load in lists. Use Next.js Image.

---

## V1 Context

Based on v1 workflow review:
- v1 already uses Claude Vision via OpenRouter (good choice, keep it)
- v1 URL scraper handles JSON-LD and microdata (test Danish sites)
- v1 has some AI refusal detection but frontend must also handle edge cases

---

## Phase Mapping Summary

| Phase | Key Pitfalls to Address |
|-------|------------------------|
| Foundation | #6 shadcn ownership model |
| PWA Setup | #1 Cache strategies, #4 Install prompt, #11 Icons |
| UI/Gestures | #5 System gesture conflicts, #8 Undo, #15 Discoverability |
| Smart Import | #2 OCR validation, #3 URL brittleness, #9 UI blocking, #10 Image quality |
| Core Features | #7 Offline fallback, #14 Week navigation |

---
*Research complete. Ready for requirements definition.*
