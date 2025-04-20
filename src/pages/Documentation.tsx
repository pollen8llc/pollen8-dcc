
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
                                  <li>onSearch: (query: string) => void</li>
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
                                  <li>onJoin?: () => void</li>
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
                                  <li>refreshUser: () => Promise&lt;void&gt;</li>
                                  <li>logout: () => Promise&lt;void&gt;</li>
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
                                  <li>logout: () => Promise&lt;void&gt;</li>
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
                                  <li>refreshUser: () => Promise&lt;void&gt;</li>
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
                                  <li>hasPermission: (resource, action) => boolean</li>
                                  <li>isOrganizer: (communityId?) => boolean</li>
                                  <li>isOwner: (communityId) => Promise&lt;boolean&gt;</li>
                                  <li>checkPermission: (resource, action) => boolean</li>
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
                                  <li>updateProgress: (tab: FormTab) => void</li>
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
                                  <li>form: UseFormReturn&lt;CommunityFormData&gt;</li>
                                  <li>isSubmitting: boolean</li>
                                  <li>submitForm: () => Promise&lt;void&gt;</li>
                                  <li>onSubmit: (values) => Promise&lt;void&gt;</li>
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
                                  <li>refetch: () => void</li>
                                </ul>
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card className="bg-card/60">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-lg">useUserActions</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-muted-foreground mb-2">User management actions for admins</p>
                              <p className="text-xs font-mono bg-black/20 p-2 rounded">src/hooks/admin/useUserActions.tsx</p>
                              <div className="mt-2">
                                <p className="text-xs font-semibold mt-1">Returns:</p>
                                <ul className="text-xs list-disc pl-5">
                                  <li>deactivateUser: (userId) => Promise&lt;void&gt;</li>
                                  <li>resetPassword: (email) => Promise&lt;void&gt;</li>
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
                              <p className="text-sm text-muted-foreground mb-2">User role management functionality</p>
                              <p className="text-xs font-mono bg-black/20 p-2 rounded">src/hooks/admin/useUserRoleManagement.tsx</p>
                              <div className="mt-2">
                                <p className="text-xs font-semibold mt-1">Returns:</p>
                                <ul className="text-xs list-disc pl-5">
                                  <li>updateRole: (userId, role) => Promise&lt;void&gt;</li>
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
                              <p className="text-sm text-muted-foreground mb-2">Manages user's community associations</p>
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
                  <CardContent>
                    <Tabs defaultValue="auth">
                      <TabsList className="grid grid-cols-4 w-full mb-4">
                        <TabsTrigger value="auth">Auth</TabsTrigger>
                        <TabsTrigger value="communities">Communities</TabsTrigger>
                        <TabsTrigger value="users">Users</TabsTrigger>
                        <TabsTrigger value="admin">Admin</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="auth">
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-lg font-medium mb-2">Authentication API</h3>
                            <Card className="bg-card/60">
                              <CardHeader className="pb-2">
                                <CardTitle className="text-base">useAuth Hook</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <pre className="bg-black/20 p-3 rounded-md overflow-x-auto text-xs">
{`// Authentication API
// Returns: { currentUser, isLoading, session, refreshUser, logout }
const { 
  currentUser,  // The current user object or null
  isLoading,    // Boolean indicating if auth is loading
  session,      // Supabase session object
  refreshUser,  // Function to refresh user data
  logout        // Function to log out the user
} = useAuth();`}
                                </pre>
                              </CardContent>
                            </Card>
                          </div>
                          
                          <div>
                            <h3 className="text-lg font-medium mb-2">Session Management</h3>
                            <Card className="bg-card/60">
                              <CardHeader className="pb-2">
                                <CardTitle className="text-base">useSession Hook</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <pre className="bg-black/20 p-3 rounded-md overflow-x-auto text-xs">
{`// Session API
// Returns: { session, isLoading, logout }
const { 
  session,    // Supabase session object or null
  isLoading,  // Boolean indicating if session is loading
} = useSession();`}
                                </pre>
                              </CardContent>
                            </Card>
                          </div>
                          
                          <div>
                            <h3 className="text-lg font-medium mb-2">Profile Management</h3>
                            <Card className="bg-card/60">
                              <CardHeader className="pb-2">
                                <CardTitle className="text-base">useProfile Hook</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <pre className="bg-black/20 p-3 rounded-md overflow-x-auto text-xs">
{`// Profile API
// Returns: { currentUser, isLoading, error, refreshUser }
const { 
  currentUser,  // The current user profile or null
  isLoading,    // Boolean indicating if profile is loading
  error         // Error object if profile fetch failed
} = useProfile(session);`}
                                </pre>
                              </CardContent>
                            </Card>
                          </div>
                          
                          <div>
                            <h3 className="text-lg font-medium mb-2">Permissions System</h3>
                            <Card className="bg-card/60">
                              <CardHeader className="pb-2">
                                <CardTitle className="text-base">usePermissions Hook</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <pre className="bg-black/20 p-3 rounded-md overflow-x-auto text-xs">
{`// Permissions API
// Returns: { hasPermission, checkPermissionAsync, isOrganizer }
const { 
  hasPermission,       // (resource: string, action: string) => boolean
  isOrganizer          // (communityId?: string) => boolean
} = usePermissions(currentUser);`}
                                </pre>
                              </CardContent>
                            </Card>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="communities">
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-lg font-medium mb-2">Community Form Management</h3>
                            <Card className="bg-card/60">
                              <CardHeader className="pb-2">
                                <CardTitle className="text-base">useCreateCommunityForm Hook</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <pre className="bg-black/20 p-3 rounded-md overflow-x-auto text-xs">
{`// Community Form API
// Returns: { form, isSubmitting, activeTab, progress, onSubmit }
const { 
  form,          // React Hook Form object
  isSubmitting,  // Boolean indicating if form is submitting
  activeTab,     // Current active tab in the form
  progress,      // Form completion progress (number)
  onSubmit       // Form submission handler
} = useCreateCommunityForm();`}
                                </pre>
                              </CardContent>
                            </Card>
                          </div>
                          
                          <div>
                            <h3 className="text-lg font-medium mb-2">Form Progress Management</h3>
                            <Card className="bg-card/60">
                              <CardHeader className="pb-2">
                                <CardTitle className="text-base">useFormProgress Hook</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <pre className="bg-black/20 p-3 rounded-md overflow-x-auto text-xs">
{`// Form Progress API
// Returns: { activeTab, progress, updateProgress }
const { 
  activeTab,       // Current active tab (FormTab)
  progress,        // Progress percentage (number)
  updateProgress   // (tab: FormTab) => void - Updates progress
} = useFormProgress();`}
                                </pre>
                              </CardContent>
                            </Card>
                          </div>
                          
                          <div>
                            <h3 className="text-lg font-medium mb-2">Community Submission</h3>
                            <Card className="bg-card/60">
                              <CardHeader className="pb-2">
                                <CardTitle className="text-base">useCreateCommunity Hook</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <pre className="bg-black/20 p-3 rounded-md overflow-x-auto text-xs">
{`// Community Creation API
// Returns: { form, submitForm, isSubmitting }
const { 
  form,         // React Hook Form object
  submitForm,   // Form submission function
  isSubmitting  // Boolean indicating if form is submitting
} = useCreateCommunity();`}
                                </pre>
                              </CardContent>
                            </Card>
                          </div>
                          
                          <div>
                            <h3 className="text-lg font-medium mb-2">Debug Tools</h3>
                            <Card className="bg-card/60">
                              <CardHeader className="pb-2">
                                <CardTitle className="text-base">Debug Utilities</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <pre className="bg-black/20 p-3 rounded-md overflow-x-auto text-xs">
{`// Debug API
// Functions for debugging
const { 
  debugLogs,      // Array of debug logs
  addDebugLog,    // (message: string) => void
  clearDebugLogs  // () => void
} = useDebugger();`}
                                </pre>
                              </CardContent>
                            </Card>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="users">
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-lg font-medium mb-2">User Management</h3>
                            <Card className="bg-card/60">
                              <CardHeader className="pb-2">
                                <CardTitle className="text-base">User Management API</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <pre className="bg-black/20 p-3 rounded-md overflow-x-auto text-xs">
{`// User Management Service Exports
export {
  getAllUsers,         // Fetches all users
  getUserCounts,       // Gets user count statistics
  updateUserRole,      // Updates a user's role
  inviteUser,          // Invites a new user
  deactivateUser,      // Deactivates a user
  resetUserPassword,   // Sends password reset email
  getRoles,            // Gets available roles
  getUserCommunities   // Gets communities for a user
} from './userManagementService';`}
                                </pre>
                              </CardContent>
                            </Card>
                          </div>
                          
                          <div>
                            <h3 className="text-lg font-medium mb-2">User Query API</h3>
                            <Card className="bg-card/60">
                              <CardHeader className="pb-2">
                                <CardTitle className="text-base">useAdminUsers Hook</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <pre className="bg-black/20 p-3 rounded-md overflow-x-auto text-xs">
{`// User Query API
// Returns: { users, isLoading, error, refetch }
const { 
  users,      // Array of User objects
  isLoading,  // Boolean indicating if data is loading
  error,      // Error object if query failed
  refetch     // Function to refetch users
} = useAdminUsers();`}
                                </pre>
                              </CardContent>
                            </Card>
                          </div>
                          
                          <div>
                            <h3 className="text-lg font-medium mb-2">User Actions API</h3>
                            <Card className="bg-card/60">
                              <CardHeader className="pb-2">
                                <CardTitle className="text-base">useUserActions Hook</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <pre className="bg-black/20 p-3 rounded-md overflow-x-auto text-xs">
{`// User Actions API
// Returns: { deactivateUser, resetPassword, isLoading }
const { 
  deactivateUser,  // (userId: string) => Promise<void>
  resetPassword,   // (email: string) => Promise<void>
  isLoading        // Boolean indicating if action is in progress
} = useUserActions();`}
                                </pre>
                              </CardContent>
                            </Card>
                          </div>
                          
                          <div>
                            <h3 className="text-lg font-medium mb-2">Role Management API</h3>
                            <Card className="bg-card/60">
                              <CardHeader className="pb-2">
                                <CardTitle className="text-base">useUserRoleManagement Hook</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <pre className="bg-black/20 p-3 rounded-md overflow-x-auto text-xs">
{`// Role Management API
// Returns: { updateRole, isUpdating, error }
const { 
  updateRole,   // (userId: string, role: UserRole) => Promise<void>
  isUpdating,   // Boolean indicating if update is in progress
  error         // Error object if update failed
} = useUserRoleManagement();`}
                                </pre>
                              </CardContent>
                            </Card>
                          </div>
                          
                          <div>
                            <h3 className="text-lg font-medium mb-2">User Community API</h3>
                            <Card className="bg-card/60">
                              <CardHeader className="pb-2">
                                <CardTitle className="text-base">useUserCommunities Hook</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <pre className="bg-black/20 p-3 rounded-md overflow-x-auto text-xs">
{`// User Communities API
// Returns: { communities, isLoading, error }
const { 
  communities,  // Array of Community objects
  isLoading,    // Boolean indicating if data is loading
  error         // Error object if query failed
} = useUserCommunities(userId);`}
                                </pre>
                              </CardContent>
                            </Card>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="admin">
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-lg font-medium mb-2">Admin Services</h3>
                            <Card className="bg-card/60">
                              <CardHeader className="pb-2">
                                <CardTitle className="text-base">Admin Service Exports</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <pre className="bg-black/20 p-3 rounded-md overflow-x-auto text-xs">
{`// Admin Service Exports
// From adminService.ts
export {
  getSystemStats,          // Gets system-wide statistics
  getUserRoleCounts,       // Gets user count by role
  getCommunityStats,       // Gets community statistics
  getRecentActivities,     // Gets recent system activities
  getAdminSettings,        // Gets admin settings
  updateAdminSettings,     // Updates admin settings
  getMaintenanceStatus,    // Gets system maintenance status
  toggleMaintenanceMode    // Toggles maintenance mode
};`}
                                </pre>
                              </CardContent>
                            </Card>
                          </div>
                          
                          <div>
                            <h3 className="text-lg font-medium mb-2">Audit Services</h3>
                            <Card className="bg-card/60">
                              <CardHeader className="pb-2">
                                <CardTitle className="text-base">Audit Service Exports</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <pre className="bg-black/20 p-3 rounded-md overflow-x-auto text-xs">
{`// Audit Service Exports
// From auditService.ts
export {
  getAuditLogs,            // Gets system audit logs
  getAuditLogsByUser,      // Gets audit logs for a specific user
  getAuditLogsByResource,  // Gets audit logs for a specific resource
  getAuditLogsByCommunity, // Gets audit logs for a specific community
  recordAuditEvent         // Records a new audit event
};`}
                                </pre>
                              </CardContent>
                            </Card>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </section>

              {/* Database section */}
              <section id="database" className="scroll-mt-20">
                <Card className="glass-dark">
                  <CardHeader>
                    <CardTitle className="text-2xl">Database</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Supabase Schema Overview</h3>
                      <Card className="bg-card/60 p-4">
                        <p className="text-sm mb-4">The application uses Supabase as its backend database and authentication provider. Below is the schema of the main tables.</p>
                        
                        <Accordion type="single" collapsible className="w-full">
                          <AccordionItem value="users-table">
                            <AccordionTrigger className="text-base font-medium">Users Tables</AccordionTrigger>
                            <AccordionContent>
                              <div className="bg-black/20 p-3 rounded-md overflow-x-auto">
                                <table className="w-full text-sm">
                                  <thead>
                                    <tr className="border-b border-white/10">
                                      <th className="text-left py-1 px-2">Table Name</th>
                                      <th className="text-left py-1 px-2">Description</th>
                                      <th className="text-left py-1 px-2">Key Columns</th>
                                    </tr>
                                  </thead>
                                  <tbody className="text-xs">
                                    <tr className="border-b border-white/10">
                                      <td className="py-1 px-2 font-mono">auth.users</td>
                                      <td className="py-1 px-2">Supabase auth users</td>
                                      <td className="py-1 px-2">id, email, role</td>
                                    </tr>
                                    <tr className="border-b border-white/10">
                                      <td className="py-1 px-2 font-mono">public.profiles</td>
                                      <td className="py-1 px-2">Extended user profiles</td>
                                      <td className="py-1 px-2">id, user_id, name, bio, avatar_url</td>
                                    </tr>
                                    <tr className="border-b border-white/10">
                                      <td className="py-1 px-2 font-mono">public.user_roles</td>
                                      <td className="py-1 px-2">User role assignments</td>
                                      <td className="py-1 px-2">id, user_id, role, assigned_at</td>
                                    </tr>
                                    <tr>
                                      <td className="py-1 px-2 font-mono">public.user_settings</td>
                                      <td className="py-1 px-2">User preferences</td>
                                      <td className="py-1 px-2">id, user_id, theme, notifications</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                          
                          <AccordionItem value="communities-table">
                            <AccordionTrigger className="text-base font-medium">Communities Tables</AccordionTrigger>
                            <AccordionContent>
                              <div className="bg-black/20 p-3 rounded-md overflow-x-auto">
                                <table className="w-full text-sm">
                                  <thead>
                                    <tr className="border-b border-white/10">
                                      <th className="text-left py-1 px-2">Table Name</th>
                                      <th className="text-left py-1 px-2">Description</th>
                                      <th className="text-left py-1 px-2">Key Columns</th>
                                    </tr>
                                  </thead>
                                  <tbody className="text-xs">
                                    <tr className="border-b border-white/10">
                                      <td className="py-1 px-2 font-mono">public.communities</td>
                                      <td className="py-1 px-2">Core communities data</td>
                                      <td className="py-1 px-2">id, name, description, creator_id, created_at</td>
                                    </tr>
                                    <tr className="border-b border-white/10">
                                      <td className="py-1 px-2 font-mono">public.community_members</td>
                                      <td className="py-1 px-2">Community membership</td>
                                      <td className="py-1 px-2">id, community_id, user_id, role, joined_at</td>
                                    </tr>
                                    <tr className="border-b border-white/10">
                                      <td className="py-1 px-2 font-mono">public.community_platforms</td>
                                      <td className="py-1 px-2">Community platform links</td>
                                      <td className="py-1 px-2">id, community_id, platform_type, url</td>
                                    </tr>
                                    <tr>
                                      <td className="py-1 px-2 font-mono">public.community_social</td>
                                      <td className="py-1 px-2">Community social media</td>
                                      <td className="py-1 px-2">id, community_id, platform, handle, url</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                          
                          <AccordionItem value="audit-table">
                            <AccordionTrigger className="text-base font-medium">Audit Tables</AccordionTrigger>
                            <AccordionContent>
                              <div className="bg-black/20 p-3 rounded-md overflow-x-auto">
                                <table className="w-full text-sm">
                                  <thead>
                                    <tr className="border-b border-white/10">
                                      <th className="text-left py-1 px-2">Table Name</th>
                                      <th className="text-left py-1 px-2">Description</th>
                                      <th className="text-left py-1 px-2">Key Columns</th>
                                    </tr>
                                  </thead>
                                  <tbody className="text-xs">
                                    <tr className="border-b border-white/10">
                                      <td className="py-1 px-2 font-mono">public.audit_logs</td>
                                      <td className="py-1 px-2">System audit logs</td>
                                      <td className="py-1 px-2">id, actor_id, action, resource_type, resource_id, timestamp, ip_address</td>
                                    </tr>
                                    <tr>
                                      <td className="py-1 px-2 font-mono">public.system_events</td>
                                      <td className="py-1 px-2">System-level events</td>
                                      <td className="py-1 px-2">id, event_type, data, created_at</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </Card>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Database Functions</h3>
                      <Card className="bg-card/60 p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <h4 className="text-base font-medium">Member Count Functions</h4>
                            <div className="bg-black/20 p-3 rounded-md text-xs">
                              <p className="font-mono mb-1">increment_community_count</p>
                              <p className="text-xs text-muted-foreground">Increments a community's member count</p>
                              <div className="h-2"></div>
                              
                              <p className="font-mono mb-1">decrement_community_count</p>
                              <p className="text-xs text-muted-foreground">Decrements a community's member count</p>
                              <div className="h-2"></div>
                              
                              <p className="font-mono mb-1">ensure_member_count_column</p>
                              <p className="text-xs text-muted-foreground">Ensures member_count column exists and has correct values</p>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <h4 className="text-base font-medium">User Functions</h4>
                            <div className="bg-black/20 p-3 rounded-md text-xs">
                              <p className="font-mono mb-1">get_user_roles</p>
                              <p className="text-xs text-muted-foreground">Retrieves roles for a specific user</p>
                              <div className="h-2"></div>
                              
                              <p className="font-mono mb-1">is_community_owner</p>
                              <p className="text-xs text-muted-foreground">Checks if a user is the owner of a community</p>
                              <div className="h-2"></div>
                              
                              <p className="font-mono mb-1">get_user_memberships</p>
                              <p className="text-xs text-muted-foreground">Gets all community memberships for a user</p>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">RLS Policies</h3>
                      <Card className="bg-card/60 p-4">
                        <p className="text-sm mb-4">Row-Level Security (RLS) policies control access to database rows based on user roles and permissions.</p>
                        
                        <div className="bg-black/20 p-3 rounded-md overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-white/10">
                                <th className="text-left py-1 px-2">Policy Name</th>
                                <th className="text-left py-1 px-2">Table</th>
                                <th className="text-left py-1 px-2">Operation</th>
                                <th className="text-left py-1 px-2">Description</th>
                              </tr>
                            </thead>
                            <tbody className="text-xs">
                              <tr className="border-b border-white/10">
                                <td className="py-1 px-2">profiles_read_all</td>
                                <td className="py-1 px-2 font-mono">profiles</td>
                                <td className="py-1 px-2">SELECT</td>
                                <td className="py-1 px-2">All users can read profiles</td>
                              </tr>
                              <tr className="border-b border-white/10">
                                <td className="py-1 px-2">profiles_update_own</td>
                                <td className="py-1 px-2 font-mono">profiles</td>
                                <td className="py-1 px-2">UPDATE</td>
                                <td className="py-1 px-2">Users can update their own profile</td>
                              </tr>
                              <tr className="border-b border-white/10">
                                <td className="py-1 px-2">communities_read_all</td>
                                <td className="py-1 px-2 font-mono">communities</td>
                                <td className="py-1 px-2">SELECT</td>
                                <td className="py-1 px-2">All users can read communities</td>
                              </tr>
                              <tr className="border-b border-white/10">
                                <td className="py-1 px-2">communities_create_org_admin</td>
                                <td className="py-1 px-2 font-mono">communities</td>
                                <td className="py-1 px-2">INSERT</td>
                                <td className="py-1 px-2">Only admins and organizers can create communities</td>
                              </tr>
                              <tr className="border-b border-white/10">
                                <td className="py-1 px-2">communities_update_owner</td>
                                <td className="py-1 px-2 font-mono">communities</td>
                                <td className="py-1 px-2">UPDATE</td>
                                <td className="py-1 px-2">Only community owners and admins can update communities</td>
                              </tr>
                              <tr>
                                <td className="py-1 px-2">audit_logs_admin_only</td>
                                <td className="py-1 px-2 font-mono">audit_logs</td>
                                <td className="py-1 px-2">SELECT</td>
                                <td className="py-1 px-2">Only admins can view audit logs</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </section>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default Documentation;
