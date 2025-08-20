import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import InviteGenerator from "@/components/invites/InviteGenerator";
import InviteList from "@/components/invites/InviteList";
import Navbar from "@/components/Navbar";
import ErrorBoundary from "@/components/ErrorBoundary";
import {
  FileSpreadsheet,
  Mail,
  Phone,
  Globe,
  Upload,
  Users,
  Plus,
  Import,
  UserPlus
} from "lucide-react";

const ImportsAndInvites: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!currentUser) {
    navigate("/auth");
    return null;
  }

  const isOrganizerOrAdmin = currentUser.role === 'ORGANIZER' || currentUser.role === 'ADMIN';

  if (!isOrganizerOrAdmin) {
    navigate("/");
    return null;
  }

  const handleImportNavigation = (type: string) => {
    navigate(`/a10d/import/${type}`);
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Imports & Invites</h1>
            <p className="text-muted-foreground">
              Manage data imports and user invitations from a centralized dashboard.
            </p>
          </div>

          <Tabs defaultValue="imports" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="imports" className="flex items-center gap-2">
                <Import className="h-4 w-4" />
                Data Imports
              </TabsTrigger>
              <TabsTrigger value="invites" className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                User Invites
              </TabsTrigger>
            </TabsList>

            <TabsContent value="imports" className="space-y-6">
              <div className="grid gap-6">
                {/* Manual Data Import Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Upload className="h-5 w-5" />
                      Manual Data Import
                    </CardTitle>
                    <CardDescription>
                      Import data directly from files or manual entry
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <Button
                        variant="outline"
                        className="h-24 flex-col gap-2"
                        onClick={() => navigate('/rel8/import')}
                      >
                        <FileSpreadsheet className="h-8 w-8" />
                        <span>CSV Import</span>
                      </Button>
                      
                      <Button
                        variant="outline"
                        className="h-24 flex-col gap-2"
                        onClick={() => handleImportNavigation('email')}
                      >
                        <Mail className="h-8 w-8" />
                        <span>Email Import</span>
                      </Button>
                      
                      <Button
                        variant="outline"
                        className="h-24 flex-col gap-2"
                        onClick={() => handleImportNavigation('phone')}
                      >
                        <Phone className="h-8 w-8" />
                        <span>Phone Import</span>
                      </Button>
                      
                      <Button
                        variant="outline"
                        className="h-24 flex-col gap-2"
                        onClick={() => handleImportNavigation('website')}
                      >
                        <Globe className="h-8 w-8" />
                        <span>Website Import</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Platform Integrations Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5" />
                      Platform Integrations
                    </CardTitle>
                    <CardDescription>
                      Connect with external platforms to import data automatically
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      <p>Platform integrations coming soon...</p>
                      <p className="text-sm mt-2">
                        We're working on integrations with popular platforms to make data import seamless.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Import History Section */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Imports</CardTitle>
                    <CardDescription>
                      View your recent import activities and their status
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No recent imports found</p>
                      <p className="text-sm mt-2">
                        Your import history will appear here once you start importing data.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="invites" className="space-y-6">
              <div className="grid gap-6">
                {/* Invite Generation Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Plus className="h-5 w-5" />
                      Generate New Invite
                    </CardTitle>
                    <CardDescription>
                      Create invitation codes and links for new users
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <InviteGenerator onInviteCreated={() => window.location.reload()} />
                  </CardContent>
                </Card>

                <Separator />

                {/* Existing Invites Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Manage Invites
                    </CardTitle>
                    <CardDescription>
                      View and manage your existing invitation codes
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <InviteList />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default ImportsAndInvites;
