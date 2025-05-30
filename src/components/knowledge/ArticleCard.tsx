
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  MessageSquare,
  Eye,
  Share2,
  BookOpen,
  BarChart3,
  Quote,
  HelpCircle
} from 'lucide-react';
import { ContentType } from '@/models/knowledgeTypes';
import { cn } from '@/lib/utils';
import { PollVoting } from './PollVoting';

interface Article {
  id: string;
  title: string;
  content: string;
  content_type: ContentType;
  tags?: string[];
  created_at: string;
  updated_at?: string;
  view_count?: number;
  comment_count?: number;
  vote_count?: number;
  user_vote?: number | null;
  author?: {
    id: string;
    name: string;
    avatar_url?: string;
  };
  pollData?: any;
}

interface ArticleCardProps {
  article: Article;
  onClick?: () => void;
  className?: string;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  onClick,
  className
}) => {
  const getContentTypeIcon = (type: ContentType) => {
    switch (type) {
      case ContentType.ARTICLE:
        return <BookOpen className="h-3 w-3 sm:h-4 sm:w-4" />;
      case ContentType.QUESTION:
        return <HelpCircle className="h-3 w-3 sm:h-4 sm:w-4" />;
      case ContentType.POLL:
        return <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 text-[#00eada]" />;
      case ContentType.QUOTE:
        return <Quote className="h-3 w-3 sm:h-4 sm:w-4 text-pink-500" />;
      default:
        return <BookOpen className="h-3 w-3 sm:h-4 sm:w-4" />;
    }
  };

  const getContentTypeColor = (type: ContentType) => {
    switch (type) {
      case ContentType.ARTICLE:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case ContentType.QUESTION:
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case ContentType.POLL:
        return 'bg-[#e0fcfa] text-[#00eada] dark:bg-[#00eada]/20 dark:text-[#00eada]';
      case ContentType.QUOTE:
        return 'bg-pink-100 text-pink-600 dark:bg-pink-900 dark:text-pink-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  // Function to strip markdown and create a clean excerpt
  const createExcerpt = (content: string, maxLength: number = 200) => {
    // Remove markdown formatting
    let cleanText = content
      .replace(/#{1,6}\s+/g, '') // Remove headers
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
      .replace(/\*(.*?)\*/g, '$1') // Remove italic
      .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links, keep text
      .replace(/`(.*?)`/g, '$1') // Remove inline code
      .replace(/```[\s\S]*?```/g, '') // Remove code blocks
      .replace(/>\s+/g, '') // Remove blockquotes
      .replace(/[-*+]\s+/g, '') // Remove list markers
      .replace(/\d+\.\s+/g, '') // Remove numbered list markers
      .replace(/\n+/g, ' ') // Replace line breaks with spaces
      .trim();

    if (cleanText.length <= maxLength) return cleanText;
    return cleanText.substring(0, maxLength).trim() + '...';
  };

  const getAuthorInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: createExcerpt(article.content, 100),
        url: window.location.origin + `/knowledge/${article.id}`
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(
        window.location.origin + `/knowledge/${article.id}`
      );
    }
  };

  return (
    <Card 
      className={cn(
        "cursor-pointer hover:shadow-md transition-all duration-200 border-border/50",
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge 
                variant="secondary" 
                className={cn("text-xs", getContentTypeColor(article.content_type))}
              >
                {getContentTypeIcon(article.content_type)}
                <span className="ml-1 capitalize">
                  {article.content_type?.toLowerCase() || 'article'}
                </span>
              </Badge>
            </div>
            
            <h3 className="text-base sm:text-lg font-semibold line-clamp-2 mb-2">
              {article.title}
            </h3>
            
            <p className="text-muted-foreground text-sm line-clamp-3">
              {createExcerpt(article.content)}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Poll Voting UI for Polls */}
        {article.content_type === ContentType.POLL && article.pollData && (
          <div className="mb-4">
            <PollVoting pollId={article.id} pollData={article.pollData} />
          </div>
        )}

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {article.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {article.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{article.tags.length - 3} more
              </Badge>
            )}
          </div>
        )}

        <Separator className="mb-3" />

        {/* Bottom section */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            {/* Author */}
            {article.author && (
              <div className="flex items-center gap-2">
                <Avatar className="h-5 w-5 sm:h-6 sm:w-6">
                  <AvatarImage src={article.author.avatar_url} />
                  <AvatarFallback className="text-xs">
                    {getAuthorInitials(article.author.name)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs sm:text-sm">{article.author.name}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Stats */}
            <div className="flex items-center gap-3 text-xs">
              {article.view_count !== undefined && (
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  <span>{article.view_count}</span>
                </div>
              )}
              
              {article.comment_count !== undefined && (
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" />
                  <span>{article.comment_count}</span>
                </div>
              )}
            </div>

            {/* Share button - hidden on mobile */}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hidden sm:flex"
              onClick={handleShare}
            >
              <Share2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
