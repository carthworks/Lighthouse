import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ExperimentTemplatesGrid = ({ templates, onTemplateSelect, onTemplateDelete, onTemplateEdit, isExpanded, onToggle }) => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const handleTemplateClick = (template) => {
    setSelectedTemplate(template);
    onTemplateSelect(template);
  };

  const getExperimentTypeIcon = (type) => {
    const iconMap = {
      'baseline': 'Activity',
      'no-js': 'Code',
      'block-third-party': 'Shield',
      'block-render-blocking': 'Zap',
      'block-unused': 'Trash2',
      'first-party-only': 'Filter'
    };
    return iconMap?.[type] || 'Circle';
  };

  const getExperimentTypeName = (type) => {
    const nameMap = {
      'baseline': 'Baseline Audit',
      'no-js': 'No JavaScript',
      'block-third-party': 'Block Third-party',
      'block-render-blocking': 'Block Render-blocking',
      'block-unused': 'Block Unused Resources',
      'first-party-only': 'First-party Only'
    };
    return nameMap?.[type] || type;
  };

  return (
    <div className="bg-card rounded-lg border border-border">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-muted/50 transition-smooth"
      >
        <div className="flex items-center space-x-3">
          <Icon name="BookOpen" size={20} className="text-primary" />
          <div>
            <h3 className="text-lg font-semibold text-foreground">Experiment Templates</h3>
            <p className="text-sm text-muted-foreground">Manage saved configuration templates</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-sm text-muted-foreground">{templates?.length} templates</span>
          <Icon 
            name={isExpanded ? "ChevronUp" : "ChevronDown"} 
            size={20} 
            className="text-muted-foreground" 
          />
        </div>
      </button>
      {isExpanded && (
        <div className="px-6 pb-6 border-t border-border">
          <div className="flex items-center justify-between mt-6 mb-4">
            <h4 className="text-sm font-medium text-foreground">Saved Templates</h4>
            <Button variant="outline" iconName="Plus" iconPosition="left" size="sm">
              Create Template
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates?.map((template) => (
              <div
                key={template?.id}
                className={`
                  border rounded-lg p-4 cursor-pointer transition-smooth hover:shadow-soft
                  ${selectedTemplate?.id === template?.id 
                    ? 'border-primary bg-primary/5' :'border-border bg-card hover:border-primary/50'
                  }
                `}
                onClick={() => handleTemplateClick(template)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon name="FileText" size={16} className="text-primary" />
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-foreground">{template?.name}</h5>
                      <p className="text-xs text-muted-foreground">
                        Created {template?.createdAt}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={(e) => {
                        e?.stopPropagation();
                        onTemplateEdit(template);
                      }}
                      className="p-1 rounded hover:bg-muted transition-smooth"
                    >
                      <Icon name="Edit2" size={14} className="text-muted-foreground" />
                    </button>
                    <button
                      onClick={(e) => {
                        e?.stopPropagation();
                        onTemplateDelete(template?.id);
                      }}
                      className="p-1 rounded hover:bg-error/10 transition-smooth"
                    >
                      <Icon name="Trash2" size={14} className="text-error" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                  {template?.description}
                </p>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Experiments:</span>
                    <span className="text-foreground font-medium">
                      {template?.experiments?.length} types
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {template?.experiments?.slice(0, 3)?.map((expType) => (
                      <div
                        key={expType}
                        className="flex items-center space-x-1 px-2 py-1 bg-muted rounded text-xs"
                      >
                        <Icon 
                          name={getExperimentTypeIcon(expType)} 
                          size={10} 
                          className="text-muted-foreground" 
                        />
                        <span className="text-muted-foreground">
                          {getExperimentTypeName(expType)}
                        </span>
                      </div>
                    ))}
                    {template?.experiments?.length > 3 && (
                      <div className="px-2 py-1 bg-muted rounded text-xs text-muted-foreground">
                        +{template?.experiments?.length - 3} more
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <Icon name="Clock" size={12} />
                    <span>~{template?.estimatedDuration}min</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {template?.isDefault && (
                      <div className="px-2 py-1 bg-success/10 rounded text-xs text-success">
                        Default
                      </div>
                    )}
                    {template?.isShared && (
                      <Icon name="Users" size={12} className="text-accent" />
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Empty State */}
            {templates?.length === 0 && (
              <div className="col-span-full text-center py-12">
                <Icon name="FileText" size={48} className="text-muted-foreground mx-auto mb-4" />
                <h4 className="text-lg font-medium text-foreground mb-2">No Templates Found</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Create your first experiment template to get started
                </p>
                <Button variant="outline" iconName="Plus" iconPosition="left">
                  Create Template
                </Button>
              </div>
            )}
          </div>

          {selectedTemplate && (
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h5 className="text-sm font-medium text-foreground">Template Preview</h5>
                <Button variant="outline" size="sm">
                  Apply Template
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-muted-foreground">Device:</span>
                  <span className="ml-2 text-foreground">{selectedTemplate?.settings?.deviceType}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Network:</span>
                  <span className="ml-2 text-foreground">{selectedTemplate?.settings?.networkThrottling}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Timeout:</span>
                  <span className="ml-2 text-foreground">{selectedTemplate?.settings?.pageTimeout}s</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Cache:</span>
                  <span className="ml-2 text-foreground">
                    {selectedTemplate?.settings?.clearCache ? 'Clear' : 'Keep'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ExperimentTemplatesGrid;