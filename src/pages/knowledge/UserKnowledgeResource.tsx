import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shell } from '@/components/layout/Shell';
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
  PlusCircle
} from 'lucide-react';

// UI Components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { MetricCard } from '@/components/rel8t/MetricCard';
import { Rel8TNavigation } from '@/components/rel8t/Rel8TNavigation';

const UserKnowledgeResource = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { data: stats, isLoading: statsLoading } = useUserKnowledgeStats();
  const { savedArticles, isLoading: savedLoading } = useSavedArticles();

  if (!currentUser) {
    return (
      <Shell>
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Please log in to view your knowledge resources</h1>
            <Button onClick={() => navigate('/auth')}>Log In</Button>
          </div>
        </div>
      </Shell>
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
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Shell>
      <div className="container mx-auto px-4 py-8">
        <Rel8TNavigation />
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 mt-6">
          <div>
            <h1 className="text-3xl font-bold">My Knowledge Resources</h1>
            <p className="text-muted-foreground mt-1">
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
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="my-posts">My Posts</TabsTrigger>
            <TabsTrigger value="saved">Saved Articles</TabsTrigger>
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
                    icon={<BookOpen className="h-5 w-5" />}
                    color="default"
                    isLoading={statsLoading}
                  />
                  <MetricCard
                    title="Total Views"
                    value={stats?.totalViews || 0}
                    description={stats?.averageViewsPerArticle ? `${stats?.averageViewsPerArticle} avg per post` : undefined}
                    icon={<Eye className="h-5 w-5" />}
                    color="success"
                    isLoading={statsLoading}
                  />
                  <MetricCard
                    title="Total Votes"
                    value={stats?.totalVotes || 0}
                    description={stats?.averageVotesPerArticle ? `${stats?.averageVotesPerArticle} avg per post` : undefined}
                    icon={<ThumbsUp className="h-5 w-5" />}
                    color="success"
                    isLoading={statsLoading}
                  />
                  <MetricCard
                    title="Total Comments"
                    value={stats?.totalComments || 0}
                    description="Engagement received"
                    icon={<MessageSquare className="h-5 w-5" />}
                    color="default"
                    isLoading={statsLoading}
                  />
                </div>

                {/* Content Type Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
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
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {stats?.articles?.slice(0, 3).map((article) => (
                        <div key={article.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <h4 className="font-medium">{article.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {formatDistanceToNow(new Date(article.created_at), { addSuffix: true })}
                            </p>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
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
                        <p className="text-center text-muted-foreground py-4">
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
              <h2 className="text-xl font-semibold">My Posts ({stats?.totalArticles || 0})</h2>
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
                  <ArticleCard
                    key={article.id}
                    article={{
                      ...article,
                      author: {
                        id: currentUser.id,
                        name: currentUser.email || 'Unknown User',
                        avatar_url: undefined
                      }
                    } as KnowledgeArticle}
                    onClick={() => navigate(`/knowledge/${article.id}`)}
                  />
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <div className="flex flex-col items-center justify-center">
                  <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No posts yet</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
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
              <h2 className="text-xl font-semibold">Saved Articles ({savedArticles?.length || 0})</h2>
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
                  <ArticleCard
                    key={article.id}
                    article={{
                      ...article,
                      author: {
                        id: article.author?.id || article.user_id,
                        name: article.author?.name || 'Unknown User',
                        avatar_url: article.author?.avatar_url
                      }
                    } as KnowledgeArticle}
                    onClick={() => navigate(`/knowledge/${article.id}`)}
                  />
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <div className="flex flex-col items-center justify-center">
                  <Bookmark className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No saved articles</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
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
    </Shell>
  );
};

export default UserKnowledgeResource;
