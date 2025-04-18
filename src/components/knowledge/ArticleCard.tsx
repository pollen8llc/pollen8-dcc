
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Check } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';

interface ArticleCardProps {
  article: {
    id: string;
    title: string;
    content: string;
    vote_count?: number;
    is_answered?: boolean;
    created_at: string;
    tags?: { tag: { name: string } }[];
  };
  onArticleClick: (id: string) => void;
}

const ArticleCard = ({ article, onArticleClick }: ArticleCardProps) => {
  return (
    <Card 
      className="hover:bg-accent/5 cursor-pointer transition-colors"
      onClick={() => onArticleClick(article.id)}
    >
      <CardHeader className="flex flex-row items-start space-x-4 pb-2">
        <div className="flex-1">
          <CardTitle className="text-xl">{article.title}</CardTitle>
          <CardDescription className="mt-2 line-clamp-2">{article.content}</CardDescription>
        </div>
        
        {article.is_answered && (
          <div className="text-green-500">
            <Check className="h-6 w-6" />
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {article.tags?.map(({ tag }) => (
              <Badge key={tag.name} variant="secondary">
                {tag.name}
              </Badge>
            ))}
          </div>
          <div className="text-sm text-muted-foreground">
            Posted {formatDistanceToNow(new Date(article.created_at))} ago
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ArticleCard;
