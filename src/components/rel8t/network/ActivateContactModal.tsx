import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Zap } from "lucide-react";
import { getDevelopmentPaths, activateContact, DevelopmentPath } from "@/services/actv8Service";
import { toast } from "sonner";

interface ActivateContactModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contactId: string;
  contactName: string;
  onSuccess?: (actv8ContactId: string) => void;
}

export function ActivateContactModal({
  open,
  onOpenChange,
  contactId,
  contactName,
  onSuccess
}: ActivateContactModalProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedPathId, setSelectedPathId] = useState<string | null>(null);
  const [isActivating, setIsActivating] = useState(false);

  const { data: paths = [], isLoading } = useQuery({
    queryKey: ['development-paths'],
    queryFn: getDevelopmentPaths,
    enabled: open,
  });

  const handleActivate = async () => {
    if (!selectedPathId) return;
    
    setIsActivating(true);
    try {
      const actv8Contact = await activateContact(contactId, selectedPathId);
      queryClient.invalidateQueries({ queryKey: ['actv8-contacts'] });
      queryClient.invalidateQueries({ queryKey: ['actv8-status', contactId] });
      toast.success(`${contactName} activated successfully!`);
      onOpenChange(false);
      
      if (onSuccess) {
        onSuccess(actv8Contact.id);
      } else {
        navigate('/rel8/actv8');
      }
    } catch (error) {
      console.error('Failed to activate contact:', error);
      toast.error('Failed to activate contact. Please try again.');
    } finally {
      setIsActivating(false);
    }
  };

  const strengthLabels: Record<string, string> = {
    growing: 'Growing Connection',
    solid: 'Solid Connection',
    thick: 'Deep Bond'
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Activate {contactName}
          </DialogTitle>
          <DialogDescription>
            Choose a development path to guide your relationship with this contact
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 max-h-[400px] overflow-y-auto">
              {paths.map((path) => (
                <button
                  key={path.id}
                  onClick={() => setSelectedPathId(path.id)}
                  className={`text-left p-4 rounded-lg border transition-all hover:border-primary/50 ${
                    selectedPathId === path.id 
                      ? 'border-primary bg-primary/10' 
                      : 'border-border/40 bg-card/30'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium">{path.name}</h4>
                    {selectedPathId === path.id && (
                      <span className="text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded">
                        SELECTED
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">{path.description}</p>
                  
                  <div className="flex items-center gap-1 mb-2">
                    {path.steps?.map((_, index) => (
                      <div
                        key={index}
                        className="h-1.5 flex-1 rounded-full bg-muted"
                      />
                    ))}
                  </div>
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>{path.steps?.length || 0} steps</span>
                    <span>Target: {strengthLabels[path.target_strength] || path.target_strength}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleActivate} 
                disabled={!selectedPathId || isActivating}
                className="gap-2"
              >
                {isActivating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Activating...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4" />
                    Activate Contact
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
