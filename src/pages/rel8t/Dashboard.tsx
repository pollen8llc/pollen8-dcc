
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { MetricCard } from "@/components/rel8t/MetricCard";
import { OutreachCard } from "@/components/rel8t/OutreachCard";
import { Users, AlertCircle, UserCheck, Zap, Calendar } from "lucide-react";
import Navbar from "@/components/Navbar";
import { 
  getContactCount
} from "@/services/rel8t/contactService";
import {
  getOutreach,
  getOutreachStatusCounts
} from "@/services/rel8t/outreachService";
import {
  getActiveTriggerCount
} from "@/services/rel8t/triggerService";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ContactWizard from "@/components/rel8t/ContactWizard";
import OutreachForm from "@/components/rel8t/OutreachForm";
import { createOutreach } from "@/services/rel8t/outreachService";
import { useNavigate } from "react-router-dom";
import { DistributionChart } from "@/components/rel8t/DistributionChart";
import { StatisticsChart } from "@/components/rel8t/StatisticsChart";
import OutreachList from "@/components/rel8t/OutreachList";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"today" | "upcoming" | "overdue" | "completed">("today");
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [outreachDialogOpen, setOutreachDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRelationships, setShowRelationships] = useState(false);

  // Get metrics data
  const { data: contactCount = 0, isLoading: contactCountLoading } = useQuery({
    queryKey: ["contact-count"],
    queryFn: getContactCount,
  });

  const { data: outreachCounts = { today: 0, upcoming: 0, overdue: 0, completed: 0 }, isLoading: outreachCountsLoading } = useQuery({
    queryKey: ["outreach-counts"],
    queryFn: getOutreachStatusCounts,
  });

  const { data: activeTriggerCount = 0, isLoading: triggerCountLoading } = useQuery({
    queryKey: ["trigger-count"],
    queryFn: getActiveTriggerCount,
  });

  // Get outreach data based on active tab
  const { data: outreach = [], isLoading: outreachLoading } = useQuery({
    queryKey: ["outreach", activeTab],
    queryFn: () => getOutreach(activeTab),
  });

  const handleCreateOutreach = async (values: any) => {
    setIsSubmitting(true);
    try {
      await createOutreach(
        {
          title: values.title,
          description: values.description,
          priority: values.priority,
          due_date: values.due_date.toISOString(),
        },
        values.contactIds
      );
      setOutreachDialogOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate dynamic progress values
  const contactsWithoutOutreachCount = 
    Math.max(0, Number(contactCount) - 
      (Number(outreachCounts.today) + 
       Number(outreachCounts.upcoming) + 
       Number(outreachCounts.overdue) + 
       Number(outreachCounts.completed)));
  
  const outreachProgress = Number(contactCount) > 0 
    ? Math.min(100, 100 - Math.round((Number(contactsWithoutOutreachCount) / Number(contactCount)) * 100))
    : 0;

  // Sample data for charts
  const distributionData = [
    { name: "Today", value: outreachCounts.today, color: "#4338ca" },
    { name: "Upcoming", value: outreachCounts.upcoming, color: "#3b82f6" },
    { name: "Overdue", value: outreachCounts.overdue, color: "#ef4444" },
    { name: "Completed", value: outreachCounts.completed, color: "#10b981" },
  ];

  const statisticsData = [
    { name: "Mon", value: 4 },
    { name: "Tue", value: 7 },
    { name: "Wed", value: 5 },
    { name: "Thu", value: 8 },
    { name: "Fri", value: 12 },
    { name: "Sat", value: 3 },
    { name: "Sun", value: 1 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6">
        {/* Sleek translucent breadcrumb */}
        <Breadcrumb className="mb-4 p-2 rounded-md bg-cyan-500/10 backdrop-blur-sm border border-cyan-200/20 shadow-sm">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="text-cyan-700 hover:text-cyan-900">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href="/rel8t" className="text-cyan-700 hover:text-cyan-900">REL8T</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">REL8 Dashboard</h1>
            <p className="text-muted-foreground text-sm">
              Track and manage your professional relationships
            </p>
          </div>
          <div className="flex mt-4 md:mt-0 gap-2">
            <Button variant="outline" onClick={() => setContactDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Contact
            </Button>
            <Button onClick={() => setOutreachDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Build a Relationship
            </Button>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <MetricCard
            title="Total Contacts"
            value={contactCountLoading ? "-" : contactCount}
            description={contactCountLoading ? undefined : `${contactCount} People in your network`}
            icon={<Users className="h-5 w-5" />}
            progress={75}
            isLoading={contactCountLoading}
            onActionClick={() => navigate("/rel8t/contacts")}
          />
          
          <MetricCard
            title="Today's Outreach"
            value={outreachCountsLoading ? "-" : outreachCounts.today}
            description="Due today"
            icon={<Calendar className="h-5 w-5" />}
            color={outreachCounts.today > 0 ? "warning" : "default"}
            isLoading={outreachCountsLoading}
          />
          
          <MetricCard
            title="Inactive Contacts"
            value={contactsWithoutOutreachCount}
            description={contactsWithoutOutreachCount === 1 ? "needs connection" : "need connections"}
            icon={<AlertCircle className="h-5 w-5" />}
            color={contactsWithoutOutreachCount > 0 ? "warning" : "success"}
            progress={outreachProgress}
            isLoading={outreachCountsLoading || contactCountLoading}
          />
          
          <MetricCard
            title="Active Triggers"
            value={triggerCountLoading ? "-" : activeTriggerCount}
            description="Automation rules"
            icon={<Zap className="h-5 w-5" />}
            isLoading={triggerCountLoading}
          />
        </div>
        
        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="outreach" onValueChange={(value) => setShowRelationships(value === "relationships")}>
          <TabsList className="mb-4">
            <TabsTrigger value="outreach">Outreach Tasks</TabsTrigger>
            <TabsTrigger value="relationships">Relationship Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="outreach">
            {/* Outreach Section */}
            <h2 className="text-lg font-medium mb-4">Relationship Management</h2>
            <Tabs 
              value={activeTab} 
              onValueChange={(value) => setActiveTab(value as "today" | "upcoming" | "overdue" | "completed")} 
              className="mb-6"
            >
              <TabsList className="mb-4">
                <TabsTrigger value="today" className="relative">
                  Today
                  {outreachCounts.today > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-[18px] h-[18px] rounded-full bg-primary text-[10px] text-primary-foreground px-1">
                      {outreachCounts.today}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="upcoming" className="relative">
                  Upcoming
                  {outreachCounts.upcoming > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-[18px] h-[18px] rounded-full bg-blue-600 text-[10px] text-white px-1">
                      {outreachCounts.upcoming}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="overdue" className="relative">
                  Needs Attention
                  {outreachCounts.overdue > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-[18px] h-[18px] rounded-full bg-red-600 text-[10px] text-white px-1">
                      {outreachCounts.overdue}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="completed">
                  Completed
                </TabsTrigger>
              </TabsList>
              
              <OutreachList defaultTab={activeTab} showTabs={false} />
            </Tabs>
          </TabsContent>
          
          <TabsContent value="relationships">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <DistributionChart 
                data={distributionData}
                title="Contact Distribution"
              />
              
              <StatisticsChart 
                data={statisticsData}
                title="Outreach Statistics"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4">Recent Completed Outreach</h3>
              <OutreachList defaultTab="completed" showTabs={false} limit={5} />
            </div>
          </TabsContent>
        </Tabs>

        {/* Dialogs */}
        <Dialog open={contactDialogOpen} onOpenChange={setContactDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Manage Contacts</DialogTitle>
            </DialogHeader>
            <ContactWizard 
              onClose={() => setContactDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>

        <Dialog open={outreachDialogOpen} onOpenChange={setOutreachDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Build a Relationship</DialogTitle>
            </DialogHeader>
            <OutreachForm
              onSubmit={handleCreateOutreach}
              onCancel={() => setOutreachDialogOpen(false)}
              isSubmitting={isSubmitting}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Dashboard;
