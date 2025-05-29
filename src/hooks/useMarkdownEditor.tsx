import { useRef } from 'react';

interface UseMarkdownEditorProps {
  setValue: (value: string) => void;
  value: string;
}

export const useMarkdownEditor = ({ value, setValue }: UseMarkdownEditorProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertText = (prefix: string, suffix: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    const newText = 
      value.substring(0, start) + 
      prefix + 
      selectedText + 
      suffix + 
      value.substring(end);
    
    setValue(newText);
    
    // Set cursor position after operation is complete
    setTimeout(() => {
      textarea.focus();
      // If no text was selected, place cursor between prefix and suffix
      if (start === end) {
        textarea.selectionStart = start + prefix.length;
        textarea.selectionEnd = start + prefix.length;
      } else {
        // If text was selected, select the text with the formatting
        textarea.selectionStart = start;
        textarea.selectionEnd = end + prefix.length + suffix.length;
      }
    }, 0);
  };

  const insertHeading = (level: number) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const text = value;
    
    // Find the beginning of the current line
    let lineStart = start;
    while (lineStart > 0 && text[lineStart - 1] !== '\n') {
      lineStart--;
    }
    
    // Check if line already has a heading
    const currentLine = text.substring(lineStart, text.indexOf('\n', lineStart) > -1 
      ? text.indexOf('\n', lineStart) 
      : text.length);
    
    const headingPrefix = '#'.repeat(level) + ' ';
    let newText;
    
    // If line already starts with heading markers, replace them
    if (currentLine.startsWith('#')) {
      const existingLevel = currentLine.indexOf(' ');
      if (existingLevel > 0) {
        newText = 
          text.substring(0, lineStart) + 
          headingPrefix + 
          currentLine.substring(existingLevel + 1) + 
          text.substring(lineStart + currentLine.length);
      } else {
        newText = 
          text.substring(0, lineStart) + 
          headingPrefix + 
          text.substring(lineStart + currentLine.length);
      }
    } else {
      // Otherwise add heading markers at the beginning of the line
      newText = 
        text.substring(0, lineStart) + 
        headingPrefix + 
        text.substring(lineStart);
    }
    
    setValue(newText);
    
    // Set cursor position after operation
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = lineStart + headingPrefix.length;
      textarea.selectionEnd = lineStart + headingPrefix.length;
    }, 0);
  };

  const insertLink = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    // If text is already selected, use it as the link text
    const linkText = selectedText.length > 0 ? selectedText : 'link text';
    const markdownLink = `[${linkText}](url)`;
    
    const newText = 
      value.substring(0, start) + 
      markdownLink + 
      value.substring(end);
    
    setValue(newText);
    
    // Set selection to the URL part
    setTimeout(() => {
      textarea.focus();
      const urlStart = start + linkText.length + 3; // '[link text]('.length
      textarea.selectionStart = urlStart;
      textarea.selectionEnd = urlStart + 3; // 'url'.length
    }, 0);
  };

  const insertList = (ordered: boolean) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const text = value;
    
    // Find the beginning of the current line
    let lineStart = start;
    while (lineStart > 0 && text[lineStart - 1] !== '\n') {
      lineStart--;
    }
    
    const prefix = ordered ? '1. ' : '- ';
    const newText = 
      text.substring(0, lineStart) + 
      prefix + 
      text.substring(lineStart);
    
    setValue(newText);
    
    // Set cursor position after operation
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = lineStart + prefix.length;
      textarea.selectionEnd = lineStart + prefix.length;
    }, 0);
  };

  return {
    textareaRef,
    insertText,
    insertHeading,
    insertLink,
    insertList
  };
};
