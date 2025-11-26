import { mockOperators } from './mockOperatorsData';

// Utility function to simulate network delay and loading states
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

export const operatorsMockApi = {
  // Mimics base44.entities.Operator.list('-created_date')
  list: async () => {
    await delay(500); // Simulate network latency
    
    // Simple mock sort by ID descending to simulate reverse creation date order
    return [...mockOperators].sort((a, b) => {
        if (a.id > b.id) return -1;
        if (a.id < b.id) return 1;
        return 0;
    });
  },

  // Mimics base44.entities.Operator.create(data)
  create: async (data) => {
    await delay(300);
    const newOperator = { 
      ...data, 
      id: `op-${Date.now()}`, // Simple unique ID generation
    };
    mockOperators.unshift(newOperator);
    return newOperator;
  },

  // Mimics base44.entities.Operator.update(id, data)
  update: async (id, data) => {
    await delay(300);
    const index = mockOperators.findIndex(op => op.id === id);
    if (index > -1) {
      // Merge existing data with new data
      mockOperators[index] = { ...mockOperators[index], ...data };
      return mockOperators[index];
    }
    throw new Error("Operator not found for update.");
  },

  // Mimics base44.entities.Operator.delete(id)
  delete: async (id) => {
    await delay(300);
    const initialLength = mockOperators.length;
    // Update the array by filtering out the deleted operator
    mockOperators = mockOperators.filter(op => op.id !== id);
    if (mockOperators.length === initialLength) {
      throw new Error("Operator not found for deletion.");
    }
    return { success: true, id };
  }
};