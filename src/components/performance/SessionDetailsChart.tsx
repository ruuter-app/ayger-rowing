import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

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
  { key: 'distance', label: 'Distance (m)', type: 'bar', color: '#059669' },
  { key: 'strokeRate', label: 'Stroke Rate', type: 'line', color: '#dc2626' },
  { key: 'heartRate', label: 'Heart Rate', type: 'line', color: '#f59e0b' },
];

export function SessionDetailsChart() {
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
      const response = await fetch('takatomo-training-data/training_logs.csv');
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
        timeMinutes: Math.round(point.delta / 60), // Convert milliseconds to minutes
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
        {!selectedSession ? (
          <div className="text-center py-8 text-muted-foreground">
            Please select a session to view details
          </div>
        ) : selectedSession.data.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No data available for this session
          </div>
        ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={selectedSession.data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="timeMinutes" 
                  label={{ value: 'Time (minutes)', position: 'insideBottom', offset: -10 }}
                />
                
                {selectedMetrics.length > 0 && (
                  <YAxis 
                    yAxisId="left" 
                    orientation="left"
                    label={{ value: getMetric(selectedMetrics[0])?.label || '', angle: -90, position: 'insideLeft' }}
                  />
                )}
                
                {selectedMetrics.length > 1 && (
                  <YAxis 
                    yAxisId="right" 
                    orientation="right"
                    label={{ value: getMetric(selectedMetrics[1])?.label || '', angle: 90, position: 'insideRight' }}
                  />
                )}
                
                <Tooltip 
                  labelFormatter={(value) => `Time: ${value} minutes`}
                  formatter={(value: any, name: string) => [value, name]}
                />
                <Legend />
                
                {selectedMetrics.map((metricKey, index) => {
                  const metric = getMetric(metricKey);
                  if (!metric) return null;
                  
                  const yAxisId = index === 0 ? 'left' : 'right';
                  
                  if (metric.type === 'bar') {
                    return (
                      <Bar
                        key={metricKey}
                        yAxisId={yAxisId}
                        dataKey={metricKey}
                        fill={metric.color}
                        name={metric.label}
                      />
                    );
                  } else {
                    return (
                      <Line
                        key={metricKey}
                        yAxisId={yAxisId}
                        type="monotone"
                        dataKey={metricKey}
                        stroke={metric.color}
                        strokeWidth={2}
                        dot={{ fill: metric.color, strokeWidth: 2, r: 3 }}
                        name={metric.label}
                      />
                    );
                  }
                })}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 