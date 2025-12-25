// Mock data for Professional Social Capital Management System

export const relationshipTypes = [
  { id: 'collaborator', label: 'Collaborator', icon: 'Users', color: 'hsl(217, 91%, 60%)' },
  { id: 'thought_partner', label: 'Thought Partner', icon: 'Brain', color: 'hsl(271, 91%, 65%)' },
  { id: 'creative_peer', label: 'Creative Peer', icon: 'Palette', color: 'hsl(330, 81%, 60%)' },
  { id: 'socialite', label: 'Socialite / Connector', icon: 'Network', color: 'hsl(25, 95%, 53%)' },
  { id: 'mentor', label: 'Mentor', icon: 'GraduationCap', color: 'hsl(142, 71%, 45%)' },
  { id: 'mentee', label: 'Mentee', icon: 'Sprout', color: 'hsl(84, 81%, 44%)' },
  { id: 'influencer', label: 'Influencer / Tastemaker', icon: 'Star', color: 'hsl(48, 96%, 53%)' },
  { id: 'career_ally', label: 'Career Ally', icon: 'Briefcase', color: 'hsl(215, 14%, 45%)' },
  { id: 'future_opportunity', label: 'Future Opportunity', icon: 'Sparkles', color: 'hsl(174, 100%, 46%)' },
];

export const connectionStrengths = [
  { id: 'thin', label: 'Thin', color: 'hsl(0, 84%, 60%)', description: 'New or weak connection', percentage: 25 },
  { id: 'growing', label: 'Growing', color: 'hsl(48, 96%, 53%)', description: 'Developing relationship', percentage: 50 },
  { id: 'solid', label: 'Solid', color: 'hsl(217, 91%, 60%)', description: 'Established connection', percentage: 75 },
  { id: 'thick', label: 'Thick', color: 'hsl(142, 71%, 45%)', description: 'Strong, trusted relationship', percentage: 100 },
];

export const warmthLevels = [
  { id: 'cold', label: 'Cold', color: 'hsl(200, 80%, 50%)', icon: 'Snowflake', description: 'Distant, formal' },
  { id: 'neutral', label: 'Neutral', color: 'hsl(215, 14%, 45%)', icon: 'Minus', description: 'Professional, standard' },
  { id: 'warm', label: 'Warm', color: 'hsl(25, 95%, 53%)', icon: 'Sun', description: 'Friendly, positive' },
  { id: 'enthusiastic', label: 'Enthusiastic', color: 'hsl(0, 84%, 60%)', icon: 'Flame', description: 'Highly engaged, excited' },
];

export const touchpointChannels = [
  { id: 'dm', label: 'Direct Message', icon: 'MessageSquare', description: 'Social platforms DM' },
  { id: 'email', label: 'Email', icon: 'Mail', description: 'Email communication' },
  { id: 'in_person', label: 'In-Person', icon: 'Users', description: 'Face-to-face meeting' },
  { id: 'social_reply', label: 'Social Reply', icon: 'MessageCircle', description: 'Engage with content' },
  { id: 'invite', label: 'Calendar Invite', icon: 'Calendar', description: 'Event invitation' },
  { id: 'call', label: 'Phone/Video Call', icon: 'Phone', description: 'Voice or video chat' },
];

export const touchpointTones = [
  { id: 'professional', label: 'Professional', description: 'Formal, business-appropriate', color: 'hsl(215, 14%, 45%)' },
  { id: 'friendly', label: 'Friendly', description: 'Casual, warm', color: 'hsl(25, 95%, 53%)' },
  { id: 'aspirational', label: 'Aspirational', description: 'Elevating, inspiring', color: 'hsl(271, 91%, 65%)' },
  { id: 'collaborative', label: 'Collaborative', description: 'Partnership-focused', color: 'hsl(174, 100%, 46%)' },
];

export const industries = [
  'Tech', 'Fashion', 'Entertainment', 'Nonprofit', 'Policy',
  'Venture Capital', 'Art', 'Film', 'Music', 'Real Estate', 'Finance', 'Healthcare', 'Education'
];

