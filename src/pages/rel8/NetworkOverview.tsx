import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import { DotConnectorHeader } from "@/components/layout/DotConnectorHeader";
import { Rel8OnlyNavigation } from "@/components/rel8t/Rel8OnlyNavigation";
import NetworkMapGlobe from "@/components/rel8t/NetworkMapGlobe";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MultiProgress } from "@/components/ui/multi-progress";
import { NetworkScoreBadge } from "@/components/ui/network-score-badge";
import { ConnectionStrengthBar } from "@/components/rel8t/network/ConnectionStrengthBar";
import { SolarSystem } from "@/components/ui/SolarSystem";
import { mockContacts, getStrengthDistribution, getAverageScores } from "@/data/mockConnectionStrengthData";
import { connectionStrengthConfig, getAllStrengthConfigs } from "@/config/connectionStrengthConfig";
import { getUserNetworkScore, getNetworkScoreTier } from "@/services/connectionStrengthService";
import { useUser } from "@/contexts/UserContext";
import { 
  Users, TrendingUp, Zap, Target, Activity, BarChart3, 
  Network, Globe, Sparkles, ArrowRight
} from "lucide-react";

export default function NetworkOverview() {
  const { currentUser } = useUser();
  
  // Fetch user's network score
  const { data: networkScoreData } = useQuery({
    queryKey: ['user-network-score', currentUser?.id],
    queryFn: () => getUserNetworkScore(currentUser!.id),
    enabled: !!currentUser?.id,
  });

  // Get mock data statistics
  const strengthDistribution = useMemo(() => getStrengthDistribution(), []);
  const averageScores = useMemo(() => getAverageScores(), []);
  const strengthConfigs = useMemo(() => getAllStrengthConfigs(), []);

  // Calculate mock network metrics
  const totalContacts = mockContacts.length;
  const avgScore = Math.round(averageScores.total);
  const networkScore = networkScoreData?.score || avgScore * totalContacts;
  const tier = getNetworkScoreTier(networkScore);

  // Get solar system ID based on tier
  const solarSystemId = useMemo(() => {
    const tierSystems: Record<number, string> = {
      0: 'mercury',
      1: 'venus', 
      2: 'earth',
      3: 'mars',
      4: 'jupiter',
      5: 'saturn'
    };
    return tierSystems[tier.tier] || 'earth';
  }, [tier]);

  // Calculate engagement breakdown
  const engagementBreakdown = useMemo(() => {
    const total = mockContacts.length;
    const activeInPath = mockContacts.filter(c => c.pathFactors.isActiveInPath).length;
    const withStrategy = mockContacts.filter(c => c.pathFactors.hasStrategy).length;
    const recentActivity = mockContacts.filter(c => c.pathFactors.recentPathActivity).length;
    
    return {
      activeInPath: Math.round((activeInPath / total) * 100),
      withStrategy: Math.round((withStrategy / total) * 100),
      recentActivity: Math.round((recentActivity / total) * 100),
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Navbar />
      <DotConnectorHeader />
      
      <div className="container mx-auto max-w-6xl px-4 py-6 pb-32 space-y-6 animate-fade-in">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-teal-500/20 flex items-center justify-center">
              <Network className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Network Overview</h1>
              <p className="text-sm text-muted-foreground">
                Analyze your relationship portfolio
              </p>
            </div>
          </div>
          <SolarSystem systemId={solarSystemId} size={80} static />
        </div>

        {/* Network Score Card */}
        <Card className="glass-morphism border-primary/20 overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-1">{networkScore.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wide">Network Score</div>
                </div>
                <div className="h-16 w-px bg-border/50 hidden md:block" />
                <div className="text-center">
                  <Badge className="bg-primary/20 text-primary border-primary/30 mb-2">
                    Tier {tier.tier} • {tier.label}
                  </Badge>
                  <div className="text-xs text-muted-foreground">{tier.planets} planets unlocked</div>
                </div>
              </div>
              <NetworkScoreBadge score={networkScore} />
            </div>
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="glass-morphism border-0 bg-card/40">
            <CardContent className="p-4 text-center">
              <Users className="h-6 w-6 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">{totalContacts}</div>
              <div className="text-xs text-muted-foreground">Total Contacts</div>
            </CardContent>
          </Card>
          <Card className="glass-morphism border-0 bg-card/40">
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-6 w-6 text-emerald-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{avgScore}%</div>
              <div className="text-xs text-muted-foreground">Avg Strength</div>
            </CardContent>
          </Card>
          <Card className="glass-morphism border-0 bg-card/40">
            <CardContent className="p-4 text-center">
              <Target className="h-6 w-6 text-amber-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{engagementBreakdown.activeInPath}%</div>
              <div className="text-xs text-muted-foreground">Active Paths</div>
            </CardContent>
          </Card>
          <Card className="glass-morphism border-0 bg-card/40">
            <CardContent className="p-4 text-center">
              <Activity className="h-6 w-6 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{engagementBreakdown.recentActivity}%</div>
              <div className="text-xs text-muted-foreground">Recent Activity</div>
            </CardContent>
          </Card>
        </div>

        {/* Connection Strength Distribution */}
        <Card className="glass-morphism border-0 bg-card/40">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="h-5 w-5 text-primary" />
              Connection Strength Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Strength Bars */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {strengthConfigs.map((config) => {
                const count = strengthDistribution[config.id as keyof typeof strengthDistribution] || 0;
                const percentage = Math.round((count / totalContacts) * 100);
                
                return (
                  <div key={config.id} className="p-4 rounded-xl bg-card/60 border border-border/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-sm font-semibold ${config.textClass}`}>{config.label}</span>
                      <span className="text-lg font-bold">{count}</span>
                    </div>
                    <Progress 
                      value={percentage} 
                      className="h-2"
                    />
                    <div className="text-xs text-muted-foreground mt-1">{percentage}% of network</div>
                  </div>
                );
              })}
            </div>

            {/* Overall Progress Bar */}
            <div className="pt-4 border-t border-border/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Network Health</span>
                <span className="text-sm text-muted-foreground">{avgScore}% average</span>
              </div>
              <MultiProgress 
                setupValue={Math.min(10, (strengthDistribution.spark / totalContacts) * 100)}
                usageValue={Math.min(40, ((strengthDistribution.ember + strengthDistribution.flame) / totalContacts) * 100)}
                premiumValue={Math.min(50, (strengthDistribution.star / totalContacts) * 100)}
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>New</span>
                <span>Developing</span>
                <span>Strong</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Score Breakdown */}
        <Card className="glass-morphism border-0 bg-card/40">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Zap className="h-5 w-5 text-primary" />
              Score Breakdown (Averages)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Engagement</span>
                  <span className="text-sm font-semibold">{averageScores.engagement.toFixed(1)}</span>
                </div>
                <Progress value={(averageScores.engagement / 35) * 100} className="h-2" />
                <div className="text-xs text-muted-foreground">35% weight</div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Origin</span>
                  <span className="text-sm font-semibold">{averageScores.origin.toFixed(1)}</span>
                </div>
                <Progress value={(averageScores.origin / 25) * 100} className="h-2" />
                <div className="text-xs text-muted-foreground">25% weight</div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Network</span>
                  <span className="text-sm font-semibold">{averageScores.network.toFixed(1)}</span>
                </div>
                <Progress value={(averageScores.network / 25) * 100} className="h-2" />
                <div className="text-xs text-muted-foreground">25% weight</div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Path Progress</span>
                  <span className="text-sm font-semibold">{averageScores.path.toFixed(1)}</span>
                </div>
                <Progress value={(averageScores.path / 15) * 100} className="h-2" />
                <div className="text-xs text-muted-foreground">15% weight</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sample Connection Strength Bars */}
        <Card className="glass-morphism border-0 bg-card/40">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="h-5 w-5 text-primary" />
              Connection Strength Levels
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {(['spark', 'ember', 'flame', 'star'] as const).map((strength) => (
              <div key={strength} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium capitalize">{strength}</span>
                  <span className="text-xs text-muted-foreground">
                    {connectionStrengthConfig[strength].description}
                  </span>
                </div>
                <ConnectionStrengthBar strength={strength} size="md" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Network Map */}
        <Card className="glass-morphism border-0 bg-card/40 overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Globe className="h-5 w-5 text-primary" />
              Network Map
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[400px]">
              <NetworkMapGlobe />
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/rel8/actv8" className="group">
            <Card className="glass-morphism border-0 bg-card/40 hover:bg-card/60 transition-all">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Zap className="h-5 w-5 text-primary" />
                  <span className="font-medium">Actv8 Dashboard</span>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </CardContent>
            </Card>
          </Link>
          <Link to="/rel8/insights" className="group">
            <Card className="glass-morphism border-0 bg-card/40 hover:bg-card/60 transition-all">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <span className="font-medium">Network Insights</span>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </CardContent>
            </Card>
          </Link>
          <Link to="/admin?tab=connection-strength" className="group">
            <Card className="glass-morphism border-0 bg-card/40 hover:bg-card/60 transition-all">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Target className="h-5 w-5 text-primary" />
                  <span className="font-medium">Score Settings</span>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pt-2 bg-gradient-to-t from-background via-background to-transparent pointer-events-none">
        <div className="container mx-auto max-w-6xl pointer-events-auto">
          <Rel8OnlyNavigation />
        </div>
      </div>
    </div>
  );
}
