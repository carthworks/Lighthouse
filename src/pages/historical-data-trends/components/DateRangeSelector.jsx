import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const DateRangeSelector = ({ onDateRangeChange, selectedRange }) => {
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [showCustomRange, setShowCustomRange] = useState(false);

  const predefinedRanges = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 3 months' },
    { value: '6m', label: 'Last 6 months' },
    { value: '1y', label: 'Last year' },
    { value: 'custom', label: 'Custom range' }
  ];

  const handleRangeChange = (value) => {
    if (value === 'custom') {
      setShowCustomRange(true);
    } else {
      setShowCustomRange(false);
      onDateRangeChange({ type: 'predefined', value });
    }
  };

  const handleCustomRangeApply = () => {
    if (customStartDate && customEndDate) {
      onDateRangeChange({
        type: 'custom',
        startDate: customStartDate,
        endDate: customEndDate
      });
      setShowCustomRange(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-foreground flex items-center space-x-2">
          <Icon name="Calendar" size={16} />
          <span>Date Range</span>
        </h3>
        {showCustomRange && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowCustomRange(false)}
            iconName="X"
            iconSize={14}
          >
            Cancel
          </Button>
        )}
      </div>
      {!showCustomRange ? (
        <Select
          options={predefinedRanges}
          value={selectedRange}
          onChange={handleRangeChange}
          placeholder="Select date range"
        />
      ) : (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={customStartDate}
              onChange={(e) => setCustomStartDate(e?.target?.value)}
              className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              End Date
            </label>
            <input
              type="date"
              value={customEndDate}
              onChange={(e) => setCustomEndDate(e?.target?.value)}
              className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <Button
            variant="default"
            size="sm"
            onClick={handleCustomRangeApply}
            disabled={!customStartDate || !customEndDate}
            iconName="Check"
            iconSize={14}
            fullWidth
          >
            Apply Range
          </Button>
        </div>
      )}
      <div className="mt-4 pt-3 border-t border-border">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Quick Actions</span>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          <Button
            variant="ghost"
            size="xs"
            onClick={() => handleRangeChange('7d')}
            className="text-xs"
          >
            This Week
          </Button>
          <Button
            variant="ghost"
            size="xs"
            onClick={() => handleRangeChange('30d')}
            className="text-xs"
          >
            This Month
          </Button>
          <Button
            variant="ghost"
            size="xs"
            onClick={() => handleRangeChange('90d')}
            className="text-xs"
          >
            This Quarter
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DateRangeSelector;