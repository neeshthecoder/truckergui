import React from "react";
import { Card, CardContent, CardHeader } from "../../Components/ui/card";
import { Badge } from "../../Components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function StatusCard({ title, value, total, icon: Icon, color, trend, critical }) {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600",
    cyan: "from-cyan-400 to-cyan-500",
    green: "from-green-500 to-green-600",
    amber: "from-amber-500 to-amber-600",
    red: "from-red-500 to-red-600",
  };

  const textColors = {
    blue: "text-blue-400",
    cyan: "text-cyan-400",
    green: "text-green-400",
    amber: "text-amber-400",
    red: "text-red-400",
  };

  return (
    <Card className="relative overflow-hidden bg-zinc-950 border-zinc-800 hover:border-zinc-700 transition-all shadow-xl">
      <div className={`absolute top-0 right-0 w-32 h-32 transform translate-x-12 -translate-y-12 bg-gradient-to-br ${colorClasses[color]} rounded-full opacity-5`} />
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3 mono">{title}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white mono">{value}</span>
              {total && <span className="text-lg text-zinc-600 mono">/ {total}</span>}
            </div>
          </div>
          <div className={`p-2.5 rounded border border-zinc-800 bg-black`}>
            <Icon className={`w-5 h-5 ${textColors[color]}`} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          {trend === "good" && (
            <>
              <TrendingUp className="w-3.5 h-3.5 text-green-400" />
              <span className="text-xs text-green-400 font-semibold uppercase tracking-wider mono">OPTIMAL</span>
            </>
          )}
          {trend === "warning" && (
            <>
              <TrendingDown className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs text-amber-400 font-semibold uppercase tracking-wider mono">MONITOR</span>
            </>
          )}
          {trend === "critical" && (
            <>
              <TrendingDown className="w-3.5 h-3.5 text-red-400" />
              <span className="text-xs text-red-400 font-semibold uppercase tracking-wider mono">ATTENTION</span>
            </>
          )}
          {critical > 0 && (
            <Badge className="ml-auto bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30 mono text-[10px]">
              {critical} CRITICAL
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}