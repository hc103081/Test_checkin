import React from 'react';
import { Filter, X, Sparkles } from 'lucide-react';

interface QuickPillsProps {
  currentFilter: {
    preset: string;
    value: string;
  };
  onSelect: (preset: string, value: string) => void;
  onClear: () => void;
  hasActiveFilters: boolean;
}

export const QuickPills: React.FC<QuickPillsProps> = ({
  currentFilter,
  onSelect,
  onClear,
  hasActiveFilters,
}) => {
  const pills = [
    { label: '全部人員', preset: 'all', value: '', badge: '' },
    { label: '⏳ 待報到', preset: 'checkIn', value: 'no', badge: '' },
    { label: '✅ 已報到', preset: 'checkIn', value: 'yes', badge: '' },
    { label: '🚪 已編配房號', preset: 'bedStatus', value: 'assigned', badge: '86' },
    { label: '⚠️ 待編配房號', preset: 'bedStatus', value: 'ref', badge: '68' },
    { label: '🚪 J0514 房', preset: 'room', value: 'J0514', badge: '' },
    { label: '🚪 J0515 房', preset: 'room', value: 'J0515', badge: '' },
    { label: '🚪 J0516 房', preset: 'room', value: 'J0516', badge: '' },
    { label: '🚪 J0517 房', preset: 'room', value: 'J0517', badge: '' },
    { label: '🏢 第一宿舍', preset: 'dormitory', value: '第一宿舍', badge: '74' },
    { label: '🏫 修平科大', preset: 'dormitory', value: '修平科大學生宿舍', badge: '80' },
    { label: '🎓 外籍專班', preset: 'identity', value: '外籍生產專班', badge: '63' },
    { label: '🌐 國際專修部', preset: 'identity', value: '國際專修部', badge: '91' },
    { label: '✈️ 10/12 抵達', preset: 'date', value: '10/12', badge: '' },
    { label: '✈️ 10/13 抵達', preset: 'date', value: '10/13', badge: '' },
    { label: '✈️ 10/14 抵達', preset: 'date', value: '10/14', badge: '' },
    { label: '✈️ 10/22 抵達', preset: 'date', value: '10/22', badge: '' },
    { label: '🛏️ $1,900 寢具', preset: 'bedding', value: '1900', badge: '' },
    { label: '🛏️ $1,950 寢具', preset: 'bedding', value: '1950', badge: '' },
    { label: '🚫 寢具自備 ($0)', preset: 'bedding', value: '0', badge: '' },
    { label: '🚌 已排車輛', preset: 'hasVehicle', value: 'yes', badge: '' },
    { label: '❓ 未排車輛', preset: 'hasVehicle', value: 'no', badge: '' },
  ];

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 no-scrollbar select-none">
      <div className="flex items-center text-xs font-semibold text-slate-400 pl-1 pr-2 shrink-0">
        <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-500" />
        極速篩選:
      </div>

      {pills.map((p) => {
        const isActive = currentFilter.preset === p.preset && currentFilter.value === p.value;
        return (
          <button
            key={`${p.preset}-${p.value}`}
            onClick={() => onSelect(p.preset, p.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-150 shrink-0 cursor-pointer flex items-center gap-1.5 ${
              isActive
                ? 'bg-blue-600 text-white shadow-xs scale-102 ring-2 ring-blue-300'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
            }`}
          >
            <span>{p.label}</span>
            {p.badge && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-blue-800 text-blue-100' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {p.badge}
              </span>
            )}
          </button>
        );
      })}

      {hasActiveFilters && (
        <button
          onClick={onClear}
          className="px-2.5 py-1.5 rounded-full text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 shrink-0 cursor-pointer flex items-center gap-1 transition-colors"
          title="清除所有搜尋與篩選 (Alt+C)"
        >
          <X className="w-3.5 h-3.5" />
          清除條件
        </button>
      )}
    </div>
  );
};
