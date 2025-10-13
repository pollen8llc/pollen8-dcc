
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Mail, Phone, Trash2, Edit, MapPin } from "lucide-react";
import { Contact } from "@/services/rel8t/contactService";
import { deleteContact } from "@/services/rel8t/contactService";
import { toast } from "@/hooks/use-toast";

interface ContactCardProps {
  contact: Contact;
  onEdit?: (contact: Contact) => void;
  onDelete?: (id: string) => void;
  onSelect?: (id: string, selected: boolean) => void;
  isSelected?: boolean;
  isSelectionMode?: boolean;
}

const ContactCard = ({ 
  contact, 
  onEdit, 
  onDelete,
  onSelect,
  isSelected = false,
  isSelectionMode = false
}: ContactCardProps) => {
  const handleEdit = () => {
    if (onEdit) onEdit(contact);
  };
  
  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this contact?")) {
      try {
        await deleteContact(contact.id);
        toast({
          title: "Contact deleted",
          description: "Contact has been successfully deleted.",
        });
        if (onDelete) onDelete(contact.id);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete contact",
          variant: "destructive",
        });
      }
    }
  };
  
  const handleSelect = () => {
    if (onSelect) onSelect(contact.id, !isSelected);
  };

  const handleCardClick = () => {
    if (isSelectionMode) {
      handleSelect();
    } else {
      handleEdit();
    }
  };

  const getCategoryColor = () => {
    if (!contact.category) return "#00eada"; // Default teal
    return contact.category.color || "#00eada";
  };
  
  // Get the primary group if available
  const primaryGroup = contact.groups && contact.groups.length > 0 ? contact.groups[0] : null;

  return (
    <Card 
      className={`h-[220px] flex flex-col cursor-pointer relative ${isSelected ? 'ring-2 ring-primary' : ''}`}
      onClick={handleCardClick}
    >
      {/* Selection checkbox */}
      {isSelectionMode && (
        <div className="absolute top-3 left-3 z-10">
          <Checkbox
            checked={isSelected}
            onCheckedChange={(checked) => onSelect?.(contact.id, checked as boolean)}
            className="bg-background/90 border-2"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Group tag display at top right */}
      {primaryGroup && (
        <div 
          className="absolute -top-2 -right-2 rotate-12 px-3 py-1 rounded shadow-sm z-10"
          style={{
            backgroundColor: primaryGroup.color || '#9b87f5'
          }}
        >
          <div className="text-[10px] font-semibold text-black">
            {primaryGroup.name}
          </div>
        </div>
      )}

      <CardHeader className={`flex-col gap-1 items-start ${isSelectionMode ? 'pt-10' : ''}`}>
        <div className="flex justify-between w-full items-start">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-lg truncate">{contact.name}</h3>
            {contact.organization && (
              <p className="text-xs text-muted-foreground truncate">{contact.organization}</p>
            )}
          </div>
          
          {contact.category && (
            <Badge 
              variant="outline" 
              className="ml-2 bg-[#00eada]/10 text-[#00eada] border-[#00eada]/30 flex-shrink-0"
            >
              {contact.category.name}
            </Badge>
          )}
        </div>
        
        {contact.location && (
          <div className="flex items-center text-xs text-muted-foreground">
            <MapPin className="h-3 w-3 mr-1" />
            <span className="truncate">{contact.location}</span>
          </div>
        )}

        {(contact.email || contact.phone) && (
          <div className="flex flex-col gap-0.5 w-full">
            {contact.email && (
              <div className="flex items-center text-xs text-muted-foreground">
                <Mail className="h-3 w-3 mr-1 flex-shrink-0" />
                <span className="truncate">{contact.email}</span>
              </div>
            )}
            {contact.phone && (
              <div className="flex items-center text-xs text-muted-foreground">
                <Phone className="h-3 w-3 mr-1 flex-shrink-0" />
                <span className="truncate">{contact.phone}</span>
              </div>
            )}
          </div>
        )}
      </CardHeader>
      
      <CardContent className="flex-grow">
        {contact.tags && contact.tags.length > 0 && (
          <div className="mt-2">
            <p className="text-xs text-muted-foreground mb-1">Tags</p>
            <div className="flex flex-wrap gap-1">
              {contact.tags.slice(0, 3).map((tag, i) => (
                <Badge 
                  key={i} 
                  variant="outline" 
                  className="text-xs bg-[#00eada]/10 text-[#00eada] border-[#00eada]/30"
                >
                  {tag}
                </Badge>
              ))}
              {contact.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{contact.tags.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}

        {contact.groups && contact.groups.length > 1 && (
          <div className="mt-2">
            <p className="text-xs text-muted-foreground mb-1">Groups</p>
            <div className="flex flex-wrap gap-1">
              {contact.groups.slice(1, 3).map((group) => (
                <Badge 
                  key={group.id} 
                  variant="outline" 
                  className="text-xs"
                  style={{
                    backgroundColor: group.color ? `${group.color}20` : 'rgba(0, 234, 218, 0.1)',
                    borderColor: group.color ? `${group.color}40` : 'rgba(0, 234, 218, 0.3)',
                    color: group.color || '#00eada'
                  }}
                >
                  {group.name}
                </Badge>
              ))}
              {contact.groups.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{contact.groups.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between items-center">
        <div className="flex-1" />
        
        {!isSelectionMode && (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={(e) => {
                e.stopPropagation();
                handleEdit();
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default ContactCard;
