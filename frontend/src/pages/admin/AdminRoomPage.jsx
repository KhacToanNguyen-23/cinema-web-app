// [AI UPDATE - Chuyen doi AdminRoomPage sang phong cach Modern Enterprise Office Portal & chuan hoa 3 loai phong RoomType]
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { cinemaApi } from "@/api/cinemaApi";
import { roomApi } from "@/api/roomApi";
import { useAuth } from "@/context/AuthContext";

const ROOM_TYPES = [
  { value: "STANDARD", label: "Tiêu Chuẩn (2D/3D)", badgeColor: "bg-blue-50 text-blue-700 border-blue-200", icon: "movie" },
  { value: "IMAX", label: "IMAX Laser", badgeColor: "bg-amber-50 text-amber-700 border-amber-200", icon: "diamond" },
  { value: "GOLD_CLASS", label: "Gold Class VIP", badgeColor: "bg-purple-50 text-purple-700 border-purple-200", icon: "chair" },
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
      console.error("Lỗi khi tải danh sách phòng", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (room = null) => {
    if (room) {
      setFormData({
        id: room.id,
        name: room.name,
        roomType: room.roomType || "STANDARD",
        cinema: room.cinema || { id: Number(selectedCinemaId) },
      });
    } else {
      setFormData({
        ...EMPTY_FORM,
        cinema: { id: Number(selectedCinemaId) },
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
        cinema: { id: Number(selectedCinemaId) },
        isActive: true,
      };

      if (formData.id) {
        await roomApi.updateRoom(formData.id, payload);
        alert("Cập nhật phòng thành công!");
      } else {
        await roomApi.createRoom(payload);
        alert("Tạo phòng chiếu mới thành công!");
      }
      setIsModalOpen(false);
      fetchRooms(selectedCinemaId);
    } catch (err) {
      console.error(err);
      const backendError = err.response?.data?.message || err.message;
      alert(`Lỗi: ${backendError}`);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn ẨN phòng chiếu này?")) {
      try {
        await roomApi.deleteRoom(id);
        fetchRooms(selectedCinemaId);
      } catch (err) {
        console.error(err);
        alert("Lỗi khi xóa phòng chiếu!");
      }
    }
  };

  const selectedCinemaObj = cinemas.find((c) => String(c.id) === String(selectedCinemaId));

  return (
    <div className="flex flex-col w-full relative min-h-full pb-16 bg-slate-50">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-8 py-6 bg-white border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-600">meeting_room</span>
            Quản Lý Phòng Chiếu
          </h1>
          <p className="text-slate-500 text-xs mt-0.5">
            Cấu hình danh sách phòng chiếu, loại công nghệ và sơ đồ ma trận ghế.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Cinema Filter (Chỉ cho Admin) */}
          {!isManager && (
            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
              <span className="material-symbols-outlined text-slate-400 text-sm">theater_comedy</span>
              <select
                value={selectedCinemaId}
                onChange={(e) => setSelectedCinemaId(e.target.value)}
                className="bg-transparent text-slate-800 text-xs font-semibold focus:outline-none cursor-pointer"
              >
                {cinemas.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            THÊM PHÒNG CHIẾU
          </button>
        </div>
      </div>

      <div className="p-8 space-y-6">
        {/* Banner Info */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200">
              <span className="material-symbols-outlined text-[22px]">theaters</span>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase">Cụm rạp đang xem</p>
              <h2 className="text-base font-bold text-slate-900">{selectedCinemaObj?.name || 'Đang nạp...'}</h2>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500 font-semibold">Tổng số phòng</p>
            <p className="text-lg font-bold text-blue-600">{rooms.length} phòng</p>
          </div>
        </div>

        {/* Room Grid */}
        {loading ? (
          <div className="py-16 text-center text-slate-500 text-xs">Đang tải danh sách phòng chiếu...</div>
        ) : rooms.length === 0 ? (
          <div className="bg-white border border-dashed border-slate-300 rounded-xl p-12 text-center text-slate-500 shadow-sm">
            <span className="material-symbols-outlined text-4xl mb-2 text-slate-400">meeting_room</span>
            <p className="text-sm font-semibold text-slate-700">Chưa có phòng chiếu nào tại cụm rạp này.</p>
            <p className="text-xs mt-1 text-slate-500">Hãy nhấn "Thêm Phòng Chiếu" để khởi tạo không gian chiếu phim đầu tiên!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {rooms.map((room) => {
              const typeObj = ROOM_TYPES.find((t) => t.value === room.roomType) || ROOM_TYPES[0];
              return (
                <div
                  key={room.id}
                  className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <h3 className="font-bold text-slate-900 text-base">{room.name}</h3>
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${typeObj.badgeColor}`}>
                        {typeObj.label}
                      </span>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80 space-y-1.5 text-xs mb-4">
                      <div className="flex justify-between text-slate-600">
                        <span>Sức chứa thực tế:</span>
                        <span className="text-slate-900 font-bold">{room.capacity || 0} ghế ngồi</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Trạng thái phòng:</span>
                        <span className="text-emerald-600 font-semibold">Đang hoạt động</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <button
                      onClick={() => navigate(`/admin/seats?roomId=${room.id}`)}
                      className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-blue-200"
                    >
                      <span className="material-symbols-outlined text-[16px]">chair</span>
                      Cấu hình sơ đồ ghế
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenModal(room)}
                        className="p-1.5 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 cursor-pointer"
                        title="Sửa phòng"
                      >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(room.id)}
                        className="p-1.5 rounded-md text-red-500 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                        title="Ẩn phòng"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal Thêm/Sửa Phòng */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          {/* [AI UPDATE - Fix modal bi co hep que tam bang class max-w-[500px] w-full] */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-[500px] w-full p-6 space-y-5 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">
                {formData.id ? "Cập Nhật Phòng Chiếu" : "Thêm Phòng Chiếu Mới"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tên phòng chiếu *</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="VD: Cinema 01, Phòng IMAX 01"
                  className="w-full bg-slate-50 text-slate-900 px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Loại công nghệ phòng chiếu *</label>
                <div className="grid grid-cols-1 gap-2">
                  {ROOM_TYPES.map((type) => (
                    <label
                      key={type.value}
                      className={`flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer transition-all ${
                        formData.roomType === type.value
                          ? "bg-blue-50 border-blue-500 text-blue-900 font-bold"
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <input
                        type="radio"
                        name="roomType"
                        value={type.value}
                        checked={formData.roomType === type.value}
                        onChange={handleChange}
                        className="accent-blue-600"
                      />
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">{type.icon}</span>
                        <span>{type.label}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm cursor-pointer"
                >
                  {formData.id ? "Lưu Thay Đổi" : "Tạo Phòng Mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRoomPage;
