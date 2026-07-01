import React from 'react';

const TaskFilters = ({ filters, onFilterChange }) => {
  const handleSearchChange = (e) => {
    onFilterChange({ ...filters, search: e.target.value, page: 1 });
  };

  const handleStatusChange = (e) => {
    onFilterChange({ ...filters, status: e.target.value, page: 1 });
  };

  const handleSortChange = (e) => {
    onFilterChange({ ...filters, sort: e.target.value, page: 1 });
  };

  return (
    <div className="glass-card p-4 mb-4" style={{ transform: 'none', boxShadow: 'var(--shadow-sm)' }}>
      <div className="row g-3">
        {/* Search */}
        <div className="col-12 col-md-5">
          <label className="form-label small fw-semibold" style={{ color: 'var(--text-secondary)' }}>Search Tasks</label>
          <input
            type="text"
            className="form-control form-control-custom"
            placeholder="Type task title..."
            value={filters.search}
            onChange={handleSearchChange}
          />
        </div>

        {/* Status Filter */}
        <div className="col-12 col-sm-6 col-md-3">
          <label className="form-label small fw-semibold" style={{ color: 'var(--text-secondary)' }}>Status</label>
          <select
            className="form-select filter-select w-100 py-2"
            value={filters.status}
            onChange={handleStatusChange}
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {/* Sort order */}
        <div className="col-12 col-sm-6 col-md-4">
          <label className="form-label small fw-semibold" style={{ color: 'var(--text-secondary)' }}>Sort By</label>
          <select
            className="form-select filter-select w-100 py-2"
            value={filters.sort}
            onChange={handleSortChange}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default TaskFilters;
