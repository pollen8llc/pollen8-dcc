// Connection Strength Calculator
// Formula: Engagement (35%) + Origin (25%) + Network (25%) + Path (15%) = Total Score (0-100)

export type ConnectionStrength = 'spark' | 'ember' | 'flame' | 'star';

export interface EngagementFactors {
  // Positive factors
  calendarAccepts: number;
  fastResponses: number; // Response < 24 hours
  completedOutreach: number;
  warmInteractions: number;
  recentEngagement: boolean; // Within 30 days
  
  // Negative factors
  calendarDeclines: number;
  ignoredNotifications: number; // No response > 7 days
  overdueOutreach: number;
  longContactGaps: number; // > 90 days between contact
  coldInteractions: number;
  cancelledMeetings: number;
}

export interface OriginFactors {
  source: 'invite' | 'wizard' | 'import' | 'manual' | 'unknown';
  hasInviter: boolean;
  inviterStrength?: ConnectionStrength;
}

export interface NetworkFactors {
  inviterStrength?: ConnectionStrength;
  sharedConnections: number;
  affiliationCount: number;
  communityOverlap: number;
}

export interface PathFactors {
  currentTier: number; // 1-4
  completedPaths: number; // Number of completed paths
  skippedPaths: number; // Number of skipped paths
  currentStepProgress: number; // 0-4 steps completed in current path
  isActiveInPath: boolean; // Currently on a development path
  hasStrategy: boolean; // Has an active strategy
  recentPathActivity: boolean; // Path activity within 14 days
}

export interface ScoreBreakdown {
  engagement: {
    score: number;
    positivePoints: number;
    negativePoints: number;
    factors: EngagementFactors;
  };
  origin: {
    score: number;
    factors: OriginFactors;
  };
  network: {
    score: number;
    factors: NetworkFactors;
  };
  path: {
    score: number;
    factors: PathFactors;
  };
  total: number;
  strength: ConnectionStrength;
}

// Engagement Score Calculation (35% weight, max 35 points)
export function calculateEngagementScore(factors: EngagementFactors): { score: number; positivePoints: number; negativePoints: number } {
  let positivePoints = 0;
  let negativePoints = 0;
  
  // Positive factors (max +50 before normalization)
  positivePoints += factors.calendarAccepts * 8;      // +8 per accept
  positivePoints += factors.fastResponses * 5;        // +5 per fast response
  positivePoints += factors.completedOutreach * 6;    // +6 per completed
  positivePoints += factors.warmInteractions * 4;     // +4 per warm interaction
  positivePoints += factors.recentEngagement ? 10 : 0; // +10 for recent
  
  // Negative factors (max -40 before normalization)
  negativePoints += factors.calendarDeclines * -6;     // -6 per decline
  negativePoints += factors.ignoredNotifications * -8; // -8 per ignored
  negativePoints += factors.overdueOutreach * -5;      // -5 per overdue
  negativePoints += factors.longContactGaps * -7;      // -7 per gap
  negativePoints += factors.coldInteractions * -4;     // -4 per cold
  negativePoints += factors.cancelledMeetings * -6;    // -6 per cancelled
  
  // Normalize to 0-35 range
  const rawScore = positivePoints + negativePoints;
  const normalizedScore = Math.max(0, Math.min(35, (rawScore / 50) * 35 + 17.5));
  
  return {
    score: Math.round(normalizedScore * 10) / 10,
    positivePoints,
    negativePoints
  };
}

// Origin Score Calculation (25% weight, max 25 points)
export function calculateOriginScore(factors: OriginFactors): number {
  const sourceScores: Record<string, number> = {
    invite: 20,    // Best - came through trusted invite
    wizard: 16,    // Good - created intentionally
    manual: 12,    // OK - added manually
    import: 8,     // Lower - bulk import
    unknown: 4     // Lowest - unknown source
  };
  
  let score = sourceScores[factors.source] || 4;
  
  // Bonus for having an inviter
  if (factors.hasInviter) {
    score += 5;
  }
  
  return Math.min(25, score);
}

