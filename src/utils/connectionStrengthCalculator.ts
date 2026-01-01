// Connection Strength Calculator
// Formula: Engagement (40%) + Origin (30%) + Network (30%) = Total Score (0-100)

export type ConnectionStrength = 'thin' | 'growing' | 'solid' | 'thick';

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
  total: number;
  strength: ConnectionStrength;
}

// Engagement Score Calculation (40% weight, max 40 points)
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
  
  // Normalize to 0-40 range
  const rawScore = positivePoints + negativePoints;
  const normalizedScore = Math.max(0, Math.min(40, (rawScore / 50) * 40 + 20));
  
  return {
    score: Math.round(normalizedScore * 10) / 10,
    positivePoints,
    negativePoints
  };
}

// Origin Score Calculation (30% weight, max 30 points)
export function calculateOriginScore(factors: OriginFactors): number {
  const sourceScores: Record<string, number> = {
    invite: 25,    // Best - came through trusted invite
    wizard: 20,    // Good - created intentionally
    manual: 15,    // OK - added manually
    import: 10,    // Lower - bulk import
    unknown: 5     // Lowest - unknown source
  };
  
  let score = sourceScores[factors.source] || 5;
  
  // Bonus for having an inviter
  if (factors.hasInviter) {
    score += 5;
  }
  
  return Math.min(30, score);
}

// Network Score Calculation (30% weight, max 30 points)
export function calculateNetworkScore(factors: NetworkFactors): number {
  let score = 0;
  
  // Inviter strength bonus (0-12 points)
  const inviterBonus: Record<ConnectionStrength, number> = {
    thick: 12,
    solid: 9,
    growing: 5,
    thin: 2
  };
  if (factors.inviterStrength) {
    score += inviterBonus[factors.inviterStrength];
  }
  
  // Shared connections (0-10 points, 2 per connection, max 5)
  score += Math.min(10, factors.sharedConnections * 2);
  
  // Affiliations (0-4 points)
  score += Math.min(4, factors.affiliationCount);
  
  // Community overlap (0-4 points)
  score += Math.min(4, factors.communityOverlap);
  
  return Math.min(30, score);
}

// Map score to strength category
export function mapScoreToStrength(score: number): ConnectionStrength {
  if (score >= 75) return 'thick';
  if (score >= 50) return 'solid';
  if (score >= 25) return 'growing';
  return 'thin';
}

// Calculate complete score breakdown
export function calculateConnectionStrength(
  engagementFactors: EngagementFactors,
  originFactors: OriginFactors,
  networkFactors: NetworkFactors
): ScoreBreakdown {
  const engagement = calculateEngagementScore(engagementFactors);
  const originScore = calculateOriginScore(originFactors);
  const networkScore = calculateNetworkScore(networkFactors);
  
  const total = Math.round((engagement.score + originScore + networkScore) * 10) / 10;
  
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
    thin: 'hsl(var(--muted-foreground))',
    growing: 'hsl(var(--primary))',
    solid: 'hsl(142 76% 36%)', // Green
    thick: 'hsl(45 93% 47%)'   // Gold
  };
  return colors[strength];
}

// Get strength badge variant
export function getStrengthBadgeClass(strength: ConnectionStrength): string {
  const classes: Record<ConnectionStrength, string> = {
    thin: 'bg-muted text-muted-foreground',
    growing: 'bg-primary/20 text-primary',
    solid: 'bg-green-500/20 text-green-400',
    thick: 'bg-yellow-500/20 text-yellow-400'
  };
  return classes[strength];
}
