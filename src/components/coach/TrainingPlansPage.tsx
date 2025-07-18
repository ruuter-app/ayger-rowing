import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { SidebarProvider } from '../ui/sidebar';
import { CoachSidebar } from './CoachSidebar';
import { ThemeToggle } from '../theme/ThemeToggle';
import { mockUsers, mockPlannedWorkouts } from '../../lib/mockData';
import { useAuth } from '../auth/AuthContext';
import { 
  Calendar, 
  Clock, 
  Ruler, 
  Plus, 
  Save, 
  Users, 
  Copy,
  Filter,
  Search,
  Target,
  BookOpen
} from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

interface WorkoutTemplate {
  id: string;
  name: string;
  sport: 'rowing' | 'cycling';
  targetDistance?: number;
  targetDuration?: number;
  notes: string;
  category: 'endurance' | 'interval' | 'recovery' | 'strength';
}

const workoutTemplates: WorkoutTemplate[] = [
  {
    id: 'template1',
    name: 'Steady State Endurance',
    sport: 'rowing',
    targetDistance: 8000,
    targetDuration: 40,
    notes: 'Maintain consistent pace throughout. Focus on technique and breathing.',
    category: 'endurance'
  },
  {
    id: 'template2', 
    name: 'Sprint Intervals',
    sport: 'rowing',
    targetDistance: 5000,
    notes: '8x250m at race pace with 90s rest between intervals. High intensity.',
    category: 'interval'
  },
  {
    id: 'template3',
    name: 'Recovery Row',
    sport: 'rowing',
    targetDistance: 4000,
    targetDuration: 25,
    notes: 'Easy pace recovery session. Focus on technique and relaxed rowing.',
    category: 'recovery'
  },
  {
    id: 'template4',
    name: 'Power Endurance',
    sport: 'cycling',
    targetDistance: 15000,
    targetDuration: 60,
    notes: 'Build to race pace in final 20 minutes. Maintain good form throughout.',
    category: 'endurance'
  }
];

