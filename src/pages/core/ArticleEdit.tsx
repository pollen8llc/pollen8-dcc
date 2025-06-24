
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Shell } from '@/components/layout/Shell';
import { useKnowledgeBase } from '@/hooks/useKnowledgeBase';
import { useUser } from '@/contexts/UserContext';
import { usePermissions } from '@/hooks/usePermissions';
import ArticleForm from '@/components/core/ArticleForm';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

const ArticleEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const { isOrganizer, isAdmin } = usePermissions(currentUser);
  const { useArticle } = useKnowledgeBase();
  
  // Fetch the article
  const { data: article, isLoading, error } = useArticle(id);
  
  // Check if user can edit - only author, organizers, or admins
  const canEdit = currentUser && article && (
    currentUser.id === article.user_id || isAdmin || isOrganizer()
  );
  
  // Handle loading state
  if (isLoading) {
    return (
      <Shell>
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold tracking-tight mb-8">Edit Article</h1>
          <div className="animate-pulse">
            <div className="h-10 bg-muted rounded w-1/2 mb-4"></div>
            <div className="h-40 bg-muted rounded mb-4"></div>
            <div className="h-10 bg-muted rounded w-1/3"></div>
          </div>
        </div>
      </Shell>
    );
  }
  
  // Handle error state
  if (error || !article) {
    return (
      <Shell>
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold tracking-tight mb-8">Edit Article</h1>
          <div className="text-center">
            <p className="text-red-500">Error loading article. The article might have been deleted or you don't have permission to edit it.</p>
            <Button 
              className="mt-4"
              onClick={() => navigate('/knowledge')}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Knowledge Base
            </Button>
          </div>
        </div>
      </Shell>
    );
  }
  
  // Handle permission denied
  if (!canEdit) {
    return (
      <Shell>
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold tracking-tight mb-8">Edit Article</h1>
          <div className="text-center">
            <p className="text-red-500">You don't have permission to edit this article. Only the author or organizers can edit articles.</p>
            <Button 
              className="mt-4"
              onClick={() => navigate(`/knowledge/article/${id}`)}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              View Article
            </Button>
          </div>
        </div>
      </Shell>
    );
  }
  
  return (
    <Shell>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold tracking-tight mb-8">Edit Article</h1>
        
        <ArticleForm article={article} mode="edit" />
      </div>
    </Shell>
  );
};

export default ArticleEdit;
