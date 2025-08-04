import React from 'react';
import Icon from '../../../components/AppIcon';

const ExperimentProgressTracker = ({ experiments, isRunning }) => {
  const experimentTypes = [
    {
      id: 'baseline',
      name: 'Baseline Audit',
      description: 'Standard Lighthouse audit with default settings',
      icon: 'Activity'
    },
    {
      id: 'js-disabled',
      name: 'JavaScript Disabled',
      description: 'Audit with JavaScript execution disabled',
      icon: 'Code'
    },
    {
      id: 'third-party-blocked',
      name: 'Third-party Blocked',
      description: 'Blocking GTM, GA, Facebook, and other third-party scripts',
      icon: 'Shield'
    },
    {
      id: 'render-blocking-eliminated',
      name: 'Render-blocking Eliminated',
      description: 'Removing render-blocking CSS and JavaScript resources',
      icon: 'Zap'
    },
    {
      id: 'unused-resources-blocked',
      name: 'Unused Resources Blocked',
      description: 'Blocking unused and low-coverage resources',
      icon: 'Trash2'
    },
    {
      id: 'first-party-only',
      name: 'First-party Only',
      description: 'Isolating first-party and used resources only',
      icon: 'Home'
    }
  ];

  const getExperimentStatus = (experimentId) => {
    const experiment = experiments?.find(exp => exp?.id === experimentId);
    if (!experiment) return { status: 'pending', progress: 0, estimatedTime: null };
    return experiment;
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'running':
        return {
          bgColor: 'bg-accent/10',
          textColor: 'text-accent',
          borderColor: 'border-accent/20',
          progressColor: 'bg-accent'
        };
      case 'completed':
        return {
          bgColor: 'bg-success/10',
          textColor: 'text-success',
          borderColor: 'border-success/20',
          progressColor: 'bg-success'
        };
      case 'error':
        return {
          bgColor: 'bg-error/10',
          textColor: 'text-error',
          borderColor: 'border-error/20',
          progressColor: 'bg-error'
        };
      case 'pending':
      default:
        return {
          bgColor: 'bg-muted/50',
          textColor: 'text-muted-foreground',
          borderColor: 'border-border',
          progressColor: 'bg-muted'
        };
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'running':
        return 'Play';
      case 'completed':
        return 'CheckCircle';
      case 'error':
        return 'AlertCircle';
      case 'pending':
      default:
        return 'Clock';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-soft">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
            <Icon name="BarChart3" size={20} className="text-accent" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Experiment Progress</h2>
            <p className="text-sm text-muted-foreground">Real-time tracking of all Lighthouse experiments</p>
          </div>
        </div>
        
        {isRunning && (
          <div className="flex items-center space-x-2 px-3 py-1 bg-accent/10 rounded-md">
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
            <span className="text-xs text-accent font-medium">Running</span>
          </div>
        )}
      </div>
      <div className="space-y-4">
        {experimentTypes?.map((type, index) => {
          const { status, progress, estimatedTime } = getExperimentStatus(type?.id);
          const config = getStatusConfig(status);
          
          return (
            <div
              key={type?.id}
              className={`border ${config?.borderColor} ${config?.bgColor} rounded-lg p-4 transition-smooth`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <Icon name={type?.icon} size={16} className="text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">{type?.name}</span>
                  </div>
                  <div className={status === 'running' ? 'animate-pulse' : ''}>
                    <Icon name={getStatusIcon(status)} size={14} className={config?.textColor} />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {status === 'running' && (
                    <span className={`text-xs font-medium ${config?.textColor}`}>
                      {Math.round(progress)}%
                    </span>
                  )}
                  {status === 'completed' && (
                    <span className="text-xs text-success font-medium">Complete</span>
                  )}
                  {status === 'error' && (
                    <span className="text-xs text-error font-medium">Failed</span>
                  )}
                </div>
              </div>
              <p className="text-xs text-muted-foreground mb-3">{type?.description}</p>
              {status === 'running' && (
                <>
                  <div className="w-full bg-muted rounded-full h-2 mb-2">
                    <div 
                      className={`${config?.progressColor} h-2 rounded-full transition-organic`}
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
                <div className="w-full bg-success/20 rounded-full h-2">
                  <div className="bg-success h-2 rounded-full w-full"></div>
                </div>
              )}
              {status === 'error' && (
                <div className="w-full bg-error/20 rounded-full h-2">
                  <div className="bg-error h-2 rounded-full w-1/4"></div>
                </div>
              )}
              {status === 'pending' && (
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-muted-foreground/20 h-2 rounded-full w-0"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {!isRunning && experiments?.length === 0 && (
        <div className="text-center py-8">
          <Icon name="PlayCircle" size={48} className="text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No experiments running. Enter a URL above to start analysis.</p>
        </div>
      )}
    </div>
  );
};

export default ExperimentProgressTracker;