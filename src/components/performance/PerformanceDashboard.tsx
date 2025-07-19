import React, { useEffect } from 'react';
import { AggregatedMetricsChart } from './AggregatedMetricsChart';
import { SessionDetailsChart } from './SessionDetailsChart';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { ChartWrapper } from './ChartWrapper';
import { NativeChart } from './NativeChart';
import { NativeAggregatedChart } from './NativeAggregatedChart';

interface PerformanceDashboardProps {
  className?: string;
}

// Simple test data
const debugData = [
  { name: 'A', value: 10 },
  { name: 'B', value: 20 },
  { name: 'C', value: 15 },
];

// Native chart test data
const nativeTestData = [
  { x: 'A', y: 10 },
  { x: 'B', y: 20 },
  { x: 'C', y: 15 },
  { x: 'D', y: 25 },
  { x: 'E', y: 18 },
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
      {/* Native Chart Test */}
      <div className="space-y-4">
        <NativeChart 
          data={nativeTestData}
          width={600}
          height={300}
          type="line"
          color="#2563eb"
          title="Native SVG Line Chart Test"
          xLabel="Categories"
          yLabel="Values"
        />
        
        <NativeChart 
          data={nativeTestData}
          width={600}
          height={300}
          type="bar"
          color="#059669"
          title="Native SVG Bar Chart Test"
          xLabel="Categories"
          yLabel="Values"
        />
      </div>

      {/* Recharts Debug Chart */}
      <div className="border p-4 rounded">
        <h3 className="text-lg font-semibold mb-4">Debug Chart (Recharts Test)</h3>
        <p className="text-sm text-gray-600 mb-2">Data: {JSON.stringify(debugData)}</p>
        <div className="h-40 bg-gray-50 border">
          <ChartWrapper width="100%" height="100%">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={debugData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </ChartWrapper>
        </div>
      </div>
             
       {/* Native Aggregated Metrics Chart */}
       <NativeAggregatedChart />
       
       {/* Recharts Aggregated Metrics Chart */}
       <AggregatedMetricsChart />
       
       {/* Session Details Chart */}
       <SessionDetailsChart />
    </div>
  );
} 