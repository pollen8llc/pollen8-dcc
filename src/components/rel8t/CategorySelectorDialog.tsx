import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Check, X, Loader2 } from 'lucide-react';
import { getCategories } from '@/services/rel8t/contactService';
import { cn } from '@/lib/utils';

interface CategorySelectorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentCategoryId?: string;
  contactName: string;
  onSubmit: (categoryId: string | null) => void;
}

export function CategorySelectorDialog({
  open,
  onOpenChange,
  currentCategoryId,
  contactName,
  onSubmit
}: CategorySelectorDialogProps) {
  const { data: categories, isLoading } = useQuery({
    queryKey: ['contact-categories'],
    queryFn: getCategories,
    enabled: open,
  });

  const handleSelect = (categoryId: string | null) => {
    onSubmit(categoryId);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-morphism bg-card/95 backdrop-blur-md border-primary/20 max-w-sm">
        <DialogHeader>
          <DialogTitle>Change Category</DialogTitle>
          <DialogDescription>
            Select a category for {contactName}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <ScrollArea className="max-h-[300px] pr-2">
            <div className="space-y-1">
              {categories?.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleSelect(category.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all",
                    "hover:bg-primary/10 hover:scale-[1.02]",
                    currentCategoryId === category.id 
                      ? "bg-primary/15 border border-primary/30" 
                      : "bg-muted/30"
                  )}
                >
                  <div 
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: category.color || 'hsl(var(--muted-foreground))' }}
                  />
                  <span className="flex-1 text-left text-sm font-medium">
                    {category.name}
                  </span>
                  {currentCategoryId === category.id && (
                    <Check className="h-4 w-4 text-primary shrink-0" />
                  )}
                </button>
              ))}

              {/* Remove Category Option */}
              <button
                onClick={() => handleSelect(null)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all mt-2",
                  "hover:bg-destructive/10 border border-dashed border-muted-foreground/30",
                  !currentCategoryId && "bg-muted/30"
                )}
              >
                <X className="w-3 h-3 text-muted-foreground shrink-0" />
                <span className="flex-1 text-left text-sm text-muted-foreground">
                  Remove Category
                </span>
                {!currentCategoryId && (
                  <Check className="h-4 w-4 text-muted-foreground shrink-0" />
                )}
              </button>
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}
