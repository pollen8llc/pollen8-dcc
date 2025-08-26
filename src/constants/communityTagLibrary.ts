export interface TagCategory {
  id: string;
  name: string;
  description: string;
  tags: string[];
}

export const COMMUNITY_TAG_LIBRARY: TagCategory[] = [
  {
    id: 'industry',
    name: 'Industry & Professional',
    description: 'Industry-specific and professional development tags',
    tags: [
      'software-engineering',
      'product-management',
      'design',
      'marketing',
      'sales',
      'finance',
      'consulting',
      'healthcare',
      'education',
      'non-profit',
      'government',
      'retail',
      'manufacturing',
      'real-estate',
      'legal',
      'media',
      'agriculture',
      'hospitality',
      'transportation',
      'energy'
    ]
  },
  {
    id: 'technology',
    name: 'Technology & Tools',
    description: 'Technology, programming languages, and tools',
    tags: [
      'javascript',
      'python',
      'react',
      'nodejs',
      'ai-ml',
      'blockchain',
      'web3',
      'mobile-development',
      'cloud-computing',
      'devops',
      'cybersecurity',
      'data-science',
      'machine-learning',
      'artificial-intelligence',
      'iot',
      'vr-ar',
      'gaming',
      'robotics',
      'quantum-computing',
      'open-source'
    ]
  },
  {
    id: 'interests',
    name: 'Interests & Hobbies',
    description: 'Personal interests and hobby-related tags',
    tags: [
      'photography',
      'music',
      'art',
      'writing',
      'reading',
      'cooking',
      'fitness',
      'yoga',
      'meditation',
      'travel',
      'hiking',
      'cycling',
      'running',
      'dancing',
      'gaming',
      'board-games',
      'crafts',
      'gardening',
      'pets',
      'volunteering'
    ]
  },
  {
    id: 'community-type',
    name: 'Community Types',
    description: 'Different types of community structures and focuses',
    tags: [
      'networking',
      'mentorship',
      'learning',
      'support-group',
      'startup',
      'entrepreneurship',
      'investment',
      'social-impact',
      'diversity-inclusion',
      'women-in-tech',
      'lgbtq+',
      'veterans',
      'students',
      'professionals',
      'founders',
      'freelancers',
      'remote-workers',
      'parents',
      'seniors',
      'youth'
    ]
  },
  {
    id: 'events',
    name: 'Event Types',
    description: 'Types of events and activities',
    tags: [
      'meetups',
      'workshops',
      'conferences',
      'hackathons',
      'webinars',
      'panel-discussions',
      'networking-events',
      'social-events',
      'book-clubs',
      'study-groups',
      'co-working',
      'lunch-learns',
      'happy-hours',
      'pitch-nights',
      'demo-days',
      'career-fairs',
      'mentoring-sessions',
      'mastermind-groups',
      'accountability-groups',
      'skill-shares'
    ]
  },
  {
    id: 'location-specific',
    name: 'Location & Regional',
    description: 'Location and region-specific tags',
    tags: [
      'bay-area',
      'silicon-valley',
      'new-york-city',
      'los-angeles',
      'seattle',
      'austin',
      'boston',
      'chicago',
      'miami',
      'denver',
      'atlanta',
      'toronto',
      'vancouver',
      'london',
      'berlin',
      'amsterdam',
      'singapore',
      'sydney',
      'tokyo',
      'global'
    ]
  }
];

export const getAllTags = (): string[] => {
  return COMMUNITY_TAG_LIBRARY.flatMap(category => category.tags).sort();
};

export const getTagsByCategory = (categoryId: string): string[] => {
  const category = COMMUNITY_TAG_LIBRARY.find(cat => cat.id === categoryId);
  return category ? category.tags : [];
};

export const searchTags = (query: string): string[] => {
  const allTags = getAllTags();
  return allTags.filter(tag => 
    tag.toLowerCase().includes(query.toLowerCase())
  );
};

// US States for location dropdown
export const US_STATES = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' },
  { value: 'DC', label: 'District of Columbia' },
  { value: 'REMOTE', label: 'Remote/Online' },
  { value: 'INTERNATIONAL', label: 'International' }
];