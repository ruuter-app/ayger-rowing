export interface User {
  id: string;
  email: string;
  name: string;
  role: 'athlete' | 'coach';
  profileImage?: string;
}

export interface Athlete extends User {
  role: 'athlete';
  coachId?: string;
}

export interface Coach extends User {
  role: 'coach';
  athletes: string[]; // athlete IDs
}

export interface Session {
  id: string;
  athleteIds: string[]; // Multiple athletes can be matched to a single session
  date: string;
  duration: number; // in minutes
  distance: number; // in meters
  avgPace: number; // seconds per 500m
  avgStrokeRate: number;
  avgCadence: number;
  fileName: string;
  data: SessionDataPoint[];
  notes?: string;
  deviceId?: string; // Device that recorded the session
}

export interface SessionDataPoint {
  time: number; // seconds
  pace: number; // seconds per 500m
  strokeRate: number;
  cadence: number;
  distance: number; // cumulative meters
  heartRate?: number;
}

export interface PlannedWorkout {
  id: string;
  athleteId: string;
  coachId: string;
  date: string;
  name: string;
  sport: 'rowing' | 'cycling';
  targetDistance?: number;
  targetDuration?: number;
  notes?: string;
  completed: boolean;
  completedDate?: string;
}

export interface AthleteStats {
  totalSessions: number;
  totalDistance: number;
  totalDuration: number;
  avgPace: number;
  lastActivity: string;
  planCompliance: number; // percentage
}

// Athlete session data structure
export interface AthleteSession {
  filename: string; // Session ID
  startTime: number; // POSIX timestamp
  delta: number[]; // Elapsed time (seconds) per record
  distance: number[]; // Meters per record
  strokerate: number[]; // SPM per record
  heartrate?: number[]; // BPM per record (optional)
  latitude?: number[]; // GPS latitude (optional)
  longitude?: number[]; // GPS longitude (optional)
}

// Summary of a session for list views
export interface AthleteSessionSummary {
  filename: string;
  date: string; // ISO date string
  duration: number; // seconds
  totalDistance: number; // meters
  avgStrokeRate: number;
  avgHeartRate?: number;
}

// Aggregated trends for dashboard
export interface AggregatedTrends {
  week: string; // e.g. '2024-W23'
  avgStrokeRate: number;
  totalDistance: number;
  sessionCount: number;
}

// Coach invitation system
export interface AthleteInvitation {
  id: string;
  email: string;
  invitedBy: string; // coach ID
  invitedAt: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  expiresAt: string;
  athleteId?: string; // Set when invitation is accepted
}

// Athlete comparison data
export interface AthleteComparison {
  athleteId: string;
  athleteName: string;
  metrics: {
    avgPace: number;
    avgStrokeRate: number;
    totalDistance: number;
    totalSessions: number;
    planCompliance: number;
  };
  trend: {
    week: string;
    avgStrokeRate: number;
    totalDistance: number;
  }[];
}

// Device and session matching
export interface Device {
  id: string;
  name: string;
  type: 'rowing_machine' | 'bike' | 'other';
  location?: string;
  isActive: boolean;
}

export interface SessionDevice {
  sessionId: string;
  deviceId: string;
  startTime: string;
  endTime?: string;
  athletes: string[]; // Multiple athletes can use the same device
}