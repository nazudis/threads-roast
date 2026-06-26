export function formatRoastForReading(roast: string): string {
  return roast.trim().replace(/([.!?])\s+/g, "$1\n\n");
}
