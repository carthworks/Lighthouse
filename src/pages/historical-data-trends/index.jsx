import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import NotificationToast, { useToast } from '../../components/ui/NotificationToast';
import DateRangeSelector from './components/DateRangeSelector';
import FilterPanel from './components/FilterPanel';
import TrendSummaryCards from './components/TrendSummaryCards';
import PerformanceTrendChart from './components/PerformanceTrendChart';
import ExperimentFrequencyChart from './components/ExperimentFrequencyChart';
import CoreWebVitalsChart from './components/CoreWebVitalsChart';
import HistoricalDataTable from './components/HistoricalDataTable';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const HistoricalDataTrends = () => {
  const navigate = useNavigate();
  const { toasts, addToast, removeToast } = useToast();

  // State management
  const [selectedDateRange, setSelectedDateRange] = useState('30d');
  const [activeFilters, setActiveFilters] = useState({
    experimentTypes: ['baseline', 'no-js'],
    metrics: ['performance', 'fcp', 'lcp'],
    devices: ['desktop'],
    urlFilter: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState('charts'); // 'charts' or 'table'

  // Mock data for historical trends
  const mockHistoricalData = [
    {
      date: '2025-07-05',
      url: 'https://example.com',
      experimentType: 'baseline',
      device: 'desktop',
      performance: 85,
      fcp: 1200,
      lcp: 2100,
      cls: 0.08,
      fid: 95
    },
    {
      date: '2025-07-10',
      url: 'https://example.com',
      experimentType: 'no-js',
      device: 'desktop',
      performance: 92,
      fcp: 800,
      lcp: 1500,
      cls: 0.05,
      fid: 45
    },
    {
      date: '2025-07-15',
      url: 'https://shop.example.com',
      experimentType: 'no-third-party',
      device: 'mobile',
      performance: 78,
      fcp: 1800,
      lcp: 3200,
      cls: 0.12,
      fid: 150
    },
    {
      date: '2025-07-20',
      url: 'https://blog.example.com',
      experimentType: 'baseline',
      device: 'desktop',
      performance: 88,
      fcp: 1100,
      lcp: 1900,
      cls: 0.06,
      fid: 80
    },
    {
      date: '2025-07-25',
      url: 'https://example.com',
      experimentType: 'unused-resources',
      device: 'desktop',
      performance: 91,
      fcp: 950,
      lcp: 1700,
      cls: 0.04,
      fid: 65
    },
    {
      date: '2025-07-30',
      url: 'https://shop.example.com',
      experimentType: 'first-party-only',
      device: 'mobile',
      performance: 82,
      fcp: 1600,
      lcp: 2800,
      cls: 0.09,
      fid: 120
    },
    {
      date: '2025-08-01',
      url: 'https://blog.example.com',
      experimentType: 'no-render-blocking',
      device: 'desktop',
      performance: 89,
      fcp: 1050,
      lcp: 1800,
      cls: 0.07,
      fid: 75
    },
    {
      date: '2025-08-04',
      url: 'https://example.com',
      experimentType: 'baseline',
      device: 'desktop',
      performance: 87,
      fcp: 1150,
      lcp: 2000,
      cls: 0.08,
      fid: 85
    }
  ];

  // Mock frequency data for experiment types
  const mockFrequencyData = [
    {
      date: '2025-07-05',
      baseline: 3,
      'no-js': 2,
      'no-third-party': 1,
      'no-render-blocking': 2,
      'unused-resources': 1,
      'first-party-only': 1
    },
    {
      date: '2025-07-10',
      baseline: 4,
      'no-js': 3,
      'no-third-party': 2,
      'no-render-blocking': 1,
      'unused-resources': 2,
      'first-party-only': 1
    },
    {
      date: '2025-07-15',
      baseline: 2,
      'no-js': 1,
      'no-third-party': 3,
      'no-render-blocking': 2,
      'unused-resources': 1,
      'first-party-only': 2
    },
    {
      date: '2025-07-20',
      baseline: 5,
      'no-js': 2,
      'no-third-party': 1,
      'no-render-blocking': 3,
      'unused-resources': 2,
      'first-party-only': 1
    },
    {
      date: '2025-07-25',
      baseline: 3,
      'no-js': 4,
      'no-third-party': 2,
      'no-render-blocking': 1,
      'unused-resources': 3,
      'first-party-only': 2
    },
    {
      date: '2025-07-30',
      baseline: 4,
      'no-js': 2,
      'no-third-party': 1,
      'no-render-blocking': 2,
      'unused-resources': 1,
      'first-party-only': 3
    },
    {
      date: '2025-08-01',
      baseline: 2,
      'no-js': 3,
      'no-third-party': 2,
      'no-render-blocking': 4,
      'unused-resources': 2,
      'first-party-only': 1
    },
    {
      date: '2025-08-04',
      baseline: 3,
      'no-js': 1,
      'no-third-party': 1,
      'no-render-blocking': 2,
      'unused-resources': 1,
      'first-party-only': 2
    }
  ];

  // Mock summary data
  const mockSummaryData = {
    totalExperiments: 156,
    experimentsChange: 12,
    avgPerformance: 86,
    performanceChange: 3,
    uniqueUrls: 24,
    urlsChange: 8,
    avgLoadTime: 1850,
    loadTimeChange: -5
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleDateRangeChange = (range) => {
    setIsLoading(true);
    setSelectedDateRange(range?.type === 'predefined' ? range?.value : 'custom');
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      addToast({
        type: 'success',
        title: 'Data Updated',
        message: 'Historical data has been refreshed for the selected date range.'
      });
    }, 1000);
  };

  const handleFiltersChange = (newFilters) => {
    setActiveFilters(newFilters);
    addToast({
      type: 'info',
      title: 'Filters Applied',
      message: 'Chart data has been updated based on your filter selection.'
    });
  };

  const handleExportData = () => {
    addToast({
      type: 'success',
      title: 'Export Started',
      message: 'Your historical data export is being prepared. Download will start shortly.',
      action: {
        label: 'View Downloads',
        onClick: () => console.log('View downloads')
      }
    });
  };

  const handleCreateReport = () => {
    addToast({
      type: 'info',
      title: 'Report Generation',
      message: 'Custom report is being generated. You will be notified when ready.'
    });
  };

  const handleSetAlert = () => {
    addToast({
      type: 'success',
      title: 'Alert Created',
      message: 'Performance alert has been set up successfully.'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onNavigate={handleNavigation} />
      <NotificationToast toasts={toasts} onRemoveToast={removeToast} />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Breadcrumb onNavigate={handleNavigation} />
          
          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Historical Data & Trends
              </h1>
              <p className="text-muted-foreground">
                Comprehensive analytics and trending analysis of past Lighthouse experiments to track optimization progress over time.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mt-4 lg:mt-0">
              <Button
                variant="outline"
                onClick={handleCreateReport}
                iconName="FileText"
                iconSize={16}
              >
                Create Report
              </Button>
              <Button
                variant="outline"
                onClick={handleSetAlert}
                iconName="Bell"
                iconSize={16}
              >
                Set Alert
              </Button>
              <Button
                variant="default"
                onClick={handleExportData}
                iconName="Download"
                iconSize={16}
              >
                Export Data
              </Button>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2 bg-muted rounded-lg p-1">
              <Button
                variant={viewMode === 'charts' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('charts')}
                iconName="BarChart3"
                iconSize={14}
              >
                Charts
              </Button>
              <Button
                variant={viewMode === 'table' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('table')}
                iconName="Table"
                iconSize={14}
              >
                Table
              </Button>
            </div>
            
            {isLoading && (
              <div className="flex items-center space-x-2 text-muted-foreground">
                <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm">Loading data...</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Sidebar - Filters */}
            <div className="lg:col-span-3 space-y-6">
              <DateRangeSelector
                onDateRangeChange={handleDateRangeChange}
                selectedRange={selectedDateRange}
              />
              <FilterPanel
                onFiltersChange={handleFiltersChange}
                activeFilters={activeFilters}
              />
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-9">
              {viewMode === 'charts' ? (
                <div className="space-y-6">
                  {/* Summary Cards */}
                  <TrendSummaryCards summaryData={mockSummaryData} />

                  {/* Performance Trend Chart */}
                  <PerformanceTrendChart
                    data={mockHistoricalData}
                    selectedMetrics={activeFilters?.metrics}
                    title="Performance Score Trends"
                    height={350}
                  />

                  {/* Charts Grid */}
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <ExperimentFrequencyChart
                      data={mockFrequencyData}
                      height={300}
                    />
                    <CoreWebVitalsChart
                      data={mockHistoricalData}
                      height={300}
                    />
                  </div>

                  {/* Insights Panel */}
                  <div className="bg-card border border-border rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
                      <Icon name="Lightbulb" size={20} />
                      <span>Key Insights</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <Icon name="TrendingUp" size={16} className="text-success" />
                          <span className="text-sm font-medium text-success">Performance Improvement</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Average performance score increased by 3% over the selected period, with JavaScript-disabled experiments showing the highest gains.
                        </p>
                      </div>
                      <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <Icon name="AlertTriangle" size={16} className="text-warning" />
                          <span className="text-sm font-medium text-warning">Mobile Performance Gap</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Mobile performance scores are consistently 8-12 points lower than desktop, indicating optimization opportunities for mobile users.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <HistoricalDataTable
                  data={mockHistoricalData}
                  onExport={handleExportData}
                />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HistoricalDataTrends;