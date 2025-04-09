
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, Database, Code, Server, Palette } from 'lucide-react';

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

        <div className="bg-card rounded-lg p-6 border border-border mb-8">
          <div className="flex items-center mb-4">
            <Palette className="h-6 w-6 mr-2 text-primary" />
            <h3 className="text-xl font-semibold">Theme & Styling</h3>
          </div>
          
          <div className="mb-6">
            <h4 className="text-lg font-medium mb-2">Color Palette</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="flex flex-col items-center">
                <div className="w-full h-12 bg-primary rounded-md mb-2"></div>
                <span className="text-xs">Primary - Aquamarine</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-full h-12 bg-secondary rounded-md mb-2"></div>
                <span className="text-xs">Secondary</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-full h-12 bg-muted rounded-md mb-2"></div>
                <span className="text-xs">Muted</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-full h-12 bg-accent rounded-md mb-2"></div>
                <span className="text-xs">Accent</span>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="flex flex-col items-center">
                <div className="w-full h-12 bg-background rounded-md border border-border mb-2"></div>
                <span className="text-xs">Background</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-full h-12 bg-card rounded-md border border-border mb-2"></div>
                <span className="text-xs">Card</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-full h-12 bg-border rounded-md mb-2"></div>
                <span className="text-xs">Border</span>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h4 className="text-lg font-medium mb-2">Theme Configuration</h4>
            <p className="text-sm mb-4">The platform uses a custom dark theme with CSS variables for consistent theming:</p>
            <div className="bg-muted/30 p-4 rounded-md overflow-x-auto">
              <pre className="text-xs">
                <code>
{`--background: 215 25% 8%;
--foreground: 0 0% 100%;
--card: 215 25% 10%;
--card-foreground: 0 0% 100%;
--primary: 174 100% 46%;
--primary-foreground: 0 0% 0%;
--secondary: 215 25% 18%;
--secondary-foreground: 0 0% 100%;
--muted: 215 25% 18%;
--muted-foreground: 0 0% 80%;
--accent: 174 100% 46%;
--accent-foreground: 0 0% 0%;`}
                </code>
              </pre>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-2">Utility Classes</h4>
            <ul className="space-y-2 text-sm">
              <li><strong>.glass:</strong> <code className="text-xs bg-muted/30 px-1 py-0.5 rounded">bg-background/50 backdrop-blur-md border border-border/50</code></li>
              <li><strong>.glass-dark:</strong> <code className="text-xs bg-muted/30 px-1 py-0.5 rounded">bg-card/40 backdrop-blur-md border border-border/20</code></li>
              <li><strong>.appear-animate:</strong> <code className="text-xs bg-muted/30 px-1 py-0.5 rounded">opacity-0 animate-fade-in</code></li>
              <li><strong>.slide-up-animate:</strong> <code className="text-xs bg-muted/30 px-1 py-0.5 rounded">opacity-0 translate-y-4 animate-slide-up</code></li>
              <li><strong>.slide-in-animate:</strong> <code className="text-xs bg-muted/30 px-1 py-0.5 rounded">opacity-0 -translate-x-4 animate-slide-in</code></li>
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
