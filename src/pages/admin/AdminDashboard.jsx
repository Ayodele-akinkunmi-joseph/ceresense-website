// src/pages/admin/AdminDashboard.jsx - UPDATED
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

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading-state">
          <Loader2 className="animate-spin" size={48} />
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
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

      Quick Actions
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