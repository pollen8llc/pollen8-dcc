
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Code, Database, FileText, Layers, Lock, Server } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Documentation = () => {
  const navigate = useNavigate();

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      <div className="flex items-center mb-6 gap-4">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold">ECO8 Platform Documentation</h1>
          <p className="text-muted-foreground">Technical documentation and architecture overview</p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 gap-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="architecture">Architecture</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
          <TabsTrigger value="components">Components</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>ECO8 Platform</CardTitle>
              <CardDescription>
                A comprehensive platform for managing digital communities, their members, and knowledge bases.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Core Features</h3>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Community Management</li>
                    <li>User Role System</li>
                    <li>Knowledge Base</li>
                    <li>Admin Dashboard</li>
                    <li>Member Management</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Tech Stack</h3>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>React with TypeScript</li>
                    <li>Supabase Backend</li>
                    <li>TanStack Query</li>
                    <li>Tailwind CSS</li>
                    <li>Shadcn UI Components</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="architecture" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Structure</CardTitle>
              <CardDescription>Directory organization and code architecture</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
{`src/
├── components/         # Reusable UI components
│   ├── ui/            # shadcn/ui components
│   ├── admin/         # Admin dashboard components
│   ├── auth/          # Authentication components
│   ├── community/     # Community-related components
│   └── navbar/        # Navigation components
├── hooks/             # Custom React hooks
├── services/          # Business logic and API services
│   ├── userQueryService.ts
│   ├── userAccountService.ts
│   ├── roleService.ts
│   ├── communityService.ts
│   └── auditService.ts
├── models/            # TypeScript types and interfaces
└── pages/            # Page components`}</pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Database Schema</CardTitle>
              <CardDescription>Supabase tables and relationships</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Core Tables</h3>
                  <div className="bg-muted p-4 rounded-lg text-sm">
                    <pre>{`profiles
├── id (UUID, PK)
├── email (TEXT)
├── first_name (TEXT)
├── last_name (TEXT)
├── avatar_url (TEXT)
├── created_at (TIMESTAMPTZ)
└── updated_at (TIMESTAMPTZ)

communities
├── id (UUID, PK)
├── name (TEXT)
├── description (TEXT)
├── logo_url (TEXT)
├── website (TEXT)
├── created_at (TIMESTAMPTZ)
└── updated_at (TIMESTAMPTZ)

user_roles
├── id (UUID, PK)
├── user_id (UUID)
├── role_id (UUID)
├── assigned_at (TIMESTAMPTZ)
└── assigned_by (UUID)

roles
├── id (UUID, PK)
├── name (TEXT)
├── description (TEXT)
├── permissions (JSONB)
└── created_at (TIMESTAMPTZ)`}</pre>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="components" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Component Library</CardTitle>
              <CardDescription>Key components and their usage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Admin Components</h3>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>AdminDashboard - Main admin interface</li>
                    <li>UserManagementTab - User management</li>
                    <li>AdminStatsTab - Statistics and metrics</li>
                    <li>AdminSettingsTab - Platform settings</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Community Components</h3>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>CommunityProfile - Community details</li>
                    <li>CommunityHeader - Community header</li>
                    <li>MemberList - Community members</li>
                    <li>KnowledgeBase - Knowledge management</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Model</CardTitle>
              <CardDescription>Authentication and authorization</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Role-Based Access Control</h3>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>ADMIN - Full platform access</li>
                    <li>ORGANIZER - Community management</li>
                    <li>MEMBER - Basic platform access</li>
                    <li>GUEST - Limited public access</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Row Level Security</h3>
                  <p className="text-sm text-muted-foreground">
                    Supabase RLS policies ensure data access control at the database level
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Documentation;
