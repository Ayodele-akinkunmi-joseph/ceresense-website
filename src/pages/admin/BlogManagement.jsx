// src/pages/admin/BlogManagement.jsx - FIXED VERSION
import { useState, useEffect } from "react";
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Search, 
  Calendar,
  User,
  MessageCircle,
  TrendingUp,
  X,
  FileText,
  Image as ImageIcon,
  Upload,
  Save,
  ExternalLink,
  CheckCircle,
  Tag,
  Loader2,
  Eye,
  AlertCircle
} from "lucide-react";
import "../../styles/admin/Admin.css";

// API service
const blogApi = {
  getAll: async () => {
    const token = localStorage.getItem('accessToken');
    try {
      const response = await fetch('https://ceresense-backend-2.onrender.com/blog', {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
      }
      
      const data = await response.json();
      console.log("📦 Raw API Response:", data);
      return data;
    } catch (error) {
      console.error('❌ API Error:', error);
      throw error;
    }
  },
  
  create: async (data) => {
    const token = localStorage.getItem('accessToken');
    try {
      const response = await fetch('https://ceresense-backend-2.onrender.com/blog', {
        method: 'POST',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('❌ API Error:', error);
      throw error;
    }
  },
  
  update: async (id, data) => {
    const token = localStorage.getItem('accessToken');
    try {
      const response = await fetch(`https://ceresense-backend-2.onrender.com/blog/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('❌ API Error:', error);
      throw error;
    }
  },
  
  delete: async (id) => {
    const token = localStorage.getItem('accessToken');
    try {
      const response = await fetch(`https://ceresense-backend-2.onrender.com/blog/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('❌ API Error:', error);
      throw error;
    }
  }
};

const BlogManagement = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "Web Development",
    tags: "",
    isPublished: true
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  const categories = [
    "Web Development",
    "React",
    "JavaScript",
    "Design",
    "Education",
    "Technology",
    "Tutorials",
    "News"
  ];

  // Fetch blog posts on component mount
  useEffect(() => {
    fetchBlogPosts();
  }, []);

  // Fetch blog posts from API
  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      setError("");
      
      const response = await blogApi.getAll();
      console.log("📦 API Response:", response);
      
      // Handle response - check if it's an array or has data property
      let postsData = [];
      if (Array.isArray(response)) {
        postsData = response;
      } else if (response && Array.isArray(response.data)) {
        postsData = response.data;
      } else if (response && response.posts && Array.isArray(response.posts)) {
        postsData = response.posts;
      } else {
        console.warn("Unexpected response format:", response);
        postsData = [];
      }
      
      console.log("📦 Posts data:", postsData);
      
      // DEBUG: Check isPublished values
      postsData.forEach((post, index) => {
        console.log(`📦 Post ${index} (${post.title}): isPublished =`, post.isPublished);
      });
      
      setPosts(postsData);
      setRetryCount(0); // Reset retry count on success
      
    } catch (err) {
      console.error('❌ Error fetching blog posts:', err);
      
      // User-friendly error messages
      if (err.message?.includes('Failed to fetch') || err.message?.includes('NetworkError')) {
        setError('Unable to connect to server. Please check your internet connection.');
      } else if (err.message?.includes('401')) {
        setError('Authentication failed. Please log in again.');
        // Redirect to login after 2 seconds
        setTimeout(() => {
          window.location.href = '/admin/login';
        }, 2000);
      } else if (err.message?.includes('403')) {
        setError('Access forbidden. You do not have permission to view blog posts.');
      } else if (err.message?.includes('404')) {
        setError('Blog endpoint not found. Please check API configuration.');
      } else if (err.message?.includes('CORS')) {
        setError('CORS error. Server is not configured to accept requests from this domain.');
      } else {
        setError(`Failed to load blog posts: ${err.message}`);
      }
      
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    // Validation
    if (!formData.title.trim()) {
      alert('Please enter a title');
      return;
    }
    
    if (!formData.excerpt.trim()) {
      alert('Please enter an excerpt');
      return;
    }
    
    setUploading(true);

    try {
      // Prepare post data
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const postData = {
        title: formData.title.trim(),
        excerpt: formData.excerpt.trim(),
        content: formData.content.trim() || "Content coming soon...",
        category: formData.category,
        tags: tagsArray,
        readTime: "5 min read",
        isPublished: editingPost ? formData.isPublished : true, // Force true for new posts
        coverImage: imagePreview || null,
        author: {
          name: "Admin",
          role: "Editor"
        }
      };

      console.log("📤 Sending data:", postData);

      if (editingPost) {
        // Update existing post
        await blogApi.update(editingPost.id, postData);
        alert('✅ Post updated successfully!');
      } else {
        // Create new post
        await blogApi.create(postData);
        alert('✅ Post created successfully!');
      }

      // Refresh the posts list
      await fetchBlogPosts();
      resetForm();
      
    } catch (err) {
      console.error('❌ Error saving post:', err);
      
      if (err.message?.includes('401')) {
        setError('Authentication failed. Please log in again.');
        setTimeout(() => {
          window.location.href = '/admin/login';
        }, 2000);
      } else {
        setError(err.message || 'Failed to save post');
      }
    } finally {
      setUploading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      category: "Web Development",
      tags: "",
      isPublished: true
    });
    setImagePreview(null);
    setShowCreateForm(false);
    setEditingPost(null);
    setError("");
  };

  // Handle edit
  const handleEdit = (post) => {
    console.log("✏️ Editing post:", post);
    setEditingPost(post);
    setFormData({
      title: post.title || "",
      excerpt: post.excerpt || "",
      content: post.content || "",
      category: post.category || "Web Development",
      tags: (post.tags && Array.isArray(post.tags)) ? post.tags.join(', ') : "",
      isPublished: post.isPublished !== false
    });
    if (post.coverImage) {
      // Handle image URL formatting
      const fullUrl = post.coverImage.startsWith('http') 
        ? post.coverImage 
        : post.coverImage.startsWith('/') 
          ? `https://ceresense-backend-2.onrender.com${post.coverImage}`
          : post.coverImage;
      setImagePreview(fullUrl);
    }
    setShowCreateForm(true);
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }

    try {
      await blogApi.delete(id);
      alert('✅ Post deleted successfully!');
      fetchBlogPosts();
    } catch (err) {
      console.error('❌ Error deleting post:', err);
      
      if (err.message?.includes('401')) {
        alert('Authentication failed. Please log in again.');
        window.location.href = '/admin/login';
      } else {
        alert(`Failed to delete post: ${err.message}`);
      }
    }
  };

  // Format date
  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'No date';
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (err) {
      return 'Invalid Date';
    }
  };

  // Get status text and color
  const getStatusInfo = (isPublished) => {
    if (isPublished === true) {
      return { text: 'Published', color: 'green', icon: '🚀' };
    }
    return { text: 'Draft', color: 'gray', icon: '📝' };
  };

  // Toggle publish status
  const togglePublish = async (post) => {
    try {
      const newStatus = !post.isPublished;
      await blogApi.update(post.id, {
        ...post,
        isPublished: newStatus
      });
      alert(`✅ Post ${newStatus ? 'published' : 'unpublished'} successfully!`);
      fetchBlogPosts();
    } catch (err) {
      console.error('❌ Error toggling publish status:', err);
      alert('Failed to update post status');
    }
  };

  if (loading && posts.length === 0) {
    return (
      <div className="management-page">
        <div className="loading-state">
          <Loader2 className="animate-spin" size={48} />
          <p>Loading blog posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="management-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <FileText size={24} />
            <span>Blog Management</span>
          </h1>
          <p className="page-subtitle">Manage your blog posts ({posts.length} posts)</p>
        </div>
        <button 
          className="primary-btn"
          onClick={() => {
            setEditingPost(null);
            resetForm();
            setShowCreateForm(true);
          }}
          disabled={uploading}
        >
          <Plus size={18} />
          <span>New Post</span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-banner">
          <AlertCircle size={18} />
          <span>{error}</span>
          <button onClick={() => setError("")} className="error-close">
            <X size={16} />
          </button>
          {error.includes('connection') && (
            <button onClick={fetchBlogPosts} className="retry-btn">
              Retry
            </button>
          )}
        </div>
      )}

      {/* Create/Edit Form Modal */}
      {showCreateForm && (
        <div className="modal-overlay">
          <div className="modal-content large">
            <div className="modal-header">
              <h3>
                {editingPost ? '✏️ Edit Post' : '📝 Create New Post'}
              </h3>
              <button 
                className="modal-close"
                onClick={resetForm}
                disabled={uploading}
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="modal-form">
              {/* Title */}
              <div className="form-section">
                <label className="form-label">
                  <FileText size={18} />
                  <span>Title *</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter post title"
                  className="form-input"
                  required
                  disabled={uploading}
                />
              </div>

              {/* Excerpt */}
              <div className="form-section">
                <label className="form-label">
                  <Tag size={18} />
                  <span>Excerpt *</span>
                </label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  placeholder="Brief description of your post"
                  className="form-input"
                  rows="2"
                  required
                  disabled={uploading}
                />
              </div>

              {/* Content */}
              <div className="form-section">
                <label className="form-label">
                  <Edit2 size={18} />
                  <span>Content</span>
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="Write your post content here..."
                  className="form-input"
                  rows="6"
                  disabled={uploading}
                />
              </div>

              {/* Category & Tags */}
              <div className="form-row">
                <div className="form-section half">
                  <label className="form-label">
                    <Tag size={18} />
                    <span>Category *</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                    disabled={uploading}
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="form-section half">
                  <label className="form-label">
                    <Tag size={18} />
                    <span>Tags</span>
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    placeholder="web, development, tutorial"
                    className="form-input"
                    disabled={uploading}
                  />
                  <small className="help-text">Comma separated</small>
                </div>
              </div>

              {/* Cover Image Preview */}
              {imagePreview && (
                <div className="form-section">
                  <label className="form-label">
                    <ImageIcon size={18} />
                    <span>Cover Image Preview</span>
                  </label>
                  <div className="image-preview">
                    <img src={imagePreview} alt="Cover preview" />
                    <button
                      type="button"
                      className="remove-image"
                      onClick={() => setImagePreview(null)}
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* Publish Status - Only show for editing */}
              {editingPost && (
                <div className="form-section">
                  <label className="form-label">
                    <CheckCircle size={18} />
                    <span>Publish Status</span>
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="isPublished"
                      checked={formData.isPublished}
                      onChange={handleInputChange}
                      disabled={uploading}
                    />
                    <span>Published (visible to visitors)</span>
                  </label>
                </div>
              )}

              {/* Form Actions */}
              <div className="form-actions">
                <button 
                  type="button" 
                  className="secondary-btn"
                  onClick={resetForm}
                  disabled={uploading}
                >
                  <X size={18} />
                  <span>Cancel</span>
                </button>
                <button 
                  type="submit" 
                  className="primary-btn"
                  disabled={uploading}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      <span>{editingPost ? 'Updating...' : 'Creating...'}</span>
                    </>
                  ) : editingPost ? (
                    <>
                      <Save size={18} />
                      <span>Update Post</span>
                    </>
                  ) : (
                    <>
                      <Plus size={18} />
                      <span>Create Post</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Posts Table */}
      {posts.length === 0 && !loading ? (
        <div className="empty-state">
          <FileText size={48} />
          <h3>📭 No blog posts yet</h3>
          <p>Start by creating your first blog post</p>
          <button 
            className="primary-btn"
            onClick={() => setShowCreateForm(true)}
          >
            <Plus size={18} />
            <span>Create First Post</span>
          </button>
        </div>
      ) : (
        <div className="table-container">
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>IMAGE</th>
                  <th>DETAILS</th>
                  <th>CATEGORY</th>
                  <th>STATUS</th>
                  <th>DATE</th>
                  <th>STATS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => {
                  const status = getStatusInfo(post.isPublished);
                  return (
                    <tr key={post.id} className="table-row">
                      <td className="image-cell">
                        <div className="table-image">
                          {post.coverImage ? (
                            <img 
                              src={
                                post.coverImage.startsWith('http') 
                                  ? post.coverImage 
                                  : post.coverImage.startsWith('/') 
                                    ? `https://ceresense-backend-2.onrender.com${post.coverImage}`
                                    : post.coverImage
                              } 
                              alt={post.title}
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/100x75/3b82f6/ffffff?text=Blog';
                              }}
                            />
                          ) : (
                            <div className="image-placeholder">
                              <FileText size={24} />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="details-cell">
                        <div className="details-content">
                          <h4>{post.title || 'Untitled'}</h4>
                          <p className="post-excerpt">{post.excerpt || 'No excerpt'}</p>
                          <div className="post-author">
                            <User size={12} />
                            <span>{post.author?.name || post.author?.fullName || 'Admin'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="category-cell">
                        <span className="category-badge">
                          {post.category || 'Uncategorized'}
                        </span>
                      </td>
                      <td className="status-cell">
                        <button 
                          className={`status-badge ${status.color}`}
                          onClick={() => togglePublish(post)}
                          title={`Click to ${post.isPublished ? 'unpublish' : 'publish'}`}
                        >
                          {status.icon} {status.text}
                        </button>
                      </td>
                      <td className="date-cell">
                        <Calendar size={14} />
                        <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                      </td>
                      <td className="stats-cell">
                        <div className="stat-icons">
                          <span title="Views">
                            <Eye size={14} /> {post.views || 0}
                          </span>
                          <span title="Comments">
                            <MessageCircle size={14} /> {post.commentsCount || 0}
                          </span>
                          <span title="Likes">
                            <TrendingUp size={14} /> {post.likes || 0}
                          </span>
                        </div>
                      </td>
                      <td className="actions-cell">
                        <div className="action-buttons">
                          <button 
                            className="action-btn view"
                            onClick={() => window.open(`/blog/${post.id}`, '_blank')}
                            title="View Post"
                          >
                            <ExternalLink size={16} />
                          </button>
                          <button 
                            className="action-btn edit"
                            onClick={() => handleEdit(post)}
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            className="action-btn delete"
                            onClick={() => handleDelete(post.id)}
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogManagement;