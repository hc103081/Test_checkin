import React, { useState } from 'react';
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Check,
  Copy,
  ExternalLink,
  Plane,
  AlertCircle,
  Building,
  DoorOpen,
  Edit3,
} from 'lucide-react';
import { Resident } from '../data/residentData';

export type SortField = 'seq' | 'name' | 'studentId' | 'identity' | 'dormitory' | 'bed' | 'vehicle' | 'bedding' | 'dateCategory';
export type SortOrder = 'asc' | 'desc';

interface ResidentTableProps {
  residents: Resident[];
  checkedInIds: Set<string>;
  onToggleCheckIn: (studentId: string) => void;
  onSelectResident: (resident: Resident) => void;
  onEditRoom?: (resident: Resident) => void;
  sortField: SortField;
  sortOrder: SortOrder;
  onSort: (field: SortField) => void;
  searchHighlight: string;
}

export const ResidentTable: React.FC<ResidentTableProps> = ({
  residents,
  checkedInIds,
  onToggleCheckIn,
  onSelectResident,
  onEditRoom,
  sortField,
  sortOrder,
  onSort,
  searchHighlight,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (e: React.MouseEvent, text: string, id: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
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

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3 h-3 text-slate-300 ml-1 inline opacity-60 group-hover:opacity-100" />;
    }
    return sortOrder === 'asc' ? (
      <ArrowUp className="w-3 h-3 text-blue-600 ml-1 inline font-bold" />
    ) : (
      <ArrowDown className="w-3 h-3 text-blue-600 ml-1 inline font-bold" />
    );
  };

  if (residents.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-slate-800 mb-1">查無相符人員</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          請嘗試縮短關鍵字、清除部分篩選標籤，或檢查學號/姓名/房號是否正確。
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600 border-collapse">
          <thead>
            <tr className="bg-slate-50/90 text-slate-700 font-semibold border-b border-slate-200 select-none">
              <th className="py-2.5 px-3 w-16 text-center">簽到</th>
              <th
                onClick={() => onSort('seq')}
                className="py-2.5 px-3 w-14 cursor-pointer hover:bg-slate-100/80 transition-colors group"
              >
                序號{renderSortIcon('seq')}
              </th>
              <th
                onClick={() => onSort('name')}
                className="py-2.5 px-3 cursor-pointer hover:bg-slate-100/80 transition-colors group min-w-[110px]"
              >
                姓名{renderSortIcon('name')}
              </th>
              <th
                onClick={() => onSort('studentId')}
                className="py-2.5 px-3 cursor-pointer hover:bg-slate-100/80 transition-colors group min-w-[105px]"
              >
                學號{renderSortIcon('studentId')}
              </th>
              <th
                onClick={() => onSort('identity')}
                className="py-2.5 px-3 cursor-pointer hover:bg-slate-100/80 transition-colors group min-w-[95px]"
              >
                身分別{renderSortIcon('identity')}
              </th>
              <th
                onClick={() => onSort('dormitory')}
                className="py-2.5 px-3 cursor-pointer hover:bg-slate-100/80 transition-colors group min-w-[120px]"
              >
                宿舍{renderSortIcon('dormitory')}
              </th>
              <th
                onClick={() => onSort('bed')}
                className="py-2.5 px-3 cursor-pointer hover:bg-slate-100/80 transition-colors group min-w-[130px]"
              >
                房號 / 床位{renderSortIcon('bed')}
              </th>
              <th
                onClick={() => onSort('vehicle')}
                className="py-2.5 px-3 cursor-pointer hover:bg-slate-100/80 transition-colors group min-w-[70px]"
              >
                車輛{renderSortIcon('vehicle')}
              </th>
              <th
                onClick={() => onSort('bedding')}
                className="py-2.5 px-3 cursor-pointer hover:bg-slate-100/80 transition-colors group min-w-[90px]"
              >
                寢具{renderSortIcon('bedding')}
              </th>
              <th className="py-2.5 px-3 min-w-[240px]">航班入境 / 幹部接送備註</th>
              <th className="py-2.5 px-3 w-16 text-center">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {residents.map((r, idx) => {
              const isCheckedIn = checkedInIds.has(r.studentId);
              const isRefBed = r.bed.includes('#REF!') || r.bed.includes('#N/A') || !r.bed.trim();

              return (
                <tr
                  key={r.id}
                  onClick={() => onSelectResident(r)}
                  className={`cursor-pointer transition-colors ${
                    isCheckedIn
                      ? 'bg-emerald-50/40 hover:bg-emerald-50/80'
                      : idx % 2 === 0
                      ? 'bg-white hover:bg-blue-50/40'
                      : 'bg-slate-50/30 hover:bg-blue-50/40'
                  }`}
                >
                  {/* Check-in Toggle */}
                  <td className="py-2 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onToggleCheckIn(r.studentId)}
                      className={`w-7 h-7 rounded-lg inline-flex items-center justify-center transition-all cursor-pointer ${
                        isCheckedIn
                          ? 'bg-emerald-600 text-white shadow-xs hover:bg-emerald-700 scale-105'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-600 border border-slate-200'
                      }`}
                      title={isCheckedIn ? '已報到 (點擊取消)' : '未報到 (點擊簽到)'}
                    >
                      <Check className="w-4 h-4 stroke-[2.5]" />
                    </button>
                  </td>

                  {/* 序號 */}
                  <td className="py-2 px-3 font-mono text-slate-400">{r.seq}</td>

                  {/* 姓名 */}
                  <td className="py-2 px-3 font-medium text-slate-900">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-semibold">{highlightText(r.name, searchHighlight)}</span>
                      <button
                        onClick={(e) => handleCopy(e, r.name, `name-${r.id}`)}
                        className="text-slate-300 hover:text-slate-600 p-0.5 rounded transition-colors opacity-40 hover:opacity-100"
                        title="複製姓名"
                      >
                        {copiedId === `name-${r.id}` ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </td>

                  {/* 學號 */}
                  <td className="py-2 px-3 font-mono">
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-700 font-semibold">
                        {highlightText(r.studentId, searchHighlight)}
                      </span>
                      <button
                        onClick={(e) => handleCopy(e, r.studentId, `id-${r.id}`)}
                        className="text-slate-300 hover:text-slate-600 p-0.5 rounded transition-colors opacity-40 hover:opacity-100"
                        title="複製學號"
                      >
                        {copiedId === `id-${r.id}` ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </td>

                  {/* 身分別 */}
                  <td className="py-2 px-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium border ${
                        r.identity === '外籍生產專班'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-purple-50 text-purple-700 border-purple-200'
                      }`}
                    >
                      {highlightText(r.identity, searchHighlight)}
                    </span>
                  </td>

                  {/* 宿舍 */}
                  <td className="py-2 px-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border ${
                        r.dormitory.includes('第一宿舍')
                          ? 'bg-teal-50 text-teal-800 border-teal-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}
                    >
                      <Building className="w-3 h-3 opacity-70" />
                      {highlightText(r.dormitory, searchHighlight)}
                    </span>
                  </td>

                  {/* 房號 / 床位 */}
                  <td className="py-2 px-3">
                    <div className="flex items-center gap-1.5">
                      {isRefBed ? (
                        <span className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded font-medium">
                          待編排房號
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-mono">
                          <DoorOpen className="w-3 h-3 text-emerald-600" />
                          {highlightText(r.bed, searchHighlight)}
                        </span>
                      )}

                      {/* Edit room button */}
                      {onEditRoom && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditRoom(r);
                          }}
                          className="p-1 rounded text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors opacity-50 hover:opacity-100"
                          title="編輯/指派房號床位"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </td>

                  {/* 車輛 */}
                  <td className="py-2 px-3">
                    {r.vehicleNormalized ? (
                      <span className="inline-block px-2 py-0.5 rounded bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold text-xs">
                        {r.vehicleNormalized}
                      </span>
                    ) : (
                      <span className="text-slate-300 text-[11px]">—</span>
                    )}
                  </td>

                  {/* 寢具 */}
                  <td className="py-2 px-3">
                    {r.bedding > 0 ? (
                      <span
                        className={`inline-block px-2 py-0.5 rounded font-mono font-bold text-xs ${
                          r.bedding === 1950
                            ? 'bg-orange-50 text-orange-700 border border-orange-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}
                      >
                        ${r.bedding.toLocaleString()}
                      </span>
                    ) : (
                      <span className="text-slate-400 text-xs font-mono">$0 自備</span>
                    )}
                  </td>

                  {/* 航班入境時間 & 幹部備註 */}
                  <td className="py-2 px-3">
                    {r.flightArrival ? (
                      <div className="max-w-[340px] text-[11px] text-slate-600 leading-tight">
                        <div className="flex items-center gap-1 font-medium text-slate-800">
                          <Plane className="w-3 h-3 text-sky-600 shrink-0" />
                          <span className="truncate">
                            {highlightText(r.flightArrival.split('\n')[0], searchHighlight)}
                          </span>
                        </div>
                        {r.flightArrival.includes('\n') && (
                          <div className="text-[10px] text-slate-500 mt-0.5 line-clamp-2">
                            {highlightText(r.flightArrival.split('\n').slice(1).join(' '), searchHighlight)}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-slate-300 text-[11px]">隨隊/未另註明</span>
                    )}
                  </td>

                  {/* 操作 */}
                  <td className="py-2 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onSelectResident(r)}
                      className="p-1 rounded text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      title="查看詳細資訊卡"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
