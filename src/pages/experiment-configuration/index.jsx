import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import NotificationToast, { useToast } from '../../components/ui/NotificationToast';
import GeneralSettingsPanel from './components/GeneralSettingsPanel';
import ExperimentTemplatesGrid from './components/ExperimentTemplatesGrid';
import CustomParametersPanel from './components/CustomParametersPanel';
import ConfigurationActions from './components/ConfigurationActions';

const ExperimentConfiguration = () => {
  const navigate = useNavigate();
  const { toasts, addToast, removeToast } = useToast();

  // Panel expansion states
  const [expandedPanels, setExpandedPanels] = useState({
    general: true,
    templates: false,
    custom: false
  });

  // Configuration states
  const [generalSettings, setGeneralSettings] = useState({
    pageTimeout: 30,
    navigationTimeout: 60,
    deviceType: 'desktop',
    networkThrottling: 'none',
    clearCache: true,
    disableJavaScript: false,
    blockThirdParty: false,
    cpuThrottling: false
  });

  const [customParameters, setCustomParameters] = useState({
    cpuThrottling: '1',
    maxWaitForLoad: 45000,
    formFactor: 'desktop',
    skipAuditsOnLoadFailure: false,
    gatherModeOnly: false,
    disableStorageReset: false,
    enableErrorReporting: true,
    generateHtmlReport: true,
    generateJsonReport: true,
    includeScreenshots: true,
    outputDirectory: './lighthouse-reports',
    filenamePrefix: 'lighthouse',
    customFlags: ''
  });

  const [experimentTemplates] = useState([
    {
      id: 1,
      name: 'Mobile Performance Audit',
      description: 'Comprehensive mobile performance testing with 3G throttling and CPU slowdown for realistic mobile conditions.',
      experiments: ['baseline', 'no-js', 'block-third-party', 'block-render-blocking'],
      settings: {
        deviceType: 'mobile',
        networkThrottling: 'slow-3g',
        pageTimeout: 45,
        clearCache: true
      },
      createdAt: 'Dec 15, 2024',
      estimatedDuration: 8,
      isDefault: true,
      isShared: false
    },
    {
      id: 2,
      name: 'Desktop Optimization Test',
      description: 'Desktop-focused performance analysis with resource blocking experiments to identify optimization opportunities.',
      experiments: ['baseline', 'block-unused', 'first-party-only'],
      settings: {
        deviceType: 'desktop',
        networkThrottling: 'none',
        pageTimeout: 30,
        clearCache: true
      },
      createdAt: 'Dec 10, 2024',
      estimatedDuration: 6,
      isDefault: false,
      isShared: true
    },
    {
      id: 3,
      name: 'Third-party Impact Analysis',
      description: 'Specialized template for analyzing the performance impact of third-party scripts and resources.',
      experiments: ['baseline', 'block-third-party', 'first-party-only'],
      settings: {
        deviceType: 'desktop',
        networkThrottling: 'fast-3g',
        pageTimeout: 60,
        blockThirdParty: true
      },
      createdAt: 'Dec 8, 2024',
      estimatedDuration: 5,
      isDefault: false,
      isShared: false
    },
    {
      id: 4,
      name: 'JavaScript Dependency Test',
      description: 'Evaluate site functionality and performance with JavaScript disabled to test progressive enhancement.',
      experiments: ['baseline', 'no-js'],
      settings: {
        deviceType: 'mobile',
        networkThrottling: 'slow-3g',
        disableJavaScript: true,
        pageTimeout: 30
      },
      createdAt: 'Dec 5, 2024',
      estimatedDuration: 4,
      isDefault: false,
      isShared: true
    }
  ]);

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  // Track changes for unsaved indicator
  useEffect(() => {
    setHasUnsavedChanges(true);
  }, [generalSettings, customParameters]);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const togglePanel = (panel) => {
    setExpandedPanels(prev => ({
      ...prev,
      [panel]: !prev?.[panel]
    }));
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    // Apply template settings to current configuration
    setGeneralSettings(prev => ({
      ...prev,
      ...template?.settings
    }));
    addToast({
      type: 'success',
      title: 'Template Applied',
      message: `Configuration updated with "${template?.name}" template settings`
    });
  };

  const handleTemplateDelete = (templateId) => {
    addToast({
      type: 'warning',
      title: 'Template Deleted',
      message: 'Template has been removed from your saved configurations'
    });
  };

  const handleTemplateEdit = (template) => {
    addToast({
      type: 'info',
      title: 'Edit Template',
      message: `Opening editor for "${template?.name}" template`
    });
  };

  const handleSaveTemplate = (templateData) => {
    addToast({
      type: 'success',
      title: 'Template Saved',
      message: `"${templateData?.name}" has been saved to your templates`
    });
    setHasUnsavedChanges(false);
  };

  const handleApplyConfiguration = () => {
    addToast({
      type: 'success',
      title: 'Configuration Applied',
      message: 'Experiment configuration has been applied successfully',
      action: {
        label: 'Start Experiments',
        onClick: () => navigate('/dashboard-home')
      }
    });
    setHasUnsavedChanges(false);
  };

  const handleResetDefaults = () => {
    setGeneralSettings({
      pageTimeout: 30,
      navigationTimeout: 60,
      deviceType: 'desktop',
      networkThrottling: 'none',
      clearCache: true,
      disableJavaScript: false,
      blockThirdParty: false,
      cpuThrottling: false
    });

    setCustomParameters({
      cpuThrottling: '1',
      maxWaitForLoad: 45000,
      formFactor: 'desktop',
      skipAuditsOnLoadFailure: false,
      gatherModeOnly: false,
      disableStorageReset: false,
      enableErrorReporting: true,
      generateHtmlReport: true,
      generateJsonReport: true,
      includeScreenshots: true,
      outputDirectory: './lighthouse-reports',
      filenamePrefix: 'lighthouse',
      customFlags: ''
    });

    addToast({
      type: 'info',
      title: 'Settings Reset',
      message: 'All configuration settings have been reset to defaults'
    });
    setHasUnsavedChanges(false);
  };

  const isValidConfiguration = () => {
    return generalSettings?.pageTimeout >= 10 && 
           generalSettings?.navigationTimeout >= 30 &&
           customParameters?.maxWaitForLoad >= 1000;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onNavigate={handleNavigation} />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Breadcrumb onNavigate={handleNavigation} />
          
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Experiment Configuration
            </h1>
            <p className="text-muted-foreground">
              Customize Lighthouse audit parameters and create reusable experiment templates 
              for specialized testing scenarios.
            </p>
          </div>

          {/* Configuration Panels */}
          <div className="space-y-6">
            {/* General Settings Panel */}
            <GeneralSettingsPanel
              settings={generalSettings}
              onSettingsChange={setGeneralSettings}
              isExpanded={expandedPanels?.general}
              onToggle={() => togglePanel('general')}
            />

            {/* Experiment Templates Grid */}
            <ExperimentTemplatesGrid
              templates={experimentTemplates}
              onTemplateSelect={handleTemplateSelect}
              onTemplateDelete={handleTemplateDelete}
              onTemplateEdit={handleTemplateEdit}
              isExpanded={expandedPanels?.templates}
              onToggle={() => togglePanel('templates')}
            />

            {/* Custom Parameters Panel */}
            <CustomParametersPanel
              parameters={customParameters}
              onParametersChange={setCustomParameters}
              isExpanded={expandedPanels?.custom}
              onToggle={() => togglePanel('custom')}
            />

            {/* Configuration Actions */}
            <ConfigurationActions
              onSaveTemplate={handleSaveTemplate}
              onApplyConfiguration={handleApplyConfiguration}
              onResetDefaults={handleResetDefaults}
              hasUnsavedChanges={hasUnsavedChanges}
              isValidConfiguration={isValidConfiguration()}
            />
          </div>

          {/* Configuration Summary */}
          <div className="mt-8 p-6 bg-muted/50 rounded-lg">
            <h3 className="text-lg font-semibold text-foreground mb-4">Current Configuration Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Device:</span>
                <span className="ml-2 text-foreground font-medium">
                  {generalSettings?.deviceType?.charAt(0)?.toUpperCase() + generalSettings?.deviceType?.slice(1)}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Network:</span>
                <span className="ml-2 text-foreground font-medium">
                  {generalSettings?.networkThrottling === 'none' ? 'No Throttling' : generalSettings?.networkThrottling}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Timeout:</span>
                <span className="ml-2 text-foreground font-medium">
                  {generalSettings?.pageTimeout}s
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">CPU Throttling:</span>
                <span className="ml-2 text-foreground font-medium">
                  {customParameters?.cpuThrottling}x
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <NotificationToast toasts={toasts} onRemoveToast={removeToast} />
    </div>
  );
};

export default ExperimentConfiguration;