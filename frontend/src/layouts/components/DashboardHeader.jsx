// [AI UPDATE - Thiet ke lai Topbar Header phong cach Office Portal sang sua va ro net]
import { useAuth } from '@/context/AuthContext';

const DashboardHeader = ({ role = 'Admin', roleLabel = 'Super Manager' }) => {
  const { user } = useAuth();

  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 z-40 flex items-center justify-between px-8 shadow-sm">
      {/* Left Title */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-bold text-slate-800 tracking-tight">Hệ Thống Quản Trị Rạp</span>
        <span className="text-slate-300">/</span>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
          {user?.cinema?.name || (user?.role === 'MANAGER' ? 'Cụm Rạp Quản Lý' : 'Toàn Hệ Thống')}
        </span>
      </div>

      {/* Right User Actions */}
      <div className="flex items-center gap-4">
        {/* User Info */}
        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-slate-900 leading-tight">{user?.username || role}</p>
            <p className="text-[11px] text-slate-500">{roleLabel}</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
            {(user?.username || role).charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
