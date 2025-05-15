
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getContacts, 
  Contact, 
  getCategories, 
  ContactCategory, 
  getContactGroups,
  ContactGroup,
  deleteMultipleContacts
} from "@/services/rel8t/contactService";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Plus,
  Mail,
  Phone,
  Building,
  User,
  Calendar,
  RefreshCcw,
  Filter,
  Trash2,
  Users,
  FolderPlus,
  Contact as ContactIcon
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useDebounce } from "@/hooks/useDebounce";
import { toast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";

interface ContactListProps {
  contacts?: Contact[];
  isLoading?: boolean;
  onEdit?: (contact: Contact) => void;
  onDelete?: (id: string) => void;
  onAddContact?: () => void;
  onRefresh?: () => void;
}

const ContactList: React.FC<ContactListProps> = ({ 
  contacts: propContacts, 
  isLoading: propIsLoading, 
  onEdit, 
  onDelete,
  onAddContact,
  onRefresh 
}) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 350);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  
  // Get group ID from URL if present
  const groupIdFromUrl = searchParams.get("group");
  
  const queryClient = useQueryClient();
  
  // Query to fetch contacts
  const { data: fetchedContacts = [], isLoading: isLoadingContacts } = useQuery({
    queryKey: ["contacts", debouncedSearch],
    queryFn: () => getContacts({ searchQuery: debouncedSearch }),
    enabled: !propContacts, // Only fetch if contacts are not provided as props
  });

  // Get categories for filtering
  const { data: categories = [] } = useQuery({
    queryKey: ["contact-categories"],
    queryFn: () => getCategories(),
  });

  // Get contact groups
  const { data: groups = [] } = useQuery({
    queryKey: ["contact-groups"],
    queryFn: () => getContactGroups(),
  });

  // Bulk delete mutation
  const deleteMutation = useMutation({
    mutationFn: (ids: string[]) => deleteMultipleContacts(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      toast({ 
        title: "Success", 
        description: `${selectedContacts.length} contact(s) deleted successfully` 
      });
      setSelectedContacts([]);
    },
    onError: (error) => {
      toast({ 
        title: "Error", 
        description: `Failed to delete contacts: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive"
      });
    }
  });

  // Use contacts from props if provided, otherwise use fetched contacts
  const contacts = propContacts || fetchedContacts;
  const isLoading = propIsLoading !== undefined ? propIsLoading : isLoadingContacts;

  // Filter contacts based on activeTab, search term, selected tag, category and group
  const filteredContacts = Array.isArray(contacts) ? contacts.filter((contact) => {
    // First, filter by tag if selected
    const matchesTag = !selectedTag || 
      (contact.tags && contact.tags.includes(selectedTag));
    
    // Filter by category if selected
    const matchesCategory = !selectedCategory || 
      (contact.category_id === selectedCategory);
    
    // Filter by group from URL if present
    const matchesGroup = !groupIdFromUrl || 
      (contact.groups && contact.groups.some(g => g.id === groupIdFromUrl));
    
    // Filter by favorites tab
    if (activeTab === "favorites") {
      // This is a placeholder. In a real app, you'd have a "favorite" flag in your contact data
      return false; // No favorites implemented yet
    }
    
    // Filter by groups tab
    if (activeTab === "groups") {
      return contact.groups && contact.groups.length > 0 && matchesTag && matchesCategory && matchesGroup;
    }
    
    return matchesTag && matchesCategory && (!groupIdFromUrl || matchesGroup);
  }) : [];

  // Get unique tags for the filter
  const uniqueTags = Array.isArray(contacts) ? Array.from(
    new Set(
      contacts
        .flatMap(contact => contact.tags || [])
        .filter(tag => tag) // Filter out empty/null tags
    )
  ).sort() : [];

  // Toggle individual contact selection
  const toggleContactSelection = (contactId: string) => {
    setSelectedContacts(prev => {
      if (prev.includes(contactId)) {
        return prev.filter(id => id !== contactId);
      } else {
        return [...prev, contactId];
      }
    });
  };

  // Select or deselect all visible contacts
  const toggleSelectAll = () => {
    if (selectedContacts.length === filteredContacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(filteredContacts.map(contact => contact.id));
    }
  };

  // Handle bulk delete
  const confirmBulkDelete = () => {
    if (selectedContacts.length > 0) {
      deleteMutation.mutate(selectedContacts);
      setConfirmDeleteOpen(false);
    }
  };

  // Handle group navigation
  const handleGroupNav = (groupId: string) => {
    setSearchParams({ group: groupId });
  };

  // Check if all visible contacts are selected
  const allSelected = filteredContacts.length > 0 && 
    selectedContacts.length === filteredContacts.length;

  // Navigate to groups management
  const navigateToGroups = () => {
    navigate("/rel8t/groups");
  };

  // Navigate to import contacts
  const navigateToImport = () => {
    navigate("/rel8t/import");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-auto flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 w-full"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-2 flex-1 sm:flex-initial">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={selectedTag || ""}
              onChange={(e) => setSelectedTag(e.target.value || null)}
            >
              <option value="">All Tags</option>
              {uniqueTags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2 flex-1 sm:flex-initial">
            <select
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={selectedCategory || ""}
              onChange={(e) => setSelectedCategory(e.target.value || null)}
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <Button variant="outline" onClick={navigateToGroups} size="icon" title="Manage groups">
            <Users className="h-4 w-4" />
          </Button>
          {onRefresh && (
            <Button variant="outline" onClick={onRefresh} size="icon" title="Refresh contacts">
              <RefreshCcw className="h-4 w-4" />
            </Button>
          )}
          <Button variant="outline" onClick={navigateToImport} className="gap-1">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Import</span>
          </Button>
          {onAddContact && (
            <Button onClick={onAddContact} className="gap-1">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add</span>
            </Button>
          )}
        </div>
      </div>

      {/* Tabs for different contact views */}
      <Tabs
        defaultValue={activeTab}
        value={activeTab}
        onValueChange={setActiveTab}
        className="mb-6"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Contacts</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
          <TabsTrigger value="groups">Groups</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Bulk actions bar - visible when contacts are selected */}
      {selectedContacts.length > 0 && (
        <div className="bg-muted/30 rounded-md p-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Checkbox 
              checked={allSelected} 
              onCheckedChange={toggleSelectAll} 
              id="select-all" 
            />
            <label htmlFor="select-all" className="text-sm">
              {selectedContacts.length} selected
            </label>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <FolderPlus className="h-4 w-4 mr-1" /> Add to Group
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {groups.length === 0 ? (
                  <div className="px-2 py-1.5 text-sm text-muted-foreground">
                    No groups available
                  </div>
                ) : (
                  groups.map(group => (
                    <DropdownMenuItem key={group.id} className="cursor-pointer">
                      <div 
                        className="w-2 h-2 rounded-full mr-2" 
                        style={{ backgroundColor: group.color || '#6366f1' }} 
                      />
                      {group.name}
                    </DropdownMenuItem>
                  ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={() => setConfirmDeleteOpen(true)}
              disabled={deleteMutation.isPending}
            >
              <Trash2 className="h-4 w-4 mr-1" /> Delete
            </Button>
          </div>
        </div>
      )}

      {/* Groups section when on Groups tab */}
      {activeTab === "groups" && groups.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {groups.map(group => (
            <Button
              key={group.id}
              variant={groupIdFromUrl === group.id ? "default" : "outline"}
              size="sm"
              onClick={() => handleGroupNav(group.id)}
              className="flex items-center gap-2"
            >
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: group.color || '#6366f1' }} 
              />
              {group.name}
            </Button>
          ))}
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading contacts...</p>
        </div>
      ) : filteredContacts.length === 0 ? (
        <div className="text-center py-8">
          <ContactIcon className="h-12 w-12 text-muted-foreground/50 mx-auto" />
          <h3 className="mt-2 text-lg font-medium">No contacts found</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {debouncedSearch || selectedTag || selectedCategory || groupIdFromUrl
              ? "Try a different search term, tag, category, or group"
              : "Add your first contact to get started"}
          </p>
          {onAddContact && (
            <Button onClick={onAddContact} variant="outline" className="mt-4 gap-1">
              <Plus className="h-4 w-4" />
              Add Contact
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredContacts.map((contact) => (
            <Card 
              key={contact.id} 
              className="overflow-hidden hover:shadow-md transition-shadow"
            >
              <CardContent className="p-0">
                {/* Card Header with contact name and category */}
                <div className="flex items-center justify-between p-3 border-b bg-muted/30">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      className="mr-1"
                      checked={selectedContacts.includes(contact.id)}
                      onCheckedChange={() => toggleContactSelection(contact.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div 
                      className="cursor-pointer flex-1" 
                      onClick={() => onEdit && onEdit(contact)}
                    >
                      <h3 className="font-medium text-base truncate">{contact.name}</h3>
                    </div>
                  </div>
                  {contact.category && (
                    <Badge 
                      variant="outline"
                      className="ml-2"
                      style={{ 
                        borderColor: contact.category.color,
                        color: contact.category.color 
                      }}
                    >
                      {contact.category.name}
                    </Badge>
                  )}
                </div>

                {/* Card Body with contact details */}
                <div 
                  className="p-3 cursor-pointer" 
                  onClick={() => onEdit && onEdit(contact)}
                >
                  {/* Essential Info */}
                  <div className="space-y-1 mb-2">
                    {contact.email && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                        <span className="truncate">{contact.email}</span>
                      </div>
                    )}
                    {contact.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                        <span>{contact.phone}</span>
                      </div>
                    )}
                    {contact.organization && (
                      <div className="flex items-center gap-2 text-sm">
                        <Building className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                        <span className="truncate">{contact.organization}</span>
                        {contact.role && (
                          <span className="text-xs text-muted-foreground ml-1">({contact.role})</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  {contact.tags && contact.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {contact.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="font-normal text-xs py-0">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Last Contact Date */}
                  {contact.last_contact_date && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-3">
                      <Calendar className="h-3 w-3 flex-shrink-0" />
                      <span>
                        Last contact: {formatDistanceToNow(new Date(contact.last_contact_date), { addSuffix: true })}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Confirmation dialog for bulk delete */}
      <AlertDialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {selectedContacts.length} contacts?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete 
              the selected contacts and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmBulkDelete}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ContactList;
