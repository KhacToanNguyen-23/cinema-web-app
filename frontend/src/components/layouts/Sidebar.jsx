import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ role, links }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isStaff = role === 'STAFF';

  return (
    <aside className="fixed left-0 top-0 h-full w-72 bg-surface-container-low border-r border-outline-variant z-50 flex flex-col pt-8 pb-8">
      <div className="px-lg mb-10 flex items-center gap-md">
        {/* Thay thế ảnh lỏm bằng icon Material mộc mạc */}
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
          <span className="material-symbols-outlined text-[20px]">movie</span>
        </div>
        <span className={`font-headline-md text-headline-md tracking-tight ${isStaff ? 'text-secondary-fixed' : 'text-primary'}`}>
          {role}
        </span>
      </div>
      
      <nav className="flex-1 px-md flex flex-col gap-xs">
        {links.map((link) => {
          const isActive = currentPath === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center px-md py-md rounded-lg transition-all ${
                isActive
                  ? isStaff 
                    ? 'bg-secondary-container text-on-secondary-container shadow-[0_0_15px_rgba(255,219,60,0.2)]'
                    : 'bg-primary-container text-on-primary-container shadow-[0_0_15px_rgba(229,9,20,0.3)]'
                  : 'text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined mr-md">{link.icon}</span>
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-md pt-lg border-t border-outline-variant flex flex-col gap-sm">
        {role === 'ADMIN' && (
          <Link
            to="/staff/pos"
            className="flex items-center justify-center gap-sm px-md py-md rounded-lg bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-all"
          >
            <span className="material-symbols-outlined">point_of_sale</span>
            Switch to POS
          </Link>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-sm px-md py-md rounded-lg bg-error/10 text-error hover:bg-error/20 transition-all font-button"
        >
          <span className="material-symbols-outlined">logout</span>
          Đăng xuất
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
