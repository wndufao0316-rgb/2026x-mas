import React from 'react';
import { X, Maximize2 } from 'lucide-react';

interface PhotoViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title: string;
  caption?: string;
}

export const PhotoViewerModal: React.FC<PhotoViewerModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  title,
  caption
}) => {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md select-none animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-2xl w-full bg-[#fdfaf1] border-2 border-[#3d2b1f] rounded-lg overflow-hidden shadow-2xl flex flex-col font-sans"
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#e8e4d8] border-b border-[#3d2b1f]/20">
          <div className="flex items-center space-x-2 text-[#2a1b0a]">
            <Maximize2 className="w-4 h-4 text-[#8b5e3c]" />
            <span className="font-serif-kr font-bold text-sm truncate max-w-xs">{title}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-black/5 text-[#5d4037] hover:text-black transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Big Image View with clean framing */}
        <div className="relative p-2 bg-[#d7ccc8] flex items-center justify-center max-h-[70vh] overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="max-h-[65vh] w-auto object-contain rounded shadow-lg"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Caption */}
        {caption && (
          <div className="p-3.5 bg-[#e8e4d8] text-center border-t border-[#3d2b1f]/20">
            <p className="text-xs text-[#5d4037] font-batang italic">
              "{caption}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
