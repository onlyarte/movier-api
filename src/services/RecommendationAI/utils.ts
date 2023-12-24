export function extractJSONArray(text: string | null | undefined) {
  if (!text) return [];
  const match = text.match(/\[(.*)\]/);
  if (!match) return [];
  try {
    return JSON.parse(match[0]);
  } catch (error) {
    return [];
  }
}
