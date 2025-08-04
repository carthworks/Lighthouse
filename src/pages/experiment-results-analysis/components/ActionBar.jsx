import React, { useState } from 'react';

import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const ActionBar = ({ 
  onExportReport, 
  onShareResults, 
  onRunNewExperiment, 
  onBulkActions,
  selectedExperiments = [],
  totalExperiments = 0 
}) => {
  const [exportFormat, setExportFormat] = useState('html');
  const [isExporting, setIsExporting] = useState(false);

  const exportOptions = [
    { value: 'html', label: 'HTML Report' },
    { value: 'json', label: 'JSON Data' },
    { value: 'csv', label: 'CSV Export' },
    { value: 'pdf', label: 'PDF Report' }
  ];

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await onExportReport(exportFormat, selectedExperiments);
    } finally {
      setIsExporting(false);
    }
  };

  const handleBulkAction = (action) => {
    if (selectedExperiments?.length === 0) return;
    onBulkActions(action, selectedExperiments);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-4 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        {/* Left Section - Selection Info */}
        <div className="flex items-center space-x-4">
          <div className="text-sm text-muted-foreground">
            {selectedExperiments?.length > 0 ? (
              <span>
                {selectedExperiments?.length} of {totalExperiments} experiments selected
              </span>
            ) : (
              <span>
                {totalExperiments} experiments available
              </span>
            )}
          </div>
          
          {selectedExperiments?.length > 0 && (
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                iconName="GitCompare"
                onClick={() => handleBulkAction('compare')}
              >
                Compare Selected
              </Button>
              <Button
                variant="outline"
                size="sm"
                iconName="Trash2"
                onClick={() => handleBulkAction('delete')}
              >
                Delete Selected
              </Button>
            </div>
          )}
        </div>

        {/* Right Section - Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
          {/* Export Section */}
          <div className="flex items-center space-x-2">
            <Select
              options={exportOptions}
              value={exportFormat}
              onChange={setExportFormat}
              className="w-32"
            />
            <Button
              variant="outline"
              size="sm"
              iconName="Download"
              loading={isExporting}
              onClick={handleExport}
              disabled={selectedExperiments?.length === 0}
            >
              Export
            </Button>
          </div>

          {/* Share Button */}
          <Button
            variant="outline"
            size="sm"
            iconName="Share"
            onClick={onShareResults}
            disabled={selectedExperiments?.length === 0}
          >
            Share
          </Button>

          {/* Primary Action */}
          <Button
            variant="default"
            size="sm"
            iconName="Play"
            iconPosition="left"
            onClick={onRunNewExperiment}
          >
            Run New Experiment
          </Button>
        </div>
      </div>
      {/* Quick Stats */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-lg font-semibold text-success">
              {Math.floor(Math.random() * 20) + 80}
            </div>
            <div className="text-xs text-muted-foreground">Avg Performance</div>
          </div>
          
          <div className="text-center">
            <div className="text-lg font-semibold text-accent">
              {(Math.random() * 2 + 1)?.toFixed(1)}s
            </div>
            <div className="text-xs text-muted-foreground">Avg FCP</div>
          </div>
          
          <div className="text-center">
            <div className="text-lg font-semibold text-warning">
              {(Math.random() * 3 + 2)?.toFixed(1)}s
            </div>
            <div className="text-xs text-muted-foreground">Avg LCP</div>
          </div>
          
          <div className="text-center">
            <div className="text-lg font-semibold text-error">
              {Math.floor(Math.random() * 50) + 10}
            </div>
            <div className="text-xs text-muted-foreground">Issues Found</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionBar;