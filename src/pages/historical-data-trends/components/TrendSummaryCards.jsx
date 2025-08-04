import React from 'react';
import Icon from '../../../components/AppIcon';

const TrendSummaryCards = ({ summaryData }) => {
  const cards = [
    {
      title: 'Total Experiments',
      value: summaryData?.totalExperiments,
      change: summaryData?.experimentsChange,
      changeType: summaryData?.experimentsChange > 0 ? 'increase' : 'decrease',
      icon: 'Activity',
      color: 'accent'
    },
    {
      title: 'Avg Performance Score',
      value: `${summaryData?.avgPerformance}`,
      change: summaryData?.performanceChange,
      changeType: summaryData?.performanceChange > 0 ? 'increase' : 'decrease',
      icon: 'Gauge',
      color: summaryData?.avgPerformance >= 90 ? 'success' : summaryData?.avgPerformance >= 50 ? 'warning' : 'error'
    },
    {
      title: 'URLs Analyzed',
      value: summaryData?.uniqueUrls,
      change: summaryData?.urlsChange,
      changeType: summaryData?.urlsChange > 0 ? 'increase' : 'decrease',
      icon: 'Globe',
      color: 'primary'
    },
    {
      title: 'Avg Load Time',
      value: `${summaryData?.avgLoadTime}ms`,
      change: summaryData?.loadTimeChange,
      changeType: summaryData?.loadTimeChange < 0 ? 'increase' : 'decrease', // Negative change is good for load time
      icon: 'Clock',
      color: summaryData?.avgLoadTime <= 2000 ? 'success' : summaryData?.avgLoadTime <= 4000 ? 'warning' : 'error'
    }
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      accent: 'bg-accent/10 text-accent border-accent/20',
      success: 'bg-success/10 text-success border-success/20',
      warning: 'bg-warning/10 text-warning border-warning/20',
      error: 'bg-error/10 text-error border-error/20',
      primary: 'bg-primary/10 text-primary border-primary/20'
    };
    return colorMap?.[color] || colorMap?.accent;
  };

  const getChangeIcon = (changeType) => {
    return changeType === 'increase' ? 'TrendingUp' : 'TrendingDown';
  };

  const getChangeColor = (changeType, isLoadTime = false) => {
    if (isLoadTime) {
      return changeType === 'increase' ? 'text-success' : 'text-error';
    }
    return changeType === 'increase' ? 'text-success' : 'text-error';
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards?.map((card, index) => (
        <div
          key={index}
          className={`bg-card border border-border rounded-lg p-4 hover:shadow-soft transition-smooth`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`p-2 rounded-lg ${getColorClasses(card?.color)}`}>
              <Icon name={card?.icon} size={20} />
            </div>
            {card?.change !== 0 && (
              <div className={`flex items-center space-x-1 ${getChangeColor(card?.changeType, card?.title?.includes('Load Time'))}`}>
                <Icon name={getChangeIcon(card?.changeType)} size={14} />
                <span className="text-xs font-medium">
                  {Math.abs(card?.change)}%
                </span>
              </div>
            )}
          </div>

          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-foreground">
              {card?.value}
            </h3>
            <p className="text-sm text-muted-foreground">
              {card?.title}
            </p>
          </div>

          {card?.change !== 0 && (
            <div className="mt-3 pt-3 border-t border-border">
              <p className="text-xs text-muted-foreground">
                {card?.changeType === 'increase' ? 'Increased' : 'Decreased'} by{' '}
                <span className={`font-medium ${getChangeColor(card?.changeType, card?.title?.includes('Load Time'))}`}>
                  {Math.abs(card?.change)}%
                </span>{' '}
                from last period
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TrendSummaryCards;