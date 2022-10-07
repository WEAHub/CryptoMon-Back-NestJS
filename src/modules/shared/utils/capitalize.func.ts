export function capitalize(word: string): string {
  const lWord = word.toLocaleLowerCase();
  const firstChar = word.charAt(0).toUpperCase();
  return `${firstChar}${lWord.slice(1)}`
}