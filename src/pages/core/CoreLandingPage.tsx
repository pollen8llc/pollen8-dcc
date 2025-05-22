import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shell } from '@/components/layout/Shell';
import { Button } from '@/components/ui/button';
import { PlusCircle, RefreshCcw, AlertCircle } from 'lucide-react';
import { ArticleCard } from '@/components/knowledge/ArticleCard';
import { useKnowledgeBase } from '@/hooks/useKnowledgeBase';
import { Skeleton } from '@/components/ui/skeleton';

const CoreLandingPage = () => {
  const navigate = useNavigate();
  const { useArticles } = useKnowledgeBase();
  
  // Get the articles using the hook
  const { articles, isLoading, error } = useArticles();
  
  return (
    <Shell>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Knowledge Base</h1>
            <p className="text-muted-foreground">Browse and share knowledge with the community</p>
          </div>
          
          <Button onClick={() => navigate("/core/create")} className="shrink-0">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Article
          </Button>
        </div>
        
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-[200px] w-full rounded-lg" />
            ))}
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-2" />
            <h3 className="text-lg font-medium mb-1">Failed to load articles</h3>
            <p className="text-muted-foreground">{error.message}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              <RefreshCcw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </div>
        ) : articles && articles.length > 0 ? (
          <div className="space-y-4">
            {articles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                onClick={() => navigate(`/core/articles/${article.id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-muted/50 rounded-lg">
            <h3 className="font-medium text-xl mb-2">No articles found</h3>
            <p className="text-muted-foreground mb-6">
              Get started by creating your first article
            </p>
            <Button onClick={() => navigate("/core/create")}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New Article
            </Button>
          </div>
        )}
      </div>
    </Shell>
  );
};

export default CoreLandingPage;
