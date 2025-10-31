import React from 'react';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Zap, Target, Star, Edit, Trash2 } from 'lucide-react';

interface ContactHeaderProps {
  contactId: string;
  name: string;
  category?: string;
  avatar?: string;
  status?: 'active' | 'inactive';
  tags?: string[];
  onActv8?: () => void;
  onNomin8?: () => void;
  onEvalu8?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function ContactHeader({
  contactId,
  name,
  category,
  avatar,
  status = 'active',
  tags = [],
  onActv8,
  onNomin8,
  onEvalu8,
  onEdit,
  onDelete
}: ContactHeaderProps) {
  return (
    <Card className="relative overflow-hidden">
      <div className="p-6">
        {/* Contact Info Section */}
        <div className="flex items-start gap-6 mb-6">
          <Avatar userId={contactId} size={80} className="ring-2 ring-primary/20" />
          
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h1 className="text-3xl font-bold mb-2">{name}</h1>
                <div className="flex items-center gap-2 flex-wrap">
                  {category && (
                    <Badge variant="teal">{category}</Badge>
                  )}
                  <Badge variant={status === 'active' ? 'default' : 'outline'}>
                    {status === 'active' ? 'Active' : 'Inactive'}
                  </Badge>
                  {tags.map((tag, idx) => (
                    <Badge key={idx} variant="tag">{tag}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Glowing Separator */}
        <div className="relative h-px w-full mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary to-transparent blur-sm" />
        </div>

        {/* Action Buttons Bar */}
        <div className="flex items-center gap-3">
          <Button
            onClick={onActv8}
            variant="outline"
            className="flex-1 gap-2"
          >
            <Zap className="h-4 w-4" />
            Actv8
          </Button>
          <Button
            onClick={onNomin8}
            variant="outline"
            className="flex-1 gap-2"
          >
            <Target className="h-4 w-4" />
            Nomin8
          </Button>
          <Button
            onClick={onEvalu8}
            variant="outline"
            className="flex-1 gap-2"
          >
            <Star className="h-4 w-4" />
            Evalu8
          </Button>
          <Button
            onClick={onEdit}
            variant="outline"
            className="flex-1 gap-2"
          >
            <Edit className="h-4 w-4" />
            Edit
          </Button>
          <Button
            onClick={onDelete}
            variant="outline"
            className="flex-1 gap-2 text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>
    </Card>
  );
}