export const intentionTemplates = [
  { id: 'orbit', label: 'Stay in their orbit socially', icon: 'Orbit', description: 'Maintain casual social presence' },
  { id: 'friendship', label: 'Build a stronger professional friendship', icon: 'Heart', description: 'Deepen personal connection' },
  { id: 'collaborate', label: 'Collaborate creatively in the future', icon: 'Lightbulb', description: 'Work together on projects' },
  { id: 'top_of_mind', label: 'Stay top-of-mind casually', icon: 'Brain', description: 'Be remembered for opportunities' },
  { id: 'partnership', label: 'Explore long-term partnership opportunities', icon: 'Handshake', description: 'Build strategic alliance' },
  { id: 'reconnect', label: 'Reconnect after losing touch', icon: 'RefreshCw', description: 'Rekindle dormant relationship' },
];

export const actionTemplates = [
  { id: 'attend_event', label: 'Attend same event/meet-up', icon: 'Calendar', description: 'Cross paths at an event' },
  { id: 'send_resource', label: 'Send relevant article/resource', icon: 'FileText', description: 'Share valuable content' },
  { id: 'soft_checkin', label: 'Soft check-in via DM or email', icon: 'MessageSquare', description: 'Light touch base' },
  { id: 'invite_mixer', label: 'Invite to industry mixer', icon: 'PartyPopper', description: 'Include in social event' },
  { id: 'introduce', label: 'Introduce to someone valuable', icon: 'UserPlus', description: 'Make a strategic intro' },
  { id: 'coffee', label: 'Coffee/informal catch-up', icon: 'Coffee', description: 'Casual 1:1 meeting' },
  { id: 'compliment', label: 'Compliment recent achievement', icon: 'ThumbsUp', description: 'Celebrate their wins' },
  { id: 'post_event', label: 'Post-event follow-up', icon: 'Send', description: 'Continue conversation' },
  { id: 'co_create', label: 'Co-create something small', icon: 'Lightbulb', description: 'Collaborate on a project' },
];

// Development Path Step Interface
export interface DevelopmentPathStep {
  id: string;
  name: string;
  description: string;
  suggestedAction: string;
  suggestedChannel: string;
  suggestedTone: string;
}

// Development Path Interface
export interface DevelopmentPath {
  id: string;
  name: string;
  description: string;
  steps: DevelopmentPathStep[];
  targetStrength: 'growing' | 'solid' | 'thick';
}

