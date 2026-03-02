import { useState, useEffect } from "react";
import { 
  Upload, Edit2, Trash2, Search, Eye, Download, Star, X, 
  Image as ImageIcon, FileText, AlertCircle, Loader2, CheckCircle
} from "lucide-react";
import { galleryApi } from "../../services/api";
import "../../styles/admin/Admin.css";

const GalleryManagement = () => {
  const [images, setImages] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "learning",
    tags: "",
    featured: false,
    date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    status: "active"
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({ total: 0, active: 0, featured: 0 });
  const [error, setError] = useState(null);

  const categories = [
    { id: 'all', name: 'All Images' },
    { id: 'learning', name: 'Learning Sessions' },
    { id: 'projects', name: 'Student Projects' },
    { id: 'events', name: 'Events' },
    { id: 'workshops', name: 'Workshops' },
    { id: 'graduation', name: 'Graduations' }
  ];

  useEffect(() => {
    fetchImages();
    fetchStats();
  }, [page, selectedCategory, searchQuery]);

  // Fetch gallery images
  const fetchImages = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        page: Number(page) || 1,
        limit: 10,
        ...(selectedCategory !== 'all' && { category: selectedCategory }),
        ...(searchQuery && { search: searchQuery })
      };
      
      const response = await galleryApi.getAll(params);
      
      let imagesData = [];
      let pages = 1;
      
      // Handle different response formats
      if (Array.isArray(response)) {
        imagesData = response;
      } else if (response && Array.isArray(response.data)) {
        imagesData = response.data;
        pages = response.totalPages || response.pages || 1;
      } else if (response && response.images && Array.isArray(response.images)) {
        imagesData = response.images;
        pages = response.totalPages || 1;
      } else {
        imagesData = [];
      }
      
      setImages(imagesData);
      setTotalPages(pages);
      
    } catch (error) {
      console.error("Error fetching images:", error);
      
      // User-friendly error messages
      if (error.message?.includes('Network Error') || error.code === 'ERR_NETWORK') {
        setError('Unable to connect to server. Please check your internet connection.');
      } else if (error.message?.includes('CORS')) {
        setError('Server configuration issue. Please contact support.');
      } else {
        setError(error.response?.data?.message || error.message || 'Failed to load images');
      }
      
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch gallery stats
  const fetchStats = async () => {
    try {
      const statsData = await galleryApi.getStats();
      
      let formattedStats = { total: 0, active: 0, featured: 0 };
      
      if (statsData && typeof statsData === 'object') {
        formattedStats = {
          total: statsData.total || 0,
          active: statsData.active || 0,
          featured: statsData.featured || 0
        };
      }
      
      setStats(formattedStats);
      
    } catch (error) {
      console.error("Error fetching stats:", error);
      // Don't set error state for stats, just log it
    }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        alert('Please select a valid image file (JPEG, PNG, GIF, WebP)');
        return;
      }
      
      setSelectedFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (!editingImage && !selectedFile) {
      alert('Please select an image file');
      return;
    }
    
    if (!formData.title.trim()) {
      alert('Please enter a title');
      return;
    }
    
    setUploading(true);

    try {
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const featuredBoolean = Boolean(formData.featured);

      if (editingImage) {
        const updateData = {
          title: formData.title.trim(),
          description: formData.description.trim(),
          category: formData.category,
          tags: tagsArray,
          featured: featuredBoolean,
          date: formData.date,
          status: formData.status
        };
        
        await galleryApi.update(editingImage._id, updateData);
        alert('✅ Image updated successfully!');
        
      } else {
        const formDataToSend = new FormData();
        formDataToSend.append('title', formData.title.trim());
        formDataToSend.append('description', formData.description.trim());
        formDataToSend.append('category', formData.category);
        formDataToSend.append('date', formData.date);
        formDataToSend.append('status', formData.status);
        formDataToSend.append('tags', JSON.stringify(tagsArray));
        formDataToSend.append('featured', featuredBoolean.toString());
        formDataToSend.append('image', selectedFile);
        
        await galleryApi.upload(formDataToSend);
        alert('✅ Image uploaded successfully!');
      }

      // Refresh data
      await fetchImages();
      await fetchStats();
      resetForm();
      
    } catch (error) {
      console.error('Error saving image:', error);
      
      const errorMessage = error.response?.data?.message || error.message || 'Failed to save image';
      setError(errorMessage);
      alert(`❌ ${errorMessage}`);
    } finally {
      setUploading(false);
    }
  };

  // Reset form to initial state
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "learning",
      tags: "",
      featured: false,
      date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      status: "active"
    });
    setSelectedFile(null);
    setImagePreview(null);
    setShowUploadModal(false);
    setEditingImage(null);
    setError(null);
  };

  // Edit an image
  const handleEdit = (image) => {
    setEditingImage(image);
    setFormData({
      title: image.title || "",
      description: image.description || "",
      category: image.category || "learning",
      tags: (image.tags && Array.isArray(image.tags)) ? image.tags.join(', ') : "",
      featured: image.featured || false,
      date: image.date || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      status: image.status || "active"
    });
    
    if (image.imageUrl) {
      const fullUrl = image.imageUrl.startsWith('http') 
        ? image.imageUrl 
        : `https://ceresense-backend-2.onrender.com${image.imageUrl}`;
      setImagePreview(fullUrl);
    }
    
    setShowUploadModal(true);
  };

  // Delete an image
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this image? This action cannot be undone.')) {
      return;
    }
    
    try {
      await galleryApi.delete(id);
      alert('✅ Image deleted successfully!');
      
      // Refresh data
      await fetchImages();
      await fetchStats();
      
    } catch (error) {
      console.error('Error deleting image:', error);
      alert(`❌ Failed to delete image: ${error.response?.data?.message || error.message}`);
    }
  };

  // Handle search
  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      setPage(1); // Reset to first page on new search
      fetchImages();
    }
  };

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        setPage(1);
        fetchImages();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Combined styles (your original modal styles + responsive styles)
  const styles = `
    /* ===== YOUR ORIGINAL MODAL STYLES (PRESERVED) ===== */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.75);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 20px;
      backdrop-filter: blur(4px);
    }
    
    .modal-content {
      background: white;
      border-radius: 12px;
      width: 100%;
      max-width: 800px;
      max-height: 90vh;
      overflow-y: auto;
      position: relative;
    }
    
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px 32px;
      border-bottom: 1px solid #e2e8f0;
    }
    
    .modal-header h3 {
      font-size: 20px;
      font-weight: 600;
      color: #1e293b;
      margin: 0;
    }
    
    .modal-close {
      background: none;
      border: none;
      color: #64748b;
      cursor: pointer;
      padding: 8px;
      border-radius: 6px;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .modal-close:hover {
      background: #f1f5f9;
      color: #1e293b;
    }
    
    .upload-form {
      padding: 32px;
    }
    
    .form-error {
      background: #fef2f2;
      border: 1px solid #fecaca;
      color: #dc2626;
      padding: 12px 16px;
      border-radius: 8px;
      margin-bottom: 24px;
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 14px;
    }
    
    .image-preview-container {
      margin-bottom: 32px;
    }
    
    .image-preview {
      width: 100%;
      height: 250px;
      border-radius: 8px;
      overflow: hidden;
      margin-bottom: 16px;
      border: 2px dashed #e2e8f0;
      background: #f8fafc;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .image-preview img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }
    
    .image-upload-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #64748b;
      height: 100%;
    }
    
    .file-input-label {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 12px 20px;
      background: #3b82f6;
      color: white;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
      font-weight: 500;
      font-size: 14px;
    }
    
    .file-input-label:hover {
      background: #2563eb;
    }
    
    .file-input {
      display: none;
    }
    
    .file-info {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      color: #64748b;
      padding: 8px 12px;
      background: #f1f5f9;
      border-radius: 6px;
      margin-top: 8px;
    }
    
    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      margin-bottom: 32px;
    }
    
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .form-group.full-width {
      grid-column: 1 / -1;
    }
    
    .form-group label {
      font-size: 14px;
      font-weight: 500;
      color: #374151;
    }
    
    .form-group input,
    .form-group select,
    .form-group textarea {
      padding: 10px 14px;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-size: 14px;
      font-family: inherit;
      transition: all 0.2s ease;
    }
    
    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
    
    .form-group textarea {
      resize: vertical;
      min-height: 80px;
    }
    
    .checkbox-group {
      grid-column: 1 / -1;
    }
    
    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
    }
    
    .checkbox-label input[type="checkbox"] {
      width: 18px;
      height: 18px;
    }
    
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding-top: 24px;
      border-top: 1px solid #e2e8f0;
    }
    
    .secondary-btn {
      padding: 10px 20px;
      background: #f3f4f6;
      color: #374151;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .secondary-btn:hover {
      background: #e5e7eb;
    }
    
    .primary-btn {
      padding: 10px 24px;
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .primary-btn:hover:not(:disabled) {
      background: #2563eb;
    }
    
    .primary-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    .loading {
      display: inline-block;
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    /* ===== RESPONSIVE MANAGEMENT PAGE STYLES ===== */
    .management-page {
      padding: 24px;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
      flex-wrap: wrap;
      gap: 16px;
    }

    .page-title {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 24px;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 4px 0;
    }

    .page-subtitle {
      font-size: 14px;
      color: #64748b;
      margin: 0;
    }

    .stats-bar {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin-bottom: 32px;
    }

    .stat-item {
      background: white;
      padding: 20px;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .stat-item svg {
      color: #3b82f6;
    }

    .stat-value {
      font-size: 24px;
      font-weight: 700;
      color: #1e293b;
      margin-right: 8px;
    }

    .stat-label {
      font-size: 13px;
      color: #64748b;
    }

    .table-filters {
      display: flex;
      gap: 16px;
      margin-bottom: 24px;
      flex-wrap: wrap;
    }

    .search-container {
      flex: 1;
      min-width: 280px;
      display: flex;
      align-items: center;
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 0 12px;
    }

    .search-container svg {
      color: #94a3b8;
    }

    .search-container input {
      flex: 1;
      padding: 12px;
      border: none;
      outline: none;
      font-size: 14px;
    }

    .category-filter {
      min-width: 200px;
      padding: 12px;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      background: white;
      font-size: 14px;
      outline: none;
    }

    .table-container {
      background: white;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
      overflow: hidden;
    }

    .table-wrapper {
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
      min-width: 800px;
    }

    .data-table th {
      text-align: left;
      padding: 16px;
      background: #f8fafc;
      font-size: 12px;
      font-weight: 600;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 1px solid #e2e8f0;
    }

    .data-table td {
      padding: 16px;
      border-bottom: 1px solid #e2e8f0;
      font-size: 14px;
    }

    .table-row:hover {
      background: #f8fafc;
    }

    .image-cell {
      width: 80px;
    }

    .table-image {
      width: 60px;
      height: 60px;
      border-radius: 8px;
      overflow: hidden;
      background: #f1f5f9;
    }

    .table-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .details-cell {
      max-width: 300px;
    }

    .details-content h4 {
      font-size: 14px;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 4px 0;
    }

    .details-content p {
      font-size: 13px;
      color: #64748b;
      margin: 0 0 8px 0;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .tags {
      display: flex;
      gap: 4px;
      flex-wrap: wrap;
    }

    .tag {
      padding: 2px 8px;
      background: #f1f5f9;
      border-radius: 12px;
      font-size: 11px;
      color: #475569;
    }

    .tag-more {
      padding: 2px 8px;
      background: #e2e8f0;
      border-radius: 12px;
      font-size: 11px;
      color: #475569;
    }

    .category-badge {
      padding: 4px 12px;
      background: #dbeafe;
      color: #2563eb;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
    }

    .status-badge {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
      display: inline-block;
    }

    .status-badge.active {
      background: #d1fae5;
      color: #059669;
    }

    .status-badge.draft {
      background: #f1f5f9;
      color: #64748b;
    }

    .status-badge.archived {
      background: #fee2e2;
      color: #dc2626;
    }

    .featured-badge {
      padding: 4px 12px;
      background: #f1f5f9;
      color: #64748b;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
    }

    .featured-badge.active {
      background: #fef3c7;
      color: #d97706;
    }

    .action-buttons {
      display: flex;
      gap: 8px;
    }

    .action-btn {
      padding: 8px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.3s ease;
      background: #f1f5f9;
      color: #475569;
    }

    .action-btn.edit:hover {
      background: #dbeafe;
      color: #2563eb;
    }

    .action-btn.delete:hover {
      background: #fee2e2;
      color: #dc2626;
    }

    .table-pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 20px;
      padding: 20px;
      border-top: 1px solid #e2e8f0;
    }

    .table-pagination button {
      padding: 8px 16px;
      background: #f1f5f9;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 13px;
      color: #475569;
    }

    .table-pagination button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .error-banner {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      background: #fee2e2;
      border: 1px solid #fecaca;
      border-radius: 8px;
      color: #dc2626;
      margin-bottom: 24px;
      flex-wrap: wrap;
    }

    .retry-btn {
      padding: 4px 12px;
      background: #dc2626;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      margin-left: auto;
    }

    .error-close {
      padding: 4px;
      background: none;
      border: none;
      color: #dc2626;
      cursor: pointer;
    }

    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 400px;
      gap: 16px;
      color: #64748b;
    }

    .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: #94a3b8;
    }

    .empty-state h3 {
      color: #1e293b;
      margin: 16px 0 8px;
    }

    /* ===== RESPONSIVE MEDIA QUERIES ===== */
    
    @media (max-width: 1024px) {
      .management-page {
        padding: 20px;
      }

      .stats-bar {
        gap: 16px;
      }

      .stat-item {
        padding: 16px;
      }

      .stat-value {
        font-size: 22px;
      }
      
      .modal-content {
        max-width: 90%;
        margin: 0 20px;
      }
    }

    @media (max-width: 768px) {
      .management-page {
        padding: 16px;
      }

      .page-header {
        flex-direction: column;
        align-items: flex-start;
      }

      .page-title {
        font-size: 22px;
      }

      .stats-bar {
        grid-template-columns: repeat(3, 1fr);
        gap: 12px;
      }

      .stat-item {
        flex-direction: column;
        text-align: center;
        padding: 12px;
      }

      .table-filters {
        flex-direction: column;
      }

      .search-container {
        width: 100%;
      }

      .category-filter {
        width: 100%;
      }
      
      .modal-header {
        padding: 20px 24px;
      }
      
      .upload-form {
        padding: 24px;
      }
      
      .form-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }
    }

    @media (max-width: 640px) {
      .page-title {
        font-size: 20px;
      }

      .stats-bar {
        grid-template-columns: 1fr;
        gap: 10px;
      }

      .stat-item {
        flex-direction: row;
        text-align: left;
        padding: 16px;
      }

      .table-pagination {
        flex-direction: column;
        gap: 12px;
      }

      .table-pagination button {
        width: 100%;
      }
      
      .image-preview {
        height: 200px;
      }
    }

    @media (max-width: 480px) {
      .management-page {
        padding: 12px;
      }

      .page-header {
        margin-bottom: 20px;
      }

      .page-title {
        font-size: 18px;
      }

      .page-subtitle {
        font-size: 13px;
      }

      .stat-item {
        padding: 12px;
      }

      .stat-value {
        font-size: 20px;
      }

      .stat-label {
        font-size: 12px;
      }

      .data-table td {
        padding: 12px;
      }

      .action-buttons {
        flex-direction: column;
      }

      .error-banner {
        flex-direction: column;
        align-items: flex-start;
      }

      .retry-btn {
        margin-left: 0;
        width: 100%;
      }
      
      .modal-header {
        padding: 16px 20px;
      }
      
      .modal-header h3 {
        font-size: 18px;
      }
      
      .upload-form {
        padding: 20px;
      }
      
      .image-preview {
        height: 180px;
      }
      
      .file-input-label {
        width: 100%;
        justify-content: center;
      }
      
      .form-actions {
        flex-direction: column;
      }
      
      .form-actions button {
        width: 100%;
      }
    }
  `;

  // Add the styles to the document
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  return (
    <div className="management-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <ImageIcon size={24} />
            <span>Gallery Management</span>
          </h1>
          <p className="page-subtitle">Manage and organize your gallery images</p>
        </div>
        <div className="header-actions">
          <button 
            className="primary-btn" 
            onClick={() => setShowUploadModal(true)}
          >
            <Upload size={18} />
            <span>Upload Image</span>
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="stats-bar">
        <div className="stat-item">
          <ImageIcon size={18} />
          <span className="stat-value">{stats.total}</span>
          <span className="stat-label">Total Images</span>
        </div>
        <div className="stat-item">
          <CheckCircle size={18} />
          <span className="stat-value">{stats.active}</span>
          <span className="stat-label">Active</span>
        </div>
        <div className="stat-item">
          <Star size={18} />
          <span className="stat-value">{stats.featured}</span>
          <span className="stat-label">Featured</span>
        </div>
      </div>

      {/* Filters */}
      <div className="table-filters">
        <div className="search-container">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search images..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
          />
        </div>
        <select 
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setPage(1);
          }}
          className="category-filter"
        >
          <option value="all">All Categories</option>
          <option value="learning">Learning Sessions</option>
          <option value="projects">Student Projects</option>
          <option value="events">Events</option>
          <option value="workshops">Workshops</option>
          <option value="graduation">Graduations</option>
        </select>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-banner">
          <AlertCircle size={18} />
          <span>{error}</span>
          <button onClick={fetchImages} className="retry-btn">
            Retry
          </button>
        </div>
      )}

      {/* Table Container */}
      <div className="table-container">
        {loading ? (
          <div className="loading-state">
            <Loader2 className="animate-spin" size={32} />
            <p>Loading images...</p>
          </div>
        ) : images.length === 0 ? (
          <div className="empty-state">
            <ImageIcon size={48} />
            <h3>No images found</h3>
            <p>Upload your first image to get started</p>
            <button 
              className="primary-btn" 
              onClick={() => setShowUploadModal(true)}
            >
              <Upload size={18} />
              <span>Upload Image</span>
            </button>
          </div>
        ) : (
          <>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>IMAGE</th>
                    <th>DETAILS</th>
                    <th>CATEGORY</th>
                    <th>STATUS</th>
                    <th>FEATURED</th>
                    <th>DATE</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {images.map((image) => (
                    <tr key={image._id} className="table-row">
                      <td className="image-cell">
                        <div className="table-image">
                          <img 
                            src={image.imageUrl?.startsWith('http') 
                              ? image.imageUrl 
                              : `https://ceresense-backend-2.onrender.com${image.imageUrl || ''}`} 
                            alt={image.title}
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/100x75/3b82f6/ffffff?text=Image';
                            }}
                          />
                        </div>
                      </td>
                      <td className="details-cell">
                        <div className="details-content">
                          <h4>{image.title || 'Untitled'}</h4>
                          <p>{image.description || 'No description'}</p>
                          {image.tags && image.tags.length > 0 && (
                            <div className="tags">
                              {image.tags.slice(0, 2).map((tag, index) => (
                                <span key={index} className="tag">{tag}</span>
                              ))}
                              {image.tags.length > 2 && (
                                <span className="tag-more">+{image.tags.length - 2}</span>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="category-cell">
                        <span className="category-badge">
                          {image.category || 'Uncategorized'}
                        </span>
                      </td>
                      <td className="status-cell">
                        <span className={`status-badge ${image.status || 'active'}`}>
                          {image.status || 'active'}
                        </span>
                      </td>
                      <td className="featured-cell">
                        <span className={`featured-badge ${image.featured ? 'active' : ''}`}>
                          {image.featured ? '⭐ Featured' : 'Standard'}
                        </span>
                      </td>
                      <td className="date-cell">
                        {image.date || 'No date'}
                      </td>
                      <td className="actions-cell">
                        <div className="action-buttons">
                          <button 
                            className="action-btn edit"
                            onClick={() => handleEdit(image)}
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            className="action-btn delete"
                            onClick={() => handleDelete(image._id)}
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="table-pagination">
                <button 
                  onClick={() => setPage(p => Math.max(1, p - 1))} 
                  disabled={page === 1 || loading}
                >
                  Previous
                </button>
                <span>Page {page} of {totalPages}</span>
                <button 
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
                  disabled={page === totalPages || loading}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Upload/Edit Modal */}
      {showUploadModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingImage ? 'Edit Image' : 'Upload New Image'}</h3>
              <button 
                className="modal-close"
                onClick={resetForm}
                disabled={uploading}
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="upload-form">
              {error && (
                <div className="form-error">
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </div>
              )}
              
              {/* Image Preview Section */}
              <div className="image-preview-container">
                <div className="image-preview">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" />
                  ) : (
                    <div className="image-upload-placeholder">
                      <ImageIcon size={48} />
                      <p>Image Preview</p>
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="file-input-label">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="file-input"
                      disabled={uploading}
                    />
                    <Upload size={18} />
                    <span>Choose Image</span>
                  </label>
                  {selectedFile && (
                    <div className="file-info">
                      <FileText size={14} />
                      <span>{selectedFile.name}</span>
                      <span className="file-size">
                        ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Form Fields */}
              <div className="form-grid">
                <div className="form-group">
                  <label>Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter image title"
                    required
                    disabled={uploading}
                  />
                </div>
                
                <div className="form-group">
                  <label>Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    disabled={uploading}
                  >
                    <option value="learning">Learning Sessions</option>
                    <option value="projects">Student Projects</option>
                    <option value="events">Events</option>
                    <option value="workshops">Workshops</option>
                    <option value="graduation">Graduations</option>
                  </select>
                </div>
                
                <div className="form-group full-width">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter image description"
                    rows="3"
                    disabled={uploading}
                  />
                </div>
                
                <div className="form-group">
                  <label>Tags</label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    placeholder="tag1, tag2, tag3"
                    disabled={uploading}
                  />
                  <small className="help-text">Separate with commas</small>
                </div>
                
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="text"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    placeholder="e.g., February 2024"
                    disabled={uploading}
                  />
                </div>
                
                <div className="form-group">
                  <label>Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    disabled={uploading}
                  >
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                
                <div className="form-group checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleInputChange}
                      disabled={uploading}
                    />
                    <span>Featured Image</span>
                    <small>Show this image prominently</small>
                  </label>
                </div>
              </div>
              
              {/* Form Actions */}
              <div className="form-actions">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={resetForm}
                  disabled={uploading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="primary-btn"
                  disabled={uploading}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="loading" size={18} />
                      <span>{editingImage ? 'Updating...' : 'Uploading...'}</span>
                    </>
                  ) : (
                    <>
                      {editingImage ? <CheckCircle size={18} /> : <Upload size={18} />}
                      <span>{editingImage ? 'Update Image' : 'Upload Image'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryManagement;