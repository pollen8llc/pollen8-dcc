
import React from 'react';
import Markdown from 'markdown-to-jsx';
import { cn } from '@/lib/utils';

interface MarkdownPreviewProps {
  content: string;
  className?: string;
}

export const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ content, className }) => {
  return (
    <div className={cn("prose prose-slate dark:prose-invert max-w-none", className)}>
      <Markdown
        options={{
          overrides: {
            h1: {
              component: "h1",
              props: {
                className: "text-2xl font-bold mt-6 mb-4",
              },
            },
            h2: {
              component: "h2",
              props: {
                className: "text-xl font-bold mt-5 mb-3",
              },
            },
            h3: {
              component: "h3",
              props: {
                className: "text-lg font-bold mt-4 mb-2",
              },
            },
            p: {
              component: "p",
              props: {
                className: "mb-4",
              },
            },
            ul: {
              component: "ul",
              props: {
                className: "list-disc pl-6 mb-4",
              },
            },
            ol: {
              component: "ol",
              props: {
                className: "list-decimal pl-6 mb-4",
              },
            },
            li: {
              component: "li",
              props: {
                className: "mb-1",
              },
            },
            a: {
              component: "a",
              props: {
                className: "text-blue-500 hover:underline",
              },
            },
            blockquote: {
              component: "blockquote",
              props: {
                className: "border-l-4 border-gray-200 dark:border-gray-700 pl-4 italic my-4",
              },
            },
            code: {
              component: "code",
              props: {
                className: "bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm",
              },
            },
            pre: {
              component: "pre",
              props: {
                className: "bg-gray-100 dark:bg-gray-800 p-3 rounded-md overflow-x-auto my-4",
              },
            },
            table: {
              component: "table",
              props: {
                className: "border-collapse table-auto w-full my-4",
              },
            },
            th: {
              component: "th",
              props: {
                className: "border border-gray-300 dark:border-gray-700 px-4 py-2 text-left",
              },
            },
            td: {
              component: "td",
              props: {
                className: "border border-gray-300 dark:border-gray-700 px-4 py-2",
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
