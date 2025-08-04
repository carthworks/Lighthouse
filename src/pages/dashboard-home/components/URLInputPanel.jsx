import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const URLInputPanel = ({ onStartExperiment, isExperimentRunning }) => {
  const [url, setUrl] = useState('');
  const [urlError, setUrlError] = useState('');

  const validateURL = (inputUrl) => {
    if (!inputUrl?.trim()) {
      return 'URL is required';
    }
    
    try {
      const urlObj = new URL(inputUrl.startsWith('http') ? inputUrl : `https://${inputUrl}`);
      if (!['http:', 'https:']?.includes(urlObj?.protocol)) {
        return 'URL must use HTTP or HTTPS protocol';
      }
      return '';
    } catch {
      return 'Please enter a valid URL';
    }
  };

  const handleURLChange = (e) => {
    const newUrl = e?.target?.value;
    setUrl(newUrl);
    
    if (newUrl?.trim()) {
      const error = validateURL(newUrl);
      setUrlError(error);
    } else {
      setUrlError('');
    }
  };

  const handleStartExperiment = () => {
    const error = validateURL(url);
    if (error) {
      setUrlError(error);
      return;
    }
    
    const normalizedUrl = url?.startsWith('http') ? url : `https://${url}`;
    onStartExperiment(normalizedUrl);
  };

  const handleKeyPress = (e) => {
    if (e?.key === 'Enter' && !urlError && url?.trim() && !isExperimentRunning) {
      handleStartExperiment();
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-soft">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon name="Globe" size={20} className="text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Start Performance Analysis</h2>
          <p className="text-sm text-muted-foreground">Enter a URL to run comprehensive Lighthouse experiments</p>
        </div>
      </div>
      <div className="space-y-4">
        <Input
          label="Target URL"
          type="url"
          placeholder="https://example.com or example.com"
          value={url}
          onChange={handleURLChange}
          onKeyPress={handleKeyPress}
          error={urlError}
          description="Enter the website URL you want to analyze for performance optimization opportunities"
          disabled={isExperimentRunning}
          className="text-base"
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="Info" size={16} />
            <span>6 experiments will run automatically: Baseline, JS-disabled, Third-party blocked, Render-blocking eliminated, Unused resources blocked, First-party only</span>
          </div>
          
          <Button
            variant="default"
            size="lg"
            onClick={handleStartExperiment}
            disabled={!url?.trim() || !!urlError || isExperimentRunning}
            loading={isExperimentRunning}
            iconName="Play"
            iconPosition="left"
            className="min-w-48"
          >
            {isExperimentRunning ? 'Running Experiments...' : 'Start Experiment Suite'}
          </Button>
        </div>

        {url?.trim() && !urlError && (
          <div className="bg-success/10 border border-success/20 rounded-md p-3">
            <div className="flex items-center space-x-2">
              <Icon name="CheckCircle" size={16} className="text-success" />
              <span className="text-sm text-success font-medium">URL validated successfully</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default URLInputPanel;