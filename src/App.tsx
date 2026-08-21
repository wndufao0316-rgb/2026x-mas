import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, ChevronLeft, ChevronRight, Volume2, VolumeX, 
  Edit3, ListOrdered, Sparkles, Sheet, Plus, CloudUpload, Check, AlertCircle
} from 'lucide-react';
import { BrochureData, ProgramItem, BrochureMetadata, GuestbookEntry } from './types';
import { initialBrochureData } from './data/defaultProgram';
import { fetchLiveGoogleSheetData, sendGuestbookEntryToSheet, mergeGuestbookEntries } from './utils/googleSheetsSync';
import { sounds } from './utils/soundEffects';
import { BookCover } from './components/BookCover';
import { WelcomePage } from './components/WelcomePage';
import { WelcomePhotoPage } from './components/WelcomePhotoPage';
import { TableOfContents } from './components/TableOfContents';
import { ProgramPage } from './components/ProgramPage';
import { GuestbookPage } from './components/GuestbookPage';
import { SyncSheetModal } from './components/SyncSheetModal';
import { CodeViewerModal } from './components/CodeViewerModal';
import { EditImageModal } from './components/EditImageModal';
import { PhotoViewerModal } from './components/PhotoViewerModal';
import { EditTextModal } from './components/EditTextModal';
import { EditMetadataModal } from './components/EditMetadataModal';
import { AdminAuthModal } from './components/AdminAuthModal';

const STORAGE_KEY = 'joshua_jeong_praise_brochure_v4';

