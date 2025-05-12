
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import ContactForm from "@/components/rel8t/ContactForm";
import { createContact } from "@/services/rel8t/contactService";
import { toast } from "@/hooks/use-toast";

const ContactCreate = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Create contact mutation
  const createMutation = useMutation({
    mutationFn: (values: any) => createContact(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      toast({
        title: "Contact created",
        description: "New contact has been successfully created.",
      });
      navigate("/rel8t/contacts");
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
    navigate("/rel8t/contacts");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/rel8t/contacts")}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Create New Contact</h1>
            <p className="text-muted-foreground">Add a new contact to your network</p>
          </div>
        </div>

        <div className="bg-card rounded-lg border p-6">
          <ContactForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={createMutation.isPending}
          />
        </div>
      </div>
    </div>
  );
};

export default ContactCreate;
