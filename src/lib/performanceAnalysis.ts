import { AthleteSession, AthleteSessionSummary, AggregatedTrends } from '../types';

// Helper to parse CSV text into array of objects
function parseCSV<T>(csvText: string, rowParser: (row: string[]) => T): T[] {
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

// Parse a log row into a log object
interface LogRow {
  filename: string;
  startTime: number;
  delta: number;
  distance: number;
  strokerate: number;
  heartrate?: number;
  longitude?: number;
  latitude?: number;
}

function parseLogRow(row: string[]): LogRow {
  return {
    filename: row[0],
    startTime: parseInt(row[1]),
    delta: parseInt(row[2]),
    distance: parseFloat(row[3]),
    strokerate: parseInt(row[4]),
    heartrate: row[5] ? parseInt(row[5]) : undefined,
    longitude: row[6] ? parseFloat(row[6]) : undefined,
    latitude: row[7] ? parseFloat(row[7]) : undefined,
  };
}

// Fetch all sessions for an athlete from a specific CSV file
export async function fetchAthleteSessionsFromCsv(csvPath: string): Promise<AthleteSession[]> {
  const res = await fetch(csvPath);
  const text = await res.text();
  const lines = text.trim().split('\n');
  const headers = lines[0].split(',');
  // Map: sessionId -> { ...arrays }
  const sessions: Record<string, Omit<AthleteSession, 'filename'> & { filename: string }> = {};
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i] || lines[i].trim() === '') continue; // Skip empty lines
    const row = lines[i].split(',');
    if (row.length < headers.length) continue; // Skip malformed rows

    const filename = row[0];
    const startTime = parseInt(row[1]);
    const delta = parseFloat(row[2]);
    const distance = parseFloat(row[3]); // distance is column 3 in original format
    const strokerate = parseFloat(row[4]); // strokerate is column 4 in original format
    const heartrate = parseFloat(row[5]); // heartrate is column 5 in original format
    const longitude = row[6] ? parseFloat(row[6]) : undefined;
    const latitude = row[7] ? parseFloat(row[7]) : undefined;
    const sessionKey = filename + '_' + startTime;
    if (!sessions[sessionKey]) {
      sessions[sessionKey] = {
        filename,
        startTime,
        delta: [],
        distance: [],
        strokerate: [],
        heartrate: [],
        longitude: [],
        latitude: [],
      };
    }
    sessions[sessionKey].delta.push(delta);
    sessions[sessionKey].distance.push(distance);
    sessions[sessionKey].strokerate.push(strokerate);
    sessions[sessionKey].heartrate!.push(heartrate);
    if (longitude !== undefined) sessions[sessionKey].longitude!.push(longitude);
    if (latitude !== undefined) sessions[sessionKey].latitude!.push(latitude);
  }
  return Object.values(sessions);
}

// Get a single session by ID
export async function getAthleteSessionById(filename: string): Promise<AthleteSession | null> {
  // TODO: Implement lookup
  return null;
}

// Summarize a session for list view
export function summarizeSession(session: AthleteSession): AthleteSessionSummary {
  // TODO: Implement summary logic
  return {
    filename: session.filename,
    date: new Date(session.startTime * 1000).toISOString().slice(0, 10),
    duration: Math.max(...session.delta),
    totalDistance: session.distance[session.distance.length - 1] || 0,
    avgStrokeRate: session.strokerate.reduce((a, b) => a + b, 0) / session.strokerate.length,
    avgHeartRate: session.heartrate && session.heartrate.length > 0 ? session.heartrate.reduce((a, b) => a + b, 0) / session.heartrate.length : undefined,
  };
}

// Aggregate stats for weekly/monthly trends
export function aggregateTrends(sessions: AthleteSession[], period: 'week' | 'month'): AggregatedTrends[] {
  if (!sessions.length) return [];
  // Helper to get period key
  function getPeriodKey(date: Date) {
    if (period === 'week') {
      const year = date.getFullYear();
      const week = Math.ceil(((date.getTime() - new Date(date.getFullYear(), 0, 1).getTime()) / 86400000 + new Date(date.getFullYear(), 0, 1).getDay() + 1) / 7);
      return `${year}-W${week.toString().padStart(2, '0')}`;
    } else {
      return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    }
  }
  // Group sessions
  const groups: Record<string, AthleteSession[]> = {};
  sessions.forEach(s => {
    const date = new Date(s.startTime * 1000);
    const key = getPeriodKey(date);
    if (!groups[key]) groups[key] = [];
    groups[key].push(s);
  });
  // Aggregate
  return Object.entries(groups).map(([key, group]) => {
    const allSR = group.flatMap(s => s.strokerate);
    const allDist = group.map(s => s.distance[s.distance.length - 1] || 0);
    return {
      [period]: key,
      avgStrokeRate: allSR.length ? allSR.reduce((a, b) => a + b, 0) / allSR.length : 0,
      totalDistance: allDist.reduce((a, b) => a + b, 0),
      sessionCount: group.length,
    };
  }).sort((a, b) => a[period].localeCompare(b[period]));
}

class PerformanceAnalysis {
  private sessions: AthleteSession[] = [];

  setSessions(sessions: AthleteSession[]) {
    this.sessions = sessions.filter(s => s.distance > 0 && s.duration > 0);
  }

