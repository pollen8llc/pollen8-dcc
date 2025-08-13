
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
  const { data: stats, isLoading: statsLoading } = useUserKnowledgeStats();
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

        <Tabs defaultValue="overview" className="space-y-4 sm:space-y-6">
          <TabsList className="glass-morphism border-0 bg-card/30 backdrop-blur-md w-full justify-start overflow-x-auto">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary-foreground text-muted-foreground px-3 sm:px-6 py-2 flex-shrink-0"
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger 
              value="my-posts" 
              className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary-foreground text-muted-foreground px-3 sm:px-6 py-2 flex-shrink-0"
            >
              <FileText className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">My Posts</span>
            </TabsTrigger>
            <TabsTrigger 
              value="saved" 
              className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary-foreground text-muted-foreground px-3 sm:px-6 py-2 flex-shrink-0"
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
                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
                  <Card className="glass-morphism border-0 bg-card/30 backdrop-blur-md hover:bg-card/40 transition-all duration-300">
                    <CardHeader className="pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
                      <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center gap-1 sm:gap-2">
                        <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                        <span className="hidden sm:inline">Total Posts</span>
                        <span className="sm:hidden">Posts</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
                      <div className="text-xl sm:text-2xl font-bold text-foreground">{stats?.totalArticles || 0}</div>
                      {stats?.recentArticlesCount && (
                        <p className="text-xs text-muted-foreground">{stats?.recentArticlesCount} recent</p>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="glass-morphism border-0 bg-card/30 backdrop-blur-md hover:bg-card/40 transition-all duration-300">
                    <CardHeader className="pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
                      <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center gap-1 sm:gap-2">
                        <Eye className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                        <span className="hidden sm:inline">Total Views</span>
                        <span className="sm:hidden">Views</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
                      <div className="text-xl sm:text-2xl font-bold text-foreground">{stats?.totalViews || 0}</div>
                      {stats?.averageViewsPerArticle && (
                        <p className="text-xs text-muted-foreground">{stats?.averageViewsPerArticle} avg</p>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="glass-morphism border-0 bg-card/30 backdrop-blur-md hover:bg-card/40 transition-all duration-300">
                    <CardHeader className="pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
                      <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center gap-1 sm:gap-2">
                        <ThumbsUp className="h-3 w-3 sm:h-4 sm:w-4 text-amber-500" />
                        <span className="hidden sm:inline">Total Votes</span>
                        <span className="sm:hidden">Votes</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
                      <div className="text-xl sm:text-2xl font-bold text-foreground">{stats?.totalVotes || 0}</div>
                      {stats?.averageVotesPerArticle && (
                        <p className="text-xs text-muted-foreground">{stats?.averageVotesPerArticle} avg</p>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="glass-morphism border-0 bg-card/30 backdrop-blur-md hover:bg-card/40 transition-all duration-300">
                    <CardHeader className="pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
                      <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center gap-1 sm:gap-2">
                        <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
                        <span className="hidden sm:inline">Comments</span>
                        <span className="sm:hidden">Comments</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
                      <div className="text-xl sm:text-2xl font-bold text-foreground">{stats?.totalComments || 0}</div>
                      <p className="text-xs text-muted-foreground">Received</p>
                    </CardContent>
                  </Card>
                </div>

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
                            className="glass-morphism border-0 bg-primary/20 text-primary-foreground backdrop-blur-sm"
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
                              className="flex items-start gap-3 p-3 glass-morphism hover:bg-white/10 rounded-lg cursor-pointer transition-all duration-200 group"
                              onClick={() => navigate(`/knowledge/article/${activity.article_id}`)}
                            >
                              <div className="flex-shrink-0 mt-0.5">
                                {activity.type === 'comment' && (
                                  <MessageSquare className="h-4 w-4 text-blue-400" />
                                )}
                                {activity.type === 'vote' && (
                                  <Heart className={`h-4 w-4 ${activity.vote_type === 'upvote' ? 'text-green-400' : 'text-red-400'}`} />
                                )}
                                {activity.type === 'article' && (
                                  <FileText className="h-4 w-4 text-primary" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-sm font-medium text-foreground truncate">
                                    {activity.user_name}
                                  </span>
                                  {activity.type === 'comment' && (
                                    <span className="text-xs text-muted-foreground">commented on</span>
                                  )}
                                  {activity.type === 'vote' && (
                                    <span className="text-xs text-muted-foreground">
                                      {activity.vote_type === 'upvote' ? 'upvoted' : 'downvoted'}
                                    </span>
                                  )}
                                  {activity.type === 'article' && (
                                    <span className="text-xs text-muted-foreground">published</span>
                                  )}
                                </div>
                                <p className="text-xs sm:text-sm font-medium text-primary truncate group-hover:text-primary/80 transition-colors">
                                  {activity.article_title}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
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
                            className="glass-morphism border-0 bg-primary/20 text-primary-foreground backdrop-blur-sm text-xs"
                          >
                            <TagIcon className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
                            {t}
                          </Badge>
                        ))}
                        {(article.tags?.length || 0) > 3 && (
                          <Badge variant="outline" className="text-xs">
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
                            className="glass-morphism border-0 bg-primary/20 text-primary-foreground backdrop-blur-sm text-xs"
                          >
                            <TagIcon className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
                            {t}
                          </Badge>
                        ))}
                        {(article.tags?.length || 0) > 3 && (
                          <Badge variant="outline" className="text-xs">
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
  );
};

export default UserKnowledgeResource;
