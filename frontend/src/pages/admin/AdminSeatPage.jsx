// [AI UPDATE - Chuyen doi AdminSeatPage sang phong cach Modern Enterprise Office Portal]
import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { seatApi } from "@/api/seatApi";
import { roomApi } from "@/api/roomApi";

const SEAT_TYPES = ["STANDARD", "VIP", "COUPLE"];
const TYPE_STYLE = {
  STANDARD: { bg: "bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200", label: "STD", color: "text-slate-800" },
  VIP:      { bg: "bg-amber-50 border-amber-300 text-amber-900 hover:bg-amber-100", label: "VIP", color: "text-amber-700" },
  COUPLE:   { bg: "bg-pink-50 border-pink-300 text-pink-900 hover:bg-pink-100",   label: "CPL", color: "text-pink-700" },
  INACTIVE: { bg: "bg-slate-50 border border-dashed border-slate-300 text-slate-300", label: "✕", color: "text-slate-400" },
};

const generateGrid = (rowCount, colCount) => {
  const rows = [];
  for (let r = 0; r < rowCount; r++) {
    const rowLabel = String.fromCharCode(65 + r);
    for (let c = 1; c <= colCount; c++) {
      rows.push({ key: `${rowLabel}${c}`, seatRow: rowLabel, seatColumn: c, type: "STANDARD", active: true, id: null });
    }
  }
  return rows;
};

