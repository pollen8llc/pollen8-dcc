import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { COMMUNITY_TAG_LIBRARY, getAllTags, searchTags } from '@/constants/communityTagLibrary';
import { Search, Plus, X } from 'lucide-react';

interface TagLibrarySelectorProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  maxTags?: number;
}

export const TagLibrarySelector: React.FC<TagLibrarySelectorProps> = ({
  selectedTags,
  onTagsChange,
  maxTags = 20
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [customTag, setCustomTag] = useState('');

  const filteredTags = searchQuery ? searchTags(searchQuery) : getAllTags();

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter(t => t !== tag));
    } else if (selectedTags.length < maxTags) {
      onTagsChange([...selectedTags, tag]);
    }
  };

  const addCustomTag = () => {
    const tag = customTag.trim().toLowerCase().replace(/\s+/g, '-');
    if (tag && !selectedTags.includes(tag) && selectedTags.length < maxTags) {
      onTagsChange([...selectedTags, tag]);
      setCustomTag('');
    }
  };

  const removeTag = (tag: string) => {
    onTagsChange(selectedTags.filter(t => t !== tag));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Community Tags
          <span className="text-sm font-normal text-muted-foreground">
            {selectedTags.length}/{maxTags} selected
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Selected Tags */}
        {selectedTags.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Selected Tags:</h4>
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedTags.map(tag => (
                <Badge key={tag} variant="default" className="flex items-center gap-1">
                  {tag}
                  <X 
                    className="h-3 w-3 cursor-pointer hover:text-destructive" 
                    onClick={() => removeTag(tag)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Custom Tag Input */}
        <div className="flex gap-2">
          <Input
            placeholder="Add custom tag"
            value={customTag}
            onChange={(e) => setCustomTag(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomTag())}
          />
          <Button 
            type="button" 
            onClick={addCustomTag} 
            size="sm"
            disabled={!customTag.trim() || selectedTags.length >= maxTags}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Tag Categories */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7 text-xs">
            <TabsTrigger value="all">All</TabsTrigger>
            {COMMUNITY_TAG_LIBRARY.map(category => (
              <TabsTrigger key={category.id} value={category.id} className="text-xs">
                {category.name.split(' ')[0]}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all" className="mt-4">
            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
              {filteredTags.map(tag => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/20"
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </TabsContent>

          {COMMUNITY_TAG_LIBRARY.map(category => (
            <TabsContent key={category.id} value={category.id} className="mt-4">
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium">{category.name}</h4>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </div>
                <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                  {category.tags
                    .filter(tag => !searchQuery || tag.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map(tag => (
                    <Badge
                      key={tag}
                      variant={selectedTags.includes(tag) ? "default" : "outline"}
                      className="cursor-pointer hover:bg-primary/20"
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};