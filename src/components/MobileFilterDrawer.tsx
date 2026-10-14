import React from 'react';
import {
  X,
  RotateCcw,
  Check,
  Building,
  GraduationCap,
  Bus,
  BedDouble,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { FilterState } from './FilterToolbar';

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onReset: () => void;
  filteredCount: number;
  totalCount: number;
}

export const MobileFilterDrawer: React.FC<MobileFilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onChange,
  onReset,
  filteredCount,
  totalCount,
}) => {
  if (!isOpen) return null;

  const identities = [
    { label: '全部', value: '' },
    { label: '外籍生產專班 (63)', value: '外籍生產專班' },
    { label: '國際專修部 (91)', value: '國際專修部' },
  ];

  const dormitories = [
    { label: '全部宿舍', value: '' },
    { label: '第一宿舍 (女 - 74人)', value: '第一宿舍' },
    { label: '修平科大 (男 - 80人)', value: '修平科大學生宿舍' },
  ];

  const checkInStatuses = [
    { label: '全部狀態', value: '' },
    { label: '⏳ 待報到', value: 'no' },
    { label: '✅ 已報到', value: 'yes' },
  ];

  const vehicles = [
    { label: '全部', value: '' },
    { label: 'B車', value: 'B' },
    { label: 'C車', value: 'C' },
    { label: 'D車', value: 'D' },
    { label: 'E車', value: 'E' },
    { label: 'F車', value: 'F' },
    { label: 'G車', value: 'G' },
    { label: 'H車', value: 'H' },
    { label: 'I車', value: 'I' },
    { label: 'J車', value: 'J' },
    { label: '無安排車輛', value: 'none' },
  ];

  const beddings = [
    { label: '全部', value: '' },
    { label: '$1,900', value: '1900' },
    { label: '$1,950', value: '1950' },
    { label: '$0 自備', value: '0' },
    { label: '有訂購', value: 'hasBedding' },
  ];

  const dates = [
    { label: '全部日期', value: '' },
    { label: '10/12 (台中/桃機)', value: '10/12' },
    { label: '10/13 (台中專班)', value: '10/13' },
    { label: '10/14 (大批抵達)', value: '10/14' },
    { label: '10/22 (修平男宿)', value: '10/22' },
    { label: '簽證辦理中', value: '簽證辦理' },
  ];

  const bedStatuses = [
    { label: '全部房號狀態', value: '' },
    { label: '已編配房號', value: 'assigned' },
    { label: '待編配 (#REF!)', value: 'ref' },
    { label: 'J0514 房', value: 'J0514' },
    { label: 'J0515 房', value: 'J0515' },
    { label: 'J0516 房', value: 'J0516' },
    { label: 'J0517 房', value: 'J0517' },
  ];

  const renderChipGroup = (
    title: string,
    currentValue: string,
    options: { label: string; value: string }[],
    onSelect: (val: string) => void
  ) => (
    <div className="space-y-1.5">
      <div className="text-xs font-bold text-slate-700">{title}</div>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => {
          const isSelected = currentValue === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => onSelect(opt.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                isSelected
                  ? 'bg-blue-600 text-white font-bold shadow-2xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 active:scale-95'
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white rounded-t-3xl max-h-[85vh] flex flex-col shadow-2xl border-t border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle & Header */}
        <div className="px-5 pt-3 pb-3 border-b border-slate-150 flex items-center justify-between bg-slate-50/80">
          <div>
            <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto mb-2" />
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-1.5">
              <span>手機快速篩選</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                符合 {filteredCount} / {totalCount} 人
              </span>
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onReset}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 px-2.5 py-1 rounded-md bg-rose-50 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>重置</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Filter Chips Content */}
        <div className="p-4 overflow-y-auto space-y-4">
          {/* 報到狀態 */}
          {renderChipGroup('📋 簽到報到狀態', filters.checkInStatus, checkInStatuses, (val) =>
            onChange({ ...filters, checkInStatus: val })
          )}

          {/* 宿舍分配 */}
          {renderChipGroup('🏢 宿舍分配', filters.dormitory, dormitories, (val) =>
            onChange({ ...filters, dormitory: val })
          )}

          {/* 身分別 */}
          {renderChipGroup('🎓 身分別', filters.identity, identities, (val) =>
            onChange({ ...filters, identity: val })
          )}

          {/* 抵達日期 */}
          {renderChipGroup('✈️ 班機抵達日期', filters.dateCategory, dates, (val) =>
            onChange({ ...filters, dateCategory: val })
          )}

          {/* 車輛 */}
          {renderChipGroup('🚌 接駁車輛 (B~J車)', filters.vehicle, vehicles, (val) =>
            onChange({ ...filters, vehicle: val })
          )}

          {/* 寢具費用 */}
          {renderChipGroup('🛏️ 寢具訂購金額', filters.bedding, beddings, (val) =>
            onChange({ ...filters, bedding: val })
          )}

          {/* 床位 */}
          {renderChipGroup('🪑 床位安排狀態', filters.bedStatus, bedStatuses, (val) =>
            onChange({ ...filters, bedStatus: val })
          )}
        </div>

        {/* Sticky Apply Button */}
        <div className="p-4 border-t border-slate-150 bg-white">
          <button
            onClick={onClose}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-extrabold rounded-xl shadow-md text-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>套用篩選（顯示 {filteredCount} 位進住人員）</span>
          </button>
        </div>
      </div>
    </div>
  );
};
