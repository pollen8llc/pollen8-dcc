
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import ContactList from "@/components/rel8t/ContactList";
import { PlusCircle, Trash2, Edit, CheckSquare, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Rel8OnlyNavigation } from "@/components/rel8t/Rel8OnlyNavigation";
import { getContacts, deleteMultipleContacts } from "@/services/rel8t/contactService";
import { toast } from "@/hooks/use-toast";

const Contacts = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  // Fetch contacts
  const { data: contacts = [], isLoading } = useQuery({
    queryKey: ["contacts"],
    queryFn: () => getContacts(),
  });

  const handleEditContact = (contact: any) => {
    navigate(`/rel8/contacts/${contact.id}/edit`);
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["contacts"] });
  };

  const handleContactSelect = (contactId: string, selected: boolean) => {
    if (selected) {
      setSelectedContacts(prev => [...prev, contactId]);
    } else {
      setSelectedContacts(prev => prev.filter(id => id !== contactId));
    }
  };

  const handleSelectAll = () => {
    if (selectedContacts.length === contacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(contacts.map(contact => contact.id));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedContacts.length === 0) return;
    
    if (confirm(`Are you sure you want to delete ${selectedContacts.length} contact(s)?`)) {
      try {
        await deleteMultipleContacts(selectedContacts);
        toast({
          title: "Contacts deleted",
          description: `Successfully deleted ${selectedContacts.length} contact(s)`,
        });
        setSelectedContacts([]);
        setIsSelectionMode(false);
        handleRefresh();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete contacts",
          variant: "destructive",
        });
      }
    }
  };

  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    setSelectedContacts([]);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <Rel8OnlyNavigation />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 sm:mb-6 mt-4 sm:mt-6">
          <div className="w-full sm:w-auto">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Contacts</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Manage your professional network
              {selectedContacts.length > 0 && (
                <span className="ml-2 text-primary">
                  ({selectedContacts.length} selected)
                </span>
              )}
            </p>
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {isSelectionMode ? (
              <>
                <Button
                  variant="outline"
                  onClick={handleSelectAll}
                  className="flex items-center gap-2"
                  size="sm"
                >
                  {selectedContacts.length === contacts.length ? (
                    <CheckSquare className="h-4 w-4" />
                  ) : (
                    <Square className="h-4 w-4" />
                  )}
                  <span className="hidden sm:inline">
                    {selectedContacts.length === contacts.length ? "Deselect All" : "Select All"}
                  </span>
                </Button>
                
                {selectedContacts.length > 0 && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => {
                        // For now, just edit the first selected contact
                        const firstContact = contacts.find(c => c.id === selectedContacts[0]);
                        if (firstContact) handleEditContact(firstContact);
                      }}
                      className="flex items-center gap-2"
                      size="sm"
                    >
                      <Edit className="h-4 w-4" />
                      <span className="hidden sm:inline">Edit</span>
                    </Button>
                    
                    <Button
                      variant="destructive"
                      onClick={handleBulkDelete}
                      className="flex items-center gap-2"
                      size="sm"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="hidden sm:inline">Delete ({selectedContacts.length})</span>
                    </Button>
                  </>
                )}
                
                <Button
                  variant="outline"
                  onClick={toggleSelectionMode}
                  size="sm"
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={toggleSelectionMode}
                  className="flex items-center gap-2"
                  size="sm"
                >
                  <CheckSquare className="h-4 w-4" />
                  <span className="hidden sm:inline">Select</span>
                </Button>
                
                <Button 
                  onClick={() => navigate("/rel8/contacts/new")}
                  className="flex items-center gap-2 w-full sm:w-auto"
                  size="sm"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span className="sm:inline">New Contact</span>
                </Button>
              </>
            )}
          </div>
        </div>

        <ContactList
          contacts={contacts}
          isLoading={isLoading}
          onEdit={handleEditContact}
          onRefresh={handleRefresh}
          onContactSelect={isSelectionMode ? handleContactSelect : undefined}
          selectedContacts={selectedContacts}
          isSelectionMode={isSelectionMode}
        />
      </div>
    </div>
  );
};

export default Contacts;
