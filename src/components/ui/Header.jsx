import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = ({ experimentState = null, userContext = null, onNavigate = () => {} }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    {
      label: 'Dashboard',
      path: '/dashboard-home',
      icon: 'LayoutDashboard',
      tooltip: 'Experiment initiation and monitoring hub'
    },
    {
      label: 'Batch Testing',
      path: '/batch-url-testing',
      icon: 'Globe',
      tooltip: 'Bulk URL analysis workspace'
    },
    {
      label: 'Results',
      path: '/experiment-results-analysis',
      icon: 'BarChart3',
      tooltip: 'Comprehensive analysis and insights'
    },
    {
      label: 'Configuration',
      path: '/experiment-configuration',
      icon: 'Settings',
      tooltip: 'Advanced experiment customization'
    }
  ];

  const isActive = (path) => location.pathname === path;

  const handleNavigation = (path) => {
    onNavigate(path);
    setIsMobileMenuOpen(false);
  };

  const toggleProfileDropdown = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-card border-b border-border z-1000">
        <div className="flex items-center justify-between h-16 px-6">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Zap" size={20} color="white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-semibold text-foreground">Lighthouse</h1>
                <p className="text-xs text-muted-foreground -mt-1">Experiments Runner</p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems?.map((item) => (
              <button
                key={item?.path}
                onClick={() => handleNavigation(item?.path)}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-smooth
                  ${isActive(item?.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }
                `}
                title={item?.tooltip}
              >
                <Icon name={item?.icon} size={16} />
                <span>{item?.label}</span>
              </button>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Progress Indicator */}
            {experimentState?.isRunning && (
              <div className="hidden sm:flex items-center space-x-2 px-3 py-1 bg-accent/10 rounded-md">
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                <span className="text-xs text-accent font-medium">
                  {experimentState?.progress}% Complete
                </span>
              </div>
            )}

            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                onClick={toggleProfileDropdown}
                className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted transition-smooth"
              >
                <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                  <Icon name="User" size={16} color="white" />
                </div>
                <Icon name="ChevronDown" size={16} className="text-muted-foreground" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-popover border border-border rounded-md shadow-elevated z-1010">
                  <div className="p-3 border-b border-border">
                    <p className="text-sm font-medium text-foreground">
                      {userContext?.name || 'Performance Engineer'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {userContext?.email || 'engineer@company.com'}
                    </p>
                  </div>
                  <div className="py-2">
                    <button className="w-full px-3 py-2 text-left text-sm text-foreground hover:bg-muted transition-smooth flex items-center space-x-2">
                      <Icon name="User" size={16} />
                      <span>Profile Settings</span>
                    </button>
                    <button className="w-full px-3 py-2 text-left text-sm text-foreground hover:bg-muted transition-smooth flex items-center space-x-2">
                      <Icon name="History" size={16} />
                      <span>Experiment History</span>
                    </button>
                    <button className="w-full px-3 py-2 text-left text-sm text-foreground hover:bg-muted transition-smooth flex items-center space-x-2">
                      <Icon name="Settings" size={16} />
                      <span>Preferences</span>
                    </button>
                    <div className="border-t border-border mt-2 pt-2">
                      <button className="w-full px-3 py-2 text-left text-sm text-destructive hover:bg-muted transition-smooth flex items-center space-x-2">
                        <Icon name="LogOut" size={16} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-md hover:bg-muted transition-smooth"
            >
              <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={20} />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        {experimentState?.isRunning && (
          <div className="h-1 bg-muted">
            <div 
              className="h-full bg-accent transition-organic"
              style={{ width: `${experimentState?.progress || 0}%` }}
            ></div>
          </div>
        )}
      </header>
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-1005 md:hidden">
          <div className="fixed right-0 top-0 h-full w-80 bg-card border-l border-border shadow-elevated">
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <Icon name="Zap" size={20} color="white" />
                  </div>
                  <div>
                    <h1 className="text-lg font-semibold text-foreground">Lighthouse</h1>
                    <p className="text-xs text-muted-foreground -mt-1">Experiments Runner</p>
                  </div>
                </div>
                <button
                  onClick={toggleMobileMenu}
                  className="p-2 rounded-md hover:bg-muted transition-smooth"
                >
                  <Icon name="X" size={20} />
                </button>
              </div>

              <nav className="space-y-2">
                {navigationItems?.map((item) => (
                  <button
                    key={item?.path}
                    onClick={() => handleNavigation(item?.path)}
                    className={`
                      w-full flex items-center space-x-3 px-4 py-3 rounded-md text-sm font-medium transition-smooth
                      ${isActive(item?.path)
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }
                    `}
                  >
                    <Icon name={item?.icon} size={20} />
                    <div className="text-left">
                      <div>{item?.label}</div>
                      <div className="text-xs opacity-75">{item?.tooltip}</div>
                    </div>
                  </button>
                ))}
              </nav>

              {experimentState?.isRunning && (
                <div className="mt-8 p-4 bg-accent/10 rounded-md">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-accent">Experiment Running</span>
                  </div>
                  <div className="text-xs text-muted-foreground mb-2">
                    {experimentState?.progress}% Complete
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-accent h-2 rounded-full transition-organic"
                      style={{ width: `${experimentState?.progress || 0}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Click outside to close dropdowns */}
      {(isProfileOpen || isMobileMenuOpen) && (
        <div 
          className="fixed inset-0 z-999" 
          onClick={() => {
            setIsProfileOpen(false);
            setIsMobileMenuOpen(false);
          }}
        ></div>
      )}
    </>
  );
};

export default Header;