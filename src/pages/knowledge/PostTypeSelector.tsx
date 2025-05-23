
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shell } from '@/components/layout/Shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, MessageSquare, BarChart2, BookOpen, Quote } from 'lucide-react';

const PostTypeSelector = () => {
  const navigate = useNavigate();
  
  const postTypes = [
    {
      id: 'question',
      title: 'Question',
      description: 'Ask a specific question to get help from the community',
      icon: MessageSquare,
      color: 'text-cyan-400'
    },
    {
      id: 'poll',
      title: 'Poll',
      description: 'Create a poll to gather opinions from the community',
      icon: BarChart2,
      color: 'text-cyan-400'
    },
    {
      id: 'article',
      title: 'Article',
      description: 'Write a detailed article to share knowledge',
      icon: BookOpen,
      color: 'text-cyan-400'
    },
    {
      id: 'quote',
      title: 'Quote',
      description: 'Share an inspiring or thought-provoking quote',
      icon: Quote,
      color: 'text-cyan-400'
    }
  ] as const;

  const handleSelectType = (type: string) => {
    navigate(`/knowledge/wizard?type=${type}`);
  };

  return (
    <Shell>
      <div className="container mx-auto px-4 py-6">
        {/* Back button */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            className="pl-0" 
            onClick={() => navigate('/knowledge')}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Knowledge Base
          </Button>
        </div>

        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Create New Post</h1>
            <p className="text-muted-foreground">
              Select the type of content you want to create
            </p>
          </div>

          {/* Post type cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            {postTypes.map((type) => {
              const Icon = type.icon;
              return (
                <Card 
                  key={type.id} 
                  className="cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => handleSelectType(type.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start mb-2">
                      <Icon className={`h-6 w-6 mr-3 ${type.color}`} />
                      <div>
                        <h3 className="font-medium text-lg">{type.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {type.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </Shell>
  );
};

export default PostTypeSelector;
