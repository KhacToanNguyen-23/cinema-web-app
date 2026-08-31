// [AI UPDATE - Chuyen doi AdminMoviePage sang phong cach Modern Enterprise Office Portal]
import React, { useState, useEffect, useRef } from 'react';
import { movieApi } from '@/api/movieApi';

const AdminMoviePage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    id: null,
    title: '',
    description: '',
    director: '',
    trailerUrl: '',
    posterUrl: '',
    duration: 120,
    ageLimit: 'P',
    releaseDate: '',
    cast: '',
    isActive: true
  });

  const CLOUDINARY_CLOUD_NAME = "ou9km1tu";
  const CLOUDINARY_UPLOAD_PRESET = "v0x2gloe";

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const res = await movieApi.getAllMovies();
      setMovies(res.data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách phim", error);
      alert("Không thể tải danh sách phim");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (movie = null) => {
    if (movie) {
      setFormData({
        id: movie.id,
        title: movie.title || '',
        description: movie.description || '',
        director: movie.director || '',
        trailerUrl: movie.trailerUrl || '',
        posterUrl: movie.posterUrl || '',
        duration: movie.duration || 120,
        ageLimit: movie.ageLimit || 'P',
        releaseDate: movie.releaseDate ? movie.releaseDate.split('T')[0] : '',
        cast: movie.cast || movie.movieCast || '',
        isActive: movie.active !== undefined ? movie.active : (movie.isActive !== undefined ? movie.isActive : true)
      });
    } else {
      setFormData({
        id: null,
        title: '',
        description: '',
        director: '',
        trailerUrl: '',
        posterUrl: '',
        duration: 120,
        ageLimit: 'P',
        releaseDate: new Date().toISOString().split('T')[0],
        cast: '',
        isActive: true
      });
    }
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: data
      });
      const fileData = await res.json();
      if (fileData.secure_url) {
        setFormData(prev => ({ ...prev, posterUrl: fileData.secure_url }));
      } else {
        alert("Upload thất bại!");
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi kết nối tới Cloudinary!");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        movieCast: formData.cast,
        active: formData.isActive
      };

      if (formData.id) {
        await movieApi.updateMovie(formData.id, payload);
        alert('Cập nhật phim thành công!');
      } else {
        await movieApi.createMovie(payload);
        alert('Thêm phim mới thành công!');
      }
      setIsModalOpen(false);
      fetchMovies();
    } catch (error) {
      console.error(error);
      const backendError = error.response?.data?.message || error.message;
      alert(`Lỗi Backend: ${backendError}`);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn ẨN/XÓA phim này?')) {
      try {
        await movieApi.deleteMovie(id);
        fetchMovies();
      } catch (error) {
        console.error(error);
        alert('Lỗi khi xóa phim!');
      }
    }
  };

  return (
    <div className="flex flex-col w-full relative min-h-full pb-16 bg-slate-50">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-8 py-6 bg-white border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-600">movie</span>
            Quản Lý Danh Mục Phim
          </h1>
          <p className="text-slate-500 text-xs mt-0.5">
            Đăng tải phim mới, chỉnh sửa thông tin, poster và thời lượng chiếu.
          </p>
        </div>
        <button
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition-colors cursor-pointer"
          onClick={() => handleOpenModal()}
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          THÊM PHIM MỚI
        </button>
      </div>

      <div className="p-8">
        {/* Table List */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">Danh Sách Phim ({movies.length})</h2>
          </div>

          {loading ? (
            <div className="py-16 text-center text-slate-500 text-xs">Đang tải danh sách phim...</div>
          ) : movies.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">Chưa có phim nào trong cơ sở dữ liệu.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">Poster</th>
                    <th className="p-3.5">Tên Phim</th>
                    <th className="p-3.5">Thời Lượng</th>
                    <th className="p-3.5">Độ Tuổi</th>
                    <th className="p-3.5">Đạo Diễn</th>
                    <th className="p-3.5">Trạng Thái</th>
                    <th className="p-3.5 text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {movies.map((m) => (
                    <tr key={m.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="p-3.5">
                        <img
                          src={m.posterUrl || 'https://via.placeholder.com/60x90'}
                          alt={m.title}
                          className="w-12 h-16 object-cover rounded-lg border border-slate-200 shadow-xs"
                        />
                      </td>
                      <td className="p-3.5">
                        <p className="font-bold text-slate-900 text-sm">{m.title}</p>
                        <p className="text-[11px] text-slate-500 line-clamp-1 max-w-xs">{m.description || 'Không có mô tả'}</p>
                      </td>
                      <td className="p-3.5 font-mono text-slate-700">{m.duration || 0} phút</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold border border-slate-200 text-[10px]">
                          {m.ageLimit || 'P'}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-600">{m.director || 'Chưa cập nhật'}</td>
                      <td className="p-3.5">
                        {m.active || m.isActive ? (
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Hoạt động
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                            Tạm ẩn
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenModal(m)}
                            className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer transition-colors"
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => handleDelete(m.id)}
                            className="px-2.5 py-1 rounded bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold cursor-pointer transition-colors"
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal Thêm/Sửa Phim */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-xl w-full p-6 space-y-4 animate-in fade-in zoom-in duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">
                {formData.id ? 'Cập Nhật Phim' : 'Thêm Phim Mới'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-4">
                {/* Poster column */}
                <div className="flex flex-col items-center">
                  <div className="w-28 h-40 rounded-xl bg-slate-100 border border-slate-300 overflow-hidden mb-2 relative group flex items-center justify-center">
                    {formData.posterUrl ? (
                      <img src={formData.posterUrl} alt="Poster" className="w-full h-full object-cover" />
                    ) : (
                      <span className="material-symbols-outlined text-slate-400 text-3xl">image</span>
                    )}
                    {isUploading && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white">
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    disabled={isUploading}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] cursor-pointer"
                  >
                    Tải poster lên
                  </button>
                </div>

                {/* Info fields */}
                <div className="col-span-2 space-y-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Tên bộ phim *</label>
                    <input
                      type="text"
                      name="title"
                      required
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="VD: Dune: Hành Tinh Cát"
                      className="w-full bg-slate-50 text-slate-900 px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Thời lượng (phút) *</label>
                      <input
                        type="number"
                        name="duration"
                        required
                        value={formData.duration}
                        onChange={handleChange}
                        className="w-full bg-slate-50 text-slate-900 px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Giới hạn độ tuổi</label>
                      <select
                        name="ageLimit"
                        value={formData.ageLimit}
                        onChange={handleChange}
                        className="w-full bg-slate-50 text-slate-900 px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500 cursor-pointer"
                      >
                        <option value="P">P - Phổ biến</option>
                        <option value="K">K - Dưới 13t có phụ huynh</option>
                        <option value="T13">T13 - Cấm dưới 13t</option>
                        <option value="T16">T16 - Cấm dưới 16t</option>
                        <option value="T18">T18 - Cấm dưới 18t</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Đạo diễn</label>
                    <input
                      type="text"
                      name="director"
                      value={formData.director}
                      onChange={handleChange}
                      placeholder="VD: Denis Villeneuve"
                      className="w-full bg-slate-50 text-slate-900 px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Diễn viên chính</label>
                <input
                  type="text"
                  name="cast"
                  value={formData.cast}
                  onChange={handleChange}
                  placeholder="VD: Timothée Chalamet, Zendaya"
                  className="w-full bg-slate-50 text-slate-900 px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Trailer YouTube Embed / URL</label>
                <input
                  type="text"
                  name="trailerUrl"
                  value={formData.trailerUrl}
                  onChange={handleChange}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full bg-slate-50 text-slate-900 px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tóm tắt nội dung phim</label>
                <textarea
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Mô tả tóm tắt..."
                  className="w-full bg-slate-50 text-slate-900 px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
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
                  {formData.id ? 'Lưu Thay Đổi' : 'Thêm Phim Mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMoviePage;
