// [AI UPDATE - Trang Quản lý Vé & Soát Vé QR cho Staff - UI Only, chuẩn Enterprise Light Theme]
import { useState } from 'react';

const StaffTicketsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [loading, setLoading] = useState(false);

  const filteredTickets = tickets.filter(
    (t) =>
      t.ticketCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.phone?.includes(searchTerm) ||
      t.customerName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCheckIn = (ticketId) => {
    // TODO: Gọi API PUT /api/v1/bookings/{id}/check-in
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: 'CHECKED_IN' } : t))
    );
    if (selectedTicket && selectedTicket.id === ticketId) {
      setSelectedTicket((prev) => ({ ...prev, status: 'CHECKED_IN' }));
    }
  };

  return (
    <div className="flex flex-col w-full relative min-h-full pb-16 bg-slate-50">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-8 py-6 bg-white border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-600">confirmation_number</span>
            Quản Lý Vé & Soát Vé
          </h1>
          <p className="text-slate-500 text-xs mt-0.5">
            Tra cứu mã đặt vé, kiểm tra trạng thái vé và thực hiện soát vé tại cổng rạp
          </p>
        </div>
      </div>

      <div className="p-8 space-y-6">
        {/* Search */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
              search
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Nhập Mã đặt vé, Số điện thoại hoặc Tên khách hàng..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
            />
          </div>
          <button
            onClick={() => setSearchTerm('')}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-semibold text-slate-600 border border-slate-200 transition-colors cursor-pointer"
          >
            Xóa bộ lọc
          </button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Ticket List */}
          <div className="lg:col-span-2 space-y-3">
            {loading ? (
              <div className="bg-white p-16 rounded-xl border border-slate-200 shadow-sm text-center text-slate-500 text-xs">
                Đang tải danh sách vé...
              </div>
            ) : filteredTickets.length === 0 ? (
              <div className="bg-white p-16 rounded-xl border border-slate-200 shadow-sm text-center space-y-3">
                <span className="material-symbols-outlined text-5xl text-slate-300">confirmation_number</span>
                <p className="text-slate-500 text-sm">Chưa có dữ liệu vé.</p>
                <p className="text-slate-400 text-xs">Hệ thống sẽ hiển thị danh sách vé khi API được kết nối.</p>
              </div>
            ) : (
              filteredTickets.map((t) => (
                <div
                  key={t.id}
                  onClick={() => setSelectedTicket(t)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                    selectedTicket?.id === t.id
                      ? 'bg-blue-50 border-blue-300 shadow-md'
                      : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-sm'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-blue-600 text-sm">{t.ticketCode}</span>
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                          t.status === 'CHECKED_IN'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {t.status === 'CHECKED_IN' ? 'Đã soát vé' : 'Chưa soát vé'}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm">{t.movieTitle}</h3>
                    <p className="text-xs text-slate-500">
                      {t.room} | Ghế: <span className="font-bold text-slate-800">{t.seats}</span>
                    </p>
                    <p className="text-xs text-slate-500">
                      Khách hàng: <span className="font-medium text-slate-700">{t.customerName}</span> ({t.phone})
                    </p>
                  </div>

                  <div className="text-right flex flex-col items-end gap-1 w-full md:w-auto">
                    <span className="text-sm font-bold text-blue-600">
                      {Number(t.finalTotal || 0).toLocaleString('vi-VN')} đ
                    </span>
                    <span className="text-xs text-slate-400">{t.showtime}</span>
                    {t.status !== 'CHECKED_IN' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCheckIn(t.id);
                        }}
                        className="mt-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm cursor-pointer"
                      >
                        Soát vé ngay
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Ticket Detail Panel */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-5 h-fit">
            <h2 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-3">
              Chi Tiết Vé Điện Tử
            </h2>
            {selectedTicket ? (
              <div className="space-y-5">
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Mã đặt vé:</span>
                    <span className="font-mono font-bold text-blue-600">{selectedTicket.ticketCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Khách hàng:</span>
                    <span className="text-slate-800">{selectedTicket.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">SĐT:</span>
                    <span className="text-slate-800">{selectedTicket.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Phim:</span>
                    <span className="font-bold text-slate-900">{selectedTicket.movieTitle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Suất chiếu:</span>
                    <span className="text-slate-800">{selectedTicket.showtime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Phòng chiếu:</span>
                    <span className="text-slate-800">{selectedTicket.room}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Ghế đặt:</span>
                    <span className="font-bold text-amber-600">{selectedTicket.seats}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 pt-2 mt-2">
                    <span className="text-slate-500">Tổng tiền:</span>
                    <span className="font-bold text-blue-600 text-sm">
                      {Number(selectedTicket.finalTotal || 0).toLocaleString('vi-VN')} đ
                    </span>
                  </div>
                </div>

                {/* QR Code Placeholder */}
                <div className="flex flex-col items-center justify-center p-5 bg-white rounded-xl border-2 border-dashed border-slate-300 text-center space-y-2">
                  <span className="material-symbols-outlined text-[72px] text-slate-400">qr_code_2</span>
                  <span className="text-xs font-mono font-bold text-slate-600">{selectedTicket.ticketCode}</span>
                </div>

                <div className="space-y-2">
                  {selectedTicket.status !== 'CHECKED_IN' ? (
                    <button
                      onClick={() => handleCheckIn(selectedTicket.id)}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">check_circle</span>
                      Xác Nhận Soát Vé Vào Rạp
                    </button>
                  ) : (
                    <div className="w-full py-2.5 bg-emerald-50 text-emerald-700 font-semibold text-xs rounded-lg text-center border border-emerald-200">
                      Vé Đã Được Sử Dụng
                    </div>
                  )}
                  <button
                    className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg border border-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">print</span>
                    In Lại Vé Cứng
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 space-y-3">
                <span className="material-symbols-outlined text-5xl text-slate-300">receipt_long</span>
                <p className="text-slate-500 text-xs">Chọn một vé từ danh sách bên trái để xem chi tiết và thực hiện soát vé.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffTicketsPage;
