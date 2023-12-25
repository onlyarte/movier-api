export function extractJSONArray(text: string | null | undefined) {
  try {
    if (!text) return [];
    const start = text.indexOf('[');
    const end = text.lastIndexOf(']');
    if (start === -1 || end === -1) return [];
    return JSON.parse(text.substring(start, end + 1));
  } catch (error) {
    return [];
  }
}
