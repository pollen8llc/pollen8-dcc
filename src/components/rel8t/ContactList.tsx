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
  Briefcase,
  User,
  Calendar,
  Tags,
  RefreshCcw,
  Filter,
  MapPin,
  Trash2,
  Users,
  FolderPlus
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useDebounce } from "@/hooks/useDebounce";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import ContactGroupsManager from "./ContactGroupsManager";
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
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 350);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [showContactGroups, setShowContactGroups] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  
  const queryClient = useQueryClient();
  
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

  // Filter contacts based on search term, selected tag, category and group
  const filteredContacts = Array.isArray(contacts) ? contacts.filter((contact) => {
    const matchesTag = !selectedTag || 
      (contact.tags && contact.tags.includes(selectedTag));
    
    const matchesCategory = !selectedCategory || 
      (contact.category_id === selectedCategory);
    
    const matchesGroup = !selectedGroupId || 
      (contact.groups && contact.groups.some(g => g.id === selectedGroupId));
    
    return matchesTag && matchesCategory && (!selectedGroupId || matchesGroup);
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

  // Check if all visible contacts are selected
  const allSelected = filteredContacts.length > 0 && 
    selectedContacts.length === filteredContacts.length;

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
          <Button
            variant="outline"
            onClick={() => setShowContactGroups(true)}
            size="icon"
            title="Filter by group"
          >
            <Users className="h-4 w-4" />
          </Button>
          {onRefresh && (
            <Button variant="outline" onClick={onRefresh} size="icon" title="Refresh contacts">
              <RefreshCcw className="h-4 w-4" />
            </Button>
          )}
          {onAddContact && (
            <Button onClick={onAddContact} className="gap-1">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Contact</span>
            </Button>
          )}
        </div>
      </div>

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

      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading contacts...</p>
        </div>
      ) : filteredContacts.length === 0 ? (
        <div className="text-center py-8">
          <User className="h-12 w-12 text-muted-foreground/50 mx-auto" />
          <h3 className="mt-2 text-lg font-medium">No contacts found</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {debouncedSearch || selectedTag || selectedCategory || selectedGroupId
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredContacts.map((contact) => (
            <Card 
              key={contact.id} 
              className="cursor-pointer hover:bg-muted/10 transition-colors border-border/20 overflow-hidden"
            >
              <CardContent className="p-0">
                <div className="flex items-start">
                  <Checkbox
                    className="m-4"
                    checked={selectedContacts.includes(contact.id)}
                    onCheckedChange={() => toggleContactSelection(contact.id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  
                  <div className="flex-1" onClick={() => onEdit && onEdit(contact)}>
                    {/* Card Header with color based on category */}
                    <div 
                      className={`p-3 ${contact.category ? "" : "bg-muted/20"}`}
                      style={contact.category ? { backgroundColor: `${contact.category.color}20` } : {}}
                    >
                      <h3 className="font-medium text-lg truncate">
                        {contact.name}
                      </h3>
                      {contact.organization && (
                        <p className="text-sm text-muted-foreground truncate">
                          {contact.organization} {contact.role && `(${contact.role})`}
                        </p>
                      )}
                    </div>
                    
                    {/* Contact Details */}
                    <div className="p-4 space-y-3">
                      <div className="space-y-1.5">
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
                      </div>
                      
                      {/* Tags and Category Badges */}
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {contact.category && (
                          <Badge 
                            variant="outline" 
                            className="font-normal text-xs py-0"
                            style={{ 
                              borderColor: contact.category.color,
                              color: contact.category.color
                            }}
                          >
                            {contact.category.name}
                          </Badge>
                        )}
                        
                        {contact.tags && contact.tags.slice(0, 3).map(tag => (
                          <Badge key={tag} variant="secondary" className="font-normal text-xs py-0">
                            {tag}
                          </Badge>
                        ))}
                        
                        {contact.tags && contact.tags.length > 3 && (
                          <Badge variant="outline" className="font-normal text-xs py-0">
                            +{contact.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                      
                      {/* Last Contact Date - only show if exists */}
                      {contact.last_contact_date && (
                        <div className="text-xs text-muted-foreground border-t pt-2 mt-2">
                          Last contact: {formatDistanceToNow(new Date(contact.last_contact_date), { addSuffix: true })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Contact Groups Dialog */}
      <Dialog open={showContactGroups} onOpenChange={setShowContactGroups}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Contact Groups</DialogTitle>
          </DialogHeader>
          <div className="pt-4">
            <ContactGroupsManager 
              onSelectGroup={(groupId) => {
                setSelectedGroupId(groupId === selectedGroupId ? null : groupId);
                setShowContactGroups(false);
              }} 
            />
          </div>
        </DialogContent>
      </Dialog>

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
