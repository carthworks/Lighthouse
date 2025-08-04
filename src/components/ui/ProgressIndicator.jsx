import React from 'react';
import Icon from '../AppIcon';

const ProgressIndicator = ({ 
  progress = 0, 
  status = 'idle', 
  experimentName = '', 
  estimatedTime = null,
  onCancel = null,
  className = '' 
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'running':
        return {
          color: 'accent',
          icon: 'Play',
          bgColor: 'bg-accent/10',
          textColor: 'text-accent'
        };
      case 'completed':
        return {
          color: 'success',
          icon: 'CheckCircle',
          bgColor: 'bg-success/10',
          textColor: 'text-success'
        };
      case 'error':
        return {
          color: 'error',
          icon: 'AlertCircle',
          bgColor: 'bg-error/10',
          textColor: 'text-error'
        };
      case 'cancelled':
        return {
          color: 'warning',
          icon: 'XCircle',
          bgColor: 'bg-warning/10',
          textColor: 'text-warning'
        };
      default:
        return {
          color: 'muted',
          icon: 'Clock',
          bgColor: 'bg-muted',
          textColor: 'text-muted-foreground'
        };
    }
  };

  const config = getStatusConfig();

  if (status === 'idle') {
    return null;
  }

  return (
    <div className={`${config?.bgColor} rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className={status === 'running' ? 'animate-pulse' : ''}>
            <Icon name={config?.icon} size={16} className={config?.textColor} />
          </div>
          <span className={`text-sm font-medium ${config?.textColor}`}>
            {experimentName || 'Lighthouse Experiment'}
          </span>
        </div>
        
        {onCancel && status === 'running' && (
          <button
            onClick={onCancel}
            className="text-xs text-muted-foreground hover:text-foreground transition-smooth flex items-center space-x-1"
          >
            <Icon name="X" size={12} />
            <span>Cancel</span>
          </button>
        )}
      </div>
      {status === 'running' && (
        <>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">Progress</span>
            <span className={`text-xs font-medium ${config?.textColor}`}>
              {Math.round(progress)}%
            </span>
          </div>
          
          <div className="w-full bg-muted rounded-full h-2 mb-2">
            <div 
              className={`bg-${config?.color} h-2 rounded-full transition-organic`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>

          {estimatedTime && (
            <div className="flex items-center space-x-1">
              <Icon name="Clock" size={12} className="text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                Est. {estimatedTime} remaining
              </span>
            </div>
          )}
        </>
      )}
      {status === 'completed' && (
        <div className="flex items-center space-x-1">
          <Icon name="CheckCircle" size={12} className={config?.textColor} />
          <span className={`text-xs ${config?.textColor}`}>
            Experiment completed successfully
          </span>
        </div>
      )}
      {status === 'error' && (
        <div className="flex items-center space-x-1">
          <Icon name="AlertCircle" size={12} className={config?.textColor} />
          <span className={`text-xs ${config?.textColor}`}>
            Experiment failed - check logs for details
          </span>
        </div>
      )}
      {status === 'cancelled' && (
        <div className="flex items-center space-x-1">
          <Icon name="XCircle" size={12} className={config?.textColor} />
          <span className={`text-xs ${config?.textColor}`}>
            Experiment cancelled by user
          </span>
        </div>
      )}
    </div>
  );
};

export default ProgressIndicator;