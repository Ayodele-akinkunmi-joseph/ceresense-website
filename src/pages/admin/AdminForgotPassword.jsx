import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, CheckCircle, KeyRound, Lock } from "lucide-react";
import { authApi } from "../../services/api";
import "../../styles/admin/register.css";

const AdminForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [step, setStep] = useState(1); // 1: email, 2: OTP, 3: reset password

  // Handle sending OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      await authApi.forgotPassword({ email });
      setSuccess('OTP sent to your email! Please check your inbox.');
      setStep(2); // Move to OTP step
    } catch (err) {
      console.error('Send OTP error:', err);
      
      if (err.response?.data?.message) {
        // Even if there's an error, move to OTP step for security
        setSuccess('If an account exists with this email, you will receive an OTP code');
        setStep(2);
      } else if (err.request) {
        setError('Network error. Please check your connection.');
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP verification
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!otp.trim()) {
      setError('Please enter the OTP code');
      return;
    }

    if (otp.length !== 6 || !/^\d+$/.test(otp)) {
      setError('OTP must be 6 digits');
      return;
    }

    setLoading(true);

    try {
      // First, try to verify OTP by attempting reset with dummy password
      // Or you could create a separate OTP verification endpoint
      const response = await authApi.resetPassword({ 
        email, 
        otp, 
        newPassword: 'TempPassword123!' 
      });
      
      // If we reach here, OTP is valid
      setSuccess('OTP verified successfully!');
      setStep(3); // Move to password reset step
    } catch (err) {
      console.error('OTP verification error:', err);
      
      if (err.response?.data?.message) {
        // If error is about password strength, OTP is valid
        if (err.response.data.message.toLowerCase().includes('password')) {
          setSuccess('OTP verified successfully!');
          setStep(3); // Move to password reset step
        } else {
          setError(err.response.data.message);
        }
      } else if (err.response?.status === 400) {
        // Bad request - likely invalid OTP
        setError('Invalid or expired OTP. Please try again.');
      } else if (err.request) {
        setError('Network error. Please check your connection.');
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!newPassword.trim()) {
      setError('Please enter a new password');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    const passwordRegex = /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
    if (!passwordRegex.test(newPassword)) {
      setError('Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number or special character');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await authApi.resetPassword({ 
        email, 
        otp, 
        newPassword 
      });
      
      setSuccess('Password reset successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/admin/login');
      }, 3000);
    } catch (err) {
      console.error('Reset password error:', err);
      
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.request) {
        setError('Network error. Please check your connection.');
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError('');
    setLoading(true);

    try {
      await authApi.forgotPassword({ email });
      setSuccess('New OTP sent! Please check your email.');
      setOtp('');
    } catch (err) {
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const goBackToEmail = () => {
    setStep(1);
    setOtp('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setSuccess('');
  };

  const goBackToOtp = () => {
    setStep(2);
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setSuccess('');
  };

  return (
    <div className="login-page">
      <div className="auth-container">
        <div className="auth-header">
          <div className="auth-logo">C</div>
          <h1 className="auth-title">
            {step === 1 ? 'Reset Password' : step === 2 ? 'Enter OTP' : 'New Password'}
          </h1>
          <p className="auth-subtitle">
            {step === 1 
              ? 'Enter your email to receive an OTP code' 
              : step === 2 
              ? `Check ${email} for the 6-digit OTP` 
              : 'Create a new password for your account'
            }
          </p>
        </div>

        <Link to="/admin/login" className="back-to-login">
          ← Back to Login
        </Link>

        {/* Error Message */}
        {error && (
          <div className="error-message otp-error">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="success-message otp-success">
            {success}
          </div>
        )}

        {step === 1 ? (
          // STEP 1: Email Input
          <form className="auth-form" onSubmit={handleSendOtp}>
            <div className="form-group">
              <label className="form-label">
                <Mail size={16} />
                <span>EMAIL ADDRESS</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                placeholder="Enter your registered email"
                required
                disabled={loading}
              />
            </div>

            {loading ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <span>SENDING OTP...</span>
              </div>
            ) : (
              <button type="submit" className="login-button">
                SEND OTP
              </button>
            )}
          </form>
        ) : step === 2 ? (
          // STEP 2: OTP Verification Only
          <form className="auth-form" onSubmit={handleVerifyOtp}>
            <div className="form-group">
              <label className="form-label">
                <KeyRound size={16} />
                <span>OTP CODE</span>
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="form-input otp-input"
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                required
                disabled={loading}
              />
              <div className="form-hint">
                <span>Check your email for the OTP</span>
                <button 
                  type="button"
                  onClick={handleResendOtp}
                  className="text-link"
                  disabled={loading}
                >
                  Resend OTP
                </button>
              </div>
            </div>

            {loading ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <span>VERIFYING OTP...</span>
              </div>
            ) : (
              <>
                <button type="submit" className="login-button">
                  VERIFY OTP
                </button>
                <button 
                  type="button"
                  onClick={goBackToEmail}
                  className="text-link back-link"
                >
                  ← Use different email
                </button>
              </>
            )}
          </form>
        ) : (
          // STEP 3: Password Reset
          <form className="auth-form" onSubmit={handleResetPassword}>
            <div className="form-group">
              <label className="form-label">
                <Lock size={16} />
                <span>NEW PASSWORD</span>
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="form-input"
                placeholder="Enter new password"
                required
                disabled={loading}
              />
              <div className="form-hint">
                Must be 8+ characters with uppercase, lowercase, and number/symbol
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                <Lock size={16} />
                <span>CONFIRM PASSWORD</span>
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="form-input"
                placeholder="Confirm new password"
                required
                disabled={loading}
              />
            </div>

            {loading ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <span>RESETTING PASSWORD...</span>
              </div>
            ) : (
              <>
                <button type="submit" className="login-button">
                  RESET PASSWORD
                </button>
                <button 
                  type="button"
                  onClick={goBackToOtp}
                  className="text-link back-link"
                >
                  ← Back to OTP
                </button>
              </>
            )}
          </form>
        )}

        <div className="auth-footer">
          <p>
            Remember your password?{' '}
            <Link to="/admin/login" className="auth-link">
              Sign in here
            </Link>
          </p>
        </div>

        {step === 2 && (
          <div className="info-box">
            <h4>How to verify your OTP:</h4>
            <ol>
              <li>Check your email inbox for the 6-digit OTP code</li>
              <li>Enter the code above</li>
              <li>Click "Verify OTP"</li>
              <li>If successful, you'll be asked to create a new password</li>
            </ol>
            <p className="note">
              The OTP expires in 10 minutes. Didn't receive it? Click "Resend OTP".
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminForgotPassword;