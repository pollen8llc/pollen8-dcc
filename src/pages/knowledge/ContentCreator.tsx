
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shell } from '@/components/layout/Shell';
import { useToast } from '@/hooks/use-toast';
import {
  ChevronLeft,
  PlusCircle,
  BookOpen
} from 'lucide-react';

// UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

// Content Type Selector
import { ContentTypeSelector } from '@/components/knowledge/ContentTypeSelector';

// Types
import { ContentType } from '@/models/knowledgeTypes';

const ContentCreator = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedType, setSelectedType] = useState<string>('all');
  
  const handleTypeChange = (type: string) => {
    setSelectedType(type);
  };
  
  const handleCreateContent = () => {
    if (selectedType && selectedType !== 'all') {
      navigate(`/knowledge/create/${selectedType.toLowerCase()}`);
    } else {
      toast({
        title: "Select a content type",
        description: "Please select a specific content type to proceed",
      });
    }
  };
  
  const handleBrowseTopics = () => {
    navigate('/knowledge/topics');
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
              <ContentTypeSelector selected={selectedType} onChange={handleTypeChange} />
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline"
                onClick={handleBrowseTopics}
                className="flex items-center gap-2"
              >
                <BookOpen className="h-4 w-4" />
                Browse Topics
              </Button>
              
              <Button 
                onClick={handleCreateContent} 
                className="flex items-center gap-2"
                disabled={selectedType === 'all'}
              >
                <PlusCircle className="h-4 w-4" />
                {selectedType === 'all' ? 'Select a content type' : `Create ${selectedType}`}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Shell>
  );
};

export default ContentCreator;
