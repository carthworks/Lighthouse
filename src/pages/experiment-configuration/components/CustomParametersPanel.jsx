import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Button from '../../../components/ui/Button';

const CustomParametersPanel = ({ parameters, onParametersChange, isExpanded, onToggle }) => {
  const [customFlags, setCustomFlags] = useState(parameters?.customFlags || '');
  const [validationErrors, setValidationErrors] = useState({});

  const cpuThrottlingOptions = [
    { value: '1', label: 'No Throttling (1x)' },
    { value: '2', label: 'Light Throttling (2x)' },
    { value: '4', label: 'Medium Throttling (4x)' },
    { value: '6', label: 'Heavy Throttling (6x)' },
    { value: 'custom', label: 'Custom Multiplier' }
  ];

  const formFactorOptions = [
    { value: 'desktop', label: 'Desktop' },
    { value: 'mobile', label: 'Mobile' }
  ];

  const handleParameterChange = (field, value) => {
    const updatedParams = {
      ...parameters,
      [field]: value
    };
    
    // Validate parameters
    validateParameters(updatedParams);
    onParametersChange(updatedParams);
  };

  const validateParameters = (params) => {
    const errors = {};
    
    if (params?.maxWaitForLoad && params?.maxWaitForLoad < 1000) {
      errors.maxWaitForLoad = 'Must be at least 1000ms';
    }
    
    if (params?.customCpuMultiplier && params?.customCpuMultiplier < 1) {
      errors.customCpuMultiplier = 'Must be at least 1x';
    }
    
    setValidationErrors(errors);
  };

  const handleCustomFlagsChange = (value) => {
    setCustomFlags(value);
    try {
      // Validate JSON format for custom flags
      if (value?.trim()) {
        JSON.parse(value);
      }
      handleParameterChange('customFlags', value);
    } catch (error) {
      setValidationErrors(prev => ({
        ...prev,
        customFlags: 'Invalid JSON format'
      }));
    }
  };

  const addPresetFlag = (flag) => {
    try {
      const currentFlags = customFlags ? JSON.parse(customFlags) : {};
      const updatedFlags = { ...currentFlags, ...flag };
      const flagsString = JSON.stringify(updatedFlags, null, 2);
      setCustomFlags(flagsString);
      handleParameterChange('customFlags', flagsString);
    } catch (error) {
      console.error('Error adding preset flag:', error);
    }
  };

  const presetFlags = [
    { 
      name: 'Disable Images', 
      flag: { '--disable-features': 'VizDisplayCompositor' },
      description: 'Disable image loading for faster testing'
    },
    { 
      name: 'Block Ads', 
      flag: { '--block-new-web-contents': true },
      description: 'Block advertisement content'
    },
    { 
      name: 'Disable GPU', 
      flag: { '--disable-gpu': true },
      description: 'Disable GPU acceleration'
    }
  ];

  return (
    <div className="bg-card rounded-lg border border-border">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-muted/50 transition-smooth"
      >
        <div className="flex items-center space-x-3">
          <Icon name="Code" size={20} className="text-primary" />
          <div>
            <h3 className="text-lg font-semibold text-foreground">Custom Parameters</h3>
            <p className="text-sm text-muted-foreground">Advanced Lighthouse configuration options</p>
          </div>
        </div>
        <Icon 
          name={isExpanded ? "ChevronUp" : "ChevronDown"} 
          size={20} 
          className="text-muted-foreground" 
        />
      </button>
      {isExpanded && (
        <div className="px-6 pb-6 border-t border-border">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Performance Settings */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-foreground flex items-center space-x-2">
                <Icon name="Gauge" size={16} />
                <span>Performance Settings</span>
              </h4>

              <Select
                label="CPU Throttling"
                options={cpuThrottlingOptions}
                value={parameters?.cpuThrottling || '1'}
                onChange={(value) => handleParameterChange('cpuThrottling', value)}
                description="Simulate slower CPU performance"
              />

              {parameters?.cpuThrottling === 'custom' && (
                <Input
                  label="Custom CPU Multiplier"
                  type="number"
                  value={parameters?.customCpuMultiplier || 4}
                  onChange={(e) => handleParameterChange('customCpuMultiplier', parseFloat(e?.target?.value))}
                  placeholder="4"
                  min="1"
                  step="0.1"
                  error={validationErrors?.customCpuMultiplier}
                />
              )}

              <Input
                label="Max Wait for Load (ms)"
                type="number"
                value={parameters?.maxWaitForLoad || 45000}
                onChange={(e) => handleParameterChange('maxWaitForLoad', parseInt(e?.target?.value))}
                placeholder="45000"
                min="1000"
                error={validationErrors?.maxWaitForLoad}
                description="Maximum time to wait for page load events"
              />

              <Select
                label="Form Factor"
                options={formFactorOptions}
                value={parameters?.formFactor || 'desktop'}
                onChange={(value) => handleParameterChange('formFactor', value)}
                description="Device form factor for scoring"
              />
            </div>

            {/* Audit Configuration */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-foreground flex items-center space-x-2">
                <Icon name="CheckSquare" size={16} />
                <span>Audit Configuration</span>
              </h4>

              <div className="space-y-3">
                <Checkbox
                  label="Skip Audits on Load Failure"
                  checked={parameters?.skipAuditsOnLoadFailure || false}
                  onChange={(e) => handleParameterChange('skipAuditsOnLoadFailure', e?.target?.checked)}
                  description="Continue with available audits if page fails to load"
                />

                <Checkbox
                  label="Gather Mode Only"
                  checked={parameters?.gatherModeOnly || false}
                  onChange={(e) => handleParameterChange('gatherModeOnly', e?.target?.checked)}
                  description="Only gather data without running audits"
                />

                <Checkbox
                  label="Disable Storage Reset"
                  checked={parameters?.disableStorageReset || false}
                  onChange={(e) => handleParameterChange('disableStorageReset', e?.target?.checked)}
                  description="Keep storage data between runs"
                />

                <Checkbox
                  label="Enable Error Reporting"
                  checked={parameters?.enableErrorReporting || true}
                  onChange={(e) => handleParameterChange('enableErrorReporting', e?.target?.checked)}
                  description="Include detailed error information in reports"
                />
              </div>
            </div>

            {/* Custom Lighthouse Flags */}
            <div className="lg:col-span-2 space-y-4">
              <h4 className="text-sm font-medium text-foreground flex items-center space-x-2">
                <Icon name="Flag" size={16} />
                <span>Custom Lighthouse Flags</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                {presetFlags?.map((preset, index) => (
                  <button
                    key={index}
                    onClick={() => addPresetFlag(preset?.flag)}
                    className="p-3 text-left border border-border rounded-lg hover:border-primary/50 hover:bg-primary/5 transition-smooth"
                  >
                    <div className="text-sm font-medium text-foreground mb-1">{preset?.name}</div>
                    <div className="text-xs text-muted-foreground">{preset?.description}</div>
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Custom Flags (JSON Format)
                </label>
                <textarea
                  value={customFlags}
                  onChange={(e) => handleCustomFlagsChange(e?.target?.value)}
                  placeholder={`{
  "--disable-web-security": true,
  "--ignore-certificate-errors": true,
  "--disable-features": "VizDisplayCompositor"
}`}
                  className="w-full h-32 px-3 py-2 text-sm border border-border rounded-md bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent font-mono"
                />
                {validationErrors?.customFlags && (
                  <p className="text-xs text-error">{validationErrors?.customFlags}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Enter custom Chrome flags in JSON format. Use caution as invalid flags may cause experiments to fail.
                </p>
              </div>
            </div>

            {/* Output Configuration */}
            <div className="lg:col-span-2 space-y-4">
              <h4 className="text-sm font-medium text-foreground flex items-center space-x-2">
                <Icon name="FileOutput" size={16} />
                <span>Output Configuration</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Checkbox
                    label="Generate HTML Report"
                    checked={parameters?.generateHtmlReport !== false}
                    onChange={(e) => handleParameterChange('generateHtmlReport', e?.target?.checked)}
                    description="Create detailed HTML audit report"
                  />

                  <Checkbox
                    label="Generate JSON Report"
                    checked={parameters?.generateJsonReport !== false}
                    onChange={(e) => handleParameterChange('generateJsonReport', e?.target?.checked)}
                    description="Export raw audit data as JSON"
                  />

                  <Checkbox
                    label="Include Screenshots"
                    checked={parameters?.includeScreenshots || true}
                    onChange={(e) => handleParameterChange('includeScreenshots', e?.target?.checked)}
                    description="Capture page screenshots during audit"
                  />
                </div>

                <div className="space-y-3">
                  <Input
                    label="Output Directory"
                    type="text"
                    value={parameters?.outputDirectory || './lighthouse-reports'}
                    onChange={(e) => handleParameterChange('outputDirectory', e?.target?.value)}
                    placeholder="./lighthouse-reports"
                    description="Directory for saving reports"
                  />

                  <Input
                    label="Report Filename Prefix"
                    type="text"
                    value={parameters?.filenamePrefix || 'lighthouse'}
                    onChange={(e) => handleParameterChange('filenamePrefix', e?.target?.value)}
                    placeholder="lighthouse"
                    description="Prefix for generated report files"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Validation Warnings */}
          {Object.keys(validationErrors)?.length > 0 && (
            <div className="mt-6 p-4 bg-warning/10 border border-warning/20 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="AlertTriangle" size={16} className="text-warning" />
                <span className="text-sm font-medium text-warning">Configuration Warnings</span>
              </div>
              <ul className="text-xs text-warning space-y-1">
                {Object.entries(validationErrors)?.map(([field, error]) => (
                  <li key={field}>• {error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-border">
            <div className="flex items-center space-x-3">
              <Button variant="outline" iconName="Upload" iconPosition="left" size="sm">
                Import Config
              </Button>
              <Button variant="outline" iconName="Download" iconPosition="left" size="sm">
                Export Config
              </Button>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                Reset to Defaults
              </Button>
              <Button variant="outline" iconName="Eye" iconPosition="left" size="sm">
                Preview Config
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomParametersPanel;