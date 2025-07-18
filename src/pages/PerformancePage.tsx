import React, { useEffect } from 'react';
import { SidebarProvider } from '../components/ui/sidebar';
import { AthleteSidebar } from '../components/athlete/AthleteSidebar';
import { PerformanceDashboard } from '../components/performance/PerformanceDashboard';
import { useAuth } from '../components/auth/AuthContext';
import { useNavigate } from 'react-router-dom';

export function PerformancePage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) return null;
  if (!user) return null;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AthleteSidebar />
        <main className="flex-1 overflow-auto">
          {/* Top Bar */}
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