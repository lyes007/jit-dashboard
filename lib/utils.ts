/**
 * Capitalizes the first letter of each word in a string
 * Converts strings like "sofien", "HAITHEM", "saber ferjani" to "Sofien", "Haithem", "Saber Ferjani"
 */
export function capitalizeName(name: string): string {
  if (!name) return name;
  
  return name
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

