
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

const AdminDashboard = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || "overview";
  const { currentUser } = useUser();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(initialTab);
  const { toast } = useToast();

  useEffect(() => {
    const ensureAdminInDatabase = async () => {
      if (currentUser?.id === "38a18dd6-4742-419b-b2c1-70dec5c51729") {
        try {
          const result = await adminService.ensureAdminRole();
          if (!result.success) {
            toast({
              title: "Admin role setup error",
              description: result.message,
              variant: "destructive",
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
  const isAdmin = currentUser?.role === UserRole.ADMIN;
  const isOrganizer = currentUser?.role === UserRole.ORGANIZER || 
                     (currentUser?.managedCommunities && currentUser.managedCommunities.length > 0);

  // Redirect if user doesn't have permission
  useEffect(() => {
    if (!isAdmin && !isOrganizer) {
      navigate("/", { replace: true });
    }
  }, [isAdmin, isOrganizer, navigate]);

  useEffect(() => {
    if (activeTab !== "overview") {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set('tab', activeTab);
      navigate({ search: newSearchParams.toString() }, { replace: true });
    }
  }, [activeTab, navigate, searchParams]);

  if (!isAdmin && !isOrganizer) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto py-20 text-center">
          <h1 className="text-2xl font-bold">Access Denied</h1>
          <p className="mt-4 text-muted-foreground">
            You don't have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        
        {isAdmin && (
          <div className="mb-10">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full mb-8 glass dark:glass-dark">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="users">User Management</TabsTrigger>
                <TabsTrigger value="settings">System Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview">
                <Card>
                  <CardHeader>
                    <CardTitle>System Administration</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-6">
                      Welcome to the admin dashboard. Use the tabs above to manage users, roles, and system settings.
                    </p>
                    <AdminOverviewCards onTabChange={setActiveTab} />
                    
                    <div className="mt-8">
                      <h2 className="text-xl font-semibold mb-4">Community Creation Audit Log</h2>
                      <CommunityAuditTable />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="users">
                <UserManagementTab />
              </TabsContent>
              
              <TabsContent value="settings">
                <Card>
                  <CardHeader>
                    <CardTitle>System Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      System settings will be implemented in a future update.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
        
        {!isAdmin && isOrganizer && (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">Organizer Dashboard</h2>
            <p className="text-muted-foreground mb-6">
              Manage your organization settings and users here.
            </p>
            <AdminOverviewCards onTabChange={() => navigate("/organizer")} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
