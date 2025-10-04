import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { TrendingUp, Users, Activity, Target } from 'lucide-react';
import { getAthleteComparisonData, mockUsers } from '../../lib/mockData';

interface AthleteComparisonProps {
  athleteIds: string[];
}

export function AthleteComparison({ athleteIds }: AthleteComparisonProps) {
  const comparisonData = getAthleteComparisonData(athleteIds);

  const formatPace = (pace: number) => {
    const minutes = Math.floor(pace / 60);
    const seconds = pace % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatDistance = (meters: number) => {
    return meters >= 1000 ? `${(meters / 1000).toFixed(1)}km` : `${meters}m`;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Athlete Performance Comparison
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {comparisonData.map((athlete) => (
                <Card key={athlete.athleteId} className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={mockUsers.find(u => u.id === athlete.athleteId)?.profileImage} />
                      <AvatarFallback>
                        {athlete.athleteName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">{athlete.athleteName}</h4>
                      <p className="text-sm text-muted-foreground">
                        {athlete.metrics.totalSessions} sessions
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Avg Pace</span>
                      <Badge variant="outline">{formatPace(athlete.metrics.avgPace)}</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Stroke Rate</span>
                      <Badge variant="outline">{athlete.metrics.avgStrokeRate.toFixed(1)}/min</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Distance</span>
                      <Badge variant="outline">{formatDistance(athlete.metrics.totalDistance)}</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Compliance</span>
                      <Badge variant={athlete.metrics.planCompliance >= 80 ? "default" : "secondary"}>
                        {athlete.metrics.planCompliance}%
                      </Badge>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="metrics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pace Comparison */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Average Pace Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {comparisonData.map((athlete) => (
                      <div key={athlete.athleteId} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{athlete.athleteName}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{
                                width: `${Math.max(20, Math.min(100, (athlete.metrics.avgPace / 150) * 100))}%`
                              }}
                            />
                          </div>
                          <span className="text-sm font-mono">{formatPace(athlete.metrics.avgPace)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Stroke Rate Comparison */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Stroke Rate Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {comparisonData.map((athlete) => (
                      <div key={athlete.athleteId} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{athlete.athleteName}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full"
                              style={{
                                width: `${Math.max(20, Math.min(100, (athlete.metrics.avgStrokeRate / 30) * 100))}%`
                              }}
                            />
                          </div>
                          <span className="text-sm font-mono">{athlete.metrics.avgStrokeRate.toFixed(1)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-4">
            <div className="grid grid-cols-1 gap-6">
              {comparisonData.map((athlete) => (
                <Card key={athlete.athleteId}>
                  <CardHeader>
                    <CardTitle className="text-lg">{athlete.athleteName} - Performance Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {athlete.trend.map((week, index) => (
                        <div key={week.week} className="flex items-center justify-between py-2 border-b last:border-b-0">
                          <span className="text-sm font-medium">Week {week.week.split('-')[1]}</span>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="text-sm text-muted-foreground">Stroke Rate</div>
                              <div className="font-mono">{week.avgStrokeRate.toFixed(1)}/min</div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-muted-foreground">Distance</div>
                              <div className="font-mono">{formatDistance(week.totalDistance)}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}



