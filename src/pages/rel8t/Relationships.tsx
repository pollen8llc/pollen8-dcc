
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getOutreachStatusCounts } from "@/services/rel8t/outreachService";
import { getContactCount, getCategories } from "@/services/rel8t/contactService";
import { Calendar, Users, PlusCircle } from "lucide-react";
import OutreachList from "@/components/rel8t/OutreachList";
import { Rel8Navigation } from "@/components/rel8t/Rel8TNavigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const Relationships = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("outreach");
  
  // Get outreach status counts with shorter staleTime
  const { data: outreachCounts = { today: 0, upcoming: 0, overdue: 0, completed: 0 } } = useQuery({
    queryKey: ["outreach-counts"],
    queryFn: getOutreachStatusCounts,
    staleTime: 1000 * 60, // 1 minute
  });
  
  // Get contact count
  const { data: contactCount = 0 } = useQuery({
    queryKey: ["contact-count"],
    queryFn: getContactCount,
  });

  // Get categories for filters
  const { data: categories = [] } = useQuery({
    queryKey: ["contact-categories"],
    queryFn: getCategories,
  });

  // Handler for creating a new relationship
  const handleCreateRelationship = () => {
    navigate("/rel8/wizard");
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <Rel8Navigation />
        
        <Breadcrumb className="mb-6 mt-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/rel8/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>Relationships</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Relationships</h1>
            <p className="text-muted-foreground mt-1">
              Manage your outreach and nurture your network
            </p>
          </div>
          
          <Button 
            onClick={handleCreateRelationship}
            className="flex items-center gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            Create Relationship Plan
          </Button>
        </div>
        
        {/* Metrics cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Calendar className="h-8 w-8 mr-3 text-primary" />
                <div className="text-2xl font-bold">{outreachCounts.today}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Calendar className="h-8 w-8 mr-3 text-primary" />
                <div className="text-2xl font-bold">{outreachCounts.upcoming}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Overdue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Calendar className="h-8 w-8 mr-3 text-destructive" />
                <div className="text-2xl font-bold">{outreachCounts.overdue}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Contacts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Users className="h-8 w-8 mr-3 text-primary" />
                <div className="text-2xl font-bold">{contactCount}</div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main content tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="mb-6">
            <TabsTrigger value="outreach">Outreach Tasks</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          
          <TabsContent value="outreach">
            <OutreachList defaultTab="today" />
          </TabsContent>
          
          <TabsContent value="completed">
            <OutreachList defaultTab="completed" showTabs={false} />
          </TabsContent>
        </Tabs>

        {/* Add empty state with CTA if no outreach tasks exist */}
        {outreachCounts.today + outreachCounts.upcoming + outreachCounts.overdue === 0 && 
          activeTab === "outreach" && (
          <div className="text-center py-8 mt-6 border border-dashed rounded-lg">
            <Calendar className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
            <h3 className="text-lg font-medium">No outreach tasks</h3>
            <p className="text-muted-foreground mt-2 mb-4">
              Create a relationship plan to start nurturing your network
            </p>
            <Button onClick={handleCreateRelationship}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Relationship Plan
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Relationships;
