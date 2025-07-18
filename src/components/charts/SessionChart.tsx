import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Session } from '../../types';

interface SessionChartProps {
  session: Session;
  metric: 'pace' | 'strokeRate' | 'cadence' | 'heartRate';
}

export function SessionChart({ session, metric }: SessionChartProps) {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatPace = (pace: number) => {
    const minutes = Math.floor(pace / 60);
    const seconds = pace % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getMetricConfig = () => {
    switch (metric) {
      case 'pace':
        return {
          title: 'Pace (per 500m)',
          color: 'hsl(var(--ayger-teal))',
          formatter: (value: number) => formatPace(value),
          domain: ['dataMin - 5', 'dataMax + 5']
        };
      case 'strokeRate':
        return {
          title: 'Stroke Rate (spm)',
          color: 'hsl(var(--ayger-orange))',
          formatter: (value: number) => `${value.toFixed(1)} spm`,
          domain: [15, 35]
        };
      case 'cadence':
        return {
          title: 'Cadence (rpm)',
          color: 'hsl(var(--ayger-coral))',
          formatter: (value: number) => `${value.toFixed(1)} rpm`,
          domain: [70, 100]
        };
      case 'heartRate':
        return {
          title: 'Heart Rate (bpm)',
          color: 'hsl(var(--destructive))',
          formatter: (value: number) => `${value} bpm`,
          domain: [120, 180]
        };
    }
  };

  const config = getMetricConfig();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      return (
        <div className="bg-white border rounded-lg shadow-lg p-3">
          <p className="text-sm text-muted-foreground">{`Time: ${formatTime(label)}`}</p>
          <p className="text-sm font-medium" style={{ color: config.color }}>
            {`${config.title}: ${config.formatter(value)}`}
          </p>
        </div>
      );
    }
    return null;
  };

  const averageValue = session.data.reduce((sum, point) => sum + point[metric], 0) / session.data.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{config.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={session.data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="time" 
                tickFormatter={formatTime}
                type="number"
                domain={['dataMin', 'dataMax']}
              />
              <YAxis 
                tickFormatter={config.formatter}
                domain={config.domain}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine 
                y={averageValue} 
                stroke={config.color} 
                strokeDasharray="5 5" 
                opacity={0.7}
                label={{ value: `Avg: ${config.formatter(averageValue)}`, position: "right" }}
              />
              <Line 
                type="monotone" 
                dataKey={metric} 
                stroke={config.color} 
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: config.color }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}