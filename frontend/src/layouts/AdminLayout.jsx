import DashboardLayout from './DashboardLayout';

const ADMIN_LINKS = [
  { path: '/admin/dashboard', icon: 'dashboard', label: 'Dashboard' },
  { path: '/admin/schedule', icon: 'calendar_month', label: 'Schedule' },
  { path: '/admin/movies', icon: 'movie', label: 'Movies' },
  { path: '/admin/users', icon: 'group', label: 'Users' },
  { path: '/admin/reports', icon: 'bar_chart', label: 'Reports' },
];

const AdminLayout = ({ children }) => {
  return (
    <DashboardLayout role="ADMIN" roleLabel="Super Manager" sidebarLinks={ADMIN_LINKS}>
      {children}
    </DashboardLayout>
  );
};

export default AdminLayout;
