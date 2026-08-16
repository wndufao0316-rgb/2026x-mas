import React from 'react';
import { motion } from 'motion/react';
import { ProgramItem } from '../types';
import { Camera, Maximize2, Quote, Clock, BookOpen, UserCheck, Edit2, FileText, Sparkles } from 'lucide-react';

interface ProgramPageProps {
  item: ProgramItem;
  currentIndex: number;
  totalCount: number;
  isEditMode: boolean;
  onUpdateItem: (updated: ProgramItem) => void;
  onOpenImageModal: (itemId: string, currentUrl: string) => void;
  onOpenPhotoViewer: (url: string, title: string, caption?: string) => void;
  onOpenTextModal?: (item: ProgramItem, field: 'lyrics' | 'commentary' | 'all') => void;
}

export const ProgramPage: React.FC<ProgramPageProps> = ({
  item,
  currentIndex,
  totalCount,
  isEditMode,
  onUpdateItem,
  onOpenImageModal,
  onOpenPhotoViewer,
  onOpenTextModal
}) => {
  return (
    <div 
      className="relative w-full h-full flex flex-col justify-between p-4 sm:p-5 bg-[#fdfaf1] rounded-lg overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border-x-[10px] sm:border-x-[12px] border-[#3d2b1f] select-text text-[#3d2b1f] font-serif" 
      style={{ backgroundImage: 'linear-gradient(to right, #fdfaf1 95%, #e8e4d8 100%)' }}
    >
      {/* Book Spine Line */}
      <div className="absolute top-0 left-0 bottom-0 w-[2px] bg-black/10 z-10 shadow-inner pointer-events-none" />

      {/* Top Header: Act & Order Indicator */}
      <div className="relative z-10 flex items-center justify-between pb-2 mb-1 border-b border-[#3d2b1f]/10">
        <div className="flex items-center space-x-2">
          <span className="bg-[#3d2b1f] text-[#fdfaf1] font-sans text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
            NO. {String(item.order).padStart(2, '0')}
          </span>
          <span
            contentEditable={isEditMode}
            suppressContentEditableWarning
            onBlur={(e) => {
              if (isEditMode) {
                onUpdateItem({ ...item, actTitle: e.currentTarget.textContent || item.actTitle });
              }
            }}
            className={`text-xs font-bold text-[#8b5e3c] font-sans tracking-wide uppercase ${
              isEditMode ? 'hover:bg-amber-100 px-1 rounded outline-none border-b border-dashed border-[#8b5e3c] cursor-text' : ''
            }`}
          >
            {item.actTitle}
          </span>
        </div>

        <div className="flex items-center space-x-1.5">
          {item.duration && (
            <div className="flex items-center space-x-1 text-[10px] text-[#8b5e3c]/70 font-sans">
              <Clock className="w-3 h-3 text-[#8b5e3c]" />
              <span
                contentEditable={isEditMode}
                suppressContentEditableWarning
                onBlur={(e) => {
                  if (isEditMode) {
                    onUpdateItem({ ...item, duration: e.currentTarget.textContent || item.duration });
                  }
                }}
                className={isEditMode ? 'hover:bg-amber-100 px-1 rounded outline-none cursor-text' : ''}
              >
                {item.duration}
              </span>
            </div>
          )}

          {isEditMode && onOpenTextModal && (
            <button
              type="button"
              onClick={() => onOpenTextModal(item, 'all')}
              className="px-2 py-0.5 rounded bg-[#3d2b1f] hover:bg-black text-[#fdfaf1] text-[9.5px] font-sans font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
              title="곡 정보 전체 수정"
            >
              <Edit2 className="w-2.5 h-2.5" />
              <span>편집</span>
            </button>
          )}
        </div>
      </div>

      {/* Scrollable Center Content */}
      <div className="relative z-10 flex-1 overflow-y-auto pr-1 space-y-3 my-1">
        
        {/* 1. Photo (사진) with Natural Tones Frame */}
        <div className="relative group rounded bg-[#e8e4d8] p-1 border border-black/5 shadow-xs">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xs bg-[#d7ccc8]">
            <img
              src={item.imageUrl}
              alt={item.songTitle}
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />

            {/* Fullscreen Zoom Action */}
            <button
              onClick={() => onOpenPhotoViewer(item.imageUrl, item.songTitle, item.imageCaption)}
              title="사진 크게 보기"
              className="absolute top-2 right-2 p-1.5 rounded bg-[#3d2b1f]/80 hover:bg-black text-[#fdfaf1] transition-all cursor-pointer shadow-sm"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>

            {/* Change Image Button in Edit Mode */}
            {isEditMode && (
              <button
                type="button"
                onClick={() => onOpenImageModal(item.id, item.imageUrl)}
                className="absolute bottom-2 right-2 px-2.5 py-1 rounded bg-[#3d2b1f] hover:bg-black text-[#fdfaf1] font-sans font-bold text-[10px] shadow-md flex items-center space-x-1 cursor-pointer transition-transform hover:scale-105"
              >
                <Camera className="w-3.5 h-3.5 text-[#e8e4d8]" />
                <span>사진 변경</span>
              </button>
            )}
          </div>

          {/* Photo Caption */}
          <div className="p-1.5 text-center">
            <p
              contentEditable={isEditMode}
              suppressContentEditableWarning
              onBlur={(e) => {
                if (isEditMode) {
                  onUpdateItem({ ...item, imageCaption: e.currentTarget.textContent || item.imageCaption });
                }
              }}
              className={`text-[10px] text-[#5d4037] font-batang italic ${
                isEditMode ? 'hover:bg-amber-100/70 px-1 rounded outline-none border-b border-dashed border-[#8b5e3c] cursor-text' : ''
              }`}
            >
              {item.imageCaption || "기록된 찬양과 묵상의 순간"}
            </p>
          </div>
        </div>

        {/* 2. Song Title & Theme Header */}
        <div className="text-center space-y-1">
          <h2
            contentEditable={isEditMode}
            suppressContentEditableWarning
            onBlur={(e) => {
              if (isEditMode) {
                onUpdateItem({ ...item, songTitle: e.currentTarget.textContent || item.songTitle });
              }
            }}
            className={`text-lg sm:text-xl font-bold font-serif-kr text-[#2a1b0a] tracking-tight leading-snug ${
              isEditMode ? 'hover:bg-amber-100 px-1 rounded outline-none border-b border-dashed border-[#8b5e3c] cursor-text' : ''
            }`}
          >
            {item.songTitle}
          </h2>

          {/* Scripture & Performer Tag */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 pt-0.5">
            {item.scripture && (
              <div className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-[#e8e4d8] border border-black/5 text-[10px] text-[#5d4037] font-batang">
                <BookOpen className="w-3 h-3 text-[#8b5e3c]" />
                <span
                  contentEditable={isEditMode}
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    if (isEditMode) {
                      onUpdateItem({ ...item, scripture: e.currentTarget.textContent || item.scripture });
                    }
                  }}
                  className={isEditMode ? 'hover:bg-amber-100 px-1 rounded outline-none cursor-text' : ''}
                >
                  {item.scripture}
                </span>
              </div>
            )}

            {item.performer && (
              <div className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-[#e8e4d8] border border-black/5 text-[10px] text-[#5d4037] font-serif-kr">
                <UserCheck className="w-3 h-3 text-[#8b5e3c]" />
                <span
                  contentEditable={isEditMode}
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    if (isEditMode) {
                      onUpdateItem({ ...item, performer: e.currentTarget.textContent || item.performer });
                    }
                  }}
                  className={isEditMode ? 'hover:bg-amber-100 px-1 rounded outline-none cursor-text' : ''}
                >
                  {item.performer}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 3. Lyrics / Devotional Verse (가사 및 글귀) */}
        <div 
          className={`relative bg-[#fdfaf1] rounded-md p-3.5 border transition-all ${
            isEditMode 
              ? 'border-[#8b5e3c] bg-amber-50/40 shadow-sm' 
              : 'border-[#3d2b1f]/10 shadow-xs'
          }`}
        >
          <Quote className="absolute top-2 left-2 w-3.5 h-3.5 text-[#8b5e3c]/20 -scale-x-100 pointer-events-none" />
          
          <div className="flex items-center justify-between mb-1.5 px-1">
            <span className="text-[9.5px] font-sans tracking-[0.2em] text-[#8b5e3c] font-bold uppercase">
              Information
            </span>
            
            {isEditMode && onOpenTextModal && (
              <button
                type="button"
                onClick={() => onOpenTextModal(item, 'lyrics')}
                className="px-2 py-0.5 rounded bg-[#8b5e3c] hover:bg-[#3d2b1f] text-[#fdfaf1] text-[10px] font-sans font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
              >
                <Edit2 className="w-2.5 h-2.5" />
                <span>가사 수정하기</span>
              </button>
            )}
          </div>

          <div className="text-left px-1">
            <p
              contentEditable={isEditMode}
              suppressContentEditableWarning
              onBlur={(e) => {
                if (isEditMode) {
                  onUpdateItem({ ...item, lyrics: e.currentTarget.innerText || item.lyrics });
                }
              }}
              onClick={() => {
                if (isEditMode && onOpenTextModal && window.innerWidth < 640) {
                  // On mobile, tap on text directly opens full edit modal for easy typing
                  onOpenTextModal(item, 'lyrics');
                }
              }}
              className={`text-xs sm:text-[12.5px] font-serif-kr text-[#3d2b1f] leading-relaxed whitespace-pre-line text-left ${
                isEditMode 
                  ? 'hover:bg-amber-100/80 p-1.5 rounded outline-none border border-dashed border-[#8b5e3c] cursor-text bg-white/70 shadow-inner' 
                  : ''
              }`}
            >
              {item.lyrics}
            </p>
          </div>
        </div>

        {/* 4. Commentary & Reflection (곡해설 & 묵상) */}
        {(item.commentary || isEditMode) && (
          <div 
            className={`rounded-md p-3 border transition-all ${
              isEditMode 
                ? 'bg-amber-50/50 border-[#8b5e3c]' 
                : 'bg-[#e8e4d8]/60 border-black/5'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-sans font-bold text-[#8b5e3c] uppercase tracking-wider flex items-center gap-1">
                <span>✦ Commentary</span>
              </span>

              {isEditMode && onOpenTextModal && (
                <button
                  type="button"
                  onClick={() => onOpenTextModal(item, 'commentary')}
                  className="px-2 py-0.5 rounded bg-[#8b5e3c] hover:bg-[#3d2b1f] text-[#fdfaf1] text-[10px] font-sans font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                >
                  <FileText className="w-2.5 h-2.5" />
                  <span>해설 수정하기</span>
                </button>
              )}
            </div>

            <p
              contentEditable={isEditMode}
              suppressContentEditableWarning
              onBlur={(e) => {
                if (isEditMode) {
                  onUpdateItem({ ...item, commentary: e.currentTarget.innerText || item.commentary });
                }
              }}
              onClick={() => {
                if (isEditMode && onOpenTextModal && window.innerWidth < 640) {
                  onOpenTextModal(item, 'commentary');
                }
              }}
              className={`text-[11px] sm:text-[11.5px] font-batang text-[#5d4037] leading-relaxed whitespace-pre-line ${
                isEditMode 
                  ? 'hover:bg-amber-100/80 p-1.5 rounded outline-none border border-dashed border-[#8b5e3c] cursor-text bg-white/70 shadow-inner' 
                  : ''
              }`}
            >
              {item.commentary || "(클릭하여 곡 해설 및 묵상글을 작성하세요)"}
            </p>
          </div>
        )}

      </div>

      {/* Footer / Page Indicator */}
      <div className="relative z-10 pt-2.5 border-t border-[#3d2b1f]/10 flex items-center justify-between text-[10px] text-[#8b5e3c]/70 font-sans">
        <span className="tracking-wider uppercase">PROGRAM NOTE</span>
        <span className="font-bold tracking-widest text-[#3d2b1f]">
          PAGE {String(currentIndex + 4).padStart(2, '0')} / {String(totalCount + 5).padStart(2, '0')}
        </span>
      </div>
    </div>
  );
};
