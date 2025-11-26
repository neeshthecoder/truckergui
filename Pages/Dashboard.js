import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Activity, AlertTriangle, Shield } from "lucide-react";
import { operatorsMockApi } from "@/api/operatorsMockApi"; // Already created in previous step
import { sessionsMockApi } from "@/api/sessionsMockApi";
import { alertsMockApi } from "@/api/alertsMockApi";
import StatusCard from "../Components/dashboard/StatusCard";
import OperatorStatusGrid from "../Components/dashboard/OperatorStatusGrid";
import AlertsWidget from "../Components/dashboard/AlertsWidget";
import OperatorDetailModal from "../Components/dashboard/OperatorDetailModal";

export default function Dashboard() {
  const [selectedSession, setSelectedSession] = useState(null);

  const { data: operators = [] } = useQuery({
    queryKey: ['operators'],
    queryFn: operatorsMockApi.list,
  });

  const { data: sessions = [] } = useQuery({
    queryKey: ['sessions'],
    queryFn: () => sessionsMockApi.list('-session_start', 50),
  });

  const { data: alerts = [] } = useQuery({
    queryKey: ['alerts'],
    queryFn: () => alertsMockApi.filter({ status: 'active' }, '-created_date', 20),
  });


  const activeSessions = sessions.filter(s => s.status === 'active');
  const activeOperators = operators.filter(o => o.status === 'active');
  const criticalAlerts = alerts.filter(a => a.severity === 'critical');

  const avgAlertness = activeSessions.length > 0
    ? activeSessions.reduce((sum, s) => sum + (s.alertness_score || 0), 0) / activeSessions.length
    : 0;

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
              <h1 className="text-3xl font-bold text-white uppercase tracking-tight">
                FLEET OVERVIEW
              </h1>
            </div>
            <p className="text-zinc-500 text-sm uppercase tracking-wider mono">REAL-TIME DRIVER SAFETY MONITORING</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-zinc-950 border border-green-500/30 rounded">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs text-green-400 font-semibold uppercase tracking-wider mono">SYSTEM OPERATIONAL</span>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatusCard
            title="ACTIVE DRIVERS"
            value={activeOperators.length}
            total={operators.length}
            icon={Users}
            color="blue"
          />
          <StatusCard
            title="DRIVERS ON ROUTE"
            value={activeSessions.length}
            icon={Activity}
            color="cyan"
          />
          <StatusCard
            title="AVG ALERTNESS"
            value={`${avgAlertness.toFixed(0)}%`}
            icon={Activity}
            color="green"
            trend={avgAlertness >= 80 ? "good" : avgAlertness >= 60 ? "warning" : "critical"}
          />
          <StatusCard
            title="ACTIVE ALERTS"
            value={alerts.length}
            critical={criticalAlerts.length}
            icon={AlertTriangle}
            color="amber"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <OperatorStatusGrid 
              sessions={activeSessions} 
              onSessionClick={setSelectedSession}
            />
          </div>

          <div>
            <AlertsWidget alerts={alerts.slice(0, 6)} />
          </div>
        </div>


      </div>

      {selectedSession && (
        <OperatorDetailModal
          session={selectedSession}
          onClose={() => setSelectedSession(null)}
        />
      )}
    </div>
  );
}