import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { 
  Activity, 
  Clock, 
  MapPin, 
  TrendingUp, 
  Heart, 
  Target,
  Calendar,
  BarChart3
} from 'lucide-react';
import { trainingDataService, ProcessedSession } from '../../lib/trainingDataService';
// SessionChart temporarily disabled
// Charts temporarily disabled - using Chart.js in PerformanceDashboard instead

interface TrainingDashboardProps {
  className?: string;
}

export function TrainingDashboard({ className }: TrainingDashboardProps) {
  const [sessions, setSessions] = useState<ProcessedSession[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<ProcessedSession | null>(null);

  useEffect(() => {
    loadTrainingData();
  }, []);

  const loadTrainingData = async () => {
    try {
      setLoading(true);
      const data = await trainingDataService.loadTrainingData();
      setSessions(data);
      setStats(trainingDataService.getSessionStats());
      if (data.length > 0) {
        setSelectedSession(data[0]);
      }
    } catch (error) {
      console.error('Error loading training data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatDistance = (meters: number) => {
    return meters >= 1000 ? `${(meters / 1000).toFixed(1)}km` : `${meters}m`;
  };

  const formatPace = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getHeartRateZone = (heartRate: number) => {
    if (heartRate < 120) return { zone: 'Recovery', color: '#10b981' };
    if (heartRate < 140) return { zone: 'Aerobic', color: '#3b82f6' };
    if (heartRate < 160) return { zone: 'Threshold', color: '#f59e0b' };
    if (heartRate < 180) return { zone: 'Anaerobic', color: '#ef4444' };
    return { zone: 'Max', color: '#dc2626' };
  };

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading training data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className={`space-y-6 ${className}`}>
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Training Data</h3>
              <p className="text-muted-foreground">No training sessions found. Upload some data to get started.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const recentSessions = sessions.slice(0, 5);
  const heartRateData = sessions
    .filter(s => s.avgHeartRate > 0)
    .map(s => ({
      date: s.date,
      heartRate: s.avgHeartRate,
      zone: getHeartRateZone(s.avgHeartRate).zone
    }));

  const distanceData = sessions.map(s => ({
    date: s.date,
    distance: s.distance,
    duration: s.duration
  }));

  const strokeRateData = sessions
    .filter(s => s.avgStrokeRate > 0)
    .map(s => ({
      date: s.date,
      strokeRate: s.avgStrokeRate
    }));

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalSessions || 0}</div>
            <p className="text-xs text-muted-foreground">
              {formatDistance(stats?.totalDistance || 0)} total distance
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatDuration(stats?.totalDuration || 0)}</div>
            <p className="text-xs text-muted-foreground">
              {formatDuration(stats?.longestSession || 0)} longest session
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Pace</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPace(stats?.avgPace || 0)}</div>
            <p className="text-xs text-muted-foreground">per 500m</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Heart Rate</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(stats?.avgHeartRate || 0)}</div>
            <p className="text-xs text-muted-foreground">bpm</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Distance Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Distance Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-gray-50 border border-gray-200 rounded">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-500">Distance chart will be available soon</p>
                    <p className="text-sm text-gray-400">Visit Performance Analysis for detailed charts</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Heart Rate Zones */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Heart Rate Zones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-gray-50 border border-gray-200 rounded">
                  <div className="text-center">
                    <Heart className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-500">Heart rate chart will be available soon</p>
                    <p className="text-sm text-gray-400">Visit Performance Analysis for detailed charts</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Sessions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Recent Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentSessions.map((session) => (
                  <div 
                    key={session.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => setSelectedSession(session)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-sm font-medium">{session.date}</div>
                      <Badge variant="outline">{session.type || 'FREE'}</Badge>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {formatDistance(session.distance)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {formatDuration(session.duration)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Target className="h-4 w-4" />
                        {formatPace(session.avgPace)}
                      </div>
                      {session.avgHeartRate > 0 && (
                        <div className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          {Math.round(session.avgHeartRate)} bpm
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4">
          {selectedSession && (
            <div className="space-y-6">
              {/* Session Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Session Details - {selectedSession.date}</span>
                    <Badge variant="outline">{selectedSession.type || 'FREE'}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{formatDistance(selectedSession.distance)}</div>
                      <div className="text-sm text-muted-foreground">Distance</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{formatDuration(selectedSession.duration)}</div>
                      <div className="text-sm text-muted-foreground">Duration</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{formatPace(selectedSession.avgPace)}</div>
                      <div className="text-sm text-muted-foreground">Avg Pace</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{selectedSession.avgStrokeRate.toFixed(1)}</div>
                      <div className="text-sm text-muted-foreground">Avg Stroke Rate</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Session Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="p-8 text-center">
                    <Activity className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-500">Session charts will be available soon</p>
                    <p className="text-sm text-gray-400">Visit Performance Analysis for detailed charts</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-8 text-center">
                    <Activity className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-500">Session charts will be available soon</p>
                    <p className="text-sm text-gray-400">Visit Performance Analysis for detailed charts</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Session Selector */}
          <Card>
            <CardHeader>
              <CardTitle>Select Session</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sessions.map((session) => (
                  <Button
                    key={session.id}
                    variant={selectedSession?.id === session.id ? "default" : "outline"}
                    className="h-auto p-4 flex flex-col items-start gap-2"
                    onClick={() => setSelectedSession(session)}
                  >
                    <div className="font-medium">{session.date}</div>
                    <div className="text-sm text-muted-foreground">
                      {formatDistance(session.distance)} • {formatDuration(session.duration)}
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {session.type || 'FREE'}
                    </Badge>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Stroke Rate Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Stroke Rate Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-gray-50 border border-gray-200 rounded">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-500">Stroke rate chart will be available soon</p>
                    <p className="text-sm text-gray-400">Visit Performance Analysis for detailed charts</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Distance Range</span>
                      <span>{sessions.length} sessions</span>
                    </div>
                    <div className="space-y-2">
                      {[
                        { range: '0-1km', count: sessions.filter(s => s.distance < 1000).length },
                        { range: '1-2km', count: sessions.filter(s => s.distance >= 1000 && s.distance < 2000).length },
                        { range: '2-5km', count: sessions.filter(s => s.distance >= 2000 && s.distance < 5000).length },
                        { range: '5km+', count: sessions.filter(s => s.distance >= 5000).length }
                      ].map((item) => (
                        <div key={item.range} className="flex items-center gap-2">
                          <div className="w-16 text-sm">{item.range}</div>
                          <Progress 
                            value={(item.count / sessions.length) * 100} 
                            className="flex-1"
                          />
                          <div className="w-8 text-sm text-right">{item.count}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 