
/**
 * Converts HTML content to Markdown format
 */
export function htmlToMarkdown(html: string): string {
  if (!html || html === '<br>' || html === '<p></p>') return '';
  
  let markdown = html;
  
  // Create a temporary DOM element to parse HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  
  // Process the DOM and convert to markdown
  return processNodeToMarkdown(tempDiv);
}

function processNodeToMarkdown(node: Node): string {
  let markdown = '';
  
  // Process child nodes
  node.childNodes.forEach(child => {
    if (child.nodeType === Node.TEXT_NODE) {
      // Text node
      markdown += child.textContent;
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      const element = child as HTMLElement;
      const tagName = element.tagName.toLowerCase();
      
      switch (tagName) {
        case 'p':
          markdown += processNodeToMarkdown(child) + '\n\n';
          break;
          
        case 'br':
          markdown += '\n';
          break;
          
        case 'strong':
        case 'b':
          markdown += `**${processNodeToMarkdown(child)}**`;
          break;
          
        case 'em':
        case 'i':
          markdown += `*${processNodeToMarkdown(child)}*`;
          break;
          
        case 'h1':
          markdown += `# ${processNodeToMarkdown(child)}\n\n`;
          break;
          
        case 'h2':
          markdown += `## ${processNodeToMarkdown(child)}\n\n`;
          break;
          
        case 'h3':
          markdown += `### ${processNodeToMarkdown(child)}\n\n`;
          break;
          
        case 'h4':
          markdown += `#### ${processNodeToMarkdown(child)}\n\n`;
          break;
          
        case 'a':
          const href = (element as HTMLAnchorElement).getAttribute('href') || '';
          markdown += `[${processNodeToMarkdown(child)}](${href})`;
          break;
          
        case 'ul':
          markdown += processListToMarkdown(element, false);
          break;
          
        case 'ol':
          markdown += processListToMarkdown(element, true);
          break;
          
        default:
          markdown += processNodeToMarkdown(child);
      }
    }
  });
  
  return markdown;
}

function processListToMarkdown(listElement: HTMLElement, ordered: boolean): string {
  let markdown = '\n';
  let index = 1;
  
  Array.from(listElement.children).forEach(item => {
    if (item.tagName.toLowerCase() === 'li') {
      markdown += ordered 
        ? `${index}. ${processNodeToMarkdown(item)}\n` 
        : `- ${processNodeToMarkdown(item)}\n`;
      index++;
    }
  });
  
  return markdown + '\n';
}

/**
 * Converts Markdown content to HTML format
 */
export function markdownToHtml(markdown: string): string {
  if (!markdown) return '';
  
  let html = markdown;
  
  // Headings
  html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');
  
  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Italic
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // Links
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  
  // Unordered lists
  html = html.replace(/^\- (.*$)/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>)\n(<li>)/g, '$1$2');
  html = html.replace(/^<li>/gm, '<ul><li>');
  html = html.replace(/<\/li>$/gm, '</li></ul>');
  html = html.replace(/<\/ul>\n<ul>/g, '');
  
  // Ordered lists
  html = html.replace(/^\d+\. (.*$)/gm, '<li>$1</li>');
  html = html.replace(/^<li>/gm, '<ol><li>');
  html = html.replace(/<\/li>$/gm, '</li></ol>');
  html = html.replace(/<\/ol>\n<ol>/g, '');
  
  // Paragraphs - double newlines make paragraphs
  html = html.replace(/\n\n/g, '</p><p>');
  
  // Fix extra tags - wrap in paragraph if not already wrapped
  if (!html.startsWith('<')) {
    html = `<p>${html}</p>`;
  }
  
  return html;
}
