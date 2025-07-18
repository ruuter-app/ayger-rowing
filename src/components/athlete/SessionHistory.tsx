import React, { useEffect, useState } from 'react';
import { fetchAthleteSessionsFromCsv, summarizeSession, aggregateTrends } from '../../lib/performanceAnalysis';
import { AthleteSession, AthleteSessionSummary, AggregatedTrends } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { ArrowUpDown, Calendar, Ruler, Clock, BarChart3, MapPin, FileDown, Activity, HeartPulse } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, ComposedChart, Bar } from 'recharts';
import { MapContainer, TileLayer, Polyline, Tooltip as LeafletTooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useMemo } from 'react';

const SORT_OPTIONS = [
  { label: 'Date', value: 'date' },
  { label: 'Distance', value: 'totalDistance' },
  { label: 'Duration', value: 'duration' },
];

type SortKey = 'date' | 'totalDistance' | 'duration';

const CSV_PATH = '/Takatomo Training Data/training_logs.csv';

export function SessionHistory() {
  const [sessions, setSessions] = useState<AthleteSessionSummary[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<AthleteSessionSummary[]>([]);
  const [sortKey, setSortKey] = useState<SortKey>('date');
  const [sortDesc, setSortDesc] = useState(true);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<AthleteSessionSummary | null>(null);
  
  // Filter states
  const [trainingTypeFilter, setTrainingTypeFilter] = useState<string>('all');
  const [dateFromFilter, setDateFromFilter] = useState<string>('');
  const [dateToFilter, setDateToFilter] = useState<string>('');

  useEffect(() => {
    fetchAndSummarize();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [sessions, trainingTypeFilter, dateFromFilter, dateToFilter]);

  const fetchAndSummarize = async () => {
    setLoading(true);
    const rawSessions = await fetchAthleteSessionsFromCsv(CSV_PATH);
    const summaries = rawSessions.map(summarizeSession);
    // Sort by date desc to get latest first
    const sortedSummaries = summaries.sort((a, b) => b.date.localeCompare(a.date));
    setSessions(sortedSummaries);
    // Set latest session as default selected
    if (sortedSummaries.length > 0) {
      setSelectedSession(sortedSummaries[0]);
    }
    setLoading(false);
  };

  const applyFilters = () => {
    let filtered = [...sessions];
    
    // Filter by training type (if we had that data - for now show all)
    if (trainingTypeFilter !== 'all') {
      // TODO: Filter by training type when available in data
    }
    
    // Filter by date range
    if (dateFromFilter) {
      filtered = filtered.filter(s => s.date >= dateFromFilter);
    }
    if (dateToFilter) {
      filtered = filtered.filter(s => s.date <= dateToFilter);
    }
    
    setFilteredSessions(filtered);
  };

  const sortedSessions = [...filteredSessions].sort((a, b) => {
    if (sortKey === 'date') {
      return sortDesc
        ? b.date.localeCompare(a.date)
        : a.date.localeCompare(b.date);
    } else {
      return sortDesc
        ? (b[sortKey] as number) - (a[sortKey] as number)
        : (a[sortKey] as number) - (b[sortKey] as number);
    }
  });

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Session History</CardTitle>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-center bg-muted/50 p-4 rounded-lg">
          <div className="flex gap-2 items-center">
            <span className="text-sm font-medium">Training Type:</span>
            <select 
              value={trainingTypeFilter} 
              onChange={e => setTrainingTypeFilter(e.target.value)} 
              className="border rounded px-3 py-1 text-sm"
            >
              <option value="all">All Types</option>
              <option value="steady">Steady State</option>
              <option value="interval">Intervals</option>
              <option value="sprint">Sprint</option>
              <option value="endurance">Endurance</option>
            </select>
          </div>
          
          <div className="flex gap-2 items-center">
            <span className="text-sm font-medium">Date Range:</span>
            <input 
              type="date" 
              value={dateFromFilter}
              onChange={e => setDateFromFilter(e.target.value)}
              className="border rounded px-3 py-1 text-sm" 
            />
            <span className="text-sm">to</span>
            <input 
              type="date" 
              value={dateToFilter}
              onChange={e => setDateToFilter(e.target.value)}
              className="border rounded px-3 py-1 text-sm" 
            />
          </div>
          
          <button
            onClick={() => {
              setTrainingTypeFilter('all');
              setDateFromFilter('');
              setDateToFilter('');
            }}
            className="px-3 py-1 text-sm border rounded hover:bg-muted transition-colors"
          >
            Clear Filters
          </button>
        </div>
        
        {/* Sort Options */}
        <div className="flex gap-2 items-center">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          {SORT_OPTIONS.map(opt => (
            <button
              key={opt.value}
              className={`inline-flex items-center px-2 py-1 rounded text-xs border ${sortKey === opt.value ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
              onClick={() => setSortKey(opt.value as SortKey)}
            >
              {opt.label}
              {sortKey === opt.value && (
                <ArrowUpDown
                  className="ml-1 h-3 w-3 cursor-pointer"
                  onClick={e => {
                    e.stopPropagation();
                    setSortDesc(d => !d);
                  }}
                />
              )}
            </button>
          ))}
        </div>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Loading sessions...</div>
        ) : (
          <div className="space-y-8">
            {/* Latest Session Detail with Splits */}
            {selectedSession && (
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Latest Session: {selectedSession.filename}
                </h3>
                <SessionDetailWithSplits filename={selectedSession.filename} />
              </div>
            )}
            
            {/* Session List */}
            <div>
              <h3 className="text-lg font-semibold mb-4">All Sessions ({filteredSessions.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedSessions.map(session => (
                  <Card 
                    key={session.filename} 
                    className={`border cursor-pointer hover:shadow-lg transition ${
                      selectedSession?.filename === session.filename ? 'ring-2 ring-primary' : 'border-muted'
                    }`}
                    onClick={() => setSelectedSession(session)}
                  >
                    <CardContent className="p-4 flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-primary" />
                        <span className="font-medium text-sm">{session.filename}</span>
                      </div>
                      <div className="text-xs text-muted-foreground mb-2">
                        {new Date(session.date).toLocaleDateString()}
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs">
                        <Badge variant="outline"><Clock className="h-3 w-3 mr-1" /> {formatDuration(session.duration)}</Badge>
                        <Badge variant="outline"><Ruler className="h-3 w-3 mr-1" /> {session.totalDistance.toFixed(1)}m</Badge>
                        <Badge variant="outline">Avg SR: {session.avgStrokeRate.toFixed(1)}</Badge>
                        {session.avgHeartRate !== undefined && (
                          <Badge variant="outline">Avg HR: {session.avgHeartRate.toFixed(1)}</Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
      
      {/* Session Detail Modal - Keep existing modal for detailed view */}
      <Dialog open={false} onOpenChange={() => {}}>
        <DialogContent className="max-w-2xl w-full">
          <DialogHeader>
            <DialogTitle>Session Detail</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

// New component for showing session detail with splits
function SessionDetailWithSplits({ filename }: { filename: string }) {
  const [session, setSession] = useState<AthleteSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSession();
  }, [filename]);

  const fetchSession = async () => {
    setLoading(true);
    const all = await fetchAthleteSessionsFromCsv(CSV_PATH);
    setSession(all.find(s => s.filename === filename) || null);
    setLoading(false);
  };

  if (loading || !session) return <div className="py-4 text-center text-muted-foreground">Loading session...</div>;

  // Prepare splits data (every 500m or every 2 minutes)
  const splitsData = session.delta.map((delta, i) => ({
    time: Math.round(delta / 60), // minutes
    splitTime: i > 0 ? delta - session.delta[i-1] : delta, // time for this split
    strokeRate: session.strokerate[i],
    heartRate: session.heartrate ? session.heartrate[i] : undefined,
    distance: session.distance[i],
  })).filter((_, i) => i % 10 === 0); // Take every 10th point for splits

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
        <div className="text-center">
          <div className="text-lg font-bold">{new Date(session.startTime * 1000).toLocaleDateString()}</div>
          <div className="text-sm text-muted-foreground">Date</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold">{Math.round(Math.max(...session.delta) / 60)}m</div>
          <div className="text-sm text-muted-foreground">Duration</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold">{session.distance[session.distance.length - 1]?.toFixed(0)}m</div>
          <div className="text-sm text-muted-foreground">Distance</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold">{(session.strokerate.reduce((a, b) => a + b, 0) / session.strokerate.length).toFixed(1)}</div>
          <div className="text-sm text-muted-foreground">Avg SR</div>
        </div>
      </div>
      
      {/* Splits Chart */}
      <div className="h-64">
        <h4 className="font-medium mb-2">Session Splits</h4>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={splitsData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <XAxis dataKey="time" tickFormatter={t => `${t}m`} />
            <YAxis yAxisId="left" label={{ value: 'SPM', angle: -90, position: 'insideLeft' }} />
            <YAxis yAxisId="right" orientation="right" label={{ value: 'BPM', angle: 90, position: 'insideRight' }} />
            <Tooltip />
            <Legend />
            <CartesianGrid strokeDasharray="3 3" />
            <Line yAxisId="left" type="monotone" dataKey="strokeRate" stroke="#2563eb" dot={false} name="Stroke Rate" />
            {session.heartrate && session.heartrate.some(hr => hr > 0) && (
              <Line yAxisId="right" type="monotone" dataKey="heartRate" stroke="#dc2626" dot={false} name="Heart Rate" />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function AggregatedTrendsDashboard() {
  const [trends, setTrends] = useState<AggregatedTrends[]>([]);
  const [period, setPeriod] = useState<'week' | 'month'>('week');
  const [loading, setLoading] = useState(true);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['avgStrokeRate', 'totalDistance']);
  // Filters (UI only for now)
  const [dateRange, setDateRange] = useState<{ from: string; to: string } | null>(null);
  const [activityType, setActivityType] = useState<string>('all');

  const AVAILABLE_METRICS = [
    { key: 'avgStrokeRate', label: 'Avg Stroke Rate', color: '#2563eb', unit: 'SPM' },
    { key: 'totalDistance', label: 'Total Distance', color: '#059669', unit: 'meters' },
    { key: 'sessionCount', label: 'Session Count', color: '#dc2626', unit: 'sessions' },
  ];

  useEffect(() => {
    fetchTrends();
  }, [period]);

  const fetchTrends = async () => {
    setLoading(true);
    const sessions = await fetchAthleteSessionsFromCsv(CSV_PATH);
    setTrends(aggregateTrends(sessions, period));
    setLoading(false);
  };

  const handleMetricToggle = (metricKey: string) => {
    if (selectedMetrics.includes(metricKey)) {
      setSelectedMetrics(prev => prev.filter(m => m !== metricKey));
    } else if (selectedMetrics.length < 2) {
      setSelectedMetrics(prev => [...prev, metricKey]);
    }
  };

  const getMetricConfig = (metricKey: string) => AVAILABLE_METRICS.find(m => m.key === metricKey);

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Aggregated Trends</CardTitle>
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex gap-2 items-center">
            <span className="text-sm text-muted-foreground">Period:</span>
            <select value={period} onChange={e => setPeriod(e.target.value as any)} className="border rounded px-2 py-1 text-xs">
              <option value="week">Weekly</option>
              <option value="month">Monthly</option>
            </select>
          </div>
          <div className="flex gap-2 items-center">
            <span className="text-sm text-muted-foreground">Metrics (select up to 2):</span>
            {AVAILABLE_METRICS.map(metric => (
              <button
                key={metric.key}
                onClick={() => handleMetricToggle(metric.key)}
                className={`px-3 py-1 rounded text-xs border transition-colors ${
                  selectedMetrics.includes(metric.key)
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-muted border-gray-300 hover:bg-muted/80'
                }`}
                disabled={!selectedMetrics.includes(metric.key) && selectedMetrics.length >= 2}
              >
                {metric.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2 items-center">
            <span className="text-sm text-muted-foreground">Activity:</span>
            <select value={activityType} onChange={e => setActivityType(e.target.value)} className="border rounded px-2 py-1 text-xs">
              <option value="all">All</option>
              <option value="rowing">Rowing</option>
              <option value="cycling">Cycling</option>
            </select>
          </div>
          {/* Date range filter UI (not functional yet) */}
          <input type="date" className="border rounded px-2 py-1 text-xs" onChange={e => setDateRange(r => ({ ...r, from: e.target.value }))} />
          <span>-</span>
          <input type="date" className="border rounded px-2 py-1 text-xs" onChange={e => setDateRange(r => ({ ...r, to: e.target.value }))} />
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Loading trends...</div>
        ) : selectedMetrics.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">Select at least one metric to display trends</div>
        ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={trends} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={period} />
                {selectedMetrics.length > 0 && (
                  <YAxis 
                    yAxisId="left" 
                    orientation="left"
                    label={{ value: getMetricConfig(selectedMetrics[0])?.unit || '', angle: -90, position: 'insideLeft' }}
                  />
                )}
                {selectedMetrics.length > 1 && (
                  <YAxis 
                    yAxisId="right" 
                    orientation="right"
                    label={{ value: getMetricConfig(selectedMetrics[1])?.unit || '', angle: 90, position: 'insideRight' }}
                  />
                )}
                <Tooltip />
                <Legend />
                
                {selectedMetrics.length > 0 && (
                  <Bar 
                    yAxisId="left"
                    dataKey={selectedMetrics[0]} 
                    fill={getMetricConfig(selectedMetrics[0])?.color} 
                    name={getMetricConfig(selectedMetrics[0])?.label}
                  />
                )}
                {selectedMetrics.length > 1 && (
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey={selectedMetrics[1]} 
                    stroke={getMetricConfig(selectedMetrics[1])?.color} 
                    strokeWidth={3}
                    dot={false}
                    name={getMetricConfig(selectedMetrics[1])?.label}
                  />
                )}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 