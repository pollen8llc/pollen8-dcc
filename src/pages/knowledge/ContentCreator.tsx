
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shell } from '@/components/layout/Shell';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import {
  ChevronLeft,
  BookOpen,
  MessageSquare,
  Quote,
  BarChart2,
  Check,
  X,
  PlusCircle
} from 'lucide-react';

// UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

// Form Components
import { QuestionForm } from '@/components/knowledge/forms/QuestionForm';
import { ArticleForm } from '@/components/knowledge/forms/ArticleForm';
import { QuoteForm } from '@/components/knowledge/forms/QuoteForm';
import { PollForm } from '@/components/knowledge/forms/PollForm';

// Types
import { ContentType } from '@/models/knowledgeTypes';

const ContentCreator = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentUser } = useUser();
  
  // State
  const [contentType, setContentType] = useState<string>(ContentType.QUESTION);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Handle form submission
  const handleSubmit = async (formData: any) => {
    setIsSubmitting(true);
    
    try {
      // In a real app, this would send data to an API
      console.log('Submitting content:', { type: contentType, data: formData });
      
      toast({
        title: "Content created successfully",
        description: "Your content has been published to the knowledge base.",
      });
      
      navigate('/knowledge');
    } catch (error) {
      console.error('Error creating content:', error);
      toast({
        title: "Error creating content",
        description: "There was a problem publishing your content. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Shell>
      <div className="container mx-auto px-4 py-6">
        {/* Navigation */}
        <div className="mb-6">
          <Button variant="ghost" className="pl-0" asChild>
            <div onClick={() => navigate('/knowledge')}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Knowledge Base
            </div>
          </Button>
        </div>
        
        <div className="max-w-3xl mx-auto">
          {/* Page title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Create Content</h1>
            <p className="text-muted-foreground mt-2">
              Share your knowledge with the community
            </p>
          </div>
          
          {/* Content type selector */}
          <Tabs 
            defaultValue={ContentType.QUESTION} 
            value={contentType}
            onValueChange={setContentType}
            className="w-full"
          >
            <TabsList className="grid grid-cols-4 mb-8">
              <TabsTrigger value={ContentType.QUESTION}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Question
              </TabsTrigger>
              
              <TabsTrigger value={ContentType.ARTICLE}>
                <BookOpen className="h-4 w-4 mr-2" />
                Article
              </TabsTrigger>
              
              <TabsTrigger value={ContentType.QUOTE}>
                <Quote className="h-4 w-4 mr-2" />
                Quote
              </TabsTrigger>
              
              <TabsTrigger value={ContentType.POLL}>
                <BarChart2 className="h-4 w-4 mr-2" />
                Poll
              </TabsTrigger>
            </TabsList>
            
            {/* Question form */}
            <TabsContent value={ContentType.QUESTION}>
              <Card>
                <CardHeader>
                  <CardTitle>Ask a Question</CardTitle>
                  <CardDescription>
                    Share a question with the community to get answers and insights
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <QuestionForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Article form */}
            <TabsContent value={ContentType.ARTICLE}>
              <Card>
                <CardHeader>
                  <CardTitle>Write an Article</CardTitle>
                  <CardDescription>
                    Share your knowledge and insights with the community
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <ArticleForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Quote form */}
            <TabsContent value={ContentType.QUOTE}>
              <Card>
                <CardHeader>
                  <CardTitle>Share a Quote</CardTitle>
                  <CardDescription>
                    Share an inspiring quote with the community
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <QuoteForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Poll form */}
            <TabsContent value={ContentType.POLL}>
              <Card>
                <CardHeader>
                  <CardTitle>Create a Poll</CardTitle>
                  <CardDescription>
                    Get opinions from the community on a topic
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <PollForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Shell>
  );
};

export default ContentCreator;
