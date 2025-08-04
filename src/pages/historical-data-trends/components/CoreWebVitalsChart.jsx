import React from 'react';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';

const CoreWebVitalsChart = ({ data, height = 300 }) => {
  const getScoreColor = (score, metric) => {
    if (metric === 'cls') {
      if (score <= 0.1) return '#059669'; // Good
      if (score <= 0.25) return '#d97706'; // Needs improvement
      return '#dc2626'; // Poor
    } else {
      // For FCP, LCP, FID
      const thresholds = {
        fcp: { good: 1800, poor: 3000 },
        lcp: { good: 2500, poor: 4000 },
        fid: { good: 100, poor: 300 }
      };
      
      const threshold = thresholds?.[metric];
      if (!threshold) return '#64748b';
      
      if (score <= threshold?.good) return '#059669';
      if (score <= threshold?.poor) return '#d97706';
      return '#dc2626';
    }
  };

  const formatTooltipValue = (value, name) => {
    if (name === 'cls') {
      return [`${value}`, 'CLS'];
    }
    return [`${value}ms`, name.toUpperCase()];
  };

  const getVitalStatus = (value, metric) => {
    if (metric === 'cls') {
      if (value <= 0.1) return 'Good';
      if (value <= 0.25) return 'Needs Improvement';
      return 'Poor';
    } else {
      const thresholds = {
        fcp: { good: 1800, poor: 3000 },
        lcp: { good: 2500, poor: 4000 },
        fid: { good: 100, poor: 300 }
      };
      
      const threshold = thresholds?.[metric];
      if (!threshold) return 'Unknown';
      
      if (value <= threshold?.good) return 'Good';
      if (value <= threshold?.poor) return 'Needs Improvement';
      return 'Poor';
    }
  };

  const latestData = data?.[data?.length - 1] || {};

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-foreground flex items-center space-x-2">
          <Icon name="Gauge" size={16} />
          <span>Core Web Vitals Trends</span>
        </h3>
        <div className="flex items-center space-x-2">
          <Icon name="Target" size={14} className="text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            Web Vitals Assessment
          </span>
        </div>
      </div>
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer>
          <ComposedChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="date" 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              tickFormatter={(value) => new Date(value)?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            />
            <YAxis 
              yAxisId="time"
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              tickFormatter={(value) => `${value}ms`}
            />
            <YAxis 
              yAxisId="cls"
              orientation="right"
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              tickFormatter={(value) => value?.toFixed(3)}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'var(--color-popover)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                fontSize: '12px'
              }}
              formatter={formatTooltipValue}
              labelFormatter={(value) => `Date: ${new Date(value)?.toLocaleDateString()}`}
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            
            <Bar yAxisId="time" dataKey="fcp" fill="#059669" name="FCP" />
            <Bar yAxisId="time" dataKey="lcp" fill="#d97706" name="LCP" />
            <Bar yAxisId="time" dataKey="fid" fill="#7c3aed" name="FID" />
            <Line yAxisId="cls" type="monotone" dataKey="cls" stroke="#dc2626" strokeWidth={3} name="CLS" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      {/* Current Status Cards */}
      <div className="mt-4 pt-3 border-t border-border">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {['fcp', 'lcp', 'fid', 'cls']?.map((metric) => {
            const value = latestData?.[metric];
            const status = getVitalStatus(value, metric);
            const color = getScoreColor(value, metric);
            
            return (
              <div key={metric} className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-xs font-medium text-muted-foreground mb-1">
                  {metric?.toUpperCase()}
                </div>
                <div className="text-lg font-bold text-foreground mb-1">
                  {metric === 'cls' ? value?.toFixed(3) : `${value}ms`}
                </div>
                <div 
                  className="text-xs font-medium px-2 py-1 rounded-full"
                  style={{ 
                    backgroundColor: `${color}20`, 
                    color: color 
                  }}
                >
                  {status}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* Thresholds Reference */}
      <div className="mt-4 pt-3 border-t border-border">
        <div className="text-xs text-muted-foreground mb-2">
          <Icon name="Info" size={12} className="inline mr-1" />
          Core Web Vitals Thresholds
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div>
            <span className="font-medium">FCP:</span> Good ≤1.8s, Poor &gt;3.0s
          </div>
          <div>
            <span className="font-medium">LCP:</span> Good ≤2.5s, Poor &gt;4.0s
          </div>
          <div>
            <span className="font-medium">FID:</span> Good ≤100ms, Poor &gt;300ms
          </div>
          <div>
            <span className="font-medium">CLS:</span> Good ≤0.1, Poor &gt;0.25
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoreWebVitalsChart;