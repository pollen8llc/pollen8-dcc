
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shell } from '@/components/layout/Shell';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useKnowledgeBase } from '@/hooks/useKnowledgeBase';
import { Search } from 'lucide-react';

const TopicsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const { useTags } = useKnowledgeBase();
  const { data: tags, isLoading: tagsLoading } = useTags();

  // Filter tags based on search term
  const filteredTags = tags?.filter(tag => 
    !searchTerm || tag.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Shell>
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredTags.map((tag) => (
              <Card 
                key={tag.id}
                onClick={() => navigate(`/knowledge/tags/${tag.name}`)}
                className="cursor-pointer hover:shadow-md transition-all bg-card/80 backdrop-blur-sm"
              >
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="bg-primary/10 rounded-full p-2 mr-3">
                      <span className="text-primary text-sm">{tag.name.slice(0, 2)}</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">{tag.name}</h3>
                      <p className="text-muted-foreground text-sm">{tag.count || 0} questions</p>
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
    </Shell>
  );
};

export default TopicsPage;
