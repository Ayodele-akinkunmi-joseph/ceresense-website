import { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Image, 
  FileText, 
  LogOut,
  Menu,
  X,
  ChevronRight,
  Settings,
  Users
} from "lucide-react";
import "../styles/admin/Admin.css";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('accessToken');
    
    if (!userData || !token) {
      navigate('/admin/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    } catch (error) {
      console.error('Error parsing user data:', error);
      handleLogout();
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken'); // Fixed: was adminToken
    localStorage.removeItem('user'); // Fixed: was adminUser
    navigate('/admin/login');
  };

  const menuItems = [
    { path: '/admin/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/admin/gallery', icon: <Image size={20} />, label: 'Gallery' },
    { path: '/admin/blog', icon: <FileText size={20} />, label: 'Blog' },
    { path: '/admin/settings', icon: <Settings size={20} />, label: 'Settings' },
  ];

  // Show loading state while checking auth
  if (!user) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="admin-brand">
            <div className="brand-logo">C</div>
            <h2 className="brand-name">CERESENSE Admin</h2>
          </div>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
              {location.pathname === item.path && <ChevronRight size={16} />}
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {user.fullName?.charAt(0) || user.username?.charAt(0) || 'U'}
            </div>
            <div className="user-details">
              <span className="user-name">{user.fullName || user.username}</span>
              <span className="user-email">{user.email}</span>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-header">
          <button 
            className="menu-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          
          <h1 className="page-title">
            {location.pathname === '/admin/dashboard' && 'Dashboard'}
            {location.pathname === '/admin/gallery' && 'Gallery Management'}
            {location.pathname === '/admin/blog' && 'Blog Management'}
            {location.pathname === '/admin/users' && 'User Management'}
            {location.pathname === '/admin/settings' && 'Settings'}
          </h1>
          
          <div className="admin-profile">
            <div className="profile-avatar">
              {user.fullName?.charAt(0) || user.username?.charAt(0) || 'A'}
            </div>
            <span className="profile-name">{user.fullName || user.username}</span>
          </div>
        </header>

        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;