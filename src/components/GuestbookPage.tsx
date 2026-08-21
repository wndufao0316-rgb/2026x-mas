import React, { useState } from 'react';
import { GuestbookEntry, BrochureMetadata } from '../types';
import { Send, User, MessageSquare, Trash2, Heart, RotateCw, CheckCircle2 } from 'lucide-react';
import { sounds } from '../utils/soundEffects';
import { isSampleGuestbookEntry, formatGuestbookDate } from '../utils/googleSheetsSync';

interface GuestbookPageProps {
  metadata: BrochureMetadata;
  entries: GuestbookEntry[];
  isEditMode: boolean;
  onAddEntry: (name: string, message: string) => Promise<void> | void;
  onDeleteEntry?: (id: string) => void;
  onRefreshGuestbook?: () => Promise<void> | void;
  isRefreshing?: boolean;
}

export const GuestbookPage: React.FC<GuestbookPageProps> = ({
  metadata,
  entries,
  isEditMode,
  onAddEntry,
  onDeleteEntry,
  onRefreshGuestbook,
  isRefreshing = false
}) => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [justSubmitted, setJustSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim() || isSubmitting) return;

    setIsSubmitting(true);
    sounds.playChime();
    
    try {
      await onAddEntry(name.trim(), message.trim());
      setName('');
      setMessage('');
      setJustSubmitted(true);
      setTimeout(() => setJustSubmitted(false), 3500);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="relative w-full h-full flex flex-col justify-between p-6 sm:p-7 bg-[#fdfaf1] rounded-r-lg rounded-l-xs overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,0.45)] border-l-[12px] border-[#2b1810] select-text text-[#3d2b1f] font-serif"
      style={{ backgroundImage: 'linear-gradient(to right, #e8e4d8 0%, #fdfaf1 4%, #fdfaf1 96%, #e8e4d8 100%)' }}
    >
      {/* Book Spine Shadow Line */}
      <div className="absolute top-0 left-0 bottom-0 w-[6px] bg-gradient-to-r from-black/25 to-transparent z-10 pointer-events-none" />

      {/* Top Header */}
      <div className="relative z-10 pb-2 border-b border-[#3d2b1f]/15">
        <div className="flex items-center justify-between">
          <p className="text-[10px] tracking-[0.25em] font-sans text-[#8b5e3c] uppercase font-bold">
            Guestbook & Fellowship
          </p>
          <div className="flex items-center space-x-2">
            {onRefreshGuestbook && (
              <button
                type="button"
                onClick={() => onRefreshGuestbook()}
                disabled={isRefreshing}
                className="flex items-center gap-1 text-[10px] text-[#8b5e3c] hover:text-[#2a1b0a] font-sans transition-colors cursor-pointer disabled:opacity-50"
                title="구글 시트에서 최신 방명록 새로고침"
              >
                <RotateCw className={`w-2.5 h-2.5 ${isRefreshing ? 'animate-spin text-[#dfba73]' : ''}`} />
                <span>새로고침</span>
              </button>
            )}
            <div className="flex items-center space-x-1 text-[10px] text-[#8b5e3c] font-sans">
              <Heart className="w-3 h-3 text-[#dfba73] fill-[#dfba73]" />
              <span>축복의 나눔</span>
            </div>
          </div>
        </div>
        
        <h2 className="text-xl sm:text-2xl font-bold font-serif-kr text-[#2a1b0a] tracking-tight text-center mt-1">
          방명록 <span className="text-xs sm:text-sm font-normal text-[#8b5e3c] font-sans ml-1">/ Guestbook</span>
        </h2>
      </div>

      {/* Main Content Area: Entry Form + Live Guestbook List */}
      <div className="relative z-10 flex-1 overflow-y-auto mt-2 mb-2 pr-1 flex flex-col space-y-3">
        {/* Write Guestbook Form */}
        <form 
          onSubmit={handleSubmit}
          className="p-3 bg-white/70 rounded-lg border border-[#3d2b1f]/20 shadow-xs space-y-2 flex-shrink-0"
        >
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <User className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#8b5e3c]" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="이름 또는 직분 (예: 김은혜 성도)"
                className="w-full pl-8 pr-2.5 py-1.5 bg-[#fdfaf1] border border-[#3d2b1f]/25 rounded text-xs text-[#2a1b0a] font-sans font-medium focus:outline-none focus:border-[#8b5e3c]"
                maxLength={20}
              />
            </div>
            <button
              type="submit"
              disabled={!name.trim() || !message.trim() || isSubmitting}
              className="px-3.5 py-1.5 bg-[#3d2b1f] hover:bg-black disabled:opacity-40 text-[#fdfaf1] rounded text-xs font-sans font-bold flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <RotateCw className="w-3 h-3 text-[#dfba73] animate-spin" />
                  <span>기록 중...</span>
                </>
              ) : (
                <>
                  <Send className="w-3 h-3 text-[#dfba73]" />
                  <span>남기기</span>
                </>
              )}
            </button>
          </div>

          <div className="relative">
            <MessageSquare className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-[#8b5e3c]" />
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="은혜의 소감이나 축복의 메시지를 남겨주세요..."
              rows={2}
              className="w-full pl-8 pr-2.5 py-1.5 bg-[#fdfaf1] border border-[#3d2b1f]/25 rounded text-xs text-[#2a1b0a] font-batang leading-relaxed focus:outline-none focus:border-[#8b5e3c] resize-none"
              maxLength={150}
            />
          </div>

          {justSubmitted && (
            <div className="flex items-center gap-1.5 text-[11px] text-green-800 font-sans font-medium pt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-700 flex-shrink-0" />
              <span>방명록이 등록되었습니다. 은혜의 나눔에 감사드립니다.</span>
            </div>
          )}
        </form>

        {/* Guestbook List Display */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-0.5">
          {(() => {
            const validEntries = (entries || [])
              .filter(entry => entry && !isSampleGuestbookEntry(entry) && entry.message && entry.message.trim().length > 0)
              .map(entry => ({
                ...entry,
                name: (entry.name || '익명의 성도').trim(),
                createdAt: formatGuestbookDate(entry.createdAt || '')
              }));

            if (validEntries.length === 0) {
              return (
                <div className="text-center py-6 text-xs text-[#8b5e3c]/80 font-sans">
                  아직 작성된 방명록이 없습니다. 첫 번째 축복의 글을 남겨주세요!
                </div>
              );
            }

            return validEntries.map((entry) => (
              <div
                key={entry.id}
                className="p-2.5 bg-white/60 hover:bg-white/90 rounded-md border border-[#3d2b1f]/15 shadow-xs transition-colors group"
              >
                <div className="flex items-center justify-between pb-1 border-b border-[#3d2b1f]/10 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-[#2a1b0a] font-serif-kr">
                      {entry.name}
                    </span>
                    {entry.createdAt && (
                      <span className="text-[9.5px] text-[#8b5e3c]/70 font-sans">
                        {entry.createdAt}
                      </span>
                    )}
                  </div>
                  {isEditMode && onDeleteEntry && (
                    <button
                      onClick={() => onDeleteEntry(entry.id)}
                      className="text-red-700 hover:text-red-900 p-0.5 rounded cursor-pointer transition-colors"
                      title="방명록 삭제"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
                <p className="text-xs text-[#3d2b1f] font-batang leading-relaxed whitespace-pre-line">
                  {entry.message}
                </p>
              </div>
            ));
          })()}
        </div>
      </div>

      {/* Footer / Page Indicator */}
      <div className="relative z-10 pt-2 border-t border-[#3d2b1f]/10 flex items-center justify-between text-[10px] text-[#8b5e3c]/70 font-sans">
        <span className="tracking-wider uppercase">GUESTBOOK</span>
        <div className="flex gap-1.5 items-center">
          <div className="w-1.5 h-1.5 rounded-full bg-[#3d2b1f]"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-[#3d2b1f]"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-[#3d2b1f]"></div>
        </div>
      </div>
    </div>
  );
};
