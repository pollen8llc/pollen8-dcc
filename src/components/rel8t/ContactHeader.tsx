import React from 'react';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Zap, Target, Star, Edit, Trash2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface ContactHeaderProps {
  contactId: string;
  name: string;
  category?: string;
  avatar?: string;
  status?: 'active' | 'inactive';
  tags?: string[];
  affiliatedUserId?: string;
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
  affiliatedUserId,
  onActv8,
  onNomin8,
  onEvalu8,
  onEdit,
  onDelete
}: ContactHeaderProps) {
  const isMobile = useIsMobile();

  return (
    <Card className="relative overflow-hidden">
      <div className="p-4 md:p-6">
        {/* Mobile Layout */}
        {isMobile ? (
          <div className="space-y-4">
            {/* Avatar Row */}
            <div className="flex items-center justify-center">
              <Avatar userId={affiliatedUserId || "UXI8000"} size={100} className="ring-2 ring-primary/20" />
            </div>

            {/* Name Row */}
            <div className="text-center">
              <h1 className="text-2xl font-bold">{name}</h1>
            </div>

            {/* Glowing Separator */}
            <div className="relative h-px w-full">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary to-transparent blur-sm" />
            </div>

            {/* Action Buttons Grid */}
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={onActv8} variant="outline" size="sm" className="gap-2">
                <Zap className="h-4 w-4" />
                Actv8
              </Button>
              <Button onClick={onNomin8} variant="outline" size="sm" className="gap-2">
                <Target className="h-4 w-4" />
                Nomin8
              </Button>
              <Button onClick={onEvalu8} variant="outline" size="sm" className="gap-2">
                <Star className="h-4 w-4" />
                Evalu8
              </Button>
              <Button onClick={onEdit} variant="outline" size="sm" className="gap-2">
                <Edit className="h-4 w-4" />
                Edit
              </Button>
              <Button 
                onClick={onDelete} 
                variant="outline" 
                size="sm"
                className="col-span-2 gap-2 text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
        ) : (
          /* Desktop Layout */
          <>
            {/* Contact Info Section */}
            <div className="flex items-start gap-6 mb-6">
              <Avatar userId={affiliatedUserId || "UXI8000"} size={80} className="ring-2 ring-primary/20" />
              
              <div className="flex-1">
                <h1 className="text-3xl font-bold">{name}</h1>
              </div>
            </div>

            {/* Glowing Separator */}
            <div className="relative h-px w-full mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary to-transparent blur-sm" />
            </div>

            {/* Action Buttons Bar */}
            <div className="flex items-center gap-3">
              <Button onClick={onActv8} variant="outline" className="flex-1 gap-2">
                <Zap className="h-4 w-4" />
                Actv8
              </Button>
              <Button onClick={onNomin8} variant="outline" className="flex-1 gap-2">
                <Target className="h-4 w-4" />
                Nomin8
              </Button>
              <Button onClick={onEvalu8} variant="outline" className="flex-1 gap-2">
                <Star className="h-4 w-4" />
                Evalu8
              </Button>
              <Button onClick={onEdit} variant="outline" className="flex-1 gap-2">
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
          </>
        )}
      </div>
    </Card>
  );
}
