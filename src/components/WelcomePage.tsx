import React from 'react';
import { BrochureMetadata } from '../types';
import { Scroll, Sparkles, Edit2, MessageSquare } from 'lucide-react';

interface WelcomePageProps {
  metadata: BrochureMetadata;
  isEditMode: boolean;
  onUpdateMetadata: (updated: BrochureMetadata) => void;
  onOpenEditModal: () => void;
  onNextPage: () => void;
}

export const WelcomePage: React.FC<WelcomePageProps> = ({
  metadata,
  isEditMode,
  onUpdateMetadata,
  onOpenEditModal,
  onNextPage
}) => {
  return (
    <div className="relative w-full h-full flex flex-col justify-between p-5 sm:p-6 bg-[#fdfaf1] rounded-lg overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border-x-[10px] sm:border-x-[12px] border-[#3d2b1f] select-text text-[#3d2b1f] font-serif" style={{ backgroundImage: 'linear-gradient(to right, #fdfaf1 95%, #e8e4d8 100%)' }}>
      
      {/* Book Spine Line */}
      <div className="absolute top-0 left-0 bottom-0 w-[2px] bg-black/10 z-10 shadow-inner pointer-events-none" />

      {/* Top Header */}
      <div className="relative z-10 pb-2 border-b border-[#3d2b1f]/10">
        <div className="flex items-center justify-between">
          <p className="text-[10px] tracking-[0.25em] font-sans text-[#8b5e3c] uppercase font-bold">
            Invocation & Welcome
          </p>

          {isEditMode && (
            <button
              onClick={onOpenEditModal}
              className="px-2 py-0.5 rounded bg-[#8b5e3c] hover:bg-[#3d2b1f] text-[#fdfaf1] text-[9.5px] font-sans font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
              title="초대의 글 본문 수정"
            >
              <Edit2 className="w-2.5 h-2.5" />
              <span>글귀 수정</span>
            </button>
          )}
        </div>
        
        <h2 className="text-xl sm:text-2xl font-bold font-serif-kr text-[#2a1b0a] tracking-tight text-center mt-1">
          초대의 글 <span className="text-xs sm:text-sm font-normal text-[#8b5e3c] font-sans ml-1">/ Invitation</span>
        </h2>
      </div>

      {/* Center Welcome Letter Content */}
      <div className="relative z-10 flex-1 overflow-y-auto my-2 pr-1 space-y-3.5 text-center">
        {/* Natural Seal Emblem */}
        <div className="w-12 h-12 mx-auto rounded-sm bg-[#e8e4d8] border border-black/5 shadow-inner flex items-center justify-center text-[#8b5e3c]">
          <span className="font-serif font-black text-xl">創</span>
        </div>

        {/* Subtitle */}
        <div className="space-y-0.5">
          <h3
            contentEditable={isEditMode}
            suppressContentEditableWarning
            onBlur={(e) => {
              if (isEditMode) {
                onUpdateMetadata({ ...metadata, concertTitle: e.currentTarget.textContent || metadata.concertTitle });
              }
            }}
            className={`text-base font-bold font-serif-kr text-[#2a1b0a] ${
              isEditMode ? 'hover:bg-amber-100 px-1 rounded outline-none border-b border-dashed border-[#8b5e3c] cursor-text' : ''
            }`}
            title={isEditMode ? "클릭하여 직접 수정" : undefined}
          >
            "{metadata.concertTitle}" 콘서트에 부쳐
          </h3>
          <p className="text-[11px] text-[#8b5e3c] font-sans tracking-wider font-semibold">
            {metadata.concertSubtitle}
          </p>
        </div>

        {/* Divider */}
        <div className="w-12 h-[1px] bg-[#8b5e3c] mx-auto" />

        {/* Message Body */}
        <div className="relative">
          <p
            contentEditable={isEditMode}
            suppressContentEditableWarning
            onBlur={(e) => {
              if (isEditMode) {
                onUpdateMetadata({ ...metadata, welcomeMessage: e.currentTarget.innerText || metadata.welcomeMessage });
              }
            }}
            className={`text-xs sm:text-[12.5px] font-batang text-[#3d2b1f] leading-relaxed whitespace-pre-line text-justify px-2 ${
              isEditMode ? 'hover:bg-amber-100/70 p-2 rounded outline-none border border-dashed border-[#8b5e3c] cursor-text bg-white/50' : ''
            }`}
            title={isEditMode ? "클릭하여 직접 글쓰기 및 수정" : undefined}
          >
            {metadata.welcomeMessage}
          </p>
        </div>

        {/* Signature Box */}
        <div className="pt-2 text-right px-3 space-y-0.5">
          <div className="text-[11px] text-[#8b5e3c] font-batang">찬양 사역자</div>
          <div className="text-sm font-bold font-serif-kr text-[#2a1b0a]">정 여 호 수 아 (Joshua Jeong) 拜上</div>
        </div>
      </div>

      {/* Bottom Button to TOC */}
      <div className="relative z-10 pt-2.5 border-t border-[#3d2b1f]/10 flex items-center justify-between text-[10px] text-[#8b5e3c]/70 font-sans">
        <button
          onClick={onNextPage}
          className="px-3.5 py-1.5 bg-[#3d2b1f] hover:bg-black text-[#fdfaf1] rounded font-sans text-xs font-semibold flex items-center space-x-1.5 shadow-xs transition-colors cursor-pointer"
        >
          <span>행사 순서(목차) 보기</span>
          <Sparkles className="w-3 h-3 text-[#e8e4d8]" />
        </button>
        <span className="font-bold tracking-widest text-[#3d2b1f]">INTRO</span>
      </div>
    </div>
  );
};
