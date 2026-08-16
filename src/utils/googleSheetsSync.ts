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

  // Robust column index resolvers with exact matching first and positional fallback
  const getColIndex = (keywords: string[], fallbackPos?: number): number => {
    // 1. Exact match (ignoring case)
    const exactIdx = headers.findIndex(h => keywords.some(k => h.toLowerCase() === k.toLowerCase()));
    if (exactIdx !== -1) return exactIdx;

    // 2. Partial match (avoiding false positive collisions like '설명' matching '사진설명')
    const partialIdx = headers.findIndex(h => {
      const lower = h.toLowerCase();
      return keywords.some(k => {
        const kLower = k.toLowerCase();
        if ((kLower === '설명' || kLower === '해설') && lower.includes('사진')) return false;
        if (kLower === '사진' && (lower.includes('설명') || lower.includes('url') || lower.includes('링크'))) return false;
        return lower.includes(kLower);
      });
    });
    if (partialIdx !== -1) return partialIdx;

    // 3. Positional fallback if valid
    if (fallbackPos !== undefined && headers.length > fallbackPos) {
      return fallbackPos;
    }
    return -1;
  };

  // Google Sheet Column Layout for 행사순서:
  // A(0): 순서, B(1): 악장구분, C(2): 곡명, D(3): 테마, E(4): 성경구절,
  // F(5): 출연진, G(6): 사진URL, H(7): 사진설명, I(8): 가사글귀, J(9): 곡해설, K(10): 연주시간
  const idxOrder = getColIndex(['순서', 'order', '번호', 'no'], 0);
  const idxActTitle = getColIndex(['악장구분', '악장', 'acttitle', 'act', '파트', 'part', '구분'], 1);
  const idxSongTitle = getColIndex(['곡명', '제목', 'songtitle', 'title', '찬양곡'], 2);
  const idxTheme = getColIndex(['테마', '소제목', 'theme'], 3);
  const idxScripture = getColIndex(['성경구절', '성경', 'scripture', '말씀'], 4);
  const idxPerformer = getColIndex(['출연진', '찬양자', 'performer', '연주자', '출연'], 5);
  const idxImageUrl = getColIndex(['사진url', 'imageurl', '사진링크', '이미지url', '사진'], 6);
  const idxImageCaption = getColIndex(['사진설명', 'imagecaption', '사진설명글', '캡션'], 7);
  const idxLyrics = getColIndex(['가사글귀', '가사', 'lyrics', '글귀', '본문'], 8);
  const idxCommentary = getColIndex(['곡해설', '해설', '묵상', 'commentary', '곡설명', '설명'], 9);
  const idxDuration = getColIndex(['연주시간', 'duration', '소요시간', '시간'], 10);

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
      // J열: 곡해설 (Commentary)
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
        
        let gbList: GuestbookEntry[] | undefined = undefined;
        if (json.guestbook && Array.isArray(json.guestbook)) {
          gbList = json.guestbook.map((g: any, idx: number) => ({
            id: g.id || `gb-sheet-${idx + 1}`,
            name: g.name || '성도',
            message: g.message || '',
            createdAt: g.createdAt || ''
          })).filter((g: GuestbookEntry) => g.message.trim().length > 0);
        }

        return { items: mappedItems, metadata: json.metadata, guestbook: gbList };
      }
    }

    return null;
  } catch (error) {
    console.error('Error fetching live Google Sheet data:', error);
    return null;
  }
}

/**
 * Sends a newly created guestbook entry directly to Google Apps Script / Google Sheet
 */
export async function sendGuestbookEntryToSheet(
  sheetUrl: string | undefined,
  entry: GuestbookEntry
): Promise<{ success: boolean; isSpreadsheetOnly?: boolean; message?: string }> {
  if (!sheetUrl || !sheetUrl.trim()) {
    return { success: false, message: '구글 시트 연동 URL이 설정되지 않았습니다.' };
  }

  const trimmedUrl = sheetUrl.trim();

  // 1. Google Apps Script Web App Endpoint (https://script.google.com/macros/s/.../exec)
  if (trimmedUrl.includes('script.google.com') || trimmedUrl.includes('/exec')) {
    try {
      // Try POST with text/plain (avoids CORS preflight in Google Apps Script)
      const postPayload = {
        action: 'add_guestbook',
        entry: {
          id: entry.id,
          name: entry.name,
          message: entry.message,
          createdAt: entry.createdAt
        }
      };

      const response = await fetch(trimmedUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify(postPayload)
      });

      if (response.ok) {
        return { success: true, message: '구글 스프레드시트에 방명록이 성공적으로 기록되었습니다.' };
      }
    } catch {
      // If POST hits CORS redirect policy in browser, fallback to GET query param with mode: 'no-cors'
      try {
        const getUrl = `${trimmedUrl}${trimmedUrl.includes('?') ? '&' : '?'}action=add_guestbook&name=${encodeURIComponent(entry.name)}&message=${encodeURIComponent(entry.message)}&createdAt=${encodeURIComponent(entry.createdAt)}&_t=${Date.now()}`;
        await fetch(getUrl, { method: 'GET', mode: 'no-cors' });
        return { success: true, message: '구글 스프레드시트에 방명록이 기록되었습니다.' };
      } catch (getErr) {
        console.error('Fallback GET guestbook save error:', getErr);
      }
    }
  }

  // 2. Direct Spreadsheet URL (docs.google.com/spreadsheets/d/...)
  // Note: Google Docs read URL cannot directly accept client-side POST writes without Apps Script Web App
  if (trimmedUrl.includes('docs.google.com/spreadsheets')) {
    return {
      success: false,
      isSpreadsheetOnly: true,
      message: '현재 구글 시트 URL은 읽기 전용 상태입니다. 실시간 방명록 자동 저장을 위해 [설정 > 시트 연동]에서 Apps Script 웹앱 URL을 배포하여 등록해주세요.'
    };
  }

  return { success: false, message: '유효한 연동 URL이 아닙니다.' };
}

