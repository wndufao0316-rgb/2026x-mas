import React, { useState } from 'react';
import { X, Upload, Link as LinkIcon, Check, Image as ImageIcon, Sparkles } from 'lucide-react';

interface EditImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUrl: string;
  onSave: (newUrl: string) => void;
}

const PRESET_CLASSICAL_IMAGES = [
  {
    title: "성전 파이프 오르간과 촛불",
    url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "창조의 빛과 별빛",
    url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "광야와 여명의 새벽빛",
    url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "고전적 십자가와 성경",
    url: "https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "오케스트라와 현악기",
    url: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "합창단과 성스러운 영광",
    url: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "고전 서재의 깃펜과 양장본",
    url: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "원목 보면대 위의 클래식 악보",
    url: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?auto=format&fit=crop&w=800&q=80"
  }
];

export const EditImageModal: React.FC<EditImageModalProps> = ({
  isOpen,
  onClose,
  currentUrl,
  onSave
}) => {
  const [imageUrl, setImageUrl] = useState(currentUrl);
  const [previewUrl, setPreviewUrl] = useState(currentUrl);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setImageUrl(result);
          setPreviewUrl(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApply = () => {
    if (previewUrl) {
      onSave(previewUrl);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs select-text">
      <div className="relative w-full max-w-lg bg-[#fdfaf1] text-[#3d2b1f] rounded-lg border-2 border-[#3d2b1f] shadow-2xl overflow-hidden font-sans">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#e8e4d8] border-b border-[#3d2b1f]/20">
          <div className="flex items-center space-x-2">
            <ImageIcon className="w-5 h-5 text-[#8b5e3c]" />
            <h3 className="font-serif-kr font-bold text-base text-[#2a1b0a]">
              사진 변경 및 업로드
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-black/5 text-[#5d4037] hover:text-black transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Current Preview */}
          <div className="space-y-1.5">
            <label className="text-xs text-[#8b5e3c] font-bold font-sans">미리보기</label>
            <div className="relative aspect-[16/10] w-full rounded bg-[#e8e4d8] overflow-hidden border border-black/10 flex items-center justify-center">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={() => setPreviewUrl('https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80')}
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span className="text-[#5d4037] text-xs">선택된 이미지가 없습니다</span>
              )}
            </div>
          </div>

          {/* Option 1: Local File Upload */}
          <div className="space-y-1.5">
            <label className="text-xs text-[#2a1b0a] font-semibold flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5 text-[#8b5e3c]" />
              <span>내 기기에서 사진 파일 업로드</span>
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="w-full text-xs text-[#3d2b1f] file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-[#3d2b1f] file:text-[#fdfaf1] hover:file:bg-black cursor-pointer bg-[#e8e4d8]/50 p-2 rounded border border-[#3d2b1f]/20"
            />
          </div>

          {/* Option 2: Image URL Input */}
          <div className="space-y-1.5">
            <label className="text-xs text-[#2a1b0a] font-semibold flex items-center gap-1.5">
              <LinkIcon className="w-3.5 h-3.5 text-[#8b5e3c]" />
              <span>이미지 웹 URL 주소 입력</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value);
                  setPreviewUrl(e.target.value);
                }}
                className="flex-1 bg-[#fdfaf1] border border-[#3d2b1f]/30 rounded px-3 py-2 text-xs text-[#2a1b0a] focus:outline-none focus:border-[#3d2b1f]"
              />
            </div>
          </div>

          {/* Option 3: Presets */}
          <div className="space-y-2 pt-2 border-t border-[#3d2b1f]/15">
            <label className="text-xs text-[#8b5e3c] font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>추천 고전 아카이브 사진 선택</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {PRESET_CLASSICAL_IMAGES.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setImageUrl(preset.url);
                    setPreviewUrl(preset.url);
                  }}
                  className={`relative aspect-square rounded overflow-hidden border-2 transition-all cursor-pointer ${
                    previewUrl === preset.url ? 'border-[#3d2b1f] scale-95 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                  title={preset.title}
                >
                  <img
                    src={preset.url}
                    alt={preset.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {previewUrl === preset.url && (
                    <div className="absolute inset-0 bg-[#3d2b1f]/40 flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-3 bg-[#e8e4d8] border-t border-[#3d2b1f]/20">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded bg-black/10 hover:bg-black/20 text-[#3d2b1f] text-xs font-medium cursor-pointer transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-1.5 rounded bg-[#3d2b1f] hover:bg-black text-[#fdfaf1] font-sans font-bold text-xs shadow-xs transition-colors cursor-pointer"
          >
            적용 완료
          </button>
        </div>
      </div>
    </div>
  );
};
