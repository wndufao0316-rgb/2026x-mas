import React, { useState } from 'react';
import { GOOGLE_APPS_SCRIPT_CODE, GOOGLE_SHEET_SAMPLE_CSV } from '../utils/appsScriptCode';
import { Copy, Check, X, FileCode, ExternalLink, Sheet } from 'lucide-react';

interface CodeViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CodeViewerModal: React.FC<CodeViewerModalProps> = ({ isOpen, onClose }) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedCsv, setCopiedCsv] = useState(false);
  const [tab, setTab] = useState<'script' | 'sheetGuide'>('script');

  if (!isOpen) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_CODE);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleCopyCsv = () => {
    navigator.clipboard.writeText(GOOGLE_SHEET_SAMPLE_CSV);
    setCopiedCsv(true);
    setTimeout(() => setCopiedCsv(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs select-text">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-[#fdfaf1] text-[#3d2b1f] rounded-lg border-2 border-[#3d2b1f] shadow-2xl overflow-hidden font-sans">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#e8e4d8] border-b border-[#3d2b1f]/20">
          <div className="flex items-center space-x-2">
            <FileCode className="w-5 h-5 text-[#8b5e3c]" />
            <h3 className="font-serif-kr font-bold text-base text-[#2a1b0a]">
              Google Apps Script (Code.gs) 연동 코드
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-black/5 text-[#5d4037] hover:text-black transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-[#3d2b1f]/15 bg-[#e8e4d8]/50 px-4 pt-2">
          <button
            onClick={() => setTab('script')}
            className={`px-4 py-2 text-xs sm:text-sm font-sans font-bold border-b-2 transition-colors cursor-pointer flex items-center space-x-1.5 ${
              tab === 'script'
                ? 'border-[#3d2b1f] text-[#2a1b0a]'
                : 'border-transparent text-[#5d4037] hover:text-black'
            }`}
          >
            <FileCode className="w-4 h-4 text-[#8b5e3c]" />
            <span>Code.gs 소스코드</span>
          </button>
          <button
            onClick={() => setTab('sheetGuide')}
            className={`px-4 py-2 text-xs sm:text-sm font-sans font-bold border-b-2 transition-colors cursor-pointer flex items-center space-x-1.5 ${
              tab === 'sheetGuide'
                ? 'border-[#3d2b1f] text-[#2a1b0a]'
                : 'border-transparent text-[#5d4037] hover:text-black'
            }`}
          >
            <Sheet className="w-4 h-4 text-[#8b5e3c]" />
            <span>스프레드시트 템플릿 헤더</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 text-xs sm:text-[13px] leading-relaxed">
          {tab === 'script' ? (
            <div className="space-y-3">
              <div className="bg-[#e8e4d8]/70 p-3 rounded border border-black/5 text-[#3d2b1f] text-xs">
                <p className="font-bold text-[#2a1b0a] mb-1 font-sans">📌 Apps Script 설치 및 배포 4단계:</p>
                <ol className="list-decimal list-inside space-y-0.5 text-[11.5px] text-[#5d4037]">
                  <li>구글 스프레드시트 메뉴 [확장 프로그램] → [Apps Script] 진입</li>
                  <li>아래 코드를 복사하여 Code.gs 에 전체 붙여넣기 후 저장 (Ctrl+S)</li>
                  <li>우측 상단 [배포] → [새 배포] → 유형: [웹 앱] 선택</li>
                  <li>액세스 권한: <strong className="text-[#2a1b0a] font-bold">[모든 사용자 (Anyone)]</strong> 지정 후 배포 URL 복사!</li>
                </ol>
              </div>

              <div className="relative rounded overflow-hidden border border-[#3d2b1f]/20 bg-[#2a1b0a]">
                <div className="flex items-center justify-between px-3 py-2 bg-[#1a0f08] border-b border-[#3d2b1f]/40 text-[#dfba73] text-xs font-mono">
                  <span>Code.gs (Google Apps Script)</span>
                  <button
                    onClick={handleCopyCode}
                    className="px-2.5 py-1 rounded bg-[#dfba73] hover:bg-[#ebd097] text-black font-semibold flex items-center space-x-1 transition-all cursor-pointer text-xs"
                  >
                    {copiedCode ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-green-800" />
                        <span>복사 완료!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>전체 코드 복사</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-3 text-[11px] font-mono text-[#fdfaf1] overflow-x-auto max-h-72 leading-normal select-all">
                  {GOOGLE_APPS_SCRIPT_CODE}
                </pre>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="bg-[#e8e4d8]/70 p-3 rounded border border-black/5 text-[#3d2b1f] text-xs">
                <p className="font-bold text-[#2a1b0a] mb-1 font-sans">📊 구글 스프레드시트 1행 헤더 구성:</p>
                <p className="text-[11.5px] text-[#5d4037] mb-2">
                  스프레드시트 1행(A1~K1)에 다음 항목명을 순서대로 작성하거나 아래 복사 버튼을 눌러 시트에 붙여넣으세요.
                </p>
                <button
                  onClick={handleCopyCsv}
                  className="px-3 py-1.5 rounded bg-[#3d2b1f] hover:bg-black text-[#fdfaf1] font-sans font-bold flex items-center space-x-1.5 transition-all cursor-pointer text-xs mb-1"
                >
                  {copiedCsv ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>헤더 샘플 복사됨</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>스프레드시트 샘플 복사</span>
                    </>
                  )}
                </button>
              </div>

              <div className="rounded overflow-hidden border border-[#3d2b1f]/15 bg-[#fdfaf1] p-3">
                <table className="w-full text-left text-[11px] font-sans border-collapse">
                  <thead>
                    <tr className="border-b border-[#3d2b1f]/20 text-[#8b5e3c]">
                      <th className="p-1">열</th>
                      <th className="p-1">헤더명</th>
                      <th className="p-1">설명 및 예시</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#3d2b1f]/10 text-[#3d2b1f]">
                    <tr><td className="p-1 text-[#8b5e3c] font-bold">A</td><td className="p-1 font-bold">순서</td><td className="p-1">1, 2, 3 (오름차순 정렬)</td></tr>
                    <tr><td className="p-1 text-[#8b5e3c] font-bold">B</td><td className="p-1 font-bold">악장구분</td><td className="p-1">서곡, 제1악장, 피날레 등</td></tr>
                    <tr><td className="p-1 text-[#8b5e3c] font-bold">C</td><td className="p-1 font-bold">곡명</td><td className="p-1">찬양 곡명 / 주제</td></tr>
                    <tr><td className="p-1 text-[#8b5e3c] font-bold">D</td><td className="p-1 font-bold">테마</td><td className="p-1">소제목 또는 테마</td></tr>
                    <tr><td className="p-1 text-[#8b5e3c] font-bold">E</td><td className="p-1 font-bold">성경구절</td><td className="p-1">창세기 1:1, 요한복음 등</td></tr>
                    <tr><td className="p-1 text-[#8b5e3c] font-bold">F</td><td className="p-1 font-bold">출연진</td><td className="p-1">정여호수아, 오케스트라 등</td></tr>
                    <tr><td className="p-1 text-[#8b5e3c] font-bold">G</td><td className="p-1 font-bold">사진URL</td><td className="p-1">이미지 웹 URL 주소</td></tr>
                    <tr><td className="p-1 text-[#8b5e3c] font-bold">H</td><td className="p-1 font-bold">사진설명</td><td className="p-1">사진 캡션 문구</td></tr>
                    <tr><td className="p-1 text-[#8b5e3c] font-bold">I</td><td className="p-1 font-bold">가사글귀</td><td className="p-1">주요 찬양 가사 또는 글귀</td></tr>
                    <tr><td className="p-1 text-[#8b5e3c] font-bold">J</td><td className="p-1 font-bold">곡해설</td><td className="p-1">곡 배경 및 묵상 글</td></tr>
                    <tr><td className="p-1 text-[#8b5e3c] font-bold">K</td><td className="p-1 font-bold">연주시간</td><td className="p-1">05:30 등</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-5 py-3 bg-[#e8e4d8] border-t border-[#3d2b1f]/20">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-[#3d2b1f] hover:bg-black text-[#fdfaf1] font-sans font-bold text-xs cursor-pointer transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
