
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/hooks/useAuth';
import { useUserKnowledgeStats } from '@/hooks/knowledge/useUserKnowledgeStats';
import { useSavedArticles } from '@/hooks/knowledge/useSavedArticles';
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
  Tag as TagIcon
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
  const { currentUser } = useAuth();
  const { data: stats, isLoading: statsLoading } = useUserKnowledgeStats();
  const { savedArticles, isLoading: savedLoading } = useSavedArticles();

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4 text-white">Please log in to view your knowledge resources</h1>
            <Button onClick={() => navigate('/auth')}>Log In</Button>
          </div>
        </div>
      </div>
    );
  }

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
      
      <div className="container mx-auto px-4 py-4 sm:py-8 max-w-full">
        {/* Add Knowledge Navigation */}
        <div className="mb-6">
          <KnowledgeNavigation />
        </div>
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">My Knowledge Resources</h1>
            <p className="text-white mt-1">
              Track your contributions and manage your saved content
            </p>
          </div>
          <div className="flex mt-4 md:mt-0 gap-2">
            <Button onClick={() => navigate('/knowledge/create')}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New Post
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="overview" className="text-white">Overview</TabsTrigger>
            <TabsTrigger value="my-posts" className="text-white">My Posts</TabsTrigger>
            <TabsTrigger value="saved" className="text-white">Saved Articles</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {statsLoading ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-32" />
                ))}
              </div>
            ) : (
              <>
                {/* Stats Cards - use MetricCard */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <MetricCard
                    title="Total Posts"
                    value={stats?.totalArticles || 0}
                    description={stats?.recentArticlesCount ? `${stats?.recentArticlesCount} in last 30 days` : undefined}
                    icon={<BookOpen className="h-5 w-5 text-[#00eada]" />}
                    color="default"
                    isLoading={statsLoading}
                  />
                  <MetricCard
                    title="Total Views"
                    value={stats?.totalViews || 0}
                    description={stats?.averageViewsPerArticle ? `${stats?.averageViewsPerArticle} avg per post` : undefined}
                    icon={<Eye className="h-5 w-5 text-green-500" />}
                    color="success"
                    isLoading={statsLoading}
                  />
                  <MetricCard
                    title="Total Votes"
                    value={stats?.totalVotes || 0}
                    description={stats?.averageVotesPerArticle ? `${stats?.averageVotesPerArticle} avg per post` : undefined}
                    icon={<ThumbsUp className="h-5 w-5 text-amber-500" />}
                    color="warning"
                    isLoading={statsLoading}
                  />
                  <MetricCard
                    title="Total Comments"
                    value={stats?.totalComments || 0}
                    description="Engagement received"
                    icon={<MessageSquare className="h-5 w-5 text-red-500" />}
                    color="danger"
                    isLoading={statsLoading}
                  />
                </div>

                {/* Content Type Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <BarChart3 className="h-5 w-5" />
                      Content Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(stats?.contentTypeStats || {}).map(([type, count]) => (
                        <Badge key={type} variant="teal">
                          {type.toLowerCase()}: {count}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <TrendingUp className="h-5 w-5" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {stats?.articles?.slice(0, 3).map((article) => (
                        <div 
                          key={article.id} 
                          className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-muted/20 transition-colors"
                          onClick={() => navigate(`/knowledge/article/${article.id}`)}
                        >
                          <div>
                            <h4 className="font-medium text-white">{article.title}</h4>
                            <p className="text-sm text-white">
                              {formatDistanceToNow(new Date(article.created_at), { addSuffix: true })}
                            </p>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-white">
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {article.view_count || 0}
                            </span>
                            <span className="flex items-center gap-1">
                              <ThumbsUp className="h-3 w-3" />
                              {article.vote_count}
                            </span>
                          </div>
                        </div>
                      ))}
                      {(stats?.articles?.length || 0) === 0 && (
                        <p className="text-center text-white py-4">
                          No posts yet. Create your first post to get started!
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          {/* My Posts Tab */}
          <TabsContent value="my-posts" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">My Posts ({stats?.totalArticles || 0})</h2>
              <Button onClick={() => navigate('/knowledge/create')}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create New Post
              </Button>
            </div>

            {statsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-48" />
                ))}
              </div>
            ) : ((stats && Array.isArray(stats.articles) ? stats.articles.length : 0) > 0) ? (
              <div className="space-y-4">
                {(stats?.articles || []).map((article) => (
                  <Card key={article.id} className="transition-shadow hover:shadow-md cursor-pointer" onClick={() => navigate(`/knowledge/article/${article.id}`)}>
                    <CardHeader>
                      <CardTitle className="text-xl hover:text-royal-blue-600 dark:hover:text-royal-blue-400 transition-colors">
                        {article.title}
                      </CardTitle>
                      <div className="flex flex-wrap gap-2">
                        {article.tags?.map(t => (
                          <Badge 
                            key={t} 
                            variant="outline"
                          >
                            <TagIcon className="h-3 w-3 mr-1" />
                            {t}
                          </Badge>
                        ))}
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <p className="text-muted-foreground line-clamp-2">
                        {article.content?.replace(/<[^>]*>?/gm, '').substring(0, 150)}...
                      </p>
                    </CardContent>
                    
                    <CardFooter className="flex justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-6">
                        <div className="flex items-center">
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          <span>{article.vote_count || 0}</span>
                        </div>
                        
                        <div className="flex items-center">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          <span>0</span>
                        </div>
                        
                        <div className="flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          <span>{article.view_count}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{formatDistanceToNow(new Date(article.created_at), { addSuffix: true })}</span>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <div className="flex flex-col items-center justify-center">
                  <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2 text-white">No posts yet</h3>
                  <p className="text-white mb-6 max-w-md mx-auto">
                    Start sharing your knowledge by creating your first post!
                  </p>
                  <Button onClick={() => navigate('/knowledge/create')}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Your First Post
                  </Button>
                </div>
              </Card>
            )}
          </TabsContent>

          {/* Saved Articles Tab */}
          <TabsContent value="saved" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">Saved Articles ({savedArticles?.length || 0})</h2>
              <Button variant="outline" onClick={() => navigate('/knowledge')}>
                <BookOpen className="mr-2 h-4 w-4" />
                Browse Knowledge Base
              </Button>
            </div>

            {savedLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-48" />
                ))}
              </div>
            ) : (savedArticles?.length || 0) > 0 ? (
              <div className="space-y-4">
                {savedArticles?.map((article) => (
                  <Card key={article.id} className="transition-shadow hover:shadow-md cursor-pointer" onClick={() => navigate(`/knowledge/article/${article.id}`)}>
                    <CardHeader>
                      <CardTitle className="text-xl hover:text-royal-blue-600 dark:hover:text-royal-blue-400 transition-colors">
                        {article.title}
                      </CardTitle>
                      <div className="flex flex-wrap gap-2">
                        {article.tags?.map(t => (
                          <Badge 
                            key={t} 
                            variant="outline"
                          >
                            <TagIcon className="h-3 w-3 mr-1" />
                            {t}
                          </Badge>
                        ))}
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <p className="text-muted-foreground line-clamp-2">
                        {article.content?.replace(/<[^>]*>?/gm, '').substring(0, 150)}...
                      </p>
                    </CardContent>
                    
                    <CardFooter className="flex justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-6">
                        <div className="flex items-center">
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          <span>{article.vote_count || 0}</span>
                        </div>
                        
                        <div className="flex items-center">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          <span>0</span>
                        </div>
                        
                        <div className="flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          <span>{article.view_count}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{formatDistanceToNow(new Date(article.created_at), { addSuffix: true })}</span>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <div className="flex flex-col items-center justify-center">
                  <Bookmark className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2 text-white">No saved articles</h3>
                  <p className="text-white mb-6 max-w-md mx-auto">
                    Save articles you find interesting to read them later!
                  </p>
                  <Button onClick={() => navigate('/knowledge')}>
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