  getPerformanceMetrics(): PerformanceMetrics {
    if (this.sessions.length === 0) {
      return this.getEmptyMetrics();
    }

    const validSessions = this.sessions.filter(s => s.distance > 0);
    const sortedByDate = [...validSessions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    // Basic calculations
    const totalDistance = validSessions.reduce((sum, s) => sum + s.distance, 0);
    const totalDuration = validSessions.reduce((sum, s) => sum + s.duration, 0);
    const avgPace = validSessions.reduce((sum, s) => sum + s.avgPace, 0) / validSessions.length;
    const avgStrokeRate = validSessions.reduce((sum, s) => sum + s.avgStrokeRate, 0) / validSessions.length;
    const avgHeartRate = validSessions.reduce((sum, s) => sum + s.avgHeartRate, 0) / validSessions.length;

    // Personal Bests
    const fastestPace = validSessions.reduce((best, s) => s.avgPace < best.avgPace ? s : best);
    const longestDistance = validSessions.reduce((best, s) => s.distance > best.distance ? s : best);
    const longestDuration = validSessions.reduce((best, s) => s.duration > best.duration ? s : best);
    const highestStrokeRate = validSessions.reduce((best, s) => s.maxStrokeRate > best.maxStrokeRate ? s : best);
    const highestHeartRate = validSessions.reduce((best, s) => s.maxHeartRate > best.maxHeartRate ? s : best);

    // Heart Rate Zones
    const heartRateZones = this.calculateHeartRateZones(validSessions);

    // Trends (comparing first half vs second half of sessions)
    const midPoint = Math.floor(sortedByDate.length / 2);
    const firstHalf = sortedByDate.slice(0, midPoint);
    const secondHalf = sortedByDate.slice(midPoint);
    
    const paceTrend = this.calculateTrend(
      firstHalf.reduce((sum, s) => sum + s.avgPace, 0) / firstHalf.length,
      secondHalf.reduce((sum, s) => sum + s.avgPace, 0) / secondHalf.length,
      'pace'
    );
    
    const strokeRateTrend = this.calculateTrend(
      firstHalf.reduce((sum, s) => sum + s.avgStrokeRate, 0) / firstHalf.length,
      secondHalf.reduce((sum, s) => sum + s.avgStrokeRate, 0) / secondHalf.length,
      'strokeRate'
    );
    
    const distanceTrend = this.calculateTrend(
      firstHalf.reduce((sum, s) => sum + s.distance, 0) / firstHalf.length,
      secondHalf.reduce((sum, s) => sum + s.distance, 0) / secondHalf.length,
      'distance'
    );

    // Consistency metrics
    const weeklySessions = this.calculateWeeklySessions(validSessions);
    const avgSessionDuration = totalDuration / validSessions.length;
    const mostFrequentDistance = this.getMostFrequentDistance(validSessions);
    const preferredTrainingType = this.getPreferredTrainingType(validSessions);

    // Progress analysis
    const lastMonthDistance = this.getLastMonthDistance(validSessions);
    const lastMonthSessions = this.getLastMonthSessions(validSessions);
    const monthOverMonthGrowth = this.calculateMonthOverMonthGrowth(validSessions);
    const weeklyAverage = totalDistance / (validSessions.length / weeklySessions);

    return {
      totalSessions: validSessions.length,
      totalDistance,
      totalDuration,
      avgPace,
      avgStrokeRate,
      avgHeartRate,
      paceTrend,
      strokeRateTrend,
      distanceTrend,
      personalBests: {
        fastestPace: { value: fastestPace.avgPace, session: fastestPace.id, date: fastestPace.date },
        longestDistance: { value: longestDistance.distance, session: longestDistance.id, date: longestDistance.date },
        longestDuration: { value: longestDuration.duration, session: longestDuration.id, date: longestDuration.date },
        highestStrokeRate: { value: highestStrokeRate.maxStrokeRate, session: highestStrokeRate.id, date: highestStrokeRate.date },
        highestHeartRate: { value: highestHeartRate.maxHeartRate, session: highestHeartRate.id, date: highestHeartRate.date }
      },
      heartRateZones,
      consistency: {
        weeklySessions,
        avgSessionDuration,
        mostFrequentDistance,
        preferredTrainingType
      },
      progress: {
        lastMonthDistance,
        lastMonthSessions,
        monthOverMonthGrowth,
        weeklyAverage
      }
    };
  }

  getSessionAnalysis(sessionId: string): SessionAnalysis | null {
    const session = this.sessions.find(s => s.id === sessionId);
    if (!session) return null;

    const heartRateZones = this.calculateSessionHeartRateZones(session);
    const efficiency = session.avgPace / session.avgStrokeRate;
    const consistency = this.calculatePaceConsistency(session);
    const intensity = session.avgHeartRate / 180; // Assuming max HR of 180

    return {
      sessionId: session.id,
      date: session.date,
      distance: session.distance,
      duration: session.duration,
      avgPace: session.avgPace,
      avgStrokeRate: session.avgStrokeRate,
      avgHeartRate: session.avgHeartRate,
      maxHeartRate: session.maxHeartRate,
      maxStrokeRate: session.maxStrokeRate,
      heartRateZones,
      efficiency,
      consistency,
      intensity
    };
  }

  getTrainingRecommendations(): TrainingRecommendations {
    const metrics = this.getPerformanceMetrics();
    const recentSessions = this.sessions
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3);

    // Calculate recommended next session
    const avgRecentDistance = recentSessions.reduce((sum, s) => sum + s.distance, 0) / recentSessions.length;
    const avgRecentPace = recentSessions.reduce((sum, s) => sum + s.avgPace, 0) / recentSessions.length;
    
    const recommendedDistance = Math.round(avgRecentDistance * 1.1); // 10% increase
    const recommendedDuration = Math.round((recommendedDistance / avgRecentDistance) * recentSessions[0]?.duration || 30);
    const targetPace = avgRecentPace * 0.98; // 2% improvement
    const targetHeartRate = Math.round(metrics.avgHeartRate * 1.05); // 5% increase

    // Generate insights
    const improvements = this.generateImprovements(metrics);
    const strengths = this.generateStrengths(metrics);
    const areas = this.generateAreas(metrics);

    return {
      nextSession: {
        recommendedDistance,
        recommendedDuration,
        targetPace,
        targetHeartRate,
        reasoning: `Based on your recent ${recentSessions.length} sessions, we recommend a ${recommendedDistance}m session targeting ${this.formatPace(targetPace)} pace.`
      },
      improvements,
      strengths,
      areas
    };
  }