// Development Paths
export const developmentPaths: DevelopmentPath[] = [
  {
    id: 'new_connection',
    name: 'New Connection',
    description: 'Build rapport with someone new',
    steps: [
      { id: 'nc_1', name: 'Initial Outreach', description: 'Send a warm intro message', suggestedAction: 'soft_checkin', suggestedChannel: 'dm', suggestedTone: 'friendly' },
      { id: 'nc_2', name: 'Follow-up Message', description: 'Share a resource or insight', suggestedAction: 'send_resource', suggestedChannel: 'dm', suggestedTone: 'friendly' },
      { id: 'nc_3', name: 'Deeper Connection', description: 'Meet in person or have a call', suggestedAction: 'coffee', suggestedChannel: 'in_person', suggestedTone: 'collaborative' },
      { id: 'nc_4', name: 'Establish Rhythm', description: 'Set up regular check-ins', suggestedAction: 'soft_checkin', suggestedChannel: 'email', suggestedTone: 'friendly' },
    ],
    targetStrength: 'growing'
  },
  {
    id: 'strengthen_bond',
    name: 'Strengthen Bond',
    description: 'Deepen an existing relationship',
    steps: [
      { id: 'sb_1', name: 'Share Resource', description: 'Send something valuable', suggestedAction: 'send_resource', suggestedChannel: 'email', suggestedTone: 'professional' },
      { id: 'sb_2', name: 'Schedule Call', description: 'Have a deeper conversation', suggestedAction: 'coffee', suggestedChannel: 'call', suggestedTone: 'friendly' },
      { id: 'sb_3', name: 'Meet In-Person', description: 'Face-to-face connection', suggestedAction: 'coffee', suggestedChannel: 'in_person', suggestedTone: 'collaborative' },
      { id: 'sb_4', name: 'Plan Collaboration', description: 'Explore working together', suggestedAction: 'co_create', suggestedChannel: 'in_person', suggestedTone: 'collaborative' },
    ],
    targetStrength: 'solid'
  },
  {
    id: 'professional_growth',
    name: 'Professional Growth',
    description: 'Build strategic career connections',
    steps: [
      { id: 'pg_1', name: 'Industry Insights', description: 'Share market knowledge', suggestedAction: 'send_resource', suggestedChannel: 'email', suggestedTone: 'professional' },
      { id: 'pg_2', name: 'Expertise Share', description: 'Offer your expertise', suggestedAction: 'soft_checkin', suggestedChannel: 'call', suggestedTone: 'professional' },
      { id: 'pg_3', name: 'Joint Opportunity', description: 'Explore collaboration', suggestedAction: 'co_create', suggestedChannel: 'in_person', suggestedTone: 'collaborative' },
      { id: 'pg_4', name: 'Referral Exchange', description: 'Introduce to valuable contacts', suggestedAction: 'introduce', suggestedChannel: 'email', suggestedTone: 'professional' },
    ],
    targetStrength: 'solid'
  },
  {
    id: 'mentorship_track',
    name: 'Mentorship Track',
    description: 'Build a mentor-mentee relationship',
    steps: [
      { id: 'mt_1', name: 'Initial Ask', description: 'Request mentorship', suggestedAction: 'soft_checkin', suggestedChannel: 'email', suggestedTone: 'aspirational' },
      { id: 'mt_2', name: 'First Session', description: 'Have first mentoring call', suggestedAction: 'coffee', suggestedChannel: 'call', suggestedTone: 'professional' },
      { id: 'mt_3', name: 'Regular Check-ins', description: 'Establish recurring meetings', suggestedAction: 'coffee', suggestedChannel: 'in_person', suggestedTone: 'friendly' },
      { id: 'mt_4', name: 'Goal Review', description: 'Assess progress and next steps', suggestedAction: 'soft_checkin', suggestedChannel: 'call', suggestedTone: 'professional' },
    ],
    targetStrength: 'thick'
  },
  {
    id: 'reconnect',
    name: 'Reconnect',
    description: 'Revive a dormant relationship',
    steps: [
      { id: 'rc_1', name: 'Warm Reintro', description: 'Send a friendly reconnection message', suggestedAction: 'soft_checkin', suggestedChannel: 'dm', suggestedTone: 'friendly' },
      { id: 'rc_2', name: 'Catch Up', description: 'Have a catch-up conversation', suggestedAction: 'coffee', suggestedChannel: 'call', suggestedTone: 'friendly' },
      { id: 'rc_3', name: 'Rebuild Rapport', description: 'Meet and reconnect properly', suggestedAction: 'coffee', suggestedChannel: 'in_person', suggestedTone: 'friendly' },
      { id: 'rc_4', name: 'Future Plans', description: 'Set intentions for staying in touch', suggestedAction: 'soft_checkin', suggestedChannel: 'email', suggestedTone: 'collaborative' },
    ],
    targetStrength: 'growing'
  },
  {
    id: 'event_networking',
    name: 'Event Networking',
    description: 'Connect through events and gatherings',
    steps: [
      { id: 'en_1', name: 'Pre-Event Connect', description: 'Reach out before the event', suggestedAction: 'soft_checkin', suggestedChannel: 'dm', suggestedTone: 'friendly' },
      { id: 'en_2', name: 'Event Meetup', description: 'Connect at the event', suggestedAction: 'attend_event', suggestedChannel: 'in_person', suggestedTone: 'friendly' },
      { id: 'en_3', name: 'Post-Event Follow-up', description: 'Follow up after meeting', suggestedAction: 'post_event', suggestedChannel: 'email', suggestedTone: 'professional' },
      { id: 'en_4', name: 'Nurture', description: 'Continue building the relationship', suggestedAction: 'send_resource', suggestedChannel: 'dm', suggestedTone: 'friendly' },
    ],
    targetStrength: 'growing'
  },
];

// Helper to get development path
export const getDevelopmentPath = (id: string) => {
  return developmentPaths.find(path => path.id === id);
};

export interface MockInteraction {
  id: string;
  date: string;
  location: string;
  topics: string;
  warmth: 'cold' | 'neutral' | 'warm' | 'enthusiastic';
  strengthened: boolean;
  followUp?: string;
}

export interface MockStrategyAction {
  id: string;
  type: string;
  scheduledDate: string;
  channel: string;
  tone: string;
  status: 'planned' | 'completed' | 'skipped';
  notes?: string;
}

export interface MockStrategy {
  intention: string;
  intentionId: string;
  actions: MockStrategyAction[];
}

