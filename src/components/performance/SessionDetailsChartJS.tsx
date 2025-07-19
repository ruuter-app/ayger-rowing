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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

// Register all required controllers and elements
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

interface SessionData {
  timeMinutes: number;
  distance: number;
  strokeRate: number;
  heartRate: number;
}

interface Session {
  filename: string;
  startTime: number;
  data: SessionData[];
}

const METRICS = [
  { key: 'distance', label: 'Distance (m)', type: 'bar', color: 'rgb(5, 150, 105)' },
  { key: 'strokeRate', label: 'Stroke Rate', type: 'line', color: 'rgb(220, 38, 38)' },
  { key: 'heartRate', label: 'Heart Rate', type: 'line', color: 'rgb(245, 158, 11)' },
];

export function SessionDetailsChartJS() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['distance', 'strokeRate']);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    setLoading(true);
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
      const parsedSessions = parseSessionsFromCSV(csvText);
      
      setSessions(parsedSessions);
      if (parsedSessions.length > 0) {
        setSelectedSession(parsedSessions[0]); // Select the first session by default
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const parseSessionsFromCSV = (csvText: string): Session[] => {
    const lines = csvText.trim().split('\n');
    if (lines.length <= 1) return [];

    const sessionsMap: Record<string, any> = {};

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
      if (!sessionsMap[sessionKey]) {
        sessionsMap[sessionKey] = {
          filename,
          startTime,
          dataPoints: []
        };
      }

      sessionsMap[sessionKey].dataPoints.push({
        delta,
        distance,
        strokeRate,
        heartRate
      });
    }

    // Convert to sessions with processed data
    return Object.values(sessionsMap).map((session: any) => {
      // Sort data points by delta (time)
      session.dataPoints.sort((a: any, b: any) => a.delta - b.delta);

      // Convert to chart data format
      const data: SessionData[] = session.dataPoints.map((point: any, index: number) => ({
        timeMinutes: Math.round(point.delta / 60000), // Convert milliseconds to minutes
        distance: point.distance,
        strokeRate: point.strokeRate,
        heartRate: point.heartRate
      }));

      return {
        filename: session.filename,
        startTime: session.startTime,
        data
      };
    }).filter(session => session.data.length > 0)
      .sort((a, b) => b.startTime - a.startTime); // Sort by newest first
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

  const formatSessionDate = (startTime: number) => {
    return new Date(startTime * 1000).toLocaleDateString();
  };

  // Test data for debugging
  const testSession = {
    filename: 'test-session',
    startTime: Date.now() / 1000,
    data: [
      { timeMinutes: 0, distance: 0, strokeRate: 20, heartRate: 120 },
      { timeMinutes: 1, distance: 100, strokeRate: 22, heartRate: 130 },
      { timeMinutes: 2, distance: 220, strokeRate: 24, heartRate: 140 },
      { timeMinutes: 3, distance: 350, strokeRate: 23, heartRate: 135 },
      { timeMinutes: 4, distance: 480, strokeRate: 25, heartRate: 145 },
      { timeMinutes: 5, distance: 620, strokeRate: 24, heartRate: 142 },
    ]
  };

  const displaySession = selectedSession || testSession;

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="text-muted-foreground">Loading session details...</div>
        </CardContent>
      </Card>
    );
  }

  if (sessions.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="text-muted-foreground">No session data available</div>
        </CardContent>
      </Card>
    );
  }

  // Prepare datasets for Chart.js with dual axes
  const datasets = selectedMetrics.map((metricKey, index) => {
    const metric = getMetric(metricKey);
    if (!metric) return null;

    const baseConfig = {
      label: metric.label,
      data: displaySession.data.map(item => item[metricKey as keyof SessionData] as number),
      borderColor: metric.color,
      backgroundColor: metric.type === 'bar' ? metric.color + '80' : metric.color + '20',
      borderWidth: 2,
      yAxisID: index === 0 ? 'y' : 'y1', // First metric on left axis, second on right
    };

    // Add type-specific configurations
    if (metric.type === 'line') {
      return {
        ...baseConfig,
        type: 'line',
        tension: 0.1,
        fill: false,
      };
    } else {
      return {
        ...baseConfig,
        type: 'bar',
      };
    }
  }).filter(Boolean);

  const chartConfig = {
    labels: displaySession.data.map(item => item.timeMinutes),
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
        text: `Session: ${displaySession.filename}`,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Time (minutes)',
        },
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
        <CardTitle>Session Details</CardTitle>
        
        {/* Controls */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex gap-2 items-center">
            <span className="text-sm text-muted-foreground">Session:</span>
            <Select 
              value={selectedSession?.filename || ''} 
              onValueChange={(filename) => {
                const session = sessions.find(s => s.filename === filename);
                setSelectedSession(session || null);
              }}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select a session" />
              </SelectTrigger>
              <SelectContent>
                {sessions.map(session => (
                  <SelectItem key={session.filename} value={session.filename}>
                    {session.filename} ({formatSessionDate(session.startTime)})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex gap-2 items-center">
            <span className="text-sm text-muted-foreground">Metrics (select 2):</span>
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
        {displaySession.data.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No data available for this session
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