// [AI UPDATE - Chuyen doi tong the Dashboard Layout sang phong cach Enterprise Office Portal sang sua chuyen nghiep]
import Sidebar from './components/Sidebar';
import DashboardHeader from './components/DashboardHeader';

const DashboardLayout = ({ role, roleLabel, sidebarLinks, children }) => {
  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen font-sans antialiased">
      <Sidebar role={role} links={sidebarLinks} />
      <div className="pl-64">
        <DashboardHeader role={role === 'ADMIN' ? 'Admin User' : 'Cinema Manager'} roleLabel={roleLabel} />
        <main className="relative pt-16 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
