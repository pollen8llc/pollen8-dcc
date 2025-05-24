import { 
  KnowledgeArticle, 
  KnowledgeTag, 
  ContentType,
  KnowledgeQueryOptions
} from '@/models/knowledgeTypes';

// Mock articles data
const mockArticles: KnowledgeArticle[] = [
  {
    id: '1',
    title: 'How to effectively build a network of strategic connections',
    content: '<p>One of the most important aspects of being a successful network strategist is understanding how to build and maintain strategic connections. This article explores the key principles that can help you build a network that is not just large, but strategically valuable.</p><h2>Start with clear goals</h2><p>Before reaching out to potential connections, define what you want to achieve through your network. Are you looking for mentorship, business opportunities, knowledge exchange, or something else? Having clear goals will help you identify who you should connect with and how to approach them.</p><h2>Focus on quality over quantity</h2><p>It\'s better to have a smaller network of meaningful connections than a large network of shallow ones. Invest time in building genuine relationships with people who align with your goals and values.</p>',
    content_type: ContentType.ARTICLE,
    user_id: '101',
    created_at: '2023-11-10T14:30:00Z',
    updated_at: '2023-11-10T14:30:00Z',
    tags: ['networking', 'strategy', 'relationships'],
    vote_count: 42,
    view_count: 1250,
    comment_count: 8,
    is_featured: true,
    author: {
      id: '101',
      name: 'Alex Johnson',
      avatar_url: 'https://i.pravatar.cc/150?img=1',
      role: 'ADMIN'
    }
  },
  {
    id: '2',
    title: 'What are the best practices for maintaining long-term professional relationships?',
    content: '<p>I\'ve been able to make initial connections pretty well, but I struggle with maintaining those relationships over time. What are some effective strategies for keeping professional connections active and mutually beneficial in the long run?</p>',
    content_type: ContentType.QUESTION,
    user_id: '102',
    created_at: '2023-11-18T09:15:00Z',
    updated_at: '2023-11-18T09:15:00Z',
    tags: ['relationships', 'networking', 'communication'],
    vote_count: 24,
    view_count: 876,
    comment_count: 15,
    is_answered: true,
    author: {
      id: '102',
      name: 'Samantha Lee',
      avatar_url: 'https://i.pravatar.cc/150?img=2',
      role: 'MEMBER'
    }
  },
  {
    id: '3',
    title: 'The greatest networking advice I ever received was to give before you ask.',
    content: '<p>"The currency of real networking is not greed but generosity." - Keith Ferrazzi</p><p>This completely changed how I approach building my network. Now I always look for ways to provide value first before seeking anything in return.</p>',
    content_type: ContentType.QUOTE,
    user_id: '103',
    created_at: '2023-11-20T16:45:00Z',
    updated_at: '2023-11-20T16:45:00Z',
    tags: ['inspiration', 'networking', 'advice'],
    vote_count: 56,
    view_count: 1024,
    comment_count: 6,
    author: {
      id: '103',
      name: 'Marcus Wong',
      avatar_url: 'https://i.pravatar.cc/150?img=3',
      role: 'ORGANIZER'
    }
  },
  {
    id: '4',
    title: 'Which networking approach do you find most effective?',
    content: '<p>I\'m curious about what approaches are working best for other network strategists in the current environment.</p>',
    content_type: ContentType.POLL,
    user_id: '104',
    created_at: '2023-11-22T11:30:00Z',
    updated_at: '2023-11-22T11:30:00Z',
    tags: ['poll', 'networking', 'strategy'],
    vote_count: 18,
    view_count: 543,
    comment_count: 12,
    author: {
      id: '104',
      name: 'Priya Sharma',
      avatar_url: 'https://i.pravatar.cc/150?img=4',
      role: 'MEMBER'
    },
    pollData: {
      options: [
        { text: 'In-person events' },
        { text: 'Online communities' },
        { text: '1:1 introductions' },
        { text: 'Social media' }
      ],
      allowMultipleSelections: false,
      duration: '7d'
    }
  },
  {
    id: '5',
    title: 'The importance of diversity in strategic networks',
    content: '<p>Having a diverse network exposes you to different perspectives, ideas, and opportunities that you might not encounter otherwise. This article discusses the importance of diversity in building an effective strategic network.</p><h2>Benefits of a diverse network</h2><p>A diverse network brings fresh insights, innovative thinking, and a broader range of opportunities. It helps you avoid echo chambers and challenges your thinking in productive ways.</p><h2>Strategies for diversifying your network</h2><p>Attend interdisciplinary events, join diverse communities, and step outside your comfort zone to connect with people from different backgrounds, industries, and expertise areas.</p>',
    content_type: ContentType.ARTICLE,
    user_id: '105',
    created_at: '2023-11-25T13:20:00Z',
    updated_at: '2023-11-26T09:15:00Z',
    tags: ['diversity', 'inclusion', 'networking', 'strategy'],
    vote_count: 37,
    view_count: 890,
    comment_count: 9,
    author: {
      id: '105',
      name: 'Jamal Bennett',
      avatar_url: 'https://i.pravatar.cc/150?img=5',
      role: 'ORGANIZER'
    }
  },
  {
    id: '6',
    title: 'How to measure the ROI of your networking efforts?',
    content: '<p>I\'ve been investing significant time in networking activities, but I\'m not sure how to measure the return on this investment. What metrics or frameworks do you use to assess the value of your networking efforts?</p>',
    content_type: ContentType.QUESTION,
    user_id: '106',
    created_at: '2023-11-28T10:05:00Z',
    updated_at: '2023-11-28T10:05:00Z',
    tags: ['metrics', 'roi', 'networking', 'strategy'],
    vote_count: 15,
    view_count: 432,
    comment_count: 7,
    is_answered: false,
    author: {
      id: '106',
      name: 'David Chen',
      avatar_url: 'https://i.pravatar.cc/150?img=6',
      role: 'MEMBER'
    }
  }
];

