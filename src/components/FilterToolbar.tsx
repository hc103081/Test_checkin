import React, { useRef, useEffect } from 'react';
import {
  Search,
  X,
  SlidersHorizontal,
  Download,
  Upload,
  Calendar,
  LayoutGrid,
  Table as TableIcon,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';

export interface FilterState {
  globalSearch: string;
  identity: string;
  dormitory: string;
  vehicle: string;
  bedding: string;
  dateCategory: string;
  bedStatus: string;
  checkInStatus: string;
}

interface FilterToolbarProps {
  filters: FilterState;
  onChange: (newFilters: FilterState) => void;
  onReset: () => void;
  onOpenSchedule: () => void;
  onExportCsv: () => void;
  onOpenImport: () => void;
  onOpenMobileFilter?: () => void;
  viewMode: 'table' | 'card';
  onToggleViewMode: (mode: 'table' | 'card') => void;
  filteredCount: number;
  totalCount: number;
  onBatchCheckInVisible: () => void;
  onResetCheckIn: () => void;
  showAdvanced: boolean;
  onToggleAdvanced: () => void;
}

export const FilterToolbar: React.FC<FilterToolbarProps> = ({
  filters,
  onChange,
  onReset,
  onOpenSchedule,
  onExportCsv,
  onOpenImport,
  onOpenMobileFilter,
  viewMode,
  onToggleViewMode,
  filteredCount,
  totalCount,
  onBatchCheckInVisible,
  onResetCheckIn,
  showAdvanced,
  onToggleAdvanced,
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut '/' to focus search, 'Escape' to clear
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      } else if (e.key === 'Escape' && document.activeElement === searchInputRef.current) {
        if (filters.globalSearch) {
          onChange({ ...filters, globalSearch: '' });
        } else {
          searchInputRef.current?.blur();
        }
      } else if (e.altKey && (e.key === 'c' || e.key === 'C')) {
        e.preventDefault();
        onReset();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filters, onChange, onReset]);

  const hasAnyFilter =
    filters.globalSearch.trim() !== '' ||
    filters.identity !== '' ||
    filters.dormitory !== '' ||
    filters.vehicle !== '' ||
    filters.bedding !== '' ||
    filters.dateCategory !== '' ||
    filters.bedStatus !== '' ||
    filters.checkInStatus !== '';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-3 sm:p-3.5 mb-3">
      {/* Top Search & Primary Action Row */}
      <div className="flex flex-col md:flex-row gap-2 sm:gap-2.5 items-stretch md:items-center justify-between">
        {/* Global Instant Search Box with iOS zoom prevention */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            id="main-search-input"
            ref={searchInputRef}
            type="text"
            value={filters.globalSearch}
            onChange={(e) => onChange({ ...filters, globalSearch: e.target.value })}
            placeholder="搜尋姓名、學號 (如 11526201)、車輛、宿舍、班機 VJ852、幹部..."
            className="w-full pl-9 pr-24 py-2.5 bg-slate-50 hover:bg-slate-50/80 focus:bg-white border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl text-base sm:text-sm transition-all outline-hidden text-slate-900 placeholder:text-slate-400"
          />

          <div className="absolute inset-y-0 right-0 pr-2 flex items-center gap-1.5">
            {filters.globalSearch && (
              <button
                onClick={() => onChange({ ...filters, globalSearch: '' })}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-200 transition-colors"
                title="清除關鍵字 (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[11px] font-mono text-slate-400 bg-white border border-slate-200 rounded shadow-2xs">
              /
            </kbd>
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-blue-100 text-blue-700">
              {filteredCount} 筆
            </span>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="flex items-center gap-1.5 justify-between md:justify-end shrink-0">
          {/* Mobile Filter Sheet Button (visible on mobile) */}
          <button
            onClick={onOpenMobileFilter}
            className={`md:hidden flex-1 py-2 px-3 text-xs font-bold rounded-xl border flex items-center justify-center gap-1.5 transition-all ${
              hasAnyFilter
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                : 'bg-slate-50 text-slate-700 border-slate-200'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>進階篩選</span>
            {hasAnyFilter && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
          </button>

          {/* Desktop Filter Toggle Button */}
          <button
            onClick={onToggleAdvanced}
            className={`hidden md:flex px-3 py-2 text-xs font-medium rounded-lg border items-center gap-1.5 transition-all cursor-pointer ${
              showAdvanced || hasAnyFilter
                ? 'bg-blue-50 text-blue-700 border-blue-200'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>欄位篩選</span>
            {hasAnyFilter && (
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            )}
          </button>

          {/* Flight Schedule */}
          <button
            onClick={onOpenSchedule}
            className="px-2.5 sm:px-3 py-2 text-xs font-semibold rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
            title="查看所有航班時程與幹部名單"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">航班幹部</span>
          </button>

          {/* View Toggle */}
          <div className="bg-slate-100 p-0.5 rounded-xl border border-slate-200 flex items-center shrink-0">
            <button
              onClick={() => onToggleViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'table' ? 'bg-white text-blue-700 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="表格視圖"
            >
              <TableIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => onToggleViewMode('card')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'card' ? 'bg-white text-blue-700 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="卡片視圖 (手機最推薦)"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          {/* Export CSV */}
          <button
            onClick={onExportCsv}
            className="px-2.5 py-2 text-xs font-semibold rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center gap-1 transition-colors cursor-pointer shrink-0"
            title="匯出為 CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">匯出</span>
          </button>

          {/* Import / Reset */}
          <button
            onClick={onOpenImport}
            className="hidden sm:flex px-2.5 py-2 text-xs font-medium rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 items-center gap-1 transition-colors cursor-pointer shrink-0"
            title="名單管理"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>名單</span>
          </button>
        </div>
      </div>

      {/* Advanced Multi-Field Dropdown Bar (Desktop) */}
      {showAdvanced && (
        <div className="hidden md:grid mt-3 pt-3 border-t border-slate-150 grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 animate-in fade-in duration-150">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">身分別</label>
            <select
              value={filters.identity}
              onChange={(e) => onChange({ ...filters, identity: e.target.value })}
              className="w-full text-xs py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-md focus:ring-1 focus:ring-blue-500 focus:bg-white text-slate-800"
            >
              <option value="">全部身分</option>
              <option value="外籍生產專班">外籍生產專班 (63人)</option>
              <option value="國際專修部">國際專修部 (91人)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">宿舍分配</label>
            <select
              value={filters.dormitory}
              onChange={(e) => onChange({ ...filters, dormitory: e.target.value })}
              className="w-full text-xs py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-md focus:ring-1 focus:ring-blue-500 focus:bg-white text-slate-800"
            >
              <option value="">全部宿舍</option>
              <option value="第一宿舍">第一宿舍 (女宿 - 74人)</option>
              <option value="修平科大學生宿舍">修平科大 (男宿 - 80人)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">接駁車輛</label>
            <select
              value={filters.vehicle}
              onChange={(e) => onChange({ ...filters, vehicle: e.target.value })}
              className="w-full text-xs py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-md focus:ring-1 focus:ring-blue-500 focus:bg-white text-slate-800"
            >
              <option value="">全部車輛</option>
              <option value="B">B 車</option>
              <option value="C">C 車</option>
              <option value="D">D 車</option>
              <option value="E">E 車</option>
              <option value="F">F 車</option>
              <option value="G">G 車</option>
              <option value="H">H 車</option>
              <option value="I">I 車</option>
              <option value="J">J 車</option>
              <option value="none">未排定車輛</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">訂購寢具</label>
            <select
              value={filters.bedding}
              onChange={(e) => onChange({ ...filters, bedding: e.target.value })}
              className="w-full text-xs py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-md focus:ring-1 focus:ring-blue-500 focus:bg-white text-slate-800"
            >
              <option value="">全部金額</option>
              <option value="1900">$1,900 元</option>
              <option value="1950">$1,950 元</option>
              <option value="0">$0 (自備/免購)</option>
              <option value="hasBedding">有訂購 (1900或1950)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">抵達日期</label>
            <select
              value={filters.dateCategory}
              onChange={(e) => onChange({ ...filters, dateCategory: e.target.value })}
              className="w-full text-xs py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-md focus:ring-1 focus:ring-blue-500 focus:bg-white text-slate-800"
            >
              <option value="">全部日期</option>
              <option value="10/12">10/12 (台中/桃機)</option>
              <option value="10/13">10/13 (台中專班)</option>
              <option value="10/14">10/14 (大批抵達)</option>
              <option value="10/22">10/22 (修平男宿批次)</option>
              <option value="簽證辦理">簽證辦理/面試中</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">床位編號</label>
            <select
              value={filters.bedStatus}
              onChange={(e) => onChange({ ...filters, bedStatus: e.target.value })}
              className="w-full text-xs py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-md focus:ring-1 focus:ring-blue-500 focus:bg-white text-slate-800"
            >
              <option value="">全部狀態</option>
              <option value="assigned">已具體排定 (J0514~)</option>
              <option value="ref">待排定 (#REF!)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">報到簽到狀態</label>
            <select
              value={filters.checkInStatus}
              onChange={(e) => onChange({ ...filters, checkInStatus: e.target.value })}
              className="w-full text-xs py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-md focus:ring-1 focus:ring-blue-500 focus:bg-white text-slate-800"
            >
              <option value="">全部狀態</option>
              <option value="yes">✅ 已報到</option>
              <option value="no">⏳ 待報到</option>
            </select>
          </div>
        </div>
      )}

      {/* Summary and Batch Operations Bar */}
      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 flex-wrap gap-1.5">
        <div className="flex items-center gap-1.5">
          <span>
            顯示 <strong className="text-blue-600 font-bold">{filteredCount}</strong> / {totalCount} 人
          </span>
          {hasAnyFilter && (
            <button
              onClick={onReset}
              className="text-rose-600 hover:text-rose-800 font-semibold underline flex items-center gap-0.5 cursor-pointer ml-1 text-[11px]"
            >
              <RotateCcw className="w-3 h-3" />
              重置
            </button>
          )}
        </div>

        {/* Quick Batch Operations for staff */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onBatchCheckInVisible}
            className="text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
            title="將目前篩選出來的人員全部標記為已報到"
          >
            <CheckCircle2 className="w-3 h-3" />
            <span>此批批次簽到 ({filteredCount}人)</span>
          </button>
          <button
            onClick={onResetCheckIn}
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 px-1.5 py-1 rounded-lg text-[11px] transition-colors cursor-pointer"
            title="清空簽到紀錄"
          >
            重置簽到
          </button>
        </div>
      </div>
    </div>
  );
};
