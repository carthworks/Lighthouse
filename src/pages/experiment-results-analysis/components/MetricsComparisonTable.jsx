import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MetricsComparisonTable = ({ experiments, onExperimentSelect, selectedExperiments = [] }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [expandedRows, setExpandedRows] = useState(new Set());

  const sortedExperiments = useMemo(() => {
    if (!sortConfig?.key) return experiments;

    return [...experiments]?.sort((a, b) => {
      let aValue = a?.metrics?.[sortConfig?.key];
      let bValue = b?.metrics?.[sortConfig?.key];

      if (typeof aValue === 'string') {
        aValue = parseFloat(aValue) || 0;
      }
      if (typeof bValue === 'string') {
        bValue = parseFloat(bValue) || 0;
      }

      if (sortConfig?.direction === 'asc') {
        return aValue - bValue;
      }
      return bValue - aValue;
    });
  }, [experiments, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev?.key === key && prev?.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const toggleRowExpansion = (experimentId) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet?.has(experimentId)) {
        newSet?.delete(experimentId);
      } else {
        newSet?.add(experimentId);
      }
      return newSet;
    });
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-success';
    if (score >= 50) return 'text-warning';
    return 'text-error';
  };

  const getMetricChange = (current, baseline) => {
    if (!baseline) return null;
    const change = ((current - baseline) / baseline) * 100;
    return {
      value: change,
      isImprovement: change < 0,
      display: `${change > 0 ? '+' : ''}${change?.toFixed(1)}%`
    };
  };

  const baselineExperiment = experiments?.find(exp => exp?.type === 'baseline');

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4 font-medium text-foreground">
                <div className="flex items-center space-x-2">
                  <span>Experiment</span>
                </div>
              </th>
              {['performanceScore', 'fcp', 'lcp', 'cls', 'fid', 'loadTime']?.map((metric) => (
                <th key={metric} className="text-left p-4 font-medium text-foreground">
                  <button
                    onClick={() => handleSort(metric)}
                    className="flex items-center space-x-1 hover:text-accent transition-smooth"
                  >
                    <span className="capitalize">
                      {metric === 'fcp' ? 'FCP' : 
                       metric === 'lcp' ? 'LCP' : 
                       metric === 'cls' ? 'CLS' : 
                       metric === 'fid' ? 'FID' : 
                       metric === 'performanceScore' ? 'Score' :
                       metric === 'loadTime' ? 'Load Time' : metric}
                    </span>
                    {sortConfig?.key === metric && (
                      <Icon 
                        name={sortConfig?.direction === 'asc' ? 'ChevronUp' : 'ChevronDown'} 
                        size={14} 
                      />
                    )}
                  </button>
                </th>
              ))}
              <th className="text-left p-4 font-medium text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedExperiments?.map((experiment) => (
              <React.Fragment key={experiment?.id}>
                <tr className="border-t border-border hover:bg-muted/30 transition-smooth">
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => toggleRowExpansion(experiment?.id)}
                        className="p-1 hover:bg-muted rounded transition-smooth"
                      >
                        <Icon 
                          name={expandedRows?.has(experiment?.id) ? 'ChevronDown' : 'ChevronRight'} 
                          size={16} 
                        />
                      </button>
                      <div>
                        <div className="font-medium text-foreground">{experiment?.name}</div>
                        <div className="text-sm text-muted-foreground">{experiment?.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <span className={`font-semibold ${getScoreColor(experiment?.metrics?.performanceScore)}`}>
                        {experiment?.metrics?.performanceScore}
                      </span>
                      {baselineExperiment && experiment?.id !== baselineExperiment?.id && (
                        <span className="text-xs text-muted-foreground">
                          {(() => {
                            const change = getMetricChange(
                              experiment?.metrics?.performanceScore, 
                              baselineExperiment?.metrics?.performanceScore
                            );
                            return change ? (
                              <span className={change?.isImprovement ? 'text-success' : 'text-error'}>
                                {change?.display}
                              </span>
                            ) : null;
                          })()}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-foreground">{experiment?.metrics?.fcp}s</span>
                      {baselineExperiment && experiment?.id !== baselineExperiment?.id && (
                        <span className="text-xs text-muted-foreground">
                          {(() => {
                            const change = getMetricChange(
                              parseFloat(experiment?.metrics?.fcp), 
                              parseFloat(baselineExperiment?.metrics?.fcp)
                            );
                            return change ? (
                              <span className={change?.isImprovement ? 'text-success' : 'text-error'}>
                                {change?.display}
                              </span>
                            ) : null;
                          })()}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-foreground">{experiment?.metrics?.lcp}s</span>
                      {baselineExperiment && experiment?.id !== baselineExperiment?.id && (
                        <span className="text-xs text-muted-foreground">
                          {(() => {
                            const change = getMetricChange(
                              parseFloat(experiment?.metrics?.lcp), 
                              parseFloat(baselineExperiment?.metrics?.lcp)
                            );
                            return change ? (
                              <span className={change?.isImprovement ? 'text-success' : 'text-error'}>
                                {change?.display}
                              </span>
                            ) : null;
                          })()}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-foreground">{experiment?.metrics?.cls}</span>
                      {baselineExperiment && experiment?.id !== baselineExperiment?.id && (
                        <span className="text-xs text-muted-foreground">
                          {(() => {
                            const change = getMetricChange(
                              parseFloat(experiment?.metrics?.cls), 
                              parseFloat(baselineExperiment?.metrics?.cls)
                            );
                            return change ? (
                              <span className={change?.isImprovement ? 'text-success' : 'text-error'}>
                                {change?.display}
                              </span>
                            ) : null;
                          })()}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-foreground">{experiment?.metrics?.fid}ms</span>
                      {baselineExperiment && experiment?.id !== baselineExperiment?.id && (
                        <span className="text-xs text-muted-foreground">
                          {(() => {
                            const change = getMetricChange(
                              parseFloat(experiment?.metrics?.fid), 
                              parseFloat(baselineExperiment?.metrics?.fid)
                            );
                            return change ? (
                              <span className={change?.isImprovement ? 'text-success' : 'text-error'}>
                                {change?.display}
                              </span>
                            ) : null;
                          })()}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-foreground">{experiment?.metrics?.loadTime}s</span>
                      {baselineExperiment && experiment?.id !== baselineExperiment?.id && (
                        <span className="text-xs text-muted-foreground">
                          {(() => {
                            const change = getMetricChange(
                              parseFloat(experiment?.metrics?.loadTime), 
                              parseFloat(baselineExperiment?.metrics?.loadTime)
                            );
                            return change ? (
                              <span className={change?.isImprovement ? 'text-success' : 'text-error'}>
                                {change?.display}
                              </span>
                            ) : null;
                          })()}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        iconName="Eye"
                        onClick={() => onExperimentSelect(experiment)}
                      >
                        View
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Download"
                        onClick={() => {/* Handle download */}}
                      >
                      </Button>
                    </div>
                  </td>
                </tr>
                
                {expandedRows?.has(experiment?.id) && (
                  <tr className="border-t border-border bg-muted/20">
                    <td colSpan="8" className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <h4 className="font-medium text-foreground">Critical Issues</h4>
                          <div className="space-y-1">
                            {experiment?.details?.criticalIssues?.map((issue, index) => (
                              <div key={index} className="flex items-start space-x-2">
                                <Icon name="AlertCircle" size={14} className="text-error mt-0.5" />
                                <span className="text-sm text-foreground">{issue}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="font-medium text-foreground">Recommendations</h4>
                          <div className="space-y-1">
                            {experiment?.details?.recommendations?.slice(0, 3)?.map((rec, index) => (
                              <div key={index} className="flex items-start space-x-2">
                                <Icon name="CheckCircle" size={14} className="text-success mt-0.5" />
                                <span className="text-sm text-foreground">{rec}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="font-medium text-foreground">Resource Analysis</h4>
                          <div className="space-y-1">
                            <div className="text-sm text-muted-foreground">
                              Total Resources: {experiment?.details?.resourceCount}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Blocked Resources: {experiment?.details?.blockedResources}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Size Reduction: {experiment?.details?.sizeReduction}
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MetricsComparisonTable;