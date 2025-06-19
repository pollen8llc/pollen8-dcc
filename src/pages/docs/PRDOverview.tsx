
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Target, 
  Users, 
  Zap, 
  Globe, 
  ArrowRight,
  CheckCircle,
  Clock,
  Star
} from 'lucide-react';

const PRDOverview = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Navigation */}
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" asChild>
              <Link to="/docs/prd">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to PRD Index
              </Link>
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <Badge variant="outline">Platform Overview</Badge>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Platform Overview</h1>
            <p className="text-xl text-muted-foreground">
              Executive summary and architectural overview of the POLLEN-8 networking platform
            </p>
          </div>

          {/* Executive Summary */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Executive Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                POLLEN-8 is a comprehensive networking and knowledge-sharing platform designed to facilitate 
                meaningful connections between professionals, community organizers, and knowledge seekers. 
                The platform combines relationship management, knowledge base functionality, and community 
                building tools into a unified ecosystem.
              </p>
              <p>
                Built with modern web technologies including React, TypeScript, and Supabase, POLLEN-8 
                provides a scalable, secure, and user-friendly environment for professional networking 
                and knowledge exchange.
              </p>
            </CardContent>
          </Card>

          {/* Vision & Mission */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Vision
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  To become the premier platform for professional networking that emphasizes 
                  relationship quality over quantity, fostering genuine connections and 
                  knowledge sharing in professional communities.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Mission
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  To provide professionals with intelligent tools for managing relationships, 
                  sharing knowledge, and building communities while maintaining privacy, 
                  security, and meaningful engagement.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Core Principles */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Core Platform Principles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Quality Over Quantity</h4>
                      <p className="text-sm text-muted-foreground">
                        Focus on meaningful connections rather than massive networks
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Knowledge Sharing</h4>
                      <p className="text-sm text-muted-foreground">
                        Facilitate expert knowledge transfer and community learning
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Privacy First</h4>
                      <p className="text-sm text-muted-foreground">
                        User control over personal data and connection visibility
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Automation with Purpose</h4>
                      <p className="text-sm text-muted-foreground">
                        Smart automation that enhances rather than replaces human connection
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Community Building</h4>
                      <p className="text-sm text-muted-foreground">
                        Tools for creating and nurturing professional communities
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Scalable Architecture</h4>
                      <p className="text-sm text-muted-foreground">
                        Built to grow with user needs and technological advances
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Target Audience */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Target Audience
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Professionals</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Business executives</li>
                    <li>• Entrepreneurs</li>
                    <li>• Consultants</li>
                    <li>• Industry experts</li>
                  </ul>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Community Organizers</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Event organizers</li>
                    <li>• Professional associations</li>
                    <li>• Industry groups</li>
                    <li>• Meetup coordinators</li>
                  </ul>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Knowledge Workers</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Researchers</li>
                    <li>• Content creators</li>
                    <li>• Subject matter experts</li>
                    <li>• Thought leaders</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Platform Architecture */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Platform Architecture Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">Core Modules</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                      <h5 className="font-medium text-blue-900 dark:text-blue-100">Knowledge Base</h5>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        Article creation, commenting, voting, and tag-based organization
                      </p>
                    </div>
                    <div className="p-4 bg-red-50 dark:bg-red-950 rounded-lg">
                      <h5 className="font-medium text-red-900 dark:text-red-100">REL8T</h5>
                      <p className="text-sm text-red-700 dark:text-red-300">
                        Relationship management with contact tracking and automation
                      </p>
                    </div>
                    <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                      <h5 className="font-medium text-green-900 dark:text-green-100">Communities</h5>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        Community creation, member management, and event coordination
                      </p>
                    </div>
                    <div className="p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                      <h5 className="font-medium text-purple-900 dark:text-purple-100">User Management</h5>
                      <p className="text-sm text-purple-700 dark:text-purple-300">
                        Authentication, profiles, roles, and permission management
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Technology Stack</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div className="p-3 border rounded">
                      <div className="font-medium">Frontend</div>
                      <div className="text-sm text-muted-foreground">React + TypeScript</div>
                    </div>
                    <div className="p-3 border rounded">
                      <div className="font-medium">Backend</div>
                      <div className="text-sm text-muted-foreground">Supabase</div>
                    </div>
                    <div className="p-3 border rounded">
                      <div className="font-medium">Database</div>
                      <div className="text-sm text-muted-foreground">PostgreSQL</div>
                    </div>
                    <div className="p-3 border rounded">
                      <div className="font-medium">Styling</div>
                      <div className="text-sm text-muted-foreground">Tailwind CSS</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Success Metrics */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Success Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-2">User Engagement</div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>Daily active users</li>
                    <li>Article interactions</li>
                    <li>Contact management usage</li>
                  </ul>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600 mb-2">Knowledge Sharing</div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>Articles published</li>
                    <li>Comments and votes</li>
                    <li>Knowledge discovery</li>
                  </ul>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 mb-2">Community Growth</div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>Communities created</li>
                    <li>Member connections</li>
                    <li>Relationship quality</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button variant="outline" asChild>
              <Link to="/docs/prd">
                <ArrowLeft className="h-4 w-4 mr-2" />
                PRD Index
              </Link>
            </Button>
            <Button asChild>
              <Link to="/docs/prd/user-management">
                User Management System
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PRDOverview;
