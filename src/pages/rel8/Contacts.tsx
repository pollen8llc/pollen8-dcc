import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import ContactList from "@/components/rel8t/ContactList";
import { Heart, Trash2, Edit, CheckSquare, Square, Search, Filter, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import Navbar from "@/components/Navbar";
import { Rel8OnlyNavigation } from "@/components/rel8t/Rel8OnlyNavigation";
import { getContacts, deleteMultipleContacts, getCategories } from "@/services/rel8t/contactService";
import { toast } from "@/hooks/use-toast";

const Contacts = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedTag, setSelectedTag] = useState<string>("all");

  // Fetch contacts
  const { data: contacts = [], isLoading } = useQuery({
    queryKey: ["contacts"],
    queryFn: () => getContacts(),
  });

  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });

  // Get unique tags from all contacts
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    contacts.forEach(contact => {
      if (contact.tags && Array.isArray(contact.tags)) {
        contact.tags.forEach(tag => tagSet.add(tag));
      }
    });
    return Array.from(tagSet).sort();
  }, [contacts]);

  // Filter contacts based on search query, category, and tags
  const filteredContacts = useMemo(() => {
    let filtered = contacts;
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(contact => 
        contact.name?.toLowerCase().includes(query) ||
        contact.email?.toLowerCase().includes(query) ||
        contact.organization?.toLowerCase().includes(query) ||
        contact.role?.toLowerCase().includes(query)
      );
    }
    
    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(contact => contact.category?.id === selectedCategory);
    }
    
    // Filter by tag
    if (selectedTag !== "all") {
      filtered = filtered.filter(contact => 
        contact.tags && Array.isArray(contact.tags) && contact.tags.includes(selectedTag)
      );
    }
    
    return filtered;
  }, [contacts, searchQuery, selectedCategory, selectedTag]);

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
    if (selectedContacts.length === filteredContacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(filteredContacts.map(contact => contact.id));
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

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedTag("all");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Navbar />
      
      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Navigation Component */}
        <Rel8OnlyNavigation />
        
        {/* Minimal Header */}
        <div className="flex items-center gap-3 mb-6 mt-6">
          <Users className="h-7 w-7 text-primary" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Contacts</h1>
            <p className="text-sm text-muted-foreground">
              Manage your network and relationships
            </p>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center gap-2 mb-6">
          {isSelectionMode ? (
            <>
              <Button
                variant="outline"
                onClick={handleSelectAll}
                className="flex items-center gap-2"
                size="sm"
              >
                {selectedContacts.length === filteredContacts.length ? (
                  <CheckSquare className="h-4 w-4" />
                ) : (
                  <Square className="h-4 w-4" />
                )}
                <span className="hidden sm:inline">
                  {selectedContacts.length === filteredContacts.length ? "Deselect All" : "Select All"}
                </span>
              </Button>
              
              {selectedContacts.length > 0 && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => {
                      const firstContact = filteredContacts.find(c => c.id === selectedContacts[0]);
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
                onClick={() => navigate("/rel8/build-rapport")}
                className="flex items-center gap-2"
                size="sm"
              >
                <Heart className="h-4 w-4" />
                <span className="sm:inline">Build Rapport</span>
              </Button>
            </>
          )}
        </div>

        {/* Search and Filter Controls */}
        <div className="space-y-4 mb-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search contacts by name, email, organization..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex items-center gap-2 flex-1">
              <Filter className="h-4 w-4 text-muted-foreground" />
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedTag} onValueChange={setSelectedTag}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="All Tags" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tags</SelectItem>
                  {allTags.map((tag) => (
                    <SelectItem key={tag} value={tag}>
                      {tag}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {(searchQuery || selectedCategory !== "all" || selectedTag !== "all") && (
              <Button
                variant="outline"
                onClick={clearFilters}
                size="sm"
                className="flex items-center gap-2"
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>
        
        <ContactList
          contacts={filteredContacts}
          isLoading={isLoading}
          onEdit={handleEditContact}
          onRefresh={handleRefresh}
          onContactMultiSelect={isSelectionMode ? handleContactSelect : undefined}
          selectedContacts={selectedContacts}
          isSelectionMode={isSelectionMode}
        />
      </div>
    </div>
  );
};

export default Contacts;