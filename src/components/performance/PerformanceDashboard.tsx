import React from 'react';
import { AggregatedMetricsChart } from './AggregatedMetricsChart';
import { SessionDetailsChart } from './SessionDetailsChart';

interface PerformanceDashboardProps {
  className?: string;
}

export function PerformanceDashboard({ className }: PerformanceDashboardProps) {
  return (
    <div className={`space-y-8 ${className}`}>
      {/* Aggregated Metrics Chart */}
      <AggregatedMetricsChart />
      
      {/* Session Details Chart */}
      <SessionDetailsChart />
    </div>
  );
} 