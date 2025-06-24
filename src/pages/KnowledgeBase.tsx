
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import KnowledgeBasePage from '@/pages/knowledge/KnowledgeBase';

const KnowledgeBase = () => {
  return (
    <Routes>
      <Route path="/*" element={<KnowledgeBasePage />} />
    </Routes>
  );
};

export default KnowledgeBase;
