
import React, { useState, KeyboardEvent, useRef, useEffect } from 'react';
import { X, Tag as TagIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { KnowledgeTag } from '@/models/knowledgeTypes';

interface TagInputFieldProps {
  value: string[];
  onChange: (value: string[]) => void;
  availableTags?: string[];
  placeholder?: string;
  maxTags?: number;
}

export const TagInputField: React.FC<TagInputFieldProps> = ({ 
  value, 
  onChange, 
  availableTags = [],
  placeholder = "Add tags...",
  maxTags = 5
}) => {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [dbTags, setDbTags] = useState<string[]>([]);
  const [popularTags, setPopularTags] = useState<Set<string>>(new Set());
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Fetch tags from database
  useEffect(() => {
    const fetchTags = async () => {
      const { data } = await supabase
        .from('knowledge_tags')
        .select('name, count')
        .order('count', { ascending: false });
        
      if (data) {
        const tagNames = data.map(tag => tag.name);
        setDbTags(tagNames);
        
        // Determine popular tags (top 25%)
        const popularThreshold = Math.ceil(data.length / 4);
        const popularTagSet = new Set(
          data.slice(0, popularThreshold).map(tag => tag.name)
        );
        setPopularTags(popularTagSet);
      }
    };
    
    fetchTags();
  }, []);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const trimmedInput = input.trim();
    
    // If Enter or comma is pressed
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      
      // Check if there's valid input and we haven't reached max tags
      if (trimmedInput && value.length < maxTags) {
        // Check if tag doesn't already exist
        if (!value.includes(trimmedInput)) {
          onChange([...value, trimmedInput]);
          setInput('');
          setSuggestions([]);
        }
      }
    }
    
    // If Backspace is pressed and input is empty, remove the last tag
    if (e.key === 'Backspace' && input === '' && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newInput = e.target.value;
    setInput(newInput);
    
    // Show suggestions only if input is not empty
    if (newInput.trim()) {
      // Prioritize database tags, then fallback to props tags
      const availableTagsToUse = dbTags.length > 0 ? dbTags : availableTags;
      
      const filtered = availableTagsToUse.filter(
        tag => tag.toLowerCase().includes(newInput.toLowerCase()) && !value.includes(tag)
      );
      setSuggestions(filtered.slice(0, 5)); // Limit to 5 suggestions
    } else {
      setSuggestions([]);
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter(tag => tag !== tagToRemove));
  };

  const addSuggestion = (suggestion: string) => {
    if (!value.includes(suggestion) && value.length < maxTags) {
      onChange([...value, suggestion]);
      setInput('');
      setSuggestions([]);
    }
  };

  return (
    <div className="w-full space-y-2">
      {/* Tags display */}
      <div className="flex flex-wrap gap-2 mb-2">
        {value.map(tag => (
          <Badge 
            key={tag} 
            variant={popularTags.has(tag) ? "popularTag" : "tag"}
            className="flex items-center gap-1 py-1.5 px-3 text-sm transition-all"
          >
            <TagIcon className="h-3.5 w-3.5 mr-1 opacity-70" />
            {tag}
            <X 
              className="h-3.5 w-3.5 ml-1 cursor-pointer hover:text-destructive" 
              onClick={() => removeTag(tag)}
            />
          </Badge>
        ))}
      </div>
      
      {/* Input */}
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          placeholder={value.length === 0 ? placeholder : value.length >= maxTags ? "Max tags reached" : placeholder}
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          disabled={value.length >= maxTags}
          className="w-full"
        />
        
        {/* Suggestions dropdown */}
        {suggestions.length > 0 && (
          <div className="absolute z-10 mt-1 w-full bg-popover border rounded-md shadow-md py-1">
            {suggestions.map(suggestion => (
              <div
                key={suggestion}
                className="flex items-center px-3 py-1.5 cursor-pointer hover:bg-muted text-sm"
                onClick={() => addSuggestion(suggestion)}
              >
                <TagIcon className="h-3.5 w-3.5 mr-2 opacity-70" />
                <span className={popularTags.has(suggestion) ? "text-[#00eada]" : ""}>
                  {suggestion}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <p className="text-xs text-muted-foreground">
        Press Enter or comma to add a tag. {maxTags - value.length} tags remaining.
      </p>
    </div>
  );
};
