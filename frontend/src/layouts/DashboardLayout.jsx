import Sidebar from '../components/layouts/Sidebar';
import DashboardHeader from '../components/layouts/DashboardHeader';

const DashboardLayout = ({ role, roleLabel, sidebarLinks, children }) => {
  return (
    <div className="bg-background font-body-md text-on-background">
      <Sidebar role={role} links={sidebarLinks} />
      <div className="pl-72">
        <DashboardHeader role={role === 'ADMIN' ? 'Admin User' : 'Staff Member'} roleLabel={roleLabel} />
        <main className="relative pt-20 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
