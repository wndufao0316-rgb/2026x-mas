import React, { useState, useEffect } from 'react';
import { X, Check, FileText, Quote, BookOpen, Music } from 'lucide-react';
import { ProgramItem } from '../types';

interface EditTextModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: ProgramItem | null;
  field: 'lyrics' | 'commentary' | 'all';
  onSave: (updated: ProgramItem) => void;
}

export const EditTextModal: React.FC<EditTextModalProps> = ({
  isOpen,
  onClose,
  item,
  field,
  onSave
}) => {
  const [songTitle, setSongTitle] = useState('');
  const [actTitle, setActTitle] = useState('');
  const [scripture, setScripture] = useState('');
  const [performer, setPerformer] = useState('');
  const [lyrics, setLyrics] = useState('');
  const [commentary, setCommentary] = useState('');
  const [duration, setDuration] = useState('');
  const [imageCaption, setImageCaption] = useState('');

  useEffect(() => {
    if (item) {
      setSongTitle(item.songTitle || '');
      setActTitle(item.actTitle || '');
      setScripture(item.scripture || '');
      setPerformer(item.performer || '');
      setLyrics(item.lyrics || '');
      setCommentary(item.commentary || '');
      setDuration(item.duration || '');
      setImageCaption(item.imageCaption || '');
    }
  }, [item, isOpen]);

  if (!isOpen || !item) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...item,
      songTitle,
      actTitle,
      scripture,
      performer,
      lyrics,
      commentary,
      duration,
      imageCaption
    });
    onClose();
  };

  const getTitle = () => {
    if (field === 'lyrics') return '가사 및 글귀 수정';
    if (field === 'commentary') return '곡 해설 및 묵상글 수정';
    return '찬양 정보 및 글귀 편집';
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs select-text font-sans"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg max-h-[90vh] bg-[#fdfaf1] text-[#3d2b1f] rounded-lg border-2 border-[#3d2b1f] shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#e8e4d8] border-b border-[#3d2b1f]/20">
          <div className="flex items-center space-x-2">
            {field === 'lyrics' ? (
              <Quote className="w-4 h-4 text-[#8b5e3c]" />
            ) : field === 'commentary' ? (
              <FileText className="w-4 h-4 text-[#8b5e3c]" />
            ) : (
              <Music className="w-4 h-4 text-[#8b5e3c]" />
            )}
            <h3 className="font-serif-kr font-bold text-sm sm:text-base text-[#2a1b0a]">
              {getTitle()}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-black/5 text-[#5d4037] hover:text-black transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
          {/* Quick info bar */}
          <div className="bg-[#e8e4d8]/60 p-2.5 rounded border border-black/5 flex items-center justify-between">
            <span className="font-sans font-bold text-[#8b5e3c]">NO. {String(item.order).padStart(2, '0')}</span>
            <span className="font-serif-kr font-bold text-[#2a1b0a] truncate">{item.songTitle}</span>
          </div>

          {field === 'all' && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-bold text-[#8b5e3c]">악장 / 순서명</label>
                  <input
                    type="text"
                    value={actTitle}
                    onChange={(e) => setActTitle(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-[#fdfaf1] border border-[#3d2b1f]/30 rounded text-[#2a1b0a] focus:outline-none focus:border-[#3d2b1f]"
                    placeholder="예: 제1악장 : 빛의 창조"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-[#8b5e3c]">곡명 (찬양 제목)</label>
                  <input
                    type="text"
                    value={songTitle}
                    onChange={(e) => setSongTitle(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-[#fdfaf1] border border-[#3d2b1f]/30 rounded text-[#2a1b0a] font-bold focus:outline-none focus:border-[#3d2b1f]"
                    placeholder="곡명 입력"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-bold text-[#8b5e3c]">성경 구절</label>
                  <input
                    type="text"
                    value={scripture}
                    onChange={(e) => setScripture(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-[#fdfaf1] border border-[#3d2b1f]/30 rounded text-[#2a1b0a] focus:outline-none focus:border-[#3d2b1f]"
                    placeholder="예: 창세기 1:1"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-[#8b5e3c]">출연진 / 찬양자</label>
                  <input
                    type="text"
                    value={performer}
                    onChange={(e) => setPerformer(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-[#fdfaf1] border border-[#3d2b1f]/30 rounded text-[#2a1b0a] focus:outline-none focus:border-[#3d2b1f]"
                    placeholder="예: 정여호수아"
                  />
                </div>
              </div>
            </>
          )}

          {/* Lyrics / Verse Textarea */}
          {(field === 'lyrics' || field === 'all') && (
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="font-bold text-[#8b5e3c] flex items-center gap-1">
                  <Quote className="w-3.5 h-3.5" />
                  <span>찬양 가사 및 글귀 (줄바꿈 지원)</span>
                </label>
                <span className="text-[10px] text-[#5d4037]">엔터(Enter)로 줄바꿈</span>
              </div>
              <textarea
                value={lyrics}
                onChange={(e) => setLyrics(e.target.value)}
                rows={6}
                className="w-full p-3 bg-[#fdfaf1] border border-[#3d2b1f]/30 rounded text-[#2a1b0a] font-serif-kr text-xs leading-relaxed focus:outline-none focus:border-[#3d2b1f] resize-y"
                placeholder="찬양 가사 또는 묵상 글귀를 입력하세요..."
                autoFocus
              />
            </div>
          )}

          {/* Commentary Textarea */}
          {(field === 'commentary' || field === 'all') && (
            <div className="space-y-1">
              <label className="font-bold text-[#8b5e3c] flex items-center gap-1">
                <FileText className="w-3.5 h-3.5" />
                <span>곡 해설 및 묵상글</span>
              </label>
              <textarea
                value={commentary}
                onChange={(e) => setCommentary(e.target.value)}
                rows={4}
                className="w-full p-3 bg-[#fdfaf1] border border-[#3d2b1f]/30 rounded text-[#2a1b0a] font-batang text-xs leading-relaxed focus:outline-none focus:border-[#3d2b1f] resize-y"
                placeholder="곡에 대한 해설 및 묵상 글을 입력하세요..."
              />
            </div>
          )}

          {field === 'all' && (
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="font-bold text-[#8b5e3c]">사진 캡션 (설명)</label>
                <input
                  type="text"
                  value={imageCaption}
                  onChange={(e) => setImageCaption(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-[#fdfaf1] border border-[#3d2b1f]/30 rounded text-[#2a1b0a] focus:outline-none focus:border-[#3d2b1f]"
                  placeholder="예: 기록된 찬양의 순간"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-[#8b5e3c]">연주 시간</label>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-[#fdfaf1] border border-[#3d2b1f]/30 rounded text-[#2a1b0a] focus:outline-none focus:border-[#3d2b1f]"
                  placeholder="예: 05:30"
                />
              </div>
            </div>
          )}

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#3d2b1f]/15">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded bg-black/10 hover:bg-black/20 text-[#3d2b1f] font-medium cursor-pointer transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded bg-[#3d2b1f] hover:bg-black text-[#fdfaf1] font-bold flex items-center space-x-1 shadow-xs transition-colors cursor-pointer"
            >
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>저장 및 적용</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
