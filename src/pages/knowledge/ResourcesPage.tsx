
import React, { useState } from 'react';
import { Shell } from '@/components/layout/Shell';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/contexts/UserContext';
import { useKnowledgeResources } from '@/hooks/knowledge/useKnowledgeResources';
import { Loader2, BookOpen, MessageSquare, BarChart2, Bookmark } from 'lucide-react';

const ResourcesPage = () => {
  const { currentUser } = useUser();
  const [activeTab, setActiveTab] = useState<string>("overview");
  const { 
    userStats, 
    contributions, 
    comments, 
    savedArticles,
    isLoading 
  } = useKnowledgeResources(currentUser?.id);

  if (!currentUser) {
    return (
      <Shell>
        <div className="container mx-auto px-4 py-10">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center">You need to be logged in to view your resources.</p>
            </CardContent>
          </Card>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Knowledge Resources</h1>
            <p className="text-muted-foreground">
              View your knowledge base contributions and saved articles
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-8">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="contributions">My Contributions</TabsTrigger>
                <TabsTrigger value="comments">My Comments</TabsTrigger>
                <TabsTrigger value="saved">Saved Articles</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatsCard 
                    title="Articles" 
                    value={userStats?.articles || 0} 
                    icon={<BookOpen className="h-5 w-5" />} 
                  />
                  <StatsCard 
                    title="Questions" 
                    value={userStats?.questions || 0} 
                    icon={<MessageSquare className="h-5 w-5" />} 
                  />
                  <StatsCard 
                    title="Polls" 
                    value={userStats?.polls || 0} 
                    icon={<BarChart2 className="h-5 w-5" />} 
                  />
                  <StatsCard 
                    title="Comments" 
                    value={userStats?.comments || 0} 
                    icon={<MessageSquare className="h-5 w-5" />} 
                  />
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Your recent contributions and interactions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {contributions.length > 0 || comments.length > 0 ? (
                      <ActivityFeed contributions={contributions.slice(0, 5)} comments={comments.slice(0, 5)} />
                    ) : (
                      <p className="text-muted-foreground">No recent activity.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="contributions">
                <Card>
                  <CardHeader>
                    <CardTitle>My Contributions</CardTitle>
                    <CardDescription>Articles, questions, and polls you've created</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {contributions.length > 0 ? (
                      <ContributionsList items={contributions} />
                    ) : (
                      <p className="text-muted-foreground">You haven't created any content yet.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="comments">
                <Card>
                  <CardHeader>
                    <CardTitle>My Comments</CardTitle>
                    <CardDescription>Comments you've made on knowledge base content</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {comments.length > 0 ? (
                      <CommentsList items={comments} />
                    ) : (
                      <p className="text-muted-foreground">You haven't commented on any content yet.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="saved">
                <Card>
                  <CardHeader>
                    <CardTitle>Saved Articles</CardTitle>
                    <CardDescription>Content you've bookmarked for later</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {savedArticles.length > 0 ? (
                      <SavedArticlesList items={savedArticles} />
                    ) : (
                      <p className="text-muted-foreground">You haven't saved any content yet.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </Shell>
  );
};

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-sm">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
          </div>
          <div className="p-2 bg-primary/10 rounded-full text-primary">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface ActivityItemProps {
  type: 'contribution' | 'comment';
  title: string;
  date: string;
  contentType?: string;
  articleId: string;
}

const ActivityFeed: React.FC<{
  contributions: any[];
  comments: any[];
}> = ({ contributions, comments }) => {
  // Combine and sort contributions and comments by date
  const combinedActivity = [
    ...contributions.map(c => ({
      type: 'contribution' as const,
      title: c.title,
      date: c.created_at,
      contentType: c.content_type,
      articleId: c.id
    })),
    ...comments.map(c => ({
      type: 'comment' as const,
      title: c.article?.title || 'Unknown article',
      date: c.created_at,
      articleId: c.article_id
    }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-4">
      {combinedActivity.length > 0 ? (
        combinedActivity.slice(0, 10).map((item, index) => (
          <ActivityItem key={index} {...item} />
        ))
      ) : (
        <p className="text-muted-foreground">No recent activity.</p>
      )}
    </div>
  );
};

const ActivityItem: React.FC<ActivityItemProps> = ({ type, title, date, contentType, articleId }) => {
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="flex gap-4 py-2 border-b last:border-0">
      <div className="p-2 bg-primary/10 rounded-full text-primary h-fit">
        {type === 'contribution' ? <BookOpen className="h-4 w-4" /> : <MessageSquare className="h-4 w-4" />}
      </div>
      <div>
        <p className="font-medium">
          {type === 'contribution' 
            ? `Created a new ${contentType?.toLowerCase() || 'post'}: ${title}` 
            : `Commented on: ${title}`}
        </p>
        <p className="text-sm text-muted-foreground">{formattedDate}</p>
      </div>
    </div>
  );
};

const ContributionsList: React.FC<{items: any[]}> = ({ items }) => {
  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={index} className="flex justify-between border-b pb-2 last:border-0">
          <div>
            <p className="font-medium">{item.title}</p>
            <p className="text-sm text-muted-foreground">
              {item.content_type} • {new Date(item.created_at).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <div className="flex items-center"><MessageSquare className="h-3 w-3 mr-1" /> {item.comment_count || 0}</div>
            <div className="text-muted-foreground">{item.view_count || 0} views</div>
          </div>
        </div>
      ))}
    </div>
  );
};

const CommentsList: React.FC<{items: any[]}> = ({ items }) => {
  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={index} className="border-b pb-2 last:border-0">
          <p className="font-medium">{item.article?.title || 'Unknown article'}</p>
          <p className="py-1">{item.content}</p>
          <p className="text-sm text-muted-foreground">{new Date(item.created_at).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
};

const SavedArticlesList: React.FC<{items: any[]}> = ({ items }) => {
  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={index} className="flex justify-between border-b pb-2 last:border-0">
          <div>
            <p className="font-medium">{item.title}</p>
            <p className="text-sm text-muted-foreground">
              {item.content_type} • Saved on {new Date(item.saved_at).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-muted-foreground">{item.view_count || 0} views</div>
            <Bookmark className="h-4 w-4 text-primary" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ResourcesPage;
