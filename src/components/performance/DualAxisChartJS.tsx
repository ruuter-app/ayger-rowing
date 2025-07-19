import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
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
}

const METRICS = [
  { key: 'sessionCount', label: 'Session Count', type: 'bar', color: 'rgb(37, 99, 235)' },
  { key: 'totalDistance', label: 'Total Distance (m)', type: 'bar', color: 'rgb(5, 150, 105)' },
  { key: 'avgStrokeRate', label: 'Avg Stroke Rate', type: 'line', color: 'rgb(220, 38, 38)' },
  { key: 'avgHeartRate', label: 'Avg Heart Rate', type: 'line', color: 'rgb(245, 158, 11)' },
];

export function DualAxisChartJS() {
  const [data, setData] = useState<AggregatedData[]>([]);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['sessionCount', 'avgStrokeRate']);
  const [period, setPeriod] = useState<'week' | 'month'>('week');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [period]);

  const loadData = async () => {
    setLoading(true);
    try {
      const basePath = import.meta.env.BASE_URL || '/';
      const csvPath = `${basePath}takatomo-training-data/training_logs.csv`.replace('//', '/');
      const response = await fetch(csvPath);
      const csvText = await response.text();
      const aggregatedData = processCSVData(csvText, period);
      setData(aggregatedData);
    } catch (error) {
      console.error('Error loading data:', error);
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
          heartRates: []
        };
      }

      sessions[sessionKey].distances.push(distance);
      sessions[sessionKey].strokeRates.push(strokeRate);
      sessions[sessionKey].heartRates.push(heartRate);
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

      return {
        period: periodKey,
        sessionCount: sessionGroup.length,
        totalDistance: Math.round(totalDistance),
        avgStrokeRate: allStrokeRates.length > 0 ? 
          Math.round((allStrokeRates.reduce((a, b) => a + b, 0) / allStrokeRates.length) * 10) / 10 : 0,
        avgHeartRate: allHeartRates.length > 0 ? 
          Math.round(allHeartRates.reduce((a, b) => a + b, 0) / allHeartRates.length) : 0,
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
      if (selectedMetrics.length > 1) {
        setSelectedMetrics(prev => prev.filter(m => m !== metricKey));
      }
    } else if (selectedMetrics.length < 2) {
      setSelectedMetrics(prev => [...prev, metricKey]);
    }
  };

  const getMetric = (key: string) => METRICS.find(m => m.key === key);

  // Test data for debugging
  const testData = [
    { period: '2024-01', sessionCount: 5, totalDistance: 1500, avgStrokeRate: 22, avgHeartRate: 140 },
    { period: '2024-02', sessionCount: 8, totalDistance: 2200, avgStrokeRate: 24, avgHeartRate: 145 },
    { period: '2024-03', sessionCount: 6, totalDistance: 1800, avgStrokeRate: 23, avgHeartRate: 142 },
    { period: '2024-04', sessionCount: 10, totalDistance: 2800, avgStrokeRate: 25, avgHeartRate: 148 },
    { period: '2024-05', sessionCount: 7, totalDistance: 2100, avgStrokeRate: 24, avgHeartRate: 144 },
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

  // Prepare datasets for Chart.js with dual axes
  const datasets = selectedMetrics.map((metricKey, index) => {
    const metric = getMetric(metricKey);
    if (!metric) return null;

    return {
      label: metric.label,
      data: chartData.map(item => item[metricKey as keyof AggregatedData] as number),
      borderColor: metric.color,
      backgroundColor: metric.type === 'bar' ? metric.color + '80' : metric.color + '20',
      borderWidth: 2,
      tension: 0.1,
      type: metric.type,
      yAxisID: index === 0 ? 'y' : 'y1', // First metric on left axis, second on right
    };
  }).filter(Boolean);

  const chartConfig = {
    labels: chartData.map(item => item.period),
    datasets,
  };

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
      },
      title: {
        display: true,
                 text: 'Aggregated Training Metrics',
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        beginAtZero: true,
        title: {
          display: true,
          text: leftMetric?.label || '',
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
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
        },
        grid: {
          drawOnChartArea: false,
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
            <span className="text-sm text-muted-foreground">Metrics (select exactly 2):</span>
            {METRICS.map(metric => (
              <Button
                key={metric.key}
                variant={selectedMetrics.includes(metric.key) ? "default" : "outline"}
                size="sm"
                onClick={() => handleMetricToggle(metric.key)}
                disabled={!selectedMetrics.includes(metric.key) && selectedMetrics.length >= 2}
              >
                {metric.label}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
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