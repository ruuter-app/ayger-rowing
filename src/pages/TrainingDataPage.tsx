import React from 'react';
import { SidebarProvider } from '../components/ui/sidebar';
import { AthleteSidebar } from '../components/athlete/AthleteSidebar';
import { TrainingDashboard } from '../components/training/TrainingDashboard';
import { ThemeToggle } from '../components/theme/ThemeToggle';

export function TrainingDataPage() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AthleteSidebar />
        <main className="flex-1 overflow-auto">
          {/* Top Bar with Theme Toggle */}
          <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-ayger-navy">Training Data Analysis</h1>
                  <p className="text-muted-foreground">
                    Real training session data and performance analytics
                  </p>
                </div>
                <ThemeToggle />
              </div>
            </div>
          </div>
          
          <div className="container mx-auto px-6 py-8">
            <TrainingDashboard />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
} 