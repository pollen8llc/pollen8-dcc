
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { useUserKnowledgeStats } from '@/hooks/knowledge/useUserKnowledgeStats';
import { useSavedArticles } from '@/hooks/knowledge/useSavedArticles';
import { useRecentActivity } from '@/hooks/knowledge/useRecentActivity';
import { ArticleCard } from '@/components/knowledge/ArticleCard';
import { formatDistanceToNow } from 'date-fns';
import { KnowledgeArticle } from '@/models/knowledgeTypes';
import {
  User,
  BarChart3,
  BookOpen,
  Eye,
  MessageSquare,
  ThumbsUp,
  Bookmark,
  TrendingUp,
  Calendar,
  PlusCircle,
  Tag as TagIcon,
  Activity,
  Heart,
  FileText,
  ChevronRight
} from 'lucide-react';

// UI Components
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { MetricCard } from '@/components/rel8t/MetricCard';
import { KnowledgeNavigation } from '@/components/knowledge/KnowledgeNavigation';

const UserKnowledgeResource = () => {
  const navigate = useNavigate();
  const { stats, loading: statsLoading } = useUserKnowledgeStats();
  const { savedArticles, isLoading: savedLoading } = useSavedArticles();
  const { data: recentActivity, isLoading: activityLoading } = useRecentActivity();

  const StatCard = ({ icon: Icon, title, value, description }: {
    icon: any;
    title: string;
    value: string | number;
    description?: string;
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-white">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-white">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-full">
        {/* Knowledge Navigation */}
        <div className="mb-6">
          <KnowledgeNavigation />
        </div>
        
        {/* Header */}
        <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center justify-between mb-6 sm:mb-8">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">My Knowledge Hub</h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Track your contributions and manage your saved content
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              onClick={() => navigate('/knowledge/create')}
              className="glass-morphism border-0 bg-primary/20 hover:bg-primary/30 text-primary-foreground backdrop-blur-md"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Create New Post</span>
              <span className="sm:hidden">Create</span>
            </Button>
          </div>
        </div>

        {/* Desktop Layout with Sidebar */}
        <div className="hidden lg:flex gap-6">
          {/* Main Content - Recent Activity Feed */}
          <div className="flex-1 space-y-6">
            <Card className="glass-morphism border-0 bg-card/30 backdrop-blur-md">
              <CardHeader className="px-6 py-6">
                <CardTitle className="flex items-center gap-2 text-foreground text-xl">
                  <Activity className="h-5 w-5 text-primary" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                {activityLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Skeleton key={i} className="h-16 glass-morphism" />
                    ))}
                  </div>
                ) : recentActivity && recentActivity.length > 0 ? (
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div 
                        key={`${activity.type}-${activity.id}`}
                        className="flex items-start gap-4 p-4 glass-morphism hover:bg-white/10 rounded-lg cursor-pointer transition-all duration-200 group border border-white/5 hover:border-white/10"
                        onClick={() => navigate(`/knowledge/article/${activity.article_id}`)}
                      >
                        <div className="flex-shrink-0">
                          {activity.avatar_url ? (
                            <img 
                              src={activity.avatar_url} 
                              alt={activity.user_name}
                              className="h-10 w-10 rounded-full object-cover border border-white/10"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center border border-white/10">
                              <span className="text-sm font-medium text-primary">
                                {activity.user_name?.charAt(0) || '?'}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-semibold text-foreground">
                              {activity.user_name}
                            </span>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              {activity.type === 'comment' && (
                                <>
                                  <MessageSquare className="h-3 w-3 text-blue-400" />
                                  <span>commented on</span>
                                </>
                              )}
                              {activity.type === 'vote' && (
                                <>
                                  <Heart className={`h-3 w-3 ${activity.vote_type === 'upvote' ? 'text-green-400' : 'text-red-400'}`} />
                                  <span>{activity.vote_type === 'upvote' ? 'upvoted' : 'downvoted'}</span>
                                </>
                              )}
                              {activity.type === 'article' && (
                                <>
                                  <FileText className="h-3 w-3 text-primary" />
                                  <span>published</span>
                                </>
                              )}
                              <span>•</span>
                              <span>{formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}</span>
                            </div>
                          </div>
                          <p className="text-base font-medium text-primary truncate group-hover:text-primary/80 transition-colors mb-2">
                            {activity.article_title}
                          </p>
                          {activity.type === 'comment' && activity.content && (
                            <div className="text-sm text-muted-foreground bg-white/5 rounded-lg p-3 mb-2 border-l-2 border-primary/30">
                              <p className="italic">"{activity.content}"</p>
                            </div>
                          )}
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No recent activity</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Start creating content to see activity here
                    </p>
                    <Button 
                      onClick={() => navigate('/knowledge/create')}
                      className="glass-morphism border-0 bg-primary/20 hover:bg-primary/30 text-primary-foreground backdrop-blur-md"
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Create Your First Post
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar - Content Types & Stats */}
          <div className="w-80 space-y-6">
            {/* Content Types */}
            <Card className="glass-morphism border-0 bg-card/30 backdrop-blur-md">
              <CardHeader className="px-6 py-6">
                <CardTitle className="flex items-center gap-2 text-foreground text-lg">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Content Types
                </CardTitle>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <div className="space-y-2">
                  {Object.entries(stats?.contentTypeStats || {}).map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between">
                      <Badge 
                        variant="secondary"
                        className="bg-primary text-black border-0 shadow-md font-medium"
                      >
                        <TagIcon className="h-3 w-3 mr-1" />
                        {type.toLowerCase()}
                      </Badge>
                      <span className="text-sm font-medium text-foreground">{String(count)}</span>
                    </div>
                  ))}
                  {Object.keys(stats?.contentTypeStats || {}).length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">No content types yet</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid gap-4">
              <StatCard
                icon={FileText}
                title="Total Posts"
                value={stats?.totalArticles || 0}
                description="Articles published"
              />
              <StatCard
                icon={ThumbsUp}
                title="Total Votes"
                value={stats?.totalVotes || 0}
                description="Community engagement"
              />
              <StatCard
                icon={Bookmark}
                title="Saved Items"
                value={savedArticles?.length || 0}
                description="Bookmarked content"
              />
            </div>
          </div>
        </div>

        {/* Mobile/Tablet Layout - Keep Existing Tabs */}
        <div className="lg:hidden">
          <Tabs defaultValue="overview" className="space-y-4 sm:space-y-6">
            <TabsList className="glass-morphism border-0 bg-card/30 backdrop-blur-md w-full justify-start overflow-x-auto">
              <TabsTrigger 
                value="overview" 
                className="data-[state=active]:bg-primary data-[state=active]:text-black data-[state=active]:shadow-lg text-muted-foreground px-3 sm:px-6 py-2 flex-shrink-0 transition-all duration-200"
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger 
                value="my-posts" 
                className="data-[state=active]:bg-primary data-[state=active]:text-black data-[state=active]:shadow-lg text-muted-foreground px-3 sm:px-6 py-2 flex-shrink-0 transition-all duration-200"
              >
                <FileText className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">My Posts</span>
              </TabsTrigger>
              <TabsTrigger 
                value="saved" 
                className="data-[state=active]:bg-primary data-[state=active]:text-black data-[state=active]:shadow-lg text-muted-foreground px-3 sm:px-6 py-2 flex-shrink-0 transition-all duration-200"
              >
                <Bookmark className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Saved</span>
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4 sm:space-y-6">
              {statsLoading ? (
                <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-24 sm:h-32 glass-morphism" />
                  ))}
                </div>
              ) : (
                <>
                  <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
                    {/* Content Type Breakdown */}
                    <Card className="glass-morphism border-0 bg-card/30 backdrop-blur-md">
                      <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
                        <CardTitle className="flex items-center gap-2 text-foreground text-base sm:text-lg">
                          <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                          Content Types
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(stats?.contentTypeStats || {}).map(([type, count]) => (
                            <Badge 
                              key={type} 
                              variant="secondary"
                              className="bg-primary text-black border-0 shadow-md hover:shadow-lg transition-all duration-200 font-medium"
                            >
                              <TagIcon className="h-3 w-3 mr-1" />
                              {type.toLowerCase()}: {count}
                            </Badge>
                          ))}
                          {Object.keys(stats?.contentTypeStats || {}).length === 0 && (
                            <p className="text-sm text-muted-foreground">No content types yet</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Recent Activity */}
                    <Card className="glass-morphism border-0 bg-card/30 backdrop-blur-md">
                      <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
                        <CardTitle className="flex items-center gap-2 text-foreground text-base sm:text-lg">
                          <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                          Recent Activity
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                        {activityLoading ? (
                          <div className="space-y-3">
                            {[1, 2, 3].map((i) => (
                              <Skeleton key={i} className="h-12 glass-morphism" />
                            ))}
                          </div>
                        ) : recentActivity && recentActivity.length > 0 ? (
                          <div className="space-y-3 max-h-64 overflow-y-auto">
                            {recentActivity.slice(0, 6).map((activity) => (
                              <div 
                                key={`${activity.type}-${activity.id}`}
                                className="flex items-start gap-3 p-4 glass-morphism hover:bg-white/10 rounded-lg cursor-pointer transition-all duration-200 group border border-white/5 hover:border-white/10"
                                onClick={() => navigate(`/knowledge/article/${activity.article_id}`)}
                              >
                                <div className="flex-shrink-0">
                                  {activity.avatar_url ? (
                                    <img 
                                      src={activity.avatar_url} 
                                      alt={activity.user_name}
                                      className="h-8 w-8 rounded-full object-cover border border-white/10"
                                    />
                                  ) : (
                                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center border border-white/10">
                                      <span className="text-xs font-medium text-primary">
                                        {activity.user_name?.charAt(0) || '?'}
                                      </span>
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm font-semibold text-foreground">
                                      {activity.user_name}
                                    </span>
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                      {activity.type === 'comment' && (
                                        <>
                                          <MessageSquare className="h-3 w-3 text-blue-400" />
                                          <span>commented on</span>
                                        </>
                                      )}
                                      {activity.type === 'vote' && (
                                        <>
                                          <Heart className={`h-3 w-3 ${activity.vote_type === 'upvote' ? 'text-green-400' : 'text-red-400'}`} />
                                          <span>{activity.vote_type === 'upvote' ? 'upvoted' : 'downvoted'}</span>
                                        </>
                                      )}
                                      {activity.type === 'article' && (
                                        <>
                                          <FileText className="h-3 w-3 text-primary" />
                                          <span>published</span>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                  <p className="text-sm font-medium text-primary truncate group-hover:text-primary/80 transition-colors mb-1">
                                    {activity.article_title}
                                  </p>
                                  {activity.type === 'comment' && activity.content && (
                                    <p className="text-xs text-muted-foreground bg-white/5 rounded p-2 mb-2 italic">
                                      "{activity.content}"
                                    </p>
                                  )}
                                  <p className="text-xs text-muted-foreground">
                                    {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                                  </p>
                                </div>
                                <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-6">
                            <Activity className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">No recent activity</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Start creating content to see activity here
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </>
              )}
            </TabsContent>

            {/* My Posts Tab */}
            <TabsContent value="my-posts" className="space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <h2 className="text-lg sm:text-xl font-semibold text-foreground">
                  My Posts ({stats?.totalArticles || 0})
                </h2>
                <Button 
                  onClick={() => navigate('/knowledge/create')}
                  className="glass-morphism border-0 bg-primary/20 hover:bg-primary/30 text-primary-foreground backdrop-blur-md self-start sm:self-auto"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Create New Post</span>
                  <span className="sm:hidden">New Post</span>
                </Button>
              </div>

              {statsLoading ? (
                <div className="space-y-3 sm:space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-32 sm:h-48 glass-morphism" />
                  ))}
                </div>
              ) : ((stats && Array.isArray(stats.articles) ? stats.articles.length : 0) > 0) ? (
                <div className="space-y-3 sm:space-y-4">
                  {(stats?.articles || []).map((article) => (
                    <Card 
                      key={article.id} 
                      className="glass-morphism border-0 bg-card/30 backdrop-blur-md hover:bg-card/40 transition-all duration-300 cursor-pointer group" 
                      onClick={() => navigate(`/knowledge/article/${article.id}`)}
                    >
                      <CardHeader className="px-4 sm:px-6 py-4">
                        <CardTitle className="text-base sm:text-xl text-foreground group-hover:text-primary transition-colors line-clamp-2">
                          {article.title}
                        </CardTitle>
                        <div className="flex flex-wrap gap-1 sm:gap-2 mt-2">
                          {article.tags?.slice(0, 3).map(t => (
                            <Badge 
                              key={t} 
                              variant="secondary"
                              className="bg-primary text-black border-0 shadow-sm font-medium text-xs"
                            >
                              <TagIcon className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
                              {t}
                            </Badge>
                          ))}
                          {(article.tags?.length || 0) > 3 && (
                            <Badge variant="outline" className="text-xs border-primary text-primary bg-primary/10">
                              +{(article.tags?.length || 0) - 3} more
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      
                      <CardContent className="px-4 sm:px-6 pb-2">
                        <p className="text-muted-foreground line-clamp-2 text-sm sm:text-base">
                          {article.content?.replace(/<[^>]*>?/gm, '').substring(0, 120)}...
                        </p>
                      </CardContent>
                      
                      <CardFooter className="px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row sm:justify-between gap-3 text-xs sm:text-sm text-muted-foreground">
                        <div className="flex items-center gap-3 sm:gap-6">
                          <div className="flex items-center gap-1">
                            <ThumbsUp className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span>{article.vote_count || 0}</span>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span>0</span>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span>{article.view_count || 0}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span className="text-xs">{formatDistanceToNow(new Date(article.created_at), { addSuffix: true })}</span>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="glass-morphism border-0 bg-card/30 backdrop-blur-md p-6 sm:p-8 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <BookOpen className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mb-4" />
                    <h3 className="text-base sm:text-lg font-medium mb-2 text-foreground">No posts yet</h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto text-sm sm:text-base">
                      Start sharing your knowledge by creating your first post!
                    </p>
                    <Button 
                      onClick={() => navigate('/knowledge/create')}
                      className="glass-morphism border-0 bg-primary/20 hover:bg-primary/30 text-primary-foreground backdrop-blur-md"
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Create Your First Post
                    </Button>
                  </div>
                </Card>
              )}
            </TabsContent>

            {/* Saved Articles Tab */}
            <TabsContent value="saved" className="space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <h2 className="text-lg sm:text-xl font-semibold text-foreground">
                  Saved Articles ({savedArticles?.length || 0})
                </h2>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/knowledge')}
                  className="glass-morphism border border-primary/30 bg-transparent hover:bg-primary/10 text-primary backdrop-blur-md self-start sm:self-auto"
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Browse Knowledge Base</span>
                  <span className="sm:hidden">Browse</span>
                </Button>
              </div>

              {savedLoading ? (
                <div className="space-y-3 sm:space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-32 sm:h-48 glass-morphism" />
                  ))}
                </div>
              ) : (savedArticles?.length || 0) > 0 ? (
                <div className="space-y-3 sm:space-y-4">
                  {savedArticles?.map((article) => (
                    <Card 
                      key={article.id} 
                      className="glass-morphism border-0 bg-card/30 backdrop-blur-md hover:bg-card/40 transition-all duration-300 cursor-pointer group" 
                      onClick={() => navigate(`/knowledge/article/${article.id}`)}
                    >
                      <CardHeader className="px-4 sm:px-6 py-4 relative">
                        <div className="absolute top-4 right-4">
                          <Bookmark className="h-4 w-4 text-primary fill-current" />
                        </div>
                        <CardTitle className="text-base sm:text-xl text-foreground group-hover:text-primary transition-colors line-clamp-2 pr-8">
                          {article.title}
                        </CardTitle>
                        <div className="flex flex-wrap gap-1 sm:gap-2 mt-2">
                          {article.tags?.slice(0, 3).map(t => (
                            <Badge 
                              key={t} 
                              variant="secondary"
                              className="bg-primary text-black border-0 shadow-sm font-medium text-xs"
                            >
                              <TagIcon className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
                              {t}
                            </Badge>
                          ))}
                          {(article.tags?.length || 0) > 3 && (
                            <Badge variant="outline" className="text-xs border-primary text-primary bg-primary/10">
                              +{(article.tags?.length || 0) - 3} more
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      
                      <CardContent className="px-4 sm:px-6 pb-2">
                        <p className="text-muted-foreground line-clamp-2 text-sm sm:text-base">
                          {article.content?.replace(/<[^>]*>?/gm, '').substring(0, 120)}...
                        </p>
                      </CardContent>
                      
                      <CardFooter className="px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row sm:justify-between gap-3 text-xs sm:text-sm text-muted-foreground">
                        <div className="flex items-center gap-3 sm:gap-6">
                          <div className="flex items-center gap-1">
                            <ThumbsUp className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span>{article.vote_count || 0}</span>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span>0</span>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span>{article.view_count || 0}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span className="text-xs">{formatDistanceToNow(new Date(article.created_at), { addSuffix: true })}</span>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="glass-morphism border-0 bg-card/30 backdrop-blur-md p-6 sm:p-8 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <Bookmark className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mb-4" />
                    <h3 className="text-base sm:text-lg font-medium mb-2 text-foreground">No saved articles</h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto text-sm sm:text-base">
                      Save articles you find interesting to read them later!
                    </p>
                    <Button 
                      onClick={() => navigate('/knowledge')}
                      className="glass-morphism border-0 bg-primary/20 hover:bg-primary/30 text-primary-foreground backdrop-blur-md"
                    >
                      <BookOpen className="mr-2 h-4 w-4" />
                      Browse Knowledge Base
                    </Button>
                  </div>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default UserKnowledgeResource;
