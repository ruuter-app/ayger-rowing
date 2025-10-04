import React, { useState, useEffect } from 'react';
import { DualAxisChartJS } from './DualAxisChartJS';
import { SessionDetailsChartJS } from './SessionDetailsChartJS';
import { SummaryCards } from './SummaryCards';
import { trainingDataService } from '../../lib/trainingDataService';

interface PerformanceDashboardProps {
  className?: string;
}

interface SummaryStats {
  totalSessions: number;
  totalDistance: number;
  totalDuration: number;
  longestSession: number;
  avgPace: number;
  avgHeartRate: number;
}

export function PerformanceDashboard({ className }: PerformanceDashboardProps) {
  const [stats, setStats] = useState<SummaryStats>({
    totalSessions: 0,
    totalDistance: 0,
    totalDuration: 0,
    longestSession: 0,
    avgPace: 0,
    avgHeartRate: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // Load training data using the service
      await trainingDataService.loadTrainingData();
      const sessionStats = trainingDataService.getSessionStats();
      setStats(sessionStats);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };


  return (
    <div className={`space-y-8 ${className}`}>
      {/* Summary Cards */}
      <SummaryCards stats={stats} />
      
      {/* Aggregated Metrics Chart */}
      <DualAxisChartJS />
      
      {/* Session Details Chart */}
      <SessionDetailsChartJS />
    </div>
  );
} 