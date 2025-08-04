import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import { LogOut, AlertTriangle, Clock } from 'lucide-react';

const LogoutConfirmation = () => {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState(null);
  const [hasUnsavedWork, setHasUnsavedWork] = useState(false);

  // Check for unsaved work or running experiments
  useEffect(() => {
    // Simulate checking for unsaved work
    const checkUnsavedWork = () => {
      // In a real app, this would check localStorage, context, or API
      const hasUnsaved = localStorage.getItem('unsavedExperiments') === 'true';
      setHasUnsavedWork(hasUnsaved);
    };

    checkUnsavedWork();
  }, []);

  // Check if logout was triggered by session timeout
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const timeout = urlParams?.get('timeout');
    if (timeout === 'true') {
      setSessionTimeout(true);
    }
  }, []);

  const handleConfirmLogout = async () => {
    setLoading(true);
    try {
      // Clear any unsaved work flags
      localStorage.removeItem('unsavedExperiments');
      localStorage.removeItem('experimentQueue');
      
      // Sign out from Supabase
      const { error } = await signOut();
      
      if (error) {
        console.error('Logout error:', error);
        // Even if there's an error, we should still redirect to login
      }
      
      // Redirect to login page
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      // Force redirect even on error
      navigate('/login', { replace: true });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-card p-8 rounded-lg shadow-elevated border border-border">
          {/* Icon */}
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-warning/10 mb-6">
            {sessionTimeout ? (
              <Clock className="h-6 w-6 text-warning" />
            ) : (
              <LogOut className="h-6 w-6 text-warning" />
            )}
          </div>

          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-foreground mb-2">
              {sessionTimeout ? 'Session Expired' : 'Confirm Logout'}
            </h2>
            <p className="text-sm text-muted-foreground">
              {sessionTimeout 
                ? 'Your session has expired for security reasons. Please sign in again to continue.'
                : 'Are you sure you want to sign out of your account?'
              }
            </p>
          </div>

          {/* User Info */}
          {user && (
            <div className="bg-muted/50 rounded-lg p-4 mb-6">
              <p className="text-sm text-muted-foreground">Signing out as:</p>
              <p className="font-medium text-foreground">{user?.email}</p>
            </div>
          )}

          {/* Warnings */}
          {hasUnsavedWork && !sessionTimeout && (
            <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-warning mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-warning mb-1">
                    Unsaved Changes Detected
                  </h3>
                  <p className="text-xs text-warning/80">
                    You have unsaved experiment configurations or results that will be lost.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Information */}
          <div className="bg-muted/30 rounded-lg p-4 mb-6">
            <h4 className="text-sm font-medium text-foreground mb-2">
              What happens when you sign out:
            </h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• All running experiments will be paused</li>
              <li>• Unsaved configurations will be lost</li>
              <li>• You'll need to sign in again to access your data</li>
              <li>• Active sessions on other devices will remain logged in</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="destructive"
              onClick={handleConfirmLogout}
              loading={loading}
              disabled={loading}
              fullWidth
              iconName="log-out"
              iconPosition="left"
            >
              {loading ? 'Signing out...' : (sessionTimeout ? 'Sign In Again' : 'Confirm Logout')}
            </Button>
            
            {!sessionTimeout && (
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={loading}
                fullWidth
              >
                Cancel
              </Button>
            )}
          </div>

          {/* Additional Options */}
          {!sessionTimeout && (
            <div className="mt-6 text-center">
              <p className="text-xs text-muted-foreground">
                Want to logout from all devices?{' '}
                <button className="text-primary hover:text-primary/80 underline">
                  Sign out everywhere
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmation;