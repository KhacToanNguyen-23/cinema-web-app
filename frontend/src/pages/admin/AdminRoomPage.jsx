import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { cinemaApi } from "../../api/cinemaApi";
import { roomApi } from "../../api/roomApi";
import { useAuth } from "../../context/AuthContext";

const ROOM_TYPES = [
  { value: "STANDARD", label: "STANDARD 2D/3D", color: "from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30", icon: "movie" },
  { value: "IMAX", label: "IMAX LASER", color: "from-amber-500/20 to-yellow-500/20 text-amber-300 border-amber-500/30", icon: "diamond" },
  { value: "4DX", label: "4DX MOTION", color: "from-purple-500/20 to-indigo-500/20 text-purple-300 border-purple-500/30", icon: "videocam" },
  { value: "SWEETBOX", label: "SWEETBOX COUPLE", color: "from-pink-500/20 to-rose-500/20 text-pink-300 border-pink-500/30", icon: "favorite" },
];

const EMPTY_FORM = {
  id: null,
  name: "",
  roomType: "STANDARD",
  cinema: null,
};

const AdminRoomPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isManager = user?.role === "MANAGER";

  const [cinemas, setCinemas] = useState([]);
  const [selectedCinemaId, setSelectedCinemaId] = useState("");
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);

  useEffect(() => {
    if (isManager) {
      if (user?.cinemaId) {
        setSelectedCinemaId(String(user.cinemaId));
      } else {
        alert("Tài khoản Manager chưa được gắn với rạp nào! Vui lòng liên hệ Admin.");
      }
    }

    cinemaApi.getAllCinemas().then((res) => {
      const active = res.data.filter((c) => c.isActive || c.active);
      setCinemas(active);
      if (!isManager && active.length > 0) {
        setSelectedCinemaId(String(active[0].id));
      }
    });
  }, [user, isManager]);

  useEffect(() => {
    if (selectedCinemaId) fetchRooms(selectedCinemaId);
  }, [selectedCinemaId]);

  const fetchRooms = async (cinemaId) => {
    try {
      setLoading(true);
      const res = await roomApi.getRoomsByCinema(cinemaId);
      setRooms(res.data);
    } catch (err) {
      console.error(err);
      alert("Không thể tải danh sách phòng chiếu!");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (room = null) => {
    if (room) {
      setFormData({
        id: room.id,
        name: room.name || "",
        roomType: room.roomType || "STANDARD",
        cinema: room.cinema,
      });
    } else {
      const selectedCinema = cinemas.find((c) => String(c.id) === selectedCinemaId);
      setFormData({
        ...EMPTY_FORM,
        cinema: selectedCinema ? { id: selectedCinema.id } : null,
      });
    }
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        roomType: formData.roomType,
        cinema: formData.cinema ? { id: formData.cinema.id } : { id: Number(selectedCinemaId) },
      };
      if (formData.id) {
        await roomApi.updateRoom(formData.id, payload);
        alert("Cập nhật phòng thành công!");
      } else {
        await roomApi.createRoom(payload);
        alert("Thêm phòng thành công!");
      }
      setIsModalOpen(false);
      fetchRooms(selectedCinemaId);
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      alert("Lỗi: " + msg);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn ẨN phòng chiếu này không?")) return;
    try {
      await roomApi.deleteRoom(id);
      fetchRooms(selectedCinemaId);
    } catch (err) {
      alert("Có lỗi xảy ra khi ẩn phòng!");
    }
  };

  const activeRooms = rooms.filter((r) => r.isActive || r.active).length;
  const totalCapacity = rooms.reduce((sum, r) => sum + (r.capacity || 0), 0);
  const selectedCinemaName = cinemas.find((c) => String(c.id) === selectedCinemaId)?.name || "Cụm Rạp";

  const getRoomTypeConfig = (type) => {
    return ROOM_TYPES.find((t) => t.value === type) || ROOM_TYPES[0];
  };

  return (
    <div className="flex flex-col w-full relative min-h-full px-6 py-6 pb-32">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-surface-container-highest">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-primary/20 text-primary border border-primary/30">
              {isManager ? "Cinema Manager" : "Super Admin"}
            </span>
            <span className="text-on-surface-variant text-sm font-medium">Hệ thống quản lý phòng</span>
          </div>
          <h1 className="text-3xl font-extrabold text-on-surface tracking-tight">
            Quản Lý Phòng Chiếu
          </h1>
          <p className="text-on-surface-variant text-sm mt-1">
            Thiết lập cấu trúc phòng chiếu và quản lý sơ đồ ghế cho rạp <span className="text-on-surface font-semibold">{selectedCinemaName}</span>.
          </p>
        </div>

        <button
          className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-on-primary hover:bg-primary-fixed transition-all duration-200 font-bold shadow-lg shadow-primary/25 active:scale-95 shrink-0"
          onClick={() => handleOpenModal()}
          disabled={!selectedCinemaId}
        >
          <span className="material-symbols-outlined text-[22px]">add_circle</span>
          THÊM PHÒNG MỚI
        </button>
      </div>

      {/* Rạp Selector & Quick Stats Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 my-6">
        {/* Cinema Dropdown / Display */}
        <div className="lg:col-span-2 bg-surface-container/70 backdrop-blur-md rounded-2xl p-4 border border-surface-container-highest flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-2xl">theater_comedy</span>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">Cụm Rạp Hiện Tại</p>
              {isManager ? (
                <p className="text-lg font-bold text-on-surface">{selectedCinemaName}</p>
              ) : (
                <select
                  value={selectedCinemaId}
                  onChange={(e) => setSelectedCinemaId(e.target.value)}
                  className="bg-transparent text-on-surface font-bold text-lg focus:outline-none cursor-pointer pr-4"
                >
                  {cinemas.map((c) => (
                    <option key={c.id} value={c.id} className="bg-surface-container text-on-surface">{c.name}</option>
                  ))}
                </select>
              )}
            </div>
          </div>
        </div>

        {/* Stat: Total Rooms */}
        <div className="bg-surface-container/70 backdrop-blur-md rounded-2xl p-4 border border-surface-container-highest flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <span className="material-symbols-outlined text-2xl">meeting_room</span>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">Tổng Số Phòng</p>
            <p className="text-2xl font-black text-on-surface">{rooms.length} <span className="text-sm font-normal text-on-surface-variant">({activeRooms} Active)</span></p>
          </div>
        </div>

        {/* Stat: Total Capacity */}
        <div className="bg-surface-container/70 backdrop-blur-md rounded-2xl p-4 border border-surface-container-highest flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <span className="material-symbols-outlined text-2xl">chair</span>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">Tổng Sức Chứa</p>
            <p className="text-2xl font-black text-on-surface">{totalCapacity} <span className="text-sm font-normal text-on-surface-variant">Ghế ngồi</span></p>
          </div>
        </div>
      </div>

      {/* Room Grid Cards List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 text-on-surface-variant">
          <span className="material-symbols-outlined text-5xl animate-spin text-primary mb-3">progress_activity</span>
          <p className="text-base font-medium">Đang tải danh sách phòng chiếu...</p>
        </div>
      ) : rooms.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-surface-container/40 rounded-3xl border border-dashed border-surface-container-highest text-center px-6">
          <div className="w-20 h-20 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant mb-4">
            <span className="material-symbols-outlined text-4xl">meeting_room</span>
          </div>
          <h3 className="text-xl font-bold text-on-surface mb-1">Chưa có phòng chiếu nào</h3>
          <p className="text-on-surface-variant text-sm max-w-md mb-6">
            Rạp này chưa được cấu hình phòng chiếu. Hãy bấm nút bên dưới để tạo phòng chiếu đầu tiên.
          </p>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-on-primary hover:bg-primary-fixed font-bold shadow-md shadow-primary/20"
          >
            <span className="material-symbols-outlined text-xl">add</span>
            Tạo Phòng Chiếu Mới
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => {
            const typeConfig = getRoomTypeConfig(room.roomType);
            const isActive = room.isActive ?? room.active;

            return (
              <div
                key={room.id}
                className={`group relative bg-gradient-to-b from-surface-container to-surface-container/70 hover:from-surface-container-high hover:to-surface-container rounded-3xl p-6 border border-surface-container-highest/80 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between ${
                  !isActive ? "opacity-60 grayscale" : ""
                }`}
              >
                {/* Card Top: Icon, Name & Type Badge */}
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-surface-container-highest border border-surface-bright flex items-center justify-center text-primary shadow-inner">
                      <span className="material-symbols-outlined text-3xl">chair_alt</span>
                    </div>

                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide bg-gradient-to-r border shadow-sm ${typeConfig.color}`}>
                      <span className="material-symbols-outlined text-[16px]">{typeConfig.icon}</span>
                      {typeConfig.label}
                    </span>
                  </div>

                  {/* Room Title */}
                  <h3 className="text-2xl font-black text-on-surface tracking-tight group-hover:text-primary transition-colors">
                    {room.name || `Phòng #${room.id}`}
                  </h3>
                  <p className="text-on-surface-variant text-sm font-medium mt-0.5">{selectedCinemaName}</p>

                  {/* Room Capacity & Specs */}
                  <div className="mt-5 p-4 rounded-2xl bg-background/60 border border-surface-container-highest/60 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary text-2xl">event_seat</span>
                      <div>
                        <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Sức chứa</p>
                        <p className="text-lg font-black text-on-surface">
                          {room.capacity || 0} <span className="text-xs font-normal text-on-surface-variant">ghế ngồi</span>
                        </p>
                      </div>
                    </div>

                    {isActive ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-bold border border-green-500/20">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        HOẠT ĐỘNG
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 text-xs font-bold border border-red-500/20">
                        ĐÃ ẨN
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="mt-6 pt-4 border-t border-surface-container-highest/60 flex items-center justify-between gap-2">
                  <button
                    onClick={() => navigate(`/admin/rooms/${room.id}/seats`)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-primary text-on-primary hover:bg-primary-fixed font-bold text-sm shadow-md shadow-primary/20 active:scale-95 transition-all duration-150"
                  >
                    <span className="material-symbols-outlined text-[18px]">grid_view</span>
                    SƠ ĐỒ GHẾ
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenModal(room)}
                      className="p-2.5 rounded-xl bg-surface-container-highest hover:bg-surface-bright text-on-surface hover:text-primary transition-colors"
                      title="Chỉnh sửa phòng"
                    >
                      <span className="material-symbols-outlined text-[20px]">edit</span>
                    </button>

                    {isActive && (
                      <button
                        onClick={() => handleDelete(room.id)}
                        className="p-2.5 rounded-xl bg-red-900/20 hover:bg-red-900/40 text-red-400 transition-colors"
                        title="Ẩn phòng"
                      >
                        <span className="material-symbols-outlined text-[20px]">visibility_off</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Thêm / Sửa Phòng */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-xl animate-fade-in"
            onClick={() => setIsModalOpen(false)}
          />
          <form
            onSubmit={handleSubmit}
            className="relative bg-surface rounded-3xl shadow-2xl w-full max-w-[34rem] flex flex-col border border-surface-container-highest overflow-hidden animate-scale-up"
          >
            {/* Modal Header */}
            <div className="p-6 bg-surface-container relative flex items-center justify-between border-b border-surface-container-highest">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-2xl">meeting_room</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-on-surface">
                    {formData.id ? "Chỉnh Sửa Phòng Chiếu" : "Tạo Phòng Chiếu Mới"}
                  </h2>
                  <p className="text-xs text-on-surface-variant">{selectedCinemaName}</p>
                </div>
              </div>

              <button
                type="button"
                className="w-9 h-9 rounded-full hover:bg-surface transition-colors flex items-center justify-center text-on-surface-variant hover:text-on-surface"
                onClick={() => setIsModalOpen(false)}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                  Tên phòng chiếu *
                </label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#161616] rounded-xl py-3 px-4 text-on-surface font-semibold border border-surface-container-highest focus:border-primary focus:outline-none transition-all placeholder:text-on-surface-variant/40"
                  placeholder="VD: Phòng Chiếu 01, Phòng IMAX VIP"
                  type="text"
                  autoFocus
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                  Loại định dạng phòng *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {ROOM_TYPES.map((t) => {
                    const isSelected = formData.roomType === t.value;
                    return (
                      <button
                        key={t.value}
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, roomType: t.value }))}
                        className={`flex items-center gap-2 p-3 rounded-2xl border text-left transition-all ${
                          isSelected
                            ? "bg-primary/15 border-primary text-primary font-bold shadow-sm"
                            : "bg-[#161616] border-surface-container-highest text-on-surface-variant hover:border-surface-bright"
                        }`}
                      >
                        <span className="material-symbols-outlined text-lg">{t.icon}</span>
                        <span className="text-xs uppercase font-extrabold">{t.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-surface-container-lowest border-t border-surface-container-highest flex justify-end gap-3">
              <button
                type="button"
                className="px-5 py-2.5 rounded-xl text-on-surface hover:bg-surface-container font-bold text-sm transition-colors"
                onClick={() => setIsModalOpen(false)}
              >
                HỦY
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-primary text-on-primary hover:bg-primary-fixed font-bold text-sm shadow-md shadow-primary/20 transition-all active:scale-95"
              >
                LƯU PHÒNG
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminRoomPage;
