import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import URLInputPanel from './components/URLInputPanel';
import ExperimentProgressTracker from './components/ExperimentProgressTracker';
import QuickStatsCards from './components/QuickStatsCards';
import RecentActivityFeed from './components/RecentActivityFeed';
import ExperimentQueueManager from './components/ExperimentQueueManager';
import NotificationToast, { useToast } from '../../components/ui/NotificationToast';

const DashboardHome = () => {
  const navigate = useNavigate();
  const { toasts, addToast, removeToast } = useToast();
  
  // Experiment state management
  const [experiments, setExperiments] = useState([]);
  const [isExperimentRunning, setIsExperimentRunning] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');
  const [experimentQueue, setExperimentQueue] = useState([]);
  const [isQueuePaused, setIsQueuePaused] = useState(false);

  // Mock stats data
  const [stats] = useState({
    totalExperiments: 247,
    experimentsChange: '+12%',
    avgImprovement: 23,
    improvementChange: '+5.2%',
    successRate: 94,
    successChange: '+2.1%'
  });

  // Mock recent activities
  const [recentActivities] = useState([]);

  // Experiment state for header
  const [experimentState, setExperimentState] = useState({
    isRunning: false,
    progress: 0
  });

  // User context for header
  const userContext = {
    name: 'Performance Engineer',
    email: 'engineer@company.com'
  };

  // Navigation handler
  const handleNavigation = (path) => {
    navigate(path);
  };

  // Start experiment suite
  const handleStartExperiment = (url) => {
    setCurrentUrl(url);
    setIsExperimentRunning(true);
    setExperimentState({
      isRunning: true,
      progress: 0
    });

    // Initialize experiments
    const experimentTypes = [
      'baseline',
      'js-disabled', 
      'third-party-blocked',
      'render-blocking-eliminated',
      'unused-resources-blocked',
      'first-party-only'
    ];

    const initialExperiments = experimentTypes?.map(type => ({
      id: type,
      status: 'pending',
      progress: 0,
      estimatedTime: null
    }));

    setExperiments(initialExperiments);

    // Add to queue
    const queueItem = {
      id: Date.now(),
      url: url,
      status: 'running',
      progress: 0,
      estimatedTime: '15-20 min'
    };

    setExperimentQueue(prev => [queueItem, ...prev]);

    // Show success toast
    addToast({
      type: 'success',
      title: 'Experiment Suite Started',
      message: `Running 6 experiments on ${url}`,
      duration: 4000
    });

    // Simulate experiment progress
    simulateExperimentProgress(initialExperiments, queueItem?.id);
  };

  // Simulate experiment progress
  const simulateExperimentProgress = (initialExperiments, queueId) => {
    let currentExperimentIndex = 0;
    let overallProgress = 0;

    const progressInterval = setInterval(() => {
      if (currentExperimentIndex < initialExperiments?.length) {
        const currentExperiment = initialExperiments?.[currentExperimentIndex];
        
        setExperiments(prev => prev?.map(exp => {
          if (exp?.id === currentExperiment?.id) {
            const newProgress = Math.min(exp?.progress + Math.random() * 15 + 5, 100);
            
            if (newProgress >= 100) {
              currentExperimentIndex++;
              return { ...exp, status: 'completed', progress: 100, estimatedTime: null };
            }
            
            return { 
              ...exp, 
              status: 'running', 
              progress: newProgress,
              estimatedTime: `${Math.max(1, Math.floor((100 - newProgress) / 10))} min`
            };
          }
          return exp;
        }));

        // Update overall progress
        overallProgress = ((currentExperimentIndex * 100) + (initialExperiments?.[currentExperimentIndex]?.progress || 0)) / initialExperiments?.length;
        
        setExperimentState(prev => ({
          ...prev,
          progress: overallProgress
        }));

        // Update queue item
        setExperimentQueue(prev => prev?.map(item => 
          item?.id === queueId 
            ? { ...item, progress: overallProgress }
            : item
        ));
      } else {
        // All experiments completed
        clearInterval(progressInterval);
        setIsExperimentRunning(false);
        setExperimentState({
          isRunning: false,
          progress: 100
        });

        // Remove from queue
        setExperimentQueue(prev => prev?.filter(item => item?.id !== queueId));

        // Show completion toast
        addToast({
          type: 'success',
          title: 'All Experiments Completed',
          message: `Analysis of ${currentUrl} finished successfully`,
          duration: 6000,
          action: {
            label: 'View Results',
            onClick: () => navigate('/experiment-results-analysis')
          }
        });
      }
    }, 1000);
  };

  // Cancel experiment
  const handleCancelExperiment = (queueId) => {
    setExperimentQueue(prev => prev?.filter(item => item?.id !== queueId));
    
    if (isExperimentRunning) {
      setIsExperimentRunning(false);
      setExperimentState({
        isRunning: false,
        progress: 0
      });
      
      setExperiments(prev => prev?.map(exp => ({
        ...exp,
        status: 'pending',
        progress: 0,
        estimatedTime: null
      })));

      addToast({
        type: 'warning',
        title: 'Experiment Cancelled',
        message: 'The running experiment has been cancelled',
        duration: 3000
      });
    }
  };

  // Clear queue
  const handleClearQueue = () => {
    setExperimentQueue([]);
    setIsExperimentRunning(false);
    setExperimentState({
      isRunning: false,
      progress: 0
    });
    
    setExperiments([]);

    addToast({
      type: 'info',
      title: 'Queue Cleared',
      message: 'All experiments have been removed from the queue',
      duration: 3000
    });
  };

  // Pause/Resume queue
  const handlePauseQueue = () => {
    setIsQueuePaused(!isQueuePaused);
    
    addToast({
      type: 'info',
      title: isQueuePaused ? 'Queue Resumed' : 'Queue Paused',
      message: isQueuePaused ? 'Experiments will continue processing' : 'New experiments will be queued',
      duration: 3000
    });
  };

  // View all activities
  const handleViewAllActivities = () => {
    navigate('/historical-data-trends');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        experimentState={experimentState}
        userContext={userContext}
        onNavigate={handleNavigation}
      />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Breadcrumb onNavigate={handleNavigation} />
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Performance Dashboard</h1>
            <p className="text-muted-foreground">
              Comprehensive Lighthouse audit experiments for web performance optimization analysis
            </p>
          </div>

          {/* URL Input Panel - Full Width */}
          <div className="mb-8">
            <URLInputPanel 
              onStartExperiment={handleStartExperiment}
              isExperimentRunning={isExperimentRunning}
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Section - Experiment Progress (8 cols on desktop) */}
            <div className="lg:col-span-8 space-y-6">
              <ExperimentProgressTracker 
                experiments={experiments}
                isRunning={isExperimentRunning}
              />
              
              {experimentQueue?.length > 0 && (
                <ExperimentQueueManager
                  queue={experimentQueue}
                  onCancelExperiment={handleCancelExperiment}
                  onClearQueue={handleClearQueue}
                  onPauseQueue={handlePauseQueue}
                  isPaused={isQueuePaused}
                />
              )}
            </div>

            {/* Right Section - Stats & Activity (4 cols on desktop) */}
            <div className="lg:col-span-4 space-y-6">
              <QuickStatsCards stats={stats} />
              <RecentActivityFeed 
                activities={recentActivities}
                onViewAll={handleViewAllActivities}
              />
            </div>
          </div>

          {/* Mobile Responsive Adjustments */}
          <div className="block sm:hidden mt-6">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground">
                For the best experience, use a desktop or tablet device when running experiments
              </p>
            </div>
          </div>
        </div>
      </main>
      <NotificationToast 
        toasts={toasts}
        onRemoveToast={removeToast}
      />
    </div>
  );
};

export default DashboardHome;