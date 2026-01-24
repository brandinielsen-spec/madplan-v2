# Feature Landscape: Meal Planning App - Import & Organization

**Domain:** Meal planning application with smart recipe import
**Researched:** 2026-01-24
**Research Mode:** Ecosystem
**Confidence:** MEDIUM-HIGH (based on multiple sources, verified patterns)

---

## Table Stakes

Features users expect from a meal planning app with recipe management. Missing these means the product feels incomplete or broken.

### Import Features

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **URL import with auto-extraction** | Every major app (Paprika, Plan to Eat, Honeydew, BeChef) offers this. Users expect to paste a URL and get the full recipe. | Medium | Most recipe sites use schema.org/Recipe JSON-LD markup. Use recipe-scrapers library or similar. 606+ sites supported by standard tools. |
| **Image import with OCR** | Recipe Keeper, CookBook, and Mela all offer "snap a photo" import. Users with cookbook collections expect this. | Medium | Apple Live Text, Google Cloud Vision, or OpenAI Vision can extract text. Need post-processing to structure into ingredients/steps. |
| **Recipe image extraction from URL** | When importing from URL, users expect the hero image to be saved. Shows in meal plan and recipe list. | Low | Part of URL scraping. Extract og:image or first large image from page. |
| **Edit imported recipes** | Import is never 100% accurate. Users must be able to fix mistakes before/after saving. | Low | Standard form editing. Show preview before final save. |

### Organization Features

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Favorites/bookmarks** | Universal pattern across all apps. One-tap to mark frequently used recipes. | Low | Single boolean field. Heart icon in UI. Filter by favorites. |
| **Search by title** | Basic discovery. Users remember recipe names. | Low | Text search on title field. |
| **Categories or tags** | Paprika, Plan to Eat, Recipe Keeper all offer this. Users want to find "quick meals" or "vegetarian" easily. | Medium | Decision: Use tags (flexible) not categories (rigid). Allow multiple tags per recipe. |
| **Filter by tag** | Natural companion to tagging. "Show me all vegetarian recipes." | Low | Multi-select filter UI. |

### User Experience

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Import feedback** | User needs to know import is working (loading state) and succeeded/failed (result). | Low | Loading spinner, success/error toast. |
| **Preview before save** | User should review extracted data before committing. Catches OCR/parsing errors. | Low | Modal or page showing parsed result with edit capability. |

---

## Differentiators

Features that would set the app apart. Not expected, but valued and memorable.

### Smart Import (Your Planned Differentiator)

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **URL detection in images** | User takes screenshot of recipe card with URL visible. App detects URL and fetches from source instead of OCR. Better accuracy, gets original images. | High | Requires: 1) OCR to find URL patterns, 2) URL validation, 3) Fetch and parse. Falls back to regular OCR if no URL found. Unique feature - not seen in competitors. |
| **QR code detection** | Some recipe cards/books include QR codes linking to online version. Detect and fetch. | Medium | Standard QR detection libraries. Same flow as URL detection. |
| **Intelligent field extraction** | Not just raw text, but structured ingredients (amount, unit, ingredient) and numbered steps. | Medium | AI/ML can improve accuracy. OpenAI or similar can structure raw OCR output. |

### Organization Enhancements

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Auto-tag suggestions** | Analyze ingredients and suggest tags. "Contains chicken" -> suggest "Kylling". "Takes 15 min" -> suggest "Hurtig". | Medium | Simple keyword matching for v2, AI for v2.1. |
| **Recently used** | Quick access to recipes used in last 2 weeks. Saves search time for rotation meals. | Low | Track last-used timestamp. Sort/filter by recency. |
| **Cooking time filter** | "Show me recipes under 30 minutes." Extracted from import or user-entered. | Low-Medium | Requires cooking time field. May need to extract from imported recipes. |
| **Smart search** | Search ingredients, not just title. "What can I make with chicken?" | Medium | Full-text search on ingredients field. |

