import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Tag as TagIcon, Plus, X, ArrowLeft, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { COMMUNITY_TAG_LIBRARY, getAllTags, searchTags as searchLibraryTags } from "@/constants/communityTagLibrary";

interface CommunityTag {
  id: string;
  name: string;
  count: number;
}

const P8Tags = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [customTag, setCustomTag] = useState("");
  const [databaseTags, setDatabaseTags] = useState<CommunityTag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTags, setSelectedTags] = useState<string[]>(() => {
    const saved = localStorage.getItem("p8_selected_tags");
    return saved ? JSON.parse(saved) : [];
  });

  // Get all library tags
  const libraryTags = useMemo(() => getAllTags(), []);

  // Fetch community tags from database
  useEffect(() => {
    const fetchTags = async () => {
      setIsLoading(true);
      try {
        // Fetch all communities and count tag usage
        const { data: communities, error } = await supabase
          .from('communities')
          .select('tags');

        if (error) throw error;

        // Count tag occurrences
        const tagCounts = new Map<string, number>();
        communities?.forEach(community => {
          if (community.tags && Array.isArray(community.tags)) {
            community.tags.forEach(tag => {
              const tagLower = tag.toLowerCase();
              tagCounts.set(tagLower, (tagCounts.get(tagLower) || 0) + 1);
            });
          }
        });

        // Convert to array and sort by popularity
        const tagArray = Array.from(tagCounts.entries())
          .map(([name, count]) => ({
            id: name,
            name: name,
            count
          }))
          .sort((a, b) => b.count - a.count);

        setDatabaseTags(tagArray);
      } catch (error) {
        console.error("Error fetching tags:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTags();
  }, [toast]);

  // Save selected tags to localStorage
  useEffect(() => {
    localStorage.setItem("p8_selected_tags", JSON.stringify(selectedTags));
  }, [selectedTags]);

  // Combine all tags (library + database) and filter
  const allCombinedTags = useMemo(() => {
    const combined = new Map<string, CommunityTag>();
    
    // Add library tags
    libraryTags.forEach(tag => {
      combined.set(tag, { id: tag, name: tag, count: 0 });
    });
    
    // Add/update with database tags (with counts)
    databaseTags.forEach(tag => {
      combined.set(tag.name, tag);
    });
    
    return Array.from(combined.values()).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  }, [libraryTags, databaseTags]);

  // Filter tags based on search term
  const filteredLibraryTags = useMemo(() => {
    if (!searchTerm) return libraryTags;
    return searchLibraryTags(searchTerm);
  }, [libraryTags, searchTerm]);

  const filteredAllTags = useMemo(() => {
    if (!searchTerm) return allCombinedTags;
    return allCombinedTags.filter(tag => 
      tag.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allCombinedTags, searchTerm]);

  // Determine popular tags from database (top 25%)
  const popularTags = useMemo(() => {
    const threshold = Math.ceil(databaseTags.length / 4);
    return new Set(databaseTags.slice(0, threshold).map(t => t.id));
  }, [databaseTags]);

  const toggleTag = (tagName: string) => {
    setSelectedTags(prev => 
      prev.includes(tagName)
        ? prev.filter(t => t !== tagName)
        : [...prev, tagName]
    );
  };

  const addCustomTag = () => {
    if (!customTag.trim()) return;
    
    const normalizedTag = customTag.trim().toLowerCase();
    
    if (selectedTags.includes(normalizedTag)) {
      toast({
        title: "Tag already added",
        description: "This tag is already in your selection.",
        variant: "destructive"
      });
      return;
    }

    setSelectedTags(prev => [...prev, normalizedTag]);
    setCustomTag("");
    
    toast({
      title: "Custom tag added",
      description: `"${normalizedTag}" has been added to your tags.`
    });
  };

  const removeSelectedTag = (tagName: string) => {
    setSelectedTags(prev => prev.filter(t => t !== tagName));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <TagIcon className="h-8 w-8 text-[#00eada]" />
            <h1 className="text-3xl font-bold">Community Tags</h1>
          </div>
          <p className="text-muted-foreground">
            Select tags that represent your community's interests or add your own
          </p>
        </div>

        {/* Selected Tags */}
        {selectedTags.length > 0 && (
          <Card className="mb-6 bg-card/80 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <TagIcon className="h-4 w-4 text-[#00eada]" />
                <span className="text-sm font-medium">
                  Selected Tags ({selectedTags.length})
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedTags.map(tag => (
                  <Badge
                    key={tag}
                    variant="default"
                    className="cursor-pointer group"
                    onClick={() => removeSelectedTag(tag)}
                  >
                    {tag}
                    <X className="ml-1 h-3 w-3 opacity-70 group-hover:opacity-100" />
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search and Add Custom */}
        <div className="mb-6 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Add Custom Tag */}
          <div className="flex gap-2">
            <Input
              placeholder="Add custom tag..."
              value={customTag}
              onChange={(e) => setCustomTag(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addCustomTag();
                }
              }}
            />
            <Button 
              onClick={addCustomTag}
              disabled={!customTag.trim()}
              className="shrink-0"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
        </div>

        {/* Tags Tabs */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array(12).fill(null).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-5">
                  <div className="h-6 bg-muted rounded w-24 mb-3"></div>
                  <div className="h-4 bg-muted rounded w-16"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 text-xs mb-6">
              <TabsTrigger value="all">All</TabsTrigger>
              {COMMUNITY_TAG_LIBRARY.map(category => (
                <TabsTrigger key={category.id} value={category.id} className="text-xs">
                  {category.name.split(' ')[0]}
                </TabsTrigger>
              ))}
              <TabsTrigger value="popular">Popular</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-4">
              {filteredAllTags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {filteredAllTags.map((tag) => {
                    const isSelected = selectedTags.includes(tag.name);
                    const isPopular = popularTags.has(tag.id);
                    
                    return (
                      <Badge
                        key={tag.id}
                        variant={isSelected ? "default" : "outline"}
                        className={cn(
                          "cursor-pointer hover:bg-primary/20 px-4 py-2 text-sm transition-all",
                          isPopular && "border-[#00eada]/50",
                          isSelected && "bg-[#00eada] hover:bg-[#00eada]/90 border-[#00eada]"
                        )}
                        onClick={() => toggleTag(tag.name)}
                      >
                        {tag.name}
                        {tag.count > 0 && (
                          <span className="ml-2 opacity-70">({tag.count})</span>
                        )}
                        {isSelected && <Check className="ml-2 h-3 w-3" />}
                      </Badge>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center p-12">
                  <TagIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No tags found</h3>
                  <p className="text-muted-foreground">
                    {searchTerm ? `No tags match "${searchTerm}"` : "No tags available yet"}
                  </p>
                </div>
              )}
            </TabsContent>

            {COMMUNITY_TAG_LIBRARY.map(category => (
              <TabsContent key={category.id} value={category.id} className="mt-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {category.tags
                      .filter(tag => !searchTerm || tag.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map(tag => {
                        const isSelected = selectedTags.includes(tag);
                        const tagData = allCombinedTags.find(t => t.name === tag);
                        
                        return (
                          <Badge
                            key={tag}
                            variant={isSelected ? "default" : "outline"}
                            className={cn(
                              "cursor-pointer hover:bg-primary/20 px-4 py-2 text-sm transition-all",
                              isSelected && "bg-[#00eada] hover:bg-[#00eada]/90 border-[#00eada]"
                            )}
                            onClick={() => toggleTag(tag)}
                          >
                            {tag}
                            {tagData && tagData.count > 0 && (
                              <span className="ml-2 opacity-70">({tagData.count})</span>
                            )}
                            {isSelected && <Check className="ml-2 h-3 w-3" />}
                          </Badge>
                        );
                      })}
                  </div>
                </div>
              </TabsContent>
            ))}

            <TabsContent value="popular" className="mt-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-1">Popular Tags</h3>
                  <p className="text-sm text-muted-foreground">Tags used by existing communities</p>
                </div>
                {databaseTags.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {databaseTags.slice(0, 20).map((tag) => {
                      const isSelected = selectedTags.includes(tag.name);
                      const isPopular = popularTags.has(tag.id);
                      
                      return (
                        <Card
                          key={tag.id}
                          onClick={() => toggleTag(tag.name)}
                          className={cn(
                            "cursor-pointer hover:shadow-md transition-all bg-card/80 backdrop-blur-sm",
                            isPopular && "border-[#00eada]/50",
                            isSelected && "ring-2 ring-[#00eada] bg-[#00eada]/5"
                          )}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className={cn(
                                  "bg-primary/10 rounded-full p-2",
                                  isPopular && "bg-[#00eada]/20",
                                  isSelected && "bg-[#00eada]/30"
                                )}>
                                  <TagIcon className={cn(
                                    "h-4 w-4",
                                    isPopular ? "text-[#00eada]" : "text-primary",
                                    isSelected && "text-[#00eada]"
                                  )} />
                                </div>
                                <div>
                                  <h3 className="font-medium">{tag.name}</h3>
                                  <p className="text-muted-foreground text-sm">
                                    {tag.count} {tag.count === 1 ? 'community' : 'communities'}
                                  </p>
                                </div>
                              </div>
                              {isSelected && (
                                <Check className="h-5 w-5 text-[#00eada]" />
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center p-12">
                    <TagIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No popular tags yet</h3>
                    <p className="text-muted-foreground">
                      Browse other categories to select tags
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-background/80 backdrop-blur-lg border-t border-primary/10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <Button 
            variant="outline" 
            onClick={() => navigate("/p8/asl")}
            className="group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back
          </Button>

          <div className="backdrop-blur-md bg-background/30 border border-primary/20 rounded-full px-4 py-2">
            <p className="text-sm font-medium text-foreground/80">
              {selectedTags.length} {selectedTags.length === 1 ? 'tag' : 'tags'} selected
            </p>
          </div>

          <Button
            onClick={() => navigate("/p8/dashboard")}
            className="group"
          >
            Continue
            <Check className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default P8Tags;
