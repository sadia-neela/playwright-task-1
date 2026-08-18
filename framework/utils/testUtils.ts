export function parseRupees(text: string, regex: RegExp): number {
  return Number(text.replace(regex, ''));
}
