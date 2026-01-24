// API wrapper response
export interface ApiResponse<T> {
  success: boolean
  data: T
  error?: string
}

// Ejer (owner/user context)
export interface Ejer {
  id: string
  navn: string
}

// Opskrift (recipe)
export interface Opskrift {
  id: string
  ejerId: string
  titel: string
  portioner: number
  ingredienser: string[] // Array of ingredient strings
  fremgangsmaade: string
  oprettetDato: string // ISO date string
}

// Day entry in week plan
export interface DagEntry {
  ret: string | null
  opskriftId?: string
}

// Ugeplan (week plan)
export interface Ugeplan {
  id: string
  ejerId: string
  aar: number
  uge: number
  dage: {
    mandag: DagEntry
    tirsdag: DagEntry
    onsdag: DagEntry
    torsdag: DagEntry
    fredag: DagEntry
    loerdag: DagEntry
    soendag: DagEntry
  }
}

// Shopping list item
export interface Indkoebspost {
  id: string
  ejerId: string
  aar: number
  uge: number
  navn: string
  kilde: 'ret' | 'manuel'
  afkrydset: boolean
}

// Day names in Danish (for iteration)
export const DAGE = [
  'mandag',
  'tirsdag',
  'onsdag',
  'torsdag',
  'fredag',
  'loerdag',
  'soendag',
] as const
export type DagNavn = (typeof DAGE)[number]
