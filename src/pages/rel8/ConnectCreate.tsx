import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, UserPlus } from "lucide-react";
import { Rel8OnlyNavigation } from "@/components/rel8t/Rel8OnlyNavigation";
import ContactCreateWizard from "@/components/rel8t/ContactCreateWizard";
import { createContact } from "@/services/rel8t/contactService";
import { toast } from "@/hooks/use-toast";

const ConnectCreate = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Create contact mutation
  const createMutation = useMutation({
    mutationFn: async (values: any) => {
      return await createContact(values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      toast({
        title: "Contact created",
        description: "New contact has been successfully created.",
      });
      navigate("/rel8/contacts");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create contact.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (values: any) => {
    createMutation.mutate(values);
  };

  const handleCancel = () => {
    navigate("/rel8/connect");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Navbar />
      
      <div className="container mx-auto max-w-6xl px-4 py-8 pb-32">
        <div className="flex items-center gap-3 mb-6 mt-6">
          <UserPlus className="h-6 w-6 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">
              Add a new contact to your network
            </p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto bg-card/40 backdrop-blur-md border border-border/50 rounded-2xl shadow-xl p-8">
          <ContactCreateWizard
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={createMutation.isPending}
          />
        </div>
      </div>

      {/* Sticky Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pt-2 bg-gradient-to-t from-background via-background to-transparent pointer-events-none">
        <div className="container mx-auto max-w-6xl pointer-events-auto">
          <Rel8OnlyNavigation />
        </div>
      </div>
    </div>
  );
};

export default ConnectCreate;
