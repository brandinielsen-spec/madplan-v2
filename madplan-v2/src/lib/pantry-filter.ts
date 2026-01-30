// Basic pantry staples that most people already have at home
// These are filtered from shopping list by default
// Specialty versions (e.g., "havesalt", "specialpeber") are NOT filtered

const BASIC_PANTRY_ITEMS = [
  // Salt & pepper
  'salt',
  'peber',
  'pepper',

  // Oils & fats
  'olivenolie',
  'olie',

  // Flour & starch
  'hvedemel',
  'mel',
  
  // Sugar
  'sukker',

  // Vinegar

  // Basic spices
  'paprika',
  'kanel',
  'karry',
  'oregano',
  'timian',


  // Stock/bouillon


  // Condiments
  'ketchup',

  // Water
  'vand',
]

/**
 * Check if an ingredient is a basic pantry item that should be filtered
 * Only filters exact matches or simple variations
 * Does NOT filter specialty items (e.g., "flagesalt", "specialpeber")
 */
export function isBasicPantryItem(ingredient: string): boolean {
  const normalized = ingredient.toLowerCase().trim()

  // Check for exact match
  if (BASIC_PANTRY_ITEMS.includes(normalized)) {
    return true
  }

  // Check for common patterns like "salt" at end of short items
  // But not "flagesalt", "havsalt" etc. (those are specialty)
  // Only filter if the item IS the basic word, possibly with quantity

  // Pattern: starts with number/quantity then basic item
  // e.g., "1 tsk salt", "2 spsk olie"
  const quantityPattern = /^[\d.,/]+\s*(g|kg|ml|l|dl|cl|tsk|spsk|stk)?\s+(.+)$/i
  const match = normalized.match(quantityPattern)

  if (match) {
    const itemPart = match[2].trim()
    if (BASIC_PANTRY_ITEMS.includes(itemPart)) {
      return true
    }
  }

  return false
}

/**
 * Filter a list of ingredients, removing basic pantry items
 */
export function filterPantryItems<T extends { navn: string }>(items: T[]): T[] {
  return items.filter(item => !isBasicPantryItem(item.navn))
}
