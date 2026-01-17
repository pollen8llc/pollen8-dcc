import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CalendarIcon, XCircle, RefreshCw } from "lucide-react";
import { format, addDays } from "date-fns";
import { toast } from "sonner";
import { rescheduleOutreach, markOutreachMissed } from "@/services/rel8t/outreachService";
import { useQueryClient } from "@tanstack/react-query";

interface StepOutreachActionsProps {
  outreachId: string;
  actv8ContactId: string;
  stepIndex: number;
  isOverdue: boolean;
  onAction?: () => void;
}

export function StepOutreachActions({
  outreachId,
  actv8ContactId,
  stepIndex,
  isOverdue,
  onAction,
}: StepOutreachActionsProps) {
  const queryClient = useQueryClient();
  const [rescheduleDate, setRescheduleDate] = useState<Date | undefined>(addDays(new Date(), 1));
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [isMarkingMissed, setIsMarkingMissed] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handleReschedule = async () => {
    if (!rescheduleDate) return;

    setIsRescheduling(true);
    try {
      await rescheduleOutreach(outreachId, rescheduleDate);

      toast.success("Outreach rescheduled");
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ["step-instances"] });
      queryClient.invalidateQueries({ queryKey: ["outreaches"] });
      
      setIsPopoverOpen(false);
      onAction?.();
    } catch (error) {
      console.error("Error rescheduling:", error);
      toast.error("Failed to reschedule");
    } finally {
      setIsRescheduling(false);
    }
  };

  const handleMarkMissed = async () => {
    setIsMarkingMissed(true);
    try {
      await markOutreachMissed(outreachId, "missed");

      toast.success("Step marked as missed");
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ["step-instances"] });
      queryClient.invalidateQueries({ queryKey: ["outreaches"] });
      
      onAction?.();
    } catch (error) {
      console.error("Error marking missed:", error);
      toast.error("Failed to mark as missed");
    } finally {
      setIsMarkingMissed(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Reschedule Button */}
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs gap-1"
            disabled={isRescheduling}
          >
            {isRescheduling ? (
              <RefreshCw className="h-3 w-3 animate-spin" />
            ) : (
              <CalendarIcon className="h-3 w-3" />
            )}
            Reschedule
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={rescheduleDate}
            onSelect={setRescheduleDate}
            disabled={(date) => date < new Date()}
            initialFocus
          />
          <div className="p-3 border-t">
            <Button
              size="sm"
              className="w-full"
              onClick={handleReschedule}
              disabled={!rescheduleDate || isRescheduling}
            >
              {isRescheduling ? "Rescheduling..." : `Reschedule to ${rescheduleDate ? format(rescheduleDate, "MMM d") : ""}`}
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {/* Mark Missed Button */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs gap-1 text-destructive hover:text-destructive"
            disabled={isMarkingMissed}
          >
            {isMarkingMissed ? (
              <RefreshCw className="h-3 w-3 animate-spin" />
            ) : (
              <XCircle className="h-3 w-3" />
            )}
            Mark Missed
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Mark Step as Missed?</AlertDialogTitle>
            <AlertDialogDescription>
              This will mark the outreach as missed. The progress bar segment will turn red. You can still reschedule later if needed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleMarkMissed}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Mark as Missed
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
