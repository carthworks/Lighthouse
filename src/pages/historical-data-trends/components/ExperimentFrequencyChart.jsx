import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';

const ExperimentFrequencyChart = ({ data, height = 250 }) => {
  const experimentTypeColors = {
    baseline: '#1e40af',
    'no-js': '#059669',
    'no-third-party': '#d97706',
    'no-render-blocking': '#dc2626',
    'unused-resources': '#7c3aed',
    'first-party-only': '#0ea5e9'
  };

  const experimentTypeLabels = {
    baseline: 'Baseline',
    'no-js': 'No JS',
    'no-third-party': 'No 3rd Party',
    'no-render-blocking': 'No Render Block',
    'unused-resources': 'Unused Resources',
    'first-party-only': 'First Party Only'
  };

  const totalExperiments = data?.reduce((sum, item) => {
    return sum + Object.keys(experimentTypeColors)?.reduce((typeSum, type) => {
      return typeSum + (item?.[type] || 0);
    }, 0);
  }, 0);

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-foreground flex items-center space-x-2">
          <Icon name="BarChart3" size={16} />
          <span>Experiment Frequency</span>
        </h3>
        <div className="flex items-center space-x-2">
          <Icon name="Activity" size={14} className="text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            {totalExperiments} total experiments
          </span>
        </div>
      </div>
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="date" 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              tickFormatter={(value) => new Date(value)?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            />
            <YAxis 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'var(--color-popover)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                fontSize: '12px'
              }}
              labelFormatter={(value) => `Date: ${new Date(value)?.toLocaleDateString()}`}
              formatter={(value, name) => [value, experimentTypeLabels?.[name] || name]}
            />
            <Legend 
              wrapperStyle={{ fontSize: '12px' }}
              formatter={(value) => experimentTypeLabels?.[value] || value}
            />
            {Object.keys(experimentTypeColors)?.map((type) => (
              <Bar
                key={type}
                dataKey={type}
                stackId="experiments"
                fill={experimentTypeColors?.[type]}
                name={type}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* Summary Stats */}
      <div className="mt-4 pt-3 border-t border-border">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {Object.entries(experimentTypeColors)?.map(([type, color]) => {
            const typeTotal = data?.reduce((sum, item) => sum + (item?.[type] || 0), 0);
            const percentage = totalExperiments > 0 ? ((typeTotal / totalExperiments) * 100)?.toFixed(1) : 0;
            
            return (
              <div key={type} className="text-center">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: color }}
                  ></div>
                  <span className="text-xs text-muted-foreground">
                    {experimentTypeLabels?.[type]}
                  </span>
                </div>
                <div className="text-sm font-medium text-foreground">
                  {typeTotal}
                </div>
                <div className="text-xs text-muted-foreground">
                  {percentage}%
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ExperimentFrequencyChart;