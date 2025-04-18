
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import * as communityService from "@/services/communityService";
import { useKnowledgeArticles } from "@/hooks/knowledge/useKnowledgeArticles";
import ArticleCard from "@/components/knowledge/ArticleCard";
import CreateArticleDialog from "@/components/knowledge/CreateArticleDialog";

const KnowledgeBase = () => {
  const { communityId } = useParams<{ communityId: string }>();
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: community, isLoading: communityLoading } = useQuery({
    queryKey: ['community', communityId],
    queryFn: () => communityService.getCommunityById(communityId || ""),
    enabled: !!communityId
  });
  
  const { articles, isLoading: articlesLoading } = useKnowledgeArticles(communityId || "");
  
  // Filter articles based on search query
  const filteredArticles = articles?.filter(article => 
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.content.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const isLoading = communityLoading || articlesLoading;
  
  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto py-20 text-center">
          <h1 className="text-2xl font-bold">Loading knowledge base...</h1>
        </div>
      </div>
    );
  }
  
  if (!community) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto py-20 text-center">
          <h1 className="text-2xl font-bold">Community not found</h1>
          <p className="mt-4">The community you're looking for doesn't exist or you don't have access to it.</p>
        </div>
      </div>
    );
  }
  
  const handleArticleClick = (articleId: string) => {
    // TODO: Implement article detail view navigation
    console.log("Navigate to article:", articleId);
  };
  
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">{community.name} Knowledge Base</h1>
              <p className="mt-2 text-muted-foreground max-w-2xl">
                Find answers, ask questions, and share your knowledge with the community.
              </p>
            </div>
            <CreateArticleDialog communityId={communityId || ""} />
          </div>
          
          <div className="mt-8 max-w-lg relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="search"
              placeholder="Search questions..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-6">Questions</h2>
            {filteredArticles && filteredArticles.length > 0 ? (
              <div className="space-y-4">
                {filteredArticles.map((article) => (
                  <ArticleCard 
                    key={article.id}
                    article={article}
                    onArticleClick={handleArticleClick}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-muted/30 rounded-lg">
                <h3 className="text-lg font-medium">No questions found</h3>
                <p className="mt-2 text-muted-foreground">
                  {articles?.length === 0 
                    ? "Be the first to ask a question!"
                    : "Try adjusting your search query."}
                </p>
              </div>
            )}
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-6">Popular Tags</h2>
            <div className="space-y-4">
              {/* TODO: Implement tag filtering */}
              <Card className="cursor-pointer hover:bg-muted/20 transition-all">
                <CardHeader className="py-4">
                  <CardTitle className="text-base">Getting Started</CardTitle>
                  <CardDescription>2 questions</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBase;
