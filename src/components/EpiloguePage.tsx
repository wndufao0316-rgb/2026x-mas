import React, { useState } from 'react';
import { BrochureMetadata } from '../types';
import { Heart, Sparkles, Share2, BookOpen, Edit2 } from 'lucide-react';

interface EpiloguePageProps {
  metadata: BrochureMetadata;
  isEditMode: boolean;
  onUpdateMetadata: (updated: BrochureMetadata) => void;
  onOpenEditModal: () => void;
  onFirstPage: () => void;
}

export const EpiloguePage: React.FC<EpiloguePageProps> = ({
  metadata,
  isEditMode,
  onUpdateMetadata,
  onOpenEditModal,
  onFirstPage
}) => {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${metadata.concertSubtitle} - ${metadata.concertTitle}`,
        text: `찬양 콘서트 [${metadata.concertTitle}] 모바일 브로슈어입니다.`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-5 sm:p-6 bg-[#fdfaf1] rounded-lg overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border-x-[10px] sm:border-x-[12px] border-[#3d2b1f] select-text text-[#3d2b1f] font-serif" style={{ backgroundImage: 'linear-gradient(to right, #fdfaf1 95%, #e8e4d8 100%)' }}>
      
      {/* Book Spine Line */}
      <div className="absolute top-0 left-0 bottom-0 w-[2px] bg-black/10 z-10 shadow-inner pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 pb-2 border-b border-[#3d2b1f]/10">
        <div className="flex items-center justify-between">
          <p className="text-[10px] tracking-[0.25em] font-sans text-[#8b5e3c] uppercase font-bold">
            Epilogue & Credits
          </p>

          {isEditMode && (
            <button
              onClick={onOpenEditModal}
              className="px-2 py-0.5 rounded bg-[#8b5e3c] hover:bg-[#3d2b1f] text-[#fdfaf1] text-[9.5px] font-sans font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
              title="에필로그 및 크레딧 수정"
            >
              <Edit2 className="w-2.5 h-2.5" />
              <span>크레딧 수정</span>
            </button>
          )}
        </div>
        
        <h2 className="text-xl sm:text-2xl font-bold font-serif-kr text-[#2a1b0a] tracking-tight text-center mt-1">
          에필로그 및 크레딧 <span className="text-xs sm:text-sm font-normal text-[#8b5e3c] font-sans ml-1">/ Epilogue</span>
        </h2>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 overflow-y-auto my-2 pr-1 space-y-3.5 text-center">
        {/* Heart Seal */}
        <div className="w-10 h-10 mx-auto rounded-sm bg-[#e8e4d8] border border-black/5 shadow-inner flex items-center justify-center text-[#8b5e3c]">
          <Heart className="w-5 h-5 fill-[#8b5e3c]/20" />
        </div>

        <div className="bg-[#e8e4d8]/60 rounded-md p-3 border border-black/5 space-y-1">
          <div className="text-xs font-bold font-serif-kr text-[#2a1b0a] flex items-center justify-center space-x-1.5">
            <span>감사의 말씀</span>
          </div>
          <p className="text-[11.5px] font-batang text-[#5d4037] leading-relaxed">
            오늘 이 거룩한 찬양의 자리에 함께해주신 모든 성도님들과 관객 여러분께 깊은 감사를 드립니다. 
            주님의 거룩하신 사랑과 은혜가 늘 충만하기를 기도합니다.
          </p>
        </div>

        {/* Dedication Text */}
        <div className="bg-[#fdfaf1] rounded-md p-3 border border-[#3d2b1f]/10 text-center space-y-1">
          <div className="text-[10px] font-sans tracking-[0.2em] text-[#8b5e3c] font-bold uppercase">PRODUCTION CREW</div>
          <p
            contentEditable={isEditMode}
            suppressContentEditableWarning
            onBlur={(e) => {
              if (isEditMode) {
                onUpdateMetadata({ ...metadata, dedicationText: e.currentTarget.innerText || metadata.dedicationText });
              }
            }}
            className={`text-xs font-serif-kr text-[#3d2b1f] whitespace-pre-line leading-relaxed ${
              isEditMode ? 'hover:bg-amber-100/70 p-1.5 rounded outline-none border border-dashed border-[#8b5e3c] cursor-text bg-white/50' : ''
            }`}
            title={isEditMode ? "클릭하여 직접 크레딧 수정" : undefined}
          >
            {metadata.dedicationText}
          </p>
        </div>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="w-full py-2.5 px-3 bg-[#3d2b1f] hover:bg-black text-[#fdfaf1] rounded-md font-sans text-xs font-bold flex items-center justify-center space-x-2 shadow-xs transition-all cursor-pointer"
        >
          <Share2 className="w-3.5 h-3.5 text-[#e8e4d8]" />
          <span>{copied ? "링크가 복사되었습니다!" : "브로슈어 모바일 공유하기"}</span>
        </button>
      </div>

      {/* Bottom Button */}
      <div className="relative z-10 pt-2.5 border-t border-[#3d2b1f]/10 flex items-center justify-between text-[10px] text-[#8b5e3c]/70 font-sans">
        <button
          onClick={onFirstPage}
          className="px-2 py-1 text-[#3d2b1f] hover:text-black font-sans font-bold flex items-center space-x-1 cursor-pointer uppercase"
        >
          <BookOpen className="w-3.5 h-3.5 text-[#8b5e3c]" />
          <span>표지로 돌아가기</span>
        </button>
        <span className="font-bold tracking-widest text-[#3d2b1f]">FINIS</span>
      </div>
    </div>
  );
};
