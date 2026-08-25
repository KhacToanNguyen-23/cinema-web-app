import { useNavigate } from 'react-router-dom';

const DashboardHeader = ({ role = 'Admin', roleLabel = 'Super Manager' }) => {
  return (
    <header className="fixed top-0 left-72 right-0 h-20 bg-surface/80 backdrop-blur-xl z-40 flex items-center justify-between px-xl shadow-[0_1px_8px_rgba(0,0,0,0.1)]">
      <div className="flex items-center gap-md">
        <span className="material-symbols-outlined text-[32px] text-primary">movie_filter</span>
        <h2 className="text-title-lg font-title-lg text-on-surface">Cinema Management</h2>
      </div>
      
      <div className="flex items-center gap-xl">
        <div className="flex items-center gap-sm bg-surface-container-low px-md py-sm rounded-full border border-outline-variant">
          <span className="material-symbols-outlined text-on-surface-variant text-[20px]">search</span>
          <input 
            type="text" 
            placeholder="Search..." 
            className="bg-transparent border-none outline-none text-body-md text-on-surface w-48 placeholder:text-on-surface-variant/50"
          />
        </div>
        
        <div className="flex items-center gap-md">
          <span className="material-symbols-outlined text-on-surface-variant hover:text-primary cursor-pointer transition-colors relative">
            notifications
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-error rounded-full"></span>
          </span>
          <span className="material-symbols-outlined text-on-surface-variant hover:text-primary cursor-pointer transition-colors">
            settings
          </span>
        </div>
        <div className="flex items-center gap-md ml-auto">
          <div className="text-right hidden sm:block">
            <p className="text-body-md font-bold text-on-surface">{role}</p>
            <p className="text-xs text-on-surface-variant">{roleLabel}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-title-md border-2 border-primary cursor-pointer hover:scale-105 transition-transform">
            {role.charAt(0)}
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
