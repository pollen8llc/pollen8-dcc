
import React from 'react';
import { Shell } from '@/components/layout/Shell';
import ArticleForm from '@/components/core/ArticleForm';

const ArticleCreate: React.FC = () => {
  return (
    <Shell>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold tracking-tight mb-8">Create New Article</h1>
        
        <ArticleForm />
      </div>
    </Shell>
  );
};

export default ArticleCreate;
