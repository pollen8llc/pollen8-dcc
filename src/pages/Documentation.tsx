import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { User, UserRole } from '@/models/types';
import { FormTab } from '@/hooks/useFormProgress';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { List, Database, Key, Shield, Code } from "lucide-react";

const Documentation = () => {
  const [activeSection, setActiveSection] = useState<string>("overview");

  const scrollToSection = (section: string) => {
    setActiveSection(section);
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="container mx-auto py-12 max-w-7xl">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/4 md:sticky md:top-20 h-fit">
          <Card className="glass-dark">
            <CardHeader>
              <CardTitle className="text-lg font-medium">
                Technical Documentation
              </CardTitle>
              <CardDescription>
                Developer reference for the community management platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {[
                  { id: "overview", name: "Overview", icon: <Database className="h-4 w-4" /> },
                  { id: "architecture", name: "Architecture", icon: <Code className="h-4 w-4" /> },
                  { id: "database", name: "Database Tables", icon: <List className="h-4 w-4" /> },
                  { id: "components", name: "Components", icon: <Code className="h-4 w-4" /> },
                  { id: "hooks", name: "Hooks", icon: <Code className="h-4 w-4" /> },
                  { id: "routes", name: "Routes", icon: <Code className="h-4 w-4" /> },
                  { id: "api", name: "API", icon: <Code className="h-4 w-4" /> }
                ].map((section) => (
                  <li key={section.id}>
                    <button
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full text-left px-3 py-2 rounded-md transition-colors flex items-center ${
                        activeSection === section.id
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-secondary"
                      }`}
                    >
                      <span className="mr-2">{section.icon}</span>
                      <span>{section.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="w-full md:w-3/4">
          <ScrollArea className="h-[calc(100vh-120px)] pr-4">
            <div className="space-y-12">
              {/* Overview section */}
              <section id="overview" className="scroll-mt-20">
                <Card className="glass-dark">
                  <CardHeader>
                    <CardTitle className="text-2xl">Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p>This is the technical documentation for the Community Management Platform, a comprehensive system for creating and managing communities, user roles, and their interactions.</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <Card className="bg-card/60">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Tech Stack</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>React 18 with TypeScript</li>
                            <li>Vite for build tooling</li>
                            <li>React Router for routing</li>
                            <li>Tailwind CSS for styling</li>
                            <li>shadcn/ui for component library</li>
                            <li>Tanstack Query for data fetching</li>
                            <li>Supabase for backend services</li>
                            <li>Zod for schema validation</li>
                          </ul>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-card/60">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Key Features</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Role-based authentication</li>
                            <li>Community management</li>
                            <li>User administration</li>
                            <li>Comprehensive permission system</li>
                            <li>Form wizard for community creation</li>
                            <li>Advanced filtering and sorting</li>
                            <li>Realtime updates</li>
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Architecture section */}
              <section id="architecture" className="scroll-mt-20">
                <Card className="glass-dark">
                  <CardHeader>
                    <CardTitle className="text-2xl">Architecture</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p>The application follows a robust architecture with clear separation of concerns:</p>
                    
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="folder-structure">
                        <AccordionTrigger className="text-lg font-medium">Folder Structure</AccordionTrigger>
                        <AccordionContent>
                          <pre className="bg-black/20 p-4 rounded-md overflow-x-auto text-sm">
{`src/
├── components/       # UI components
│   ├── admin/        # Admin-specific components
│   ├── auth/         # Authentication components
│   ├── community/    # Community-related components
│   ├── navbar/       # Navigation components
│   ├── onboarding/   # Onboarding flow components
│   ├── organizer/    # Organizer dashboard components
│   └── ui/           # Base UI components (shadcn)
├── contexts/         # React contexts
├── hooks/            # Custom React hooks
├── integrations/     # Third-party integrations
├── models/           # TypeScript interfaces and types
├── pages/            # Page components
├── repositories/     # Data fetching and mutation logic
├── schemas/          # Zod validation schemas
├── services/         # Business logic services
└── utils/            # Utility functions`}
                          </pre>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="data-flow">
                        <AccordionTrigger className="text-lg font-medium">Data Flow</AccordionTrigger>
                        <AccordionContent>
                          <div className="bg-black/20 p-4 rounded-md">
                            <ol className="list-decimal pl-5 space-y-2">
                              <li><strong>User Interaction</strong>: User interacts with UI components</li>
                              <li><strong>Component Handlers</strong>: Event handlers in components call hooks or context methods</li>
                              <li><strong>Hooks/Contexts</strong>: Custom hooks or contexts handle business logic and call services</li>
                              <li><strong>Services</strong>: Service layer orchestrates data operations and calls repositories</li>
                              <li><strong>Repositories</strong>: Repository layer executes Supabase queries/mutations</li>
                              <li><strong>Supabase</strong>: Database operations and auth handled by Supabase</li>
                              <li><strong>UI Updates</strong>: Data flows back up through the chain to update UI</li>
                            </ol>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="authentication">
                        <AccordionTrigger className="text-lg font-medium">Authentication Architecture</AccordionTrigger>
                        <AccordionContent>
                          <div className="bg-black/20 p-4 rounded-md">
                            <p>The authentication system uses Supabase Auth with a multi-layered approach:</p>
                            
                            <ol className="list-decimal pl-5 space-y-2 mt-2">
                              <li><strong>useSession hook</strong>: Manages auth session state and handles login/logout operations</li>
                              <li><strong>useAuth hook</strong>: Extends session with user profile data</li>
                              <li><strong>useUser context</strong>: Provides authentication state throughout the app</li>
                              <li><strong>usePermissions hook</strong>: Handles role-based permissions and access control</li>
                              <li><strong>ProtectedRoute component</strong>: Guards routes based on authentication state and permissions</li>
                            </ol>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              </section>

              {/* Database Tables section */}
              <section id="database" className="scroll-mt-20">
                <Card className="glass-dark">
                  <CardHeader>
                    <CardTitle className="text-2xl">Database Tables</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <p className="text-muted-foreground">
                      This section documents the core database tables in the application, their columns, relationships, and access policies.
                    </p>

                    <Accordion type="single" collapsible className="w-full">
                      {/* Communities Table */}
                      <AccordionItem value="communities-table">
                        <AccordionTrigger className="text-lg font-medium">
                          <div className="flex items-center gap-2">
                            <Database className="h-4 w-4" />
                            <span>Communities Table</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                              The communities table stores information about all communities in the platform. Each record represents one community.
                            </p>
                            
                            <Card>
                              <CardHeader className="pb-2">
                                <CardTitle className="text-base">Table Columns</CardTitle>
                              </CardHeader>
                              <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Column</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Constraints</TableHead>
                                        <TableHead>Description</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      <TableRow>
                                        <TableCell className="font-mono">id</TableCell>
                                        <TableCell>uuid</TableCell>
                                        <TableCell>Primary Key</TableCell>
                                        <TableCell>Unique identifier</TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell className="font-mono">name</TableCell>
                                        <TableCell>text</TableCell>
                                        <TableCell>NOT NULL</TableCell>
                                        <TableCell>Community's name</TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell className="font-mono">description</TableCell>
                                        <TableCell>text</TableCell>
                                        <TableCell>NOT NULL</TableCell>
                                        <TableCell>Community description</TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell className="font-mono">owner_id</TableCell>
                                        <TableCell>uuid</TableCell>
                                        <TableCell>NULLABLE</TableCell>
                                        <TableCell>Reference to user who owns the community</TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell className="font-mono">type</TableCell>
                                        <TableCell>text</TableCell>
                                        <TableCell>NULLABLE</TableCell>
                                        <TableCell>Type of community (tech, creative, etc.)</TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell className="font-mono">format</TableCell>
                                        <TableCell>text</TableCell>
                                        <TableCell>NULLABLE</TableCell>
                                        <TableCell>Format (online, in-person, hybrid)</TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell className="font-mono">location</TableCell>
                                        <TableCell>text</TableCell>
                                        <TableCell>NULLABLE</TableCell>
                                        <TableCell>Community location</TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell className="font-mono">target_audience</TableCell>
                                        <TableCell>text[]</TableCell>
                                        <TableCell>NULLABLE</TableCell>
                                        <TableCell>Target audience categories</TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell className="font-mono">social_media</TableCell>
                                        <TableCell>jsonb</TableCell>
                                        <TableCell>NULLABLE</TableCell>
                                        <TableCell>Social media handles</TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell className="font-mono">website</TableCell>
                                        <TableCell>text</TableCell>
                                        <TableCell>NULLABLE</TableCell>
                                        <TableCell>Community website URL</TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell className="font-mono">created_at</TableCell>
                                        <TableCell>timestamp</TableCell>
                                        <TableCell>NOT NULL</TableCell>
                                        <TableCell>Creation timestamp</TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell className="font-mono">updated_at</TableCell>
                                        <TableCell>timestamp</TableCell>
                                        <TableCell>NOT NULL</TableCell>
                                        <TableCell>Last update timestamp</TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell className="font-mono">member_count</TableCell>
                                        <TableCell>text</TableCell>
                                        <TableCell>NULLABLE</TableCell>
                                        <TableCell>Community size</TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell className="font-mono">is_public</TableCell>
                                        <TableCell>boolean</TableCell>
                                        <TableCell>NOT NULL</TableCell>
                                        <TableCell>Is community publicly visible</TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell className="font-mono">newsletter_url</TableCell>
                                        <TableCell>text</TableCell>
                                        <TableCell>NULLABLE</TableCell>
                                        <TableCell>Newsletter URL</TableCell>
                                      </TableRow>
                                    </TableBody>
                                  </Table>
                                </div>
                              </CardContent>
                            </Card>

                            <Card>
                              <CardHeader className="pb-2">
                                <CardTitle className="text-base">Relationships</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <Key className="h-4 w-4" />
                                    <p className="text-sm"><strong>owner_id</strong> references <span className="font-mono">profiles.user_id</span></p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>

                            <Card>
                              <CardHeader className="pb-2">
                                <CardTitle className="text-base">Functions & Triggers</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <ul className="list-disc pl-5 space-y-1">
                                  <li><span className="font-mono">community_creator_check()</span>: Sets owner_id to current user if null, initializes member count</li>
                                  <li><span className="font-mono">validate_community_format()</span>: Validates format values (online, in-person, hybrid)</li>
                                  <li><span className="font-mono">validate_event_frequency()</span>: Validates event frequency values</li>
                                  <li><span className="font-mono">log_community_creation()</span>: Logs community creation events</li>
                                </ul>
                              </CardContent>
                            </Card>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      {/* Community Data Distribution Table */}
                      <AccordionItem value="community-data-distribution-table">
                        <AccordionTrigger className="text-lg font-medium">
                          <div className="flex items-center gap-2">
                            <Database className="h-4 w-4" />
                            <span>Community Data Distribution</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                              This table handles the processing of community submissions, tracking their status from pending through processing to completion.
                            </p>
                            
                            <Card>
                              <CardHeader className="pb-2">
                                <CardTitle className="text-base">Table Columns</CardTitle>
                              </CardHeader>
                              <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Column</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Constraints</TableHead>
                                        <TableHead>Description</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      <TableRow>
                                        <TableCell className="font-mono">id</TableCell>
                                        <TableCell>uuid</TableCell>
                                        <TableCell>Primary Key</TableCell>
                                        <TableCell>Unique identifier</TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell className="font-mono">submission_data</TableCell>
                                        <TableCell>jsonb</TableCell>
                                        <TableCell>NOT NULL</TableCell>
                                        <TableCell>Community form data</TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell className="font-mono">submitter_id</TableCell>
                                        <TableCell>uuid</TableCell>
                                        <TableCell>NOT NULL</TableCell>
                                        <TableCell>User who submitted the form</TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell className="font-mono">status</TableCell>
                                        <TableCell>text</TableCell>
                                        <TableCell>NOT NULL</TableCell>
                                        <TableCell>Status (pending, processing, completed, failed)</TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell className="font-mono">community_id</TableCell>
                                        <TableCell>uuid</TableCell>
                                        <TableCell>NULLABLE</TableCell>
                                        <TableCell>Reference to created community (when successful)</TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell className="font-mono">created_at</TableCell>
                                        <TableCell>timestamp</TableCell>
                                        <TableCell>NOT NULL</TableCell>
                                        <TableCell>Submission timestamp</TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell className="font-mono">processed_at</TableCell>
                                        <TableCell>timestamp</TableCell>
                                        <TableCell>NULLABLE</TableCell>
                                        <TableCell>When processing completed</TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell className="font-mono">error_message</TableCell>
                                        <TableCell>text</TableCell>
                                        <TableCell>NULLABLE</TableCell>
                                        <TableCell>Error message if failed</TableCell>
                                      </TableRow>
                                    </TableBody>
                                  </Table>
                                </div>
                              </CardContent>
                            </Card>

                            <Card>
                              <CardHeader className="pb-2">
                                <CardTitle className="text-base">Related Functions</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <ul className="list-disc pl-5 space-y-1">
                                  <li><span className="font-mono">process_community_submission()</span>: Processes submissions and creates communities</li>
                                  <li><span className="font-mono">handle_submission_error()</span>: Logs errors to submission_errors table</li>
                                </ul>
                              </CardContent>
                            </Card>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      {/* Profiles Table */}
                      <AccordionItem value="profiles-table">
                        <AccordionTrigger className="text-lg font-medium">
                          <div className="flex items-center gap-2">
                            <Database className="h-4 w-4" />
                            <span>Profiles Table</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                              The profiles table stores user profile information, linked to Supabase auth.users.
                            </p>
                            
                            <Card>
                              <CardHeader className="pb-2">
                                <CardTitle className="text-base">Table Columns</CardTitle>
                              </CardHeader>
                              <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Column</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Constraints</TableHead>
                                        <TableHead>Description</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      <TableRow>
                                        <TableCell className="font-mono">id</TableCell>
                                        <TableCell>uuid</TableCell>
                                        <TableCell>Primary Key</TableCell>
                                        <TableCell>Unique identifier (matches auth.uid)</TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell className="font-mono">user_id</TableCell>
                                        <TableCell>uuid</TableCell>
                                        <TableCell>NOT NULL</TableCell>
                                        <TableCell>Reference to auth.users.id</TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell className="font-mono">email</TableCell>
                                        <TableCell>text</TableCell>
                                        <TableCell>NOT NULL</TableCell>
                                        <TableCell>User email address</TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell className="font-mono">first_name</TableCell>
                                        <TableCell>text</TableCell>
                                        <TableCell>NULLABLE</TableCell>
                                        <TableCell>User's first name</TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell className="font-mono">last_name</TableCell>
                                        <TableCell>text</TableCell>
                                        <TableCell>NULLABLE</TableCell>
                                        <TableCell>User's last name</TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell className="font-mono">avatar_url</TableCell>
                                        <TableCell>text</TableCell>
                                        <TableCell>NULLABLE</TableCell>
                                        <TableCell>URL to avatar image</TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell className="font-mono">created_at</TableCell>
                                        <TableCell>timestamp</TableCell>
                                        <TableCell>NOT NULL</TableCell>
                                        <TableCell>Profile creation date</TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell className="font-mono">updated_at</TableCell>
                                        <TableCell>timestamp</TableCell>
                                        <TableCell>NOT NULL</TableCell>
                                        <TableCell>Profile update date</TableCell>
                                      </TableRow>
                                    </TableBody>
                                  </Table>
                                </div>
                              </CardContent>
                            </Card>

                            <Card>
                              <CardHeader className="pb-2">
                                <CardTitle className="text-base">Functions & Triggers</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <ul className="list-disc pl-5 space-y-1">
                                  <li><span className="font-mono">handle_profile_update()</span>: Updates the updated_at timestamp</li>
                                  <li><span className="font-mono">handle_new_user()</span>: Creates profile entry when new user signs up</li>
                                </ul>
                              </CardContent>
                            </Card>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      {/* Roles and User Roles Tables */}
                      <AccordionItem value="roles-tables">
                        <AccordionTrigger className="text-lg font-medium">
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            <span>Roles & Permissions</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                              The roles and user_roles tables implement the role-based access control system.
                            </p>
                            
                            <Card>
                              <CardHeader className="pb-2">
                                <CardTitle className="text-base">Roles Table</CardTitle>
                              </CardHeader>
                              <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Column</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Description</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      <TableRow>
                                        <TableCell className="font-mono">id</TableCell>
                                        <TableCell>uuid</TableCell>
                                        <TableCell>Unique identifier</TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell className="font-mono">name</TableCell>
                                        <TableCell>text</TableCell>
                                        <TableCell>Role name (ADMIN, ORGANIZER, MEMBER, etc.)</TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell className="font-mono">description</TableCell>
                                        <TableCell>text</TableCell>
                                        <TableCell>Role description</TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell className="font-mono">permissions</TableCell>
                                        <TableCell>jsonb</TableCell>
                                        <TableCell>Permission configuration</TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell className="font-mono">created_at</TableCell>
                                        <TableCell>timestamp</TableCell>
                                        <TableCell>Creation timestamp</TableCell>
                                      </TableRow>
                                    </TableBody>
                                  </Table>
                                </div>
                              </CardContent>
                            </Card>

                            <Card>
                              <CardHeader className="pb-2">
                                <CardTitle className="text-base">User Roles Table</CardTitle>
                              </CardHeader>
                              <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Column</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Description</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      <TableRow>
                                        <TableCell className="font-mono">id</TableCell>
                                        <TableCell>uuid</TableCell>
                                        <TableCell>Unique identifier</TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell className="font-mono">user_id</TableCell>
                                        <TableCell>uuid</TableCell>
                                        <TableCell>Reference to auth.users.id</TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell className="font-mono">role_id</TableCell>
                                        <TableCell>uuid</TableCell>
                                        <TableCell>Reference to roles.id</TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell className="font-mono">assigned_at</TableCell>
                                        <TableCell>timestamp</TableCell>
                                        <TableCell>When role was assigned</TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell className="font-mono">assigned_by</TableCell>
                                        <TableCell>uuid</TableCell>
                                        <TableCell>User who assigned the role</TableCell>
                                      </TableRow>
                                    </TableBody>
                                  </Table>
                                </div>
                              </CardContent>
                            </Card>

                            <Card>
                              <CardHeader className="pb-2">
                                <CardTitle className="text-base">Role Management Functions</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <ul className="list-disc pl-5 space-y-1">
                                  <li><span className="font-mono">has_role(user_id, role_name)</span>: Checks if user has specific role</li>
                                  <li><span className="font-mono">get_user_roles(user_id)</span>: Returns all roles for user</li>
                                  <li><span className="font-mono">is_admin(user_id)</span>: Checks if user has admin role</li>
                                  <li><span className="font-mono">get_highest_role(user_id)</span>: Returns highest priority role</li>
                                  <li><span className="font-mono">update_user_role(user_id, role_name, assigner_id)</span>: Updates user role</li>
                                </ul>
                              </CardContent>
                            </Card>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      {/* Audit Logs Table */}
                      <AccordionItem value="audit-logs-table">
                        <AccordionTrigger className="text-lg font-medium">
                          <div className="flex items-center gap-2">
                            <Database className="h-4 w-4" />
                            <span>Audit Logs</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                              The audit_logs table tracks important system events and actions for auditing purposes.
                            </p>
                            
                            <Card>
                              <CardHeader className="pb-2">
                                <CardTitle className="text-base">Table Columns</CardTitle>
                              </CardHeader>
                              <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Column</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Description</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      <TableRow>
                                        <TableCell className="font-mono">id</TableCell>
                                        <TableCell>uuid</TableCell>
                                        <TableCell>Unique identifier</TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell className="font-mono">action</TableCell>
                                        <TableCell>text</TableCell>
                                        <TableCell>Action name (e.g., 'user_created', 'community_deleted')</TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell className="font-mono">performed_by</TableCell>
                                        <TableCell>uuid</TableCell>
                                        <TableCell>User who performed the action</TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell className="font-mono">target_user_id</TableCell>
                                        <TableCell>uuid</TableCell>
                                        <TableCell>Target user (if applicable)</TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell className="font-mono">details</TableCell>
                                        <TableCell>jsonb</TableCell>
                                        <TableCell>Additional action details</TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell className="font-mono">created_at</TableCell>
                                        <TableCell>timestamp</TableCell>
                                        <TableCell>When action occurred</TableCell>
                                      </TableRow>
                                    </TableBody>
                                  </Table>
                                </div>
                              </CardContent>
                            </Card>

                            <Card>
                              <CardHeader className="pb-2">
                                <CardTitle className="text-base">Audit Functions</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <ul className="list-disc pl-5 space-y-1">
                                  <li><span className="font-mono">log_audit_action(action_name, performer_id, target_id, action_details)</span>: Creates audit log entries</li>
                                </ul>
                              </CardContent>
                            </Card>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      {/* Submission Errors Table */}
                      <AccordionItem value="submission-errors-table">
                        <AccordionTrigger className="text-lg font-medium">
                          <div className="flex items-center gap-2">
                            <Database className="h-4 w-4" />
                            <span>Submission Errors</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                              The submission_errors table tracks errors that occur during community submission processing.
                            </p>
                            
                            <Card>
                              <CardHeader className="pb-2">
                                <CardTitle className="text-base">Table Columns</CardTitle>
                              </CardHeader>
                              <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Column</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Description</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      <TableRow>
                                        <TableCell className="font-mono">id</TableCell>
                                        <TableCell>uuid</TableCell>
                                        <TableCell>Unique identifier</TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell className="font-mono">distribution_id</TableCell>
                                        <TableCell>uuid</TableCell>
                                        <TableCell>Reference to community_data_distribution.id</TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell className="font-mono">error_type</TableCell>
                                        <TableCell>text</TableCell>
                                        <TableCell>Type of error</TableCell>
                                      </TableRow>
