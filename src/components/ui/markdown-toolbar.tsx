
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bold, Italic, Heading, Link, List, ListOrdered } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface MarkdownToolbarProps {
  onInsert: (prefix: string, suffix?: string) => void;
  onHeading: (level: number) => void;
  onLink: () => void;
  onList: (ordered: boolean) => void;
}

export const MarkdownToolbar: React.FC<MarkdownToolbarProps> = ({
  onInsert,
  onHeading,
  onLink,
  onList,
}) => {
  return (
    <TooltipProvider>
      <div className="flex items-center gap-1 mb-2 p-1 border rounded-md bg-muted/40">
        <ToolbarButton tooltip="Bold" onClick={() => onInsert('**', '**')}>
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        
        <ToolbarButton tooltip="Italic" onClick={() => onInsert('*', '*')}>
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        
        <ToolbarButton tooltip="Heading 2" onClick={() => onHeading(2)}>
          <Heading className="h-4 w-4" />
        </ToolbarButton>
        
        <ToolbarButton tooltip="Link" onClick={onLink}>
          <Link className="h-4 w-4" />
        </ToolbarButton>
        
        <ToolbarButton tooltip="Bullet List" onClick={() => onList(false)}>
          <List className="h-4 w-4" />
        </ToolbarButton>
        
        <ToolbarButton tooltip="Numbered List" onClick={() => onList(true)}>
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>
      </div>
    </TooltipProvider>
  );
};

// Helper component for toolbar buttons with tooltips
const ToolbarButton: React.FC<{
  children: React.ReactNode;
  tooltip: string;
  onClick: () => void;
}> = ({ children, tooltip, onClick }) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={onClick}
        >
          {children}
          <span className="sr-only">{tooltip}</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
};
