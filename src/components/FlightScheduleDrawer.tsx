import React from 'react';
import { X, Plane, Clock, User, Bus, Sparkles } from 'lucide-react';
import { FLIGHT_BATCHES, FlightBatch } from '../data/flightBatches';

interface FlightScheduleDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onFilterBatch: (batch: FlightBatch) => void;
}

export const FlightScheduleDrawer: React.FC<FlightScheduleDrawerProps> = ({
  isOpen,
  onClose,
  onFilterBatch,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-end md:justify-center md:items-center p-0 md:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white w-full md:max-w-2xl rounded-t-3xl md:rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[88vh] md:max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile handle & Header */}
        <div className="px-5 pt-3 pb-3 border-b border-slate-150 bg-slate-50/80">
          <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto mb-2 md:hidden" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
                <Plane className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-extrabold text-slate-900">班機抵達與接送幹部時程表</h2>
                <p className="text-[11px] text-slate-400">點擊任一班次可直接過濾出該批進住名單</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* List of Batches */}
        <div className="p-3.5 md:p-4 overflow-y-auto space-y-2.5">
          {FLIGHT_BATCHES.map((batch) => (
            <div
              key={batch.id}
              className="p-3 rounded-2xl border border-slate-200 hover:border-blue-400 bg-white hover:bg-blue-50/20 transition-all shadow-2xs"
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-blue-100 text-blue-800">
                    {batch.date}
                  </span>
                  <span className="text-sm font-extrabold text-slate-900 font-mono">
                    {batch.flightCode}
                  </span>
                  <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                    {batch.airport}
                  </span>
                  {batch.arrivalTime && (
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {batch.arrivalTime} 入境
                    </span>
                  )}
                </div>

                <button
                  onClick={() => {
                    onFilterBatch(batch);
                    onClose();
                  }}
                  className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 active:scale-95 text-white flex items-center gap-1 transition-colors cursor-pointer shrink-0 shadow-2xs"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>篩選此批</span>
                </button>
              </div>

              {/* Campus arrival time & vehicles */}
              <div className="flex items-center gap-3 text-xs text-slate-600 my-1.5 flex-wrap">
                {batch.campusArrivalTime && (
                  <div className="flex items-center gap-1 text-amber-800 font-semibold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>抵校：{batch.campusArrivalTime}</span>
                  </div>
                )}
                {batch.vehicles.length > 0 && (
                  <div className="flex items-center gap-1 text-indigo-800 font-bold bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                    <Bus className="w-3.5 h-3.5 text-indigo-600" />
                    <span>搭乘：{batch.vehicles.join('、')}</span>
                  </div>
                )}
              </div>

              {/* Cadres and Translators */}
              {(batch.cadres.length > 0 || batch.translators.length > 0) && (
                <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-150 text-xs space-y-1 mt-2">
                  {batch.cadres.length > 0 && (
                    <div className="flex items-start gap-1.5">
                      <User className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" />
                      <span className="text-slate-500 shrink-0 font-medium">值班幹部：</span>
                      <span className="font-semibold text-slate-800">{batch.cadres.join('、')}</span>
                    </div>
                  )}
                  {batch.translators.length > 0 && (
                    <div className="flex items-start gap-1.5">
                      <User className="w-3.5 h-3.5 text-purple-600 mt-0.5 shrink-0" />
                      <span className="text-slate-500 shrink-0 font-medium">翻譯幹部：</span>
                      <span className="font-semibold text-slate-800">{batch.translators.join('、')}</span>
                    </div>
                  )}
                </div>
              )}

              {batch.note && (
                <div className="text-[11px] text-slate-400 mt-1.5">
                  備註：{batch.note}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-150 bg-slate-50/80 text-right">
          <button
            onClick={onClose}
            className="w-full md:w-auto px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-colors"
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  );
};