  private getEmptyMetrics(): PerformanceMetrics {
    return {
      totalSessions: 0,
      totalDistance: 0,
      totalDuration: 0,
      avgPace: 0,
      avgStrokeRate: 0,
      avgHeartRate: 0,
      paceTrend: 'stable',
      strokeRateTrend: 'stable',
      distanceTrend: 'stable',
      personalBests: {
        fastestPace: { value: 0, session: '', date: '' },
        longestDistance: { value: 0, session: '', date: '' },
        longestDuration: { value: 0, session: '', date: '' },
        highestStrokeRate: { value: 0, session: '', date: '' },
        highestHeartRate: { value: 0, session: '', date: '' }
      },
      heartRateZones: {
        recovery: { sessions: 0, percentage: 0 },
        aerobic: { sessions: 0, percentage: 0 },
        threshold: { sessions: 0, percentage: 0 },
        anaerobic: { sessions: 0, percentage: 0 },
        max: { sessions: 0, percentage: 0 }
      },
      consistency: {
        weeklySessions: 0,
        avgSessionDuration: 0,
        mostFrequentDistance: '',
        preferredTrainingType: ''
      },
      progress: {
        lastMonthDistance: 0,
        lastMonthSessions: 0,
        monthOverMonthGrowth: 0,
        weeklyAverage: 0
      }
    };
  }

  private calculateHeartRateZones(sessions: AthleteSession[]) {
    const zones = { recovery: 0, aerobic: 0, threshold: 0, anaerobic: 0, max: 0 };
    
    sessions.forEach(session => {
      if (session.avgHeartRate < 120) zones.recovery++;
      else if (session.avgHeartRate < 140) zones.aerobic++;
      else if (session.avgHeartRate < 160) zones.threshold++;
      else if (session.avgHeartRate < 180) zones.anaerobic++;
      else zones.max++;
    });

    const total = sessions.length;
    return {
      recovery: { sessions: zones.recovery, percentage: (zones.recovery / total) * 100 },
      aerobic: { sessions: zones.aerobic, percentage: (zones.aerobic / total) * 100 },
      threshold: { sessions: zones.threshold, percentage: (zones.threshold / total) * 100 },
      anaerobic: { sessions: zones.anaerobic, percentage: (zones.anaerobic / total) * 100 },
      max: { sessions: zones.max, percentage: (zones.max / total) * 100 }
    };
  }

  private calculateSessionHeartRateZones(session: AthleteSession) {
    const zones = { recovery: 0, aerobic: 0, threshold: 0, anaerobic: 0, max: 0 };
    
    session.rawData.forEach(log => {
      if (log.heartrate < 120) zones.recovery++;
      else if (log.heartrate < 140) zones.aerobic++;
      else if (log.heartrate < 160) zones.threshold++;
      else if (log.heartrate < 180) zones.anaerobic++;
      else zones.max++;
    });

    const total = session.rawData.length;
    return {
      recovery: (zones.recovery / total) * 100,
      aerobic: (zones.aerobic / total) * 100,
      threshold: (zones.threshold / total) * 100,
      anaerobic: (zones.anaerobic / total) * 100,
      max: (zones.max / total) * 100
    };
  }

  private calculateTrend(firstHalf: number, secondHalf: number, metric: string): 'improving' | 'declining' | 'stable' {
    const difference = secondHalf - firstHalf;
    const threshold = 0.05; // 5% threshold

    if (metric === 'pace') {
      // Lower pace is better for rowing
      return difference < -threshold ? 'improving' : difference > threshold ? 'declining' : 'stable';
    } else {
      // Higher values are better for distance and stroke rate
      return difference > threshold ? 'improving' : difference < -threshold ? 'declining' : 'stable';
    }
  }

  private calculateWeeklySessions(sessions: AthleteSession[]): number {
    if (sessions.length === 0) return 0;
    
    const firstDate = new Date(sessions[0].date);
    const lastDate = new Date(sessions[sessions.length - 1].date);
    const weeks = Math.max(1, Math.ceil((lastDate.getTime() - firstDate.getTime()) / (7 * 24 * 60 * 60 * 1000)));
    
    return Math.round(sessions.length / weeks);
  }

