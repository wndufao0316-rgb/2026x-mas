import React, { useState } from 'react';
import { X, Sheet, FileCode, Check, RefreshCw, AlertCircle, Download, Upload, RotateCcw, CloudUpload, ArrowDownCircle } from 'lucide-react';
import { BrochureData } from '../types';

interface SyncSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  brochureData: BrochureData;
  onSyncGoogleSheet: (url: string) => Promise<boolean>;
  onSaveToGoogleSheet: (url: string) => Promise<boolean>;
  onOpenCodeViewer: () => void;
  onResetToDefault: () => void;
  onImportData: (data: BrochureData) => void;
}

export const SyncSheetModal: React.FC<SyncSheetModalProps> = ({
  isOpen,
  onClose,
  brochureData,
  onSyncGoogleSheet,
  onSaveToGoogleSheet,
  onOpenCodeViewer,
  onResetToDefault,
  onImportData
}) => {
  const [sheetUrl, setSheetUrl] = useState(brochureData.googleSheetUrl || '');
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [syncStatus, setSyncStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: ''
  });

  if (!isOpen) return null;

  // 1. Google Sheets -> Web App Fetch
  const handleFetchFromSheet = async () => {
    if (!sheetUrl.trim()) {
      setSyncStatus({ type: 'error', message: 'Apps Script 웹 앱 URL을 입력해주세요.' });
      return;
    }

    setIsSyncing(true);
    setSyncStatus({ type: null, message: '' });

    const success = await onSyncGoogleSheet(sheetUrl.trim());
    setIsSyncing(false);

    if (success) {
      setSyncStatus({
        type: 'success',
        message: '구글 스프레드시트의 최신 순서와 곡 목록을 성공적으로 불러왔습니다!'
      });
    } else {
      setSyncStatus({
        type: 'error',
        message: '불러오기 실패: URL 또는 웹 앱 배포 권한([모든 사용자])을 확인해주세요.'
      });
    }
  };

  // 2. Web App -> Google Sheets Save
  const handleSaveToSheet = async () => {
    if (!sheetUrl.trim()) {
      setSyncStatus({ type: 'error', message: 'Apps Script 웹 앱 URL을 먼저 입력해주세요.' });
      return;
    }

    setIsSaving(true);
    setSyncStatus({ type: null, message: '' });

    const success = await onSaveToGoogleSheet(sheetUrl.trim());
    setIsSaving(false);

    if (success) {
      setSyncStatus({
        type: 'success',
        message: '웹앱에서 수정한 모든 글귀·사진·순서가 구글 스프레드시트에 성공적으로 저장되었습니다!'
      });
    } else {
      setSyncStatus({
        type: 'error',
        message: '시트 저장 실패: Google Apps Script 배포 설정 및 Code.gs의 doPost 함수를 확인해주세요.'
      });
    }
  };

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(brochureData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `praise_brochure_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed.items && Array.isArray(parsed.items)) {
            onImportData(parsed);
            alert('데이터를 성공적으로 불러왔습니다.');
            onClose();
          } else {
            alert('유효한 브로슈어 데이터 형식이 아닙니다.');
          }
        } catch {
          alert('JSON 파일을 파싱하는 데 실패했습니다.');
        }
      };
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs select-text font-sans"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg max-h-[90vh] bg-[#fdfaf1] text-[#3d2b1f] rounded-lg border-2 border-[#3d2b1f] shadow-2xl overflow-hidden flex flex-col font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#e8e4d8] border-b border-[#3d2b1f]/20">
          <div className="flex items-center space-x-2">
            <Sheet className="w-5 h-5 text-[#8b5e3c]" />
            <h3 className="font-serif-kr font-bold text-base text-[#2a1b0a]">
              구글 시트 실시간 양방향 연동 & 데이터 관리
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-black/5 text-[#5d4037] hover:text-black transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs sm:text-[13px]">
          {/* 1. Google Sheets & Apps Script Section */}
          <div className="p-4 rounded bg-[#fdfaf1] border border-[#3d2b1f]/15 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 font-serif-kr font-bold text-[#2a1b0a]">
                <Sheet className="w-4 h-4 text-[#8b5e3c]" />
                <span>구글 스프레드시트 양방향 동기화</span>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onOpenCodeViewer();
                }}
                className="px-2.5 py-1 bg-[#e8e4d8] hover:bg-[#d7ccc8] text-[#2a1b0a] rounded text-xs font-semibold flex items-center space-x-1 transition-colors cursor-pointer border border-black/5"
              >
                <FileCode className="w-3.5 h-3.5 text-[#8b5e3c]" />
                <span>Code.gs 코드 복사</span>
              </button>
            </div>
            
            <p className="text-[11.5px] text-[#5d4037] leading-relaxed font-batang">
              웹앱에서 수정한 <strong>모든 글귀(가사, 해설, 초대의 글 등)와 사진</strong>은 아래 <strong className="text-[#8b5e3c]">[구글 시트에 저장하기]</strong> 버튼을 누르면 연동된 구글 스프레드시트에 즉시 기록·반영됩니다.
            </p>

            <div className="space-y-2.5">
              <div>
                <label className="block text-[11px] font-bold text-[#2a1b0a] mb-1 font-sans">
                  구글 스프레드시트 링크 또는 Apps Script 웹 앱 URL:
                </label>
                <input
                  type="url"
                  placeholder="https://docs.google.com/spreadsheets/d/... 또는 https://script.google.com/macros/s/.../exec"
                  value={sheetUrl}
                  onChange={(e) => setSheetUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-[#fdfaf1] border border-[#3d2b1f]/30 rounded text-xs text-[#2a1b0a] focus:outline-none focus:border-[#3d2b1f]"
                />
              </div>

              {/* Status Guide regarding Spreadsheet URL vs Apps Script Web App URL */}
              {sheetUrl.includes('docs.google.com/spreadsheets') && (
                <div className="p-2.5 bg-amber-50/90 border border-amber-300 rounded text-[11.5px] text-amber-900 leading-relaxed font-sans space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-amber-950">
                    <span>💡 방명록 실시간 구글 시트 3번째 탭 자동 기록 안내</span>
                  </div>
                  <p>
                    현재 입력된 주소는 구글 시트 원본 문서 링크입니다.
                    <br />
                    웹에서 성도들이 작성한 <strong>방명록이 구글 시트 3번째 탭(방명록)에 실시간으로 자동 저장</strong>되거나 웹앱 수정본을 시트에 쓰려면, 구글 시트 상단 <strong>[확장 프로그램 → Apps Script]</strong>에서 <strong>Code.gs</strong>를 붙여넣고 <strong>[배포 → 웹 앱(모든 사용자)]</strong>으로 발행된 URL을 등록해주세요!
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenCodeViewer();
                    }}
                    className="inline-flex items-center gap-1 mt-1 text-[11px] font-bold text-[#8b5e3c] hover:underline cursor-pointer"
                  >
                    <FileCode className="w-3 h-3" />
                    <span>Apps Script 1분 배포 가이드 & 코드 복사하기 →</span>
                  </button>
                </div>
              )}

              {sheetUrl.includes('script.google.com/macros') && (
                <div className="p-2 bg-emerald-50 border border-emerald-300 rounded text-[11.5px] text-emerald-800 font-sans flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Apps Script 웹 앱 URL이 연결되어 방명록 실시간 저장 및 양방향 동기화가 완전히 활성화되었습니다.</span>
                </div>
              )}

              {/* Action Buttons: Save to Sheet / Fetch from Sheet */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={handleSaveToSheet}
                  disabled={isSaving || isSyncing}
                  className="px-3 py-2.5 bg-[#8b5e3c] hover:bg-[#704629] disabled:opacity-50 text-[#fdfaf1] font-sans font-bold rounded text-xs flex items-center justify-center space-x-1.5 transition-all cursor-pointer shadow-xs"
                >
                  <CloudUpload className={`w-4 h-4 ${isSaving ? 'animate-bounce' : ''}`} />
                  <span>{isSaving ? '시트에 저장 중...' : '구글 시트에 저장하기'}</span>
                </button>

                <button
                  onClick={handleFetchFromSheet}
                  disabled={isSyncing || isSaving}
                  className="px-3 py-2.5 bg-[#3d2b1f] hover:bg-black disabled:opacity-50 text-[#fdfaf1] font-sans font-bold rounded text-xs flex items-center justify-center space-x-1.5 transition-all cursor-pointer shadow-xs"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? '불러오는 중...' : '구글 시트서 불러오기'}</span>
                </button>
              </div>

              {syncStatus.type && (
                <div
                  className={`p-2.5 rounded text-xs flex items-center space-x-2 ${
                    syncStatus.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                      : 'bg-rose-50 text-rose-800 border border-rose-300'
                  }`}
                >
                  {syncStatus.type === 'success' ? (
                    <Check className="w-4 h-4 flex-shrink-0 text-emerald-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
                  )}
                  <span>{syncStatus.message}</span>
                </div>
              )}

              {brochureData.lastSynced && (
                <div className="text-[10.5px] text-[#8b5e3c] text-right font-sans">
                  최근 동기화: {new Date(brochureData.lastSynced).toLocaleString('ko-KR')}
                </div>
              )}
            </div>
          </div>

          {/* 2. Backup and Reset */}
          <div className="p-4 rounded bg-[#fdfaf1] border border-[#3d2b1f]/15 space-y-2.5">
            <div className="font-serif-kr font-bold text-[#2a1b0a] flex items-center space-x-2">
              <Download className="w-4 h-4 text-[#8b5e3c]" />
              <span>데이터 파일 백업 및 초기화</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleExportJson}
                className="p-2 bg-[#e8e4d8] hover:bg-[#d7ccc8] rounded text-[#2a1b0a] flex items-center justify-center space-x-1.5 transition-colors cursor-pointer text-xs font-medium border border-black/5"
              >
                <Download className="w-3.5 h-3.5 text-[#8b5e3c]" />
                <span>JSON 파일 내보내기</span>
              </button>
              
              <label className="p-2 bg-[#e8e4d8] hover:bg-[#d7ccc8] rounded text-[#2a1b0a] flex items-center justify-center space-x-1.5 transition-colors cursor-pointer text-xs text-center font-medium border border-black/5">
                <Upload className="w-3.5 h-3.5 text-[#8b5e3c]" />
                <span>JSON 파일 가져오기</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportJson}
                  className="hidden"
                />
              </label>
            </div>

            <button
              onClick={() => {
                if (confirm('모든 변경사항을 지우고 기본 샘플 찬양 순서로 초기화하시겠습니까?')) {
                  onResetToDefault();
                  alert('기본 데이터로 초기화되었습니다.');
                  onClose();
                }
              }}
              className="w-full p-2 rounded bg-[#e8e4d8] hover:bg-[#d7ccc8] border border-black/5 text-[#5d4037] flex items-center justify-center space-x-2 transition-colors cursor-pointer text-xs font-medium mt-1"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#8b5e3c]" />
              <span>기본 찬양 순서로 초기화</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 bg-[#e8e4d8] border-t border-[#3d2b1f]/20">
          <div className="text-[11px] text-[#5d4037] font-sans">
            JOSHUA JEONG PRAISE BROCHURE
          </div>
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
