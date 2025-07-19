import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  BarController,
  LineController,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';

// Register all required controllers and elements
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  BarController,
  LineController,
  Title,
  Tooltip,
  Legend
);

interface AggregatedData {
  period: string;
  sessionCount: number;
  totalDistance: number;
  avgStrokeRate: number;
  avgHeartRate: number;
  avgPace: number; // Average pace per 500m in seconds
}

const METRICS = [
  { key: 'avgStrokeRate', label: 'Avg Stroke Rate (spm)', type: 'line', color: 'hsl(8, 85%, 65%)' }, // Ayger Coral
  { key: 'avgHeartRate', label: 'Avg Heart Rate (bpm)', type: 'line', color: 'hsl(40, 95%, 55%)' }, // Ayger Orange
  { key: 'avgPace', label: 'Avg Pace (/500m)', type: 'line', color: 'hsl(175, 80%, 40%)' }, // Ayger Teal
  { key: 'totalDistance', label: 'Total Distance (m)', type: 'bar', color: 'hsl(120, 70%, 45%)' }, // Green
  { key: 'sessionCount', label: 'Session Count', type: 'bar', color: 'hsl(280, 70%, 60%)' }, // Purple
];

export function DualAxisChartJS() {
  const [data, setData] = useState<AggregatedData[]>([]);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['totalDistance', 'sessionCount']);
  const [period, setPeriod] = useState<'week' | 'month'>('week');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [period]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Handle base path for GitHub Pages
      const basePath = import.meta.env.BASE_URL || '/';
      let csvPath = `${basePath}takatomo-training-data/training_logs.csv`;
      
      // Clean up the path to avoid double slashes
      csvPath = csvPath.replace(/\/+/g, '/');
      
      const response = await fetch(csvPath);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const csvText = await response.text();
      const aggregatedData = processCSVData(csvText, period);
      setData(aggregatedData);
    } catch (error) {
      console.error('Error loading data:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const processCSVData = (csvText: string, period: 'week' | 'month'): AggregatedData[] => {
    const lines = csvText.trim().split('\n');
    if (lines.length <= 1) return [];

    const sessions: Record<string, any[]> = {};

    // Parse CSV data
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
          startTime,
          distances: [],
          strokeRates: [],
          heartRates: [],
          paces: []
        };
      }

      sessions[sessionKey].distances.push(distance);
      sessions[sessionKey].strokeRates.push(strokeRate);
      sessions[sessionKey].heartRates.push(heartRate);
      
      // Calculate pace per 500m
      const timeSeconds = delta / 1000; // Convert milliseconds to seconds
      const pace = distance > 0 ? (timeSeconds / distance) * 500 : 0;
      sessions[sessionKey].paces.push(pace);
    }

    // Group by period
    const groups: Record<string, any[]> = {};
    Object.values(sessions).forEach((session: any) => {
      const date = new Date(session.startTime * 1000);
      const periodKey = getPeriodKey(date, period);
      
      if (!groups[periodKey]) groups[periodKey] = [];
      groups[periodKey].push(session);
    });

    // Aggregate data
    return Object.entries(groups).map(([periodKey, sessionGroup]) => {
      const totalDistance = sessionGroup.reduce((sum, s) => {
        const maxDistance = Math.max(...s.distances);
        return sum + (maxDistance > 0 ? maxDistance : 0);
      }, 0);

      const allStrokeRates = sessionGroup.flatMap(s => s.strokeRates.filter(sr => sr > 0));
      const allHeartRates = sessionGroup.flatMap(s => s.heartRates.filter(hr => hr > 0));
      const allPaces = sessionGroup.flatMap(s => s.paces.filter(p => p > 0));

      return {
        period: periodKey,
        sessionCount: sessionGroup.length,
        totalDistance: Math.round(totalDistance),
        avgStrokeRate: allStrokeRates.length > 0 ? 
          Math.round((allStrokeRates.reduce((a, b) => a + b, 0) / allStrokeRates.length) * 10) / 10 : 0,
        avgHeartRate: allHeartRates.length > 0 ? 
          Math.round(allHeartRates.reduce((a, b) => a + b, 0) / allHeartRates.length) : 0,
        avgPace: allPaces.length > 0 ? 
          Math.round((allPaces.reduce((a, b) => a + b, 0) / allPaces.length) * 10) / 10 : 0,
      };
    }).sort((a, b) => a.period.localeCompare(b.period));
  };

  const getPeriodKey = (date: Date, period: 'week' | 'month'): string => {
    if (period === 'week') {
      const year = date.getFullYear();
      const weekNumber = Math.ceil(((date.getTime() - new Date(year, 0, 1).getTime()) / 86400000 + 1) / 7);
      return `${year}-W${weekNumber.toString().padStart(2, '0')}`;
    } else {
      return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    }
  };

  const handleMetricToggle = (metricKey: string) => {
    if (selectedMetrics.includes(metricKey)) {
      setSelectedMetrics(prev => prev.filter(m => m !== metricKey));
    } else if (selectedMetrics.length < 2) { // Changed from 4 to 2
      setSelectedMetrics(prev => [...prev, metricKey]);
    }
  };

  const getMetric = (key: string) => METRICS.find(m => m.key === key);

  // Test data for debugging
  const testData = [
    { period: '2024-01', sessionCount: 5, totalDistance: 1500, avgStrokeRate: 22, avgHeartRate: 140, avgPace: 150 }, // 2:30
    { period: '2024-02', sessionCount: 8, totalDistance: 2200, avgStrokeRate: 24, avgHeartRate: 145, avgPace: 145 }, // 2:25
    { period: '2024-03', sessionCount: 6, totalDistance: 1800, avgStrokeRate: 23, avgHeartRate: 142, avgPace: 148 }, // 2:28
    { period: '2024-04', sessionCount: 10, totalDistance: 2800, avgStrokeRate: 25, avgHeartRate: 148, avgPace: 142 }, // 2:22
    { period: '2024-05', sessionCount: 7, totalDistance: 2100, avgStrokeRate: 24, avgHeartRate: 144, avgPace: 147 }, // 2:27
  ];

  // Use test data if no real data is available
  const chartData = data.length > 0 ? data : testData;

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="text-muted-foreground">Loading aggregated metrics...</div>
        </CardContent>
      </Card>
    );
  }

  // Prepare datasets for Chart.js - mixed line and bar charts
  const datasets: any[] = [];

  selectedMetrics.forEach((metricKey, index) => {
    const metric = getMetric(metricKey);
    if (!metric) return;

    // Determine chart type and axis assignment
    const isBarChart = metricKey === 'totalDistance' || metricKey === 'sessionCount';
    const chartType = isBarChart ? 'bar' : 'line';
    
    // Assign axes: first metric on left (y), second metric on right (y1)
    const yAxisID = index === 0 ? 'y' : 'y1';

    const dataset: any = {
      label: metric.label,
      data: chartData.map(item => item[metricKey as keyof AggregatedData] as number),
      borderColor: metric.color,
      backgroundColor: metric.color.replace(')', ', 0.2)').replace('hsl(', 'hsla('),
      borderWidth: 3,
      type: chartType,
      yAxisID: yAxisID,
    };

    // Add line-specific properties
    if (chartType === 'line') {
      dataset.tension = 0.2;
      dataset.fill = false;
      dataset.pointRadius = 0; // Remove point markers
      dataset.pointHoverRadius = 6; // Keep hover points for better UX
      dataset.pointHoverBorderWidth = 3;
    }

    // Add bar-specific properties
    if (chartType === 'bar') {
      dataset.borderRadius = 4;
      dataset.borderSkipped = false;
    }

    datasets.push(dataset);
  });

  const chartConfig = {
    labels: chartData.map(item => item.period),
    datasets,
  };

  // Get metrics for each axis
  const leftMetric = getMetric(selectedMetrics[0]);
  const rightMetric = getMetric(selectedMetrics[1]);

  const options = {
    responsive: true,
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            weight: '500',
          },
        },
      },
      title: {
        display: true,
        text: 'Aggregated Training Metrics',
        font: {
          size: 16,
          weight: '600',
        },
        color: 'hsl(215, 25%, 27%)', // Ayger Navy
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            
            // Format pace as MM:SS
            if (context.dataset.label?.includes('Pace')) {
              const minutes = Math.floor(value / 60);
              const seconds = Math.floor(value % 60);
              return `${label}: ${minutes}:${seconds.toString().padStart(2, '0')}`;
            }
            
            // Format distance with units
            if (context.dataset.label?.includes('Distance')) {
              return `${label}: ${value.toLocaleString()}m`;
            }
            
            // Format session count
            if (context.dataset.label?.includes('Session Count')) {
              return `${label}: ${value} sessions`;
            }
            
            return `${label}: ${value}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'hsla(215, 25%, 27%, 0.1)', // Ayger Navy with transparency
        },
        ticks: {
          color: 'hsl(215, 25%, 27%)', // Ayger Navy
        },
      },
      y: {
        type: 'linear' as const,
        display: selectedMetrics.length > 0,
        position: 'left' as const,
        beginAtZero: true,
        title: {
          display: true,
          text: leftMetric?.label || '',
          color: 'hsl(215, 25%, 27%)', // Ayger Navy
          font: {
            weight: '500',
          },
        },
        grid: {
          color: 'hsla(215, 25%, 27%, 0.1)', // Ayger Navy with transparency
        },
        ticks: {
          color: 'hsl(215, 25%, 27%)', // Ayger Navy
          callback: function(value: any) {
            // Format pace as MM:SS
            if (leftMetric?.key === 'avgPace') {
              const minutes = Math.floor(value / 60);
              const seconds = Math.floor(value % 60);
              return `${minutes}:${seconds.toString().padStart(2, '0')}`;
            }
            // Format distance with units
            if (leftMetric?.key === 'totalDistance') {
              return value.toLocaleString();
            }
            return value;
          }
        },
      },
      y1: {
        type: 'linear' as const,
        display: selectedMetrics.length > 1,
        position: 'right' as const,
        beginAtZero: true,
        title: {
          display: true,
          text: rightMetric?.label || '',
          color: 'hsl(215, 25%, 27%)', // Ayger Navy
          font: {
            weight: '500',
          },
        },
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          color: 'hsl(215, 25%, 27%)', // Ayger Navy
          callback: function(value: any) {
            // Format pace as MM:SS
            if (rightMetric?.key === 'avgPace') {
              const minutes = Math.floor(value / 60);
              const seconds = Math.floor(value % 60);
              return `${minutes}:${seconds.toString().padStart(2, '0')}`;
            }
            // Format distance with units
            if (rightMetric?.key === 'totalDistance') {
              return value.toLocaleString();
            }
            return value;
          }
        },
      },
    },
  };

  return (
    <Card>
      <CardHeader>
                 <CardTitle>Aggregated Metrics</CardTitle>
        
        {/* Controls */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex gap-2 items-center">
            <span className="text-sm text-muted-foreground">Period:</span>
            <select 
              value={period} 
              onChange={e => setPeriod(e.target.value as 'week' | 'month')}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value="week">Weekly</option>
              <option value="month">Monthly</option>
            </select>
          </div>
          
          <div className="flex gap-2 items-center">
            <span className="text-sm text-muted-foreground">Metrics (select up to 2):</span>
            {METRICS.map(metric => (
              <Button
                key={metric.key}
                variant={selectedMetrics.includes(metric.key) ? "default" : "outline"}
                size="sm"
                onClick={() => handleMetricToggle(metric.key)}
                disabled={!selectedMetrics.includes(metric.key) && selectedMetrics.length >= 2} // Changed from 4 to 2
              >
                {metric.label}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {error && (
          <div className="text-center py-8 text-red-500">
            Error loading data: {error}
          </div>
        )}
        {chartData.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No data available for the selected period
          </div>
        ) : (
          <div className="h-96">
            <Chart type="line" data={chartConfig} options={options} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}