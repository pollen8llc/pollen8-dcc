
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useKnowledgeBase } from '@/hooks/useKnowledgeBase';
import { ContentType, KnowledgeArticle } from '@/models/knowledgeTypes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ArticleFormProps {
  initialArticle?: KnowledgeArticle;
  onSuccess?: () => void;
}

const ArticleForm: React.FC<ArticleFormProps> = ({ initialArticle, onSuccess }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { createArticle, updateArticle, isSubmitting } = useKnowledgeBase();
  
  const [title, setTitle] = useState(initialArticle?.title || '');
  const [content, setContent] = useState(initialArticle?.content || '');
  const [tags, setTags] = useState(initialArticle?.tags || []);
  const [newTag, setNewTag] = useState('');
  
  useEffect(() => {
    if (initialArticle) {
      setTitle(initialArticle.title);
      setContent(initialArticle.content);
      setTags(initialArticle.tags);
    }
  }, [initialArticle]);
  
  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    try {
      if (initialArticle) {
        // Update existing article
        await updateArticle({
          ...initialArticle,
          title,
          content,
          tags
        });
        toast({
          title: "Article updated",
          description: "Your article has been updated successfully",
        });
      } else {
        // Create new article
        const newArticle = {
          title,
          content,
          tags,
          content_type: ContentType.ARTICLE,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user_id: '', // Will be set by the backend based on the authenticated user
          view_count: 0,
          like_count: 0,
          is_pinned: false,
          is_answered: false,
          vote_count: 0,
        };
        
        await createArticle(newArticle);
        toast({
          title: "Article created",
          description: "Your article has been published successfully",
        });
        
        // Reset form
        setTitle('');
        setContent('');
        setTags([]);
      }
      
      if (onSuccess) {
        onSuccess();
      } else {
        // Navigate to the knowledge base landing page
        navigate('/core');
      }
    } catch (error: any) {
      console.error('Error saving article:', error);
      toast({
        title: "Error saving article",
        description: error.message || "An unknown error occurred",
        variant: "destructive",
      });
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter article title"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your article content here..."
          rows={8}
          required
        />
      </div>
      
      <div>
        <Label>Tags</Label>
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            placeholder="Add a tag"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddTag();
              }
            }}
          />
          <Button type="button" size="sm" onClick={handleAddTag}>
            Add Tag
          </Button>
        </div>
        <div className="flex flex-wrap mt-2 gap-1">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="gap-x-2">
              {tag}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleRemoveTag(tag)}
              />
            </Badge>
          ))}
        </div>
      </div>
      
      <div className="flex justify-between">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : initialArticle ? 'Update Article' : 'Create Article'}
        </Button>
      </div>
    </form>
  );
};

export default ArticleForm;
