import React, { useState } from 'react';
import {
  Check,
  Copy,
  Building,
  Plane,
  BedDouble,
  Bus,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  PhoneCall,
  UserCheck,
  Sparkles,
} from 'lucide-react';
import { Resident } from '../data/residentData';

interface ResidentCardGridProps {
  residents: Resident[];
  checkedInIds: Set<string>;
  onToggleCheckIn: (studentId: string) => void;
  onSelectResident: (resident: Resident) => void;
  searchHighlight: string;
}

export const ResidentCardGrid: React.FC<ResidentCardGridProps> = ({
  residents,
  checkedInIds,
  onToggleCheckIn,
  onSelectResident,
  searchHighlight,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  const handleCopy = (e: React.MouseEvent, text: string, id: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleCopyCompactLine = (e: React.MouseEvent, r: Resident) => {
    e.stopPropagation();
    const line = `${r.name} ${r.studentId} | ${r.dormitory} | ${r.vehicle || '無車輛'} | 寢具:${r.bedding > 0 ? '$' + r.bedding : '自備'}`;
    navigator.clipboard.writeText(line);
    setCopiedId(`line-${r.id}`);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const highlightText = (text: string, query: string) => {
    if (!query.trim() || !text) return text;
    const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <mark key={i} className="bg-yellow-200 text-slate-900 rounded-xs px-0.5 font-bold">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  if (residents.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 shadow-xs">
        <p className="font-semibold text-slate-700 mb-1">查無符合條件的人員</p>
        <p className="text-xs text-slate-400">請嘗試更換搜尋關鍵字或清除篩選標籤</p>
      </div>
    );
  }

  return (
    <div className="space-y-2.5 pb-20 md:pb-6">
      {residents.map((r) => {
        const isCheckedIn = checkedInIds.has(r.studentId);
        const isRefBed = r.bed.includes('#REF!') || !r.bed.trim();
        const isExpanded = expandedCardId === r.id;

        return (
          <div
            key={r.id}
            onClick={() => onSelectResident(r)}
            className={`relative bg-white rounded-2xl border transition-all duration-150 p-3.5 shadow-xs active:scale-[0.995] cursor-pointer ${
              isCheckedIn
                ? 'border-emerald-300 ring-2 ring-emerald-100 bg-emerald-50/20'
                : 'border-slate-200/90 hover:border-blue-300'
            }`}
          >
            {/* Top Row: Name, ID, Sequence, and big check-in button */}
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                    {highlightText(r.name, searchHighlight)}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                    #{r.seq}
                  </span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-semibold border ${
                      r.identity === '外籍生產專班'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-purple-50 text-purple-700 border-purple-200'
                    }`}
                  >
                    {r.identity}
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-1">
                  <span className="font-mono text-xs font-bold text-slate-600 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">
                    {highlightText(r.studentId, searchHighlight)}
                  </span>
                  <button
                    onClick={(e) => handleCopy(e, r.studentId, `id-${r.id}`)}
                    className="text-[11px] text-blue-600 hover:text-blue-800 flex items-center gap-0.5 font-medium px-1.5 py-0.5 rounded bg-blue-50"
                  >
                    {copiedId === `id-${r.id}` ? (
                      <Check className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    <span>{copiedId === `id-${r.id}` ? '已複製' : '學號'}</span>
                  </button>
                  <button
                    onClick={(e) => handleCopyCompactLine(e, r)}
                    className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-0.5 font-medium px-1.5 py-0.5 rounded bg-slate-100"
                    title="複製整行通報格式"
                  >
                    {copiedId === `line-${r.id}` ? (
                      <Check className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    <span>{copiedId === `line-${r.id}` ? '已複製通報' : '複製通報'}</span>
                  </button>
                </div>
              </div>

              {/* Big Touch-Friendly Mobile Check-in Toggle Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleCheckIn(r.studentId);
                }}
                className={`h-11 px-3 rounded-xl font-bold text-xs flex items-center gap-1.5 shrink-0 transition-all cursor-pointer shadow-xs active:scale-90 ${
                  isCheckedIn
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white ring-2 ring-emerald-300'
                    : 'bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 border border-slate-300'
                }`}
                title={isCheckedIn ? '已報到 (點擊取消)' : '點擊簽到報到'}
              >
                <Check className={`w-4 h-4 stroke-[3] ${isCheckedIn ? 'text-white' : 'text-slate-400'}`} />
                <span>{isCheckedIn ? '已報到' : '簽到'}</span>
              </button>
            </div>

            {/* Key Field Chips (Dorm, Bed, Vehicle, Bedding) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mt-3 text-xs">
              {/* 宿舍 */}
              <div
                className={`p-1.5 rounded-lg border flex items-center gap-1.5 ${
                  r.dormitory.includes('第一宿舍')
                    ? 'bg-teal-50/70 border-teal-200 text-teal-900'
                    : 'bg-amber-50/70 border-amber-200 text-amber-900'
                }`}
              >
                <Building className="w-3.5 h-3.5 opacity-70 shrink-0" />
                <span className="font-semibold truncate">{r.dormitory}</span>
              </div>

              {/* 床位 */}
              <div className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                <span className="text-slate-400 text-[11px]">床位</span>
                <span
                  className={`font-mono font-bold text-xs ${
                    isRefBed ? 'text-slate-400' : 'text-emerald-700'
                  }`}
                >
                  {isRefBed ? '待排定' : r.bed}
                </span>
              </div>

              {/* 車輛 */}
              <div className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                <span className="text-slate-400 text-[11px] flex items-center gap-1">
                  <Bus className="w-3 h-3" /> 車輛
                </span>
                <span className="font-bold text-indigo-700">
                  {r.vehicleNormalized || '未安排'}
                </span>
              </div>

              {/* 寢具 */}
              <div className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                <span className="text-slate-400 text-[11px] flex items-center gap-1">
                  <BedDouble className="w-3 h-3" /> 寢具
                </span>
                <span className="font-mono font-bold text-slate-800">
                  {r.bedding > 0 ? `$${r.bedding.toLocaleString()}` : '$0 自備'}
                </span>
              </div>
            </div>

            {/* Flight / Arrival Remarks Accordion */}
            {r.flightArrival && (
              <div className="mt-2.5 pt-2 border-t border-slate-100">
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedCardId(isExpanded ? null : r.id);
                  }}
                  className="flex items-center justify-between text-xs text-slate-600 hover:text-slate-900 font-medium cursor-pointer py-0.5"
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <Plane className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                    <span className="truncate text-slate-800">
                      {highlightText(r.flightArrival.split('\n')[0], searchHighlight)}
                    </span>
                  </div>
                  <div className="text-slate-400 text-[11px] flex items-center gap-0.5 shrink-0 ml-1">
                    <span>{isExpanded ? '收合' : '詳細時程'}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-1.5 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 whitespace-pre-line leading-relaxed animate-in fade-in duration-150">
                    {highlightText(r.flightArrival, searchHighlight)}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
