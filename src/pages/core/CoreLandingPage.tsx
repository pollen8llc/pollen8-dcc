
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shell } from '@/components/layout/Shell';
import { useKnowledgeBase } from '@/hooks/useKnowledgeBase';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useDebounce } from '@/hooks/useDebounce';

const CoreLandingPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const debouncedSearch = useDebounce(searchTerm, 500);
  
  const { useTags, useArticles } = useKnowledgeBase();
  
  const { data: tags, isLoading: tagsLoading } = useTags();
  const { data: articles, isLoading: articlesLoading } = useArticles({ 
    tag: selectedTag, 
    query: debouncedSearch // Changed from searchQuery to query
  });

  return (
    <Shell>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Knowledge Base</h1>
            <p className="text-muted-foreground mt-1">
              Find answers to your questions and share your knowledge
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button asChild>
              <Link to="/core/articles/new">Create Article</Link>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
            
            {/* Articles list would go here */}
            <div className="space-y-6">
              {articlesLoading ? (
                <p>Loading articles...</p>
              ) : articles && articles.length > 0 ? (
                articles.map(article => (
                  <div key={article.id} className="border rounded-md p-4">
                    <Link to={`/core/articles/${article.id}`} className="text-xl font-medium hover:underline">
                      {article.title}
                    </Link>
                    <p className="mt-2 text-muted-foreground line-clamp-2">
                      {/* Strip HTML tags for content preview */}
                      {article.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                    </p>
                    <div className="flex gap-2 mt-4">
                      {article.tags?.map(tag => (
                        <button
                          key={tag}
                          onClick={() => setSelectedTag(tag)}
                          className="px-2 py-1 text-xs rounded-full bg-muted hover:bg-muted/80"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No articles found</p>
                  <Button asChild className="mt-4">
                    <Link to="/core/articles/new">Create the first article</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            <div className="border rounded-md p-4">
              <h2 className="font-medium mb-4">Popular Tags</h2>
              {tagsLoading ? (
                <div className="animate-pulse space-y-2">
                  {Array(5).fill(0).map((_, i) => (
                    <div key={i} className="h-6 bg-muted rounded w-24"></div>
                  ))}
                </div>
              ) : tags && tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {tags.map(tag => (
                    <button
                      key={tag.id}
                      onClick={() => setSelectedTag(selectedTag === tag.name ? null : tag.name)}
                      className={`px-2 py-1 text-xs rounded-full ${
                        selectedTag === tag.name
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted hover:bg-muted/80'
                      }`}
                    >
                      {tag.name} ({tag.count || 0})
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">No tags found</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
};

export default CoreLandingPage;
