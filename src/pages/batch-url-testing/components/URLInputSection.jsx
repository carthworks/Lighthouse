import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const URLInputSection = ({ urls, onUrlsChange, onValidateUrls }) => {
  const [urlText, setUrlText] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  const handleTextareaChange = (e) => {
    const text = e?.target?.value;
    setUrlText(text);
    
    // Parse URLs from textarea
    const urlList = text?.split('\n')?.map(url => url?.trim())?.filter(url => url?.length > 0);
    
    onUrlsChange(urlList);
  };

  const handleFileUpload = (file) => {
    if (!file) return;
    
    if (file?.type !== 'text/csv' && !file?.name?.endsWith('.csv')) {
      setUploadError('Please upload a CSV file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csv = e?.target?.result;
        const lines = csv?.split('\n');
        const urlList = // Take first column
        lines?.map(line => line?.trim()?.split(',')?.[0])?.filter(url => url && url?.length > 0);
        
        setUrlText(urlList?.join('\n'));
        onUrlsChange(urlList);
        setUploadError('');
      } catch (error) {
        setUploadError('Error reading CSV file');
      }
    };
    reader?.readAsText(file);
  };

  const handleDragOver = (e) => {
    e?.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e?.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    setIsDragOver(false);
    const files = e?.dataTransfer?.files;
    if (files?.length > 0) {
      handleFileUpload(files?.[0]);
    }
  };

  const handleFileSelect = (e) => {
    const file = e?.target?.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const clearUrls = () => {
    setUrlText('');
    onUrlsChange([]);
    setUploadError('');
  };

  const validateUrls = () => {
    onValidateUrls();
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">URL Input</h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">
            {urls?.length} URLs
          </span>
          {urls?.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearUrls}
              iconName="X"
              iconSize={14}
            >
              Clear
            </Button>
          )}
        </div>
      </div>
      {/* Manual URL Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-foreground mb-2">
          Enter URLs (one per line)
        </label>
        <textarea
          value={urlText}
          onChange={handleTextareaChange}
          placeholder={`https://example.com\nhttps://another-site.com\nhttps://third-site.com`}
          className="w-full h-40 px-3 py-2 border border-border rounded-md bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
        />
      </div>
      {/* CSV Upload */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-foreground mb-2">
          Or upload CSV file
        </label>
        <div
          className={`
            border-2 border-dashed rounded-lg p-6 text-center transition-colors
            ${isDragOver 
              ? 'border-accent bg-accent/5' :'border-border hover:border-accent/50'
            }
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Icon name="Upload" size={32} className="text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground mb-2">
            Drag and drop your CSV file here, or click to browse
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef?.current?.click()}
            iconName="FileText"
            iconPosition="left"
          >
            Choose File
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
        {uploadError && (
          <p className="text-sm text-error mt-2 flex items-center space-x-1">
            <Icon name="AlertCircle" size={14} />
            <span>{uploadError}</span>
          </p>
        )}
      </div>
      {/* URL Validation */}
      {urls?.length > 0 && (
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center space-x-2">
            <Icon name="Globe" size={16} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Ready to validate {urls?.length} URLs
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={validateUrls}
            iconName="CheckCircle"
            iconPosition="left"
          >
            Validate URLs
          </Button>
        </div>
      )}
    </div>
  );
};

export default URLInputSection;