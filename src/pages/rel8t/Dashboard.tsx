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
import ContactForm from "@/components/rel8t/ContactForm";
import OutreachForm from "@/components/rel8t/OutreachForm";
import { createContact } from "@/services/rel8t/contactService";
import { createOutreach } from "@/services/rel8t/outreachService";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("today");
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [outreachDialogOpen, setOutreachDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleCreateContact = async (values: any) => {
    setIsSubmitting(true);
    try {
      await createContact(values);
      setContactDialogOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">REL8T Dashboard</h1>
            <p className="text-muted-foreground mt-1">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MetricCard
            title="Total Contacts"
            value={contactCountLoading ? "-" : contactCount}
            icon={<Users className="h-5 w-5" />}
            progress={75}
            isLoading={contactCountLoading}
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

        {/* Outreach Section */}
        <h2 className="text-xl font-medium mb-4">Relationship Management</h2>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
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
          
          <TabsContent value="today">
            {outreachLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : outreach.length === 0 ? (
              <div className="text-center py-12 border border-dashed rounded-lg">
                <Calendar className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-2 font-semibold">No outreach for today</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  You don't have any relationship outreach scheduled for today.
                </p>
                <Button onClick={() => setOutreachDialogOpen(true)} className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Build a Relationship
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {outreach.map((item) => (
                  <OutreachCard key={item.id} outreach={item} />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="upcoming">
            {outreachLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : outreach.length === 0 ? (
              <div className="text-center py-12 border border-dashed rounded-lg">
                <Calendar className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-2 font-semibold">No upcoming outreach</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  You don't have any upcoming relationship outreach scheduled.
                </p>
                <Button onClick={() => setOutreachDialogOpen(true)} className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Build a Relationship
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {outreach.map((item) => (
                  <OutreachCard key={item.id} outreach={item} />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="overdue">
            {outreachLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : outreach.length === 0 ? (
              <div className="text-center py-12 border border-dashed rounded-lg">
                <UserCheck className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-2 font-semibold">No overdue outreach</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  You're all caught up with your relationships!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {outreach.map((item) => (
                  <OutreachCard key={item.id} outreach={item} />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="completed">
            {outreachLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : outreach.length === 0 ? (
              <div className="text-center py-12 border border-dashed rounded-lg">
                <Calendar className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-2 font-semibold">No completed outreach</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  You haven't completed any relationship outreach yet.
                </p>
                <Button onClick={() => setOutreachDialogOpen(true)} className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Build a Relationship
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {outreach.map((item) => (
                  <OutreachCard key={item.id} outreach={item} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <Button 
          variant="outline"
          className="mb-8" 
          onClick={() => navigate("/rel8t/relationships")}
        >
          View All Relationship Management
        </Button>

        {/* Dialogs */}
        <Dialog open={contactDialogOpen} onOpenChange={setContactDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Contact</DialogTitle>
            </DialogHeader>
            <ContactForm
              onSubmit={handleCreateContact}
              onCancel={() => setContactDialogOpen(false)}
              isSubmitting={isSubmitting}
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
