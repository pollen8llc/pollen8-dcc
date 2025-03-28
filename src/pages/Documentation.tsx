
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, Database, Code, Server } from 'lucide-react';

const Documentation = () => {
  const navigate = useNavigate();

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mr-2" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">Platform Documentation</h1>
      </div>

      <div className="prose prose-sm md:prose-base lg:prose-lg dark:prose-invert max-w-none">
        <div className="bg-muted/50 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">ECO8</h2>
          <p className="text-muted-foreground">
            A comprehensive platform for managing digital communities, their members, and knowledge bases.
            This documentation provides an overview of the platform's architecture, technologies, and functionality.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-card rounded-lg p-6 border border-border">
            <div className="flex items-center mb-4">
              <Code className="h-6 w-6 mr-2 text-primary" />
              <h3 className="text-xl font-semibold">Technology Stack</h3>
            </div>
            <ul className="space-y-2">
              <li><strong>Frontend:</strong> React, TypeScript, Vite</li>
              <li><strong>Styling:</strong> Tailwind CSS, shadcn/ui</li>
              <li><strong>State Management:</strong> React Context, TanStack Query</li>
              <li><strong>Routing:</strong> React Router DOM</li>
            </ul>
          </div>

          <div className="bg-card rounded-lg p-6 border border-border">
            <div className="flex items-center mb-4">
              <Database className="h-6 w-6 mr-2 text-primary" />
              <h3 className="text-xl font-semibold">Database Structure</h3>
            </div>
            <ul className="space-y-2">
              <li><strong>Platform:</strong> Supabase (PostgreSQL)</li>
              <li><strong>Key Tables:</strong> profiles, communities, community_members, knowledge_base</li>
              <li><strong>Auth:</strong> Supabase Authentication</li>
              <li><strong>Security:</strong> Row-Level Security (RLS)</li>
            </ul>
          </div>
        </div>

        <h3 className="text-2xl font-bold mb-4">Key Features</h3>
        <div className="bg-card rounded-lg p-6 border border-border mb-8">
          <ul className="space-y-3">
            <li><strong>User Authentication:</strong> Login, registration, profile management</li>
            <li><strong>Community Management:</strong> Create, join, and manage communities</li>
            <li><strong>Member Management:</strong> View and manage community members</li>
            <li><strong>Knowledge Base:</strong> Create and access community knowledge resources</li>
            <li><strong>Admin Dashboard:</strong> Platform administration and monitoring</li>
            <li><strong>Role-Based Access Control:</strong> Different permissions for different user roles</li>
          </ul>
        </div>

        <div className="flex justify-center">
          <Button className="flex items-center gap-2" onClick={() => window.open('/DOCUMENTATION.md', '_blank')}>
            <FileText className="h-4 w-4" />
            View Full Documentation
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Documentation;
