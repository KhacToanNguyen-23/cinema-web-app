// [AI UPDATE - Chuyen doi UserManagementPage sang phong cach Modern Enterprise Office Portal]
import React, { useState, useEffect } from 'react';
import { userApi } from '@/api/userApi';
import { cinemaApi } from '@/api/cinemaApi';
import { useAuth } from '@/context/AuthContext';

const ROLE_BADGES = {
  ADMIN: { label: 'Super Admin', color: 'bg-red-50 text-red-700 border-red-200' },
  MANAGER: { label: 'Cinema Manager', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  STAFF: { label: 'Staff POS', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  MEMBER: { label: 'Khách hàng', color: 'bg-slate-100 text-slate-700 border-slate-200' },
  CUSTOMER: { label: 'Khách hàng', color: 'bg-slate-100 text-slate-700 border-slate-200' },
};

const UserManagementPage = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    username: '',
    password: '',
    fullName: '',
    email: '',
    phone: '',
    role: 'MEMBER',
    cinemaId: ''
  });
  
  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    fetchUsersAndCinemas();
  }, []);

  const fetchUsersAndCinemas = async () => {
    try {
      setLoading(true);
      const [usersRes, cinemasRes] = await Promise.all([
        userApi.getAllUsers(),
        cinemaApi.getAllCinemas()
      ]);
      setUsers(usersRes.data);
      setCinemas(cinemasRes.data);
    } catch (error) {
      console.error(error);
      alert('Lỗi tải dữ liệu người dùng');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (targetUser = null) => {
    if (targetUser) {
      setFormData({
        id: targetUser.id,
        username: targetUser.username,
        password: '',
        fullName: targetUser.fullName || '',
        email: targetUser.email || '',
        phone: targetUser.phone || '',
        role: targetUser.role || 'MEMBER',
        cinemaId: targetUser.cinemaId || targetUser.cinema?.id || ''
      });
    } else {
      setFormData({
        id: null,
        username: '',
        password: '',
        fullName: '',
        email: '',
        phone: '',
        role: 'STAFF',
        cinemaId: cinemas.length > 0 ? cinemas[0].id : ''
      });
    }
    setShowModal(true);
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
      if (formData.id) {
        await userApi.updateUser(formData.id, formData);
        alert('Cập nhật tài khoản thành công!');
      } else {
        await userApi.createUser(formData);
        alert('Tạo tài khoản mới thành công!');
      }
      setShowModal(false);
      fetchUsersAndCinemas();
    } catch (error) {
      console.error(error);
      const backendError = error.response?.data?.message || error.message;
      alert(`Lỗi: ${backendError}`);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn XÓA tài khoản này?')) {
      try {
        await userApi.deleteUser(id);
        fetchUsersAndCinemas();
      } catch (error) {
        console.error(error);
        alert('Lỗi khi xóa tài khoản!');
      }
    }
  };

  return (
    <div className="flex flex-col w-full relative min-h-full pb-16 bg-slate-50">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-8 py-6 bg-white border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-600">group</span>
            Quản Lý Tài Khoản & Phân Quyền
          </h1>
          <p className="text-slate-500 text-xs mt-0.5">
            Quản trị danh sách người dùng, cấp quyền Manager/Staff và gán rạp quản lý.
          </p>
        </div>
        {isAdmin && (
          <button
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition-colors cursor-pointer"
            onClick={() => handleOpenModal()}
          >
            <span className="material-symbols-outlined text-[18px]">person_add</span>
            TẠO TÀI KHOẢN MỚI
          </button>
        )}
      </div>

      <div className="p-8">
        {/* Table List */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">Danh Sách Người Dùng ({users.length})</h2>
          </div>

          {loading ? (
            <div className="py-16 text-center text-slate-500 text-xs">Đang tải danh sách người dùng...</div>
          ) : users.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">Chưa có người dùng nào.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">ID</th>
                    <th className="p-3.5">Họ & Tên</th>
                    <th className="p-3.5">Tên Đăng Nhập</th>
                    <th className="p-3.5">Vai Trò</th>
                    <th className="p-3.5">Cụm Rạp Gán</th>
                    <th className="p-3.5">Email / Số Điện Thoại</th>
                    {isAdmin && <th className="p-3.5 text-right">Thao Tác</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {users.map((u) => {
                    const roleBadge = ROLE_BADGES[u.role] || ROLE_BADGES.MEMBER;
                    const assignedCinema = cinemas.find(c => c.id === u.cinemaId || c.id === u.cinema?.id);
                    return (
                      <tr key={u.id} className="hover:bg-blue-50/30 transition-colors">
                        <td className="p-3.5 font-mono text-slate-500">#{u.id}</td>
                        <td className="p-3.5 font-bold text-slate-900">{u.fullName || 'Chưa cập nhật'}</td>
                        <td className="p-3.5 font-mono text-slate-700">{u.username}</td>
                        <td className="p-3.5">
                          <span className={`px-2.5 py-0.5 rounded-md font-semibold text-[11px] border ${roleBadge.color}`}>
                            {roleBadge.label}
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-600">
                          {assignedCinema ? (
                            <span className="font-semibold text-slate-800">{assignedCinema.name}</span>
                          ) : (
                            <span className="text-slate-400 italic">Toàn hệ thống / Khách</span>
                          )}
                        </td>
                        <td className="p-3.5 text-slate-600">
                          <div>{u.email || '-'}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{u.phone || ''}</div>
                        </td>
                        {isAdmin && (
                          <td className="p-3.5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleOpenModal(u)}
                                className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer transition-colors"
                              >
                                Phân quyền
                              </button>
                              <button
                                onClick={() => handleDelete(u.id)}
                                className="px-2.5 py-1 rounded bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold cursor-pointer transition-colors"
                              >
                                Xóa
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal Thêm/Sửa User */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          {/* [AI UPDATE - Fix modal bi co hep que tam bang class max-w-[520px] w-full] */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-[520px] w-full p-6 space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">
                {formData.id ? 'Cập Nhật & Phân Quyền' : 'Tạo Tài Khoản Mới'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tên đăng nhập *</label>
                <input
                  type="text"
                  name="username"
                  required
                  disabled={!!formData.id}
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="VD: manager_landmark81"
                  className="w-full bg-slate-50 text-slate-900 px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500 disabled:opacity-60"
                />
              </div>

              {!formData.id && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mật khẩu khởi tạo *</label>
                  <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Tối thiểu 6 ký tự"
                    className="w-full bg-slate-50 text-slate-900 px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500"
                  />
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Họ và tên</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="VD: Nguyễn Văn A"
                  className="w-full bg-slate-50 text-slate-900 px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Vai trò (Role) *</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full bg-slate-50 text-slate-900 px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="MEMBER">Khách hàng (MEMBER)</option>
                    <option value="STAFF">Nhân viên POS (STAFF)</option>
                    <option value="MANAGER">Quản lý rạp (MANAGER)</option>
                    <option value="ADMIN">Super Admin (ADMIN)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Cụm rạp phân bổ</label>
                  <select
                    name="cinemaId"
                    value={formData.cinemaId}
                    onChange={handleChange}
                    disabled={formData.role === 'ADMIN' || formData.role === 'MEMBER'}
                    className="w-full bg-slate-50 text-slate-900 px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500 cursor-pointer disabled:opacity-50"
                  >
                    <option value="">Không gán rạp</option>
                    {cinemas.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="email@domain.com"
                    className="w-full bg-slate-50 text-slate-900 px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Số điện thoại</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="0901234567"
                    className="w-full bg-slate-50 text-slate-900 px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm cursor-pointer"
                >
                  {formData.id ? 'Lưu Thay Đổi' : 'Tạo Người Dùng'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementPage;
