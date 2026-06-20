import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import taskService from '../services/taskService';
import StatsWidget from '../components/StatsWidget';
import TaskFilters from '../components/TaskFilters';
import TaskCard from '../components/TaskCard';
import Spinner from '../components/Spinner';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, completed: 0 });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'All',
    search: '',
    page: 1,
    limit: 6,
    sort: 'newest'
  });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 6,
    pages: 1
  });
  const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
    try {
      const statsData = await taskService.getStats();
      setStats(statsData);

      const tasksResponse = await taskService.getTasks(filters);
      setTasks(tasksResponse.tasks);
      setPagination(tasksResponse.pagination);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Could not retrieve tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchData();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [filters.search, filters.status, filters.sort, filters.page, fetchData]);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await taskService.updateTaskStatus(taskId, newStatus);
      fetchData();
    } catch (err) {
      console.error('Error updating task status:', err);
      alert(err.response?.data?.message || 'Failed to update task status.');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await taskService.deleteTask(taskId);
      fetchData();
    } catch (err) {
      console.error('Error deleting task:', err);
      alert(err.response?.data?.message || 'Failed to delete task.');
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      setFilters(prev => ({ ...prev, page: newPage }));
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1" style={{ color: 'var(--text-primary)' }}>Your Workspace</h2>
          <p className="text-muted mb-0" style={{ color: 'var(--text-secondary)' }}>Track and manage your tasks effectively</p>
        </div>
        <Link className="btn btn-primary-custom" to="/add-task">
          + Add New Task
        </Link>
      </div>

      {error && <div className="alert alert-danger" role="alert">{error}</div>}

      {/* Stats Widgets */}
      <StatsWidget stats={stats} />

      {/* Filter and Search Bar */}
      <TaskFilters filters={filters} onFilterChange={setFilters} />

      {/* Task List Section */}
      {loading ? (
        <Spinner />
      ) : tasks.length === 0 ? (
        <div className="glass-card text-center py-5 px-4 my-4" style={{ transform: 'none' }}>
          <div className="mb-3" style={{ fontSize: '3rem' }}>📂</div>
          <h4 className="fw-bold" style={{ color: 'var(--text-primary)' }}>No tasks found</h4>
          <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>
            {filters.search 
              ? 'No tasks match your search criteria. Try a different query.' 
              : filters.status !== 'All'
                ? `You don't have any tasks in status: ${filters.status}.`
                : 'Your task list is empty. Click the button above to add your first task!'}
          </p>
          {!filters.search && filters.status === 'All' && (
            <Link className="btn btn-primary-custom" to="/add-task">
              Create First Task
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className="row g-4 mb-4">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onStatusChange={handleStatusChange}
                onDelete={handleDeleteTask}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          {pagination.pages > 1 && (
            <div className="d-flex justify-content-center align-items-center mt-5 mb-3">
              <button
                className={`page-link-custom ${pagination.page === 1 ? 'disabled' : ''}`}
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                &laquo; Prev
              </button>

              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  className={`page-link-custom ${pagination.page === p ? 'active' : ''}`}
                  onClick={() => handlePageChange(p)}
                >
                  {p}
                </button>
              ))}

              <button
                className={`page-link-custom ${pagination.page === pagination.pages ? 'disabled' : ''}`}
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
              >
                Next &raquo;
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
