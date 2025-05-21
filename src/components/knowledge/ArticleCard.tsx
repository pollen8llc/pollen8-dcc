
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { 
  MessageSquare, 
  ThumbsUp, 
  Eye, 
  Calendar, 
  Tag as TagIcon,
  BookOpen, 
  MessageSquare as QuestionIcon,
  BarChart2 as PollIcon,
  Quote as QuoteIcon
} from 'lucide-react';

// UI Components
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Types
import { KnowledgeArticle, ContentType } from '@/models/knowledgeTypes';
import { cn } from '@/lib/utils';

interface ArticleCardProps {
  article: KnowledgeArticle;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  const navigate = useNavigate();
  
  // Get the icon based on content type
  const getContentTypeIcon = () => {
    switch (article.content_type) {
      case ContentType.QUESTION:
        return <QuestionIcon className="h-4 w-4 text-royal-blue-500" />;
      case ContentType.ARTICLE:
        return <BookOpen className="h-4 w-4 text-emerald-500" />;
      case ContentType.QUOTE:
        return <QuoteIcon className="h-4 w-4 text-amber-500" />;
      case ContentType.POLL:
        return <PollIcon className="h-4 w-4 text-purple-500" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };
  
  // Get color class based on content type
  const getContentTypeClass = () => {
    switch (article.content_type) {
      case ContentType.QUESTION:
        return "text-royal-blue-500 hover:text-royal-blue-600 dark:hover:text-royal-blue-400";
      case ContentType.ARTICLE:
        return "text-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400";
      case ContentType.QUOTE:
        return "text-amber-500 hover:text-amber-600 dark:hover:text-amber-400";
      case ContentType.POLL:
        return "text-purple-500 hover:text-purple-600 dark:hover:text-purple-400";
      default:
        return "text-primary hover:text-primary/90";
    }
  };
  
  // Format content snippet by removing HTML tags
  const formatSnippet = (content: string) => {
    const plainText = content.replace(/<[^>]*>?/gm, '');
    return plainText.length > 160 ? plainText.substring(0, 160) + '...' : plainText;
  };

  return (
    <Card className={cn(
      "transition-all duration-300 hover:shadow-md",
      article.author?.is_admin && "admin-gradient-premium-border" // Apply gradient border for admin content
    )}>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2 mb-2">
          {getContentTypeIcon()}
          <Badge variant="outline" className="text-xs capitalize">
            {article.content_type.toLowerCase()}
          </Badge>
          
          {article.is_featured && (
            <Badge className="bg-amber-500 text-xs">
              Featured
            </Badge>
          )}
          
          {article.author?.is_admin && (
            <Badge className="bg-[#9b87f5] text-xs">
              Admin
            </Badge>
          )}
        </div>
        
        <Link 
          to={`/knowledge/${article.id}`} 
          className={`group transition-colors ${getContentTypeClass()}`}
        >
          <CardTitle className="text-xl transition-colors">
            {article.title}
          </CardTitle>
        </Link>
        
        <div className="flex items-center gap-2 mt-2">
          <Avatar className={cn(
            "h-6 w-6",
            article.author?.is_admin && "ring-2 ring-[#9b87f5]"
          )}>
            <AvatarImage src={article.author?.avatar_url} />
            <AvatarFallback>
              {article.author?.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">
            {article.author?.name} • {formatDistanceToNow(new Date(article.created_at), { addSuffix: true })}
          </span>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-muted-foreground text-sm line-clamp-2">
          {formatSnippet(article.content)}
        </p>
        
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {article.tags.map(tag => (
              <Badge 
                key={tag} 
                variant="outline" 
                className="text-xs cursor-pointer hover:bg-muted knowledge-tag-border"
                onClick={() => navigate(`/knowledge/tags/${tag}`)}
              >
                <TagIcon className="h-3 w-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-0">
        <div className="flex items-center text-sm text-muted-foreground gap-4">
          <div className="flex items-center">
            <ThumbsUp className="h-3 w-3 mr-1" />
            <span>{article.vote_count || 0}</span>
          </div>
          
          <div className="flex items-center">
            <MessageSquare className="h-3 w-3 mr-1" />
            <span>{article.comment_count || 0}</span>
          </div>
          
          <div className="flex items-center">
            <Eye className="h-3 w-3 mr-1" />
            <span>{article.view_count || 0}</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
