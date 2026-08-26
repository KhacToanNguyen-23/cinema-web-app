import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { setLoginModalOpen, user, logout } = useAuth();
  
  return (
    <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.15)]">
      <div className="h-20 w-full max-w-[1440px] mx-auto px-xl flex items-center justify-between">
        <div className="flex items-center gap-md">
          <img
            alt="CineMax Logo"
            className="h-8 w-auto object-contain"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCvgg4Wp22jeCWvGm7j5FrWuV9C-uvktLjp2ovGPx-G0r2HdOQ2mFzJvCHwf8w2za9LIo88snmW7BpglMbUYw_CHEgMv3PAxmuMMl3rlzllLdn_ufPtKhO7ATJVZyP73g8TGAr0gOcyAVML12RXVNs5xeQKTMBtBbSIE7UHN6JnERF2Lbl1PvUKPGItJShOhNEoqiEuuLvLsHi_QjXs5TeaiT9Az72MMGFksd2c--ny21fcSFOKPiwY"
          />
          <span className="font-headline-md text-headline-md text-primary tracking-tight">CINEMAX</span>
        </div>
        <nav className="hidden md:flex items-center gap-lg">
          <Link to="/" className="transition-colors text-primary font-bold">Phim</Link>
          <Link to="/" className="font-label-caps text-label-caps text-on-surface-variant hover:text-on-surface transition-colors">Rạp Chiếu</Link>
          <Link to="/" className="font-label-caps text-label-caps text-on-surface-variant hover:text-on-surface transition-colors">Khuyến Mãi</Link>
          <Link to="/" className="font-label-caps text-label-caps text-on-surface-variant hover:text-on-surface transition-colors">Vé Của Tôi</Link>
        </nav>
        <div className="flex items-center gap-md">
          <button className="p-sm rounded-full hover:bg-surface-container-high transition-colors text-on-surface flex items-center justify-center">
            <span className="material-symbols-outlined">search</span>
          </button>
          
          {user ? (
            <div className="flex items-center gap-sm relative group cursor-pointer">
              <span className="font-button text-button text-on-surface hidden md:block">Hi, {user.sub}</span>
              <img
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover border border-outline-variant hover:border-primary transition-all"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBTMsUEmGtPdMF_gwvJ5ts5876BsR82radlltDGJbwAeb_4_-Wt8_IPKMqHu47PD0QxIftJwz9gHscc_k-6pxaWXQtSy6lgMfsL3rJ_gc45hcnH4RtLf67-e_f4otS6yLdBj_iTsDm9otfGYugPvI1PQABAecylVrlS-uiSktq7KIab9zPOypdDLw4sUVGTTWwo14eCBqw797fzPd_aC_V16sHEVgUXLRQMZANuaU-Q6klq9dFCyqmJ"
              />
              <div className="absolute right-0 top-full mt-2 w-48 bg-surface-container-high rounded-xl shadow-xl border border-outline-variant/30 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col overflow-hidden">
                <button className="px-md py-sm text-left hover:bg-surface-bright text-on-surface text-sm transition-colors">Trang Cá Nhân</button>
                {/* [AI UPDATE - Thêm nút truy cập trang Quản trị] */}
                {(user.role === 'ADMIN' || user.role === 'MANAGER') && (
                  <Link to="/admin/dashboard" className="px-md py-sm text-left hover:bg-surface-bright text-on-surface text-sm transition-colors">
                    Vào trang Quản trị
                  </Link>
                )}
                <button onClick={logout} className="px-md py-sm text-left hover:bg-surface-bright text-error text-sm transition-colors">Đăng xuất</button>
              </div>
            </div>
          ) : (
            <button 
              onClick={() => setLoginModalOpen(true)} 
              className="text-on-surface-variant hover:text-primary transition-colors font-button text-button cursor-pointer"
            >
              Đăng nhập / Đăng ký
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
