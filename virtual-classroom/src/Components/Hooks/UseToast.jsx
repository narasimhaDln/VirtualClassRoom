import  { useState, useCallback } from 'react';
import React from 'react'
const Toast = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 3000);
  }, []);

  return (
    <>
      <div>
        <button onClick={() => showToast('Success message', 'success')}>
          Show Success Toast
        </button>
        <button onClick={() => showToast('Error message', 'error')}>
          Show Error Toast
        </button>
        <button onClick={() => showToast('Warning message', 'warning')}>
          Show Warning Toast
        </button>
        <button onClick={() => showToast('Info message', 'info')}>
          Show Info Toast
        </button>
      </div>

      <div className="fixed bottom-4 right-4 space-y-2 z-50">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`toast ${
              toast.type === 'success'
                ? 'toast-success'
                : toast.type === 'error'
                ? 'toast-error'
                : toast.type === 'warning'
                ? 'bg-yellow-500 text-white'
                : 'bg-blue-500 text-white'
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </>
  );
};

export default Toast;