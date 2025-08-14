
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { User, UserRole } from '@/models/types';
import { FormTab } from '@/hooks/useFormProgress';

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
                  { id: "overview", name: "Overview" },
                  { id: "architecture", name: "Architecture" },
                  { id: "routes", name: "Routes" },
                  { id: "components", name: "Components" },
                  { id: "hooks", name: "Hooks" },
                  { id: "api", name: "API" },
                  { id: "database", name: "Database" }
                ].map((section) => (
                  <li key={section.id}>
                    <button
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                        activeSection === section.id
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-secondary"
                      }`}
                    >
                      {section.name}
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

              {/* Routes section */}
              <section id="routes" className="scroll-mt-20">
                <Card className="glass-dark">
                  <CardHeader>
                    <CardTitle className="text-2xl">Routes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-2 px-4">Path</th>
                            <th className="text-left py-2 px-4">Component</th>
                            <th className="text-left py-2 px-4">Access</th>
                            <th className="text-left py-2 px-4">Description</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          <tr>
                            <td className="py-2 px-4 font-mono text-sm">/</td>
                            <td className="py-2 px-4">Index</td>
                            <td className="py-2 px-4">Public</td>
                            <td className="py-2 px-4">Landing page with community listings</td>
                          </tr>
                          <tr>
                            <td className="py-2 px-4 font-mono text-sm">/auth</td>
                            <td className="py-2 px-4">Auth</td>
                            <td className="py-2 px-4">Public</td>
                            <td className="py-2 px-4">Authentication page (login/register)</td>
                          </tr>
                          <tr>
                            <td className="py-2 px-4 font-mono text-sm">/profile</td>
                            <td className="py-2 px-4">Profile</td>
                            <td className="py-2 px-4">Authenticated</td>
                            <td className="py-2 px-4">User profile management</td>
                          </tr>
                          <tr>
                            <td className="py-2 px-4 font-mono text-sm">/onboarding</td>
                            <td className="py-2 px-4">Onboarding</td>
                            <td className="py-2 px-4">Authenticated</td>
                            <td className="py-2 px-4">New user onboarding flow</td>
                          </tr>
                          <tr>
                            <td className="py-2 px-4 font-mono text-sm">/community/create</td>
                            <td className="py-2 px-4">CreateCommunity</td>
                            <td className="py-2 px-4">Admin/Organizer</td>
                            <td className="py-2 px-4">Community creation wizard</td>
                          </tr>
                          <tr>
                            <td className="py-2 px-4 font-mono text-sm">/community/:id</td>
                            <td className="py-2 px-4">CommunityProfile</td>
                            <td className="py-2 px-4">Public</td>
                            <td className="py-2 px-4">Community profile page</td>
                          </tr>
                          <tr>
                            <td className="py-2 px-4 font-mono text-sm">/join</td>
                            <td className="py-2 px-4">JoinCommunities</td>
                            <td className="py-2 px-4">Authenticated</td>
                            <td className="py-2 px-4">Join community page</td>
                          </tr>
                          <tr>
                            <td className="py-2 px-4 font-mono text-sm">/organizer</td>
                            <td className="py-2 px-4">OrganizerDashboard</td>
                            <td className="py-2 px-4">Organizer</td>
                            <td className="py-2 px-4">Dashboard for community organizers</td>
                          </tr>
                          <tr>
                            <td className="py-2 px-4 font-mono text-sm">/admin</td>
                            <td className="py-2 px-4">AdminDashboard</td>
                            <td className="py-2 px-4">Admin</td>
                            <td className="py-2 px-4">Admin control panel</td>
                          </tr>
                          <tr>
                            <td className="py-2 px-4 font-mono text-sm">/admin/debug</td>
                            <td className="py-2 px-4">DebuggerDashboard</td>
                            <td className="py-2 px-4">Admin</td>
                            <td className="py-2 px-4">Debugging tools for admins</td>
                          </tr>
                          <tr>
                            <td className="py-2 px-4 font-mono text-sm">/docs</td>
                            <td className="py-2 px-4">Documentation</td>
                            <td className="py-2 px-4">Public</td>
                            <td className="py-2 px-4">Technical documentation</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Components section */}
              <section id="components" className="scroll-mt-20">
                <Card className="glass-dark">
                  <CardHeader>
                    <CardTitle className="text-2xl">Components</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="core">
                      <TabsList className="grid grid-cols-5 w-full mb-4">
                        <TabsTrigger value="core">Core</TabsTrigger>
                        <TabsTrigger value="admin">Admin</TabsTrigger>
                        <TabsTrigger value="community">Community</TabsTrigger>
                        <TabsTrigger value="auth">Auth</TabsTrigger>
                        <TabsTrigger value="ui">UI</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="core">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Card className="bg-card/60">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-lg">
                                Navbar
                                <Badge variant="outline" className="ml-2">Core</Badge>
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-muted-foreground mb-2">Main navigation component with responsive design</p>
                              <p className="text-xs font-mono bg-black/20 p-2 rounded">src/components/Navbar.tsx</p>
                              <div className="mt-2">
                                <p className="text-xs font-semibold mt-1">Sub-components:</p>
                                <ul className="text-xs list-disc pl-5">
                                  <li>UserMenuDropdown</li>
                                  <li>NavigationDrawer</li>
                                  <li>AccountButton</li>
                                </ul>
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card className="bg-card/60">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-lg">
                                CommunityCard
                                <Badge variant="outline" className="ml-2">Core</Badge>
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-muted-foreground mb-2">Displays community information in a card format</p>
                              <p className="text-xs font-mono bg-black/20 p-2 rounded">src/components/CommunityCard.tsx</p>
                              <div className="mt-2">
                                <p className="text-xs font-semibold mt-1">Props:</p>
                                <ul className="text-xs list-disc pl-5">
                                  <li>community: Community</li>
                                  <li>isCompact?: boolean</li>
                                </ul>
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card className="bg-card/60">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-lg">
                                MemberCard
                                <Badge variant="outline" className="ml-2">Core</Badge>
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-muted-foreground mb-2">Displays member information in a card format</p>
                              <p className="text-xs font-mono bg-black/20 p-2 rounded">src/components/MemberCard.tsx</p>
                              <div className="mt-2">
                                <p className="text-xs font-semibold mt-1">Props:</p>
                                <ul className="text-xs list-disc pl-5">
                                  <li>member: User</li>
                                  <li>role?: string</li>
                                  <li>showActions?: boolean</li>
                                </ul>
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card className="bg-card/60">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-lg">
                                SearchBar
                                <Badge variant="outline" className="ml-2">Core</Badge>
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-muted-foreground mb-2">Search component with debounce functionality</p>
                              <p className="text-xs font-mono bg-black/20 p-2 rounded">src/components/SearchBar.tsx</p>
                              <div className="mt-2">
                                <p className="text-xs font-semibold mt-1">Props:</p>
                                <ul className="text-xs list-disc pl-5">
                                  <li>onSearch: (query: string) {`=>`} void</li>
                                  <li>placeholder?: string</li>
                                  <li>className?: string</li>
                                </ul>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="admin">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Card className="bg-card/60">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-lg">
                                UserManagementTable
                                <Badge variant="outline" className="ml-2">Admin</Badge>
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-muted-foreground mb-2">Interactive user management table for administrators</p>
                              <p className="text-xs font-mono bg-black/20 p-2 rounded">src/components/admin/UserManagementTable.tsx</p>
                              <div className="mt-2">
                                <p className="text-xs font-semibold mt-1">Sub-components:</p>
                                <ul className="text-xs list-disc pl-5">
                                  <li>UserTableRow</li>
                                  <li>UserTableActions</li>
                                  <li>UserDetailsDialog</li>
                                </ul>
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card className="bg-card/60">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-lg">
                                AdminOverviewCards
                                <Badge variant="outline" className="ml-2">Admin</Badge>
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-muted-foreground mb-2">Dashboard overview cards with system metrics</p>
                              <p className="text-xs font-mono bg-black/20 p-2 rounded">src/components/admin/AdminOverviewCards.tsx</p>
                              <div className="mt-2">
                                <p className="text-xs font-semibold mt-1">Features:</p>
                                <ul className="text-xs list-disc pl-5">
                                  <li>User metrics</li>
                                  <li>Community metrics</li>
                                  <li>System health</li>
                                  <li>Activity metrics</li>
                                </ul>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="community">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Card className="bg-card/60">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-lg">
                                CreateCommunityForm
                                <Badge variant="outline" className="ml-2">Community</Badge>
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-muted-foreground mb-2">Multi-step form for community creation</p>
                              <p className="text-xs font-mono bg-black/20 p-2 rounded">src/components/community/CreateCommunityForm.tsx</p>
                              <div className="mt-2">
                                <p className="text-xs font-semibold mt-1">Form Sections:</p>
                                <ul className="text-xs list-disc pl-5">
                                  <li>BasicInfoForm</li>
                                  <li>PlatformsForm</li>
                                  <li>SocialMediaForm</li>
                                </ul>
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card className="bg-card/60">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-lg">
                                CommunityHeader
                                <Badge variant="outline" className="ml-2">Community</Badge>
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-muted-foreground mb-2">Header component for community profile pages</p>
                              <p className="text-xs font-mono bg-black/20 p-2 rounded">src/components/community/CommunityHeader.tsx</p>
                              <div className="mt-2">
                                <p className="text-xs font-semibold mt-1">Props:</p>
                                <ul className="text-xs list-disc pl-5">
                                  <li>community: Community</li>
                                  <li>isOrganizer: boolean</li>
                                  <li>onJoin?: () {`=>`} void</li>
                                </ul>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="auth">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Card className="bg-card/60">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-lg">
                                ProtectedRoute
                                <Badge variant="outline" className="ml-2">Auth</Badge>
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-muted-foreground mb-2">Route guard for authenticated routes</p>
                              <p className="text-xs font-mono bg-black/20 p-2 rounded">src/components/auth/ProtectedRoute.tsx</p>
                              <div className="mt-2">
                                <p className="text-xs font-semibold mt-1">Props:</p>
                                <ul className="text-xs list-disc pl-5">
                                  <li>children: React.ReactNode</li>
                                  <li>requiredRole?: UserRole</li>
                                  <li>redirect?: string</li>
                                </ul>
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card className="bg-card/60">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-lg">
                                AuthLayout
                                <Badge variant="outline" className="ml-2">Auth</Badge>
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-muted-foreground mb-2">Layout for authentication pages</p>
                              <p className="text-xs font-mono bg-black/20 p-2 rounded">src/components/auth/AuthLayout.tsx</p>
                              <div className="mt-2">
                                <p className="text-xs font-semibold mt-1">Features:</p>
                                <ul className="text-xs list-disc pl-5">
                                  <li>Responsive design</li>
                                  <li>Background styling</li>
                                  <li>Card layout</li>
                                  <li>Logo display</li>
                                </ul>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="ui">
                        <p className="text-muted-foreground mb-4">The UI components are based on shadcn/ui and provide a consistent design system throughout the application.</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {[
                            "Button", "Card", "Dialog", "Form", 
                            "Input", "Select", "Tabs", "Toast",
                            "Accordion", "Avatar", "Badge", "Checkbox",
                            "Dropdown", "Label", "Progress", "Table"
                          ].map((component) => (
                            <Card key={component} className="bg-card/60">
                              <CardHeader className="py-2 px-3">
                                <CardTitle className="text-sm">{component}</CardTitle>
                              </CardHeader>
                              <CardContent className="py-2 px-3">
                                <p className="text-xs font-mono">src/components/ui/{component.toLowerCase()}.tsx</p>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </section>

              {/* Hooks section */}
              <section id="hooks" className="scroll-mt-20">
                <Card className="glass-dark">
                  <CardHeader>
                    <CardTitle className="text-2xl">Hooks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-2">Authentication Hooks</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Card className="bg-card/60">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-lg">useAuth</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-muted-foreground mb-2">Manages authentication state with user profile</p>
                              <p className="text-xs font-mono bg-black/20 p-2 rounded">src/hooks/useAuth.tsx</p>
                              <div className="mt-2">
                                <p className="text-xs font-semibold mt-1">Returns:</p>
                                <ul className="text-xs list-disc pl-5">
                                  <li>currentUser: User | null</li>
                                  <li>isLoading: boolean</li>
                                  <li>session: Session | null</li>
                                  <li>refreshUser: () {`=>`} Promise{`<void>`}</li>
                                  <li>logout: () {`=>`} Promise{`<void>`}</li>
                                </ul>
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card className="bg-card/60">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-lg">useSession</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-muted-foreground mb-2">Manages Supabase authentication session</p>
                              <p className="text-xs font-mono bg-black/20 p-2 rounded">src/hooks/useSession.tsx</p>
                              <div className="mt-2">
                                <p className="text-xs font-semibold mt-1">Returns:</p>
                                <ul className="text-xs list-disc pl-5">
                                  <li>session: Session | null</li>
                                  <li>isLoading: boolean</li>
                                  <li>logout: () {`=>`} Promise{`<void>`}</li>
                                </ul>
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card className="bg-card/60">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-lg">useProfile</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-muted-foreground mb-2">Fetches and manages user profile data</p>
                              <p className="text-xs font-mono bg-black/20 p-2 rounded">src/hooks/useProfile.tsx</p>
                              <div className="mt-2">
                                <p className="text-xs font-semibold mt-1">Returns:</p>
                                <ul className="text-xs list-disc pl-5">
                                  <li>currentUser: User | null</li>
                                  <li>isLoading: boolean</li>
                                  <li>error: Error | null</li>
                                  <li>refreshUser: () {`=>`} Promise{`<void>`}</li>
                                </ul>
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card className="bg-card/60">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-lg">usePermissions</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-muted-foreground mb-2">Role-based permission management</p>
                              <p className="text-xs font-mono bg-black/20 p-2 rounded">src/hooks/usePermissions.tsx</p>
                              <div className="mt-2">
                                <p className="text-xs font-semibold mt-1">Returns:</p>
                                <ul className="text-xs list-disc pl-5">
                                  <li>hasPermission: (resource, action) {`=>`} boolean</li>
                                  <li>isOrganizer: (communityId?) {`=>`} boolean</li>
                                  <li>isOwner: (communityId) {`=>`} Promise{`<boolean>`}</li>
                                  <li>checkPermission: (resource, action) {`=>`} boolean</li>
                                </ul>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-2">Form and Data Hooks</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Card className="bg-card/60">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-lg">useFormProgress</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-muted-foreground mb-2">Manages multi-step form progress</p>
                              <p className="text-xs font-mono bg-black/20 p-2 rounded">src/hooks/useFormProgress.ts</p>
                              <div className="mt-2">
                                <p className="text-xs font-semibold mt-1">Returns:</p>
                                <ul className="text-xs list-disc pl-5">
                                  <li>activeTab: FormTab</li>
                                  <li>progress: number</li>
                                  <li>updateProgress: (tab: FormTab) {`=>`} void</li>
                                </ul>
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card className="bg-card/60">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-lg">useCreateCommunityForm</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-muted-foreground mb-2">Form management for community creation</p>
                              <p className="text-xs font-mono bg-black/20 p-2 rounded">src/hooks/useCreateCommunityForm.ts</p>
                              <div className="mt-2">
                                <p className="text-xs font-semibold mt-1">Returns:</p>
                                <ul className="text-xs list-disc pl-5">
                                  <li>form: UseFormReturn{`<CommunityFormData>`}</li>
                                  <li>isSubmitting: boolean</li>
                                  <li>submitForm: () {`=>`} Promise{`<void>`}</li>
                                  <li>onSubmit: (values) {`=>`} Promise{`<void>`}</li>
                                </ul>
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card className="bg-card/60">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-lg">useDebounce</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-muted-foreground mb-2">Debounces a value with configurable delay</p>
                              <p className="text-xs font-mono bg-black/20 p-2 rounded">src/hooks/useDebounce.ts</p>
                              <div className="mt-2">
                                <p className="text-xs font-semibold mt-1">Parameters:</p>
                                <ul className="text-xs list-disc pl-5">
                                  <li>value: T</li>
                                  <li>delay?: number (default: 500)</li>
                                </ul>
                                <p className="text-xs font-semibold mt-1">Returns:</p>
                                <ul className="text-xs list-disc pl-5">
                                  <li>debouncedValue: T</li>
                                </ul>
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card className="bg-card/60">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-lg">useMobile</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-muted-foreground mb-2">Detects mobile viewport with resize listener</p>
                              <p className="text-xs font-mono bg-black/20 p-2 rounded">src/hooks/use-mobile.tsx</p>
                              <div className="mt-2">
                                <p className="text-xs font-semibold mt-1">Returns:</p>
                                <ul className="text-xs list-disc pl-5">
                                  <li>isMobile: boolean</li>
                                </ul>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-2">Admin Hooks</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Card className="bg-card/60">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-lg">useAdminUsers</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-muted-foreground mb-2">Admin user management functionality</p>
                              <p className="text-xs font-mono bg-black/20 p-2 rounded">src/hooks/admin/useAdminUsers.tsx</p>
                              <div className="mt-2">
                                <p className="text-xs font-semibold mt-1">Returns:</p>
                                <ul className="text-xs list-disc pl-5">
                                  <li>users: User[]</li>
                                  <li>isLoading: boolean</li>
                                  <li>error: Error | null</li>
                                  <li>refetch: () {`=>`} void</li>
                                </ul>
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card className="bg-card/60">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-lg">useUserActions</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-muted-foreground mb-2">User administration actions</p>
                              <p className="text-xs font-mono bg-black/20 p-2 rounded">src/hooks/admin/useUserActions.tsx</p>
                              <div className="mt-2">
                                <p className="text-xs font-semibold mt-1">Returns:</p>
                                <ul className="text-xs list-disc pl-5">
                                  <li>deactivateUser: (id) {`=>`} Promise{`<void>`}</li>
                                  <li>resetPassword: (email) {`=>`} Promise{`<void>`}</li>
                                  <li>isLoading: boolean</li>
                                </ul>
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card className="bg-card/60">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-lg">useUserRoleManagement</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-muted-foreground mb-2">Role management for users</p>
                              <p className="text-xs font-mono bg-black/20 p-2 rounded">src/hooks/admin/useUserRoleManagement.tsx</p>
                              <div className="mt-2">
                                <p className="text-xs font-semibold mt-1">Returns:</p>
                                <ul className="text-xs list-disc pl-5">
                                  <li>updateRole: (userId, role) {`=>`} Promise{`<void>`}</li>
                                  <li>isUpdating: boolean</li>
                                  <li>error: Error | null</li>
                                </ul>
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card className="bg-card/60">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-lg">useUserCommunities</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-muted-foreground mb-2">Fetches communities for a user</p>
                              <p className="text-xs font-mono bg-black/20 p-2 rounded">src/hooks/admin/useUserCommunities.tsx</p>
                              <div className="mt-2">
                                <p className="text-xs font-semibold mt-1">Returns:</p>
                                <ul className="text-xs list-disc pl-5">
                                  <li>communities: Community[]</li>
                                  <li>isLoading: boolean</li>
                                  <li>error: Error | null</li>
                                </ul>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* API section */}
              <section id="api" className="scroll-mt-20">
                <Card className="glass-dark">
                  <CardHeader>
                    <CardTitle className="text-2xl">API</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <p>The platform integrates with various external APIs to provide enhanced functionality.</p>
                    
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="luma-integration">
                        <AccordionTrigger className="text-lg font-medium">Luma Events Integration</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4">
                            <p className="text-muted-foreground">
                              Streamlined OAuth-based integration for importing event attendees into your CRM system.
                            </p>
                            
                            <div className="bg-card/60 p-4 rounded-lg">
                              <h4 className="font-semibold mb-2">Setup Requirements</h4>
                              <ol className="list-decimal pl-5 space-y-1 text-sm">
                                <li>Register your application with Luma.co</li>
                                <li>Configure OAuth settings in Luma developer portal</li>
                                <li>Add LUMA_CLIENT_ID and LUMA_CLIENT_SECRET to Supabase secrets</li>
                                <li>Set redirect URI to: <code className="bg-black/20 px-2 py-1 rounded text-xs">https://[your-project-id].supabase.co/functions/v1/luma-oauth-callback</code></li>
                              </ol>
                            </div>

                            <div className="bg-card/60 p-4 rounded-lg">
                              <h4 className="font-semibold mb-2">Edge Functions</h4>
                              <div className="space-y-3">
                                <div>
                                  <h5 className="font-medium text-sm">luma-oauth-callback</h5>
                                  <p className="text-xs text-muted-foreground mb-1">Handles OAuth token exchange and stores integration credentials</p>
                                  <code className="bg-black/20 px-2 py-1 rounded text-xs block">POST /functions/v1/luma-oauth-callback</code>
                                </div>
                                <div>
                                  <h5 className="font-medium text-sm">luma-get-events</h5>
                                  <p className="text-xs text-muted-foreground mb-1">Fetches user's events from Luma API with automatic token refresh</p>
                                  <code className="bg-black/20 px-2 py-1 rounded text-xs block">GET /functions/v1/luma-get-events</code>
                                </div>
                                <div>
                                  <h5 className="font-medium text-sm">luma-import-contacts</h5>
                                  <p className="text-xs text-muted-foreground mb-1">Imports event attendees as contacts with duplicate detection</p>
                                  <code className="bg-black/20 px-2 py-1 rounded text-xs block">POST /functions/v1/luma-import-contacts</code>
                                </div>
                              </div>
                            </div>

                            <div className="bg-card/60 p-4 rounded-lg">
                              <h4 className="font-semibold mb-2">Database Tables</h4>
                              <div className="space-y-2">
                                <div>
                                  <h5 className="font-medium text-sm">luma_integrations</h5>
                                  <p className="text-xs text-muted-foreground">Stores OAuth tokens and user integration status</p>
                                </div>
                                <div>
                                  <h5 className="font-medium text-sm">luma_import_history</h5>
                                  <p className="text-xs text-muted-foreground">Tracks import operations and results</p>
                                </div>
                                <div>
                                  <h5 className="font-medium text-sm">rms_contacts (enhanced)</h5>
                                  <p className="text-xs text-muted-foreground">Extended with Luma-specific fields for event tracking</p>
                                </div>
                              </div>
                            </div>

                            <div className="bg-card/60 p-4 rounded-lg">
                              <h4 className="font-semibold mb-2">User Flow</h4>
                              <ol className="list-decimal pl-5 space-y-1 text-sm">
                                <li>User clicks "Connect to Luma" in Import Contacts page</li>
                                <li>OAuth popup opens for Luma authorization</li>
                                <li>User authorizes application access</li>
                                <li>Tokens are stored securely in database</li>
                                <li>User's events are automatically fetched and displayed</li>
                                <li>User selects events to import attendees from</li>
                                <li>System imports contacts with duplicate detection</li>
                                <li>Import results and history are tracked</li>
                              </ol>
                            </div>

                            <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-lg">
                              <h5 className="font-medium text-sm text-amber-400 mb-1">Security Features</h5>
                              <ul className="text-xs text-muted-foreground list-disc pl-5 space-y-1">
                                <li>OAuth 2.0 standard compliance</li>
                                <li>Automatic token refresh handling</li>
                                <li>Encrypted credential storage</li>
                                <li>User-scoped data access</li>
                                <li>RLS policies for data protection</li>
                              </ul>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              </section>

              {/* Database section would go here */}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default Documentation;
