import { User, Session, PlannedWorkout, AthleteStats } from '../types';

export const mockUsers: User[] = [
  {
    id: 'athlete1',
    email: 'sarah.jones@email.com',
    name: 'Sarah Jones',
    role: 'athlete',
    profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b8a8b0a5?w=100&h=100&fit=crop&crop=face'
  },
  {
    id: 'athlete2',
    email: 'mike.chen@email.com',
    name: 'Mike Chen',
    role: 'athlete',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
  },
  {
    id: 'coach1',
    email: 'coach.thompson@email.com',
    name: 'Coach Thompson',
    role: 'coach',
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
  }
];

export const mockSessions: Session[] = [
  {
    id: 'session1',
    athleteId: 'athlete1',
    date: '2024-01-15',
    duration: 45,
    distance: 8000,
    avgPace: 125, // 2:05 per 500m
    avgStrokeRate: 22,
    avgCadence: 85,
    fileName: 'morning_row_2024-01-15.csv',
    data: generateMockSessionData(45, 8000),
    notes: 'Great steady state session'
  },
  {
    id: 'session2',
    athleteId: 'athlete1',
    date: '2024-01-12',
    duration: 30,
    distance: 6000,
    avgPace: 120, // 2:00 per 500m
    avgStrokeRate: 24,
    avgCadence: 88,
    fileName: 'interval_training_2024-01-12.csv',
    data: generateMockSessionData(30, 6000),
    notes: 'Interval training - 6x500m'
  },
  {
    id: 'session3',
    athleteId: 'athlete2',
    date: '2024-01-14',
    duration: 60,
    distance: 12000,
    avgPace: 130, // 2:10 per 500m
    avgStrokeRate: 20,
    avgCadence: 82,
    fileName: 'long_row_2024-01-14.csv',
    data: generateMockSessionData(60, 12000),
    notes: 'Long endurance piece'
  }
];

export const mockPlannedWorkouts: PlannedWorkout[] = [
  {
    id: 'plan1',
    athleteId: 'athlete1',
    coachId: 'coach1',
    date: '2024-01-16',
    name: 'Morning Steady State',
    sport: 'rowing',
    targetDistance: 8000,
    targetDuration: 40,
    notes: 'Focus on technique and consistent pace',
    completed: false
  },
  {
    id: 'plan2',
    athleteId: 'athlete1',
    coachId: 'coach1',
    date: '2024-01-18',
    name: 'Sprint Intervals',
    sport: 'rowing',
    targetDistance: 5000,
    notes: '8x250m at race pace with 90s rest',
    completed: false
  },
  {
    id: 'plan3',
    athleteId: 'athlete2',
    coachId: 'coach1',
    date: '2024-01-17',
    name: 'Endurance Build',
    sport: 'rowing',
    targetDistance: 15000,
    targetDuration: 75,
    notes: 'Build to 2K+8 pace for final 20 minutes',
    completed: false
  }
];

export const mockAthleteStats: Record<string, AthleteStats> = {
  athlete1: {
    totalSessions: 12,
    totalDistance: 96000,
    totalDuration: 480,
    avgPace: 122,
    lastActivity: '2024-01-15',
    planCompliance: 85
  },
  athlete2: {
    totalSessions: 8,
    totalDistance: 78000,
    totalDuration: 420,
    avgPace: 128,
    lastActivity: '2024-01-14',
    planCompliance: 92
  }
};

function generateMockSessionData(durationMinutes: number, totalDistance: number) {
  const points = [];
  const dataPoints = Math.floor(durationMinutes * 2); // data point every 30 seconds
  
  for (let i = 0; i <= dataPoints; i++) {
    const time = i * 30; // seconds
    const progress = i / dataPoints;
    
    // Generate realistic rowing data with some variation
    const basePace = 120 + Math.sin(progress * Math.PI * 2) * 10 + (Math.random() - 0.5) * 8;
    const baseStrokeRate = 22 + Math.sin(progress * Math.PI * 3) * 3 + (Math.random() - 0.5) * 2;
    const baseCadence = 85 + Math.sin(progress * Math.PI * 2.5) * 5 + (Math.random() - 0.5) * 3;
    
    points.push({
      time,
      pace: Math.max(90, Math.min(150, basePace)),
      strokeRate: Math.max(18, Math.min(32, baseStrokeRate)),
      cadence: Math.max(75, Math.min(95, baseCadence)),
      distance: (totalDistance * progress),
      heartRate: Math.floor(140 + Math.sin(progress * Math.PI) * 20 + (Math.random() - 0.5) * 10)
    });
  }
  
  return points;
}

// Auth state management
let currentUser: User | null = null;

export const mockAuth = {
  getCurrentUser: () => currentUser,
  login: (email: string, password: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = mockUsers.find(u => u.email === email);
        if (user && password === 'password') {
          currentUser = user;
          resolve(user);
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 1000);
    });
  },
  logout: () => {
    currentUser = null;
  }
};