### Import Experience

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Batch import** | Import multiple recipes at once (multiple photos or URLs). | Medium | Queue system, progress indicator. Good for digitizing cookbook. |
| **Import history** | See recently imported recipes with source. Undo imports. | Low | Audit trail. Source URL/image reference stored. |
| **Duplicate detection** | Warn if recipe with same title exists. Offer to update or skip. | Low | Title matching. Could extend to ingredient-based similarity. |

---

## Anti-Features

Features to deliberately NOT build. Common mistakes or scope traps.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| **Ads or paywall core features** | Major user complaint across apps. For family/friends app, kills trust. | Keep free. If monetization needed later, make it optional premium (unlimited storage, family sharing). |
| **Manual recipe entry as primary flow** | Time-consuming, error-prone. Users abandon apps that make entry tedious. | Make import the primary flow. Manual entry is backup only. |
| **Complex category hierarchies** | Users struggle with "where does this go?" decisions. Gets messy fast. | Use flat tags. Allow multiple tags per recipe. Let user define their own. |
| **Rigid tag vocabulary** | Pre-defined tags miss user's mental model. Danish users want Danish tags. | User-created tags with suggestions. Auto-complete from existing tags. |
| **Voice-only features** | Honeydew mentions voice commands. Complex to implement, niche usage. | Skip for v2. Physical interaction is fine for meal planning (not hands-dirty cooking). |
| **Gamification** | Honeydew has achievements/points. Adds complexity, not core value. | Skip entirely. Users want efficiency, not badges. |
| **Nutritional tracking** | Already marked out of scope. Requires structured data, validation, edge cases. | Skip. Not needed for family meal planning use case. |
| **Social sharing/discovery** | Community recipes, sharing with public. Massive scope increase. | Skip. Private family app. Share via copy-paste if needed. |
| **AI meal suggestions** | Marked as v2.1. Requires trained model or expensive API calls for quality. | Defer. Focus on import and organization first. |
| **Excessive import sources** | Supporting TikTok, Instagram, YouTube videos adds major complexity. | Support URL (websites) and image (OCR) only. Covers 90% of use cases. |

---

## Feature Dependencies

```
URL Import ──────────────────┐
                             ├──> Recipe Preview ──> Recipe Save ──> Favorites
Image Import (OCR) ──────────┤                                  └──> Tags
                             │
URL Detection from Image ────┘
     │
     └── Requires: Image Import (OCR) working first
         Then: URL pattern recognition
         Then: Fetch from detected URL

Tags ─────────────────────────> Filter by Tag
                           └──> Auto-tag suggestions (optional)

Search ───────────────────────> Search by title (basic)
                           └──> Search by ingredients (enhanced)

Favorites ────────────────────> Filter by favorites
                           └──> Recently used (uses same timestamp pattern)
```

**Critical path for v2:**
1. URL Import (most common flow)
2. Image Import (OCR)
3. Favorites + Tags (basic organization)
4. URL Detection from Image (differentiator)

---

## MVP Recommendation

For v2 MVP, prioritize in this order:

### Must Have (Release Blockers)

1. **URL import with recipe extraction** - Table stakes. Use recipe-scrapers or schema.org JSON-LD parsing.
2. **Image import with OCR** - Table stakes for cookbook users. Basic text extraction, user edits structure.
3. **Favorites** - One-tap bookmark. Trivial to implement, high daily usage.
4. **Basic tags** - User-created tags, multiple per recipe, filter capability.
5. **Search by title** - Minimum viable discovery.

### Should Have (v2 complete)

6. **URL detection from image** - Your key differentiator. Do this well.
7. **Recipe image from URL** - Makes meal plan visually appealing.
8. **Edit before save** - Preview/correction flow for imports.

### Defer to v2.1

- Auto-tag suggestions (nice but not essential)
- Smart search by ingredients
- Batch import
- Cooking time extraction/filter
- Duplicate detection
- Import history

---

## Implementation Notes

### URL Import Technical Approach

**Recommended:** Use schema.org/Recipe JSON-LD extraction as primary method.

