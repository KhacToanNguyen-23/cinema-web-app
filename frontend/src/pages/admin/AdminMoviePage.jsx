import React, { useState, useEffect, useRef } from 'react';
import { movieApi } from '../../api/movieApi';

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
    ageLimit: 'C13',
    releaseDate: '',
    cast: '',
    isActive: true
  });

  // CẤU HÌNH CLOUDINARY
  const CLOUDINARY_CLOUD_NAME = "ou9km1tu";
  const CLOUDINARY_UPLOAD_PRESET = "v0x2gloe"; // Thay cinema_upload bằng tên thực tế của bạn

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
        ageLimit: movie.ageLimit || 'C13',
        releaseDate: movie.releaseDate ? movie.releaseDate.split('T')[0] : '',
        cast: movie.cast || '',
        isActive: movie.isActive !== undefined ? movie.isActive : true
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
        ageLimit: 'C13',
        releaseDate: '',
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

    if (CLOUDINARY_UPLOAD_PRESET === "YOUR_UPLOAD_PRESET") {
       alert("Vui lòng cập nhật CLOUDINARY_UPLOAD_PRESET trong code trước khi upload!");
       return;
    }

    try {
      setIsUploading(true);
      
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
      formData.append("folder", "cinema_posters"); // Tùy chọn: lưu vào thư mục riêng trên Cloudinary

      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: formData
      });

      const data = await response.json();
      
      if (data.secure_url) {
        setFormData(prev => ({ ...prev, posterUrl: data.secure_url }));
        alert("Upload ảnh thành công!");
      } else {
        throw new Error(data.error?.message || "Upload failed");
      }
    } catch (error) {
      console.error("Lỗi upload ảnh:", error);
      alert("Không thể upload ảnh: " + error.message);
    } finally {
      setIsUploading(false);
      // Reset input file để có thể chọn lại cùng 1 file
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        releaseDate: formData.releaseDate ? `${formData.releaseDate}T00:00:00` : null
      };

      if (formData.id) {
        await movieApi.updateMovie(formData.id, payload);
        alert('Cập nhật phim thành công!');
      } else {
        await movieApi.createMovie(payload);
        alert('Thêm phim thành công!');
      }
      setIsModalOpen(false);
      fetchMovies();
    } catch (error) {
      console.error(error);
      const backendError = error.response?.data?.message || error.message;
      alert(`Lỗi Backend trả về: ${backendError}`);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn ẨN bộ phim này?')) {
      try {
        await movieApi.deleteMovie(id);
        fetchMovies();
      } catch (error) {
        console.error(error);
        alert('Có lỗi xảy ra khi xóa phim!');
      }
    }
  };

  const activeMovies = movies.filter(m => m.active || m.isActive).length;
  
  return (
    <div className="flex flex-col w-full relative min-h-full">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-xl px-xl py-xl pb-md">
        <div className="flex flex-col gap-sm">
          <h1 className="font-display-lg text-display-lg text-on-surface">Quản Lý Phim</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-[42rem]">
            Quản lý các bộ phim đang chiếu, sắp chiếu và dữ liệu lưu trữ.
          </p>
        </div>
        <div className="flex shrink-0 gap-md">
          <button
            className="flex items-center gap-sm px-lg py-md rounded-xl bg-primary text-on-primary hover:bg-primary-fixed transition-colors font-button text-button shadow-md shadow-primary/20"
            onClick={() => handleOpenModal()}
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            THÊM PHIM MỚI
          </button>
        </div>
      </div>

      {/* Stats Area */}
      <div className="px-xl py-md">
         <div className="bg-surface-container rounded-2xl p-lg shadow-md flex justify-around w-full max-w-2xl">
            <div className="text-center">
              <p className="text-display-md text-primary font-bold">{movies.length}</p>
              <p className="text-on-surface-variant text-sm uppercase tracking-wider">Tổng phim</p>
            </div>
            <div className="text-center">
              <p className="text-display-md text-green-500 font-bold">{activeMovies}</p>
              <p className="text-on-surface-variant text-sm uppercase tracking-wider">Đang Active</p>
            </div>
            <div className="text-center">
              <p className="text-display-md text-red-500 font-bold">{movies.length - activeMovies}</p>
              <p className="text-on-surface-variant text-sm uppercase tracking-wider">Đã ẩn</p>
            </div>
         </div>
      </div>

      {/* Main Content List */}
      <div className="px-xl py-lg flex flex-col gap-gutter pb-32">
        {loading ? (
           <div className="text-center text-on-surface-variant py-10">Đang tải dữ liệu...</div>
        ) : (
          <div className="flex flex-col gap-md">
            {movies.map(movie => (
               <div key={movie.id} className={`group bg-surface-container hover:bg-surface-container-high rounded-2xl p-md shadow-sm transition-all duration-300 flex flex-col md:flex-row gap-md items-center ${!(movie.active ?? movie.isActive) ? 'opacity-50 grayscale' : ''}`}>
                 <div className="flex items-center gap-lg w-full md:w-1/2">
                    <div className="w-16 h-24 shrink-0 rounded-lg overflow-hidden shadow-md relative bg-surface-container-highest">
                       {movie.posterUrl ? (
                          <img src={movie.posterUrl} alt="poster" className="w-full h-full object-cover" />
                       ) : (
                          <span className="material-symbols-outlined absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-on-surface-variant">movie</span>
                       )}
                    </div>
                    <div className="flex flex-col min-w-0">
                       <h3 className="font-headline-md text-headline-md text-on-surface truncate">{movie.title}</h3>
                       <p className="font-body-md text-body-md text-on-surface-variant truncate">Dir. {movie.director || 'N/A'} • {movie.duration} min</p>
                       <div className="flex items-center gap-xs mt-xs">
                          <span className="px-2 py-1 rounded bg-surface-container-highest text-on-surface font-label-caps text-[10px]">{movie.ageLimit || 'G'}</span>
                       </div>
                    </div>
                 </div>
                 <div className="w-full md:w-1/4 flex flex-col justify-center">
                    {(movie.active ?? movie.isActive) ? (
                       <span className="inline-flex items-center gap-xs px-sm py-xs rounded-full bg-green-900/40 text-green-400 font-label-caps text-label-caps w-max">
                          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                          ĐANG HIỂN THỊ
                       </span>
                    ) : (
                       <span className="inline-flex items-center gap-xs px-sm py-xs rounded-full bg-red-900/40 text-red-400 font-label-caps text-label-caps w-max">
                          ĐÃ BỊ ẨN
                       </span>
                    )}
                 </div>
                 <div className="w-full md:w-1/4 flex justify-end gap-sm">
                    <button onClick={() => handleOpenModal(movie)} className="px-4 py-2 rounded-xl bg-surface-container-highest hover:bg-surface-bright text-on-surface transition-colors flex items-center gap-2">
                       <span className="material-symbols-outlined text-[18px]">edit</span> Sửa
                    </button>
                    {(movie.active ?? movie.isActive) && (
                      <button onClick={() => handleDelete(movie.id)} className="px-4 py-2 rounded-xl bg-red-900/40 hover:bg-red-900/60 text-red-200 transition-colors flex items-center gap-2">
                         <span className="material-symbols-outlined text-[18px]">delete</span> Ẩn
                      </button>
                    )}
                 </div>
               </div>
            ))}
            {movies.length === 0 && (
              <div className="text-center text-on-surface-variant py-10">Chưa có bộ phim nào.</div>
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
              <h2 className="font-display-sm text-display-sm text-on-surface">{formData.id ? 'Sửa thông tin Phim' : 'Thêm Phim Mới'}</h2>
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
                  <label className="font-label-caps text-label-caps text-on-surface-variant">Tên phim *</label>
                  <input name="title" value={formData.title} onChange={handleChange} required className="w-full bg-[#1A1A1A] rounded-xl py-md px-md text-on-surface font-body-md border border-surface-container-highest focus:border-primary focus:outline-none transition-colors" placeholder="VD: The Avengers" type="text" />
                </div>
                <div className="flex flex-col gap-xs">
                  <label className="font-label-caps text-label-caps text-on-surface-variant">Đạo diễn</label>
                  <input name="director" value={formData.director} onChange={handleChange} className="w-full bg-[#1A1A1A] rounded-xl py-md px-md text-on-surface font-body-md border border-surface-container-highest focus:border-primary focus:outline-none transition-colors" placeholder="Director Name" type="text" />
                </div>
              </div>
              
              <div className="flex flex-col gap-xs">
                  <label className="font-label-caps text-label-caps text-on-surface-variant">Mô tả (Description)</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="w-full bg-[#1A1A1A] rounded-xl py-md px-md text-on-surface font-body-md border border-surface-container-highest focus:border-primary focus:outline-none transition-colors"></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                 <div className="flex flex-col gap-xs">
                   <label className="font-label-caps text-label-caps text-on-surface-variant">Trailer URL (Youtube)</label>
                   <input name="trailerUrl" value={formData.trailerUrl} onChange={handleChange} className="w-full bg-[#1A1A1A] rounded-xl py-md px-md text-on-surface font-body-md border border-surface-container-highest focus:border-primary focus:outline-none transition-colors" placeholder="https://youtube.com/..." type="url" />
                 </div>
                 <div className="flex flex-col gap-xs">
                   <label className="font-label-caps text-label-caps text-on-surface-variant">Poster URL / Upload File</label>
                   
                   <div className="flex gap-2 items-center">
                     {/* Input nhập tay URL */}
                     <input name="posterUrl" value={formData.posterUrl} onChange={handleChange} className="flex-1 bg-[#1A1A1A] rounded-xl py-md px-md text-on-surface font-body-md border border-surface-container-highest focus:border-primary focus:outline-none transition-colors" placeholder="https://..." type="url" />
                     
                     {/* Nút Upload */}
                     <div className="relative overflow-hidden inline-block shrink-0">
                       <button type="button" disabled={isUploading} className={`px-4 py-3 rounded-xl flex items-center justify-center font-button text-button transition-colors ${isUploading ? 'bg-surface-container-highest text-on-surface-variant' : 'bg-secondary text-on-secondary hover:bg-secondary-fixed'}`}>
                         {isUploading ? 'Đang tải...' : 'Tải lên'}
                       </button>
                       <input 
                         type="file" 
                         accept="image/*" 
                         ref={fileInputRef}
                         onChange={handleFileUpload} 
                         disabled={isUploading}
                         className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                       />
                     </div>
                   </div>
                   
                   {/* Preview Ảnh nhỏ nếu có URL */}
                   {formData.posterUrl && (
                     <div className="mt-2 flex items-center gap-2">
                       <img src={formData.posterUrl} alt="Preview" className="h-16 w-16 object-cover rounded-md border border-surface-container" />
                       <span className="text-[12px] text-green-400">Đã có ảnh poster</span>
                     </div>
                   )}
                 </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-md">
                <div className="flex flex-col gap-xs">
                  <label className="font-label-caps text-label-caps text-on-surface-variant">Thời lượng (phút)</label>
                  <input name="duration" value={formData.duration} onChange={handleChange} required className="w-full bg-[#1A1A1A] rounded-xl py-md px-md text-on-surface font-body-md border border-surface-container-highest focus:border-primary focus:outline-none transition-colors" type="number" />
                </div>
                <div className="flex flex-col gap-xs">
                  <label className="font-label-caps text-label-caps text-on-surface-variant">Độ tuổi (Age Limit)</label>
                  <select name="ageLimit" value={formData.ageLimit} onChange={handleChange} className="w-full bg-[#1A1A1A] rounded-xl py-md px-md text-on-surface font-body-md border border-surface-container-highest focus:border-primary focus:outline-none transition-colors appearance-none">
                    <option value="G">G (Mọi lứa tuổi)</option>
                    <option value="C13">C13 (Trên 13 tuổi)</option>
                    <option value="C16">C16 (Trên 16 tuổi)</option>
                    <option value="C18">C18 (Trên 18 tuổi)</option>
                  </select>
                </div>
                <div className="flex flex-col gap-xs">
                  <label className="font-label-caps text-label-caps text-on-surface-variant">Ngày chiếu</label>
                  <input name="releaseDate" value={formData.releaseDate} onChange={handleChange} className="w-full bg-[#1A1A1A] rounded-xl py-md px-md text-on-surface font-body-md border border-surface-container-highest focus:border-primary focus:outline-none transition-colors" type="date" />
                </div>
                
                {formData.id && (
                  <div className="flex flex-col gap-xs justify-center items-center">
                    <label className="font-label-caps text-label-caps text-on-surface-variant">Trạng thái Active</label>
                    <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="w-6 h-6 mt-2" />
                  </div>
                )}
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
              <button type="submit" disabled={isUploading} className={`px-xl py-md rounded-xl transition-colors font-button text-button shadow-md ${isUploading ? 'bg-surface-container-highest text-on-surface-variant cursor-not-allowed' : 'bg-primary text-on-primary hover:bg-primary-fixed shadow-primary/20'}`}>
                LƯU PHIM
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminMoviePage;
