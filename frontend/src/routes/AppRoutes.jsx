import { Routes, Route, Outlet, Navigate } from 'react-router-dom';
import ClientLayout from '../layouts/ClientLayout';
import AdminLayout from '../layouts/AdminLayout';
import StaffLayout from '../layouts/StaffLayout';
import LandingPage from '../pages/client/LandingPage';
import SearchPage from '../pages/client/SearchPage';
import AdminMoviePage from '../pages/admin/AdminMoviePage';
import StaffPOSPage from '../pages/staff/StaffPOSPage';
import LoginPage from '../pages/auth/LoginPage';
import UserManagementPage from '../pages/admin/UserManagementPage';
import ProtectedRoute from './ProtectedRoute';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<ClientLayout />}>
        <Route index element={<LandingPage />} />
        <Route path="search" element={<SearchPage />} />
      </Route>
      
      <Route path="/login" element={<LoginPage />} />

      {/* Admin Routes - Protected */}
      <Route path="/admin" element={<ProtectedRoute />}>
        <Route element={<AdminLayout><Outlet /></AdminLayout>}>
          <Route path="movies" element={<AdminMoviePage />} />
          <Route path="dashboard" element={<div className="p-xl text-on-surface">Dashboard placeholder</div>} />
          <Route path="schedule" element={<div className="p-xl text-on-surface">Schedule placeholder</div>} />
          <Route path="users" element={<UserManagementPage />} />
          <Route path="reports" element={<div className="p-xl text-on-surface">Reports placeholder</div>} />
        </Route>
      </Route>

      {/* Staff Routes - Protected */}
      <Route path="/staff" element={<ProtectedRoute />}>
        <Route element={<StaffLayout><Outlet /></StaffLayout>}>
          <Route path="pos" element={<StaffPOSPage />} />
        </Route>
      </Route>

      {/* Catch-all route for unknown paths */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
