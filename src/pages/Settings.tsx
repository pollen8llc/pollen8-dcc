
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@/contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { AccountSettingsSection } from "@/components/settings/AccountSettingsSection";
import { PrivacySecuritySection } from "@/components/settings/PrivacySecuritySection";
import { DataManagementSection } from "@/components/settings/DataManagementSection";
import { EmailNotificationSection } from "@/components/settings/EmailNotificationSection";
import { PlatformAccessSection } from "@/components/settings/PlatformAccessSection";
import { DataTablesSection } from "@/components/settings/DataTablesSection";
import { cn } from "@/lib/utils";

const Settings = () => {
  const { currentUser } = useUser();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("account");

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!currentUser) {
      navigate("/auth");
    }
  }, [currentUser, navigate]);

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-2 sm:px-4 py-6 max-w-6xl">
        <Card className={cn("glass dark:glass-dark px-2 py-1 md:px-4 md:py-2", "shadow-xl")}>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
              <div className="flex-1">
                <CardTitle className="text-2xl font-bold">
                  Account Settings
                </CardTitle>
                <Separator className="my-2" />
                <div className="text-muted-foreground mt-1 mb-2 text-base">
                  Manage your account, privacy, and platform preferences
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-2 pb-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 mb-6">
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="privacy">Privacy</TabsTrigger>
                <TabsTrigger value="data">Data</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="platform">Platform</TabsTrigger>
                <TabsTrigger value="tables">Data Tables</TabsTrigger>
              </TabsList>

              <TabsContent value="account" className="space-y-4">
                <AccountSettingsSection />
              </TabsContent>

              <TabsContent value="privacy" className="space-y-4">
                <PrivacySecuritySection />
              </TabsContent>

              <TabsContent value="data" className="space-y-4">
                <DataManagementSection />
              </TabsContent>

              <TabsContent value="notifications" className="space-y-4">
                <EmailNotificationSection />
              </TabsContent>

              <TabsContent value="platform" className="space-y-4">
                <PlatformAccessSection />
              </TabsContent>

              <TabsContent value="tables" className="space-y-4">
                <DataTablesSection />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
