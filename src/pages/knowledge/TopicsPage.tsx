
import { useState, useMemo, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Shell } from "@/components/layout/Shell";
import { KnowledgeNavigation } from "@/components/knowledge/KnowledgeNavigation";
import { getMockArticles } from "@/data/mockKnowledgeData";

const TopicsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [articles, setArticles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load articles on component mount
  useEffect(() => {
    const loadArticles = async () => {
      try {
        const data = await getMockArticles();
        setArticles(data);
      } catch (error) {
        console.error("Error loading articles:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadArticles();
  }, []);

  // Get all tags with their counts
  const tagData = useMemo(() => {
    const tagCounts = new Map<string, number>();
    articles.forEach(article => {
      article.tags?.forEach(tag => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });
    });
    
    return Array.from(tagCounts.entries())
      .map(([tag, count], index) => ({ tag, count, index }))
      .sort((a, b) => b.count - a.count);
  }, [articles]);

  // Filter tags based on search
  const filteredTags = useMemo(() => {
    if (!searchQuery) return tagData;
    return tagData.filter(({ tag }) => 
      tag.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [tagData, searchQuery]);

  if (isLoading) {
    return (
      <Shell>
        <KnowledgeNavigation />
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-muted-foreground">Loading topics...</div>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <KnowledgeNavigation />
      
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Topics</h1>
          <p className="text-muted-foreground mt-1">
            Browse all topics and tags in the knowledge base
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Stats */}
        <div className="text-sm text-muted-foreground">
          {filteredTags.length} {filteredTags.length === 1 ? 'topic' : 'topics'} found
        </div>

        {/* Tags Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredTags.map(({ tag, count, index }) => (
            <div 
              key={tag}
              className="p-4 border rounded-lg hover:shadow-md transition-all cursor-pointer bg-card"
            >
              <Badge 
                variant="outline" 
                className={`w-full justify-center text-center ${
                  index < 3 ? 'animate-pulse' : ''
                }`}
              >
                {tag}
              </Badge>
              <p className="text-sm text-muted-foreground mt-2 text-center">
                {count} {count === 1 ? 'article' : 'articles'}
              </p>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredTags.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No topics found matching your search</p>
          </div>
        )}
      </div>
    </Shell>
  );
};

export default TopicsPage;
