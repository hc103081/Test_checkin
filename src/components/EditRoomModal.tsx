import React, { useState, useEffect } from 'react';
import { X, Check, DoorOpen, BedDouble, Building, Sparkles } from 'lucide-react';
import { Resident } from '../data/residentData';

interface EditRoomModalProps {
  resident: Resident | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveRoom: (studentId: string, newBedString: string) => void;
}

export const EditRoomModal: React.FC<EditRoomModalProps> = ({
  resident,
  isOpen,
  onClose,
  onSaveRoom,
}) => {
  const [roomInput, setRoomInput] = useState('');
  const [bedInput, setBedInput] = useState('');

  useEffect(() => {
    if (resident) {
      if (resident.roomNumber && resident.roomNumber !== '未分配') {
        setRoomInput(resident.roomNumber);
        setBedInput(resident.bedNumber !== '待編排' ? resident.bedNumber : '');
      } else {
        setRoomInput('');
        setBedInput('');
      }
    }
  }, [resident]);

  if (!isOpen || !resident) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanRoom = roomInput.trim();
    const cleanBed = bedInput.trim();

    let combined = '';
    if (!cleanRoom) {
      combined = '#REF!';
    } else if (cleanBed) {
      combined = `${cleanRoom}-${cleanBed}`;
    } else {
      combined = cleanRoom;
    }

    onSaveRoom(resident.studentId, combined);
    onClose();
  };

  const handleQuickPreset = (presetRoom: string, presetBed: string) => {
    setRoomInput(presetRoom);
    setBedInput(presetBed);
  };

  const handleClearToRef = () => {
    onSaveRoom(resident.studentId, '#REF!');
    onClose();
  };

  const commonRooms = [
    { room: 'J0514', beds: ['1', '2', '3', '4', '5'] },
    { room: 'J0515', beds: ['1', '2', '3', '4', '5'] },
    { room: 'J0516', beds: ['1', '2', '3', '4'] },
    { room: 'J0517', beds: ['1', '2', '3', '4'] },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-150 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <DoorOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">分配 / 編輯房號與床位</h2>
              <p className="text-xs text-slate-500">
                {resident.name} ({resident.studentId})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-5 space-y-4 text-xs">
          {/* Current info */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <div className="text-[11px] text-slate-400">目前宿舍</div>
              <div className="font-bold text-slate-800 text-sm flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-indigo-500" />
                {resident.dormitory}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[11px] text-slate-400">目前房號狀態</div>
              <div className="font-bold font-mono text-sm">
                {resident.bed.includes('#REF!') || resident.bed.includes('#N/A') || !resident.bed.trim() ? (
                  <span className="text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    尚未分配
                  </span>
                ) : (
                  <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {resident.bed}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Input Fields */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                房號 (如 J0514, 301, A205)
              </label>
              <input
                type="text"
                required
                value={roomInput}
                onChange={(e) => setRoomInput(e.target.value)}
                placeholder="例如：J0514 或 301"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                床號 (選填，如 1, 2, 4)
              </label>
              <input
                type="text"
                value={bedInput}
                onChange={(e) => setBedInput(e.target.value)}
                placeholder="例如：4 或 2"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Quick preset chips for common rooms */}
          <div className="space-y-1.5 pt-1">
            <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>修平科大男宿現有房號快速帶入：</span>
            </div>
            <div className="space-y-1 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              {commonRooms.map((group) => (
                <div key={group.room} className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-mono font-bold text-slate-700 text-[11px] w-12">
                    {group.room}:
                  </span>
                  {group.beds.map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => handleQuickPreset(group.room, b)}
                      className="px-2 py-0.5 font-mono text-[11px] bg-white border border-slate-200 rounded hover:border-emerald-500 hover:text-emerald-700 font-semibold cursor-pointer transition-colors"
                    >
                      {group.room}-{b}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-2 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={handleClearToRef}
              className="text-xs text-rose-600 hover:text-rose-800 underline font-medium cursor-pointer"
            >
              清除並還原為待排定 (#REF!)
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-medium"
              >
                取消
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>儲存房號</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
