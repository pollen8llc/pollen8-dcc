
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mail, Phone, Trash2, Edit, Building, MapPin } from "lucide-react";
import { Contact } from "@/services/rel8t/contactService";

interface ContactCardProps {
  contact: Contact;
  onEdit?: (contact: Contact) => void;
  onDelete?: (id: string) => void;
  onSelect?: (id: string, selected: boolean) => void;
  isSelected?: boolean;
}

const ContactCard = ({ 
  contact, 
  onEdit, 
  onDelete,
  onSelect,
  isSelected = false
}: ContactCardProps) => {
  const handleEdit = () => {
    if (onEdit) onEdit(contact);
  };
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete && confirm("Are you sure you want to delete this contact?")) {
      onDelete(contact.id);
    }
  };
  
  const handleSelect = () => {
    if (onSelect) onSelect(contact.id, !isSelected);
  };

  // Format initials for avatar
  const getInitials = () => {
    if (!contact.name) return '?';
    
    const nameParts = contact.name.split(' ');
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    return contact.name.substring(0, 2).toUpperCase();
  };

  return (
    <Card 
      className={`overflow-hidden transition-all hover:shadow-md cursor-pointer bg-card/60 backdrop-blur-sm ${
        isSelected ? 'ring-2 ring-primary' : 'border-border/40'
      }`}
      onClick={isSelected ? handleSelect : handleEdit}
    >
      {contact.category && (
        <div 
          className={`h-1.5 w-full ${
            contact.category.color ? `bg-${contact.category.color}-500` : 'bg-primary'
          }`}
        ></div>
      )}
      
      <div className="p-4">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
            {getInitials()}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium truncate">{contact.name}</h3>
            {contact.organization && (
              <div className="flex items-center text-xs text-muted-foreground mt-0.5">
                <Building className="h-3 w-3 mr-1 flex-shrink-0" />
                <span className="truncate">{contact.organization}</span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-3 space-y-1.5">
          {contact.email && (
            <div className="flex items-center text-xs">
              <Mail className="h-3 w-3 mr-1.5 text-muted-foreground flex-shrink-0" />
              <span className="truncate">{contact.email}</span>
            </div>
          )}
          
          {contact.phone && (
            <div className="flex items-center text-xs">
              <Phone className="h-3 w-3 mr-1.5 text-muted-foreground flex-shrink-0" />
              <span className="truncate">{contact.phone}</span>
            </div>
          )}
          
          {contact.location && (
            <div className="flex items-center text-xs">
              <MapPin className="h-3 w-3 mr-1.5 text-muted-foreground flex-shrink-0" />
              <span className="truncate">{contact.location}</span>
            </div>
          )}
        </div>
        
        {contact.category && (
          <div className="mt-3">
            <Badge variant="outline" className="text-xs px-1.5 py-0 h-5">
              {contact.category.name}
            </Badge>
          </div>
        )}
      </div>
      
      <div className="border-t p-2 flex justify-between items-center bg-muted/30">
        <div className="flex-1">
          {contact.groups && contact.groups.length > 0 && (
            <div className="flex gap-1 flex-wrap">
              {contact.groups.slice(0, 2).map((group) => (
                <Badge 
                  key={group.id} 
                  variant="secondary" 
                  className="text-xs px-1.5 py-0 h-5"
                >
                  {group.name}
                </Badge>
              ))}
              {contact.groups.length > 2 && (
                <Badge variant="outline" className="text-xs px-1.5 py-0 h-5">
                  +{contact.groups.length - 2}
                </Badge>
              )}
            </div>
          )}
        </div>
        
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit();
            }}
          >
            <Edit className="h-3 w-3" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-destructive hover:text-destructive"
            onClick={handleDelete}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ContactCard;
