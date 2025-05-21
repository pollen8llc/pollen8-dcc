
import React from 'react';
import { Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { KnowledgeTag } from '@/models/knowledgeTypes';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface TagsListProps {
  tags: KnowledgeTag[];
  selectedTag: string | null;
  isLoading: boolean;
  onSelectTag: (tag: string) => void;
}

export const TagsList: React.FC<TagsListProps> = ({
  tags,
  selectedTag,
  isLoading,
  onSelectTag,
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-wrap gap-2">
        {Array(10).fill(0).map((_, i) => (
          <div key={i} className="h-6 w-16 bg-muted rounded animate-pulse"></div>
        ))}
      </div>
    );
  }
  
  if (tags.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        No tags available
      </div>
    );
  }
  
  // Sort tags by popularity (count)
  const sortedTags = [...tags].sort((a, b) => (b.count || 0) - (a.count || 0));
  
  // Determine popular tags (top 25%)
  const popularThreshold = Math.max(1, Math.ceil(sortedTags.length / 4));
  
  return (
    <ScrollArea className="h-[300px] pr-4">
      <div className="flex flex-wrap gap-2">
        {sortedTags.map((tag, index) => {
          const isPopular = index < popularThreshold;
          return (
            <Badge
              key={tag.id}
              variant={selectedTag === tag.name 
                ? "default" 
                : isPopular 
                  ? "popularTag" 
                  : "tag"}
              className="cursor-pointer"
              onClick={() => onSelectTag(tag.name)}
            >
              <Tag className="h-3 w-3 mr-1" />
              {tag.name}
              <span className="ml-1 opacity-70">
                ({tag.count})
              </span>
            </Badge>
          );
        })}
      </div>
    </ScrollArea>
  );
};
