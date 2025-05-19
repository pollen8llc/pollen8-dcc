
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mail, Phone, Trash2, Edit, Building, MapPin, Tag } from "lucide-react";
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

  const getCategoryColor = () => {
    if (!contact.category) return "#1E88E5"; // Default blue
    return contact.category.color || "#1E88E5";
  };

  return (
    <Card 
      className={`h-full overflow-hidden transition-all hover:shadow-md cursor-pointer bg-card/60 backdrop-blur-sm ${
        isSelected ? 'ring-2 ring-primary' : 'border-border/40'
      }`}
      onClick={isSelected ? handleSelect : handleEdit}
    >
      <div 
        className="h-2 w-full" 
        style={{ backgroundColor: getCategoryColor() }}
      />
      
      <div className="p-4 h-full flex flex-col">
        <div className="mb-3">
          <h3 className="text-base font-medium mb-1 line-clamp-1">{contact.name}</h3>
          {contact.organization && (
            <div className="flex items-center text-xs text-muted-foreground">
              <Building className="h-3 w-3 mr-1.5 flex-shrink-0" />
              <span className="truncate">{contact.organization}</span>
            </div>
          )}
        </div>

        <div className="space-y-1.5 flex-grow">
          {contact.email && (
            <div className="flex items-center text-xs text-muted-foreground">
              <Mail className="h-3 w-3 mr-1.5 flex-shrink-0" />
              <span className="truncate">{contact.email}</span>
            </div>
          )}
          
          {contact.phone && (
            <div className="flex items-center text-xs text-muted-foreground">
              <Phone className="h-3 w-3 mr-1.5 flex-shrink-0" />
              <span className="truncate">{contact.phone}</span>
            </div>
          )}
          
          {contact.location && (
            <div className="flex items-center text-xs text-muted-foreground">
              <MapPin className="h-3 w-3 mr-1.5 flex-shrink-0" />
              <span className="truncate">{contact.location}</span>
            </div>
          )}
          
          {contact.tags && contact.tags.length > 0 && (
            <div className="flex items-start text-xs mt-2">
              <Tag className="h-3 w-3 mr-1.5 flex-shrink-0 mt-0.5 text-muted-foreground" />
              <div className="flex flex-wrap gap-1">
                {contact.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="bg-royal-blue-100/20 text-royal-blue-300 px-1.5 py-0.5 rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
                {contact.tags.length > 2 && (
                  <span className="text-xs text-muted-foreground">
                    +{contact.tags.length - 2} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {contact.category && (
          <div className="mt-3">
            <Badge 
              variant="outline" 
              className="text-xs px-1.5 py-0 h-5"
              style={{
                borderColor: `${getCategoryColor()}40`,
                color: getCategoryColor()
              }}
            >
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
                  style={{
                    backgroundColor: group.color ? `${group.color}30` : undefined,
                    color: group.color || undefined
                  }}
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
