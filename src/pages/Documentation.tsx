
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import Navbar from '@/components/Navbar';

const Documentation = () => {
  const sections = [
    {
      title: "Getting Started",
      items: [
        { name: "Quick Start Guide", description: "Learn the basics of the platform" },
        { name: "User Registration", description: "How to create your account" },
        { name: "Profile Setup", description: "Complete your user profile" }
      ]
    },
    {
      title: "Knowledge Base",
      items: [
        { name: "Creating Articles", description: "Write and publish knowledge articles" },
        { name: "Commenting System", description: "Engage with content through comments" },
        { name: "Voting & Feedback", description: "Rate content and provide feedback" },
        { name: "Tags & Categories", description: "Organize content with tags" }
      ]
    },
    {
      title: "REL8 CRM",
      items: [
        { name: "Contact Management", description: "Manage your professional contacts" },
        { name: "Relationship Building", description: "Build and maintain relationships" },
        { name: "Automation Triggers", description: "Set up automated relationship activities" },
        { name: "Categories & Organization", description: "Organize contacts effectively" }
      ]
    },
    {
      title: "Features",
      items: [
        { name: "Search Functionality", description: "Find content and contacts quickly" },
        { name: "Notifications", description: "Stay updated with platform activities" },
        { name: "Privacy Settings", description: "Control your data and visibility" },
        { name: "Export/Import", description: "Manage your data portability" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold tracking-tight mb-4">Documentation</h1>
            <p className="text-xl text-muted-foreground">
              Complete guide to using the platform effectively
            </p>
          </div>

          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="space-y-8 pr-4">
              {sections.map((section, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {section.title}
                      <Badge variant="outline">{section.items.length} items</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {section.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                          <h3 className="font-semibold mb-2">{item.name}</h3>
                          <p className="text-muted-foreground text-sm">{item.description}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Card>
                <CardHeader>
                  <CardTitle>Platform Architecture</CardTitle>
                  <CardDescription>Technical overview of the platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold mb-2">Frontend Stack</h3>
                      <p className="text-muted-foreground text-sm">React, TypeScript, Tailwind CSS, Shadcn/ui</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold mb-2">Backend Services</h3>
                      <p className="text-muted-foreground text-sm">Supabase (Authentication, Database, Real-time)</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold mb-2">Database</h3>
                      <p className="text-muted-foreground text-sm">PostgreSQL with Row Level Security (RLS)</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>API Endpoints</CardTitle>
                  <CardDescription>Available API endpoints and their usage</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-muted rounded-lg">
                      <code className="text-sm">GET /api/knowledge/articles</code>
                      <p className="text-xs text-muted-foreground mt-1">Fetch knowledge base articles</p>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <code className="text-sm">POST /api/rel8/contacts</code>
                      <p className="text-xs text-muted-foreground mt-1">Create new contact</p>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <code className="text-sm">PUT /api/profiles/:id</code>
                      <p className="text-xs text-muted-foreground mt-1">Update user profile</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default Documentation;