const AdminSeatPage = () => {
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get('roomId');
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const [genRows, setGenRows] = useState(8);
  const [genCols, setGenCols] = useState(12);

  useEffect(() => {
    if (roomId) fetchData();
  }, [roomId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [roomRes, seatRes] = await Promise.all([
        roomApi.getAllRooms(),
        seatApi.getSeatsByRoom(roomId),
      ]);
      const foundRoom = roomRes.data.find((r) => String(r.id) === String(roomId));
      setRoom(foundRoom || null);

      const mapped = seatRes.data.map((s) => ({
        key: `${s.seatRow}${s.seatColumn}`,
        seatRow: s.seatRow,
        seatColumn: s.seatColumn,
        type: s.type === "NORMAL" ? "STANDARD" : (s.type || "STANDARD"),
        active: s.isActive !== undefined ? s.isActive : true,
        id: s.id,
      }));
      setSeats(mapped);
      setIsDirty(false);
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu ghế", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCycleType = (key) => {
    setSeats((prev) =>
      prev.map((s) => {
        if (s.key !== key) return s;
        if (!s.active) return { ...s, active: true, type: "STANDARD" };
        if (s.type === "STANDARD") return { ...s, type: "VIP" };
        if (s.type === "VIP") return { ...s, type: "COUPLE" };
        return { ...s, active: false };
      })
    );
    setIsDirty(true);
  };

  const handleGenerateGrid = () => {
    if (seats.length > 0 && !window.confirm("Ma trận hiện tại sẽ bị ghi đè. Bạn có chắc muốn tạo lại?")) {
      return;
    }
    const newGrid = generateGrid(Number(genRows), Number(genCols));
    setSeats(newGrid);
    setIsDirty(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const payload = seats
        .filter((s) => s.active)
        .map((s) => ({
          room: { id: Number(roomId) },
          seatRow: s.seatRow,
          seatColumn: s.seatColumn,
          type: s.type,
          priceMultiplier: s.type === "VIP" ? 1.2 : s.type === "COUPLE" ? 2.0 : 1.0,
          isActive: true,
        }));

      await seatApi.createSeat(payload);
      alert("Đã lưu sơ đồ ghế thành công!");
      setIsDirty(false);
      fetchData();
    } catch (err) {
      console.error(err);
      const backendError = err.response?.data?.message || err.message;
      alert(`Lỗi khi lưu: ${backendError}`);
    } finally {
      setSaving(false);
    }
  };

  const activeSeatsCount = seats.filter((s) => s.active).length;
  const vipSeatsCount = seats.filter((s) => s.active && s.type === "VIP").length;
  const coupleSeatsCount = seats.filter((s) => s.active && s.type === "COUPLE").length;

  const groupedByRow = seats.reduce((acc, seat) => {
    if (!acc[seat.seatRow]) acc[seat.seatRow] = [];
    acc[seat.seatRow].push(seat);
    return acc;
  }, {});

  return (
    <div className="flex flex-col w-full relative min-h-full pb-16 bg-slate-50">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-8 py-6 bg-white border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/rooms')}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-600">grid_on</span>
              Sơ Đồ Ghế: {room ? room.name : `Phòng #${roomId}`}
            </h1>
            <p className="text-slate-500 text-xs mt-0.5">
              Cấu hình ma trận ghế ngồi, phân loại Standard, VIP, Couple cho phòng chiếu.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isDirty && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
              Có thay đổi chưa lưu
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving || !isDirty}
            className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-xs shadow-sm transition-colors cursor-pointer"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Đang lưu...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">save</span>
                LƯU SƠ ĐỒ GHẾ
              </>
            )}
          </button>
        </div>
      </div>

      <div className="p-8 space-y-6 max-w-6xl mx-auto">
        {/* Controls Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Quick Generator */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-slate-900 mb-0.5">Sinh ma trận tự động</p>
              <p className="text-[11px] text-slate-500">Nhập số hàng và cột để tạo nhanh</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="20"
                value={genRows}
                onChange={(e) => setGenRows(e.target.value)}
                className="w-14 bg-slate-50 text-slate-900 text-xs font-bold px-2 py-1.5 rounded-lg border border-slate-300 text-center"
                title="Số hàng"
              />
              <span className="text-slate-400 text-xs">×</span>
              <input
                type="number"
                min="1"
                max="30"
                value={genCols}
                onChange={(e) => setGenCols(e.target.value)}
                className="w-14 bg-slate-50 text-slate-900 text-xs font-bold px-2 py-1.5 rounded-lg border border-slate-300 text-center"
                title="Số cột"
              />
              <button
                onClick={handleGenerateGrid}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer border border-slate-300"
              >
                Tạo lưới
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-around text-center">
            <div>
              <p className="text-[11px] text-slate-500 font-semibold uppercase">Tổng ghế</p>
              <p className="text-base font-bold text-slate-900">{activeSeatsCount}</p>
            </div>
            <div className="h-8 w-px bg-slate-200"></div>
            <div>
              <p className="text-[11px] text-amber-700 font-semibold uppercase">Ghế VIP</p>
              <p className="text-base font-bold text-amber-600">{vipSeatsCount}</p>
            </div>
            <div className="h-8 w-px bg-slate-200"></div>
            <div>
              <p className="text-[11px] text-pink-700 font-semibold uppercase">Ghế Couple</p>
              <p className="text-base font-bold text-pink-600">{coupleSeatsCount}</p>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-4 bg-white px-4 py-3 rounded-xl border border-slate-200 shadow-sm text-xs">
          <span className="font-semibold text-slate-600">Chú thích (Click vào ghế để đổi loại):</span>
          <div className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded bg-slate-100 border border-slate-300 inline-block"></span>
            <span className="text-slate-700">Thường (100%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded bg-amber-50 border border-amber-300 inline-block"></span>
            <span className="text-amber-800 font-medium">VIP (120%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded bg-pink-50 border border-pink-300 inline-block"></span>
            <span className="text-pink-800 font-medium">Couple (200%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded bg-slate-50 border border-dashed border-slate-300 inline-block"></span>
            <span className="text-slate-400">Lối đi / Ẩn</span>
          </div>
        </div>

        {/* Seat Matrix Visual Board */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center">
          {/* Cinema Screen simulation */}
          <div className="w-full max-w-xl mb-10 text-center">
            <div className="h-2 w-full bg-slate-300 rounded-full shadow-sm"></div>
            <p className="text-[11px] font-bold tracking-widest text-slate-400 uppercase mt-2">MÀN HÌNH CHIẾU</p>
          </div>

          {/* Grid Layout */}
          {loading ? (
            <div className="py-12 text-center text-slate-400 text-xs">Đang tải ma trận ghế...</div>
          ) : Object.keys(groupedByRow).length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              Chưa có ghế nào. Hãy nhấn "Tạo lưới" ở phía trên để sinh ma trận ghế.
            </div>
          ) : (
            <div className="space-y-2 overflow-x-auto max-w-full pb-4">
              {Object.entries(groupedByRow).map(([rowLabel, rowSeats]) => (
                <div key={rowLabel} className="flex items-center gap-2 justify-center">
                  <span className="w-6 font-mono font-bold text-slate-500 text-xs text-center">{rowLabel}</span>
                  <div className="flex gap-1.5">
                    {rowSeats.map((seat) => {
                      const style = seat.active ? TYPE_STYLE[seat.type] || TYPE_STYLE.STANDARD : TYPE_STYLE.INACTIVE;
                      return (
                        <button
                          key={seat.key}
                          onClick={() => handleCycleType(seat.key)}
                          className={`w-8 h-8 rounded-lg border text-[11px] font-mono font-bold transition-all cursor-pointer flex items-center justify-center ${style.bg} ${style.color}`}
                          title={`${seat.seatRow}${seat.seatColumn} (${seat.active ? seat.type : 'Ẩn'})`}
                        >
                          {seat.active ? seat.seatColumn : '✕'}
                        </button>
                      );
                    })}
                  </div>
                  <span className="w-6 font-mono font-bold text-slate-500 text-xs text-center">{rowLabel}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSeatPage;
