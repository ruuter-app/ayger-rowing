import React from 'react';
import { DualAxisChartJS } from './DualAxisChartJS';
import { SessionDetailsChartJS } from './SessionDetailsChartJS';

interface PerformanceDashboardProps {
  className?: string;
}

export function PerformanceDashboard({ className }: PerformanceDashboardProps) {
  return (
    <div className={`space-y-8 ${className}`}>
      {/* Aggregated Metrics Chart */}
      <DualAxisChartJS />
      
      {/* Session Details Chart */}
      <SessionDetailsChartJS />
    </div>
  );
} 