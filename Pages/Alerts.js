import React, { useState } from "react";
import { alertsMockApi } from "@/api/alertsMockApi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, AlertCircle, Info } from "lucide-react";
import { format } from "date-fns";

export default function Alerts() {
  const [filter, setFilter] = useState('active');
  const queryClient = useQueryClient();

  const { data: alerts = [], isLoading } = useQuery({
    queryKey: ['alerts', filter],
    queryFn: () => {
      if (filter === 'all') {
        return alertsMockApi.filter({}, '-created_date', 100);
      }
      return alertsMockApi.filter({ status: filter }, '-created_date', 100);
    },
  });

  const updateAlertMutation = useMutation({
    mutationFn: ({ id, data }) => alertsMockApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['alerts']);
    },
  });

  const handleAcknowledge = async (alert) => {
    const acknowledgedByUser = "GUI_User";
    updateAlertMutation.mutate({
      id: alert.id,
      data: {
        status: 'acknowledged',
        acknowledged_by: user.email,
        acknowledged_at: new Date().toISOString(),
      }
    });
  };

  const getSeverityIcon = (severity) => {
    switch(severity) {
      case 'critical': return <AlertTriangle className="w-5 h-5" />;
      case 'warning': return <AlertCircle className="w-5 h-5" />;
      default: return <Info className="w-5 h-5" />;
    }
  };

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'critical': return 'border-red-500/50 bg-red-500/10 text-red-400';
      case 'warning': return 'border-amber-500/50 bg-amber-500/10 text-amber-400';
      default: return 'border-blue-500/50 bg-blue-500/10 text-blue-400';
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
            <h1 className="text-3xl font-bold text-white uppercase tracking-tight">
              ALERT CENTER
            </h1>
          </div>
          <p className="text-zinc-500 text-sm uppercase tracking-wider mono">SYSTEM NOTIFICATIONS & WARNINGS</p>
        </div>

        <Card className="bg-zinc-950 border-zinc-800 shadow-xl">
          <CardHeader className="border-b border-zinc-800">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <CardTitle className="text-white uppercase tracking-wide text-sm">ALL ALERTS</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant={filter === 'active' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('active')}
                  className={filter === 'active' ? 'bg-cyan-600 hover:bg-cyan-700' : 'border-zinc-700 hover:bg-zinc-800 text-zinc-300'}
                >
                  ACTIVE
                </Button>
                <Button
                  variant={filter === 'acknowledged' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('acknowledged')}
                  className={filter === 'acknowledged' ? 'bg-cyan-600 hover:bg-cyan-700' : 'border-zinc-700 hover:bg-zinc-800 text-zinc-300'}
                >
                  ACKNOWLEDGED
                </Button>
                <Button
                  variant={filter === 'resolved' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('resolved')}
                  className={filter === 'resolved' ? 'bg-cyan-600 hover:bg-cyan-700' : 'border-zinc-700 hover:bg-zinc-800 text-zinc-300'}
                >
                  RESOLVED
                </Button>
                <Button
                  variant={filter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('all')}
                  className={filter === 'all' ? 'bg-cyan-600 hover:bg-cyan-700' : 'border-zinc-700 hover:bg-zinc-800 text-zinc-300'}
                >
                  ALL
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {isLoading ? (
              <div className="text-center py-12 text-zinc-500">Loading alerts...</div>
            ) : alerts.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <p className="text-zinc-500 uppercase tracking-wider text-sm mono">NO ALERTS FOUND</p>
                <p className="text-xs text-zinc-600 mt-1 uppercase tracking-wider mono">System operating normally</p>
              </div>
            ) : (
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <Card key={alert.id} className="border-2 border-zinc-800 bg-black hover:border-amber-400/30 transition-all">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          <Badge className={`${getSeverityColor(alert.severity)} border mt-1`}>
                            {getSeverityIcon(alert.severity)}
                          </Badge>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="font-bold text-lg text-white uppercase tracking-wide">{alert.operator_name}</h4>
                                <Badge variant="outline" className="mt-1 border-zinc-700 text-zinc-400 text-[10px] mono">
                                  {alert.alert_type.replace(/_/g, ' ')}
                                </Badge>
                              </div>
                              <Badge className={alert.status === 'active' ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-zinc-800 text-zinc-400 border-zinc-700'}>
                                {alert.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-zinc-300 mb-2">{alert.message}</p>
                            {alert.metric_value && alert.threshold_value && (
                              <p className="text-xs text-zinc-500 mono">
                                Metric: <span className="font-semibold text-amber-400">{alert.metric_value}</span> 
                                {' '}(Threshold: {alert.threshold_value})
                              </p>
                            )}
                            <div className="flex items-center gap-4 mt-3 text-xs text-zinc-600 mono">
                              <span>{format(new Date(alert.created_date), 'MMM d, yyyy HH:mm')}</span>
                              {alert.acknowledged_by && (
                                <span className="text-green-400">
                                  Acknowledged by {alert.acknowledged_by}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        {alert.status === 'active' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAcknowledge(alert)}
                            className="border-zinc-700 hover:bg-green-950 hover:text-green-400 hover:border-green-500/30 text-xs uppercase tracking-wider mono"
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            ACKNOWLEDGE
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}