import React from 'react';
import { motion } from 'motion/react';
import { ProgramItem, BrochureMetadata } from '../types';
import { ChevronRight, Plus, Image as ImageIcon, Sparkles } from 'lucide-react';

interface TableOfContentsProps {
  items: ProgramItem[];
  metadata: BrochureMetadata;
  onSelectPage: (index: number) => void;
  isEditMode: boolean;
  onUpdateItem: (updated: ProgramItem) => void;
  onAddNewItem?: () => void;
  onOpenImageModal: (itemId: string, currentUrl: string) => void;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({
  items,
  metadata,
  onSelectPage,
  isEditMode,
  onUpdateItem,
  onAddNewItem,
  onOpenImageModal
}) => {
  // 오름차순 정렬
  const sortedItems = [...items].sort((a, b) => a.order - b.order);

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-5 sm:p-6 bg-[#fdfaf1] rounded-lg overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border-x-[10px] sm:border-x-[12px] border-[#3d2b1f] select-text text-[#3d2b1f] font-serif" style={{ backgroundImage: 'linear-gradient(to left, #fdfaf1 95%, #e8e4d8 100%)' }}>
      
      {/* Delicate spine line */}
      <div className="absolute top-0 left-0 bottom-0 w-[2px] bg-black/10 z-10 shadow-inner pointer-events-none" />

      {/* Header Section */}
      <div className="relative z-10 flex justify-between items-end pb-3 mb-2 border-b border-[#3d2b1f]/10">
        <div>
          <p className="text-[10px] tracking-[0.25em] font-sans text-[#8b5e3c] uppercase font-bold mb-0.5">
            Order of Worship
          </p>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#2a1b0a] font-serif-kr">
            행사 순서 <span className="text-xs sm:text-sm font-normal text-[#8b5e3c] font-sans ml-1.5">/ Program</span>
          </h2>
        </div>

        <div className="text-right">
          <span className="text-[10px] font-sans text-[#8b5e3c] font-semibold bg-[#e8e4d8] px-2.5 py-1 rounded-full border border-black/5">
            총 {sortedItems.length}곡
          </span>
        </div>
      </div>

      {isEditMode && (
        <div className="relative z-10 mb-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#e8e4d8] border border-[#8b5e3c]/30 text-[10px] text-[#5d4037] font-sans font-medium">
          <Sparkles className="w-3 h-3 text-[#8b5e3c]" />
          <span>수정 모드: 글자와 사진을 클릭하여 직접 변경할 수 있습니다</span>
        </div>
      )}

      {/* Main TOC List with Scrollbar */}
      <div className="relative z-10 flex-1 overflow-y-auto pr-1 space-y-3.5 my-1">
        {sortedItems.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.04, duration: 0.25 }}
            className="group relative bg-[#fdfaf1] hover:bg-[#f7f2e4] rounded-md p-2 border border-[#3d2b1f]/10 hover:border-[#8b5e3c]/50 transition-all shadow-xs flex items-center space-x-3 cursor-pointer"
            onClick={() => onSelectPage(idx)}
          >
            {/* Thumbnail Photo with Quick Edit in Edit Mode */}
            <div className="relative w-16 h-16 sm:w-18 sm:h-18 flex-shrink-0 rounded bg-[#e8e4d8] border border-black/5 overflow-hidden shadow-xs">
              <img
                src={item.imageUrl}
                alt={item.songTitle}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-0.5 left-0.5 bg-[#3d2b1f]/80 text-[#fdfaf1] font-sans text-[9px] font-bold px-1 rounded-xs">
                {String(item.order).padStart(2, '0')}
              </div>

              {isEditMode && (
                <button
                  type="button"
                  title="사진 변경"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenImageModal(item.id, item.imageUrl);
                  }}
                  className="absolute inset-0 bg-[#3d2b1f]/75 flex flex-col items-center justify-center text-white text-[9px] hover:bg-[#2a1b0a] transition-colors"
                >
                  <ImageIcon className="w-3.5 h-3.5 mb-0.5 text-[#e8e4d8]" />
                  <span>사진교체</span>
                </button>
              )}
            </div>

            {/* Info Content */}
            <div className="flex-1 min-w-0 pr-1">
              <div className="flex items-center justify-between">
                <span
                  contentEditable={isEditMode}
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    if (isEditMode) {
                      onUpdateItem({ ...item, actTitle: e.currentTarget.textContent || item.actTitle });
                    }
                  }}
                  onClick={(e) => isEditMode && e.stopPropagation()}
                  className={`text-[10.5px] font-bold text-[#8b5e3c] font-sans tracking-wide uppercase ${
                    isEditMode ? 'hover:bg-amber-100/80 px-1 rounded outline-none border-b border-dashed border-[#8b5e3c]' : ''
                  }`}
                >
                  {item.actTitle}
                </span>
                {item.duration && (
                  <span className="text-[9.5px] text-[#8b5e3c]/70 font-sans">
                    {item.duration}
                  </span>
                )}
              </div>

              <h3
                contentEditable={isEditMode}
                suppressContentEditableWarning
                onBlur={(e) => {
                  if (isEditMode) {
                    onUpdateItem({ ...item, songTitle: e.currentTarget.textContent || item.songTitle });
                  }
                }}
                onClick={(e) => isEditMode && e.stopPropagation()}
                className={`text-sm font-bold font-serif-kr text-[#2a1b0a] truncate mt-0.5 ${
                  isEditMode ? 'hover:bg-amber-100/80 px-1 rounded outline-none border-b border-dashed border-[#8b5e3c]' : ''
                }`}
              >
                {String(item.order).padStart(2, '0')}. {item.songTitle}
              </h3>

              <p
                contentEditable={isEditMode}
                suppressContentEditableWarning
                onBlur={(e) => {
                  if (isEditMode) {
                    onUpdateItem({ ...item, theme: e.currentTarget.textContent || item.theme });
                  }
                }}
                onClick={(e) => isEditMode && e.stopPropagation()}
                className={`text-xs text-[#8b5e3c] truncate font-batang mt-0.5 leading-snug ${
                  isEditMode ? 'hover:bg-amber-100/80 px-1 rounded outline-none border-b border-dashed border-[#8b5e3c]' : ''
                }`}
              >
                {item.theme || item.lyrics.split('\n')[0]}
              </p>
            </div>

            {/* Jump Button */}
            <div className="flex-shrink-0 text-[#8b5e3c] group-hover:translate-x-1 transition-transform">
              <ChevronRight className="w-4 h-4" />
            </div>
          </motion.div>
        ))}

        {/* Add Item Button in Edit Mode */}
        {isEditMode && onAddNewItem && (
          <button
            onClick={onAddNewItem}
            id="btn-add-new-toc-item"
            className="w-full py-2.5 px-3 border border-dashed border-[#8b5e3c]/60 hover:border-[#3d2b1f] rounded-md text-xs font-sans font-bold text-[#3d2b1f] hover:bg-[#e8e4d8]/50 flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#8b5e3c]" />
            <span>새 행사 순서(곡) 추가하기</span>
          </button>
        )}
      </div>

      {/* Footer Info */}
      <div className="relative z-10 pt-3 border-t border-[#3d2b1f]/10 flex justify-between items-center text-[10px] text-[#8b5e3c]/70 font-sans">
        <span className="tracking-wider">PAGE 01</span>
        <div className="flex gap-1.5 items-center">
          <div className="w-1.5 h-1.5 rounded-full bg-[#3d2b1f]"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-[#3d2b1f]/20"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-[#3d2b1f]/20"></div>
        </div>
      </div>
    </div>
  );
};
