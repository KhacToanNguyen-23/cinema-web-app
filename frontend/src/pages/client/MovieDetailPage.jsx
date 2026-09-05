import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { movieApi } from '../../api/movieApi';
import { showtimeApi } from '../../api/showtimeApi';
import { cinemaApi } from '../../api/cinemaApi';
import { regionApi } from '../../api/regionApi';

// [AI UPDATE - Dinh nghia anh fallback poster mac dinh tranh vo anh khi Cloudinary url bi loi hoac null]
const DEFAULT_POSTER = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80';

const MovieDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [allShowtimes, setAllShowtimes] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [regions, setRegions] = useState([]);
  const [selectedRegionId, setSelectedRegionId] = useState('ALL');
  const [selectedCinemaId, setSelectedCinemaId] = useState('ALL');
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(true);

  // Tao danh sach 7 ngay tiep theo
  const upcomingDates = useMemo(() => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const isoStr = d.toISOString().split('T')[0];
      const dayName = i === 0 ? 'Hom nay' : i === 1 ? 'Ngay mai' : `Thu ${d.getDay() === 0 ? 'CN' : d.getDay() + 1}`;
      const displayDate = `${d.getDate()}/${d.getMonth() + 1}`;
      dates.push({ iso: isoStr, dayName, displayDate });
    }
    return dates;
  }, []);

  useEffect(() => {
    fetchMovieAndShowtimeData();
  }, [id]);

  const fetchMovieAndShowtimeData = async () => {
    try {
      setLoading(true);
      const [movieRes, showtimesRes, cinemasRes, regionsRes] = await Promise.all([
        movieApi.getMovieById(id),
        showtimeApi.getAllShowtimes(),
        cinemaApi.getAllCinemas(),
        regionApi.getAllRegions(),
      ]);

      setMovie(movieRes.data);
      // Loc cac suat chieu cua dung bo phim nay
      const movieShowtimes = (showtimesRes.data || []).filter(
        (st) => String(st.movie?.id) === String(id)
      );
      setAllShowtimes(movieShowtimes);
      setCinemas(cinemasRes.data || []);
      setRegions(regionsRes.data || []);

      // Tu dong chon ngay dau tien co suat chieu
      if (movieShowtimes.length > 0) {
        const firstAvailableDate = movieShowtimes
          .map((st) => st.startTime?.split('T')[0])
          .filter(Boolean)
          .sort()[0];

        if (firstAvailableDate && upcomingDates.some((d) => d.iso === firstAvailableDate)) {
          setSelectedDate(firstAvailableDate);
        } else if (upcomingDates.length > 0) {
          setSelectedDate(upcomingDates[0].iso);
        }
      } else if (upcomingDates.length > 0) {
        setSelectedDate(upcomingDates[0].iso);
      }
    } catch (err) {
      console.error('[MovieDetailPage] Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Dem so luong suat chieu cua tung ngay de hien thi badge
  const showtimeCountByDate = useMemo(() => {
    const counts = {};
    allShowtimes.forEach((st) => {
      if (st.startTime) {
        const d = st.startTime.split('T')[0];
        counts[d] = (counts[d] || 0) + 1;
      }
    });
    return counts;
  }, [allShowtimes]);

  // Loc danh sach Rap thuoc Khu vuc duoc chon
  const filteredCinemasInRegion = useMemo(() => {
    if (selectedRegionId === 'ALL') return cinemas;
    return cinemas.filter((c) => {
      const rId = c.regionId || c.region?.id;
      return String(rId) === String(selectedRegionId);
    });
  }, [cinemas, selectedRegionId]);

  // Reset selectedCinemaId khi doi khu vuc
  useEffect(() => {
    setSelectedCinemaId('ALL');
  }, [selectedRegionId]);

  // Loc suat chieu theo Ngay, Khu vuc va Cum rap
  const filteredShowtimesByCinema = useMemo(() => {
    const map = {};

    // Loc suat chieu khop voi ngay duoc chon
    const matchedShowtimes = allShowtimes.filter((st) => {
      if (!st.startTime) return false;
      const stDate = st.startTime.split('T')[0];
      return stDate === selectedDate;
    });

    matchedShowtimes.forEach((st) => {
      const cId = st.room?.cinema?.id || st.cinemaId || 1;
      const cinemaObj = cinemas.find((c) => c.id === cId) || st.room?.cinema || { id: cId, name: 'Rap CineMax' };

      // Kiem tra bo loc khu vuc
      const rId = cinemaObj.regionId || cinemaObj.region?.id;
      if (selectedRegionId !== 'ALL' && String(rId) !== String(selectedRegionId)) {
        return;
      }

      // Kiem tra bo loc cum rap cu the
      if (selectedCinemaId !== 'ALL' && String(cId) !== String(selectedCinemaId)) {
        return;
      }

      if (!map[cId]) {
        map[cId] = {
          cinema: cinemaObj,
          formats: {}, // [AI UPDATE - Gom theo Dinh dang phien ban phu de / long tieng va loai phong]
        };
      }

      // [AI UPDATE - Phan dinh ro rang 2D Phu de / 2D Long tieng / IMAX 2D]
      let formatLabel = '2D Phụ đề';
      if (st.format === 'TWO_D_DUB') formatLabel = '2D Lồng tiếng';
      else if (st.format === 'IMAX_TWO_D') formatLabel = 'IMAX 2D Phụ đề';
      else if (st.room?.roomType === 'IMAX') formatLabel = 'IMAX 2D';
      else if (st.room?.roomType === 'GOLD_CLASS') formatLabel = 'Gold Class VIP';

      if (!map[cId].formats[formatLabel]) {
        map[cId].formats[formatLabel] = [];
      }
      map[cId].formats[formatLabel].push(st);
    });

    return Object.values(map);
  }, [allShowtimes, selectedDate, selectedRegionId, selectedCinemaId, cinemas]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-on-surface-variant">
        Dang tai thong tin bo phim...
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 text-on-surface">
        <p className="text-xl font-bold">Khong tim thay thong tin phim!</p>
        <Link to="/" className="px-6 py-2 rounded-full bg-primary text-on-primary font-bold text-sm">
          Quay ve trang chu
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-on-surface pb-24">
      {/* 1. Backdrop Hero Section */}
      <div className="relative w-full min-h-[480px] flex items-end pb-12 pt-28 bg-surface-container overflow-hidden">
        <div
          className="absolute inset-0 z-0 opacity-30 mix-blend-screen scale-110 blur-2xl"
          style={{
            backgroundImage: `url('${movie.posterUrl || DEFAULT_POSTER}')`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent z-0" />

        <div className="relative max-w-7xl mx-auto px-6 w-full flex flex-col md:flex-row items-center md:items-end gap-8 z-10">
          {/* Poster Card */}
          <div className="w-52 md:w-64 shrink-0 rounded-2xl overflow-hidden shadow-2xl border border-surface-container-highest">
            {/* [AI UPDATE - Xu ly fallback poster va onError cho anh chi tiet phim] */}
            <img
              src={movie.posterUrl || DEFAULT_POSTER}
              alt={movie.title}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = DEFAULT_POSTER;
              }}
              className="w-full h-auto aspect-[2/3] object-cover"
            />
          </div>

          {/* Movie Meta Info */}
          <div className="flex-1 flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-md bg-primary text-on-primary font-black text-xs uppercase tracking-wider">
                {movie.status === 'NOW_SHOWING' ? 'Dang chieu' : 'Sap chieu'}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-surface-container-highest text-on-surface font-bold text-xs border border-surface-bright">
                {movie.ageLimit || 'P - Moi do tuoi'}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-surface-container-highest text-on-surface font-bold text-xs border border-surface-bright">
                {movie.genre || 'Hanh dong'}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-surface-container-highest text-on-surface font-bold text-xs border border-surface-bright">
                {movie.duration} Phut
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-on-surface leading-tight drop-shadow-md">
              {movie.title}
            </h1>

            <p className="text-sm text-on-surface-variant line-clamp-3 max-w-3xl leading-relaxed mt-1">
              {movie.description || 'Chua co mo ta chi tiet cho bo phim nay.'}
            </p>

            <div className="flex items-center gap-4 mt-3">
              {movie.trailerUrl && (
                <button
                  onClick={() => window.open(movie.trailerUrl, '_blank')}
                  className="px-5 py-2.5 rounded-full bg-surface-container-highest/80 hover:bg-surface-bright text-on-surface font-bold text-xs border border-surface-container-highest flex items-center gap-2 transition-all shadow-md"
                >
                  <span className="material-symbols-outlined text-[18px]">play_circle</span>
                  XEM TRAILER
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Booking Scheduler Section */}
      <div className="max-w-7xl mx-auto px-6 mt-10 flex flex-col gap-6">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-wide flex items-center gap-2 text-on-surface">
            <span className="material-symbols-outlined text-primary text-3xl">calendar_month</span>
            Lich Chieu & Dat Ve
          </h2>
          <p className="text-xs text-on-surface-variant mt-1">
            Chon ngay xem, khu vuc va cum rap CineMax de tien hanh dat ve online.
          </p>
        </div>

        {/* Date Selector Pills with Count Badge */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 custom-scrollbar">
          {upcomingDates.map((item) => {
            const isSelected = selectedDate === item.iso;
            const count = showtimeCountByDate[item.iso] || 0;

            return (
              <button
                key={item.iso}
                onClick={() => setSelectedDate(item.iso)}
                className={`flex flex-col items-center justify-center min-w-[110px] py-3 px-3 rounded-2xl border transition-all duration-200 shadow-sm relative ${
                  isSelected
                    ? 'bg-primary text-on-primary border-primary ring-2 ring-primary/40 shadow-lg shadow-primary/20 scale-105'
                    : 'bg-surface-container border-surface-container-highest text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`}
              >
                <span className="text-[10px] font-semibold uppercase tracking-wider">{item.dayName}</span>
                <span className="text-base font-black mt-0.5">{item.displayDate}</span>
                <span
                  className={`mt-1 text-[9px] font-bold px-2 py-0.5 rounded-full ${
                    count > 0
                      ? isSelected
                        ? 'bg-on-primary text-primary font-black'
                        : 'bg-primary/20 text-primary'
                      : 'bg-surface-container-highest text-on-surface-variant/40'
                  }`}
                >
                  {count > 0 ? `${count} suat` : '0 suat'}
                </span>
              </button>
            );
          })}
        </div>

        {/* Filter Section: Region and Cinema Selectors */}
        <div className="bg-surface-container/40 p-4 rounded-2xl border border-surface-container-highest flex flex-col gap-3">
          {/* 1. Region Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="text-xs font-bold text-on-surface-variant min-w-[80px]">Khu vuc:</span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedRegionId('ALL')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                  selectedRegionId === 'ALL'
                    ? 'bg-primary text-on-primary border-primary shadow-sm'
                    : 'bg-surface-container-highest border-transparent text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Tat ca khu vuc
              </button>
              {regions.map((reg) => (
                <button
                  key={reg.id}
                  onClick={() => setSelectedRegionId(String(reg.id))}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                    selectedRegionId === String(reg.id)
                      ? 'bg-primary text-on-primary border-primary shadow-sm'
                      : 'bg-surface-container-highest border-transparent text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {reg.name}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Specific Cinema Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-2 border-t border-surface-container-highest/40">
            <span className="text-xs font-bold text-on-surface-variant min-w-[80px]">Cum rap:</span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCinemaId('ALL')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                  selectedCinemaId === 'ALL'
                    ? 'bg-on-surface text-background border-on-surface shadow-sm'
                    : 'bg-surface-container-highest border-transparent text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Tat ca rap
              </button>
              {filteredCinemasInRegion.map((cin) => (
                <button
                  key={cin.id}
                  onClick={() => setSelectedCinemaId(String(cin.id))}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                    selectedCinemaId === String(cin.id)
                      ? 'bg-on-surface text-background border-on-surface shadow-sm'
                      : 'bg-surface-container-highest border-transparent text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {cin.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Showtime Grid by Cinema */}
        <div className="flex flex-col gap-6 mt-1">
          {filteredShowtimesByCinema.length === 0 ? (
            <div className="py-16 text-center bg-surface-container/30 rounded-3xl border border-surface-container-highest flex flex-col items-center justify-center gap-3">
              <span className="material-symbols-outlined text-5xl text-on-surface-variant/40">event_busy</span>
              <p className="text-on-surface-variant font-bold text-sm">
                Khong co suat chieu nao vao ngay nay tai khu vuc / cum rap da chon.
              </p>
              <div className="flex items-center gap-2 mt-1">
                {Object.keys(showtimeCountByDate).length > 0 ? (
                  <button
                    onClick={() => {
                      const firstDate = Object.keys(showtimeCountByDate)[0];
                      if (firstDate) {
                        setSelectedDate(firstDate);
                        setSelectedRegionId('ALL');
                        setSelectedCinemaId('ALL');
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-primary text-on-primary font-bold text-xs shadow-md hover:bg-primary-fixed"
                  >
                    Xem cac ngay dang co suat chieu
                  </button>
                ) : (
                  <p className="text-xs text-on-surface-variant/70">
                    Phim nay hien chua duoc len lich chieu tren he thong.
                  </p>
                )}
              </div>
            </div>
          ) : (
            filteredShowtimesByCinema.map(({ cinema, formats }) => (
              <div
                key={cinema.id}
                className="bg-surface-container/60 rounded-3xl p-6 border border-surface-container-highest shadow-md flex flex-col gap-5"
              >
                {/* Cinema Header */}
                <div className="flex items-center justify-between pb-3 border-b border-surface-container-highest/60">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black">
                      <span className="material-symbols-outlined text-[22px]">theaters</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-on-surface">{cinema.name}</h3>
                      <p className="text-xs text-on-surface-variant">{cinema.address || 'Khu vuc rap chieu'}</p>
                    </div>
                  </div>
                </div>

                {/* Formats & Time Buttons */}
                <div className="flex flex-col gap-4">
                  {Object.entries(formats).map(([formatName, showtimes]) => (
                    <div key={formatName} className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <span className="min-w-[130px] text-xs font-black uppercase text-on-surface-variant tracking-wider">
                        {formatName}:
                      </span>
                      <div className="flex flex-wrap gap-2.5">
                        {showtimes.map((st) => {
                          const timeStr = st.startTime
                            ? new Date(st.startTime).toLocaleTimeString('vi-VN', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : 'N/A';

                          return (
                            <button
                              key={st.id}
                              onClick={() => navigate(`/booking/${st.id}`)}
                              className="group px-4 py-2.5 rounded-xl bg-surface-container-highest hover:bg-primary border border-surface-bright hover:border-primary transition-all duration-200 flex flex-col items-center justify-center shadow-sm hover:shadow-lg hover:shadow-primary/30 active:scale-95"
                            >
                              <span className="text-sm font-black text-on-surface group-hover:text-on-primary transition-colors">
                                {timeStr}
                              </span>
                              <span className="text-[10px] text-on-surface-variant group-hover:text-on-primary/90 font-medium transition-colors">
                                {st.price ? `${st.price.toLocaleString('vi-VN')} d` : 'Xem gia'}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetailPage;
