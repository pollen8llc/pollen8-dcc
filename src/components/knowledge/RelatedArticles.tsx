
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { KnowledgeArticle } from '@/models/knowledgeTypes';
import { formatDistanceToNow } from 'date-fns';

interface RelatedArticlesProps {
  articles?: KnowledgeArticle[];
  isLoading: boolean;
}

export const RelatedArticles: React.FC<RelatedArticlesProps> = ({ 
  articles = [], 
  isLoading 
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-3">Related Content</h3>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-1"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (articles.length === 0) {
    return null;
  }
  
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-medium mb-3">Related Content</h3>
        <div className="space-y-4">
          {articles.map(article => (
            <Link 
              key={article.id} 
              to={`/knowledge/${article.id}`}
              className="block hover:underline text-sm"
            >
              {article.title}
              <div className="text-xs text-muted-foreground mt-1">
                {article.comment_count || 0} comments • 
                {formatDistanceToNow(new Date(article.created_at), { addSuffix: true })}
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
