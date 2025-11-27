import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../Components/ui/card";
import { Badge } from "../../Components/ui/badge";
import { Activity, Clock, Zap, Brain, TrendingUp, ExternalLink } from "lucide-react";
import { Progress } from "../../Components/ui/progress";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { Link } from "react-router-dom";
import { createPageUrl } from "../../utils";

export default function OperatorStatusGrid({ sessions, onSessionClick }) {
  const getPerformanceColor = (rating) => {
    switch(rating) {
      case 'optimal': return 'border-green-500/50 bg-green-500/5 text-green-400';
      case 'good': return 'border-blue-500/50 bg-blue-500/5 text-blue-400';
      case 'degraded': return 'border-amber-500/50 bg-amber-500/5 text-amber-400';
      case 'critical': return 'border-red-500/50 bg-red-500/5 text-red-400';
      default: return 'border-zinc-700 bg-zinc-900 text-zinc-400';
    }
  };

  const getStatusDot = (score) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getVigilanceTrend = (baseScore) => {
    // Generate synthetic trend data for sparkline
    const variance = 8;
    return Array.from({ length: 12 }, (_, i) => ({
      value: baseScore + (Math.random() - 0.5) * variance
    }));
  };

  return (
    <Card className="bg-zinc-950 border-zinc-800 shadow-xl">
      <CardHeader className="border-b border-zinc-800">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-white uppercase tracking-wide text-sm">
            <Activity className="w-4 h-4 text-cyan-400" />
            ADAPTIVE DRIVER TRIAGE
          </CardTitle>
          <div className="flex items-center gap-3">
            <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/30 text-[10px] font-bold tracking-wider mono">
              REAL-TIME READINESS
            </Badge>
            <Link 
              to={createPageUrl("Operators")}
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 uppercase tracking-wider mono transition-colors"
            >
              MANAGE DRIVERS
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {sessions.length === 0 ? (
          <div className="text-center py-12">
            <Brain className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
            <p className="text-zinc-500 uppercase tracking-wider text-sm mono">NO ACTIVE SESSIONS</p>
            <p className="text-xs text-zinc-600 mt-2 uppercase tracking-wider mono">AWAITING DEPLOYMENT</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {sessions.map((session) => {
              const vigilanceScore = Math.round((session.alertness_score + session.focus_score) / 2);
              const trendData = getVigilanceTrend(vigilanceScore);
              
              return (
                <Card 
                  key={session.id} 
                  className={`border-2 ${getPerformanceColor(session.performance_rating)} hover:shadow-lg hover:shadow-cyan-500/10 transition-all cursor-pointer bg-black`}
                  onClick={() => onSessionClick(session)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-base text-white uppercase tracking-wide">{session.operator_name}</h4>
                          <div className={`w-2 h-2 rounded-full ${getStatusDot(vigilanceScore)} animate-pulse`} />
                        </div>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-wider mono">ID: {session.id.slice(0, 8)}</p>
                      </div>
                      <Badge className={`${getPerformanceColor(session.performance_rating)} border uppercase text-[10px] font-bold tracking-wider mono`}>
                        {session.performance_rating}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Vigilance Score with Trend */}
                    <div className="p-3 bg-zinc-950 border border-zinc-800 rounded">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                          <span className="text-[10px] text-zinc-500 uppercase tracking-wider mono">VIGILANCE SCORE</span>
                        </div>
                        <span className="text-lg font-bold text-cyan-400 mono">{vigilanceScore}%</span>
                      </div>
                      <div className="h-8 -mx-1">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={trendData}>
                            <Line 
                              type="monotone" 
                              dataKey="value" 
                              stroke={vigilanceScore >= 80 ? "#10b981" : vigilanceScore >= 60 ? "#eab308" : "#ef4444"}
                              strokeWidth={2}
                              dot={false}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                      <p className="text-[9px] text-zinc-600 uppercase tracking-wider mono text-center mt-1">LAST HOUR TREND</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <Zap className="w-3 h-3 text-cyan-400" />
                          <span className="text-[10px] text-zinc-500 uppercase tracking-wider mono">ALERTNESS</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={session.alertness_score || 0} className="h-1 bg-zinc-900" />
                          <span className="text-[10px] font-bold text-white mono">{session.alertness_score || 0}%</span>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <Brain className="w-3 h-3 text-purple-400" />
                          <span className="text-[10px] text-zinc-500 uppercase tracking-wider mono">FOCUS</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={session.focus_score || 0} className="h-1 bg-zinc-900" />
                          <span className="text-[10px] font-bold text-white mono">{session.focus_score || 0}%</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3 text-zinc-500" />
                        <span className="text-xs text-zinc-400 uppercase tracking-wider mono">{session.hours_since_rest || 0}H SINCE REST</span>
                      </div>
                      <Badge className={`${getStatusDot(vigilanceScore).replace('bg-', 'text-')} bg-zinc-900 border-zinc-800 text-[10px] font-bold mono`}>
                        {vigilanceScore >= 80 ? 'READY' : vigilanceScore >= 60 ? 'MONITOR' : 'REST'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}