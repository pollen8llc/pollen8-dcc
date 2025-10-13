
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { MapPin, Trash2, Edit } from "lucide-react";
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
    if (!contact.category) return "#00eada";
    return contact.category.color || "#00eada";
  };
  
  const getInitials = () => {
    return contact.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card 
      onClick={handleCardClick}
      className={`cursor-pointer hover:shadow-md transition-all bg-card/80 backdrop-blur-sm border-2 bg-gradient-to-br from-card/80 to-card/40 hover:border-primary/30 hover:shadow-primary/10 hover:shadow-2xl group relative overflow-hidden ${isSelected ? 'ring-2 ring-primary' : ''}`}
    >
      {/* Gradient border effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
      
      {/* Selection checkbox */}
      {isSelectionMode && (
        <div className="absolute top-3 left-3 z-20">
          <Checkbox
            checked={isSelected}
            onCheckedChange={(checked) => onSelect?.(contact.id, checked as boolean)}
            className="bg-background/90 border-2"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <CardContent className={`p-5 relative z-10 ${isSelectionMode ? 'pt-12' : ''}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="bg-primary/10 rounded-full p-2 group-hover:bg-primary/20 transition-colors flex-shrink-0">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-sm bg-transparent">{getInitials()}</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-lg truncate group-hover:text-primary transition-colors">{contact.name}</h3>
              {contact.category ? (
                <Badge 
                  variant="outline" 
                  className="text-xs mt-1"
                  style={{
                    backgroundColor: `${getCategoryColor()}20`,
                    borderColor: `${getCategoryColor()}40`,
                    color: getCategoryColor()
                  }}
                >
                  {contact.category.name}
                </Badge>
              ) : contact.organization && (
                <p className="text-muted-foreground text-sm truncate">{contact.organization}</p>
              )}
              {contact.location && (
                <div className="flex items-center gap-1 mt-1">
                  <MapPin className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                  <p className="text-xs text-muted-foreground truncate">{contact.location}</p>
                </div>
              )}
            </div>
          </div>

          {!isSelectionMode && (
            <div className="flex gap-1 flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
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
                className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactCard;
