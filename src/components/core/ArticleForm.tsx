
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useKnowledgeBase } from '@/hooks/useKnowledgeBase';
import { KnowledgeArticle } from '@/models/knowledgeTypes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, PlusCircle, Save, ArrowLeft, Eye, Edit } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TiptapEditor } from '@/components/ui/tiptap-editor';
import DOMPurify from 'dompurify';

interface ArticleFormProps {
  article?: KnowledgeArticle;
  mode: 'create' | 'edit';
}

const ArticleForm: React.FC<ArticleFormProps> = ({ article, mode }) => {
  const navigate = useNavigate();
  const { useTags, createArticle, updateArticle, isSubmitting } = useKnowledgeBase();
  
  // Form state
  const [title, setTitle] = useState(article?.title || '');
  const [content, setContent] = useState(article?.content || '');
  const [tags, setTags] = useState<string[]>(article?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [activeTab, setActiveTab] = useState<string>("editor");
  
  // Fetch existing tags for suggestions
  const { data: existingTags } = useTags();
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const validationErrors: { [key: string]: string } = {};
    if (!title.trim()) validationErrors.title = 'Title is required';
    if (!content.trim()) validationErrors.content = 'Content is required';
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    try {
      // Sanitize HTML content before submission
      const sanitizedContent = DOMPurify.sanitize(content);
      
      const articleData = {
        title: title.trim(),
        content: sanitizedContent,
        tags
      };
      
      if (mode === 'create') {
        await createArticle(articleData);
        navigate('/core');
      } else if (mode === 'edit' && article) {
        // Fix: Pass article and new data as one object
        await updateArticle({
          ...article,
          ...articleData
        });
        navigate(`/core/articles/${article.id}`);
      }
    } catch (error) {
      console.error('Error submitting article:', error);
    }
  };
  
  // Handle adding a tag
  const handleAddTag = () => {
    const trimmedTag = tagInput.trim().toLowerCase();
    if (!trimmedTag) return;
    
    if (tags.includes(trimmedTag)) {
      setTagInput('');
      return;
    }
    
    setTags([...tags, trimmedTag]);
    setTagInput('');
  };
  
  // Handle removing a tag
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  // Handle tag selection from dropdown
  const handleTagSelect = (value: string) => {
    if (!tags.includes(value)) {
      setTags([...tags, value]);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6">
        <Button 
          type="button" 
          variant="ghost" 
          className="pl-0"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Go Back
        </Button>
      </div>
      
      <div className="space-y-6">
        {/* Title */}
        <div>
          <Label htmlFor="title" className="text-base">Article Title</Label>
          <Input
            id="title"
            placeholder="Enter article title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errors.title) setErrors({ ...errors, title: '' });
            }}
            className={errors.title ? 'border-red-500' : ''}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-500">{errors.title}</p>
          )}
        </div>
        
        {/* Tags */}
        <div>
          <Label className="text-base">Tags</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map(tag => (
              <Badge key={tag} className="flex items-center gap-1 bg-royal-blue-100 text-royal-blue-900 dark:bg-royal-blue-900 dark:text-royal-blue-100 hover:bg-royal-blue-200 dark:hover:bg-royal-blue-800">
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1 rounded-full p-0.5 hover:bg-royal-blue-200 dark:hover:bg-royal-blue-800"
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove tag {tag}</span>
                </button>
              </Badge>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Input
              placeholder="Add a tag"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
              className="flex-1"
            />
            
            <Button 
              type="button" 
              onClick={handleAddTag} 
              variant="outline"
              className="shrink-0"
              disabled={!tagInput.trim()}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add
            </Button>
            
            <Select onValueChange={handleTagSelect}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Popular tags" />
              </SelectTrigger>
              <SelectContent>
                {existingTags?.map(tag => (
                  <SelectItem 
                    key={tag.id} 
                    value={tag.name}
                    disabled={tags.includes(tag.name)}
                  >
                    {tag.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Content */}
        <div>
          <Label htmlFor="content-editor" className="text-base">Article Content</Label>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex justify-between items-center mb-2">
              <TabsList>
                <TabsTrigger value="editor" className="flex items-center">
                  <Edit className="h-4 w-4 mr-2" />
                  Editor
                </TabsTrigger>
                <TabsTrigger value="preview" className="flex items-center">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="editor">
              <Card>
                <CardContent className="p-4">
                  <TiptapEditor 
                    content={content} 
                    onChange={setContent}
                    className="min-h-[400px]"
                    placeholder="Write your article content here..."
                  />
                  {errors.content && (
                    <p className="mt-1 text-sm text-red-500">{errors.content}</p>
                  )}
                </CardContent>
                <CardFooter className="text-xs text-muted-foreground bg-muted/40 rounded-b-lg py-2 px-4">
                  <p>Use the toolbar to format your content</p>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="preview">
              <Card>
                <CardContent className="py-4">
                  {content ? (
                    <div 
                      className="prose dark:prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }}
                    />
                  ) : (
                    <div className="text-muted-foreground italic p-4 text-center">
                      No content to preview
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Actions */}
        <div className="flex justify-between">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          
          <Button 
            type="submit" 
            className="bg-royal-blue-600 hover:bg-royal-blue-700"
            disabled={isSubmitting}
          >
            <Save className="h-4 w-4 mr-2" />
            {isSubmitting 
              ? mode === 'create' ? 'Creating...' : 'Updating...'
              : mode === 'create' ? 'Create Article' : 'Update Article'
            }
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ArticleForm;