export interface MockNetworkContact {
  id: string;
  name: string;
  industry: string;
  role: string;
  company: string;
  location: string;
  avatar: string;
  relationshipType: string;
  connectionStrength: 'thin' | 'growing' | 'solid' | 'thick';
  trustRating: number;
  networkInfluence: 'low' | 'medium' | 'high' | 'very_high';
  howWeMet: string;
  lastInteraction: string;
  mutualConnections: number;
  vibeNotes: string;
  recentAchievements: string[];
  eventsAttended: string[];
  email?: string;
  phone?: string;
  strategy?: MockStrategy;
  interactions: MockInteraction[];
  // Development path fields
  developmentPathId?: string;
  currentStepIndex?: number;
  completedSteps?: string[];
  pathStartedAt?: string;
}

export const mockNetworkContacts: MockNetworkContact[] = [
  {
    id: '1',
    name: 'Maya Rodriguez',
    industry: 'Tech',
    role: 'Product Lead',
    company: 'Stripe',
    location: 'San Francisco, CA',
    avatar: 'https://i.pravatar.cc/150?img=1',
    relationshipType: 'thought_partner',
    connectionStrength: 'solid',
    trustRating: 4,
    networkInfluence: 'high',
    howWeMet: 'Met at TechCrunch Disrupt 2023, connected over product strategy',
    lastInteraction: '2024-01-15',
    mutualConnections: 8,
    vibeNotes: 'Very sharp, direct communicator. Loves discussing system design.',
    recentAchievements: ['Promoted to Product Lead', 'Spoke at ProductCon'],
    eventsAttended: ['TechCrunch Disrupt', 'ProductCon SF'],
    email: 'maya@example.com',
    strategy: {
      intention: 'Build a stronger professional friendship',
      intentionId: 'friendship',
      actions: [
        { id: 'a1', type: 'coffee', scheduledDate: '2024-02-01', channel: 'in_person', tone: 'friendly', status: 'planned' },
        { id: 'a2', type: 'send_resource', scheduledDate: '2024-02-15', channel: 'email', tone: 'professional', status: 'planned' },
      ]
    },
    interactions: [
      { id: 'i1', date: '2024-01-15', location: 'Coffee at Blue Bottle', topics: 'Career growth, AI trends', warmth: 'warm', strengthened: true },
      { id: 'i2', date: '2023-11-20', location: 'TechCrunch Disrupt', topics: 'Initial meeting, product strategy', warmth: 'enthusiastic', strengthened: true },
    ],
    developmentPathId: 'strengthen_bond',
    currentStepIndex: 2,
    completedSteps: ['sb_1', 'sb_2'],
    pathStartedAt: '2023-12-01'
  },
  {
    id: '2',
    name: 'Jordan Kim',
    industry: 'Venture Capital',
    role: 'Partner',
    company: 'Sequoia Capital',
    location: 'Menlo Park, CA',
    avatar: 'https://i.pravatar.cc/150?img=3',
    relationshipType: 'career_ally',
    connectionStrength: 'growing',
    trustRating: 3,
    networkInfluence: 'very_high',
    howWeMet: 'Introduction through mutual friend at a dinner party',
    lastInteraction: '2024-01-02',
    mutualConnections: 15,
    vibeNotes: 'Very well connected, always thinking about the next big thing. Speaks thoughtfully.',
    recentAchievements: ['Led Series B for AI startup', 'Featured in Forbes 30 Under 30'],
    eventsAttended: ['All-Raise Summit', 'Founder Dinner'],
    email: 'jordan.k@example.com',
    strategy: {
      intention: 'Explore long-term partnership opportunities',
      intentionId: 'partnership',
      actions: [
        { id: 'a3', type: 'attend_event', scheduledDate: '2024-02-20', channel: 'in_person', tone: 'professional', status: 'planned' },
      ]
    },
    interactions: [
      { id: 'i3', date: '2024-01-02', location: 'Zoom call', topics: 'Market trends, portfolio intros', warmth: 'warm', strengthened: true },
    ]
  },
  {
    id: '3',
    name: 'Aisha Patel',
    industry: 'Fashion',
    role: 'Creative Director',
    company: 'Self-Employed',
    location: 'New York, NY',
    avatar: 'https://i.pravatar.cc/150?img=5',
    relationshipType: 'creative_peer',
    connectionStrength: 'thick',
    trustRating: 5,
    networkInfluence: 'high',
    howWeMet: 'Collaborated on a brand campaign 2 years ago',
    lastInteraction: '2024-01-20',
    mutualConnections: 12,
    vibeNotes: 'Incredibly creative, always has fresh perspectives. Great energy.',
    recentAchievements: ['Vogue feature', 'Launched new collection'],
    eventsAttended: ['Fashion Week', 'Art Basel'],
    email: 'aisha@example.com',
    phone: '+1 555-0123',
    strategy: {
      intention: 'Collaborate creatively in the future',
      intentionId: 'collaborate',
      actions: [
        { id: 'a4', type: 'co_create', scheduledDate: '2024-03-01', channel: 'in_person', tone: 'collaborative', status: 'planned' },
        { id: 'a5', type: 'compliment', scheduledDate: '2024-02-05', channel: 'dm', tone: 'friendly', status: 'completed' },
      ]
    },
    interactions: [
      { id: 'i4', date: '2024-01-20', location: 'Studio visit', topics: 'New collection, collab ideas', warmth: 'enthusiastic', strengthened: true },
      { id: 'i5', date: '2023-12-15', location: 'Holiday party', topics: 'Year review, future plans', warmth: 'warm', strengthened: true },
    ]
  },
  {
    id: '4',
    name: 'Marcus Chen',
    industry: 'Entertainment',
    role: 'Executive Producer',
    company: 'Netflix',
    location: 'Los Angeles, CA',
    avatar: 'https://i.pravatar.cc/150?img=8',
    relationshipType: 'influencer',
    connectionStrength: 'thin',
    trustRating: 2,
    networkInfluence: 'very_high',
    howWeMet: 'Brief intro at Sundance Film Festival',
    lastInteraction: '2023-10-15',
    mutualConnections: 3,
    vibeNotes: 'Very busy, hard to get time with. But influential in the industry.',
    recentAchievements: ['Emmy nomination', 'Greenlit major docuseries'],
    eventsAttended: ['Sundance', 'Emmy Awards'],
    email: 'marcus.c@example.com',
    interactions: [
      { id: 'i6', date: '2023-10-15', location: 'Sundance after-party', topics: 'Quick intro, exchanged cards', warmth: 'neutral', strengthened: false },
    ]
  },
  {
    id: '5',
    name: 'Sofia Martinez',
    industry: 'Nonprofit',
    role: 'Executive Director',
    company: 'Education First',
    location: 'Washington, DC',
    avatar: 'https://i.pravatar.cc/150?img=9',
    relationshipType: 'mentor',
    connectionStrength: 'solid',
    trustRating: 5,
    networkInfluence: 'medium',
    howWeMet: 'Met through a leadership program 5 years ago',
    lastInteraction: '2024-01-10',
    mutualConnections: 6,
    vibeNotes: 'Incredibly wise, always gives thoughtful advice. Great listener.',
    recentAchievements: ['Expanded to 10 new cities', 'White House recognition'],
    eventsAttended: ['Aspen Ideas Festival', 'Social Impact Summit'],
    email: 'sofia@educationfirst.org',
    strategy: {
      intention: 'Stay in their orbit socially',
      intentionId: 'orbit',
      actions: [
        { id: 'a6', type: 'soft_checkin', scheduledDate: '2024-02-10', channel: 'email', tone: 'friendly', status: 'planned' },
      ]
    },
    interactions: [
      { id: 'i7', date: '2024-01-10', location: 'Phone call', topics: 'Career advice, org challenges', warmth: 'warm', strengthened: true },
      { id: 'i8', date: '2023-09-20', location: 'DC dinner', topics: 'Policy updates, mutual contacts', warmth: 'warm', strengthened: true },
    ]
  },
  {
    id: '6',
    name: 'Derek Johnson',
    industry: 'Music',
    role: 'A&R Director',
    company: 'Atlantic Records',
    location: 'New York, NY',
    avatar: 'https://i.pravatar.cc/150?img=12',
    relationshipType: 'socialite',
    connectionStrength: 'growing',
    trustRating: 3,
    networkInfluence: 'high',
    howWeMet: 'Met at a rooftop party through a mutual friend',
    lastInteraction: '2024-01-08',
    mutualConnections: 20,
    vibeNotes: 'Super connector, knows everyone. Always at the best events.',
    recentAchievements: ['Signed breakout artist', 'Grammy after-party host'],
    eventsAttended: ['Grammy Awards', 'Coachella', 'Art Basel'],
    email: 'derek.j@atlantic.com',
    strategy: {
      intention: 'Stay top-of-mind casually',
      intentionId: 'top_of_mind',
      actions: [
        { id: 'a7', type: 'invite_mixer', scheduledDate: '2024-02-28', channel: 'dm', tone: 'friendly', status: 'planned' },
      ]
    },
    interactions: [
      { id: 'i9', date: '2024-01-08', location: 'Industry party', topics: 'Music trends, artist intros', warmth: 'enthusiastic', strengthened: true },
    ]
  },
  {
    id: '7',
    name: 'Lisa Park',
    industry: 'Healthcare',
    role: 'Chief Medical Officer',
    company: 'HealthTech Startup',
    location: 'Boston, MA',
    avatar: 'https://i.pravatar.cc/150?img=16',
    relationshipType: 'future_opportunity',
    connectionStrength: 'thin',
    trustRating: 2,
    networkInfluence: 'medium',
    howWeMet: 'Connected on LinkedIn after reading her article',
    lastInteraction: '2023-11-05',
    mutualConnections: 2,
    vibeNotes: 'Brilliant in healthcare tech. Would love to collaborate someday.',
    recentAchievements: ['Published in JAMA', 'Raised Series A'],
    eventsAttended: ['JP Morgan Healthcare Conference'],
    email: 'lisa.park@healthtech.io',
    interactions: [
      { id: 'i10', date: '2023-11-05', location: 'LinkedIn messages', topics: 'Intro, shared interests', warmth: 'neutral', strengthened: false },
    ]
  },
  {
    id: '8',
    name: 'Alex Rivera',
    industry: 'Art',
    role: 'Gallery Owner',
    company: 'Rivera Contemporary',
    location: 'Miami, FL',
    avatar: 'https://i.pravatar.cc/150?img=18',
    relationshipType: 'collaborator',
    connectionStrength: 'solid',
    trustRating: 4,
    networkInfluence: 'high',
    howWeMet: 'Met at Art Basel 2022, instant connection',
    lastInteraction: '2023-12-08',
    mutualConnections: 9,
    vibeNotes: 'Great taste, always curating interesting shows. Fun to hang out with.',
    recentAchievements: ['Major installation sold', 'Featured in Artnet'],
    eventsAttended: ['Art Basel', 'Frieze', 'Venice Biennale'],
    email: 'alex@riveracontemporary.com',
    strategy: {
      intention: 'Collaborate creatively in the future',
      intentionId: 'collaborate',
      actions: [
        { id: 'a8', type: 'attend_event', scheduledDate: '2024-03-15', channel: 'in_person', tone: 'collaborative', status: 'planned' },
        { id: 'a9', type: 'introduce', scheduledDate: '2024-02-20', channel: 'email', tone: 'professional', status: 'planned' },
      ]
    },
    interactions: [
      { id: 'i11', date: '2023-12-08', location: 'Art Basel Miami', topics: 'Artists, collection, future show', warmth: 'enthusiastic', strengthened: true },
    ]
  },
  {
    id: '9',
    name: 'Priya Sharma',
    industry: 'Finance',
    role: 'Managing Director',
    company: 'Goldman Sachs',
    location: 'New York, NY',
    avatar: 'https://i.pravatar.cc/150?img=20',
    relationshipType: 'career_ally',
    connectionStrength: 'growing',
    trustRating: 3,
    networkInfluence: 'very_high',
    howWeMet: 'College alumni event, same graduating class',
    lastInteraction: '2023-12-20',
    mutualConnections: 25,
    vibeNotes: 'Sharp, strategic thinker. Remembers everyone she meets.',
    recentAchievements: ['Promoted to MD', 'Board seat at fintech'],
    eventsAttended: ['Davos', 'Bloomberg Markets Conference'],
    email: 'priya.sharma@gs.com',
    interactions: [
      { id: 'i12', date: '2023-12-20', location: 'Alumni dinner', topics: 'Industry trends, career moves', warmth: 'warm', strengthened: true },
    ]
  },
  {
    id: '10',
    name: 'Jamal Thompson',
    industry: 'Real Estate',
    role: 'Developer',
    company: 'Thompson Development Group',
    location: 'Atlanta, GA',
    avatar: 'https://i.pravatar.cc/150?img=22',
    relationshipType: 'collaborator',
    connectionStrength: 'solid',
    trustRating: 4,
    networkInfluence: 'high',
    howWeMet: 'Introduced by a mutual investor friend',
    lastInteraction: '2024-01-12',
    mutualConnections: 7,
    vibeNotes: 'Visionary developer, always thinking about community impact.',
    recentAchievements: ['Broke ground on mixed-use project', 'City recognition award'],
    eventsAttended: ['Urban Land Institute Conference'],
    email: 'jamal@thompsondev.com',
    phone: '+1 404-555-0188',
    strategy: {
      intention: 'Explore long-term partnership opportunities',
      intentionId: 'partnership',
      actions: [
        { id: 'a10', type: 'coffee', scheduledDate: '2024-02-05', channel: 'in_person', tone: 'professional', status: 'planned' },
      ]
    },
    interactions: [
      { id: 'i13', date: '2024-01-12', location: 'Site visit', topics: 'New development, potential collab', warmth: 'enthusiastic', strengthened: true },
    ]
  },
  {
    id: '11',
    name: 'Emma Walsh',
    industry: 'Tech',
    role: 'Engineering Manager',
    company: 'Google',
    location: 'Seattle, WA',
    avatar: 'https://i.pravatar.cc/150?img=25',
    relationshipType: 'mentee',
    connectionStrength: 'thick',
    trustRating: 5,
    networkInfluence: 'medium',
    howWeMet: 'Met at a women in tech conference, became friends',
    lastInteraction: '2024-01-18',
    mutualConnections: 4,
    vibeNotes: 'Brilliant engineer, always learning. Great mentoring relationship.',
    recentAchievements: ['Promoted to manager', 'Launched major product feature'],
    eventsAttended: ['Grace Hopper Celebration', 'Google I/O'],
    email: 'emma.walsh@google.com',
    strategy: {
      intention: 'Build a stronger professional friendship',
      intentionId: 'friendship',
      actions: [
        { id: 'a11', type: 'soft_checkin', scheduledDate: '2024-02-01', channel: 'dm', tone: 'friendly', status: 'completed' },
      ]
    },
    interactions: [
      { id: 'i14', date: '2024-01-18', location: 'Video call', topics: 'Career growth, team challenges', warmth: 'warm', strengthened: true },
      { id: 'i15', date: '2023-11-10', location: 'Grace Hopper', topics: 'Conference highlights, networking', warmth: 'enthusiastic', strengthened: true },
    ]
  },
  {
    id: '12',
    name: 'Ryan O\'Connor',
    industry: 'Film',
    role: 'Director',
    company: 'Independent',
    location: 'Los Angeles, CA',
    avatar: 'https://i.pravatar.cc/150?img=28',
    relationshipType: 'creative_peer',
    connectionStrength: 'growing',
    trustRating: 3,
    networkInfluence: 'medium',
    howWeMet: 'Met at a film screening, talked for hours after',
    lastInteraction: '2023-12-01',
    mutualConnections: 5,
    vibeNotes: 'Passionate storyteller, very artistic vision. Fun conversations.',
    recentAchievements: ['Festival selection', 'New project greenlit'],
    eventsAttended: ['Sundance', 'Tribeca Film Festival'],
    email: 'ryan@independent.film',
    strategy: {
      intention: 'Reconnect after losing touch',
      intentionId: 'reconnect',
      actions: [
        { id: 'a12', type: 'post_event', scheduledDate: '2024-02-15', channel: 'email', tone: 'friendly', status: 'planned' },
      ]
    },
    interactions: [
      { id: 'i16', date: '2023-12-01', location: 'Film premiere', topics: 'Filmmaking, industry trends', warmth: 'warm', strengthened: true },
    ]
  },
];

// Helper function to get relationship type details
export const getRelationshipType = (id: string) => {
  return relationshipTypes.find(type => type.id === id);
};

// Helper function to get connection strength details
export const getConnectionStrength = (id: string) => {
  return connectionStrengths.find(strength => strength.id === id);
};

// Helper function to get warmth level details
export const getWarmthLevel = (id: string) => {
  return warmthLevels.find(level => level.id === id);
};

// Helper function to get channel details
export const getChannel = (id: string) => {
  return touchpointChannels.find(channel => channel.id === id);
};

// Helper function to get tone details
export const getTone = (id: string) => {
  return touchpointTones.find(tone => tone.id === id);
};

// Helper function to get action template details
export const getActionTemplate = (id: string) => {
  return actionTemplates.find(action => action.id === id);
};

// Helper function to get intention template details
export const getIntentionTemplate = (id: string) => {
  return intentionTemplates.find(intention => intention.id === id);
};
