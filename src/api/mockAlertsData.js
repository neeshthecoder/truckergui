// Example of alerts, following the Alert.json schema
export let mockAlerts = [
  {
    id: "alt-1", operator_id: "op-2", operator_name: "Sarah Chen", session_id: "sess-2",
    alert_type: "fatigue", severity: "critical", message: "Fatigue level exceeded 40%",
    metric_value: 40, threshold_value: 35, status: "active", acknowledged_by: null, acknowledged_at: null
  },
  {
    id: "alt-2", operator_id: "op-1", operator_name: "Alex Thompson", session_id: "sess-1",
    alert_type: "low_alertness", severity: "warning", message: "Alertness dipping below 80%",
    metric_value: 78, threshold_value: 80, status: "active", acknowledged_by: null, acknowledged_at: null
  },
  {
    id: "alt-3", operator_id: "op-3", operator_name: "Marcus Bell", session_id: "sess-3",
    alert_type: "incident", severity: "critical", message: "Hard braking event recorded.",
    metric_value: null, threshold_value: null, status: "resolved", acknowledged_by: "Admin", acknowledged_at: "2025-11-23T08:00:00Z"
  }
];