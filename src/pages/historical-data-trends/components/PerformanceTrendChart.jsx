import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';

const PerformanceTrendChart = ({ data, selectedMetrics, title, height = 300 }) => {
  const metricColors = {
    performance: '#1e40af',
    fcp: '#059669',
    lcp: '#d97706',
    cls: '#dc2626',
    fid: '#7c3aed',
    ttfb: '#0ea5e9',
    'speed-index': '#64748b'
  };

  const metricLabels = {
    performance: 'Performance Score',
    fcp: 'First Contentful Paint',
    lcp: 'Largest Contentful Paint',
    cls: 'Cumulative Layout Shift',
    fid: 'First Input Delay',
    ttfb: 'Time to First Byte',
    'speed-index': 'Speed Index'
  };

  const formatTooltipValue = (value, name) => {
    if (name === 'performance') {
      return [`${value}`, 'Performance Score'];
    }
    if (name === 'cls') {
      return [`${value}`, 'CLS'];
    }
    if (['fcp', 'lcp', 'fid', 'ttfb', 'speed-index']?.includes(name)) {
      return [`${value}ms`, metricLabels?.[name]];
    }
    return [value, name];
  };

  const formatYAxisTick = (value, metric) => {
    if (metric === 'performance') {
      return value;
    }
    if (metric === 'cls') {
      return value?.toFixed(3);
    }
    return `${value}ms`;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-foreground flex items-center space-x-2">
          <Icon name="TrendingUp" size={16} />
          <span>{title}</span>
        </h3>
        <div className="flex items-center space-x-2">
          <Icon name="Info" size={14} className="text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            {data?.length} data points
          </span>
        </div>
      </div>
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="date" 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              tickFormatter={(value) => new Date(value)?.toLocaleDateString()}
            />
            <YAxis 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              tickFormatter={(value) => formatYAxisTick(value, selectedMetrics?.[0])}
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
            <Legend 
              wrapperStyle={{ fontSize: '12px' }}
            />
            {selectedMetrics?.map((metric) => (
              <Line
                key={metric}
                type="monotone"
                dataKey={metric}
                stroke={metricColors?.[metric]}
                strokeWidth={2}
                dot={{ fill: metricColors?.[metric], strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: metricColors?.[metric], strokeWidth: 2 }}
                name={metricLabels?.[metric]}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      {/* Trend Summary */}
      <div className="mt-4 pt-3 border-t border-border">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {selectedMetrics?.slice(0, 3)?.map((metric) => {
            const values = data?.map(d => d?.[metric])?.filter(v => v !== undefined);
            const latest = values?.[values?.length - 1];
            const previous = values?.[values?.length - 2];
            const trend = latest > previous ? 'up' : latest < previous ? 'down' : 'stable';
            const trendColor = metric === 'performance' 
              ? (trend === 'up' ? 'text-success' : trend === 'down' ? 'text-error' : 'text-muted-foreground')
              : (trend === 'up' ? 'text-error' : trend === 'down' ? 'text-success' : 'text-muted-foreground');

            return (
              <div key={metric} className="text-center">
                <div className="text-xs text-muted-foreground mb-1">
                  {metricLabels?.[metric]}
                </div>
                <div className="text-sm font-medium text-foreground">
                  {metric === 'performance' ? latest : metric === 'cls' ? latest?.toFixed(3) : `${latest}ms`}
                </div>
                <div className={`text-xs flex items-center justify-center space-x-1 ${trendColor}`}>
                  <Icon 
                    name={trend === 'up' ? 'TrendingUp' : trend === 'down' ? 'TrendingDown' : 'Minus'} 
                    size={12} 
                  />
                  <span>
                    {trend === 'stable' ? 'No change' : 
                     `${Math.abs(((latest - previous) / previous * 100))?.toFixed(1)}%`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PerformanceTrendChart;