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
 
  Users
} from "lucide-react";
import "../styles/admin/Admin.css";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false); // Start closed on mobile
  const [user, setUser] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
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

  // Check screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false); // Auto close on mobile
      } else {
        setSidebarOpen(true); // Auto open on desktop
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    navigate('/admin/login');
  };

  const menuItems = [
    { path: '/admin/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/admin/gallery', icon: <Image size={20} />, label: 'Gallery' },
    { path: '/admin/blog', icon: <FileText size={20} />, label: 'Blog' },
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

  // Internal CSS for responsive admin layout
  const styles = `
    /* Admin Layout Container */
    .admin-layout {
      display: flex;
      min-height: 100vh;
      background: #f8fafc;
      position: relative;
    }

    /* Sidebar Styles */
    .admin-sidebar {
      width: 280px;
      background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
      color: white;
      display: flex;
      flex-direction: column;
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      z-index: 1000;
      transition: transform 0.3s ease;
      box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
    }

    /* Sidebar Header */
    .sidebar-header {
      padding: 24px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .admin-brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .brand-logo {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #3b82f6, #2563eb);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      font-weight: bold;
      color: white;
      box-shadow: 0 4px 10px rgba(37, 99, 235, 0.3);
    }

    .brand-name {
      font-size: 18px;
      font-weight: 600;
      color: white;
      margin: 0;
    }

    /* Navigation */
    .sidebar-nav {
      flex: 1;
      padding: 24px 16px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      color: rgba(255, 255, 255, 0.7);
      text-decoration: none;
      border-radius: 8px;
      transition: all 0.3s ease;
      position: relative;
    }

    .nav-item:hover {
      background: rgba(255, 255, 255, 0.1);
      color: white;
    }

    .nav-item.active {
      background: rgba(59, 130, 246, 0.2);
      color: white;
    }

    .nav-item.active svg {
      color: #3b82f6;
    }

    .nav-item span {
      flex: 1;
      font-size: 14px;
      font-weight: 500;
    }

    /* Sidebar Footer */
    .sidebar-footer {
      padding: 24px 16px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
    }

    .user-avatar {
      width: 40px;
      height: 40px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-weight: 600;
      color: white;
      border: 2px solid rgba(255, 255, 255, 0.2);
    }

    .user-details {
      flex: 1;
      overflow: hidden;
    }

    .user-name {
      display: block;
      font-size: 14px;
      font-weight: 600;
      color: white;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .user-email {
      display: block;
      font-size: 12px;
      color: rgba(255, 255, 255, 0.6);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .logout-btn {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.2);
      border-radius: 8px;
      color: #ef4444;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .logout-btn:hover {
      background: rgba(239, 68, 68, 0.2);
      transform: translateY(-2px);
    }

    /* Main Content Area */
    .admin-main {
      flex: 1;
      margin-left: 280px;
      min-height: 100vh;
      background: #f8fafc;
      transition: margin-left 0.3s ease;
    }

    /* Header */
    .admin-header {
      background: white;
      padding: 16px 24px;
      display: flex;
      align-items: center;
      gap: 20px;
      border-bottom: 1px solid #e2e8f0;
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
    }

    .menu-toggle {
      display: none;
      background: none;
      border: none;
      color: #64748b;
      cursor: pointer;
      padding: 8px;
      border-radius: 8px;
      transition: all 0.3s ease;
    }

    .menu-toggle:hover {
      background: #f1f5f9;
      color: #1e293b;
    }

    .page-title {
      flex: 1;
      font-size: 20px;
      font-weight: 600;
      color: #1e293b;
      margin: 0;
    }

    .admin-profile {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 12px;
      background: #f8fafc;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .admin-profile:hover {
      background: #f1f5f9;
    }

    .profile-avatar {
      width: 36px;
      height: 36px;
      background: linear-gradient(135deg, #3b82f6, #2563eb);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: 600;
      color: white;
    }

    .profile-name {
      font-size: 14px;
      font-weight: 500;
      color: #1e293b;
    }

    /* Content Area */
    .admin-content {
      padding: 24px;
    }

    /* Loading Screen */
    .loading-screen {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: #f8fafc;
      gap: 16px;
    }

    .loading-spinner {
      width: 48px;
      height: 48px;
      border: 3px solid #e2e8f0;
      border-top-color: #3b82f6;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* Desktop Styles */
    @media (min-width: 769px) {
      .admin-sidebar {
        transform: translateX(0) !important;
      }
      
      .admin-main {
        margin-left: 280px;
      }
    }

    /* Mobile Styles */
    @media (max-width: 768px) {
      .admin-sidebar {
        transform: translateX(-100%);
        width: 260px;
      }
      
      .admin-sidebar.open {
        transform: translateX(0);
      }
      
      .admin-main {
        margin-left: 0;
      }
      
      .menu-toggle {
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .page-title {
        font-size: 16px;
      }
      
      .profile-name {
        display: none;
      }
      
      .admin-profile {
        padding: 6px;
      }
      
      .profile-avatar {
        width: 32px;
        height: 32px;
        font-size: 12px;
      }
      
      .admin-content {
        padding: 16px;
      }
      
      .admin-header {
        padding: 12px 16px;
      }
      
      .brand-name {
        font-size: 16px;
      }
      
      .sidebar-header {
        padding: 20px 16px;
      }
      
      .sidebar-nav {
        padding: 16px 12px;
      }
      
      .nav-item {
        padding: 10px 14px;
      }
      
      .sidebar-footer {
        padding: 20px 16px;
      }
      
      .user-avatar {
        width: 36px;
        height: 36px;
        font-size: 14px;
      }
      
      .user-name {
        font-size: 13px;
      }
      
      .user-email {
        font-size: 11px;
      }
    }

    /* Small Mobile Styles */
    @media (max-width: 480px) {
      .admin-sidebar {
        width: 100%;
        max-width: 280px;
      }
      
      .admin-content {
        padding: 12px;
      }
      
      .page-title {
        font-size: 14px;
      }
      
      .menu-toggle {
        padding: 6px;
      }
      
      .admin-header {
        padding: 10px 12px;
      }
      
      .brand-logo {
        width: 36px;
        height: 36px;
        font-size: 20px;
      }
      
      .brand-name {
        font-size: 15px;
      }
      
      .sidebar-nav {
        padding: 12px 8px;
      }
      
      .nav-item {
        padding: 8px 12px;
        font-size: 13px;
      }
      
      .user-avatar {
        width: 32px;
        height: 32px;
        font-size: 13px;
      }
      
      .logout-btn {
        padding: 10px 14px;
        font-size: 13px;
      }
    }
  `;

  return (
    <>
      <style>{styles}</style>
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
                onClick={() => isMobile && setSidebarOpen(false)}
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
              {/* {location.pathname === '/admin/settings' && 'Settings'} */}
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
    </>
  );
};

export default AdminLayout;