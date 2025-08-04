import React from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const Breadcrumb = ({ customBreadcrumbs = null, onNavigate = () => {} }) => {
  const location = useLocation();

  const routeMap = {
    '/dashboard-home': { label: 'Dashboard', icon: 'LayoutDashboard' },
    '/experiment-results-analysis': { label: 'Results Analysis', icon: 'BarChart3' },
    '/batch-url-testing': { label: 'Batch Testing', icon: 'Globe' },
    '/historical-data-trends': { label: 'Historical Trends', icon: 'TrendingUp' },
    '/experiment-configuration': { label: 'Configuration', icon: 'Settings' }
  };

  const generateBreadcrumbs = () => {
    if (customBreadcrumbs) {
      return customBreadcrumbs;
    }

    const pathSegments = location.pathname?.split('/')?.filter(Boolean);
    const breadcrumbs = [{ label: 'Home', path: '/dashboard-home', icon: 'Home' }];

    let currentPath = '';
    pathSegments?.forEach((segment) => {
      currentPath += `/${segment}`;
      const route = routeMap?.[currentPath];
      if (route && currentPath !== '/dashboard-home') {
        breadcrumbs?.push({
          label: route?.label,
          path: currentPath,
          icon: route?.icon
        });
      }
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs?.length <= 1) {
    return null;
  }

  const handleBreadcrumbClick = (path) => {
    onNavigate(path);
  };

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {breadcrumbs?.map((crumb, index) => (
          <li key={crumb?.path} className="flex items-center space-x-2">
            {index > 0 && (
              <Icon name="ChevronRight" size={14} className="text-border" />
            )}
            {index === breadcrumbs?.length - 1 ? (
              <span className="flex items-center space-x-1 text-foreground font-medium">
                <Icon name={crumb?.icon} size={14} />
                <span>{crumb?.label}</span>
              </span>
            ) : (
              <button
                onClick={() => handleBreadcrumbClick(crumb?.path)}
                className="flex items-center space-x-1 hover:text-foreground transition-smooth"
              >
                <Icon name={crumb?.icon} size={14} />
                <span>{crumb?.label}</span>
              </button>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;