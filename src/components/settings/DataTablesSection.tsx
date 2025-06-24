
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Users, Zap, Calendar, Building2, Link, Database, ExternalLink, Settings } from "lucide-react";

export function DataTablesSection() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Mock data for data tables overview
  const dataTables = [
    {
      name: "Contacts",
      description: "Your personal and professional contacts",
      count: 0,
      icon: Users,
      route: "/rel8/contacts",
      status: "active"
    },
    {
      name: "Triggers",
      description: "Automation triggers for relationship management",
      count: 0,
      icon: Zap,
      route: "/rel8/triggers",
      status: "active"
    },
    {
      name: "Outreach",
      description: "Outreach campaigns and relationship building",
      count: 0,
      icon: Calendar,
      route: "/rel8",
      status: "active"
    },
    {
      name: "Communities",
      description: "Communities you own or are part of",
      count: 0,
      icon: Building2,
      route: "/welcome",
      status: "active"
    },
    {
      name: "Invites",
      description: "Invitation codes you've created",
      count: 0,
      icon: Link,
      route: "/invites",
      status: "active"
    }
  ];

  const handleViewTable = (route: string) => {
    navigate(route);
  };

  const handleManageTable = (tableName: string) => {
    toast({
      title: "Table management",
      description: `Advanced management for ${tableName} will be implemented.`
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "inactive":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Data Tables Overview
          </CardTitle>
          <CardDescription>
            Manage and view all your data tables and records
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dataTables.map((table) => {
              const Icon = table.icon;
              return (
                <div key={table.name} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="h-5 w-5 text-primary" />
                      <h3 className="font-medium">{table.name}</h3>
                    </div>
                    <Badge className={getStatusColor(table.status)}>
                      {table.status}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    {table.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {table.count} record{table.count !== 1 ? 's' : ''}
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleViewTable(table.route)}
                      className="flex-1"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleManageTable(table.name)}
                      className="flex-1"
                    >
                      <Settings className="h-3 w-3 mr-1" />
                      Manage
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common data management tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Button variant="outline" onClick={() => navigate("/rel8/contacts/create")} className="h-16 flex-col gap-2">
              <Users className="h-5 w-5" />
              <span className="text-sm">Add Contact</span>
            </Button>
            
            <Button variant="outline" onClick={() => navigate("/rel8/triggers/wizard")} className="h-16 flex-col gap-2">
              <Zap className="h-5 w-5" />
              <span className="text-sm">Create Trigger</span>
            </Button>
            
            <Button variant="outline" onClick={() => navigate("/rel8/build-rapport")} className="h-16 flex-col gap-2">
              <Calendar className="h-5 w-5" />
              <span className="text-sm">Build Rapport</span>
            </Button>
            
            <Button variant="outline" onClick={() => navigate("/invites")} className="h-16 flex-col gap-2">
              <Link className="h-5 w-5" />
              <span className="text-sm">Create Invite</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data Health */}
      <Card>
        <CardHeader>
          <CardTitle>Data Health</CardTitle>
          <CardDescription>
            Overview of your data quality and completeness
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Profile Completeness</span>
              <Badge variant="secondary">85%</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Contact Data Quality</span>
              <Badge variant="secondary">Good</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Active Triggers</span>
              <Badge variant="secondary">0</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Last Data Backup</span>
              <Badge variant="outline">Never</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
