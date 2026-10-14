import React from 'react';
import { Search, SlidersHorizontal, CheckSquare, Calendar, BarChart3, Users } from 'lucide-react';

interface MobileBottomNavProps {
  onOpenSearch: () => void;
  onOpenFilter: () => void;
  onTogglePendingOnly: () => void;
  isPendingOnly: boolean;
  onOpenSchedule: () => void;
  onOpenStats: () => void;
  activeFilterCount: number;
  pendingCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  onOpenSearch,
  onOpenFilter,
  onTogglePendingOnly,
  isPendingOnly,
  onOpenSchedule,
  onOpenStats,
  activeFilterCount,
  pendingCount,
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-2 py-1.5 shadow-lg safe-bottom flex items-center justify-around">
      {/* 搜尋 */}
      <button
        onClick={onOpenSearch}
        className="flex flex-col items-center justify-center p-1.5 text-slate-600 hover:text-blue-600 active:scale-95 transition-all w-16"
      >
        <Search className="w-5 h-5 text-slate-700" />
        <span className="text-[10px] font-semibold mt-0.5">搜尋</span>
      </button>

      {/* 篩選 (帶數量標記) */}
      <button
        onClick={onOpenFilter}
        className="relative flex flex-col items-center justify-center p-1.5 text-slate-600 hover:text-blue-600 active:scale-95 transition-all w-16"
      >
        <div className="relative">
          <SlidersHorizontal className="w-5 h-5 text-slate-700" />
          {activeFilterCount > 0 && (
            <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </div>
        <span className="text-[10px] font-semibold mt-0.5">多維篩選</span>
      </button>

      {/* 待報到快捷鍵 (迎新現場最重要) */}
      <button
        onClick={onTogglePendingOnly}
        className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all w-20 active:scale-95 ${
          isPendingOnly
            ? 'bg-amber-500 text-white shadow-xs'
            : 'text-slate-700 hover:bg-slate-100'
        }`}
      >
        <CheckSquare className="w-5 h-5" />
        <span className="text-[10px] font-bold mt-0.5">
          {isPendingOnly ? '查看全部' : `待報到 (${pendingCount})`}
        </span>
      </button>

      {/* 航班時程 */}
      <button
        onClick={onOpenSchedule}
        className="flex flex-col items-center justify-center p-1.5 text-slate-600 hover:text-blue-600 active:scale-95 transition-all w-16"
      >
        <Calendar className="w-5 h-5 text-slate-700" />
        <span className="text-[10px] font-semibold mt-0.5">航班幹部</span>
      </button>

      {/* 統計總覽 */}
      <button
        onClick={onOpenStats}
        className="flex flex-col items-center justify-center p-1.5 text-slate-600 hover:text-blue-600 active:scale-95 transition-all w-16"
      >
        <BarChart3 className="w-5 h-5 text-slate-700" />
        <span className="text-[10px] font-semibold mt-0.5">數據統計</span>
      </button>
    </div>
  );
};
