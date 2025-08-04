import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import NotificationToast, { useToast } from '../../components/ui/NotificationToast';
import MetricsComparisonTable from './components/MetricsComparisonTable';
import PerformanceCharts from './components/PerformanceCharts';
import FilterSidebar from './components/FilterSidebar';
import ExperimentDetailModal from './components/ExperimentDetailModal';
import ActionBar from './components/ActionBar';
import ComparisonModal from './components/ComparisonModal';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const ExperimentResultsAnalysis = () => {
  const navigate = useNavigate();
  const { toasts, addToast, removeToast } = useToast();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedExperiments, setSelectedExperiments] = useState([]);
  const [selectedExperiment, setSelectedExperiment] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const [showFilterSidebar, setShowFilterSidebar] = useState(false);
  const [filters, setFilters] = useState({
    experimentTypes: [],
    metricCategories: [],
    performanceRange: '',
    sortBy: 'performanceScore',
    sortOrder: 'desc'
  });

  // Mock experiment data
  const mockExperiments = [
    {
      id: 'baseline-001',
      name: 'Baseline Audit',
      type: 'baseline',
      description: 'Standard Lighthouse audit with all resources loaded',
      url: 'https://example.com',
      timestamp: new Date(Date.now() - 3600000),
      metrics: {
        performanceScore: 72,
        fcp: '2.1',
        lcp: '3.4',
        cls: '0.15',
        fid: '89',
        loadTime: '4.2',
        accessibility: 95,
        bestPractices: 88,
        seo: 92,
        pwa: 30
      },
      details: {
        criticalIssues: [
          'Render-blocking resources delay page load',
          'Large images not optimized for web',
          'Unused JavaScript increases bundle size'
        ],
        recommendations: [
          'Eliminate render-blocking resources',
          'Optimize images and use modern formats',
          'Remove unused JavaScript',
          'Implement lazy loading for images',
          'Minify CSS and JavaScript files'
        ],
        resourceCount: 47,
        blockedResources: 0,
        sizeReduction: '0 KB'
      }
    },
    {
      id: 'no-js-002',
      name: 'JavaScript Disabled',
      type: 'no-js',
      description: 'Audit with JavaScript completely disabled',
      url: 'https://example.com',
      timestamp: new Date(Date.now() - 3000000),
      metrics: {
        performanceScore: 89,
        fcp: '1.2',
        lcp: '1.8',
        cls: '0.02',
        fid: '0',
        loadTime: '2.1',
        accessibility: 97,
        bestPractices: 92,
        seo: 95,
        pwa: 15
      },
      details: {
        criticalIssues: [
          'Interactive elements not functional',
          'Dynamic content not loading'
        ],
        recommendations: [
          'Implement progressive enhancement',
          'Ensure core functionality works without JS',
          'Add proper fallbacks for dynamic content'
        ],
        resourceCount: 23,
        blockedResources: 24,
        sizeReduction: '1.2 MB'
      }
    },
    {
      id: 'third-party-003',
      name: 'Third-party Blocked',
      type: 'third-party-blocked',
      description: 'Audit with third-party scripts blocked (GTM, GA, Facebook)',
      url: 'https://example.com',
      timestamp: new Date(Date.now() - 2400000),
      metrics: {
        performanceScore: 85,
        fcp: '1.6',
        lcp: '2.3',
        cls: '0.08',
        fid: '45',
        loadTime: '2.8',
        accessibility: 95,
        bestPractices: 90,
        seo: 92,
        pwa: 25
      },
      details: {
        criticalIssues: [
          'Analytics tracking not functional',
          'Social media widgets missing'
        ],
        recommendations: [
          'Optimize third-party script loading',
          'Use async/defer for non-critical scripts',
          'Consider self-hosting analytics'
        ],
        resourceCount: 31,
        blockedResources: 16,
        sizeReduction: '850 KB'
      }
    },
    {
      id: 'render-blocking-004',
      name: 'Render-blocking Removed',
      type: 'render-blocking-removed',
      description: 'Audit with render-blocking resources eliminated',
      url: 'https://example.com',
      timestamp: new Date(Date.now() - 1800000),
      metrics: {
        performanceScore: 91,
        fcp: '1.1',
        lcp: '2.1',
        cls: '0.12',
        fid: '67',
        loadTime: '2.5',
        accessibility: 95,
        bestPractices: 88,
        seo: 92,
        pwa: 30
      },
      details: {
        criticalIssues: [
          'Some styling may load after content',
          'Font loading optimization needed'
        ],
        recommendations: [
          'Inline critical CSS',
          'Preload important fonts',
          'Use font-display: swap'
        ],
        resourceCount: 39,
        blockedResources: 8,
        sizeReduction: '320 KB'
      }
    },
    {
      id: 'unused-resources-005',
      name: 'Unused Resources Blocked',
      type: 'unused-resources-blocked',
      description: 'Audit with unused/low-coverage resources blocked',
      url: 'https://example.com',
      timestamp: new Date(Date.now() - 1200000),
      metrics: {
        performanceScore: 88,
        fcp: '1.4',
        lcp: '2.2',
        cls: '0.09',
        fid: '52',
        loadTime: '2.6',
        accessibility: 95,
        bestPractices: 88,
        seo: 92,
        pwa: 30
      },
      details: {
        criticalIssues: [
          'Some features may not work properly',
          'Reduced functionality in certain areas'
        ],
        recommendations: [
          'Code splitting for better resource utilization',
          'Tree shaking to remove unused code',
          'Lazy load non-critical components'
        ],
        resourceCount: 28,
        blockedResources: 19,
        sizeReduction: '1.1 MB'
      }
    },
    {
      id: 'first-party-006',
      name: 'First-party Only',
      type: 'first-party-only',
      description: 'Audit with only first-party and used resources',
      url: 'https://example.com',
      timestamp: new Date(Date.now() - 600000),
      metrics: {
        performanceScore: 94,
        fcp: '0.9',
        lcp: '1.7',
        cls: '0.05',
        fid: '38',
        loadTime: '2.0',
        accessibility: 95,
        bestPractices: 88,
        seo: 92,
        pwa: 30
      },
      details: {
        criticalIssues: [
          'Limited third-party integrations',
          'Reduced tracking capabilities'
        ],
        recommendations: [
          'Selective third-party integration',
          'Implement first-party analytics',
          'Optimize remaining resources'
        ],
        resourceCount: 18,
        blockedResources: 29,
        sizeReduction: '1.8 MB'
      }
    }
  ];

  const [experiments] = useState(mockExperiments);
  const [filteredExperiments, setFilteredExperiments] = useState(mockExperiments);

  const tabs = [
    { key: 'overview', label: 'Overview', icon: 'BarChart3' },
    { key: 'detailed', label: 'Detailed Analysis', icon: 'Search' }
  ];

  useEffect(() => {
    // Apply filters to experiments
    let filtered = [...experiments];

    if (filters?.experimentTypes?.length > 0) {
      filtered = filtered?.filter(exp => filters?.experimentTypes?.includes(exp?.type));
    }

    if (filters?.performanceRange) {
      filtered = filtered?.filter(exp => {
        const score = exp?.metrics?.performanceScore;
        switch (filters?.performanceRange) {
          case 'excellent':
            return score >= 90;
          case 'good':
            return score >= 50 && score < 90;
          case 'poor':
            return score < 50;
          default:
            return true;
        }
      });
    }

    // Sort experiments
    if (filters?.sortBy) {
      filtered?.sort((a, b) => {
        let aValue = a?.metrics?.[filters?.sortBy];
        let bValue = b?.metrics?.[filters?.sortBy];

        if (typeof aValue === 'string') {
          aValue = parseFloat(aValue) || 0;
        }
        if (typeof bValue === 'string') {
          bValue = parseFloat(bValue) || 0;
        }

        if (filters?.sortOrder === 'asc') {
          return aValue - bValue;
        }
        return bValue - aValue;
      });
    }

    setFilteredExperiments(filtered);
  }, [filters, experiments]);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleExperimentSelect = (experiment) => {
    setSelectedExperiment(experiment);
    setShowDetailModal(true);
  };

  const handleCompareExperiment = (experiment) => {
    setSelectedExperiments([experiment]);
    setShowComparisonModal(true);
    setShowDetailModal(false);
  };

  const handleExportReport = async (format, selectedExps) => {
    addToast({
      type: 'info',
      title: 'Export Started',
      message: `Generating ${format?.toUpperCase()} report for ${selectedExps?.length || experiments?.length} experiments...`
    });

    // Simulate export process
    setTimeout(() => {
      addToast({
        type: 'success',
        title: 'Export Complete',
        message: `Report exported successfully as ${format?.toUpperCase()}`
      });
    }, 2000);
  };

  const handleShareResults = () => {
    addToast({
      type: 'info',
      title: 'Share Link Generated',
      message: 'Results link copied to clipboard'
    });
  };

  const handleRunNewExperiment = () => {
    navigate('/dashboard-home');
  };

  const handleBulkActions = (action, selectedExps) => {
    switch (action) {
      case 'compare':
        setSelectedExperiments(selectedExps);
        setShowComparisonModal(true);
        break;
      case 'delete':
        addToast({
          type: 'warning',
          title: 'Delete Confirmation',
          message: `Are you sure you want to delete ${selectedExps?.length} experiments?`
        });
        break;
      default:
        break;
    }
  };

  const customBreadcrumbs = [
    { label: 'Home', path: '/dashboard-home', icon: 'Home' },
    { label: 'Results Analysis', path: '/experiment-results-analysis', icon: 'BarChart3' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header onNavigate={handleNavigation} />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Breadcrumb 
            customBreadcrumbs={customBreadcrumbs}
            onNavigate={handleNavigation}
          />

          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Experiment Results Analysis
              </h1>
              <p className="text-muted-foreground">
                Compare and analyze Lighthouse audit results across different experiment configurations
              </p>
            </div>
            
            <div className="mt-4 lg:mt-0">
              <Button
                variant="default"
                iconName="Play"
                iconPosition="left"
                onClick={handleRunNewExperiment}
              >
                Run New Experiment
              </Button>
            </div>
          </div>

          {/* Action Bar */}
          <ActionBar
            onExportReport={handleExportReport}
            onShareResults={handleShareResults}
            onRunNewExperiment={handleRunNewExperiment}
            onBulkActions={handleBulkActions}
            selectedExperiments={selectedExperiments}
            totalExperiments={filteredExperiments?.length}
          />

          {/* Tabs */}
          <div className="border-b border-border mb-6">
            <div className="flex overflow-x-auto">
              {tabs?.map((tab) => (
                <button
                  key={tab?.key}
                  onClick={() => setActiveTab(tab?.key)}
                  className={`
                    flex items-center space-x-2 px-4 py-3 text-sm font-medium whitespace-nowrap
                    border-b-2 transition-smooth
                    ${activeTab === tab?.key
                      ? 'border-accent text-accent' :'border-transparent text-muted-foreground hover:text-foreground'
                    }
                  `}
                >
                  <Icon name={tab?.icon} size={16} />
                  <span>{tab?.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filter Sidebar */}
            <FilterSidebar
              filters={filters}
              onFiltersChange={setFilters}
              isVisible={showFilterSidebar}
              onToggle={() => setShowFilterSidebar(!showFilterSidebar)}
              className="lg:col-span-1"
            />

            {/* Content Area */}
            <div className="lg:col-span-3 space-y-6">
              {activeTab === 'overview' && (
                <>
                  {/* Performance Charts */}
                  <PerformanceCharts experiments={filteredExperiments} />
                  
                  {/* Metrics Comparison Table */}
                  <MetricsComparisonTable
                    experiments={filteredExperiments}
                    onExperimentSelect={handleExperimentSelect}
                    selectedExperiments={selectedExperiments}
                  />
                </>
              )}

              {activeTab === 'detailed' && (
                <div className="bg-card rounded-lg border border-border p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    Detailed Analysis
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Select experiments from the table above to view detailed analysis and recommendations.
                  </p>
                  
                  {selectedExperiment ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium text-foreground mb-3">Critical Issues</h4>
                          <div className="space-y-2">
                            {selectedExperiment?.details?.criticalIssues?.map((issue, index) => (
                              <div key={index} className="flex items-start space-x-2">
                                <Icon name="AlertCircle" size={14} className="text-error mt-0.5" />
                                <span className="text-sm text-foreground">{issue}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-foreground mb-3">Recommendations</h4>
                          <div className="space-y-2">
                            {selectedExperiment?.details?.recommendations?.slice(0, 3)?.map((rec, index) => (
                              <div key={index} className="flex items-start space-x-2">
                                <Icon name="CheckCircle" size={14} className="text-success mt-0.5" />
                                <span className="text-sm text-foreground">{rec}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        No experiment selected for detailed analysis
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      {/* Modals */}
      {showDetailModal && selectedExperiment && (
        <ExperimentDetailModal
          experiment={selectedExperiment}
          onClose={() => setShowDetailModal(false)}
          onCompare={handleCompareExperiment}
        />
      )}
      {showComparisonModal && (
        <ComparisonModal
          experiments={experiments}
          selectedExperiments={selectedExperiments}
          onClose={() => setShowComparisonModal(false)}
        />
      )}
      {/* Notifications */}
      <NotificationToast
        toasts={toasts}
        onRemoveToast={removeToast}
      />
    </div>
  );
};

export default ExperimentResultsAnalysis;