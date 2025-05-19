
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
    if (!contact.category) return "#00eada"; // Default teal
    return contact.category.color || "#00eada";
  };

  return (
    <Card 
      className={`h-full overflow-hidden transition-all hover:shadow-md cursor-pointer ${
        isSelected ? 'ring-2 ring-[#00eada]' : 'border-border/40'
      }`}
      onClick={isSelected ? handleSelect : handleEdit}
    >
      {/* Section 1: Header with color stripe, name and category */}
      <div>
        <div 
          className="h-2 w-full" 
          style={{ backgroundColor: getCategoryColor() }}
        />
        
        <div className="p-4 pb-2">
          <div className="flex justify-between items-start">
            <h3 className="text-base font-medium mb-1 line-clamp-1">{contact.name}</h3>
            
            {contact.category && (
              <Badge 
                variant="outline" 
                className="text-xs px-1.5 py-0"
                style={{
                  borderColor: `${getCategoryColor()}40`,
                  color: getCategoryColor()
                }}
              >
                {contact.category.name}
              </Badge>
            )}
          </div>
          
          {contact.organization && (
            <div className="flex items-center text-xs text-muted-foreground">
              <Building className="h-3 w-3 mr-1.5 flex-shrink-0" />
              <span className="truncate">{contact.organization}</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Section 2: Contact information */}
      <div className="px-4 py-2 flex-grow">
        <div className="space-y-1.5">
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
        </div>
      </div>
      
      {/* Section 3: Tags and action buttons */}
      <div className="px-4 pt-1 pb-3">
        {contact.tags && contact.tags.length > 0 && (
          <div className="flex items-start text-xs mb-3">
            <Tag className="h-3 w-3 mr-1.5 flex-shrink-0 mt-0.5 text-muted-foreground" />
            <div className="flex flex-wrap gap-1">
              {contact.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="bg-[#00eada]/10 text-[#00eada] px-1.5 py-0.5 rounded-full text-xs"
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
        
        <div className="flex justify-between items-center">
          <div className="flex-1">
            {contact.groups && contact.groups.length > 0 && (
              <div className="flex gap-1 flex-wrap">
                {contact.groups.slice(0, 1).map((group) => (
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
                {contact.groups.length > 1 && (
                  <Badge variant="outline" className="text-xs px-1.5 py-0 h-5">
                    +{contact.groups.length - 1}
                  </Badge>
                )}
              </div>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 hover:bg-[#00eada]/10 hover:text-[#00eada]"
              onClick={(e) => {
                e.stopPropagation();
                handleEdit();
              }}
            >
              <Edit className="h-3.5 w-3.5" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 hover:bg-destructive/10 hover:text-destructive"
              onClick={handleDelete}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ContactCard;
