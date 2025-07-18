import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Input } from '../ui/input';
import { SidebarProvider } from '../ui/sidebar';
import { CoachSidebar } from './CoachSidebar';
import { mockUsers, mockSessions, mockAthleteStats, mockPlannedWorkouts } from '../../lib/mockData';
import { useAuth } from '../auth/AuthContext';
import { ThemeToggle } from '../theme/ThemeToggle';
import { InviteAthleteDialog } from './InviteAthleteDialog';
import { 
  Search, 
  Filter, 
  Eye, 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  Activity,
  Target,
  Clock,
  Ruler,
  Plus
} from 'lucide-react';

export function MyAthletesPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAthlete, setSelectedAthlete] = useState<string | null>(null);
  
  const athletes = mockUsers.filter(u => u.role === 'athlete');
  const filteredAthletes = athletes.filter(athlete =>
    athlete.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    athlete.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatPace = (pace: number) => {
    const minutes = Math.floor(pace / 60);
    const seconds = pace % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatDistance = (meters: number) => {
    return meters >= 1000 ? `${(meters / 1000).toFixed(1)}km` : `${meters}m`;
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return hours > 0 ? `${hours}h ${remainingMinutes}m` : `${remainingMinutes}m`;
  };

  const getComplianceColor = (compliance: number) => {
    if (compliance >= 90) return 'text-green-600 bg-green-50';
    if (compliance >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
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
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">My Athletes</h1>
                  <p className="text-muted-foreground">
                    Manage and monitor your athletes' progress
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <InviteAthleteDialog />
                  <Button variant="outline" onClick={() => window.location.href = '/coach/planning'}>
                    <Calendar className="h-4 w-4 mr-2" />
                    Training Plans
                  </Button>
                </div>
              </div>

              {/* Search and Filters */}
              <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search athletes by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>

              {/* Athletes Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredAthletes.map((athlete) => {
                  const stats = mockAthleteStats[athlete.id];
                  const athleteSessions = mockSessions.filter(s => s.athleteId === athlete.id);
                  const plannedWorkouts = mockPlannedWorkouts.filter(w => w.athleteId === athlete.id);
                  const upcomingWorkouts = plannedWorkouts.filter(w => !w.completed);
                  
                  return (
                    <Card 
                      key={athlete.id} 
                      className="hover:shadow-lg transition-all duration-200 cursor-pointer group"
                      onClick={() => setSelectedAthlete(athlete.id)}
                    >
                      <CardHeader className="pb-4">
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-16 w-16">
                            <AvatarImage src={athlete.profileImage} alt={athlete.name} />
                            <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                              {athlete.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <CardTitle className="text-xl group-hover:text-primary transition-colors">
                              {athlete.name}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">{athlete.email}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge 
                                variant="outline" 
                                className={getComplianceColor(stats?.planCompliance || 0)}
                              >
                                {stats?.planCompliance || 0}% compliance
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                {athleteSessions.length} sessions
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        {/* Key Stats */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1">
                              <Ruler className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">Total Distance</span>
                            </div>
                            <p className="font-semibold">{formatDistance(stats?.totalDistance || 0)}</p>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">Total Time</span>
                            </div>
                            <p className="font-semibold">{formatDuration(stats?.totalDuration || 0)}</p>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1">
                              <Activity className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">Avg Pace</span>
                            </div>
                            <p className="font-semibold">{formatPace(stats?.avgPace || 0)}</p>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1">
                              <Target className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">Upcoming</span>
                            </div>
                            <p className="font-semibold">{upcomingWorkouts.length} workouts</p>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-3 border-t">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <p className="text-sm font-medium">Last Activity</p>
                              <p className="text-xs text-muted-foreground">
                                {stats?.lastActivity ? new Date(stats.lastActivity).toLocaleDateString() : 'No recent activity'}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="flex-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.location.href = `/coach/planning?athlete=${athlete.id}`;
                              }}
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Schedule Training
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedAthlete(athlete.id);
                              }}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              View Details
                            </Button>
                          </div>
                        </div>

                        {/* Progress Indicator */}
                        <div className="pt-2">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-muted-foreground">Monthly Progress</span>
                            <div className="flex items-center gap-1">
                              {(stats?.planCompliance || 0) > 80 ? (
                                <TrendingUp className="h-3 w-3 text-green-500" />
                              ) : (
                                <TrendingDown className="h-3 w-3 text-red-500" />
                              )}
                              <span className="text-xs font-medium">
                                {(stats?.planCompliance || 0) > 80 ? 'On track' : 'Needs attention'}
                              </span>
                            </div>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary rounded-full h-2 transition-all duration-300"
                              style={{ width: `${stats?.planCompliance || 0}%` }}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {filteredAthletes.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-muted-foreground">
                    <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">No athletes found</h3>
                    <p>Try adjusting your search criteria or invite new athletes to your program.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}