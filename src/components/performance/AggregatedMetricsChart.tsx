import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface AggregatedData {
  period: string;
  sessionCount: number;
  totalDistance: number;
  avgStrokeRate: number;
  avgHeartRate: number;
}

const METRICS = [
  { key: 'sessionCount', label: 'Session Count', type: 'bar', color: '#2563eb' },
  { key: 'totalDistance', label: 'Total Distance (m)', type: 'bar', color: '#059669' },
  { key: 'avgStrokeRate', label: 'Avg Stroke Rate', type: 'line', color: '#dc2626' },
  { key: 'avgHeartRate', label: 'Avg Heart Rate', type: 'line', color: '#f59e0b' },
];

export function AggregatedMetricsChart() {
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
      console.error('Failed CSV path:', csvPath);
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

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="text-muted-foreground">Loading aggregated metrics...</div>
        </CardContent>
      </Card>
    );
  }

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
        {data.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No data available for the selected period
          </div>
        ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                
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
                
                <Tooltip />
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
                        dot={{ fill: metric.color, strokeWidth: 2, r: 4 }}
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