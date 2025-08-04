import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const GeneralSettingsPanel = ({ settings, onSettingsChange, isExpanded, onToggle }) => {
  const deviceOptions = [
    { value: 'desktop', label: 'Desktop (1920x1080)' },
    { value: 'mobile', label: 'Mobile (375x667)' },
    { value: 'tablet', label: 'Tablet (768x1024)' },
    { value: 'custom', label: 'Custom Resolution' }
  ];

  const throttlingOptions = [
    { value: 'none', label: 'No Throttling' },
    { value: 'slow-3g', label: 'Slow 3G (1.6 Mbps)' },
    { value: 'fast-3g', label: 'Fast 3G (1.6 Mbps)' },
    { value: '4g', label: '4G (10 Mbps)' },
    { value: 'custom', label: 'Custom Network' }
  ];

  const handleInputChange = (field, value) => {
    onSettingsChange({
      ...settings,
      [field]: value
    });
  };

  return (
    <div className="bg-card rounded-lg border border-border">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-muted/50 transition-smooth"
      >
        <div className="flex items-center space-x-3">
          <Icon name="Settings" size={20} className="text-primary" />
          <div>
            <h3 className="text-lg font-semibold text-foreground">General Settings</h3>
            <p className="text-sm text-muted-foreground">Configure default experiment parameters</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Timeout Configuration */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-foreground flex items-center space-x-2">
                <Icon name="Clock" size={16} />
                <span>Timeout Settings</span>
              </h4>
              
              <Input
                label="Page Load Timeout (seconds)"
                type="number"
                value={settings?.pageTimeout || 30}
                onChange={(e) => handleInputChange('pageTimeout', parseInt(e?.target?.value))}
                placeholder="30"
                min="10"
                max="300"
                description="Maximum time to wait for page load"
              />

              <Input
                label="Navigation Timeout (seconds)"
                type="number"
                value={settings?.navigationTimeout || 60}
                onChange={(e) => handleInputChange('navigationTimeout', parseInt(e?.target?.value))}
                placeholder="60"
                min="30"
                max="600"
                description="Maximum time for navigation completion"
              />
            </div>

            {/* Device Emulation */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-foreground flex items-center space-x-2">
                <Icon name="Monitor" size={16} />
                <span>Device Emulation</span>
              </h4>

              <Select
                label="Device Type"
                options={deviceOptions}
                value={settings?.deviceType || 'desktop'}
                onChange={(value) => handleInputChange('deviceType', value)}
                description="Select device for emulation"
              />

              {settings?.deviceType === 'custom' && (
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Width (px)"
                    type="number"
                    value={settings?.customWidth || 1920}
                    onChange={(e) => handleInputChange('customWidth', parseInt(e?.target?.value))}
                    placeholder="1920"
                  />
                  <Input
                    label="Height (px)"
                    type="number"
                    value={settings?.customHeight || 1080}
                    onChange={(e) => handleInputChange('customHeight', parseInt(e?.target?.value))}
                    placeholder="1080"
                  />
                </div>
              )}
            </div>

            {/* Network Throttling */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-foreground flex items-center space-x-2">
                <Icon name="Wifi" size={16} />
                <span>Network Throttling</span>
              </h4>

              <Select
                label="Network Speed"
                options={throttlingOptions}
                value={settings?.networkThrottling || 'none'}
                onChange={(value) => handleInputChange('networkThrottling', value)}
                description="Simulate different network conditions"
              />

              {settings?.networkThrottling === 'custom' && (
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Download (Mbps)"
                    type="number"
                    value={settings?.customDownload || 10}
                    onChange={(e) => handleInputChange('customDownload', parseFloat(e?.target?.value))}
                    placeholder="10"
                    step="0.1"
                  />
                  <Input
                    label="Upload (Mbps)"
                    type="number"
                    value={settings?.customUpload || 1}
                    onChange={(e) => handleInputChange('customUpload', parseFloat(e?.target?.value))}
                    placeholder="1"
                    step="0.1"
                  />
                </div>
              )}
            </div>

            {/* Advanced Options */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-foreground flex items-center space-x-2">
                <Icon name="Zap" size={16} />
                <span>Advanced Options</span>
              </h4>

              <div className="space-y-3">
                <Checkbox
                  label="Clear Browser Cache"
                  checked={settings?.clearCache || true}
                  onChange={(e) => handleInputChange('clearCache', e?.target?.checked)}
                  description="Clear cache before each experiment"
                />

                <Checkbox
                  label="Disable JavaScript"
                  checked={settings?.disableJavaScript || false}
                  onChange={(e) => handleInputChange('disableJavaScript', e?.target?.checked)}
                  description="Run experiments without JavaScript"
                />

                <Checkbox
                  label="Block Third-party Resources"
                  checked={settings?.blockThirdParty || false}
                  onChange={(e) => handleInputChange('blockThirdParty', e?.target?.checked)}
                  description="Block external scripts and resources"
                />

                <Checkbox
                  label="Simulate Slow CPU"
                  checked={settings?.cpuThrottling || false}
                  onChange={(e) => handleInputChange('cpuThrottling', e?.target?.checked)}
                  description="Apply 4x CPU slowdown"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeneralSettingsPanel;