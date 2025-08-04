import React from 'react';
import Icon from '../../../components/AppIcon';

const QuickStatsCards = ({ stats }) => {
  const statsData = [
    {
      id: 'total-experiments',
      title: 'Total Experiments',
      value: stats?.totalExperiments || 0,
      change: stats?.experimentsChange || '+12%',
      changeType: 'positive',
      icon: 'Activity',
      description: 'Completed this month'
    },
    {
      id: 'avg-improvement',
      title: 'Avg Performance Gain',
      value: `${stats?.avgImprovement || 23}%`,
      change: stats?.improvementChange || '+5.2%',
      changeType: 'positive',
      icon: 'TrendingUp',
      description: 'Performance score increase'
    },
    {
      id: 'success-rate',
      title: 'Success Rate',
      value: `${stats?.successRate || 94}%`,
      change: stats?.successChange || '+2.1%',
      changeType: 'positive',
      icon: 'CheckCircle',
      description: 'Experiments completed successfully'
    }
  ];

  const getChangeColor = (changeType) => {
    return changeType === 'positive' ? 'text-success' : 'text-error';
  };

  const getChangeIcon = (changeType) => {
    return changeType === 'positive' ? 'ArrowUp' : 'ArrowDown';
  };

  return (
    <div className="space-y-4">
      {statsData?.map((stat) => (
        <div key={stat?.id} className="bg-card border border-border rounded-lg p-4 shadow-soft">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name={stat?.icon} size={16} className="text-primary" />
              </div>
              <h3 className="text-sm font-medium text-foreground">{stat?.title}</h3>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-2xl font-bold text-foreground">{stat?.value}</div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <Icon 
                  name={getChangeIcon(stat?.changeType)} 
                  size={12} 
                  className={getChangeColor(stat?.changeType)} 
                />
                <span className={`text-xs font-medium ${getChangeColor(stat?.changeType)}`}>
                  {stat?.change}
                </span>
              </div>
            </div>
            
            <p className="text-xs text-muted-foreground">{stat?.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuickStatsCards;