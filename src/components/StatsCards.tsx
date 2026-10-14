import React, { useState } from 'react';
import { Users, UserCheck, Building2, BedDouble, Bus, ChevronDown, ChevronUp } from 'lucide-react';
import { Resident } from '../data/residentData';

interface StatsCardsProps {
  allResidents: Resident[];
  filteredCount: number;
  checkedInIds: Set<string>;
  onFilterPreset: (key: string, value: string) => void;
  activeFilterKey?: string;
  activeFilterValue?: string;
}

export const StatsCards: React.FC<StatsCardsProps> = ({
  allResidents,
  filteredCount,
  checkedInIds,
  onFilterPreset,
  activeFilterKey,
  activeFilterValue,
}) => {
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);

  const total = allResidents.length;
  const checkedInCount = allResidents.filter((r) => checkedInIds.has(r.studentId)).length;
  const pendingCount = total - checkedInCount;
  const checkInRate = total > 0 ? Math.round((checkedInCount / total) * 100) : 0;

  // Dorm distribution
  const dorm1Count = allResidents.filter((r) => r.dormitory.includes('第一宿舍')).length;
  const dormHsiupingCount = allResidents.filter((r) => r.dormitory.includes('修平')).length;

  // Bedding calculation
  const bedding1900Count = allResidents.filter((r) => r.bedding === 1900).length;
  const bedding1950Count = allResidents.filter((r) => r.bedding === 1950).length;
  const bedding0Count = allResidents.filter((r) => r.bedding === 0).length;
  const totalBeddingAmount = allResidents.reduce((sum, r) => sum + (r.bedding || 0), 0);

  // Vehicle stats
  const assignedVehicleCount = allResidents.filter((r) => r.vehicle && r.vehicle.trim() !== '').length;

  const isDorm1Active = activeFilterKey === 'dormitory' && activeFilterValue === '第一宿舍';
  const isDormHsiupingActive = activeFilterKey === 'dormitory' && activeFilterValue === '修平科大學生宿舍';
  const isCheckedInActive = activeFilterKey === 'checkIn' && activeFilterValue === 'yes';
  const isPendingCheckInActive = activeFilterKey === 'checkIn' && activeFilterValue === 'no';
  const isHasVehicleActive = activeFilterKey === 'hasVehicle' && activeFilterValue === 'yes';

  return (
    <div className="mb-3">
      {/* Mobile-Only Ultra-Compact Header Banner (< 768px) */}
      <div className="md:hidden bg-white rounded-2xl border border-slate-200/90 shadow-xs p-3 mb-2.5">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-800">進住報到進度</span>
            <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              {checkInRate}% ({checkedInCount}/{total}人)
            </span>
          </div>

          <button
            onClick={() => setIsMobileExpanded(!isMobileExpanded)}
            className="text-[11px] font-semibold text-blue-600 flex items-center gap-0.5"
          >
            <span>{isMobileExpanded ? '收合概覽' : '詳細數據'}</span>
            {isMobileExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mb-2">
          <div
            className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${checkInRate}%` }}
          />
        </div>

        {/* Quick Tappable Chips on Mobile */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5 text-[11px]">
          <button
            onClick={() => onFilterPreset('checkIn', isPendingCheckInActive ? '' : 'no')}
            className={`px-2 py-1 rounded-md shrink-0 font-medium border flex items-center gap-1 transition-all ${
              isPendingCheckInActive
                ? 'bg-amber-500 text-white border-amber-600 font-bold'
                : 'bg-slate-50 text-slate-700 border-slate-200'
            }`}
          >
            <span>待報到: {pendingCount}人</span>
          </button>
          <button
            onClick={() => onFilterPreset('dormitory', isDorm1Active ? '' : '第一宿舍')}
            className={`px-2 py-1 rounded-md shrink-0 font-medium border flex items-center gap-1 transition-all ${
              isDorm1Active
                ? 'bg-teal-600 text-white border-teal-700 font-bold'
                : 'bg-slate-50 text-slate-700 border-slate-200'
            }`}
          >
            <span>第一宿(女): {dorm1Count}</span>
          </button>
          <button
            onClick={() => onFilterPreset('dormitory', isDormHsiupingActive ? '' : '修平科大學生宿舍')}
            className={`px-2 py-1 rounded-md shrink-0 font-medium border flex items-center gap-1 transition-all ${
              isDormHsiupingActive
                ? 'bg-amber-600 text-white border-amber-700 font-bold'
                : 'bg-slate-50 text-slate-700 border-slate-200'
            }`}
          >
            <span>修平宿(男): {dormHsiupingCount}</span>
          </button>
          <button
            onClick={() => onFilterPreset('hasVehicle', isHasVehicleActive ? '' : 'yes')}
            className={`px-2 py-1 rounded-md shrink-0 font-medium border flex items-center gap-1 transition-all ${
              isHasVehicleActive
                ? 'bg-indigo-600 text-white border-indigo-700 font-bold'
                : 'bg-slate-50 text-slate-700 border-slate-200'
            }`}
          >
            <span>已排車: {assignedVehicleCount}</span>
          </button>
        </div>
      </div>

      {/* Full 5-card grid on Desktop (or expanded on Mobile) */}
      <div className={`${isMobileExpanded ? 'grid' : 'hidden md:grid'} grid-cols-2 md:grid-cols-5 gap-2.5 text-slate-800`}>
        {/* 總人數與篩選 */}
        <div
          onClick={() => onFilterPreset('all', '')}
          className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs hover:border-blue-400 hover:shadow-sm cursor-pointer transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">進住總人數</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight">{total}</span>
            <span className="text-xs text-slate-500">人</span>
            {filteredCount !== total && (
              <span className="text-xs px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-700 font-medium ml-auto">
                篩選 {filteredCount}
              </span>
            )}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex justify-between">
            <span>外籍專班 63</span>
            <span>專修部 91</span>
          </div>
        </div>

        {/* 簽到進度 */}
        <div
          onClick={() => onFilterPreset('checkIn', isPendingCheckInActive ? '' : 'no')}
          className={`bg-white p-3 rounded-xl border shadow-xs hover:shadow-sm cursor-pointer transition-all flex flex-col justify-between ${
            isPendingCheckInActive || isCheckedInActive ? 'border-emerald-500 ring-2 ring-emerald-100' : 'border-slate-200/80'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">簽到報到率</span>
            <UserCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-emerald-700 tracking-tight">{checkInRate}%</span>
            <span className="text-xs text-slate-500">
              ({checkedInCount}/{total})
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1.5 overflow-hidden">
            <div
              className="bg-emerald-500 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${checkInRate}%` }}
            />
          </div>
        </div>

        {/* 宿舍分佈 */}
        <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">宿舍分佈</span>
            <Building2 className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="flex gap-2 text-xs mt-0.5">
            <button
              onClick={() => onFilterPreset('dormitory', isDorm1Active ? '' : '第一宿舍')}
              className={`flex-1 text-left p-1.5 rounded-lg border transition-all ${
                isDorm1Active ? 'bg-indigo-50 border-indigo-300 text-indigo-900 font-bold' : 'hover:bg-slate-50 border-slate-150'
              }`}
            >
              <div className="text-[10px] text-slate-400">第一宿 (女)</div>
              <div className="font-bold text-sm text-indigo-700">{dorm1Count}人</div>
            </button>
            <button
              onClick={() => onFilterPreset('dormitory', isDormHsiupingActive ? '' : '修平科大學生宿舍')}
              className={`flex-1 text-left p-1.5 rounded-lg border transition-all ${
                isDormHsiupingActive ? 'bg-indigo-50 border-indigo-300 text-indigo-900 font-bold' : 'hover:bg-slate-50 border-slate-150'
              }`}
            >
              <div className="text-[10px] text-slate-400">修平宿 (男)</div>
              <div className="font-bold text-sm text-indigo-700">{dormHsiupingCount}人</div>
            </button>
          </div>
        </div>

        {/* 寢具訂購總覽 */}
        <div
          onClick={() => onFilterPreset('bedding', activeFilterValue === '1900' ? '' : '1900')}
          className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs hover:border-amber-400 hover:shadow-sm cursor-pointer transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">寢具訂購統計</span>
            <BedDouble className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-extrabold text-amber-800 tracking-tight">
              ${(totalBeddingAmount / 1000).toFixed(1)}k
            </span>
            <span className="text-[11px] text-slate-500">
              ({bedding1900Count + bedding1950Count}人訂)
            </span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1 flex justify-between font-mono">
            <span>$1900: {bedding1900Count}</span>
            <span>$1950: {bedding1950Count}</span>
            <span className="text-slate-400">自備: {bedding0Count}</span>
          </div>
        </div>

        {/* 接送車輛派車 */}
        <div
          onClick={() => onFilterPreset('hasVehicle', isHasVehicleActive ? '' : 'yes')}
          className={`col-span-2 md:col-span-1 bg-white p-3 rounded-xl border shadow-xs hover:border-cyan-400 hover:shadow-sm cursor-pointer transition-all flex flex-col justify-between ${
            isHasVehicleActive ? 'border-cyan-500 ring-2 ring-cyan-100' : 'border-slate-200/80'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">接駁車輛指派</span>
            <Bus className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-cyan-800 tracking-tight">{assignedVehicleCount}</span>
            <span className="text-xs text-slate-500">人已排車</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1 truncate">
            包含 B, C, D, E, F, G, H, I, J 等各車
          </div>
        </div>
      </div>
    </div>
  );
};
