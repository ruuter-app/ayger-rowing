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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { MapPin, Clock, Target, Heart } from 'lucide-react';
import { SessionMap } from './SessionMap';
import { trainingDataService } from '../../lib/trainingDataService';

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

interface SessionData {
  timeMinutes: number;
  distance: number;
  strokeRate: number;
  heartRate: number;
  pace: number; // Pace per 500m in seconds
}

interface Session {
  filename: string;
  startTime: number;
  data: SessionData[];
  rawData?: Array<{
    longitude: string;
    latitude: string;
    distance: number;
    heartrate: number;
    strokerate: number;
  }>;
}

const METRICS = [
  { key: 'strokeRate', label: 'Stroke Rate (spm)', type: 'line', color: 'hsl(8, 85%, 65%)' }, // Ayger Coral
  { key: 'heartRate', label: 'Heart Rate (bpm)', type: 'line', color: 'hsl(40, 95%, 55%)' }, // Ayger Orange
  { key: 'pace', label: 'Pace (/500m)', type: 'line', color: 'hsl(175, 80%, 40%)' }, // Ayger Teal
];

export function SessionDetailsChartJS() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['pace', 'strokeRate', 'heartRate']);
  const [loading, setLoading] = useState(true);
  const [xAxisType, setXAxisType] = useState<'time' | 'distance'>('time');

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    setLoading(true);
    try {
      // Load training data using the service
      const processedSessions = await trainingDataService.loadTrainingData();
      console.log('Loaded sessions:', processedSessions.length);

      // Convert processed sessions to the format expected by the chart
      const sessions = processedSessions.map(session => ({
        filename: session.fileName,
        startTime: new Date(session.date).getTime() / 1000,
        data: session.data.map(point => ({
          timeMinutes: Math.round(point.time / 60), // Convert seconds to minutes
          distance: point.distance,
          strokeRate: point.strokeRate,
          heartRate: point.heartRate,
          pace: point.pace
        })),
        rawData: session.rawData
      }));

      console.log('Converted sessions:', sessions.length);

      // Log GPS data for all sessions
      console.log('All sessions GPS data:');
      sessions.forEach((session, index) => {
        const hasGPS = session.rawData?.some(point => point.longitude && point.latitude);
        console.log(`Session ${index + 1}:`, {
          filename: session.filename,
          rawDataLength: session.rawData?.length,
          hasGPS,
          sampleGPS: hasGPS ? {
            longitude: session.rawData?.[0]?.longitude,
            latitude: session.rawData?.[0]?.latitude
          } : null
        });
      });

      setSessions(sessions);
      if (sessions.length > 0) {
        setSelectedSession(sessions[0]); // Select the first session by default
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setLoading(false);
    }
  };


  const handleMetricToggle = (metricKey: string) => {
    if (selectedMetrics.includes(metricKey)) {
      if (selectedMetrics.length > 1) {
        setSelectedMetrics(prev => prev.filter(m => m !== metricKey));
      }
    } else if (selectedMetrics.length < 3) {
      setSelectedMetrics(prev => [...prev, metricKey]);
    }
  };

  const getMetric = (key: string) => METRICS.find(m => m.key === key);

  const formatSessionDate = (startTime: number) => {
    return new Date(startTime * 1000).toLocaleDateString();
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatDistance = (meters: number) => {
    return meters >= 1000 ? `${(meters / 1000).toFixed(1)}km` : `${Math.round(meters)}m`;
  };

  const formatPace = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
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

  // Prepare datasets for Chart.js - all line charts
  const datasets: any[] = [];

  selectedMetrics.forEach((metricKey) => {
    const metric = getMetric(metricKey);
    if (!metric) return;

    // Determine which axis to use based on the image layout
    const isPace = metricKey === 'pace';
    const yAxisID = isPace ? 'y' : 'y1'; // Pace on left, others on right

    datasets.push({
      label: metric.label,
      data: displaySession.data.map(item => item[metricKey as keyof SessionData] as number),
      borderColor: metric.color,
      backgroundColor: metric.color.replace(')', ', 0.2)').replace('hsl(', 'hsla('),
      borderWidth: 3,
      type: 'line',
      tension: 0.2,
      fill: false,
      pointRadius: 0, // Remove point markers
      pointHoverRadius: 6, // Keep hover points for better UX
      pointHoverBorderWidth: 3,
      yAxisID: yAxisID,
    });
  });

  const chartConfig = {
    labels: displaySession.data.map(item => 
      xAxisType === 'time' ? item.timeMinutes : item.distance
    ),
    datasets,
  };

  // Determine which metric goes on which axis based on the image
  const paceMetric = selectedMetrics.find(m => m === 'pace');
  const otherMetrics = selectedMetrics.filter(m => m !== 'pace');
  const leftMetric = paceMetric ? getMetric(paceMetric) : getMetric(selectedMetrics[0]);
  const rightMetric = otherMetrics.length > 0 ? getMetric(otherMetrics[0]) : getMetric(selectedMetrics[1]);

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
        text: 'Workout Graph',
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
            
            return `${label}: ${value}`;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: xAxisType === 'time' ? 'Time' : 'Distance',
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
          callback: function(value: any, index: any) {
            if (xAxisType === 'time') {
              const minutes = displaySession.data[index]?.timeMinutes || 0;
              const hours = Math.floor(minutes / 60);
              const mins = minutes % 60;
              return `${hours}:${mins.toString().padStart(2, '0')}`;
            } else {
              const distance = displaySession.data[index]?.distance || 0;
              return distance >= 1000 ? `${(distance / 1000).toFixed(1)}km` : `${Math.round(distance)}m`;
            }
          }
        },
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        beginAtZero: false,
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
            if (leftMetric?.key === 'pace') {
              // Format pace as MM:SS
              const minutes = Math.floor(value / 60);
              const seconds = Math.floor(value % 60);
              return `${minutes}:${seconds.toString().padStart(2, '0')}`;
            }
            return value;
          }
        },
        // For pace, reverse the scale so faster times are at the top
        reverse: leftMetric?.key === 'pace',
      },
      y1: {
        type: 'linear' as const,
        display: selectedMetrics.length > 1,
        position: 'right' as const,
        beginAtZero: true,
        title: {
          display: true,
          text: 'Stroke Rate & Heart Rate',
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
            // Show both stroke rate and heart rate scales
            if (value <= 30) {
              return value; // Stroke rate scale
            } else {
              return value; // Heart rate scale
            }
          }
        },
      },
    },
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <CardTitle>Session Details</CardTitle>
          </div>

          {/* Session Summary Metrics */}
          {selectedSession && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">{formatDistance(Math.max(...displaySession.data.map(d => d.distance)))}</div>
                  <div className="text-xs text-muted-foreground">Distance</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">{formatDuration(Math.max(...displaySession.data.map(d => d.timeMinutes)))}</div>
                  <div className="text-xs text-muted-foreground">Duration</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">
                    {formatPace(displaySession.data.length > 0 ? 
                      (Math.max(...displaySession.data.map(d => d.timeMinutes)) * 60 / Math.max(...displaySession.data.map(d => d.distance))) * 500 : 0
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">Avg Pace</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">
                    {displaySession.data.length > 0 ? 
                      Math.round(displaySession.data.reduce((sum, d) => sum + d.heartRate, 0) / displaySession.data.length) : 0
                    } bpm
                  </div>
                  <div className="text-xs text-muted-foreground">Avg Heart Rate</div>
                </div>
              </div>
            </div>
          )}
          
          {/* Controls */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex gap-2 items-center">
              <span className="text-sm text-muted-foreground">Session:</span>
              <Select 
                value={selectedSession?.filename || ''} 
                onValueChange={(filename) => {
                  const session = sessions.find(s => s.filename === filename);
                  console.log('Session selected:', {
                    filename,
                    sessionFound: !!session,
                    hasGPS: session?.rawData?.some(point => point.longitude && point.latitude),
                    rawDataLength: session?.rawData?.length
                  });
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
              <span className="text-sm text-muted-foreground">X-Axis:</span>
              <Button
                variant={xAxisType === 'time' ? "default" : "outline"}
                size="sm"
                onClick={() => setXAxisType('time')}
              >
                Time
              </Button>
              <Button
                variant={xAxisType === 'distance' ? "default" : "outline"}
                size="sm"
                onClick={() => setXAxisType('distance')}
              >
                Distance
              </Button>
            </div>
            
            <div className="flex gap-2 items-center">
              <span className="text-sm text-muted-foreground">Metrics (select up to 3):</span>
              {METRICS.map(metric => (
                <Button
                  key={metric.key}
                  variant={selectedMetrics.includes(metric.key) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleMetricToggle(metric.key)}
                  disabled={!selectedMetrics.includes(metric.key) && selectedMetrics.length >= 3}
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

      {/* Session Map */}
      <SessionMap sessionData={selectedSession ? { rawData: selectedSession.rawData || [] } : null} />
    </div>
  );
} 