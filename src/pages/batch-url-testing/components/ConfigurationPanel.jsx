import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox, CheckboxGroup } from '../../../components/ui/Checkbox';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';

const ConfigurationPanel = ({ 
  selectedExperiments, 
  onExperimentsChange,
  executionMode,
  onExecutionModeChange,
  customSettings,
  onCustomSettingsChange
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const experimentOptions = [
    {
      id: 'baseline',
      label: 'Baseline Audit',
      description: 'Standard Lighthouse audit with default settings',
      icon: 'Activity',
      enabled: true
    },
    {
      id: 'no-js',
      label: 'JavaScript Disabled',
      description: 'Simulate environment without JavaScript execution',
      icon: 'Code',
      enabled: true
    },
    {
      id: 'block-third-party',
      label: 'Block Third-party JS',
      description: 'Block GTM, GA, Facebook and other external scripts',
      icon: 'Shield',
      enabled: true
    },
    {
      id: 'no-render-blocking',
      label: 'Remove Render-blocking',
      description: 'Eliminate render-blocking CSS and JavaScript',
      icon: 'Zap',
      enabled: true
    },
    {
      id: 'unused-resources',
      label: 'Block Unused Resources',
      description: 'Identify and block low-coverage resources',
      icon: 'Trash2',
      enabled: true
    },
    {
      id: 'first-party-only',
      label: 'First-party Resources Only',
      description: 'Isolate first-party and essential resources',
      icon: 'Home',
      enabled: true
    }
  ];

  const executionModeOptions = [
    { value: 'sequential', label: 'Sequential Execution', description: 'Run experiments one after another' },
    { value: 'parallel', label: 'Parallel Execution', description: 'Run multiple experiments simultaneously' }
  ];

  const deviceOptions = [
    { value: 'desktop', label: 'Desktop' },
    { value: 'mobile', label: 'Mobile' },
    { value: 'both', label: 'Both Desktop & Mobile' }
  ];

  const throttlingOptions = [
    { value: 'none', label: 'No Throttling' },
    { value: '3g-slow', label: 'Slow 3G' },
    { value: '3g-fast', label: 'Fast 3G' },
    { value: '4g', label: '4G' }
  ];

  const handleExperimentToggle = (experimentId, checked) => {
    if (checked) {
      onExperimentsChange([...selectedExperiments, experimentId]);
    } else {
      onExperimentsChange(selectedExperiments?.filter(id => id !== experimentId));
    }
  };

  const selectAllExperiments = () => {
    const allIds = experimentOptions?.filter(exp => exp?.enabled)?.map(exp => exp?.id);
    onExperimentsChange(allIds);
  };

  const clearAllExperiments = () => {
    onExperimentsChange([]);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Experiment Configuration</h3>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={selectAllExperiments}
            iconName="CheckSquare"
            iconSize={14}
          >
            Select All
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllExperiments}
            iconName="Square"
            iconSize={14}
          >
            Clear All
          </Button>
        </div>
      </div>
      {/* Experiment Selection */}
      <div className="mb-6">
        <CheckboxGroup 
          label="Select Experiments to Run"
          description="Choose which Lighthouse experiments to execute for each URL"
        >
          <div className="grid grid-cols-1 gap-3">
            {experimentOptions?.map((experiment) => (
              <div
                key={experiment?.id}
                className="flex items-start space-x-3 p-3 rounded-md border border-border hover:bg-muted/50 transition-colors"
              >
                <Checkbox
                  checked={selectedExperiments?.includes(experiment?.id)}
                  onChange={(e) => handleExperimentToggle(experiment?.id, e?.target?.checked)}
                  disabled={!experiment?.enabled}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <Icon name={experiment?.icon} size={16} className="text-accent" />
                    <span className="text-sm font-medium text-foreground">
                      {experiment?.label}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {experiment?.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CheckboxGroup>
      </div>
      {/* Execution Mode */}
      <div className="mb-6">
        <Select
          label="Execution Mode"
          description="Choose how experiments should be executed"
          options={executionModeOptions}
          value={executionMode}
          onChange={onExecutionModeChange}
        />
      </div>
      {/* Basic Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Select
          label="Device Type"
          options={deviceOptions}
          value={customSettings?.device}
          onChange={(value) => onCustomSettingsChange({ ...customSettings, device: value })}
        />
        <Select
          label="Network Throttling"
          options={throttlingOptions}
          value={customSettings?.throttling}
          onChange={(value) => onCustomSettingsChange({ ...customSettings, throttling: value })}
        />
      </div>
      {/* Advanced Settings Toggle */}
      <div className="border-t border-border pt-4">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center space-x-2 text-sm text-accent hover:text-accent/80 transition-colors"
        >
          <Icon 
            name={showAdvanced ? "ChevronUp" : "ChevronDown"} 
            size={16} 
          />
          <span>Advanced Settings</span>
        </button>

        {showAdvanced && (
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Timeout (seconds)"
                type="number"
                value={customSettings?.timeout}
                onChange={(e) => onCustomSettingsChange({ 
                  ...customSettings, 
                  timeout: parseInt(e?.target?.value) || 30 
                })}
                min="10"
                max="300"
              />
              <Input
                label="Max Concurrent Jobs"
                type="number"
                value={customSettings?.maxConcurrent}
                onChange={(e) => onCustomSettingsChange({ 
                  ...customSettings, 
                  maxConcurrent: parseInt(e?.target?.value) || 3 
                })}
                min="1"
                max="10"
              />
            </div>
            
            <div className="space-y-3">
              <Checkbox
                label="Generate HTML Reports"
                description="Create detailed HTML reports for each experiment"
                checked={customSettings?.generateHtml}
                onChange={(e) => onCustomSettingsChange({ 
                  ...customSettings, 
                  generateHtml: e?.target?.checked 
                })}
              />
              <Checkbox
                label="Generate JSON Reports"
                description="Export raw Lighthouse data as JSON files"
                checked={customSettings?.generateJson}
                onChange={(e) => onCustomSettingsChange({ 
                  ...customSettings, 
                  generateJson: e?.target?.checked 
                })}
              />
              <Checkbox
                label="Email Notifications"
                description="Send email when batch processing completes"
                checked={customSettings?.emailNotifications}
                onChange={(e) => onCustomSettingsChange({ 
                  ...customSettings, 
                  emailNotifications: e?.target?.checked 
                })}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfigurationPanel;