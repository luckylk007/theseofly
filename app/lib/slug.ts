export function slugify(value: string, preserveCase = false) {
  let result = value.trim();
  if (!preserveCase) {
    result = result.toLowerCase();
  }
  return result
    .replace(preserveCase ? /[^a-zA-Z0-9\s-]/g : /[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
