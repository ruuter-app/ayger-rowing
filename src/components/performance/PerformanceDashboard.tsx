import React from 'react';
import { SessionHistory, AggregatedTrendsDashboard } from '../athlete/SessionHistory';

interface PerformanceDashboardProps {
  className?: string;
}

export function PerformanceDashboard({ className }: PerformanceDashboardProps) {
  return (
    <div className={className}>
      {/* Aggregated trends over time - shown first */}
      <AggregatedTrendsDashboard />
      
      {/* Session History with clickable details - shown second */}
      <SessionHistory />
    </div>
  );
} 