import { Routes, Route, Outlet, Navigate } from 'react-router-dom';
import ClientLayout from '../layouts/ClientLayout';
import AdminLayout from '../layouts/AdminLayout';
import StaffLayout from '../layouts/StaffLayout';
import LandingPage from '../pages/client/LandingPage';
import SearchPage from '../pages/client/SearchPage';
import MovieDetailPage from '../pages/client/MovieDetailPage';
import BookingSeatPage from '../pages/client/BookingSeatPage';
import AdminMoviePage from '../pages/admin/AdminMoviePage';
import AdminShowtimePage from '../pages/admin/AdminShowtimePage';
import AdminCinemaPage from '../pages/admin/AdminCinemaPage';
import AdminRoomPage from '../pages/admin/AdminRoomPage';
import AdminSeatPage from '../pages/admin/AdminSeatPage';
import StaffPOSPage from '../pages/staff/StaffPOSPage';
import StaffTicketsPage from '../pages/staff/StaffTicketsPage';
import StaffFoodPage from '../pages/staff/StaffFoodPage';
import LoginPage from '../pages/auth/LoginPage';
import UserManagementPage from '../pages/admin/UserManagementPage';
import ProtectedRoute from './ProtectedRoute';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<ClientLayout />}>
        <Route index element={<LandingPage />} />
        <Route path="search" element={<SearchPage />} />
        {/* [AI UPDATE - Dang ky route Chi tiet phim & Dat ve Realtime cho Khach hang Online] */}
        <Route path="movies/:id" element={<MovieDetailPage />} />
        <Route path="booking/:showtimeId" element={<BookingSeatPage />} />
      </Route>

      
      <Route path="/login" element={<LoginPage />} />

      {/* Admin Routes - Protected */}
      <Route path="/admin" element={<ProtectedRoute />}>
        <Route element={<AdminLayout><Outlet /></AdminLayout>}>
          <Route path="movies" element={<AdminMoviePage />} />
          <Route path="dashboard" element={<div className="p-xl text-on-surface">Dashboard placeholder</div>} />
          <Route path="schedule" element={<AdminShowtimePage />} />
          <Route path="cinemas" element={<AdminCinemaPage />} />
          {/* [AI UPDATE - Thêm route quản lý phòng chiếu và sơ đồ ghế] */}
          <Route path="rooms" element={<AdminRoomPage />} />
          <Route path="rooms/:roomId/seats" element={<AdminSeatPage />} />
          <Route path="users" element={<UserManagementPage />} />
          <Route path="reports" element={<div className="p-xl text-on-surface">Reports placeholder</div>} />
        </Route>
      </Route>

      {/* Staff Routes - Protected */}
      <Route path="/staff" element={<ProtectedRoute />}>
        <Route element={<StaffLayout><Outlet /></StaffLayout>}>
          <Route path="pos" element={<StaffPOSPage />} />
          {/* [AI UPDATE - Đăng ký route Quản lý vé & Quầy Bắp Nước cho Staff POS Box Office] */}
          <Route path="tickets" element={<StaffTicketsPage />} />
          <Route path="food" element={<StaffFoodPage />} />
        </Route>
      </Route>

      {/* Catch-all route for unknown paths */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
