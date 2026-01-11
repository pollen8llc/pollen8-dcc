import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Users, Zap, Link2, Clock, Route,
  Sparkles, Flame, CircleDot, Star, Plus, Minus,
  Calculator, ChevronRight, Edit, Save, X, Loader2
} from 'lucide-react';
import { mockContacts, getStrengthDistribution, getAverageScores } from '@/data/mockConnectionStrengthData';
import { 
  getStrengthBadgeClass, 
  mapScoreToStrength
} from '@/utils/connectionStrengthCalculator';
import { SolarSystem } from '@/components/ui/SolarSystem';
import { SOLAR_SYSTEMS } from '@/data/solarSystemsConfig';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getFormulas, updateFormula, formulasToConfig, Formula } from '@/services/formulaService';
import { toast } from 'sonner';

// Avatar tiers organized by complexity (number of planets)
const AVATAR_TIERS = {
  tier0: ['UXI8000', 'UXI8002', 'UXI8009', 'UXI8018', 'UXI8025', 'UXI8035'],
  tier1: ['UXI8001', 'UXI8007', 'UXI8012', 'UXI8015', 'UXI8019', 'UXI8023', 'UXI8027', 'UXI8029', 'UXI8033', 'UXI8037', 'UXI8039'],
  tier2: ['UXI8003', 'UXI8004', 'UXI8008', 'UXI8014', 'UXI8017', 'UXI8021', 'UXI8024', 'UXI8026', 'UXI8031', 'UXI8034', 'UXI8036', 'UXI8040'],
  tier3: ['UXI8005', 'UXI8010', 'UXI8011', 'UXI8020', 'UXI8022', 'UXI8030', 'UXI8032'],
  tier4: ['UXI8006', 'UXI8013', 'UXI8028', 'UXI8038'],
  tier5: ['UXI8016', 'UXI9000'],
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
  
  const index = Math.floor((score % tierAvatars.length));
  
  return { 
    id: tierAvatars[index], 
    tier: threshold.tier, 
    planets: threshold.planets,
    label: threshold.label
  };
};

// Editable value component
const EditableValue: React.FC<{
  formula: Formula;
  isEditing: boolean;
  onSave: (id: string, value: number) => void;
  isSaving: boolean;
}> = ({ formula, isEditing, onSave, isSaving }) => {
  const [editValue, setEditValue] = useState(formula.value.toString());
  const [isEditingThis, setIsEditingThis] = useState(false);

  const handleSave = () => {
    const numValue = parseFloat(editValue);
    if (isNaN(numValue)) {
      toast.error('Please enter a valid number');
      return;
    }
    if (formula.min_value !== undefined && numValue < formula.min_value) {
      toast.error(`Value must be at least ${formula.min_value}`);
      return;
    }
    if (formula.max_value !== undefined && numValue > formula.max_value) {
      toast.error(`Value must be at most ${formula.max_value}`);
      return;
    }
    onSave(formula.id, numValue);
    setIsEditingThis(false);
  };

  if (!isEditing) {
    return <span className="font-mono font-bold">{formula.value}</span>;
  }

  if (isEditingThis) {
    return (
      <div className="inline-flex items-center gap-1">
        <Input
          type="number"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          className="w-20 h-7 text-sm font-mono"
          step={formula.value % 1 !== 0 ? 0.1 : 1}
          min={formula.min_value}
          max={formula.max_value}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSave();
            if (e.key === 'Escape') setIsEditingThis(false);
          }}
          autoFocus
        />
        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={handleSave} disabled={isSaving}>
          {isSaving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3 text-green-500" />}
        </Button>
        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => setIsEditingThis(false)}>
          <X className="h-3 w-3 text-red-500" />
        </Button>
      </div>
    );
  }

  return (
    <button
      onClick={() => {
        setEditValue(formula.value.toString());
        setIsEditingThis(true);
      }}
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-primary/10 hover:bg-primary/20 transition-colors font-mono font-bold"
    >
      {formula.value}
      <Edit className="h-3 w-3 text-primary" />
    </button>
  );
};

