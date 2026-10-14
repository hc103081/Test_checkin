import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Users,
  Search,
  Calendar,
  Sparkles,
  Download,
  Building2,
  CheckCircle2,
  DoorOpen,
  Info,
  X,
} from 'lucide-react';
import { INITIAL_RESIDENTS, Resident } from './data/residentData';
import { FlightBatch } from './data/flightBatches';
import { StatsCards } from './components/StatsCards';
import { QuickPills } from './components/QuickPills';
import { FilterToolbar, FilterState } from './components/FilterToolbar';
import { ResidentTable, SortField, SortOrder } from './components/ResidentTable';
import { ResidentCardGrid } from './components/ResidentCardGrid';
import { ResidentDetailModal } from './components/ResidentDetailModal';
import { FlightScheduleDrawer } from './components/FlightScheduleDrawer';
import { CsvImportModal } from './components/CsvImportModal';
import { MobileFilterDrawer } from './components/MobileFilterDrawer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { EditRoomModal } from './components/EditRoomModal';

const STORAGE_KEY_CHECKIN = 'dorm_checkin_status_v1';
const STORAGE_KEY_CUSTOM_DATA = 'dorm_residents_custom_v2';
const STORAGE_KEY_BANNER_DISMISSED = 'dorm_room_banner_dismissed_v2';

