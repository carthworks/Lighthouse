import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

import Button from '../../../components/ui/Button';

const PerformanceCharts = ({ experiments }) => {
  const [activeChart, setActiveChart] = useState('performance');

  const chartData = experiments?.map(exp => ({
    name: exp?.name?.replace(' Experiment', ''),
    performance: exp?.metrics?.performanceScore,
    fcp: parseFloat(exp?.metrics?.fcp),
    lcp: parseFloat(exp?.metrics?.lcp),
    cls: parseFloat(exp?.metrics?.cls) * 1000, // Scale CLS for visibility
    fid: parseFloat(exp?.metrics?.fid),
    loadTime: parseFloat(exp?.metrics?.loadTime)
  }));

  const radarData = experiments?.map(exp => ({
    experiment: exp?.name?.replace(' Experiment', ''),
    Performance: exp?.metrics?.performanceScore,
    Accessibility: exp?.metrics?.accessibility || 95,
    'Best Practices': exp?.metrics?.bestPractices || 88,
    SEO: exp?.metrics?.seo || 92,
    PWA: exp?.metrics?.pwa || 30
  }));

  const chartTypes = [
    { key: 'performance', label: 'Performance Scores', icon: 'BarChart3' },
    { key: 'metrics', label: 'Core Web Vitals', icon: 'TrendingUp' },
    { key: 'radar', label: 'Overall Comparison', icon: 'Target' }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-elevated">
          <p className="font-medium text-foreground mb-2">{label}</p>
          {payload?.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry?.color }}>
              {entry?.name}: {entry?.value}
              {entry?.name === 'Performance' ? '' : 
               entry?.name === 'FCP' || entry?.name === 'LCP' || entry?.name === 'Load Time' ? 's' :
               entry?.name === 'FID' ? 'ms' : ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    switch (activeChart) {
      case 'performance':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="name" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                domain={[0, 100]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="performance" 
                fill="var(--color-accent)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'metrics':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="name" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="fcp" 
                stroke="var(--color-success)" 
                strokeWidth={2}
                name="FCP"
              />
              <Line 
                type="monotone" 
                dataKey="lcp" 
                stroke="var(--color-warning)" 
                strokeWidth={2}
                name="LCP"
              />
              <Line 
                type="monotone" 
                dataKey="fid" 
                stroke="var(--color-error)" 
                strokeWidth={2}
                name="FID"
              />
              <Line 
                type="monotone" 
                dataKey="loadTime" 
                stroke="var(--color-accent)" 
                strokeWidth={2}
                name="Load Time"
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'radar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={radarData?.[0] ? [radarData?.[0]] : []}>
              <PolarGrid stroke="var(--color-border)" />
              <PolarAngleAxis 
                dataKey="experiment" 
                tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
              />
              <PolarRadiusAxis 
                angle={90} 
                domain={[0, 100]}
                tick={{ fontSize: 10, fill: 'var(--color-muted-foreground)' }}
              />
              <Radar
                name="Baseline"
                dataKey="Performance"
                stroke="var(--color-accent)"
                fill="var(--color-accent)"
                fillOpacity={0.1}
                strokeWidth={2}
              />
              <Tooltip content={<CustomTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 sm:mb-0">Performance Visualization</h3>
        
        <div className="flex flex-wrap gap-2">
          {chartTypes?.map((type) => (
            <Button
              key={type?.key}
              variant={activeChart === type?.key ? 'default' : 'outline'}
              size="sm"
              iconName={type?.icon}
              iconPosition="left"
              onClick={() => setActiveChart(type?.key)}
            >
              {type?.label}
            </Button>
          ))}
        </div>
      </div>
      <div className="w-full" aria-label={`${chartTypes?.find(t => t?.key === activeChart)?.label} Chart`}>
        {renderChart()}
      </div>
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-3 bg-muted/30 rounded-lg">
          <div className="text-2xl font-bold text-success">
            {Math.max(...experiments?.map(e => e?.metrics?.performanceScore))}
          </div>
          <div className="text-sm text-muted-foreground">Best Score</div>
        </div>
        
        <div className="text-center p-3 bg-muted/30 rounded-lg">
          <div className="text-2xl font-bold text-accent">
            {Math.min(...experiments?.map(e => parseFloat(e?.metrics?.fcp)))?.toFixed(1)}s
          </div>
          <div className="text-sm text-muted-foreground">Fastest FCP</div>
        </div>
        
        <div className="text-center p-3 bg-muted/30 rounded-lg">
          <div className="text-2xl font-bold text-warning">
            {Math.min(...experiments?.map(e => parseFloat(e?.metrics?.lcp)))?.toFixed(1)}s
          </div>
          <div className="text-sm text-muted-foreground">Fastest LCP</div>
        </div>
        
        <div className="text-center p-3 bg-muted/30 rounded-lg">
          <div className="text-2xl font-bold text-error">
            {Math.min(...experiments?.map(e => parseFloat(e?.metrics?.loadTime)))?.toFixed(1)}s
          </div>
          <div className="text-sm text-muted-foreground">Fastest Load</div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceCharts;