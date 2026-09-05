// [AI UPDATE - Dong bo hoa StaffPOSPage sang Enterprise Light Theme chuan SaaS Office Portal]
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { showtimeApi } from '../../api/showtimeApi';
import { movieApi } from '../../api/movieApi';
import { showtimeSeatApi } from '../../api/showtimeSeatApi';
import { useSeatWebSocket } from '../../hooks/useSeatWebSocket';

const SNACKS = [
  { id: 1, name: 'Bap Rang Bo (Vua)', price: 45000, icon: 'local_dining', desc: 'Bap thom mui bo' },
  { id: 2, name: 'Bap Rang Pho Mai (Lon)', price: 65000, icon: 'local_dining', desc: 'Phu sot pho mai dam da' },
  { id: 3, name: 'Nuoc Ngot Pepsi 22oz', price: 30000, icon: 'local_drink', desc: 'Lanh thanh mat' },
  { id: 4, name: 'Combo Solo (1 Bap + 1 Nuoc)', price: 70000, icon: 'fastfood', desc: 'Tiet kiem 10%' },
  { id: 5, name: 'Combo Couple (1 Bap Lon + 2 Nuoc)', price: 110000, icon: 'restaurant', desc: 'Danh cho 2 nguoi' },
];

const TYPE_COLOR = {
  NORMAL: { bg: 'bg-slate-100 hover:bg-slate-200 border border-slate-300', label: 'N', text: 'text-slate-700' },
  VIP: { bg: 'bg-amber-50 hover:bg-amber-100 border border-amber-300', label: 'V', text: 'text-amber-700' },
  COUPLE: { bg: 'bg-pink-50 hover:bg-pink-100 border border-pink-300', label: 'C', text: 'text-pink-700' },
};

const StaffPOSPage = () => {
  const { user } = useAuth();
  const cinemaId = user?.cinemaId;

  const [showtimes, setShowtimes] = useState([]);
  const [movies, setMovies] = useState([]);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [seatList, setSeatList] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [cashGiven, setCashGiven] = useState('');
  const [printTicketModal, setPrintTicketModal] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);

  useEffect(() => {
    fetchInitialData();
  }, [cinemaId]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [showtimesRes, moviesRes] = await Promise.all([
        showtimeApi.getAllShowtimes(cinemaId),
        movieApi.getAllMovies(),
      ]);
      setShowtimes(showtimesRes.data || []);
      setMovies((moviesRes.data || []).filter((m) => m.active || m.isActive));
    } catch (err) {
      console.error('[POS] Failed to fetch showtimes or movies:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSeatsForShowtime = async (showtime) => {
    try {
      setLoading(true);
      setSelectedShowtime(showtime);
      setCartItems([]);
      const res = await showtimeSeatApi.getSeatLayout(showtime.id);
      setSeatList(res.data || []);
    } catch (err) {
      console.error('[POS] Failed to load seat layout:', err);
      alert('Khong the tai so do ghe cua suat chieu nay!');
    } finally {
      setLoading(false);
    }
  };

  const handleSeatMessage = useCallback(
    (event) => {
      setSeatList((prev) =>
        prev.map((s) => {
          if (s.seatId === event.seatId) {
            return {
              ...s,
              status: event.status,
              heldByUserId: event.status === 'HOLDING' ? event.userId : null,
            };
          }
          return s;
        })
      );
    },
    []
  );

  const { sendSeatAction } = useSeatWebSocket(
    selectedShowtime?.id,
    handleSeatMessage,
    user
  );

  const handleSeatClick = (seat) => {
    if (seat.status === 'BOOKED') return;

    const isMine = cartItems.some((i) => i.id === `seat-${seat.seatId}`);

    if (seat.status === 'HOLDING' && !isMine && seat.heldByUserId !== user?.id) {
      alert(`Ghe ${seat.seatName} dang duoc khach hang khac giu!`);
      return;
    }

    if (isMine) {
      sendSeatAction(seat.seatId, seat.seatName, 'AVAILABLE');
      setCartItems((prev) => prev.filter((i) => i.id !== `seat-${seat.seatId}`));
    } else {
      sendSeatAction(seat.seatId, seat.seatName, 'HOLDING');
      setCartItems((prev) => [
        ...prev,
        {
          id: `seat-${seat.seatId}`,
          type: 'TICKET',
          seatId: seat.seatId,
          name: `Ve - Ghe ${seat.seatName} (${seat.type})`,
          price: seat.price,
        },
      ]);
    }
  };

  const handleAddSnack = (snack) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === `snack-${snack.id}`);
      if (existing) {
        return prev.map((i) => (i.id === `snack-${snack.id}` ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { id: `snack-${snack.id}`, type: 'SNACK', snackId: snack.id, name: snack.name, price: snack.price, qty: 1 }];
    });
  };

  const handleRemoveCartItem = (itemId) => {
    const item = cartItems.find((i) => i.id === itemId);
    if (item && item.type === 'TICKET') {
      const seat = seatList.find((s) => s.seatId === item.seatId);
      if (seat) {
        sendSeatAction(seat.seatId, seat.seatName, 'AVAILABLE');
      }
    }
    setCartItems((prev) => prev.filter((i) => i.id !== itemId));
  };

  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, i) => sum + i.price * (i.qty || 1), 0);
  }, [cartItems]);

  const changeMoney = useMemo(() => {
    const given = Number(cashGiven) || 0;
    return given >= subtotal ? given - subtotal : 0;
  }, [cashGiven, subtotal]);

  const handleCheckout = () => {
    if (cartItems.length === 0) return;

    cartItems.forEach((item) => {
      if (item.type === 'TICKET') {
        const seat = seatList.find((s) => s.seatId === item.seatId);
        if (seat) {
          sendSeatAction(seat.seatId, seat.seatName, 'BOOKED');
        }
      }
    });

    const orderData = {
      orderId: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
      showtime: selectedShowtime,
      items: [...cartItems],
      total: subtotal,
      paymentMethod,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    setLastOrder(orderData);
    setPrintTicketModal(true);
    setCartItems([]);
    setCashGiven('');
  };

  const groupedByRow = useMemo(() => {
    const acc = {};
    seatList.forEach((seat) => {
      if (!acc[seat.seatRow]) acc[seat.seatRow] = [];
      acc[seat.seatRow].push(seat);
    });
    return acc;
  }, [seatList]);

  const sortedRows = Object.keys(groupedByRow).sort();

  return (
    <div className="flex flex-col w-full h-[calc(100vh-80px)] overflow-hidden bg-slate-50">
      <div className="flex h-full w-full overflow-hidden">
        {/* Left Panel: Showtimes / Seat Map / Snacks */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {!selectedShowtime ? (
            <div>
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200">
                <div>
                  <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <span className="material-symbols-outlined text-blue-600">point_of_sale</span>
                    Ban Ve Quay POS
                  </h1>
                  <p className="text-slate-500 text-xs mt-0.5">Chon suat chieu de bat dau phuc vu khach hang.</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 font-semibold text-xs border border-blue-200">
                    CUM RAP #{cinemaId || 'N/A'}
                  </span>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-20 text-slate-500 text-xs">Dang tai du lieu suat chieu...</div>
              ) : showtimes.length === 0 ? (
                <div className="text-center py-20 text-slate-500 bg-white rounded-xl border border-slate-200 shadow-sm text-xs">
                  Chua co suat chieu nao hom nay cho cum rap nay.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {showtimes.map((st) => {
                    const movie = movies.find((m) => m.id === st.movie?.id);
                    return (
                      <div
                        key={st.id}
                        onClick={() => fetchSeatsForShowtime(st)}
                        className="group cursor-pointer bg-white hover:bg-blue-50/30 rounded-xl p-4 border border-slate-200 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-start gap-4">
                            <img
                              src={movie?.posterUrl || 'https://via.placeholder.com/150'}
                              alt={movie?.title}
                              className="w-20 h-28 object-cover rounded-lg shadow-sm shrink-0"
                            />
                            <div className="min-w-0">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-50 text-blue-600 border border-blue-200">
                                {st.room?.roomType || '2D'}
                              </span>
                              <h3 className="text-sm font-bold text-slate-900 truncate mt-1.5 group-hover:text-blue-600 transition-colors">
                                {st.movie?.title || 'Phim'}
                              </h3>
                              <p className="text-xs text-slate-500 mt-0.5">{st.room?.name}</p>
                              <p className="text-sm font-bold text-blue-600 mt-2">
                                {st.price?.toLocaleString('vi-VN')} d
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between">
                          <span className="text-xs font-medium text-slate-500">Gio chieu:</span>
                          <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-900 font-bold text-sm border border-slate-200">
                            {st.startTime ? new Date(st.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {/* Top Header of Seat View */}
              <div className="flex items-center justify-between bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setSelectedShowtime(null);
                      setCartItems([]);
                    }}
                    className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                  </button>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">
                      {selectedShowtime.movie?.title} - {selectedShowtime.room?.name}
                    </h2>
                    <p className="text-xs text-slate-500">
                      Suat: {selectedShowtime.startTime ? new Date(selectedShowtime.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : ''} | Gia goc: {selectedShowtime.price?.toLocaleString('vi-VN')} d
                    </p>
                  </div>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-4 flex-wrap text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded bg-slate-100 border border-slate-300"></div>
                    <span className="text-slate-500">Trong</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded bg-blue-600 text-white flex items-center justify-center font-bold text-[10px]">V</div>
                    <span className="text-slate-500">Ban chon</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded bg-amber-400 text-white flex items-center justify-center font-bold text-[10px]">H</div>
                    <span className="text-slate-500">Dang giu (5p)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded bg-slate-300 text-slate-400 flex items-center justify-center font-bold text-[10px]">X</div>
                    <span className="text-slate-500">Da ban</span>
                  </div>
                </div>
              </div>

              {/* Real Seat Map Grid */}
              <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col items-center overflow-x-auto">
                <div className="w-3/4 h-2 rounded-full bg-gradient-to-r from-transparent via-blue-400/60 to-transparent mb-2" />
                <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-6 font-semibold">MAN CHIEU</p>

                <div className="flex flex-col gap-2 min-w-max">
                  {sortedRows.map((rowLabel) => (
                    <div key={rowLabel} className="flex items-center gap-2">
                      <span className="w-6 text-center text-xs font-bold text-slate-400">{rowLabel}</span>
                      <div className="flex gap-1.5">
                        {groupedByRow[rowLabel]
                          .sort((a, b) => a.seatColumn - b.seatColumn)
                          .map((seat) => {
                            const isMine = cartItems.some((i) => i.id === `seat-${seat.seatId}`);
                            const isHoldingByOther = seat.status === 'HOLDING' && !isMine && seat.heldByUserId !== user?.id;
                            const isBooked = seat.status === 'BOOKED';

                            let bgClass = TYPE_COLOR[seat.type]?.bg || 'bg-slate-100 border border-slate-300';
                            let textClass = TYPE_COLOR[seat.type]?.text || 'text-slate-700';

                            if (isBooked) {
                              bgClass = 'bg-slate-200 border border-slate-300 cursor-not-allowed opacity-50';
                              textClass = 'text-slate-400';
                            } else if (isMine) {
                              bgClass = 'bg-blue-600 ring-2 ring-blue-300 shadow-lg shadow-blue-200 border-none';
                              textClass = 'text-white';
                            } else if (isHoldingByOther) {
                              bgClass = 'bg-amber-400 animate-pulse cursor-not-allowed border-none';
                              textClass = 'text-white font-extrabold';
                            }

                            return (
                              <button
                                key={seat.seatId}
                                disabled={isBooked || isHoldingByOther}
                                onClick={() => handleSeatClick(seat)}
                                title={`${seat.seatName} - ${seat.type} - ${seat.price?.toLocaleString('vi-VN')} d`}
                                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all duration-150 relative flex items-center justify-center cursor-pointer ${bgClass} ${textClass}`}
                              >
                                {isBooked ? 'X' : isMine ? 'V' : isHoldingByOther ? 'H' : seat.seatColumn}
                              </button>
                            );
                          })}
                      </div>
                      <span className="w-6 text-center text-xs font-bold text-slate-400">{rowLabel}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* F&B Snacks Section */}
              <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-600 text-[20px]">fastfood</span>
                  Combo Bap Nuoc Uu Dai
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  {SNACKS.map((snack) => (
                    <div
                      key={snack.id}
                      onClick={() => handleAddSnack(snack)}
                      className="cursor-pointer bg-slate-50 hover:bg-blue-50 rounded-xl p-3 border border-slate-200 hover:border-blue-300 transition-all text-center flex flex-col justify-between shadow-sm active:scale-95"
                    >
                      <div>
                        <span className="material-symbols-outlined text-3xl text-amber-500 mb-1">{snack.icon}</span>
                        <p className="text-xs font-bold text-slate-900 line-clamp-1">{snack.name}</p>
                        <p className="text-[10px] text-slate-500 line-clamp-1">{snack.desc}</p>
                      </div>
                      <p className="text-xs font-bold text-blue-600 mt-2">{snack.price.toLocaleString('vi-VN')} d</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel: Cart & Checkout Billing */}
        <div className="w-96 bg-white flex flex-col border-l border-slate-200 shadow-xl z-20">
          <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600 text-[20px]">receipt_long</span>
                Don Hang Hien Tai
              </h2>
              <p className="text-xs text-slate-500">Thu Ngan: {user?.username || 'Staff'}</p>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600 font-semibold text-xs border border-blue-200">
              {cartItems.length} muc
            </span>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
            {cartItems.length === 0 ? (
              <div className="text-center py-20 text-slate-400 text-sm">
                Chua co ve hoac bap nuoc nao duoc chon.
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200"
                >
                  <div className="min-w-0 flex-1 pr-2">
                    <p className="text-xs font-bold text-slate-900 truncate">{item.name}</p>
                    <p className="text-xs text-blue-600 font-bold mt-0.5">
                      {(item.price * (item.qty || 1)).toLocaleString('vi-VN')} d
                      {item.qty > 1 && <span className="text-[10px] text-slate-400 font-normal"> (x{item.qty})</span>}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveCartItem(item.id)}
                    className="p-1 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Checkout Section */}
          <div className="p-5 bg-slate-50 border-t border-slate-200 flex flex-col gap-3">
            <div className="flex justify-between items-end pb-2 border-b border-slate-200">
              <span className="text-xs uppercase font-bold text-slate-500">TONG THANH TOAN</span>
              <span className="text-2xl font-black text-blue-600">{subtotal.toLocaleString('vi-VN')} d</span>
            </div>

            {/* Payment Method Selector */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'CASH', label: 'Tien Mat', icon: 'payments' },
                { id: 'CARD', label: 'The POS', icon: 'credit_card' },
                { id: 'QR', label: 'Quet QR', icon: 'qr_code_2' },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setPaymentMethod(m.id)}
                  className={`py-2 px-1 rounded-xl flex flex-col items-center gap-1 text-xs font-semibold transition-all border cursor-pointer ${
                    paymentMethod === m.id
                      ? 'bg-blue-50 border-blue-300 text-blue-600 shadow-sm'
                      : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">{m.icon}</span>
                  {m.label}
                </button>
              ))}
            </div>

            {/* Cash Given Input */}
            {paymentMethod === 'CASH' && (
              <div className="flex flex-col gap-1 mt-1">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span>Tien khach dua:</span>
                  <input
                    type="number"
                    value={cashGiven}
                    onChange={(e) => setCashGiven(e.target.value)}
                    placeholder="VD: 200000"
                    className="w-28 bg-white rounded-lg px-2 py-1 text-right text-slate-900 font-bold border border-slate-200 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                {Number(cashGiven) > 0 && (
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-600">
                    <span>Tien thoi lai:</span>
                    <span>{changeMoney.toLocaleString('vi-VN')} d</span>
                  </div>
                )}
              </div>
            )}

            <button
              disabled={cartItems.length === 0}
              onClick={handleCheckout}
              className="w-full py-3 mt-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 font-bold text-sm shadow-sm active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">print</span>
              THANH TOAN VA IN VE
            </button>
          </div>
        </div>
      </div>

      {/* Ticket Print Modal */}
      {printTicketModal && lastOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setPrintTicketModal(false)} />
          {/* [AI UPDATE - Fix modal bi co hep que tam bang class max-w-[420px]] */}
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-[420px] border border-slate-200 shadow-2xl flex flex-col gap-4 text-slate-900">
            <div className="text-center pb-3 border-b border-dashed border-slate-300">
              <h3 className="text-lg font-bold text-blue-600 uppercase">Ve Xem Phim CineMax</h3>
              <p className="text-xs text-slate-500">Ma don: {lastOrder.orderId} | {lastOrder.time}</p>
            </div>

            <div className="flex flex-col gap-1.5 text-xs">
              <p><span className="text-slate-500">Phim:</span> <strong className="text-slate-900">{lastOrder.showtime?.movie?.title}</strong></p>
              <p><span className="text-slate-500">Phong:</span> {lastOrder.showtime?.room?.name} ({lastOrder.showtime?.room?.roomType})</p>
              <p><span className="text-slate-500">Gio chieu:</span> {lastOrder.showtime?.startTime ? new Date(lastOrder.showtime.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : ''}</p>
              <div className="mt-2 pt-2 border-t border-slate-200">
                <span className="text-slate-500">Chi tiet:</span>
                {lastOrder.items.map((i) => (
                  <div key={i.id} className="flex justify-between font-semibold text-xs py-0.5">
                    <span>{i.name}</span>
                    <span>{(i.price * (i.qty || 1)).toLocaleString('vi-VN')} d</span>
                  </div>
                ))}
              </div>
              <div className="mt-2 pt-2 border-t border-slate-300 flex justify-between text-sm font-bold text-blue-600">
                <span>TONG TIEN:</span>
                <span>{lastOrder.total.toLocaleString('vi-VN')} d</span>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center py-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="material-symbols-outlined text-5xl text-slate-700 mb-1">qr_code_2</span>
              <span className="text-[10px] tracking-widest text-slate-500 uppercase">{lastOrder.orderId}</span>
            </div>

            <button
              onClick={() => setPrintTicketModal(false)}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-sm cursor-pointer"
            >
              HOAN TAT
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffPOSPage;
