// [AI UPDATE - Chuyen doi AdminCinemaPage sang phong cach Modern Enterprise Office Portal]
import React, { useState, useEffect } from 'react';
import { cinemaApi } from '@/api/cinemaApi';
import { regionApi } from '@/api/regionApi';

const EMPTY_FORM = {
  id: null,
  name: '',
  address: '',
  phoneNumber: '',
  region: null,
  isActive: true,
};

const AdminCinemaPage = () => {
  const [cinemas, setCinemas] = useState([]);
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);

  useEffect(() => {
    fetchCinemas();
    fetchRegions();
  }, []);

  const fetchCinemas = async () => {
    try {
      setLoading(true);
      const res = await cinemaApi.getAllCinemas();
      setCinemas(res.data);
    } catch (error) {
      console.error('Lỗi khi tải danh sách rạp', error);
      alert('Không thể tải danh sách rạp');
    } finally {
      setLoading(false);
    }
  };

  const fetchRegions = async () => {
    try {
      const res = await regionApi.getAllRegions();
      setRegions(res.data);
    } catch (error) {
      console.error('Lỗi khi tải danh sách khu vực', error);
    }
  };

  const handleOpenModal = (cinema = null) => {
    if (cinema) {
      setFormData({
        id: cinema.id,
        name: cinema.name || '',
        address: cinema.address || '',
        phoneNumber: cinema.phoneNumber || '',
        region: cinema.region || null,
        isActive: cinema.isActive !== undefined ? cinema.isActive : true,
      });
    } else {
      setFormData(EMPTY_FORM);
    }
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'regionId') {
      const selected = regions.find((r) => String(r.id) === String(value));
      setFormData((prev) => ({ ...prev, region: selected || null }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        address: formData.address,
        phoneNumber: formData.phoneNumber,
        region: formData.region ? { id: formData.region.id } : null,
        isActive: formData.isActive,
      };

      if (formData.id) {
        await cinemaApi.updateCinema(formData.id, payload);
        alert('Cập nhật rạp thành công!');
      } else {
        await cinemaApi.createCinema(payload);
        alert('Thêm rạp thành công!');
      }
      setIsModalOpen(false);
      fetchCinemas();
    } catch (error) {
      console.error(error);
      const backendError = error.response?.data?.message || error.message;
      alert(`Lỗi: ${backendError}`);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn ẨN rạp này?')) {
      try {
        await cinemaApi.deleteCinema(id);
        fetchCinemas();
      } catch (error) {
        console.error(error);
        alert('Có lỗi xảy ra khi ẩn rạp!');
      }
    }
  };

  const activeCinemas = cinemas.filter((c) => c.isActive || c.active).length;

  return (
    <div className="flex flex-col w-full relative min-h-full pb-16 bg-slate-50">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-8 py-6 bg-white border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-600">theater_comedy</span>
            Quản Lý Rạp Chiếu
          </h1>
          <p className="text-slate-500 text-xs mt-0.5">
            Quản lý danh sách các cụm rạp, địa chỉ và khu vực hoạt động trên toàn quốc.
          </p>
        </div>
        <button
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition-colors cursor-pointer"
          onClick={() => handleOpenModal()}
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          THÊM RẠP MỚI
        </button>
      </div>

      <div className="p-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200">
              <span className="material-symbols-outlined text-[20px]">domain</span>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase">Tổng số rạp</p>
              <p className="text-xl font-bold text-slate-900">{cinemas.length}</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
              <span className="material-symbols-outlined text-[20px]">check_circle</span>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase">Đang hoạt động</p>
              <p className="text-xl font-bold text-emerald-600">{activeCinemas}</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center border border-slate-200">
              <span className="material-symbols-outlined text-[20px]">pause_circle</span>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase">Tạm dừng</p>
              <p className="text-xl font-bold text-slate-600">{cinemas.length - activeCinemas}</p>
            </div>
          </div>
        </div>

        {/* Table List */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">Danh Sách Cụm Rạp</h2>
            <span className="text-xs text-slate-500 font-medium">Tổng: {cinemas.length} cụm rạp</span>
          </div>

          {loading ? (
            <div className="py-16 text-center text-slate-500 text-xs">Đang tải danh sách rạp...</div>
          ) : cinemas.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">Chưa có rạp nào trong hệ thống.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">ID</th>
                    <th className="p-3.5">Tên Cụm Rạp</th>
                    <th className="p-3.5">Địa Chỉ</th>
                    <th className="p-3.5">Khu Vực</th>
                    <th className="p-3.5">Hotline</th>
                    <th className="p-3.5">Trạng Thái</th>
                    <th className="p-3.5 text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {cinemas.map((cinema) => (
                    <tr key={cinema.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="p-3.5 font-mono text-slate-500">#{cinema.id}</td>
                      <td className="p-3.5 font-bold text-slate-900">{cinema.name}</td>
                      <td className="p-3.5 text-slate-600 max-w-xs truncate">{cinema.address || 'Chưa cập nhật'}</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-medium text-[11px]">
                          {cinema.region?.name || 'Toàn quốc'}
                        </span>
                      </td>
                      <td className="p-3.5 font-mono text-slate-600">{cinema.phoneNumber || 'N/A'}</td>
                      <td className="p-3.5">
                        {cinema.isActive || cinema.active ? (
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
                            onClick={() => handleOpenModal(cinema)}
                            className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer transition-colors"
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => handleDelete(cinema.id)}
                            className="px-2.5 py-1 rounded bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold cursor-pointer transition-colors"
                          >
                            Ẩn
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

      {/* Modal Thêm/Sửa Rạp */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-5 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">
                {formData.id ? 'Cập Nhật Cụm Rạp' : 'Thêm Cụm Rạp Mới'}
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
                <label className="block font-semibold text-slate-700 mb-1">Tên rạp chiếu *</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="VD: CGV Landmark 81"
                  className="w-full bg-slate-50 text-slate-900 px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Địa chỉ rạp *</label>
                <input
                  type="text"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="VD: Tầng B1 Vincom Landmark 81"
                  className="w-full bg-slate-50 text-slate-900 px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Khu vực</label>
                  <select
                    name="regionId"
                    value={formData.region?.id || ''}
                    onChange={handleChange}
                    className="w-full bg-slate-50 text-slate-900 px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="">Chọn khu vực</option>
                    {regions.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Hotline</label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="VD: 1900 6017"
                    className="w-full bg-slate-50 text-slate-900 px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="accent-blue-600 cursor-pointer"
                />
                <label htmlFor="isActive" className="text-slate-700 font-medium cursor-pointer">
                  Kích hoạt hoạt động rạp
                </label>
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
                  {formData.id ? 'Lưu Thay Đổi' : 'Thêm Mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCinemaPage;
