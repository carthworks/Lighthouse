import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const ComparisonModal = ({ experiments, onClose, selectedExperiments = [] }) => {
  const [compareExperiments, setCompareExperiments] = useState(
    selectedExperiments?.length >= 2 ? selectedExperiments?.slice(0, 2) : []
  );

  const experimentOptions = experiments?.map(exp => ({
    value: exp?.id,
    label: exp?.name
  }));

  const handleExperimentChange = (index, experimentId) => {
    const newCompare = [...compareExperiments];
    const experiment = experiments?.find(exp => exp?.id === experimentId);
    if (experiment) {
      newCompare[index] = experiment;
      setCompareExperiments(newCompare);
    }
  };

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

  const getDifference = (value1, value2, isLowerBetter = false) => {
    const diff = value1 - value2;
    const percentage = ((diff / value2) * 100)?.toFixed(1);
    const isImprovement = isLowerBetter ? diff < 0 : diff > 0;
    
    return {
      value: diff,
      percentage,
      isImprovement,
      display: `${diff > 0 ? '+' : ''}${diff?.toFixed(1)}`,
      percentageDisplay: `${diff > 0 ? '+' : ''}${percentage}%`
    };
  };

  const metrics = [
    { key: 'performanceScore', label: 'Performance Score', unit: '', isLowerBetter: false },
    { key: 'fcp', label: 'First Contentful Paint', unit: 's', isLowerBetter: true },
    { key: 'lcp', label: 'Largest Contentful Paint', unit: 's', isLowerBetter: true },
    { key: 'cls', label: 'Cumulative Layout Shift', unit: '', isLowerBetter: true },
    { key: 'fid', label: 'First Input Delay', unit: 'ms', isLowerBetter: true },
    { key: 'loadTime', label: 'Total Load Time', unit: 's', isLowerBetter: true }
  ];

  if (compareExperiments?.length < 2) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-1020 flex items-center justify-center p-4">
        <div className="bg-card rounded-lg border border-border shadow-elevated w-full max-w-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">Compare Experiments</h2>
            <Button variant="ghost" size="sm" iconName="X" onClick={onClose} />
          </div>
          
          <div className="space-y-4">
            <p className="text-muted-foreground">Select two experiments to compare their performance metrics.</p>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">First Experiment</label>
                <Select
                  options={[{ value: '', label: 'Select experiment...' }, ...experimentOptions]}
                  value={compareExperiments?.[0]?.id || ''}
                  onChange={(value) => handleExperimentChange(0, value)}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Second Experiment</label>
                <Select
                  options={[
                    { value: '', label: 'Select experiment...' }, 
                    ...experimentOptions?.filter(opt => opt?.value !== compareExperiments?.[0]?.id)
                  ]}
                  value={compareExperiments?.[1]?.id || ''}
                  onChange={(value) => handleExperimentChange(1, value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-1020 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg border border-border shadow-elevated w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Experiment Comparison</h2>
          <Button variant="ghost" size="sm" iconName="X" onClick={onClose} />
        </div>

        {/* Experiment Headers */}
        <div className="grid grid-cols-2 gap-6 p-6 border-b border-border bg-muted/30">
          {compareExperiments?.map((experiment, index) => (
            <div key={experiment?.id} className="text-center">
              <h3 className="text-lg font-semibold text-foreground mb-2">{experiment?.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{experiment?.description}</p>
              <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full ${getScoreBg(experiment?.metrics?.performanceScore)}`}>
                <Icon name="Zap" size={16} className={getScoreColor(experiment?.metrics?.performanceScore)} />
                <span className={`font-semibold ${getScoreColor(experiment?.metrics?.performanceScore)}`}>
                  {experiment?.metrics?.performanceScore}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Metrics Comparison */}
        <div className="overflow-y-auto max-h-[60vh]">
          <div className="p-6">
            <h4 className="text-lg font-semibold text-foreground mb-4">Performance Metrics</h4>
            
            <div className="space-y-4">
              {metrics?.map((metric) => {
                const value1 = parseFloat(compareExperiments?.[0]?.metrics?.[metric?.key]);
                const value2 = parseFloat(compareExperiments?.[1]?.metrics?.[metric?.key]);
                const diff = getDifference(value1, value2, metric?.isLowerBetter);
                
                return (
                  <div key={metric?.key} className="grid grid-cols-5 gap-4 items-center py-3 border-b border-border">
                    <div className="font-medium text-foreground">{metric?.label}</div>
                    <div className="text-center">
                      <span className="text-lg font-semibold text-foreground">
                        {value1}{metric?.unit}
                      </span>
                    </div>
                    <div className="text-center">
                      <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${
                        diff?.isImprovement ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
                      }`}>
                        <Icon 
                          name={diff?.isImprovement ? 'TrendingUp' : 'TrendingDown'} 
                          size={12} 
                        />
                        <span>{diff?.percentageDisplay}</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <span className="text-lg font-semibold text-foreground">
                        {value2}{metric?.unit}
                      </span>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      {diff?.isImprovement ? 'Better' : 'Worse'}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h5 className="font-medium text-foreground">Key Improvements</h5>
                <div className="space-y-2">
                  {metrics?.filter(metric => {
                    const value1 = parseFloat(compareExperiments?.[0]?.metrics?.[metric?.key]);
                    const value2 = parseFloat(compareExperiments?.[1]?.metrics?.[metric?.key]);
                    const diff = getDifference(value1, value2, metric?.isLowerBetter);
                    return diff?.isImprovement;
                  })?.map(metric => (
                    <div key={metric?.key} className="flex items-center space-x-2">
                      <Icon name="CheckCircle" size={14} className="text-success" />
                      <span className="text-sm text-foreground">{metric?.label} improved</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-3">
                <h5 className="font-medium text-foreground">Areas for Attention</h5>
                <div className="space-y-2">
                  {metrics?.filter(metric => {
                    const value1 = parseFloat(compareExperiments?.[0]?.metrics?.[metric?.key]);
                    const value2 = parseFloat(compareExperiments?.[1]?.metrics?.[metric?.key]);
                    const diff = getDifference(value1, value2, metric?.isLowerBetter);
                    return !diff?.isImprovement;
                  })?.map(metric => (
                    <div key={metric?.key} className="flex items-center space-x-2">
                      <Icon name="AlertCircle" size={14} className="text-warning" />
                      <span className="text-sm text-foreground">{metric?.label} needs attention</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border bg-muted/30">
          <div className="text-sm text-muted-foreground">
            Comparison generated on {new Date()?.toLocaleDateString()}
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" iconName="Download">
              Export Comparison
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

export default ComparisonModal;