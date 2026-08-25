import DashboardLayout from './DashboardLayout';

const STAFF_LINKS = [
  { path: '/staff/pos', icon: 'point_of_sale', label: 'Quick Booking' },
  { path: '/staff/tickets', icon: 'local_activity', label: 'Manage Tickets' },
  { path: '/staff/food', icon: 'fastfood', label: 'Concession Stand' },
];

const StaffLayout = ({ children }) => {
  return (
    <DashboardLayout role="STAFF" roleLabel="Box Office" sidebarLinks={STAFF_LINKS}>
      {children}
    </DashboardLayout>
  );
};

export default StaffLayout;
