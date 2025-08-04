import React, { useState } from 'react';

import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Select from '../../../components/ui/Select';

const FilterSidebar = ({ 
  filters, 
  onFiltersChange, 
  isVisible, 
  onToggle,
  className = '' 
}) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const experimentTypes = [
    { value: 'baseline', label: 'Baseline Audit' },
    { value: 'no-js', label: 'JavaScript Disabled' },
    { value: 'third-party-blocked', label: 'Third-party Blocked' },
    { value: 'render-blocking-removed', label: 'Render-blocking Removed' },
    { value: 'unused-resources-blocked', label: 'Unused Resources Blocked' },
    { value: 'first-party-only', label: 'First-party Only' }
  ];

  const metricCategories = [
    { value: 'performance', label: 'Performance' },
    { value: 'accessibility', label: 'Accessibility' },
    { value: 'best-practices', label: 'Best Practices' },
    { value: 'seo', label: 'SEO' },
    { value: 'pwa', label: 'PWA' }
  ];

  const performanceRanges = [
    { value: 'excellent', label: 'Excellent (90-100)' },
    { value: 'good', label: 'Good (50-89)' },
    { value: 'poor', label: 'Poor (0-49)' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleExperimentTypeToggle = (type) => {
    const currentTypes = localFilters?.experimentTypes || [];
    const newTypes = currentTypes?.includes(type)
      ? currentTypes?.filter(t => t !== type)
      : [...currentTypes, type];
    handleFilterChange('experimentTypes', newTypes);
  };

  const handleMetricCategoryToggle = (category) => {
    const currentCategories = localFilters?.metricCategories || [];
    const newCategories = currentCategories?.includes(category)
      ? currentCategories?.filter(c => c !== category)
      : [...currentCategories, category];
    handleFilterChange('metricCategories', newCategories);
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      experimentTypes: [],
      metricCategories: [],
      performanceRange: '',
      sortBy: 'performanceScore',
      sortOrder: 'desc'
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (localFilters?.experimentTypes?.length > 0) count++;
    if (localFilters?.metricCategories?.length > 0) count++;
    if (localFilters?.performanceRange) count++;
    return count;
  };

  const sidebarContent = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Filters</h3>
        <div className="flex items-center space-x-2">
          {getActiveFilterCount() > 0 && (
            <span className="bg-accent text-accent-foreground text-xs px-2 py-1 rounded-full">
              {getActiveFilterCount()}
            </span>
          )}
          <Button
            variant="ghost"
            size="sm"
            iconName="X"
            onClick={onToggle}
            className="lg:hidden"
          />
        </div>
      </div>

      {/* Experiment Types */}
      <div className="space-y-3">
        <h4 className="font-medium text-foreground">Experiment Types</h4>
        <div className="space-y-2">
          {experimentTypes?.map((type) => (
            <Checkbox
              key={type?.value}
              label={type?.label}
              checked={localFilters?.experimentTypes?.includes(type?.value) || false}
              onChange={() => handleExperimentTypeToggle(type?.value)}
            />
          ))}
        </div>
      </div>

      {/* Metric Categories */}
      <div className="space-y-3">
        <h4 className="font-medium text-foreground">Metric Categories</h4>
        <div className="space-y-2">
          {metricCategories?.map((category) => (
            <Checkbox
              key={category?.value}
              label={category?.label}
              checked={localFilters?.metricCategories?.includes(category?.value) || false}
              onChange={() => handleMetricCategoryToggle(category?.value)}
            />
          ))}
        </div>
      </div>

      {/* Performance Range */}
      <div className="space-y-3">
        <h4 className="font-medium text-foreground">Performance Score</h4>
        <Select
          options={[
            { value: '', label: 'All Scores' },
            ...performanceRanges
          ]}
          value={localFilters?.performanceRange || ''}
          onChange={(value) => handleFilterChange('performanceRange', value)}
          placeholder="Select range"
        />
      </div>

      {/* Sort Options */}
      <div className="space-y-3">
        <h4 className="font-medium text-foreground">Sort By</h4>
        <Select
          options={[
            { value: 'performanceScore', label: 'Performance Score' },
            { value: 'fcp', label: 'First Contentful Paint' },
            { value: 'lcp', label: 'Largest Contentful Paint' },
            { value: 'cls', label: 'Cumulative Layout Shift' },
            { value: 'fid', label: 'First Input Delay' },
            { value: 'loadTime', label: 'Load Time' }
          ]}
          value={localFilters?.sortBy || 'performanceScore'}
          onChange={(value) => handleFilterChange('sortBy', value)}
        />
        
        <Select
          options={[
            { value: 'desc', label: 'Descending' },
            { value: 'asc', label: 'Ascending' }
          ]}
          value={localFilters?.sortOrder || 'desc'}
          onChange={(value) => handleFilterChange('sortOrder', value)}
        />
      </div>

      {/* Clear Filters */}
      <Button
        variant="outline"
        fullWidth
        iconName="RotateCcw"
        iconPosition="left"
        onClick={clearAllFilters}
        disabled={getActiveFilterCount() === 0}
      >
        Clear All Filters
      </Button>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`hidden lg:block ${className}`}>
        <div className="bg-card rounded-lg border border-border p-6 sticky top-24">
          {sidebarContent}
        </div>
      </div>

      {/* Mobile Overlay */}
      {isVisible && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-1010 lg:hidden">
          <div className="fixed right-0 top-0 h-full w-80 bg-card border-l border-border shadow-elevated overflow-y-auto">
            <div className="p-6">
              {sidebarContent}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Filter Button */}
      <Button
        variant="default"
        size="icon"
        iconName="Filter"
        onClick={onToggle}
        className="fixed bottom-6 right-6 lg:hidden z-1005 shadow-elevated"
      >
        {getActiveFilterCount() > 0 && (
          <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center">
            {getActiveFilterCount()}
          </span>
        )}
      </Button>

      {/* Click outside to close */}
      {isVisible && (
        <div 
          className="fixed inset-0 z-1009 lg:hidden" 
          onClick={onToggle}
        />
      )}
    </>
  );
};

export default FilterSidebar;