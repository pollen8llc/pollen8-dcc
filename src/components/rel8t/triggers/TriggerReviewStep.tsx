import { useState } from "react";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
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

interface TriggerReviewStepProps {
  formData: SimpleTriggerFormData;
  onSubmit: (createOutreach: boolean) => void;
  onPrevious: () => void;
  isSubmitting: boolean;
}

const channelIcons: Record<string, React.ReactNode> = {
  email: <Mail className="w-4 h-4" />,
  text: <Phone className="w-4 h-4" />,
  call: <Phone className="w-4 h-4" />,
  dm: <MessageSquare className="w-4 h-4" />,
  meeting: <Video className="w-4 h-4" />,
  irl: <MapPin className="w-4 h-4" />
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
  isSubmitting 
}: TriggerReviewStepProps) {
  const [createOutreach, setCreateOutreach] = useState(false);

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
    <div className="space-y-6 animate-fade-in">
      {/* Step Title */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Review & Create
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Confirm your reminder details before creating
        </p>
      </div>

      {/* Review Sections */}
      <div className="space-y-4">
        {/* Target Contacts */}
        <div className="rounded-xl bg-background/50 border border-primary/20 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground/70">Target Contacts</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.selectedContacts.map((contact) => (
              <div 
                key={contact.id}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20"
              >
                <UnifiedAvatar userId={contact.id} size={20} isContactId={true} />
                <span className="text-sm font-medium">
                  {contact.name || contact.email || "Contact"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Schedule */}
        <div className="rounded-xl bg-background/50 border border-primary/20 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground/70">Schedule</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Calendar className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Date</p>
                <p className="font-medium">
                  {formData.triggerDate ? format(formData.triggerDate, "PPP") : "Not set"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-teal-500/10">
                <Clock className="w-4 h-4 text-teal-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Time</p>
                <p className="font-medium font-mono">
                  {display12Hour}:{displayMinutes} {period}
                </p>
              </div>
            </div>
          </div>
          
          {/* Frequency & Priority */}
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-primary/10">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20">
              <Repeat className="w-3.5 h-3.5 text-primary" />
              <span className="text-sm">{frequencyLabels[formData.frequency] || formData.frequency}</span>
            </div>
            <div className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg border",
              priorityColors[formData.priority] || "text-muted-foreground bg-muted/10 border-muted/30"
            )}>
              <Zap className="w-3.5 h-3.5" />
              <span className="text-sm capitalize">{formData.priority} Priority</span>
            </div>
          </div>
        </div>

        {/* Follow-Up Channel (if selected) */}
        {formData.outreachChannel && (
          <div className="rounded-xl bg-background/50 border border-primary/20 p-4">
            <div className="flex items-center gap-2 mb-3">
              {channelIcons[formData.outreachChannel]}
              <span className="text-sm font-medium text-foreground/70">Follow-Up Channel</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                {channelIcons[formData.outreachChannel]}
              </div>
              <div>
                <p className="font-medium">{channelLabels[formData.outreachChannel]}</p>
                {getChannelDetails() && (
                  <p className="text-sm text-muted-foreground">{getChannelDetails()}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Outreach Option */}
        <Card className="border-2 border-dashed border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Checkbox
                id="createOutreach"
                checked={createOutreach}
                onCheckedChange={(checked) => setCreateOutreach(checked === true)}
                className="mt-0.5"
              />
              <div className="flex-1">
                <Label 
                  htmlFor="createOutreach" 
                  className="text-sm font-medium cursor-pointer flex items-center gap-2"
                >
                  <ListTodo className="w-4 h-4 text-primary" />
                  Also create as Outreach Task
                </Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Add this reminder to your outreach task list for tracking and completion feedback
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-primary/20">
        <Button
          type="button"
          variant="outline"
          onClick={onPrevious}
          disabled={isSubmitting}
          className="backdrop-blur-sm bg-background/50 border-primary/30"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <Button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="backdrop-blur-sm shadow-lg"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Check className="w-4 h-4 mr-2" />
              Create Reminder
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
