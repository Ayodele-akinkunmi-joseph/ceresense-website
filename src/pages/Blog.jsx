import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Calendar, Clock, User, MessageCircle, Heart, Bookmark, 
  Share2, Send, Sparkles, TrendingUp, ThumbsUp, ThumbsDown, 
  Smile, Eye, ArrowLeft, Loader2, Tag, Award
} from "lucide-react";
import { blogApi } from "../services/api"; // Import blogApi
import "../styles/Blog.css";

// ==================== BLOG LISTING PAGE ====================

const BlogListingPage = ({ onPostSelect }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use the blogApi from your services
      const response = await blogApi.getAll();
      
      // Handle response format - adjust based on your actual API response
      if (response && response.data) {
        setPosts(response.data);
      } else if (Array.isArray(response)) {
        setPosts(response);
      } else {
        setPosts([]);
      }
      
    } catch (err) {
      console.error('Error fetching blog posts:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load blog posts');
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

  if (loading) {
    return (
      <div className="blog-loading">
        <Loader2 className="animate-spin" size={48} />
        <p>Loading insightful content...</p>
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
              <p>⚠️ Error loading blog posts: {error}</p>
              <p>Please try again later or contact support.</p>
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
                      src={post.coverImage || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"} 
                      alt={post.title}
                      className="card-img"
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
                        <span>{formatDate(post.createdAt || post.date)}</span>
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
                        <span>{post.author?.name || "CERESENSE Team"}</span>
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
                        <div className="stat">
                          <MessageCircle size={14} />
                          <span>{post.commentsCount || 0}</span>
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
              <div className="cta-stat">
                <MessageCircle size={24} />
                <div>
                  <h3>Active</h3>
                  <p>Discussions</p>
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
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [replyText, setReplyText] = useState("");
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
      
      // Fetch post details
      const postResponse = await blogApi.getById(postId);
      const postData = postResponse.data || postResponse;
      
      setPost(postData);
      
      // Fetch comments for this post
      try {
        const commentsResponse = await blogApi.getComments(postId);
        setComments(commentsResponse.data || commentsResponse || []);
      } catch (commentError) {
        console.error('Error fetching comments:', commentError);
        setComments([]);
      }
      
      // Initialize reactions from API data
      setReactions({
        likes: postData.likes || postData.likeCount || 0,
        thumbsUp: 0,
        thumbsDown: 0,
        bookmarks: 0
      });
      
    } catch (error) {
      console.error('Error fetching blog post:', error);
      setPost(null);
    } finally {
      setLoading(false);
    }
  };

  const handleReaction = async (reactionType) => {
    if (!post) return;
    
    // Update UI immediately
    setUserReactions(prev => ({
      ...prev,
      [reactionType]: !prev[reactionType]
    }));

    setReactions(prev => ({
      ...prev,
      [reactionType]: prev[reactionType] + 
        (userReactions[reactionType] ? -1 : 1)
    }));

    // Send to API (likes only for now)
    if (reactionType === 'liked') {
      try {
        await blogApi.like(post._id || post.id);
      } catch (error) {
        console.error('Error saving reaction:', error);
      }
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !post) return;

    try {
      await blogApi.createComment(post._id || post.id, { 
        text: newComment,
        user: {
          name: "User",
          role: "Reader"
        }
      });
      
      // Refresh comments after successful submission
      const commentsResponse = await blogApi.getComments(post._id || post.id);
      setComments(commentsResponse.data || commentsResponse || []);
      
      setNewComment("");
    } catch (error) {
      console.error('Error saving comment:', error);
      alert('Failed to post comment. Please try again.');
    }
  };

  const handleSubmitReply = async (commentId) => {
    if (!replyText.trim() || !post) return;

    try {
      // Note: Your API might need a different endpoint for replies
      await blogApi.createComment(post._id || post.id, { 
        text: replyText,
        parentId: commentId,
        user: {
          name: "User",
          role: "Reader"
        }
      });
      
      // Refresh comments
      const commentsResponse = await blogApi.getComments(post._id || post.id);
      setComments(commentsResponse.data || commentsResponse || []);
      
      setReplyTo(null);
      setReplyText("");
    } catch (error) {
      console.error('Error saving reply:', error);
      alert('Failed to post reply. Please try again.');
    }
  };

  const handleLikeComment = async (commentId) => {
    try {
      await blogApi.likeComment(commentId);
      
      // Refresh comments after liking
      const commentsResponse = await blogApi.getComments(post._id || post.id);
      setComments(commentsResponse.data || commentsResponse || []);
    } catch (error) {
      console.error('Error liking comment:', error);
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

  if (!post) {
    return (
      <div className="blog-page">
        <div className="post-error">
          <h3>Article not found</h3>
          <p>The article you're looking for doesn't exist or has been removed.</p>
          <button 
            className="back-button" 
            onClick={onBack}
            style={{ marginTop: '20px' }}
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
            {/* Article Header */}
            <div className="article-header">
              <div className="article-meta">
                <div className="meta-item">
                  <Calendar size={16} />
                  <span>{formatDate(post.createdAt || post.date)}</span>
                </div>
                <div className="meta-item">
                  <Clock size={16} />
                  <span>{post.readTime || "5 min read"}</span>
                </div>
                <div className="meta-item">
                  <User size={16} />
                  <span>{post.author?.name || "CERESENSE Team"}</span>
                </div>
              </div>

              {/* Author Info */}
              {post.author && (
                <div className="author-card">
                  <div className="author-avatar">
                    {post.author.name?.charAt(0) || "C"}
                  </div>
                  <div className="author-info">
                    <h4 className="author-name">{post.author.name || "CERESENSE Team"}</h4>
                    <p className="author-role">{post.author.role || "Author"}</p>
                  </div>
                </div>
              )}
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

          {/* Comments Section */}
          <section className="comments-section">
            <div className="comments-header">
              <h3 className="comments-title">
                <MessageCircle size={24} />
                <span>Discussion ({comments.length})</span>
              </h3>
            </div>

            {/* Add Comment Form */}
            <form onSubmit={handleSubmitComment} className="comment-form">
              <div className="form-header">
                <div className="user-avatar">U</div>
                <div className="form-info">
                  <h4>Add your comment</h4>
                  <p>Share your thoughts on this article</p>
                </div>
              </div>
              
              <div className="form-controls">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write your comment here..."
                  className="comment-input"
                  rows={4}
                />
                
                <div className="form-actions">
                  <button type="button" className="emoji-btn">
                    <Smile size={20} />
                  </button>
                  <button type="submit" className="submit-btn">
                    <Send size={20} />
                    <span>Post Comment</span>
                  </button>
                </div>
              </div>
            </form>

            {/* Comments List */}
            <div className="comments-list">
              {comments.map((comment) => (
                <div key={comment._id || comment.id} className="comment-item">
                  {/* Comment Header */}
                  <div className="comment-header">
                    <div className="comment-user">
                      <div className="comment-avatar">
                        {comment.user?.name?.charAt(0) || "U"}
                      </div>
                      <div className="comment-user-info">
                        <h4 className="user-name">{comment.user?.name || "User"}</h4>
                        <p className="user-role">{comment.user?.role || "Reader"}</p>
                      </div>
                    </div>
                    <span className="comment-time">
                      {comment.createdAt ? formatDate(comment.createdAt) : "Recently"}
                    </span>
                  </div>

                  {/* Comment Body */}
                  <div className="comment-body">
                    <p className="comment-text">{comment.text}</p>
                    
                    <div className="comment-actions">
                      <button 
                        className="like-btn"
                        onClick={() => handleLikeComment(comment._id || comment.id)}
                      >
                        <ThumbsUp size={16} />
                        <span>{comment.likes || 0}</span>
                      </button>
                      
                      <button 
                        className="reply-btn"
                        onClick={() => setReplyTo(comment._id || comment.id)}
                      >
                        Reply
                      </button>
                    </div>
                  </div>

                  {/* Reply Form */}
                  {replyTo === (comment._id || comment.id) && (
                    <div className="reply-form">
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Write your reply..."
                        className="reply-input"
                        rows={3}
                      />
                      <div className="reply-actions">
                        <button 
                          className="cancel-btn"
                          onClick={() => {
                            setReplyTo(null);
                            setReplyText("");
                          }}
                        >
                          Cancel
                        </button>
                        <button 
                          className="submit-reply-btn"
                          onClick={() => handleSubmitReply(comment._id || comment.id)}
                        >
                          Post Reply
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="replies-list">
                      {comment.replies.map((reply) => (
                        <div key={reply._id || reply.id} className="reply-item">
                          <div className="reply-header">
                            <div className="reply-user">
                              <div className="reply-avatar">
                                {reply.user?.name?.charAt(0) || "U"}
                              </div>
                              <div className="reply-user-info">
                                <h5 className="user-name">{reply.user?.name || "User"}</h5>
                                <p className="user-role">{reply.user?.role || "Reader"}</p>
                              </div>
                            </div>
                            <span className="reply-time">
                              {reply.createdAt ? formatDate(reply.createdAt) : "Recently"}
                            </span>
                          </div>
                          
                          <div className="reply-body">
                            <p className="reply-text">{reply.text}</p>
                            <button 
                              className="like-btn"
                              onClick={() => handleLikeComment(reply._id || reply.id)}
                            >
                              <ThumbsUp size={14} />
                              <span>{reply.likes || 0}</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>
    </div>
  );
};

// ==================== MAIN BLOG COMPONENT ====================

const Blog = () => {
  const [view, setView] = useState('listing'); // 'listing' or 'detail'
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