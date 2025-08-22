
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Mail, Phone, Trash2, Edit, Building, MapPin, Tag } from "lucide-react";
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
    <div 
      className={`h-full overflow-hidden transition-all duration-300 cursor-pointer rounded-2xl backdrop-blur-md 
        bg-card/40 border border-border/50 shadow-lg hover:shadow-xl hover:shadow-primary/10 hover:bg-card/60
        hover:scale-[1.02] group
        ${isSelected ? 'ring-2 ring-primary ring-inset bg-primary/10 scale-[1.02]' : ''}`}
      onClick={handleCardClick}
    >
      {/* Selection checkbox */}
      {isSelectionMode && (
        <div className="absolute top-3 left-3 z-10">
          <Checkbox
            checked={isSelected}
            onCheckedChange={(checked) => onSelect?.(contact.id, checked as boolean)}
            className="bg-white/90 border-2"
          />
        </div>
      )}

      {/* Section 1: Header with name and category */}
      <div className={`p-4 pb-2 relative ${isSelectionMode ? 'pt-12' : ''}`}>
        <div className="flex justify-between items-start">
          <h3 className="text-base font-medium mb-1 line-clamp-1">{contact.name}</h3>
          
          {contact.category && (
            <Badge 
              variant="outline" 
              className="text-xs px-1.5 py-0"
              style={{
                backgroundColor: `${getCategoryColor()}20`,
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
        
        {/* Group tag display at top */}
        {primaryGroup && (
          <div 
            className="absolute top-0 right-0 translate-x-1/4 -translate-y-1/4 rotate-12 w-24 z-10"
            style={{
              backgroundColor: primaryGroup.color || '#9b87f5'
            }}
          >
            <div className="text-[10px] font-semibold py-0.5 text-center text-black">
              {primaryGroup.name}
            </div>
          </div>
        )}
      </div>
      
      {/* Section 2: Contact information */}
      <div className="px-4 py-2 border-t border-border/20 flex-grow">
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
      <div className="px-4 pt-2 pb-3 border-t border-border/20">
        {contact.tags && contact.tags.length > 0 && (
          <div className="flex items-start text-xs mb-3">
            <Tag className="h-3 w-3 mr-1.5 flex-shrink-0 mt-0.5 text-muted-foreground" />
            <div className="flex flex-wrap gap-1">
              {contact.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="bg-primary/20 text-primary px-1.5 py-0.5 rounded-full text-xs"
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
            {contact.groups && contact.groups.length > 1 && (
              <div className="flex gap-1 flex-wrap">
                {contact.groups.slice(1, 2).map((group) => (
                  <Badge 
                    key={group.id} 
                    variant="secondary" 
                    className="text-xs px-1.5 py-0 h-5"
                    style={{
                      backgroundColor: group.color ? `${group.color}30` : 'rgba(255, 255, 255, 0.1)',
                      color: group.color || '#ffffff'
                    }}
                  >
                    {group.name}
                  </Badge>
                ))}
                {contact.groups.length > 2 && (
                   <Badge variant="outline" className="text-xs px-1.5 py-0 h-5 border-border/30 text-muted-foreground">
                    +{contact.groups.length - 2}
                  </Badge>
                )}
              </div>
            )}
          </div>
          
          {!isSelectionMode && (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 hover:bg-primary/10 hover:text-primary transition-all duration-200 hover:scale-110"
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
                className="h-7 w-7 p-0 hover:bg-destructive/10 hover:text-destructive transition-all duration-200 hover:scale-110"
                onClick={handleDelete}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactCard;
