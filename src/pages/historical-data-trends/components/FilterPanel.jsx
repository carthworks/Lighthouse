import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const FilterPanel = ({ onFiltersChange, activeFilters }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const experimentTypes = [
    { value: 'baseline', label: 'Baseline Audit' },
    { value: 'no-js', label: 'No JavaScript' },
    { value: 'no-third-party', label: 'No Third-party JS' },
    { value: 'no-render-blocking', label: 'No Render Blocking' },
    { value: 'unused-resources', label: 'Unused Resources' },
    { value: 'first-party-only', label: 'First-party Only' }
  ];

  const performanceMetrics = [
    { value: 'performance', label: 'Performance Score' },
    { value: 'fcp', label: 'First Contentful Paint' },
    { value: 'lcp', label: 'Largest Contentful Paint' },
    { value: 'cls', label: 'Cumulative Layout Shift' },
    { value: 'fid', label: 'First Input Delay' },
    { value: 'ttfb', label: 'Time to First Byte' },
    { value: 'speed-index', label: 'Speed Index' }
  ];

  const deviceTypes = [
    { value: 'desktop', label: 'Desktop' },
    { value: 'mobile', label: 'Mobile' }
  ];

  const handleExperimentTypeChange = (types) => {
    onFiltersChange({ ...activeFilters, experimentTypes: types });
  };

  const handleMetricChange = (metrics) => {
    onFiltersChange({ ...activeFilters, metrics });
  };

  const handleDeviceChange = (devices) => {
    onFiltersChange({ ...activeFilters, devices });
  };

  const handleUrlFilterChange = (e) => {
    onFiltersChange({ ...activeFilters, urlFilter: e?.target?.value });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      experimentTypes: [],
      metrics: ['performance'],
      devices: ['desktop'],
      urlFilter: ''
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="text-sm font-medium text-foreground flex items-center space-x-2">
          <Icon name="Filter" size={16} />
          <span>Filters</span>
        </h3>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="xs"
            onClick={clearAllFilters}
            iconName="RotateCcw"
            iconSize={12}
          >
            Clear
          </Button>
          <Button
            variant="ghost"
            size="xs"
            onClick={() => setIsCollapsed(!isCollapsed)}
            iconName={isCollapsed ? "ChevronDown" : "ChevronUp"}
            iconSize={14}
          />
        </div>
      </div>
      {!isCollapsed && (
        <div className="p-4 space-y-6">
          {/* URL Filter */}
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-2">
              Filter by URL
            </label>
            <div className="relative">
              <Icon name="Search" size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Enter URL or domain..."
                value={activeFilters?.urlFilter || ''}
                onChange={handleUrlFilterChange}
                className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {/* Experiment Types */}
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-2">
              Experiment Types
            </label>
            <Select
              options={experimentTypes}
              value={activeFilters?.experimentTypes || []}
              onChange={handleExperimentTypeChange}
              multiple
              searchable
              placeholder="Select experiment types"
            />
          </div>

          {/* Performance Metrics */}
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-2">
              Performance Metrics
            </label>
            <Select
              options={performanceMetrics}
              value={activeFilters?.metrics || ['performance']}
              onChange={handleMetricChange}
              multiple
              searchable
              placeholder="Select metrics"
            />
          </div>

          {/* Device Types */}
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-2">
              Device Types
            </label>
            <div className="space-y-2">
              {deviceTypes?.map((device) => (
                <Checkbox
                  key={device?.value}
                  label={device?.label}
                  checked={(activeFilters?.devices || [])?.includes(device?.value)}
                  onChange={(e) => {
                    const currentDevices = activeFilters?.devices || [];
                    const newDevices = e?.target?.checked
                      ? [...currentDevices, device?.value]
                      : currentDevices?.filter(d => d !== device?.value);
                    handleDeviceChange(newDevices);
                  }}
                />
              ))}
            </div>
          </div>

          {/* Score Range */}
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-2">
              Performance Score Range
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min="0"
                max="100"
                placeholder="Min"
                className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <span className="text-muted-foreground">-</span>
              <input
                type="number"
                min="0"
                max="100"
                placeholder="Max"
                className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {/* Active Filters Count */}
          <div className="pt-3 border-t border-border">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Active Filters</span>
              <span className="bg-accent text-accent-foreground px-2 py-1 rounded-full text-xs font-medium">
                {Object.values(activeFilters)?.filter(v => v && (Array.isArray(v) ? v?.length > 0 : v !== ''))?.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;