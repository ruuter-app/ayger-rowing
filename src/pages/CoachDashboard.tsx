import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Button } from '../components/ui/button';
import { SidebarProvider } from '../components/ui/sidebar';
import { CoachSidebar } from '../components/coach/CoachSidebar';
import { mockUsers, mockSessions, mockPlannedWorkouts, mockAthleteStats } from '../lib/mockData';
import { useAuth } from '../components/auth/AuthContext';
import { ThemeToggle } from '../components/theme/ThemeToggle';
import { Users, TrendingUp, Calendar, Activity, Eye } from 'lucide-react';

export function CoachDashboard() {
  const { user } = useAuth();
  const athletes = mockUsers.filter(u => u.role === 'athlete');
  const totalSessions = mockSessions.length;
  const totalPlannedWorkouts = mockPlannedWorkouts.length;
  const completedWorkouts = mockPlannedWorkouts.filter(w => w.completed).length;
  
  const formatPace = (pace: number) => {
    const minutes = Math.floor(pace / 60);
    const seconds = pace % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatDistance = (meters: number) => {
    return meters >= 1000 ? `${(meters / 1000).toFixed(1)}km` : `${meters}m`;
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-background">
        <CoachSidebar />
        <main className="flex-1 overflow-auto">
          {/* Top Bar with Theme Toggle */}
          <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-6 py-4">
              <div className="flex items-center justify-end">
                <ThemeToggle />
              </div>
            </div>
          </div>
          
          <div className="container mx-auto px-6 py-8">
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl font-bold text-ayger-navy mb-2">Coach Dashboard</h1>
                <p className="text-muted-foreground">
                  Monitor athlete progress and manage training programs
                </p>
              </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-primary" />
                <div className="text-2xl font-bold">{athletes.length}</div>
              </div>
              <p className="text-xs text-muted-foreground">Active Athletes</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Activity className="h-4 w-4 text-secondary" />
                <div className="text-2xl font-bold">{totalSessions}</div>
              </div>
              <p className="text-xs text-muted-foreground">Total Sessions</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-accent" />
                <div className="text-2xl font-bold">{totalPlannedWorkouts}</div>
              </div>
              <p className="text-xs text-muted-foreground">Planned Workouts</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <div className="text-2xl font-bold">
                  {Math.round((completedWorkouts / totalPlannedWorkouts) * 100)}%
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Compliance Rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Athlete Overview */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-ayger-navy">Athletes Overview</h2>
            <Button variant="outline">
              <Users className="h-4 w-4 mr-2" />
              Manage All Athletes
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {athletes.map((athlete) => {
              const stats = mockAthleteStats[athlete.id];
              const athleteSessions = mockSessions.filter(s => s.athleteId === athlete.id);
              const latestSession = athleteSessions[0];
              
              return (
                <Card key={athlete.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={athlete.profileImage} alt={athlete.name} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {athlete.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{athlete.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{athlete.email}</p>
                      </div>
                      <Badge variant="outline">
                        {stats?.planCompliance}% compliance
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Total Sessions</p>
                        <p className="font-semibold">{stats?.totalSessions || 0}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Total Distance</p>
                        <p className="font-semibold">{formatDistance(stats?.totalDistance || 0)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Avg Pace</p>
                        <p className="font-semibold">{formatPace(stats?.avgPace || 0)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Last Activity</p>
                        <p className="font-semibold">
                          {stats?.lastActivity ? new Date(stats.lastActivity).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                    </div>
                    
                    {latestSession && (
                      <div className="pt-3 border-t">
                        <p className="text-sm font-medium mb-2">Latest Session</p>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                              {formatDistance(latestSession.distance)}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {latestSession.duration}min
                            </Badge>
                          </div>
                          <Button size="sm" variant="ghost">
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-2xl font-bold text-ayger-navy mb-6">Recent Activity</h2>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {mockSessions.slice(0, 5).map((session) => {
                  const athlete = athletes.find(a => a.id === session.athleteId);
                  return (
                    <div key={session.id} className="flex items-center justify-between py-2">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={athlete?.profileImage} alt={athlete?.name} />
                          <AvatarFallback className="text-xs">
                            {athlete?.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{athlete?.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(session.date).toLocaleDateString()} • {formatDistance(session.distance)} • {session.duration}min
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        Avg: {formatPace(session.avgPace)}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}