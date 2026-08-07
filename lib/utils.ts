/** Junta classes ignorando falsy. Suficiente para o escopo deste site. */
export function cn(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(" ");
}
