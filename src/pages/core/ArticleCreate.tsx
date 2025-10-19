
import React from 'react';
import { Shell } from '@/components/layout/Shell';
import { Base88Layout } from '@/components/layout/Base88Layout';
import ArticleForm from '@/components/core/ArticleForm';

const ArticleCreate: React.FC = () => {
  return (
    <Shell>
      <Base88Layout>
        <h1 className="text-3xl font-bold tracking-tight mb-8">Create New Article</h1>
        
        <ArticleForm mode="create" />
      </Base88Layout>
    </Shell>
  );
};

export default ArticleCreate;
