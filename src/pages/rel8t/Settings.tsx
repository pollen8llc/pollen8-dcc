
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TriggerManagement from "@/components/rel8t/TriggerManagement";
import { ChevronLeft, Settings as SettingsIcon } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";

const Settings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("automation");

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
        
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              className="mr-2" 
              onClick={() => navigate("/rel8t")}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Settings</h1>
              <p className="text-sm text-muted-foreground">Configure your REL8T experience</p>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="automation">Automation</TabsTrigger>
            <TabsTrigger value="templates">Email Templates</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>
          
          <TabsContent value="automation" className="space-y-4">
            <TriggerManagement />
          </TabsContent>
          
          <TabsContent value="templates">
            <div className="text-center py-12 border border-dashed rounded-lg">
              <SettingsIcon className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-2 text-lg font-medium">Email Templates</h3>
              <p className="text-sm text-muted-foreground mt-1">
                This feature is coming soon!
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="preferences">
            <div className="text-center py-12 border border-dashed rounded-lg">
              <SettingsIcon className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-2 text-lg font-medium">User Preferences</h3>
              <p className="text-sm text-muted-foreground mt-1">
                This feature is coming soon!
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
