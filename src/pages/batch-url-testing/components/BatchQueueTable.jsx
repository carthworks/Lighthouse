import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BatchQueueTable = ({ 
  batchJobs, 
  onRetryJob, 
  onCancelJob, 
  onViewResults, 
  onExportResults 
}) => {
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filterStatus, setFilterStatus] = useState('all');

  const getStatusConfig = (status) => {
    switch (status) {
      case 'pending':
        return {
          color: 'text-muted-foreground',
          bgColor: 'bg-muted',
          icon: 'Clock'
        };
      case 'running':
        return {
          color: 'text-accent',
          bgColor: 'bg-accent/10',
          icon: 'Play'
        };
      case 'completed':
        return {
          color: 'text-success',
          bgColor: 'bg-success/10',
          icon: 'CheckCircle'
        };
      case 'failed':
        return {
          color: 'text-error',
          bgColor: 'bg-error/10',
          icon: 'AlertCircle'
        };
      case 'cancelled':
        return {
          color: 'text-warning',
          bgColor: 'bg-warning/10',
          icon: 'XCircle'
        };
      default:
        return {
          color: 'text-muted-foreground',
          bgColor: 'bg-muted',
          icon: 'Circle'
        };
    }
  };

  const formatDuration = (startTime, endTime) => {
    if (!startTime) return '-';
    if (!endTime && startTime) return 'Running...';
    
    const duration = new Date(endTime) - new Date(startTime);
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);
    
    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
  };

  const getExperimentBadges = (experiments) => {
    const badgeMap = {
      'baseline': { label: 'Base', color: 'bg-primary/10 text-primary' },
      'no-js': { label: 'No JS', color: 'bg-secondary/10 text-secondary' },
      'block-third-party': { label: '3rd Party', color: 'bg-warning/10 text-warning' },
      'no-render-blocking': { label: 'No Block', color: 'bg-success/10 text-success' },
      'unused-resources': { label: 'Unused', color: 'bg-error/10 text-error' },
      'first-party-only': { label: '1st Party', color: 'bg-accent/10 text-accent' }
    };

    return experiments?.map(exp => badgeMap?.[exp] || { label: exp, color: 'bg-muted text-muted-foreground' });
  };

  const filteredJobs = batchJobs?.filter(job => {
    if (filterStatus === 'all') return true;
    return job?.status === filterStatus;
  });

  const sortedJobs = [...filteredJobs]?.sort((a, b) => {
    let aValue = a?.[sortField];
    let bValue = b?.[sortField];
    
    if (sortField === 'createdAt' || sortField === 'completedAt') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    }
    return aValue < bValue ? 1 : -1;
  });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Batch Queue</h3>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onExportResults}
              iconName="Download"
              iconPosition="left"
            >
              Export All
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Filter:</span>
            {['all', 'pending', 'running', 'completed', 'failed']?.map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`
                  px-3 py-1 rounded-md text-xs font-medium transition-colors capitalize
                  ${filterStatus === status
                    ? 'bg-accent text-accent-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }
                `}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                <button
                  onClick={() => handleSort('url')}
                  className="flex items-center space-x-1 hover:text-foreground transition-colors"
                >
                  <span>URL</span>
                  <Icon name="ArrowUpDown" size={12} />
                </button>
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                Experiments
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                <button
                  onClick={() => handleSort('status')}
                  className="flex items-center space-x-1 hover:text-foreground transition-colors"
                >
                  <span>Status</span>
                  <Icon name="ArrowUpDown" size={12} />
                </button>
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                Progress
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                <button
                  onClick={() => handleSort('createdAt')}
                  className="flex items-center space-x-1 hover:text-foreground transition-colors"
                >
                  <span>Duration</span>
                  <Icon name="ArrowUpDown" size={12} />
                </button>
              </th>
              <th className="text-right p-4 text-sm font-medium text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedJobs?.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center">
                  <div className="flex flex-col items-center space-y-2">
                    <Icon name="Inbox" size={32} className="text-muted-foreground" />
                    <p className="text-muted-foreground">No batch jobs found</p>
                    <p className="text-sm text-muted-foreground">
                      Start by adding URLs and configuring experiments
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              sortedJobs?.map((job) => {
                const statusConfig = getStatusConfig(job?.status);
                const experimentBadges = getExperimentBadges(job?.experiments);
                
                return (
                  <tr key={job?.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <Icon name="Globe" size={16} className="text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium text-foreground truncate max-w-xs">
                            {job?.url}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            ID: {job?.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {experimentBadges?.slice(0, 3)?.map((badge, index) => (
                          <span
                            key={index}
                            className={`px-2 py-1 rounded text-xs font-medium ${badge?.color}`}
                          >
                            {badge?.label}
                          </span>
                        ))}
                        {experimentBadges?.length > 3 && (
                          <span className="px-2 py-1 rounded text-xs font-medium bg-muted text-muted-foreground">
                            +{experimentBadges?.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <div className={`p-1 rounded-full ${statusConfig?.bgColor}`}>
                          <Icon name={statusConfig?.icon} size={12} className={statusConfig?.color} />
                        </div>
                        <span className={`text-sm font-medium capitalize ${statusConfig?.color}`}>
                          {job?.status}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      {job?.status === 'running' ? (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              {job?.progress}%
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className="bg-accent h-2 rounded-full transition-organic"
                              style={{ width: `${job?.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      ) : job?.status === 'completed' ? (
                        <span className="text-sm text-success">100%</span>
                      ) : (
                        <span className="text-sm text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-muted-foreground">
                        {formatDuration(job?.startedAt, job?.completedAt)}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end space-x-2">
                        {job?.status === 'completed' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onViewResults(job?.id)}
                            iconName="Eye"
                            iconSize={14}
                          >
                            View
                          </Button>
                        )}
                        {job?.status === 'failed' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onRetryJob(job?.id)}
                            iconName="RotateCcw"
                            iconSize={14}
                          >
                            Retry
                          </Button>
                        )}
                        {job?.status === 'running' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onCancelJob(job?.id)}
                            iconName="X"
                            iconSize={14}
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BatchQueueTable;