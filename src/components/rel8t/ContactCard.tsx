
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mail, Phone, Trash2, Edit } from "lucide-react";
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

  return (
    <Card 
      className={`overflow-hidden transition-all hover:shadow-md cursor-pointer ${
        isSelected ? 'ring-2 ring-primary' : 'border-border/40'
      }`}
      onClick={handleEdit}
    >
      <div 
        className={`h-2 w-full ${
          contact.category ? `bg-${contact.category.color || 'primary'}-500` : 'bg-gray-200'
        }`}
      ></div>
      
      <div className="flex flex-col sm:flex-row items-center p-4">
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/30 flex-shrink-0 mb-3 sm:mb-0 flex items-center justify-center bg-muted">
          <span className="text-xl font-medium">
            {contact.name?.charAt(0).toUpperCase() || '?'}
          </span>
        </div>
        
        <div className="sm:ml-4 text-center sm:text-left flex-grow">
          <h3 className="font-medium text-base">{contact.name}</h3>
          
          {contact.category && (
            <Badge className="mt-1">
              {contact.category.name}
            </Badge>
          )}
          
          {contact.organization && (
            <p className="text-sm text-muted-foreground">
              {contact.organization}
            </p>
          )}
        </div>
        
        <div className="flex flex-row sm:flex-col gap-2 mt-2 sm:mt-0">
          {contact.email && (
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = `mailto:${contact.email}`;
              }}
              title={`Email ${contact.name}`}
            >
              <Mail className="h-4 w-4" />
            </Button>
          )}
          
          {contact.phone && (
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = `tel:${contact.phone}`;
              }}
              title={`Call ${contact.name}`}
            >
              <Phone className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      <div className="border-t p-3 bg-muted/20 flex justify-between items-center">
        {contact.location && (
          <span className="text-xs text-muted-foreground">
            {contact.location}
          </span>
        )}
        
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={handleEdit}
          >
            <Edit className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ContactCard;
