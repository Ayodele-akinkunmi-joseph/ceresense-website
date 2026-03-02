import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Calendar, Clock, User, MessageCircle, Heart, Bookmark, 
  Share2, Send, Sparkles, TrendingUp, ThumbsUp, ThumbsDown, 
  Smile, Eye, ArrowLeft, Loader2, Tag, Award
} from "lucide-react";
import { blogApi } from "../services/api";
import "../styles/Blog.css";

// ==================== BLOG LISTING PAGE ====================

const BlogListingPage = ({ onPostSelect }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uiReady, setUiReady] = useState(false);

  useEffect(() => {
    setUiReady(true);
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await blogApi.getAll();
      
      // Handle response format
      const postsData = response.data || response;
      setPosts(Array.isArray(postsData) ? postsData : []);
      
    } catch (err) {
      console.error('Error fetching blog posts:', err);
      
      // User-friendly error messages
      if (err.message?.includes('Network Error') || err.code === 'ERR_NETWORK') {
        setError('Unable to connect to server. Please check your internet connection.');
      } else if (err.message?.includes('CORS')) {
        setError('Server configuration issue. Please contact support.');
      } else if (err.response?.status === 403) {
        setError('Access forbidden. Please check your permissions.');
      } else if (err.response?.status === 404) {
        setError('Blog endpoint not found.');
      } else {
        setError(err.response?.data?.message || err.message || 'Failed to load blog posts');
      }
      
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  // Show skeleton UI while loading
  if (!uiReady || (loading && posts.length === 0)) {
    return (
      <div className="blog-page">
        {/* Hero Section */}
        <section className="blog-hero">
          <div className="blog-hero-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="blog-hero-content"
            >
              <div className="hero-badge">
                <Sparkles size={20} />
                <span>CERESENSE INSIGHTS</span>
              </div>
              <h1 className="blog-hero-title">
                Tech Insights & Innovations
              </h1>
              <p className="blog-hero-description">
                Loading insightful content...
              </p>
            </motion.div>
          </div>
        </section>

        {/* Skeleton Grid */}
        <section className="blog-listing">
          <div className="listing-container">
            <div className="listing-header">
              <h2 className="listing-title">Latest Articles</h2>
              <p className="listing-subtitle">
                Please wait while we load the latest content
              </p>
            </div>
            <div className="blog-cards-grid skeleton-grid">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="blog-card skeleton">
                  <div className="skeleton-image"></div>
                  <div className="skeleton-content"></div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="blog-page">
      {/* Hero Section */}
      <section className="blog-hero">
        <div className="blog-hero-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="blog-hero-content"
          >
            <div className="hero-badge">
              <Sparkles size={20} />
              <span>CERESENSE INSIGHTS</span>
            </div>
            <h1 className="blog-hero-title">
              Tech Insights & Innovations
            </h1>
            <p className="blog-hero-description">
              Expert perspectives on technology, education, and the future of learning
            </p>
          </motion.div>
        </div>
      </section>

      {/* Blog Listing Section */}
      <section className="blog-listing">
        <div className="listing-container">
          {error && (
            <div className="api-error">
              <p>⚠️ {error}</p>
              <button onClick={fetchBlogPosts} className="retry-btn">
                Try Again
              </button>
            </div>
          )}
          
          <div className="listing-header">
            <h2 className="listing-title">Latest Articles</h2>
            <p className="listing-subtitle">
              Discover thought-provoking content from industry experts
            </p>
          </div>

          {posts.length === 0 && !loading && !error ? (
            <div className="no-posts">
              <p>No blog posts available yet.</p>
              <p>Check back soon for new articles!</p>
            </div>
          ) : (
            <div className="blog-cards-grid">
              {posts.map((post, index) => (
                <motion.article
                  key={post._id || post.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="blog-card"
                  onClick={() => onPostSelect(post._id || post.id)}
                >
                  {/* Card Image */}
                  <div className="card-image">
                    <img 
                      src={post.coverImage ? (
                        post.coverImage.startsWith('http') 
                          ? post.coverImage 
                          : `https://ceresense-backend-2.onrender.com${post.coverImage}`
                      ) : "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"} 
                      alt={post.title}
                      className="card-img"
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80";
                      }}
                    />
                    <div className="card-category">
                      <TrendingUp size={14} />
                      <span>{post.category || "General"}</span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="card-content">
                    <div className="card-meta">
                      <div className="meta-item">
                        <Calendar size={14} />
                        <span>{formatDate(post.createdAt || post.publishedAt || post.date)}</span>
                      </div>
                      <div className="meta-item">
                        <Clock size={14} />
                        <span>{post.readTime || "5 min read"}</span>
                      </div>
                      <div className="meta-item">
                        <Eye size={14} />
                        <span>{post.views?.toLocaleString() || 0}</span>
                      </div>
                    </div>

                    <h3 className="card-title">{post.title || "Untitled Article"}</h3>
                    <p className="card-excerpt">{post.excerpt || post.description || "Read this interesting article..."}</p>

                    <div className="card-author">
                      <div className="author-info">
                        <User size={14} />
                        <span>{post.author?.fullName || post.author?.name || "CERESENSE Team"}</span>
                      </div>
                      <div className="author-role">{post.author?.role || "Author"}</div>
                    </div>

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="card-tags">
                        {post.tags.slice(0, 3).map((tag, idx) => (
                          <span key={idx} className="tag">
                            <Tag size={12} />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Card Footer */}
                    <div className="card-footer">
                      <div className="card-stats">
                        <div className="stat">
                          <Heart size={14} />
                          <span>{post.likes || post.likeCount || 0}</span>
                        </div>
                      </div>
                      <button className="read-btn">
                        Read Article
                      </button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="blog-cta">
        <div className="cta-container">
          <div className="cta-content">
            <h2 className="cta-title">Stay Updated</h2>
            <p className="cta-description">
              Subscribe to never miss the latest insights and tutorials
            </p>
            <div className="cta-stats">
              <div className="cta-stat">
                <Award size={24} />
                <div>
                  <h3>{posts.length || 0}</h3>
                  <p>Articles</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// ==================== BLOG DETAIL PAGE ====================

const BlogDetailPage = ({ postId, onBack }) => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reactions, setReactions] = useState({
    likes: 0,
    thumbsUp: 0,
    thumbsDown: 0,
    bookmarks: 0
  });
  const [userReactions, setUserReactions] = useState({
    liked: false,
    thumbsUp: false,
    thumbsDown: false,
    bookmarked: false
  });

  useEffect(() => {
    if (postId) {
      fetchBlogPost(postId);
    }
  }, [postId]);

  const fetchBlogPost = async (postId) => {
    try {
      setLoading(true);
      setError(null);
      
      const postResponse = await blogApi.getById(postId);
      const postData = postResponse.data || postResponse;
      
      setPost(postData);
      
      setReactions({
        likes: postData.likes || postData.likeCount || 0,
        thumbsUp: 0,
        thumbsDown: 0,
        bookmarks: 0
      });
      
    } catch (error) {
      console.error('Error fetching blog post:', error);
      
      if (error.message?.includes('Network Error')) {
        setError('Unable to connect to server. Please check your internet connection.');
      } else if (error.response?.status === 404) {
        setError('Article not found.');
      } else {
        setError('Failed to load article. Please try again.');
      }
      
      setPost(null);
    } finally {
      setLoading(false);
    }
  };

  const handleReaction = async (reactionType) => {
    if (!post) return;
    
    setUserReactions(prev => ({
      ...prev,
      [reactionType]: !prev[reactionType]
    }));

    setReactions(prev => ({
      ...prev,
      [reactionType]: prev[reactionType] + 
        (userReactions[reactionType] ? -1 : 1)
    }));

    if (reactionType === 'liked') {
      try {
        await blogApi.like(post._id || post.id);
      } catch (error) {
        console.error('Error saving reaction:', error);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="blog-loading">
        <Loader2 className="animate-spin" size={48} />
        <p>Loading article...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="blog-page">
        <div className="post-error">
          <h3>{error || 'Article not found'}</h3>
          <p>{error ? 'Please try again.' : 'The article you\'re looking for doesn\'t exist or has been removed.'}</p>
          <button 
            className="back-button" 
            onClick={onBack}
          >
            <ArrowLeft size={20} />
            Back to Articles
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-page">
      {/* Hero Section for Detail Page */}
      <section className="blog-hero blog-detail-hero">
        <div className="blog-hero-container">
          <div className="blog-hero-content">
            <div className="hero-badge">
              <TrendingUp size={20} />
              <span>{post.category || "General"}</span>
            </div>
            <h1 className="blog-hero-title">{post.title}</h1>
            <p className="blog-hero-description">{post.excerpt || post.description}</p>
          </div>
        </div>
      </section>

      {/* Blog Detail Content */}
      <section className="blog-detail">
        <div className="detail-container">
          {/* Back Button */}
          <button 
            className="back-button" 
            onClick={onBack}
          >
            <ArrowLeft size={20} />
            Back to Articles
          </button>

          {/* Article Section */}
          <article className="blog-article">
            {/* Cover Image */}
            {post.coverImage && (
              <div className="article-cover">
                <img 
                  src={post.coverImage.startsWith('http') 
                    ? post.coverImage 
                    : `https://ceresense-backend-2.onrender.com${post.coverImage}`} 
                  alt={post.title}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}

            {/* Article Header */}
            <div className="article-header">
              <div className="article-meta">
                <div className="meta-item">
                  <Calendar size={16} />
                  <span>{formatDate(post.createdAt || post.publishedAt || post.date)}</span>
                </div>
                <div className="meta-item">
                  <Clock size={16} />
                  <span>{post.readTime || "5 min read"}</span>
                </div>
                <div className="meta-item">
                  <User size={16} />
                  <span>{post.author?.fullName || post.author?.name || "CERESENSE Team"}</span>
                </div>
              </div>
            </div>

            {/* Article Content */}
            <div className="article-content">
              {post.content ? (
                post.content.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="content-paragraph">
                    {paragraph}
                  </p>
                ))
              ) : (
                <p className="content-paragraph">
                  This article is currently being written. Please check back soon!
                </p>
              )}
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="article-tags">
                {post.tags.map((tag, index) => (
                  <span key={index} className="tag">
                    <Tag size={14} />
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Reactions Bar */}
            <div className="reactions-bar">
              <div className="reactions-stats">
                <div className="reaction-group">
                  <button 
                    className={`reaction-btn ${userReactions.liked ? 'active' : ''}`}
                    onClick={() => handleReaction('liked')}
                  >
                    <Heart size={20} />
                    <span>{reactions.likes}</span>
                  </button>
                  
                  <button 
                    className={`reaction-btn ${userReactions.thumbsUp ? 'active' : ''}`}
                    onClick={() => handleReaction('thumbsUp')}
                  >
                    <ThumbsUp size={20} />
                    <span>{reactions.thumbsUp}</span>
                  </button>
                  
                  <button 
                    className={`reaction-btn ${userReactions.thumbsDown ? 'active' : ''}`}
                    onClick={() => handleReaction('thumbsDown')}
                  >
                    <ThumbsDown size={20} />
                    <span>{reactions.thumbsDown}</span>
                  </button>
                </div>

                <div className="action-group">
                  <button 
                    className={`action-btn ${userReactions.bookmarked ? 'active' : ''}`}
                    onClick={() => handleReaction('bookmarked')}
                  >
                    <Bookmark size={20} />
                    <span>Save</span>
                  </button>
                  
                  <button className="action-btn">
                    <Share2 size={20} />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
};

// ==================== MAIN BLOG COMPONENT ====================

const Blog = () => {
  const [view, setView] = useState('listing');
  const [selectedPostId, setSelectedPostId] = useState(null);

  const handlePostSelect = (postId) => {
    setSelectedPostId(postId);
    setView('detail');
  };

  const handleBackToListing = () => {
    setView('listing');
    setSelectedPostId(null);
  };

  return (
    <>
      {view === 'listing' ? (
        <BlogListingPage onPostSelect={handlePostSelect} />
      ) : (
        <BlogDetailPage 
          postId={selectedPostId} 
          onBack={handleBackToListing} 
        />
      )}
    </>
  );
};

export default Blog;