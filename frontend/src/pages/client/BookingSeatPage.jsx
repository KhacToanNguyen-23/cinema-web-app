import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { showtimeApi } from '../../api/showtimeApi';
import { showtimeSeatApi } from '../../api/showtimeSeatApi';
import { useSeatWebSocket } from '../../hooks/useSeatWebSocket';

const TYPE_CONFIG = {
  NORMAL: { name: 'Ghe Thuong', color: 'bg-surface-container-highest border-surface-bright text-on-surface' },
  VIP: { name: 'Ghe VIP', color: 'bg-amber-900/60 border-amber-600/40 text-amber-300' },
  COUPLE: { name: 'Ghe Doi', color: 'bg-pink-900/60 border-pink-600/40 text-pink-300' },
};

const BookingSeatPage = () => {
  const { showtimeId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [showtime, setShowtime] = useState(null);
  const [seatList, setSeatList] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(300); // 5 phut = 300s
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    fetchShowtimeAndSeats();
  }, [showtimeId]);

  // Dem nguoc thoi gian giu ghe 5 phut
  useEffect(() => {
    if (selectedSeats.length === 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          alert('Het thoi gian giu ghe (5 phut). Cac ghe da duoc nha tu dong!');
          // Nha tat ca ghe cua minh
          selectedSeats.forEach((s) => sendSeatAction(s.seatId, s.seatName, 'AVAILABLE'));
          setSelectedSeats([]);
          return 300;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [selectedSeats]);

  const fetchShowtimeAndSeats = async () => {
    try {
      setLoading(true);
      const [stRes, seatsRes] = await Promise.allSettled([
        showtimeApi.getShowtimeById(showtimeId),
        showtimeSeatApi.getSeatLayout(showtimeId),
      ]);

      if (stRes.status === 'fulfilled') {
        setShowtime(stRes.value.data);
      }
      if (seatsRes.status === 'fulfilled') {
        setSeatList(seatsRes.value.data || []);
      }
    } catch (err) {
      console.error('[BookingSeatPage] Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };


  // Lang nghe WebSocket Realtime tu Server
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
    showtimeId,
    handleSeatMessage,
    user
  );

  const handleSeatClick = (seat) => {
    if (seat.status === 'BOOKED') return;

    const isMine = selectedSeats.some((s) => s.seatId === seat.seatId);

    // Neu ghe dang bi nguoi khac giu
    if (seat.status === 'HOLDING' && !isMine && seat.heldByUserId !== user?.id) {
      alert(`Ghe ${seat.seatName} dang duoc nguoi khac chon giu!`);
      return;
    }

    if (isMine) {
      // Nha ghe
      sendSeatAction(seat.seatId, seat.seatName, 'AVAILABLE');
      setSelectedSeats((prev) => prev.filter((s) => s.seatId !== seat.seatId));
    } else {
      // Giu toi da 8 ghe moi lan
      if (selectedSeats.length >= 8) {
        alert('Ban chi duoc chon toi da 8 ghe cho mot lan dat ve!');
        return;
      }
      // Giu ghe
      sendSeatAction(seat.seatId, seat.seatName, 'HOLDING');
      setSelectedSeats((prev) => [...prev, seat]);
      setCountdown(300); // Reset ve 5 phut khi chon them ghe
    }
  };

  const handleConfirmBooking = () => {
    // Chuyen tat ca ghe sang BOOKED
    selectedSeats.forEach((s) => {
      sendSeatAction(s.seatId, s.seatName, 'BOOKED');
    });
    setBookingSuccess(true);
  };

  const totalAmount = useMemo(() => {
    return selectedSeats.reduce((sum, s) => sum + s.price, 0);
  }, [selectedSeats]);

  const groupedByRow = useMemo(() => {
    const acc = {};
    seatList.forEach((seat) => {
      if (!acc[seat.seatRow]) acc[seat.seatRow] = [];
      acc[seat.seatRow].push(seat);
    });
    return acc;
  }, [seatList]);

  const sortedRows = Object.keys(groupedByRow).sort();

  const formatSeconds = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-on-surface-variant">
        Dang khoi tao so do ghe phong chieu...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-on-surface pb-36 pt-20 flex flex-col">
      {/* Top Showtime Header Bar */}
      <div className="bg-surface-container/80 backdrop-blur-xl border-b border-surface-container-highest py-4 px-6 sticky top-[64px] z-30 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-xl bg-surface-container-highest hover:bg-surface-bright text-on-surface transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </button>
            <div>
              <h1 className="text-xl font-black text-on-surface truncate">
                {showtime?.movie?.title || 'Phim'}
              </h1>
              <p className="text-xs text-on-surface-variant mt-0.5">
                {showtime?.room?.cinema?.name} • {showtime?.room?.name} ({showtime?.room?.roomType}) • Suat:{' '}
                {showtime?.startTime
                  ? new Date(showtime.startTime).toLocaleTimeString('vi-VN', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : 'N/A'}
              </p>
            </div>
          </div>

          {/* Countdown Timer Badge */}
          {selectedSeats.length > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-xs self-start md:self-auto shadow-sm">
              <span className="material-symbols-outlined text-[18px] animate-spin">timer</span>
              <span>Thoi gian giu ghe:</span>
              <span className="text-sm font-black text-amber-300 font-mono">{formatSeconds(countdown)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Screen Area & Seat Layout */}
      <div className="flex-1 max-w-6xl mx-auto px-4 w-full flex flex-col items-center mt-8">
        {/* Curved Screen Lighting */}
        <div className="w-full max-w-3xl flex flex-col items-center mb-12">
          <div className="w-full h-3 rounded-full bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_35px_rgba(229,9,20,0.6)] mb-2" />
          <p className="text-[11px] font-black uppercase tracking-[0.3em] text-on-surface-variant">
            MAN HINH CHIEU PHIM
          </p>
        </div>

        {/* Real Seat Map Grid */}
        <div className="bg-surface-container/30 rounded-3xl p-8 border border-surface-container-highest shadow-2xl flex flex-col items-center overflow-x-auto w-full max-w-4xl custom-scrollbar">
          <div className="flex flex-col gap-2.5 min-w-max">
            {sortedRows.map((rowLabel) => (
              <div key={rowLabel} className="flex items-center gap-3">
                <span className="w-6 text-center text-xs font-black text-on-surface-variant">{rowLabel}</span>
                <div className="flex gap-2">
                  {groupedByRow[rowLabel]
                    .sort((a, b) => a.seatColumn - b.seatColumn)
                    .map((seat) => {
                      const isMine = selectedSeats.some((s) => s.seatId === seat.seatId);
                      const isHoldingByOther =
                        seat.status === 'HOLDING' && !isMine && seat.heldByUserId !== user?.id;
                      const isBooked = seat.status === 'BOOKED';

                      let styleClass =
                        'bg-surface-container-highest hover:bg-surface-bright border-surface-bright text-on-surface';

                      if (seat.type === 'VIP') {
                        styleClass = 'bg-amber-900/50 hover:bg-amber-800/60 border-amber-500/40 text-amber-300';
                      } else if (seat.type === 'COUPLE') {
                        styleClass = 'bg-pink-900/50 hover:bg-pink-800/60 border-pink-500/40 text-pink-300';
                      }

                      if (isBooked) {
                        styleClass =
                          'bg-[#1a1a1a] border-[#2a2a2a] text-on-surface-variant/20 cursor-not-allowed opacity-40 shadow-none';
                      } else if (isMine) {
                        styleClass =
                          'bg-primary border-primary text-on-primary ring-2 ring-primary-fixed shadow-lg shadow-primary/40 scale-105';
                      } else if (isHoldingByOther) {
                        styleClass =
                          'bg-amber-500 border-amber-400 text-black font-black animate-pulse cursor-not-allowed shadow-md';
                      }

                      return (
                        <button
                          key={seat.seatId}
                          disabled={isBooked || isHoldingByOther}
                          onClick={() => handleSeatClick(seat)}
                          title={`${seat.seatName} • ${seat.type} • ${seat.price?.toLocaleString('vi-VN')} d`}
                          className={`w-9 h-9 rounded-xl text-xs font-bold transition-all duration-150 border flex items-center justify-center shadow-sm ${styleClass}`}
                        >
                          {isBooked ? '✕' : isMine ? '✓' : isHoldingByOther ? 'H' : seat.seatColumn}
                        </button>
                      );
                    })}
                </div>
                <span className="w-6 text-center text-xs font-black text-on-surface-variant">{rowLabel}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-8 p-4 bg-surface-container/60 rounded-2xl border border-surface-container-highest text-xs">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-lg bg-surface-container-highest border border-surface-bright" />
            <span className="text-on-surface-variant">Thuong</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-lg bg-amber-900/60 border border-amber-500/40" />
            <span className="text-amber-300 font-medium">VIP</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-lg bg-pink-900/60 border border-pink-500/40" />
            <span className="text-pink-300 font-medium">Ghe Doi</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-lg bg-primary text-on-primary flex items-center justify-center font-bold text-[10px]">
              ✓
            </div>
            <span className="text-on-surface font-bold">Ban dang chon</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-lg bg-amber-500 text-black flex items-center justify-center font-bold text-[10px]">
              H
            </div>
            <span className="text-on-surface-variant">Nguoi khac giu (5p)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-lg bg-[#1a1a1a] text-on-surface-variant/30 flex items-center justify-center font-bold text-[10px]">
              ✕
            </div>
            <span className="text-on-surface-variant">Da ban</span>
          </div>
        </div>
      </div>

      {/* Bottom Sticky Summary Checkout Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-surface-container-lowest/95 backdrop-blur-2xl border-t border-surface-container-highest p-4 z-40 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="hidden sm:block w-12 h-16 rounded-xl overflow-hidden shadow-md shrink-0">
              <img
                src={showtime?.movie?.posterUrl || 'https://placehold.co/100x150'}
                alt={showtime?.movie?.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="text-sm font-bold text-on-surface">
                {showtime?.movie?.title}
              </p>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Ghe da chon:{' '}
                {selectedSeats.length === 0 ? (
                  <span className="italic text-on-surface-variant/60">Chua chon ghe nao</span>
                ) : (
                  <strong className="text-primary font-black">
                    {selectedSeats.map((s) => s.seatName).join(', ')}
                  </strong>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Tong cong</span>
              <span className="text-xl sm:text-2xl font-black text-primary font-mono">
                {totalAmount.toLocaleString('vi-VN')} d
              </span>
            </div>

            <button
              disabled={selectedSeats.length === 0}
              onClick={() => setShowConfirmModal(true)}
              className="px-8 py-3.5 rounded-2xl bg-primary text-on-primary hover:bg-primary-fixed font-black text-sm shadow-xl shadow-primary/30 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              TIIEP TUC DAT VE
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-xl"
            onClick={() => !bookingSuccess && setShowConfirmModal(false)}
          />
          <div className="relative bg-surface rounded-3xl p-6 w-full max-w-md border border-surface-container-highest shadow-2xl flex flex-col gap-5 text-on-surface">
            {!bookingSuccess ? (
              <>
                <div className="text-center pb-3 border-b border-surface-container-highest">
                  <h3 className="text-xl font-black text-on-surface uppercase">Xac Nhan Dat Ve</h3>
                  <p className="text-xs text-on-surface-variant mt-1">Vui long kiem tra lai thong tin suat chieu</p>
                </div>

                <div className="flex flex-col gap-2 text-xs bg-surface-container/60 p-4 rounded-2xl border border-surface-container-highest">
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Phim:</span>
                    <strong className="text-on-surface">{showtime?.movie?.title}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Rap chieu:</span>
                    <span>{showtime?.room?.cinema?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Phong:</span>
                    <span>{showtime?.room?.name} ({showtime?.room?.roomType})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Gio chieu:</span>
                    <span>
                      {showtime?.startTime
                        ? new Date(showtime.startTime).toLocaleTimeString('vi-VN', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : ''}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-surface-container-highest">
                    <span className="text-on-surface-variant">Danh sach ghe:</span>
                    <strong className="text-primary font-bold">
                      {selectedSeats.map((s) => s.seatName).join(', ')}
                    </strong>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-surface-container-highest text-sm font-black text-primary">
                    <span>Tong thanh toan:</span>
                    <span>{totalAmount.toLocaleString('vi-VN')} d</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowConfirmModal(false)}
                    className="flex-1 py-3 rounded-xl bg-surface-container-highest hover:bg-surface-bright font-bold text-xs"
                  >
                    Chon lai
                  </button>
                  <button
                    onClick={handleConfirmBooking}
                    className="flex-1 py-3 rounded-xl bg-primary text-on-primary font-bold text-xs shadow-lg shadow-primary/20"
                  >
                    Xac nhan & Thanh toan
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center text-center gap-4 py-4">
                <div className="w-16 h-16 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center font-bold text-2xl">
                  ✓
                </div>
                <div>
                  <h3 className="text-xl font-black text-on-surface">Dat Ve Thanh Cong!</h3>
                  <p className="text-xs text-on-surface-variant mt-1">
                    Ve cua ban da duoc giu va xac nhan tren he thong CineMax.
                  </p>
                </div>

                <button
                  onClick={() => navigate('/')}
                  className="w-full py-3 rounded-xl bg-primary text-on-primary font-bold text-xs shadow-md mt-2"
                >
                  Ve Trang Chu
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingSeatPage;
