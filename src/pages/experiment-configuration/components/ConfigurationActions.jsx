import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ConfigurationActions = ({ 
  onSaveTemplate, 
  onApplyConfiguration, 
  onResetDefaults, 
  hasUnsavedChanges = false,
  isValidConfiguration = true 
}) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');

  const handleSaveTemplate = () => {
    if (templateName?.trim()) {
      onSaveTemplate({
        name: templateName,
        description: templateDescription,
        timestamp: new Date()?.toISOString()
      });
      setShowSaveDialog(false);
      setTemplateName('');
      setTemplateDescription('');
    }
  };

  const handleResetConfirm = () => {
    onResetDefaults();
    setShowResetConfirm(false);
  };

  return (
    <>
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Configuration Actions</h3>
            <p className="text-sm text-muted-foreground">
              Save, apply, or reset your experiment configuration
            </p>
          </div>
          {hasUnsavedChanges && (
            <div className="flex items-center space-x-2 px-3 py-1 bg-warning/10 rounded-md">
              <Icon name="AlertCircle" size={14} className="text-warning" />
              <span className="text-xs text-warning font-medium">Unsaved Changes</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Save Template */}
          <div className="p-4 border border-border rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <Icon name="Save" size={16} className="text-primary" />
              <h4 className="text-sm font-medium text-foreground">Save Template</h4>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Save current configuration as a reusable template for future experiments
            </p>
            <Button 
              variant="outline" 
              fullWidth 
              iconName="Plus" 
              iconPosition="left"
              onClick={() => setShowSaveDialog(true)}
            >
              Save as Template
            </Button>
          </div>

          {/* Apply Configuration */}
          <div className="p-4 border border-border rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <Icon name="Play" size={16} className="text-success" />
              <h4 className="text-sm font-medium text-foreground">Apply Configuration</h4>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Apply current settings and start running experiments with this configuration
            </p>
            <Button 
              variant="default" 
              fullWidth 
              iconName="CheckCircle" 
              iconPosition="left"
              disabled={!isValidConfiguration}
              onClick={onApplyConfiguration}
            >
              Apply & Run
            </Button>
          </div>

          {/* Reset to Defaults */}
          <div className="p-4 border border-border rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <Icon name="RotateCcw" size={16} className="text-warning" />
              <h4 className="text-sm font-medium text-foreground">Reset Defaults</h4>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Reset all configuration settings back to their default values
            </p>
            <Button 
              variant="outline" 
              fullWidth 
              iconName="RefreshCw" 
              iconPosition="left"
              onClick={() => setShowResetConfirm(true)}
            >
              Reset All
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-border">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" iconName="FileText" iconPosition="left" size="sm">
              View Documentation
            </Button>
            <Button variant="ghost" iconName="HelpCircle" iconPosition="left" size="sm">
              Configuration Help
            </Button>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="outline" iconName="Copy" iconPosition="left" size="sm">
              Copy Config URL
            </Button>
            <Button variant="outline" iconName="Share2" iconPosition="left" size="sm">
              Share Template
            </Button>
          </div>
        </div>
      </div>
      {/* Save Template Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg border border-border shadow-elevated w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Icon name="Save" size={20} className="text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Save Configuration Template</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Template Name *
                  </label>
                  <input
                    type="text"
                    value={templateName}
                    onChange={(e) => setTemplateName(e?.target?.value)}
                    placeholder="e.g., Mobile Performance Test"
                    className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Description
                  </label>
                  <textarea
                    value={templateDescription}
                    onChange={(e) => setTemplateDescription(e?.target?.value)}
                    placeholder="Describe when to use this template..."
                    rows={3}
                    className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-end space-x-3 mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => setShowSaveDialog(false)}
                >
                  Cancel
                </Button>
                <Button 
                  variant="default" 
                  onClick={handleSaveTemplate}
                  disabled={!templateName?.trim()}
                >
                  Save Template
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg border border-border shadow-elevated w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Icon name="AlertTriangle" size={20} className="text-warning" />
                <h3 className="text-lg font-semibold text-foreground">Reset Configuration</h3>
              </div>
              
              <p className="text-sm text-muted-foreground mb-6">
                Are you sure you want to reset all configuration settings to their default values? 
                This action cannot be undone and will lose all current customizations.
              </p>
              
              <div className="flex items-center justify-end space-x-3">
                <Button 
                  variant="outline" 
                  onClick={() => setShowResetConfirm(false)}
                >
                  Cancel
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={handleResetConfirm}
                >
                  Reset All Settings
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ConfigurationActions;