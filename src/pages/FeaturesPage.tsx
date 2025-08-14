import React, { useState } from 'react';
import { Download, FileText, BookOpen, Users, Briefcase, Target, Shield, Settings } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

interface Feature {
  id: string;
  category: string;
  name: string;
  description: string;
  userFlow: string[];
  icon: React.ReactNode;
  routes: string[];
  roles: string[];
}

const FeaturesPage = () => {
  const { toast } = useToast();
  const [downloadFormat, setDownloadFormat] = useState<'md' | 'doc'>('md');

  const features: Feature[] = [
    {
      id: 'knowledge-base',
      category: 'Knowledge Management',
      name: 'Knowledge Base & Articles',
      description: 'Create, share, and discover valuable content including articles, polls, questions, and quotes with voting and commenting capabilities.',
      userFlow: [
        'Navigate to /knowledge',
        'Browse existing articles or create new content',
        'Select content type (Article, Poll, Question, Quote)',
        'Write and publish content with tags',
        'Vote and comment on other users\' content',
        'Save articles for later reading'
      ],
      icon: <BookOpen className="h-5 w-5" />,
      routes: ['/knowledge', '/knowledge/create', '/knowledge/topics', '/knowledge/:id'],
      roles: ['All Users', 'Organizers', 'Admins']
    },
    {
      id: 'rel8-crm',
      category: 'Relationship Management',
      name: 'REL8 - Contact & Relationship Management',
      description: 'Comprehensive CRM system for managing contacts, triggers, outreach campaigns, and relationship analytics.',
      userFlow: [
        'Access REL8 from main navigation',
        'Import contacts via CSV or Luma integration',
        'Create contact categories and groups',
        'Set up automated triggers for relationship maintenance',
        'Schedule and track outreach campaigns',
        'View analytics and relationship insights'
      ],
      icon: <Users className="h-5 w-5" />,
      routes: ['/rel8/dashboard', '/rel8/contacts', '/rel8/triggers', '/rel8/import'],
      roles: ['All Users']
    },
    {
      id: 'modul8-services',
      category: 'Service Management',
      name: 'Modul8 - Service Marketplace',
      description: 'Platform for organizers to request services and service providers to offer solutions with proposal negotiation system.',
      userFlow: [
        'Organizers create service requests with requirements',
        'Service providers browse and respond to requests',
        'Proposal card negotiation system for terms',
        'Agreement finalization with DEEL integration',
        'Project tracking and milestone management',
        'Completion verification and ratings'
      ],
      icon: <Briefcase className="h-5 w-5" />,
      routes: ['/modul8/dashboard', '/modul8/requests', '/modul8/providers', '/modul8/projects'],
      roles: ['Organizers', 'Service Providers']
    },
    {
      id: 'labr8-projects',
      category: 'Project Management',
      name: 'Labr8 - Project Workspace',
      description: 'Dedicated project management interface for service providers to manage active projects and client communications.',
      userFlow: [
        'Service providers access project dashboard',
        'View active and completed projects',
        'Communicate with clients through project interface',
        'Submit deliverables and track progress',
        'Handle revision requests',
        'Mark projects as complete'
      ],
      icon: <Target className="h-5 w-5" />,
      routes: ['/labr8/dashboard', '/labr8/projects/:id', '/labr8/status/:id'],
      roles: ['Service Providers']
    },
    {
      id: 'community-management',
      category: 'Community',
      name: 'Community Management',
      description: 'Create and manage communities with member invitations, role management, and community analytics.',
      userFlow: [
        'Create new communities with details and settings',
        'Invite members using custom invite codes',
        'Manage community visibility and access',
        'Track community growth and engagement',
        'Moderate community content and members'
      ],
      icon: <Users className="h-5 w-5" />,
      routes: ['/communities', '/community/:id', '/invites'],
      roles: ['Organizers', 'Admins']
    },
    {
      id: 'profile-management',
      category: 'User Management',
      name: 'Profile & User Management',
      description: 'Comprehensive user profile system with privacy controls, role management, and profile customization.',
      userFlow: [
        'Complete profile setup wizard',
        'Update personal information and bio',
        'Configure privacy settings',
        'Upload avatar and add social links',
        'Manage role preferences',
        'View and edit public profile'
      ],
      icon: <Users className="h-5 w-5" />,
      routes: ['/profile', '/profile/edit', '/profile/setup', '/profile/:userId'],
      roles: ['All Users']
    },
    {
      id: 'admin-dashboard',
      category: 'Administration',
      name: 'Admin Dashboard & Management',
      description: 'Comprehensive administrative interface for user management, system analytics, and platform oversight.',
      userFlow: [
        'Access admin dashboard with elevated permissions',
        'View system-wide analytics and metrics',
        'Manage user accounts and roles',
        'Monitor community activities',
        'Review audit logs and system health',
        'Configure platform settings'
      ],
      icon: <Shield className="h-5 w-5" />,
      routes: ['/admin', '/admin/metrics', '/admin/debugger'],
      roles: ['Admins']
    },
    {
      id: 'authentication',
      category: 'Security',
      name: 'Authentication & Security',
      description: 'Secure authentication system with role-based access control and protected routes.',
      userFlow: [
        'Register new account with email verification',
        'Login with secure authentication',
        'Role-based route protection',
        'Password reset functionality',
        'Session management',
        'Security audit trails'
      ],
      icon: <Shield className="h-5 w-5" />,
      routes: ['/auth', '/onboarding', '/welcome'],
      roles: ['All Users']
    },
    {
      id: 'integrations',
      category: 'Integrations',
      name: 'Third-Party Integrations',
      description: 'Seamless integrations with external services including Luma for contact import and DEEL for contract management.',
      userFlow: [
        'Connect to Luma for event contact import',
        'OAuth authentication flow',
        'Import contacts from events',
        'DEEL integration for contract execution',
        'Automated synchronization',
        'Integration status monitoring'
      ],
      icon: <Settings className="h-5 w-5" />,
      routes: ['/rel8/import', '/modul8/contracts'],
      roles: ['All Users']
    }
  ];

  const generateMarkdown = () => {
    let markdown = `# Platform Features & Functionality\n\n`;
    markdown += `Generated on: ${new Date().toLocaleDateString()}\n\n`;
    
    const categories = [...new Set(features.map(f => f.category))];
    
    categories.forEach(category => {
      markdown += `## ${category}\n\n`;
      
      const categoryFeatures = features.filter(f => f.category === category);
      
      categoryFeatures.forEach(feature => {
        markdown += `### ${feature.name}\n\n`;
        markdown += `**Description:** ${feature.description}\n\n`;
        markdown += `**User Roles:** ${feature.roles.join(', ')}\n\n`;
        markdown += `**Routes:** ${feature.routes.join(', ')}\n\n`;
        markdown += `**User Flow:**\n`;
        feature.userFlow.forEach((step, index) => {
          markdown += `${index + 1}. ${step}\n`;
        });
        markdown += `\n---\n\n`;
      });
    });
    
    return markdown;
  };

  const downloadContent = () => {
    const content = generateMarkdown();
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `platform-features.${downloadFormat}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download Started",
      description: `Features documentation downloaded as ${downloadFormat.toUpperCase()} file.`,
    });
  };

  const categoryColors = {
    'Knowledge Management': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    'Relationship Management': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    'Service Management': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    'Project Management': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    'Community': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
    'User Management': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
    'Administration': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    'Security': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    'Integrations': 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300'
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Platform Features & Functionality</h1>
              <p className="text-muted-foreground">Comprehensive overview of all platform capabilities and user workflows</p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Button
                  variant={downloadFormat === 'md' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setDownloadFormat('md')}
                >
                  <FileText className="h-4 w-4 mr-1" />
                  Markdown
                </Button>
                <Button
                  variant={downloadFormat === 'doc' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setDownloadFormat('doc')}
                >
                  <FileText className="h-4 w-4 mr-1" />
                  Document
                </Button>
              </div>
              <Button onClick={downloadContent} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download {downloadFormat.toUpperCase()}
              </Button>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-primary">{features.length}</div>
              <p className="text-sm text-muted-foreground">Total Features</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-primary">
                {[...new Set(features.map(f => f.category))].length}
              </div>
              <p className="text-sm text-muted-foreground">Categories</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-primary">
                {[...new Set(features.flatMap(f => f.routes))].length}
              </div>
              <p className="text-sm text-muted-foreground">Total Routes</p>
            </CardContent>
          </Card>
        </div>

        {/* Features by Category */}
        {[...new Set(features.map(f => f.category))].map(category => (
          <div key={category} className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-2xl font-semibold text-foreground">{category}</h2>
              <Badge className={categoryColors[category as keyof typeof categoryColors]}>
                {features.filter(f => f.category === category).length} features
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {features
                .filter(feature => feature.category === category)
                .map(feature => (
                  <Card key={feature.id} className="h-full">
                    <CardHeader>
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          {feature.icon}
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg">{feature.name}</CardTitle>
                          <CardDescription className="mt-2">
                            {feature.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      {/* User Roles */}
                      <div>
                        <h4 className="text-sm font-medium text-foreground mb-2">User Roles</h4>
                        <div className="flex flex-wrap gap-1">
                          {feature.roles.map(role => (
                            <Badge key={role} variant="secondary" className="text-xs">
                              {role}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <Separator />

                      {/* Routes */}
                      <div>
                        <h4 className="text-sm font-medium text-foreground mb-2">Routes</h4>
                        <div className="space-y-1">
                          {feature.routes.map(route => (
                            <code key={route} className="block text-xs bg-muted px-2 py-1 rounded">
                              {route}
                            </code>
                          ))}
                        </div>
                      </div>

                      <Separator />

                      {/* User Flow */}
                      <div>
                        <h4 className="text-sm font-medium text-foreground mb-2">User Flow</h4>
                        <ol className="text-sm text-muted-foreground space-y-1 pl-4">
                          {feature.userFlow.map((step, index) => (
                            <li key={index} className="list-decimal">
                              {step}
                            </li>
                          ))}
                        </ol>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturesPage;