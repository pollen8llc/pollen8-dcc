import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  actionTemplates, 
  touchpointChannels, 
  touchpointTones,
  MockNetworkContact 
} from "@/data/mockNetworkData";
import { durationOptions, recurringFrequencyOptions } from "@/utils/calendarGenerator";
import { CalendarIcon, Plus, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export interface TouchpointFormData {
  actionType: string;
  customAction?: string;
  description: string;
  channel: string;
  tone: string;
  date: Date;
  time: string;
  duration: number;
  location: string;
  intention: string;
  isRecurring: boolean;
  recurringFrequency: string;
  calendarOption: 'contact' | 'self' | 'both';
}

interface TouchpointFormProps {
  contact: MockNetworkContact;
  initialData?: Partial<TouchpointFormData>;
  onSave: (data: TouchpointFormData) => void;
  onCancel: () => void;
  onCreateInvite: (data: TouchpointFormData) => void;
}

const timeOptions = Array.from({ length: 24 }, (_, hour) => {
  return [0, 30].map(minute => {
    const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    const ampm = hour < 12 ? 'AM' : 'PM';
    const display = `${displayHour}:${minute.toString().padStart(2, '0')} ${ampm}`;
    return { value: time, label: display };
  });
}).flat();

export function TouchpointForm({ contact, initialData, onSave, onCancel, onCreateInvite }: TouchpointFormProps) {
  const [isCustomAction, setIsCustomAction] = useState(false);
  const [formData, setFormData] = useState<TouchpointFormData>({
    actionType: initialData?.actionType || 'coffee',
    customAction: initialData?.customAction || '',
    description: initialData?.description || '',
    channel: initialData?.channel || 'in_person',
    tone: initialData?.tone || 'friendly',
    date: initialData?.date || new Date(),
    time: initialData?.time || '14:00',
    duration: initialData?.duration || 60,
    location: initialData?.location || '',
    intention: initialData?.intention || '',
    isRecurring: initialData?.isRecurring || false,
    recurringFrequency: initialData?.recurringFrequency || 'monthly',
    calendarOption: initialData?.calendarOption || 'both',
  });

  const updateField = <K extends keyof TouchpointFormData>(
    field: K, 
    value: TouchpointFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Auto-suggest location based on channel
  const getLocationPlaceholder = () => {
    switch (formData.channel) {
      case 'in_person': return 'e.g., Blue Bottle Coffee, SoHo';
      case 'call': return 'e.g., Zoom, Google Meet';
      case 'email': return 'N/A';
      case 'dm': return 'N/A';
      default: return 'Enter location...';
    }
  };

  const selectedAction = actionTemplates.find(a => a.id === formData.actionType);

  return (
    <Card className="bg-card/60 backdrop-blur-md border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <CalendarIcon className="h-4 w-4 text-primary" />
          Create New Touchpoint
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Action Type */}
        <div className="space-y-2">
          <Label>Action Type</Label>
          <div className="flex gap-2">
            {!isCustomAction ? (
              <>
                <Select 
                  value={formData.actionType} 
                  onValueChange={(v) => updateField('actionType', v)}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select action type" />
                  </SelectTrigger>
                  <SelectContent>
                    {actionTemplates.map((action) => (
                      <SelectItem key={action.id} value={action.id}>
                        {action.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setIsCustomAction(true)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Input
                  value={formData.customAction}
                  onChange={(e) => updateField('customAction', e.target.value)}
                  placeholder="Custom action..."
                  className="flex-1"
                />
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => {
                    setIsCustomAction(false);
                    updateField('customAction', '');
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
          {selectedAction && !isCustomAction && (
            <p className="text-xs text-muted-foreground">{selectedAction.description}</p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label>Description (optional)</Label>
          <Input
            value={formData.description}
            onChange={(e) => updateField('description', e.target.value)}
            placeholder={`e.g., Coffee catch-up with ${contact.name}`}
          />
        </div>

        {/* Channel & Tone */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>Channel</Label>
            <Select 
              value={formData.channel} 
              onValueChange={(v) => updateField('channel', v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {touchpointChannels.map((channel) => (
                  <SelectItem key={channel.id} value={channel.id}>
                    {channel.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Tone</Label>
            <Select 
              value={formData.tone} 
              onValueChange={(v) => updateField('tone', v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {touchpointTones.map((tone) => (
                  <SelectItem key={tone.id} value={tone.id}>
                    {tone.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.date ? format(formData.date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.date}
                  onSelect={(date) => date && updateField('date', date)}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <Label>Time</Label>
            <Select 
              value={formData.time} 
              onValueChange={(v) => updateField('time', v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {timeOptions.map((time) => (
                  <SelectItem key={time.value} value={time.value}>
                    {time.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Duration & Location */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>Duration</Label>
            <Select 
              value={formData.duration.toString()} 
              onValueChange={(v) => updateField('duration', parseInt(v))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {durationOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value.toString()}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Location</Label>
            <Input
              value={formData.location}
              onChange={(e) => updateField('location', e.target.value)}
              placeholder={getLocationPlaceholder()}
              disabled={['email', 'dm', 'social_reply'].includes(formData.channel)}
            />
          </div>
        </div>

        {/* Intention */}
        <div className="space-y-2">
          <Label>Intention / Goal</Label>
          <Textarea
            value={formData.intention}
            onChange={(e) => updateField('intention', e.target.value)}
            placeholder="What do you want to achieve with this touchpoint?"
            className="min-h-[60px]"
          />
        </div>

        {/* Recurring */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Checkbox
              id="recurring"
              checked={formData.isRecurring}
              onCheckedChange={(checked) => updateField('isRecurring', !!checked)}
            />
            <Label htmlFor="recurring" className="text-sm cursor-pointer">
              Make recurring
            </Label>
          </div>
          {formData.isRecurring && (
            <Select 
              value={formData.recurringFrequency} 
              onValueChange={(v) => updateField('recurringFrequency', v)}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {recurringFrequencyOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Calendar Options */}
        <div className="p-3 rounded-lg bg-muted/30 border border-border/30 space-y-3">
          <Label className="flex items-center gap-2 text-sm">
            📧 Calendar Invite Options
          </Label>
          <RadioGroup 
            value={formData.calendarOption}
            onValueChange={(v) => updateField('calendarOption', v as TouchpointFormData['calendarOption'])}
            className="space-y-2"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="contact" id="invite-contact" />
              <Label htmlFor="invite-contact" className="text-sm font-normal cursor-pointer">
                Send calendar invite to {contact.name}
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="self" id="invite-self" />
              <Label htmlFor="invite-self" className="text-sm font-normal cursor-pointer">
                Add to my calendar only
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="both" id="invite-both" />
              <Label htmlFor="invite-both" className="text-sm font-normal cursor-pointer">
                Both (invite + my reminder)
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
          <Button 
            variant="secondary" 
            onClick={() => onSave(formData)}
            className="flex-1"
          >
            Save Touchpoint
          </Button>
          <Button 
            onClick={() => onCreateInvite(formData)}
            className="flex-1"
          >
            Create Invite
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
