import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ExperimentDetailModal = ({ experiment, onClose, onCompare }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!experiment) return null;

  const tabs = [
    { key: 'overview', label: 'Overview', icon: 'BarChart3' },
    { key: 'metrics', label: 'Detailed Metrics', icon: 'Activity' },
    { key: 'opportunities', label: 'Opportunities', icon: 'TrendingUp' },
    { key: 'diagnostics', label: 'Diagnostics', icon: 'Search' },
    { key: 'resources', label: 'Resources', icon: 'Package' }
  ];

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-success';
    if (score >= 50) return 'text-warning';
    return 'text-error';
  };

  const getScoreBg = (score) => {
    if (score >= 90) return 'bg-success/10';
    if (score >= 50) return 'bg-warning/10';
    return 'bg-error/10';
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Core Web Vitals */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`p-4 rounded-lg ${getScoreBg(experiment?.metrics?.performanceScore)}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-muted-foreground">Performance</span>
                  <Icon name="Zap" size={16} className={getScoreColor(experiment?.metrics?.performanceScore)} />
                </div>
                <div className={`text-2xl font-bold ${getScoreColor(experiment?.metrics?.performanceScore)}`}>
                  {experiment?.metrics?.performanceScore}
                </div>
              </div>
              
              <div className="p-4 rounded-lg bg-muted/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-muted-foreground">First Contentful Paint</span>
                  <Icon name="Clock" size={16} className="text-accent" />
                </div>
                <div className="text-2xl font-bold text-foreground">{experiment?.metrics?.fcp}s</div>
              </div>
              
              <div className="p-4 rounded-lg bg-muted/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-muted-foreground">Largest Contentful Paint</span>
                  <Icon name="Image" size={16} className="text-accent" />
                </div>
                <div className="text-2xl font-bold text-foreground">{experiment?.metrics?.lcp}s</div>
              </div>
            </div>
            {/* Additional Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-medium text-foreground">Core Metrics</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Cumulative Layout Shift</span>
                    <span className="font-medium text-foreground">{experiment?.metrics?.cls}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">First Input Delay</span>
                    <span className="font-medium text-foreground">{experiment?.metrics?.fid}ms</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Load Time</span>
                    <span className="font-medium text-foreground">{experiment?.metrics?.loadTime}s</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium text-foreground">Additional Scores</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Accessibility</span>
                    <span className="font-medium text-success">{experiment?.metrics?.accessibility || 95}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Best Practices</span>
                    <span className="font-medium text-success">{experiment?.metrics?.bestPractices || 88}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">SEO</span>
                    <span className="font-medium text-success">{experiment?.metrics?.seo || 92}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'opportunities':
        return (
          <div className="space-y-4">
            <h4 className="font-medium text-foreground">Performance Opportunities</h4>
            <div className="space-y-3">
              {experiment?.details?.recommendations?.map((rec, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
                  <Icon name="TrendingUp" size={16} className="text-success mt-0.5" />
                  <div className="flex-1">
                    <div className="font-medium text-foreground mb-1">{rec}</div>
                    <div className="text-sm text-muted-foreground">
                      Potential savings: {Math.floor(Math.random() * 2000) + 500}ms
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'diagnostics':
        return (
          <div className="space-y-4">
            <h4 className="font-medium text-foreground">Critical Issues</h4>
            <div className="space-y-3">
              {experiment?.details?.criticalIssues?.map((issue, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-error/10 rounded-lg">
                  <Icon name="AlertCircle" size={16} className="text-error mt-0.5" />
                  <div className="flex-1">
                    <div className="font-medium text-foreground mb-1">{issue}</div>
                    <div className="text-sm text-muted-foreground">
                      Impact: High - affects user experience significantly
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'resources':
        return (
          <div className="space-y-4">
            <h4 className="font-medium text-foreground">Resource Analysis</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="p-3 bg-muted/30 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Total Resources</div>
                  <div className="text-xl font-bold text-foreground">{experiment?.details?.resourceCount}</div>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Blocked Resources</div>
                  <div className="text-xl font-bold text-warning">{experiment?.details?.blockedResources}</div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-muted/30 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Size Reduction</div>
                  <div className="text-xl font-bold text-success">{experiment?.details?.sizeReduction}</div>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Load Time Saved</div>
                  <div className="text-xl font-bold text-success">
                    {(Math.random() * 3 + 0.5)?.toFixed(1)}s
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            <h4 className="font-medium text-foreground">Detailed Metrics</h4>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>Time to Interactive: 3.2s</div>
                <div>Speed Index: 2.8s</div>
                <div>Total Blocking Time: 150ms</div>
                <div>Max Potential FID: 89ms</div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-1020 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg border border-border shadow-elevated w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">{experiment?.name}</h2>
            <p className="text-sm text-muted-foreground mt-1">{experiment?.description}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              iconName="GitCompare"
              onClick={() => onCompare(experiment)}
            >
              Compare
            </Button>
            <Button
              variant="ghost"
              size="sm"
              iconName="X"
              onClick={onClose}
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-border">
          <div className="flex overflow-x-auto">
            {tabs?.map((tab) => (
              <button
                key={tab?.key}
                onClick={() => setActiveTab(tab?.key)}
                className={`
                  flex items-center space-x-2 px-4 py-3 text-sm font-medium whitespace-nowrap
                  border-b-2 transition-smooth
                  ${activeTab === tab?.key
                    ? 'border-accent text-accent' :'border-transparent text-muted-foreground hover:text-foreground'
                  }
                `}
              >
                <Icon name={tab?.icon} size={16} />
                <span>{tab?.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {renderTabContent()}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border bg-muted/30">
          <div className="text-sm text-muted-foreground">
            Experiment completed on {new Date()?.toLocaleDateString()}
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" iconName="Download">
              Export Report
            </Button>
            <Button variant="outline" size="sm" iconName="Share">
              Share Results
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperimentDetailModal;