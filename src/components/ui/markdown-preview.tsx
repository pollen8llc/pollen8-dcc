
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

interface MarkdownPreviewProps {
  content: string;
  className?: string;
}

const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ content, className }) => {
  return (
    <div className={cn("prose prose-slate dark:prose-invert max-w-none", className)}>
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mt-6 mb-4" {...props} />,
          h2: ({ node, ...props }) => <h2 className="text-xl font-bold mt-5 mb-3" {...props} />,
          h3: ({ node, ...props }) => <h3 className="text-lg font-bold mt-4 mb-2" {...props} />,
          p: ({ node, ...props }) => <p className="mb-4" {...props} />,
          ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-4" {...props} />,
          ol: ({ node, ...props }) => <ol className="list-decimal pl-6 mb-4" {...props} />,
          li: ({ node, ...props }) => <li className="mb-1" {...props} />,
          a: ({ node, ...props }) => <a className="text-blue-500 hover:underline" {...props} />,
          blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-gray-200 dark:border-gray-700 pl-4 italic my-4" {...props} />,
          code: ({ node, inline, ...props }) => 
            inline ? 
              <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm" {...props} /> : 
              <code className="block bg-gray-100 dark:bg-gray-800 p-3 rounded-md text-sm overflow-x-auto my-4" {...props} />,
          pre: ({ node, ...props }) => <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md overflow-x-auto my-4" {...props} />,
          table: ({ node, ...props }) => <table className="border-collapse table-auto w-full my-4" {...props} />,
          th: ({ node, ...props }) => <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left" {...props} />,
          td: ({ node, ...props }) => <td className="border border-gray-300 dark:border-gray-700 px-4 py-2" {...props} />
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export { MarkdownPreview };
