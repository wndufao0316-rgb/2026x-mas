import { ProgramItem, BrochureMetadata, BrochureData, GuestbookEntry } from '../types';

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
export function getGoogleSheetCsvUrl(url: string, sheetNameOrGid?: string): string {
  const sheetId = extractGoogleSheetId(url);
  if (sheetId) {
    const timestamp = Date.now();
    if (sheetNameOrGid) {
      if (/^\d+$/.test(sheetNameOrGid)) {
        return `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${sheetNameOrGid}&_t=${timestamp}`;
      } else {
        return `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetNameOrGid)}&_t=${timestamp}`;
      }
    }
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
 * Maps parsed CSV rows from '행사순서' tab to ProgramItem array
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
 * Maps parsed key-value CSV rows from '행사정보' tab to BrochureMetadata
 */
export function convertCsvRowsToMetadata(rows: string[][]): Partial<BrochureMetadata> {
  if (rows.length < 2) return {};

  const metadata: Partial<BrochureMetadata> = {};
  
  rows.slice(1).forEach(row => {
    if (row.length >= 2 && row[0]?.trim()) {
      const key = row[0].trim() as keyof BrochureMetadata;
      const value = row[1];
      if (value !== undefined) {
        // Enforce prompt instructions:
        if (key === 'welcomePage2Subtitle' && (!value || value.toLowerCase().includes('reflection'))) {
          metadata.welcomePage2Subtitle = 'PROLOG';
        } else if (key === 'welcomeSubtitle' && (!value || value.toLowerCase().includes('invocation'))) {
          metadata.welcomeSubtitle = 'INTRODUCTION';
        } else if (key === 'tocSubtitle' && (!value || value.toLowerCase().includes('worship'))) {
          metadata.tocSubtitle = 'Event Schedule';
        } else {
          metadata[key] = value as any;
        }
      }
    }
  });

  return metadata;
}

/**
 * Maps parsed CSV rows from '방명록' tab to GuestbookEntry array
 */
export function convertCsvRowsToGuestbook(rows: string[][]): GuestbookEntry[] {
  if (rows.length < 2) return [];

  const dataRows = rows.slice(1);
  return dataRows
    .filter(row => row.some(c => c.trim().length > 0))
    .map((row, index) => {
      const createdAt = row[0] ? row[0].trim() : new Date().toISOString().slice(0, 10);
      const name = row[1] ? row[1].trim() : '익명의 성도';
      const message = row[2] ? row[2].trim() : '';

      return {
        id: `gb-sheet-${index + 1}`,
        name,
        message,
        createdAt
      };
    })
    .filter(entry => entry.message.length > 0);
}

/**
 * Helper to fetch a single sheet as CSV text
 */
async function fetchSheetCsv(sheetId: string, sheetNameOrGid: string): Promise<string[][]> {
  const url = getGoogleSheetCsvUrl(`https://docs.google.com/spreadsheets/d/${sheetId}/edit`, sheetNameOrGid);
  const response = await fetch(url, {
    method: 'GET',
    headers: { 'Accept': 'text/csv, text/plain, */*' },
    cache: 'no-cache'
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch sheet: ${sheetNameOrGid} (${response.status})`);
  }
  const text = await response.text();
  return parseCSV(text);
}

/**
 * Main fetch function: supports both direct Google Sheet tabs AND Google Apps Script JSON web app URL
 */
export async function fetchLiveGoogleSheetData(sheetUrl: string): Promise<{
  items: ProgramItem[];
  metadata?: Partial<BrochureData['metadata']>;
  guestbook?: GuestbookEntry[];
} | null> {
  if (!sheetUrl || !sheetUrl.trim()) return null;

  const trimmedUrl = sheetUrl.trim();

  try {
    // Case 1: Standard Google Spreadsheet URL (docs.google.com/spreadsheets/d/...)
    if (trimmedUrl.includes('docs.google.com/spreadsheets')) {
      const sheetId = extractGoogleSheetId(trimmedUrl);
      if (!sheetId) return null;

      let items: ProgramItem[] = [];
      let metadata: Partial<BrochureMetadata> = {};
      let guestbook: GuestbookEntry[] = [];

      // 1. Fetch '행사순서' (Prog Items) - Try sheet name first, then known GID 1367178154, then fallback
      try {
        const progRows = await fetchSheetCsv(sheetId, '행사순서');
        if (progRows.length > 1) {
          items = convertCsvRowsToProgramItems(progRows);
        }
      } catch {
        try {
          const progRows = await fetchSheetCsv(sheetId, '1367178154');
          if (progRows.length > 1) items = convertCsvRowsToProgramItems(progRows);
        } catch {
          // Fallback to default export
          const progRows = await fetchSheetCsv(sheetId, '0');
          if (progRows.length > 1) items = convertCsvRowsToProgramItems(progRows);
        }
      }

      // 2. Fetch '행사정보' (Metadata - 행사정보 탭)
      try {
        const metaRows = await fetchSheetCsv(sheetId, '행사정보');
        if (metaRows.length > 1) {
          metadata = convertCsvRowsToMetadata(metaRows);
        }
      } catch {
        try {
          const metaRows = await fetchSheetCsv(sheetId, '921148992');
          if (metaRows.length > 1) metadata = convertCsvRowsToMetadata(metaRows);
        } catch (e) {
          console.warn('Metadata tab fetch failed, retaining existing metadata', e);
        }
      }

      // 3. Fetch '방명록' (Guestbook)
      try {
        const gbRows = await fetchSheetCsv(sheetId, '방명록');
        if (gbRows.length > 1) {
          guestbook = convertCsvRowsToGuestbook(gbRows);
        }
      } catch {
        try {
          const gbRows = await fetchSheetCsv(sheetId, '1663618309');
          if (gbRows.length > 1) guestbook = convertCsvRowsToGuestbook(gbRows);
        } catch (e) {
          console.warn('Guestbook tab fetch failed', e);
        }
      }

      return {
        items: items.length > 0 ? items : [],
        metadata: Object.keys(metadata).length > 0 ? metadata : undefined,
        guestbook: guestbook.length > 0 ? guestbook : undefined
      };
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
        return { items: mappedItems, metadata: json.metadata, guestbook: json.guestbook };
      }
    }

    return null;
  } catch (error) {
    console.error('Error fetching live Google Sheet data:', error);
    return null;
  }
}
