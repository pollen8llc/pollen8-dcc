
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ContactWizard from "@/components/rel8t/ContactWizard";
import OutreachForm from "@/components/rel8t/OutreachForm";
import { createOutreach } from "@/services/rel8t/outreachService";
import { DashboardMetrics } from "@/components/rel8t/dashboard/DashboardMetrics";
import { OutreachSection } from "@/components/rel8t/dashboard/OutreachSection";
import { RelationshipAnalytics } from "@/components/rel8t/dashboard/RelationshipAnalytics";
import { DashboardHeader } from "@/components/rel8t/dashboard/DashboardHeader";
import { DashboardBreadcrumb } from "@/components/rel8t/dashboard/DashboardBreadcrumb";

const Dashboard = () => {
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [outreachDialogOpen, setOutreachDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRelationships, setShowRelationships] = useState(false);

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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6">
        <DashboardBreadcrumb />

        <DashboardHeader 
          onAddContact={() => setContactDialogOpen(true)}
          onAddOutreach={() => setOutreachDialogOpen(true)}
        />

        <DashboardMetrics />
        
        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="outreach" onValueChange={(value) => setShowRelationships(value === "relationships")}>
          <TabsList className="mb-4">
            <TabsTrigger value="outreach">Outreach Tasks</TabsTrigger>
            <TabsTrigger value="relationships">Relationship Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="outreach">
            <OutreachSection />
          </TabsContent>
          
          <TabsContent value="relationships">
            <RelationshipAnalytics />
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
