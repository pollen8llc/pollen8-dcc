
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare, Quote, BarChart2, BookOpen, X } from 'lucide-react';

interface CreatePostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectType: (type: 'question' | 'quote' | 'poll' | 'article') => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  open,
  onOpenChange,
  onSelectType
}) => {
  const postTypes = [
    {
      id: 'question',
      title: 'Question',
      description: 'Ask a specific question to get help from the community',
      icon: MessageSquare,
      color: 'text-cyan-400'
    },
    {
      id: 'quote',
      title: 'Quote',
      description: 'Share an insightful quote and start a discussion',
      icon: Quote,
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
    }
  ] as const;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl">Create New Post</DialogTitle>
          <DialogDescription>
            Select the type of post you want to create
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          {postTypes.map((type) => {
            const Icon = type.icon;
            return (
              <Card 
                key={type.id} 
                className="cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => onSelectType(type.id)}
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

        <div className="flex justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
