import { trainingDataService } from './trainingDataService';

// Test function to verify training data loading
export async function testTrainingData() {
  try {
    console.log('Loading training data...');
    const sessions = await trainingDataService.loadTrainingData();
    console.log(`Loaded ${sessions.length} training sessions`);
    
    if (sessions.length > 0) {
      const stats = trainingDataService.getSessionStats();
      console.log('Training Stats:', stats);
      
      const firstSession = sessions[0];
      console.log('First Session:', {
        date: firstSession.date,
        distance: firstSession.distance,
        duration: firstSession.duration,
        avgPace: firstSession.avgPace,
        avgHeartRate: firstSession.avgHeartRate,
        dataPoints: firstSession.data.length
      });
    }
    
    return sessions;
  } catch (error) {
    console.error('Error testing training data:', error);
    return [];
  }
} 