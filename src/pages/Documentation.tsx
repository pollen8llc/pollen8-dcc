
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { ArrowLeft, FileText, Database, Code, Server, Palette, LayoutDashboard, Shield, Users, LineChart } from 'lucide-react';
import * as d3 from 'd3';

const Documentation = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const dbVisRef = useRef<SVGSVGElement>(null);
  
  useEffect(() => {
    if (activeTab === "database" && dbVisRef.current) {
      renderDatabaseDiagram();
    }
  }, [activeTab]);
  
  const renderDatabaseDiagram = () => {
    if (!dbVisRef.current) return;
    
    const svg = d3.select(dbVisRef.current);
    svg.selectAll("*").remove(); // Clear previous rendering
    
    const width = 600;
    const height = 400;
    
    // Define tables as nodes
    const tables = [
      { name: "profiles", x: 100, y: 70 },
      { name: "communities", x: 350, y: 70 },
      { name: "community_members", x: 220, y: 170 },
      { name: "knowledge_base", x: 450, y: 170 },
      { name: "roles", x: 100, y: 270 },
      { name: "user_roles", x: 220, y: 270 }
    ];
    
    // Define relationships as links
    const links = [
      { source: 0, target: 2 }, // profiles -> community_members
      { source: 1, target: 2 }, // communities -> community_members
      { source: 1, target: 3 }, // communities -> knowledge_base
      { source: 0, target: 5 }, // profiles -> user_roles
      { source: 4, target: 5 }  // roles -> user_roles
    ];
    
    // Draw relationships (lines)
    svg.selectAll("line")
      .data(links)
      .enter()
      .append("line")
      .attr("x1", d => tables[d.source].x + 60)
      .attr("y1", d => tables[d.source].y + 25)
      .attr("x2", d => tables[d.target].x + 60)
      .attr("y2", d => tables[d.target].y + 25)
      .attr("stroke", "var(--primary)")
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", "5,5");
    
    // Draw tables (rectangles)
    const nodes = svg.selectAll("g")
      .data(tables)
      .enter()
      .append("g")
      .attr("transform", d => `translate(${d.x}, ${d.y})`);
    
    nodes.append("rect")
      .attr("width", 120)
      .attr("height", 50)
      .attr("rx", 6)
      .attr("fill", "var(--card)")
      .attr("stroke", "var(--primary)")
      .attr("stroke-width", 2);
    
    nodes.append("text")
      .attr("x", 60)
      .attr("y", 30)
      .attr("text-anchor", "middle")
      .attr("fill", "var(--foreground)")
      .text(d => d.name);
  };

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-6 mb-8">
          <TabsTrigger value="overview">
            <LayoutDashboard className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="technology">
            <Code className="h-4 w-4 mr-2" />
            Technology
          </TabsTrigger>
          <TabsTrigger value="database">
            <Database className="h-4 w-4 mr-2" />
            Database
          </TabsTrigger>
          <TabsTrigger value="styles">
            <Palette className="h-4 w-4 mr-2" />
            Design
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="api">
            <Server className="h-4 w-4 mr-2" />
            API
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">ECO8</CardTitle>
              <CardDescription>
                A comprehensive platform for managing digital communities, their members, and knowledge bases.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm md:prose-base lg:prose-lg dark:prose-invert max-w-none">
                <p>
                  The ECO8 platform provides a robust infrastructure for creating and managing digital communities.
                  It supports user management, community organization, and knowledge sharing in a secure environment.
                </p>
                
                <h3 className="text-xl font-semibold mt-6 mb-4">Key Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-card rounded-lg p-4 border border-border">
                    <div className="flex items-center mb-2">
                      <Users className="h-5 w-5 mr-2 text-primary" />
                      <h4 className="font-medium">User Management</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Comprehensive user authentication, roles, and permissions system.
                    </p>
                  </div>
                  
                  <div className="bg-card rounded-lg p-4 border border-border">
                    <div className="flex items-center mb-2">
                      <Database className="h-5 w-5 mr-2 text-primary" />
                      <h4 className="font-medium">Community Management</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Create, join, and manage communities with flexible membership controls.
                    </p>
                  </div>
                  
                  <div className="bg-card rounded-lg p-4 border border-border">
                    <div className="flex items-center mb-2">
                      <FileText className="h-5 w-5 mr-2 text-primary" />
                      <h4 className="font-medium">Knowledge Base</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Share and organize community knowledge and resources.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="technology">
          <Card>
            <CardHeader>
              <CardTitle>Technology Stack</CardTitle>
              <CardDescription>
                Overview of the technologies used in the ECO8 platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-card rounded-lg p-6 border border-border">
                  <div className="flex items-center mb-4">
                    <Code className="h-6 w-6 mr-2 text-primary" />
                    <h3 className="text-xl font-semibold">Frontend</h3>
                  </div>
                  <ul className="space-y-2">
                    <li><strong>Framework:</strong> React 18 with TypeScript</li>
                    <li><strong>Build Tool:</strong> Vite</li>
                    <li><strong>Styling:</strong> Tailwind CSS, shadcn/ui</li>
                    <li><strong>State Management:</strong> React Context, TanStack Query</li>
                    <li><strong>Routing:</strong> React Router DOM</li>
                    <li><strong>Visualization:</strong> D3.js, Recharts</li>
                    <li><strong>Icons:</strong> Lucide React</li>
                  </ul>
                </div>

                <div className="bg-card rounded-lg p-6 border border-border">
                  <div className="flex items-center mb-4">
                    <Server className="h-6 w-6 mr-2 text-primary" />
                    <h3 className="text-xl font-semibold">Backend</h3>
                  </div>
                  <ul className="space-y-2">
                    <li><strong>Platform:</strong> Supabase (PostgreSQL)</li>
                    <li><strong>Authentication:</strong> Supabase Auth</li>
                    <li><strong>Data Access:</strong> RLS Policies</li>
                    <li><strong>API:</strong> RESTful endpoints via Supabase</li>
                    <li><strong>File Storage:</strong> Supabase Storage</li>
                    <li><strong>Security:</strong> JWTs, Row-Level Security</li>
                  </ul>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Project Structure</h3>
                <div className="bg-muted/30 p-4 rounded-md overflow-x-auto">
                  <pre className="text-sm">
                    <code>
{`src/
├── components/         # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── admin/          # Admin-specific components
│   └── community/      # Community-related components
├── contexts/           # React contexts for state management
├── data/               # Mock data and data utilities
├── hooks/              # Custom React hooks
├── integrations/       # Third-party service integrations
├── models/             # TypeScript type definitions
├── pages/              # Page components for each route
├── services/           # Business logic and API services
└── utils/              # Utility functions and helpers`}
                    </code>
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database">
          <Card>
            <CardHeader>
              <CardTitle>Database Structure</CardTitle>
              <CardDescription>
                Supabase PostgreSQL database schema and relationships
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Entity Relationship Diagram</h3>
                <div className="bg-card border border-border rounded-md p-4 overflow-auto flex justify-center">
                  <svg ref={dbVisRef} width="600" height="400"></svg>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold mb-4">Key Tables</h3>
              
              <div className="space-y-4">
                <div className="bg-muted/30 p-4 rounded-md overflow-x-auto">
                  <h4 className="font-medium mb-2">profiles</h4>
                  <pre className="text-xs">
                    <code>
{`CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  email TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);`}
                    </code>
                  </pre>
                </div>
                
                <div className="bg-muted/30 p-4 rounded-md overflow-x-auto">
                  <h4 className="font-medium mb-2">communities</h4>
                  <pre className="text-xs">
                    <code>
{`CREATE TABLE public.communities (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  website TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);`}
                    </code>
                  </pre>
                </div>
                
                <div className="bg-muted/30 p-4 rounded-md overflow-x-auto">
                  <h4 className="font-medium mb-2">community_members</h4>
                  <pre className="text-xs">
                    <code>
{`CREATE TABLE public.community_members (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  community_id UUID NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member',
  joined_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  UNIQUE(community_id, user_id)
);`}
                    </code>
                  </pre>
                </div>

                <div className="bg-muted/30 p-4 rounded-md overflow-x-auto">
                  <h4 className="font-medium mb-2">roles and user_roles</h4>
                  <pre className="text-xs">
                    <code>
{`CREATE TABLE public.roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  permissions JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES public.roles(id),
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  assigned_by UUID,
  UNIQUE(user_id, role_id)
);`}
                    </code>
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="styles">
          <Card>
            <CardHeader>
              <CardTitle>Design System</CardTitle>
              <CardDescription>
                Theme, styling configuration, and UI components
              </CardDescription>
            </CardHeader>
            <CardContent>
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
                <p className="text-sm mb-4">The platform uses a custom dark theme with CSS variables:</p>
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
                <h4 className="text-lg font-medium mb-2">UI Components</h4>
                <p className="text-sm mb-4">
                  The platform uses shadcn/ui components, which are built on top of Radix UI primitives and styled with Tailwind CSS.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-card rounded-lg p-4 border border-border">
                    <h5 className="font-medium mb-2">Form Elements</h5>
                    <p className="text-xs text-muted-foreground">Buttons, inputs, selects, checkboxes</p>
                  </div>
                  <div className="bg-card rounded-lg p-4 border border-border">
                    <h5 className="font-medium mb-2">Layout Components</h5>
                    <p className="text-xs text-muted-foreground">Cards, tabs, sheets, dialogs</p>
                  </div>
                  <div className="bg-card rounded-lg p-4 border border-border">
                    <h5 className="font-medium mb-2">Data Display</h5>
                    <p className="text-xs text-muted-foreground">Tables, charts, avatars, badges</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security System</CardTitle>
              <CardDescription>
                Authentication, authorization, and data protection
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-4">User Authentication</h3>
                <p className="mb-4">
                  The platform uses Supabase Authentication with email/password authentication.
                  The authentication flow is secured with JWT tokens and follows modern security practices.
                </p>
                <div className="bg-card rounded-lg p-4 border border-border mb-4">
                  <h4 className="font-medium mb-2">Authentication Flow</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li>User signs up or logs in through the Auth page</li>
                    <li>Supabase validates credentials and returns a session</li>
                    <li>The session is managed by the useSession hook</li>
                    <li>Protected routes check permissions via the ProtectedRoute component</li>
                  </ol>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-4">Role-Based Access Control</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-card rounded-lg p-4 border border-border">
                    <h4 className="font-medium mb-2">User Roles</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li><strong>ADMIN:</strong> Full system access</li>
                      <li><strong>ORGANIZER:</strong> Community management</li>
                      <li><strong>MEMBER:</strong> Regular community access</li>
                      <li><strong>GUEST:</strong> Limited public access</li>
                    </ul>
                  </div>
                  <div className="bg-card rounded-lg p-4 border border-border">
                    <h4 className="font-medium mb-2">Community Roles</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li><strong>admin:</strong> Community administrator</li>
                      <li><strong>member:</strong> Regular community member</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4">Row-Level Security</h3>
                <p className="mb-4">
                  The platform uses Postgres Row-Level Security (RLS) to ensure data privacy and access control at the database level.
                </p>
                <div className="bg-muted/30 p-4 rounded-md overflow-x-auto">
                  <pre className="text-xs">
                    <code>
{`-- Example RLS policy for community membership
ALTER TABLE public.community_members ENABLE ROW LEVEL SECURITY;

-- Allow users to see only their own memberships
CREATE POLICY "Users can view their own memberships"
  ON public.community_members
  FOR SELECT
  USING (auth.uid() = user_id);

-- Allow community admins to view all memberships in their communities
CREATE POLICY "Community admins can view all memberships"
  ON public.community_members
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_id FROM public.community_members 
      WHERE community_id = community_members.community_id 
      AND role = 'admin'
    )
  );`}
                    </code>
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle>API & Services</CardTitle>
              <CardDescription>
                Backend services, API endpoints, and data flow
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-4">API Architecture</h3>
                <p className="mb-4">
                  The platform uses Supabase for data access and authentication. The API layer is 
                  organized into service modules that handle specific domain functionality.
                </p>
                <div className="bg-card rounded-lg p-4 border border-border">
                  <h4 className="font-medium mb-2">Service Layer Architecture</h4>
                  <div className="bg-muted/30 p-4 rounded-md overflow-x-auto mt-2">
                    <pre className="text-xs">
                      <code>
{`// Example service structure
// src/services/userQueryService.ts

import { supabase } from "@/integrations/supabase/client";
import { User, UserRole } from "@/models/types";

export const getAllUsers = async (): Promise<User[]> => {
  // Implementation for fetching users
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('*');
  
  // Process data and return users
  // ...
};`}
                      </code>
                    </pre>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-4">Key Services</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-card rounded-lg p-4 border border-border">
                    <h4 className="font-medium mb-2">User Management</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>User authentication and session management</li>
                      <li>Profile data management</li>
                      <li>Role assignment and permissions</li>
                    </ul>
                  </div>
                  <div className="bg-card rounded-lg p-4 border border-border">
                    <h4 className="font-medium mb-2">Community Management</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Community creation and configuration</li>
                      <li>Membership management</li>
                      <li>Community content and settings</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4">Data Flow</h3>
                <p>The platform follows a standard data flow pattern:</p>
                <ol className="list-decimal list-inside space-y-1 mb-4">
                  <li>UI components dispatch actions or queries</li>
                  <li>Custom hooks manage state and API interactions</li>
                  <li>Service layer handles business logic and API calls</li>
                  <li>Supabase client executes database operations</li>
                  <li>Row-Level Security enforces access control</li>
                  <li>Results flow back up to the UI</li>
                </ol>
                <div className="flex justify-center">
                  <LineChart className="h-24 w-24 text-primary opacity-70" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-center mt-8">
        <Button 
          className="flex items-center gap-2" 
          onClick={() => window.open('/DOCUMENTATION.md', '_blank')}
        >
          <FileText className="h-4 w-4" />
          View Full Documentation
        </Button>
      </div>
    </div>
  );
};

export default Documentation;
