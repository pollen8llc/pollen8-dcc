import React, { useState, useRef, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Avatar } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useUserSearch } from '@/hooks/knowledge/useEnhancedComments';

interface MentionUser {
  id: string;
  name: string;
  username: string;
  avatar_url?: string;
}

interface MentionInputProps {
  value: string;
  onChange: (value: string, mentions: string[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const MentionInput: React.FC<MentionInputProps> = ({
  value,
  onChange,
  placeholder,
  className,
  disabled
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<MentionUser[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mentionStart, setMentionStart] = useState<number | null>(null);
  const [mentions, setMentions] = useState<string[]>([]);
  const { searchUsers } = useUserSearch();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);


  const handleTextChange = async (newValue: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const cursorPos = textarea.selectionStart;
    const textBeforeCursor = newValue.slice(0, cursorPos);
    const lastAtIndex = textBeforeCursor.lastIndexOf('@');

    if (lastAtIndex !== -1) {
      const afterAt = textBeforeCursor.slice(lastAtIndex + 1);
      
      // Check if we're in a mention context (no spaces after @)
      if (!afterAt.includes(' ') && afterAt.length >= 0) {
        setMentionStart(lastAtIndex);
        
        if (afterAt.length >= 1) {
          const users = await searchUsers(afterAt);
          setSuggestions(users);
          setShowSuggestions(users.length > 0);
          setSelectedIndex(0);
        } else {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      } else {
        setShowSuggestions(false);
        setMentionStart(null);
      }
    } else {
      setShowSuggestions(false);
      setMentionStart(null);
    }

    // Extract mentioned usernames from the text
    const mentionRegex = /@\[([^\]]+)\]\(([^)]+)\)/g;
    const extractedMentions: string[] = [];
    let match;
    
    while ((match = mentionRegex.exec(newValue)) !== null) {
      extractedMentions.push(match[2]); // The username is in the second capture group
    }
    
    setMentions(extractedMentions);
    onChange(newValue, extractedMentions);
  };

  const insertMention = (user: MentionUser) => {
    if (mentionStart === null) return;

    const textarea = textareaRef.current;
    if (!textarea) return;

    const beforeMention = value.slice(0, mentionStart);
    const afterMention = value.slice(textarea.selectionStart);
    const mentionText = `@[${user.name}](${user.username})`;
    
    const newValue = beforeMention + mentionText + afterMention;
    const newCursorPos = mentionStart + mentionText.length;

    // Update the mentions list
    const newMentions = [...mentions, user.username];
    setMentions(newMentions);
    
    onChange(newValue, newMentions);
    setShowSuggestions(false);
    setMentionStart(null);

    // Set cursor position after the mention
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % suggestions.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + suggestions.length) % suggestions.length);
        break;
      case 'Enter':
      case 'Tab':
        e.preventDefault();
        insertMention(suggestions[selectedIndex]);
        break;
      case 'Escape':
        setShowSuggestions(false);
        setMentionStart(null);
        break;
    }
  };

  // Render the text with mentions highlighted
  const renderDisplayText = (text: string) => {
    const mentionRegex = /@\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = mentionRegex.exec(text)) !== null) {
      // Add text before mention
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }
      
      // Add mention as styled span
      parts.push(
        <span key={match.index} className="text-primary font-medium bg-primary/10 px-1 rounded">
          @{match[1]}
        </span>
      );
      
      lastIndex = match.index + match[0].length;
    }
    
    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }
    
    return parts;
  };

  return (
    <div className="relative">
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => handleTextChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={className}
        disabled={disabled}
        rows={3}
      />
      
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-48 overflow-y-auto"
        >
          {suggestions.map((user, index) => (
            <div
              key={user.id}
              className={cn(
                "flex items-center gap-2 p-2 cursor-pointer hover:bg-muted",
                index === selectedIndex && "bg-muted"
              )}
              onClick={() => insertMention(user)}
            >
              <Avatar 
                userId={user.id}
                size={24}
                className="h-6 w-6"
              />
              <span className="text-sm">{user.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};