
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
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
import { DashboardMetrics } from "@/components/rel8t/dashboard/DashboardMetrics";
import { OutreachSection } from "@/components/rel8t/dashboard/OutreachSection";
import { ContactGrowthChart } from "@/components/rel8t/dashboard/ContactGrowthChart";
import Rel8Navigation from "@/components/rel8t/Rel8Navigation";

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
        <Rel8Navigation />

        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">REL8 Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Track and manage your professional relationships
            </p>
          </div>
          <div className="flex mt-4 md:mt-0 gap-2">
            <Button variant="outline" onClick={() => navigate("/rel8t/contacts/new")}>
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
        <DashboardMetrics 
          contactCount={contactCount}
          outreachCounts={outreachCounts}
          activeTriggerCount={activeTriggerCount}
          contactsWithoutOutreachCount={contactsWithoutOutreachCount}
          outreachProgress={outreachProgress}
          isLoading={{
            contactCount: contactCountLoading,
            outreachCounts: outreachCountsLoading,
            triggerCount: triggerCountLoading
          }}
          onContactClick={() => navigate("/rel8t/contacts")}
        />

        {/* Contact Growth Chart */}
        <div className="mb-8">
          <ContactGrowthChart />
        </div>

        {/* Outreach Section with Activity Summary Cards */}
        <OutreachSection 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          outreach={outreach}
          outreachCounts={outreachCounts}
          contactCount={contactCount}
          outreachLoading={outreachLoading}
          setOutreachDialogOpen={setOutreachDialogOpen}
        />
        
        <Button 
          variant="outline"
          className="mb-8" 
          onClick={() => navigate("/rel8t/wizard")}
        >
          Start Relationship Wizard
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
