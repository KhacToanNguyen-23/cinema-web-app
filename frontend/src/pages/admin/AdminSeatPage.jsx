import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { seatApi } from "../../api/seatApi";
import { roomApi } from "../../api/roomApi";

const SEAT_TYPES = ["NORMAL", "VIP", "COUPLE"];
const TYPE_STYLE = {
  NORMAL:  { bg: "bg-surface-container-highest hover:bg-surface-bright", label: "N", color: "text-on-surface" },
  VIP:     { bg: "bg-yellow-900/60 hover:bg-yellow-800/60",               label: "V", color: "text-yellow-300" },
  COUPLE:  { bg: "bg-pink-900/60 hover:bg-pink-800/60",                   label: "♥", color: "text-pink-300" },
  INACTIVE:{ bg: "bg-[#111] border border-dashed border-surface-container-highest", label: "✕", color: "text-surface-container-highest" },
};

// Tao luoi ghe trong bo nho tu rows x cols
const generateGrid = (rowCount, colCount) => {
  const rows = [];
  for (let r = 0; r < rowCount; r++) {
    const rowLabel = String.fromCharCode(65 + r); // A, B, C...
    for (let c = 1; c <= colCount; c++) {
      rows.push({ key: `${rowLabel}${c}`, seatRow: rowLabel, seatColumn: c, type: "NORMAL", active: true, id: null });
    }
  }
  return rows;
};

const AdminSeatPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [seats, setSeats] = useState([]);  // state lam viec chinh
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Generate form
  const [genRows, setGenRows] = useState(8);
  const [genCols, setGenCols] = useState(10);

  useEffect(() => {
    fetchData();
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

      // Map seats tu API ve format local
      const mapped = seatRes.data.map((s) => ({
        key: `${s.seatRow}${s.seatColumn}`,
        seatRow: s.seatRow,
        seatColumn: s.seatColumn,
        type: s.type || "NORMAL",
        active: s.isActive !== undefined ? s.isActive : true,
        id: s.id,
        priceMultiplier: s.priceMultiplier || 1.0,
      }));
      setSeats(mapped);
      setIsDirty(false);
    } catch (err) {
      console.error(err);
      alert("Không thể tải dữ liệu phòng");
    } finally {
      setLoading(false);
    }
  };

  // Click ghe: NORMAL -> VIP -> COUPLE -> INACTIVE -> NORMAL
  const handleSeatClick = (key) => {
    setSeats((prev) =>
      prev.map((s) => {
        if (s.key !== key) return s;
        if (!s.active) return { ...s, active: true, type: "NORMAL" };
        const idx = SEAT_TYPES.indexOf(s.type);
        const next = idx < SEAT_TYPES.length - 1 ? SEAT_TYPES[idx + 1] : null;
        if (next) return { ...s, type: next };
        return { ...s, active: false }; // het vong -> inactive
      })
    );
    setIsDirty(true);
  };

  // Generate luoi moi (xoa het ghe cu trong state)
  const handleGenerate = () => {
    if (seats.length > 0 && !window.confirm("Tạo lại sơ đồ ghế sẽ xoá toàn bộ ghế hiện tại trong bộ nhớ. Tiếp tục?")) return;
    setSeats(generateGrid(Number(genRows), Number(genCols)));
    setIsDirty(true);
  };

  // Luu tat ca len server
  const handleSave = async () => {
    if (!window.confirm(`Lưu ${seats.length} ghế lên server? Thao tác này sẽ tạo mới toàn bộ (ghế cũ giữ nguyên nếu đã có id).`)) return;
    try {
      setSaving(true);
      // Chi gui nhung ghe chua co id (ghe moi generate)
      const newSeats = seats
        .filter((s) => s.id === null)
        .map((s) => ({
          room: { id: Number(roomId) },
          seatRow: s.seatRow,
          seatColumn: s.seatColumn,
          type: s.type,
          isActive: s.active,
          priceMultiplier: s.type === "VIP" ? 1.5 : s.type === "COUPLE" ? 2.0 : 1.0,
        }));

      if (newSeats.length === 0) {
        alert("Không có ghế mới nào để lưu.");
        return;
      }

      await seatApi.createSeats(newSeats);
      alert(`Đã lưu ${newSeats.length} ghế thành công!`);
      fetchData(); // reload tu server
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      alert("Lỗi khi lưu: " + msg);
    } finally {
      setSaving(false);
    }
  };

  // Cap nhat type ghe da co id tren server
  const handleUpdateExisting = async (seat) => {
    if (!seat.id) return;
    try {
      await seatApi.updateSeat(seat.id, {
        room: { id: Number(roomId) },
        seatRow: seat.seatRow,
        seatColumn: seat.seatColumn,
        type: seat.type,
        isActive: seat.active,
        priceMultiplier: seat.type === "VIP" ? 1.5 : seat.type === "COUPLE" ? 2.0 : 1.0,
      });
    } catch (err) {
      alert("Lỗi cập nhật ghế: " + err.message);
    }
  };

  // Nhom ghe theo hang de render
  const groupedByRow = seats.reduce((acc, seat) => {
    if (!acc[seat.seatRow]) acc[seat.seatRow] = [];
    acc[seat.seatRow].push(seat);
    return acc;
  }, {});
  const sortedRows = Object.keys(groupedByRow).sort();

  const activeCount = seats.filter((s) => s.active).length;
  const newCount = seats.filter((s) => s.id === null).length;

  return (
    <div className="flex flex-col w-full relative min-h-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-xl px-xl py-xl pb-md">
        <div className="flex flex-col gap-sm">
          <button onClick={() => navigate("/admin/rooms")} className="flex items-center gap-xs text-on-surface-variant hover:text-on-surface transition-colors text-sm w-max">
            <span className="material-symbols-outlined text-[18px]">arrow_back</span> Quay lại Phòng chiếu
          </button>
          <h1 className="font-display-lg text-display-lg text-on-surface">
            Sơ Đồ Ghế — {room?.name || `Phòng #${roomId}`}
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            {room?.cinema?.name} • {room?.roomType} • <span className="text-primary font-medium">{activeCount} ghế active</span>
            {newCount > 0 && <span className="text-yellow-400 ml-2">({newCount} ghế mới chưa lưu)</span>}
          </p>
        </div>
        <div className="flex shrink-0 gap-md">
          {isDirty && newCount > 0 && (
            <button onClick={handleSave} disabled={saving}
              className="flex items-center gap-sm px-lg py-md rounded-xl bg-primary text-on-primary hover:bg-primary-fixed transition-colors font-button text-button shadow-md shadow-primary/20 disabled:opacity-50">
              <span className="material-symbols-outlined text-[20px]">save</span>
              {saving ? "Đang lưu..." : `LƯU ${newCount} GHẾ MỚI`}
            </button>
          )}
        </div>
      </div>

      {/* Generate Panel */}
      <div className="px-xl py-md">
        <div className="bg-surface-container rounded-2xl p-lg flex flex-col sm:flex-row items-center gap-lg shadow-sm">
          <span className="material-symbols-outlined text-primary text-[24px]">grid_on</span>
          <p className="font-label-caps text-label-caps text-on-surface-variant">GENERATE LƯỚI GHẾ MỚI</p>
          <div className="flex items-center gap-md">
            <div className="flex flex-col items-center gap-xs">
              <label className="text-[11px] text-on-surface-variant">Số hàng</label>
              <input type="number" value={genRows} min={1} max={26} onChange={(e) => setGenRows(e.target.value)}
                className="w-16 bg-[#1A1A1A] rounded-lg py-sm px-sm text-on-surface font-body-md border border-surface-container-highest focus:border-primary focus:outline-none text-center" />
            </div>
            <span className="text-on-surface-variant mt-4">×</span>
            <div className="flex flex-col items-center gap-xs">
              <label className="text-[11px] text-on-surface-variant">Số cột/hàng</label>
              <input type="number" value={genCols} min={1} max={30} onChange={(e) => setGenCols(e.target.value)}
                className="w-16 bg-[#1A1A1A] rounded-lg py-sm px-sm text-on-surface font-body-md border border-surface-container-highest focus:border-primary focus:outline-none text-center" />
            </div>
            <button onClick={handleGenerate}
              className="mt-4 px-lg py-md rounded-xl bg-secondary text-on-secondary hover:bg-secondary-fixed transition-colors font-button text-button">
              Generate
            </button>
          </div>
          <p className="text-[11px] text-on-surface-variant">= {genRows * genCols} ghế • Click ghế để đổi loại</p>
        </div>
      </div>

      {/* Legend */}
      <div className="px-xl py-sm flex items-center gap-lg flex-wrap">
        {Object.entries(TYPE_STYLE).map(([type, style]) => (
          <div key={type} className="flex items-center gap-xs">
            <div className={`w-7 h-7 rounded-md flex items-center justify-center text-[11px] font-bold ${style.bg} ${style.color}`}>{style.label}</div>
            <span className="text-on-surface-variant text-[12px]">{type}</span>
          </div>
        ))}
        <p className="text-on-surface-variant text-[12px] ml-auto italic">Click ghế để xoay vòng: NORMAL → VIP → COUPLE → Ẩn → NORMAL</p>
      </div>

      {/* Seat Map — màn hình chiếu */}
      <div className="px-xl py-lg pb-32 overflow-x-auto">
        {loading ? (
          <div className="text-center text-on-surface-variant py-10">Đang tải...</div>
        ) : seats.length === 0 ? (
          <div className="text-center text-on-surface-variant py-10">Chưa có ghế. Dùng Generate để tạo lưới ghế.</div>
        ) : (
          <div className="flex flex-col items-center gap-sm min-w-max mx-auto">
            {/* Màn chiếu */}
            <div className="w-3/4 h-3 rounded-full bg-gradient-to-r from-transparent via-primary/50 to-transparent mb-lg" />
            <p className="text-on-surface-variant text-[11px] uppercase tracking-widest mb-md">MÀN CHIẾU</p>

            {sortedRows.map((rowLabel) => (
              <div key={rowLabel} className="flex items-center gap-sm">
                <span className="w-6 text-center text-on-surface-variant text-[12px] font-bold shrink-0">{rowLabel}</span>
                <div className="flex gap-xs">
                  {groupedByRow[rowLabel]
                    .sort((a, b) => a.seatColumn - b.seatColumn)
                    .map((seat) => {
                      const typeKey = seat.active ? seat.type : "INACTIVE";
                      const style = TYPE_STYLE[typeKey];
                      const isNew = seat.id === null;
                      return (
                        <button
                          key={seat.key}
                          onClick={() => {
                            handleSeatClick(seat.key);
                            // Neu da co id tren server, tu dong update
                            if (seat.id) setTimeout(() => handleUpdateExisting(seat), 100);
                          }}
                          title={`${seat.key} — ${typeKey}`}
                          className={`w-8 h-8 rounded-md text-[11px] font-bold transition-all duration-150 relative ${style.bg} ${style.color} ${isNew ? "ring-1 ring-yellow-500/50" : ""}`}
                        >
                          {style.label}
                          <span className="absolute bottom-0 right-0 text-[8px] text-on-surface-variant leading-none pr-0.5">{seat.seatColumn}</span>
                        </button>
                      );
                    })}
                </div>
                <span className="w-6 text-center text-on-surface-variant text-[12px] font-bold shrink-0">{rowLabel}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSeatPage;
