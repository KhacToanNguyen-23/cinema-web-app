import DashboardLayout from './DashboardLayout';
import { useAuth } from '../context/AuthContext';

const ADMIN_LINKS = [
  { path: '/admin/dashboard', icon: 'dashboard', label: 'Dashboard' },
  { path: '/admin/schedule', icon: 'calendar_month', label: 'Schedule' },
  { path: '/admin/movies', icon: 'movie', label: 'Movies', roles: ['ADMIN'] },
  { path: '/admin/cinemas', icon: 'theater_comedy', label: 'Rạp Chiếu', roles: ['ADMIN'] },
  // [AI UPDATE - Mở quyền xem và quản lý Phòng Chiếu cho cả ADMIN và MANAGER]
  { path: '/admin/rooms', icon: 'meeting_room', label: 'Phòng Chiếu', roles: ['ADMIN', 'MANAGER'] },
  { path: '/admin/users', icon: 'group', label: 'Users', roles: ['ADMIN'] },
  { path: '/admin/reports', icon: 'bar_chart', label: 'Reports' },
];

const AdminLayout = ({ children }) => {
  const { user } = useAuth();
  
  const filteredLinks = ADMIN_LINKS.filter(link => {
    if (!link.roles) return true;
    return link.roles.includes(user?.role);
  });

  return (
    <DashboardLayout role={user?.role || "ADMIN"} roleLabel={user?.role === 'MANAGER' ? "Cinema Manager" : "Super Admin"} sidebarLinks={filteredLinks}>
      {children}
    </DashboardLayout>
  );
};

export default AdminLayout;
