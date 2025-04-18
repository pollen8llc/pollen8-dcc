
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useKnowledgeArticles } from '@/hooks/knowledge/useKnowledgeArticles';
import ArticleCard from '../knowledge/ArticleCard';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

const KnowledgeBaseDebugger = () => {
  const [communityId, setCommunityId] = useState("7");
  const { articles, isLoading, error } = useKnowledgeArticles(communityId);
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Knowledge Base State</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Community ID</label>
              <div className="flex gap-2">
                <Input 
                  value={communityId}
                  onChange={(e) => setCommunityId(e.target.value)}
                  placeholder="Enter community ID"
                />
                <Button onClick={() => setCommunityId("7")}>Reset</Button>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Current State:</h3>
              <pre className="bg-muted p-4 rounded-md text-sm overflow-auto">
                {JSON.stringify({
                  isLoading,
                  hasError: !!error,
                  articlesCount: articles?.length || 0,
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
