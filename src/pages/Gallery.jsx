import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  Share2,
  Calendar,
  Users,
  Award,
  Camera,
  Video,
  Image as ImageIcon,
  Filter,
  Loader2,
  Eye
} from "lucide-react";
import { galleryApi } from "../services/api";
import "../styles/Gallery.css";

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ total: 0, categories: [] });
  const [uiReady, setUiReady] = useState(false);

  const categories = [
    { id: "all", name: "All", icon: <Sparkles size={18} /> },
    { id: "learning", name: "Learning Sessions", icon: <Users size={18} /> },
    { id: "projects", name: "Student Projects", icon: <Award size={18} /> },
    { id: "events", name: "Events", icon: <Calendar size={18} /> },
    { id: "workshops", name: "Workshops", icon: <Camera size={18} /> },
    { id: "graduation", name: "Graduations", icon: <Video size={18} /> }
  ];

  // Show UI immediately, then fetch data
  useEffect(() => {
    // Mark UI as ready after first render
    setUiReady(true);
    
    // Fetch data after UI is ready
    const timer = setTimeout(() => {
      fetchGalleryData();
      fetchStats();
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const fetchGalleryData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Add CORS proxy if needed (temporary fix)
      // const response = await galleryApi.getAll({
      //   status: 'active',
      //   limit: 50
      // });
      
      // For now, use a CORS proxy to bypass the issue
      // Once your backend CORS is fixed, remove this and use the above
      const response = await fetch('https://cors-anywhere.herokuapp.com/https://ceresense-backend-2.onrender.com/gallery?status=active&limit=50');
      const data = await response.json();
      
      console.log("API Response:", data);
      
      const formattedImages = data.data.map(item => ({
        id: item._id,
        src: item.imageUrl && item.imageUrl.startsWith('http') 
          ? item.imageUrl 
          : `https://ceresense-backend-2.onrender.com${item.imageUrl || ''}`,
        category: item.category || 'learning',
        title: item.title,
        date: item.date || new Date(item.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        description: item.description || '',
        tags: item.tags || [],
        featured: item.featured || false,
        views: item.views || 0,
        downloads: item.downloads || 0
      }));
      
      setGalleryImages(formattedImages);
    } catch (err) {
      console.error('Error fetching gallery:', err);
      setError(err.message);
      setGalleryImages([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // const statsData = await galleryApi.getStats();
      // const categoryStats = await galleryApi.getCategoryStats();
      
      // Using fetch with CORS proxy
      const statsResponse = await fetch('https://cors-anywhere.herokuapp.com/https://ceresense-backend-2.onrender.com/gallery/stats');
      const statsData = await statsResponse.json();
      
      setStats({
        total: statsData.total || 0,
        categories: statsData.categories || []
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const categoriesWithCounts = categories.map(category => ({
    ...category,
    count: category.id === "all" 
      ? galleryImages.length 
      : galleryImages.filter(img => img.category === category.id).length
  }));

  const filteredImages = useMemo(() => {
    const filtered = galleryImages.filter(image => {
      let matchesCategory = true;
      if (selectedCategory !== "All") {
        const selectedCategoryObj = categories.find(cat => cat.name === selectedCategory);
        if (selectedCategoryObj) {
          matchesCategory = image.category === selectedCategoryObj.id;
        }
      }
      
      let matchesSearch = true;
      if (searchQuery.trim()) {
        matchesSearch = (
          image.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          image.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          image.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      }
      
      return matchesCategory && matchesSearch;
    });
    
    return filtered;
  }, [selectedCategory, searchQuery, galleryImages]);

  const handleNextImage = () => {
    const currentIndex = galleryImages.findIndex(img => img.id === selectedImage?.id);
    const nextIndex = (currentIndex + 1) % galleryImages.length;
    setSelectedImage(galleryImages[nextIndex]);
  };

  const handlePrevImage = () => {
    const currentIndex = galleryImages.findIndex(img => img.id === selectedImage?.id);
    const prevIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    setSelectedImage(galleryImages[prevIndex]);
  };

  const handleDownload = async (imageUrl, imageId) => {
    try {
      if (imageId) {
        await galleryApi.incrementDownloads(imageId);
      }
      
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ceresense-gallery-${Date.now()}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download image');
    }
  };

  const handleShare = async (image) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${image.title} - CERESENSE Gallery`,
          text: image.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Sharing cancelled:', error);
      }
    } else {
      navigator.clipboard.writeText(`${image.title}\n${image.description}\n${window.location.href}`);
      alert('Link copied to clipboard!');
    }
  };

  const handleImageClick = async (image) => {
    setSelectedImage(image);
    try {
      await galleryApi.incrementViews(image.id);
    } catch (err) {
      console.error('Failed to increment views:', err);
    }
  };

  // Show skeleton UI while loading (but hero section shows immediately)
  if (!uiReady || (loading && galleryImages.length === 0)) {
    return (
      <div className="gallery-page">
        {/* Hero Section - Shows immediately */}
        <section className="gallery-hero">
          <div className="hero-background-pattern"></div>
          <div className="gallery-hero-container">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="gallery-hero-content"
            >
              <div className="brand-badge">
                <Sparkles size={20} />
                <span>CERESENSE GALLERY</span>
              </div>
              
              <h1 className="gallery-hero-title">
                <span className="ceresense-text">CERESENSE</span>
                <span className="hero-subtitle">In Action</span>
              </h1>
              
              <p className="gallery-hero-description">
                Loading gallery images...
              </p>
            </motion.div>
          </div>
        </section>

        {/* Skeleton Grid */}
        <section className="gallery-grid-section">
          <div className="gallery-container">
            <div className="gallery-controls-skeleton">
              <div className="skeleton search-skeleton"></div>
              <div className="skeleton filters-skeleton"></div>
            </div>
            
            <div className="gallery-grid skeleton-grid">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="gallery-item skeleton">
                  <div className="skeleton-image"></div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="gallery-page">
      {/* Hero Section */}
      <section className="gallery-hero">
        <div className="hero-background-pattern"></div>
        <div className="gallery-hero-container">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="gallery-hero-content"
          >
            <div className="brand-badge">
              <Sparkles size={20} />
              <span>CERESENSE GALLERY</span>
            </div>
            
            <h1 className="gallery-hero-title">
              <span className="ceresense-text">CERESENSE</span>
              <span className="hero-subtitle">In Action</span>
            </h1>
            
            <p className="gallery-hero-description">
              Explore {stats.total || galleryImages.length} moments showcasing learning, projects, and community events.
            </p>
            
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-number">{stats.total || galleryImages.length}</span>
                <span className="stat-label">Total Images</span>
              </div>
              {stats.categories?.slice(0, 3).map(stat => (
                <div key={stat.category} className="stat-item">
                  <span className="stat-number">{stat.count}</span>
                  <span className="stat-label">
                    {categories.find(c => c.id === stat.category)?.name || stat.category}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Gallery Controls */}
      <section className="gallery-controls">
        <div className="controls-container">
          <div className="search-container">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Search images, events, projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="clear-search">
                <X size={18} />
              </button>
            )}
          </div>

          <div className="category-filters">
            <div className="filter-label">
              <Filter size={18} />
              <span>Filter by:</span>
            </div>
            <div className="filter-buttons">
              {categoriesWithCounts.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`filter-button ${selectedCategory === category.name ? 'active' : ''}`}
                >
                  {category.icon}
                  <span>{category.name}</span>
                  <span className="count-badge">{category.count}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="gallery-grid-section">
        <div className="gallery-container">
          {error && (
            <div className="api-error">
              <p>⚠️ {error}</p>
              <button onClick={() => { fetchGalleryData(); fetchStats(); }} className="retry-btn">
                Try Again
              </button>
            </div>
          )}
          
          <div className="current-filter-info">
            <p>
              Showing {filteredImages.length} of {galleryImages.length} images
              {selectedCategory !== "All" && ` in "${selectedCategory}"`}
              {searchQuery && ` matching "${searchQuery}"`}
            </p>
          </div>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={`${selectedCategory}-${searchQuery}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="gallery-grid"
            >
              {filteredImages.length > 0 ? (
                filteredImages.map((image, index) => (
                  <motion.div
                    key={image.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className={`gallery-item ${image.featured ? 'featured' : ''}`}
                    onClick={() => handleImageClick(image)}
                  >
                    <div className="image-container">
                      <img 
                        src={image.src} 
                        alt={image.title}
                        className="gallery-image"
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/400x300/3b82f6/ffffff?text=CERESENSE";
                        }}
                      />
                      <div className="image-overlay">
                        <div className="overlay-content">
                          <div className="image-category">
                            {categories.find(c => c.id === image.category)?.icon || <ImageIcon size={18} />}
                            <span>{categories.find(c => c.id === image.category)?.name || image.category}</span>
                          </div>
                          <h3 className="image-title">{image.title}</h3>
                          <div className="image-stats-small">
                            <span><Eye size={12} /> {image.views}</span>
                            <span><Download size={12} /> {image.downloads}</span>
                          </div>
                        </div>
                      </div>
                      {image.featured && (
                        <div className="featured-badge">
                          <Sparkles size={12} />
                          <span>Featured</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="image-info">
                      <div className="info-header">
                        <h3 className="info-title">{image.title}</h3>
                        <span className="info-date">{image.date}</span>
                      </div>
                      <p className="info-description">{image.description}</p>
                      <div className="image-tags">
                        {image.tags.map((tag, i) => (
                          <span key={i} className="tag">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="no-results">
                  <ImageIcon size={48} />
                  <h3>No images found</h3>
                  <p>Try adjusting your search or filter criteria</p>
                  <button onClick={() => { setSelectedCategory("All"); setSearchQuery(""); }} className="reset-filters-btn">
                    Reset All Filters
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lightbox"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              className="lightbox-content"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className="lightbox-close" 
                onClick={() => setSelectedImage(null)}
              >
                <X size={24} />
              </button>

              <div className="lightbox-main">
                <img 
                  src={selectedImage.src} 
                  alt={selectedImage.title}
                  className="lightbox-image"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/800x600/3b82f6/ffffff?text=Image+Not+Available";
                  }}
                />
                
                <button 
                  className="lightbox-nav prev" 
                  onClick={handlePrevImage}
                >
                  <ChevronLeft size={24} />
                </button>
                
                <button 
                  className="lightbox-nav next" 
                  onClick={handleNextImage}
                >
                  <ChevronRight size={24} />
                </button>

                <div className="lightbox-actions">
                  <button 
                    className="action-button" 
                    onClick={() => handleDownload(selectedImage.src, selectedImage.id)}
                  >
                    Download
                  </button>
                  
                  <button 
                    className="action-button" 
                    onClick={() => handleShare(selectedImage)}
                  >
                    Share
                  </button>
                </div>
              </div>

              <div className="lightbox-info">
                <div className="info-header">
                  <div className="category-badge">
                    {categories.find(c => c.id === selectedImage.category)?.icon || <ImageIcon size={18} />}
                    <span>{categories.find(c => c.id === selectedImage.category)?.name || selectedImage.category}</span>
                  </div>
                  
                  <span className="image-date">
                    {selectedImage.date}
                  </span>
                </div>
                
                <h2 className="lightbox-title">
                  {selectedImage.title}
                </h2>
                
                <p className="lightbox-description">
                  {selectedImage.description}
                </p>
                
                <div className="lightbox-stats">
                  <div className="stat">
                    <Eye size={16} />
                    <span>{selectedImage.views} views</span>
                  </div>
                  
                  <div className="stat">
                    <Download size={16} />
                    <span>{selectedImage.downloads} downloads</span>
                  </div>
                </div>
                
                <div className="lightbox-tags">
                  {selectedImage.tags.map((tag, index) => (
                    <span key={index} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;