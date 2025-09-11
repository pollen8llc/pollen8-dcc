import { useState, useCallback, useRef, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TagInputFieldProps {
  tags?: string[];
  value?: string[];
  onChange: (tags: string[]) => void;
  maxTags?: number;
  placeholder?: string;
  className?: string;
  availableTags?: string[];
}

export function TagInputField({
  tags: propTags,
  value: propValue,
  onChange,
  maxTags = 10,
  placeholder = "Add tags...",
  className,
  availableTags = []
}: TagInputFieldProps) {
  const tags = propTags || propValue || [];
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mock popular tags for now
  const popularTags = new Set(['React', 'TypeScript', 'JavaScript', 'Supabase', 'Next.js']);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);

    if (value.length > 1) {
      // Mock suggestions
      const mockSuggestions = Array.from(popularTags)
        .filter(tag => tag.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 5);
      setSuggestions(mockSuggestions);
    } else {
      setSuggestions([]);
    }
  }, []);

  const addTag = useCallback((tagName: string) => {
    const trimmedTag = tagName.trim();
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < maxTags) {
      onChange([...tags, trimmedTag]);
    }
    setInput('');
    setSuggestions([]);
    inputRef.current?.focus();
  }, [tags, onChange, maxTags]);

  const removeTag = useCallback((tagToRemove: string) => {
    onChange(tags.filter(tag => tag !== tagToRemove));
  }, [tags, onChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (input.trim()) {
        addTag(input);
      }
    } else if (e.key === 'Backspace' && !input && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  }, [input, tags, addTag, removeTag]);

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center gap-2 flex-wrap p-2 border rounded-md focus-within:ring-2 focus-within:ring-ring">
        {tags.map((tag, index) => (
          <Badge key={index} variant="secondary" className="text-xs">
            <Tag className="w-3 h-3 mr-1" />
            {tag}
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 ml-1 hover:bg-destructive hover:text-destructive-foreground"
              onClick={() => removeTag(tag)}
            >
              <X className="w-3 h-3" />
            </Button>
          </Badge>
        ))}
        
        <Input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={tags.length < maxTags ? placeholder : "Max tags reached"}
          disabled={tags.length >= maxTags}
          className="border-0 bg-transparent p-0 h-auto focus-visible:ring-0 flex-1 min-w-[120px]"
        />
      </div>

      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-1">
          <span className="text-xs text-muted-foreground mr-2">Suggestions:</span>
          {suggestions.map((suggestion, index) => (
            <Badge
              key={index}
              variant="outline"
              className="cursor-pointer text-xs hover:bg-muted"
              onClick={() => addTag(suggestion)}
            >
              {suggestion}
            </Badge>
          ))}
        </div>
      )}

      <div className="text-xs text-muted-foreground">
        {tags.length}/{maxTags} tags
      </div>
    </div>
  );
}