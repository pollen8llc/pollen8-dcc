
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import { ArticleCard } from "@/components/knowledge/ArticleCard";
import { Shell } from "@/components/layout/Shell";
import { KnowledgeNavigation } from "@/components/knowledge/KnowledgeNavigation";
import { mockArticles } from "@/data/mockKnowledgeData";
import { ContentType } from "@/models/knowledgeTypes";

const KnowledgeBase = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContentType, setSelectedContentType] = useState<ContentType | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Get unique tags from articles and sort by frequency (top 10)
  const allTags = useMemo(() => {
    const tagCounts = new Map<string, number>();
    mockArticles.forEach(article => {
      article.tags?.forEach(tag => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });
    });
    
    return Array.from(tagCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([tag, count], index) => ({ tag, count, index }));
  }, []);

  // Filter articles based on search query, content type, and selected tag
  const filteredArticles = useMemo(() => {
    return mockArticles.filter(article => {
      const matchesSearch = !searchQuery || 
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesContentType = !selectedContentType || article.content_type === selectedContentType;
      const matchesTag = !selectedTag || article.tags?.includes(selectedTag);
      
      return matchesSearch && matchesContentType && matchesTag;
    });
  }, [searchQuery, selectedContentType, selectedTag]);

  const handleArticleClick = (articleId: string) => {
    navigate(`/knowledge/${articleId}`);
  };

  const handleTagClick = (tag: string) => {
    setSelectedTag(selectedTag === tag ? null : tag);
  };

  const handleContentTypeFilter = (type: ContentType) => {
    setSelectedContentType(selectedContentType === type ? null : type);
  };

  return (
    <Shell>
      <KnowledgeNavigation />
      
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Knowledge Base</h1>
            <p className="text-muted-foreground mt-1">
              Discover and explore community knowledge
            </p>
          </div>
          <Button 
            onClick={() => navigate("/knowledge/create")} 
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Article
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search articles, questions, polls..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Content Type Filters */}
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium text-muted-foreground mr-2">Filter by type:</span>
          {Object.values(ContentType).map((type) => (
            <Badge
              key={type}
              variant={selectedContentType === type ? "default" : "outline"}
              className="cursor-pointer capitalize"
              onClick={() => handleContentTypeFilter(type)}
            >
              {type.toLowerCase()}
            </Badge>
          ))}
        </div>

        {/* Top Tags */}
        <div className="space-y-2">
          <span className="text-sm font-medium text-muted-foreground">Popular Tags:</span>
          <div className="flex flex-wrap gap-2">
            {allTags.map(({ tag, count, index }) => (
              <Badge
                key={tag}
                variant={selectedTag === tag ? "default" : "outline"}
                className={`cursor-pointer transition-all duration-200 ${
                  index < 3 ? 'animate-pulse' : ''
                }`}
                onClick={() => handleTagClick(tag)}
              >
                {tag} ({count})
              </Badge>
            ))}
          </div>
        </div>

        {/* Active Filters */}
        {(selectedContentType || selectedTag) && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm font-medium text-muted-foreground">Active filters:</span>
            {selectedContentType && (
              <Badge variant="secondary" className="capitalize">
                {selectedContentType.toLowerCase()}
                <button
                  onClick={() => setSelectedContentType(null)}
                  className="ml-1 hover:text-destructive"
                >
                  ×
                </button>
              </Badge>
            )}
            {selectedTag && (
              <Badge variant="secondary">
                {selectedTag}
                <button
                  onClick={() => setSelectedTag(null)}
                  className="ml-1 hover:text-destructive"
                >
                  ×
                </button>
              </Badge>
            )}
          </div>
        )}

        {/* Results count */}
        <div className="text-sm text-muted-foreground">
          {filteredArticles.length} {filteredArticles.length === 1 ? 'article' : 'articles'} found
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              onClick={() => handleArticleClick(article.id)}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No articles found matching your criteria</p>
            <Button variant="outline" onClick={() => {
              setSearchQuery("");
              setSelectedContentType(null);
              setSelectedTag(null);
            }}>
              Clear filters
            </Button>
          </div>
        )}
      </div>
    </Shell>
  );
};

export default KnowledgeBase;
