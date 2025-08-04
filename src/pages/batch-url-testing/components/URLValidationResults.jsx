import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const URLValidationResults = ({ 
  validationResults, 
  onRemoveUrl, 
  onFixUrl, 
  onClearValidation 
}) => {
  if (!validationResults || validationResults?.length === 0) {
    return null;
  }

  const validUrls = validationResults?.filter(result => result?.isValid);
  const invalidUrls = validationResults?.filter(result => !result?.isValid);
  const duplicateUrls = validationResults?.filter(result => result?.isDuplicate);

  return (
    <div className="bg-card rounded-lg border border-border p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">URL Validation Results</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearValidation}
          iconName="X"
          iconSize={14}
        >
          Clear
        </Button>
      </div>
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-success/10 rounded-lg">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <Icon name="CheckCircle" size={16} className="text-success" />
            <span className="text-xl font-bold text-success">{validUrls?.length}</span>
          </div>
          <p className="text-xs text-muted-foreground">Valid URLs</p>
        </div>

        <div className="text-center p-3 bg-error/10 rounded-lg">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <Icon name="AlertCircle" size={16} className="text-error" />
            <span className="text-xl font-bold text-error">{invalidUrls?.length}</span>
          </div>
          <p className="text-xs text-muted-foreground">Invalid URLs</p>
        </div>

        <div className="text-center p-3 bg-warning/10 rounded-lg">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <Icon name="Copy" size={16} className="text-warning" />
            <span className="text-xl font-bold text-warning">{duplicateUrls?.length}</span>
          </div>
          <p className="text-xs text-muted-foreground">Duplicates</p>
        </div>
      </div>
      {/* Invalid URLs */}
      {invalidUrls?.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-foreground mb-3 flex items-center space-x-2">
            <Icon name="AlertCircle" size={16} className="text-error" />
            <span>Invalid URLs ({invalidUrls?.length})</span>
          </h4>
          <div className="space-y-2">
            {invalidUrls?.map((result, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-error/5 border border-error/20 rounded-md"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {result?.url}
                  </p>
                  <p className="text-xs text-error">
                    {result?.error || 'Invalid URL format'}
                  </p>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onFixUrl(result?.url)}
                    iconName="Edit"
                    iconSize={14}
                  >
                    Fix
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveUrl(result?.url)}
                    iconName="Trash2"
                    iconSize={14}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Duplicate URLs */}
      {duplicateUrls?.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-foreground mb-3 flex items-center space-x-2">
            <Icon name="Copy" size={16} className="text-warning" />
            <span>Duplicate URLs ({duplicateUrls?.length})</span>
          </h4>
          <div className="space-y-2">
            {duplicateUrls?.map((result, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-warning/5 border border-warning/20 rounded-md"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {result?.url}
                  </p>
                  <p className="text-xs text-warning">
                    Duplicate found - will be processed only once
                  </p>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveUrl(result?.url)}
                    iconName="Trash2"
                    iconSize={14}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Valid URLs Preview */}
      {validUrls?.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-foreground mb-3 flex items-center space-x-2">
            <Icon name="CheckCircle" size={16} className="text-success" />
            <span>Ready for Testing ({validUrls?.length})</span>
          </h4>
          <div className="max-h-40 overflow-y-auto space-y-1">
            {validUrls?.slice(0, 10)?.map((result, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 p-2 bg-success/5 rounded-md"
              >
                <Icon name="Globe" size={14} className="text-success" />
                <span className="text-sm text-foreground truncate">
                  {result?.url}
                </span>
              </div>
            ))}
            {validUrls?.length > 10 && (
              <div className="text-center p-2">
                <span className="text-xs text-muted-foreground">
                  +{validUrls?.length - 10} more URLs ready for testing
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default URLValidationResults;