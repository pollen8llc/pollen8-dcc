import { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UnifiedAvatar } from "@/components/ui/unified-avatar";
import { 
  Users, 
  Calendar, 
  Clock, 
  Repeat, 
  Zap, 
  ArrowLeft,
  Check,
  Mail,
  Phone,
  MessageSquare,
  Video,
  MapPin,
  ListTodo,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SimpleTriggerFormData } from "@/hooks/rel8t/useTriggerWizard";
import { ContactActivationDialog } from "./ContactActivationDialog";

interface TriggerReviewStepProps {
  formData: SimpleTriggerFormData;
  onSubmit: (createOutreach: boolean) => void;
  onPrevious: () => void;
  isSubmitting: boolean;
  onUpdatePriority?: (priority: string) => void;
  actv8StepData?: {
    stepName: string;
    pathName: string;
  } | null;
  isActv8Mode?: boolean;
}

const channelIcons: Record<string, React.ReactNode> = {
  email: <Mail className="w-3.5 h-3.5" />,
  text: <Phone className="w-3.5 h-3.5" />,
  call: <Phone className="w-3.5 h-3.5" />,
  dm: <MessageSquare className="w-3.5 h-3.5" />,
  meeting: <Video className="w-3.5 h-3.5" />,
  irl: <MapPin className="w-3.5 h-3.5" />
};

const channelLabels: Record<string, string> = {
  email: "Email",
  text: "Text Message",
  call: "Phone Call",
  dm: "Direct Message",
  meeting: "Video Meeting",
  irl: "In Person"
};

const priorityColors: Record<string, string> = {
  low: "text-blue-400 bg-blue-500/10 border-blue-500/30",
  medium: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
  high: "text-red-400 bg-red-500/10 border-red-500/30"
};

const frequencyLabels: Record<string, string> = {
  onetime: "One Time",
  daily: "Daily",
  weekly: "Weekly",
  biweekly: "Biweekly",
  monthly: "Monthly",
  quarterly: "Quarterly"
};

export function TriggerReviewStep({ 
  formData, 
  onSubmit, 
  onPrevious,
  isSubmitting,
  onUpdatePriority,
  actv8StepData,
  isActv8Mode = false
}: TriggerReviewStepProps) {
  // Auto-enable outreach for Actv8 mode
  const [createOutreach, setCreateOutreach] = useState(isActv8Mode);
  const [showActivationDialog, setShowActivationDialog] = useState(false);

  const priorityOptions = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" }
  ];

  const getChannelDetails = () => {
    if (!formData.outreachChannel || !formData.channelDetails) return null;
    
    const details = formData.channelDetails;
    switch (formData.outreachChannel) {
      case 'email':
        return details.email;
      case 'text':
      case 'call':
        return details.phone;
      case 'dm':
        return `${details.platform}: @${details.handle}`;
      case 'meeting':
        return `${details.meetingPlatform} - ${details.link}`;
      case 'irl':
        return details.address;
      default:
        return null;
    }
  };

  const handleSubmit = () => {
    onSubmit(createOutreach);
  };

  // Format display time
  const [hours, minutes] = (formData.triggerTime || "09:00").split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const display12Hour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  const displayMinutes = minutes.toString().padStart(2, '0');

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Step Title */}
      <div className="mb-3">
        <h2 className="text-base sm:text-lg font-semibold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Review & Create
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Confirm details before creating
        </p>
      </div>

      {/* Review Sections */}
      <div className="space-y-3">
        {/* Target Contacts */}
        <div className="rounded-lg bg-background/50 border border-primary/20 p-3">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-medium text-foreground/70">Target Contacts</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {formData.selectedContacts.map((contact) => (
              <div 
                key={contact.id}
                className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-primary/10 border border-primary/20"
              >
                <UnifiedAvatar userId={contact.id} size={16} isContactId={true} />
                <span className="text-xs font-medium">
                  {contact.name || contact.email || "Contact"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Schedule - Compact */}
        <div className="rounded-lg bg-background/50 border border-primary/20 p-3">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-medium text-foreground/70">Schedule</span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
              <span>{formData.triggerDate ? format(formData.triggerDate, "MMM d, yyyy") : "Not set"}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-teal-400" />
              <span className="font-mono">{display12Hour}:{displayMinutes} {period}</span>
            </div>
          </div>
          
          {/* Frequency & Priority - Inline */}
          <div className="flex flex-wrap items-center gap-2 mt-2 pt-2 border-t border-primary/10">
            <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-primary/10 border border-primary/20 text-xs">
              <Repeat className="w-3 h-3 text-primary" />
              <span>{frequencyLabels[formData.frequency] || formData.frequency}</span>
            </div>
            
            {/* Editable Priority Select */}
            <div className="flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-muted-foreground" />
              <Select
                value={formData.priority}
                onValueChange={(value) => onUpdatePriority?.(value)}
              >
                <SelectTrigger className={cn(
                  "h-6 w-[90px] px-2 text-xs border rounded",
                  priorityColors[formData.priority] || "text-muted-foreground bg-muted/10 border-muted/30"
                )}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priorityOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="text-xs">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Follow-Up Channel (if selected) */}
        {formData.outreachChannel && (
          <div className="rounded-lg bg-background/50 border border-primary/20 p-3">
            <div className="flex items-center gap-2 mb-2">
              {channelIcons[formData.outreachChannel]}
              <span className="text-xs font-medium text-foreground/70">Follow-Up Channel</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded bg-primary/10">
                {channelIcons[formData.outreachChannel]}
              </div>
              <div>
                <p className="text-sm font-medium">{channelLabels[formData.outreachChannel]}</p>
                {getChannelDetails() && (
                  <p className="text-xs text-muted-foreground truncate max-w-[200px]">{getChannelDetails()}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Outreach Option */}
        <div className={cn(
          "rounded-lg border p-3",
          isActv8Mode 
            ? "border-emerald-500/50 bg-emerald-500/10 border-solid"
            : "border-dashed border-primary/30 bg-gradient-to-br from-primary/5 to-transparent"
        )}>
          <div className="flex items-start gap-2.5">
            <Checkbox
              id="createOutreach"
              checked={createOutreach}
              disabled={isActv8Mode}
              onCheckedChange={(checked) => {
                if (isActv8Mode) return; // Extra guard
                if (checked) {
                  setShowActivationDialog(true);
                } else {
                  setCreateOutreach(false);
                }
              }}
              className={cn("mt-0.5", isActv8Mode && "opacity-50")}
            />
            <div className="flex-1">
              <Label 
                htmlFor="createOutreach" 
                className={cn(
                  "text-xs font-medium flex items-center gap-1.5",
                  isActv8Mode ? "cursor-default" : "cursor-pointer"
                )}
              >
                <ListTodo className={cn("w-3.5 h-3.5", isActv8Mode ? "text-emerald-500" : "text-primary")} />
                Also create as Outreach Task
                {isActv8Mode && (
                  <span className="text-emerald-500 ml-1 text-[10px]">(Required)</span>
                )}
              </Label>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {isActv8Mode 
                  ? "Outreach task will be linked to your development path"
                  : "Add to your outreach list for tracking"
                }
              </p>
            </div>
          </div>
        </div>

        {/* Contact Activation Dialog */}
        <ContactActivationDialog
          open={showActivationDialog}
          onOpenChange={(open) => {
            if (!open && !createOutreach) {
              setCreateOutreach(false);
            }
            setShowActivationDialog(open);
          }}
          contacts={formData.selectedContacts}
          onConfirm={() => {
            setCreateOutreach(true);
            setShowActivationDialog(false);
          }}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-primary/10">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onPrevious}
          disabled={isSubmitting}
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </Button>

        <Button
          type="button"
          size="sm"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="shadow-md"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Check className="w-4 h-4 mr-1" />
              Create
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
