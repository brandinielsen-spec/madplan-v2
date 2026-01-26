import type { IndkoebKategori } from './types'

// Keywords for each category (Danish)
const KATEGORI_KEYWORDS: Record<IndkoebKategori, string[]> = {
  'frugt-og-groent': [
    'æble', 'banan', 'appelsin', 'citron', 'lime', 'pære', 'drue', 'melon',
    'jordbær', 'hindbær', 'blåbær', 'mango', 'ananas', 'avocado', 'kiwi',
    'tomat', 'agurk', 'peberfrugt', 'chili', 'salat', 'spinat', 'grønkål',
    'gulerod', 'kartoffel', 'kartofler', 'løg', 'hvidløg', 'porrer', 'porre',
    'broccoli', 'blomkål', 'squash', 'aubergine', 'majs', 'ærter', 'bønner',
    'champignon', 'svampe', 'radiser', 'selleri', 'rødbede', 'pastinak',
    'persille', 'dild', 'basilikum', 'koriander', 'mynte', 'timian', 'oregano',
    'rosmarin', 'ingefær', 'forårsløg', 'spidskål', 'hvidkål', 'rødkål',
    'asparges', 'artiskok', 'fennikel', 'courgette', 'iceberg', 'rucola',
  ],
  'mejeri': [
    'mælk', 'letmælk', 'minimælk', 'skummetmælk', 'fløde', 'piskefløde',
    'creme fraiche', 'cremefraiche', 'smør', 'margarine', 'ost', 'feta',
    'mozzarella', 'parmesan', 'gouda', 'cheddar', 'brie', 'yoghurt', 'skyr',
    'kefir', 'æg', 'æggeblommer', 'æggehvider', 'ymer', 'a38', 'tykmælk',
    'hytteost', 'mascarpone', 'ricotta', 'kvark',
  ],
  'koed-og-fisk': [
    'kylling', 'kyllingebryst', 'kyllingelår', 'oksekød', 'hakket oksekød',
    'hakket kød', 'svinekød', 'flæsk', 'bacon', 'pølse', 'pølser', 'skinke',
    'lam', 'lammekød', 'and', 'kalv', 'lever', 'nyre', 'fisk', 'laks',
    'torsk', 'rødspætte', 'sej', 'tun', 'tunfisk', 'makrel', 'sild', 'rejer',
    'muslinger', 'hummer', 'krabbe', 'kammuslinger', 'blæksprutte', 'tilapia',
    'hellefisk', 'bøf', 'koteletter', 'medister', 'fjerkræ', 'kalkun',
    'andebryst', 'spareribs', 'mørbrad',
  ],
  'kolonial': [
    'mel', 'hvedemel', 'fuldkornsmel', 'sukker', 'rørsukker', 'flormelis',
    'honning', 'sirup', 'pasta', 'spaghetti', 'penne', 'fettuccine', 'lasagne',
    'ris', 'jasminris', 'basmatiris', 'risotto', 'quinoa', 'bulgur', 'couscous',
    'havregryn', 'müsli', 'cornflakes', 'olie', 'olivenolie', 'rapsolie',
    'solsikkeolie', 'eddike', 'balsamico', 'soja', 'soyasauce', 'ketchup',
    'sennep', 'mayonnaise', 'mayo', 'dressing', 'krydderi', 'salt', 'peber',
    'paprika', 'kanel', 'karry', 'spidskommen', 'muskatnød', 'vanille',
    'bagepulver', 'gær', 'natron', 'kakao', 'chokolade', 'nødder', 'mandler',
    'valnødder', 'hasselnødder', 'rosiner', 'dadler', 'tomatpuré', 'flåede tomater',
    'kokosmælk', 'kikærter', 'linser', 'bønner', 'majs', 'ærter',
    'bouillon', 'fond', 'tørret', 'dåse', 'konserves',
  ],
  'broed': [
    'brød', 'rugbrød', 'franskbrød', 'toast', 'pitabrød', 'tortilla', 'wrap',
    'boller', 'rundstykker', 'croissant', 'bagel', 'ciabatta', 'focaccia',
    'fladbrød', 'knækbrød', 'ristet', 'baguette', 'sandwichbrød',
  ],
  'husholdning': [
    'køkkenrulle', 'toiletpapir', 'servietter', 'opvaskemiddel', 'opvasketabs',
    'vaskemiddel', 'skyllemiddel', 'rengøring', 'sæbe', 'håndsæbe', 'shampoo',
    'balsam', 'tandpasta', 'deodorant', 'affaldsposer', 'fryseposer',
    'bagepapir', 'aluminiumsfolie', 'husholdningsfilm', 'plastikfolie',
    'opvaskesvamp', 'klude', 'batterier',
  ],
  'andet': [],
}

/**
 * Infer category from ingredient name using keyword matching
 */
export function inferKategori(navn: string): IndkoebKategori {
  const lowerNavn = navn.toLowerCase()

  for (const [kategori, keywords] of Object.entries(KATEGORI_KEYWORDS)) {
    if (kategori === 'andet') continue  // Skip 'andet' - it's the fallback
    if (keywords.some((kw) => lowerNavn.includes(kw))) {
      return kategori as IndkoebKategori
    }
  }

  return 'andet'
}

/**
 * Get category for an item, inferring from name if not set
 */
export function getItemKategori(navn: string): IndkoebKategori {
  return inferKategori(navn)
}
