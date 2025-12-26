import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { format, parseISO, isPast, isToday } from "date-fns";
import { Calendar, Link2, Loader2 } from "lucide-react";
import { Outreach, linkOutreachToActv8 } from "@/services/rel8t/outreachService";

interface LinkOutreachDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  outreaches: Outreach[];
  actv8ContactId: string;
  stepIndex: number;
  stepName: string;
  onLinked: () => void;
}

export function LinkOutreachDialog({
  open,
  onOpenChange,
  outreaches,
  actv8ContactId,
  stepIndex,
  stepName,
  onLinked,
}: LinkOutreachDialogProps) {
  const [selectedOutreachId, setSelectedOutreachId] = useState<string>("");
  const [isLinking, setIsLinking] = useState(false);

  // Filter to show only unlinked outreaches (no actv8_contact_id or different step)
  const availableOutreaches = outreaches.filter(
    (o) => !o.actv8_contact_id || o.actv8_step_index !== stepIndex
  );

  const handleLink = async () => {
    if (!selectedOutreachId) return;

    setIsLinking(true);
    try {
      const success = await linkOutreachToActv8(
        selectedOutreachId,
        actv8ContactId,
        stepIndex
      );
      if (success) {
        onLinked();
        onOpenChange(false);
        setSelectedOutreachId("");
      }
    } finally {
      setIsLinking(false);
    }
  };

  const getStatusBadge = (outreach: Outreach) => {
    const dueDate = parseISO(outreach.due_date);
    const isOverdue = isPast(dueDate) && !isToday(dueDate);

    if (isOverdue) {
      return <Badge variant="destructive" className="text-[10px]">Overdue</Badge>;
    }
    if (isToday(dueDate)) {
      return <Badge className="bg-amber-500 text-[10px]">Today</Badge>;
    }
    return <Badge variant="secondary" className="text-[10px]">Scheduled</Badge>;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5" />
            Link Existing Outreach
          </DialogTitle>
          <DialogDescription>
            Select an outreach to link to <strong>{stepName}</strong>
          </DialogDescription>
        </DialogHeader>

        {availableOutreaches.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            <p>No pending outreaches available to link.</p>
            <p className="text-sm mt-1">
              Create a new touchpoint instead.
            </p>
          </div>
        ) : (
          <>
            <RadioGroup
              value={selectedOutreachId}
              onValueChange={setSelectedOutreachId}
              className="space-y-2 max-h-64 overflow-y-auto"
            >
              {availableOutreaches.map((outreach) => (
                <div
                  key={outreach.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedOutreachId === outreach.id
                      ? "border-primary bg-primary/5"
                      : "border-border/50 hover:border-border"
                  }`}
                  onClick={() => setSelectedOutreachId(outreach.id)}
                >
                  <RadioGroupItem value={outreach.id} id={outreach.id} className="mt-1" />
                  <Label
                    htmlFor={outreach.id}
                    className="flex-1 cursor-pointer space-y-1"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{outreach.title}</span>
                      {getStatusBadge(outreach)}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {format(parseISO(outreach.due_date), "MMM d, yyyy")}
                    </div>
                    {outreach.actv8_contact_id && (
                      <p className="text-[10px] text-amber-600">
                        Already linked to step {(outreach.actv8_step_index ?? 0) + 1}
                      </p>
                    )}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleLink}
                disabled={!selectedOutreachId || isLinking}
              >
                {isLinking && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Link Outreach
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}