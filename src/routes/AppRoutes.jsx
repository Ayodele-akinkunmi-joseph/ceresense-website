// src/routes/AppRoutes.jsx
import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import About from "../pages/About";
import Services from "../pages/Services";
import Gallery from "../pages/Gallery";
import Blog from "../pages/Blog";
import AdminRoutes from "./AdminRoutes";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="services" element={<Services />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="blog" element={<Blog />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin/*" element={<AdminRoutes />} />

      {/* 404 Route */}
      <Route path="*" element={
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h1>404 - Page Not Found</h1>
          <p>The page you're looking for doesn't exist.</p>
          <a href="/">Go back home</a>
        </div>
      } />
    </Routes>
  );
};

export default AppRoutes;