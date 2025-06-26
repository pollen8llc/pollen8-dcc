
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Building, 
  Users, 
  ArrowRight, 
  CheckCircle, 
  MessageSquare,
  FileText,
  Workflow,
  Database,
  Code
} from 'lucide-react';
import Navbar from '@/components/Navbar';

const TechnicalDocumentation = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Technical Documentation</h1>
          <p className="text-xl text-muted-foreground">
            Understanding Labr8 vs Modul8: Architecture, Logic, and Implementation
          </p>
        </div>

        {/* Overview Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-6 w-6" />
              System Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              The platform consists of two distinct but interconnected systems: <strong>Modul8</strong> (client/organizer platform) 
              and <strong>Labr8</strong> (service provider platform). Both systems share the same database schema but implement 
              different business logic and user experiences.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-2 mb-2">
                  <Building className="h-5 w-5 text-blue-600" />
                  <Badge className="bg-blue-500/20 text-blue-700 border-blue-300">Modul8</Badge>
                </div>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Client-facing platform for organizations to create service requests and manage projects
                </p>
              </div>
              
              <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-5 w-5 text-green-600" />
                  <Badge className="bg-green-500/20 text-green-700 border-green-300">Labr8</Badge>
                </div>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Service provider platform for viewing opportunities and managing negotiations
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Database Architecture */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-6 w-6" />
              Shared Database Architecture
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">
              Both platforms operate on a unified database schema with the following core tables:
            </p>
            
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Core Service Management Tables</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li><code>modul8_service_requests</code> - Central request management</li>
                  <li><code>modul8_organizers</code> - Client organization profiles</li>
                  <li><code>modul8_service_providers</code> - Service provider profiles</li>
                  <li><code>modul8_proposal_cards</code> - Negotiation proposals</li>
                  <li><code>modul8_proposal_card_responses</code> - Response tracking</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Communication & Tracking Tables</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li><code>modul8_request_comments</code> - Thread discussions</li>
                  <li><code>modul8_notifications</code> - System notifications</li>
                  <li><code>cross_platform_activity_log</code> - Cross-platform activity tracking</li>
                  <li><code>cross_platform_notifications</code> - Inter-platform messaging</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Project Management Tables</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li><code>modul8_project_milestones</code> - Project milestone tracking</li>
                  <li><code>modul8_project_completions</code> - Completion submissions</li>
                  <li><code>modul8_project_ratings</code> - Performance ratings</li>
                  <li><code>modul8_deals</code> - Finalized agreements</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Modul8 Logic */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-6 w-6 text-blue-600" />
              Modul8 Logic (Client Platform)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Request Creation Flow
                </h4>
                <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg">
                  <ol className="space-y-2 text-sm">
                    <li>1. <strong>Organizer Setup:</strong> Client creates organizer profile via <code>SimplifiedRequestForm</code></li>
                    <li>2. <strong>Request Definition:</strong> Service request created in <code>modul8_service_requests</code> with status 'pending'</li>
                    <li>3. <strong>Domain Targeting:</strong> Request associated with specific domain page (1-7)</li>
                    <li>4. <strong>Provider Matching:</strong> System shows request to relevant service providers</li>
                  </ol>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Negotiation Management
                </h4>
                <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg">
                  <ul className="space-y-2 text-sm">
                    <li><strong>Full Control:</strong> Organizers can accept, reject, or counter any proposal</li>
                    <li><strong>Thread Management:</strong> Complete access to <code>ProposalCardThread</code> component</li>
                    <li><strong>Project Oversight:</strong> Can modify request status and manage project progression</li>
                    <li><strong>Direct Communication:</strong> Full comment and notification capabilities</li>
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Workflow className="h-4 w-4" />
                  Key Components & Logic
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <code className="bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded text-xs">Modul8RequestDetails</code>
                    <span className="text-muted-foreground">- Full request management with delete capabilities</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <code className="bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded text-xs">ProposalCardThread</code>
                    <span className="text-muted-foreground">- Complete negotiation interface (879 lines)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <code className="bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded text-xs">ProposalCardActions</code>
                    <span className="text-muted-foreground">- Full response capabilities with counter-proposals</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Labr8 Logic */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-6 w-6 text-green-600" />
              Labr8 Logic (Service Provider Platform)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Request Discovery Flow
                </h4>
                <div className="bg-green-50 dark:bg-green-900/10 p-4 rounded-lg">
                  <ol className="space-y-2 text-sm">
                    <li>1. <strong>Provider Setup:</strong> Service provider creates profile with domain specializations</li>
                    <li>2. <strong>Opportunity Browsing:</strong> View requests filtered by domain expertise</li>
                    <li>3. <strong>Request Access:</strong> Navigate to individual request details via URL parameters</li>
                    <li>4. <strong>Response Interface:</strong> Limited to viewing and responding to existing proposals</li>
                  </ol>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Limited Interaction Model
                </h4>
                <div className="bg-green-50 dark:bg-green-900/10 p-4 rounded-lg">
                  <ul className="space-y-2 text-sm">
                    <li><strong>Response Only:</strong> Can only respond to existing proposals, cannot initiate</li>
                    <li><strong>Status Observation:</strong> Read-only access to request status and progression</li>
                    <li><strong>Restricted Comments:</strong> Limited commenting capabilities in proposal threads</li>
                    <li><strong>No Request Modification:</strong> Cannot change request details or delete requests</li>
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Workflow className="h-4 w-4" />
                  Key Components & Logic
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <code className="bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded text-xs">RequestStatusPage</code>
                    <span className="text-muted-foreground">- Read-only request viewing (276 lines)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <code className="bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded text-xs">NegotiationFlow</code>
                    <span className="text-muted-foreground">- Simplified response interface</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <code className="bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded text-xs">ProposalCardResponseActions</code>
                    <span className="text-muted-foreground">- Response-only actions (216 lines)</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technical Differences */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRight className="h-6 w-6" />
              Key Technical Differences
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300 dark:border-gray-700">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-900/50">
                    <th className="border border-gray-300 dark:border-gray-700 p-3 text-left font-semibold">Aspect</th>
                    <th className="border border-gray-300 dark:border-gray-700 p-3 text-left font-semibold">Modul8 (Client)</th>
                    <th className="border border-gray-300 dark:border-gray-700 p-3 text-left font-semibold">Labr8 (Provider)</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr>
                    <td className="border border-gray-300 dark:border-gray-700 p-3 font-medium">Request Creation</td>
                    <td className="border border-gray-300 dark:border-gray-700 p-3">✅ Full creation & editing</td>
                    <td className="border border-gray-300 dark:border-gray-700 p-3">❌ View only</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 dark:border-gray-700 p-3 font-medium">Proposal Initiation</td>
                    <td className="border border-gray-300 dark:border-gray-700 p-3">✅ Can create initial proposals</td>
                    <td className="border border-gray-300 dark:border-gray-700 p-3">❌ Response only</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 dark:border-gray-700 p-3 font-medium">Negotiation Control</td>
                    <td className="border border-gray-300 dark:border-gray-700 p-3">✅ Full accept/reject/counter</td>
                    <td className="border border-gray-300 dark:border-gray-700 p-3">⚠️ Limited response actions</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 dark:border-gray-700 p-3 font-medium">Project Management</td>
                    <td className="border border-gray-300 dark:border-gray-700 p-3">✅ Full milestone & status control</td>
                    <td className="border border-gray-300 dark:border-gray-700 p-3">⚠️ Execution only</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 dark:border-gray-700 p-3 font-medium">Data Modification</td>
                    <td className="border border-gray-300 dark:border-gray-700 p-3">✅ Can delete/modify requests</td>
                    <td className="border border-gray-300 dark:border-gray-700 p-3">❌ No modification rights</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 dark:border-gray-700 p-3 font-medium">User Interface</td>
                    <td className="border border-gray-300 dark:border-gray-700 p-3">Complex management UI</td>
                    <td className="border border-gray-300 dark:border-gray-700 p-3">Simplified response UI</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Cross-Platform Communication */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-6 w-6" />
              Cross-Platform Communication
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              The system implements sophisticated cross-platform communication to maintain data consistency and user experience:
            </p>
            
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Real-time Updates</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Supabase real-time subscriptions for proposal cards and responses</li>
                  <li>• Cross-platform activity logging in <code>cross_platform_activity_log</code></li>
                  <li>• Notification system via <code>cross_platform_notifications</code></li>
                </ul>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Data Synchronization</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Shared hooks like <code>useProposalCardResponsesData</code> for bulk response loading</li>
                  <li>• Consistent state management across both platforms</li>
                  <li>• Real-time proposal card response tracking</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Implementation Notes */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6" />
              Implementation Notes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Route Structure</h4>
                <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li><code>/modul8/*</code> - Client platform routes</li>
                    <li><code>/labr8/*</code> - Service provider platform routes</li>
                    <li><code>/modul8/request/:requestId</code> - Full request management</li>
                    <li><code>/labr8/request/:providerId/:requestId</code> - Limited request viewing</li>
                  </ul>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Component Reuse Strategy</h4>
                <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Shared UI components in <code>/components/ui/</code></li>
                    <li>• Platform-specific logic in <code>/components/modul8/</code> and <code>/components/labr8/</code></li>
                    <li>• Common services in <code>/services/</code> for database operations</li>
                    <li>• Shared hooks for data management</li>
                  </ul>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Security & Access Control</h4>
                <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Row Level Security (RLS) policies enforce data access</li>
                    <li>• User role validation at component level</li>
                    <li>• Protected routes based on user type (organizer vs service provider)</li>
                    <li>• API-level validation for cross-platform operations</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground border-t pt-4">
          <p>Technical Documentation - Last Updated: {new Date().toLocaleDateString()}</p>
          <p>Platform Version: 1.0 | Database Version: Latest</p>
        </div>
      </div>
    </div>
  );
};

export default TechnicalDocumentation;
