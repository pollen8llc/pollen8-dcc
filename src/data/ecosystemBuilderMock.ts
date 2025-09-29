import { Platform, Milestone, AnalyticsData } from "@/types/ecosystemBuilder";

export const MOCK_PLATFORMS: Platform[] = [
  // Event Management
  {
    id: "eventbrite",
    name: "Eventbrite",
    category: "event-management",
    description: "Professional event ticketing and registration",
    bestFor: ["local", "hybrid", "event-driven"],
    regions: ["North America", "Europe"],
    purposes: ["advocacy", "business", "social"],
    pricing: "Free + fees per ticket",
    integrations: ["Mailchimp", "Salesforce"]
  },
  {
    id: "luma",
    name: "Luma",
    category: "event-management",
    description: "Beautiful event pages with calendar sync",
    bestFor: ["online", "hybrid", "membership-based"],
    regions: ["Global"],
    purposes: ["learning", "professional", "creative"],
    pricing: "Free",
    integrations: ["Slack", "Discord", "Zoom"]
  },
  // Communication
  {
    id: "discord",
    name: "Discord",
    category: "communication",
    description: "Voice, video, and text community platform",
    bestFor: ["online", "membership-based"],
    regions: ["Global"],
    purposes: ["social", "learning", "creative"],
    pricing: "Free",
    integrations: ["YouTube", "Twitch", "Spotify"]
  },
  {
    id: "slack",
    name: "Slack",
    category: "communication",
    description: "Professional team communication",
    bestFor: ["online", "hybrid", "membership-based"],
    regions: ["Global"],
    purposes: ["business", "professional", "learning"],
    pricing: "Free tier available",
    integrations: ["Google Drive", "Zoom", "Salesforce"]
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    category: "communication",
    description: "Simple group messaging for communities",
    bestFor: ["local", "hybrid"],
    regions: ["Global"],
    purposes: ["advocacy", "social", "lifestyle"],
    pricing: "Free",
    integrations: ["Facebook", "Instagram"]
  },
  // Member Management
  {
    id: "bevy",
    name: "Bevy",
    category: "member-management",
    description: "Enterprise community event platform",
    bestFor: ["chapter-based", "event-driven"],
    regions: ["North America", "Europe"],
    purposes: ["business", "professional"],
    pricing: "Enterprise",
    integrations: ["Salesforce", "Marketo", "HubSpot"]
  },
  // CRM & Analytics
  {
    id: "airtable",
    name: "Airtable",
    category: "crm-analytics",
    description: "Flexible database for community management",
    bestFor: ["local", "online", "hybrid"],
    regions: ["Global"],
    purposes: ["advocacy", "business", "learning"],
    pricing: "Free tier available",
    integrations: ["Slack", "Gmail", "Zapier"]
  },
  // Payments
  {
    id: "stripe",
    name: "Stripe",
    category: "payments",
    description: "Payment processing for memberships",
    bestFor: ["online", "membership-based"],
    regions: ["Global"],
    purposes: ["business", "professional"],
    pricing: "2.9% + 30¢ per transaction",
    integrations: ["Most platforms"]
  }
];

export const MOCK_MILESTONES_NEW: Milestone[] = [
  {
    id: "m1",
    title: "Define Your Community DNA",
    description: "Identify your target audience, purpose, and community type",
    status: "completed",
    tools: [],
    resources: ["Community Canvas Template", "Target Audience Worksheet"],
    order: 1
  },
  {
    id: "m2",
    title: "Set Up Your Tech Stack",
    description: "Choose and configure your core communication and event platforms",
    status: "in-progress",
    tools: ["WhatsApp", "Luma"],
    resources: ["Platform Setup Guides", "Integration Tutorials"],
    order: 2
  },
  {
    id: "m3",
    title: "Host Your First Event",
    description: "Plan and execute your inaugural community gathering",
    status: "pending",
    tools: ["Luma", "WhatsApp"],
    resources: ["First Event Playbook", "Promotion Checklist"],
    order: 3
  },
  {
    id: "m4",
    title: "Build Your Member Directory",
    description: "Create a searchable directory of your community members",
    status: "pending",
    tools: ["ECO8"],
    resources: ["Directory Best Practices"],
    order: 4
  },
  {
    id: "m5",
    title: "Launch Member Management",
    description: "Implement CRM system to track relationships",
    status: "pending",
    tools: ["REL8", "Airtable"],
    resources: ["CRM Setup Guide"],
    order: 5
  }
];

export const MOCK_MILESTONES_EXISTING: Milestone[] = [
  {
    id: "o1",
    title: "Optimize Member Engagement",
    description: "Increase active participation by 20%",
    status: "in-progress",
    tools: ["Discord", "REL8"],
    resources: ["Engagement Playbook", "Analytics Dashboard"],
    order: 1
  },
  {
    id: "o2",
    title: "Diversify Revenue Streams",
    description: "Add membership tiers or sponsorships",
    status: "pending",
    tools: ["Stripe", "Modul8"],
    resources: ["Monetization Guide", "Sponsorship Templates"],
    order: 2
  },
  {
    id: "o3",
    title: "Scale Event Programming",
    description: "Increase from monthly to weekly events",
    status: "pending",
    tools: ["Luma", "Eventbrite"],
    resources: ["Event Scaling Playbook"],
    order: 3
  }
];

export const MOCK_ANALYTICS: AnalyticsData = {
  memberGrowth: [
    { month: "Jan", count: 245 },
    { month: "Feb", count: 312 },
    { month: "Mar", count: 389 },
    { month: "Apr", count: 456 },
    { month: "May", count: 523 },
    { month: "Jun", count: 612 }
  ],
  engagement: [
    { metric: "Active Members", value: 612, change: 17 },
    { metric: "Event Attendance", value: 78, change: 12 },
    { metric: "Message Activity", value: 1453, change: 24 },
    { metric: "Member Retention", value: 89, change: 5 }
  ],
  platformUsage: [
    { platform: "Discord", users: 612, active: 478 },
    { platform: "Luma", users: 523, active: 412 },
    { platform: "Airtable", users: 156, active: 89 }
  ],
  relationships: [
    { type: "Core Members", count: 89 },
    { type: "Active Contributors", count: 234 },
    { type: "Casual Participants", count: 289 }
  ]
};
