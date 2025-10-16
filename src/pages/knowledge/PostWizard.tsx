
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { useKnowledgeBase } from '@/hooks/useKnowledgeBase';
import { useToast } from '@/hooks/use-toast';
import { 
  BookOpen,
  MessageSquare,
  Quote,
  BarChart2,
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Cultiva8OnlyNavigation } from '@/components/knowledge/Cultiva8OnlyNavigation';

import { QuestionForm } from '@/components/knowledge/forms/QuestionForm';
import { ArticleForm } from '@/components/knowledge/forms/ArticleForm';
import { QuoteForm } from '@/components/knowledge/forms/QuoteForm';
import { PollForm } from '@/components/knowledge/forms/PollForm';
import { ReviewContent } from '@/components/knowledge/ReviewContent';
import { ContentType } from '@/models/knowledgeTypes';

type PostType = 'question' | 'quote' | 'poll' | 'article';

const PostWizard = () => {
  const navigate = useNavigate();
  const { type } = useParams<{ type: string }>();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  
  // Get type from URL parameters and validate it
  const postType = type as PostType | undefined;
  const validTypes: PostType[] = ['question', 'quote', 'poll', 'article'];
  
  const { isSubmitting, useCreateArticle } = useKnowledgeBase();
  const createArticleMutation = useCreateArticle();
  const [formData, setFormData] = useState<any>(null);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  
  // Redirect to type selector if no type is provided or invalid type
  useEffect(() => {
    if (!type || !validTypes.includes(type as PostType)) {
      navigate('/knowledge/create');
    }
  }, [type, navigate]);
  
  const getPostTypeTitle = () => {
    switch (postType) {
      case 'question': return 'Ask a Question';
      case 'quote': return 'Share a Quote';
      case 'poll': return 'Create a Poll';
      case 'article': return 'Write an Article';
      default: return 'Create Content';
    }
  };
  
  const getPostTypeIcon = () => {
    switch (postType) {
      case 'question': return <MessageSquare className="h-5 w-5 text-primary" />;
      case 'quote': return <Quote className="h-5 w-5 text-primary" />;
      case 'poll': return <BarChart2 className="h-5 w-5 text-primary" />;
      case 'article': return <BookOpen className="h-5 w-5 text-primary" />;
      default: return null;
    }
  };
  
  const getSteps = () => {
    return ['Content & Tags', 'Review & Submit'];
  };
  
  // Progress value for the wizard (acts like a loading bar)
  const getProgressValue = () => (currentStep === 1 ? 50 : 100);
  const getContentType = (): ContentType => {
    switch (postType) {
      case 'question': return ContentType.QUESTION;
      case 'quote': return ContentType.QUOTE;
      case 'poll': return ContentType.POLL;
      case 'article': return ContentType.ARTICLE;
      default: return ContentType.ARTICLE;
    }
  };
  
  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate('/knowledge/create');
    }
  };
  
  const handleSubmit = async (data: any) => {
    try {
      console.log('Form submission data:', data);
      
      if (currentStep === 1) {
        // Store form data and advance to next step
        console.log('Storing form data for step 1:', data);
        setFormData(data);
        handleNext();
        return;
      }

      // Prevent double submissions
      if (isSubmittingForm) return;
      setIsSubmittingForm(true);

      // Final submission - merge stored data with current data and add content type
      const mergedData = {
        ...formData,
        ...data,
      };
      
      // Transform data based on content type
      const finalData: any = {
        content_type: getContentType()
      };
      
      // Map fields based on post type
      if (postType === 'poll') {
        finalData.title = mergedData.question; // Map question to title
        finalData.content = mergedData.question; // Use question as content
        finalData.options = {
          options: mergedData.options,
          allowMultipleSelections: mergedData.allowMultipleSelections || false,
          duration: mergedData.duration || "7"
        };
        finalData.tags = mergedData.tags;
      } else if (postType === 'question') {
        finalData.title = mergedData.title; // Question form already uses 'title'
        finalData.content = mergedData.content; // Question form already uses 'content'
        finalData.tags = mergedData.tags;
      } else if (postType === 'quote') {
        finalData.title = `Quote by ${mergedData.author}`; // Create title from author
        finalData.content = mergedData.quote + (mergedData.context ? `\n\n${mergedData.context}` : ''); // Combine quote and context
        finalData.subtitle = mergedData.author;
        finalData.tags = mergedData.tags;
      } else {
        // Article - use as is
        finalData.title = mergedData.title;
        finalData.subtitle = mergedData.subtitle;
        finalData.content = mergedData.content;
        finalData.tags = mergedData.tags;
      }
      
      console.log('Final submission data with content type:', finalData);
      
      await createArticleMutation.mutateAsync(finalData);
      
      // Clear the draft on successful creation
      localStorage.removeItem('knowledge-article-draft');
      
      toast({
        title: "Success!",
        description: `Your ${postType} has been published`,
      });
      
      setTimeout(() => {
        navigate('/knowledge');
      }, 1000);
      
    } catch (error) {
      console.error('Error submitting post:', error);
      toast({
        title: "Error",
        description: `There was a problem publishing your ${postType}`,
        variant: "destructive"
      });
    } finally {
      setIsSubmittingForm(false);
    }
  };
  
  // Loading state or invalid type
  if (!postType || !validTypes.includes(postType)) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Navbar />
      
      <div className="container mx-auto px-4 py-4 sm:py-6">
        {/* Navigation */}
        <div className="mb-4 sm:mb-6">
          <Cultiva8OnlyNavigation />
        </div>
        
        <div className="max-w-3xl mx-auto animate-fade-in">
          {/* Header */}
          <div className="mb-6 sm:mb-8 flex items-center gap-3 animate-fade-in">
            {getPostTypeIcon()}
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{getPostTypeTitle()}</h1>
          </div>
          
          {/* Progress Indicator */}
          <div className="mb-6 sm:mb-8 animate-fade-in">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs sm:text-sm text-muted-foreground">Step {currentStep} of 2</span>
              <span className="text-xs sm:text-sm text-muted-foreground">{getSteps()[currentStep - 1]}</span>
            </div>
            <Progress value={getProgressValue()} indicatorClassName="bg-primary" />
          </div>
          
          {/* Form Card */}
          <Card className="border-0 bg-card/50 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle>{getSteps()[currentStep - 1]}</CardTitle>
              <CardDescription>
                {currentStep === 2
                  ? "Review your content before publishing"
                  : "Complete the information below"}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {currentStep === 2 && formData && (
                <ReviewContent 
                  formData={formData} 
                  contentType={getContentType()} 
                  onSubmit={handleSubmit}
                  isSubmitting={isSubmitting || isSubmittingForm}
                />
              )}
              
              {currentStep === 1 && postType === 'question' && (
                <QuestionForm 
                  onSubmit={handleSubmit} 
                  isSubmitting={false}
                  step={1}
                  initialData={null}
                />
              )}
              
              {currentStep === 1 && postType === 'quote' && (
                <QuoteForm 
                  onSubmit={handleSubmit} 
                  isSubmitting={false} 
                  step={1}
                  initialData={null}
                />
              )}
              
              {currentStep === 1 && postType === 'poll' && (
                <PollForm 
                  onSubmit={handleSubmit} 
                  isSubmitting={false}
                  step={1}
                  initialData={null}
                />
              )}
              
              {currentStep === 1 && postType === 'article' && (
                <ArticleForm 
                  onSubmit={handleSubmit} 
                  isSubmitting={false}
                  step={1}
                  initialData={null}
                />
              )}
            </CardContent>
            
            <CardFooter className="flex justify-between border-t pt-6 sticky bottom-0 bg-card/80 backdrop-blur-sm z-10">
              <Button variant="outline" onClick={handleBack}>
                {currentStep === 1 ? 'Change Type' : 'Back'}
              </Button>
              
              {currentStep === 1 && (
                <Button type="submit" form="content-form">
                  Next Step
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PostWizard;
