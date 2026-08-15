export interface ProgramItem {
  id: string;
  order: number; // 먼저 작성/등록된 항목이 앞으로 오도록 오름차순 정렬
  actTitle: string; // 예: "서곡 (Overture)", "제1부 : 창조의 섭리"
  songTitle: string; // 예: "태초의 빛과 호흡"
  theme?: string; // 테마/소제목
  scripture?: string; // 성경 구절 또는 핵심 표어
  performer?: string; // 출연진/찬양자
  imageUrl: string; // 사진
  imageCaption?: string; // 사진 캡션
  lyrics: string; // 주요 가사 또는 글귀
  commentary: string; // 해설 및 묵상
  duration?: string; // 연주 시간
}

export interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  createdAt: string;
}

export interface BrochureMetadata {
  concertSubtitle: string; // "JOSHUA JEONG_PRAISE CONCERT"
  concertTitle: string; // "운명(運命): 창조의 뜻"
  themeQuote: string; // "모든 호흡이 있는 자마다 여호와를 찬양할지어다"
  date: string; // "2026. 09. 20 (SUN) 19:00"
  venue: string; // "헤리티지 콘서트홀 (Heritage Hall)"
  welcomeHeading?: string; // "초대의 글"
  welcomeSubtitle?: string; // "Invocation & Welcome"
  welcomeDedicationHeader?: string; // "운명(運命): 창조의 뜻에 부쳐"
  welcomeMessage: string;
  
  // Page 3: Welcome with Photo
  welcomePage2Heading?: string; // "초대의 글"
  welcomePage2Subtitle?: string; // "Reflection & Photo"
  welcomePage2DedicationHeader?: string; // "은혜의 여정을 함께하며"
  welcomePage2ImageUrl?: string; // 사진
  welcomePage2ImageCaption?: string; // 사진 설명
  welcomePage2Message?: string; // 글귀

  dedicationText: string;
  tocHeading?: string; // "행사 순서"
  tocSubtitle?: string; // "Order of Worship"
}

export interface BrochureData {
  metadata: BrochureMetadata;
  items: ProgramItem[];
  guestbook?: GuestbookEntry[];
  googleSheetUrl?: string;
  lastSynced?: string;
}

export type ViewMode = 'cover' | 'toc' | 'program' | 'welcome' | 'epilogue';
