
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Shell } from '@/components/layout/Shell';
import { useKnowledgeBase } from '@/hooks/useKnowledgeBase';
import { useToast } from '@/hooks/use-toast';
import { 
  ChevronLeft,
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
import { Steps, Step } from '@/components/ui/steps';

import { QuestionForm } from '@/components/knowledge/forms/QuestionForm';
import { ArticleForm } from '@/components/knowledge/forms/ArticleForm';
import { QuoteForm } from '@/components/knowledge/forms/QuoteForm';
import { PollForm } from '@/components/knowledge/forms/PollForm';
import { ReviewContent } from '@/components/knowledge/ReviewContent';
import { ContentType } from '@/models/knowledgeTypes';

type PostType = 'question' | 'quote' | 'poll' | 'article';

const PostWizard = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  
  // Get type from URL parameters
  const typeFromUrl = searchParams.get('type') as PostType | null;
  const [postType, setPostType] = useState<PostType | null>(typeFromUrl);
  
  const { isSubmitting, createArticle } = useKnowledgeBase();
  const [formData, setFormData] = useState<any>(null);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  
  // Redirect to type selector if no type is provided
  useEffect(() => {
    if (!typeFromUrl) {
      navigate('/knowledge/create');
    } else {
      setPostType(typeFromUrl);
    }
  }, [typeFromUrl, navigate]);
  
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
      case 'question': return <MessageSquare className="h-5 w-5 text-cyan-400" />;
      case 'quote': return <Quote className="h-5 w-5 text-cyan-400" />;
      case 'poll': return <BarChart2 className="h-5 w-5 text-cyan-400" />;
      case 'article': return <BookOpen className="h-5 w-5 text-cyan-400" />;
      default: return null;
    }
  };
  
  // Standardized to always use exactly 2 steps
  const getSteps = () => {
    return ['Content & Tags', 'Review & Submit'];
  };
  
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
      // Back to type selection
      navigate('/knowledge/create');
    }
  };
  
  const handleSubmit = async (data: any) => {
    try {
      if (currentStep === 1) {
        // Store form data and advance to next step if not on final step
        setFormData(data);
        handleNext();
        return;
      }

      // Prevent double submissions
      if (isSubmittingForm) return;
      setIsSubmittingForm(true);

      // On final step, submit the form data
      const finalData = {
        ...formData, // Use stored data from first step
        ...data, // Merge with any data from current step
        content_type: getContentType()
      };
      
      console.log('Submitting form data:', { type: postType, data: finalData });
      
      // Submit to backend based on the post type
      await createArticle(finalData);
      
      toast({
        title: "Success!",
        description: "Your post has been published",
      });
      
      // Add a slight delay before redirecting to ensure the data is saved
      // and to give the user time to see the success message
      setTimeout(() => {
        navigate('/knowledge');
      }, 1000);
    } catch (error) {
      console.error('Error submitting post:', error);
      toast({
        title: "Error",
        description: "There was a problem publishing your post",
        variant: "destructive"
      });
      setIsSubmittingForm(false);
    }
  };
  
  // If still loading or no post type, show loading state
  if (!postType) {
    return (
      <Shell>
        <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p>Redirecting to post type selector...</p>
          </div>
        </div>
      </Shell>
    );
  }
  
  return (
    <Shell>
      <div className="container mx-auto px-4 py-6">
        {/* Navigation */}
        <div className="mb-6">
          <Button variant="ghost" className="pl-0" onClick={handleBack}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            {currentStep === 1 ? 'Back to Type Selection' : 'Back'}
          </Button>
        </div>
        
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex items-center gap-3">
            {getPostTypeIcon()}
            <h1 className="text-3xl font-bold tracking-tight">{getPostTypeTitle()}</h1>
          </div>
          
          {/* Steps Indicator */}
          <div className="mb-8">
            <Steps currentStep={currentStep} steps={getSteps()} />
          </div>
          
          {/* Form Card */}
          <Card>
            <CardHeader>
              <CardTitle>{getSteps()[currentStep - 1]}</CardTitle>
              <CardDescription>
                {currentStep === 2
                  ? "Review your content before publishing"
                  : "Complete the information below"}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {/* Show appropriate form based on post type and step */}
              {currentStep === 2 && (
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
                  isSubmitting={isSubmitting}
                  step={currentStep}
                  initialData={formData}
                />
              )}
              
              {currentStep === 1 && postType === 'quote' && (
                <QuoteForm 
                  onSubmit={handleSubmit} 
                  isSubmitting={isSubmitting} 
                  step={currentStep}
                  initialData={formData}
                />
              )}
              
              {currentStep === 1 && postType === 'poll' && (
                <PollForm 
                  onSubmit={handleSubmit} 
                  isSubmitting={isSubmitting}
                  step={currentStep}
                  initialData={formData}
                />
              )}
              
              {currentStep === 1 && postType === 'article' && (
                <ArticleForm 
                  onSubmit={handleSubmit} 
                  isSubmitting={isSubmitting}
                  step={currentStep}
                  initialData={formData}
                />
              )}
            </CardContent>
            
            <CardFooter className="flex justify-between border-t pt-6">
              <Button variant="outline" onClick={handleBack}>
                {currentStep === 1 ? 'Change Type' : 'Back'}
              </Button>
              
              {currentStep === 1 && (
                <Button type="submit" form="content-form">Next Step</Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </Shell>
  );
};

export default PostWizard;
