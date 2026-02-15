const MONTHS = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"] as const;

export function monthSlugToNumber(slug: string): number | null {
  const idx = MONTHS.indexOf(slug.toLowerCase() as typeof MONTHS[number]);
  return idx === -1 ? null : idx + 1;
}

export function numberToMonthSlug(month: number): string {
  return MONTHS[month - 1];
}

export function toKey(year: number, month: number, day: number): string {
  const mm = String(month).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${year}-${mm}-${dd}`;
}

export function keyFromParams(month: string, day: string, year: string): string | null {
  const monthNum = monthSlugToNumber(month);
  const dayNum = Number(day);
  const yearNum = Number(year);
  if (!monthNum || !dayNum || !yearNum) return null;
  return toKey(yearNum, monthNum, dayNum);
}

export function pathForDate(date: Date): string {
  const month = numberToMonthSlug(date.getUTCMonth() + 1);
  const day = String(date.getUTCDate()).padStart(2, "0");
  const year = date.getUTCFullYear();
  return `/${month}/${day}/${year}`;
}
