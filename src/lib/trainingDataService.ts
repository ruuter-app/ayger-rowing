import { Session, SessionDataPoint } from '../types';

export interface TrainingSession {
  filename: string;
  startTime: number;
  startDateTime: string;
  duration: number;
  distance: number;
  type: string;
  mode: string;
  splitDistance: number;
  restDuration: number;
  numLogs: number;
}

export interface TrainingLog {
  filename: string;
  startTime: number;
  delta: number;
  distance: number;
  strokerate: number;
  heartrate: number;
  longitude: string;
  latitude: string;
}

export interface ProcessedSession extends Session {
  rawData: TrainingLog[];
  avgHeartRate: number;
  maxHeartRate: number;
  maxStrokeRate: number;
  totalStrokes: number;
}

class TrainingDataService {
  private sessions: TrainingSession[] = [];
  private logs: TrainingLog[] = [];
  private processedSessions: ProcessedSession[] = [];

  async loadTrainingData(): Promise<ProcessedSession[]> {
    try {
      // Load session summary data
      const sessionResponse = await fetch('/takatomo-training-data/training_data.csv');
      const sessionText = await sessionResponse.text();
      this.sessions = this.parseCSV(sessionText, this.parseSessionRow);

      // Load detailed logs
      const logsResponse = await fetch('/takatomo-training-data/training_logs.csv');
      const logsText = await logsResponse.text();
      this.logs = this.parseCSV(logsText, this.parseLogRow);

      // Process sessions
      this.processedSessions = this.sessions
        .filter(session => session.duration > 0 && session.distance > 0)
        .map(session => this.processSession(session));

      return this.processedSessions;
    } catch (error) {
      console.error('Error loading training data:', error);
      return [];
    }
  }

  private parseCSV<T>(csvText: string, rowParser: (row: string[]) => T): T[] {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',');
    const data: T[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      if (values.length === headers.length) {
        data.push(rowParser(values));
      }
    }

    return data;
  }

  private parseSessionRow(row: string[]): TrainingSession {
    return {
      filename: row[0],
      startTime: parseInt(row[1]),
      startDateTime: row[2],
      duration: parseInt(row[3]),
      distance: parseFloat(row[4]),
      type: row[5],
      mode: row[6],
      splitDistance: parseInt(row[7]),
      restDuration: parseInt(row[8]),
      numLogs: parseInt(row[9])
    };
  }

  private parseLogRow(row: string[]): TrainingLog {
    return {
      filename: row[0],
      startTime: parseInt(row[1]),
      delta: parseInt(row[2]),
      distance: parseFloat(row[3]),
      strokerate: parseInt(row[4]),
      heartrate: parseInt(row[5]),
      longitude: row[6],
      latitude: row[7]
    };
  }

  private processSession(session: TrainingSession): ProcessedSession {
    const sessionLogs = this.logs.filter(log => log.filename === session.filename);
    
    // Convert logs to session data points
    const dataPoints: SessionDataPoint[] = sessionLogs.map(log => ({
      time: log.delta / 1000, // Convert to seconds
      pace: this.calculatePace(log.distance, log.delta),
      strokeRate: log.strokerate,
      cadence: log.strokerate * 2, // Approximate cadence from stroke rate
      distance: log.distance,
      heartRate: log.heartrate
    }));

    // Calculate averages and stats
    const validHeartRates = sessionLogs.filter(log => log.heartrate > 0).map(log => log.heartrate);
    const validStrokeRates = sessionLogs.filter(log => log.strokerate > 0).map(log => log.strokerate);
    
    const avgHeartRate = validHeartRates.length > 0 
      ? validHeartRates.reduce((sum, hr) => sum + hr, 0) / validHeartRates.length 
      : 0;
    
    const maxHeartRate = validHeartRates.length > 0 ? Math.max(...validHeartRates) : 0;
    const maxStrokeRate = validStrokeRates.length > 0 ? Math.max(...validStrokeRates) : 0;
    
    // Calculate total strokes (approximate)
    const totalStrokes = validStrokeRates.reduce((sum, sr) => sum + sr * (session.duration / 60), 0);

    return {
      id: session.filename,
      athleteId: 'takatomo',
      date: session.startDateTime.split('T')[0],
      duration: session.duration / 60, // Convert to minutes
      distance: session.distance,
      avgPace: this.calculateAveragePace(session.distance, session.duration),
      avgStrokeRate: validStrokeRates.length > 0 
        ? validStrokeRates.reduce((sum, sr) => sum + sr, 0) / validStrokeRates.length 
        : 0,
      avgCadence: validStrokeRates.length > 0 
        ? validStrokeRates.reduce((sum, sr) => sum + sr, 0) / validStrokeRates.length * 2 
        : 0,
      fileName: session.filename,
      data: dataPoints,
      notes: `${session.type} training session`,
      rawData: sessionLogs,
      avgHeartRate,
      maxHeartRate,
      maxStrokeRate,
      totalStrokes: Math.round(totalStrokes)
    };
  }

  private calculatePace(distance: number, deltaMs: number): number {
    if (distance <= 0 || deltaMs <= 0) return 0;
    const timeSeconds = deltaMs / 1000;
    const pacePer500m = (timeSeconds / distance) * 500;
    return Math.max(60, Math.min(300, pacePer500m)); // Clamp between 1:00 and 5:00 per 500m
  }

  private calculateAveragePace(distance: number, durationSeconds: number): number {
    if (distance <= 0 || durationSeconds <= 0) return 0;
    const pacePer500m = (durationSeconds / distance) * 500;
    return Math.max(60, Math.min(300, pacePer500m));
  }

  getSessionStats(): {
    totalSessions: number;
    totalDistance: number;
    totalDuration: number;
    avgPace: number;
    avgHeartRate: number;
    maxDistance: number;
    longestSession: number;
  } {
    if (this.processedSessions.length === 0) {
      return {
        totalSessions: 0,
        totalDistance: 0,
        totalDuration: 0,
        avgPace: 0,
        avgHeartRate: 0,
        maxDistance: 0,
        longestSession: 0
      };
    }

    const totalDistance = this.processedSessions.reduce((sum, session) => sum + session.distance, 0);
    const totalDuration = this.processedSessions.reduce((sum, session) => sum + session.duration, 0);
    const totalPace = this.processedSessions.reduce((sum, session) => sum + session.avgPace, 0);
    const totalHeartRate = this.processedSessions.reduce((sum, session) => sum + session.avgHeartRate, 0);
    const maxDistance = Math.max(...this.processedSessions.map(s => s.distance));
    const longestSession = Math.max(...this.processedSessions.map(s => s.duration));

    return {
      totalSessions: this.processedSessions.length,
      totalDistance,
      totalDuration: Math.round(totalDuration * 100) / 100, // Round to 2 decimal places
      avgPace: Math.round(totalPace / this.processedSessions.length * 100) / 100,
      avgHeartRate: Math.round(totalHeartRate / this.processedSessions.length * 100) / 100,
      maxDistance,
      longestSession: Math.round(longestSession * 100) / 100
    };
  }

  getSessionsByDateRange(startDate: string, endDate: string): ProcessedSession[] {
    return this.processedSessions.filter(session => {
      const sessionDate = new Date(session.date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return sessionDate >= start && sessionDate <= end;
    });
  }

  getRecentSessions(limit: number = 5): ProcessedSession[] {
    return this.processedSessions
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  }
}

export const trainingDataService = new TrainingDataService(); 