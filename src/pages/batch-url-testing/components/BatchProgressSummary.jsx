import React from 'react';
import Icon from '../../../components/AppIcon';

const BatchProgressSummary = ({ batchStats, currentBatch }) => {
  const getOverallProgress = () => {
    if (batchStats?.total === 0) return 0;
    return Math.round((batchStats?.completed / batchStats?.total) * 100);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'running':
        return 'text-accent';
      case 'completed':
        return 'text-success';
      case 'failed':
        return 'text-error';
      case 'paused':
        return 'text-warning';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'running':
        return 'Play';
      case 'completed':
        return 'CheckCircle';
      case 'failed':
        return 'AlertCircle';
      case 'paused':
        return 'Pause';
      default:
        return 'Clock';
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Batch Progress Summary</h3>
        {currentBatch && (
          <div className="flex items-center space-x-2">
            <div className={`animate-pulse ${currentBatch?.status === 'running' ? 'block' : 'hidden'}`}>
              <div className="w-2 h-2 bg-accent rounded-full"></div>
            </div>
            <span className={`text-sm font-medium capitalize ${getStatusColor(currentBatch?.status)}`}>
              {currentBatch?.status}
            </span>
          </div>
        )}
      </div>
      {/* Overall Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Overall Progress</span>
          <span className="text-sm font-medium text-foreground">
            {getOverallProgress()}%
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-3">
          <div 
            className="bg-accent h-3 rounded-full transition-organic"
            style={{ width: `${getOverallProgress()}%` }}
          ></div>
        </div>
        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
          <span>{batchStats?.completed} of {batchStats?.total} completed</span>
          {currentBatch?.estimatedTimeRemaining && (
            <span>Est. {currentBatch?.estimatedTimeRemaining} remaining</span>
          )}
        </div>
      </div>
      {/* Status Breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <Icon name="Clock" size={16} className="text-muted-foreground" />
            <span className="text-2xl font-bold text-muted-foreground">
              {batchStats?.pending}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">Pending</p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <Icon name="Play" size={16} className="text-accent" />
            <span className="text-2xl font-bold text-accent">
              {batchStats?.running}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">Running</p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <Icon name="CheckCircle" size={16} className="text-success" />
            <span className="text-2xl font-bold text-success">
              {batchStats?.completed}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">Completed</p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <Icon name="AlertCircle" size={16} className="text-error" />
            <span className="text-2xl font-bold text-error">
              {batchStats?.failed}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">Failed</p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <Icon name="XCircle" size={16} className="text-warning" />
            <span className="text-2xl font-bold text-warning">
              {batchStats?.cancelled}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">Cancelled</p>
        </div>
      </div>
      {/* Current Job Info */}
      {currentBatch?.currentJob && (
        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Icon name="Globe" size={16} className="text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">
                Currently processing:
              </span>
            </div>
            <span className="text-sm text-muted-foreground truncate max-w-md">
              {currentBatch?.currentJob?.url}
            </span>
            <div className="flex items-center space-x-1">
              <Icon name={getStatusIcon(currentBatch?.currentJob?.status)} size={14} className={getStatusColor(currentBatch?.currentJob?.status)} />
              <span className={`text-xs font-medium ${getStatusColor(currentBatch?.currentJob?.status)}`}>
                {currentBatch?.currentJob?.experiment}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BatchProgressSummary;