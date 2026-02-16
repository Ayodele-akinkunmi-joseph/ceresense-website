import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import AdminLogin from "../pages/admin/AdminLogin";
import AdminRegister from "../pages/admin/AdminRegister";
import AdminForgotPassword from "../pages/admin/AdminForgotPassword";
import AdminDashboard from "../pages/admin/AdminDashboard";
import GalleryManagement from "../pages/admin/GalleryManagement";
import BlogManagement from "../pages/admin/BlogManagement";
import ProtectedRoute from "../components/admin/ProtectedRoute";

const AdminRoutes = () => {
  return (
    <Routes>
      {/* Auth Routes (Public) */}
      <Route path="/login" element={<AdminLogin />} />
      <Route path="/register" element={<AdminRegister />} />
      <Route path="/forgot-password" element={<AdminForgotPassword />} />
      
      {/* Redirect root to login */}
      <Route path="/" element={<Navigate to="/admin/login" replace />} />
      
      {/* Protected Admin Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/gallery" element={<GalleryManagement />} />
          <Route path="/blog" element={<BlogManagement />} />
        </Route>
      </Route>
      
      {/* Catch-all for admin routes */}
      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  );
};

export default AdminRoutes;