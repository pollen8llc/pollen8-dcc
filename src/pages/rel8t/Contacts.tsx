
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import ContactList from "@/components/rel8t/ContactList";
import { getContacts } from "@/services/rel8t/contactService";
import { useDebounce } from "@/hooks/useDebounce";

const Contacts = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const { data: contacts = [], isLoading } = useQuery({
    queryKey: ["contacts", debouncedSearchQuery],
    queryFn: () => getContacts({ searchQuery: debouncedSearchQuery }),
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleAddContact = () => {
    navigate("/rel8t/contacts/new");
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
          <Button 
            onClick={handleAddContact} 
            className="mt-4 md:mt-0"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Contact
          </Button>
        </div>
        
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search contacts..."
            className="pl-10"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        
        <ContactList
          contacts={contacts}
          isLoading={isLoading}
          onRefresh={() => {}}
        />
      </div>
    </div>
  );
};

export default Contacts;
