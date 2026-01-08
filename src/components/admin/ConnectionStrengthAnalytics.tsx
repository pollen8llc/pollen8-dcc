import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  Users, Zap, Link2, Clock, Route,
  Sparkles, Flame, CircleDot, Star, Plus, Minus,
  Calculator, ChevronRight
} from 'lucide-react';
import { mockContacts, getStrengthDistribution, getAverageScores } from '@/data/mockConnectionStrengthData';
import { 
  getStrengthBadgeClass, 
  mapScoreToStrength
} from '@/utils/connectionStrengthCalculator';
import { SolarSystem } from '@/components/ui/SolarSystem';
import { SOLAR_SYSTEMS } from '@/data/solarSystemsConfig';

// Avatar tiers organized by complexity (number of planets)
const AVATAR_TIERS = {
  tier0: ['UXI8000', 'UXI8002', 'UXI8009', 'UXI8018', 'UXI8025', 'UXI8035'], // 0 planets - simplest
  tier1: ['UXI8001', 'UXI8007', 'UXI8012', 'UXI8015', 'UXI8019', 'UXI8023', 'UXI8027', 'UXI8029', 'UXI8033', 'UXI8037', 'UXI8039'], // 1 planet
  tier2: ['UXI8003', 'UXI8004', 'UXI8008', 'UXI8014', 'UXI8017', 'UXI8021', 'UXI8024', 'UXI8026', 'UXI8031', 'UXI8034', 'UXI8036', 'UXI8040'], // 2 planets
  tier3: ['UXI8005', 'UXI8010', 'UXI8011', 'UXI8020', 'UXI8022', 'UXI8030', 'UXI8032'], // 3 planets
  tier4: ['UXI8006', 'UXI8013', 'UXI8028', 'UXI8038'], // 4 planets
  tier5: ['UXI8016', 'UXI9000'], // 5 planets - most complex
};

// Score thresholds for avatar tiers (scalable to thousands)
const AVATAR_SCORE_THRESHOLDS = [
  { min: 0, max: 99, tier: 0, planets: 0, label: '0-99' },
  { min: 100, max: 249, tier: 1, planets: 1, label: '100-249' },
  { min: 250, max: 499, tier: 2, planets: 2, label: '250-499' },
  { min: 500, max: 999, tier: 3, planets: 3, label: '500-999' },
  { min: 1000, max: 2499, tier: 4, planets: 4, label: '1K-2.5K' },
  { min: 2500, max: Infinity, tier: 5, planets: 5, label: '2.5K+' },
];

// Map network score to avatar tier and specific avatar
const getAvatarForScore = (score: number): { id: string; tier: number; planets: number; label: string } => {
  const threshold = AVATAR_SCORE_THRESHOLDS.find(t => score >= t.min && score <= t.max) || AVATAR_SCORE_THRESHOLDS[5];
  
  const tierKey = `tier${threshold.tier}` as keyof typeof AVATAR_TIERS;
  const tierAvatars = AVATAR_TIERS[tierKey];
  
  // Pick avatar within tier based on score (for variety)
  const index = Math.floor((score % tierAvatars.length));
  
  return { 
    id: tierAvatars[index], 
    tier: threshold.tier, 
    planets: threshold.planets,
    label: threshold.label
  };
};

