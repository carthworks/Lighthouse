import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';

const Toast = ({ 
  id,
  type = 'info', 
  title, 
  message, 
  duration = 5000, 
  onClose,
  action = null 
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  const getToastConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: 'CheckCircle',
          bgColor: 'bg-success',
          textColor: 'text-success-foreground',
          borderColor: 'border-success'
        };
      case 'error':
        return {
          icon: 'AlertCircle',
          bgColor: 'bg-error',
          textColor: 'text-error-foreground',
          borderColor: 'border-error'
        };
      case 'warning':
        return {
          icon: 'AlertTriangle',
          bgColor: 'bg-warning',
          textColor: 'text-warning-foreground',
          borderColor: 'border-warning'
        };
      case 'info':
      default:
        return {
          icon: 'Info',
          bgColor: 'bg-accent',
          textColor: 'text-accent-foreground',
          borderColor: 'border-accent'
        };
    }
  };

  const config = getToastConfig();

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose(id);
    }, 150);
  };

  if (!isVisible) return null;

  return (
    <div 
      className={`
        ${config?.bgColor} ${config?.textColor} rounded-lg shadow-elevated p-4 mb-3 
        transition-smooth transform
        ${isExiting ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}
      `}
      role="alert"
    >
      <div className="flex items-start space-x-3">
        <Icon name={config?.icon} size={20} className="flex-shrink-0 mt-0.5" />
        
        <div className="flex-1 min-w-0">
          {title && (
            <h4 className="text-sm font-medium mb-1">{title}</h4>
          )}
          {message && (
            <p className="text-sm opacity-90">{message}</p>
          )}
          
          {action && (
            <div className="mt-2">
              <button
                onClick={action?.onClick}
                className="text-xs underline hover:no-underline transition-smooth"
              >
                {action?.label}
              </button>
            </div>
          )}
        </div>

        <button
          onClick={handleClose}
          className="flex-shrink-0 p-1 rounded-md hover:bg-black/10 transition-smooth"
        >
          <Icon name="X" size={16} />
        </button>
      </div>
    </div>
  );
};

const NotificationToast = ({ toasts = [], onRemoveToast }) => {
  if (toasts?.length === 0) return null;

  return (
    <div className="fixed top-20 right-6 z-1020 w-96 max-w-[calc(100vw-3rem)]">
      {toasts?.map((toast) => (
        <Toast
          key={toast?.id}
          {...toast}
          onClose={onRemoveToast}
        />
      ))}
    </div>
  );
};

// Hook for managing toast notifications
export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = (toast) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { ...toast, id }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev?.filter(toast => toast?.id !== id));
  };

  const clearAllToasts = () => {
    setToasts([]);
  };

  return {
    toasts,
    addToast,
    removeToast,
    clearAllToasts
  };
};

export default NotificationToast;