import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { movieApi } from '../../api/movieApi';

const LandingPage = () => {
  const [activeTab, setActiveTab] = useState('NOW_SHOWING');
  const [nowShowing, setNowShowing] = useState([]);
  const [comingSoon, setComingSoon] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const [resNowShowing, resComingSoon] = await Promise.all([
          movieApi.getAllMovies('NOW_SHOWING'),
          movieApi.getAllMovies('COMING_SOON')
        ]);
        setNowShowing(resNowShowing.data);
        setComingSoon(resComingSoon.data);
      } catch (error) {
        console.error("Lỗi tải danh sách phim", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  const featuredMovie = nowShowing.length > 0 ? nowShowing[0] : (comingSoon.length > 0 ? comingSoon[0] : null);
  const currentMovies = activeTab === 'NOW_SHOWING' ? nowShowing : comingSoon;

  return (
    <>
      {/* Hero Section */}
      {featuredMovie ? (
        <section 
          className="relative w-full min-h-[600px] flex items-center pb-xl pt-[120px] overflow-hidden bg-surface-container" 
        >
          <div 
             className="absolute inset-0 z-0 opacity-40 mix-blend-screen"
             style={{ 
               backgroundImage: `url('${featuredMovie.posterUrl || "https://placehold.co/400x600"}')`, 
               backgroundPosition: 'center', 
               backgroundSize: 'cover',
               filter: 'blur(50px) scale(1.2)'
             }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent z-0 pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent z-0 pointer-events-none md:block hidden"></div>
          
          <div className="relative w-full max-w-container-max mx-auto px-xl flex flex-col-reverse md:flex-row items-center justify-between gap-xl z-10">
            {/* Left: Movie Meta Data & Title */}
            <div className="flex flex-col flex-1 max-w-[42rem] gap-md">
              <div className="flex items-center gap-sm">
                <span className="px-sm py-[2px] bg-primary text-on-primary font-label-caps text-label-caps rounded-sm uppercase tracking-wider">
                   HOT NHẤT HÔM NAY
                </span>
                <span className="px-sm py-[2px] bg-surface-container-high/60 backdrop-blur-md text-on-surface font-label-caps text-label-caps rounded-sm uppercase border border-outline-variant/30">
                  {featuredMovie.ageLimit || 'G'}
                </span>
                <span className="px-sm py-[2px] bg-surface-container-high/60 backdrop-blur-md text-on-surface font-label-caps text-label-caps rounded-sm uppercase border border-outline-variant/30">
                  {featuredMovie.genre || 'Phim rạp'}
                </span>
                <span className="px-sm py-[2px] bg-surface-container-high/60 backdrop-blur-md text-on-surface font-label-caps text-label-caps rounded-sm uppercase border border-outline-variant/30">
                  {featuredMovie.duration} Phút
                </span>
              </div>
              <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-on-background drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)] leading-tight">
                {featuredMovie.title.toUpperCase()}
              </h1>
              <p className="font-body-lg text-body-lg text-on-background/80 max-w-[36rem] line-clamp-3 drop-shadow-md">
                {featuredMovie.description || "Chưa có mô tả cho bộ phim này."}
              </p>
              
              <div className="flex items-center gap-md mt-sm">
                {featuredMovie.status === 'NOW_SHOWING' ? (
                  <button className="group relative px-xl py-sm bg-primary text-white font-button text-button rounded-full overflow-hidden transition-all hover:shadow-[0_0_20px_rgba(229,9,20,0.5)] flex items-center justify-center min-w-[160px]">
                    <span className="relative z-10 flex items-center gap-xs">
                      <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>confirmation_number</span>
                      ĐẶT VÉ NGAY
                    </span>
                    <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300"></div>
                  </button>
                ) : (
                   <button className="group relative px-xl py-sm bg-surface-variant text-on-surface-variant font-button text-button rounded-full overflow-hidden transition-all flex items-center justify-center min-w-[160px]">
                    <span className="relative z-10 flex items-center gap-xs">
                      <span className="material-symbols-outlined text-[20px]">info</span>
                      XEM CHI TIẾT
                    </span>
                  </button>
                )}

                {featuredMovie.trailerUrl && (
                  <button onClick={() => window.open(featuredMovie.trailerUrl, '_blank')} className="group px-lg py-sm bg-surface-container-high/40 backdrop-blur-xl border border-outline-variant/50 hover:border-on-surface hover:bg-surface-container-high/80 text-on-surface font-button text-button rounded-full transition-all flex items-center gap-xs">
                    <span className="material-symbols-outlined text-[24px]">play_circle</span>
                    XEM TRAILER
                  </button>
                )}
              </div>
            </div>

            {/* Right: Poster Image */}
            <div className="flex w-full md:w-[320px] shrink-0 justify-center md:justify-end">
               <img 
                 src={featuredMovie.posterUrl} 
                 alt={featuredMovie.title} 
                 className="w-[200px] md:w-full h-auto object-cover rounded-2xl shadow-[0_15px_50px_rgba(0,0,0,0.8)] border border-outline-variant/20 rotate-0 md:rotate-2 hover:rotate-0 transition-transform duration-500" 
               />
            </div>
          </div>
        </section>
      ) : (
        <section className="w-full h-[60vh] flex items-center justify-center bg-surface-container">
           <h2 className="text-on-surface-variant text-xl">Đang cập nhật danh sách phim mới...</h2>
        </section>
      )}

      {/* Tabs & Grid Section */}
      <section className="max-w-container-max mx-auto px-xl w-full my-xl">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-lg gap-md">
          {/* Tabs */}
          <div className="flex items-center gap-sm border-b border-outline-variant/30 pb-2">
            <button 
              onClick={() => setActiveTab('NOW_SHOWING')}
              className={`font-display-sm text-display-sm transition-colors ${activeTab === 'NOW_SHOWING' ? 'text-primary border-b-2 border-primary pb-1' : 'text-on-surface-variant hover:text-on-surface pb-1'}`}
            >
              PHIM ĐANG CHIẾU
            </button>
            <span className="text-outline-variant">|</span>
            <button 
              onClick={() => setActiveTab('COMING_SOON')}
              className={`font-display-sm text-display-sm transition-colors ${activeTab === 'COMING_SOON' ? 'text-primary border-b-2 border-primary pb-1' : 'text-on-surface-variant hover:text-on-surface pb-1'}`}
            >
              PHIM SẮP CHIẾU
            </button>
          </div>

          <Link to="/" className="hidden md:flex items-center gap-xs font-button text-button text-on-surface hover:text-primary transition-colors">
            Xem toàn bộ lịch chiếu <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </Link>
        </div>

        {/* Movie Card Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-gutter">
          {loading ? (
             <div className="col-span-full py-20 text-center text-on-surface-variant">Đang tải danh sách phim...</div>
          ) : currentMovies.length === 0 ? (
             <div className="col-span-full py-20 text-center text-on-surface-variant">
               {activeTab === 'NOW_SHOWING' ? 'Hiện chưa có phim nào đang chiếu.' : 'Hiện chưa có phim nào sắp chiếu.'}
             </div>
          ) : (
            currentMovies.map((movie) => (
              <article key={movie.id} className="group relative flex flex-col aspect-[2/3] rounded-2xl overflow-hidden cursor-pointer shadow-lg bg-surface-container">
                <img 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  src={movie.posterUrl || "https://placehold.co/400x600?text=No+Poster"} 
                  alt={movie.title} 
                />
                
                {/* Status Tag */}
                <div className="absolute top-sm right-sm z-30">
                  <span className={`px-sm py-xs text-white font-label-caps text-[10px] rounded border shadow-sm flex items-center gap-[4px] ${activeTab === 'NOW_SHOWING' ? 'bg-primary border-red-500' : 'bg-secondary border-orange-500'}`}>
                    {activeTab === 'NOW_SHOWING' && <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>}
                    {activeTab === 'NOW_SHOWING' ? 'HOT' : 'SẮP CHIẾU'}
                  </span>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-md z-10 backdrop-blur-sm">
                  {movie.trailerUrl && (
                    <button onClick={(e) => { e.stopPropagation(); window.open(movie.trailerUrl, '_blank'); }} className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center mb-md transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-[0_0_15px_rgba(229,9,20,0.6)]">
                      <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                    </button>
                  )}
                  {activeTab === 'NOW_SHOWING' ? (
                    <button className="px-md py-sm bg-white/10 hover:bg-white/20 text-white font-button text-button rounded-full border border-white/20 transition-colors transform translate-y-4 group-hover:translate-y-0 delay-75 duration-300">
                      Đặt vé ngay
                    </button>
                  ) : (
                     <button className="px-md py-sm bg-white/10 hover:bg-white/20 text-white font-button text-button rounded-full border border-white/20 transition-colors transform translate-y-4 group-hover:translate-y-0 delay-75 duration-300 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">info</span> Xem chi tiết
                    </button>
                  )}
                </div>

                {/* Info Gradient Bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-[65%] bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none"></div>
                
                {/* Info Content */}
                <div className="absolute bottom-0 left-0 right-0 p-md flex flex-col gap-xs z-20">
                  <div className="flex items-center justify-between">
                    <span className="font-label-caps text-[10px] text-primary uppercase tracking-widest truncate">{movie.genre || "Phim rạp"}</span>
                    <div className="flex items-center gap-[2px] bg-black/50 px-sm py-[2px] rounded-sm backdrop-blur-md shrink-0">
                      <span className="font-label-caps text-label-caps text-white">{movie.ageLimit || 'G'}</span>
                    </div>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-on-background line-clamp-1 group-hover:text-primary transition-colors">{movie.title}</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant text-[14px]">
                    {movie.duration} phút 
                    {movie.releaseDate && ` • ${new Date(movie.releaseDate).toLocaleDateString('vi-VN')}`}
                  </p>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
      
      {/* Promo Section giữ nguyên */}
      <section className="w-full bg-surface-container my-xl border-y border-outline-variant/20 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-secondary-fixed-dim/20 rounded-full blur-[100px] -translate-y-1/2 pointer-events-none mix-blend-screen"></div>
        <div className="max-w-container-max mx-auto flex flex-col md:flex-row items-center relative z-10">
          <div className="w-full md:w-1/2 h-[300px] md:h-[400px] relative bg-surface">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary-fixed-dim/20"></div>
          </div>
          <div className="w-full md:w-1/2 p-xl flex flex-col items-start gap-md">
            <div className="inline-flex items-center gap-xs px-sm py-xs bg-secondary-fixed-dim/10 text-secondary-fixed border border-secondary-fixed-dim/30 rounded-full">
              <span className="material-symbols-outlined text-[16px]">stars</span>
              <span className="font-label-caps text-label-caps uppercase tracking-widest">CineMax VIP Card</span>
            </div>
            <h2 className="font-display-lg-mobile md:text-[40px] font-[800] leading-tight text-on-background">
              Trải nghiệm VIP. <br/>Đẳng cấp hoàng gia.
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-[28rem]">
              Giảm 20% tiền vé trọn đời, ưu tiên chọn ghế VIP không phụ phí, và vô vàn đặc quyền khác dành riêng cho hội viên.
            </p>
            <button className="mt-sm px-lg py-sm bg-secondary-fixed text-on-secondary-fixed font-button text-button rounded-full hover:bg-secondary transition-colors shadow-[0_4px_20px_rgba(233,196,0,0.2)] flex items-center gap-xs">
              Xem Ưu Đãi <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default LandingPage;