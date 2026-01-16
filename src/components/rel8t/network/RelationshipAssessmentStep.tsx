import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  useRelationshipLevels, 
  useTierLabels, 
  getIconComponent,
  RelationshipLevel,
} from "@/hooks/useRelationshipLevels";

// Re-export the database type as AssessmentLevel for backward compatibility
export type AssessmentLevel = RelationshipLevel;

// Legacy export for backward compatibility - now fetched from DB
export const ASSESSMENT_LEVELS: AssessmentLevel[] = [];

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
  const [selectedLevelId, setSelectedLevelId] = useState<string>("");
  
  // Fetch from database
  const { data: levels = [], isLoading: levelsLoading } = useRelationshipLevels();
  const tierLabels = useTierLabels();

  const handleContinue = () => {
    const level = levels.find((l) => l.id === selectedLevelId);
    if (level) {
      onSelect(level);
    }
  };

  if (levelsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

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
        value={selectedLevelId}
        onValueChange={setSelectedLevelId}
        className="space-y-3"
      >
        {levels.map((level) => {
          const isSelected = selectedLevelId === level.id;
          const IconComponent = getIconComponent(level.icon_name);
          
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
              onClick={() => setSelectedLevelId(level.id)}
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
                    <IconComponent className="h-5 w-5" />
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
                    const isSkipped = level.skipped_tiers.includes(tier);
                    const isCurrent = tier === level.starting_tier;
                    const isFuture = tier > level.starting_tier;

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
                {level.skipped_tiers.length > 0 && (
                  <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1.5">
                    Tiers {level.skipped_tiers.join(", ")} will be marked as already passed
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
          disabled={!selectedLevelId || isLoading}
          className="flex-1"
        >
          {isLoading ? "Setting up..." : "Continue"}
        </Button>
      </div>
    </div>
  );
}
