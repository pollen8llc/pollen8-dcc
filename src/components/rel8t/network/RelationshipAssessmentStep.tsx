import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Users, UserPlus, Handshake, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AssessmentLevel {
  id: string;
  level: number; // Explicit level number (1-4) for DB storage and path logic
  label: string;
  description: string;
  startingTier: number;
  skippedTiers: number[];
  icon: React.ReactNode;
}

const ASSESSMENT_LEVELS: AssessmentLevel[] = [
  {
    id: "level_1",
    level: 1,
    label: "Level 1: Just Met",
    description: "New or minimal contact",
    startingTier: 1,
    skippedTiers: [],
    icon: <UserPlus className="h-5 w-5" />,
  },
  {
    id: "level_2",
    level: 2,
    label: "Level 2: Building Rapport",
    description: "Some interaction, still connecting",
    startingTier: 2,
    skippedTiers: [1],
    icon: <Users className="h-5 w-5" />,
  },
  {
    id: "level_3",
    level: 3,
    label: "Level 3: Established",
    description: "Regular, mutual understanding",
    startingTier: 3,
    skippedTiers: [1, 2],
    icon: <Handshake className="h-5 w-5" />,
  },
  {
    id: "level_4",
    level: 4,
    label: "Level 4: Close Bond",
    description: "Strong, long-term connection",
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
