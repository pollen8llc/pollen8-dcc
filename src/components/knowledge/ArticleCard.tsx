
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from 'date-fns';

interface ArticleCardProps {
  article: {
    id: string;
    title: string;
    content: string;
    created_at: string;
    tags?: { tag: { name: string } }[] | any; // Updated to handle different types
  };
  onArticleClick: (id: string) => void;
}

const ArticleCard = ({ article, onArticleClick }: ArticleCardProps) => {
  // Check if tags is a valid array we can map over
  const hasTags = Array.isArray(article.tags) && article.tags.length > 0;
  
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
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {hasTags && article.tags.map(({ tag }) => (
              tag && tag.name ? (
                <Badge key={tag.name} variant="secondary">
                  {tag.name}
                </Badge>
              ) : null
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
