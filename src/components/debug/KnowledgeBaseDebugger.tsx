
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useKnowledgeArticles } from '@/hooks/knowledge/useKnowledgeArticles';
import ArticleCard from '../knowledge/ArticleCard';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useUser } from '@/contexts/UserContext';

const KnowledgeBaseDebugger = () => {
  const [communityId, setCommunityId] = useState<string | undefined>(undefined);
  const { articles, isLoading, error } = useKnowledgeArticles(communityId);
  const { currentUser } = useUser();
  
  const handleClear = () => {
    setCommunityId(undefined);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Knowledge Base State</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Community ID (Optional)</label>
              <div className="flex gap-2">
                <Input 
                  value={communityId || ''}
                  onChange={(e) => setCommunityId(e.target.value || undefined)}
                  placeholder="Enter community ID (leave empty for all articles)"
                />
                <Button onClick={handleClear}>Clear</Button>
              </div>
              {currentUser && (
                <div className="mt-2">
                  <p className="text-sm text-muted-foreground">Your communities: {currentUser.communities?.join(', ') || 'None'}</p>
                </div>
              )}
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Current State:</h3>
              <pre className="bg-muted p-4 rounded-md text-sm overflow-auto">
                {JSON.stringify({
                  isLoading,
                  hasError: !!error,
                  articlesCount: articles?.length || 0,
                  communityFilter: communityId || 'none',
                  error: error?.message
                }, null, 2)}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Article Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            {isLoading ? (
              <p>Loading articles...</p>
            ) : error ? (
              <p className="text-red-500">Error: {error.message}</p>
            ) : articles && articles.length > 0 ? (
              <div className="space-y-4">
                {articles.map(article => (
                  <ArticleCard 
                    key={article.id}
                    article={article}
                    onArticleClick={() => console.log('Article clicked:', article.id)}
                  />
                ))}
              </div>
            ) : (
              <p>No articles found</p>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default KnowledgeBaseDebugger;
