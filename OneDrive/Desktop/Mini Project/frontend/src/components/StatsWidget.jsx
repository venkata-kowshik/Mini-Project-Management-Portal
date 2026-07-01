import React from 'react';

const StatsWidget = ({ stats }) => {
  const { total = 0, pending = 0, inProgress = 0, completed = 0 } = stats || {};

  return (
    <div className="row g-4 mb-4">
      {/* Total Tasks */}
      <div className="col-12 col-sm-6 col-lg-3">
        <div className="stat-card">
          <div>
            <h6 className="text-muted text-uppercase mb-1 fw-semibold" style={{ fontSize: '0.75rem', letterSpacing: '0.5px', color: 'var(--text-secondary)' }}>Total Tasks</h6>
            <h3 className="mb-0 fw-bold" style={{ color: 'var(--text-primary)' }}>{total}</h3>
          </div>
          <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--accent-glow)', color: 'var(--accent-color)' }}>
            📋
          </div>
        </div>
      </div>

      {/* Pending Tasks */}
      <div className="col-12 col-sm-6 col-lg-3">
        <div className="stat-card">
          <div>
            <h6 className="text-muted text-uppercase mb-1 fw-semibold" style={{ fontSize: '0.75rem', letterSpacing: '0.5px', color: 'var(--text-secondary)' }}>Pending</h6>
            <h3 className="mb-0 fw-bold" style={{ color: 'var(--text-primary)' }}>{pending}</h3>
          </div>
          <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--pending-bg)', color: 'var(--pending-color)' }}>
            ⏳
          </div>
        </div>
      </div>

      {/* In Progress Tasks */}
      <div className="col-12 col-sm-6 col-lg-3">
        <div className="stat-card">
          <div>
            <h6 className="text-muted text-uppercase mb-1 fw-semibold" style={{ fontSize: '0.75rem', letterSpacing: '0.5px', color: 'var(--text-secondary)' }}>In Progress</h6>
            <h3 className="mb-0 fw-bold" style={{ color: 'var(--text-primary)' }}>{inProgress}</h3>
          </div>
          <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--progress-bg)', color: 'var(--progress-color)' }}>
            ⚡
          </div>
        </div>
      </div>

      {/* Completed Tasks */}
      <div className="col-12 col-sm-6 col-lg-3">
        <div className="stat-card">
          <div>
            <h6 className="text-muted text-uppercase mb-1 fw-semibold" style={{ fontSize: '0.75rem', letterSpacing: '0.5px', color: 'var(--text-secondary)' }}>Completed</h6>
            <h3 className="mb-0 fw-bold" style={{ color: 'var(--text-primary)' }}>{completed}</h3>
          </div>
          <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--completed-bg)', color: 'var(--completed-color)' }}>
            ✅
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsWidget;