export default function App() {
  // Load residents
  const [residents, setResidents] = useState<Resident[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CUSTOM_DATA);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_RESIDENTS;
  });

  // Check-in status saved in LocalStorage
  const [checkedInIds, setCheckedInIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CHECKIN);
      if (saved) {
        return new Set(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }
    return new Set<string>();
  });

  // Room Banner dismiss state
  const [isBannerDismissed, setIsBannerDismissed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_BANNER_DISMISSED) === 'true';
    } catch {
      return false;
    }
  });

  // Save check-ins to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CHECKIN, JSON.stringify(Array.from(checkedInIds)));
    } catch (e) {
      console.error(e);
    }
  }, [checkedInIds]);

  // Filters
  const initialFilterState: FilterState = {
    globalSearch: '',
    identity: '',
    dormitory: '',
    vehicle: '',
    bedding: '',
    dateCategory: '',
    bedStatus: '',
    checkInStatus: '',
  };

  const [filters, setFilters] = useState<FilterState>(initialFilterState);
  const [quickFilter, setQuickFilter] = useState<{ preset: string; value: string }>({
    preset: 'all',
    value: '',
  });

  // Sorting
  const [sortField, setSortField] = useState<SortField>('seq');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  // View mode - Mobile defaults to 'card'
  const [viewMode, setViewMode] = useState<'table' | 'card'>(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return 'card';
    }
    return 'table';
  });
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Modals & Mobile Drawers
  const [selectedResident, setSelectedResident] = useState<Resident | null>(null);
  const [editingRoomResident, setEditingRoomResident] = useState<Resident | null>(null);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Toggle check-in
  const handleToggleCheckIn = useCallback((studentId: string) => {
    setCheckedInIds((prev) => {
      const next = new Set(prev);
      if (next.has(studentId)) {
        next.delete(studentId);
      } else {
        next.add(studentId);
      }
      return next;
    });
  }, []);

  // Save edited room number
  const handleSaveRoom = useCallback((studentId: string, newBedString: string) => {
    setResidents((prev) => {
      const updated = prev.map((r) => {
        if (r.studentId === studentId) {
          const cleanBed = newBedString.trim();
          let roomNumber = '';
          let bedNumber = '';
          let roomAndBedDisplay = '';

          if (!cleanBed || cleanBed.includes('#REF!')) {
            roomNumber = '未分配';
            bedNumber = '待編排';
            roomAndBedDisplay = '待編排房號 (#REF!)';
          } else if (cleanBed.includes('-')) {
            const parts = cleanBed.split('-');
            roomNumber = parts[0].trim();
            bedNumber = parts[1].trim();
            roomAndBedDisplay = `${roomNumber} 房 (${bedNumber}號床)`;
          } else {
            roomNumber = cleanBed;
            bedNumber = '1';
            roomAndBedDisplay = `${roomNumber} 房`;
          }

          return {
            ...r,
            bed: cleanBed,
            roomNumber,
            bedNumber,
            roomAndBedDisplay,
          };
        }
        return r;
      });

      try {
        localStorage.setItem(STORAGE_KEY_CUSTOM_DATA, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });

    // Also update selectedResident if open
    setSelectedResident((prev) => {
      if (prev && prev.studentId === studentId) {
        const cleanBed = newBedString.trim();
        let roomNumber = '';
        let bedNumber = '';
        let roomAndBedDisplay = '';

        if (!cleanBed || cleanBed.includes('#REF!')) {
          roomNumber = '未分配';
          bedNumber = '待編排';
          roomAndBedDisplay = '待編排房號 (#REF!)';
        } else if (cleanBed.includes('-')) {
          const parts = cleanBed.split('-');
          roomNumber = parts[0].trim();
          bedNumber = parts[1].trim();
          roomAndBedDisplay = `${roomNumber} 房 (${bedNumber}號床)`;
        } else {
          roomNumber = cleanBed;
          bedNumber = '1';
          roomAndBedDisplay = `${roomNumber} 房`;
        }

        return {
          ...prev,
          bed: cleanBed,
          roomNumber,
          bedNumber,
          roomAndBedDisplay,
        };
      }
      return prev;
    });
  }, []);

  // Sort handler
  const handleSort = useCallback((field: SortField) => {
    setSortField((prevField) => {
      if (prevField === field) {
        setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
        return field;
      }
      setSortOrder('asc');
      return field;
    });
  }, []);

  // Quick preset filter
  const handleQuickPillSelect = useCallback((preset: string, value: string) => {
    setQuickFilter({ preset, value });
    setFilters((prev) => {
      const next = { ...prev };
      if (preset === 'all') {
        return initialFilterState;
      }
      if (preset === 'dormitory') next.dormitory = value;
      if (preset === 'identity') next.identity = value;
      if (preset === 'bedding') next.bedding = value;
      if (preset === 'date') next.dateCategory = value;
      if (preset === 'checkIn') next.checkInStatus = value;
      if (preset === 'hasVehicle') next.vehicle = value === 'yes' ? 'hasVehicle' : 'none';
      if (preset === 'bedStatus') next.bedStatus = value;
      if (preset === 'room') next.bedStatus = value;
      return next;
    });
  }, []);

  // Filter preset from stats card
  const handleStatsPreset = useCallback((preset: string, value: string) => {
    handleQuickPillSelect(preset, value);
  }, [handleQuickPillSelect]);

  // Reset all filters
  const handleResetFilters = useCallback(() => {
    setFilters(initialFilterState);
    setQuickFilter({ preset: 'all', value: '' });
  }, []);

  // Filter batch from flight schedule drawer
  const handleFilterBatch = useCallback((batch: FlightBatch) => {
    setFilters({
      ...initialFilterState,
      globalSearch: batch.flightCode,
      dateCategory: batch.date,
    });
    setQuickFilter({ preset: 'custom', value: batch.flightCode });
  }, []);

  // Reset check-in records
  const handleResetCheckIn = useCallback(() => {
    if (window.confirm('確定要清除所有本機簽到報到紀錄嗎？')) {
      setCheckedInIds(new Set());
    }
  }, []);

  // Core ultra-fast memoized filter logic (< 1ms execution)
  const filteredResidents = useMemo(() => {
    const q = filters.globalSearch.trim().toLowerCase();
    const identityFilter = filters.identity;
    const dormFilter = filters.dormitory;
    const vehicleFilter = filters.vehicle;
    const beddingFilter = filters.bedding;
    const dateFilter = filters.dateCategory;
    const bedStatusFilter = filters.bedStatus;
    const checkInStatusFilter = filters.checkInStatus;

    return residents.filter((r) => {
      // Global search (includes Room Number)
      if (q) {
        const matchName = r.name.toLowerCase().includes(q);
        const matchId = r.studentId.toLowerCase().includes(q);
        const matchDorm = r.dormitory.toLowerCase().includes(q);
        const matchBed =
          r.bed.toLowerCase().includes(q) ||
          (r.roomNumber && r.roomNumber.toLowerCase().includes(q)) ||
          r.roomAndBedDisplay.toLowerCase().includes(q);
        const matchFlight = r.flightArrival.toLowerCase().includes(q);
        const matchVehicle = r.vehicle.toLowerCase().includes(q) || r.vehicleNormalized.toLowerCase().includes(q);
        const matchIdentity = r.identity.toLowerCase().includes(q);
        const matchSeq = r.seq === q;
        if (!matchName && !matchId && !matchDorm && !matchBed && !matchFlight && !matchVehicle && !matchIdentity && !matchSeq) {
          return false;
        }
      }

      // Column: Identity
      if (identityFilter && r.identity !== identityFilter) return false;

      // Column: Dormitory
      if (dormFilter && !r.dormitory.includes(dormFilter)) return false;

      // Column: Vehicle
      if (vehicleFilter) {
        if (vehicleFilter === 'none') {
          if (r.vehicle.trim() !== '') return false;
        } else if (vehicleFilter === 'hasVehicle') {
          if (!r.vehicle.trim()) return false;
        } else {
          if (!r.vehicleNormalized.includes(vehicleFilter)) return false;
        }
      }

      // Column: Bedding
      if (beddingFilter) {
        if (beddingFilter === '1900' && r.bedding !== 1900) return false;
        if (beddingFilter === '1950' && r.bedding !== 1950) return false;
        if (beddingFilter === '0' && r.bedding !== 0) return false;
        if (beddingFilter === 'hasBedding' && r.bedding === 0) return false;
      }

      // Column: Date
      if (dateFilter) {
        if (dateFilter === '簽證辦理') {
          if (!r.flightArrival.includes('簽證') && !r.flightArrival.includes('面試')) return false;
        } else if (!r.flightArrival.includes(dateFilter)) {
          return false;
        }
      }

      // Column: Room / Bed status
      if (bedStatusFilter) {
        const isUnassigned = r.bed.includes('#REF!') || r.bed.includes('#N/A') || !r.bed.trim();
        if (bedStatusFilter === 'assigned' && isUnassigned) return false;
        if (bedStatusFilter === 'ref' && !isUnassigned) return false;
        if (bedStatusFilter !== 'assigned' && bedStatusFilter !== 'ref') {
          if (!r.bed.includes(bedStatusFilter) && !r.roomNumber.includes(bedStatusFilter)) return false;
        }
      }

      // Column: Check-in status
      if (checkInStatusFilter) {
        const isChecked = checkedInIds.has(r.studentId);
        if (checkInStatusFilter === 'yes' && !isChecked) return false;
        if (checkInStatusFilter === 'no' && isChecked) return false;
      }

      return true;
    });
  }, [residents, filters, checkedInIds]);

  // Memoized Sorting
  const sortedResidents = useMemo(() => {
    return [...filteredResidents].sort((a, b) => {
      let result = 0;
      switch (sortField) {
        case 'seq': {
          const numA = parseInt(a.seq, 10) || 0;
          const numB = parseInt(b.seq, 10) || 0;
          result = numA - numB;
          break;
        }
        case 'name':
          result = a.name.localeCompare(b.name, 'zh-Hant');
          break;
        case 'studentId':
          result = a.studentId.localeCompare(b.studentId);
          break;
        case 'identity':
          result = a.identity.localeCompare(b.identity, 'zh-Hant');
          break;
        case 'dormitory':
          result = a.dormitory.localeCompare(b.dormitory, 'zh-Hant');
          break;
        case 'bed':
          result = a.bed.localeCompare(b.bed);
          break;
        case 'vehicle':
          result = a.vehicleNormalized.localeCompare(b.vehicleNormalized);
          break;
        case 'bedding':
          result = a.bedding - b.bedding;
          break;
        case 'dateCategory':
          result = a.flightArrival.localeCompare(b.flightArrival);
          break;
      }
      return sortOrder === 'asc' ? result : -result;
    });
  }, [filteredResidents, sortField, sortOrder]);

  // Batch check-in visible helper
  const handleBatchCheckIn = () => {
    if (sortedResidents.length === 0) return;
    const confirmMsg = `確定要將目前篩選出的 ${sortedResidents.length} 位人員全部標記為已報到嗎？`;
    if (window.confirm(confirmMsg)) {
      setCheckedInIds((prev) => {
        const next = new Set(prev);
        sortedResidents.forEach((r) => next.add(r.studentId));
        return next;
      });
    }
  };

  // Export CSV with UTF-8 BOM
  const handleExportCsv = () => {
    const headers = ['序號', '身分別', '姓名', '學號', '宿舍', '房號床位', '航班入境時間', '車輛', '訂購寢具', '報到狀態'];
    const rows = sortedResidents.map((r) => [
      `"${r.seq}"`,
      `"${r.identity}"`,
      `"${r.name}"`,
      `"${r.studentId}"`,
      `"${r.dormitory}"`,
      `"${r.bed}"`,
      `"${r.flightArrival.replace(/"/g, '""')}"`,
      `"${r.vehicle}"`,
      `"${r.bedding}"`,
      `"${checkedInIds.has(r.studentId) ? '已報到' : '未報到'}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((row) => row.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `進住人員名冊_含房號_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Update residents from CSV import
  const handleUpdateResidents = (newResidents: Resident[]) => {
    setResidents(newResidents);
    try {
      localStorage.setItem(STORAGE_KEY_CUSTOM_DATA, JSON.stringify(newResidents));
    } catch (e) {
      console.error(e);
    }
  };

  // Restore default residents
  const handleResetToDefault = () => {
    setResidents(INITIAL_RESIDENTS);
    try {
      localStorage.removeItem(STORAGE_KEY_CUSTOM_DATA);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDismissBanner = () => {
    setIsBannerDismissed(true);
    try {
      localStorage.setItem(STORAGE_KEY_BANNER_DISMISSED, 'true');
    } catch (e) {
      console.error(e);
    }
  };

  // Navigation inside detail modal
  const currentModalIndex = selectedResident
    ? sortedResidents.findIndex((r) => r.id === selectedResident.id)
    : -1;
  const hasPrev = currentModalIndex > 0;
  const hasNext = currentModalIndex >= 0 && currentModalIndex < sortedResidents.length - 1;

  const handlePrevResident = () => {
    if (hasPrev) {
      setSelectedResident(sortedResidents[currentModalIndex - 1]);
    }
  };

  const handleNextResident = () => {
    if (hasNext) {
      setSelectedResident(sortedResidents[currentModalIndex + 1]);
    }
  };

  // Count active filters
  const activeFilterCount = [
    filters.identity,
    filters.dormitory,
    filters.vehicle,
    filters.bedding,
    filters.dateCategory,
    filters.bedStatus,
    filters.checkInStatus,
  ].filter(Boolean).length;

  const hasActiveFilters = filters.globalSearch.trim() !== '' || activeFilterCount > 0;

  // Pending count
  const pendingCount = residents.filter((r) => !checkedInIds.has(r.studentId)).length;
  const isPendingOnly = filters.checkInStatus === 'no';

  // Toggle pending only on mobile
  const handleTogglePendingOnly = () => {
    if (isPendingOnly) {
      setFilters((prev) => ({ ...prev, checkInStatus: '' }));
      setQuickFilter({ preset: 'all', value: '' });
    } else {
      setFilters((prev) => ({ ...prev, checkInStatus: 'no' }));
      setQuickFilter({ preset: 'checkIn', value: 'no' });
    }
  };

  // Mobile jump to search
  const handleMobileOpenSearch = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const searchInput = document.getElementById('main-search-input') as HTMLInputElement;
    searchInput?.focus();
  };

  // Count assigned rooms
  const assignedRoomCount = residents.filter((r) => r.bed && !r.bed.includes('#REF!') && !r.bed.includes('#N/A')).length;
  const unassignedRoomCount = residents.length - assignedRoomCount;

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 antialiased font-sans pb-16 md:pb-6">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-13 sm:h-14 flex items-center justify-between">
          {/* Logo & Title */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-xs shrink-0">
              <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">
                  進住人員極速查詢
                </h1>
                <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  極速響應
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-400 truncate max-w-[200px] sm:max-w-none">
                支援姓名、學號、宿舍與房號即時查詢
              </p>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsScheduleOpen(true)}
              className="px-2.5 py-1.5 text-xs font-semibold rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>航班幹部</span>
            </button>
            <button
              onClick={handleExportCsv}
              className="hidden sm:flex px-2.5 py-1.5 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              title="匯出篩選結果為 UTF-8 CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>匯出名冊</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-2.5 sm:px-6 py-3 sm:py-4">
        {/* Room Explanation Banner answering "房號呢" */}
        {!isBannerDismissed && (
          <div className="mb-3 p-3 bg-emerald-50/90 border border-emerald-200 rounded-2xl flex items-start justify-between gap-2.5 text-xs text-emerald-950 shadow-2xs">
            <div className="flex items-start gap-2">
              <DoorOpen className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
              <div>
                <span className="font-extrabold text-emerald-900">✅ 最新名單已更新：第一宿舍房號已全數排定！</span>
                <span className="text-emerald-800 block sm:inline mt-0.5 sm:mt-0">
                  第一宿舍 (女宿 74人) 房號與床位已完整排定（如 0828-5, 0705-1, 0420-2 等）；修平科大男宿已排定 J0514～J0517 房號共 12 人。
                  目前全體已排定房號 <strong>{assignedRoomCount} 人</strong>，僅餘 <strong>{unassignedRoomCount} 人</strong> 待排。
                  您可直接搜尋房號（如 <code className="bg-emerald-100 font-mono font-bold px-1 rounded">0828</code> 或 <code className="bg-emerald-100 font-mono font-bold px-1 rounded">J0514</code>），或點擊「<strong className="text-emerald-900">✏️ 編輯房號</strong>」進行指派！
                </span>
              </div>
            </div>

            <button
              onClick={handleDismissBanner}
              className="text-emerald-600 hover:text-emerald-800 p-1 rounded-lg hover:bg-emerald-100/60 transition-colors shrink-0"
              title="關閉說明"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* KPI Stats Overview */}
        <StatsCards
          allResidents={residents}
          filteredCount={sortedResidents.length}
          checkedInIds={checkedInIds}
          onFilterPreset={handleStatsPreset}
          activeFilterKey={quickFilter.preset}
          activeFilterValue={quickFilter.value}
        />

        {/* Quick Filter Pills Bar */}
        <QuickPills
          currentFilter={quickFilter}
          onSelect={handleQuickPillSelect}
          onClear={handleResetFilters}
          hasActiveFilters={hasActiveFilters}
        />

        {/* Multi-field Filter & Action Toolbar */}
        <FilterToolbar
          filters={filters}
          onChange={setFilters}
          onReset={handleResetFilters}
          onOpenSchedule={() => setIsScheduleOpen(true)}
          onExportCsv={handleExportCsv}
          onOpenImport={() => setIsImportOpen(true)}
          onOpenMobileFilter={() => setIsMobileFilterOpen(true)}
          viewMode={viewMode}
          onToggleViewMode={setViewMode}
          filteredCount={sortedResidents.length}
          totalCount={residents.length}
          onBatchCheckInVisible={handleBatchCheckIn}
          onResetCheckIn={handleResetCheckIn}
          showAdvanced={showAdvanced}
          onToggleAdvanced={() => setShowAdvanced((prev) => !prev)}
        />

        {/* Content View: Table or Card Grid */}
        {viewMode === 'table' ? (
          <ResidentTable
            residents={sortedResidents}
            checkedInIds={checkedInIds}
            onToggleCheckIn={handleToggleCheckIn}
            onSelectResident={setSelectedResident}
            onEditRoom={setEditingRoomResident}
            sortField={sortField}
            sortOrder={sortOrder}
            onSort={handleSort}
            searchHighlight={filters.globalSearch}
          />
        ) : (
          <ResidentCardGrid
            residents={sortedResidents}
            checkedInIds={checkedInIds}
            onToggleCheckIn={handleToggleCheckIn}
            onSelectResident={setSelectedResident}
            onEditRoom={setEditingRoomResident}
            searchHighlight={filters.globalSearch}
          />
        )}
      </main>

      {/* Resident Detail Modal (Bottom Sheet on Mobile) */}
      <ResidentDetailModal
        resident={selectedResident}
        onClose={() => setSelectedResident(null)}
        isCheckedIn={selectedResident ? checkedInIds.has(selectedResident.studentId) : false}
        onToggleCheckIn={handleToggleCheckIn}
        onPrev={handlePrevResident}
        onNext={handleNextResident}
        onEditRoom={setEditingRoomResident}
        hasPrev={hasPrev}
        hasNext={hasNext}
        currentIndex={currentModalIndex}
        totalFiltered={sortedResidents.length}
      />

      {/* Edit Room & Bed Modal */}
      <EditRoomModal
        resident={editingRoomResident}
        isOpen={Boolean(editingRoomResident)}
        onClose={() => setEditingRoomResident(null)}
        onSaveRoom={handleSaveRoom}
      />

      {/* Flight Schedule & Cadre Drawer */}
      <FlightScheduleDrawer
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        onFilterBatch={handleFilterBatch}
      />

      {/* Mobile Touch-friendly Filter Drawer */}
      <MobileFilterDrawer
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        filters={filters}
        onChange={setFilters}
        onReset={handleResetFilters}
        filteredCount={sortedResidents.length}
        totalCount={residents.length}
      />

      {/* CSV Import / Reset Modal */}
      <CsvImportModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onUpdateResidents={handleUpdateResidents}
        onResetToDefault={handleResetToDefault}
        currentCount={residents.length}
      />

      {/* Mobile Sticky Bottom Navigation */}
      <MobileBottomNav
        onOpenSearch={handleMobileOpenSearch}
        onOpenFilter={() => setIsMobileFilterOpen(true)}
        onTogglePendingOnly={handleTogglePendingOnly}
        isPendingOnly={isPendingOnly}
        onOpenSchedule={() => setIsScheduleOpen(true)}
        onOpenStats={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        activeFilterCount={activeFilterCount}
        pendingCount={pendingCount}
      />
    </div>
  );
}
