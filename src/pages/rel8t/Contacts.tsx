
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import ContactList from "@/components/rel8t/ContactList";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Rel8OnlyNavigation } from "@/components/rel8t/Rel8OnlyNavigation";
import { getContacts } from "@/services/rel8t/contactService";

const Contacts = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch contacts
  const { data: contacts = [], isLoading } = useQuery({
    queryKey: ["contacts"],
    queryFn: getContacts,
  });

  const handleEditContact = (contact: any) => {
    navigate(`/rel8/contacts/${contact.id}/edit`);
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["contacts"] });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <Rel8OnlyNavigation />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 sm:mb-6 mt-4 sm:mt-6">
          <div className="w-full sm:w-auto">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Contacts</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Manage your professional network</p>
          </div>
          
          <Button 
            onClick={() => navigate("/rel8/contacts/new")}
            className="flex items-center gap-2 w-full sm:w-auto"
            size="sm"
          >
            <PlusCircle className="h-4 w-4" />
            <span className="sm:inline">New Contact</span>
          </Button>
        </div>

        <ContactList
          contacts={contacts}
          isLoading={isLoading}
          onEdit={handleEditContact}
          onRefresh={handleRefresh}
        />
      </div>
    </div>
  );
};

export default Contacts;
