
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import { TriggerManagement } from "@/components/rel8t/TriggerManagement";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";

const Settings = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6">
        {/* Sleek translucent breadcrumb */}
        <Breadcrumb className="mb-4 p-2 rounded-md bg-cyan-500/10 backdrop-blur-sm border border-cyan-200/20 shadow-sm">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/rel8t" className="text-cyan-700 hover:text-cyan-900">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink className="text-cyan-700">Settings</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <h1 className="text-2xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground mb-6">Manage your account settings and preferences</p>
        
        <Tabs defaultValue="triggers" className="mt-6">
          <TabsList>
            <TabsTrigger value="triggers">Automation Triggers</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="triggers" className="mt-6">
            <TriggerManagement />
          </TabsContent>
          
          <TabsContent value="preferences" className="mt-6">
            <div className="bg-card rounded-lg border p-6">
              <h3 className="text-lg font-medium mb-4">Preferences</h3>
              <p className="text-muted-foreground">
                Personalization settings coming soon.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="notifications" className="mt-6">
            <div className="bg-card rounded-lg border p-6">
              <h3 className="text-lg font-medium mb-4">Notification Settings</h3>
              <p className="text-muted-foreground">
                Email and push notification settings coming soon.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
