import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authApi } from "../../services/api"; // Import the API service
import "../../styles/admin/register.css";

const AdminRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    agreeTerms: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      return 'Full name is required';
    }
    if (!formData.username.trim()) {
      return 'Username is required';
    }
    if (!formData.email.trim()) {
      return 'Email is required';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return 'Please enter a valid email address';
    }
    if (formData.password.length < 8) {
      return 'Password must be at least 8 characters';
    }
    // Password strength check
    const passwordRegex = /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
    if (!passwordRegex.test(formData.password)) {
      return 'Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number or special character';
    }
    if (formData.password !== formData.confirmPassword) {
      return 'Passwords do not match';
    }
    if (!formData.agreeTerms) {
      return 'You must agree to the terms and conditions';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      // Call NestJS backend register endpoint
      const response = await authApi.register({
        fullName: formData.fullName,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      });

      setSuccess('Registration successful! You can now login.');
      
      // Store token and user data
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 2000);
      
    } catch (err) {
      console.error('Registration error:', err);
      
      if (err.response) {
        // Handle validation errors from backend
        if (err.response.data?.message) {
          if (Array.isArray(err.response.data.message)) {
            // Multiple validation errors
            setError(err.response.data.message.join(', '));
          } else {
            // Single error message
            setError(err.response.data.message);
          }
        } else {
          setError('Registration failed. Please try again.');
        }
      } else if (err.request) {
        setError('Network error. Please check your connection.');
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="auth-container">
        <div className="auth-header">
          <div className="auth-logo">C</div>
          <h1 className="auth-title">Create Admin Account</h1>
          <p className="auth-subtitle">Register for CERESENSE admin access</p>
        </div>

        <Link to="/admin/login" className="back-to-login">
          ← Back to Login
        </Link>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {success && (
            <div className="success-message">
              {success}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">FULL NAME</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">USERNAME</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Choose a username"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">EMAIL</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter your email address"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">PASSWORD</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Min. 8 chars with uppercase, lowercase, and number"
              minLength="8"
              required
            />
            <small className="password-hint">
              Must include uppercase, lowercase, and number/special character
            </small>
          </div>

          <div className="form-group">
            <label className="form-label">CONFIRM PASSWORD</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Confirm your password"
              required
            />
          </div>

          <div className="terms-checkbox">
            <input
              type="checkbox"
              name="agreeTerms"
              id="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleInputChange}
              required
            />
            <label htmlFor="agreeTerms" className="terms-text">
              I agree to the <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>
            </label>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <span>CREATING ACCOUNT...</span>
            </div>
          ) : (
            <button type="submit" className="login-button">
              CREATE ACCOUNT
            </button>
          )}
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <Link to="/admin/login" className="auth-link">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminRegister;