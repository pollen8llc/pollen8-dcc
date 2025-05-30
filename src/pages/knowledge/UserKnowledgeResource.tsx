
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

const UserKnowledgeResource = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContentType, setSelectedContentType] = useState<ContentType | null>(null);

  // Filter to only user's articles (mock data - in real app would filter by user ID)
  const userArticles = useMemo(() => {
    return mockArticles.filter(article => 
      article.author?.name === "Current User" // Mock filter
    );
  }, []);

  // Filter articles based on search query and content type
  const filteredArticles = useMemo(() => {
    return userArticles.filter(article => {
      const matchesSearch = !searchQuery || 
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesContentType = !selectedContentType || article.content_type === selectedContentType;
      
      return matchesSearch && matchesContentType;
    });
  }, [userArticles, searchQuery, selectedContentType]);

  const handleArticleClick = (articleId: string) => {
    navigate(`/knowledge/${articleId}`);
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
            <h1 className="text-2xl sm:text-3xl font-bold">My Resources</h1>
            <p className="text-muted-foreground mt-1">
              Manage your knowledge contributions
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
            placeholder="Search your articles..."
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
            <p className="text-muted-foreground mb-4">
              {userArticles.length === 0 
                ? "You haven't created any articles yet" 
                : "No articles found matching your criteria"
              }
            </p>
            <Button onClick={() => navigate("/knowledge/create")}>
              Create Your First Article
            </Button>
          </div>
        )}
      </div>
    </Shell>
  );
};

export default UserKnowledgeResource;
