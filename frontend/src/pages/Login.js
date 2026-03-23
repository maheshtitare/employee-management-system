import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginAPI, forgotPasswordAPI, resetPasswordAPI } from '../services/api';
import './Login.css';

/**
 * 🔐 Login Page
 *
 * Features:
 * - Login with Email OR Mobile + Password
 * - Client-side password validation
 * - Forgot Password → OTP → Reset Password flow
 * - Show/hide password toggle
 */

// Password validation rules
const validatePassword = (password) => {
  const errors = [];
  if (password.length < 8) errors.push('At least 8 characters');
  if (!/[A-Z]/.test(password)) errors.push('One uppercase letter');
  if (!/[a-z]/.test(password)) errors.push('One lowercase letter');
  if (!/\d/.test(password)) errors.push('One number');
  if (!/[@#$%^&+=!]/.test(password)) errors.push('One special character (@#$%^&+=!)');
  return errors;
};

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  // 'login' | 'forgot' | 'reset'
  const [mode, setMode] = useState('login');
  const [loginType, setLoginType] = useState('email'); // 'email' or 'mobile'

  // Form state
  const [formData, setFormData] = useState({
    email: '', mobile: '', password: '',
    otp: '', newPassword: '', confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  // ── LOGIN SUBMIT ──
  const handleLogin = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (loginType === 'email' && !formData.email) newErrors.email = 'Email is required';
    if (loginType === 'mobile' && !formData.mobile) newErrors.mobile = 'Mobile number is required';
    if (!formData.password) newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    setLoading(true);
    try {
      const payload = {
        password: formData.password,
        ...(loginType === 'email' ? { email: formData.email } : { mobile: formData.mobile }),
      };
      const res = await loginAPI(payload);
      login(res.data);
      navigate('/dashboard');
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || 'Login failed. Check credentials.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  // ── FORGOT PASSWORD ──
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!formData.email && !formData.mobile) {
      setErrors({ identifier: 'Enter email or mobile number' });
      return;
    }
    setLoading(true);
    try {
      const payload = formData.email ? { email: formData.email } : { mobile: formData.mobile };
      const res = await forgotPasswordAPI(payload);
      setMessage({ text: res.data, type: 'success' });
      setMode('reset');
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Account not found.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // ── RESET PASSWORD ──
  const handleResetPassword = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.otp) newErrors.otp = 'OTP is required';
    if (!formData.newPassword) newErrors.newPassword = 'New password is required';
    const pwdErrors = validatePassword(formData.newPassword);
    if (pwdErrors.length > 0) newErrors.newPassword = pwdErrors[0];
    if (formData.newPassword !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    setLoading(true);
    try {
      const payload = {
        otp: formData.otp,
        newPassword: formData.newPassword,
        ...(formData.email ? { email: formData.email } : { mobile: formData.mobile }),
      };
      const res = await resetPasswordAPI(payload);
      setMessage({ text: res.data, type: 'success' });
      setTimeout(() => { setMode('login'); setFormData({ email:'',mobile:'',password:'',otp:'',newPassword:'',confirmPassword:'' }); }, 2000);
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Reset failed.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Left decorative panel */}
      <div className="login-left">
        <div className="login-left-content">
          <div className="login-logo">⚡</div>
          <h1>Employee Management System</h1>
          <p>Manage your workforce efficiently with our modern platform.</p>
          <div className="login-features">
            {['👥 Manage Employees', '🏢 Department Control', '📊 Live Dashboard', '🔒 Secure Access'].map(f => (
              <div key={f} className="feature-chip">{f}</div>
            ))}
          </div>
        </div>
        <div className="login-blob blob1" />
        <div className="login-blob blob2" />
      </div>

      {/* Right form panel */}
      <div className="login-right">
        <div className="login-card">

          {/* LOGIN FORM */}
          {mode === 'login' && (
            <>
              <div className="login-header">
                <h2>Welcome back 👋</h2>
                <p>Sign in to your account</p>
              </div>

              {/* Login type toggle */}
              <div className="login-toggle">
                <button
                  className={`toggle-btn ${loginType === 'email' ? 'active' : ''}`}
                  onClick={() => setLoginType('email')}
                >📧 Email</button>
                <button
                  className={`toggle-btn ${loginType === 'mobile' ? 'active' : ''}`}
                  onClick={() => setLoginType('mobile')}
                >📱 Mobile</button>
              </div>

              {message.text && (
                <div className={`auth-message ${message.type}`}>{message.text}</div>
              )}

              <form onSubmit={handleLogin}>
                {loginType === 'email' ? (
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`form-control ${errors.email ? 'error' : ''}`}
                      placeholder="admin@ems.com"
                    />
                    {errors.email && <p className="form-error">{errors.email}</p>}
                  </div>
                ) : (
                  <div className="form-group">
                    <label className="form-label">Mobile Number</label>
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      className={`form-control ${errors.mobile ? 'error' : ''}`}
                      placeholder="9999999999"
                      maxLength="10"
                    />
                    {errors.mobile && <p className="form-error">{errors.mobile}</p>}
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Password</label>
                  <div className="password-wrapper">
                    <input
                      type={showPass ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`form-control ${errors.password ? 'error' : ''}`}
                      placeholder="Enter password"
                    />
                    <button type="button" className="pass-toggle" onClick={() => setShowPass(!showPass)}>
                      {showPass ? '🙈' : '👁️'}
                    </button>
                  </div>
                  {errors.password && <p className="form-error">{errors.password}</p>}
                </div>

                <button type="submit" className="btn btn-primary login-submit" disabled={loading}>
                  {loading ? '⏳ Signing in...' : '🚀 Sign In'}
                </button>
              </form>

              <div className="login-links">
                <button className="link-btn" onClick={() => { setMode('forgot'); setMessage({ text:'', type:'' }); }}>
                  Forgot Password?
                </button>
              </div>

              <div className="demo-credentials">
                <p>🧪 Demo Credentials</p>
                <code>Admin: admin@ems.com / Admin@123</code>
                <code>User: user@ems.com / User@1234</code>
              </div>
            </>
          )}

          {/* FORGOT PASSWORD FORM */}
          {mode === 'forgot' && (
            <>
              <div className="login-header">
                <h2>Forgot Password 🔑</h2>
                <p>Enter your email or mobile to receive OTP</p>
              </div>
              {message.text && <div className={`auth-message ${message.type}`}>{message.text}</div>}
              <form onSubmit={handleForgotPassword}>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange}
                    className="form-control" placeholder="Your registered email" />
                </div>
                <div style={{ textAlign: 'center', margin: '8px 0', color: 'var(--gray)', fontSize: '13px' }}>OR</div>
                <div className="form-group">
                  <label className="form-label">Mobile Number</label>
                  <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange}
                    className="form-control" placeholder="Your registered mobile" />
                </div>
                {errors.identifier && <p className="form-error">{errors.identifier}</p>}
                <button type="submit" className="btn btn-primary login-submit" disabled={loading}>
                  {loading ? '⏳ Sending...' : '📤 Send OTP'}
                </button>
              </form>
              <div className="login-links">
                <button className="link-btn" onClick={() => setMode('login')}>← Back to Login</button>
              </div>
            </>
          )}

          {/* RESET PASSWORD FORM */}
          {mode === 'reset' && (
            <>
              <div className="login-header">
                <h2>Reset Password 🔒</h2>
                <p>Enter the OTP and your new password</p>
              </div>
              {message.text && <div className={`auth-message ${message.type}`}>{message.text}</div>}
              <form onSubmit={handleResetPassword}>
                <div className="form-group">
                  <label className="form-label">OTP</label>
                  <input type="text" name="otp" value={formData.otp} onChange={handleChange}
                    className={`form-control ${errors.otp ? 'error' : ''}`}
                    placeholder="Enter OTP (Demo: 123456)" maxLength="6" />
                  {errors.otp && <p className="form-error">{errors.otp}</p>}
                </div>
                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange}
                    className={`form-control ${errors.newPassword ? 'error' : ''}`}
                    placeholder="Min 8 chars, upper+lower+number+special" />
                  {errors.newPassword && <p className="form-error">{errors.newPassword}</p>}
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm Password</label>
                  <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}
                    className={`form-control ${errors.confirmPassword ? 'error' : ''}`}
                    placeholder="Re-enter new password" />
                  {errors.confirmPassword && <p className="form-error">{errors.confirmPassword}</p>}
                </div>
                <button type="submit" className="btn btn-primary login-submit" disabled={loading}>
                  {loading ? '⏳ Resetting...' : '✅ Reset Password'}
                </button>
              </form>
              <div className="login-links">
                <button className="link-btn" onClick={() => setMode('login')}>← Back to Login</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
