import { mockSessions } from './mockSessionsData';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

export const sessionsMockApi = {
  // Mimics base44.entities.CognitiveSession.list('-session_start', 50)
  list: async (sortBy, limit) => {
    await delay(500); 

    // Sort descending by session_start
    const sorted = [...mockSessions].sort((a, b) => 
      new Date(b.session_start).getTime() - new Date(a.session_start).getTime()
    );
    return sorted.slice(0, limit);
  },
};