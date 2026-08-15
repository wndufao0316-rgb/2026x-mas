import React from 'react';
import { motion } from 'motion/react';
import { BrochureMetadata } from '../types';

interface BookCoverProps {
  metadata: BrochureMetadata;
  isEditMode: boolean;
  onUpdateMetadata: (updated: BrochureMetadata) => void;
  onOpenEditModal: () => void;
  onOpenBook: () => void;
}

export const BookCover: React.FC<BookCoverProps> = ({
  metadata,
  isEditMode,
  onUpdateMetadata,
  onOpenBook
}) => {
  // Title separation helper for "운명(運命):" and "창조의 뜻"
  const rawTitle = metadata.concertTitle || '운명(運命):\n창조의 뜻';
  
  return (
    <div 
      onClick={(e) => {
        // If not editing or clicked outside contentEditable elements, flip book
        if (!isEditMode) {
          onOpenBook();
        }
      }}
      className={`relative w-full h-full flex flex-col justify-between p-7 sm:p-9 rounded-r-xl rounded-l-xs overflow-hidden select-text font-serif transition-all duration-300 ${
        !isEditMode ? 'cursor-pointer hover:brightness-105 group' : ''
      }`}
      style={{
        background: 'linear-gradient(135deg, #2b1810 0%, #1c0f0a 40%, #2e1a12 70%, #150b07 100%)',
        boxShadow: 'inset 4px 0 10px rgba(0,0,0,0.8), inset 0 0 40px rgba(0,0,0,0.6), -10px 10px 30px rgba(0,0,0,0.7), 0 20px 40px rgba(0,0,0,0.6)'
      }}
    >
      {/* Luxurious Leather Texture Overlay */}
      <div 
        className="absolute inset-0 opacity-25 mix-blend-overlay pointer-events-none" 
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.15) 1px, transparent 1px)',
          backgroundSize: '12px 12px'
        }} 
      />

      {/* Book Spine (Left Spine & Embossed Ridge) */}
      <div className="absolute top-0 left-0 bottom-0 w-[14px] sm:w-[18px] bg-gradient-to-r from-black/90 via-[#3a2016] to-black/70 border-r border-[#dfba73]/30 z-20 pointer-events-none shadow-[2px_0_10px_rgba(0,0,0,0.8)] flex flex-col justify-between py-8">
        <div className="w-full h-1 bg-[#dfba73]/40 shadow-xs" />
        <div className="w-full h-1 bg-[#dfba73]/40 shadow-xs" />
        <div className="w-full h-1 bg-[#dfba73]/40 shadow-xs" />
        <div className="w-full h-1 bg-[#dfba73]/40 shadow-xs" />
      </div>

      {/* Elegant Gold Embossed Double Border Frame */}
      <div className="absolute inset-4 sm:inset-5 border border-[#dfba73]/50 rounded-xs pointer-events-none">
        <div className="absolute inset-1 sm:inset-1.5 border border-[#dfba73]/25" />
        {/* Subtle Corner Gold Ornaments */}
        <div className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-[#dfba73]/80" />
        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-[#dfba73]/80" />
        <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-[#dfba73]/80" />
        <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-[#dfba73]/80" />
      </div>

      {/* Top Header: JOSHUA JEONG_PRAISE CONCERT (Small Text) */}
      <div className="relative z-10 text-center pl-2 pt-2 sm:pt-4">
        <div
          contentEditable={isEditMode}
          suppressContentEditableWarning
          onClick={(e) => isEditMode && e.stopPropagation()}
          onBlur={(e) => {
            if (isEditMode) {
              onUpdateMetadata({
                ...metadata,
                concertSubtitle: e.currentTarget.textContent?.trim() || metadata.concertSubtitle
              });
            }
          }}
          className={`text-[10px] sm:text-[11px] font-sans tracking-[0.3em] uppercase font-semibold text-[#dfba73] opacity-90 transition-all ${
            isEditMode 
              ? 'hover:bg-white/10 px-2 py-1 rounded outline-none border border-dashed border-[#dfba73] cursor-text inline-block' 
              : 'select-none'
          }`}
          title={isEditMode ? "클릭하여 상단 문구 직접 수정" : undefined}
        >
          {metadata.concertSubtitle || 'JOSHUA JEONG_PRAISE CONCERT'}
        </div>
      </div>

      {/* Center Main Title: 운명(運命): \n 창조의 뜻 (Centered Vertically and Horizontally) */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-3 sm:px-4 my-auto">
        <div className="absolute w-44 h-44 rounded-full bg-[#dfba73]/10 blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 w-full"
        >
          {/* Subtle Top Gold Accent Line */}
          <div className="w-10 h-[1px] bg-[#dfba73]/60 mx-auto mb-4" />

          <div
            contentEditable={isEditMode}
            suppressContentEditableWarning
            onClick={(e) => isEditMode && e.stopPropagation()}
            onBlur={(e) => {
              if (isEditMode) {
                onUpdateMetadata({
                  ...metadata,
                  concertTitle: e.currentTarget.innerText?.trim() || metadata.concertTitle
                });
              }
            }}
            className={`text-3xl sm:text-4xl lg:text-[42px] font-serif-kr font-black text-[#f7e7ce] leading-[1.3] tracking-tight transition-all drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] ${
              isEditMode 
                ? 'hover:bg-white/10 p-2 rounded outline-none border border-dashed border-[#dfba73] cursor-text block' 
                : 'select-none'
            }`}
            title={isEditMode ? "클릭하여 제목 직접 수정 (줄바꿈 가능)" : undefined}
            style={{
              textShadow: '0 2px 4px rgba(0,0,0,0.8), 0 0 20px rgba(223,186,115,0.3)'
            }}
          >
            {rawTitle.includes('\n') ? (
              rawTitle.split('\n').map((line, idx) => (
                <div key={idx} className={idx === 0 ? "text-2xl sm:text-3xl font-medium text-[#dfba73] mb-1" : "mt-0.5 font-bold"}>
                  {line}
                </div>
              ))
            ) : rawTitle.includes(':') ? (
              <>
                <div className="text-2xl sm:text-3xl font-medium text-[#dfba73] mb-1">
                  {rawTitle.split(':')[0]}:
                </div>
                <div className="mt-0.5 font-bold">
                  {rawTitle.split(':')[1]?.trim() || ''}
                </div>
              </>
            ) : (
              rawTitle
            )}
          </div>

          {/* Subtle Bottom Gold Accent Line */}
          <div className="w-10 h-[1px] bg-[#dfba73]/60 mx-auto mt-4" />
        </motion.div>
      </div>

      {/* Bottom Subtle Ornament Spacer */}
      <div className="relative z-10 text-center pb-2 sm:pb-3">
        <div className="inline-flex items-center justify-center space-x-1.5 opacity-60">
          <div className="w-1 h-1 rounded-full bg-[#dfba73]" />
          <div className="w-1.5 h-1.5 rotate-45 border border-[#dfba73]" />
          <div className="w-1 h-1 rounded-full bg-[#dfba73]" />
        </div>
      </div>

      {/* Subtle Right Edge Page Shadow */}
      <div className="absolute top-0 right-0 bottom-0 w-[4px] bg-gradient-to-l from-white/10 via-transparent to-transparent pointer-events-none" />
    </div>
  );
};
