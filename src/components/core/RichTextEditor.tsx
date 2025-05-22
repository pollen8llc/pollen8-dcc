
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { MarkdownPreview } from '@/components/ui/markdown-preview';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Bold, Italic, Code, TextQuote, ListOrdered, ListUnordered, Underline, Strikethrough } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  minHeight?: string;
  placeholder?: string;
  label?: string;
}

const RichTextEditor = ({
  value,
  onChange,
  minHeight = '300px',
  placeholder = 'Write your content here...',
  label
}: RichTextEditorProps) => {
  const [activeTab, setActiveTab] = useState<string>('edit');
  
  // Function to insert markdown syntax around the selected text
  const insertMarkdown = (syntax: string, defaultText: string = '') => {
    const textarea = document.getElementById('markdown-editor') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const beforeText = value.substring(0, start);
    const afterText = value.substring(end);

    // If no text is selected, insert syntax with default text
    if (start === end) {
      onChange(beforeText + syntax + defaultText + syntax + afterText);
      // Position cursor between the two syntaxes
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + syntax.length, start + syntax.length + defaultText.length);
      }, 0);
    } else {
      // Wrap selected text with syntax
      onChange(beforeText + syntax + selectedText + syntax + afterText);
      // Position cursor after the inserted markdown and selection
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(end + syntax.length * 2, end + syntax.length * 2);
      }, 0);
    }
  };

  // Function to insert line prefix markdown
  const insertPrefixedLine = (prefix: string, defaultText: string = '') => {
    const textarea = document.getElementById('markdown-editor') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const beforeText = value.substring(0, start);
    const afterText = value.substring(end);
    
    // Get the character before the cursor to determine if we need to add a newline
    const needsNewLine = start > 0 && value[start - 1] !== '\n' ? '\n' : '';
    
    // If no text is selected, insert prefix with default text
    if (start === end) {
      onChange(beforeText + needsNewLine + prefix + ' ' + defaultText + afterText);
      // Position cursor after the prefix
      setTimeout(() => {
        textarea.focus();
        const newPos = start + needsNewLine.length + prefix.length + 1;
        textarea.setSelectionRange(newPos, newPos + defaultText.length);
      }, 0);
    } else {
      // Apply the prefix to each line in the selection
      const lines = selectedText.split('\n');
      const prefixedText = lines.map(line => prefix + ' ' + line).join('\n');
      onChange(beforeText + needsNewLine + prefixedText + afterText);
      // Position cursor after the last inserted text
      setTimeout(() => {
        textarea.focus();
        const newPos = start + needsNewLine.length + prefixedText.length;
        textarea.setSelectionRange(newPos, newPos);
      }, 0);
    }
  };

  return (
    <div className="w-full">
      {label && <div className="text-base mb-2">{label}</div>}
      <Card className="p-0 border">
        <div className="border-b px-3 py-2 flex items-center overflow-x-auto">
          <div className="flex space-x-1">
            <Button variant="ghost" size="icon" onClick={() => insertMarkdown('**', 'bold text')} title="Bold">
              <Bold className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => insertMarkdown('*', 'italic text')} title="Italic">
              <Italic className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => insertMarkdown('__', 'underlined text')} title="Underline">
              <Underline className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => insertMarkdown('~~', 'strikethrough text')} title="Strikethrough">
              <Strikethrough className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => insertMarkdown('`', 'code')} title="Inline Code">
              <Code className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => insertPrefixedLine('>', 'blockquote')} title="Blockquote">
              <TextQuote className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => insertPrefixedLine('-', 'list item')} title="Unordered List">
              <ListUnordered className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => insertPrefixedLine('1.', 'list item')} title="Ordered List">
              <ListOrdered className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Tabs defaultValue="edit" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-4 py-2 border-b">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="edit">Edit</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
          </div>
          <CardContent className="p-0">
            <TabsContent value="edit" className="mt-0 border-0">
              <Textarea
                id="markdown-editor"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="resize-none border-0 shadow-none focus-visible:ring-0 rounded-none h-full min-h-40"
                style={{ minHeight }}
              />
            </TabsContent>
            <TabsContent value="preview" className="mt-0 border-0 px-4 py-2">
              <div style={{ minHeight }} className="overflow-auto">
                {value ? (
                  <MarkdownPreview content={value} />
                ) : (
                  <p className="text-muted-foreground">Nothing to preview</p>
                )}
              </div>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default RichTextEditor;
