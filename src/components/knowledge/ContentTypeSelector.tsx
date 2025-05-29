
import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  BookOpen, 
  MessageSquare, 
  BarChart2, 
  Quote, 
  Newspaper,
} from 'lucide-react';

export interface ContentTypeSelectorProps {
  selected: string;
  onChange: (type: string) => void;
}

export const ContentTypeSelector: React.FC<ContentTypeSelectorProps> = ({ 
  selected, 
  onChange 
}) => {
  const contentTypes = [
    { id: 'all', name: 'All Types', icon: Newspaper },
    { id: 'QUESTION', name: 'Questions', icon: MessageSquare },
    { id: 'ARTICLE', name: 'Articles', icon: BookOpen },
    { id: 'QUOTE', name: 'Quotes', icon: Quote },
    { id: 'POLL', name: 'Polls', icon: BarChart2 },
  ];

  return (
    <div className="space-y-2">
      {contentTypes.map((type) => {
        const Icon = type.icon;
        const isActive = selected === type.id;
        
        return (
          <button
            key={type.id}
            onClick={() => onChange(type.id)}
            className={cn(
              "flex items-center w-full px-3 py-2 text-sm rounded-md transition-colors",
              isActive 
                ? "bg-primary text-primary-foreground" 
                : "hover:bg-muted"
            )}
          >
            <Icon className={cn("h-4 w-4 mr-2", isActive ? "text-primary-foreground" : "text-muted-foreground")} />
            <span>{type.name}</span>
            {isActive && <Check className="h-4 w-4 ml-auto" />}
          </button>
        );
      })}
    </div>
  );
};
