import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import HistoricalDataTrends from './pages/historical-data-trends';
import ExperimentResultsAnalysis from './pages/experiment-results-analysis';
import ExperimentConfiguration from './pages/experiment-configuration';
import BatchURLTesting from './pages/batch-url-testing';
import DashboardHome from './pages/dashboard-home';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<BatchURLTesting />} />
        <Route path="/historical-data-trends" element={<HistoricalDataTrends />} />
        <Route path="/experiment-results-analysis" element={<ExperimentResultsAnalysis />} />
        <Route path="/experiment-configuration" element={<ExperimentConfiguration />} />
        <Route path="/batch-url-testing" element={<BatchURLTesting />} />
        <Route path="/dashboard-home" element={<DashboardHome />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
