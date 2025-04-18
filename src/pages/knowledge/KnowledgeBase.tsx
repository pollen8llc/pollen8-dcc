
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, AlertTriangle } from "lucide-react";
import * as communityService from "@/services/communityService";
import { useKnowledgeArticles } from "@/hooks/knowledge/useKnowledgeArticles";
import ArticleCard from "@/components/knowledge/ArticleCard";
import CreateArticleDialog from "@/components/knowledge/CreateArticleDialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

const KnowledgeBase = () => {
  const { communityId } = useParams<{ communityId?: string }>();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Fetch community details only if communityId is provided
  const { data: community } = useQuery({
    queryKey: ['community', communityId],
    queryFn: () => communityService.getCommunityById(communityId!),
    enabled: !!communityId,
    retry: 1,
    staleTime: 60 * 1000,
  });
  
  const { articles, isLoading: articlesLoading, error: articlesError } = useKnowledgeArticles(communityId);
  
  // Simple client-side filtering for search
  const filteredArticles = articles?.filter(article => 
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.content.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  if (articlesLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto py-10 text-center">
          <div className="animate-pulse">
            <h1 className="text-2xl font-bold">Loading knowledge base...</h1>
            <p className="mt-4 text-muted-foreground">Please wait while we retrieve the content.</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (articlesError) {
    console.error("Error loading articles:", articlesError);
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto py-10">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              There was an error loading the knowledge base. Please try again later.
            </AlertDescription>
          </Alert>
          <div className="mt-4 flex justify-center">
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="bg-muted/30 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">
                {community ? `${community.name} Knowledge Base` : 'Knowledge Base'}
              </h1>
              <p className="mt-2 text-muted-foreground max-w-2xl">
                Find answers, ask questions, and share your knowledge
                {community ? ` with the ${community.name} community` : ''}.
              </p>
            </div>
            <CreateArticleDialog communityId={communityId} />
          </div>
          
          <div className="mt-6 max-w-lg relative">
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
      
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">Questions</h2>
        
        {filteredArticles && filteredArticles.length > 0 ? (
          <div className="space-y-4">
            {filteredArticles.map((article) => (
              <ArticleCard 
                key={article.id}
                article={article}
                onArticleClick={(id) => console.log("Navigate to article:", id)}
              />
            ))}
          </div>
        ) : (
          <Card className="text-center py-10 bg-muted/30">
            <CardContent>
              <h3 className="text-lg font-medium">No questions found</h3>
              <p className="mt-2 text-muted-foreground">
                {articles?.length === 0 
                  ? "Be the first to ask a question!"
                  : "Try adjusting your search query."}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default KnowledgeBase;
