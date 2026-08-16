import React from 'react';
import { BrochureMetadata } from '../types';
import { Edit2, Camera, Eye } from 'lucide-react';

interface WelcomePhotoPageProps {
  metadata: BrochureMetadata;
  isEditMode: boolean;
  onUpdateMetadata: (updated: BrochureMetadata) => void;
  onOpenEditModal: () => void;
  onOpenImageModal: (url: string) => void;
  onOpenPhotoViewer: (url: string, title: string, caption?: string) => void;
}

export const WelcomePhotoPage: React.FC<WelcomePhotoPageProps> = ({
  metadata,
  isEditMode,
  onUpdateMetadata,
  onOpenEditModal,
  onOpenImageModal,
  onOpenPhotoViewer
}) => {
  const imageUrl = metadata.welcomePage2ImageUrl || 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=800&q=80';
  const heading = metadata.welcomePage2Heading || '초대의 글';
  const subtitle = metadata.welcomePage2Subtitle || 'PROLOG';
  const dedication = metadata.welcomePage2DedicationHeader || '은혜의 여정을 함께하며';
  const message = metadata.welcomePage2Message || `함께 모여 같은 마음으로 주를 바라보는 이 자리가 
우리에게 가장 큰 위로와 기쁨이 됩니다. 
무대 위의 선율과 회중의 기도가 하나 되어 
하늘 보좌에 상달되는 영원한 감사의 고백이 되기를 소망합니다.`;
  const caption = metadata.welcomePage2ImageCaption || '아름다운 선율과 기도가 머무는 거룩한 찬양의 처소';

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
          <p
            contentEditable={isEditMode}
            suppressContentEditableWarning
            onBlur={(e) => {
              if (isEditMode) {
                onUpdateMetadata({
                  ...metadata,
                  welcomePage2Subtitle: e.currentTarget.textContent?.trim() || metadata.welcomePage2Subtitle
                });
              }
            }}
            className={`text-[10px] tracking-[0.25em] font-sans text-[#8b5e3c] uppercase font-bold ${
              isEditMode ? 'hover:bg-amber-100 px-1 rounded outline-none border-b border-dashed border-[#8b5e3c] cursor-text' : ''
            }`}
            title={isEditMode ? "클릭하여 상단 영문 소제목 수정" : undefined}
          >
            {subtitle}
          </p>

          {isEditMode && (
            <button
              onClick={onOpenEditModal}
              className="px-2 py-0.5 rounded bg-[#8b5e3c] hover:bg-[#3d2b1f] text-[#fdfaf1] text-[9.5px] font-sans font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
              title="초대의 글(사진 페이지) 항목 수정창 열기"
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
                  welcomePage2Heading: e.currentTarget.textContent?.trim() || metadata.welcomePage2Heading
                });
              }
            }}
            className={isEditMode ? 'hover:bg-amber-100 px-1 rounded outline-none border-b border-dashed border-[#8b5e3c] cursor-text' : ''}
            title={isEditMode ? "클릭하여 제목 수정" : undefined}
          >
            {heading}
          </span>
        </h2>
      </div>

      {/* Main Content Area: Photo + Message Box */}
      <div className="relative z-10 flex-1 overflow-y-auto mt-2 mb-2 pr-1 flex flex-col justify-between space-y-3">
        {/* Dedication Header (Top) */}
        <div className="text-center pt-0.5">
          <h3
            contentEditable={isEditMode}
            suppressContentEditableWarning
            onBlur={(e) => {
              if (isEditMode) {
                onUpdateMetadata({
                  ...metadata,
                  welcomePage2DedicationHeader: e.currentTarget.textContent || metadata.welcomePage2DedicationHeader
                });
              }
            }}
            className={`text-sm sm:text-base font-bold font-serif-kr text-[#2a1b0a] ${
              isEditMode ? 'hover:bg-amber-100 px-1 rounded outline-none border-b border-dashed border-[#8b5e3c] cursor-text' : ''
            }`}
            title={isEditMode ? "클릭하여 글귀 제목 직접 수정" : undefined}
          >
            {dedication}
          </h3>
          <div className="w-12 h-[1px] bg-[#8b5e3c]/40 mx-auto mt-1" />
        </div>

        {/* Photo Container */}
        <div className="relative group w-full h-36 sm:h-44 rounded-lg overflow-hidden border border-[#3d2b1f]/20 shadow-md bg-stone-900 flex-shrink-0">
          <img
            src={imageUrl}
            alt="초대의 글 사진"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />

          {/* Photo Gradient Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

          {/* Photo Action Buttons */}
          <div className="absolute bottom-2 right-2 flex items-center space-x-1.5 z-20">
            <button
              onClick={() => onOpenPhotoViewer(imageUrl, heading, caption)}
              className="p-1.5 rounded-full bg-black/60 hover:bg-black text-white text-[11px] backdrop-blur-xs transition-colors cursor-pointer"
              title="사진 크게 보기"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
            {isEditMode && (
              <button
                onClick={() => onOpenImageModal(imageUrl)}
                className="p-1.5 rounded-full bg-[#8b5e3c] hover:bg-[#2a1b0a] text-white text-[11px] transition-colors shadow-md cursor-pointer"
                title="사진 변경하기 (URL / 업로드)"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Image Caption */}
          <div className="absolute bottom-2 left-2 right-16 pointer-events-none">
            <p className="text-[10px] text-[#f7e7ce] truncate font-sans drop-shadow-md">
              {caption}
            </p>
          </div>
        </div>

        {/* Text Message Container */}
        <div className="relative flex-1 px-1 sm:px-2 pt-0.5">
          <p
            contentEditable={isEditMode}
            suppressContentEditableWarning
            onBlur={(e) => {
              if (isEditMode) {
                onUpdateMetadata({
                  ...metadata,
                  welcomePage2Message: e.currentTarget.innerText || metadata.welcomePage2Message
                });
              }
            }}
            className={`text-xs sm:text-[12.5px] font-batang text-[#3d2b1f] leading-relaxed whitespace-pre-line text-justify px-2 py-1 ${
              isEditMode ? 'hover:bg-amber-100/70 p-2 rounded outline-none border border-dashed border-[#8b5e3c] cursor-text bg-white/50' : ''
            }`}
            title={isEditMode ? "클릭하여 직접 글쓰기 및 수정" : undefined}
          >
            {message}
          </p>
        </div>
      </div>

      {/* Footer / Page Indicator */}
      <div className="relative z-10 pt-2 border-t border-[#3d2b1f]/10 flex items-center justify-between text-[10px] text-[#8b5e3c]/70 font-sans">
        <span className="tracking-wider uppercase">INVITATION</span>
        <span className="font-bold tracking-widest text-[#3d2b1f]">PAGE 01</span>
      </div>
    </div>
  );
};
