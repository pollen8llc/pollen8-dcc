import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { 
  ClipboardList, 
  ThumbsUp, 
  Minus, 
  ThumbsDown,
  Flame,
  Check,
  Moon,
  CalendarCheck,
  CalendarX,
  HelpCircle,
  TrendingUp,
  ArrowRight,
  TrendingDown,
  Save,
  X,
  Plus,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface StructuredNotes {
  interaction_outcome?: 'positive' | 'neutral' | 'negative';
  energy_level?: 'high' | 'medium' | 'low';
  followup_booked?: 'yes' | 'no' | 'maybe';
  followup_date?: string;
  core_interests?: string[];
  action_items?: string;
  rapport_progress?: 'strengthened' | 'maintained' | 'declined';
  free_notes?: string;
}

// Helper function to check if required notes are complete
export const areNotesComplete = (notes: StructuredNotes): boolean => {
  return !!(notes.interaction_outcome && notes.rapport_progress);
};

interface StructuredNotesFormProps {
  initialNotes?: StructuredNotes;
  onSave: (notes: StructuredNotes) => Promise<void>;
  isSaving?: boolean;
  disabled?: boolean;
}

const SUGGESTED_INTERESTS = [
  "Technology", "Business", "Finance", "Health", 
  "Travel", "Arts", "Sports", "Networking"
];

export function StructuredNotesForm({ 
  initialNotes, 
  onSave, 
  isSaving = false,
  disabled = false 
}: StructuredNotesFormProps) {
  const [notes, setNotes] = useState<StructuredNotes>(initialNotes || {});
  const [newInterest, setNewInterest] = useState("");
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (initialNotes) {
      setNotes(initialNotes);
      setHasChanges(false);
    }
  }, [initialNotes]);

  const updateField = <K extends keyof StructuredNotes>(
    field: K, 
    value: StructuredNotes[K]
  ) => {
    setNotes(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const addInterest = (interest: string) => {
    const trimmed = interest.trim();
    if (!trimmed) return;
    const currentInterests = notes.core_interests || [];
    if (!currentInterests.includes(trimmed)) {
      updateField('core_interests', [...currentInterests, trimmed]);
    }
    setNewInterest("");
  };

  const removeInterest = (interest: string) => {
    const currentInterests = notes.core_interests || [];
    updateField('core_interests', currentInterests.filter(i => i !== interest));
  };

  const handleSave = async () => {
    await onSave(notes);
    setHasChanges(false);
  };

  const RadioOption = ({ 
    selected, 
    onClick, 
    icon: Icon, 
    label, 
    variant 
  }: { 
    selected: boolean; 
    onClick: () => void; 
    icon: React.ElementType; 
    label: string;
    variant: 'positive' | 'neutral' | 'negative' | 'default';
  }) => {
    const variantStyles = {
      positive: selected 
        ? "bg-green-500/20 border-green-500/50 text-green-400" 
        : "hover:bg-green-500/10 hover:border-green-500/30",
      neutral: selected 
        ? "bg-yellow-500/20 border-yellow-500/50 text-yellow-400" 
        : "hover:bg-yellow-500/10 hover:border-yellow-500/30",
      negative: selected 
        ? "bg-red-500/20 border-red-500/50 text-red-400" 
        : "hover:bg-red-500/10 hover:border-red-500/30",
      default: selected 
        ? "bg-primary/20 border-primary/50 text-primary" 
        : "hover:bg-primary/10 hover:border-primary/30",
    };

    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={cn(
          "flex flex-col items-center gap-1.5 p-3 rounded-lg border border-border/50 transition-all",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          variantStyles[variant]
        )}
      >
        <Icon className="h-5 w-5" />
        <span className="text-xs font-medium">{label}</span>
      </button>
    );
  };

  return (
    <Card className="glass-morphism bg-card/80 backdrop-blur-sm border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <ClipboardList className="h-5 w-5 text-primary" />
          Post-Outreach Feedback
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Interaction Outcome */}
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">
            How did it go? <span className="text-destructive">*</span>
          </Label>
          <div className="grid grid-cols-3 gap-2">
            <RadioOption
              selected={notes.interaction_outcome === 'positive'}
              onClick={() => updateField('interaction_outcome', 'positive')}
              icon={ThumbsUp}
              label="Positive"
              variant="positive"
            />
            <RadioOption
              selected={notes.interaction_outcome === 'neutral'}
              onClick={() => updateField('interaction_outcome', 'neutral')}
              icon={Minus}
              label="Neutral"
              variant="neutral"
            />
            <RadioOption
              selected={notes.interaction_outcome === 'negative'}
              onClick={() => updateField('interaction_outcome', 'negative')}
              icon={ThumbsDown}
              label="Negative"
              variant="negative"
            />
          </div>
        </div>

        {/* Energy Level */}
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">Their Energy Level</Label>
          <div className="grid grid-cols-3 gap-2">
            <RadioOption
              selected={notes.energy_level === 'high'}
              onClick={() => updateField('energy_level', 'high')}
              icon={Flame}
              label="High"
              variant="positive"
            />
            <RadioOption
              selected={notes.energy_level === 'medium'}
              onClick={() => updateField('energy_level', 'medium')}
              icon={Check}
              label="Medium"
              variant="neutral"
            />
            <RadioOption
              selected={notes.energy_level === 'low'}
              onClick={() => updateField('energy_level', 'low')}
              icon={Moon}
              label="Low"
              variant="negative"
            />
          </div>
        </div>

        {/* Follow-up Booked */}
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">Follow-up Booked?</Label>
          <div className="grid grid-cols-3 gap-2">
            <RadioOption
              selected={notes.followup_booked === 'yes'}
              onClick={() => updateField('followup_booked', 'yes')}
              icon={CalendarCheck}
              label="Yes"
              variant="positive"
            />
            <RadioOption
              selected={notes.followup_booked === 'no'}
              onClick={() => updateField('followup_booked', 'no')}
              icon={CalendarX}
              label="No"
              variant="negative"
            />
            <RadioOption
              selected={notes.followup_booked === 'maybe'}
              onClick={() => updateField('followup_booked', 'maybe')}
              icon={HelpCircle}
              label="Maybe"
              variant="neutral"
            />
          </div>
          
          {notes.followup_booked === 'yes' && (
            <div className="mt-3">
              <Label className="text-xs text-muted-foreground mb-1.5 block">Follow-up Date</Label>
              <DatePicker
                value={notes.followup_date ? new Date(notes.followup_date) : undefined}
                onChange={(date) => updateField('followup_date', date?.toISOString().split('T')[0])}
                disabled={disabled}
              />
            </div>
          )}
        </div>

        {/* Core Interests */}
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">Core Interests</Label>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {(notes.core_interests || []).map((interest) => (
              <Badge 
                key={interest} 
                variant="secondary" 
                className="gap-1 pr-1"
              >
                {interest}
                <button
                  type="button"
                  onClick={() => removeInterest(interest)}
                  disabled={disabled}
                  className="ml-1 hover:bg-muted rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              placeholder="Add interest..."
              disabled={disabled}
              className="flex-1"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addInterest(newInterest);
                }
              }}
            />
            <Button 
              type="button" 
              size="sm" 
              variant="outline"
              onClick={() => addInterest(newInterest)}
              disabled={disabled || !newInterest.trim()}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {SUGGESTED_INTERESTS
              .filter(i => !(notes.core_interests || []).includes(i))
              .slice(0, 4)
              .map((interest) => (
                <Badge 
                  key={interest}
                  variant="outline"
                  className="cursor-pointer hover:bg-muted/50 text-xs"
                  onClick={() => !disabled && addInterest(interest)}
                >
                  + {interest}
                </Badge>
              ))}
          </div>
        </div>

        {/* Action Items */}
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">Action Items / Next Steps</Label>
          <Textarea
            value={notes.action_items || ''}
            onChange={(e) => updateField('action_items', e.target.value)}
            placeholder="e.g., Send article about X, Intro to Y, Follow up on project..."
            disabled={disabled}
            className="min-h-[80px] resize-none"
          />
        </div>

        {/* Rapport Progress */}
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">
            Rapport Progress <span className="text-destructive">*</span>
          </Label>
          <div className="grid grid-cols-3 gap-2">
            <RadioOption
              selected={notes.rapport_progress === 'strengthened'}
              onClick={() => updateField('rapport_progress', 'strengthened')}
              icon={TrendingUp}
              label="Strengthened"
              variant="positive"
            />
            <RadioOption
              selected={notes.rapport_progress === 'maintained'}
              onClick={() => updateField('rapport_progress', 'maintained')}
              icon={ArrowRight}
              label="Maintained"
              variant="neutral"
            />
            <RadioOption
              selected={notes.rapport_progress === 'declined'}
              onClick={() => updateField('rapport_progress', 'declined')}
              icon={TrendingDown}
              label="Declined"
              variant="negative"
            />
          </div>
        </div>

        {/* Free Notes */}
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">Additional Notes</Label>
          <Textarea
            value={notes.free_notes || ''}
            onChange={(e) => updateField('free_notes', e.target.value)}
            placeholder="Any other observations, insights, or things to remember..."
            disabled={disabled}
            className="min-h-[100px] resize-none"
          />
        </div>

        {/* Save Button */}
        <Button
          onClick={handleSave}
          disabled={disabled || isSaving || !hasChanges}
          className="w-full"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Feedback
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
