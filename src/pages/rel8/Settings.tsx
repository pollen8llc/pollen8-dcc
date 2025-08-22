import React from 'react';
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Rel8OnlyNavigation } from "@/components/rel8t/Rel8OnlyNavigation";
import { Settings, Database, Shield, Bell, Palette, Zap } from "lucide-react";

const Rel8Settings = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Navbar />
      
      <div className="container mx-auto px-4 py-4 sm:py-8 max-w-6xl">
        <Rel8OnlyNavigation />
        
        {/* Header Card */}
        <Card className="overflow-hidden bg-gradient-to-br from-background via-muted/5 to-background border-border/50 shadow-2xl mb-8">
          <CardContent className="p-0">
            <div className="relative bg-gradient-to-r from-background via-background/50 to-background p-6 lg:p-8">
              <div className="min-w-0">
                <h1 className="text-3xl lg:text-4xl font-bold text-foreground tracking-tight mb-2">Settings</h1>
                <p className="text-lg text-muted-foreground">Configure your Rel8 preferences and automation</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* General Settings */}
          <Card className="group relative overflow-hidden border-0 bg-card/40 backdrop-blur-md hover:bg-card/60 transition-all duration-300 hover:shadow-xl hover:shadow-black/10 cursor-pointer hover:scale-[1.02]">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-300" />
            <CardHeader className="pb-4 relative">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 rounded-xl backdrop-blur-sm border bg-primary/10 border-primary/30">
                  <Settings className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl font-bold">General</CardTitle>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Basic settings and preferences
              </p>
            </CardHeader>
          </Card>

          {/* Data Management */}
          <Card className="group relative overflow-hidden border-0 bg-card/40 backdrop-blur-md hover:bg-card/60 transition-all duration-300 hover:shadow-xl hover:shadow-black/10 cursor-pointer hover:scale-[1.02]">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-300" />
            <CardHeader className="pb-4 relative">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 rounded-xl backdrop-blur-sm border bg-blue-500/10 border-blue-500/30">
                  <Database className="h-6 w-6 text-blue-500" />
                </div>
                <CardTitle className="text-xl font-bold">Data</CardTitle>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Import, export, and manage your data
              </p>
            </CardHeader>
          </Card>

          {/* Privacy & Security */}
          <Card className="group relative overflow-hidden border-0 bg-card/40 backdrop-blur-md hover:bg-card/60 transition-all duration-300 hover:shadow-xl hover:shadow-black/10 cursor-pointer hover:scale-[1.02]">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-300" />
            <CardHeader className="pb-4 relative">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 rounded-xl backdrop-blur-sm border bg-green-500/10 border-green-500/30">
                  <Shield className="h-6 w-6 text-green-500" />
                </div>
                <CardTitle className="text-xl font-bold">Privacy</CardTitle>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Security and privacy controls
              </p>
            </CardHeader>
          </Card>

          {/* Notifications */}
          <Card className="group relative overflow-hidden border-0 bg-card/40 backdrop-blur-md hover:bg-card/60 transition-all duration-300 hover:shadow-xl hover:shadow-black/10 cursor-pointer hover:scale-[1.02]">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-300" />
            <CardHeader className="pb-4 relative">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 rounded-xl backdrop-blur-sm border bg-yellow-500/10 border-yellow-500/30">
                  <Bell className="h-6 w-6 text-yellow-500" />
                </div>
                <CardTitle className="text-xl font-bold">Notifications</CardTitle>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Email and push notification settings
              </p>
            </CardHeader>
          </Card>

          {/* Appearance */}
          <Card className="group relative overflow-hidden border-0 bg-card/40 backdrop-blur-md hover:bg-card/60 transition-all duration-300 hover:shadow-xl hover:shadow-black/10 cursor-pointer hover:scale-[1.02]">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-300" />
            <CardHeader className="pb-4 relative">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 rounded-xl backdrop-blur-sm border bg-purple-500/10 border-purple-500/30">
                  <Palette className="h-6 w-6 text-purple-500" />
                </div>
                <CardTitle className="text-xl font-bold">Appearance</CardTitle>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Theme and display preferences
              </p>
            </CardHeader>
          </Card>

          {/* Automation */}
          <Card className="group relative overflow-hidden border-0 bg-card/40 backdrop-blur-md hover:bg-card/60 transition-all duration-300 hover:shadow-xl hover:shadow-black/10 cursor-pointer hover:scale-[1.02]">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-300" />
            <CardHeader className="pb-4 relative">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 rounded-xl backdrop-blur-sm border bg-teal-500/10 border-teal-500/30">
                  <Zap className="h-6 w-6 text-teal-500" />
                </div>
                <CardTitle className="text-xl font-bold">Automation</CardTitle>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Configure triggers and workflows
              </p>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Rel8Settings;