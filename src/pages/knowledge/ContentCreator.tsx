
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shell } from '@/components/layout/Shell';
import { useToast } from '@/hooks/use-toast';
import {
  ChevronLeft,
  PlusCircle
} from 'lucide-react';

// UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

// Content Type Selector (Add this import)
import { ContentTypeSelector } from '@/components/knowledge/ContentTypeSelector';

// Types
import { ContentType } from '@/models/knowledgeTypes';

const ContentCreator = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleCreateContent = (type: string) => {
    navigate(`/knowledge/post/new?type=${type.toLowerCase()}`);
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
          
          {/* Content type selection */}
          <Card>
            <CardHeader>
              <CardTitle>What type of content would you like to create?</CardTitle>
            </CardHeader>
            
            <CardContent>
              <ContentTypeSelector onSelectType={handleCreateContent} />
            </CardContent>
            
            <CardFooter className="flex justify-end">
              <Button 
                onClick={() => navigate('/knowledge/post/new')} 
                className="flex items-center gap-2"
              >
                <PlusCircle className="h-4 w-4" />
                Create Custom Content
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Shell>
  );
};

export default ContentCreator;
