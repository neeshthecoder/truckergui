import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, Brain, Shield, AlertTriangle, TrendingUp, Users, RefreshCw } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function AIRecommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const queryClient = useQueryClient();

  const { data: operators = [] } = useQuery({
    queryKey: ['operators'],
    queryFn: () => base44.entities.Operator.list(),
  });

  const { data: sessions = [] } = useQuery({
    queryKey: ['sessions'],
    queryFn: () => base44.entities.CognitiveSession.list('-session_start', 50),
  });

  const activeSessions = sessions.filter(s => s.status === 'active');

  const generateRecommendations = async () => {
    setIsGenerating(true);
    try {
      const prompt = `You are an AI system for Axon Transport analyzing driver safety and cognitive readiness data for a trucking fleet.

Current driver status:
${operators.map(op => `- ${op.name} (${op.role}, ${op.department}): ${op.status}`).join('\n')}

Active route sessions with cognitive metrics:
${activeSessions.map(s => `- ${s.operator_name}: Alertness ${s.alertness_score}%, Focus ${s.focus_score}%, Fatigue ${s.fatigue_level}%, Hours since rest: ${s.hours_since_rest}`).join('\n')}

Based on this data, provide 5-7 specific recommendations for optimal route assignment, driver safety, and fatigue risk mitigation. Consider:
1. Driver cognitive readiness levels
2. Hours of service (HOS) compliance and rest requirements
3. Route-specific demands (long haul vs regional vs local)
4. Risk assessment for each driver assignment
5. Driver rotation and relief strategies

Format each recommendation with a clear action, rationale, and risk level.`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            recommendations: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  operator_name: { type: "string" },
                  recommended_role: { type: "string" },
                  current_readiness: { type: "string" },
                  risk_level: { type: "string", enum: ["low", "moderate", "high", "critical"] },
                  action: { type: "string" },
                  rationale: { type: "string" },
                  priority: { type: "string", enum: ["immediate", "high", "medium", "low"] }
                }
              }
            }
          }
        }
      });

      setRecommendations(result.recommendations || []);
    } catch (error) {
      console.error("Error generating recommendations:", error);
    }
    setIsGenerating(false);
  };

  useEffect(() => {
    if (operators.length > 0) {
      generateRecommendations();
    }
  }, []);

  const getRiskColor = (risk) => {
    switch(risk) {
      case 'low': return 'border-green-500/50 bg-green-500/10 text-green-400';
      case 'moderate': return 'border-blue-500/50 bg-blue-500/10 text-blue-400';
      case 'high': return 'border-amber-500/50 bg-amber-500/10 text-amber-400';
      case 'critical': return 'border-red-500/50 bg-red-500/10 text-red-400';
      default: return 'border-zinc-700 bg-zinc-900 text-zinc-400';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'immediate': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'medium': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="w-8 h-8 text-cyan-400" />
              <h1 className="text-3xl font-bold text-white uppercase tracking-tight">
                AI RECOMMENDATIONS
              </h1>
            </div>
            <p className="text-zinc-500 text-sm uppercase tracking-wider mono">INTELLIGENT ROUTE ASSIGNMENT & DRIVER SAFETY ASSESSMENT</p>
          </div>
          <Button
            onClick={generateRecommendations}
            disabled={isGenerating}
            className="bg-cyan-600 hover:bg-cyan-700 text-white uppercase tracking-wider text-xs font-bold mono"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ANALYZING...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                REGENERATE
              </>
            )}
          </Button>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-zinc-950 border-zinc-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wider mono mb-2">TOTAL DRIVERS</p>
                  <p className="text-3xl font-bold text-white mono">{operators.length}</p>
                </div>
                <Users className="w-8 h-8 text-cyan-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-950 border-zinc-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wider mono mb-2">ACTIVE SESSIONS</p>
                  <p className="text-3xl font-bold text-white mono">{activeSessions.length}</p>
                </div>
                <Brain className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-950 border-zinc-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wider mono mb-2">AVG READINESS</p>
                  <p className="text-3xl font-bold text-green-400 mono">
                    {activeSessions.length > 0 
                      ? Math.round(activeSessions.reduce((sum, s) => sum + ((s.alertness_score + s.focus_score) / 2), 0) / activeSessions.length)
                      : 0}%
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-950 border-zinc-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wider mono mb-2">RECOMMENDATIONS</p>
                  <p className="text-3xl font-bold text-cyan-400 mono">{recommendations.length}</p>
                </div>
                <Sparkles className="w-8 h-8 text-cyan-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Recommendations */}
        <Card className="bg-zinc-950 border-zinc-800 shadow-xl">
          <CardHeader className="border-b border-zinc-800">
            <CardTitle className="flex items-center gap-2 text-white uppercase tracking-wide text-sm">
              <Shield className="w-4 h-4 text-cyan-400" />
              AI-POWERED ASSIGNMENT RECOMMENDATIONS
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {isGenerating ? (
              <div className="text-center py-12">
                <RefreshCw className="w-12 h-12 text-cyan-400 mx-auto mb-3 animate-spin" />
                <p className="text-zinc-400 uppercase tracking-wider text-sm mono">ANALYZING COGNITIVE DATA...</p>
              </div>
            ) : recommendations.length === 0 ? (
              <div className="text-center py-12">
                <Sparkles className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
                <p className="text-zinc-500 uppercase tracking-wider text-sm mono">NO RECOMMENDATIONS AVAILABLE</p>
                <Button
                  onClick={generateRecommendations}
                  className="mt-4 bg-cyan-600 hover:bg-cyan-700"
                >
                  GENERATE RECOMMENDATIONS
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {recommendations.map((rec, idx) => (
                  <Card key={idx} className={`border-2 ${getRiskColor(rec.risk_level)} bg-black hover:shadow-lg transition-all`}>
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-bold text-white uppercase tracking-wide">{rec.operator_name}</h3>
                            <Badge className={`${getPriorityColor(rec.priority)} border text-[10px] font-bold tracking-wider mono`}>
                              {rec.priority}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-xs">
                            <span className="text-zinc-500 uppercase tracking-wider mono">RECOMMENDED: <span className="text-cyan-400 font-bold">{rec.recommended_role}</span></span>
                            <span className="text-zinc-500 uppercase tracking-wider mono">READINESS: <span className="text-white font-bold">{rec.current_readiness}</span></span>
                          </div>
                        </div>
                        <Badge className={`${getRiskColor(rec.risk_level)} border text-xs font-bold tracking-wider mono`}>
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          {rec.risk_level} RISK
                        </Badge>
                      </div>

                      <div className="space-y-3">
                        <div className="p-3 bg-zinc-950 border border-zinc-800 rounded">
                          <p className="text-[10px] text-zinc-500 uppercase tracking-wider mono mb-2">RECOMMENDED ACTION</p>
                          <p className="text-sm text-white">{rec.action}</p>
                        </div>

                        <div className="p-3 bg-zinc-950 border border-zinc-800 rounded">
                          <p className="text-[10px] text-zinc-500 uppercase tracking-wider mono mb-2">RATIONALE</p>
                          <p className="text-sm text-zinc-300">{rec.rationale}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Risk Matrix */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="bg-zinc-950 border-zinc-800 shadow-xl">
            <CardHeader className="border-b border-zinc-800">
              <CardTitle className="flex items-center gap-2 text-white uppercase tracking-wide text-sm">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                RISK DISTRIBUTION
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {['critical', 'high', 'moderate', 'low'].map(risk => {
                  const count = recommendations.filter(r => r.risk_level === risk).length;
                  const percentage = recommendations.length > 0 ? (count / recommendations.length) * 100 : 0;
                  return (
                    <div key={risk}>
                      <div className="flex justify-between mb-2">
                        <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider mono">{risk} RISK</span>
                        <span className="text-xs font-bold text-white mono">{count}</span>
                      </div>
                      <Progress value={percentage} className="h-2 bg-zinc-900" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-950 border-zinc-800 shadow-xl">
            <CardHeader className="border-b border-zinc-800">
              <CardTitle className="flex items-center gap-2 text-white uppercase tracking-wide text-sm">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                PRIORITY BREAKDOWN
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {['immediate', 'high', 'medium', 'low'].map(priority => {
                  const count = recommendations.filter(r => r.priority === priority).length;
                  const percentage = recommendations.length > 0 ? (count / recommendations.length) * 100 : 0;
                  return (
                    <div key={priority}>
                      <div className="flex justify-between mb-2">
                        <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider mono">{priority} PRIORITY</span>
                        <span className="text-xs font-bold text-white mono">{count}</span>
                      </div>
                      <Progress value={percentage} className="h-2 bg-zinc-900" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}