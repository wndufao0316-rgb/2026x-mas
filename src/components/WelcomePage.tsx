import React from 'react';
import { BrochureMetadata } from '../types';
import { Edit2 } from 'lucide-react';

interface WelcomePageProps {
  metadata: BrochureMetadata;
  isEditMode: boolean;
  onUpdateMetadata: (updated: BrochureMetadata) => void;
  onOpenEditModal: () => void;
}

export const WelcomePage: React.FC<WelcomePageProps> = ({
  metadata,
  isEditMode,
  onUpdateMetadata,
  onOpenEditModal
}) => {
  return (
    <div className="relative w-full h-full flex flex-col justify-between p-6 sm:p-7 bg-[#fdfaf1] rounded-r-lg rounded-l-xs overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,0.45)] border-l-[12px] border-[#2b1810] select-text text-[#3d2b1f] font-serif" style={{ backgroundImage: 'linear-gradient(to right, #e8e4d8 0%, #fdfaf1 4%, #fdfaf1 96%, #e8e4d8 100%)' }}>
      
      {/* Book Spine Shadow Line */}
      <div className="absolute top-0 left-0 bottom-0 w-[6px] bg-gradient-to-r from-black/25 to-transparent z-10 pointer-events-none" />

      {/* Top Header */}
      <div className="relative z-10 pb-2 border-b border-[#3d2b1f]/15">
        <div className="flex items-center justify-between">
          <p
            contentEditable={isEditMode}
            suppressContentEditableWarning
            onBlur={(e) => {
              if (isEditMode) {
                onUpdateMetadata({
                  ...metadata,
                  welcomeSubtitle: e.currentTarget.textContent?.trim() || metadata.welcomeSubtitle
                });
              }
            }}
            className={`text-[10px] tracking-[0.25em] font-sans text-[#8b5e3c] uppercase font-bold ${
              isEditMode ? 'hover:bg-amber-100 px-1 rounded outline-none border-b border-dashed border-[#8b5e3c] cursor-text' : ''
            }`}
            title={isEditMode ? "클릭하여 상단 영문 소제목 수정" : undefined}
          >
            {metadata.welcomeSubtitle || 'Invocation & Welcome'}
          </p>

          {isEditMode && (
            <button
              onClick={onOpenEditModal}
              className="px-2 py-0.5 rounded bg-[#8b5e3c] hover:bg-[#3d2b1f] text-[#fdfaf1] text-[9.5px] font-sans font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
              title="초대의 글 본문 및 전체 항목 수정창 열기"
            >
              <Edit2 className="w-2.5 h-2.5" />
              <span>전체 수정</span>
            </button>
          )}
        </div>
        
        <h2 className="text-xl sm:text-2xl font-bold font-serif-kr text-[#2a1b0a] tracking-tight text-center mt-1 flex items-center justify-center">
          <span
            contentEditable={isEditMode}
            suppressContentEditableWarning
            onBlur={(e) => {
              if (isEditMode) {
                onUpdateMetadata({
                  ...metadata,
                  welcomeHeading: e.currentTarget.textContent?.trim() || metadata.welcomeHeading
                });
              }
            }}
            className={isEditMode ? 'hover:bg-amber-100 px-1 rounded outline-none border-b border-dashed border-[#8b5e3c] cursor-text' : ''}
            title={isEditMode ? "클릭하여 제목 수정" : undefined}
          >
            {metadata.welcomeHeading || '초대의 글'}
          </span>
        </h2>
      </div>

      {/* Center Welcome Letter Content - Positioned Higher and Expanded Downwards */}
      <div className="relative z-10 flex-1 overflow-y-auto mt-2 mb-2 pr-1 flex flex-col justify-start">
        {/* Subtitle / Header Dedication Quote - Moved up */}
        <div className="pt-1 pb-1 text-center">
          <h3
            contentEditable={isEditMode}
            suppressContentEditableWarning
            onBlur={(e) => {
              if (isEditMode) {
                onUpdateMetadata({ 
                  ...metadata, 
                  welcomeDedicationHeader: e.currentTarget.textContent || metadata.welcomeDedicationHeader 
                });
              }
            }}
            className={`text-sm sm:text-base font-bold font-serif-kr text-[#2a1b0a] ${
              isEditMode ? 'hover:bg-amber-100 px-1 rounded outline-none border-b border-dashed border-[#8b5e3c] cursor-text' : ''
            }`}
            title={isEditMode ? "클릭하여 글귀 제목 직접 수정" : undefined}
          >
            {metadata.welcomeDedicationHeader || `"${metadata.concertTitle || '운명(運命): 창조의 뜻'}"에 부쳐`}
          </h3>
          {/* Subtle Divider Line */}
          <div className="w-12 h-[1px] bg-[#8b5e3c]/40 mx-auto mt-1.5" />
        </div>

        {/* Expanded Message Body - Generous Height */}
        <div className="relative px-1 sm:px-2 pt-1 flex-1">
          <p
            contentEditable={isEditMode}
            suppressContentEditableWarning
            onBlur={(e) => {
              if (isEditMode) {
                onUpdateMetadata({ ...metadata, welcomeMessage: e.currentTarget.innerText || metadata.welcomeMessage });
              }
            }}
            className={`text-xs sm:text-[13px] font-batang text-[#3d2b1f] leading-relaxed whitespace-pre-line text-justify px-2 py-1 ${
              isEditMode ? 'hover:bg-amber-100/70 p-2 rounded outline-none border border-dashed border-[#8b5e3c] cursor-text bg-white/50' : ''
            }`}
            title={isEditMode ? "클릭하여 직접 글쓰기 및 수정" : undefined}
          >
            {metadata.welcomeMessage}
          </p>
        </div>
      </div>

      {/* Footer / Page Indicator */}
      <div className="relative z-10 pt-2.5 border-t border-[#3d2b1f]/10 flex items-center justify-between text-[10px] text-[#8b5e3c]/70 font-sans">
        <span className="tracking-wider uppercase">INVITATION</span>
        <span className="font-bold tracking-widest text-[#3d2b1f]">PAGE 02</span>
      </div>
    </div>
  );
};
