import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, BookOpen, Calendar, MapPin, Edit2 } from 'lucide-react';
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
  onOpenEditModal,
  onOpenBook
}) => {
  return (
    <div className="relative w-full h-full flex flex-col justify-between p-5 sm:p-6 bg-[#fdfaf1] rounded-lg overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border-x-[10px] sm:border-x-[12px] border-[#3d2b1f] select-text text-[#3d2b1f] font-serif" style={{ backgroundImage: 'linear-gradient(to right, #fdfaf1 95%, #e8e4d8 100%)' }}>
      
      {/* Delicate spine shading line */}
      <div className="absolute top-0 left-0 bottom-0 w-[3px] bg-black/10 z-10 shadow-inner pointer-events-none" />

      {/* Top Header Section */}
      <div className="relative z-10 text-center pt-1">
        <div className="flex items-center justify-between px-1 mb-1">
          <p className="text-[10px] sm:text-[11px] tracking-[0.25em] font-sans text-[#8b5e3c] uppercase font-bold">
            Joshua Jeong_Praise Concert
          </p>
          
          {isEditMode && (
            <button
              onClick={onOpenEditModal}
              className="px-2 py-0.5 rounded bg-[#8b5e3c] hover:bg-[#3d2b1f] text-[#fdfaf1] text-[9.5px] font-sans font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
              title="표지 문구 전체 수정"
            >
              <Edit2 className="w-2.5 h-2.5" />
              <span>표지 수정</span>
            </button>
          )}
        </div>

        <p
          contentEditable={isEditMode}
          suppressContentEditableWarning
          onBlur={(e) => {
            if (isEditMode) {
              onUpdateMetadata({ ...metadata, concertSubtitle: e.currentTarget.textContent || metadata.concertSubtitle });
            }
          }}
          className={`text-[11.5px] text-[#5d4037] font-batang tracking-wider ${
            isEditMode ? 'hover:bg-amber-100/70 p-1 rounded outline-none border-b border-dashed border-[#8b5e3c] cursor-text' : ''
          }`}
          title={isEditMode ? "클릭하여 직접 수정" : undefined}
        >
          {metadata.concertSubtitle}
        </p>
      </div>

      {/* Center Main Title & Embellished Crest */}
      <div className="relative z-10 text-center my-auto py-1 space-y-2">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-1"
        >
          <h1 className="text-3xl sm:text-4xl font-black font-serif-kr text-[#2a1b0a] leading-tight tracking-tight">
            운명(運命):<br />
            <span
              contentEditable={isEditMode}
              suppressContentEditableWarning
              onBlur={(e) => {
                if (isEditMode) {
                  onUpdateMetadata({ ...metadata, concertTitle: e.currentTarget.textContent || metadata.concertTitle });
                }
              }}
              className={`text-2xl sm:text-3xl font-bold text-[#3d2b1f] opacity-95 inline-block ${
                isEditMode ? 'hover:bg-amber-100/80 px-2 py-0.5 rounded outline-none border-b-2 border-dashed border-[#8b5e3c] cursor-text' : ''
              }`}
              title={isEditMode ? "클릭하여 직접 제목 수정" : undefined}
            >
              {metadata.concertTitle}
            </span>
          </h1>
          
          <div className="w-12 h-[1.5px] bg-[#8b5e3c] mx-auto my-2 sm:my-3" />
        </motion.div>

        {/* Theme Scripture / Quote */}
        <p
          contentEditable={isEditMode}
          suppressContentEditableWarning
          onBlur={(e) => {
            if (isEditMode) {
              onUpdateMetadata({ ...metadata, themeQuote: e.currentTarget.innerText || metadata.themeQuote });
            }
          }}
          className={`text-xs sm:text-[13px] italic text-[#5d4037] max-w-[290px] leading-relaxed mx-auto px-2 font-batang ${
            isEditMode ? 'hover:bg-amber-100/70 p-1.5 rounded outline-none border border-dashed border-[#8b5e3c] cursor-text' : ''
          }`}
          title={isEditMode ? "클릭하여 묵상 구절 수정" : undefined}
        >
          "{metadata.themeQuote}"
        </p>

        {/* Natural Tones Art Frame with Cross & Seal */}
        <div className="w-40 h-32 sm:w-48 sm:h-36 mx-auto my-2 bg-[#e8e4d8] rounded-sm shadow-inner border border-black/5 flex flex-col items-center justify-center overflow-hidden relative group">
          <div className="text-[#8b5e3c] opacity-30 text-5xl font-serif">♰</div>
          <div className="text-[9px] font-sans tracking-[0.25em] text-[#8b5e3c]/80 uppercase font-bold mt-1">
            CREATION & DESTINY
          </div>
        </div>
      </div>

      {/* Bottom Section: Info & Open Trigger */}
      <div className="relative z-10 space-y-2.5 pb-1">
        {/* Date & Venue in Antique Stamping */}
        <div className="bg-[#e8e4d8]/70 rounded-md p-2 border border-[#3d2b1f]/10 text-center space-y-1">
          <div className="flex items-center justify-center space-x-1.5 text-[11px] text-[#2a1b0a] font-medium font-sans">
            <Calendar className="w-3.5 h-3.5 text-[#8b5e3c]" />
            <span
              contentEditable={isEditMode}
              suppressContentEditableWarning
              onBlur={(e) => {
                if (isEditMode) {
                  onUpdateMetadata({ ...metadata, date: e.currentTarget.textContent || metadata.date });
                }
              }}
              className={isEditMode ? 'hover:bg-amber-100/80 px-1 rounded outline-none cursor-text' : ''}
              title={isEditMode ? "클릭하여 일시 수정" : undefined}
            >
              {metadata.date}
            </span>
          </div>
          <div className="flex items-center justify-center space-x-1.5 text-[10.5px] text-[#5d4037] font-sans">
            <MapPin className="w-3 h-3 text-[#8b5e3c]" />
            <span
              contentEditable={isEditMode}
              suppressContentEditableWarning
              onBlur={(e) => {
                if (isEditMode) {
                  onUpdateMetadata({ ...metadata, venue: e.currentTarget.textContent || metadata.venue });
                }
              }}
              className={isEditMode ? 'hover:bg-amber-100/80 px-1 rounded outline-none cursor-text' : ''}
              title={isEditMode ? "클릭하여 장소 수정" : undefined}
            >
              {metadata.venue}
            </span>
          </div>
        </div>

        {/* Book Open Interactive Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={onOpenBook}
          id="btn-open-book-main"
          className="w-full py-3 px-4 bg-[#3d2b1f] hover:bg-black text-[#fdfaf1] rounded-lg font-sans font-bold text-xs uppercase tracking-wider shadow-md border border-[#3d2b1f]/20 flex items-center justify-center space-x-2 group cursor-pointer transition-all"
        >
          <BookOpen className="w-4 h-4 text-[#e8e4d8] group-hover:rotate-12 transition-transform duration-300" />
          <span>책을 터치하여 펼치기 (Open Program)</span>
          <Sparkles className="w-3.5 h-3.5 text-[#e8e4d8] animate-pulse" />
        </motion.button>

        {/* Discreet bottom footer */}
        <div className="flex items-center justify-between text-[10px] text-[#8b5e3c]/70 font-sans tracking-wider px-1">
          <span>EST. 2026 • SEOUL KOREA</span>
          <span className="font-semibold text-[#8b5e3c]">JOSHUA JEONG PRAISE</span>
        </div>
      </div>
    </div>
  );
};
