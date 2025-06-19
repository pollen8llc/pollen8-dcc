
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  ArrowRight,
  Users, 
  Shield, 
  User, 
  Crown,
  Settings,
  Lock,
  UserCheck,
  CheckCircle,
  Eye,
  Edit
} from 'lucide-react';

const PRDUserManagement = () => {
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
            <Badge variant="outline">User Management System</Badge>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">User Management System</h1>
            <p className="text-xl text-muted-foreground">
              Comprehensive authentication, profile management, and role-based access control
            </p>
          </div>

          {/* Overview */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                System Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                The User Management System provides secure authentication, comprehensive profile management, 
                and flexible role-based access control. Built on Supabase Auth, it ensures security while 
                maintaining a smooth user experience across all platform features.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg text-center">
                  <Shield className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <div className="font-semibold">Secure Authentication</div>
                  <div className="text-sm text-muted-foreground">Supabase-powered auth</div>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg text-center">
                  <User className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <div className="font-semibold">Rich Profiles</div>
                  <div className="text-sm text-muted-foreground">Customizable user profiles</div>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-950 rounded-lg text-center">
                  <Crown className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                  <div className="font-semibold">Role Management</div>
                  <div className="text-sm text-muted-foreground">Flexible permissions</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Authentication Flow */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Authentication Flow
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">Registration Process</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">1</div>
                      <span>User enters email and password</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">2</div>
                      <span>Email verification sent via Supabase</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">3</div>
                      <span>Profile automatically created with default settings</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">4</div>
                      <span>User redirected to profile setup wizard</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Login Process</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs">1</div>
                      <span>User enters credentials</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs">2</div>
                      <span>Supabase validates and creates session</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs">3</div>
                      <span>Profile data loaded and role permissions applied</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs">4</div>
                      <span>User redirected based on role and profile completeness</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Roles */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5" />
                User Roles & Permissions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Crown className="h-5 w-5 text-purple-600" />
                        <h4 className="font-semibold">Admin</h4>
                        <Badge variant="secondary">ADMIN</Badge>
                      </div>
                      <ul className="text-sm space-y-1">
                        <li>• Full system access</li>
                        <li>• User role management</li>
                        <li>• System health monitoring</li>
                        <li>• Audit log access</li>
                        <li>• Community oversight</li>
                      </ul>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="h-5 w-5 text-blue-600" />
                        <h4 className="font-semibold">Organizer</h4>
                        <Badge variant="secondary">ORGANIZER</Badge>
                      </div>
                      <ul className="text-sm space-y-1">
                        <li>• Create and manage communities</li>
                        <li>• Member management</li>
                        <li>• Event coordination</li>
                        <li>• Content moderation</li>
                        <li>• Analytics access</li>
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="h-5 w-5 text-green-600" />
                        <h4 className="font-semibold">Member</h4>
                        <Badge variant="secondary">MEMBER</Badge>
                      </div>
                      <ul className="text-sm space-y-1">
                        <li>• Join communities</li>
                        <li>• Create and comment on articles</li>
                        <li>• Vote on content</li>
                        <li>• Manage personal contacts</li>
                        <li>• Use REL8T features</li>
                      </ul>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Settings className="h-5 w-5 text-orange-600" />
                        <h4 className="font-semibold">Service Provider</h4>
                        <Badge variant="secondary">SERVICE_PROVIDER</Badge>
                      </div>
                      <ul className="text-sm space-y-1">
                        <li>• Access to LAB-R8 only</li>
                        <li>• Service listings</li>
                        <li>• Client communication</li>
                        <li>• Portfolio management</li>
                        <li>• Restricted main platform access</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Management */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                Profile Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">Profile Components</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                        <div>
                          <h5 className="font-medium">Basic Information</h5>
                          <p className="text-sm text-muted-foreground">Name, email, avatar, bio, location</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                        <div>
                          <h5 className="font-medium">Professional Details</h5>
                          <p className="text-sm text-muted-foreground">Interests, skills, experience</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                        <div>
                          <h5 className="font-medium">Social Links</h5>
                          <p className="text-sm text-muted-foreground">LinkedIn, Twitter, website, etc.</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                        <div>
                          <h5 className="font-medium">Privacy Settings</h5>
                          <p className="text-sm text-muted-foreground">Profile visibility, contact preferences</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                        <div>
                          <h5 className="font-medium">Notification Preferences</h5>
                          <p className="text-sm text-muted-foreground">Email, in-app notification settings</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                        <div>
                          <h5 className="font-medium">Account Status</h5>
                          <p className="text-sm text-muted-foreground">Active, suspended, profile completion</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Profile Setup Wizard</h4>
                  <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <p className="mb-3">New users are guided through a comprehensive profile setup process:</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm">Basic information collection</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm">Avatar upload and bio creation</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm">Interest and skill selection</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm">Privacy preference configuration</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm">Social media link integration</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Interface Components */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                User Interface Components
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Authentication Pages</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Unified login/register form</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Password reset flow</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Email verification</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Session recovery</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">Profile Components</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Mobile and desktop profile views</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Inline profile editing</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Avatar upload and cropping</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Role badge display</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Models */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Data Models & Database Schema
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300 dark:border-gray-700">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-900">
                        <th className="border border-gray-300 dark:border-gray-700 p-2 text-left">Table</th>
                        <th className="border border-gray-300 dark:border-gray-700 p-2 text-left">Purpose</th>
                        <th className="border border-gray-300 dark:border-gray-700 p-2 text-left">Key Fields</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 dark:border-gray-700 p-2 font-mono text-sm">profiles</td>
                        <td className="border border-gray-300 dark:border-gray-700 p-2">User profile information</td>
                        <td className="border border-gray-300 dark:border-gray-700 p-2 text-sm">id, first_name, last_name, bio, interests, privacy_settings</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 dark:border-gray-700 p-2 font-mono text-sm">user_roles</td>
                        <td className="border border-gray-300 dark:border-gray-700 p-2">Role assignments</td>
                        <td className="border border-gray-300 dark:border-gray-700 p-2 text-sm">user_id, role_id, assigned_at, assigned_by</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 dark:border-gray-700 p-2 font-mono text-sm">roles</td>
                        <td className="border border-gray-300 dark:border-gray-700 p-2">Available roles and permissions</td>
                        <td className="border border-gray-300 dark:border-gray-700 p-2 text-sm">id, name, description, permissions</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 dark:border-gray-700 p-2 font-mono text-sm">audit_logs</td>
                        <td className="border border-gray-300 dark:border-gray-700 p-2">User action tracking</td>
                        <td className="border border-gray-300 dark:border-gray-700 p-2 text-sm">performed_by, action, details, created_at</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button variant="outline" asChild>
              <Link to="/docs/prd/overview">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Platform Overview
              </Link>
            </Button>
            <Button asChild>
              <Link to="/docs/prd/knowledge">
                Knowledge Base System
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PRDUserManagement;
