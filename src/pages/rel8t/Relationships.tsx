
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getOutreachStatusCounts } from "@/services/rel8t/outreachService";
import { getContactCount } from "@/services/rel8t/contactService";
import { Calendar, Users, PlusCircle, Filter } from "lucide-react";
import OutreachList from "@/components/rel8t/OutreachList";
import { Rel8Navigation } from "@/components/rel8t/Rel8TNavigation";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Relationships = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("today");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("due_date");
  
  // Get outreach status counts
  const { data: outreachCounts = { today: 0, upcoming: 0, overdue: 0, completed: 0 }, 
          isLoading: countsLoading } = useQuery({
    queryKey: ["outreach-counts"],
    queryFn: getOutreachStatusCounts,
  });
  
  // Get contact count
  const { data: contactCount = 0 } = useQuery({
    queryKey: ["contact-count"],
    queryFn: getContactCount,
  });
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <Rel8Navigation />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 mt-6">
          <div>
            <h1 className="text-3xl font-bold">Relationship Activities</h1>
            <p className="text-muted-foreground mt-1">
              Manage your outreach activities and nurture your professional relationships
            </p>
          </div>
          <div className="flex mt-4 md:mt-0 gap-2">
            <Button variant="outline" onClick={() => navigate("/rel8/contacts")}>
              <Users className="mr-2 h-4 w-4" />
              View Contacts
            </Button>
            <Button onClick={() => navigate("/rel8/wizard")}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Activity
            </Button>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Due Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Calendar className="h-8 w-8 mr-3 text-primary" />
                <div className="text-2xl font-bold">{countsLoading ? "-" : outreachCounts.today}</div>
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
                <div className="text-2xl font-bold">{countsLoading ? "-" : outreachCounts.upcoming}</div>
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
                <div className="text-2xl font-bold">{countsLoading ? "-" : outreachCounts.overdue}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Contacts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Users className="h-8 w-8 mr-3 text-primary" />
                <div className="text-2xl font-bold">{contactCount}</div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Search and filter */}
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <div className="relative flex-grow">
            <Input
              placeholder="Search activities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="due_date">Due Date</SelectItem>
              <SelectItem value="priority">Priority</SelectItem>
              <SelectItem value="created_at">Date Created</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Main content tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="mb-6">
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="overdue">Needs Attention</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="all">All Activities</TabsTrigger>
          </TabsList>
          
          <TabsContent value="today">
            <OutreachList defaultTab="today" searchQuery={searchQuery} sortBy={sortBy} />
          </TabsContent>
          
          <TabsContent value="upcoming">
            <OutreachList defaultTab="upcoming" searchQuery={searchQuery} sortBy={sortBy} />
          </TabsContent>
          
          <TabsContent value="overdue">
            <OutreachList defaultTab="overdue" searchQuery={searchQuery} sortBy={sortBy} />
          </TabsContent>
          
          <TabsContent value="completed">
            <OutreachList defaultTab="completed" searchQuery={searchQuery} sortBy={sortBy} showTabs={false} />
          </TabsContent>
          
          <TabsContent value="all">
            <OutreachList defaultTab="all" searchQuery={searchQuery} sortBy={sortBy} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Relationships;