// Network Score Calculation (25% weight, max 25 points)
export function calculateNetworkScore(factors: NetworkFactors): number {
  let score = 0;
  
  // Inviter strength bonus (0-10 points)
  const inviterBonus: Record<ConnectionStrength, number> = {
    star: 10,
    flame: 7,
    ember: 4,
    spark: 2
  };
  if (factors.inviterStrength) {
    score += inviterBonus[factors.inviterStrength];
  }
  
  // Shared connections (0-8 points, 2 per connection, max 4)
  score += Math.min(8, factors.sharedConnections * 2);
  
  // Affiliations (0-4 points)
  score += Math.min(4, factors.affiliationCount);
  
  // Community overlap (0-3 points)
  score += Math.min(3, factors.communityOverlap);
  
  return Math.min(25, score);
}

// Path Score Calculation (15% weight, max 15 points)
export function calculatePathScore(factors: PathFactors): number {
  let score = 0;
  
  // Tier progression bonus (0-8 points, 2 per tier above 1)
  score += Math.min(8, (factors.currentTier - 1) * 2.5);
  
  // Completed paths (0-4 points, 1.5 per completed)
  score += Math.min(4, factors.completedPaths * 1.5);
  
  // Current step progress (0-2 points)
  score += Math.min(2, factors.currentStepProgress * 0.5);
  
  // Active in path bonus
  if (factors.isActiveInPath) {
    score += 1;
  }
  
  // Has strategy bonus
  if (factors.hasStrategy) {
    score += 1;
  }
  
  // Recent path activity bonus
  if (factors.recentPathActivity) {
    score += 1;
  }
  
  // Penalty for skipped paths (-1 per skipped, max -3)
  score -= Math.min(3, factors.skippedPaths);
  
  return Math.max(0, Math.min(15, score));
}

// Map score to strength category
export function mapScoreToStrength(score: number): ConnectionStrength {
  if (score >= 75) return 'star';
  if (score >= 50) return 'flame';
  if (score >= 25) return 'ember';
  return 'spark';
}

// Default path factors for contacts not in Actv8
export const defaultPathFactors: PathFactors = {
  currentTier: 1,
  completedPaths: 0,
  skippedPaths: 0,
  currentStepProgress: 0,
  isActiveInPath: false,
  hasStrategy: false,
  recentPathActivity: false,
};

// Calculate complete score breakdown
export function calculateConnectionStrength(
  engagementFactors: EngagementFactors,
  originFactors: OriginFactors,
  networkFactors: NetworkFactors,
  pathFactors: PathFactors = defaultPathFactors
): ScoreBreakdown {
  const engagement = calculateEngagementScore(engagementFactors);
  const originScore = calculateOriginScore(originFactors);
  const networkScore = calculateNetworkScore(networkFactors);
  const pathScore = calculatePathScore(pathFactors);
  
  const total = Math.round((engagement.score + originScore + networkScore + pathScore) * 10) / 10;
  
  return {
    engagement: {
      score: engagement.score,
      positivePoints: engagement.positivePoints,
      negativePoints: engagement.negativePoints,
      factors: engagementFactors
    },
    origin: {
      score: originScore,
      factors: originFactors
    },
    network: {
      score: networkScore,
      factors: networkFactors
    },
    path: {
      score: pathScore,
      factors: pathFactors
    },
    total,
    strength: mapScoreToStrength(total)
  };
}

// Response time categories
export function calculateResponseTimeCategory(hoursToRespond: number): { category: string; points: number } {
  if (hoursToRespond <= 1) return { category: 'Immediate', points: 5 };
  if (hoursToRespond <= 24) return { category: 'Fast', points: 5 };
  if (hoursToRespond <= 72) return { category: 'Normal', points: 2 };
  if (hoursToRespond <= 168) return { category: 'Slow', points: 0 };
  return { category: 'Ignored', points: -8 };
}

// Get strength color for UI
export function getStrengthColor(strength: ConnectionStrength): string {
  const colors: Record<ConnectionStrength, string> = {
    spark: 'hsl(var(--muted-foreground))',
    ember: 'hsl(var(--primary))',
    flame: 'hsl(142 76% 36%)', // Green
    star: 'hsl(45 93% 47%)'   // Gold
  };
  return colors[strength];
}

// Get strength badge variant
export function getStrengthBadgeClass(strength: ConnectionStrength): string {
  const classes: Record<ConnectionStrength, string> = {
    spark: 'bg-muted text-muted-foreground',
    ember: 'bg-primary/20 text-primary',
    flame: 'bg-green-500/20 text-green-400',
    star: 'bg-yellow-500/20 text-yellow-400'
  };
  return classes[strength];
}
