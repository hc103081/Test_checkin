import React, { useEffect } from 'react';
import {
  X,
  Check,
  Copy,
  ChevronLeft,
  ChevronRight,
  Building,
  User,
  GraduationCap,
  BedDouble,
  Bus,
  Plane,
  Clock,
  Sparkles,
  DoorOpen,
  Edit3,
} from 'lucide-react';
import { Resident } from '../data/residentData';

interface ResidentDetailModalProps {
  resident: Resident | null;
  onClose: () => void;
  isCheckedIn: boolean;
  onToggleCheckIn: (studentId: string) => void;
  onPrev: () => void;
  onNext: () => void;
  onEditRoom?: (resident: Resident) => void;
  hasPrev: boolean;
  hasNext: boolean;
  currentIndex: number;
  totalFiltered: number;
}

export const ResidentDetailModal: React.FC<ResidentDetailModalProps> = ({
  resident,
  onClose,
  isCheckedIn,
  onToggleCheckIn,
  onPrev,
  onNext,
  onEditRoom,
  hasPrev,
  hasNext,
  currentIndex,
  totalFiltered,
}) => {
  const [copiedType, setCopiedType] = React.useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft' && hasPrev) {
        onPrev();
      } else if (e.key === 'ArrowRight' && hasNext) {
        onNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onPrev, onNext, hasPrev, hasNext]);

  if (!resident) return null;

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 1500);
  };

  const fullSummaryText = `【迎新進住確認】
姓名：${resident.name}
學號：${resident.studentId}
序號：${resident.seq}
身分：${resident.identity}
宿舍：${resident.dormitory}
床位：${resident.bed}
接送車輛：${resident.vehicle || '無'}
寢具費用：${resident.bedding > 0 ? `$${resident.bedding.toLocaleString()}` : '$0 (自備)'}
航班入境：${resident.flightArrival || '未另註明'}
簽到狀態：${isCheckedIn ? '已報到' : '未報到'}`;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-end md:justify-center md:items-center p-0 md:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white w-full md:max-w-lg rounded-t-3xl md:rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[88vh] md:max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile drag bar & Modal Header */}
        <div className="px-5 pt-3 pb-3 border-b border-slate-150 bg-slate-50/80">
          <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto mb-2 md:hidden" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold text-slate-500 bg-slate-200 px-2 py-0.5 rounded">
                #{resident.seq}
              </span>
              <span className="text-xs text-slate-500">
                第 {currentIndex + 1} / {totalFiltered} 筆
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={onPrev}
                disabled={!hasPrev}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none text-slate-600 transition-colors"
                title="上一位"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={onNext}
                disabled={!hasNext}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none text-slate-600 transition-colors"
                title="下一位"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 ml-1 transition-colors"
                title="關閉"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 md:p-5 overflow-y-auto space-y-3.5">
          {/* Main Identity Banner */}
          <div className="flex items-start justify-between gap-3 bg-blue-50/60 p-3.5 rounded-2xl border border-blue-100">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <span>{resident.name}</span>
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-md font-semibold border ${
                    resident.identity === '外籍生產專班'
                      ? 'bg-blue-100 text-blue-800 border-blue-200'
                      : 'bg-purple-100 text-purple-800 border-purple-200'
                  }`}
                >
                  {resident.identity}
                </span>
              </h2>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className="font-mono text-sm font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-blue-200">
                  學號: {resident.studentId}
                </span>
                <button
                  onClick={() => handleCopy(resident.studentId, 'id')}
                  className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 font-semibold bg-blue-100/70 px-2 py-0.5 rounded"
                >
                  {copiedType === 'id' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedType === 'id' ? '已複製' : '複製學號'}</span>
                </button>
              </div>
            </div>

            {/* Check-in state button */}
            <button
              onClick={() => onToggleCheckIn(resident.studentId)}
              className={`px-3 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs active:scale-95 ${
                isCheckedIn
                  ? 'bg-emerald-600 text-white ring-2 ring-emerald-300'
                  : 'bg-white border-2 border-slate-300 text-slate-700 hover:border-emerald-500 hover:text-emerald-600'
              }`}
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{isCheckedIn ? '已報到' : '點擊簽到'}</span>
            </button>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-2.5 text-sm">
            {/* 宿舍 */}
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-0.5">
                <Building className="w-3.5 h-3.5 text-indigo-500" />
                <span>分配宿舍</span>
              </div>
              <div className="font-bold text-slate-800 text-xs sm:text-sm">{resident.dormitory}</div>
            </div>

            {/* 房號與床位 */}
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-0.5">
                <span className="flex items-center gap-1">
                  <DoorOpen className="w-3.5 h-3.5 text-emerald-600" />
                  <span>分配房號 / 床位</span>
                </span>
                {onEditRoom && (
                  <button
                    onClick={() => onEditRoom(resident)}
                    className="text-[11px] font-bold text-emerald-600 hover:text-emerald-800 flex items-center gap-0.5"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>編輯房號</span>
                  </button>
                )}
              </div>
              <div className="font-bold font-mono text-slate-800 text-xs sm:text-sm">
                {resident.bed.includes('#REF!') || !resident.bed.trim() ? (
                  <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-xs">
                    尚未編配房號 (#REF!)
                  </span>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-extrabold text-sm">
                      {resident.roomNumber !== '未分配' ? `房號 ${resident.roomNumber}` : resident.bed}
                    </span>
                    {resident.bedNumber !== '待編排' && resident.bedNumber && (
                      <span className="text-slate-600 text-xs font-semibold">
                        ({resident.bedNumber}號床)
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* 接駁車輛 */}
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-0.5">
                <Bus className="w-3.5 h-3.5 text-sky-500" />
                <span>接駁車輛</span>
              </div>
              <div className="font-bold text-slate-800">
                {resident.vehicle ? (
                  <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 text-xs">
                    {resident.vehicle}
                  </span>
                ) : (
                  <span className="text-slate-400 text-xs">無安排</span>
                )}
              </div>
            </div>

            {/* 訂購寢具 */}
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-0.5">
                <BedDouble className="w-3.5 h-3.5 text-amber-500" />
                <span>訂購寢具</span>
              </div>
              <div className="font-bold font-mono text-slate-800">
                {resident.bedding > 0 ? (
                  <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-xs">
                    ${resident.bedding.toLocaleString()} 元
                  </span>
                ) : (
                  <span className="text-slate-500 text-xs">$0 自備</span>
                )}
              </div>
            </div>
          </div>

          {/* 航班入境與幹部接送備註 */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <Plane className="w-3.5 h-3.5 text-sky-600" />
                <span>航班抵達 &amp; 幹部時程</span>
              </div>
              {resident.flightArrival && (
                <button
                  onClick={() => handleCopy(resident.flightArrival, 'flight')}
                  className="text-xs text-sky-600 hover:text-sky-800 flex items-center gap-1 font-semibold"
                >
                  {copiedType === 'flight' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedType === 'flight' ? '已複製' : '複製資訊'}</span>
                </button>
              )}
            </div>
            {resident.flightArrival ? (
              <div className="text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200 whitespace-pre-line leading-relaxed font-sans">
                {resident.flightArrival}
              </div>
            ) : (
              <div className="text-xs text-slate-400 italic">無特定航班備註（隨隊同行進住）</div>
            )}
          </div>
        </div>

        {/* Modal Footer Quick Actions */}
        <div className="p-3.5 border-t border-slate-150 bg-slate-50/80 flex items-center justify-between gap-2 text-xs">
          <button
            onClick={() => handleCopy(fullSummaryText, 'summary')}
            className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer active:scale-98 shadow-xs"
          >
            {copiedType === 'summary' ? <Check className="w-4 h-4 text-emerald-200" /> : <Copy className="w-4 h-4" />}
            <span>{copiedType === 'summary' ? '已複製完整通報文字' : '一鍵複製完整進住資訊'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-200 text-slate-700 font-semibold"
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  );
};
