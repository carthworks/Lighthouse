import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import ProgressIndicator from '../../components/ui/ProgressIndicator';
import NotificationToast, { useToast } from '../../components/ui/NotificationToast';
import URLInputSection from './components/URLInputSection';
import ConfigurationPanel from './components/ConfigurationPanel';
import BatchQueueTable from './components/BatchQueueTable';
import BatchProgressSummary from './components/BatchProgressSummary';
import URLValidationResults from './components/URLValidationResults';
import Button from '../../components/ui/Button';


const BatchURLTesting = () => {
  const navigate = useNavigate();
  const { toasts, addToast, removeToast } = useToast();

  // URL Management State
  const [urls, setUrls] = useState([]);
  const [validationResults, setValidationResults] = useState(null);

  // Configuration State
  const [selectedExperiments, setSelectedExperiments] = useState(['baseline', 'no-js']);
  const [executionMode, setExecutionMode] = useState('sequential');
  const [customSettings, setCustomSettings] = useState({
    device: 'desktop',
    throttling: '3g-fast',
    timeout: 30,
    maxConcurrent: 3,
    generateHtml: true,
    generateJson: false,
    emailNotifications: false
  });

  // Batch Processing State
  const [batchJobs, setBatchJobs] = useState([]);
  const [currentBatch, setCurrentBatch] = useState(null);
  const [batchStats, setBatchStats] = useState({
    total: 0,
    pending: 0,
    running: 0,
    completed: 0,
    failed: 0,
    cancelled: 0
  });

  // UI State
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock batch jobs data
  useEffect(() => {
    const mockJobs = [
      {
        id: 'batch-001',
        url: 'https://example.com',
        experiments: ['baseline', 'no-js', 'block-third-party'],
        status: 'completed',
        progress: 100,
        startedAt: '2025-01-04T16:30:00Z',
        completedAt: '2025-01-04T16:35:30Z',
        results: {
          baseline: { performance: 85, accessibility: 92, bestPractices: 88, seo: 95 },
          'no-js': { performance: 78, accessibility: 94, bestPractices: 85, seo: 97 },
          'block-third-party': { performance: 92, accessibility: 92, bestPractices: 91, seo: 95 }
        }
      },
      {
        id: 'batch-002',
        url: 'https://another-site.com',
        experiments: ['baseline', 'unused-resources'],
        status: 'running',
        progress: 65,
        startedAt: '2025-01-04T17:15:00Z',
        completedAt: null,
        results: null
      },
      {
        id: 'batch-003',
        url: 'https://failed-site.com',
        experiments: ['baseline'],
        status: 'failed',
        progress: 0,
        startedAt: '2025-01-04T17:20:00Z',
        completedAt: '2025-01-04T17:21:15Z',
        error: 'Connection timeout - site unreachable'
      },
      {
        id: 'batch-004',
        url: 'https://pending-site.com',
        experiments: ['baseline', 'first-party-only'],
        status: 'pending',
        progress: 0,
        startedAt: null,
        completedAt: null
      }
    ];

    setBatchJobs(mockJobs);

    // Calculate stats
    const stats = {
      total: mockJobs?.length,
      pending: mockJobs?.filter(job => job?.status === 'pending')?.length,
      running: mockJobs?.filter(job => job?.status === 'running')?.length,
      completed: mockJobs?.filter(job => job?.status === 'completed')?.length,
      failed: mockJobs?.filter(job => job?.status === 'failed')?.length,
      cancelled: mockJobs?.filter(job => job?.status === 'cancelled')?.length
    };
    setBatchStats(stats);

    // Set current batch if any running
    const runningJob = mockJobs?.find(job => job?.status === 'running');
    if (runningJob) {
      setCurrentBatch({
        status: 'running',
        estimatedTimeRemaining: '2m 30s',
        currentJob: {
          url: runningJob?.url,
          status: 'running',
          experiment: 'Block Third-party JS'
        }
      });
    }
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleUrlsChange = (newUrls) => {
    setUrls(newUrls);
    setValidationResults(null); // Clear validation when URLs change
  };

  const handleValidateUrls = () => {
    if (urls?.length === 0) {
      addToast({
        type: 'warning',
        title: 'No URLs to validate',
        message: 'Please add some URLs first'
      });
      return;
    }

    // Mock validation logic
    const results = urls?.map((url, index) => {
      const isValidUrl = /^https?:\/\/.+\..+/?.test(url);
      const isDuplicate = urls?.indexOf(url) !== index;
      
      return {
        url,
        isValid: isValidUrl && !isDuplicate,
        isDuplicate,
        error: !isValidUrl ? 'Invalid URL format' : isDuplicate ? 'Duplicate URL' : null
      };
    });

    setValidationResults(results);
    
    const validCount = results?.filter(r => r?.isValid)?.length;
    const invalidCount = results?.filter(r => !r?.isValid)?.length;
    
    addToast({
      type: validCount > 0 ? 'success' : 'error',
      title: 'URL Validation Complete',
      message: `${validCount} valid, ${invalidCount} invalid URLs found`
    });
  };

  const handleRemoveUrl = (urlToRemove) => {
    const newUrls = urls?.filter(url => url !== urlToRemove);
    setUrls(newUrls);
    
    if (validationResults) {
      const newResults = validationResults?.filter(result => result?.url !== urlToRemove);
      setValidationResults(newResults);
    }
  };

  const handleFixUrl = (urlToFix) => {
    // In a real app, this would open an edit dialog
    addToast({
      type: 'info',
      title: 'URL Editor',
      message: 'URL editing functionality would open here'
    });
  };

  const handleClearValidation = () => {
    setValidationResults(null);
  };

  const handleStartBatch = () => {
    if (urls?.length === 0) {
      addToast({
        type: 'warning',
        title: 'No URLs provided',
        message: 'Please add URLs to test'
      });
      return;
    }

    if (selectedExperiments?.length === 0) {
      addToast({
        type: 'warning',
        title: 'No experiments selected',
        message: 'Please select at least one experiment to run'
      });
      return;
    }

    setIsProcessing(true);
    
    // Mock batch start
    setTimeout(() => {
      const newJobs = urls?.map((url, index) => ({
        id: `batch-${Date.now()}-${index}`,
        url,
        experiments: selectedExperiments,
        status: 'pending',
        progress: 0,
        startedAt: null,
        completedAt: null
      }));

      setBatchJobs(prev => [...prev, ...newJobs]);
      setIsProcessing(false);
      
      addToast({
        type: 'success',
        title: 'Batch Started',
        message: `${urls?.length} URLs queued for testing`
      });
    }, 1000);
  };

  const handlePauseBatch = () => {
    addToast({
      type: 'info',
      title: 'Batch Paused',
      message: 'All running experiments have been paused'
    });
  };

  const handleRetryJob = (jobId) => {
    setBatchJobs(prev => 
      prev?.map(job => 
        job?.id === jobId 
          ? { ...job, status: 'pending', progress: 0, error: null }
          : job
      )
    );
    
    addToast({
      type: 'info',
      title: 'Job Queued',
      message: 'Job has been added back to the queue'
    });
  };

  const handleCancelJob = (jobId) => {
    setBatchJobs(prev => 
      prev?.map(job => 
        job?.id === jobId 
          ? { ...job, status: 'cancelled', progress: 0 }
          : job
      )
    );
    
    addToast({
      type: 'warning',
      title: 'Job Cancelled',
      message: 'Job has been cancelled'
    });
  };

  const handleViewResults = (jobId) => {
    navigate(`/experiment-results-analysis?jobId=${jobId}`);
  };

  const handleExportResults = () => {
    addToast({
      type: 'success',
      title: 'Export Started',
      message: 'Results are being prepared for download'
    });
  };

  const experimentState = {
    isRunning: isProcessing || batchStats?.running > 0,
    progress: currentBatch?.currentJob ? 75 : 0
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        experimentState={experimentState}
        onNavigate={handleNavigation}
      />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Breadcrumb onNavigate={handleNavigation} />
          
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Batch URL Testing
              </h1>
              <p className="text-muted-foreground">
                Efficiently analyze multiple websites with automated Lighthouse experiments
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={handlePauseBatch}
                disabled={batchStats?.running === 0}
                iconName="Pause"
                iconPosition="left"
              >
                Pause Queue
              </Button>
              <Button
                onClick={handleStartBatch}
                loading={isProcessing}
                disabled={urls?.length === 0 || selectedExperiments?.length === 0}
                iconName="Play"
                iconPosition="left"
              >
                Start Batch
              </Button>
            </div>
          </div>

          {/* Progress Summary */}
          <BatchProgressSummary 
            batchStats={batchStats}
            currentBatch={currentBatch}
          />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* URL Input Section */}
            <URLInputSection
              urls={urls}
              onUrlsChange={handleUrlsChange}
              onValidateUrls={handleValidateUrls}
            />

            {/* Configuration Panel */}
            <ConfigurationPanel
              selectedExperiments={selectedExperiments}
              onExperimentsChange={setSelectedExperiments}
              executionMode={executionMode}
              onExecutionModeChange={setExecutionMode}
              customSettings={customSettings}
              onCustomSettingsChange={setCustomSettings}
            />
          </div>

          {/* URL Validation Results */}
          <URLValidationResults
            validationResults={validationResults}
            onRemoveUrl={handleRemoveUrl}
            onFixUrl={handleFixUrl}
            onClearValidation={handleClearValidation}
          />

          {/* Batch Queue Table */}
          <BatchQueueTable
            batchJobs={batchJobs}
            onRetryJob={handleRetryJob}
            onCancelJob={handleCancelJob}
            onViewResults={handleViewResults}
            onExportResults={handleExportResults}
          />

          {/* Processing Indicator */}
          {isProcessing && (
            <ProgressIndicator
              progress={50}
              status="running"
              experimentName="Batch Processing"
              estimatedTime="2m 30s"
              className="mt-6"
            />
          )}
        </div>
      </main>
      <NotificationToast 
        toasts={toasts} 
        onRemoveToast={removeToast} 
      />
    </div>
  );
};

export default BatchURLTesting;