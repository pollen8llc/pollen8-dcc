
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { MetricCard } from "@/components/rel8t/MetricCard";
import { Users, AlertCircle, Zap, TrendingUp } from "lucide-react";
import Navbar from "@/components/Navbar";
import { 
  getContactCount
} from "@/services/rel8t/contactService";
import {
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
import { Rel8TNavigation } from "@/components/rel8t/Rel8TNavigation";
import { OutreachSection } from "@/components/rel8t/dashboard/OutreachSection";
import { ContactGrowthChart } from "@/components/rel8t/dashboard/ContactGrowthChart";

const Dashboard = () => {
  const navigate = useNavigate();
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
        <Rel8TNavigation />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 mt-6">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Track and manage your professional relationships
            </p>
          </div>
          <div className="flex mt-4 md:mt-0 gap-2">
            <Button variant="outline" onClick={() => navigate("/rel8t/contacts")}>
              <Users className="mr-2 h-4 w-4" />
              View Contacts
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
            description={contactCountLoading ? undefined : `${contactCount} People in your network`}
            icon={<Users className="h-5 w-5" />}
            progress={75}
            isLoading={contactCountLoading}
            onActionClick={() => navigate("/rel8t/contacts")}
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
            onActionClick={() => navigate("/rel8t/settings")}
          />
          
          <MetricCard
            title="Network Growth"
            value={"+5"}
            description="Last 30 days"
            icon={<TrendingUp className="h-5 w-5" />}
            color="success"
          />
        </div>
        
        {/* Contact Growth Chart */}
        <div className="mb-8">
          <h2 className="text-xl font-medium mb-4">Contact Growth</h2>
          <div className="bg-card rounded-lg border shadow-sm p-4">
            <ContactGrowthChart />
          </div>
        </div>

        {/* Outreach Section */}
        <OutreachSection />
        
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
