
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { CreatePostModal } from '@/components/knowledge/CreatePostModal';

type PostType = 'question' | 'quote' | 'poll' | 'article';

interface PostWizardProps {
  initialType?: PostType;
}

const PostWizard: React.FC<PostWizardProps> = ({ initialType }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [postType, setPostType] = useState<PostType | null>(initialType || null);
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(!initialType);
  const { isSubmitting } = useKnowledgeBase();
  
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
  
  const getSteps = () => {
    const commonSteps = ['Content', 'Review & Submit'];
    
    switch (postType) {
      case 'poll':
        return ['Basic Information', 'Poll Options', ...commonSteps];
      case 'article':
        return ['Basic Information', 'Content Editor', ...commonSteps];
      default:
        return ['Content Details', ...commonSteps];
    }
  };
  
  const handleNext = () => {
    if (currentStep < getSteps().length) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      // Back to type selection
      setPostType(null);
      setIsTypeModalOpen(true);
    }
  };
  
  const handleSubmit = async (formData: any) => {
    try {
      console.log('Submitting form data:', { type: postType, data: formData });
      
      toast({
        title: "Success!",
        description: "Your post has been published",
      });
      
      navigate('/knowledge');
    } catch (error) {
      console.error('Error submitting post:', error);
      toast({
        title: "Error",
        description: "There was a problem publishing your post",
        variant: "destructive"
      });
    }
  };
  
  // If no post type is selected yet, show only the modal
  if (!postType) {
    return (
      <Shell>
        <CreatePostModal 
          open={isTypeModalOpen} 
          onOpenChange={setIsTypeModalOpen} 
          onSelectType={(type) => {
            setPostType(type);
            setIsTypeModalOpen(false);
          }}
        />
        
        <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[60vh]">
          <Button
            variant="outline"
            onClick={() => setIsTypeModalOpen(true)}
            className="flex items-center gap-2"
          >
            Select Post Type
          </Button>
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
                {currentStep === getSteps().length 
                  ? "Review your content before publishing"
                  : "Complete the information below"}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {/* Show appropriate form based on post type and step */}
              {postType === 'question' && (
                <QuestionForm 
                  onSubmit={handleSubmit} 
                  isSubmitting={isSubmitting}
                  step={currentStep}
                />
              )}
              
              {postType === 'quote' && (
                <QuoteForm 
                  onSubmit={handleSubmit} 
                  isSubmitting={isSubmitting} 
                  step={currentStep}
                />
              )}
              
              {postType === 'poll' && (
                <PollForm 
                  onSubmit={handleSubmit} 
                  isSubmitting={isSubmitting}
                  step={currentStep}
                />
              )}
              
              {postType === 'article' && (
                <ArticleForm 
                  onSubmit={handleSubmit} 
                  isSubmitting={isSubmitting}
                  step={currentStep}
                />
              )}
            </CardContent>
            
            <CardFooter className="flex justify-between border-t pt-6">
              <Button variant="outline" onClick={handleBack}>
                {currentStep === 1 ? 'Change Type' : 'Back'}
              </Button>
              
              <div className="flex gap-3">
                {currentStep < getSteps().length ? (
                  <Button onClick={handleNext}>Next Step</Button>
                ) : (
                  <Button type="submit" form="content-form" disabled={isSubmitting}>
                    {isSubmitting ? 'Publishing...' : 'Publish'}
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Shell>
  );
};

export default PostWizard;
