import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ExperimentQueueManager = ({ queue, onCancelExperiment, onClearQueue, onPauseQueue, isPaused }) => {
  if (queue?.length === 0) {
    return null;
  }

  const getQueueItemStatus = (item) => {
    switch (item?.status) {
      case 'running':
        return {
          icon: 'Play',
          color: 'text-accent',
          bgColor: 'bg-accent/10',
          borderColor: 'border-accent/20'
        };
      case 'queued':
        return {
          icon: 'Clock',
          color: 'text-muted-foreground',
          bgColor: 'bg-muted/50',
          borderColor: 'border-border'
        };
      case 'paused':
        return {
          icon: 'Pause',
          color: 'text-warning',
          bgColor: 'bg-warning/10',
          borderColor: 'border-warning/20'
        };
      default:
        return {
          icon: 'Clock',
          color: 'text-muted-foreground',
          bgColor: 'bg-muted/50',
          borderColor: 'border-border'
        };
    }
  };

  const formatQueuePosition = (index) => {
    if (index === 0) return 'Running';
    return `#${index} in queue`;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 shadow-soft">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-warning/10 rounded-lg flex items-center justify-center">
            <Icon name="List" size={16} className="text-warning" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-foreground">Experiment Queue</h3>
            <p className="text-xs text-muted-foreground">{queue?.length} experiments in queue</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onPauseQueue}
            iconName={isPaused ? "Play" : "Pause"}
            iconPosition="left"
            iconSize={12}
          >
            {isPaused ? 'Resume' : 'Pause'}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearQueue}
            iconName="Trash2"
            iconPosition="left"
            iconSize={12}
            className="text-error hover:text-error"
          >
            Clear All
          </Button>
        </div>
      </div>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {queue?.map((item, index) => {
          const status = getQueueItemStatus(item);
          
          return (
            <div
              key={item?.id}
              className={`border ${status.borderColor} ${status.bgColor} rounded-md p-3 transition-smooth`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className={item?.status === 'running' ? 'animate-pulse' : ''}>
                    <Icon name={status.icon} size={14} className={status.color} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">
                      {item?.url}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`text-xs ${status.color}`}>
                        {formatQueuePosition(index)}
                      </span>
                      {item?.estimatedTime && (
                        <>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">
                            Est. {item?.estimatedTime}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-1">
                  {item?.status === 'running' && item?.progress && (
                    <span className="text-xs font-medium text-accent mr-2">
                      {Math.round(item?.progress)}%
                    </span>
                  )}
                  
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => onCancelExperiment(item?.id)}
                    iconName="X"
                    className="text-muted-foreground hover:text-error"
                  />
                </div>
              </div>
              {item?.status === 'running' && item?.progress && (
                <div className="mt-2">
                  <div className="w-full bg-muted rounded-full h-1">
                    <div 
                      className="bg-accent h-1 rounded-full transition-organic"
                      style={{ width: `${Math.min(item?.progress, 100)}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {isPaused && (
        <div className="mt-3 p-2 bg-warning/10 border border-warning/20 rounded-md">
          <div className="flex items-center space-x-2">
            <Icon name="Pause" size={12} className="text-warning" />
            <span className="text-xs text-warning font-medium">Queue is paused</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExperimentQueueManager;