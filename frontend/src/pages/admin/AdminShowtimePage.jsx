import React, { useState, useEffect } from 'react';
import { movieApi } from '../../api/movieApi';
import { roomApi } from '../../api/roomApi';
import { showtimeApi } from '../../api/showtimeApi';
import { useAuth } from '../../context/AuthContext';

const AdminShowtimePage = () => {
  const { user } = useAuth();
  const [showtimes, setShowtimes] = useState([]);
  const [movies, setMovies] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    id: null,
    movieId: '',
    roomId: '',
    startTime: '',
    endTime: '',
    price: 80000
  });

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;
    try {
      setLoading(true);
      
      // [AI UPDATE - Kiểm tra role MANAGER và lấy cinemaId để lọc danh sách hiển thị]
      const isManager = user.role === 'MANAGER';
      const cinemaId = isManager ? user.cinemaId : null;

      // Xử lý trường hợp Manager chưa được gắn rạp
      if (isManager && !cinemaId) {
        alert("Tài khoản Manager của bạn chưa được gắn với rạp nào! Vui lòng liên hệ Admin để cấu hình.");
        setMovies([]);
        setRooms([]);
        setLoading(false);
        return;
      }

      const [showtimesRes, moviesRes, roomsRes] = await Promise.all([
        showtimeApi.getAllShowtimes(cinemaId),
        movieApi.getAllMovies(),
        isManager ? roomApi.getRoomsByCinema(cinemaId) : roomApi.getAllRooms()
      ]);
      setShowtimes(showtimesRes.data);
      setMovies(moviesRes.data.filter(m => m.active || m.isActive));
      setRooms(roomsRes.data);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu", error);
      alert("Không thể tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (showtime = null) => {
    if (showtime) {
      setFormData({
        id: showtime.id,
        movieId: showtime.movie?.id || '',
        roomId: showtime.room?.id || '',
        startTime: showtime.startTime ? showtime.startTime.substring(0, 16) : '',
        endTime: showtime.endTime ? showtime.endTime.substring(0, 16) : '',
        price: showtime.price || 80000
      });
    } else {
      setFormData({
        id: null,
        movieId: movies.length > 0 ? movies[0].id : '',
        roomId: rooms.length > 0 ? rooms[0].id : '',
        startTime: '',
        endTime: '',
        price: 80000
      });
    }
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        startTime: formData.startTime + ':00', // Append seconds
        endTime: formData.endTime + ':00'
      };

      if (formData.id) {
        await showtimeApi.updateShowtime(formData.id, payload);
        alert('Cập nhật lịch chiếu thành công!');
      } else {
        await showtimeApi.createShowtime(payload);
        alert('Thêm lịch chiếu thành công!');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error(error);
      const backendError = error.response?.data?.message || error.message;
      alert(`Lỗi Backend: ${backendError}`);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn XÓA lịch chiếu này?')) {
      try {
        await showtimeApi.deleteShowtime(id);
        fetchData();
      } catch (error) {
        console.error(error);
        alert('Có lỗi xảy ra khi xóa!');
      }
    }
  };

  return (
    <div className="flex flex-col w-full relative min-h-full">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-xl px-xl py-xl pb-md">
        <div className="flex flex-col gap-sm">
          <h1 className="font-display-lg text-display-lg text-on-surface">Quản Lý Lịch Chiếu</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-[42rem]">
            Sắp xếp lịch chiếu, chọn phòng và cấu hình giá vé.
          </p>
        </div>
        <div className="flex shrink-0 gap-md">
          <button
            className="flex items-center gap-sm px-lg py-md rounded-xl bg-primary text-on-primary hover:bg-primary-fixed transition-colors font-button text-button shadow-md shadow-primary/20"
            onClick={() => handleOpenModal()}
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            THÊM LỊCH MỚI
          </button>
        </div>
      </div>

      {/* Main Content List */}
      <div className="px-xl py-lg flex flex-col gap-gutter pb-32">
        {loading ? (
           <div className="text-center text-on-surface-variant py-10">Đang tải dữ liệu...</div>
        ) : (
          <div className="flex flex-col gap-md">
            {showtimes.map(st => (
               <div key={st.id} className="group bg-surface-container hover:bg-surface-container-high rounded-2xl p-md shadow-sm transition-all duration-300 flex flex-col md:flex-row gap-md items-center">
                 <div className="flex items-center gap-lg w-full md:w-1/2">
                    <div className="flex flex-col min-w-0">
                       <h3 className="font-headline-md text-headline-md text-on-surface truncate">{st.movie?.title || 'Phim đã bị xóa'}</h3>
                       <p className="font-body-md text-body-md text-on-surface-variant">Phòng: {st.room?.name || 'N/A'}</p>
                       <div className="flex flex-col gap-xs mt-xs text-on-surface-variant text-sm">
                          <span>Bắt đầu: {new Date(st.startTime).toLocaleString('vi-VN')}</span>
                          <span>Kết thúc: {new Date(st.endTime).toLocaleString('vi-VN')}</span>
                       </div>
                    </div>
                 </div>
                 <div className="w-full md:w-1/4 flex flex-col justify-center">
                    <span className="font-display-sm text-primary">{st.price?.toLocaleString()} VNĐ</span>
                 </div>
                 <div className="w-full md:w-1/4 flex justify-end gap-sm">
                    <button onClick={() => handleOpenModal(st)} className="px-4 py-2 rounded-xl bg-surface-container-highest hover:bg-surface-bright text-on-surface transition-colors flex items-center gap-2">
                       <span className="material-symbols-outlined text-[18px]">edit</span> Sửa
                    </button>
                    <button onClick={() => handleDelete(st.id)} className="px-4 py-2 rounded-xl bg-red-900/40 hover:bg-red-900/60 text-red-200 transition-colors flex items-center gap-2">
                       <span className="material-symbols-outlined text-[18px]">delete</span> Xóa
                    </button>
                 </div>
               </div>
            ))}
            {showtimes.length === 0 && (
              <div className="text-center text-on-surface-variant py-10">Chưa có lịch chiếu nào.</div>
            )}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-md">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-xl" onClick={() => setIsModalOpen(false)}></div>
          
          <form onSubmit={handleSubmit} className="relative bg-surface rounded-2xl shadow-2xl w-full max-w-[48rem] max-h-[90vh] overflow-y-auto flex flex-col border border-surface-container-highest">
            <div className="h-24 bg-surface-container relative flex items-center px-xl border-b border-surface-container-highest">
              <h2 className="font-display-sm text-display-sm text-on-surface">{formData.id ? 'Sửa Lịch Chiếu' : 'Thêm Lịch Chiếu Mới'}</h2>
              <button 
                type="button"
                className="absolute top-1/2 right-md -translate-y-1/2 w-10 h-10 rounded-full hover:bg-surface transition-colors flex items-center justify-center text-on-surface"
                onClick={() => setIsModalOpen(false)}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="p-xl flex flex-col gap-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                <div className="flex flex-col gap-xs">
                  <label className="font-label-caps text-label-caps text-on-surface-variant">Chọn Phim *</label>
                  <select name="movieId" value={formData.movieId} onChange={handleChange} required className="w-full bg-[#1A1A1A] rounded-xl py-md px-md text-on-surface font-body-md border border-surface-container-highest focus:border-primary focus:outline-none transition-colors">
                    <option value="">-- Chọn phim --</option>
                    {movies.map(m => (
                      <option key={m.id} value={m.id}>{m.title}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-xs">
                  <label className="font-label-caps text-label-caps text-on-surface-variant">Chọn Phòng Chiếu *</label>
                  <select name="roomId" value={formData.roomId} onChange={handleChange} required className="w-full bg-[#1A1A1A] rounded-xl py-md px-md text-on-surface font-body-md border border-surface-container-highest focus:border-primary focus:outline-none transition-colors">
                    <option value="">-- Chọn phòng --</option>
                    {rooms.map(r => (
                      <option key={r.id} value={r.id}>{r.name} - {r.cinema?.name || ''}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                 <div className="flex flex-col gap-xs">
                   <label className="font-label-caps text-label-caps text-on-surface-variant">Bắt đầu (Start Time) *</label>
                   <input name="startTime" value={formData.startTime} onChange={handleChange} required className="w-full bg-[#1A1A1A] rounded-xl py-md px-md text-on-surface font-body-md border border-surface-container-highest focus:border-primary focus:outline-none transition-colors" type="datetime-local" />
                 </div>
                 <div className="flex flex-col gap-xs">
                   <label className="font-label-caps text-label-caps text-on-surface-variant">Kết thúc (End Time) *</label>
                   <input name="endTime" value={formData.endTime} onChange={handleChange} required className="w-full bg-[#1A1A1A] rounded-xl py-md px-md text-on-surface font-body-md border border-surface-container-highest focus:border-primary focus:outline-none transition-colors" type="datetime-local" />
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                <div className="flex flex-col gap-xs">
                  <label className="font-label-caps text-label-caps text-on-surface-variant">Giá vé cơ bản (VNĐ) *</label>
                  <input name="price" value={formData.price} onChange={handleChange} required className="w-full bg-[#1A1A1A] rounded-xl py-md px-md text-on-surface font-body-md border border-surface-container-highest focus:border-primary focus:outline-none transition-colors" type="number" min="0" step="1000" />
                </div>
              </div>
            </div>
            
            <div className="p-xl bg-surface-container-lowest border-t border-surface-container-highest flex justify-end gap-md">
              <button 
                type="button"
                className="px-lg py-md rounded-xl text-on-surface hover:bg-surface-container transition-colors font-button text-button"
                onClick={() => setIsModalOpen(false)}
              >
                HỦY
              </button>
              <button type="submit" className="px-xl py-md rounded-xl bg-primary text-on-primary hover:bg-primary-fixed transition-colors font-button text-button shadow-md shadow-primary/20">
                LƯU LỊCH CHIẾU
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminShowtimePage;