// Mock tags data
const mockTags: KnowledgeTag[] = [
  { id: '1', name: 'networking', description: 'Building and maintaining professional connections', count: 5 },
  { id: '2', name: 'strategy', description: 'Strategic planning and execution', count: 3 },
  { id: '3', name: 'relationships', description: 'Developing meaningful professional relationships', count: 2 },
  { id: '4', name: 'communication', description: 'Effective communication techniques', count: 1 },
  { id: '5', name: 'inspiration', description: 'Motivational content and quotes', count: 1 },
  { id: '6', name: 'advice', description: 'Professional guidance and recommendations', count: 1 },
  { id: '7', name: 'diversity', description: 'Embracing different perspectives and backgrounds', count: 1 },
  { id: '8', name: 'inclusion', description: 'Creating environments where everyone belongs', count: 1 },
  { id: '9', name: 'metrics', description: 'Measuring performance and outcomes', count: 1 },
  { id: '10', name: 'roi', description: 'Return on investment analysis', count: 1 },
  { id: '11', name: 'poll', description: 'Community surveys and opinion polls', count: 1 }
];

// Function to filter and sort articles based on query parameters
export const getMockArticles = (options: KnowledgeQueryOptions = {}): Promise<KnowledgeArticle[]> => {
  const { searchQuery, tag, type, sort } = options;
  
  // Apply filters
  let filteredArticles = [...mockArticles];
  
  // Filter by search query
  if (searchQuery) {
    const searchLower = searchQuery.toLowerCase();
    filteredArticles = filteredArticles.filter(article => 
      article.title.toLowerCase().includes(searchLower) || 
      article.content.toLowerCase().includes(searchLower)
    );
  }
  
  // Filter by tag
  if (tag) {
    filteredArticles = filteredArticles.filter(article => 
      article.tags && article.tags.includes(tag)
    );
  }
  
  // Filter by content type
  if (type) {
    const typeUpper = type.toUpperCase();
    filteredArticles = filteredArticles.filter(article => 
      article.content_type === typeUpper
    );
  }
  
  // Apply sorting
  switch (sort) {
    case 'newest':
      filteredArticles.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      break;
    case 'popular':
      filteredArticles.sort((a, b) => (b.view_count || 0) - (a.view_count || 0));
      break;
    case 'votes':
      filteredArticles.sort((a, b) => (b.vote_count || 0) - (a.vote_count || 0));
      break;
    default:
      // Default sort by newest
      filteredArticles.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }
  
  // Simulate async API call
  return new Promise((resolve) => {
    setTimeout(() => resolve(filteredArticles), 500);
  });
};

// Function to get tags
export const getMockTags = (): Promise<KnowledgeTag[]> => {
  // Simulate async API call
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockTags), 300);
  });
};
