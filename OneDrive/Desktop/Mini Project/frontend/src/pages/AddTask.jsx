import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import taskService from '../services/taskService';

const AddTask = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Pending'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, description, status } = formData;

    if (!title.trim()) {
      setError('Task Title is required.');
      return;
    }

    if (!description.trim()) {
      setError('Description is required.');
      return;
    }

    if (description.trim().length < 20) {
      setError('Description must be at least 20 characters long.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await taskService.createTask({ title, description, status });
      setSuccess('Task created successfully! Redirecting...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1200);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to create task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4" style={{ maxWidth: '650px' }}>
      <div className="mb-4">
        <Link to="/dashboard" className="btn btn-secondary-custom btn-sm">
          &larr; Back to Workspace
        </Link>
      </div>

      <div className="glass-card p-4 p-md-5 mb-5" style={{ transform: 'none' }}>
        <h3 className="fw-bold mb-1" style={{ color: 'var(--text-primary)' }}>Create New Task</h3>
        <p className="mb-4" style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Add details to create a new task in your workspace.</p>

        {error && <div className="alert alert-danger" role="alert">{error}</div>}
        {success && <div className="alert alert-success" role="alert">{success}</div>}

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="mb-3">
            <label className="form-label small fw-semibold" style={{ color: 'var(--text-secondary)' }}>Task Title</label>
            <input
              type="text"
              name="title"
              className="form-control form-control-custom"
              placeholder="e.g. Build Login Page"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          {/* Status */}
          <div className="mb-3">
            <label className="form-label small fw-semibold" style={{ color: 'var(--text-secondary)' }}>Status</label>
            <select
              name="status"
              className="form-select filter-select w-100 py-2"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="form-label small fw-semibold" style={{ color: 'var(--text-secondary)' }}>Description</label>
            <textarea
              name="description"
              className="form-control form-control-custom"
              rows="5"
              placeholder="Provide a detailed description of the task (minimum 20 characters)..."
              value={formData.description}
              onChange={handleChange}
              required
            ></textarea>
            <div className="form-text small mt-1" style={{ color: 'var(--text-secondary)' }}>
              Current character count: <strong style={{ color: formData.description.length >= 20 ? 'var(--completed-color)' : 'inherit' }}>{formData.description.length}</strong> / 20 required.
            </div>
          </div>

          <div className="d-flex justify-content-end gap-3 mt-4">
            <Link to="/dashboard" className="btn btn-secondary-custom py-2 px-4">
              Cancel
            </Link>
            <button
              type="submit"
              className="btn btn-primary-custom py-2 px-4"
              disabled={loading}
            >
              {loading ? 'Creating Task...' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTask;
