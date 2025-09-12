import { supabase } from '@/integrations/supabase/client';

export interface PlatformMetrics {
  users: {
    total: number;
    admins: number;
    organizers: number;
    serviceProviders: number;
    members: number;
    activeUsers: number;
  };
  content: {
    totalPosts: number;
    articles: number;
    questions: number;
    polls: number;
    quotes: number;
    totalComments: number;
    totalTags: number;
  };
  communities: {
    total: number;
    public: number;
    private: number;
  };
  engagement: {
    totalVotes: number;
    savedArticles: number;
    pollResponses: number;
  };
  modul8: {
    totalServiceRequests: number;
    activeProposals: number;
    completedDeals: number;
    serviceProviders: number;
    organizers: number;
  };
  rel8t: {
    totalContacts: number;
    activeTriggers: number;
    emailsSent: number;
    pendingEmails: number;
  };
}

export async function getPlatformMetrics(): Promise<PlatformMetrics> {
  try {
    // Get user statistics
    const { data: userStats } = await supabase
      .from('profiles')
      .select('*')
      .limit(1); // Just to get user count structure
    
    // Get active users (users who logged in within last 30 days)
    const { count: activeUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .gte('updated_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    // Get content statistics
    const { count: totalPosts } = await supabase
      .from('knowledge_articles')
      .select('*', { count: 'exact', head: true });

    const { count: articles } = await supabase
      .from('knowledge_articles')
      .select('*', { count: 'exact', head: true })
      .eq('content_type', 'ARTICLE');

    const { count: questions } = await supabase
      .from('knowledge_articles')
      .select('*', { count: 'exact', head: true })
      .eq('content_type', 'QUESTION');

    const { count: polls } = await supabase
      .from('knowledge_articles')
      .select('*', { count: 'exact', head: true })
      .eq('content_type', 'POLL');

    const { count: quotes } = await supabase
      .from('knowledge_articles')
      .select('*', { count: 'exact', head: true })
      .eq('content_type', 'QUOTE');

    const { count: totalComments } = await supabase
      .from('knowledge_comments')
      .select('*', { count: 'exact', head: true });

    const { count: totalTags } = await supabase
      .from('knowledge_tags')
      .select('*', { count: 'exact', head: true });

    // Get community statistics
    const { count: totalCommunities } = await supabase
      .from('communities')
      .select('*', { count: 'exact', head: true });

    const { count: publicCommunities } = await supabase
      .from('communities')
      .select('*', { count: 'exact', head: true })
      .eq('is_public', true);

    const { count: privateCommunities } = await supabase
      .from('communities')
      .select('*', { count: 'exact', head: true })
      .eq('is_public', false);

    // Get engagement statistics
    const { count: totalVotes } = await supabase
      .from('knowledge_votes')
      .select('*', { count: 'exact', head: true });

    const { count: savedArticles } = await supabase
      .from('knowledge_saved_articles')
      .select('*', { count: 'exact', head: true });

    // Get Modul8 statistics
    const { count: totalServiceRequests } = await supabase
      .from('modul8_service_requests')
      .select('*', { count: 'exact', head: true });

    const { count: activeProposals } = await supabase
      .from('modul8_proposal_cards')
      .select('*', { count: 'exact', head: true })
      .in('status', ['pending', 'countered']);

    const { count: completedDeals } = await (supabase as any)
      .from('modul8_deals')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed');

    const { count: modul8ServiceProviders } = await supabase
      .from('modul8_service_providers')
      .select('*', { count: 'exact', head: true });

    const { count: modul8Organizers } = await supabase
      .from('modul8_organizers')
      .select('*', { count: 'exact', head: true });

    // Get REL8T statistics using the database function
    const { data: rel8tMetrics } = await supabase.rpc('get_rel8t_metrics');
    
    const rel8tData = rel8tMetrics as any;
    const totalContacts = rel8tData?.totalContacts || 0;
    const activeTriggers = rel8tData?.activeTriggers || 0;
    const emailsSent = rel8tData?.emailsSent || 0;
    const pendingEmails = rel8tData?.pendingEmails || 0;

    // Get simplified user counts for now
    const { count: totalUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    return {
      users: {
        total: totalUsers || 0,
        admins: 1, // Placeholder
        organizers: 0, // Placeholder
        serviceProviders: modul8ServiceProviders || 0,
        members: Math.max(0, (totalUsers || 0) - 1),
        activeUsers: activeUsers || 0,
      },
      content: {
        totalPosts: totalPosts || 0,
        articles: articles || 0,
        questions: questions || 0,
        polls: polls || 0,
        quotes: quotes || 0,
        totalComments: totalComments || 0,
        totalTags: totalTags || 0,
      },
      communities: {
        total: totalCommunities || 0,
        public: publicCommunities || 0,
        private: privateCommunities || 0,
      },
      engagement: {
        totalVotes: totalVotes || 0,
        savedArticles: savedArticles || 0,
        pollResponses: 0, // Will be implemented when poll responses table exists
      },
      modul8: {
        totalServiceRequests: totalServiceRequests || 0,
        activeProposals: activeProposals || 0,
        completedDeals: completedDeals || 0,
        serviceProviders: modul8ServiceProviders || 0,
        organizers: modul8Organizers || 0,
      },
      rel8t: {
        totalContacts,
        activeTriggers,
        emailsSent,
        pendingEmails,
      },
    };
  } catch (error) {
    console.error('Error fetching platform metrics:', error);
    throw error;
  }
}

export async function getMetricsChartData() {
  try {
    // Get user growth over last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const { data: userGrowth } = await supabase
      .from('profiles')
      .select('created_at')
      .gte('created_at', sixMonthsAgo.toISOString())
      .order('created_at', { ascending: true });

    // Get content creation over last 6 months
    const { data: contentGrowth } = await supabase
      .from('knowledge_articles')
      .select('created_at, content_type')
      .gte('created_at', sixMonthsAgo.toISOString())
      .order('created_at', { ascending: true });

    // Process data for charts
    const processGrowthData = (data: any[], label: string) => {
      const monthlyData: { [key: string]: number } = {};
      
      data?.forEach(item => {
        const month = new Date(item.created_at).toISOString().slice(0, 7); // YYYY-MM
        monthlyData[month] = (monthlyData[month] || 0) + 1;
      });

      return Object.entries(monthlyData).map(([month, count]) => ({
        month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        [label]: count,
      }));
    };

    return {
      userGrowth: processGrowthData(userGrowth || [], 'users'),
      contentGrowth: processGrowthData(contentGrowth || [], 'posts'),
    };
  } catch (error) {
    console.error('Error fetching chart data:', error);
    return {
      userGrowth: [],
      contentGrowth: [],
    };
  }
}