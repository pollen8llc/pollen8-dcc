
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getContacts, Contact } from "@/services/rel8t/contactService";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  Plus,
  Mail,
  Phone,
  Building,
  Briefcase,
  User,
  Calendar
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useDebounce } from "@/hooks/useDebounce";

interface ContactListProps {
  onAddContact?: () => void;
  onEditContact?: (contact: Contact) => void;
}

const ContactList: React.FC<ContactListProps> = ({ onAddContact, onEditContact }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 350);
  const [selectedCommunity, setSelectedCommunity] = useState<string | null>(null);
  
  const { data: contacts = [], isLoading } = useQuery({
    queryKey: ["contacts"],
    queryFn: getContacts,
  });

  // Filter contacts based on search term and selected community
  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch = !debouncedSearch || 
      contact.name.toLowerCase().includes(debouncedSearch.toLowerCase()) || 
      contact.email?.toLowerCase().includes(debouncedSearch.toLowerCase()) || 
      contact.organization?.toLowerCase().includes(debouncedSearch.toLowerCase());
    
    const matchesCommunity = !selectedCommunity || contact.community_id === selectedCommunity;
    
    return matchesSearch && matchesCommunity;
  });

  // Get unique communities for the filter
  const communities = Array.from(
    new Set(
      contacts
        .filter(contact => contact.community_id)
        .map(contact => ({ 
          id: contact.community_id, 
          name: (contact as any).communities?.name 
        }))
        .filter(community => community.name)
    )
  );

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
          <select
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            value={selectedCommunity || ""}
            onChange={(e) => setSelectedCommunity(e.target.value || null)}
          >
            <option value="">All Communities</option>
            {communities.map((community) => (
              <option key={community.id} value={community.id}>
                {community.name}
              </option>
            ))}
          </select>
          {onAddContact && (
            <Button onClick={onAddContact} className="gap-1">
              <Plus className="h-4 w-4" />
              Add Contact
            </Button>
          )}
        </div>
      </div>

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
            {debouncedSearch
              ? "Try a different search term"
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
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Organization</TableHead>
                <TableHead>Community</TableHead>
                <TableHead>Last Contact</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContacts.map((contact) => (
                <TableRow 
                  key={contact.id} 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => onEditContact && onEditContact(contact)}
                >
                  <TableCell>
                    <div className="font-medium">{contact.name}</div>
                  </TableCell>
                  <TableCell>
                    {contact.email && (
                      <div className="flex items-center gap-1 text-sm">
                        <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="truncate max-w-[180px]">{contact.email}</span>
                      </div>
                    )}
                    {contact.phone && (
                      <div className="flex items-center gap-1 text-sm mt-0.5">
                        <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                        {contact.phone}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {contact.organization && (
                      <div className="flex items-center gap-1">
                        <Building className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{contact.organization}</span>
                      </div>
                    )}
                    {contact.role && (
                      <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Briefcase className="h-3 w-3" />
                        {contact.role}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {(contact as any).communities?.name ? (
                      <Badge variant="outline" className="font-normal">
                        {(contact as any).communities.name}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-xs">None</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {contact.last_contact_date ? (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDistanceToNow(new Date(contact.last_contact_date), { addSuffix: true })}
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-xs">No record</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default ContactList;
