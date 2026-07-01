import React from 'react';

const TaskCard = ({ task, onStatusChange, onDelete }) => {
  const getBadgeClass = (status) => {
    switch (status) {
      case 'Pending':
        return 'badge-pending';
      case 'In Progress':
        return 'badge-progress';
      case 'Completed':
        return 'badge-completed';
      default:
        return 'bg-secondary';
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="col-12 col-md-6 col-lg-4">
      <div className="glass-card p-4 h-100 d-flex flex-column justify-content-between">
        <div>
          <div className="d-flex justify-content-between align-items-start mb-3">
            <span className={`badge-status ${getBadgeClass(task.status)}`}>
              {task.status}
            </span>
            <span className="small text-muted" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              {formatDate(task.created_at)}
            </span>
          </div>
          
          <h5 className="fw-bold mb-2 text-truncate" title={task.title} style={{ color: 'var(--text-primary)' }}>
            {task.title}
          </h5>
          
          <p className="task-desc mb-4" title={task.description} style={{ color: 'var(--text-secondary)' }}>
            {task.description}
          </p>
        </div>

        <div>
          <hr style={{ borderColor: 'var(--border-color)', margin: '12px 0' }} />
          <div className="d-flex justify-content-between align-items-center">
            {/* Status switcher select */}
            <div className="d-flex align-items-center gap-1">
              <span className="small text-muted" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Status:</span>
              <select
                className="form-select form-select-sm filter-select border-0 px-2 py-1"
                style={{ fontSize: '0.8rem', background: 'transparent', cursor: 'pointer', color: 'var(--text-primary)' }}
                value={task.status}
                onChange={(e) => onStatusChange(task.id, e.target.value)}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            {/* Actions */}
            <div className="d-flex gap-1">
              {task.status !== 'Completed' && (
                <button
                  className="task-action-btn complete"
                  title="Mark as Completed"
                  onClick={() => onStatusChange(task.id, 'Completed')}
                >
                  ✔
                </button>
              )}
              <button
                className="task-action-btn delete"
                title="Delete Task"
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this task?')) {
                    onDelete(task.id);
                  }
                }}
              >
                🗑
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
