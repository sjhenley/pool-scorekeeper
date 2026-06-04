/**
 * Formats the input string such that each word consists of a capital letter followed by lowercase letters.
 * @param str input string
 * @returns formatted string
 */
export function formatTitleString(str: string): string {
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}
