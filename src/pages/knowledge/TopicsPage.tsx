
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useKnowledgeBase } from '@/hooks/useKnowledgeBase';
import { Search, Tag as TagIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { KnowledgeTag } from '@/models/knowledgeTypes';
import { KnowledgeNavigation } from '@/components/knowledge/KnowledgeNavigation';

const TopicsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const { useTags } = useKnowledgeBase();
  const { data: tags, isLoading: tagsLoading } = useTags();

  // Filter tags based on search term and sort alphabetically
  const filteredTags = useMemo(() => {
    if (!tags) return [];
    return tags
      .filter(tag => !searchTerm || tag.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically
  }, [tags, searchTerm]);

  // Determine popular tags (top 25%)
  const popularTags = useMemo(() => {
    if (!filteredTags.length) return new Set<string>();
    
    const sortedByCounts = [...filteredTags].sort((a, b) => (b.count || 0) - (a.count || 0));
    const topCount = sortedByCounts.length > 0 ? Math.ceil(sortedByCounts.length / 4) : 0;
    
    return new Set(sortedByCounts.slice(0, topCount).map(tag => tag.id));
  }, [filteredTags]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-4 sm:py-8 max-w-full">
        <KnowledgeNavigation />
        
        {/* Header */}
        <div className="mb-8 mt-6">
          <h1 className="text-3xl font-bold tracking-tight">Topics</h1>
          <p className="text-muted-foreground mt-1">
            Browse topics to find conversations that interest you
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-8 max-w-3xl">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Filter by topic..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Topics Grid */}
        {tagsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array(12).fill(null).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-6 bg-muted rounded w-24 mb-3"></div>
                  <div className="h-4 bg-muted rounded w-16"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredTags && filteredTags.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredTags.map((tag) => (
              <Card 
                key={tag.id}
                onClick={() => navigate(`/knowledge/tags/${tag.name}`)}
                className={cn(
                  "cursor-pointer hover:shadow-md transition-all bg-card/80 backdrop-blur-sm",
                  popularTags.has(tag.id) && "knowledge-tag-border" // Apply teal border to popular topics
                )}
              >
                <CardContent className="p-5">
                  <div className="flex items-center">
                    <div className={cn(
                      "bg-primary/10 rounded-full p-2 mr-3",
                      popularTags.has(tag.id) && "bg-[#00eada]/20" // Teal background for popular topics
                    )}>
                      <TagIcon className={cn(
                        "h-4 w-4",
                        popularTags.has(tag.id) ? "text-[#00eada]" : "text-primary"
                      )} />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">{tag.name}</h3>
                      <p className="text-muted-foreground text-sm">
                        {tag.count || 0} {(tag.count === 1) ? 'post' : 'posts'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center p-12">
            <h3 className="text-lg font-medium mb-2">No topics found</h3>
            <p className="text-muted-foreground">
              {searchTerm ? `No topics match "${searchTerm}"` : "No topics have been created yet"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopicsPage;
