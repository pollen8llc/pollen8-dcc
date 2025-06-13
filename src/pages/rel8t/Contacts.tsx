
import React, { useState } from "react";
import { Plus, Users, Filter, Search, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import ContactList from "@/components/rel8t/ContactList";
import { Rel8OnlyNavigation } from "@/components/rel8t/Rel8OnlyNavigation";
import { Shell } from "@/components/layout/Shell";
import { getContacts, getContactCount, getCategories } from "@/services/rel8t/contactService";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const Contacts = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Fetch contacts with search
  const { data: contacts = [], isLoading: contactsLoading, refetch } = useQuery({
    queryKey: ["contacts", searchTerm],
    queryFn: () => getContacts({ searchQuery: searchTerm }),
  });

  // Get contact count
  const { data: contactCount = 0 } = useQuery({
    queryKey: ["contact-count"],
    queryFn: getContactCount,
  });

  // Get categories
  const { data: categories = [] } = useQuery({
    queryKey: ["contact-categories"],
    queryFn: getCategories,
  });

  // Filter contacts by category
  const filteredContacts = selectedCategory 
    ? contacts.filter(contact => contact.category?.id === selectedCategory)
    : contacts;

  // Calculate stats
  const activeContacts = contacts.length;
  const pendingContacts = 0; // Would need to be defined based on business logic
  const categoryCount = categories.length;

  const handleEditContact = (contact: any) => {
    navigate(`/rel8/contacts/${contact.id}/edit`);
  };

  const handleAddContact = () => {
    navigate("/rel8/contacts/create");
  };

  return (
    <Shell>
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <Rel8OnlyNavigation />
        
        <Breadcrumb className="mb-4 sm:mb-6 mt-2 sm:mt-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/rel8">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>Contacts</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col gap-4 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="w-full sm:w-auto">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Contacts</h1>
              <p className="text-sm sm:text-base text-muted-foreground mt-1">
                Manage your professional network
              </p>
            </div>

            <Button 
              onClick={handleAddContact}
              className="flex items-center gap-2 w-full sm:w-auto"
              size="sm"
            >
              <Plus className="h-4 w-4" />
              <span className="sm:inline">Add Contact</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 sm:mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Contacts</p>
                <p className="text-2xl font-bold">{contactCount}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">{activeContacts}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Categories</p>
                <p className="text-2xl font-bold">{categoryCount}</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
            >
              All
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        <ContactList 
          contacts={filteredContacts}
          isLoading={contactsLoading}
          onEdit={handleEditContact}
          onRefresh={refetch}
        />

        {/* Empty state */}
        {!contactsLoading && filteredContacts.length === 0 && (
          <div className="text-center py-8 mt-6 border border-dashed rounded-lg">
            <Users className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
            <h3 className="text-lg font-medium">
              {searchTerm || selectedCategory ? 'No contacts found' : 'No contacts yet'}
            </h3>
            <p className="text-muted-foreground mt-2 mb-4">
              {searchTerm || selectedCategory 
                ? 'Try adjusting your search or filters'
                : 'Start building your network by adding your first contact'
              }
            </p>
            {!searchTerm && !selectedCategory && (
              <Button onClick={handleAddContact}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Contact
              </Button>
            )}
          </div>
        )}
      </div>
    </Shell>
  );
};

export default Contacts;
