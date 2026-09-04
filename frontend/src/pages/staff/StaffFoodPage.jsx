// [AI UPDATE - Trang Quầy Bắp Nước cho Staff - UI Only, chuẩn Enterprise Light Theme]
import { useState } from 'react';

const StaffFoodPage = () => {
  const [snackItems, setSnackItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [loading, setLoading] = useState(false);

  const categories = ['Tất cả', 'Combo', 'Bắp', 'Nước'];

  const filteredItems = snackItems.filter(
    (item) => selectedCategory === 'Tất cả' || item.category === selectedCategory
  );

  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const updateQty = (id, delta) => {
    setCart((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, qty: i.qty + delta } : i))
        .filter((i) => i.qty > 0)
    );
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    // TODO: Gọi API tạo đơn hàng bắp nước
    alert(`Thanh toán thành công! Tổng tiền: ${totalPrice.toLocaleString('vi-VN')} đ`);
    setCart([]);
  };

  return (
    <div className="flex flex-col w-full relative min-h-full pb-16 bg-slate-50">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-8 py-6 bg-white border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-600">fastfood</span>
            Quầy Bắp Nước (Concession Stand)
          </h1>
          <p className="text-slate-500 text-xs mt-0.5">
            Bán lẻ bắp ngọt, đồ uống và các combo suất ăn nhanh tại quầy dịch vụ
          </p>
        </div>
      </div>

      <div className="p-8 space-y-6">
        {/* Category Pills */}
        <div className="flex items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Snack Catalog */}
          <div className="lg:col-span-2">
            {loading ? (
              <div className="bg-white p-16 rounded-xl border border-slate-200 shadow-sm text-center text-slate-500 text-xs">
                Đang tải thực đơn...
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="bg-white p-16 rounded-xl border border-slate-200 shadow-sm text-center space-y-3">
                <span className="material-symbols-outlined text-5xl text-slate-300">fastfood</span>
                <p className="text-slate-500 text-sm">Chưa có dữ liệu thực đơn.</p>
                <p className="text-slate-400 text-xs">Hệ thống sẽ hiển thị danh sách bắp nước khi API được kết nối.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => addToCart(item)}
                    className="bg-white p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer flex items-center gap-4 group"
                  >
                    <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200 group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-[22px]">{item.icon || 'fastfood'}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-900 text-xs group-hover:text-blue-600 transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-xs mt-0.5 font-bold text-blue-600">
                        {Number(item.price || 0).toLocaleString('vi-VN')} đ
                      </p>
                    </div>
                    <button
                      type="button"
                      className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition-all font-bold text-sm"
                    >
                      +
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart & Billing */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-5 h-fit">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h2 className="text-sm font-bold text-slate-900">Đơn Hàng Bắp Nước</h2>
              <span className="text-[11px] font-semibold px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full border border-blue-200">
                {cart.reduce((acc, i) => acc + i.qty, 0)} món
              </span>
            </div>

            {cart.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <span className="material-symbols-outlined text-5xl text-slate-300">shopping_cart</span>
                <p className="text-slate-500 text-xs">Chưa chọn món nào từ thực đơn.</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200"
                  >
                    <div className="flex-1 pr-3">
                      <h4 className="text-xs font-bold text-slate-900">{item.name}</h4>
                      <span className="text-xs text-blue-600 font-bold">
                        {(item.price * item.qty).toLocaleString('vi-VN')} đ
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => updateQty(item.id, -1)}
                        className="w-6 h-6 rounded bg-white hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs border border-slate-200 cursor-pointer"
                      >
                        -
                      </button>
                      <span className="w-6 text-center text-xs font-bold text-slate-900">{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.id, 1)}
                        className="w-6 h-6 rounded bg-blue-600 text-white flex items-center justify-center font-bold text-xs cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="border-t border-slate-200 pt-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-medium">Tổng tiền bắp nước:</span>
                <span className="font-bold text-blue-600 text-base">
                  {totalPrice.toLocaleString('vi-VN')} đ
                </span>
              </div>

              <button
                disabled={cart.length === 0}
                onClick={handleCheckout}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-semibold text-xs rounded-lg transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">payments</span>
                Thanh Toán & In Hóa Đơn
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffFoodPage;
