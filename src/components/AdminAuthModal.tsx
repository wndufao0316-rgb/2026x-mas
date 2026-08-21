import React, { useState, useEffect, useRef } from 'react';
import { X, Lock, KeyRound, Eye, EyeOff } from 'lucide-react';

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
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setPassword('');
      setShowPassword(false);
      setError(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const checkPassword = (input: string): boolean => {
    // Normalize: remove all spaces, convert Korean IME 'ㅁ' to 'a', convert to lowercase
    const normalized = input
      .trim()
      .replace(/\s+/g, '')
      .toLowerCase()
      .replace(/^ㅁ/, 'a'); // handles Korean keyboard input where 'a' is typed as 'ㅁ'

    const validPasswords = [
      'a789456123',
      'a7890'
    ];

    return validPasswords.includes(normalized) || input.trim() === 'a789456123' || input.trim() === 'a7890';
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (checkPassword(password)) {
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
            <div className="relative flex items-center">
              <KeyRound className="w-4 h-4 text-[#8b5e3c] absolute left-3 pointer-events-none" />
              <input
                ref={inputRef}
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(false);
                }}
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                placeholder="비밀번호를 입력하세요"
                className={`w-full pl-9 pr-10 py-2 bg-[#fdfaf1] border rounded text-xs text-[#2a1b0a] focus:outline-none transition-colors ${
                  error 
                    ? 'border-rose-500 ring-1 ring-rose-500 bg-rose-50/30' 
                    : 'border-[#3d2b1f]/30 focus:border-[#3d2b1f]'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 p-1 text-[#8b5e3c] hover:text-[#2a1b0a] cursor-pointer"
                title={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
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
