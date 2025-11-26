import { mockAlerts } from './mockAlertsData'; // Requires mockAlerts array from Step 2

const delay = ms => new Promise(resolve => setTimeout(resolve, 500));

export const alertsMockApi = {
  
  // Handles both list (filter='all') and status filtering
  filter: async (filters = {}, sortBy, limit) => {
    await delay(300);

    let filtered = [...mockAlerts];

    // Apply status filter 
    if (filters.status) {
      filtered = filtered.filter(alert => alert.status === filters.status);
    }
    
    // Simple sort by ID descending to simulate reverse created_date order
    filtered.sort((a, b) => {
        if (a.id > b.id) return -1;
        if (a.id < b.id) return 1;
        return 0;
    });

    return filtered.slice(0, limit || filtered.length); 
  },

  // Handles updating an alert's status (for Acknowledge action)
  update: async (id, data) => {
    await delay(300);
    const index = mockAlerts.findIndex(alert => alert.id === id);
    if (index > -1) {
      mockAlerts[index] = { ...mockAlerts[index], ...data };
      return mockAlerts[index];
    }
    throw new Error("Alert not found for update.");
  }
};