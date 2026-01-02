import { 
  EngagementFactors, 
  OriginFactors, 
  NetworkFactors, 
  PathFactors,
  ScoreBreakdown,
  calculateConnectionStrength,
  ConnectionStrength
} from '@/utils/connectionStrengthCalculator';

export interface MockContact {
  id: string;
  name: string;
  email: string;
  engagementFactors: EngagementFactors;
  originFactors: OriginFactors;
  networkFactors: NetworkFactors;
  pathFactors: PathFactors;
  scoreBreakdown: ScoreBreakdown;
}

// Generate diverse mock contacts
const mockContactsRaw: Array<{
  id: string;
  name: string;
  email: string;
  engagement: EngagementFactors;
  origin: OriginFactors;
  network: NetworkFactors;
  path: PathFactors;
}> = [
  // THICK connections (3)
  {
    id: '1',
    name: 'Sarah Chen',
    email: 'sarah.chen@example.com',
    engagement: {
      calendarAccepts: 5,
      fastResponses: 4,
      completedOutreach: 6,
      warmInteractions: 3,
      recentEngagement: true,
      calendarDeclines: 0,
      ignoredNotifications: 0,
      overdueOutreach: 0,
      longContactGaps: 0,
      coldInteractions: 0,
      cancelledMeetings: 0
    },
    origin: { source: 'invite', hasInviter: true, inviterStrength: 'star' },
    network: { inviterStrength: 'star', sharedConnections: 5, affiliationCount: 3, communityOverlap: 2 },
    path: { currentTier: 4, completedPaths: 3, skippedPaths: 0, currentStepProgress: 2, isActiveInPath: true, hasStrategy: true, recentPathActivity: true }
  },
  {
    id: '2',
    name: 'Marcus Johnson',
    email: 'marcus.j@example.com',
    engagement: {
      calendarAccepts: 4,
      fastResponses: 3,
      completedOutreach: 5,
      warmInteractions: 4,
      recentEngagement: true,
      calendarDeclines: 0,
      ignoredNotifications: 0,
      overdueOutreach: 0,
      longContactGaps: 0,
      coldInteractions: 0,
      cancelledMeetings: 1
    },
    origin: { source: 'invite', hasInviter: true, inviterStrength: 'flame' },
    network: { inviterStrength: 'flame', sharedConnections: 4, affiliationCount: 2, communityOverlap: 3 },
    path: { currentTier: 3, completedPaths: 2, skippedPaths: 0, currentStepProgress: 3, isActiveInPath: true, hasStrategy: true, recentPathActivity: true }
  },
  {
    id: '3',
    name: 'Elena Rodriguez',
    email: 'elena.r@example.com',
    engagement: {
      calendarAccepts: 6,
      fastResponses: 5,
      completedOutreach: 4,
      warmInteractions: 2,
      recentEngagement: true,
      calendarDeclines: 1,
      ignoredNotifications: 0,
      overdueOutreach: 0,
      longContactGaps: 0,
      coldInteractions: 0,
      cancelledMeetings: 0
    },
    origin: { source: 'wizard', hasInviter: false },
    network: { sharedConnections: 6, affiliationCount: 4, communityOverlap: 2 },
    path: { currentTier: 3, completedPaths: 2, skippedPaths: 0, currentStepProgress: 4, isActiveInPath: true, hasStrategy: false, recentPathActivity: true }
  },
  
  // SOLID connections (4)
  {
    id: '4',
    name: 'David Kim',
    email: 'david.kim@example.com',
    engagement: {
      calendarAccepts: 3,
      fastResponses: 2,
      completedOutreach: 4,
      warmInteractions: 2,
      recentEngagement: true,
      calendarDeclines: 1,
      ignoredNotifications: 0,
      overdueOutreach: 1,
      longContactGaps: 0,
      coldInteractions: 0,
      cancelledMeetings: 0
    },
    origin: { source: 'invite', hasInviter: true, inviterStrength: 'ember' },
    network: { inviterStrength: 'ember', sharedConnections: 3, affiliationCount: 2, communityOverlap: 1 },
    path: { currentTier: 2, completedPaths: 1, skippedPaths: 0, currentStepProgress: 2, isActiveInPath: true, hasStrategy: true, recentPathActivity: true }
  },
  {
    id: '5',
    name: 'Amanda Foster',
    email: 'amanda.f@example.com',
    engagement: {
      calendarAccepts: 2,
      fastResponses: 3,
      completedOutreach: 3,
      warmInteractions: 2,
      recentEngagement: true,
      calendarDeclines: 0,
      ignoredNotifications: 1,
      overdueOutreach: 0,
      longContactGaps: 0,
      coldInteractions: 1,
      cancelledMeetings: 0
    },
    origin: { source: 'wizard', hasInviter: false },
    network: { sharedConnections: 4, affiliationCount: 1, communityOverlap: 2 },
    path: { currentTier: 2, completedPaths: 1, skippedPaths: 0, currentStepProgress: 1, isActiveInPath: true, hasStrategy: false, recentPathActivity: false }
  },
  {
    id: '6',
    name: 'James Wilson',
    email: 'james.w@example.com',
    engagement: {
      calendarAccepts: 3,
      fastResponses: 2,
      completedOutreach: 2,
      warmInteractions: 3,
      recentEngagement: true,
      calendarDeclines: 0,
      ignoredNotifications: 0,
      overdueOutreach: 1,
      longContactGaps: 0,
      coldInteractions: 0,
      cancelledMeetings: 1
    },
    origin: { source: 'manual', hasInviter: true, inviterStrength: 'flame' },
    network: { inviterStrength: 'flame', sharedConnections: 2, affiliationCount: 2, communityOverlap: 1 },
    path: { currentTier: 2, completedPaths: 1, skippedPaths: 1, currentStepProgress: 3, isActiveInPath: true, hasStrategy: true, recentPathActivity: true }
  },
  {
    id: '7',
    name: 'Priya Patel',
    email: 'priya.p@example.com',
    engagement: {
      calendarAccepts: 2,
      fastResponses: 2,
      completedOutreach: 3,
      warmInteractions: 2,
      recentEngagement: true,
      calendarDeclines: 1,
      ignoredNotifications: 0,
      overdueOutreach: 0,
      longContactGaps: 0,
      coldInteractions: 0,
      cancelledMeetings: 0
    },
    origin: { source: 'invite', hasInviter: true, inviterStrength: 'star' },
    network: { inviterStrength: 'star', sharedConnections: 2, affiliationCount: 1, communityOverlap: 0 },
    path: { currentTier: 2, completedPaths: 1, skippedPaths: 0, currentStepProgress: 0, isActiveInPath: false, hasStrategy: false, recentPathActivity: false }
  },
  
  // GROWING connections (4)
  {
    id: '8',
    name: 'Michael Torres',
    email: 'michael.t@example.com',
    engagement: {
      calendarAccepts: 1,
      fastResponses: 1,
      completedOutreach: 2,
      warmInteractions: 1,
      recentEngagement: true,
      calendarDeclines: 1,
      ignoredNotifications: 1,
      overdueOutreach: 1,
      longContactGaps: 0,
      coldInteractions: 1,
      cancelledMeetings: 0
    },
    origin: { source: 'import', hasInviter: false },
    network: { sharedConnections: 2, affiliationCount: 1, communityOverlap: 1 },
    path: { currentTier: 1, completedPaths: 0, skippedPaths: 0, currentStepProgress: 2, isActiveInPath: true, hasStrategy: false, recentPathActivity: true }
  },
  {
    id: '9',
    name: 'Lisa Chang',
    email: 'lisa.c@example.com',
    engagement: {
      calendarAccepts: 2,
      fastResponses: 0,
      completedOutreach: 1,
      warmInteractions: 2,
      recentEngagement: true,
      calendarDeclines: 0,
      ignoredNotifications: 2,
      overdueOutreach: 0,
      longContactGaps: 0,
      coldInteractions: 0,
      cancelledMeetings: 1
    },
    origin: { source: 'wizard', hasInviter: true, inviterStrength: 'spark' },
    network: { inviterStrength: 'spark', sharedConnections: 1, affiliationCount: 0, communityOverlap: 1 },
    path: { currentTier: 1, completedPaths: 0, skippedPaths: 0, currentStepProgress: 1, isActiveInPath: true, hasStrategy: true, recentPathActivity: false }
  },
  {
    id: '10',
    name: 'Robert Brown',
    email: 'robert.b@example.com',
    engagement: {
      calendarAccepts: 1,
      fastResponses: 2,
      completedOutreach: 2,
      warmInteractions: 0,
      recentEngagement: false,
      calendarDeclines: 0,
      ignoredNotifications: 0,
      overdueOutreach: 2,
      longContactGaps: 1,
      coldInteractions: 1,
      cancelledMeetings: 0
    },
    origin: { source: 'manual', hasInviter: false },
    network: { sharedConnections: 3, affiliationCount: 2, communityOverlap: 0 },
    path: { currentTier: 1, completedPaths: 0, skippedPaths: 1, currentStepProgress: 0, isActiveInPath: false, hasStrategy: false, recentPathActivity: false }
  },
  {
    id: '11',
    name: 'Jennifer Lee',
    email: 'jennifer.l@example.com',
    engagement: {
      calendarAccepts: 2,
      fastResponses: 1,
      completedOutreach: 1,
      warmInteractions: 1,
      recentEngagement: true,
      calendarDeclines: 2,
      ignoredNotifications: 0,
      overdueOutreach: 0,
      longContactGaps: 0,
      coldInteractions: 0,
      cancelledMeetings: 0
    },
    origin: { source: 'invite', hasInviter: true, inviterStrength: 'ember' },
    network: { inviterStrength: 'ember', sharedConnections: 1, affiliationCount: 1, communityOverlap: 0 },
    path: { currentTier: 1, completedPaths: 0, skippedPaths: 0, currentStepProgress: 3, isActiveInPath: true, hasStrategy: false, recentPathActivity: true }
  },
  
  // THIN connections (4)
  {
    id: '12',
    name: 'Alex Morgan',
    email: 'alex.m@example.com',
    engagement: {
      calendarAccepts: 0,
      fastResponses: 0,
      completedOutreach: 1,
      warmInteractions: 0,
      recentEngagement: false,
      calendarDeclines: 2,
      ignoredNotifications: 3,
      overdueOutreach: 2,
      longContactGaps: 2,
      coldInteractions: 2,
      cancelledMeetings: 1
    },
    origin: { source: 'import', hasInviter: false },
    network: { sharedConnections: 0, affiliationCount: 0, communityOverlap: 0 },
    path: { currentTier: 1, completedPaths: 0, skippedPaths: 0, currentStepProgress: 0, isActiveInPath: false, hasStrategy: false, recentPathActivity: false }
  },
  {
    id: '13',
    name: 'Chris Davis',
    email: 'chris.d@example.com',
    engagement: {
      calendarAccepts: 0,
      fastResponses: 1,
      completedOutreach: 0,
      warmInteractions: 0,
      recentEngagement: false,
      calendarDeclines: 1,
      ignoredNotifications: 2,
      overdueOutreach: 3,
      longContactGaps: 1,
      coldInteractions: 1,
      cancelledMeetings: 2
    },
    origin: { source: 'import', hasInviter: false },
    network: { sharedConnections: 1, affiliationCount: 0, communityOverlap: 0 },
    path: { currentTier: 1, completedPaths: 0, skippedPaths: 0, currentStepProgress: 0, isActiveInPath: false, hasStrategy: false, recentPathActivity: false }
  },
  {
    id: '14',
    name: 'Taylor Swift',
    email: 'taylor.s@example.com',
    engagement: {
      calendarAccepts: 1,
      fastResponses: 0,
      completedOutreach: 0,
      warmInteractions: 0,
      recentEngagement: false,
      calendarDeclines: 0,
      ignoredNotifications: 4,
      overdueOutreach: 1,
      longContactGaps: 2,
      coldInteractions: 0,
      cancelledMeetings: 0
    },
    origin: { source: 'unknown', hasInviter: false },
    network: { sharedConnections: 0, affiliationCount: 0, communityOverlap: 0 },
    path: { currentTier: 1, completedPaths: 0, skippedPaths: 0, currentStepProgress: 0, isActiveInPath: false, hasStrategy: false, recentPathActivity: false }
  },
  {
    id: '15',
    name: 'Jordan Smith',
    email: 'jordan.s@example.com',
    engagement: {
      calendarAccepts: 0,
      fastResponses: 0,
      completedOutreach: 1,
      warmInteractions: 1,
      recentEngagement: false,
      calendarDeclines: 3,
      ignoredNotifications: 1,
      overdueOutreach: 0,
      longContactGaps: 1,
      coldInteractions: 2,
      cancelledMeetings: 1
    },
    origin: { source: 'import', hasInviter: false },
    network: { sharedConnections: 0, affiliationCount: 1, communityOverlap: 0 },
    path: { currentTier: 1, completedPaths: 0, skippedPaths: 2, currentStepProgress: 0, isActiveInPath: false, hasStrategy: false, recentPathActivity: false }
  }
];

