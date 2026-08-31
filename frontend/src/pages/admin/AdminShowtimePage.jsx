// [AI UPDATE - Chuyen doi toan bo giao dien AdminShowtimePage sang phong cach Modern Enterprise Office Portal sang sua va ro net]
import React, { useState, useEffect, useMemo } from 'react';
import { movieApi } from '@/api/movieApi';
import { roomApi } from '@/api/roomApi';
import { showtimeApi } from '@/api/showtimeApi';
import { cinemaApi } from '@/api/cinemaApi';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency, formatDate, formatTime } from '@/utils/formatters';

const FORMAT_OPTIONS = [
  { value: 'TWO_D_SUB', label: '2D Phụ đề', badgeColor: 'bg-purple-50 text-purple-700 border-purple-200' },
  { value: 'TWO_D_DUB', label: '2D Lồng tiếng', badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { value: 'IMAX_TWO_D', label: 'IMAX 2D Phụ đề', badgeColor: 'bg-amber-50 text-amber-700 border-amber-200' }
];

const DAYS_OF_WEEK = [
  { day: 1, label: 'Thứ 2' },
  { day: 2, label: 'Thứ 3' },
  { day: 3, label: 'Thứ 4' },
  { day: 4, label: 'Thứ 5' },
  { day: 5, label: 'Thứ 6' },
  { day: 6, label: 'Thứ 7' },
  { day: 0, label: 'Chủ Nhật' },
];

const AdminShowtimePage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('list'); // 'list' | 'batch'
  
  // Data lists
  const [showtimes, setShowtimes] = useState([]);
  const [movies, setMovies] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [selectedCinemaId, setSelectedCinemaId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Tab 1 Filters
  const [filterDate, setFilterDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [filterRoomId, setFilterRoomId] = useState('ALL');

  // Tab 2 Batch Wizard State
  const [wizardMovieId, setWizardMovieId] = useState('');
  const [wizardFormat, setWizardFormat] = useState('TWO_D_SUB');
  const [wizardRoomIds, setWizardRoomIds] = useState([]);
  const [wizardStartDate, setWizardStartDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [wizardEndDate, setWizardEndDate] = useState(() => {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 6);
    return nextWeek.toISOString().split('T')[0];
  });
  const [wizardDays, setWizardDays] = useState([1, 2, 3, 4, 5, 6, 0]);
  const [timeSlots, setTimeSlots] = useState(['09:15', '11:45', '14:15', '16:45', '19:15', '21:45']);
  const [newTimeInput, setNewTimeInput] = useState('');
  const [chainStartHour, setChainStartHour] = useState('08:45');
  const [chainBufferMinutes, setChainBufferMinutes] = useState(15);
  const [weekdayPrice, setWeekdayPrice] = useState(80000);
  const [weekendPrice, setWeekendPrice] = useState(100000);

  // Preview List
  const [previewList, setPreviewList] = useState([]);
  const [previewGenerated, setPreviewGenerated] = useState(false);
  const [submittingBatch, setSubmittingBatch] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, [user]);

  const fetchInitialData = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const isManager = user.role === 'MANAGER';
      let currentCinemaId = isManager ? user.cinemaId : null;

      if (!isManager) {
        const cinemasRes = await cinemaApi.getAllCinemas();
        const activeCinemas = cinemasRes.data.filter(c => c.active || c.isActive);
        setCinemas(activeCinemas);
        if (activeCinemas.length > 0 && !currentCinemaId) {
          currentCinemaId = activeCinemas[0].id;
        }
      }

      setSelectedCinemaId(currentCinemaId);
      if (currentCinemaId) {
        await loadCinemaDependentData(currentCinemaId);
      }
    } catch (error) {
      console.error('Loi khi tai du lieu ban dau', error);
      alert('Khong the tai du lieu cum rap');
    } finally {
      setLoading(false);
    }
  };

  const loadCinemaDependentData = async (cinemaId) => {
    try {
      const [showtimesRes, moviesRes, roomsRes] = await Promise.all([
        showtimeApi.getAllShowtimes(cinemaId),
        movieApi.getAllMovies(),
        roomApi.getRoomsByCinema(cinemaId)
      ]);

      const activeMovies = moviesRes.data.filter(m => m.active || m.isActive);
      const activeRooms = roomsRes.data.filter(r => r.active || r.isActive);

      setShowtimes(showtimesRes.data);
      setMovies(activeMovies);
      setRooms(activeRooms);

      if (activeMovies.length > 0) setWizardMovieId(activeMovies[0].id);
      if (activeRooms.length > 0) setWizardRoomIds([activeRooms[0].id]);
    } catch (err) {
      console.error('Loi khi load du lieu rap', err);
    }
  };

  const handleCinemaChange = async (e) => {
    const newId = Number(e.target.value);
    setSelectedCinemaId(newId);
    setLoading(true);
    await loadCinemaDependentData(newId);
    setLoading(false);
  };

  const handleToggleDay = (day) => {
    setWizardDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleSetQuickDays = (type) => {
    if (type === 'ALL') setWizardDays([1, 2, 3, 4, 5, 6, 0]);
    if (type === 'WEEKDAY') setWizardDays([1, 2, 3, 4, 5]);
    if (type === 'WEEKEND') setWizardDays([6, 0]);
  };

  const handleToggleRoom = (roomId) => {
    setWizardRoomIds(prev => 
      prev.includes(roomId) ? prev.filter(id => id !== roomId) : [...prev, roomId]
    );
  };

  const handleAddTimeSlot = () => {
    if (!newTimeInput) return;
    if (!timeSlots.includes(newTimeInput)) {
      setTimeSlots(prev => [...prev, newTimeInput].sort());
    }
    setNewTimeInput('');
  };

  const handleRemoveTimeSlot = (time) => {
    setTimeSlots(prev => prev.filter(t => t !== time));
  };

  const handleAutoGenerateChainSlots = () => {
    const selectedMovie = movies.find(m => m.id === Number(wizardMovieId));
    const duration = selectedMovie?.duration || 120;
    const totalSlotMinutes = duration + Number(chainBufferMinutes);

    const [startHour, startMin] = chainStartHour.split(':').map(Number);
    let currentTotalMinutes = startHour * 60 + startMin;
    const endLimitMinutes = 24 * 60;

    const generated = [];
    while (currentTotalMinutes + duration <= endLimitMinutes) {
      const h = Math.floor(currentTotalMinutes / 60);
      const m = currentTotalMinutes % 60;
      const formattedTime = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
      generated.push(formattedTime);

      const nextRawMinutes = currentTotalMinutes + totalSlotMinutes;
      const remainder = nextRawMinutes % 5;
      currentTotalMinutes = remainder === 0 ? nextRawMinutes : nextRawMinutes + (5 - remainder);
    }

    if (generated.length > 0) {
      setTimeSlots(generated);
    }
  };

  const handleGeneratePreview = () => {
    if (!wizardMovieId) {
      alert('Vui lòng chọn bộ phim!');
      return;
    }
    if (wizardRoomIds.length === 0) {
      alert('Vui lòng chọn ít nhất một phòng chiếu!');
      return;
    }
    if (timeSlots.length === 0) {
      alert('Vui lòng thêm ít nhất một khung giờ chiếu!');
      return;
    }
    if (wizardDays.length === 0) {
      alert('Vui lòng chọn ít nhất một thứ trong tuần!');
      return;
    }

    const selectedMovie = movies.find(m => m.id === Number(wizardMovieId));
    const duration = selectedMovie?.duration || 120;

    const start = new Date(wizardStartDate);
    const end = new Date(wizardEndDate);
    if (start > end) {
      alert('Ngày bắt đầu không được lớn hơn ngày kết thúc!');
      return;
    }

    const generatedShowtimes = [];
    const loopDate = new Date(start);

    while (loopDate <= end) {
      const currentDayOfWeek = loopDate.getDay();
      
      if (wizardDays.includes(currentDayOfWeek)) {
        const isWeekend = currentDayOfWeek === 6 || currentDayOfWeek === 0;
        const currentPrice = isWeekend ? Number(weekendPrice) : Number(weekdayPrice);
        const dateStr = loopDate.toISOString().split('T')[0];

        wizardRoomIds.forEach(roomId => {
          const roomObj = rooms.find(r => r.id === roomId);

          timeSlots.forEach(timeStr => {
            const startDateTimeStr = `${dateStr}T${timeStr}:00`;
            const startDateObj = new Date(startDateTimeStr);
            const endDateObj = new Date(startDateObj.getTime() + (duration + 15) * 60000);
            
            const endHours = String(endDateObj.getHours()).padStart(2, '0');
            const endMinutes = String(endDateObj.getMinutes()).padStart(2, '0');
            const endDateTimeStr = `${endDateObj.toISOString().split('T')[0]}T${endHours}:${endMinutes}:00`;

            const hasConflict = showtimes.some(existing => {
              if (existing.roomId !== roomId && existing.room?.id !== roomId) return false;
              const exStart = new Date(existing.startTime);
              const exEnd = new Date(existing.endTime);
              return startDateObj < exEnd && endDateObj > exStart;
            });

            let conflictInfo = null;
            if (hasConflict) {
              const conflictShowtime = showtimes.find(existing => {
                if (existing.roomId !== roomId && existing.room?.id !== roomId) return false;
                const exStart = new Date(existing.startTime);
                const exEnd = new Date(existing.endTime);
                return startDateObj < exEnd && endDateObj > exStart;
              });
              const conflictMovieTitle = conflictShowtime?.movie?.title || 'Suất chiếu khác';
              conflictInfo = `Trùng giờ với phim [${conflictMovieTitle}] (${formatTime(conflictShowtime?.startTime)} - ${formatTime(conflictShowtime?.endTime)})`;
            }

            generatedShowtimes.push({
              tempId: `${roomId}-${dateStr}-${timeStr}`,
              movieId: Number(wizardMovieId),
              movieTitle: selectedMovie.title,
              roomId: roomId,
              roomName: roomObj ? roomObj.name : `Phòng #${roomId}`,
              roomType: roomObj?.roomType || 'STANDARD',
              startTime: startDateTimeStr,
              endTime: endDateTimeStr,
              price: currentPrice,
              format: wizardFormat,
              isWeekend: isWeekend,
              hasConflict: hasConflict,
              conflictReason: conflictInfo,
              selected: !hasConflict
            });
          });
        });
      }

      loopDate.setDate(loopDate.getDate() + 1);
    }

    setPreviewList(generatedShowtimes);
    setPreviewGenerated(true);
  };

  const handleTogglePreviewItem = (tempId) => {
    setPreviewList(prev => prev.map(item => {
      if (item.tempId === tempId) {
        return { ...item, selected: !item.selected };
      }
      return item;
    }));
  };

  const handleCommitBatch = async () => {
    const validList = previewList
      .filter(item => item.selected && !item.hasConflict)
      .map(item => ({
        movieId: item.movieId,
        roomId: item.roomId,
        startTime: item.startTime,
        endTime: item.endTime,
        price: item.price,
        format: item.format,
        isActive: true
      }));

    if (validList.length === 0) {
      alert('Không có suất chiếu hợp lệ nào được chọn để lưu!');
      return;
    }

    try {
      setSubmittingBatch(true);
      await showtimeApi.createShowtimes(validList);
      alert(`Đã lưu thành công ${validList.length} suất chiếu vào hệ thống!`);
      
      if (selectedCinemaId) {
        await loadCinemaDependentData(selectedCinemaId);
      }
      setPreviewGenerated(false);
      setPreviewList([]);
      setActiveTab('list');
    } catch (error) {
      console.error(error);
      const backendError = error.response?.data?.message || error.message;
      alert(`Lỗi khi tạo suất chiếu: ${backendError}`);
    } finally {
      setSubmittingBatch(false);
    }
  };

  const handleDeleteShowtime = async (id) => {
    if (window.confirm('Bạn có chắc muốn XÓA suất chiếu này?')) {
      try {
        await showtimeApi.deleteShowtime(id);
        if (selectedCinemaId) await loadCinemaDependentData(selectedCinemaId);
        alert('Đã xóa suất chiếu thành công!');
      } catch (error) {
        console.error(error);
        alert('Lỗi khi xóa suất chiếu!');
      }
    }
  };

  const displayedShowtimes = useMemo(() => {
    return showtimes.filter(st => {
      const matchDate = st.startTime && st.startTime.startsWith(filterDate);
      const matchRoom = filterRoomId === 'ALL' || (st.roomId === Number(filterRoomId) || st.room?.id === Number(filterRoomId));
      return matchDate && matchRoom;
    }).sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
  }, [showtimes, filterDate, filterRoomId]);

  return (
    <div className="flex flex-col w-full relative min-h-full pb-16 bg-slate-50">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-8 py-6 bg-white border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-600">calendar_month</span>
            Quản Lý Suất Chiếu
          </h1>
          <p className="text-slate-500 text-xs mt-0.5">
            Lên lịch chiếu phim, phân định 2D Phụ đề / Lồng tiếng và chống trùng lịch phòng chiếu.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Dropdown chọn Rạp cho Super Admin */}
          {user?.role === 'ADMIN' && (
            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
              <span className="material-symbols-outlined text-slate-400 text-sm">theater_comedy</span>
              <select
                value={selectedCinemaId || ''}
                onChange={handleCinemaChange}
                className="bg-transparent text-slate-800 text-xs font-semibold focus:outline-none cursor-pointer"
              >
                {cinemas.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Tab Switcher */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setActiveTab('list')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'list' ? 'bg-white text-blue-600 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">view_timeline</span>
              Lịch Chiếu Hôm Nay
            </button>
            <button
              onClick={() => setActiveTab('batch')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'batch' ? 'bg-blue-600 text-white shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
              Tạo Lịch Hàng Loạt
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-xs font-medium text-slate-500">Đang tải dữ liệu lịch chiếu...</p>
          </div>
        ) : activeTab === 'list' ? (
          /* TAB 1: DANH SÁCH SUẤT CHIẾU THEO NGÀY / PHÒNG */
          <div className="space-y-5">
            {/* Filter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-slate-600 text-xs font-semibold">Chọn ngày xem:</span>
                  <input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="bg-slate-50 text-slate-800 text-xs px-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-600 text-xs font-semibold">Phòng chiếu:</span>
                  <select
                    value={filterRoomId}
                    onChange={(e) => setFilterRoomId(e.target.value)}
                    className="bg-slate-50 text-slate-800 text-xs px-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="ALL">Tất cả các phòng ({rooms.length})</option>
                    {rooms.map(r => (
                      <option key={r.id} value={r.id}>{r.name} ({r.roomType || 'STANDARD'})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="text-slate-500 text-xs">
                Tổng cộng: <span className="text-blue-600 font-bold">{displayedShowtimes.length}</span> suất chiếu
              </div>
            </div>

            {/* Showtime Grid */}
            {displayedShowtimes.length === 0 ? (
              <div className="bg-white border border-dashed border-slate-300 rounded-xl p-12 text-center text-slate-500 shadow-sm">
                <span className="material-symbols-outlined text-4xl mb-2 text-slate-400">event_busy</span>
                <p className="text-sm font-semibold text-slate-700">Chưa có suất chiếu nào trong ngày {formatDate(filterDate)}.</p>
                <p className="text-xs mt-1 text-slate-500">Hãy chuyển sang tab "Tạo Lịch Hàng Loạt" để xếp lịch nhanh chóng!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {displayedShowtimes.map(st => {
                  const formatOpt = FORMAT_OPTIONS.find(f => f.value === st.format) || FORMAT_OPTIONS[0];
                  return (
                    <div
                      key={st.id}
                      className="bg-white border border-slate-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-md transition-all shadow-sm flex flex-col justify-between"
                    >
                      <div>
                        {/* Time & Format Badge */}
                        <div className="flex items-center justify-between gap-2 mb-2.5">
                          <div className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                            <span className="text-blue-600">{formatTime(st.startTime)}</span>
                            <span className="text-slate-400 text-xs">➔</span>
                            <span className="text-slate-600 text-xs">{formatTime(st.endTime)}</span>
                          </div>
                          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${formatOpt.badgeColor}`}>
                            {formatOpt.label}
                          </span>
                        </div>

                        {/* Movie Info */}
                        <h3 className="font-bold text-slate-900 text-sm line-clamp-1 mb-1">
                          {st.movie?.title || 'Phim'}
                        </h3>
                        <p className="text-xs text-slate-500 mb-3 flex items-center gap-2">
                          <span>{st.movie?.duration || 0} phút</span>
                          <span>•</span>
                          <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 text-[10px] font-bold border border-slate-200">
                            {st.movie?.ageLimit || 'P'}
                          </span>
                        </p>

                        {/* Room & Price */}
                        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/80 space-y-1 text-xs mb-3">
                          <div className="flex justify-between text-slate-600">
                            <span>Phòng chiếu:</span>
                            <span className="text-slate-900 font-semibold">{st.room?.name || 'Phòng'}</span>
                          </div>
                          <div className="flex justify-between text-slate-600">
                            <span>Giá vé gốc:</span>
                            <span className="text-emerald-600 font-bold">{formatCurrency(st.price)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex justify-end pt-2 border-t border-slate-100">
                        <button
                          onClick={() => handleDeleteShowtime(st.id)}
                          className="px-2.5 py-1 rounded-md text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[15px]">delete</span>
                          Xóa suất
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* TAB 2: TRÌNH TẠO LỊCH CHIẾU HÀNG LOẠT (BATCH WIZARD) */
          <div className="space-y-6 max-w-4xl mx-auto">
            {/* Step 1: Chọn Phim & Định dạng */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4">
                <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold border border-blue-200">1</span>
                Chọn Phim & Định Dạng Chiếu
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Bộ phim công chiếu</label>
                  <select
                    value={wizardMovieId}
                    onChange={(e) => setWizardMovieId(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 text-xs font-medium px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    {movies.map(m => (
                      <option key={m.id} value={m.id}>
                        {m.title} ({m.duration} phút • {m.ageLimit || 'P'})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Phiên bản / Định dạng</label>
                  <div className="grid grid-cols-3 gap-2">
                    {FORMAT_OPTIONS.map(f => (
                      <button
                        key={f.value}
                        type="button"
                        onClick={() => setWizardFormat(f.value)}
                        className={`px-2.5 py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer text-center ${
                          wizardFormat === f.value
                            ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold shadow-sm'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Chọn Phòng Chiếu */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold border border-blue-200">2</span>
                  Chọn Phòng Chiếu ({wizardRoomIds.length}/{rooms.length} phòng)
                </h2>
                <div className="flex gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setWizardRoomIds(rooms.map(r => r.id))}
                    className="text-blue-600 hover:underline font-semibold cursor-pointer"
                  >
                    Chọn tất cả
                  </button>
                  <span className="text-slate-300">•</span>
                  <button
                    type="button"
                    onClick={() => setWizardRoomIds([])}
                    className="text-slate-500 hover:underline cursor-pointer"
                  >
                    Bỏ chọn
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                {rooms.map(room => {
                  const isSelected = wizardRoomIds.includes(room.id);
                  return (
                    <div
                      key={room.id}
                      onClick={() => handleToggleRoom(room.id)}
                      className={`p-3 rounded-lg border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-blue-50/60 border-blue-500 text-blue-900 shadow-sm'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs">{room.name}</span>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          readOnly
                          className="accent-blue-600 cursor-pointer"
                        />
                      </div>
                      <div className="flex items-center gap-1.5 mt-2 text-[10px] text-slate-500">
                        <span className="px-1.5 py-0.2 rounded bg-white font-mono text-slate-700 border border-slate-200">
                          {room.roomType || 'STANDARD'}
                        </span>
                        <span>{room.capacity || 0} ghế</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Chọn Khoảng Ngày & Thứ trong tuần */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4">
                <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold border border-blue-200">3</span>
                Khoảng Ngày & Thứ Áp Dụng
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Từ ngày</label>
                  <input
                    type="date"
                    value={wizardStartDate}
                    onChange={(e) => setWizardStartDate(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Đến ngày</label>
                  <input
                    type="date"
                    value={wizardEndDate}
                    onChange={(e) => setWizardEndDate(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-slate-700">Các thứ trong tuần</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleSetQuickDays('ALL')}
                      className="text-xs px-2.5 py-1 rounded bg-slate-100 text-blue-700 hover:bg-slate-200 font-semibold cursor-pointer"
                    >
                      Cả tuần
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSetQuickDays('WEEKDAY')}
                      className="text-xs px-2.5 py-1 rounded bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
                    >
                      Ngày thường (T2-T5)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSetQuickDays('WEEKEND')}
                      className="text-xs px-2.5 py-1 rounded bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
                    >
                      Cuối tuần (T6-CN)
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {DAYS_OF_WEEK.map(item => {
                    const isSelected = wizardDays.includes(item.day);
                    return (
                      <button
                        key={item.day}
                        type="button"
                        onClick={() => handleToggleDay(item.day)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-sm'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Step 4: Thiết Lập Khung Giờ Chiếu */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4">
                <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold border border-blue-200">4</span>
                Khung Giờ Chiếu Trong Ngày ({timeSlots.length} khung giờ)
              </h2>

              {/* Box tự động nối chuỗi */}
              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 mb-4">
                <div className="flex items-center gap-1.5 text-blue-700 text-xs font-bold mb-2.5">
                  <span className="material-symbols-outlined text-[16px]">auto_fix_high</span>
                  Công cụ Sinh Giờ Tự Động (Chaining Continuous Generator)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Giờ mở màn đầu tiên</label>
                    <input
                      type="time"
                      value={chainStartHour}
                      onChange={(e) => setChainStartHour(e.target.value)}
                      className="w-full bg-white text-slate-900 text-xs px-2.5 py-1.5 rounded-md border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Thời gian dọn phòng (Buffer)</label>
                    <select
                      value={chainBufferMinutes}
                      onChange={(e) => setChainBufferMinutes(Number(e.target.value))}
                      className="w-full bg-white text-slate-900 text-xs px-2.5 py-1.5 rounded-md border border-slate-300"
                    >
                      <option value={10}>10 phút</option>
                      <option value={15}>15 phút (Khuyên dùng)</option>
                      <option value={20}>20 phút</option>
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={handleAutoGenerateChainSlots}
                    className="px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors cursor-pointer shadow-sm"
                  >
                    Sinh chuỗi giờ liên tục
                  </button>
                </div>
              </div>

              {/* Danh sách Pills mốc giờ */}
              <div className="space-y-2.5">
                <div className="flex flex-wrap gap-2 items-center">
                  {timeSlots.map(time => (
                    <div
                      key={time}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-300 text-slate-800 text-xs font-mono font-bold"
                    >
                      <span>{time}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTimeSlot(time)}
                        className="text-slate-400 hover:text-red-500 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[14px]">close</span>
                      </button>
                    </div>
                  ))}
                </div>

                {/* Thêm giờ thủ công */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="time"
                    value={newTimeInput}
                    onChange={(e) => setNewTimeInput(e.target.value)}
                    className="bg-slate-50 text-slate-900 text-xs px-2.5 py-1.5 rounded-md border border-slate-300"
                  />
                  <button
                    type="button"
                    onClick={handleAddTimeSlot}
                    className="px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer border border-slate-300"
                  >
                    + Thêm mốc giờ
                  </button>
                </div>
              </div>
            </div>

            {/* Step 5: Cấu Hình Giá Vé */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4">
                <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold border border-blue-200">5</span>
                Chính Sách Giá Vé Động
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Giá ngày thường (T2 - T5)</label>
                  <input
                    type="number"
                    step="5000"
                    value={weekdayPrice}
                    onChange={(e) => setWeekdayPrice(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 text-xs font-semibold px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">Hiện tại: {formatCurrency(weekdayPrice)}</span>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Giá cuối tuần (T6 - CN)</label>
                  <input
                    type="number"
                    step="5000"
                    value={weekendPrice}
                    onChange={(e) => setWeekendPrice(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 text-xs font-semibold px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">Hiện tại: {formatCurrency(weekendPrice)}</span>
                </div>
              </div>
            </div>

            {/* Nút Xem trước Preview */}
            <div className="flex justify-center pt-1">
              <button
                type="button"
                onClick={handleGeneratePreview}
                className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-600/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">troubleshoot</span>
                XEM TRƯỚC & QUÉT TRÙNG LỊCH CHIẾU
              </button>
            </div>

            {/* Step 6: Bảng Preview & Quét Xung Đột */}
            {previewGenerated && (
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-200">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <span className="material-symbols-outlined text-emerald-600">fact_check</span>
                      Bảng Xem Trước Suất Chiếu ({previewList.length} suất)
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Hệ thống tự động phát hiện và cảnh báo các khung giờ bị trùng lịch trong cùng một phòng chiếu.
                    </p>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-semibold">
                    <span className="text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Hợp lệ: {previewList.filter(p => !p.hasConflict).length}
                    </span>
                    <span className="text-red-700 flex items-center gap-1 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                      Trùng lịch: {previewList.filter(p => p.hasConflict).length}
                    </span>
                  </div>
                </div>

                <div className="overflow-x-auto max-h-80 overflow-y-auto border border-slate-200 rounded-lg">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 uppercase sticky top-0 border-b border-slate-200">
                      <tr>
                        <th className="p-2.5">Chọn</th>
                        <th className="p-2.5">Ngày chiếu</th>
                        <th className="p-2.5">Khung giờ</th>
                        <th className="p-2.5">Phòng chiếu</th>
                        <th className="p-2.5">Định dạng</th>
                        <th className="p-2.5">Giá vé</th>
                        <th className="p-2.5">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {previewList.map(item => (
                        <tr
                          key={item.tempId}
                          className={`${item.hasConflict ? 'bg-red-50/50' : 'hover:bg-blue-50/30'}`}
                        >
                          <td className="p-2.5">
                            <input
                              type="checkbox"
                              checked={item.selected}
                              disabled={item.hasConflict}
                              onChange={() => handleTogglePreviewItem(item.tempId)}
                              className="accent-blue-600 disabled:opacity-30 cursor-pointer"
                            />
                          </td>
                          <td className="p-2.5 font-medium text-slate-900">
                            {formatDate(item.startTime)}
                          </td>
                          <td className="p-2.5 font-mono font-bold text-blue-600">
                            {formatTime(item.startTime)} - {formatTime(item.endTime)}
                          </td>
                          <td className="p-2.5 text-slate-700">
                            {item.roomName}
                          </td>
                          <td className="p-2.5">
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                              {item.format}
                            </span>
                          </td>
                          <td className="p-2.5 font-semibold text-emerald-600">
                            {formatCurrency(item.price)}
                          </td>
                          <td className="p-2.5">
                            {item.hasConflict ? (
                              <span className="text-red-600 font-medium flex items-center gap-1 text-[11px]">
                                <span className="material-symbols-outlined text-[15px]">error</span>
                                {item.conflictReason}
                              </span>
                            ) : (
                              <span className="text-emerald-600 font-medium flex items-center gap-1 text-[11px]">
                                <span className="material-symbols-outlined text-[15px]">check_circle</span>
                                Sẵn sàng tạo
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Commit Button */}
                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    disabled={submittingBatch || previewList.filter(p => p.selected && !p.hasConflict).length === 0}
                    onClick={handleCommitBatch}
                    className="px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
                  >
                    {submittingBatch ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Đang lưu...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[18px]">save</span>
                        XÁC NHẬN LƯU TẤT CẢ ({previewList.filter(p => p.selected && !p.hasConflict).length} SUẤT HỢP LỆ)
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminShowtimePage;
