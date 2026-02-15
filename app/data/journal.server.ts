export type JournalEntry = {
  dateKey: string; // YYYY-MM-DD
  notes: string;
  updatedAt: string; // ISO
};

const store = new Map<string, JournalEntry>();

export function getEntry(dateKey: string): JournalEntry | null {
  return store.get(dateKey) ?? null;
}

export function upsertEntry(dateKey: string, notes: string): JournalEntry {
  const entry: JournalEntry = {
    dateKey,
    notes,
    updatedAt: new Date().toISOString()
  };
  store.set(dateKey, entry);
  return entry;
}

export function allEntries(): JournalEntry[] {
  return Array.from(store.values()).sort((a, b) => (a.dateKey < b.dateKey ? 1 : -1));
}
