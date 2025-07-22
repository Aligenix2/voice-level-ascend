import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SpeechAnalysis } from "./SpeechRecorder";
import { TrendingUp, Clock, Zap, Volume2, Award } from "lucide-react";

interface SpeechReportProps {
  analysis: SpeechAnalysis;
  transcript: string;
}

export const SpeechReport = ({ analysis, transcript }: SpeechReportProps) => {
  const performanceData = [
    { name: "Clarity", value: analysis.clarity, color: "#3B82F6" },
    { name: "Confidence", value: analysis.confidence, color: "#10B981" },
    { name: "Tonal Variation", value: analysis.tonalVariation, color: "#F59E0B" },
    { name: "Energy", value: analysis.energy, color: "#EF4444" },
  ];

  const radarData = [
    { subject: "Clarity", A: analysis.clarity, fullMark: 100 },
    { subject: "Confidence", A: analysis.confidence, fullMark: 100 },
    { subject: "Tonal Variation", A: analysis.tonalVariation, fullMark: 100 },
    { subject: "Energy", A: analysis.energy, fullMark: 100 },
    { subject: "Pacing", A: Math.min(100, (analysis.wpm / 180) * 100), fullMark: 100 },
  ];

  const levelColors = {
    "Core Speaker": "#EF4444",
    "Clear Speaker": "#F59E0B", 
    "Fluid Speaker": "#3B82F6",
    "Bold Speaker": "#8B5CF6",
    "Pro Speaker": "#10B981"
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-400";
    if (score >= 80) return "text-blue-400";
    if (score >= 70) return "text-yellow-400";
    if (score >= 60) return "text-orange-400";
    return "text-red-400";
  };

  const getScoreDescription = (score: number) => {
    if (score >= 90) return "Excellent";
    if (score >= 80) return "Good";
    if (score >= 70) return "Average";
    if (score >= 60) return "Needs Improvement";
    return "Requires Practice";
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Level Achievement */}
      <Card className="neural-card border-primary/30">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Award className="w-8 h-8 text-primary" />
            <CardTitle className="text-2xl gradient-text">{analysis.level}</CardTitle>
          </div>
          <CardDescription className="text-lg">{analysis.levelDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <Badge 
              variant="outline" 
              className="text-lg px-6 py-2"
              style={{ color: levelColors[analysis.level as keyof typeof levelColors] }}
            >
              Level Assessment Complete
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="neural-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Clarity</p>
                <p className={`text-2xl font-bold ${getScoreColor(analysis.clarity)}`}>
                  {analysis.clarity}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="neural-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-accent" />
              <div>
                <p className="text-sm text-muted-foreground">Confidence</p>
                <p className={`text-2xl font-bold ${getScoreColor(analysis.confidence)}`}>
                  {analysis.confidence}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="neural-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              <div>
                <p className="text-sm text-muted-foreground">Energy</p>
                <p className={`text-2xl font-bold ${getScoreColor(analysis.energy)}`}>
                  {analysis.energy}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="neural-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-sm text-muted-foreground">Speaking Rate</p>
                <p className="text-2xl font-bold text-foreground">{analysis.wpm} WPM</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <Card className="neural-card">
          <CardHeader>
            <CardTitle>Performance Breakdown</CardTitle>
            <CardDescription>Detailed analysis of your speech metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="value" fill="url(#gradient)" radius={[4, 4, 0, 0]} />
                <defs>
                  <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" />
                    <stop offset="100%" stopColor="hsl(var(--accent))" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Radar Chart */}
        <Card className="neural-card">
          <CardHeader>
            <CardTitle>Speech Profile</CardTitle>
            <CardDescription>Overall speaking pattern analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={45} domain={[0, 100]} />
                <Radar
                  name="Performance"
                  dataKey="A"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analysis */}
      <Card className="neural-card">
        <CardHeader>
          <CardTitle>Detailed Analysis & Recommendations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Filler Words Analysis */}
          <div>
            <h4 className="text-lg font-semibold mb-3">Speech Patterns</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-muted/20 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Filler Words</p>
                <p className="text-xl font-bold text-foreground">{analysis.fillerWords.length}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {analysis.fillerWords.length > 5 ? "Practice reducing fillers" : "Good control of fillers"}
                </p>
              </div>
              <div className="bg-muted/20 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Pause Count</p>
                <p className="text-xl font-bold text-foreground">{analysis.pauseCount}</p>
                <p className="text-xs text-muted-foreground mt-1">Natural pacing</p>
              </div>
              <div className="bg-muted/20 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="text-xl font-bold text-foreground">{analysis.duration}s</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {analysis.duration > 60 ? "Good length" : "Try for longer practice"}
                </p>
              </div>
            </div>
          </div>

          {/* Improvement Recommendations */}
          <div>
            <h4 className="text-lg font-semibold mb-3">Recommendations for Improvement</h4>
            <div className="space-y-3">
              {analysis.clarity < 80 && (
                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <p className="font-medium text-blue-400">Clarity Enhancement</p>
                  <p className="text-sm text-muted-foreground">Practice enunciation exercises and speak more slowly to improve clarity.</p>
                </div>
              )}
              {analysis.confidence < 75 && (
                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <p className="font-medium text-green-400">Confidence Building</p>
                  <p className="text-sm text-muted-foreground">Practice more frequently and record yourself to build confidence in your delivery.</p>
                </div>
              )}
              {analysis.tonalVariation < 70 && (
                <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <p className="font-medium text-yellow-400">Tonal Variation</p>
                  <p className="text-sm text-muted-foreground">Work on emphasizing key words and varying your tone to convey emotions effectively.</p>
                </div>
              )}
              {analysis.energy < 70 && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="font-medium text-red-400">Energy & Enthusiasm</p>
                  <p className="text-sm text-muted-foreground">Increase your energy levels and show more enthusiasm in your delivery.</p>
                </div>
              )}
            </div>
          </div>

          {/* Next Steps */}
          <div>
            <h4 className="text-lg font-semibold mb-3">Next Steps</h4>
            <div className="p-4 bg-gradient-accent rounded-lg border border-primary/20">
              <p className="text-foreground mb-2">Based on your {analysis.level} level:</p>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Continue practicing with narratives that match your skill level</li>
                <li>Focus on your weakest areas identified in this analysis</li>
                <li>Record yourself regularly to track improvement over time</li>
                <li>Challenge yourself with more complex emotional narratives</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};