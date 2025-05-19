
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import ContactList from "@/components/rel8t/ContactList";
import { ChevronLeft, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Rel8Navigation } from "@/components/rel8t/Rel8TNavigation";

const Contacts = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleEditContact = (contact: any) => {
    navigate(`/rel8/contacts/${contact.id}/edit`);
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["contacts"] });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="mr-2" 
            onClick={() => navigate("/rel8/dashboard")}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Dashboard
          </Button>
        </div>

        <Rel8Navigation />

        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 mt-6">
          <div>
            <h1 className="text-3xl font-bold">Contacts</h1>
            <p className="text-muted-foreground">Manage your professional network</p>
          </div>
          
          <Button 
            onClick={() => navigate("/rel8/contacts/new")}
            className="flex items-center gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            New Contact
          </Button>
        </div>

        <ContactList
          onEdit={handleEditContact}
          onRefresh={handleRefresh}
        />
      </div>
    </div>
  );
};

export default Contacts;
