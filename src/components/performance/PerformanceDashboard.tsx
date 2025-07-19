import React, { useState, useEffect } from 'react';
import { DualAxisChartJS } from './DualAxisChartJS';
import { SessionDetailsChartJS } from './SessionDetailsChartJS';
import { SummaryCards } from './SummaryCards';

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
      const basePath = import.meta.env.BASE_URL || '/';
      let csvPath = `${basePath}takatomo-training-data/training_logs.csv`;
      csvPath = csvPath.replace(/\/+/g, '/');
      
      const response = await fetch(csvPath);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const csvText = await response.text();
      const calculatedStats = calculateStatsFromCSV(csvText);
      setStats(calculatedStats);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const calculateStatsFromCSV = (csvText: string): SummaryStats => {
    const lines = csvText.trim().split('\n');
    if (lines.length <= 1) {
      return {
        totalSessions: 0,
        totalDistance: 0,
        totalDuration: 0,
        longestSession: 0,
        avgPace: 0,
        avgHeartRate: 0,
      };
    }

    const sessions: Record<string, any> = {};

    // Parse CSV data and group by session
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const row = line.split(',');
      if (row.length < 5) continue;

      const filename = row[0];
      const startTime = parseInt(row[1]);
      const delta = parseInt(row[2]) || 0;
      const distance = parseFloat(row[3]) || 0;
      const strokeRate = parseFloat(row[4]) || 0;
      const heartRate = parseFloat(row[5]) || 0;

      if (isNaN(startTime) || startTime <= 0) continue;

      const sessionKey = `${filename}_${startTime}`;
      if (!sessions[sessionKey]) {
        sessions[sessionKey] = {
          filename,
          startTime,
          maxDistance: 0,
          duration: 0,
          heartRates: [],
          strokeRates: [],
        };
      }

      sessions[sessionKey].maxDistance = Math.max(sessions[sessionKey].maxDistance, distance);
      sessions[sessionKey].duration = Math.max(sessions[sessionKey].duration, delta);
      if (heartRate > 0) sessions[sessionKey].heartRates.push(heartRate);
      if (strokeRate > 0) sessions[sessionKey].strokeRates.push(strokeRate);
    }

    const sessionList = Object.values(sessions);
    const totalSessions = sessionList.length;
    const totalDistance = sessionList.reduce((sum, s) => sum + s.maxDistance, 0);
    const totalDuration = sessionList.reduce((sum, s) => sum + s.duration, 0) / 60000; // Convert to minutes
    const longestSession = Math.max(...sessionList.map(s => s.duration / 60000));
    
    const allHeartRates = sessionList.flatMap(s => s.heartRates);
    const avgHeartRate = allHeartRates.length > 0 
      ? allHeartRates.reduce((sum, hr) => sum + hr, 0) / allHeartRates.length 
      : 0;

    // Calculate average pace (simplified - using total distance and time)
    const avgPace = totalDistance > 0 && totalDuration > 0 
      ? (totalDuration * 60 / totalDistance) * 500 // Convert to seconds per 500m
      : 0;

    return {
      totalSessions,
      totalDistance: Math.round(totalDistance),
      totalDuration: Math.round(totalDuration),
      longestSession: Math.round(longestSession),
      avgPace: Math.round(avgPace),
      avgHeartRate: Math.round(avgHeartRate),
    };
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