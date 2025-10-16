import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { useUserKnowledgeStats } from '@/hooks/knowledge/useUserKnowledgeStats';
import { useSavedArticles } from '@/hooks/knowledge/useSavedArticles';
import { useRecentActivity } from '@/hooks/knowledge/useRecentActivity';
import { useAuth } from '@/hooks/useAuth';
import { ArticleCard } from '@/components/knowledge/ArticleCard';
import { formatDistanceToNow } from 'date-fns';
import { KnowledgeArticle } from '@/models/knowledgeTypes';
import {
  BarChart3,
  MessageSquare,
  ThumbsUp,
  Bookmark,
  Activity,
  Heart,
  FileText,
  ChevronRight,
  Tag as TagIcon,
  Quote,
  HelpCircle,
  BarChart,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

// UI Components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Cultiva8OnlyNavigation } from '@/components/knowledge/Cultiva8OnlyNavigation';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const UserKnowledgeResource = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { stats, loading: statsLoading } = useUserKnowledgeStats(currentUser?.id);
  const { savedArticles, isLoading: savedLoading } = useSavedArticles();
  const { data: recentActivity, isLoading: activityLoading } = useRecentActivity();
  const [isStatsOpen, setIsStatsOpen] = React.useState(true);
  const [expandedCard, setExpandedCard] = React.useState<string | null>(null);
  const [timePeriod, setTimePeriod] = React.useState<'week' | 'month' | 'year'>('week');

  // Generate mock data for charts
  const generateChartData = (type: string) => {
    if (timePeriod === 'week') {
      return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => ({
        name: day,
        count: Math.floor(Math.random() * 10)
      }));
    } else if (timePeriod === 'month') {
      return Array.from({ length: 30 }, (_, i) => ({
        name: `${i + 1}`,
        count: Math.floor(Math.random() * 15)
      }));
    } else {
      return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month) => ({
        name: month,
        count: Math.floor(Math.random() * 30)
      }));
    }
  };

  const toggleCard = (label: string) => {
    setExpandedCard(expandedCard === label ? null : label);
  };

  const statItems = [
    {
      icon: FileText,
      label: "Articles",
      value: stats?.totalArticles || 0,
      iconColor: "text-blue-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
      chartColor: "#3b82f6"
    },
    {
      icon: HelpCircle,
      label: "Questions",
      value: stats?.totalQuestions || 0,
      iconColor: "text-green-500",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20",
      chartColor: "#22c55e"
    },
    {
      icon: Quote,
      label: "Quotes",
      value: stats?.totalQuotes || 0,
      iconColor: "text-purple-500",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
      chartColor: "#a855f7"
    },
    {
      icon: BarChart,
      label: "Polls",
      value: stats?.totalPolls || 0,
      iconColor: "text-orange-500",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/20",
      chartColor: "#f97316"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Navbar />
      <Cultiva8OnlyNavigation />
      
      <div className="container mx-auto px-4 py-6 max-w-6xl space-y-6 animate-fade-in">
        {/* Page Title */}
        <div className="mb-8 mt-6">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-primary" />
            <div>
              <p className="text-muted-foreground">Track your contributions and saved resources</p>
            </div>
          </div>
        </div>

        {/* Stats Accordion */}
        <Card className="relative overflow-hidden glass-morphism border-0 backdrop-blur-md transition-all">
          <Collapsible open={isStatsOpen} onOpenChange={setIsStatsOpen}>
            <div className="p-0">
              {/* Header */}
              <div className="p-4 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent backdrop-blur-xl border-b border-primary/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative flex items-center justify-center w-5 h-5">
                      {/* Pulsing ring */}
                      <div className="absolute w-5 h-5 rounded-full bg-teal-400/30 animate-ping" style={{ animationDuration: '2s' }} />
                      {/* Static dot */}
                      <div className="relative w-2.5 h-2.5 rounded-full bg-teal-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Content Statistics</h3>
                      <p className="text-sm text-muted-foreground">Your contribution breakdown</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Collapsible Stats Content */}
              <CollapsibleContent className="overflow-hidden transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                <div className="p-4 space-y-2">
                  {statItems.map((stat, index) => {
                    const Icon = stat.icon;
                    const isExpanded = expandedCard === stat.label;
                    return (
                      <div
                        key={index}
                        className={`bg-background/60 rounded-lg border ${stat.borderColor} transition-all duration-300`}
                      >
                        <div
                          onClick={() => toggleCard(stat.label)}
                          className="flex items-center justify-between p-4 hover:bg-background/80 hover:shadow-md transition-all duration-300 cursor-pointer group"
                        >
                          {/* Left side: Icon and Label */}
                          <div className="flex items-center space-x-3 flex-1">
                            <div className={`w-10 h-10 rounded-full ${stat.bgColor} flex items-center justify-center shrink-0`}>
                              <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                            </div>
                            <div>
                              <h4 className="text-sm font-medium group-hover:text-primary transition-colors">
                                {stat.label}
                              </h4>
                              <p className="text-xs text-muted-foreground">
                                Total {stat.label.toLowerCase()} created
                              </p>
                            </div>
                          </div>

                          {/* Right side: Value and Chevron */}
                          <div className="flex items-center space-x-3 ml-4 shrink-0">
                            <span className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                              {stat.value}
                            </span>
                            {isExpanded ? (
                              <ChevronUp className={`h-5 w-5 ${stat.iconColor}`} />
                            ) : (
                              <ChevronDown className={`h-5 w-5 ${stat.iconColor}`} />
                            )}
                          </div>
                        </div>

                        {/* Expandable Chart Section */}
                        {isExpanded && (
                          <div className="pb-4 pt-2 border-t border-border/50 animate-accordion-down">
                            {/* Time Period Selector */}
                            <div className="flex justify-end mb-4 px-4">
                              <Tabs value={timePeriod} onValueChange={(v) => setTimePeriod(v as any)}>
                                <TabsList className="bg-card/60">
                                  <TabsTrigger value="week" className="text-xs">Week</TabsTrigger>
                                  <TabsTrigger value="month" className="text-xs">Month</TabsTrigger>
                                  <TabsTrigger value="year" className="text-xs">Year</TabsTrigger>
                                </TabsList>
                              </Tabs>
                            </div>

                            {/* Chart - Full Width */}
                            <ResponsiveContainer width="100%" height={200}>
                              <LineChart 
                                data={generateChartData(stat.label)}
                                margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
                              >
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                                <XAxis 
                                  dataKey="name" 
                                  stroke="hsl(var(--muted-foreground))"
                                  fontSize={12}
                                />
                                <YAxis 
                                  stroke="hsl(var(--muted-foreground))"
                                  fontSize={11}
                                  orientation="left"
                                  mirror={true}
                                  tick={{ dx: 10 }}
                                />
                                <Tooltip
                                  contentStyle={{
                                    backgroundColor: 'hsl(var(--card))',
                                    border: '1px solid hsl(var(--border))',
                                    borderRadius: '8px',
                                    fontSize: '12px'
                                  }}
                                />
                                <Line 
                                  type="monotone" 
                                  dataKey="count" 
                                  stroke={stat.chartColor}
                                  strokeWidth={2}
                                  dot={{ fill: stat.chartColor, r: 4 }}
                                  activeDot={{ r: 6 }}
                                />
                              </LineChart>
                            </ResponsiveContainer>

                            <p className="text-xs text-muted-foreground text-center mt-2 px-4">
                              Activity over the past {timePeriod}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CollapsibleContent>

              {/* Full Width Collapse Toggle at Bottom */}
              <CollapsibleTrigger asChild>
                <button className="w-full py-3 flex items-center justify-center text-sm text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all border-t border-primary/20">
                  {isStatsOpen ? (
                    <>
                      <span>Show Less</span>
                      <ChevronUp className="w-4 h-4 ml-2" />
                    </>
                  ) : (
                    <>
                      <span>Show Statistics</span>
                      <ChevronDown className="w-4 h-4 ml-2" />
                    </>
                  )}
                </button>
              </CollapsibleTrigger>
            </div>
          </Collapsible>
        </Card>

        {/* Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="w-full justify-start bg-card/40 backdrop-blur-sm border border-border/50">
            <TabsTrigger value="overview" className="data-[state=active]:bg-primary/10">
              <Activity className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="my-posts" className="data-[state=active]:bg-primary/10">
              <FileText className="h-4 w-4 mr-2" />
              My Posts
            </TabsTrigger>
            <TabsTrigger value="saved" className="data-[state=active]:bg-primary/10">
              <Bookmark className="h-4 w-4 mr-2" />
              Saved
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid lg:grid-cols-3 gap-4">
              {/* Recent Activity */}
              <Card className="lg:col-span-2 glass-morphism border-0 bg-card/40 backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {activityLoading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-16" />
                      ))}
                    </div>
                  ) : recentActivity && recentActivity.length > 0 ? (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {recentActivity.map((activity) => (
                        <div 
                          key={`${activity.type}-${activity.id}`}
                          className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-all duration-200 group"
                          onClick={() => navigate(`/knowledge/article/${activity.article_id}`)}
                        >
                          <div className="flex-shrink-0">
                            {activity.avatar_url ? (
                              <img 
                                src={activity.avatar_url} 
                                alt={activity.user_name}
                                className="h-10 w-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                                <span className="text-sm font-medium text-primary">
                                  {activity.user_name?.charAt(0) || '?'}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-semibold">
                                {activity.user_name}
                              </span>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                {activity.type === 'comment' && (
                                  <>
                                    <MessageSquare className="h-3 w-3" />
                                    <span>commented</span>
                                  </>
                                )}
                                {activity.type === 'vote' && (
                                  <>
                                    <Heart className={`h-3 w-3 ${activity.vote_type === 'upvote' ? 'text-green-500' : 'text-red-500'}`} />
                                    <span>{activity.vote_type === 'upvote' ? 'upvoted' : 'downvoted'}</span>
                                  </>
                                )}
                                {activity.type === 'article' && (
                                  <>
                                    <FileText className="h-3 w-3" />
                                    <span>published</span>
                                  </>
                                )}
                              </div>
                            </div>
                            <p className="text-sm font-medium text-primary truncate mb-1">
                              {activity.article_title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                            </p>
                          </div>
                          <ChevronRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-sm text-muted-foreground">No recent activity</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Content Types Breakdown */}
              <Card className="glass-morphism border-0 bg-card/40 backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Content Types
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(stats?.contentTypeStats || {}).map(([type, count]) => (
                      <div key={type} className="flex items-center justify-between">
                        <Badge 
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          <TagIcon className="h-3 w-3" />
                          {type}
                        </Badge>
                        <span className="text-sm font-medium">{String(count)}</span>
                      </div>
                    ))}
                    {Object.keys(stats?.contentTypeStats || {}).length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">No content yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* My Posts Tab */}
          <TabsContent value="my-posts" className="space-y-4">
            {statsLoading ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} className="h-48" />
                ))}
              </div>
            ) : stats && (stats.articles.length > 0 || stats.questions.length > 0 || stats.polls.length > 0 || stats.quotes.length > 0) ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[...stats.articles, ...stats.questions, ...stats.polls, ...stats.quotes].map((article: any) => (
                  <ArticleCard 
                    key={article.id} 
                    article={article as KnowledgeArticle}
                    onClick={() => navigate(`/knowledge/article/${article.id}`)}
                  />
                ))}
              </div>
            ) : (
              <Card className="glass-morphism border-0 bg-card/40 backdrop-blur-md">
                <CardContent className="text-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No posts yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Start creating content to build your knowledge hub
                  </p>
                  <Button onClick={() => navigate('/knowledge/create')}>
                    Create Your First Post
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Saved Tab */}
          <TabsContent value="saved" className="space-y-4">
            {savedLoading ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} className="h-48" />
                ))}
              </div>
            ) : savedArticles && savedArticles.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {savedArticles.map((article: any) => (
                  <ArticleCard 
                    key={article.id} 
                    article={article as KnowledgeArticle}
                    onClick={() => navigate(`/knowledge/article/${article.id}`)}
                  />
                ))}
              </div>
            ) : (
              <Card className="glass-morphism border-0 bg-card/40 backdrop-blur-md">
                <CardContent className="text-center py-12">
                  <Bookmark className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No saved articles</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Bookmark articles to access them quickly later
                  </p>
                  <Button onClick={() => navigate('/knowledge')}>
                    Browse Knowledge Base
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserKnowledgeResource;