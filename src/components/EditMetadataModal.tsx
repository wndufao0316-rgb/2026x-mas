import React, { useState, useEffect } from 'react';
import { X, Check, BookOpen, Calendar, MapPin, Sparkles, MessageSquare, Heart } from 'lucide-react';
import { BrochureMetadata } from '../types';

interface EditMetadataModalProps {
  isOpen: boolean;
  onClose: () => void;
  metadata: BrochureMetadata;
  pageType: 'cover' | 'welcome' | 'epilogue' | 'all';
  onSave: (updated: BrochureMetadata) => void;
}

export const EditMetadataModal: React.FC<EditMetadataModalProps> = ({
  isOpen,
  onClose,
  metadata,
  pageType,
  onSave
}) => {
  const [concertTitle, setConcertTitle] = useState('');
  const [concertSubtitle, setConcertSubtitle] = useState('');
  const [themeQuote, setThemeQuote] = useState('');
  const [date, setDate] = useState('');
  const [venue, setVenue] = useState('');
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [dedicationText, setDedicationText] = useState('');

  useEffect(() => {
    if (metadata) {
      setConcertTitle(metadata.concertTitle || '');
      setConcertSubtitle(metadata.concertSubtitle || '');
      setThemeQuote(metadata.themeQuote || '');
      setDate(metadata.date || '');
      setVenue(metadata.venue || '');
      setWelcomeMessage(metadata.welcomeMessage || '');
      setDedicationText(metadata.dedicationText || '');
    }
  }, [metadata, isOpen]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...metadata,
      concertTitle,
      concertSubtitle,
      themeQuote,
      date,
      venue,
      welcomeMessage,
      dedicationText
    });
    onClose();
  };

  const getTitle = () => {
    if (pageType === 'cover') return '표지 및 행사 정보 직접 수정';
    if (pageType === 'welcome') return '초대의 글(인사말) 직접 작성 및 수정';
    if (pageType === 'epilogue') return '에필로그 및 크레딧 직접 작성 및 수정';
    return '전체 행사 정보 및 글귀 수정';
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs select-text font-sans"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg max-h-[90vh] bg-[#fdfaf1] text-[#3d2b1f] rounded-lg border-2 border-[#3d2b1f] shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#e8e4d8] border-b border-[#3d2b1f]/20">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-[#8b5e3c]" />
            <h3 className="font-serif-kr font-bold text-sm sm:text-base text-[#2a1b0a]">
              {getTitle()}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-black/5 text-[#5d4037] hover:text-black transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
          {(pageType === 'cover' || pageType === 'all') && (
            <>
              <div className="space-y-1">
                <label className="font-bold text-[#8b5e3c]">콘서트 메인 제목 (Title)</label>
                <input
                  type="text"
                  value={concertTitle}
                  onChange={(e) => setConcertTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-[#fdfaf1] border border-[#3d2b1f]/30 rounded text-[#2a1b0a] font-bold text-sm focus:outline-none focus:border-[#3d2b1f]"
                  placeholder="예: 빛의 창조와 부르심"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#8b5e3c]">콘서트 부제 / 영문명 (Subtitle)</label>
                <input
                  type="text"
                  value={concertSubtitle}
                  onChange={(e) => setConcertSubtitle(e.target.value)}
                  className="w-full px-3 py-1.5 bg-[#fdfaf1] border border-[#3d2b1f]/30 rounded text-[#2a1b0a] focus:outline-none focus:border-[#3d2b1f]"
                  placeholder="예: 정여호수아 창작 찬양의 밤"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#8b5e3c]">주제 성경구절 / 표지 글귀</label>
                <textarea
                  value={themeQuote}
                  onChange={(e) => setThemeQuote(e.target.value)}
                  rows={2}
                  className="w-full p-2.5 bg-[#fdfaf1] border border-[#3d2b1f]/30 rounded text-[#2a1b0a] font-batang leading-relaxed focus:outline-none focus:border-[#3d2b1f]"
                  placeholder="표지에 들어갈 묵상 구절을 입력하세요"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-bold text-[#8b5e3c] flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>일시</span>
                  </label>
                  <input
                    type="text"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-[#fdfaf1] border border-[#3d2b1f]/30 rounded text-[#2a1b0a] focus:outline-none focus:border-[#3d2b1f]"
                    placeholder="2026. 10. 18 (주일) 저녁 7시"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-[#8b5e3c] flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>장소</span>
                  </label>
                  <input
                    type="text"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-[#fdfaf1] border border-[#3d2b1f]/30 rounded text-[#2a1b0a] focus:outline-none focus:border-[#3d2b1f]"
                    placeholder="새빛중앙교회 대성전"
                  />
                </div>
              </div>
            </>
          )}

          {(pageType === 'welcome' || pageType === 'all') && (
            <div className="space-y-1">
              <label className="font-bold text-[#8b5e3c] flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>초대의 글 본문 (줄바꿈 지원)</span>
              </label>
              <textarea
                value={welcomeMessage}
                onChange={(e) => setWelcomeMessage(e.target.value)}
                rows={8}
                className="w-full p-3 bg-[#fdfaf1] border border-[#3d2b1f]/30 rounded text-[#2a1b0a] font-batang text-xs leading-relaxed focus:outline-none focus:border-[#3d2b1f] resize-y"
                placeholder="초대의 글 본문을 자유롭게 작성하세요..."
              />
            </div>
          )}

          {(pageType === 'epilogue' || pageType === 'all') && (
            <div className="space-y-1">
              <label className="font-bold text-[#8b5e3c] flex items-center gap-1">
                <Heart className="w-3.5 h-3.5" />
                <span>에필로그 및 크레딧 명단</span>
              </label>
              <textarea
                value={dedicationText}
                onChange={(e) => setDedicationText(e.target.value)}
                rows={5}
                className="w-full p-3 bg-[#fdfaf1] border border-[#3d2b1f]/30 rounded text-[#2a1b0a] font-serif-kr text-xs leading-relaxed focus:outline-none focus:border-[#3d2b1f] resize-y"
                placeholder="총괄, 작사/작곡, 연주진, 기획 등의 크레딧을 작성하세요..."
              />
            </div>
          )}

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#3d2b1f]/15">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded bg-black/10 hover:bg-black/20 text-[#3d2b1f] font-medium cursor-pointer transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded bg-[#3d2b1f] hover:bg-black text-[#fdfaf1] font-bold flex items-center space-x-1 shadow-xs transition-colors cursor-pointer"
            >
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>저장 및 브로슈어에 즉시 반영</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