// Generate mock contacts with calculated scores
export const mockContacts: MockContact[] = mockContactsRaw.map(contact => ({
  id: contact.id,
  name: contact.name,
  email: contact.email,
  engagementFactors: contact.engagement,
  originFactors: contact.origin,
  networkFactors: contact.network,
  pathFactors: contact.path,
  scoreBreakdown: calculateConnectionStrength(
    contact.engagement,
    contact.origin,
    contact.network,
    contact.path
  )
}));

// Get distribution counts
export function getStrengthDistribution(): Record<ConnectionStrength, number> {
  return mockContacts.reduce((acc, contact) => {
    acc[contact.scoreBreakdown.strength]++;
    return acc;
  }, { spark: 0, ember: 0, flame: 0, star: 0 } as Record<ConnectionStrength, number>);
}

// Get average scores
export function getAverageScores(): { engagement: number; origin: number; network: number; path: number; total: number } {
  const totals = mockContacts.reduce(
    (acc, contact) => ({
      engagement: acc.engagement + contact.scoreBreakdown.engagement.score,
      origin: acc.origin + contact.scoreBreakdown.origin.score,
      network: acc.network + contact.scoreBreakdown.network.score,
      path: acc.path + contact.scoreBreakdown.path.score,
      total: acc.total + contact.scoreBreakdown.total
    }),
    { engagement: 0, origin: 0, network: 0, path: 0, total: 0 }
  );
  
  const count = mockContacts.length;
  return {
    engagement: Math.round((totals.engagement / count) * 10) / 10,
    origin: Math.round((totals.origin / count) * 10) / 10,
    network: Math.round((totals.network / count) * 10) / 10,
    path: Math.round((totals.path / count) * 10) / 10,
    total: Math.round((totals.total / count) * 10) / 10
  };
}
