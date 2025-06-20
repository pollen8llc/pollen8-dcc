
import React from 'react';
import Markdown from 'markdown-to-jsx';
import { cn } from '@/lib/utils';

interface MarkdownPreviewProps {
  content: string;
  className?: string;
}

export const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ content, className }) => {
  return (
    <div className={cn("max-w-none text-white leading-relaxed", className)}>
      <Markdown
        options={{
          overrides: {
            h1: {
              component: "h1",
              props: {
                className: "text-white text-2xl font-bold leading-tight mt-6 mb-4 first:mt-0",
              },
            },
            h2: {
              component: "h2",
              props: {
                className: "text-white text-xl font-semibold leading-tight mt-5 mb-3",
              },
            },
            h3: {
              component: "h3",
              props: {
                className: "text-white text-lg font-semibold leading-tight mt-4 mb-2",
              },
            },
            h4: {
              component: "h4",
              props: {
                className: "text-white text-base font-medium leading-tight mt-4 mb-2",
              },
            },
            h5: {
              component: "h5",
              props: {
                className: "text-white text-sm font-medium leading-tight mt-3 mb-2",
              },
            },
            h6: {
              component: "h6",
              props: {
                className: "text-white text-xs font-medium leading-tight mt-3 mb-1",
              },
            },
            p: {
              component: "p",
              props: {
                className: "text-white text-base leading-relaxed mb-4",
              },
            },
            ul: {
              component: "ul",
              props: {
                className: "text-white list-disc pl-6 mb-4",
              },
            },
            ol: {
              component: "ol",
              props: {
                className: "text-white list-decimal pl-6 mb-4",
              },
            },
            li: {
              component: "li",
              props: {
                className: "text-white text-base leading-relaxed mb-1",
              },
            },
            a: {
              component: "a",
              props: {
                className: "text-[#00eada] underline hover:opacity-80",
              },
            },
            blockquote: {
              component: "blockquote",
              props: {
                className: "text-white border-l-4 border-gray-300 pl-4 italic my-4",
              },
            },
            code: {
              component: "code",
              props: {
                className: "text-white bg-gray-800 px-2 py-1 rounded text-sm",
              },
            },
            pre: {
              component: "pre",
              props: {
                className: "text-white bg-gray-800 p-4 rounded-lg overflow-x-auto my-4",
              },
            },
            table: {
              component: "table",
              props: {
                className: "text-white border-collapse table-auto w-full my-4",
              },
            },
            th: {
              component: "th",
              props: {
                className: "text-white border border-gray-600 px-4 py-3 text-left font-semibold",
              },
            },
            td: {
              component: "td",
              props: {
                className: "text-white border border-gray-600 px-4 py-3",
              },
            },
            strong: {
              component: "strong",
              props: {
                className: "text-white font-semibold",
              },
            },
            em: {
              component: "em",
              props: {
                className: "text-white italic",
              },
            },
            span: {
              component: "span",
              props: {
                className: "text-white",
              },
            },
            div: {
              component: "div",
              props: {
                className: "text-white",
              },
            },
          },
        }}
      >
        {content}
      </Markdown>
    </div>
  );
};
