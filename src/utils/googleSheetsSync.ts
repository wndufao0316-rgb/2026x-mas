import { ProgramItem, BrochureData } from '../types';

/**
 * Extracts Google Sheet ID from any standard Google Spreadsheet URL
 */
export function extractGoogleSheetId(url: string): string | null {
  if (!url) return null;
  const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  return match ? match[1] : null;
}

/**
 * Converts a Google Spreadsheet URL to a direct CSV export URL with cache-busting
 */
export function getGoogleSheetCsvUrl(url: string): string {
  const sheetId = extractGoogleSheetId(url);
  if (sheetId) {
    const timestamp = Date.now();
    return `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&_t=${timestamp}`;
  }
  return url;
}

/**
 * RFC 4180 compliant CSV parser that correctly handles:
 * - multi-line cell values inside quotes
 * - escaped quotes ("")
 * - commas inside quoted strings
 * - CRLF and LF line endings
 */
export function parseCSV(text: string): string[][] {
  const result: string[][] = [];
  let row: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"' && inQuotes && nextChar === '"') {
      current += '"';
      i++;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      row.push(current.trim());
      current = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') i++;
      row.push(current.trim());
      if (row.some(cell => cell.length > 0)) {
        result.push(row);
      }
      row = [];
      current = '';
    } else {
      current += char;
    }
  }

  if (current.length > 0 || row.length > 0) {
    row.push(current.trim());
    if (row.some(cell => cell.length > 0)) {
      result.push(row);
    }
  }

  return result;
}

/**
 * Maps parsed CSV rows to strongly-typed ProgramItem array
 */
export function convertCsvRowsToProgramItems(rows: string[][]): ProgramItem[] {
  if (rows.length < 2) return [];

  const headers = rows[0].map(h => h.trim().replace(/\s+/g, ''));
  const dataRows = rows.slice(1);

  // Column index resolvers
  const getColIndex = (keywords: string[]): number => {
    return headers.findIndex(h => keywords.some(k => h.includes(k)));
  };

  const idxOrder = getColIndex(['순서', 'order', '번호']);
  const idxActTitle = getColIndex(['악장구분', '악장', 'actTitle', '파트', 'part']);
  const idxSongTitle = getColIndex(['곡명', '제목', 'songTitle', '찬양곡']);
  const idxTheme = getColIndex(['테마', '소제목', 'theme']);
  const idxScripture = getColIndex(['성경구절', '성경', 'scripture', '말씀']);
  const idxPerformer = getColIndex(['출연진', '찬양자', 'performer', '연주자']);
  const idxImageUrl = getColIndex(['사진URL', '사진url', 'imageUrl', '이미지', '사진']);
  const idxImageCaption = getColIndex(['사진설명', '캡션', 'imageCaption']);
  const idxLyrics = getColIndex(['가사글귀', '가사', 'lyrics', '글귀', '본문']);
  const idxCommentary = getColIndex(['곡해설', '해설', '묵상', 'commentary', '설명']);
  const idxDuration = getColIndex(['연주시간', '시간', 'duration', '소요시간']);

  return dataRows
    .filter(row => row.some(c => c.trim().length > 0))
    .map((row, index) => {
      const orderRaw = idxOrder !== -1 && row[idxOrder] ? parseInt(row[idxOrder].replace(/[^0-9]/g, ''), 10) : (index + 1);
      const actTitle = idxActTitle !== -1 && row[idxActTitle] ? row[idxActTitle].trim() : `Part ${index + 1}`;
      const songTitle = idxSongTitle !== -1 && row[idxSongTitle] ? row[idxSongTitle].trim() : `찬양 ${index + 1}`;
      const theme = idxTheme !== -1 && row[idxTheme] ? row[idxTheme].trim() : '';
      const scripture = idxScripture !== -1 && row[idxScripture] ? row[idxScripture].trim() : '';
      const performer = idxPerformer !== -1 && row[idxPerformer] ? row[idxPerformer].trim() : '';
      const imageUrl = idxImageUrl !== -1 && row[idxImageUrl]?.startsWith('http') 
        ? row[idxImageUrl].trim() 
        : 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80';
      const imageCaption = idxImageCaption !== -1 && row[idxImageCaption] ? row[idxImageCaption].trim() : '';
      const lyrics = idxLyrics !== -1 && row[idxLyrics] ? row[idxLyrics].trim() : '';
      const commentary = idxCommentary !== -1 && row[idxCommentary] ? row[idxCommentary].trim() : '';
      const duration = idxDuration !== -1 && row[idxDuration] ? row[idxDuration].trim() : '';

      return {
        id: `prog-sheet-${index + 1}`,
        order: isNaN(orderRaw) ? index + 1 : orderRaw,
        actTitle,
        songTitle,
        theme,
        scripture,
        performer,
        imageUrl,
        imageCaption,
        lyrics,
        commentary,
        duration
      };
    })
    .sort((a, b) => a.order - b.order);
}

/**
 * Main fetch function: supports both direct Google Sheet CSV export AND Google Apps Script JSON web app URL
 */
export async function fetchLiveGoogleSheetData(sheetUrl: string): Promise<{
  items: ProgramItem[];
  metadata?: Partial<BrochureData['metadata']>;
} | null> {
  if (!sheetUrl || !sheetUrl.trim()) return null;

  const trimmedUrl = sheetUrl.trim();

  try {
    // Case 1: Standard Google Spreadsheet URL (docs.google.com/spreadsheets/d/...)
    if (trimmedUrl.includes('docs.google.com/spreadsheets')) {
      const csvUrl = getGoogleSheetCsvUrl(trimmedUrl);
      const response = await fetch(csvUrl, {
        method: 'GET',
        headers: { 'Accept': 'text/csv, text/plain, */*' },
        cache: 'no-cache'
      });

      if (!response.ok) {
        throw new Error(`Google Sheets fetch failed with status: ${response.status}`);
      }

      const csvText = await response.text();
      const rows = parseCSV(csvText);
      const items = convertCsvRowsToProgramItems(rows);

      if (items.length > 0) {
        return { items };
      }
      return null;
    }

    // Case 2: Google Apps Script Web App JSON endpoint
    if (trimmedUrl.includes('script.google.com') || trimmedUrl.includes('/api/')) {
      const response = await fetch(trimmedUrl, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        cache: 'no-cache'
      });

      if (!response.ok) {
        throw new Error(`Web App endpoint failed with status: ${response.status}`);
      }

      const json = await response.json();
      if (json && json.items && Array.isArray(json.items)) {
        const mappedItems: ProgramItem[] = json.items.map((it: Partial<ProgramItem>, idx: number) => ({
          id: it.id || `item-sheet-${idx + 1}`,
          order: typeof it.order === 'number' ? it.order : (idx + 1),
          actTitle: it.actTitle || `Part ${idx + 1}`,
          songTitle: it.songTitle || '찬양 곡명',
          theme: it.theme || '',
          scripture: it.scripture || '',
          performer: it.performer || '',
          imageUrl: it.imageUrl || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
          imageCaption: it.imageCaption || '',
          lyrics: it.lyrics || '',
          commentary: it.commentary || '',
          duration: it.duration || ''
        }));
        mappedItems.sort((a, b) => a.order - b.order);
        return { items: mappedItems, metadata: json.metadata };
      }
    }

    return null;
  } catch (error) {
    console.error('Error fetching live Google Sheet data:', error);
    return null;
  }
}
