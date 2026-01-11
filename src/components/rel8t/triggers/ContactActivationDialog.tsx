import { useState, useEffect } from "react";
import { Check, Loader2, Zap } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UnifiedAvatar } from "@/components/ui/unified-avatar";
import { cn } from "@/lib/utils";
import { getActv8ContactStatus, activateContact } from "@/services/actv8Service";
import { toast } from "sonner";

interface Contact {
  id: string;
  name: string;
}

interface ContactActivationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contacts: Contact[];
  onConfirm: () => void;
}

interface ContactStatus {
  contactId: string;
  isActive: boolean;
  isLoading: boolean;
  actv8ContactId?: string;
}

const ContactStatusCard = ({
  contact,
  status,
  onActivate,
}: {
  contact: Contact;
  status: ContactStatus;
  onActivate: () => void;
}) => (
  <div className={cn(
    "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
    status.isActive 
      ? "bg-primary/5 border border-primary/20" 
      : "bg-card/40 border border-border/50"
  )}>
    {/* Status dot */}
    <div
      className={cn(
        "w-2 h-2 rounded-full shrink-0",
        status.isActive
          ? "bg-primary shadow-[0_0_6px_hsl(var(--primary)/0.4)]"
          : "bg-muted-foreground/40 animate-pulse"
      )}
    />

    {/* Avatar */}
    <UnifiedAvatar userId={contact.id} size={24} isContactId={true} />

    {/* Name */}
    <span className="flex-1 text-sm font-medium truncate">{contact.name}</span>

    {/* Status/Action */}
    {status.isActive ? (
      <div className="flex items-center gap-1 text-xs text-primary">
        <Check className="h-3 w-3" />
        <span>Active</span>
      </div>
    ) : (
      <Button
        size="sm"
        variant="ghost"
        onClick={onActivate}
        disabled={status.isLoading}
        className="h-7 px-2 gap-1 text-xs hover:bg-primary/10"
      >
        {status.isLoading ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : (
          <>
            <Zap className="h-3 w-3" /> Activate
          </>
        )}
      </Button>
    )}
  </div>
);

export function ContactActivationDialog({
  open,
  onOpenChange,
  contacts,
  onConfirm,
}: ContactActivationDialogProps) {
  const [contactStatuses, setContactStatuses] = useState<ContactStatus[]>([]);
  const [isLoadingStatuses, setIsLoadingStatuses] = useState(true);

  // Fetch activation status for all contacts when dialog opens
  useEffect(() => {
    if (open && contacts.length > 0) {
      setIsLoadingStatuses(true);
      
      const fetchStatuses = async () => {
        const statuses = await Promise.all(
          contacts.map(async (contact) => {
            try {
              const status = await getActv8ContactStatus(contact.id);
              return {
                contactId: contact.id,
                isActive: status.isActive,
                isLoading: false,
                actv8ContactId: status.actv8Contact?.id,
              };
            } catch {
              return {
                contactId: contact.id,
                isActive: false,
                isLoading: false,
              };
            }
          })
        );
        setContactStatuses(statuses);
        setIsLoadingStatuses(false);
      };

      fetchStatuses();
    }
  }, [open, contacts]);

  const handleActivate = async (contactId: string) => {
    // Set loading state for this contact
    setContactStatuses((prev) =>
      prev.map((s) =>
        s.contactId === contactId ? { ...s, isLoading: true } : s
      )
    );

    try {
      const result = await activateContact(contactId);
      
      // Update status to active
      setContactStatuses((prev) =>
        prev.map((s) =>
          s.contactId === contactId
            ? { ...s, isActive: true, isLoading: false, actv8ContactId: result.id }
            : s
        )
      );
      
      toast.success("Contact activated successfully");
    } catch (error) {
      console.error("Failed to activate contact:", error);
      
      // Reset loading state
      setContactStatuses((prev) =>
        prev.map((s) =>
          s.contactId === contactId ? { ...s, isLoading: false } : s
        )
      );
      
      toast.error("Failed to activate contact");
    }
  };

  const allActive = contactStatuses.every((s) => s.isActive);
  const inactiveCount = contactStatuses.filter((s) => !s.isActive).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden">
        {/* Header with icon accent */}
        <div className="relative px-5 pt-5 pb-4 bg-gradient-to-b from-primary/5 to-transparent">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
              <Zap className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0 pt-0.5">
              <DialogHeader className="space-y-1 text-left">
                <DialogTitle className="text-base font-semibold leading-tight">
                  Activate Contacts
                </DialogTitle>
                <DialogDescription className="text-xs leading-relaxed">
                  Outreach tasks require contacts to be activated for engagement tracking and reminders.
                </DialogDescription>
              </DialogHeader>
            </div>
          </div>
        </div>

        {/* Contact list */}
        <div className="px-5 py-3">
          <div className="space-y-1.5 max-h-[240px] overflow-y-auto">
            {isLoadingStatuses ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : (
              contacts.map((contact) => {
                const status = contactStatuses.find(
                  (s) => s.contactId === contact.id
                ) || { contactId: contact.id, isActive: false, isLoading: false };
                
                return (
                  <ContactStatusCard
                    key={contact.id}
                    contact={contact}
                    status={status}
                    onActivate={() => handleActivate(contact.id)}
                  />
                );
              })
            )}
          </div>

          {!isLoadingStatuses && inactiveCount > 0 && (
            <p className="text-[11px] text-muted-foreground mt-3 pl-0.5">
              {inactiveCount} inactive — you can still continue with limited tracking.
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-border/50 bg-muted/30 flex items-center justify-end gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="text-xs h-8"
          >
            Cancel
          </Button>
          <Button 
            size="sm" 
            onClick={onConfirm}
            className="text-xs h-8"
          >
            {allActive ? "Continue" : "Continue Anyway"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
