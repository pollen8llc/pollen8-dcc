
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import * as communityService from "@/services/communityService";
import { KnowledgeArticle } from "@/models/types";

// Mock knowledge base articles for development
const mockArticles: KnowledgeArticle[] = [
  {
    id: "1",
    sectionId: "1",
    title: "Getting Started with Our Community",
    content: "Welcome to our community! Here's how to get started and make the most of your membership...",
    createdAt: "2023-01-15T00:00:00Z",
    updatedAt: "2023-02-20T00:00:00Z",
    authorId: "25",
    tags: ["onboarding", "introduction"],
    views: 245
  },
  {
    id: "2",
    sectionId: "1",
    title: "Community Guidelines",
    content: "Our community guidelines are designed to ensure a positive experience for all members...",
    createdAt: "2023-01-20T00:00:00Z",
    updatedAt: "2023-03-15T00:00:00Z",
    authorId: "25",
    tags: ["guidelines", "rules"],
    views: 189
  },
  {
    id: "3",
    sectionId: "2",
    title: "How to Contribute to Projects",
    content: "Want to contribute to community projects? Here's everything you need to know...",
    createdAt: "2023-02-05T00:00:00Z",
    updatedAt: "2023-04-10T00:00:00Z",
    authorId: "25",
    tags: ["projects", "contribution"],
    views: 156
  },
  {
    id: "4",
    sectionId: "2",
    title: "Organizing Community Events",
    content: "Learn how to organize and promote successful community events...",
    createdAt: "2023-03-01T00:00:00Z",
    updatedAt: "2023-04-25T00:00:00Z",
    authorId: "25",
    tags: ["events", "organization"],
    views: 132
  }
];

const KnowledgeBase = () => {
  const { communityId } = useParams<{ communityId: string }>();
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: community, isLoading } = useQuery({
    queryKey: ['community', communityId],
    queryFn: () => communityService.getCommunityById(communityId || ""),
    enabled: !!communityId
  });
  
  // Filter articles based on search query
  const filteredArticles = mockArticles.filter(article => 
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
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
  
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">{community.name} Knowledge Base</h1>
          <p className="mt-2 text-muted-foreground max-w-2xl">
            Access guides, tutorials, and resources to help you make the most of our community.
          </p>
          
          <div className="mt-8 max-w-lg relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="search"
              placeholder="Search articles..."
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
            <h2 className="text-2xl font-bold mb-6">Articles</h2>
            {filteredArticles.length > 0 ? (
              <div className="space-y-6">
                {filteredArticles.map((article) => (
                  <Card key={article.id} className="cursor-pointer hover:shadow-md transition-all">
                    <CardHeader className="pb-2">
                      <CardTitle>{article.title}</CardTitle>
                      <CardDescription>
                        Last updated: {new Date(article.updatedAt).toLocaleDateString()} • {article.views} views
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="line-clamp-2 text-muted-foreground">
                        {article.content}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {article.tags.map((tag) => (
                          <span 
                            key={tag} 
                            className="bg-muted px-2 py-1 rounded-md text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-muted/30 rounded-lg">
                <h3 className="text-lg font-medium">No articles found</h3>
                <p className="mt-2 text-muted-foreground">
                  Try adjusting your search query or browse categories instead.
                </p>
              </div>
            )}
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-6">Categories</h2>
            <div className="space-y-4">
              <Card className="cursor-pointer hover:bg-muted/20 transition-all">
                <CardHeader className="py-4">
                  <CardTitle className="text-base">Getting Started</CardTitle>
                  <CardDescription>2 articles</CardDescription>
                </CardHeader>
              </Card>
              
              <Card className="cursor-pointer hover:bg-muted/20 transition-all">
                <CardHeader className="py-4">
                  <CardTitle className="text-base">Contributions & Events</CardTitle>
                  <CardDescription>2 articles</CardDescription>
                </CardHeader>
              </Card>
              
              <Card className="cursor-pointer hover:bg-muted/20 transition-all">
                <CardHeader className="py-4">
                  <CardTitle className="text-base">Resources</CardTitle>
                  <CardDescription>Coming soon</CardDescription>
                </CardHeader>
              </Card>
            </div>
            
            <div className="mt-8">
              <Button className="w-full" variant="outline">
                Suggest a Topic
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBase;
