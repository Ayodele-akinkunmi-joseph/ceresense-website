import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authApi } from "../../services/api"; // Import the API service
import "../../styles/admin/Admin.css";

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Basic validation
    if (!credentials.username.trim() || !credentials.password.trim()) {
      setError('Please enter both username and password');
      setLoading(false);
      return;
    }

    try {
      // Call your NestJS backend
      const response = await authApi.login(credentials);
      
      // Store token and user data
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      // Redirect to dashboard
      navigate('/admin/dashboard');
      
    } catch (err) {
      console.error('Login error:', err);
      
      // Handle different error types
      if (err.response) {
        // The request was made and the server responded with a status code
        const errorMessage = err.response.data?.message || 'Login failed';
        setError(errorMessage);
        
        // If it's an authentication error, show specific message
        if (err.response.status === 401) {
          setError('Invalid username or password');
        }
      } else if (err.request) {
        // The request was made but no response was received
        setError('Network error. Please check your connection.');
      } else {
        // Something happened in setting up the request
        setError('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setCredentials({
      username: 'testuser', // Use a test user from your backend
      password: 'Password123!'
    });
    setError('');
  };

  return (
    <div className="login-page">
      <div className="auth-container">
        <div className="auth-header">
          <div className="auth-logo">C</div>
          <h1 className="auth-title">Admin Portal</h1>
          <p className="auth-subtitle">Secure access to CERESENSE dashboard</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">USERNAME OR EMAIL</label>
            <input
              type="text"
              value={credentials.username}
              onChange={(e) => setCredentials({...credentials, username: e.target.value})}
              className="form-input"
              placeholder="Enter username or email"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">PASSWORD</label>
            <div className="password-input">
              <input
                type={showPassword ? 'text' : 'password'}
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                className="form-input"
                placeholder="Enter password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {/* <div className="auth-links">
            <Link to="/admin/forgot-password" className="auth-link">
              Forgot Password?
            </Link>
          </div> */}

          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <span>AUTHENTICATING...</span>
            </div>
          ) : (
            <button type="submit" className="login-button">
              SIGN IN
            </button>
          )}

          <button
            type="button"
            onClick={fillDemoCredentials}
            className="demo-button"
          >
            Use Test Credentials
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <Link to="/admin/register" className="auth-link">
              Request access
            </Link>
          </p>
          <p className="credentials-note">
            Test: testuser / Password123!
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;