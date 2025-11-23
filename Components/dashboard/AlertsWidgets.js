import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, AlertCircle, Info, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function AlertsWidget({ alerts }) {
  const getSeverityIcon = (severity) => {
    switch(severity) {
      case 'critical': return <AlertTriangle className="w-3.5 h-3.5" />;
      case 'warning': return <AlertCircle className="w-3.5 h-3.5" />;
      default: return <Info className="w-3.5 h-3.5" />;
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
    <Card className="bg-zinc-950 border-zinc-800 shadow-xl h-full">
      <CardHeader className="border-b border-zinc-800">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-white uppercase tracking-wide text-sm">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            RECENT ALERTS
          </CardTitle>
          <Link 
            to={createPageUrl("Alerts")}
            className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 uppercase tracking-wider mono transition-colors"
          >
            VIEW ALL
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {alerts.length === 0 ? (
          <div className="text-center py-8">
            <AlertTriangle className="w-10 h-10 text-zinc-700 mx-auto mb-2" />
            <p className="text-zinc-500 uppercase tracking-wider text-xs mono">NO ACTIVE ALERTS</p>
            <p className="text-xs text-zinc-600 mt-1 uppercase tracking-wider mono">SYSTEM NOMINAL</p>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => (
              <Link
                key={alert.id}
                to={createPageUrl("Alerts")}
                className="block p-3 border border-zinc-800 rounded bg-black hover:border-cyan-400/30 hover:bg-zinc-950 transition-all cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <Badge className={`${getSeverityColor(alert.severity)} border mt-0.5 text-[10px] font-bold mono`}>
                    {getSeverityIcon(alert.severity)}
                  </Badge>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-xs text-white uppercase tracking-wide mb-1">{alert.operator_name}</p>
                    <p className="text-xs text-zinc-400">{alert.message}</p>
                    <p className="text-[10px] text-zinc-600 mt-2 uppercase tracking-wider mono">
                      {format(new Date(alert.created_date), 'HH:mm:ss')}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}