
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Upload } from "lucide-react";
import Navbar from "@/components/Navbar";
import ContactList from "@/components/rel8t/ContactList";
import { getContacts, Contact } from "@/services/rel8t/contactService";
import { useDebounce } from "@/hooks/useDebounce";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImportContactsStep } from "@/components/rel8t/wizard/ImportContactsStep";

const Contacts = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [activeTab, setActiveTab] = useState("contacts");

  const { data: contacts = [], isLoading, refetch } = useQuery({
    queryKey: ["contacts", debouncedSearchQuery],
    queryFn: () => getContacts({ searchQuery: debouncedSearchQuery }),
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleAddContact = () => {
    navigate("/rel8t/contacts/new");
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleEditContact = (contact: Contact) => {
    navigate(`/rel8t/contacts/${contact.id}`);
  };

  const handleImportComplete = (importedContacts: Contact[]) => {
    refetch();
    setActiveTab("contacts");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Contacts</h1>
            <p className="text-muted-foreground mt-1">
              Manage your relationship network
            </p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <Button 
              variant="outline"
              onClick={() => setActiveTab("import")}
              className="flex items-center gap-2 border-border/40"
            >
              <Upload className="h-4 w-4" />
              Import
            </Button>
            <Button 
              onClick={handleAddContact}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Contact
            </Button>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="mb-4 border-border/40">
            <TabsTrigger value="contacts">Contacts</TabsTrigger>
            <TabsTrigger value="import">Import</TabsTrigger>
          </TabsList>
          
          <TabsContent value="contacts">
           
            
            <ContactList
              contacts={contacts}
              isLoading={isLoading}
              onRefresh={handleRefresh}
              onAddContact={handleAddContact}
              onEdit={handleEditContact}
            />
          </TabsContent>
          
          <TabsContent value="import">
            <ImportContactsStep onImportComplete={handleImportComplete} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Contacts;