const ConnectionStrengthAnalytics: React.FC = () => {
  const queryClient = useQueryClient();
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Fetch formulas from database
  const { data: formulas = [], isLoading, error } = useQuery({
    queryKey: ['formulas'],
    queryFn: getFormulas,
  });

  // Mutation for updating formulas
  const updateMutation = useMutation({
    mutationFn: ({ id, value }: { id: string; value: number }) => updateFormula(id, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['formulas'] });
      toast.success('Formula updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update formula: ' + (error as Error).message);
    },
  });

  // Helper to get formula value
  const getFormulaValue = (category: string, key: string, defaultValue: number): number => {
    const formula = formulas.find(f => f.category === category && f.key === key);
    return formula ? formula.value : defaultValue;
  };

  // Helper to get formula object
  const getFormula = (category: string, key: string): Formula | undefined => {
    return formulas.find(f => f.category === category && f.key === key);
  };

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

  // Get formula values from database (with defaults)
  const calendarAcceptsPoints = getFormulaValue('engagement', 'calendar_accepts_points', 6);
  const fastResponsePoints = getFormulaValue('engagement', 'fast_response_points', 4);
  const ignoredPenalty = getFormulaValue('engagement', 'ignored_penalty', -6);
  const declinePenalty = getFormulaValue('engagement', 'decline_penalty', -5);
  const gapPenalty = getFormulaValue('engagement', 'gap_penalty', -5);
  
  const invitePoints = getFormulaValue('origin', 'invite_points', 12);
  const wizardPoints = getFormulaValue('origin', 'wizard_points', 10);
  const manualPoints = getFormulaValue('origin', 'manual_points', 7);
  const importPoints = getFormulaValue('origin', 'import_points', 5);
  const unknownPoints = getFormulaValue('origin', 'unknown_points', 3);
  const inviterBonus = getFormulaValue('origin', 'inviter_bonus', 3);
  
  const sharedContactsMultiplier = getFormulaValue('network', 'shared_contacts_multiplier', 1.5);
  const affiliationsMultiplier = getFormulaValue('network', 'affiliations_multiplier', 1);
  const communitiesMultiplier = getFormulaValue('network', 'communities_multiplier', 1);
  
  const tierMultiplier = getFormulaValue('path', 'tier_multiplier', 5);
  const completedPathPoints = getFormulaValue('path', 'completed_path_points', 4);
  const skippedPathPenalty = getFormulaValue('path', 'skipped_path_penalty', -2);

  const pathWeight = getFormulaValue('weights', 'path_weight', 40);
  const engagementWeight = getFormulaValue('weights', 'engagement_weight', 30);
  const originWeight = getFormulaValue('weights', 'origin_weight', 15);
  const networkWeight = getFormulaValue('weights', 'network_weight', 15);

  const starMin = getFormulaValue('thresholds', 'star_min', 75);
  const flameMin = getFormulaValue('thresholds', 'flame_min', 50);
  const emberMin = getFormulaValue('thresholds', 'ember_min', 25);

  // Calculate scores using formula values
  const originPointsScaled: Record<string, number> = {
    invite: invitePoints,
    wizard: wizardPoints,
    manual: manualPoints,
    import: importPoints,
    unknown: unknownPoints
  };

  // Engagement calculation
  const engagementPositive = (simCalendarAccepts * calendarAcceptsPoints) + (simFastResponses * fastResponsePoints);
  const engagementNegative = (simIgnored * ignoredPenalty) + (simDeclines * declinePenalty) + (simGaps * gapPenalty);
  const engagementRaw = engagementPositive + engagementNegative;
  const engagementScore = Math.max(0, Math.min(engagementWeight, engagementRaw));
  
  // Origin calculation
  const originBase = originPointsScaled[simOriginType];
  const originBonusValue = simHasInviter ? inviterBonus : 0;
  const originScore = Math.min(originWeight, originBase + originBonusValue);
  
  // Network calculation
  const netInviterStrength = Math.min(5, Math.round(simInviterStrength / 2));
  const networkScoreCalc = Math.min(networkWeight, 
    netInviterStrength + 
    (simSharedContacts * sharedContactsMultiplier) + 
    (simSharedAffiliations * affiliationsMultiplier) + 
    (simSharedCommunities * communitiesMultiplier)
  );
  
  // Path calculation
  const pathPositive = (simCurrentTier * tierMultiplier) + (simCompletedPaths * completedPathPoints);
  const pathNegative = simSkippedPaths * skippedPathPenalty;
  const pathScore = Math.max(0, Math.min(pathWeight, pathPositive + pathNegative));
  
  const totalScore = engagementScore + originScore + networkScoreCalc + pathScore;
  
  // Use custom thresholds for strength mapping
  const getStrengthFromScore = (score: number): 'star' | 'flame' | 'ember' | 'spark' => {
    if (score >= starMin) return 'star';
    if (score >= flameMin) return 'flame';
    if (score >= emberMin) return 'ember';
    return 'spark';
  };
  const simulatedStrength = getStrengthFromScore(totalScore);
  
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

  const handleSaveFormula = (id: string, value: number) => {
    updateMutation.mutate({ id, value });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2">Loading formulas...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 rounded-xl bg-destructive/10 border border-destructive/30 text-center">
        <p className="text-destructive">Failed to load formulas. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      
      {/* Edit Mode Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-card/60 border border-border">
        <div>
          <h2 className="font-semibold text-sm sm:text-base">Formula Configuration</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {isEditMode ? 'Click on any value to edit it' : 'Enable edit mode to modify formula values'}
          </p>
        </div>
        <Button
          variant={isEditMode ? 'default' : 'outline'}
          onClick={() => setIsEditMode(!isEditMode)}
          className="gap-2 text-sm w-full sm:w-auto"
        >
          {isEditMode ? (
            <>
              <Save className="w-4 h-4" />
              View Mode
            </>
          ) : (
            <>
              <Edit className="w-4 h-4" />
              Edit Mode
            </>
          )}
        </Button>
      </div>

      {/* Category Weights Section */}
      {isEditMode && (
        <div className="p-4 sm:p-6 rounded-2xl border border-primary/30 bg-primary/5">
          <h2 className="text-base sm:text-lg font-semibold mb-4 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-primary" />
            Category Weights (must sum to 100)
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {[
              { key: 'path_weight', label: 'Path', color: 'blue' },
              { key: 'engagement_weight', label: 'Engagement', color: 'primary' },
              { key: 'origin_weight', label: 'Origin', color: 'green' },
              { key: 'network_weight', label: 'Network', color: 'yellow' },
            ].map(({ key, label, color }) => {
              const formula = getFormula('weights', key);
              return (
                <div key={key} className={`p-4 rounded-xl bg-${color}-500/10 border border-${color}-500/20`}>
                  <p className="text-sm text-muted-foreground mb-1">{label}</p>
                  {formula ? (
                    <EditableValue
                      formula={formula}
                      isEditing={isEditMode}
                      onSave={handleSaveFormula}
                      isSaving={updateMutation.isPending}
                    />
                  ) : (
                    <span className="font-mono font-bold">-</span>
                  )}
                </div>
              );
            })}
          </div>
          <p className="text-sm text-muted-foreground mt-3">
            Current total: <span className="font-bold">{pathWeight + engagementWeight + originWeight + networkWeight}</span>
          </p>
        </div>
      )}
      
      {/* SECTION 1: Network Score Preview with Dynamic Avatar */}
      <div className="p-4 sm:p-8 rounded-2xl bg-gradient-to-br from-primary/20 via-primary/5 to-transparent border border-primary/30 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative">
          <h2 className="text-base sm:text-xl font-semibold mb-2 flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/20">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            Network Score → Avatar Mapping
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mb-6 sm:mb-8">Edit the values below to see how different network sizes affect avatar complexity</p>
          
          {/* Desktop: Single row formula | Mobile: Stacked grid */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-center gap-4 lg:gap-6 mb-6 sm:mb-8">
            {/* Formula Inputs Group */}
            <div className="flex items-center justify-center gap-2 sm:gap-4">
              {/* Connections Input */}
              <div className="p-3 sm:p-4 rounded-xl bg-white/10 backdrop-blur-sm text-center min-w-[80px] sm:min-w-[110px]">
                <input
                  type="number"
                  value={nsConnections}
                  onChange={(e) => setNsConnections(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full text-xl sm:text-3xl font-bold text-center bg-transparent border-b-2 border-primary/50 focus:border-primary outline-none"
                />
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-1.5">Connections</p>
              </div>
              <span className="text-lg sm:text-2xl text-muted-foreground font-light">×</span>
              
              {/* Avg Strength Input */}
              <div className="p-3 sm:p-4 rounded-xl bg-white/10 backdrop-blur-sm text-center min-w-[70px] sm:min-w-[90px]">
                <input
                  type="number"
                  value={nsAvgStrength}
                  onChange={(e) => setNsAvgStrength(Math.max(0, Math.min(100, parseInt(e.target.value) || 0)))}
                  className="w-full text-xl sm:text-3xl font-bold text-center bg-transparent border-b-2 border-primary/50 focus:border-primary outline-none"
                />
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-1.5">Avg Strength</p>
              </div>
              <span className="text-lg sm:text-2xl text-muted-foreground font-light">×</span>
              
              {/* Multiplier Input */}
              <div className="p-3 sm:p-4 rounded-xl bg-white/10 backdrop-blur-sm text-center min-w-[60px] sm:min-w-[80px]">
                <input
                  type="number"
                  step="0.01"
                  value={nsMultiplier}
                  onChange={(e) => setNsMultiplier(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full text-xl sm:text-3xl font-bold text-center bg-transparent border-b-2 border-primary/50 focus:border-primary outline-none"
                />
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-1.5">Multiplier</p>
              </div>
            </div>
            
            {/* Equals & Results */}
            <div className="flex items-center justify-center gap-3 sm:gap-4">
              <span className="text-lg sm:text-2xl text-muted-foreground font-light">=</span>
              
              {/* Calculated Score */}
              <div className="p-3 sm:p-4 rounded-xl bg-gradient-to-br from-primary/40 to-primary/20 text-center min-w-[100px] sm:min-w-[120px] shadow-lg shadow-primary/20">
                <p className="text-2xl sm:text-4xl font-bold text-primary">{networkScoreCalculated.toLocaleString()}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">Network Score</p>
              </div>
              
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground" />
              
              {/* Dynamic Avatar Result */}
              <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-white/10 backdrop-blur-sm border-2 border-primary/40 shadow-lg">
                <div className="flex-shrink-0">
                  <SolarSystem systemId={currentAvatar.id} size={72} />
                </div>
                <div className="text-left">
                  <p className="font-mono text-sm sm:text-base text-primary font-bold">{currentAvatar.id}</p>
                  <p className="text-sm sm:text-base font-medium">{avatarConfig?.name}</p>
                  <p className="text-xs text-muted-foreground">Tier {currentAvatar.tier} • {currentAvatar.planets} planet{currentAvatar.planets !== 1 ? 's' : ''}</p>
                </div>
              </div>
            </div>
          </div>
        
          {/* Quick Presets */}
          <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8 justify-center items-center">
            <p className="text-xs sm:text-sm text-muted-foreground w-full sm:w-auto text-center sm:text-left">Quick presets:</p>
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
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg bg-white/5 border border-white/10 hover:bg-primary/10 hover:border-primary/40 hover:text-primary transition-all duration-200"
              >
                {preset.label}
              </button>
            ))}
          </div>
          
          {/* Avatar Tier Scale */}
          <div className="border-t border-white/10 pt-6">
            <p className="text-sm sm:text-base text-muted-foreground mb-4">Avatar Complexity Tiers (by Network Score):</p>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3 text-center">
              {AVATAR_SCORE_THRESHOLDS.map((threshold) => {
                const sampleAvatars: Record<number, string> = {
                  0: 'UXI8018', 1: 'UXI8001', 2: 'UXI8003', 
                  3: 'UXI8005', 4: 'UXI8006', 5: 'UXI8016'
                };
                const isActive = currentAvatar.tier === threshold.tier;
                return (
                  <div 
                    key={threshold.tier} 
                    className={`p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 ${
                      isActive 
                        ? 'border-primary bg-primary/20 scale-105 shadow-lg shadow-primary/20' 
                        : 'border-white/10 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className="mx-auto mb-2">
                    <SolarSystem systemId={sampleAvatars[threshold.tier]} size={44} />
                  </div>
                    <p className={`font-bold text-sm sm:text-base ${isActive ? 'text-primary' : ''}`}>
                      {threshold.label}
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {threshold.planets} planet{threshold.planets !== 1 ? 's' : ''}
                    </p>
                    <p className="text-xs text-muted-foreground opacity-60">
                      Tier {threshold.tier}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Formula explanation */}
          <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm text-muted-foreground">
            <p><strong className="text-foreground">Formula:</strong> Network Score = Connections × Average Strength × Multiplier</p>
            <p className="mt-1"><strong className="text-foreground">Current:</strong> {nsConnections.toLocaleString()} × {nsAvgStrength} × {nsMultiplier} = <span className="text-primary font-bold">{networkScoreCalculated.toLocaleString()}</span> → <span className="text-primary font-medium">{currentAvatar.id}</span> ({currentAvatar.planets} planet{currentAvatar.planets !== 1 ? 's' : ''})</p>
          </div>
        </div>
      </div>

      {/* SECTION 2: Strength Distribution */}
      <div>
        <h2 className="text-base sm:text-lg font-semibold mb-4">Current Distribution ({mockContacts.length} contacts)</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-3 sm:p-4 rounded-xl border-2 border-yellow-500/30 bg-yellow-500/10 text-center">
            <Star className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-2xl sm:text-3xl font-bold text-yellow-500">{distribution.star}</p>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Star ({isEditMode && getFormula('thresholds', 'star_min') ? (
                <EditableValue
                  formula={getFormula('thresholds', 'star_min')!}
                  isEditing={isEditMode}
                  onSave={handleSaveFormula}
                  isSaving={updateMutation.isPending}
                />
              ) : starMin}-100)
            </p>
          </div>
          <div className="p-3 sm:p-4 rounded-xl border-2 border-green-500/30 bg-green-500/10 text-center">
            <Flame className="w-6 h-6 sm:w-8 sm:h-8 text-green-500 mx-auto mb-2" />
            <p className="text-2xl sm:text-3xl font-bold text-green-500">{distribution.flame}</p>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Flame ({isEditMode && getFormula('thresholds', 'flame_min') ? (
                <EditableValue
                  formula={getFormula('thresholds', 'flame_min')!}
                  isEditing={isEditMode}
                  onSave={handleSaveFormula}
                  isSaving={updateMutation.isPending}
                />
              ) : flameMin}-{starMin - 1})
            </p>
          </div>
          <div className="p-3 sm:p-4 rounded-xl border-2 border-primary/30 bg-primary/10 text-center">
            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-primary mx-auto mb-2" />
            <p className="text-2xl sm:text-3xl font-bold text-primary">{distribution.ember}</p>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Ember ({isEditMode && getFormula('thresholds', 'ember_min') ? (
                <EditableValue
                  formula={getFormula('thresholds', 'ember_min')!}
                  isEditing={isEditMode}
                  onSave={handleSaveFormula}
                  isSaving={updateMutation.isPending}
                />
              ) : emberMin}-{flameMin - 1})
            </p>
          </div>
          <div className="p-3 sm:p-4 rounded-xl border-2 border-zinc-500/30 bg-zinc-500/10 text-center">
            <CircleDot className="w-6 h-6 sm:w-8 sm:h-8 text-zinc-400 mx-auto mb-2" />
            <p className="text-2xl sm:text-3xl font-bold text-zinc-400">{distribution.spark}</p>
            <p className="text-xs sm:text-sm text-muted-foreground">Spark (0-{emberMin - 1})</p>
          </div>
        </div>
      </div>
            
      {/* SECTION 3: Connection Strength Calculator */}
      <div className="p-4 sm:p-6 rounded-2xl border border-white/10 bg-card/40">
        <h2 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6 flex items-center gap-2">
          <Calculator className="w-5 h-5" />
          Connection Strength Calculator
        </h2>

        {/* Factor 1: Path Progress */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <h3 className="font-medium flex items-center gap-2 text-sm sm:text-base">
              <Route className="w-4 h-4 text-blue-500 flex-shrink-0" />
              <span>1. Path Progress</span>
              <Badge variant="outline" className="hidden sm:inline-flex text-xs bg-blue-500/10 text-blue-500 border-blue-500/30">HIGHEST PRIORITY</Badge>
            </h3>
            <Badge className="bg-blue-500/20 text-blue-500 border-blue-500/30 text-sm sm:text-base px-2 sm:px-3 self-start sm:self-auto">
              {pathScore.toFixed(1)} / {pathWeight} pts
            </Badge>
          </div>
          
          <div className="space-y-4 pl-3 sm:pl-6 border-l-2 border-blue-500/30">
            <div className="p-3 sm:p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 space-y-4">
              <p className="text-xs sm:text-sm text-blue-400 font-medium">Relationship development through tier progression is the most valuable factor</p>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Current Tier (T{simCurrentTier})</span>
                  <span className="text-sm font-mono">
                    {simCurrentTier} × {isEditMode && getFormula('path', 'tier_multiplier') ? (
                      <EditableValue
                        formula={getFormula('path', 'tier_multiplier')!}
                        isEditing={isEditMode}
                        onSave={handleSaveFormula}
                        isSaving={updateMutation.isPending}
                      />
                    ) : tierMultiplier} = <span className="text-blue-500 font-bold">+{simCurrentTier * tierMultiplier}</span>
                  </span>
                </div>
                <Slider value={[simCurrentTier]} onValueChange={([v]) => setSimCurrentTier(v)} max={6} step={1} />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Completed Paths ({simCompletedPaths})</span>
                  <span className="text-sm font-mono">
                    {simCompletedPaths} × {isEditMode && getFormula('path', 'completed_path_points') ? (
                      <EditableValue
                        formula={getFormula('path', 'completed_path_points')!}
                        isEditing={isEditMode}
                        onSave={handleSaveFormula}
                        isSaving={updateMutation.isPending}
                      />
                    ) : completedPathPoints} = <span className="text-blue-500 font-bold">+{simCompletedPaths * completedPathPoints}</span>
                  </span>
                </div>
                <Slider value={[simCompletedPaths]} onValueChange={([v]) => setSimCompletedPaths(v)} max={5} step={1} />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Skipped Paths ({simSkippedPaths})</span>
                  <span className="text-sm font-mono">
                    {simSkippedPaths} × {isEditMode && getFormula('path', 'skipped_path_penalty') ? (
                      <EditableValue
                        formula={getFormula('path', 'skipped_path_penalty')!}
                        isEditing={isEditMode}
                        onSave={handleSaveFormula}
                        isSaving={updateMutation.isPending}
                      />
                    ) : skippedPathPenalty} = <span className="text-red-500 font-bold">{simSkippedPaths * skippedPathPenalty}</span>
                  </span>
                </div>
                <Slider value={[simSkippedPaths]} onValueChange={([v]) => setSimSkippedPaths(v)} max={5} step={1} />
              </div>
            </div>
            
            <div className="p-3 rounded-lg bg-white/5 text-sm">
              <span className="text-muted-foreground">Calculation:</span>{' '}
              <span className="text-blue-500">+{(simCurrentTier * tierMultiplier) + (simCompletedPaths * completedPathPoints)}</span>{' '}
              <span className="text-red-500">{simSkippedPaths * skippedPathPenalty}</span>{' '}
              = {(simCurrentTier * tierMultiplier) + (simCompletedPaths * completedPathPoints) + (simSkippedPaths * skippedPathPenalty)} → clamped to <span className="font-bold">{pathScore.toFixed(1)}</span> (0-{pathWeight} range)
            </div>
          </div>
        </div>

        {/* Factor 2: Engagement */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <h3 className="font-medium flex items-center gap-2 text-sm sm:text-base">
              <Users className="w-4 h-4 text-primary flex-shrink-0" />
              2. Engagement Score
            </h3>
            <Badge className="bg-primary/20 text-primary border-primary/30 text-sm sm:text-base px-2 sm:px-3 self-start sm:self-auto">
              {engagementScore} / {engagementWeight} pts
            </Badge>
          </div>
          
          <div className="space-y-4 pl-3 sm:pl-6 border-l-2 border-primary/30">
            {/* Positive factors */}
            <div className="p-3 sm:p-4 rounded-xl bg-green-500/5 border border-green-500/20">
              <p className="text-xs sm:text-sm font-medium text-green-500 mb-3 flex items-center gap-1">
                <Plus className="w-4 h-4" /> Positive Actions = +{engagementPositive}
              </p>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Calendar Accepts ({simCalendarAccepts})</span>
                    <span className="text-sm font-mono">
                      {simCalendarAccepts} × {isEditMode && getFormula('engagement', 'calendar_accepts_points') ? (
                        <EditableValue
                          formula={getFormula('engagement', 'calendar_accepts_points')!}
                          isEditing={isEditMode}
                          onSave={handleSaveFormula}
                          isSaving={updateMutation.isPending}
                        />
                      ) : calendarAcceptsPoints} = <span className="text-green-500 font-bold">+{simCalendarAccepts * calendarAcceptsPoints}</span>
                    </span>
                  </div>
                  <Slider value={[simCalendarAccepts]} onValueChange={([v]) => setSimCalendarAccepts(v)} max={5} step={1} />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Fast Responses ({simFastResponses})</span>
                    <span className="text-sm font-mono">
                      {simFastResponses} × {isEditMode && getFormula('engagement', 'fast_response_points') ? (
                        <EditableValue
                          formula={getFormula('engagement', 'fast_response_points')!}
                          isEditing={isEditMode}
                          onSave={handleSaveFormula}
                          isSaving={updateMutation.isPending}
                        />
                      ) : fastResponsePoints} = <span className="text-green-500 font-bold">+{simFastResponses * fastResponsePoints}</span>
                    </span>
                  </div>
                  <Slider value={[simFastResponses]} onValueChange={([v]) => setSimFastResponses(v)} max={5} step={1} />
                </div>
              </div>
            </div>
            
            {/* Negative factors */}
            <div className="p-3 sm:p-4 rounded-xl bg-red-500/5 border border-red-500/20">
              <p className="text-xs sm:text-sm font-medium text-red-500 mb-3 flex items-center gap-1">
                <Minus className="w-4 h-4" /> Negative Actions = {engagementNegative}
              </p>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Ignored Outreach ({simIgnored})</span>
                    <span className="text-sm font-mono">
                      {simIgnored} × {isEditMode && getFormula('engagement', 'ignored_penalty') ? (
                        <EditableValue
                          formula={getFormula('engagement', 'ignored_penalty')!}
                          isEditing={isEditMode}
                          onSave={handleSaveFormula}
                          isSaving={updateMutation.isPending}
                        />
                      ) : ignoredPenalty} = <span className="text-red-500 font-bold">{simIgnored * ignoredPenalty}</span>
                    </span>
                  </div>
                  <Slider value={[simIgnored]} onValueChange={([v]) => setSimIgnored(v)} max={5} step={1} />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Declines ({simDeclines})</span>
                    <span className="text-sm font-mono">
                      {simDeclines} × {isEditMode && getFormula('engagement', 'decline_penalty') ? (
                        <EditableValue
                          formula={getFormula('engagement', 'decline_penalty')!}
                          isEditing={isEditMode}
                          onSave={handleSaveFormula}
                          isSaving={updateMutation.isPending}
                        />
                      ) : declinePenalty} = <span className="text-red-500 font-bold">{simDeclines * declinePenalty}</span>
                    </span>
                  </div>
                  <Slider value={[simDeclines]} onValueChange={([v]) => setSimDeclines(v)} max={5} step={1} />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Contact Gaps ({simGaps})</span>
                    <span className="text-sm font-mono">
                      {simGaps} × {isEditMode && getFormula('engagement', 'gap_penalty') ? (
                        <EditableValue
                          formula={getFormula('engagement', 'gap_penalty')!}
                          isEditing={isEditMode}
                          onSave={handleSaveFormula}
                          isSaving={updateMutation.isPending}
                        />
                      ) : gapPenalty} = <span className="text-red-500 font-bold">{simGaps * gapPenalty}</span>
                    </span>
                  </div>
                  <Slider value={[simGaps]} onValueChange={([v]) => setSimGaps(v)} max={5} step={1} />
                </div>
              </div>
            </div>
          
            <div className="p-3 rounded-lg bg-white/5 text-sm">
              <span className="text-muted-foreground">Calculation:</span>{' '}
              <span className="text-green-500">+{engagementPositive}</span>{' '}
              <span className="text-red-500">{engagementNegative}</span>{' '}
              = {engagementRaw} → clamped to <span className="font-bold">{engagementScore}</span> (0-{engagementWeight} range)
            </div>
          </div>
        </div>

        {/* Factor 3: Origin */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <h3 className="font-medium flex items-center gap-2 text-sm sm:text-base">
              <Link2 className="w-4 h-4 text-green-500 flex-shrink-0" />
              3. Origin Score
            </h3>
            <Badge className="bg-green-500/20 text-green-500 border-green-500/30 text-sm sm:text-base px-2 sm:px-3 self-start sm:self-auto">
              {originScore} / {originWeight} pts
            </Badge>
          </div>
          
          <div className="space-y-4 pl-3 sm:pl-6 border-l-2 border-green-500/30">
            <div className="p-3 sm:p-4 rounded-xl bg-green-500/5 border border-green-500/20">
              <p className="text-xs sm:text-sm text-muted-foreground mb-3">How was this contact added?</p>
              
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-4">
                {(['invite', 'wizard', 'manual', 'import', 'unknown'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setSimOriginType(type)}
                    className={`p-2 sm:p-3 rounded-lg border text-center transition-all ${
                      simOriginType === type 
                        ? 'bg-green-500/20 border-green-500/50 text-green-500' 
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <p className="text-base sm:text-lg font-bold">{originPointsScaled[type]}</p>
                    <p className="text-[10px] sm:text-xs capitalize">{type}</p>
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
                <span className="font-mono text-green-500 font-bold">+{inviterBonus}</span>
              </label>
            </div>
            
            <div className="p-3 rounded-lg bg-white/5 text-sm">
              <span className="text-muted-foreground">Calculation:</span>{' '}
              {originBase} (base){simHasInviter && <span className="text-green-500"> +{inviterBonus} (inviter)</span>}{' '}
              = <span className="font-bold">{originScore}</span>
            </div>
          </div>
        </div>

        {/* Factor 4: Network */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <h3 className="font-medium flex items-center gap-2 text-sm sm:text-base">
              <Clock className="w-4 h-4 text-yellow-500 flex-shrink-0" />
              4. Network Score
            </h3>
            <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30 text-sm sm:text-base px-2 sm:px-3 self-start sm:self-auto">
              {networkScoreCalc} / {networkWeight} pts
            </Badge>
          </div>
          
          <div className="space-y-4 pl-3 sm:pl-6 border-l-2 border-yellow-500/30">
            <div className="p-3 sm:p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/20 space-y-4">
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
                  <span className="text-sm font-mono">
                    {simSharedContacts} × {isEditMode && getFormula('network', 'shared_contacts_multiplier') ? (
                      <EditableValue
                        formula={getFormula('network', 'shared_contacts_multiplier')!}
                        isEditing={isEditMode}
                        onSave={handleSaveFormula}
                        isSaving={updateMutation.isPending}
                      />
                    ) : sharedContactsMultiplier} = <span className="text-yellow-500 font-bold">+{(simSharedContacts * sharedContactsMultiplier).toFixed(1)}</span>
                  </span>
                </div>
                <Slider value={[simSharedContacts]} onValueChange={([v]) => setSimSharedContacts(v)} max={10} step={1} />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Shared Affiliations ({simSharedAffiliations})</span>
                  <span className="text-sm font-mono">
                    {simSharedAffiliations} × {isEditMode && getFormula('network', 'affiliations_multiplier') ? (
                      <EditableValue
                        formula={getFormula('network', 'affiliations_multiplier')!}
                        isEditing={isEditMode}
                        onSave={handleSaveFormula}
                        isSaving={updateMutation.isPending}
                      />
                    ) : affiliationsMultiplier} = <span className="text-yellow-500 font-bold">+{simSharedAffiliations * affiliationsMultiplier}</span>
                  </span>
                </div>
                <Slider value={[simSharedAffiliations]} onValueChange={([v]) => setSimSharedAffiliations(v)} max={10} step={1} />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Shared Communities ({simSharedCommunities})</span>
                  <span className="text-sm font-mono">
                    {simSharedCommunities} × {isEditMode && getFormula('network', 'communities_multiplier') ? (
                      <EditableValue
                        formula={getFormula('network', 'communities_multiplier')!}
                        isEditing={isEditMode}
                        onSave={handleSaveFormula}
                        isSaving={updateMutation.isPending}
                      />
                    ) : communitiesMultiplier} = <span className="text-yellow-500 font-bold">+{simSharedCommunities * communitiesMultiplier}</span>
                  </span>
                </div>
                <Slider value={[simSharedCommunities]} onValueChange={([v]) => setSimSharedCommunities(v)} max={10} step={1} />
              </div>
            </div>
            
            <div className="p-3 rounded-lg bg-white/5 text-sm">
              <span className="text-muted-foreground">Calculation:</span>{' '}
              {netInviterStrength} + {(simSharedContacts * sharedContactsMultiplier).toFixed(1)} + {simSharedAffiliations * affiliationsMultiplier} + {simSharedCommunities * communitiesMultiplier}{' '}
              = {(netInviterStrength + (simSharedContacts * sharedContactsMultiplier) + simSharedAffiliations * affiliationsMultiplier + simSharedCommunities * communitiesMultiplier).toFixed(1)} → clamped to <span className="font-bold">{networkScoreCalc}</span>
            </div>
          </div>
        </div>

        {/* TOTAL */}
        <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-blue-500/20 to-transparent border border-blue-500/30">
          <h3 className="font-medium mb-4 text-sm sm:text-base">Total Connection Strength</h3>
          
          {/* Mobile: 2x2 grid + result, Desktop: inline flex */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 sm:gap-3 mb-4">
            <div className="px-3 sm:px-4 py-2 rounded-lg bg-blue-500/20 text-blue-500 font-mono font-bold text-center text-sm sm:text-base">
              {pathScore.toFixed(1)}
              <span className="text-[10px] sm:text-xs ml-1 opacity-70">path</span>
            </div>
            <span className="hidden sm:block text-xl">+</span>
            <div className="px-3 sm:px-4 py-2 rounded-lg bg-primary/20 text-primary font-mono text-center text-sm sm:text-base">
              {engagementScore}
              <span className="text-[10px] sm:text-xs ml-1 opacity-70">eng</span>
            </div>
            <span className="hidden sm:block text-xl">+</span>
            <div className="px-3 sm:px-4 py-2 rounded-lg bg-green-500/20 text-green-500 font-mono text-center text-sm sm:text-base">
              {originScore}
              <span className="text-[10px] sm:text-xs ml-1 opacity-70">ori</span>
            </div>
            <span className="hidden sm:block text-xl">+</span>
            <div className="px-3 sm:px-4 py-2 rounded-lg bg-yellow-500/20 text-yellow-500 font-mono text-center text-sm sm:text-base">
              {networkScoreCalc}
              <span className="text-[10px] sm:text-xs ml-1 opacity-70">net</span>
            </div>
            <span className="hidden sm:block text-xl">=</span>
            <div className="col-span-2 sm:col-span-1 px-4 sm:px-6 py-3 rounded-xl bg-white/10 font-bold text-xl sm:text-2xl text-center">
              {totalScore.toFixed(1)}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
            <span className="text-muted-foreground text-sm">Strength Level:</span>
            <Badge className={`${getStrengthBadgeClass(simulatedStrength)} text-sm sm:text-lg px-3 sm:px-4 py-1.5 sm:py-2 capitalize`}>
              {simulatedStrength === 'star' && <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />}
              {simulatedStrength === 'flame' && <Flame className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />}
              {simulatedStrength === 'ember' && <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />}
              {simulatedStrength === 'spark' && <CircleDot className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />}
              {simulatedStrength}
            </Badge>
          </div>
        </div>
      </div>
      
      {/* SECTION 4: Sample Contacts Data */}
      <div>
        <h2 className="text-base sm:text-lg font-semibold mb-4">Sample Contact Data ({sortedContacts.length} contacts)</h2>
        
        <div className="rounded-xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
            <table className="w-full text-xs sm:text-sm min-w-[640px]">
              <thead className="bg-white/5">
                <tr>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-medium">#</th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-medium">Contact</th>
                  <th className="text-right py-2 sm:py-3 px-2 sm:px-4 font-medium text-primary">Eng</th>
                  <th className="text-right py-2 sm:py-3 px-2 sm:px-4 font-medium text-green-500">Ori</th>
                  <th className="text-right py-2 sm:py-3 px-2 sm:px-4 font-medium text-yellow-500">Net</th>
                  <th className="text-right py-2 sm:py-3 px-2 sm:px-4 font-medium text-blue-500">Path</th>
                  <th className="text-right py-2 sm:py-3 px-2 sm:px-4 font-medium">Total</th>
                  <th className="text-center py-2 sm:py-3 px-2 sm:px-4 font-medium">Str</th>
                </tr>
              </thead>
              <tbody>
                {sortedContacts.map((contact, index) => {
                  const { engagement, origin, network, path, total, strength } = contact.scoreBreakdown;
                  return (
                    <tr key={contact.id} className="border-t border-white/5 hover:bg-white/5">
                      <td className="py-2 sm:py-3 px-2 sm:px-4 text-muted-foreground">{index + 1}</td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4">
                          <p className="font-medium truncate max-w-[100px] sm:max-w-none">{contact.name}</p>
                          <p className="text-[10px] sm:text-xs text-muted-foreground truncate max-w-[100px] sm:max-w-none">{contact.email}</p>
                      </td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4 text-right font-mono">
                        <span className="text-primary">{engagement.score.toFixed(0)}</span>
                        <span className="hidden sm:inline text-xs text-muted-foreground ml-1">
                          (<span className="text-green-500">+{engagement.positivePoints}</span>
                          <span className="text-red-500">{engagement.negativePoints}</span>)
                        </span>
                      </td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4 text-right font-mono text-green-500">{origin.score}</td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4 text-right font-mono text-yellow-500">{network.score}</td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4 text-right font-mono text-blue-500">{path.score.toFixed(0)}</td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4 text-right font-mono font-bold">{total.toFixed(0)}</td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4 text-center">
                        <Badge className={`${getStrengthBadgeClass(strength)} capitalize text-[10px] sm:text-xs px-1.5 sm:px-2`}>
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
        <div className="mt-4 p-3 sm:p-4 rounded-xl bg-white/5 border border-white/10">
          <h3 className="font-medium mb-3 text-sm sm:text-base">Averages Across All Contacts</h3>
          <div className="grid grid-cols-5 gap-2 sm:gap-4 text-center">
            <div>
              <p className="text-base sm:text-xl font-bold text-primary">{averages.engagement}</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground">Eng</p>
            </div>
            <div>
              <p className="text-base sm:text-xl font-bold text-green-500">{averages.origin}</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground">Ori</p>
            </div>
            <div>
              <p className="text-base sm:text-xl font-bold text-yellow-500">{averages.network}</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground">Net</p>
            </div>
            <div>
              <p className="text-base sm:text-xl font-bold text-blue-500">{averages.path}</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground">Path</p>
            </div>
            <div>
              <p className="text-base sm:text-xl font-bold">{averages.total}</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground">Avg</p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 5: Formula Reference */}
      <div className="p-4 sm:p-6 rounded-2xl border border-white/10 bg-card/40">
        <h2 className="text-base sm:text-lg font-semibold mb-4">Quick Formula Reference</h2>
        
        <div className="space-y-4 text-xs sm:text-sm">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <p className="font-medium text-blue-500 mb-2 text-xs sm:text-sm">⭐ Path ({pathWeight})</p>
              <p className="text-[10px] sm:text-xs space-y-1">
                <span className="block text-green-500">+{tierMultiplier}/tier</span>
                <span className="block text-green-500">+{completedPathPoints} completed</span>
                <span className="block text-red-500">{skippedPathPenalty} skipped</span>
              </p>
              <p className="text-[10px] sm:text-xs mt-2 text-blue-400 font-medium">Highest priority!</p>
            </div>
            
            <div className="p-2 sm:p-3 rounded-lg bg-primary/10 border border-primary/20">
              <p className="font-medium text-primary mb-2 text-xs sm:text-sm">Engagement ({engagementWeight})</p>
              <p className="text-[10px] sm:text-xs space-y-1">
                <span className="block text-green-500">+{calendarAcceptsPoints} calendar</span>
                <span className="block text-green-500">+{fastResponsePoints} fast resp</span>
                <span className="block text-red-500">{ignoredPenalty} ignored</span>
                <span className="block text-red-500">{declinePenalty} decline</span>
                <span className="block text-red-500">{gapPenalty} gap</span>
              </p>
            </div>
            
            <div className="p-2 sm:p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <p className="font-medium text-green-500 mb-2 text-xs sm:text-sm">Origin ({originWeight})</p>
              <p className="text-[10px] sm:text-xs space-y-1">
                <span className="block">Invite: {invitePoints}</span>
                <span className="block">Wizard: {wizardPoints}</span>
                <span className="block">Manual: {manualPoints}</span>
                <span className="block">Import: {importPoints}</span>
                <span className="block text-green-500">+{inviterBonus} inviter</span>
              </p>
            </div>
            
            <div className="p-2 sm:p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <p className="font-medium text-yellow-500 mb-2 text-xs sm:text-sm">Network ({networkWeight})</p>
              <p className="text-[10px] sm:text-xs space-y-1">
                <span className="block">+{sharedContactsMultiplier}/contact</span>
                <span className="block">+{affiliationsMultiplier}/affil</span>
                <span className="block">+{communitiesMultiplier}/community</span>
              </p>
            </div>
          </div>
          
          <div className="p-3 sm:p-4 rounded-lg bg-white/5 border border-white/10">
            <p className="font-medium mb-2 text-xs sm:text-sm">Strength Thresholds</p>
            <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 sm:gap-4 text-[10px] sm:text-xs">
              <span className="text-yellow-500">★ Star: {starMin}+</span>
              <span className="text-green-500">🔥 Flame: {flameMin}-{starMin - 1}</span>
              <span className="text-primary">✨ Ember: {emberMin}-{flameMin - 1}</span>
              <span className="text-zinc-400">○ Spark: 0-{emberMin - 1}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectionStrengthAnalytics;
