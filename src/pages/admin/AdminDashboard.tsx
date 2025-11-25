import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/contexts/UserContext";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserRole } from "@/models/types";
import * as adminService from "@/services/adminService";
import { useToast } from "@/hooks/use-toast";
import UserManagementTab from "@/components/admin/UserManagementTab";
import AdminOverviewCards from "@/components/admin/AdminOverviewCards";
import NotFoundState from "@/components/community/NotFoundState";
import CommunityAuditTable from "@/components/admin/CommunityAuditTable";
import AdminMetrics from "@/pages/admin/AdminMetrics";
import UserFlows from "@/pages/admin/UserFlows";
import TechnicalDocumentationGenerator from "@/components/admin/TechnicalDocumentationGenerator";
const AdminDashboard = () => {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || "overview";
  const {
    currentUser
  } = useUser();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(initialTab);
  const {
    toast
  } = useToast();
  useEffect(() => {
    const ensureAdminInDatabase = async () => {
      if (currentUser?.id === "38a18dd6-4742-419b-b2c1-70dec5c51729") {
        try {
          const result = await adminService.ensureAdminRole();
          if (!result.success) {
            toast({
              title: "Admin role setup error",
              description: result.message,
              variant: "destructive"
            });
          }
        } catch (error) {
          console.error("Error ensuring admin role:", error);
        }
      }
    };
    ensureAdminInDatabase();
  }, [currentUser?.id, toast]);

  // Check if user is admin or organizer
  const isAdmin = currentUser?.role === UserRole.ADMIN || currentUser?.role as string === 'ADMIN';
  const isOrganizer = currentUser?.role === UserRole.ORGANIZER || currentUser?.role as string === 'ORGANIZER' || currentUser?.managedCommunities && currentUser.managedCommunities.length > 0;
  console.log('AdminDashboard: User permissions check', {
    currentUser: currentUser?.id,
    role: currentUser?.role,
    isAdmin,
    isOrganizer,
    userRoleEnum: UserRole.ADMIN
  });

  // Redirect if user doesn't have permission
  useEffect(() => {
    if (!isAdmin && !isOrganizer) {
      navigate("/", {
        replace: true
      });
    }
  }, [isAdmin, isOrganizer, navigate]);
  useEffect(() => {
    if (activeTab !== "overview") {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set('tab', activeTab);
      navigate({
        search: newSearchParams.toString()
      }, {
        replace: true
      });
    }
  }, [activeTab, navigate, searchParams]);
  if (!isAdmin && !isOrganizer) {
    return <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto py-20 text-center">
          <h1 className="text-2xl font-bold">Access Denied</h1>
          <p className="mt-4 text-muted-foreground">
            You don't have permission to access this page.
          </p>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Navbar />
      <div className="container mx-auto py-6 px-4">
        {/* Glassmorphic Header */}
        <div className="glass-morphism glass-morphism-hover rounded-3xl p-6 mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent mb-2">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">Platform oversight and analytics</p>
        </div>
        
        {isAdmin && <div className="mb-10">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              {/* Glassmorphic Tab List */}
              <TabsList className="w-full mb-8 glass-morphism border border-primary/20 bg-primary/5 backdrop-blur-md p-2 rounded-2xl">
                <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-black font-medium rounded-xl transition-all duration-300">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="metrics" className="data-[state=active]:bg-primary data-[state=active]:text-black font-medium rounded-xl transition-all duration-300">
                  Metrics
                </TabsTrigger>
                <TabsTrigger value="flows" className="data-[state=active]:bg-primary data-[state=active]:text-black font-medium rounded-xl transition-all duration-300">
                  User Flows
                </TabsTrigger>
                <TabsTrigger value="users" className="data-[state=active]:bg-primary data-[state=active]:text-black font-medium rounded-xl transition-all duration-300">
                  User Management
                </TabsTrigger>
                <TabsTrigger value="avatars" className="data-[state=active]:bg-primary data-[state=active]:text-black font-medium rounded-xl transition-all duration-300">
                  Avatar Gallery
                </TabsTrigger>
                <TabsTrigger value="settings" className="data-[state=active]:bg-primary data-[state=active]:text-black font-medium rounded-xl transition-all duration-300">
                  System Settings
                </TabsTrigger>
                <TabsTrigger value="email-tester" className="data-[state=active]:bg-primary data-[state=active]:text-black font-medium rounded-xl transition-all duration-300">
                  Email Tester
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="animate-fade-in">
                <div className="glass-morphism glass-morphism-hover rounded-3xl p-8 border border-primary/20">
                  <div className="flex items-center gap-3 mb-6">
                    
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">System Administration</h2>
                      <p className="text-muted-foreground">Welcome to the admin dashboard. Manage platform operations with ease.</p>
                    </div>
                  </div>
                  
                  <AdminOverviewCards onTabChange={setActiveTab} />
                  
                  {/* Enhanced Community Audit Section */}
                  <div className="mt-8 glass-morphism glass-morphism-hover rounded-2xl p-6 border border-primary/10">
                    <div className="flex items-center gap-3 mb-6">
                      
                      <h3 className="text-xl font-semibold text-foreground">Community Creation Audit Log</h3>
                    </div>
                    <CommunityAuditTable />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="metrics" className="animate-fade-in">
                <div className="glass-morphism glass-morphism-hover rounded-3xl p-8 border border-primary/20">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                      <span className="text-black font-bold text-xl">📈</span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">Platform Metrics</h2>
                      <p className="text-muted-foreground">Real-time analytics and performance insights</p>
                    </div>
                  </div>
                  <AdminMetrics />
                </div>
              </TabsContent>

              <TabsContent value="flows" className="animate-fade-in">
                <UserFlows />
              </TabsContent>

              <TabsContent value="users" className="animate-fade-in">
                <UserManagementTab />
              </TabsContent>
              
              <TabsContent value="avatars" className="animate-fade-in">
                <div className="glass-morphism glass-morphism-hover rounded-3xl p-8 border border-primary/20">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                      <span className="text-black font-bold text-xl">👤</span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">Avatar Gallery</h2>
                      <p className="text-muted-foreground">Animated space-themed avatars for the platform</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 md:grid-cols-8 lg:grid-cols-10 gap-6">
                    {/* Avatar showcase - static display */}
                    <div className="text-center py-8 col-span-full">
                      <p className="text-muted-foreground">
                        Navigate to <a href="/admin/avatars" className="text-primary hover:underline">/admin/avatars</a> to view the full gallery
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="settings" className="animate-fade-in">
                <div className="space-y-6">
                  <div className="glass-morphism glass-morphism-hover rounded-3xl p-8 border border-primary/20">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                        <span className="text-black font-bold text-xl">⚙️</span>
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-foreground">System Settings</h2>
                        <p className="text-muted-foreground">Configure platform settings and preferences</p>
                      </div>
                    </div>
                    <div className="text-center py-12">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                        <span className="text-primary text-2xl">🔧</span>
                      </div>
                      <p className="text-muted-foreground">
                        System settings will be implemented in a future update.
                      </p>
                    </div>
                  </div>
                  
                  {/* Technical Documentation Generator */}
                  <TechnicalDocumentationGenerator />
                </div>
              </TabsContent>

              <TabsContent value="email-tester" className="animate-fade-in">
                <div className="glass-morphism glass-morphism-hover rounded-3xl p-8 border border-primary/20">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                      <span className="text-black font-bold text-xl">📧</span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">Email Tester</h2>
                      <p className="text-muted-foreground">Test the inbound email webhook system</p>
                    </div>
                  </div>
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">
                      Navigate to the dedicated email tester page for full functionality
                    </p>
                    <a 
                      href="/admin/email-tester" 
                      className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-black rounded-xl hover:bg-primary/90 transition-colors font-medium"
                    >
                      Open Email Tester
                    </a>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>}
        
        {!isAdmin && isOrganizer && <div className="glass-morphism glass-morphism-hover rounded-3xl p-8 border border-primary/20 animate-fade-in">
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                <span className="text-black text-3xl font-bold">👑</span>
              </div>
              <h2 className="text-2xl font-semibold mb-2 text-foreground">Organizer Dashboard</h2>
              <p className="text-muted-foreground mb-8">
                Manage your organization settings and users with enhanced controls.
              </p>
              <AdminOverviewCards onTabChange={() => navigate("/organizer")} />
            </div>
          </div>}
      </div>
    </div>;
};
export default AdminDashboard;