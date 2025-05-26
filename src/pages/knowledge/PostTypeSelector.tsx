
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  FileText, 
  HelpCircle, 
  Quote, 
  BarChart3,
  ChevronLeft
} from 'lucide-react';
import { CoreNavigation } from '@/components/rel8t/CoreNavigation';

const PostTypeSelector = () => {
  const navigate = useNavigate();

  const postTypes = [
    {
      id: 'article',
      title: 'Article',
      description: 'Share knowledge, tutorials, or insights',
      icon: FileText,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950/30'
    },
    {
      id: 'question',
      title: 'Question',
      description: 'Ask for help or start a discussion',
      icon: HelpCircle,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-950/30'
    },
    {
      id: 'quote',
      title: 'Quote',
      description: 'Share an inspiring or meaningful quote',
      icon: Quote,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-950/30'
    },
    {
      id: 'poll',
      title: 'Poll',
      description: 'Get community feedback with a poll',
      icon: BarChart3,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-50 dark:bg-orange-950/30'
    }
  ];

  const handleTypeSelect = (type: string) => {
    if (type === 'poll') {
      navigate('/knowledge/wizard', { state: { contentType: 'POLL' } });
    } else {
      navigate('/knowledge/wizard', { state: { contentType: type.toUpperCase() } });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-4 sm:py-8 max-w-full">
        <CoreNavigation />
        
        {/* Back button */}
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate('/knowledge')} className="pl-0">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Knowledge Base
          </Button>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Create New Post</h1>
          <p className="text-muted-foreground mt-1">
            Choose the type of content you'd like to create
          </p>
        </div>

        {/* Post type cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl">
          {postTypes.map((type) => {
            const IconComponent = type.icon;
            
            return (
              <Card 
                key={type.id}
                className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/20"
                onClick={() => handleTypeSelect(type.id)}
              >
                <CardHeader className="text-center pb-4">
                  <div className={`mx-auto w-12 h-12 rounded-full ${type.bgColor} flex items-center justify-center mb-4`}>
                    <IconComponent className={`h-6 w-6 ${type.color}`} />
                  </div>
                  <CardTitle className="text-xl">{type.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {type.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button className="w-full" variant="outline">
                    Create {type.title}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PostTypeSelector;
