import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecentActivityFeed = ({ activities, onViewAll }) => {
  const mockActivities = [
    {
      id: 1,
      type: 'experiment_completed',
      url: 'https://example.com',
      timestamp: new Date(Date.now() - 300000), // 5 minutes ago
      performanceGain: 18,
      experimentsCount: 6
    },
    {
      id: 2,
      type: 'experiment_started',
      url: 'https://shop.example.com',
      timestamp: new Date(Date.now() - 900000), // 15 minutes ago
      experimentsCount: 6
    },
    {
      id: 3,
      type: 'experiment_completed',
      url: 'https://blog.example.com',
      timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
      performanceGain: 31,
      experimentsCount: 6
    },
    {
      id: 4,
      type: 'batch_completed',
      urlCount: 12,
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      avgPerformanceGain: 24
    },
    {
      id: 5,
      type: 'experiment_failed',
      url: 'https://test.example.com',
      timestamp: new Date(Date.now() - 7200000), // 2 hours ago
      error: 'Network timeout'
    }
  ];

  const displayActivities = activities?.length > 0 ? activities : mockActivities;

  const getActivityIcon = (type) => {
    switch (type) {
      case 'experiment_completed':
        return { name: 'CheckCircle', color: 'text-success' };
      case 'experiment_started':
        return { name: 'Play', color: 'text-accent' };
      case 'batch_completed':
        return { name: 'Package', color: 'text-success' };
      case 'experiment_failed':
        return { name: 'AlertCircle', color: 'text-error' };
      default:
        return { name: 'Activity', color: 'text-muted-foreground' };
    }
  };

  const getActivityMessage = (activity) => {
    switch (activity?.type) {
      case 'experiment_completed':
        return {
          title: 'Experiment Suite Completed',
          description: `${activity?.url} analyzed with ${activity?.performanceGain}% performance gain`
        };
      case 'experiment_started':
        return {
          title: 'Experiment Suite Started',
          description: `Running ${activity?.experimentsCount} experiments on ${activity?.url}`
        };
      case 'batch_completed':
        return {
          title: 'Batch Analysis Completed',
          description: `${activity?.urlCount} URLs analyzed with ${activity?.avgPerformanceGain}% avg gain`
        };
      case 'experiment_failed':
        return {
          title: 'Experiment Failed',
          description: `${activity?.url} - ${activity?.error}`
        };
      default:
        return {
          title: 'Unknown Activity',
          description: 'Activity details not available'
        };
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 shadow-soft">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
            <Icon name="Clock" size={16} className="text-accent" />
          </div>
          <h3 className="text-sm font-medium text-foreground">Recent Activity</h3>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onViewAll}
          iconName="ExternalLink"
          iconPosition="right"
          iconSize={12}
        >
          View All
        </Button>
      </div>
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {displayActivities?.slice(0, 8)?.map((activity) => {
          const icon = getActivityIcon(activity?.type);
          const message = getActivityMessage(activity);
          
          return (
            <div key={activity?.id} className="flex items-start space-x-3 p-2 rounded-md hover:bg-muted/50 transition-smooth">
              <div className="flex-shrink-0 mt-1">
                <Icon name={icon?.name} size={14} className={icon?.color} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground truncate">
                  {message?.title}
                </p>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {message?.description}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatTimestamp(activity?.timestamp)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      {displayActivities?.length === 0 && (
        <div className="text-center py-6">
          <Icon name="Clock" size={32} className="text-muted-foreground mx-auto mb-2" />
          <p className="text-xs text-muted-foreground">No recent activity</p>
        </div>
      )}
    </div>
  );
};

export default RecentActivityFeed;