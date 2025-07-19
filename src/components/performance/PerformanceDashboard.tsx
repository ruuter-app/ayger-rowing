import React, { useEffect } from 'react';
import { AggregatedMetricsChart } from './AggregatedMetricsChart';
import { SessionDetailsChart } from './SessionDetailsChart';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';

interface PerformanceDashboardProps {
  className?: string;
}

// Simple test data
const debugData = [
  { name: 'A', value: 10 },
  { name: 'B', value: 20 },
  { name: 'C', value: 15 },
];

export function PerformanceDashboard({ className }: PerformanceDashboardProps) {
  useEffect(() => {
    console.log('PerformanceDashboard mounted');
    console.log('Debug data:', debugData);
    console.log('Recharts LineChart:', LineChart);
    console.log('ResponsiveContainer:', ResponsiveContainer);
  }, []);

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Debug Chart to test Recharts */}
      <div className="border p-4 rounded">
        <h3 className="text-lg font-semibold mb-4">Debug Chart (Recharts Test)</h3>
        <p className="text-sm text-gray-600 mb-2">Data: {JSON.stringify(debugData)}</p>
        <div className="h-40 bg-gray-50 border">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={debugData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Aggregated Metrics Chart */}
      <AggregatedMetricsChart />
      
      {/* Session Details Chart */}
      <SessionDetailsChart />
    </div>
  );
} 