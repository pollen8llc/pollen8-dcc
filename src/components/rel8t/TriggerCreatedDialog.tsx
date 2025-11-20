import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, Download, Copy, CheckCircle2, Bell } from "lucide-react";
import { downloadICS } from "@/utils/icsDownload";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Trigger } from "@/services/rel8t/triggerService";
import { format } from "date-fns";
import { useEffect, useRef } from "react";

interface TriggerCreatedDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: Trigger | null;
  icsContent: string | null;
}

export function TriggerCreatedDialog({ open, onOpenChange, trigger, icsContent }: TriggerCreatedDialogProps) {
  const navigate = useNavigate();
  const hasAutoDownloaded = useRef(false);

  // Auto-download ICS file when dialog opens
  useEffect(() => {
    if (open && trigger && icsContent && !hasAutoDownloaded.current) {
      const filename = `${trigger.name.replace(/\s+/g, '-').toLowerCase()}.ics`;
      downloadICS(icsContent, filename);
      hasAutoDownloaded.current = true;
      
      toast({
        title: "Calendar file downloaded",
        description: "Import this file into your calendar app to set up automatic reminders."
      });
    }
    
    // Reset flag when dialog closes
    if (!open) {
      hasAutoDownloaded.current = false;
    }
  }, [open, trigger, icsContent]);

  if (!trigger) return null;

  const handleDownloadICS = () => {
    if (icsContent) {
      const filename = `${trigger.name.replace(/\s+/g, '-').toLowerCase()}.ics`;
      downloadICS(icsContent, filename);
      toast({
        title: "Calendar file downloaded",
        description: "Import this file into your calendar app."
      });
    }
  };

  const handleCopySystemEmail = () => {
    if (trigger.system_email) {
      navigator.clipboard.writeText(trigger.system_email);
      toast({
        title: "Email copied",
        description: "System email copied to clipboard."
      });
    }
  };

  const nextExecutionTime = trigger.execution_time 
    ? format(new Date(trigger.execution_time), "PPP 'at' p")
    : "Not scheduled";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card/95 backdrop-blur-sm border-primary/20">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="h-6 w-6 text-green-500" />
            <DialogTitle>Trigger Created Successfully!</DialogTitle>
          </div>
          <DialogDescription className="space-y-3 pt-2">
            <div>
              <p className="font-medium text-foreground">{trigger.name}</p>
              <p className="text-sm text-muted-foreground mt-1">{trigger.description}</p>
            </div>
            
            <div className="bg-muted/50 rounded-lg p-3 space-y-2">
              <div className="flex items-start gap-2">
                <Calendar className="h-4 w-4 text-primary mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Next execution</p>
                  <p className="text-sm font-medium text-foreground">{nextExecutionTime}</p>
                </div>
              </div>
              
              {trigger.system_email && (
                <div className="flex items-start gap-2">
                  <Bell className="h-4 w-4 text-primary mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">System email</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs font-mono text-foreground truncate">{trigger.system_email}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={handleCopySystemEmail}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2 mt-4">
          {icsContent && (
            <Button
              onClick={handleDownloadICS}
              className="w-full"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Calendar File (.ics)
            </Button>
          )}
          
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                navigate("/rel8/notifications");
              }}
            >
              View Notifications
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                navigate("/rel8/build-rapport");
              }}
            >
              View Triggers
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
