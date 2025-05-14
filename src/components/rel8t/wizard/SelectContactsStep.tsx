
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getContacts } from "@/services/rel8t/contactService";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ContactForm } from "@/components/rel8t/ContactForm";

interface SelectContactsStepProps {
  onNext: (selectedContacts: string[]) => void;
  onBack?: () => void;
  initialSelected?: string[];
}

const SelectContactsStep: React.FC<SelectContactsStepProps> = ({
  onNext,
  onBack,
  initialSelected = []
}) => {
  const [selectedContacts, setSelectedContacts] = useState<string[]>(initialSelected);
  const [searchQuery, setSearchQuery] = useState("");
  const [createNew, setCreateNew] = useState(false);
  
  const { data: contacts = [], isLoading } = useQuery({
    queryKey: ["contacts"],
    queryFn: () => getContacts(),
  });
  
  const filteredContacts = contacts.filter(
    contact => contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleSelectContact = (contactId: string) => {
    if (selectedContacts.includes(contactId)) {
      setSelectedContacts(selectedContacts.filter(id => id !== contactId));
    } else {
      setSelectedContacts([...selectedContacts, contactId]);
    }
  };
  
  const handleSelectAll = () => {
    if (selectedContacts.length === filteredContacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(filteredContacts.map(contact => contact.id));
    }
  };
  
  const handleContactCreated = (contactId: string) => {
    setSelectedContacts([...selectedContacts, contactId]);
    setCreateNew(false);
  };
  
  if (createNew) {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-4">Add New Contact</h2>
        <ContactForm 
          onCancel={() => setCreateNew(false)}
          onSubmit={(data) => {
            // Here we'd normally create the contact and then call handleContactCreated
            // For now we'll just fake it with a random ID
            const fakeNewId = `new-${Math.floor(Math.random() * 1000)}`;
            handleContactCreated(fakeNewId);
          }}
        />
      </div>
    );
  }
  
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Select Contacts</h2>
      
      <RadioGroup defaultValue="existing" className="mb-4">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="existing" id="existing" checked={!createNew} onChange={() => setCreateNew(false)} />
          <Label htmlFor="existing">Select existing contacts</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="new" id="new" checked={createNew} onChange={() => setCreateNew(true)} />
          <Label htmlFor="new">Create new contact</Label>
        </div>
      </RadioGroup>
      
      <div className="relative mb-4">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search contacts..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : filteredContacts.length === 0 ? (
        <div className="text-center py-8 border border-dashed rounded-lg">
          <p className="text-muted-foreground">No contacts found</p>
          <Button onClick={() => setCreateNew(true)} variant="outline" className="mt-2">
            Create New Contact
          </Button>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleSelectAll}
              className="text-xs"
            >
              {selectedContacts.length === filteredContacts.length ? "Deselect all" : "Select all"}
            </Button>
            <span className="text-xs text-muted-foreground">
              {selectedContacts.length} selected
            </span>
          </div>
          
          <ScrollArea className="h-[300px] border rounded-md">
            <div className="p-4 space-y-2">
              {filteredContacts.map((contact) => (
                <div 
                  key={contact.id}
                  className={`flex items-center space-x-2 p-2 rounded ${
                    selectedContacts.includes(contact.id) ? "bg-muted" : ""
                  }`}
                  onClick={() => handleSelectContact(contact.id)}
                >
                  <Checkbox 
                    checked={selectedContacts.includes(contact.id)}
                    onCheckedChange={() => handleSelectContact(contact.id)}
                    id={`contact-${contact.id}`}
                  />
                  <div className="flex-1">
                    <Label 
                      htmlFor={`contact-${contact.id}`}
                      className="font-medium cursor-pointer"
                    >
                      {contact.name}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {contact.email}
                      {contact.organization ? ` • ${contact.organization}` : ""}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </>
      )}
      
      <div className="flex justify-between mt-6">
        {onBack && (
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
        )}
        <Button 
          onClick={() => onNext(selectedContacts)}
          disabled={selectedContacts.length === 0}
          className={!onBack ? "ml-auto" : ""}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default SelectContactsStep;
