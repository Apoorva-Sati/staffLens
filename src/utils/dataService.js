import * as XLSX from 'xlsx';

/**
 * Detects file type and parses it into an array of row objects.
 * Supports: .xlsx, .xls, .csv
 *
 * @param {File} file - A File object from an <input type="file"> or drag-and-drop
 * @returns {Promise<{ data: object[], sheetNames: string[], fileName: string }>}
 */
export async function parseFile(file) {
  const ext = file.name.split('.').pop().toLowerCase();

  if (!['xlsx', 'xls', 'csv'].includes(ext)) {
    throw new Error(`Unsupported file type: .${ext}. Please upload .xlsx, .xls, or .csv`);
  }

  const buffer = await file.arrayBuffer();

  if (ext === 'csv') {
    return parseCSV(buffer, file.name);
  }

  return parseExcel(buffer, file.name); 
}

// ─── Internal helpers ────────────────────────────────────────────────────────

function parseExcel(buffer, fileName) {
  const workbook = XLSX.read(buffer, { type: 'array' });
  const sheetNames = workbook.SheetNames;

  // Parse every sheet; return first sheet as default `data`
  const allSheets = {};
  sheetNames.forEach((name) => {
    allSheets[name] = XLSX.utils.sheet_to_json(
      workbook.Sheets[name],
      {
        raw: false, // converts dates/numbers to formatted strings
      }
    );
  });
  return {
    data: allSheets[sheetNames[0]],   // rows from first sheet
    allSheets,                         // { sheetName: rows[] } for all sheets
    sheetNames,
    fileName,
  };
}

function parseCSV(buffer, fileName) {
  const workbook = XLSX.read(buffer, { type: 'array' });
  const sheetName = workbook.SheetNames[0];
  const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
  return {
    data,
    allSheets: { [sheetName]: data },
    sheetNames: [sheetName],
    fileName,
  };
}

export async function loadPublicFile(publicPath) {
  const response = await fetch(publicPath);
  if (!response.ok) throw new Error(`Failed to fetch ${publicPath}: ${response.status}`);

  const buffer = await response.arrayBuffer();
  const fileName = publicPath.split('/').pop();
  const ext = fileName.split('.').pop().toLowerCase();

  if (ext === 'csv') return parseCSV(buffer, fileName);
  return parseExcel(buffer, fileName);
}