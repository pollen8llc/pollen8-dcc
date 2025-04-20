
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Code, 
  Database, 
  FileText, 
  Layers, 
  Lock, 
  Server, 
  Home,
  User,
  Users,
  Search,
  Settings,
  ExternalLink,
  Key,
  Shield
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const Documentation = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4">
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
          <h1 className="text-3xl font-bold">ECO8 Platform Technical Documentation</h1>
          <p className="text-muted-foreground">Comprehensive technical reference for developers</p>
        </div>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search documentation..."
          className="w-full pl-10 pr-4 py-2 rounded-md border border-border/40 bg-black/10 focus:outline-none focus:ring-2 focus:ring-primary/20"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="architecture">Architecture</TabsTrigger>
          <TabsTrigger value="routes">Routes</TabsTrigger>
          <TabsTrigger value="components">Components</TabsTrigger>
          <TabsTrigger value="hooks">Hooks & Utils</TabsTrigger>
          <TabsTrigger value="api">API Reference</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>ECO8 Platform Technical Overview</CardTitle>
              <CardDescription>
                Core technical architecture and implementation details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Layers className="h-5 w-5 mr-2 text-primary/80" />
                    Architecture Stack
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <Badge variant="outline" className="w-20 justify-center">Frontend</Badge>
                      <span className="text-sm">React 18.3.1 + TypeScript</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Badge variant="outline" className="w-20 justify-center">Routing</Badge>
                      <span className="text-sm">React Router Dom 6.26.2</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Badge variant="outline" className="w-20 justify-center">Styling</Badge>
                      <span className="text-sm">Tailwind CSS</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Badge variant="outline" className="w-20 justify-center">UI Library</Badge>
                      <span className="text-sm">shadcn/ui (Radix UI)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Badge variant="outline" className="w-20 justify-center">State</Badge>
                      <span className="text-sm">React Context + TanStack Query</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Badge variant="outline" className="w-20 justify-center">Backend</Badge>
                      <span className="text-sm">Supabase (Auth, DB, Storage)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Badge variant="outline" className="w-20 justify-center">Build</Badge>
                      <span className="text-sm">Vite</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-primary/80" />
                    Key Features
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary/80 mr-2"></span>
                      Role-based access control (RBAC)
                    </li>
                    <li className="flex items-center">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary/80 mr-2"></span>
                      Supabase authentication integration
                    </li>
                    <li className="flex items-center">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary/80 mr-2"></span>
                      PostgreSQL database with RLS policies
                    </li>
                    <li className="flex items-center">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary/80 mr-2"></span>
                      Community management system
                    </li>
                    <li className="flex items-center">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary/80 mr-2"></span>
                      Admin dashboard and controls
                    </li>
                    <li className="flex items-center">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary/80 mr-2"></span>
                      Multi-step form validation
                    </li>
                    <li className="flex items-center">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary/80 mr-2"></span>
                      Activity and audit logging
                    </li>
                    <li className="flex items-center">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary/80 mr-2"></span>
                      Repository pattern architecture
                    </li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Lock className="h-5 w-5 mr-2 text-primary/80" />
                    Security Implementation
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary/80 mr-2"></span>
                      JWT-based authentication
                    </li>
                    <li className="flex items-center">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary/80 mr-2"></span>
                      Row-Level Security (RLS) policies
                    </li>
                    <li className="flex items-center">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary/80 mr-2"></span>
                      Protected routes with role checks
                    </li>
                    <li className="flex items-center">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary/80 mr-2"></span>
                      Fine-grained permission system
                    </li>
                    <li className="flex items-center">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary/80 mr-2"></span>
                      Action audit logging
                    </li>
                    <li className="flex items-center">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary/80 mr-2"></span>
                      SQL injection protection via Supabase
                    </li>
                  </ul>
                </div>
              </div>

              <Separator className="my-6" />
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <Key className="h-5 w-5 mr-2 text-primary/80" />
                  Configuration Details
                </h3>
                <div className="bg-background/50 border border-border/20 p-4 rounded-md">
                  <code className="text-xs overflow-x-auto block">
                    <pre>
{`// Supabase Configuration
PROJECT_ID: "oltcuwvgdzszxshpfnre"
SUPABASE_URL: "https://oltcuwvgdzszxshpfnre.supabase.co"
AUTH_PROVIDERS: ["Email", "Password"]
RLS_ENABLED: true

// Environment Variables
NODE_ENV: "development" | "production"
PUBLIC_URL: "/"

// Build Configuration
VITE_CONFIG: {
  plugins: [...],
  resolve: { alias: {...} },
  server: { port: 3000 }
}`}
                    </pre>
                  </code>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="architecture" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Application Architecture</CardTitle>
              <CardDescription>Detailed architecture and data flow</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Project Structure</h3>
                <div className="bg-background/50 border border-border/20 p-4 rounded-md">
                  <code className="text-xs overflow-x-auto block">
                    <pre>
{`src/
├── components/         # Reusable UI components
│   ├── ui/            # shadcn/ui components (Radix UI primitives)
│   ├── admin/         # Admin dashboard components
│   ├── auth/          # Authentication components
│   ├── community/     # Community-related components
│   ├── debug/         # Debugging utilities
│   └── navbar/        # Navigation components
├── contexts/          # React contexts for state management
│   └── UserContext.tsx # Global user authentication state
├── data/              # Mock data and constants
├── hooks/             # Custom React hooks
│   ├── admin/         # Admin-specific hooks
│   ├── community/     # Community-related hooks
│   ├── forms/         # Form-related hooks
│   └── use-*.ts       # General utility hooks
├── integrations/      # External service integrations
│   └── supabase/      # Supabase client and types
├── lib/               # Utility libraries
├── models/            # TypeScript type definitions
├── pages/             # Page components
│   └── admin/         # Admin-specific pages
├── repositories/      # Data access layer
│   ├── base/          # Base repository utilities
│   ├── community/     # Community data access
│   └── queries/       # Query functions
├── schemas/           # Zod validation schemas
├── services/          # Business logic layer
│   └── community/     # Community-related services
└── utils/             # Utility functions`}
                    </pre>
                  </code>
                </div>
              </div>

              <div className="space-y-4 mt-6">
                <h3 className="text-lg font-semibold">Architecture Patterns</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-48">Pattern</TableHead>
                      <TableHead>Implementation</TableHead>
                      <TableHead className="w-32">Used For</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Repository Pattern</TableCell>
                      <TableCell>Implemented in <code className="text-xs">/repositories</code> with base abstractions and specific implementations</TableCell>
                      <TableCell>Data access</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Service Layer</TableCell>
                      <TableCell>Business logic encapsulated in <code className="text-xs">/services</code> with domain-specific modules</TableCell>
                      <TableCell>Business logic</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Context Providers</TableCell>
                      <TableCell>Application state managed in <code className="text-xs">/contexts</code> with React Context API</TableCell>
                      <TableCell>State management</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Custom Hooks</TableCell>
                      <TableCell>Stateful logic and side effects encapsulated in <code className="text-xs">/hooks</code></TableCell>
                      <TableCell>UI Logic</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">RLS Security</TableCell>
                      <TableCell>Row-Level Security policies in Supabase ensure data access control</TableCell>
                      <TableCell>Data security</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div className="space-y-4 mt-6">
                <h3 className="text-lg font-semibold">Authentication Flow</h3>
                <div className="bg-background/50 border border-border/20 p-4 rounded-md">
                  <code className="text-xs overflow-x-auto block">
                    <pre>
{`1. User initiates auth → Auth.tsx renders login/register form
2. Credentials submitted → Supabase.auth.signInWithPassword() / signUp()
3. Auth response received → Session stored in Supabase client
4. UserContext.tsx retrieves session → useSession hook
5. Profile data fetched → useProfile hook queries profiles table
6. Role determination → useProfile assigns role based on database records
7. Protected route access → ProtectedRoute component checks user role and permissions
8. Route rendered or redirected → Based on permission checks`}
                    </pre>
                  </code>
                </div>
              </div>

              <div className="space-y-4 mt-6">
                <h3 className="text-lg font-semibold">Data Flow Diagram</h3>
                <div className="bg-background/50 border border-border/20 p-4 rounded-md">
                  <code className="text-xs overflow-x-auto block whitespace-pre">
                    <pre>
{`┌───────────┐      ┌────────────┐      ┌──────────────┐      ┌─────────────┐
│ UI Layer   │ ←──→ │ React      │ ←──→ │ Services      │ ←──→ │ Repositories │
│ Components │      │ Hooks      │      │ Business Logic│      │ Data Access  │
└───────────┘      └────────────┘      └──────────────┘      └─────────────┘
                                                                    ↑
                   ┌────────────┐                                   │
                   │ Context    │                                   ↓
                   │ Providers  │                          ┌─────────────────┐
                   └────────────┘                          │ Supabase Client │
                         ↑                                 │ (API/Database)  │
                         │                                 └─────────────────┘
┌────────────────────────┴────────────────────────────────────────┐
│                                                                  │
│                           App.tsx                                │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘`}
                    </pre>
                  </code>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="routes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Application Routes</CardTitle>
              <CardDescription>Complete route structure and access requirements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-64">Path</TableHead>
                    <TableHead>Component</TableHead>
                    <TableHead className="w-32">Access Level</TableHead>
                    <TableHead className="w-32">Parameters</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium"><code className="text-xs">/</code></TableCell>
                    <TableCell><code className="text-xs">Index.tsx</code></TableCell>
                    <TableCell>Public</TableCell>
                    <TableCell>None</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium"><code className="text-xs">/auth</code></TableCell>
                    <TableCell><code className="text-xs">Auth.tsx</code></TableCell>
                    <TableCell>Public</TableCell>
                    <TableCell>None</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium"><code className="text-xs">/onboarding</code></TableCell>
                    <TableCell><code className="text-xs">Onboarding.tsx</code></TableCell>
                    <TableCell>Authenticated</TableCell>
                    <TableCell>None</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium"><code className="text-xs">/create-community</code></TableCell>
                    <TableCell><code className="text-xs">CreateCommunity.tsx</code></TableCell>
                    <TableCell>ADMIN, ORGANIZER</TableCell>
                    <TableCell>None</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium"><code className="text-xs">/communities/join</code></TableCell>
                    <TableCell><code className="text-xs">JoinCommunities.tsx</code></TableCell>
                    <TableCell>MEMBER+</TableCell>
                    <TableCell>None</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium"><code className="text-xs">/create-admin</code></TableCell>
                    <TableCell><code className="text-xs">CreateAdminForm.tsx</code></TableCell>
                    <TableCell>Public</TableCell>
                    <TableCell>None</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium"><code className="text-xs">/community/:id</code></TableCell>
                    <TableCell><code className="text-xs">CommunityProfile.tsx</code></TableCell>
                    <TableCell>Public</TableCell>
                    <TableCell>id: UUID</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium"><code className="text-xs">/documentation</code></TableCell>
                    <TableCell><code className="text-xs">Documentation.tsx</code></TableCell>
                    <TableCell>Public</TableCell>
                    <TableCell>None</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium"><code className="text-xs">/profile</code></TableCell>
                    <TableCell><code className="text-xs">Profile.tsx</code></TableCell>
                    <TableCell>MEMBER+</TableCell>
                    <TableCell>None</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium"><code className="text-xs">/admin</code></TableCell>
                    <TableCell><code className="text-xs">AdminDashboard.tsx</code></TableCell>
                    <TableCell>ADMIN</TableCell>
                    <TableCell>None</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium"><code className="text-xs">/admin/community/:id</code></TableCell>
                    <TableCell><code className="text-xs">AdminDashboard.tsx</code></TableCell>
                    <TableCell>ORGANIZER</TableCell>
                    <TableCell>id: UUID</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium"><code className="text-xs">/organizer</code></TableCell>
                    <TableCell><code className="text-xs">OrganizerDashboard.tsx</code></TableCell>
                    <TableCell>ORGANIZER</TableCell>
                    <TableCell>None</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium"><code className="text-xs">/admin/debug</code></TableCell>
                    <TableCell><code className="text-xs">DebuggerDashboard.tsx</code></TableCell>
                    <TableCell>ADMIN</TableCell>
                    <TableCell>None</TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <div className="space-y-4 mt-6">
                <h3 className="text-lg font-semibold">Route Implementation Source</h3>
                <div className="bg-background/50 border border-border/20 p-4 rounded-md">
                  <code className="text-xs overflow-x-auto block">
                    <pre>
{`// AppRoutes.tsx
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useUser } from "@/contexts/UserContext";
import { UserRole } from "@/models/types";

// Route configuration with protection
<Routes>
  <Route path="/" element={<Index />} />
  <Route path="/auth" element={<Auth />} />
  <Route path="/onboarding" element={<Onboarding />} />
  <Route path="/create-community" element={<CreateCommunity />} />
  <Route path="/communities/join" element={
    <ProtectedRoute requiredRole="MEMBER">
      <JoinCommunities />
    </ProtectedRoute>
  } />
  <Route path="/create-admin" element={<CreateAdminForm />} />
  <Route path="/community/:id" element={<CommunityProfile />} />
  <Route path="/documentation" element={<Documentation />} />
  <Route path="/profile" element={
    <ProtectedRoute requiredRole="MEMBER">
      <Profile />
    </ProtectedRoute>
  } />
  
  <Route 
    path="/admin" 
    element={
      <ProtectedRoute requiredRole="ADMIN">
        <AdminDashboard />
      </ProtectedRoute>
    } 
  />
  // ... remaining routes
</Routes>`}
                    </pre>
                  </code>
                </div>
              </div>

              <div className="space-y-4 mt-6">
                <h3 className="text-lg font-semibold">Route Protection Mechanism</h3>
                <p className="text-sm text-muted-foreground">Routes are protected using the <code className="text-xs">ProtectedRoute</code> component, which checks the user's role against required access level:</p>
                <div className="bg-background/50 border border-border/20 p-4 rounded-md">
                  <code className="text-xs overflow-x-auto block">
                    <pre>
{`// ProtectedRoute.tsx
const ProtectedRoute = ({ children, requiredRole, communityId }) => {
  const { currentUser, isLoading } = useUser();
  const navigate = useNavigate();
  
  // Convert required role string to enum
  const roleEnum = requiredRole === "ADMIN" 
    ? UserRole.ADMIN 
    : requiredRole === "ORGANIZER" 
      ? UserRole.ORGANIZER 
      : UserRole.MEMBER;

  useEffect(() => {
    if (!isLoading && (!currentUser || currentUser.role === UserRole.GUEST)) {
      navigate("/auth");
    } else if (!isLoading && currentUser) {
      const hasRequiredRole = 
        currentUser.role === UserRole.ADMIN || 
        currentUser.role === roleEnum ||
        (roleEnum === UserRole.ORGANIZER && 
         communityId && 
         currentUser.managedCommunities?.includes(communityId));
      
      if (!hasRequiredRole) {
        navigate("/");
      }
    }
  }, [currentUser, isLoading, navigate, roleEnum, communityId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return children;
};`}
                    </pre>
                  </code>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="components" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Component Reference</CardTitle>
              <CardDescription>Detailed component documentation</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                <Accordion type="multiple" className="w-full">
                  <AccordionItem value="ui-components">
                    <AccordionTrigger className="text-lg font-medium">
                      UI Components
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <p className="text-sm text-muted-foreground mb-4">
                        Shadcn UI components built on Radix UI primitives. All are located in <code className="text-xs">src/components/ui/</code>
                      </p>
                      
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-48">Component</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="w-32">Import Path</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell className="font-medium">Button</TableCell>
                            <TableCell>Primary action component with multiple variants</TableCell>
                            <TableCell><code className="text-xs">@/components/ui/button</code></TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Form</TableCell>
                            <TableCell>Form components built on React Hook Form</TableCell>
                            <TableCell><code className="text-xs">@/components/ui/form</code></TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Card</TableCell>
                            <TableCell>Container for content with header and footer options</TableCell>
                            <TableCell><code className="text-xs">@/components/ui/card</code></TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Tabs</TableCell>
                            <TableCell>Tabbed interface for content organization</TableCell>
                            <TableCell><code className="text-xs">@/components/ui/tabs</code></TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Toast</TableCell>
                            <TableCell>Notification system for user feedback</TableCell>
                            <TableCell><code className="text-xs">@/components/ui/toast</code></TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="community-components">
                    <AccordionTrigger className="text-lg font-medium">
                      Community Components
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <p className="text-sm text-muted-foreground mb-4">
                        Community-specific components located in <code className="text-xs">src/components/community/</code>
                      </p>
                      
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-48">Component</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="w-32">Props</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell className="font-medium">CreateCommunityForm</TableCell>
                            <TableCell>Multi-step form for community creation with progress tracking</TableCell>
                            <TableCell>None</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">BasicInfoForm</TableCell>
                            <TableCell>First step of community creation form for basic details</TableCell>
                            <TableCell><code className="text-xs">form: UseFormReturn</code></TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">PlatformsForm</TableCell>
                            <TableCell>Form step for community platforms selection</TableCell>
                            <TableCell><code className="text-xs">form: UseFormReturn</code></TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">SocialMediaForm</TableCell>
                            <TableCell>Form step for social media handles</TableCell>
                            <TableCell><code className="text-xs">form: UseFormReturn</code></TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">CommunityHeader</TableCell>
                            <TableCell>Header component for community profile</TableCell>
                            <TableCell><code className="text-xs">community: Community</code></TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="admin-components">
                    <AccordionTrigger className="text-lg font-medium">
                      Admin Components
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <p className="text-sm text-muted-foreground mb-4">
                        Admin dashboard components located in <code className="text-xs">src/components/admin/</code>
                      </p>
                      
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-48">Component</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="w-32">Props</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell className="font-medium">AdminOverviewCards</TableCell>
                            <TableCell>Metrics dashboard cards for admin overview</TableCell>
                            <TableCell>None</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">UserManagementTab</TableCell>
                            <TableCell>User management interface for admins</TableCell>
                            <TableCell>None</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">CommunityAuditTable</TableCell>
                            <TableCell>Table for community audit logs</TableCell>
                            <TableCell><code className="text-xs">communityId?: string</code></TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">UserRoleSelector</TableCell>
                            <TableCell>Dropdown for changing user roles</TableCell>
                            <TableCell><code className="text-xs">userId: string, currentRole: UserRole</code></TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">CreateAdminForm</TableCell>
                            <TableCell>Form for creating admin accounts</TableCell>
                            <TableCell>None</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="auth-components">
                    <AccordionTrigger className="text-lg font-medium">
                      Authentication Components
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <p className="text-sm text-muted-foreground mb-4">
                        Authentication components located in <code className="text-xs">src/components/auth/</code>
                      </p>
                      
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-48">Component</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="w-32">Props</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell className="font-medium">AuthLayout</TableCell>
                            <TableCell>Layout wrapper for auth pages</TableCell>
                            <TableCell><code className="text-xs">children: ReactNode</code></TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">ProtectedRoute</TableCell>
                            <TableCell>Component for role-based route protection</TableCell>
                            <TableCell><code className="text-xs">children: ReactNode, requiredRole: string, communityId?: string</code></TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="navbar-components">
                    <AccordionTrigger className="text-lg font-medium">
                      Navigation Components
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <p className="text-sm text-muted-foreground mb-4">
                        Navbar and navigation components located in <code className="text-xs">src/components/navbar/</code>
                      </p>
                      
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-48">Component</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="w-32">Props</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell className="font-medium">Navbar</TableCell>
                            <TableCell>Main navigation component</TableCell>
                            <TableCell>None</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">UserActions</TableCell>
                            <TableCell>Action buttons for authenticated users</TableCell>
                            <TableCell><code className="text-xs">user: User</code></TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">GuestActions</TableCell>
                            <TableCell>Action buttons for unauthenticated users</TableCell>
                            <TableCell>None</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">NavigationDrawer</TableCell>
                            <TableCell>Mobile navigation drawer component</TableCell>
                            <TableCell>None</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">UserMenuDropdown</TableCell>
                            <TableCell>User profile dropdown menu</TableCell>
                            <TableCell><code className="text-xs">user: User</code></TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hooks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hooks and Utilities</CardTitle>
              <CardDescription>Custom hooks, utility functions and service layer</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                <Accordion type="multiple" className="w-full">
                  <AccordionItem value="auth-hooks">
                    <AccordionTrigger className="text-lg font-medium">
                      Authentication Hooks
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-48">Hook</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="w-32">Returns</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell className="font-medium"><code className="text-xs">useAuth</code></TableCell>
                            <TableCell>Manages authentication state and operations</TableCell>
                            <TableCell><code className="text-xs">{ login, logout, register, isLoading, error }</code></TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium"><code className="text-xs">useSession</code></TableCell>
                            <TableCell>Manages Supabase session state</TableCell>
                            <TableCell><code className="text-xs">{ session, isLoading }</code></TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium"><code className="text-xs">useProfile</code></TableCell>
                            <TableCell>Fetches and manages user profile data</TableCell>
                            <TableCell><code className="text-xs">{ profile, isLoading, error }</code></TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium"><code className="text-xs">usePermissions</code></TableCell>
                            <TableCell>Handles role-based permissions</TableCell>
                            <TableCell><code className="text-xs">{ hasPermission, isOrganizer }</code></TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="form-hooks">
                    <AccordionTrigger className="text-lg font-medium">
                      Form Hooks
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-48">Hook</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="w-32">Returns</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell className="font-medium"><code className="text-xs">useCreateCommunityForm</code></TableCell>
                            <TableCell>Manages the multi-step community creation form</TableCell>
                            <TableCell><code className="text-xs">{ form, isSubmitting, activeTab, progress, onSubmit }</code></TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium"><code className="text-xs">useFormProgress</code></TableCell>
                            <TableCell>Tracks multi-step form progress</TableCell>
                            <TableCell><code className="text-xs">{ activeTab, progress, updateProgress }</code></TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium"><code className="text-xs">useCommunityForm</code></TableCell>
                            <TableCell>Handles community form validation and submission</TableCell>
                            <TableCell><code className="text-xs">{ form, submitForm, isSubmitting }</code></TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium"><code className="text-xs">useDebugLogger</code></TableCell>
                            <TableCell>Development utility for form debugging</TableCell>
                            <TableCell><code className="text-xs">{ debugLogs, addDebugLog, clearDebugLogs }</code></TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="admin-hooks">
                    <AccordionTrigger className="text-lg font-medium">
                      Admin Hooks
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-48">Hook</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="w-32">Returns</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell className="font-medium"><code className="text-xs">useAdminUsers</code></TableCell>
                            <TableCell>Fetches and manages user data for admin dashboard</TableCell>
                            <TableCell><code className="text-xs">{ users, isLoading, error, refetch }</code></TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium"><code className="text-xs">useUserActions</code></TableCell>
                            <TableCell>Provides actions for user management (deactivate, reset password)</TableCell>
                            <TableCell><code className="text-xs">{ deactivateUser, resetPassword, isLoading }</code></TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium"><code className="text-xs">useUserRoleManagement</code></TableCell>
                            <TableCell>Manages role assignment operations</TableCell>
                            <TableCell><code className="text-xs">{ updateRole, isUpdating, error }</code></TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium"><code className="text-xs">useUserCommunities</code></TableCell>
                            <TableCell>Fetches communities a user belongs to</TableCell>
                            <TableCell><code className="text-xs">{ communities, isLoading, error }</code></TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="utility-functions">
                    <AccordionTrigger className="text-lg font-medium">
                      Utility Functions
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-48">Function</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="w-32">Module</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell className="font-medium"><code className="text-xs">cn</code></TableCell>
                            <TableCell>Conditional className utility (uses tailwind-merge)</TableCell>
                            <TableCell><code className="text-xs">@/lib/utils</code></TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium"><code className="text-xs">formatDistanceToNow</code></TableCell>
                            <TableCell>Date formatting utility using date-fns</TableCell>
                            <TableCell><code className="text-xs">@/lib/utils</code></TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium"><code className="text-xs">communityLogger</code></TableCell>
                            <TableCell>Logging utility for community operations</TableCell>
                            <TableCell><code className="text-xs">@/utils/communityLogger</code></TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium"><code className="text-xs">debugLogger</code></TableCell>
                            <TableCell>Development debugging utilities</TableCell>
                            <TableCell><code className="text-xs">@/utils/debugLogger</code></TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="service-layer">
                    <AccordionTrigger className="text-lg font-medium">
                      Service Layer
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <p className="text-sm text-muted-foreground mb-4">
                        Business logic services located in <code className="text-xs">src/services/</code>
                      </p>
                      
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-56">Service</TableHead>
                            <TableHead>Key Functions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell className="font-medium"><code className="text-xs">communityQueryService</code></TableCell>
                            <TableCell>
                              <ul className="list-disc list-inside text-xs space-y-1">
                                <li><code>getAllCommunities(page, pageSize)</code></li>
                                <li><code>getCommunityById(id)</code></li>
                                <li><code>searchCommunities(query)</code></li>
                                <li><code>getManagedCommunities(userId)</code></li>
                              </ul>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium"><code className="text-xs">communityMutationService</code></TableCell>
                            <TableCell>
                              <ul className="list-disc list-inside text-xs space-y-1">
                                <li><code>createCommunity(community)</code></li>
                                <li><code>updateCommunity(community)</code></li>
                                <li><code>deleteCommunity(communityId)</code></li>
                              </ul>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium"><code className="text-xs">communityMembershipService</code></TableCell>
                            <TableCell>
                              <ul className="list-disc list-inside text-xs space-y-1">
                                <li><code>joinCommunity(communityId, userId)</code></li>
                                <li><code>leaveCommunity(communityId, userId)</code></li>
                                <li><code>makeAdmin(communityId, userId)</code></li>
                                <li><code>removeAdmin(communityId, userId)</code></li>
                              </ul>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium"><code className="text-xs">communitySubmissionService</code></TableCell>
                            <TableCell>
                              <ul className="list-disc list-inside text-xs space-y-1">
                                <li><code>submitCommunity(data, addDebugLog)</code></li>
                              </ul>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium"><code className="text-xs">userQueryService</code></TableCell>
                            <TableCell>
                              <ul className="list-disc list-inside text-xs space-y-1">
                                <li><code>getAllUsers()</code></li>
                                <li><code>getUserCounts()</code></li>
                              </ul>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium"><code className="text-xs">roleService</code></TableCell>
                            <TableCell>
                              <ul className="list-disc list-inside text-xs space-y-1">
                                <li><code>updateUserRole(userId, role)</code></li>
                                <li><code>getRoles()</code></li>
                              </ul>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium"><code className="text-xs">auditService</code></TableCell>
                            <TableCell>
                              <ul className="list-disc list-inside text-xs space-y-1">
                                <li><code>logAuditAction(action, details)</code></li>
                                <li><code>getAuditLogs(filter)</code></li>
                              </ul>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>API Reference</CardTitle>
              <CardDescription>Supabase API endpoints and request formats</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                <Accordion type="multiple" className="w-full">
                  <AccordionItem value="auth-api">
                    <AccordionTrigger className="text-lg font-medium">
                      Authentication API
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <div className="space-y-6">
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge className="bg-green-600">POST</Badge>
                            <h3 className="text-md font-semibold">Sign In</h3>
                          </div>
                          <div className="bg-background/50 border border-border/20 p-4 rounded-md">
                            <code className="text-xs overflow-x-auto block">
                              <pre>
{`// Request
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'example@email.com',
  password: 'password123'
})

// Response
{
  "data": {
    "session": {
      "access_token": "jwt-token",
      "refresh_token": "refresh-token",
      "expires_in": 3600,
      "user": {
        "id": "uuid",
        "email": "example@email.com"
      }
    }
  },
  "error": null
}`}
                              </pre>
                            </code>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge className="bg-green-600">POST</Badge>
                            <h3 className="text-md font-semibold">Sign Up</h3>
                          </div>
                          <div className="bg-background/50 border border-border/20 p-4 rounded-md">
                            <code className="text-xs overflow-x-auto block">
                              <pre>
{`// Request
const { data, error } = await supabase.auth.signUp({
  email: 'example@email.com',
  password: 'password123',
  options: {
    data: {
      first_name: 'John',
      last_name: 'Doe'
    }
  }
})

// Response
{
  "data": {
    "user": {
      "id": "uuid",
      "email": "example@email.com"
    },
    "session": null  // Only returned if email confirmation is disabled
  },
  "error": null
}`}
                              </pre>
                            </code>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge className="bg-blue-600">GET</Badge>
                            <h3 className="text-md font-semibold">Get Session</h3>
                          </div>
                          <div className="bg-background/50 border border-border/20 p-4 rounded-md">
                            <code className="text-xs overflow-x-auto block">
                              <pre>
{`// Request
const { data, error } = await supabase.auth.getSession()

// Response
{
  "data": {
    "session": {
      "access_token": "jwt-token",
      "refresh_token": "refresh-token",
      "expires_in": 3600,
      "user": {
        "id": "uuid",
        "email": "example@email.com"
      }
    }
  },
  "error": null
}`}
                              </pre>
                            </code>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge className="bg-red-600">POST</Badge>
                            <h3 className="text-md font-semibold">Sign Out</h3>
                          </div>
                          <div className="bg-background/50 border border-border/20 p-4 rounded-md">
                            <code className="text-xs overflow-x-auto block">
                              <pre>
{`// Request
const { error } = await supabase.auth.signOut()

// Response
{
  "error": null
}`}
                              </pre>
                            </code>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="communities-api">
                    <AccordionTrigger className="text-lg font-medium">
                      Communities API
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <div className="space-y-6">
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge className="bg-blue-600">GET</Badge>
                            <h3 className="text-md font-semibold">List Communities</h3>
                          </div>
                          <div className="bg-background/50 border border-border/20 p-4 rounded-md">
                            <code className="text-xs overflow-x-auto block">
                              <pre>
{`// Request
const { data, error } = await supabase
  .from('communities')
  .select('*')
  .limit(10)
  .range(0, 9)  // Pagination

// Response
{
  "data": [
    {
      "id": "uuid",
      "name": "Community Name",
      "description": "Community description",
      "logo_url": "https://example.com/logo.png",
      "website": "https://community.com",
      "is_public": true,
      "location": "Remote",
      "owner_id": "user-uuid",
      "created_at": "2023-01-01T00:00:00.000Z",
      "updated_at": "2023-01-01T00:00:00.000Z"
    },
    // More communities...
  ],
  "error": null
}`}
                              </pre>
                            </code>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge className="bg-blue-600">GET</Badge>
                            <h3 className="text-md font-semibold">Get Community by ID</h3>
                          </div>
                          <div className="bg-background/50 border border-border/20 p-4 rounded-md">
                            <code className="text-xs overflow-x-auto block">
                              <pre>
{`// Request
const { data, error } = await supabase
  .from('communities')
  .select('*')
  .eq('id', 'community-uuid')
  .single()

// Response
{
  "data": {
    "id": "community-uuid",
    "name": "Community Name",
    "description": "Community description",
    "logo_url": "https://example.com/logo.png",
    "website": "https://community.com",
    "is_public": true,
    "location": "Remote",
    "owner_id": "user-uuid",
    "created_at": "2023-01-01T00:00:00.000Z",
    "updated_at": "2023-01-01T00:00:00.000Z"
  },
  "error": null
}`}
                              </pre>
                            </code>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge className="bg-green-600">POST</Badge>
                            <h3 className="text-md font-semibold">Create Community</h3>
                          </div>
                          <div className="bg-background/50 border border-border/20 p-4 rounded-md">
                            <code className="text-xs overflow-x-auto block">
                              <pre>
{`// Request
const { data, error } = await supabase
  .from('communities')
  .insert({
    name: "New Community",
    description: "Community description",
    logo_url: "https://example.com/logo.png",
    website: "https://community.com",
    is_public: true,
    location: "Remote",
    target_audience: ["developers", "designers"]
  })
  .select()
  .single()

// Response
{
  "data": {
    "id": "new-uuid",
    "name": "New Community",
    "description": "Community description",
    "logo_url": "https://example.com/logo.png",
    "website": "https://community.com",
    "is_public": true,
    "location": "Remote",
    "owner_id": "user-uuid",
    "target_audience": ["developers", "designers"],
    "created_at": "2023-01-01T00:00:00.000Z",
    "updated_at": "2023-01-01T00:00:00.000Z"
  },
  "error": null
}`}
                              </pre>
                            </code>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge className="bg-yellow-600">PATCH</Badge>
                            <h3 className="text-md font-semibold">Update Community</h3>
                          </div>
                          <div className="bg-background/50 border border-border/20 p-4 rounded-md">
                            <code className="text-xs overflow-x-auto block">
                              <pre>
{`// Request
const { data, error } = await supabase
  .from('communities')
  .update({
    name: "Updated Community Name",
    description: "Updated description"
  })
  .eq('id', 'community-uuid')
  .select()
  .single()

// Response
{
  "data": {
    "id": "community-uuid",
    "name": "Updated Community Name",
    "description": "Updated description",
    "logo_url": "https://example.com/logo.png",
    "website": "https://community.com",
    "is_public": true,
    "location": "Remote",
    "owner_id": "user-uuid",
    "created_at": "2023-01-01T00:00:00.000Z",
    "updated_at": "2023-01-01T00:00:00.000Z"
  },
  "error": null
}`}
                              </pre>
                            </code>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge className="bg-red-600">DELETE</Badge>
                            <h3 className="text-md font-semibold">Delete Community</h3>
                          </div>
                          <div className="bg-background/50 border border-border/20 p-4 rounded-md">
                            <code className="text-xs overflow-x-auto block">
                              <pre>
{`// Request
const { data, error } = await supabase.rpc(
  'safe_delete_community',
  {
    community_id: 'community-uuid',
    user_id: 'user-uuid'
  }
)

// Response
{
  "data": true,
  "error": null
}`}
                              </pre>
                            </code>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="users-api">
                    <AccordionTrigger className="text-lg font-medium">
                      Users API
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <div className="space-y-6">
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge className="bg-blue-600">GET</Badge>
                            <h3 className="text-md font-semibold">Get User Profile</h3>
                          </div>
                          <div className="bg-background/50 border border-border/20 p-4 rounded-md">
                            <code className="text-xs overflow-x-auto block">
                              <pre>
{`// Request
const { data, error } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', 'user-uuid')
  .single()

// Response
{
  "data": {
    "id": "user-uuid",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "avatar_url": "https://example.com/avatar.png",
    "created_at": "2023-01-01T00:00:00.000Z",
    "updated_at": "2023-01-01T00:00:00.000Z"
  },
  "error": null
}`}
                              </pre>
                            </code>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge className="bg-yellow-600">PATCH</Badge>
                            <h3 className="text-md font-semibold">Update User Profile</h3>
                          </div>
                          <div className="bg-background/50 border border-border/20 p-4 rounded-md">
                            <code className="text-xs overflow-x-auto block">
                              <pre>
{`// Request
const { data, error } = await supabase
  .from('profiles')
  .update({
    first_name: "Updated",
    last_name: "Name",
    avatar_url: "https://example.com/new-avatar.png"
  })
  .eq('id', 'user-uuid')
  .select()

// Response
{
  "data": {
    "id": "user-uuid",
    "email": "user@example.com",
    "first_name": "Updated",
    "last_name": "Name",
    "avatar_url": "https://example.com/new-avatar.png",
    "created_at": "2023-01-01T00:00:00.000Z",
    "updated_at": "2023-01-01T00:00:00.000Z"
  },
  "error": null
}`}
                              </pre>
                            </code>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge className="bg-blue-600">GET</Badge>
                            <h3 className="text-md font-semibold">Get User Roles</h3>
                          </div>
                          <div className="bg-background/50 border border-border/20 p-4 rounded-md">
                            <code className="text-xs overflow-x-auto block">
                              <pre>
{`// Request
const { data, error } = await supabase.rpc(
  'get_user_roles',
  { user_id: 'user-uuid' }
)

// Response
{
  "data": ["ADMIN", "ORGANIZER"],
  "error": null
}`}
                              </pre>
                            </code>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge className="bg-yellow-600">POST</Badge>
                            <h3 className="text-md font-semibold">Update User Role</h3>
                          </div>
                          <div className="bg-background/50 border border-border/20 p-4 rounded-md">
                            <code className="text-xs overflow-x-auto block">
                              <pre>
{`// Request
const { data, error } = await supabase.rpc(
  'update_user_role',
  {
    p_user_id: 'user-uuid',
    p_role_name: 'ADMIN',
    p_assigner_id: 'admin-user-uuid'
  }
)

// Response
{
  "data": true,
  "error": null
}`}
                              </pre>
                            </code>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="database-functions">
                    <AccordionTrigger className="text-lg font-medium">
                      Database Functions
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-48">Function</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="w-32">Parameters</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell className="font-medium"><code className="text-xs">get_user_roles</code></TableCell>
                            <TableCell>Returns all roles assigned to a user</TableCell>
                            <TableCell><code className="text-xs">user_id: UUID</code></TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium"><code className="text-xs">has_role</code></TableCell>
                            <TableCell>Checks if a user has a specific role</TableCell>
                            <TableCell><code className="text-xs">user_id: UUID, role_name: TEXT</code></TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium"><code className="text-xs">is_admin</code></TableCell>
                            <TableCell>Checks if a user is an admin</TableCell>
                            <TableCell><code className="text-xs">user_id: UUID</code></TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium"><code className="text-xs">get_community_admin_status</code></TableCell>
                            <TableCell>Checks if a user is an admin of a specific community</TableCell>
                            <TableCell><code className="text-xs">user_id: UUID, community_id: UUID</code></TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium"><code className="text-xs">get_highest_role</code></TableCell>
                            <TableCell>Returns the highest role a user has</TableCell>
                            <TableCell><code className="text-xs">user_id: UUID</code></TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium"><code className="text-xs">get_user_memberships</code></TableCell>
                            <TableCell>Returns all community memberships for a user</TableCell>
                            <TableCell><code className="text-xs">user_id: UUID</code></TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium"><code className="text-xs">safe_delete_community</code></TableCell>
                            <TableCell>Safely deletes a community with ownership check</TableCell>
                            <TableCell><code className="text-xs">community_id: UUID, user_id: UUID</code></TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium"><code className="text-xs">update_user_role</code></TableCell>
                            <TableCell>Updates a user's role</TableCell>
                            <TableCell><code className="text-xs">p_user_id: UUID, p_role_name: TEXT, p_assigner_id: UUID</code></TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium"><code className="text-xs">log_audit_action</code></TableCell>
                            <TableCell>Logs an audit action</TableCell>
                            <TableCell><code className="text-xs">action_name: TEXT, performer_id: UUID, target_id: UUID, action_details: JSONB</code></TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Database Schema</CardTitle>
              <CardDescription>PostgreSQL schema and entity relationships</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center">
                      <Database className="h-5 w-5 mr-2 text-primary/80" />
                      Core Tables
                    </h3>
                    
                    <Accordion type="multiple" className="w-full">
                      <AccordionItem value="communities-table">
                        <AccordionTrigger className="font-medium">
                          communities
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4">
                            <div className="bg-background/50 border border-border/20 p-4 rounded-md">
                              <code className="text-xs overflow-x-auto block">
                                <pre>
{`CREATE TABLE public.communities (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  logo_url TEXT,
  website TEXT,
  is_public BOOLEAN NOT NULL DEFAULT true,
  location TEXT DEFAULT 'Remote',
  owner_id UUID NOT NULL,
  member_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  social_media JSONB DEFAULT '{}'::jsonb,
  communication_platforms JSONB DEFAULT '{}'::jsonb,
  target_audience TEXT[],
  format TEXT,
  community_type TEXT,
  vision TEXT,
  role_title TEXT,
  community_structure TEXT,
  community_values TEXT,
  type TEXT,
  tags TEXT[] DEFAULT '{}'::text[],
  founder_name TEXT,
  personal_background TEXT,
  newsletter_url TEXT,
  event_frequency TEXT,
  start_date TIMESTAMPTZ
);`}</pre>
                              </code>
                            </div>

                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="w-48">Indexes</TableHead>
                                  <TableHead>Type</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                <TableRow>
                                  <TableCell><code className="text-xs">communities_pkey</code></TableCell>
                                  <TableCell>PRIMARY KEY (id)</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell><code className="text-xs">idx_communities_owner</code></TableCell>
                                  <TableCell>BTREE (owner_id)</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell><code className="text-xs">idx_communities_name</code></TableCell>
                                  <TableCell>BTREE (name)</TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="profiles-table">
                        <AccordionTrigger className="font-medium">
                          profiles
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4">
                            <div className="bg-background/50 border border-border/20 p-4 rounded-md">
                              <code className="text-xs overflow-x-auto block">
                                <pre>
{`CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);`}</pre>
                              </code>
                            </div>

                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="w-48">Triggers</TableHead>
                                  <TableHead>Function</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                <TableRow>
                                  <TableCell><code className="text-xs">set_profile_updated_at</code></TableCell>
                                  <TableCell><code className="text-xs">handle_profile_update()</code></TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="roles-table">
                        <AccordionTrigger className="font-medium">
                          roles
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4">
                            <div className="bg-background/50 border border-border/20 p-4 rounded-md">
                              <code className="text-xs overflow-x-auto block">
                                <pre>
{`CREATE TABLE public.roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  permissions JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);`}</pre>
                              </code>
                            </div>

                            <div className="pt-2">
                              <h4 className="text-sm font-medium mb-2">Default Records</h4>
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>name</TableHead>
                                    <TableHead>description</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  <TableRow>
                                    <TableCell><code className="text-xs">ADMIN</code></TableCell>
                                    <TableCell>System administrator with full access</TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell><code className="text-xs">ORGANIZER</code></TableCell>
                                    <TableCell>Community organizer with management access</TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell><code className="text-xs">MEMBER</code></TableCell>
                                    <TableCell>Regular platform member</TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell><code className="text-xs">GUEST</code></TableCell>
                                    <TableCell>Unauthenticated user with limited access</TableCell>
                                  </TableRow>
                                </TableBody>
                              </Table>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="user-roles-table">
                        <AccordionTrigger className="font-medium">
                          user_roles
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4">
                            <div className="bg-background/50 border border-border/20 p-4 rounded-md">
                              <code className="text-xs overflow-x-auto block">
                                <pre>
{`CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role_id UUID NOT NULL REFERENCES public.roles(id),
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  assigned_by UUID,
  UNIQUE(user_id, role_id)
);`}</pre>
                              </code>
                            </div>

                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="w-48">Indexes</TableHead>
                                  <TableHead>Type</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                <TableRow>
                                  <TableCell><code className="text-xs">user_roles_pkey</code></TableCell>
                                  <TableCell>PRIMARY KEY (id)</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell><code className="text-xs">user_roles_user_id_role_id_key</code></TableCell>
                                  <TableCell>UNIQUE (user_id, role_id)</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell><code className="text-xs">idx_user_roles_user_id</code></TableCell>
                                  <TableCell>BTREE (user_id)</TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="admin-roles-table">
                        <AccordionTrigger className="font-medium">
                          admin_roles
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4">
                            <div className="bg-background/50 border border-border/20 p-4 rounded-md">
                              <code className="text-xs overflow-x-auto block">
                                <pre>
{`CREATE TABLE public.admin_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);`}</pre>
                              </code>
                            </div>

                            <p className="text-xs text-muted-foreground">
                              <Shield className="inline-block h-3 w-3 mr-1" />
                              This table is used for backward compatibility with older admin role assignments.
                            </p>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="audit-logs-table">
                        <AccordionTrigger className="font-medium">
                          audit_logs
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4">
                            <div className="bg-background/50 border border-border/20 p-4 rounded-md">
                              <code className="text-xs overflow-x-auto block">
                                <pre>
{`CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL,
  performed_by UUID NOT NULL,
  target_user_id UUID,
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);`}</pre>
                              </code>
                            </div>

                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="w-48">Indexes</TableHead>
                                  <TableHead>Type</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                <TableRow>
                                  <TableCell><code className="text-xs">audit_logs_pkey</code></TableCell>
                                  <TableCell>PRIMARY KEY (id)</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell><code className="text-xs">idx_audit_logs_action</code></TableCell>
                                  <TableCell>BTREE (action)</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell><code className="text-xs">idx_audit_logs_performer</code></TableCell>
                                  <TableCell>BTREE (performed_by)</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell><code className="text-xs">idx_audit_logs_created_at</code></TableCell>
                                  <TableCell>BTREE (created_at DESC)</TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center">
                      <Lock className="h-5 w-5 mr-2 text-primary/80" />
                      Row Level Security (RLS)
                    </h3>
                    
                    <div className="bg-background/50 border border-border/20 p-4 rounded-md">
                      <code className="text-xs overflow-x-auto block">
                        <pre>
{`-- Communities table policies
ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;

-- Any user can view public communities
CREATE POLICY "Public communities are viewable by everyone" 
  ON public.communities FOR SELECT
  USING (is_public = true);

-- Owners can view their own communities regardless of public status
CREATE POLICY "Community owners can view their communities" 
  ON public.communities FOR SELECT
  USING (owner_id = auth.uid());

-- Only owners can update/delete their communities
CREATE POLICY "Community owners can update their communities" 
  ON public.communities FOR UPDATE
  USING (owner_id = auth.uid());

CREATE POLICY "Community owners can delete their communities" 
  ON public.communities FOR DELETE
  USING (owner_id = auth.uid());

-- Authenticated users can create communities
CREATE POLICY "Authenticated users can create communities" 
  ON public.communities FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Profiles table policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Any authenticated user can read profiles
CREATE POLICY "Profiles are viewable by authenticated users" 
  ON public.profiles FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Users can update only their own profiles
CREATE POLICY "Users can update their own profiles" 
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Audit logs policies
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Only admins can view audit logs" 
  ON public.audit_logs FOR SELECT
  USING (public.is_admin(auth.uid()));

-- System can insert audit logs
CREATE POLICY "System can create audit logs" 
  ON public.audit_logs FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);`}</pre>
                      </code>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center">
                      <Server className="h-5 w-5 mr-2 text-primary/80" />
                      Entity Relationship Diagram
                    </h3>
                    
                    <div className="bg-background/50 border border-border/20 p-4 rounded-md">
                      <code className="text-xs overflow-x-auto block whitespace-pre">
                        <pre>
{`┌────────────────┐       ┌────────────────┐       ┌────────────────┐
│   auth.users    │       │    profiles     │       │  communities   │
├────────────────┤       ├────────────────┤       ├────────────────┤
│ id (PK)        │──1:1──┤ id (PK, FK)    │       │ id (PK)        │
│ email          │       │ email          │       │ name           │
│ password       │       │ first_name     │       │ description    │
│ ...            │       │ last_name      │       │ logo_url       │
└────────────────┘       │ avatar_url     │       │ website        │
                         │ created_at     │       │ is_public      │
                         │ updated_at     │       │ location       │
                         └────────────────┘       │ owner_id       │────┐
                                │                 │ member_count   │    │
                                │                 │ created_at     │    │
                                │                 │ updated_at     │    │
                                │                 │ ...            │    │
                                │                 └────────────────┘    │
                                │                                       │
                                │                                       │
┌────────────────┐       ┌─────┴──────────┐       ┌─────────────────┐  │
│     roles      │       │   user_roles   │       │  community_data │  │
├────────────────┤       ├────────────────┤       ├─────────────────┤  │
│ id (PK)        │─1:n─┐ │ id (PK)        │       │ id (PK)         │  │
│ name           │     │ │ user_id (FK)   │───────┤ community_id(FK)│◄─┘
│ description    │     │ │ role_id (FK)   │◄──────┤ data_type       │
│ permissions    │     │ │ assigned_at    │       │ data            │
│ created_at     │     │ │ assigned_by    │       │ metadata        │
└────────────────┘     │ └────────────────┘       │ imported_at     │
                       │                          │ imported_by     │
                       │                          └─────────────────┘
                       │
                       │  ┌────────────────┐       ┌────────────────┐
                       │  │  admin_roles   │       │   audit_logs   │
                       │  ├────────────────┤       ├────────────────┤
                       │  │ id (PK)        │       │ id (PK)        │
                       └──┤ user_id (FK)   │       │ action         │
                          │ role           │       │ performed_by   │
                          │ created_at     │       │ target_user_id │
                          └────────────────┘       │ details        │
                                                   │ created_at     │
                                                   └────────────────┘`}</pre>
                      </code>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="w-full flex justify-center mt-12">
        <Button variant="outline" size="sm" className="flex items-center gap-2 text-muted-foreground" asChild>
          <a href="https://github.com/eco8-platform/documentation" target="_blank" rel="noopener noreferrer">
            <Code className="h-4 w-4" />
            View Source
            <ExternalLink className="h-3 w-3 ml-1" />
          </a>
        </Button>
      </div>
    </div>
  );
};

export default Documentation;
