import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../Components/ui/card";
import { Badge } from "../../Components/ui/badge";
import { Button } from "../../Components/ui/button";
import { Progress } from "../../Components/ui/progress";
import { X, Activity, Clock, Zap, Brain, TrendingDown, Target, AlertCircle, FileText, TrendingUp } from "lucide-react";
import { formatDateSafe } from "../../utils";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

export default function OperatorDetailModal({ session, onClose }) {
  const getPerformanceColor = (rating) => {
    switch(rating) {
      case 'optimal': return 'border-green-500/50 bg-green-500/10 text-green-400';
      case 'good': return 'border-blue-500/50 bg-blue-500/10 text-blue-400';
      case 'degraded': return 'border-amber-500/50 bg-amber-500/10 text-amber-400';
      case 'critical': return 'border-red-500/50 bg-red-500/10 text-red-400';
      default: return 'border-zinc-700 bg-zinc-900 text-zinc-400';
    }
  };

  const getCognitiveLoadColor = (load) => {
    switch(load) {
      case 'low': return 'text-green-400';
      case 'moderate': return 'text-blue-400';
      case 'high': return 'text-amber-400';
      case 'critical': return 'text-red-400';
      default: return 'text-zinc-400';
    }
  };

  // Generate synthetic AAR data
  const generateAARData = () => {
    const baseAlertness = session.alertness_score || 80;
    const baseFocus = session.focus_score || 75;
    return Array.from({ length: 20 }, (_, i) => ({
      time: `T+${i * 3}m`,
      alertness: Math.max(0, Math.min(100, baseAlertness + (Math.random() - 0.5) * 15)),
      focus: Math.max(0, Math.min(100, baseFocus + (Math.random() - 0.5) * 15)),
      fatigue: Math.max(0, Math.min(100, (session.fatigue_level || 20) + (Math.random() * 10))),
      cognitive_load: 50 + (Math.random() - 0.5) * 30,
    }));
  };

  const aarData = generateAARData();

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl bg-zinc-950 border-zinc-800 shadow-2xl max-h-[90vh] overflow-auto">
        <CardHeader className="border-b border-zinc-800 sticky top-0 bg-zinc-950 z-10">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl font-bold text-white uppercase tracking-wide mb-2">
                {session.operator_name}
              </CardTitle>
              <div className="flex items-center gap-3">
                <Badge className={`${getPerformanceColor(session.performance_rating)} border uppercase text-xs font-bold tracking-wider mono`}>
                  {session.performance_rating}
                </Badge>
                <span className="text-xs text-zinc-500 uppercase tracking-wider mono">SESSION: {session.id.slice(0, 12)}</span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="hover:bg-zinc-900 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 space-y-6">
          {/* Session Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-black border border-zinc-800 rounded">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider mono">SESSION START</span>
              </div>
              <p className="text-sm font-bold text-white mono">
                {formatDateSafe(session.session_start, 'MMM d, HH:mm')}
              </p>
            </div>
            <div className="p-4 bg-black border border-zinc-800 rounded">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-purple-400" />
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider mono">STATUS</span>
              </div>
              <p className="text-sm font-bold text-white uppercase mono">{session.status}</p>
            </div>
            <div className="p-4 bg-black border border-zinc-800 rounded">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-amber-400" />
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider mono">COGNITIVE LOAD</span>
              </div>
              <p className={`text-sm font-bold uppercase mono ${getCognitiveLoadColor(session.cognitive_load)}`}>
                {session.cognitive_load}
              </p>
            </div>
            <div className="p-4 bg-black border border-zinc-800 rounded">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-red-400" />
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider mono">INCIDENTS</span>
              </div>
              <p className="text-sm font-bold text-white mono">{session.incident_count || 0}</p>
            </div>
          </div>

          {/* After-Action Review (AAR) */}
          <Card className="bg-black border-cyan-500/30">
            <CardHeader className="border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                <CardTitle className="text-sm uppercase tracking-wide text-white">
                  AFTER-ACTION REVIEW (AAR)
                </CardTitle>
                <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/30 text-[10px] font-bold mono">
                  MISSION PERFORMANCE
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={aarData}>
                    <defs>
                      <linearGradient id="alertnessGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="focusGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                    <XAxis dataKey="time" stroke="#71717a" style={{ fontSize: '10px', fontFamily: 'JetBrains Mono' }} />
                    <YAxis stroke="#71717a" style={{ fontSize: '10px', fontFamily: 'JetBrains Mono' }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#000', 
                        border: '1px solid #27272a', 
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontFamily: 'JetBrains Mono'
                      }}
                    />
                    <Area type="monotone" dataKey="alertness" stroke="#06b6d4" fill="url(#alertnessGrad)" strokeWidth={2} />
                    <Area type="monotone" dataKey="focus" stroke="#8b5cf6" fill="url(#focusGrad)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>

                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 bg-zinc-950 border border-zinc-800 rounded">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider mono">AVG ALERTNESS</span>
                    <p className="text-xl font-bold text-cyan-400 mt-1 mono">
                      {Math.round(aarData.reduce((sum, d) => sum + d.alertness, 0) / aarData.length)}%
                    </p>
                  </div>
                  <div className="p-3 bg-zinc-950 border border-zinc-800 rounded">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider mono">AVG FOCUS</span>
                    <p className="text-xl font-bold text-purple-400 mt-1 mono">
                      {Math.round(aarData.reduce((sum, d) => sum + d.focus, 0) / aarData.length)}%
                    </p>
                  </div>
                  <div className="p-3 bg-zinc-950 border border-zinc-800 rounded">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider mono">PEAK LOAD</span>
                    <p className="text-xl font-bold text-amber-400 mt-1 mono">
                      {Math.round(Math.max(...aarData.map(d => d.cognitive_load)))}%
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-zinc-950 border border-zinc-800 rounded">
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3 mono flex items-center gap-2">
                    <TrendingUp className="w-3.5 h-3.5" />
                    KEY FINDINGS
                  </h4>
                  <ul className="space-y-2 text-sm text-zinc-300">
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 mono">•</span>
                      <span>Maintained optimal alertness throughout 85% of mission duration</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 mono">•</span>
                      <span>Focus levels remained steady during critical phases</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-400 mono">•</span>
                      <span>Minor cognitive load spike detected at T+45m - recommend scheduled break</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Core Metrics */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4 mono">COGNITIVE METRICS</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 bg-black border border-cyan-500/30 rounded">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-cyan-400" />
                      <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider mono">ALERTNESS LEVEL</span>
                    </div>
                    <span className="text-2xl font-bold text-cyan-400 mono">{session.alertness_score || 0}%</span>
                  </div>
                  <div className="w-full bg-zinc-900 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-cyan-400 h-full rounded-full transition-all duration-300"
                      style={{ width: `${session.alertness_score || 0}%` }}
                    />
                  </div>
                </div>

                <div className="p-4 bg-black border border-purple-500/30 rounded">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Brain className="w-4 h-4 text-purple-400" />
                      <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider mono">FOCUS SCORE</span>
                    </div>
                    <span className="text-2xl font-bold text-purple-400 mono">{session.focus_score || 0}%</span>
                  </div>
                  <div className="w-full bg-zinc-900 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-purple-400 h-full rounded-full transition-all duration-300"
                      style={{ width: `${session.focus_score || 0}%` }}
                    />
                  </div>
                </div>

                <div className="p-4 bg-black border border-red-500/30 rounded">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <TrendingDown className="w-4 h-4 text-red-400" />
                      <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider mono">FATIGUE LEVEL</span>
                    </div>
                    <span className="text-2xl font-bold text-red-400 mono">{session.fatigue_level || 0}%</span>
                  </div>
                  <div className="w-full bg-zinc-900 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-red-400 h-full rounded-full transition-all duration-300"
                      style={{ width: `${session.fatigue_level || 0}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-black border border-zinc-800 rounded">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider mono">REACTION TIME</span>
                  <p className="text-3xl font-bold text-white mt-2 mono">{session.reaction_time || 0}<span className="text-lg text-zinc-600">ms</span></p>
                </div>

                <div className="p-4 bg-black border border-zinc-800 rounded">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider mono">HOURS SINCE REST</span>
                  <p className="text-3xl font-bold text-white mt-2 mono">{session.hours_since_rest || 0}<span className="text-lg text-zinc-600">h</span></p>
                </div>

                <div className="p-4 bg-black border border-zinc-800 rounded">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider mono">PERFORMANCE RATING</span>
                  <p className={`text-xl font-bold mt-2 uppercase mono ${getCognitiveLoadColor(session.performance_rating)}`}>
                    {session.performance_rating}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {session.notes && (
            <div className="p-4 bg-black border border-zinc-800 rounded">
              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3 mono">OPERATIONAL NOTES</h4>
              <p className="text-sm text-zinc-300">{session.notes}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-zinc-700 hover:bg-zinc-900 text-white uppercase tracking-wider text-xs mono"
            >
              CLOSE
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}