// src/api/mockAI.js

const delay = ms => new Promise(resolve => setTimeout(resolve, 500)); // Simulate slow LLM generation

// Mock data following the required response_json_schema structure
const mockRecommendations = {
    recommendations: [
        {
            operator_name: "Sarah Chen",
            recommended_role: "Local Delivery",
            current_readiness: "Degraded",
            risk_level: "critical",
            action: "Immediate shift termination and mandatory 10-hour rest period.",
            rationale: "Fatigue level is dangerously high (40%) combined with slow reaction time, indicating critical safety risk on a regional route.",
            priority: "immediate"
        },
        {
            operator_name: "Alex Thompson",
            recommended_role: "Long Haul (Team)",
            current_readiness: "Optimal",
            risk_level: "low",
            action: "Proceed with current long-haul assignment as scheduled.",
            rationale: "Alertness and focus scores are excellent (85%+) with low hours since rest. Consider team driving for shift extension.",
            priority: "low"
        },
        {
            operator_name: "Marcus Bell",
            recommended_role: "Regional Driver",
            current_readiness: "Good",
            risk_level: "moderate",
            action: "Schedule a mandatory 30-minute break within the next hour. Re-evaluate metrics afterward.",
            rationale: "Alertness score is dipping below 80%. Pre-emptive intervention is advised before metrics degrade further.",
            priority: "high"
        }
    ]
};

// Function that simulates the proprietary LLM call
export const mockLLM = {
    InvokeLLM: async ({ prompt, response_json_schema }) => {
        await delay(500); // Simulate processing time
        // In a real application, you would replace this with an API call to OpenAI, Gemini, or another LLM service.
        // For the mock, we simply return the structured mock data.
        return mockRecommendations;
    }
};