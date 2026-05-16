import type { ImportPreviewRow } from "../types/programmatic-seo";

export function parseCSV(text: string) {
  const rows: string[][] = [];
  let current = "";
  let row: string[] = [];
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      row.push(current.trim());
      current = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") {
        i += 1;
      }
      row.push(current.trim());
      if (row.some((cell) => cell.length > 0)) {
        rows.push(row);
      }
      row = [];
      current = "";
      continue;
    }

    current += char;
  }

  if (current.length > 0 || row.length > 0) {
    row.push(current.trim());
    rows.push(row);
  }

  if (rows.length === 0) {
    return { headers: [], rows: [] as Record<string, string>[] };
  }

  const headers = rows[0].map(normalizeHeader);
  const dataRows = rows.slice(1).map((cells) =>
    Object.fromEntries(headers.map((header, index) => [header, cells[index] ?? ""]))
  );

  return { headers, rows: dataRows };
}

export function buildImportPreview(
  rows: Record<string, string>[],
  validate: (row: Record<string, string>) => string[],
  duplicateKey: (row: Record<string, string>) => string
) {
  const seen = new Set<string>();

  return rows.map((row, index) => {
    const key = duplicateKey(row);
    const duplicate = key ? seen.has(key) : false;
    if (key) {
      seen.add(key);
    }

    return {
      rowNumber: index + 2,
      data: row,
      errors: validate(row),
      duplicate,
    } satisfies ImportPreviewRow;
  });
}

export function downloadTextFile(filename: string, content: string, mimeType = "text/plain;charset=utf-8") {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function normalizeHeader(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, "_");
}
