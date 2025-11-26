// Example of sessions, following the CognitiveSession.json schema
export const mockSessions = [
  {
    id: "sess-1", operator_id: "op-1", operator_name: "Alex Thompson",
    session_start: "2025-11-23T08:00:00Z", session_end: null, status: "active",
    alertness_score: 85, focus_score: 92, fatigue_level: 15, reaction_time: 350,
    cognitive_load: "low", performance_rating: "optimal", hours_since_rest: 2, incident_count: 0
  },
  {
    id: "sess-2", operator_id: "op-2", operator_name: "Sarah Chen",
    session_start: "2025-11-23T12:30:00Z", session_end: null, status: "active",
    alertness_score: 65, focus_score: 70, fatigue_level: 40, reaction_time: 510,
    cognitive_load: "moderate", performance_rating: "degraded", hours_since_rest: 5, incident_count: 1
  },
  {
    id: "sess-3", operator_id: "op-3", operator_name: "Marcus Bell",
    session_start: "2025-11-22T23:00:00Z", session_end: "2025-11-23T07:00:00Z", status: "completed",
    alertness_score: 95, focus_score: 95, fatigue_level: 10, reaction_time: 300,
    cognitive_load: "low", performance_rating: "optimal", hours_since_rest: 8, incident_count: 0
  }
];