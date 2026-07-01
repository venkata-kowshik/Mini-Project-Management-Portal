import React from 'react';

const Spinner = () => {
  return (
    <div className="d-flex justify-content-center align-items-center py-5 w-100">
      <div className="spinner-border" style={{ color: 'var(--accent-color)', width: '3rem', height: '3rem' }} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default Spinner;
