import React, { useState, useEffect } from 'react';
import { cinemaApi } from '../../api/cinemaApi';
import { regionApi } from '../../api/regionApi';

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
      const selectedRegion = regions.find((r) => r.id === Number(value));
      setFormData((prev) => ({ ...prev, region: selectedRegion || null }));
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
    <div className="flex flex-col w-full relative min-h-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-xl px-xl py-xl pb-md">
        <div className="flex flex-col gap-sm">
          <h1 className="font-display-lg text-display-lg text-on-surface">Quản Lý Rạp Chiếu</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-[42rem]">
            Quản lý danh sách rạp chiếu phim trong hệ thống.
          </p>
        </div>
        <div className="flex shrink-0 gap-md">
          <button
            className="flex items-center gap-sm px-lg py-md rounded-xl bg-primary text-on-primary hover:bg-primary-fixed transition-colors font-button text-button shadow-md shadow-primary/20"
            onClick={() => handleOpenModal()}
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            THÊM RẠP MỚI
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="px-xl py-md">
        <div className="bg-surface-container rounded-2xl p-lg shadow-md flex justify-around w-full max-w-2xl">
          <div className="text-center">
            <p className="text-display-md text-primary font-bold">{cinemas.length}</p>
            <p className="text-on-surface-variant text-sm uppercase tracking-wider">Tổng rạp</p>
          </div>
          <div className="text-center">
            <p className="text-display-md text-green-500 font-bold">{activeCinemas}</p>
            <p className="text-on-surface-variant text-sm uppercase tracking-wider">Đang Active</p>
          </div>
          <div className="text-center">
            <p className="text-display-md text-red-500 font-bold">{cinemas.length - activeCinemas}</p>
            <p className="text-on-surface-variant text-sm uppercase tracking-wider">Đã ẩn</p>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="px-xl py-lg flex flex-col gap-gutter pb-32">
        {loading ? (
          <div className="text-center text-on-surface-variant py-10">Đang tải dữ liệu...</div>
        ) : (
          <div className="flex flex-col gap-md">
            {cinemas.map((cinema) => (
              <div
                key={cinema.id}
                className={`group bg-surface-container hover:bg-surface-container-high rounded-2xl p-md shadow-sm transition-all duration-300 flex flex-col md:flex-row gap-md items-center ${!(cinema.isActive ?? cinema.active) ? 'opacity-50 grayscale' : ''}`}
              >
                {/* Icon + Info */}
                <div className="flex items-center gap-lg w-full md:w-1/2">
                  <div className="w-14 h-14 shrink-0 rounded-xl bg-surface-container-highest flex items-center justify-center shadow-md">
                    <span className="material-symbols-outlined text-primary text-[28px]">theater_comedy</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <h3 className="font-headline-md text-headline-md text-on-surface truncate">{cinema.name}</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant truncate">
                      {cinema.address || 'Chưa có địa chỉ'}
                    </p>
                    <div className="flex items-center gap-xs mt-xs flex-wrap">
                      {cinema.region && (
                        <span className="px-2 py-0.5 rounded bg-surface-container-highest text-on-surface font-label-caps text-[10px]">
                          {cinema.region.name}
                        </span>
                      )}
                      {cinema.phoneNumber && (
                        <span className="text-on-surface-variant text-[12px]">{cinema.phoneNumber}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="w-full md:w-1/4 flex flex-col justify-center">
                  {cinema.isActive || cinema.active ? (
                    <span className="inline-flex items-center gap-xs px-sm py-xs rounded-full bg-green-900/40 text-green-400 font-label-caps text-label-caps w-max">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                      ĐANG HOẠT ĐỘNG
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-xs px-sm py-xs rounded-full bg-red-900/40 text-red-400 font-label-caps text-label-caps w-max">
                      ĐÃ BỊ ẨN
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="w-full md:w-1/4 flex justify-end gap-sm">
                  <button
                    onClick={() => handleOpenModal(cinema)}
                    className="px-4 py-2 rounded-xl bg-surface-container-highest hover:bg-surface-bright text-on-surface transition-colors flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[18px]">edit</span> Sửa
                  </button>
                  {(cinema.isActive || cinema.active) && (
                    <button
                      onClick={() => handleDelete(cinema.id)}
                      className="px-4 py-2 rounded-xl bg-red-900/40 hover:bg-red-900/60 text-red-200 transition-colors flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span> Ẩn
                    </button>
                  )}
                </div>
              </div>
            ))}
            {cinemas.length === 0 && (
              <div className="text-center text-on-surface-variant py-10">Chưa có rạp chiếu nào.</div>
            )}
          </div>
        )}
      </div>

      {/* Modal Thêm/Sửa */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-md">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-xl"
            onClick={() => setIsModalOpen(false)}
          ></div>

          <form
            onSubmit={handleSubmit}
            className="relative bg-surface rounded-2xl shadow-2xl w-full max-w-[40rem] max-h-[90vh] overflow-y-auto flex flex-col border border-surface-container-highest"
          >
            {/* Modal Header */}
            <div className="h-24 bg-surface-container relative flex items-center px-xl border-b border-surface-container-highest">
              <h2 className="font-display-sm text-display-sm text-on-surface">
                {formData.id ? 'Sửa Thông Tin Rạp' : 'Thêm Rạp Mới'}
              </h2>
              <button
                type="button"
                className="absolute top-1/2 right-md -translate-y-1/2 w-10 h-10 rounded-full hover:bg-surface transition-colors flex items-center justify-center text-on-surface"
                onClick={() => setIsModalOpen(false)}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-xl flex flex-col gap-lg">
              {/* Tên rạp */}
              <div className="flex flex-col gap-xs">
                <label className="font-label-caps text-label-caps text-on-surface-variant">Tên rạp *</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#1A1A1A] rounded-xl py-md px-md text-on-surface font-body-md border border-surface-container-highest focus:border-primary focus:outline-none transition-colors"
                  placeholder="VD: CGV Vincom Center"
                  type="text"
                />
              </div>

              {/* Địa chỉ */}
              <div className="flex flex-col gap-xs">
                <label className="font-label-caps text-label-caps text-on-surface-variant">Địa chỉ *</label>
                <input
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#1A1A1A] rounded-xl py-md px-md text-on-surface font-body-md border border-surface-container-highest focus:border-primary focus:outline-none transition-colors"
                  placeholder="VD: 72 Lê Thánh Tôn, Q1, TP.HCM"
                  type="text"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                {/* SĐT */}
                <div className="flex flex-col gap-xs">
                  <label className="font-label-caps text-label-caps text-on-surface-variant">Số điện thoại</label>
                  <input
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="w-full bg-[#1A1A1A] rounded-xl py-md px-md text-on-surface font-body-md border border-surface-container-highest focus:border-primary focus:outline-none transition-colors"
                    placeholder="VD: 028 3825 5233"
                    type="text"
                  />
                </div>

                {/* Khu vực */}
                <div className="flex flex-col gap-xs">
                  <label className="font-label-caps text-label-caps text-on-surface-variant">Khu vực *</label>
                  <select
                    name="regionId"
                    value={formData.region?.id || ''}
                    onChange={handleChange}
                    required
                    className="w-full bg-[#1A1A1A] rounded-xl py-md px-md text-on-surface font-body-md border border-surface-container-highest focus:border-primary focus:outline-none transition-colors appearance-none"
                  >
                    <option value="">-- Chọn khu vực --</option>
                    {regions.map((region) => (
                      <option key={region.id} value={region.id}>
                        {region.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Active (chỉ khi edit) */}
              {formData.id && (
                <div className="flex items-center gap-md">
                  <input
                    type="checkbox"
                    name="isActive"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="w-5 h-5"
                  />
                  <label htmlFor="isActive" className="font-body-md text-on-surface cursor-pointer">
                    Đang hoạt động (Active)
                  </label>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-xl bg-surface-container-lowest border-t border-surface-container-highest flex justify-end gap-md">
              <button
                type="button"
                className="px-lg py-md rounded-xl text-on-surface hover:bg-surface-container transition-colors font-button text-button"
                onClick={() => setIsModalOpen(false)}
              >
                HỦY
              </button>
              <button
                type="submit"
                className="px-xl py-md rounded-xl bg-primary text-on-primary hover:bg-primary-fixed transition-colors font-button text-button shadow-md shadow-primary/20"
              >
                LƯU RẠP
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminCinemaPage;
