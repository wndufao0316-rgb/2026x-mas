import React, { useState, useEffect, useRef } from 'react';
import { X, Lock, KeyRound } from 'lucide-react';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setPassword('');
      setError(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (password === 'a789456123' || password === 'a7890') {
      setError(false);
      onSuccess();
      onClose();
    } else {
      setError(true);
      setPassword('');
      inputRef.current?.focus();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs select-text animate-fadeIn">
      <div className="relative w-full max-w-sm bg-[#fdfaf1] text-[#3d2b1f] rounded-lg border-2 border-[#3d2b1f] shadow-2xl overflow-hidden font-sans">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#e8e4d8] border-b border-[#3d2b1f]/20">
          <div className="flex items-center space-x-2">
            <Lock className="w-4 h-4 text-[#8b5e3c]" />
            <h3 className="font-serif-kr font-bold text-sm text-[#2a1b0a]">
              관리자 인증
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-black/5 text-[#5d4037] hover:text-black transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#2a1b0a] font-serif-kr">
              관리자 비밀번호
            </label>
            <div className="relative">
              <input
                ref={inputRef}
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(false);
                }}
                placeholder="비밀번호 입력"
                className={`w-full pl-9 pr-3 py-2 bg-[#fdfaf1] border rounded text-xs text-[#2a1b0a] focus:outline-none transition-colors ${
                  error 
                    ? 'border-rose-500 ring-1 ring-rose-500 bg-rose-50/30' 
                    : 'border-[#3d2b1f]/30 focus:border-[#3d2b1f]'
                }`}
              />
              <KeyRound className="w-4 h-4 text-[#8b5e3c] absolute left-3 top-2.5 pointer-events-none" />
            </div>
            {error && (
              <p className="text-[11px] text-rose-600 font-medium pt-0.5">
                비밀번호가 올바르지 않습니다.
              </p>
            )}
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#3d2b1f]/10">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded bg-black/10 hover:bg-black/20 text-[#3d2b1f] text-xs font-medium cursor-pointer transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded bg-[#3d2b1f] hover:bg-black text-[#fdfaf1] font-sans font-bold text-xs shadow-xs transition-colors cursor-pointer"
            >
              확인
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