  private getMostFrequentDistance(sessions: AthleteSession[]): string {
    const distanceRanges = {
      '0-1km': 0,
      '1-2km': 0,
      '2-5km': 0,
      '5km+': 0
    };

    sessions.forEach(session => {
      if (session.distance < 1000) distanceRanges['0-1km']++;
      else if (session.distance < 2000) distanceRanges['1-2km']++;
      else if (session.distance < 5000) distanceRanges['2-5km']++;
      else distanceRanges['5km+']++;
    });

    const maxRange = Object.entries(distanceRanges).reduce((a, b) => a[1] > b[1] ? a : b);
    return maxRange[0];
  }

  private getPreferredTrainingType(sessions: AthleteSession[]): string {
    const types = sessions.map(s => s.type || 'FREE');
    const typeCount = types.reduce((acc, type) => {
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const maxType = Object.entries(typeCount).reduce((a, b) => a[1] > b[1] ? a : b);
    return maxType[0];
  }

  private getLastMonthDistance(sessions: AthleteSession[]): number {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    
    return sessions
      .filter(s => new Date(s.date) >= oneMonthAgo)
      .reduce((sum, s) => sum + s.distance, 0);
  }

  private getLastMonthSessions(sessions: AthleteSession[]): number {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    
    return sessions.filter(s => new Date(s.date) >= oneMonthAgo).length;
  }

  private calculateMonthOverMonthGrowth(sessions: AthleteSession[]): number {
    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
    
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    
    const previousMonth = sessions
      .filter(s => new Date(s.date) >= twoMonthsAgo && new Date(s.date) < oneMonthAgo)
      .reduce((sum, s) => sum + s.distance, 0);
    
    const currentMonth = this.getLastMonthDistance(sessions);
    
    if (previousMonth === 0) return 0;
    return ((currentMonth - previousMonth) / previousMonth) * 100;
  }

  private calculatePaceConsistency(session: AthleteSession): number {
    if (session.data.length < 2) return 1;
    
    const paces = session.data.map(d => d.pace).filter(p => p > 0);
    if (paces.length < 2) return 1;
    
    const mean = paces.reduce((sum, p) => sum + p, 0) / paces.length;
    const variance = paces.reduce((sum, p) => sum + Math.pow(p - mean, 2), 0) / paces.length;
    const stdDev = Math.sqrt(variance);
    
    // Return consistency as a percentage (lower std dev = higher consistency)
    return Math.max(0, 100 - (stdDev / mean) * 100);
  }

  private generateImprovements(metrics: PerformanceMetrics): string[] {
    const improvements = [];
    
    if (metrics.consistency.weeklySessions < 3) {
      improvements.push('Increase training frequency to 3+ sessions per week');
    }
    
    if (metrics.heartRateZones.recovery.percentage > 50) {
      improvements.push('Include more high-intensity training sessions');
    }
    
    if (metrics.avgPace > 150) {
      improvements.push('Focus on technique to improve pace efficiency');
    }
    
    if (metrics.consistency.avgSessionDuration < 20) {
      improvements.push('Gradually increase session duration for better endurance');
    }
    
    return improvements;
  }

  private generateStrengths(metrics: PerformanceMetrics): string[] {
    const strengths = [];
    
    if (metrics.consistency.weeklySessions >= 3) {
      strengths.push('Consistent training schedule');
    }
    
    if (metrics.heartRateZones.threshold.percentage > 20) {
      strengths.push('Good threshold training balance');
    }
    
    if (metrics.paceTrend === 'improving') {
      strengths.push('Pace is improving over time');
    }
    
    if (metrics.consistency.avgSessionDuration > 30) {
      strengths.push('Good endurance base');
    }
    
    return strengths;
  }

  private generateAreas(metrics: PerformanceMetrics): string[] {
    const areas = [];
    
    if (metrics.heartRateZones.max.percentage > 10) {
      areas.push('Heart rate management');
    }
    
    if (metrics.avgStrokeRate > 30) {
      areas.push('Stroke rate efficiency');
    }
    
    if (metrics.consistency.weeklySessions < 2) {
      areas.push('Training consistency');
    }
    
    return areas;
  }

  private formatPace(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }
}

export const performanceAnalysis = new PerformanceAnalysis(); 