export default function App() {
  // 1. Data State with LocalStorage Persistence
  const [brochureData, setBrochureData] = useState<BrochureData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...initialBrochureData,
          ...parsed,
          metadata: {
            ...initialBrochureData.metadata,
            ...(parsed.metadata || {})
          }
        };
      }
    } catch {
      // Fallback
    }
    return initialBrochureData;
  });

  // 2. Navigation State
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [direction, setDirection] = useState<number>(1);
  const [isFlipping, setIsFlipping] = useState<boolean>(false);

  // 3. Direct Edit & Dialog States
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [showAdminAuthModal, setShowAdminAuthModal] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [showSyncModal, setShowSyncModal] = useState<boolean>(false);
  const [showCodeViewer, setShowCodeViewer] = useState<boolean>(false);
  const [isSavingToSheet, setIsSavingToSheet] = useState<boolean>(false);
  const [toastInfo, setToastInfo] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Toast notification helper
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastInfo({ message, type });
    setTimeout(() => {
      setToastInfo(null);
    }, 4500);
  };

  // 4. Modals for Text Editing & Images
  const [textModalState, setTextModalState] = useState<{
    isOpen: boolean;
    item: ProgramItem | null;
    field: 'lyrics' | 'commentary' | 'all';
  }>({
    isOpen: false,
    item: null,
    field: 'lyrics'
  });

  const [metadataModalState, setMetadataModalState] = useState<{
    isOpen: boolean;
    pageType: 'cover' | 'welcome' | 'welcome2' | 'epilogue' | 'all';
  }>({
    isOpen: false,
    pageType: 'cover'
  });

  const [imageModalState, setImageModalState] = useState<{
    isOpen: boolean;
    itemId: string;
    targetField?: 'item' | 'welcome2';
    currentUrl: string;
  }>({
    isOpen: false,
    itemId: '',
    targetField: 'item',
    currentUrl: ''
  });

  const [photoViewerState, setPhotoViewerState] = useState<{
    isOpen: boolean;
    url: string;
    title: string;
    caption?: string;
  }>({
    isOpen: false,
    url: '',
    title: '',
    caption: ''
  });

  // 5. Sound Toggle
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Save to LocalStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(brochureData));
    } catch {
      // Storage quota or private browsing fallback
    }
  }, [brochureData]);

  useEffect(() => {
    sounds.enabled = soundEnabled;
  }, [soundEnabled]);

  // Sort items in ascending order
  const sortedItems = useMemo(() => {
    return [...brochureData.items].sort((a, b) => a.order - b.order);
  }, [brochureData.items]);

  // Total pages:
  // 0: Cover
  // 1: Welcome (Intro I)
  // 2: Welcome with Photo (Intro II)
  // 3: Table of Contents (TOC)
  // 4 ~ 4 + items.length - 1: Program Items
  // 4 + items.length: Epilogue
  // 4 + items.length + 1: Guestbook (Final Page)
  const totalPages = 5 + sortedItems.length;

  // Touch Swipe Support with Edit-Safety
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    const target = e.target as HTMLElement;
    if (
      target.closest('input') || 
      target.closest('textarea') || 
      target.closest('button') || 
      target.closest('[contenteditable="true"]')
    ) {
      touchStartXRef.current = null;
      touchStartYRef.current = null;
      return;
    }
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    const deltaY = e.changedTouches[0].clientY - touchStartYRef.current;

    // Check horizontal swipe
    if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
      if (deltaX < 0) {
        goToNextPage();
      } else {
        goToPrevPage();
      }
    }
    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  // Keyboard navigation without hijacking text input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      if (
        ['input', 'textarea', 'select'].includes(target.tagName.toLowerCase()) || 
        target.isContentEditable ||
        target.closest('[contenteditable="true"]')
      ) {
        return;
      }
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        goToNextPage();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        goToPrevPage();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, totalPages]);

  // Page Transitions (Left Axis Origin)
  const goToPage = (pageNumber: number) => {
    if (pageNumber === currentPage || pageNumber < 0 || pageNumber >= totalPages) return;
    setDirection(pageNumber > currentPage ? 1 : -1);
    setIsFlipping(true);
    if (pageNumber === 0) {
      sounds.playBookOpen();
    } else {
      sounds.playPageFlip();
    }
    setCurrentPage(pageNumber);
    setTimeout(() => setIsFlipping(false), 500);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      goToPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 0) {
      goToPage(currentPage - 1);
    }
  };

  // Open Book from Cover
  const handleOpenBook = () => {
    sounds.playBookOpen();
    goToPage(1);
  };

  // Auto-sync latest data from Google Sheets in background on startup
  useEffect(() => {
    const autoSync = async () => {
      const savedScriptUrl = typeof window !== 'undefined' ? localStorage.getItem('brochure_apps_script_url') : null;
      const url = savedScriptUrl || brochureData.googleSheetUrl || initialBrochureData.googleSheetUrl;
      if (url) {
        try {
          const result = await fetchLiveGoogleSheetData(url);
          if (result) {
            setBrochureData(prev => ({
              ...prev,
              items: result.items && result.items.length > 0 ? result.items : prev.items,
              metadata: result.metadata ? { ...prev.metadata, ...result.metadata } : prev.metadata,
              guestbook: result.guestbook !== undefined ? result.guestbook : prev.guestbook,
              googleSheetUrl: prev.googleSheetUrl || url,
              appsScriptUrl: savedScriptUrl || prev.appsScriptUrl,
              lastSynced: new Date().toISOString()
            }));
          }
        } catch (e) {
          console.warn('Initial auto-sync error:', e);
        }
      }
    };
    autoSync();
  }, []);

  // Google Sheets Fetching Logic (Sheet -> Web App)
  const handleSyncGoogleSheet = async (webAppUrl?: string): Promise<boolean> => {
    const targetUrl = (webAppUrl || brochureData.appsScriptUrl || brochureData.googleSheetUrl || initialBrochureData.googleSheetUrl || '').trim();
    if (!targetUrl) {
      showToast('구글 시트 URL을 입력해주세요.', 'error');
      return false;
    }

    try {
      const result = await fetchLiveGoogleSheetData(targetUrl);
      if (result) {
        const isScript = targetUrl.includes('script.google.com');
        const itemCount = result.items?.length || 0;
        
        setBrochureData(prev => ({
          ...prev,
          items: itemCount > 0 ? result.items : prev.items,
          metadata: result.metadata ? { ...prev.metadata, ...result.metadata } : prev.metadata,
          guestbook: result.guestbook !== undefined ? result.guestbook : prev.guestbook,
          googleSheetUrl: !isScript ? targetUrl : (prev.googleSheetUrl || targetUrl),
          appsScriptUrl: isScript ? targetUrl : prev.appsScriptUrl,
          lastSynced: new Date().toISOString()
        }));

        if (isScript && typeof window !== 'undefined') {
          localStorage.setItem('brochure_apps_script_url', targetUrl);
        }

        sounds.playChime();
        if (itemCount > 0) {
          showToast(`구글 스프레드시트에서 행사순서 ${itemCount}곡 및 최신 데이터가 성공적으로 동기화되었습니다.`, 'success');
        } else {
          showToast('구글 시트와 연결되었습니다. 행사정보 및 방명록이 최신화되었습니다.', 'success');
        }
        return true;
      }
      throw new Error('데이터를 가져올 수 없습니다.');
    } catch (err) {
      console.error('Fetch Google Sheet error:', err);
      showToast('구글 시트 불러오기 실패: URL 및 시트 공개 범위([링크가 있는 모든 사용자에게 공개])를 확인해주세요.', 'error');
      return false;
    }
  };

  // Google Sheets Saving Logic (Web App -> Sheet)
  const handleSaveToGoogleSheet = async (webAppUrl?: string): Promise<boolean> => {
    const targetUrl = (webAppUrl || brochureData.appsScriptUrl || brochureData.googleSheetUrl || '').trim();
    if (!targetUrl) {
      setShowSyncModal(true);
      return false;
    }

    if (!targetUrl.includes('script.google.com')) {
      showToast('구글 시트 원본 링크(docs.google.com)는 브라우저 보안상 읽기 전용입니다. 웹앱 내용을 시트에 직접 저장하시려면 [설정 > 시트 연동]에서 Apps Script 웹 앱 URL을 등록해주세요.', 'info');
      return false;
    }

    setIsSavingToSheet(true);
    try {
      const payload = {
        action: 'save',
        items: brochureData.items,
        metadata: brochureData.metadata,
        guestbook: brochureData.guestbook || []
      };

      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify(payload)
      });

      let resJson: any = null;
      try {
        resJson = await response.json();
      } catch {
        // May be opaque redirect from Apps Script
      }

      setBrochureData(prev => ({
        ...prev,
        appsScriptUrl: targetUrl,
        lastSynced: new Date().toISOString()
      }));

      if (typeof window !== 'undefined') {
        localStorage.setItem('brochure_apps_script_url', targetUrl);
      }

      sounds.playChime();
      showToast(resJson?.message || '웹앱에서 수정한 모든 글귀와 사진이 구글 시트에 성공적으로 저장되었습니다!', 'success');
      return true;
    } catch (err: any) {
      console.error('Error saving to Google Sheet:', err);
      showToast('구글 시트 저장 실패: Google Apps Script 배포 설정 및 Code.gs를 확인해주세요.', 'error');
      return false;
    } finally {
      setIsSavingToSheet(false);
    }
  };

  // Update a single item (inline edits or modal edits)
  const handleUpdateItem = (updated: ProgramItem) => {
    setBrochureData(prev => ({
      ...prev,
      items: prev.items.map(item => item.id === updated.id ? updated : item)
    }));
  };

  // Update brochure metadata
  const handleUpdateMetadata = (updated: BrochureMetadata) => {
    setBrochureData(prev => ({
      ...prev,
      metadata: updated
    }));
  };

  // Add new item
  const handleAddNewItem = () => {
    const nextOrder = (brochureData.items.length > 0
      ? Math.max(...brochureData.items.map(i => i.order))
      : 0) + 1;

    const newItem: ProgramItem = {
      id: `prog-${Date.now()}`,
      order: nextOrder,
      actTitle: `제${nextOrder}악장 : 새로운 찬양`,
      songTitle: '새로운 은혜의 찬양',
      theme: '창조의 섭리를 노래함',
      scripture: '시편 150:6',
      performer: '찬양팀 & 오케스트라',
      imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
      imageCaption: '기록된 찬양과 묵상의 순간',
      lyrics: '여호와를 찬양하라 그의 위대하심을 찬양하라\n모든 호흡이 있는 자마다 여호와를 찬양할지어다.',
      commentary: '새롭게 추가된 찬양 순서입니다. 클릭하여 해설과 가사를 수정하세요.',
      duration: '05:00'
    };

    setBrochureData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));

    // Jump to the newly added item page
    setTimeout(() => {
      goToPage(2 + brochureData.items.length);
    }, 100);
  };

  // State for guestbook refreshing
  const [isRefreshingGuestbook, setIsRefreshingGuestbook] = useState(false);

  // Add new guestbook entry with real-time Google Sheet sync
  const handleAddGuestbookEntry = async (name: string, message: string) => {
    const now = new Date();
    const formattedDate = `${now.getFullYear()}. ${String(now.getMonth() + 1).padStart(2, '0')}. ${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const newEntry: GuestbookEntry = {
      id: `gb-${Date.now()}`,
      name,
      message,
      createdAt: formattedDate
    };

    // Immediate local state update for instant UI feedback
    setBrochureData(prev => ({
      ...prev,
      guestbook: [newEntry, ...(prev.guestbook || [])]
    }));

    // Real-time synchronization with Google Sheets (Apps Script Web App)
    const scriptUrl = brochureData.appsScriptUrl || 
      (brochureData.googleSheetUrl?.includes('script.google.com') ? brochureData.googleSheetUrl : '') ||
      (typeof window !== 'undefined' ? localStorage.getItem('brochure_apps_script_url') || '' : '');
      
    const effectiveSheetUrl = scriptUrl || brochureData.googleSheetUrl;

    if (effectiveSheetUrl) {
      try {
        const syncResult = await sendGuestbookEntryToSheet(effectiveSheetUrl, newEntry);
        if (syncResult.success) {
          showToast('방명록이 구글 스프레드시트 3번째 탭(방명록)에 성공적으로 저장되었습니다.', 'success');
        } else if (syncResult.isSpreadsheetOnly) {
          showToast('방명록이 등록되었습니다. (구글 시트 3번째 탭에 자동 기록되도록 [설정 > 시트 연동]에서 Apps Script 웹앱 URL을 연동해주세요.)', 'info');
        }
      } catch (err) {
        console.warn('Real-time guestbook sync error:', err);
      }
    }
  };

  // Refresh guestbook from Google Sheet
  const handleRefreshGuestbook = async () => {
    const targetUrl = brochureData.appsScriptUrl || brochureData.googleSheetUrl || (typeof window !== 'undefined' ? localStorage.getItem('brochure_apps_script_url') : null);
    if (!targetUrl) {
      showToast('연동된 구글 시트 URL이 없습니다.', 'error');
      return;
    }
    
    setIsRefreshingGuestbook(true);
    try {
      const liveData = await fetchLiveGoogleSheetData(targetUrl);
      if (liveData && liveData.guestbook !== undefined) {
        setBrochureData(prev => ({
          ...prev,
          guestbook: liveData.guestbook || []
        }));
        showToast(
          liveData.guestbook.length > 0 
            ? '구글 시트에서 최신 방명록을 성공적으로 동기화했습니다.' 
            : '구글 시트와 동기화되었습니다. (방명록이 비어있음)',
          'success'
        );
      } else {
        showToast('방명록이 최신 상태입니다.', 'info');
      }
    } catch (e) {
      console.warn('Refresh guestbook error:', e);
      showToast('방명록을 불러오는 중 오류가 발생했습니다.', 'error');
    } finally {
      setIsRefreshingGuestbook(false);
    }
  };

  // Delete guestbook entry
  const handleDeleteGuestbookEntry = (id: string) => {
    setBrochureData(prev => ({
      ...prev,
      guestbook: (prev.guestbook || []).filter(e => e.id !== id)
    }));
  };

  // Reset to default
  const handleResetToDefault = () => {
    setBrochureData(initialBrochureData);
    localStorage.removeItem(STORAGE_KEY);
    setCurrentPage(0);
  };

  // Render current page content
  const renderCurrentPageContent = () => {
    // Page 0: Cover
    if (currentPage === 0) {
      return (
        <BookCover
          metadata={brochureData.metadata}
          isEditMode={isEditMode}
          onUpdateMetadata={handleUpdateMetadata}
          onOpenEditModal={() => setMetadataModalState({ isOpen: true, pageType: 'cover' })}
          onOpenBook={handleOpenBook}
        />
      );
    }

    // Page 1: Welcome Intro I (Photo + Message Box)
    if (currentPage === 1) {
      return (
        <WelcomePhotoPage
          metadata={brochureData.metadata}
          isEditMode={isEditMode}
          onUpdateMetadata={handleUpdateMetadata}
          onOpenEditModal={() => setMetadataModalState({ isOpen: true, pageType: 'welcome2' })}
          onOpenImageModal={(url) => setImageModalState({ isOpen: true, itemId: '', targetField: 'welcome2', currentUrl: url })}
          onOpenPhotoViewer={(url, title, caption) => setPhotoViewerState({ isOpen: true, url, title, caption })}
        />
      );
    }

    // Page 2: Welcome Intro II (Text-focused)
    if (currentPage === 2) {
      return (
        <WelcomePage
          metadata={brochureData.metadata}
          isEditMode={isEditMode}
          onUpdateMetadata={handleUpdateMetadata}
          onOpenEditModal={() => setMetadataModalState({ isOpen: true, pageType: 'welcome' })}
        />
      );
    }

    // Page 3: Table of Contents
    if (currentPage === 3) {
      return (
        <TableOfContents
          items={sortedItems}
          metadata={brochureData.metadata}
          onSelectPage={(idx) => goToPage(idx + 4)}
          isEditMode={isEditMode}
          onUpdateItem={handleUpdateItem}
          onUpdateMetadata={handleUpdateMetadata}
          onAddNewItem={handleAddNewItem}
          onOpenImageModal={(itemId, url) => setImageModalState({ isOpen: true, itemId, targetField: 'item', currentUrl: url })}
        />
      );
    }

    // Program items (Page 4 to 4 + items.length - 1)
    const programIndex = currentPage - 4;
    if (programIndex >= 0 && programIndex < sortedItems.length) {
      const item = sortedItems[programIndex];
      return (
        <ProgramPage
          item={item}
          currentIndex={programIndex}
          totalCount={sortedItems.length}
          isEditMode={isEditMode}
          onUpdateItem={handleUpdateItem}
          onOpenImageModal={(itemId, url) => setImageModalState({ isOpen: true, itemId, targetField: 'item', currentUrl: url })}
          onOpenPhotoViewer={(url, title, caption) => setPhotoViewerState({ isOpen: true, url, title, caption })}
          onOpenTextModal={(targetItem, field) => setTextModalState({ isOpen: true, item: targetItem, field })}
        />
      );
    }

    // Guestbook Page (Final Page: 4 + items.length)
    return (
      <GuestbookPage
        metadata={brochureData.metadata}
        entries={brochureData.guestbook || []}
        isEditMode={isEditMode}
        onAddEntry={handleAddGuestbookEntry}
        onDeleteEntry={handleDeleteGuestbookEntry}
        onRefreshGuestbook={handleRefreshGuestbook}
        isRefreshing={isRefreshingGuestbook}
      />
    );
  };

  return (
    <div className="relative min-h-screen w-full bg-natural-ambient flex flex-col items-center justify-center p-2 sm:p-4 overflow-hidden font-serif text-[#3d2b1f]">
      
      {/* Background Classical Study & Candle Ambiance */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Warm Ambient Light Glow in Upper Left & Right */}
        <div className="absolute top-10 left-10 w-80 h-80 rounded-full bg-[#8b5e3c]/15 blur-3xl animate-candle" />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-[#3d2b1f]/30 blur-3xl" />
        
        {/* Subtle radial texture */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent via-[#1a0f08]/40 to-[#1a0f08]/90 pointer-events-none" />
      </div>

      {/* Toast Notification Banner */}
      <AnimatePresence>
        {toastInfo && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-4 z-50 max-w-[90vw] sm:max-w-md px-4 py-2.5 rounded-lg shadow-xl text-xs font-sans font-semibold flex items-center space-x-2 border pointer-events-none"
            style={{
              backgroundColor: toastInfo.type === 'success' ? '#2a1b0a' : toastInfo.type === 'info' ? '#1f2937' : '#5c1d1d',
              borderColor: toastInfo.type === 'success' ? '#dfba73' : toastInfo.type === 'info' ? '#93c5fd' : '#e57373',
              color: '#fdfaf1'
            }}
          >
            {toastInfo.type === 'success' ? (
              <Check className="w-4 h-4 text-[#dfba73] flex-shrink-0" />
            ) : toastInfo.type === 'info' ? (
              <Sparkles className="w-4 h-4 text-sky-300 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            )}
            <span>{toastInfo.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Mode Active Guide Banner (Only displayed when editing) */}
      {isEditMode && (
        <div className="relative z-30 w-full max-w-[430px] mb-1.5 animate-fadeIn">
          <div className="flex items-center justify-between px-3 py-1.5 bg-amber-900/90 border border-amber-500/50 rounded-lg text-[#fdfaf1] text-[11px] font-sans shadow-md backdrop-blur-xs">
            <span className="flex items-center gap-1.5 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>화면 글자를 클릭해 직접 쓰거나 수정하세요</span>
            </span>
            <div className="flex items-center space-x-1.5">
              <button
                onClick={() => setShowSyncModal(true)}
                className="text-[10.5px] text-[#fdfaf1] font-bold bg-[#8b5e3c] hover:bg-[#3d2b1f] px-2 py-0.5 rounded cursor-pointer transition-colors flex items-center space-x-1 shadow-xs border border-amber-400/40"
                title="구글 시트 연동 설정 열기"
              >
                <Sheet className="w-3 h-3 text-[#dfba73]" />
                <span>시트 연동</span>
              </button>
              <button
                onClick={() => handleSaveToGoogleSheet()}
                disabled={isSavingToSheet}
                className="text-[10.5px] text-black font-bold bg-[#dfba73] hover:bg-[#ebd097] px-2 py-0.5 rounded cursor-pointer transition-colors flex items-center space-x-1 shadow-xs"
                title="수정한 모든 글귀와 사진을 구글 스프레드시트에 즉시 반영합니다"
              >
                <CloudUpload className={`w-3 h-3 ${isSavingToSheet ? 'animate-bounce' : ''}`} />
                <span>{isSavingToSheet ? '저장 중...' : '시트에 저장'}</span>
              </button>
              <button
                onClick={() => setIsEditMode(false)}
                className="text-[10px] text-amber-200 hover:text-white font-bold bg-amber-800/90 hover:bg-black px-2 py-0.5 rounded cursor-pointer transition-colors"
              >
                편집 완료
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Header Controls Bar (Small and compact, with direct Edit button) */}
      <header className="relative z-30 w-full max-w-[430px] flex items-center justify-between px-2 py-1 mb-1.5 text-xs text-[#e8e4d8]">
        {/* Left: Concert Mini Badge or TOC Shortcut */}
        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => goToPage(currentPage === 2 ? 0 : 2)}
            className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#3d2b1f] hover:bg-[#2a1b0a] border border-[#8b5e3c]/40 text-[#fdfaf1] transition-all cursor-pointer shadow-xs text-[11px] font-sans"
            title="목차(행사 순서)로 바로가기"
          >
            <ListOrdered className="w-3.5 h-3.5 text-[#dfba73]" />
            <span className="font-semibold tracking-tight">
              {currentPage === 2 ? '표지로' : '행사 순서'}
            </span>
          </button>

          {/* Quick Add Song Button (when in edit mode) */}
          {isEditMode && (
            <button
              onClick={handleAddNewItem}
              className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-[#8b5e3c] hover:bg-[#3d2b1f] text-[#fdfaf1] transition-all cursor-pointer shadow-xs text-[10.5px] font-sans font-bold"
              title="새 찬양 순서 추가"
            >
              <Plus className="w-3 h-3" />
              <span>곡 추가</span>
            </button>
          )}
        </div>

        {/* Right: Small Edit Button & Sound */}
        <div className="flex items-center space-x-1.5">
          {/* Edit Mode Toggle Button (Protected by password) */}
          <button
            onClick={() => {
              if (isEditMode) {
                setIsEditMode(false);
              } else {
                if (isAdminAuthenticated) {
                  setIsEditMode(true);
                } else {
                  setShowAdminAuthModal(true);
                }
              }
            }}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-full border transition-all cursor-pointer shadow-xs text-[11px] font-sans font-bold ${
              isEditMode 
                ? 'bg-[#dfba73] text-black border-[#dfba73] ring-2 ring-amber-400/40' 
                : 'bg-[#3d2b1f] hover:bg-[#2a1b0a] text-[#fdfaf1] border-[#8b5e3c]/40'
            }`}
            title={isEditMode ? '수정 완료 (클릭하여 뷰 모드로 전환)' : '관리자 편집 모드'}
          >
            <Edit3 className={`w-3.5 h-3.5 ${isEditMode ? 'text-black' : 'text-[#dfba73]'}`} />
            <span>{isEditMode ? '✏️ 편집 활성' : '편집 모드'}</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1.5 rounded-full bg-[#3d2b1f] hover:bg-[#2a1b0a] border border-[#8b5e3c]/40 text-[#fdfaf1] transition-all cursor-pointer shadow-xs"
            title={soundEnabled ? '효과음 끄기' : '효과음 켜기'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 opacity-60" />}
          </button>
        </div>
      </header>

      {/* Main 9:16 Mobile Brochure Canvas Container with 3D Left-Axis Book Page Perspective */}
      <main
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative z-20 w-full max-w-[430px] h-[78vh] max-h-[780px] min-h-[560px] perspective-1500 flex items-center justify-center"
      >
        {/* Book Spine Shadow Edge (Left Hinge Axis Visual Anchor) */}
        <div className="absolute -left-2 top-2 bottom-2 w-4 rounded-l-md bg-gradient-to-r from-black/90 via-[#2a1b0a] to-transparent pointer-events-none z-30 hidden sm:block" />

        {/* 3D Animated Book Flipping Page Card (Left Axis Anchor) */}
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentPage}
            custom={direction}
            initial={{
              rotateY: direction > 0 ? 90 : -90,
              opacity: 0.1,
              transformOrigin: "left center"
            }}
            animate={{
              rotateY: 0,
              opacity: 1,
              transformOrigin: "left center"
            }}
            exit={{
              rotateY: direction > 0 ? -90 : 90,
              opacity: 0.1,
              transformOrigin: "left center"
            }}
            transition={{
              duration: 0.48,
              ease: [0.22, 1, 0.36, 1]
            }}
            className="preserve-3d w-full h-full"
            style={{
              transformOrigin: "left center"
            }}
          >
            {renderCurrentPageContent()}
          </motion.div>
        </AnimatePresence>

        {/* Floating Side Page Turn Buttons (Desktop & Tablet Ease) */}
        {currentPage > 0 && (
          <button
            onClick={goToPrevPage}
            className="absolute -left-4 sm:-left-12 top-1/2 -translate-y-1/2 p-2 rounded-full bg-[#3d2b1f]/90 hover:bg-[#2a1b0a] border border-[#8b5e3c]/60 text-[#fdfaf1] hover:text-[#dfba73] shadow-xl transition-all cursor-pointer z-30 backdrop-blur-xs"
            title="이전 페이지"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {currentPage < totalPages - 1 && (
          <button
            onClick={goToNextPage}
            className="absolute -right-4 sm:-right-12 top-1/2 -translate-y-1/2 p-2 rounded-full bg-[#3d2b1f]/90 hover:bg-[#2a1b0a] border border-[#8b5e3c]/60 text-[#fdfaf1] hover:text-[#dfba73] shadow-xl transition-all cursor-pointer z-30 backdrop-blur-xs"
            title="다음 페이지"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </main>

      {/* Bottom Navigation Ribbon & Page Dots */}
      <footer className="relative z-30 w-full max-w-[430px] flex flex-col items-center gap-1.5 mt-2 text-xs">
        {/* Page Dots / Progress bar */}
        <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#2a1b0a]/80 border border-[#8b5e3c]/30 shadow-md">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToPage(idx)}
              className={`transition-all rounded-full cursor-pointer ${
                currentPage === idx
                  ? 'w-4 h-1.5 bg-[#dfba73] shadow-sm'
                  : 'w-1.5 h-1.5 bg-[#8b5e3c]/30 hover:bg-[#8b5e3c]/60'
              }`}
              title={`페이지 ${idx + 1}`}
            />
          ))}
        </div>

        {/* Page Info text & swipe gesture hint */}
        <div className="flex items-center justify-between w-full px-4 text-[10.5px] text-[#8b5e3c] font-sans">
          <span>책장을 터치하거나 좌우로 넘기세요</span>
          <span className="font-bold tracking-widest text-[#d7ccc8]">
            {currentPage === 0 ? 'COVER' : `${currentPage} / ${totalPages - 1}`}
          </span>
        </div>
      </footer>

      {/* Edit Text Modal for lyrics & commentary */}
      <EditTextModal
        isOpen={textModalState.isOpen}
        onClose={() => setTextModalState(prev => ({ ...prev, isOpen: false }))}
        item={textModalState.item}
        field={textModalState.field}
        onSave={handleUpdateItem}
      />

      {/* Edit Metadata Modal for Cover, Welcome, Epilogue */}
      <EditMetadataModal
        isOpen={metadataModalState.isOpen}
        onClose={() => setMetadataModalState(prev => ({ ...prev, isOpen: false }))}
        metadata={brochureData.metadata}
        pageType={metadataModalState.pageType}
        onSave={handleUpdateMetadata}
      />

      {/* Sync Google Sheet Modal */}
      <SyncSheetModal
        isOpen={showSyncModal}
        onClose={() => setShowSyncModal(false)}
        brochureData={brochureData}
        onSyncGoogleSheet={handleSyncGoogleSheet}
        onSaveToGoogleSheet={handleSaveToGoogleSheet}
        onOpenCodeViewer={() => setShowCodeViewer(true)}
        onResetToDefault={handleResetToDefault}
        onImportData={(data) => setBrochureData(data)}
      />

      {/* Code.gs Viewer Modal */}
      <CodeViewerModal
        isOpen={showCodeViewer}
        onClose={() => setShowCodeViewer(false)}
      />

      {/* Edit Image Modal */}
      <EditImageModal
        isOpen={imageModalState.isOpen}
        onClose={() => setImageModalState(prev => ({ ...prev, isOpen: false }))}
        currentUrl={imageModalState.currentUrl}
        onSave={(newUrl) => {
          if (imageModalState.targetField === 'welcome2') {
            handleUpdateMetadata({
              ...brochureData.metadata,
              welcomePage2ImageUrl: newUrl
            });
          } else if (imageModalState.itemId) {
            const item = brochureData.items.find(i => i.id === imageModalState.itemId);
            if (item) {
              handleUpdateItem({ ...item, imageUrl: newUrl });
            }
          }
        }}
      />

      {/* Photo Fullscreen Viewer Modal */}
      <PhotoViewerModal
        isOpen={photoViewerState.isOpen}
        onClose={() => setPhotoViewerState(prev => ({ ...prev, isOpen: false }))}
        imageUrl={photoViewerState.url}
        title={photoViewerState.title}
        caption={photoViewerState.caption}
      />

      {/* Admin Password Authentication Modal */}
      <AdminAuthModal
        isOpen={showAdminAuthModal}
        onClose={() => setShowAdminAuthModal(false)}
        onSuccess={() => {
          setIsAdminAuthenticated(true);
          setIsEditMode(true);
          sounds.playChime();
          showToast('관리자 인증이 완료되었습니다. 편집 모드가 활성화되었습니다.', 'success');
        }}
      />
    </div>
  );
}
