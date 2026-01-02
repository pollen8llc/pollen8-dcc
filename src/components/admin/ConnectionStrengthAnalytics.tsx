import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend 
} from 'recharts';
import { 
  TrendingUp, TrendingDown, Users, Zap, Link2, Clock, 
  CheckCircle2, XCircle, AlertTriangle, ArrowUpRight, ArrowDownRight,
  Route
} from 'lucide-react';
import { mockContacts, getStrengthDistribution, getAverageScores } from '@/data/mockConnectionStrengthData';
import { 
  getStrengthBadgeClass, 
  mapScoreToStrength,
  ConnectionStrength,
  calculateConnectionStrength,
  EngagementFactors,
  PathFactors
} from '@/utils/connectionStrengthCalculator';

const ConnectionStrengthAnalytics: React.FC = () => {
  const distribution = getStrengthDistribution();
  const averages = getAverageScores();
  
  // Simulator state
  const [simEngagement, setSimEngagement] = useState(17);
  const [simOrigin, setSimOrigin] = useState(12);
  const [simNetwork, setSimNetwork] = useState(12);
  const [simPath, setSimPath] = useState(7);
  
  const simulatedTotal = simEngagement + simOrigin + simNetwork + simPath;
  const simulatedStrength = mapScoreToStrength(simulatedTotal);
  
  // Chart data
  const pieData = [
    { name: 'Star', value: distribution.star, color: 'hsl(45 93% 47%)' },
    { name: 'Flame', value: distribution.flame, color: 'hsl(142 76% 36%)' },
    { name: 'Ember', value: distribution.ember, color: 'hsl(var(--primary))' },
    { name: 'Spark', value: distribution.spark, color: 'hsl(var(--muted-foreground))' }
  ].filter(d => d.value > 0);
  
  // Sorted contacts for table
  const sortedContacts = useMemo(() => 
    [...mockContacts].sort((a, b) => b.scoreBreakdown.total - a.scoreBreakdown.total),
    []
  );

  return (
    <div className="space-y-6">
      {/* Formula Overview */}
      <Card className="glass-morphism border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Zap className="w-5 h-5 text-primary" />
            Connection Strength Formula
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Engagement */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  Engagement
                </span>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">35%</Badge>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full" style={{ width: '35%' }} />
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-1 text-green-400">
                  <ArrowUpRight className="w-3 h-3" />
                  <span>Calendar accepts (+8), Fast responses (+5)</span>
                </div>
                <div className="flex items-center gap-1 text-red-400">
                  <ArrowDownRight className="w-3 h-3" />
                  <span>Ignored (-8), Declines (-6), Gaps (-7)</span>
                </div>
              </div>
            </div>
            
            {/* Origin */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium flex items-center gap-2">
                  <Link2 className="w-4 h-4 text-green-400" />
                  Origin
                </span>
                <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/30">25%</Badge>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-green-500 to-green-500/60 rounded-full" style={{ width: '25%' }} />
              </div>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p>Invite: 20pts | Wizard: 16pts | Manual: 12pts</p>
                <p>Import: 8pts | Unknown: 4pts | +Inviter: +5pts</p>
              </div>
            </div>
            
            {/* Network */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium flex items-center gap-2">
                  <Clock className="w-4 h-4 text-yellow-400" />
                  Network
                </span>
                <Badge variant="outline" className="bg-yellow-500/10 text-yellow-400 border-yellow-500/30">25%</Badge>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-yellow-500 to-yellow-500/60 rounded-full" style={{ width: '25%' }} />
              </div>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p>Inviter strength: 2-10pts | Shared: 2pts each</p>
                <p>Affiliations: 1pt each | Community: 1pt each</p>
              </div>
            </div>
            
            {/* Path (NEW) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium flex items-center gap-2">
                  <Route className="w-4 h-4 text-blue-400" />
                  Path Progress
                </span>
                <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30">15%</Badge>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-blue-500/60 rounded-full" style={{ width: '15%' }} />
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-1 text-green-400">
                  <ArrowUpRight className="w-3 h-3" />
                  <span>Tier (+2.5/tier), Completed (+1.5)</span>
                </div>
                <div className="flex items-center gap-1 text-red-400">
                  <ArrowDownRight className="w-3 h-3" />
                  <span>Skipped paths (-1 each)</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Score Mapping */}
          <div className="mt-6 pt-6 border-t border-primary/10">
            <p className="text-sm text-muted-foreground mb-3">Score → Strength Mapping</p>
            <div className="flex flex-wrap gap-3">
              <Badge className={`${getStrengthBadgeClass('star')} px-3 py-1`}>
                Star: 75-100
              </Badge>
              <Badge className={`${getStrengthBadgeClass('flame')} px-3 py-1`}>
                Flame: 50-74
              </Badge>
              <Badge className={`${getStrengthBadgeClass('ember')} px-3 py-1`}>
                Ember: 25-49
              </Badge>
              <Badge className={`${getStrengthBadgeClass('spark')} px-3 py-1`}>
                Spark: 0-24
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribution Chart */}
        <Card className="glass-morphism border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">Strength Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                    labelLine={false}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="text-center p-3 rounded-lg bg-primary/5">
                <p className="text-2xl font-bold text-primary">{averages.total}</p>
                <p className="text-xs text-muted-foreground">Avg Total Score</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-primary/5">
                <p className="text-2xl font-bold text-primary">{mockContacts.length}</p>
                <p className="text-xs text-muted-foreground">Total Contacts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Score Simulator */}
        <Card className="glass-morphism border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">Score Simulator</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Engagement Score</Label>
                  <span className="text-sm font-mono text-primary">{simEngagement}/35</span>
                </div>
                <Slider
                  value={[simEngagement]}
                  onValueChange={([v]) => setSimEngagement(v)}
                  max={35}
                  step={1}
                  className="cursor-pointer"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Origin Score</Label>
                  <span className="text-sm font-mono text-green-400">{simOrigin}/25</span>
                </div>
                <Slider
                  value={[simOrigin]}
                  onValueChange={([v]) => setSimOrigin(v)}
                  max={25}
                  step={1}
                  className="cursor-pointer"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Network Score</Label>
                  <span className="text-sm font-mono text-yellow-400">{simNetwork}/25</span>
                </div>
                <Slider
                  value={[simNetwork]}
                  onValueChange={([v]) => setSimNetwork(v)}
                  max={25}
                  step={1}
                  className="cursor-pointer"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Path Progress Score</Label>
                  <span className="text-sm font-mono text-blue-400">{simPath}/15</span>
                </div>
                <Slider
                  value={[simPath]}
                  onValueChange={([v]) => setSimPath(v)}
                  max={15}
                  step={1}
                  className="cursor-pointer"
                />
              </div>
            </div>
            
            <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Score</p>
                  <p className="text-3xl font-bold">{simulatedTotal}</p>
                </div>
                <Badge className={`${getStrengthBadgeClass(simulatedStrength)} text-lg px-4 py-2`}>
                  {simulatedStrength.charAt(0).toUpperCase() + simulatedStrength.slice(1)}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Sample Contacts Table */}
      <Card className="glass-morphism border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Sample Contacts ({mockContacts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-primary/10">
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">Contact</th>
                  <th className="text-center py-3 px-2 font-medium text-muted-foreground">Engagement</th>
                  <th className="text-center py-3 px-2 font-medium text-muted-foreground">Origin</th>
                  <th className="text-center py-3 px-2 font-medium text-muted-foreground">Network</th>
                  <th className="text-center py-3 px-2 font-medium text-muted-foreground">Path</th>
                  <th className="text-center py-3 px-2 font-medium text-muted-foreground">Total</th>
                  <th className="text-center py-3 px-2 font-medium text-muted-foreground">Strength</th>
                </tr>
              </thead>
              <tbody>
                {sortedContacts.map((contact) => {
                  const { engagement, origin, network, path, total, strength } = contact.scoreBreakdown;
                  const netEngagement = engagement.positivePoints + engagement.negativePoints;
                  
                  return (
                    <tr key={contact.id} className="border-b border-primary/5 hover:bg-primary/5 transition-colors">
                      <td className="py-3 px-2">
                        <div>
                          <p className="font-medium">{contact.name}</p>
                          <p className="text-xs text-muted-foreground">{contact.email}</p>
                        </div>
                      </td>
                      <td className="text-center py-3 px-2">
                        <div className="flex items-center justify-center gap-1">
                          <span className={netEngagement >= 0 ? 'text-green-400' : 'text-red-400'}>
                            {engagement.score.toFixed(1)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            ({engagement.positivePoints > 0 && '+'}{engagement.positivePoints}/{engagement.negativePoints})
                          </span>
                        </div>
                      </td>
                      <td className="text-center py-3 px-2">
                        <span className="text-green-400">{origin.score}</span>
                      </td>
                      <td className="text-center py-3 px-2">
                        <span className="text-yellow-400">{network.score}</span>
                      </td>
                      <td className="text-center py-3 px-2">
                        <div className="flex items-center justify-center gap-1">
                          <span className="text-blue-400">{path.score.toFixed(1)}</span>
                          <span className="text-xs text-muted-foreground">
                            T{path.factors.currentTier}
                          </span>
                        </div>
                      </td>
                      <td className="text-center py-3 px-2">
                        <span className="font-bold text-primary">{total.toFixed(1)}</span>
                      </td>
                      <td className="text-center py-3 px-2">
                        <Badge className={`${getStrengthBadgeClass(strength)} capitalize`}>
                          {strength}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConnectionStrengthAnalytics;
