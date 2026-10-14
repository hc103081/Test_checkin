import React, { useState } from 'react';
import { X, Upload, FileText, RotateCcw, AlertCircle, CheckCircle } from 'lucide-react';
import { parseCSV, Resident, RAW_CSV_TEXT } from '../data/residentData';

interface CsvImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateResidents: (newResidents: Resident[]) => void;
  onResetToDefault: () => void;
  currentCount: number;
}

export const CsvImportModal: React.FC<CsvImportModalProps> = ({
  isOpen,
  onClose,
  onUpdateResidents,
  onResetToDefault,
  currentCount,
}) => {
  const [pastedText, setPastedText] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      processCsvText(content);
    };
    reader.onerror = () => {
      setErrorMsg('讀取檔案失敗，請再試一次。');
    };
    reader.readAsText(file);
  };

  const processCsvText = (text: string) => {
    try {
      setErrorMsg('');
      const parsed = parseCSV(text);
      if (parsed.length === 0) {
        setErrorMsg('無法解析出任何有效人員資料，請確認 CSV 格式。');
        return;
      }
      onUpdateResidents(parsed);
      setSuccessMsg(`成功匯入 ${parsed.length} 筆人員資料！`);
      setTimeout(() => {
        onClose();
        setSuccessMsg('');
        setPastedText('');
      }, 1200);
    } catch (err: any) {
      setErrorMsg(err?.message || '解析失敗');
    }
  };

  const handleRestoreDefault = () => {
    if (window.confirm('確定要還原至原本的進住名單 (154人) 嗎？')) {
      onResetToDefault();
      setSuccessMsg('已成功還原為原始進住人員名單！');
      setTimeout(() => {
        onClose();
        setSuccessMsg('');
      }, 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-150 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">名單資料管理</h2>
              <p className="text-xs text-slate-500">目前載入 {currentCount} 筆人員</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Option 1: File Upload */}
          <div className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-xl p-4 text-center transition-colors">
            <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
            <label className="cursor-pointer font-semibold text-blue-600 hover:text-blue-700 text-sm block">
              點擊上傳 CSV 檔案
              <input
                type="file"
                accept=".csv,text/csv"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            <p className="text-[11px] text-slate-400 mt-1">
              支援更新版進住名單 CSV（自動保留所有欄位）
            </p>
          </div>

          {/* Option 2: Paste Raw CSV */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              或直接貼上 CSV 文字：
            </label>
            <textarea
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder="序號,身分別,姓名,學號,宿舍,床位,航班入境時間,車輛,訂購寢具..."
              rows={4}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono text-[11px] focus:bg-white focus:ring-1 focus:ring-blue-500 text-slate-800"
            />
            {pastedText.trim() && (
              <button
                onClick={() => processCsvText(pastedText)}
                className="mt-2 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors cursor-pointer"
              >
                解析並套用貼上的資料
              </button>
            )}
          </div>

          {/* Option 3: Restore Default */}
          <div className="pt-2 border-t border-slate-150">
            <button
              onClick={handleRestoreDefault}
              className="w-full py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 font-medium rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>還原為原始進住人員名單 (154 人)</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-150 bg-slate-50/70 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors"
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  );
};
