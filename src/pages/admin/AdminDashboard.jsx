// src/pages/admin/AdminDashboard.jsx - UPDATED with responsive internal CSS
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Image, 
  FileText, 
  Eye, 
  Calendar,
  Upload,
  Edit,
  BarChart,
  Loader2
} from "lucide-react";
import { galleryApi } from "../../services/api"; 
import "../../styles/admin/Admin.css";

// Add blog API functions
const blogApi = {
  getStats: async () => {
    const token = localStorage.getItem('accessToken');
    const response = await fetch('https://ceresense-backend-2.onrender.com/blog/stats', {
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      }
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  },
  
  getAll: async () => {
    const token = localStorage.getItem('accessToken');
    const response = await fetch('https://ceresense-backend-2.onrender.com/blog', {
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      }
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  }
};

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalImages: 0,
    totalPosts: 0,
    totalViews: 0,
    recentUploads: 0,
    totalBlogViews: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [recentImages, setRecentImages] = useState([]);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        
        console.log("📊 Fetching dashboard stats...");
        
        // Fetch gallery stats
        const galleryStats = await galleryApi.getStats();
        console.log("📊 Gallery stats:", galleryStats);
        
        // Fetch blog stats
        let blogStats = { total: 0, totalViews: 0 };
        try {
          blogStats = await blogApi.getStats();
          console.log("📊 Blog stats:", blogStats);
        } catch (blogErr) {
          console.warn("Could not fetch blog stats:", blogErr);
        }
        
        // Fetch recent blog posts
        let recentBlogsData = [];
        try {
          const blogsResponse = await blogApi.getAll();
          console.log("📊 Blogs response:", blogsResponse);
          
          // Handle response format
          if (Array.isArray(blogsResponse)) {
            recentBlogsData = blogsResponse.slice(0, 3);
          } else if (blogsResponse && Array.isArray(blogsResponse.data)) {
            recentBlogsData = blogsResponse.data.slice(0, 3);
          }
        } catch (blogErr) {
          console.warn("Could not fetch recent blogs:", blogErr);
        }
        
        // Fetch recent gallery images
        let recentImagesData = [];
        try {
          const imagesResponse = await galleryApi.getAll({ limit: 3 });
          console.log("📊 Images response:", imagesResponse);
          
          // Handle response format
          if (Array.isArray(imagesResponse)) {
            recentImagesData = imagesResponse.slice(0, 3);
          } else if (imagesResponse && Array.isArray(imagesResponse.data)) {
            recentImagesData = imagesResponse.data.slice(0, 3);
          } else if (imagesResponse && Array.isArray(imagesResponse.items)) {
            recentImagesData = imagesResponse.items.slice(0, 3);
          }
        } catch (imgErr) {
          console.warn("Could not fetch recent images:", imgErr);
        }
        
        setStats({
          totalImages: galleryStats.total || 0,
          totalPosts: blogStats.total || 0,
          totalViews: (galleryStats.totalViews || 0) + (blogStats.totalViews || 0),
          totalBlogViews: blogStats.totalViews || 0,
          recentUploads: galleryStats.recentUploads || 0
        });
        
        setRecentBlogs(recentBlogsData);
        setRecentImages(recentImagesData);
        
      } catch (error) {
        console.error('❌ Error fetching dashboard stats:', error);
        
        setStats({
          totalImages: 0,
          totalPosts: 0,
          totalViews: 0,
          totalBlogViews: 0,
          recentUploads: 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const statCards = [
    {
      title: 'Gallery Images',
      value: stats.totalImages,
      icon: <Image size={20} />,
      link: '/admin/gallery',
      color: 'blue'
    },
    {
      title: 'Blog Posts',
      value: stats.totalPosts,
      icon: <FileText size={20} />,
      link: '/admin/blog',
      color: 'green'
    },
    {
      title: 'Total Views',
      value: stats.totalViews.toLocaleString(),
      icon: <Eye size={20} />,
      link: '/admin/analytics',
      color: 'purple'
    },
    {
      title: 'Blog Views',
      value: stats.totalBlogViews.toLocaleString(),
      icon: <BarChart size={20} />,
      link: '/admin/blog',
      color: 'orange'
    }
  ];

  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'No date';
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    } catch (err) {
      return 'No date';
    }
  };

  // Internal CSS for responsive dashboard
  const styles = `
    .dashboard {
      max-width: 1400px;
      margin: 0 auto;
      padding: 24px;
    }

    /* Header */
    .dashboard-header {
      margin-bottom: 32px;
    }

    .dashboard-title {
      font-size: 28px;
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 4px;
    }

    .dashboard-subtitle {
      font-size: 14px;
      color: #64748b;
    }

    /* Stats Grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      margin-bottom: 40px;
    }

    .stat-card {
      background: white;
      border-radius: 12px;
      padding: 20px;
      text-decoration: none;
      transition: all 0.3s ease;
      border: 1px solid #e2e8f0;
      display: block;
    }

    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    }

    .stat-card.blue { border-left: 4px solid #3b82f6; }
    .stat-card.green { border-left: 4px solid #10b981; }
    .stat-card.purple { border-left: 4px solid #8b5cf6; }
    .stat-card.orange { border-left: 4px solid #f97316; }

    .stat-header {
      margin-bottom: 12px;
    }

    .stat-icon {
      width: 40px;
      height: 40px;
      background: #f1f5f9;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #3b82f6;
    }

    .stat-content {
      display: flex;
      flex-direction: column;
    }

    .stat-value {
      font-size: 28px;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 4px 0;
    }

    .stat-title {
      font-size: 13px;
      color: #64748b;
      margin: 0;
      font-weight: 500;
    }

    /* Dashboard Sections */
    .dashboard-sections {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 24px;
      margin-bottom: 40px;
    }

    .dashboard-section {
      background: white;
      border-radius: 12px;
      padding: 20px;
      border: 1px solid #e2e8f0;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .section-header h3 {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 16px;
      font-weight: 600;
      color: #1e293b;
      margin: 0;
    }

    .section-link {
      font-size: 13px;
      color: #3b82f6;
      text-decoration: none;
      font-weight: 500;
    }

    .section-link:hover {
      text-decoration: underline;
    }

    /* Items List */
    .items-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .item-card {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background: #f8fafc;
      border-radius: 8px;
      text-decoration: none;
      transition: all 0.3s ease;
    }

    .item-card:hover {
      background: #f1f5f9;
      transform: translateX(4px);
    }

    .item-thumb {
      width: 48px;
      height: 48px;
      border-radius: 6px;
      overflow: hidden;
      background: #e2e8f0;
      flex-shrink: 0;
    }

    .item-thumb img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .thumb-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #94a3b8;
    }

    .item-details {
      flex: 1;
      min-width: 0;
    }

    .item-details h4 {
      font-size: 14px;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 4px 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .item-meta {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 11px;
      color: #64748b;
    }

    .status {
      padding: 2px 8px;
      border-radius: 12px;
      font-weight: 500;
    }

    .status.published {
      background: #d1fae5;
      color: #059669;
    }

    .status.draft {
      background: #f1f5f9;
      color: #64748b;
    }

    .item-views {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      color: #64748b;
    }

    /* Images Grid */
    .images-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
    }

    .image-card {
      text-decoration: none;
    }

    .image-container {
      aspect-ratio: 1;
      border-radius: 8px;
      overflow: hidden;
      position: relative;
    }

    .image-container img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .image-card:hover img {
      transform: scale(1.1);
    }

    .image-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 8px;
      background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
      color: white;
    }

    .image-overlay h4 {
      font-size: 12px;
      font-weight: 600;
      margin: 0 0 2px 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .image-overlay p {
      font-size: 10px;
      opacity: 0.8;
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* Empty States */
    .empty-section {
      text-align: center;
      padding: 40px 20px;
      background: #f8fafc;
      border-radius: 8px;
      color: #94a3b8;
    }

    .empty-section p {
      margin: 12px 0;
    }

    .btn-small {
      display: inline-block;
      padding: 8px 16px;
      background: #3b82f6;
      color: white;
      text-decoration: none;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 500;
    }

    .btn-small:hover {
      background: #2563eb;
    }

    /* Quick Actions */
    .quick-actions {
      background: white;
      border-radius: 12px;
      padding: 24px;
      border: 1px solid #e2e8f0;
    }

    .quick-actions h3 {
      font-size: 18px;
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 20px;
    }

    .actions-grid {
      display: flex;
      gap: 16px;
    }

    .action-card {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 20px;
      background: #f8fafc;
      border-radius: 8px;
      text-decoration: none;
      color: #1e293b;
      transition: all 0.3s ease;
    }

    .action-card:hover {
      background: #f1f5f9;
      transform: translateY(-2px);
    }

    .action-card svg {
      color: #3b82f6;
    }

    .action-card span {
      font-size: 14px;
      font-weight: 500;
    }

    /* Loading State */
    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 400px;
      gap: 16px;
      color: #64748b;
    }

    .animate-spin {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    /* ===== RESPONSIVE STYLES ===== */
    
    /* Tablet (768px - 1024px) */
    @media (max-width: 1024px) {
      .stats-grid {
        gap: 16px;
      }
      
      .stat-value {
        font-size: 24px;
      }
      
      .actions-grid {
        gap: 12px;
      }
      
      .action-card {
        padding: 16px;
      }
    }

    /* Mobile Landscape & Small Tablets (640px - 768px) */
    @media (max-width: 768px) {
      .dashboard {
        padding: 16px;
      }
      
      .dashboard-title {
        font-size: 24px;
      }
      
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
      }
      
      .dashboard-sections {
        grid-template-columns: 1fr;
        gap: 20px;
      }
      
      .actions-grid {
        flex-direction: column;
        gap: 10px;
      }
      
      .action-card {
        width: 100%;
      }
      
      .images-grid {
        grid-template-columns: repeat(3, 1fr);
      }
      
      .quick-actions {
        padding: 20px;
      }
      
      .quick-actions h3 {
        font-size: 16px;
      }
    }

    /* Mobile Portrait (480px - 640px) */
    @media (max-width: 640px) {
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;
      }
      
      .stat-card {
        padding: 15px;
      }
      
      .stat-value {
        font-size: 22px;
      }
      
      .stat-title {
        font-size: 12px;
      }
      
      .images-grid {
        grid-template-columns: repeat(3, 1fr);
        gap: 8px;
      }
      
      .image-overlay h4 {
        font-size: 11px;
      }
      
      .image-overlay p {
        font-size: 9px;
      }
    }

    /* Small Mobile (320px - 480px) */
    @media (max-width: 480px) {
      .dashboard {
        padding: 12px;
      }
      
      .dashboard-title {
        font-size: 22px;
      }
      
      .stats-grid {
        grid-template-columns: 1fr;
        gap: 10px;
      }
      
      .stat-card {
        display: flex;
        align-items: center;
        gap: 16px;
      }
      
      .stat-header {
        margin-bottom: 0;
      }
      
      .stat-content {
        flex: 1;
      }
      
      .stat-value {
        font-size: 24px;
      }
      
      .stat-title {
        font-size: 13px;
      }
      
      .dashboard-section {
        padding: 16px;
      }
      
      .item-card {
        flex-wrap: wrap;
      }
      
      .item-views {
        width: 100%;
        margin-left: 60px;
      }
      
      .images-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      
      .quick-actions {
        padding: 16px;
      }
      
      .action-card {
        padding: 14px;
      }
      
      .action-card span {
        font-size: 13px;
      }
      
      .empty-section {
        padding: 30px 15px;
      }
    }

    /* Extra Small Mobile (below 360px) */
    @media (max-width: 360px) {
      .images-grid {
        grid-template-columns: 1fr;
      }
      
      .image-card {
        max-width: 200px;
        margin: 0 auto;
      }
      
      .item-card {
        flex-direction: column;
        text-align: center;
      }
      
      .item-thumb {
        width: 60px;
        height: 60px;
      }
      
      .item-views {
        margin-left: 0;
        justify-content: center;
      }
      
      .item-meta {
        justify-content: center;
      }
      
      .stat-card {
        flex-direction: column;
        text-align: center;
        gap: 8px;
      }
      
      .stat-icon {
        margin: 0 auto;
      }
    }
  `;

  if (loading) {
    return (
      <div className="dashboard">
        <style>{styles}</style>
        <div className="loading-state">
          <Loader2 className="animate-spin" size={48} />
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <style>{styles}</style>
      
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-subtitle">Welcome back, Admin</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {statCards.map((stat, index) => (
          <Link 
            key={index} 
            to={stat.link}
            className={`stat-card ${stat.color}`}
          >
            <div className="stat-header">
              <div className="stat-icon">
                {stat.icon}
              </div>
            </div>
            <div className="stat-content">
              <h3 className="stat-value">{loading ? 'N/A' : stat.value}</h3>
              <p className="stat-title">{stat.title}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="dashboard-sections">
        {/* Recent Blog Posts */}
        <div className="dashboard-section">
          <div className="section-header">
            <h3>
              <FileText size={18} />
              <span>Recent Blog Posts</span>
            </h3>
            <Link to="/admin/blog" className="section-link">
              View All
            </Link>
          </div>
          
          {recentBlogs.length === 0 ? (
            <div className="empty-section">
              <FileText size={24} />
              <p>No blog posts yet</p>
              <Link to="/admin/blog" className="btn-small">
                Create Post
              </Link>
            </div>
          ) : (
            <div className="items-list">
              {recentBlogs.map((post) => (
                <Link 
                  key={post.id || post._id} 
                  to={`/admin/blog/edit/${post.id || post._id}`}
                  className="item-card"
                >
                  <div className="item-thumb">
                    {post.coverImage ? (
                      <img 
                        src={post.coverImage.startsWith('http') 
                          ? post.coverImage 
                          : `https://ceresense-backend-2.onrender.com${post.coverImage}`} 
                        alt={post.title}
                      />
                    ) : (
                      <div className="thumb-placeholder">
                        <FileText size={16} />
                      </div>
                    )}
                  </div>
                  <div className="item-details">
                    <h4>{post.title || 'Untitled'}</h4>
                    <p className="item-meta">
                      <Calendar size={12} />
                      {formatDate(post.createdAt || post.publishedAt)}
                      <span className={`status ${post.isPublished ? 'published' : 'draft'}`}>
                        {post.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </p>
                  </div>
                  <div className="item-views">
                    <Eye size={14} />
                    {post.views || 0}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent Gallery Images */}
        <div className="dashboard-section">
          <div className="section-header">
            <h3>
              <Image size={18} />
              <span>Recent Gallery Images</span>
            </h3>
            <Link to="/admin/gallery" className="section-link">
              View All
            </Link>
          </div>
          
          {recentImages.length === 0 ? (
            <div className="empty-section">
              <Image size={24} />
              <p>No images yet</p>
              <Link to="/admin/gallery" className="btn-small">
                Upload Image
              </Link>
            </div>
          ) : (
            <div className="images-grid">
              {recentImages.map((image) => (
                <Link 
                  key={image._id || image.id} 
                  to={`/admin/gallery/edit/${image._id || image.id}`}
                  className="image-card"
                >
                  <div className="image-container">
                    <img 
                      src={image.imageUrl?.startsWith('http') 
                        ? image.imageUrl 
                        : `https://ceresense-backend-2.onrender.com${image.imageUrl || ''}`} 
                      alt={image.title}
                    />
                    <div className="image-overlay">
                      <h4>{image.title || 'Untitled'}</h4>
                      <p>{image.category || 'Uncategorized'}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="actions-grid">
          <Link to="/admin/gallery/upload" className="action-card">
            <Upload size={20} />
            <span>Upload Image</span>
          </Link>
          <Link to="/admin/blog/create" className="action-card">
            <Edit size={20} />
            <span>Write Blog Post</span>
          </Link>
          <Link to="/admin/analytics" className="action-card">
            <BarChart size={20} />
            <span>View Analytics</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;