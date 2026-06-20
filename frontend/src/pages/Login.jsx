import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import authService from '../services/authService';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authService.isAuthenticated()) {
      navigate('/dashboard');
    }

    const params = new URLSearchParams(location.search);
    if (params.get('expired')) {
      setError('Your session has expired. Please log in again.');
    }
  }, [navigate, location]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      await authService.login(email, password);
      setSuccess('Login successful! Redirecting...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="glass-card auth-card mt-5 mb-5">
        <h2 className="text-center fw-bold mb-3" style={{ color: 'var(--text-primary)' }}>
          Welcome Back
        </h2>
        <p className="text-center mb-4" style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Log in to manage your daily tasks.
        </p>

        {error && <div className="alert alert-danger py-2" role="alert" style={{ fontSize: '0.9rem' }}>{error}</div>}
        {success && <div className="alert alert-success py-2" role="alert" style={{ fontSize: '0.9rem' }}>{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-semibold" style={{ color: 'var(--text-secondary)' }}>Email Address</label>
            <input
              type="email"
              name="email"
              className="form-control form-control-custom"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label small fw-semibold" style={{ color: 'var(--text-secondary)' }}>Password</label>
            <input
              type="password"
              name="password"
              className="form-control form-control-custom"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary-custom w-100 mb-3"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center mb-0 mt-3" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Don't have an account?{' '}
          <Link to="/register" className="fw-semibold" style={{ color: 'var(--accent-color)', textDecoration: 'none' }}>
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
