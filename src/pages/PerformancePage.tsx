import React, { useEffect } from 'react';
import { SidebarProvider } from '../components/ui/sidebar';
import { AthleteSidebar } from '../components/athlete/AthleteSidebar';
import { PerformanceDashboard } from '../components/performance/PerformanceDashboard';
import { useAuth } from '../components/auth/AuthContext';
import { useNavigate } from 'react-router-dom';

export function PerformancePage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  console.log('PerformancePage: Rendering, user:', user, 'loading:', loading);

  useEffect(() => {
    console.log('PerformancePage: useEffect triggered, user:', user, 'loading:', loading);
    if (!loading && !user) {
      console.log('PerformancePage: Redirecting to login');
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    console.log('PerformancePage: Loading state, returning loading div');
    return <div>Loading...</div>;
  }
  if (!user) {
    console.log('PerformancePage: No user, returning no user div');
    return <div>No user found</div>;
  }

  console.log('PerformancePage: Rendering main content');
  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AthleteSidebar />
        <main className="flex-1 overflow-auto">
          <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-ayger-navy">Performance Analysis</h1>
                  <p className="text-muted-foreground">
                    AI-powered insights and personalized training recommendations
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="container mx-auto px-6 py-8">
            <PerformanceDashboard />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
} 