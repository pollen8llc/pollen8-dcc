import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Users, UserPlus, Handshake, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AssessmentLevel {
  id: string;
  label: string;
  description: string;
  startingTier: number;
  skippedTiers: number[];
  icon: React.ReactNode;
}

const ASSESSMENT_LEVELS: AssessmentLevel[] = [
  {
    id: "just_met",
    label: "Just met / Acquaintance",
    description: "We've recently connected or had minimal interaction",
    startingTier: 1,
    skippedTiers: [],
    icon: <UserPlus className="h-5 w-5" />,
  },
  {
    id: "few_conversations",
    label: "We've had a few conversations",
    description: "Some back-and-forth but still building rapport",
    startingTier: 2,
    skippedTiers: [1],
    icon: <Users className="h-5 w-5" />,
  },
  {
    id: "established",
    label: "We have an established relationship",
    description: "Regular communication and mutual understanding",
    startingTier: 3,
    skippedTiers: [1, 2],
    icon: <Handshake className="h-5 w-5" />,
  },
  {
    id: "close",
    label: "Close / Long-term relationship",
    description: "Strong bond built over time",
    startingTier: 4,
    skippedTiers: [1, 2, 3],
    icon: <Heart className="h-5 w-5" />,
  },
];

const tierLabels: Record<number, string> = {
  1: "Foundation",
  2: "Growth",
  3: "Professional",
  4: "Advanced",
};

interface RelationshipAssessmentStepProps {
  contactName: string;
  onSelect: (level: AssessmentLevel) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function RelationshipAssessmentStep({
  contactName,
  onSelect,
  onCancel,
  isLoading = false,
}: RelationshipAssessmentStepProps) {
  const [selectedLevel, setSelectedLevel] = useState<string>("");

  const handleContinue = () => {
    const level = ASSESSMENT_LEVELS.find((l) => l.id === selectedLevel);
    if (level) {
      onSelect(level);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold">
          How well do you know {contactName}?
        </h2>
        <p className="text-sm text-muted-foreground">
          This helps us recommend the right development path for your relationship
        </p>
      </div>

      <RadioGroup
        value={selectedLevel}
        onValueChange={setSelectedLevel}
        className="space-y-3"
      >
        {ASSESSMENT_LEVELS.map((level) => {
          const isSelected = selectedLevel === level.id;
          return (
            <div
              key={level.id}
              className={cn(
                "flex items-start space-x-4 rounded-xl border p-4 cursor-pointer transition-all",
                "hover:border-primary/50 hover:bg-primary/5",
                isSelected
                  ? "border-primary bg-primary/10 ring-2 ring-primary/20"
                  : "border-border/50 bg-card/50"
              )}
              onClick={() => setSelectedLevel(level.id)}
            >
              <RadioGroupItem value={level.id} id={level.id} className="mt-1" />
              <div className="flex-1">
                <Label
                  htmlFor={level.id}
                  className="cursor-pointer flex items-center gap-3"
                >
                  <div
                    className={cn(
                      "h-10 w-10 rounded-full flex items-center justify-center transition-colors",
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {level.icon}
                  </div>
                  <div className="flex-1">
                    <span className="font-medium text-foreground block">
                      {level.label}
                    </span>
                    <span className="text-xs text-muted-foreground block mt-0.5">
                      {level.description}
                    </span>
                  </div>
                </Label>

                {/* Tier Preview */}
                <div className="mt-3 flex items-center gap-1.5">
                  {[1, 2, 3, 4].map((tier) => {
                    const isSkipped = level.skippedTiers.includes(tier);
                    const isCurrent = tier === level.startingTier;
                    const isFuture = tier > level.startingTier;

                    return (
                      <div key={tier} className="flex-1 space-y-1">
                        <div
                          className={cn(
                            "h-2 rounded-full transition-colors",
                            isSkipped && "bg-amber-500",
                            isCurrent && "bg-primary",
                            isFuture && "bg-muted"
                          )}
                        />
                        <span
                          className={cn(
                            "text-[9px] block text-center",
                            isSkipped && "text-amber-600 dark:text-amber-400",
                            isCurrent && "text-primary font-medium",
                            isFuture && "text-muted-foreground"
                          )}
                        >
                          {tierLabels[tier]}
                        </span>
                      </div>
                    );
                  })}
                </div>
                {level.skippedTiers.length > 0 && (
                  <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1.5">
                    Tiers {level.skippedTiers.join(", ")} will be marked as already passed
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </RadioGroup>

      <div className="flex gap-3 pt-2">
        {onCancel && (
          <Button variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
        )}
        <Button
          onClick={handleContinue}
          disabled={!selectedLevel || isLoading}
          className="flex-1"
        >
          {isLoading ? "Setting up..." : "Continue"}
        </Button>
      </div>
    </div>
  );
}

export { ASSESSMENT_LEVELS };