- Most recipe websites (especially food blogs) use JSON-LD markup for SEO
- Google recommends JSON-LD format
- Data is pre-structured: title, ingredients, instructions, image, cooking time
- 606+ sites supported by recipe-scrapers library
- Fallback to HTML scraping for sites without JSON-LD

**Example JSON-LD structure:**
```json
{
  "@type": "Recipe",
  "name": "Recipe Title",
  "image": "https://...",
  "recipeIngredient": ["1 cup flour", "2 eggs"],
  "recipeInstructions": [...]
}
```

### Image OCR Technical Approach

**Options:**
1. **OpenAI Vision API** - Best accuracy, handles layout understanding, can structure output directly. Cost: ~$0.01-0.03 per image.
2. **Google Cloud Vision** - Good OCR, cheaper, need post-processing to structure.
3. **Apple Live Text** - Free on Apple devices, client-side, but only for iOS/macOS Safari.

**Recommendation:** OpenAI Vision for v2. Single API call can: extract text, detect URLs, structure into ingredients/steps, identify cooking time. Cost acceptable for family app scale.

### URL Detection from Image

**Approach:**
1. Run OCR on image
2. Regex scan for URL patterns: `https?://[^\s]+` or domain patterns
3. If URL found and valid: fetch and parse as URL import
4. If no URL or fetch fails: use OCR text as fallback
5. User sees result either way with source indication

### Tag System Design

**Recommended approach:**
- Tags are user-created, stored as array of strings
- Auto-complete from existing tags when typing
- Lowercase, singular form convention (display can Title Case)
- Pre-seed with common tags: "Hurtig", "Vegetar", "Kylling", "Oksekod", "Fisk", "Pasta", "Gastemad", "Hverdagsmad", "Weekend"
- Allow users to add any tag they want

---

## Confidence Assessment

| Area | Confidence | Reason |
|------|------------|--------|
| Table stakes features | HIGH | Consistent across 10+ apps reviewed. Clear user expectations. |
| URL import approach | HIGH | Schema.org standard, well-documented, proven libraries. |
| OCR approach | MEDIUM | Multiple viable options. OpenAI Vision recommended but costs should be monitored. |
| URL detection from image | MEDIUM | Technically feasible, not seen in competitors. May need iteration. |
| Tag system design | HIGH | Well-established patterns from Paprika, OrganizEat, others. |
| Anti-features | HIGH | Clear user complaints documented in reviews. |

---

## Sources

**Recipe Apps & Features:**
- [Honeydew - Social Media Imports](https://honeydewcook.com/blog/recipe-apps-social-media-imports)
- [MealFlow - Digital Recipe Organizer](https://www.mealflow.ai/blog/digital-recipe-organizer)
- [BeChef - Recipe App Comparison](https://www.bechef.app/blog/recipe-app-comparison)
- [Recipe Keeper](https://recipekeeperonline.com/)
- [Mealie](https://mealie.io/)

**Technical Implementation:**
- [Google Recipe Schema Documentation](https://developers.google.com/search/docs/appearance/structured-data/recipe)
- [Schema.org Recipe Type](https://schema.org/Recipe)
- [recipe-scrapers Documentation](https://docs.recipe-scrapers.com/)
- [JSON-LD Recipe Examples](https://jsonld.com/recipe/)

**Organization Best Practices:**
- [OrganizEat - Tagging Best Practices](https://home.organizeat.com/blog/best-practices-for-tagging-recipes/)
- [Recify - How to Categorize Recipes](https://www.recify.app/blog/how-to-categorize-recipes/)
- [SideChef - UX Best Practices](https://www.sidechef.com/business/recipe-platform/ux-best-practices-for-recipe-sites)

**OCR & Image Processing:**
- [CookBook OCR Guide](https://help.cookbookmanager.com/hc/en-gb/articles/360002691375-How-to-use-OCR)
- [Mealie OCR Discussion](https://github.com/mealie-recipes/mealie/discussions/3899)
- [Google Cloud Vision - Chefkoch Case Study](https://cloud.google.com/blog/products/ai-machine-learning/chefkoch-digitizes-handwritten-recipes-with-automl-and-vision-api/)
