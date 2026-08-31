// [AI UPDATE - Thiet ke lai Sidebar phong cach Enterprise SaaS chuyen nghiep voi mau Navy cong so]
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const Sidebar = ({ role, links }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isManager = role === 'MANAGER';

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-slate-900 border-r border-slate-800 z-50 flex flex-col justify-between">
      {/* Top Section */}
      <div>
        {/* Brand Header */}
        <div className="px-6 py-5 border-b border-slate-800/80 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <span className="material-symbols-outlined text-[20px]">movie_filter</span>
          </div>
          <div>
            <h1 className="font-bold text-white text-sm tracking-tight">CINEMA PORTAL</h1>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-800 text-blue-400 border border-slate-700">
              {isManager ? 'Cinema Manager' : 'Super Admin'}
            </span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-3 space-y-1">
          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Menu Quản Trị
          </div>
          {links.map((link) => {
            const isActive = currentPath === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 font-bold'
                    : 'text-slate-400 hover:bg-slate-800/70 hover:text-slate-100'
                }`}
              >
                <span className={`material-symbols-outlined text-[20px] ${isActive ? 'text-white' : 'text-slate-400'}`}>
                  {link.icon}
                </span>
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="p-3 border-t border-slate-800/80 space-y-2">
        {role === 'ADMIN' && (
          <Link
            to="/staff/pos"
            className="flex items-center justify-center gap-2 w-full px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700 transition-all"
          >
            <span className="material-symbols-outlined text-[18px] text-amber-400">point_of_sale</span>
            Chuyển sang Quầy POS
          </Link>
        )}

        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 w-full px-3 py-2 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">logout</span>
          Đăng xuất
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