export function TrainingPlansPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedAthletes, setSelectedAthletes] = useState<string[]>([]);
  const [workoutForm, setWorkoutForm] = useState({
    name: '',
    sport: 'rowing' as 'rowing' | 'cycling',
    date: '',
    targetDistance: '',
    targetDuration: '', 
    notes: ''
  });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  
  const athletes = mockUsers.filter(u => u.role === 'athlete');
  const plannedWorkouts = mockPlannedWorkouts;

  useEffect(() => {
    // Check for pre-selected athlete from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const athleteId = urlParams.get('athlete');
    if (athleteId && athletes.find(a => a.id === athleteId)) {
      setSelectedAthletes([athleteId]);
      setShowCreateForm(true);
    }
  }, []);

  const handleAthleteSelection = (athleteId: string, checked: boolean) => {
    if (checked) {
      setSelectedAthletes(prev => [...prev, athleteId]);
    } else {
      setSelectedAthletes(prev => prev.filter(id => id !== athleteId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedAthletes(athletes.map(a => a.id));
    } else {
      setSelectedAthletes([]);
    }
  };

  const handleTemplateSelect = (template: WorkoutTemplate) => {
    setWorkoutForm({
      name: template.name,
      sport: template.sport,
      date: workoutForm.date,
      targetDistance: template.targetDistance?.toString() || '',
      targetDuration: template.targetDuration?.toString() || '',
      notes: template.notes
    });
  };

  const handleCreateWorkout = () => {
    if (!workoutForm.name || !workoutForm.date || selectedAthletes.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in workout name, date, and select at least one athlete.",
        variant: "destructive"
      });
      return;
    }

    // Simulate creating workout
    toast({
      title: "Training Plan Created!",
      description: `Assigned "${workoutForm.name}" to ${selectedAthletes.length} athlete(s).`,
    });

    // Reset form
    setWorkoutForm({
      name: '',
      sport: 'rowing',
      date: '',
      targetDistance: '',
      targetDuration: '',
      notes: ''
    });
    setSelectedAthletes([]);
    setShowCreateForm(false);
  };

  const filteredTemplates = workoutTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.notes.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || template.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const formatDistance = (meters: number) => {
    return meters >= 1000 ? `${(meters / 1000).toFixed(1)}km` : `${meters}m`;
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return hours > 0 ? `${hours}h ${remainingMinutes}m` : `${remainingMinutes}m`;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'endurance': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'interval': return 'bg-red-50 text-red-700 border-red-200';
      case 'recovery': return 'bg-green-50 text-green-700 border-green-200';
      case 'strength': return 'bg-purple-50 text-purple-700 border-purple-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
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
                  <h1 className="text-3xl font-bold text-ayger-navy">Training Plans</h1>
                  <p className="text-muted-foreground">
                    Create and manage training programs for your athletes
                  </p>
                </div>
                <Button onClick={() => setShowCreateForm(!showCreateForm)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Plan
                </Button>
              </div>

              {/* Create Workout Form */}
              {showCreateForm && (
                <Card className="animate-fade-in">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Create Training Plan
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Athlete Selection */}
                    <div>
                      <Label className="text-base font-medium mb-3 block">Select Athletes</Label>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="select-all"
                            checked={selectedAthletes.length === athletes.length}
                            onCheckedChange={handleSelectAll}
                          />
                          <Label htmlFor="select-all" className="font-medium">
                            Select All Athletes ({athletes.length})
                          </Label>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {athletes.map((athlete) => (
                            <div 
                              key={athlete.id} 
                              className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                            >
                              <Checkbox
                                id={athlete.id}
                                checked={selectedAthletes.includes(athlete.id)}
                                onCheckedChange={(checked) => handleAthleteSelection(athlete.id, checked as boolean)}
                              />
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={athlete.profileImage} alt={athlete.name} />
                                <AvatarFallback className="text-xs">
                                  {athlete.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <Label htmlFor={athlete.id} className="flex-1 cursor-pointer">
                                {athlete.name}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Workout Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="workout-name">Workout Name</Label>
                          <Input
                            id="workout-name"
                            value={workoutForm.name}
                            onChange={(e) => setWorkoutForm(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="e.g., Morning Steady State"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="workout-date">Date</Label>
                          <Input
                            id="workout-date"
                            type="date"
                            value={workoutForm.date}
                            onChange={(e) => setWorkoutForm(prev => ({ ...prev, date: e.target.value }))}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="sport">Sport</Label>
                          <Select 
                            value={workoutForm.sport} 
                            onValueChange={(value: 'rowing' | 'cycling') => setWorkoutForm(prev => ({ ...prev, sport: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="rowing">Rowing</SelectItem>
                              <SelectItem value="cycling">Cycling</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="target-distance">Target Distance (meters)</Label>
                          <Input
                            id="target-distance"
                            type="number"
                            value={workoutForm.targetDistance}
                            onChange={(e) => setWorkoutForm(prev => ({ ...prev, targetDistance: e.target.value }))}
                            placeholder="e.g., 8000"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="target-duration">Target Duration (minutes)</Label>
                          <Input
                            id="target-duration"
                            type="number"
                            value={workoutForm.targetDuration}
                            onChange={(e) => setWorkoutForm(prev => ({ ...prev, targetDuration: e.target.value }))}
                            placeholder="e.g., 40"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="notes">Notes & Instructions</Label>
                      <Textarea
                        id="notes"
                        value={workoutForm.notes}
                        onChange={(e) => setWorkoutForm(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="Add any specific instructions, technique focus, or goals..."
                        rows={3}
                      />
                    </div>

                    <div className="flex justify-end gap-3">
                      <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateWorkout}>
                        <Save className="h-4 w-4 mr-2" />
                        Create Training Plan
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Workout Templates */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-ayger-navy">Workout Templates</h2>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search templates..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Select value={filterCategory} onValueChange={setFilterCategory}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="endurance">Endurance</SelectItem>
                        <SelectItem value="interval">Intervals</SelectItem>
                        <SelectItem value="recovery">Recovery</SelectItem>
                        <SelectItem value="strength">Strength</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTemplates.map((template) => (
                    <Card key={template.id} className="hover:shadow-md transition-shadow group">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg">{template.name}</CardTitle>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline" className="capitalize">
                                {template.sport}
                              </Badge>
                              <Badge className={getCategoryColor(template.category)}>
                                {template.category}
                              </Badge>
                            </div>
                          </div>
                          <BookOpen className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          {template.targetDistance && (
                            <div className="flex items-center gap-1">
                              <Ruler className="h-3 w-3 text-muted-foreground" />
                              <span>{formatDistance(template.targetDistance)}</span>
                            </div>
                          )}
                          {template.targetDuration && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              <span>{formatDuration(template.targetDuration)}</span>
                            </div>
                          )}
                        </div>
                        
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {template.notes}
                        </p>
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => {
                            handleTemplateSelect(template);
                            setShowCreateForm(true);
                          }}
                        >
                          <Copy className="h-3 w-3 mr-2" />
                          Use Template
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {filteredTemplates.length === 0 && (
                  <div className="text-center py-12">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-medium mb-2">No templates found</h3>
                    <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}