const ConnectionStrengthAnalytics: React.FC = () => {
  const distribution = getStrengthDistribution();
  const averages = getAverageScores();
  
  // Network Score simulator state (editable)
  const [nsConnections, setNsConnections] = useState(250);
  const [nsAvgStrength, setNsAvgStrength] = useState(54);
  const [nsMultiplier, setNsMultiplier] = useState(0.1);
  
  // Simulator state - detailed breakdown
  const [simCalendarAccepts, setSimCalendarAccepts] = useState(2);
  const [simFastResponses, setSimFastResponses] = useState(1);
  const [simIgnored, setSimIgnored] = useState(0);
  const [simDeclines, setSimDeclines] = useState(0);
  const [simGaps, setSimGaps] = useState(1);
  
  const [simOriginType, setSimOriginType] = useState<'invite' | 'wizard' | 'manual' | 'import' | 'unknown'>('wizard');
  const [simHasInviter, setSimHasInviter] = useState(true);
  
  const [simInviterStrength, setSimInviterStrength] = useState(3);
  const [simSharedContacts, setSimSharedContacts] = useState(2);
  const [simSharedAffiliations, setSimSharedAffiliations] = useState(1);
  const [simSharedCommunities, setSimSharedCommunities] = useState(1);
  
  const [simCurrentTier, setSimCurrentTier] = useState(2);
  const [simCompletedPaths, setSimCompletedPaths] = useState(1);
  const [simSkippedPaths, setSimSkippedPaths] = useState(0);

  // Calculate scores
  const originPoints: Record<string, number> = {
    invite: 20, wizard: 16, manual: 12, import: 8, unknown: 4
  };

  // NEW WEIGHTS: Path (40) > Engagement (30) > Origin (15) = Network (15) = 100 total
  // Path is prioritized to encourage relationship development through tiers
  
  // Engagement: 30 pts max (was 35)
  const engagementPositive = (simCalendarAccepts * 6) + (simFastResponses * 4);
  const engagementNegative = (simIgnored * -6) + (simDeclines * -5) + (simGaps * -5);
  const engagementRaw = engagementPositive + engagementNegative;
  const engagementScore = Math.max(0, Math.min(30, engagementRaw));
  
  // Origin: 15 pts max (was 25)
  const originPointsScaled: Record<string, number> = {
    invite: 12, wizard: 10, manual: 7, import: 5, unknown: 3
  };
  const originBase = originPointsScaled[simOriginType];
  const originBonus = simHasInviter ? 3 : 0;
  const originScore = Math.min(15, originBase + originBonus);
  
  // Network: 15 pts max (was 25)
  const netInviterStrength = Math.min(5, Math.round(simInviterStrength / 2));
  const networkScoreCalc = Math.min(15, 
    netInviterStrength + 
    (simSharedContacts * 1.5) + 
    (simSharedAffiliations * 1) + 
    (simSharedCommunities * 1)
  );
  
  // Path Progress: 40 pts max (was 15) - HIGHEST PRIORITY
  // Tier progression is now the most valuable factor
  const pathPositive = (simCurrentTier * 5) + (simCompletedPaths * 4);
  const pathNegative = simSkippedPaths * -2;
  const pathScore = Math.max(0, Math.min(40, pathPositive + pathNegative));
  
  const totalScore = engagementScore + originScore + networkScoreCalc + pathScore;
  const simulatedStrength = mapScoreToStrength(totalScore);
  
  // Sorted contacts
  const sortedContacts = useMemo(() => 
    [...mockContacts].sort((a, b) => b.scoreBreakdown.total - a.scoreBreakdown.total),
    []
  );

  // Calculate network score from editable inputs
  const networkScoreCalculated = Math.round(nsConnections * nsAvgStrength * nsMultiplier);
  
  // Get avatar for current network score
  const currentAvatar = getAvatarForScore(networkScoreCalculated);
  const avatarConfig = SOLAR_SYSTEMS[currentAvatar.id];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      
      {/* SECTION 1: Network Score Preview with Dynamic Avatar */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-primary/20 via-primary/10 to-transparent border border-primary/30">
        <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
          Network Score → Avatar Mapping
        </h2>
        <p className="text-sm text-muted-foreground mb-6">Edit the values below to see how different network sizes affect avatar complexity</p>
        
        {/* Editable Formula Row */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          {/* Connections Input */}
          <div className="p-3 rounded-xl bg-white/10 text-center">
            <input
              type="number"
              value={nsConnections}
              onChange={(e) => setNsConnections(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-24 text-2xl font-bold text-center bg-transparent border-b-2 border-primary/50 focus:border-primary outline-none"
            />
            <p className="text-xs text-muted-foreground mt-1">Connections</p>
          </div>
          <span className="text-xl text-muted-foreground">×</span>
          
          {/* Avg Strength Input */}
          <div className="p-3 rounded-xl bg-white/10 text-center">
            <input
              type="number"
              value={nsAvgStrength}
              onChange={(e) => setNsAvgStrength(Math.max(0, Math.min(100, parseInt(e.target.value) || 0)))}
              className="w-16 text-2xl font-bold text-center bg-transparent border-b-2 border-primary/50 focus:border-primary outline-none"
            />
            <p className="text-xs text-muted-foreground mt-1">Avg Strength</p>
          </div>
          <span className="text-xl text-muted-foreground">×</span>
          
          {/* Multiplier Input */}
          <div className="p-3 rounded-xl bg-white/10 text-center">
            <input
              type="number"
              step="0.01"
              value={nsMultiplier}
              onChange={(e) => setNsMultiplier(Math.max(0, parseFloat(e.target.value) || 0))}
              className="w-16 text-2xl font-bold text-center bg-transparent border-b-2 border-primary/50 focus:border-primary outline-none"
            />
            <p className="text-xs text-muted-foreground mt-1">Multiplier</p>
          </div>
          <span className="text-xl text-muted-foreground">=</span>
          
          {/* Calculated Score */}
          <div className="p-3 rounded-xl bg-primary/30 text-center min-w-[100px]">
            <p className="text-2xl font-bold text-primary">{networkScoreCalculated.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Network Score</p>
          </div>
          <span className="text-xl text-muted-foreground">=</span>
          
          {/* Dynamic Avatar Result */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/10 border-2 border-primary/50">
            <SolarSystem systemId={currentAvatar.id} size={72} />
            <div className="text-left">
              <p className="font-mono text-sm text-primary font-bold">{currentAvatar.id}</p>
              <p className="text-sm font-medium">{avatarConfig?.name}</p>
              <p className="text-xs text-muted-foreground">Tier {currentAvatar.tier} • {currentAvatar.planets} planet{currentAvatar.planets !== 1 ? 's' : ''}</p>
            </div>
          </div>
              </div>
        
        {/* Quick Presets */}
        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          <p className="text-sm text-muted-foreground mr-2 self-center">Quick presets:</p>
          {[
            { label: 'New User', connections: 10, strength: 30 },
            { label: 'Active', connections: 50, strength: 45 },
            { label: 'Networker', connections: 150, strength: 55 },
            { label: 'Connector', connections: 500, strength: 60 },
            { label: 'Super Connector', connections: 1500, strength: 65 },
            { label: 'Network Leader', connections: 5000, strength: 70 },
          ].map((preset) => (
            <button
              key={preset.label}
              onClick={() => {
                setNsConnections(preset.connections);
                setNsAvgStrength(preset.strength);
              }}
              className="px-3 py-1.5 text-xs rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/30 transition-all"
            >
              {preset.label}
            </button>
          ))}
              </div>
        
        {/* Avatar Tier Scale */}
        <div className="border-t border-white/10 pt-4">
          <p className="text-sm text-muted-foreground mb-3">Avatar Complexity Tiers (by Network Score):</p>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-xs">
            {AVATAR_SCORE_THRESHOLDS.map((threshold) => {
              const sampleAvatars: Record<number, string> = {
                0: 'UXI8018', 1: 'UXI8001', 2: 'UXI8003', 
                3: 'UXI8005', 4: 'UXI8006', 5: 'UXI8016'
              };
              return (
                <div 
                  key={threshold.tier} 
                  className={`p-3 rounded-lg border transition-all ${
                    currentAvatar.tier === threshold.tier 
                      ? 'border-primary bg-primary/20 scale-105' 
                      : 'border-white/10 bg-white/5'
                  }`}
                >
                  <SolarSystem systemId={sampleAvatars[threshold.tier]} size={44} className="mx-auto mb-2" />
                  <p className={`font-bold text-sm ${currentAvatar.tier === threshold.tier ? 'text-primary' : ''}`}>
                    {threshold.label}
                  </p>
                  <p className="text-muted-foreground">
                    {threshold.planets} planet{threshold.planets !== 1 ? 's' : ''}
                  </p>
                  <p className="text-muted-foreground opacity-60">
                    Tier {threshold.tier}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Formula explanation */}
        <div className="mt-4 p-3 rounded-lg bg-white/5 text-xs text-muted-foreground">
          <strong>Formula:</strong> Network Score = Connections × Average Connection Strength × Multiplier
          <br />
          <strong>Example:</strong> A user with {nsConnections.toLocaleString()} connections at {nsAvgStrength} avg strength = {networkScoreCalculated.toLocaleString()} score → <span className="text-primary font-medium">{currentAvatar.id}</span> ({currentAvatar.planets} planet avatar)
        </div>
      </div>

      {/* SECTION 2: Strength Distribution */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Current Distribution ({mockContacts.length} contacts)</h2>
        <div className="grid grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border-2 border-yellow-500/30 bg-yellow-500/10 text-center">
            <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-3xl font-bold text-yellow-500">{distribution.star}</p>
            <p className="text-sm text-muted-foreground">Star (75-100)</p>
          </div>
          <div className="p-4 rounded-xl border-2 border-green-500/30 bg-green-500/10 text-center">
            <Flame className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-3xl font-bold text-green-500">{distribution.flame}</p>
            <p className="text-sm text-muted-foreground">Flame (50-74)</p>
          </div>
          <div className="p-4 rounded-xl border-2 border-primary/30 bg-primary/10 text-center">
            <Sparkles className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-3xl font-bold text-primary">{distribution.ember}</p>
            <p className="text-sm text-muted-foreground">Ember (25-49)</p>
          </div>
          <div className="p-4 rounded-xl border-2 border-zinc-500/30 bg-zinc-500/10 text-center">
            <CircleDot className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
            <p className="text-3xl font-bold text-zinc-400">{distribution.spark}</p>
            <p className="text-sm text-muted-foreground">Spark (0-24)</p>
                </div>
              </div>
            </div>
            
      {/* SECTION 3: Connection Strength Calculator */}
      <div className="p-6 rounded-2xl border border-white/10 bg-card/40">
        <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
          <Calculator className="w-5 h-5" />
          Connection Strength Calculator
        </h2>

        {/* Factor 1: Path Progress (40 pts) - HIGHEST PRIORITY */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium flex items-center gap-2">
              <Route className="w-4 h-4 text-blue-500" />
              1. Path Progress
              <Badge variant="outline" className="ml-2 text-xs bg-blue-500/10 text-blue-500 border-blue-500/30">HIGHEST PRIORITY</Badge>
            </h3>
            <Badge className="bg-blue-500/20 text-blue-500 border-blue-500/30 text-base px-3">
              {pathScore.toFixed(1)} / 40 pts
            </Badge>
          </div>
          
          <div className="space-y-4 pl-6 border-l-2 border-blue-500/30">
            <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 space-y-4">
              <p className="text-sm text-blue-400 font-medium">Relationship development through tier progression is the most valuable factor</p>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Current Tier (T{simCurrentTier})</span>
                  <span className="text-sm font-mono">{simCurrentTier} × 5 = <span className="text-blue-500 font-bold">+{simCurrentTier * 5}</span></span>
                </div>
                <Slider value={[simCurrentTier]} onValueChange={([v]) => setSimCurrentTier(v)} max={6} step={1} />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Completed Paths ({simCompletedPaths})</span>
                  <span className="text-sm font-mono">{simCompletedPaths} × 4 = <span className="text-blue-500 font-bold">+{simCompletedPaths * 4}</span></span>
                </div>
                <Slider value={[simCompletedPaths]} onValueChange={([v]) => setSimCompletedPaths(v)} max={5} step={1} />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Skipped Paths ({simSkippedPaths})</span>
                  <span className="text-sm font-mono">{simSkippedPaths} × -2 = <span className="text-red-500 font-bold">{simSkippedPaths * -2}</span></span>
                </div>
                <Slider value={[simSkippedPaths]} onValueChange={([v]) => setSimSkippedPaths(v)} max={5} step={1} />
              </div>
            </div>
            
            <div className="p-3 rounded-lg bg-white/5 text-sm">
              <span className="text-muted-foreground">Calculation:</span>{' '}
              <span className="text-blue-500">+{(simCurrentTier * 5) + (simCompletedPaths * 4)}</span>{' '}
              <span className="text-red-500">{simSkippedPaths * -2}</span>{' '}
              = {(simCurrentTier * 5) + (simCompletedPaths * 4) + (simSkippedPaths * -2)} → clamped to <span className="font-bold">{pathScore.toFixed(1)}</span> (0-40 range)
            </div>
          </div>
        </div>

        {/* Factor 2: Engagement (30 pts) */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              2. Engagement Score
            </h3>
            <Badge className="bg-primary/20 text-primary border-primary/30 text-base px-3">
              {engagementScore} / 30 pts
            </Badge>
          </div>
          
          <div className="space-y-4 pl-6 border-l-2 border-primary/30">
            {/* Positive factors */}
            <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/20">
              <p className="text-sm font-medium text-green-500 mb-3 flex items-center gap-1">
                <Plus className="w-4 h-4" /> Positive Actions = +{engagementPositive}
              </p>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Calendar Accepts ({simCalendarAccepts})</span>
                    <span className="text-sm font-mono">{simCalendarAccepts} × 6 = <span className="text-green-500 font-bold">+{simCalendarAccepts * 6}</span></span>
                  </div>
                  <Slider value={[simCalendarAccepts]} onValueChange={([v]) => setSimCalendarAccepts(v)} max={5} step={1} />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Fast Responses ({simFastResponses})</span>
                    <span className="text-sm font-mono">{simFastResponses} × 4 = <span className="text-green-500 font-bold">+{simFastResponses * 4}</span></span>
              </div>
                  <Slider value={[simFastResponses]} onValueChange={([v]) => setSimFastResponses(v)} max={5} step={1} />
              </div>
              </div>
            </div>
            
            {/* Negative factors */}
            <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20">
              <p className="text-sm font-medium text-red-500 mb-3 flex items-center gap-1">
                <Minus className="w-4 h-4" /> Negative Actions = {engagementNegative}
              </p>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Ignored Outreach ({simIgnored})</span>
                    <span className="text-sm font-mono">{simIgnored} × -6 = <span className="text-red-500 font-bold">{simIgnored * -6}</span></span>
                  </div>
                  <Slider value={[simIgnored]} onValueChange={([v]) => setSimIgnored(v)} max={5} step={1} />
              </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Declines ({simDeclines})</span>
                    <span className="text-sm font-mono">{simDeclines} × -5 = <span className="text-red-500 font-bold">{simDeclines * -5}</span></span>
              </div>
                  <Slider value={[simDeclines]} onValueChange={([v]) => setSimDeclines(v)} max={5} step={1} />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Contact Gaps ({simGaps})</span>
                    <span className="text-sm font-mono">{simGaps} × -5 = <span className="text-red-500 font-bold">{simGaps * -5}</span></span>
                  </div>
                  <Slider value={[simGaps]} onValueChange={([v]) => setSimGaps(v)} max={5} step={1} />
              </div>
            </div>
          </div>
          
            <div className="p-3 rounded-lg bg-white/5 text-sm">
              <span className="text-muted-foreground">Calculation:</span>{' '}
              <span className="text-green-500">+{engagementPositive}</span>{' '}
              <span className="text-red-500">{engagementNegative}</span>{' '}
              = {engagementRaw} → clamped to <span className="font-bold">{engagementScore}</span> (0-30 range)
            </div>
          </div>
        </div>

        {/* Factor 3: Origin (15 pts) */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium flex items-center gap-2">
              <Link2 className="w-4 h-4 text-green-500" />
              3. Origin Score
            </h3>
            <Badge className="bg-green-500/20 text-green-500 border-green-500/30 text-base px-3">
              {originScore} / 15 pts
            </Badge>
          </div>
          
          <div className="space-y-4 pl-6 border-l-2 border-green-500/30">
            <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/20">
              <p className="text-sm text-muted-foreground mb-3">How was this contact added?</p>
              
              <div className="grid grid-cols-5 gap-2 mb-4">
                {(['invite', 'wizard', 'manual', 'import', 'unknown'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setSimOriginType(type)}
                    className={`p-3 rounded-lg border text-center transition-all ${
                      simOriginType === type 
                        ? 'bg-green-500/20 border-green-500/50 text-green-500' 
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <p className="text-lg font-bold">{originPointsScaled[type]}</p>
                    <p className="text-xs capitalize">{type}</p>
                  </button>
                ))}
              </div>
              
              <label className="flex items-center gap-3 p-3 rounded-lg bg-white/5 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={simHasInviter}
                  onChange={(e) => setSimHasInviter(e.target.checked)}
                  className="rounded w-5 h-5"
                />
                <span className="text-sm flex-1">Contact was referred by someone (has inviter)</span>
                <span className="font-mono text-green-500 font-bold">+3</span>
              </label>
              </div>
            
            <div className="p-3 rounded-lg bg-white/5 text-sm">
              <span className="text-muted-foreground">Calculation:</span>{' '}
              {originBase} (base){simHasInviter && <span className="text-green-500"> +3 (inviter)</span>}{' '}
              = <span className="font-bold">{originScore}</span>
            </div>
          </div>
        </div>

        {/* Factor 4: Network (15 pts) */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium flex items-center gap-2">
              <Clock className="w-4 h-4 text-yellow-500" />
              4. Network Score
            </h3>
            <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30 text-base px-3">
              {networkScoreCalc} / 15 pts
            </Badge>
          </div>
          
          <div className="space-y-4 pl-6 border-l-2 border-yellow-500/30">
            <div className="p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/20 space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Inviter's Strength (2-10 → scaled)</span>
                  <span className="text-sm font-mono">= <span className="text-yellow-500 font-bold">+{netInviterStrength}</span></span>
                </div>
                <Slider value={[simInviterStrength]} onValueChange={([v]) => setSimInviterStrength(v)} min={2} max={10} step={1} />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Shared Contacts ({simSharedContacts})</span>
                  <span className="text-sm font-mono">{simSharedContacts} × 1.5 = <span className="text-yellow-500 font-bold">+{(simSharedContacts * 1.5).toFixed(1)}</span></span>
                </div>
                <Slider value={[simSharedContacts]} onValueChange={([v]) => setSimSharedContacts(v)} max={10} step={1} />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Shared Affiliations ({simSharedAffiliations})</span>
                  <span className="text-sm font-mono">{simSharedAffiliations} × 1 = <span className="text-yellow-500 font-bold">+{simSharedAffiliations}</span></span>
                </div>
                <Slider value={[simSharedAffiliations]} onValueChange={([v]) => setSimSharedAffiliations(v)} max={10} step={1} />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Shared Communities ({simSharedCommunities})</span>
                  <span className="text-sm font-mono">{simSharedCommunities} × 1 = <span className="text-yellow-500 font-bold">+{simSharedCommunities}</span></span>
                </div>
                <Slider value={[simSharedCommunities]} onValueChange={([v]) => setSimSharedCommunities(v)} max={10} step={1} />
              </div>
            </div>
            
            <div className="p-3 rounded-lg bg-white/5 text-sm">
              <span className="text-muted-foreground">Calculation:</span>{' '}
              {netInviterStrength} + {(simSharedContacts * 1.5).toFixed(1)} + {simSharedAffiliations} + {simSharedCommunities}{' '}
              = {(netInviterStrength + (simSharedContacts * 1.5) + simSharedAffiliations + simSharedCommunities).toFixed(1)} → clamped to <span className="font-bold">{networkScoreCalc}</span>
            </div>
          </div>
        </div>

        {/* TOTAL */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-500/20 to-transparent border border-blue-500/30">
          <h3 className="font-medium mb-4">Total Connection Strength (Path-Prioritized)</h3>
          
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="px-4 py-2 rounded-lg bg-blue-500/20 text-blue-500 font-mono font-bold">
              {pathScore.toFixed(1)}
              <span className="text-xs ml-1 opacity-70">path</span>
            </div>
            <span className="text-xl">+</span>
            <div className="px-4 py-2 rounded-lg bg-primary/20 text-primary font-mono">
              {engagementScore}
              <span className="text-xs ml-1 opacity-70">eng</span>
            </div>
            <span className="text-xl">+</span>
            <div className="px-4 py-2 rounded-lg bg-green-500/20 text-green-500 font-mono">
              {originScore}
              <span className="text-xs ml-1 opacity-70">ori</span>
            </div>
            <span className="text-xl">+</span>
            <div className="px-4 py-2 rounded-lg bg-yellow-500/20 text-yellow-500 font-mono">
              {networkScoreCalc}
              <span className="text-xs ml-1 opacity-70">net</span>
            </div>
            <span className="text-xl">=</span>
            <div className="px-6 py-3 rounded-xl bg-white/10 font-bold text-2xl">
              {totalScore.toFixed(1)}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground">Strength Level:</span>
            <Badge className={`${getStrengthBadgeClass(simulatedStrength)} text-lg px-4 py-2 capitalize`}>
              {simulatedStrength === 'star' && <Star className="w-4 h-4 mr-2" />}
              {simulatedStrength === 'flame' && <Flame className="w-4 h-4 mr-2" />}
              {simulatedStrength === 'ember' && <Sparkles className="w-4 h-4 mr-2" />}
              {simulatedStrength === 'spark' && <CircleDot className="w-4 h-4 mr-2" />}
              {simulatedStrength}
            </Badge>
          </div>
        </div>
      </div>
      
      {/* SECTION 4: Sample Contacts Data */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Sample Contact Data ({sortedContacts.length} contacts)</h2>
        
        <div className="rounded-xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-white/5">
                <tr>
                  <th className="text-left py-3 px-4 font-medium">#</th>
                  <th className="text-left py-3 px-4 font-medium">Contact</th>
                  <th className="text-right py-3 px-4 font-medium text-primary">Engagement</th>
                  <th className="text-right py-3 px-4 font-medium text-green-500">Origin</th>
                  <th className="text-right py-3 px-4 font-medium text-yellow-500">Network</th>
                  <th className="text-right py-3 px-4 font-medium text-blue-500">Path</th>
                  <th className="text-right py-3 px-4 font-medium">Total</th>
                  <th className="text-center py-3 px-4 font-medium">Strength</th>
                </tr>
              </thead>
              <tbody>
                {sortedContacts.map((contact, index) => {
                  const { engagement, origin, network, path, total, strength } = contact.scoreBreakdown;
                  return (
                    <tr key={contact.id} className="border-t border-white/5 hover:bg-white/5">
                      <td className="py-3 px-4 text-muted-foreground">{index + 1}</td>
                      <td className="py-3 px-4">
                          <p className="font-medium">{contact.name}</p>
                          <p className="text-xs text-muted-foreground">{contact.email}</p>
                      </td>
                      <td className="py-3 px-4 text-right font-mono">
                        <span className="text-primary">{engagement.score.toFixed(0)}</span>
                        <span className="text-xs text-muted-foreground ml-1">
                          (<span className="text-green-500">+{engagement.positivePoints}</span>
                          <span className="text-red-500">{engagement.negativePoints}</span>)
                          </span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-green-500">{origin.score}</td>
                      <td className="py-3 px-4 text-right font-mono text-yellow-500">{network.score}</td>
                      <td className="py-3 px-4 text-right font-mono text-blue-500">{path.score.toFixed(0)}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold">{total.toFixed(0)}</td>
                      <td className="py-3 px-4 text-center">
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
        </div>
        
        {/* Averages */}
        <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10">
          <h3 className="font-medium mb-3">Averages Across All Contacts</h3>
          <div className="grid grid-cols-5 gap-4 text-center">
            <div>
              <p className="text-xl font-bold text-primary">{averages.engagement}</p>
              <p className="text-xs text-muted-foreground">Engagement</p>
            </div>
            <div>
              <p className="text-xl font-bold text-green-500">{averages.origin}</p>
              <p className="text-xs text-muted-foreground">Origin</p>
            </div>
            <div>
              <p className="text-xl font-bold text-yellow-500">{averages.network}</p>
              <p className="text-xs text-muted-foreground">Network</p>
            </div>
            <div>
              <p className="text-xl font-bold text-blue-500">{averages.path}</p>
              <p className="text-xs text-muted-foreground">Path</p>
            </div>
            <div>
              <p className="text-xl font-bold">{averages.total}</p>
              <p className="text-xs text-muted-foreground">Total Avg</p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 5: Formula Reference */}
      <div className="p-6 rounded-2xl border border-white/10 bg-card/40">
        <h2 className="text-lg font-semibold mb-4">Quick Formula Reference (Path-Prioritized)</h2>
        
        <div className="space-y-4 text-sm">
          <div className="grid grid-cols-4 gap-4">
            <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <p className="font-medium text-blue-500 mb-2">⭐ Path (40 max)</p>
              <p className="text-xs space-y-1">
                <span className="block text-green-500">+5 per tier level</span>
                <span className="block text-green-500">+4 completed path</span>
                <span className="block text-red-500">-2 skipped path</span>
              </p>
              <p className="text-xs mt-2 text-blue-400 font-medium">Highest priority!</p>
            </div>
            
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
              <p className="font-medium text-primary mb-2">Engagement (30 max)</p>
              <p className="text-xs space-y-1">
                <span className="block text-green-500">+6 calendar accept</span>
                <span className="block text-green-500">+4 fast response</span>
                <span className="block text-red-500">-6 ignored</span>
                <span className="block text-red-500">-5 decline</span>
                <span className="block text-red-500">-5 gap</span>
              </p>
            </div>
            
            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <p className="font-medium text-green-500 mb-2">Origin (15 max)</p>
              <p className="text-xs space-y-1">
                <span className="block">12 invite</span>
                <span className="block">10 wizard</span>
                <span className="block">7 manual</span>
                <span className="block">5 import</span>
                <span className="block">3 unknown</span>
                <span className="block text-green-500">+3 has inviter</span>
              </p>
            </div>
            
            <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <p className="font-medium text-yellow-500 mb-2">Network (15 max)</p>
              <p className="text-xs space-y-1">
                <span className="block">1-5 inviter strength</span>
                <span className="block">+1.5 per shared contact</span>
                <span className="block">+1 per affiliation</span>
                <span className="block">+1 per community</span>
              </p>
            </div>
          </div>
          
          <div className="p-3 rounded-lg bg-white/5">
            <p className="font-medium mb-2">Score → Strength Level</p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded bg-yellow-500/20 text-yellow-500">Star: 75-100</span>
              <span className="px-3 py-1 rounded bg-green-500/20 text-green-500">Flame: 50-74</span>
              <span className="px-3 py-1 rounded bg-primary/20 text-primary">Ember: 25-49</span>
              <span className="px-3 py-1 rounded bg-zinc-500/20 text-zinc-400">Spark: 0-24</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectionStrengthAnalytics;
