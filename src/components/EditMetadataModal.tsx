import React, { useState, useEffect } from 'react';
import { X, Check, Sparkles, MessageSquare, Heart } from 'lucide-react';
import { BrochureMetadata } from '../types';

interface EditMetadataModalProps {
  isOpen: boolean;
  onClose: () => void;
  metadata: BrochureMetadata;
  pageType: 'cover' | 'welcome' | 'welcome2' | 'epilogue' | 'all';
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
  const [welcomeHeading, setWelcomeHeading] = useState('');
  const [welcomeSubtitle, setWelcomeSubtitle] = useState('');
  const [welcomeDedicationHeader, setWelcomeDedicationHeader] = useState('');
  const [welcomeMessage, setWelcomeMessage] = useState('');
  
  const [welcomePage2Heading, setWelcomePage2Heading] = useState('');
  const [welcomePage2Subtitle, setWelcomePage2Subtitle] = useState('');
  const [welcomePage2DedicationHeader, setWelcomePage2DedicationHeader] = useState('');
  const [welcomePage2ImageUrl, setWelcomePage2ImageUrl] = useState('');
  const [welcomePage2ImageCaption, setWelcomePage2ImageCaption] = useState('');
  const [welcomePage2Message, setWelcomePage2Message] = useState('');

  const [dedicationText, setDedicationText] = useState('');
  const [tocHeading, setTocHeading] = useState('');
  const [tocSubtitle, setTocSubtitle] = useState('');

  useEffect(() => {
    if (metadata) {
      setConcertTitle(metadata.concertTitle || '');
      setConcertSubtitle(metadata.concertSubtitle || '');
      setThemeQuote(metadata.themeQuote || '');
      setDate(metadata.date || '');
      setVenue(metadata.venue || '');
      setWelcomeHeading(metadata.welcomeHeading || '초대의 글');
      setWelcomeSubtitle(metadata.welcomeSubtitle || 'Invocation & Welcome');
      setWelcomeDedicationHeader(metadata.welcomeDedicationHeader || `"${metadata.concertTitle || '운명(運命): 창조의 뜻'}"에 부쳐`);
      setWelcomeMessage(metadata.welcomeMessage || '');

      setWelcomePage2Heading(metadata.welcomePage2Heading || '초대의 글');
      setWelcomePage2Subtitle(metadata.welcomePage2Subtitle || 'Reflection & Photo');
      setWelcomePage2DedicationHeader(metadata.welcomePage2DedicationHeader || '은혜의 여정을 함께하며');
      setWelcomePage2ImageUrl(metadata.welcomePage2ImageUrl || 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=800&q=80');
      setWelcomePage2ImageCaption(metadata.welcomePage2ImageCaption || '아름다운 선율과 기도가 머무는 거룩한 찬양의 처소');
      setWelcomePage2Message(metadata.welcomePage2Message || '');

      setDedicationText(metadata.dedicationText || '');
      setTocHeading(metadata.tocHeading || '행사 순서');
      setTocSubtitle(metadata.tocSubtitle || 'Order of Worship');
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
      welcomeHeading,
      welcomeSubtitle,
      welcomeDedicationHeader,
      welcomeMessage,
      welcomePage2Heading,
      welcomePage2Subtitle,
      welcomePage2DedicationHeader,
      welcomePage2ImageUrl,
      welcomePage2ImageCaption,
      welcomePage2Message,
      dedicationText,
      tocHeading,
      tocSubtitle
    });
    onClose();
  };

  const getTitle = () => {
    if (pageType === 'cover') return '고급 책 표지 문구 직접 수정';
    if (pageType === 'welcome2') return '초대의 글(1: 사진+글귀) 직접 수정';
    if (pageType === 'welcome') return '초대의 글(2: 본문 인사말) 직접 작성 및 수정';
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
                <label className="font-bold text-[#8b5e3c]">표지 상단 작은 글씨 (Header Title)</label>
                <input
                  type="text"
                  value={concertSubtitle}
                  onChange={(e) => setConcertSubtitle(e.target.value)}
                  className="w-full px-3 py-2 bg-[#fdfaf1] border border-[#3d2b1f]/30 rounded text-[#2a1b0a] font-sans font-medium focus:outline-none focus:border-[#3d2b1f]"
                  placeholder="예: JOSHUA JEONG_PRAISE CONCERT"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#8b5e3c]">표지 중앙 메인 큰 글씨 (Main Title - 줄바꿈 지원)</label>
                <textarea
                  value={concertTitle}
                  onChange={(e) => setConcertTitle(e.target.value)}
                  rows={3}
                  className="w-full p-2.5 bg-[#fdfaf1] border border-[#3d2b1f]/30 rounded text-[#2a1b0a] font-serif-kr font-bold text-sm leading-relaxed focus:outline-none focus:border-[#3d2b1f]"
                  placeholder="운명(運命):&#10;창조의 뜻"
                />
              </div>
            </>
          )}

          {(pageType === 'welcome' || pageType === 'all') && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-bold text-[#8b5e3c]">초대의 글 제목</label>
                  <input
                    type="text"
                    value={welcomeHeading}
                    onChange={(e) => setWelcomeHeading(e.target.value)}
                    className="w-full px-3 py-2 bg-[#fdfaf1] border border-[#3d2b1f]/30 rounded text-[#2a1b0a] font-sans font-medium focus:outline-none focus:border-[#3d2b1f]"
                    placeholder="초대의 글"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-[#8b5e3c]">상단 영문 소제목</label>
                  <input
                    type="text"
                    value={welcomeSubtitle}
                    onChange={(e) => setWelcomeSubtitle(e.target.value)}
                    className="w-full px-3 py-2 bg-[#fdfaf1] border border-[#3d2b1f]/30 rounded text-[#2a1b0a] font-sans font-medium focus:outline-none focus:border-[#3d2b1f]"
                    placeholder="Invocation & Welcome"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#8b5e3c]">글귀 소제목 (제목에 부쳐 등)</label>
                <input
                  type="text"
                  value={welcomeDedicationHeader}
                  onChange={(e) => setWelcomeDedicationHeader(e.target.value)}
                  className="w-full px-3 py-2 bg-[#fdfaf1] border border-[#3d2b1f]/30 rounded text-[#2a1b0a] font-sans font-medium focus:outline-none focus:border-[#3d2b1f]"
                  placeholder='"운명(運命): 창조의 뜻"에 부쳐'
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#8b5e3c] flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>초대의 글 본문 (줄바꿈 지원)</span>
                </label>
                <textarea
                  value={welcomeMessage}
                  onChange={(e) => setWelcomeMessage(e.target.value)}
                  rows={7}
                  className="w-full p-3 bg-[#fdfaf1] border border-[#3d2b1f]/30 rounded text-[#2a1b0a] font-batang text-xs leading-relaxed focus:outline-none focus:border-[#3d2b1f] resize-y"
                  placeholder="초대의 글 본문을 자유롭게 작성하세요..."
                />
              </div>
            </>
          )}

          {(pageType === 'welcome2' || pageType === 'all') && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-bold text-[#8b5e3c]">초대의 글(2) 제목</label>
                  <input
                    type="text"
                    value={welcomePage2Heading}
                    onChange={(e) => setWelcomePage2Heading(e.target.value)}
                    className="w-full px-3 py-2 bg-[#fdfaf1] border border-[#3d2b1f]/30 rounded text-[#2a1b0a] font-sans font-medium focus:outline-none focus:border-[#3d2b1f]"
                    placeholder="초대의 글"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-[#8b5e3c]">상단 영문 소제목</label>
                  <input
                    type="text"
                    value={welcomePage2Subtitle}
                    onChange={(e) => setWelcomePage2Subtitle(e.target.value)}
                    className="w-full px-3 py-2 bg-[#fdfaf1] border border-[#3d2b1f]/30 rounded text-[#2a1b0a] font-sans font-medium focus:outline-none focus:border-[#3d2b1f]"
                    placeholder="Reflection & Photo"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#8b5e3c]">글귀 소제목 (상단 헤더)</label>
                <input
                  type="text"
                  value={welcomePage2DedicationHeader}
                  onChange={(e) => setWelcomePage2DedicationHeader(e.target.value)}
                  className="w-full px-3 py-2 bg-[#fdfaf1] border border-[#3d2b1f]/30 rounded text-[#2a1b0a] font-sans font-medium focus:outline-none focus:border-[#3d2b1f]"
                  placeholder="은혜의 여정을 함께하며"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#8b5e3c]">사진 이미지 URL</label>
                <input
                  type="url"
                  value={welcomePage2ImageUrl}
                  onChange={(e) => setWelcomePage2ImageUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-[#fdfaf1] border border-[#3d2b1f]/30 rounded text-[#2a1b0a] font-mono text-xs focus:outline-none focus:border-[#3d2b1f]"
                  placeholder="https://..."
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#8b5e3c]">사진 설명 캡션</label>
                <input
                  type="text"
                  value={welcomePage2ImageCaption}
                  onChange={(e) => setWelcomePage2ImageCaption(e.target.value)}
                  className="w-full px-3 py-2 bg-[#fdfaf1] border border-[#3d2b1f]/30 rounded text-[#2a1b0a] font-sans text-xs focus:outline-none focus:border-[#3d2b1f]"
                  placeholder="사진 캡션 설명"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#8b5e3c] flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>글귀 내용 (줄바꿈 지원)</span>
                </label>
                <textarea
                  value={welcomePage2Message}
                  onChange={(e) => setWelcomePage2Message(e.target.value)}
                  rows={5}
                  className="w-full p-3 bg-[#fdfaf1] border border-[#3d2b1f]/30 rounded text-[#2a1b0a] font-batang text-xs leading-relaxed focus:outline-none focus:border-[#3d2b1f] resize-y"
                  placeholder="사진 아래 들어갈 글귀를 작성하세요..."
                />
              </div>
            </>
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
