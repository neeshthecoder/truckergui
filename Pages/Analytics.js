import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from "recharts";
import { BarChart3, TrendingUp, Users, Lightbulb, FlaskConical, ClipboardList } from "lucide-react";

export default function Analytics() {
  const { data: sessions = [] } = useQuery({
    queryKey: ['sessions'],
    queryFn: () => base44.entities.CognitiveSession.list('-session_start', 100),
  });

  const { data: operators = [] } = useQuery({
    queryKey: ['operators'],
    queryFn: () => base44.entities.Operator.list(),
  });

  const performanceData = [
    { name: 'Optimal', value: sessions.filter(s => s.performance_rating === 'optimal').length, color: '#10b981' },
    { name: 'Good', value: sessions.filter(s => s.performance_rating === 'good').length, color: '#3b82f6' },
    { name: 'Degraded', value: sessions.filter(s => s.performance_rating === 'degraded').length, color: '#f59e0b' },
    { name: 'Critical', value: sessions.filter(s => s.performance_rating === 'critical').length, color: '#ef4444' },
  ];

  const roleData = operators.reduce((acc, op) => {
    const existing = acc.find(item => item.name === op.role);
    if (existing) {
      existing.value++;
    } else {
      acc.push({ name: op.role, value: 1 });
    }
    return acc;
  }, []);

  const trendData = sessions.slice(0, 20).reverse().map((session, idx) => ({
    name: `S${idx + 1}`,
    alertness: session.alertness_score || 0,
    focus: session.focus_score || 0,
    fatigue: session.fatigue_level || 0,
  }));

  const avgMetrics = {
    alertness: sessions.length > 0 ? sessions.reduce((sum, s) => sum + (s.alertness_score || 0), 0) / sessions.length : 0,
    focus: sessions.length > 0 ? sessions.reduce((sum, s) => sum + (s.focus_score || 0), 0) / sessions.length : 0,
    fatigue: sessions.length > 0 ? sessions.reduce((sum, s) => sum + (s.fatigue_level || 0), 0) / sessions.length : 0,
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
            <h1 className="text-3xl font-bold text-white uppercase tracking-tight">
              ANALYTICS
            </h1>
          </div>
          <p className="text-zinc-500 text-sm uppercase tracking-wider mono">Historical data, fleet performance insights, and driver safety analysis</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Avg Alertness</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-cyan-600">{avgMetrics.alertness.toFixed(1)}%</div>
              <p className="text-sm text-slate-500 mt-1">Across all sessions</p>
            </CardContent>
          </Card>
          <Card className="shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Avg Focus</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{avgMetrics.focus.toFixed(1)}%</div>
              <p className="text-sm text-slate-500 mt-1">Across all sessions</p>
            </CardContent>
          </Card>
          <Card className="shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Avg Fatigue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{avgMetrics.fatigue.toFixed(1)}%</div>
              <p className="text-sm text-slate-500 mt-1">Across all sessions</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-cyan-600" />
                Performance Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="alertness" stroke="#06b6d4" strokeWidth={2} name="Alertness" />
                  <Line type="monotone" dataKey="focus" stroke="#8b5cf6" strokeWidth={2} name="Focus" />
                  <Line type="monotone" dataKey="fatigue" stroke="#ef4444" strokeWidth={2} name="Fatigue" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-cyan-600" />
                Performance Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={performanceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {performanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-cyan-600" />
              Drivers by Role
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={roleData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                />
                <Bar dataKey="value" fill="#06b6d4" name="Count" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* New section for Adaptive Triage, AAR, and AI Recommendations */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-teal-500" />
                Adaptive Triage Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-500">
                Leverage real-time data to dynamically adjust response protocols and resource allocation based on evolving cognitive states and environmental factors.
              </p>
              <ul className="list-disc list-inside text-sm text-slate-400 mt-2">
                <li>Automated threat assessment</li>
                <li>Dynamic priority adjustments</li>
                <li>Predictive resource deployment</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-orange-500" />
                After Action Review (AAR)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-500">
                Detailed post-operation analysis helps identify areas for improvement. Review session timelines, critical events, and cognitive performance metrics.
              </p>
              <ul className="list-disc list-inside text-sm text-slate-400 mt-2">
                <li>Event-based performance analysis</li>
                <li>Cognitive load breakdown</li>
                <li>Lessons learned integration</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                AI Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-500">
                Receive proactive, AI-driven suggestions for optimizing operator training, mission planning, and real-time intervention strategies.
              </p>
              <ul className="list-disc list-inside text-sm text-slate-400 mt-2">
                <li>Personalized training paths</li>
                <li>Predictive anomaly detection</li>
                <li>Optimal team composition suggestions</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}