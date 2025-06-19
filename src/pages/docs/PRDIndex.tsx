
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Users, 
  Brain, 
  Heart, 
  Settings, 
  Shield,
  Zap,
  BookOpen,
  MessageSquare,
  Search,
  Database
} from 'lucide-react';

const PRDIndex = () => {
  const sections = [
    {
      title: "Platform Overview",
      description: "Executive summary, vision, and core platform architecture",
      icon: FileText,
      href: "/docs/prd/overview",
      status: "Complete",
      color: "bg-blue-500"
    },
    {
      title: "User Management System",
      description: "Authentication, profiles, roles, and permissions framework",
      icon: Users,
      href: "/docs/prd/user-management",
      status: "Complete",
      color: "bg-green-500"
    },
    {
      title: "Knowledge Base System",
      description: "Articles, comments, voting, tags, and content management",
      icon: Brain,
      href: "/docs/prd/knowledge",
      status: "Complete",
      color: "bg-purple-500"
    },
    {
      title: "REL8T - Relationship Management",
      description: "Contact management, relationship tracking, and automation",
      icon: Heart,
      href: "/docs/prd/rel8t",
      status: "Complete",
      color: "bg-red-500"
    },
    {
      title: "Community Features",
      description: "Community creation, management, and member interactions",
      icon: Users,
      href: "/docs/prd/communities",
      status: "Complete",
      color: "bg-orange-500"
    },
    {
      title: "User Interface & Experience",
      description: "Design system, navigation, responsiveness, and accessibility",
      icon: Settings,
      href: "/docs/prd/ui-ux",
      status: "Complete",
      color: "bg-indigo-500"
    },
    {
      title: "Admin & System Management",
      description: "Administrative tools, system health, and audit logging",
      icon: Shield,
      href: "/docs/prd/admin",
      status: "Complete",
      color: "bg-gray-600"
    },
    {
      title: "Technical Architecture",
      description: "Database schema, API structure, and system integrations",
      icon: Database,
      href: "/docs/prd/technical",
      status: "Complete",
      color: "bg-teal-500"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">POLLEN-8 Platform</h1>
            <h2 className="text-2xl text-muted-foreground mb-6">Product Requirements Document</h2>
            <div className="max-w-3xl mx-auto">
              <p className="text-lg text-muted-foreground mb-4">
                Comprehensive documentation covering all functionalities, user experiences, 
                and technical components of the POLLEN-8 networking and knowledge-sharing platform.
              </p>
              <div className="flex justify-center gap-4 flex-wrap">
                <Badge variant="outline" className="px-3 py-1">Version 1.0</Badge>
                <Badge variant="outline" className="px-3 py-1">Last Updated: {new Date().toLocaleDateString()}</Badge>
                <Badge variant="outline" className="px-3 py-1">Comprehensive Documentation</Badge>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{sections.length}</div>
                <div className="text-sm text-muted-foreground">Documentation Sections</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">4</div>
                <div className="text-sm text-muted-foreground">Core Features</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">5</div>
                <div className="text-sm text-muted-foreground">User Roles</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">30+</div>
                <div className="text-sm text-muted-foreground">Database Tables</div>
              </CardContent>
            </Card>
          </div>

          {/* Documentation Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sections.map((section, index) => {
              const Icon = section.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${section.color} text-white`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{section.title}</CardTitle>
                          <Badge variant="secondary" className="mt-1">{section.status}</Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{section.description}</p>
                    <Button asChild className="w-full">
                      <Link to={section.href}>
                        View Documentation
                        <FileText className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Additional Information */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Documentation Scope
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">User Authentication & Profile Management</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Knowledge Base & Content Management</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">REL8T Relationship Management System</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Community Features & Management</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Administrative Tools & System Health</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Key Features Covered
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Multi-role User System (Admin, Organizer, Member, Service Provider)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Rich Text Knowledge Articles with Voting & Comments</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Contact Management with Categories & Automation</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Community Creation & Member Management</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Responsive Design with Mobile & Desktop Support</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PRDIndex;
