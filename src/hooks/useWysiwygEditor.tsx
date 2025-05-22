import { useRef, useCallback } from 'react';

export const useWysiwygEditor = (editorRef: React.RefObject<HTMLDivElement>) => {
  // Helper to get current selection
  const getSelection = (): Range | null => {
    const selection = window.getSelection();
    if (!selection || !editorRef.current) return null;
    
    // Ensure selection is within our editor
    let containsEditor = false;
    let parentNode: Node | null = selection.anchorNode;
    
    while (parentNode) {
      if (parentNode === editorRef.current) {
        containsEditor = true;
        break;
      }
      parentNode = parentNode.parentNode;
    }
    
    if (!containsEditor) return null;
    
    return selection.getRangeAt(0);
  };
  
  // Focus the editor
  const focusEditor = () => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };
  
  // Apply bold formatting
  const applyBold = useCallback(() => {
    focusEditor();
    document.execCommand('bold', false);
  }, []);
  
  // Apply italic formatting
  const applyItalic = useCallback(() => {
    focusEditor();
    document.execCommand('italic', false);
  }, []);
  
  // Apply heading
  const applyHeading = useCallback((level: number) => {
    focusEditor();
    
    const range = getSelection();
    if (!range) return;
    
    // Get current block element
    let container = range.commonAncestorContainer;
    if (container.nodeType !== Node.ELEMENT_NODE) {
      container = container.parentElement!;
    }
    
    // Find the nearest block-level element
    const findBlockParent = (element: Element): Element => {
      const blockElements = ['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'DIV'];
      if (blockElements.includes(element.tagName)) {
        return element;
      }
      if (element.parentElement && element.parentElement !== editorRef.current) {
        return findBlockParent(element.parentElement);
      }
      return element;
    };
    
    const blockElement = findBlockParent(container as Element);
    const tagName = `h${level}`;
    
    if (blockElement.tagName.toLowerCase() === tagName) {
      // If already that heading, convert to paragraph
      document.execCommand('formatBlock', false, 'p');
    } else {
      // Otherwise convert to requested heading level
      document.execCommand('formatBlock', false, tagName);
    }
  }, [editorRef]);
  
  // Insert link
  const insertLink = useCallback(() => {
    focusEditor();
    
    const range = getSelection();
    if (!range) return;
    
    const selectedText = range.toString();
    let url = prompt('Enter link URL:', 'https://');
    
    if (!url) return;
    
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    
    const linkText = selectedText || prompt('Enter link text:', '');
    
    if (!linkText) return;
    
    // Delete selected text if any
    if (selectedText) {
      range.deleteContents();
    }
    
    // Create link element
    const link = document.createElement('a');
    link.href = url;
    link.textContent = linkText;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    
    range.insertNode(link);
    
    // Move cursor after the link
    range.setStartAfter(link);
    range.collapse(true);
    
    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }, [editorRef]);
  
  // Insert list
  const insertList = useCallback((ordered: boolean) => {
    focusEditor();
    document.execCommand(ordered ? 'insertOrderedList' : 'insertUnorderedList', false);
  }, []);
  
  return {
    applyBold,
    applyItalic,
    applyHeading,
    insertLink,
    insertList
  };
};
