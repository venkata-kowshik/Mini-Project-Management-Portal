import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authService.isAuthenticated()) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password, confirmPassword } = formData;

    if (!username || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await authService.register(username, email, password);
      setSuccess('Registration successful! Redirecting...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="glass-card auth-card mt-5 mb-5">
        <h2 className="text-center fw-bold mb-3" style={{ color: 'var(--text-primary)' }}>
          Create Account
        </h2>
        <p className="text-center mb-4" style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Sign up to organize and track tasks.
        </p>

        {error && <div className="alert alert-danger py-2" role="alert" style={{ fontSize: '0.9rem' }}>{error}</div>}
        {success && <div className="alert alert-success py-2" role="alert" style={{ fontSize: '0.9rem' }}>{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-semibold" style={{ color: 'var(--text-secondary)' }}>Username</label>
            <input
              type="text"
              name="username"
              className="form-control form-control-custom"
              placeholder="johndoe"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

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

          <div className="mb-3">
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

          <div className="mb-4">
            <label className="form-label small fw-semibold" style={{ color: 'var(--text-secondary)' }}>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              className="form-control form-control-custom"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary-custom w-100 mb-3"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center mb-0 mt-3" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link to="/login" className="fw-semibold" style={{ color: 'var(--accent-color)', textDecoration: 'none' }}>
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
