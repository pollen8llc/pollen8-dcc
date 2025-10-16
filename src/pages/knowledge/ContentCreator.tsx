
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shell } from '@/components/layout/Shell';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { usePermissions } from '@/hooks/usePermissions';
import {
  PlusCircle,
  BookOpen
} from 'lucide-react';

// UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Cultiva8OnlyNavigation } from '@/components/knowledge/Cultiva8OnlyNavigation';

// Content Type Selector
import { ContentTypeSelector } from '@/components/knowledge/ContentTypeSelector';

// Types
import { ContentType } from '@/models/knowledgeTypes';

const ContentCreator = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const { checkPermission } = usePermissions(currentUser);
  const [selectedType, setSelectedType] = useState<string>('all');
  
  // Filter content types based on permissions
  const isAdmin = checkPermission('knowledge', 'manage_content_types');
  const availableTypes = isAdmin 
    ? ['all', 'question', 'article', 'quote', 'poll'] 
    : ['all', 'article', 'poll']; // Default: only articles and polls for non-admins
  
  const handleTypeChange = (type: string) => {
    setSelectedType(type);
  };
  
  const handleCreateContent = () => {
    if (selectedType && selectedType !== 'all') {
      navigate(`/knowledge/create/${selectedType}`);
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
          <Cultiva8OnlyNavigation />
        </div>
        
        <div className="max-w-3xl mx-auto">
          {/* Page title */}
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <PlusCircle className="h-8 w-8 text-primary" />
              <div>
                <p className="text-muted-foreground">Share your knowledge with the community</p>
              </div>
            </div>
          </div>
          
          {/* Content type selection */}
          <Card>
            <CardHeader>
              <CardTitle>What type of content would you like to create?</CardTitle>
            </CardHeader>
            
            <CardContent>
              <ContentTypeSelector 
                selected={selectedType} 
                onChange={handleTypeChange}
                availableTypes={availableTypes}
              />
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
