
import React, { useRef, useState, useEffect } from 'react';
import { WysiwygToolbar } from './wysiwyg-toolbar';
import { useWysiwygEditor } from '@/hooks/useWysiwygEditor';
import { cn } from '@/lib/utils';
import { htmlToMarkdown, markdownToHtml } from '@/utils/format-converters';

interface WysiwygEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  minHeight?: string;
}

export const WysiwygEditor = ({
  value,
  onChange,
  className,
  placeholder = 'Start writing...',
  minHeight = '400px',
}: WysiwygEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isEmpty, setIsEmpty] = useState(!value);
  
  // Convert markdown to HTML for initial display and editing
  const [htmlContent, setHtmlContent] = useState(() => markdownToHtml(value));
  
  const {
    applyBold,
    applyItalic,
    applyHeading,
    insertLink,
    insertList
  } = useWysiwygEditor(editorRef);

  // Update HTML whenever markdown value changes from outside
  useEffect(() => {
    const newHtml = markdownToHtml(value);
    if (editorRef.current && !editorRef.current.contains(document.activeElement)) {
      // Only update if editor doesn't have focus to prevent cursor position loss
      editorRef.current.innerHTML = newHtml;
    }
    setIsEmpty(!value);
  }, [value]);
  
  // Handle content changes and convert HTML back to markdown
  const handleContentChange = () => {
    if (!editorRef.current) return;
    
    const html = editorRef.current.innerHTML;
    setIsEmpty(html === '' || html === '<br>' || html === '<p></p>');
    
    // Convert HTML to markdown and update parent component
    const markdown = htmlToMarkdown(html);
    onChange(markdown);
  };

  return (
    <div className="wysiwyg-editor-container">
      <WysiwygToolbar
        onBold={applyBold}
        onItalic={applyItalic}
        onHeading={applyHeading}
        onLink={insertLink}
        onList={insertList}
      />
      
      <div 
        className={cn(
          "wysiwyg-editor border rounded-md p-3 overflow-auto",
          isFocused ? "border-primary ring-1 ring-primary/20" : "border-input",
          isEmpty && !isFocused ? "before:text-muted-foreground before:content-[attr(data-placeholder)] before:pointer-events-none" : "",
          className
        )}
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        style={{ minHeight }}
        data-placeholder={placeholder}
        onInput={handleContentChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </div>
  );
};
