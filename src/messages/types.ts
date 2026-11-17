export interface MessageEntry {
  en: string;
  kn: string;
  hi: string;
}

/** Flat, typed message table. Every key must exist in all three languages. */
export type MessageTable = Record<string, MessageEntry>;
