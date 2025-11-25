
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Contact } from "@/services/rel8t/contactService";
import { Label } from "@/components/ui/label";
import { Check, AlertCircle, Flag, CalendarIcon, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { getTriggers, Trigger } from "@/services/rel8t/triggerService";
import { format } from "date-fns";

interface SelectTriggersStepProps {
  selectedContacts: Contact[];
  onNext: (data: { triggers: Trigger[], priority: 'low' | 'medium' | 'high' }) => void;
  onPrevious?: () => void;
  initialSelectedTrigger?: Trigger | null;
}

export const SelectTriggersStep: React.FC<SelectTriggersStepProps> = ({
  selectedContacts,
  onNext,
  onPrevious,
  initialSelectedTrigger,
}) => {
  const [selectedTriggers, setSelectedTriggers] = useState<Trigger[]>([]);
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  // Auto-select the trigger returned from creation
  useEffect(() => {
    if (initialSelectedTrigger) {
      setSelectedTriggers(prev => {
        const alreadySelected = prev.some(t => t.id === initialSelectedTrigger.id);
        if (!alreadySelected) {
          return [...prev, initialSelectedTrigger];
        }
        return prev;
      });
    }
  }, [initialSelectedTrigger]);

  const navigate = useNavigate();

  // Fetch actual triggers from database
  const { data: triggers = [], isLoading } = useQuery({
    queryKey: ["triggers"],
    queryFn: getTriggers,
  });

  const toggleTrigger = (trigger: Trigger) => {
    setSelectedTriggers((prev) => {
      const isSelected = prev.some((t) => t.id === trigger.id);
      if (isSelected) {
        return prev.filter((t) => t.id !== trigger.id);
      } else {
        return [...prev, trigger];
      }
    });
  };

  const handleSubmit = () => {
    onNext({ triggers: selectedTriggers, priority });
  };

  // Format the execution date display
  const formatExecutionDate = (trigger: Trigger) => {
    if (!trigger.execution_time) {
      return "No date set";
    }
    
    const executionDate = new Date(trigger.execution_time);
    
    try {
      if (trigger.recurrence_pattern) {
        const pattern = trigger.recurrence_pattern;
        const frequency = pattern.frequency ? `every ${pattern.frequency} ` : "every ";
        return `${format(executionDate, "MMM d, yyyy")} (${frequency}${pattern.type})`;
      } else {
        return format(executionDate, "MMM d, yyyy 'at' h:mm a");
      }
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Invalid date";
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Set Relationship Priority</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Choose the priority level for these contacts to help organize your relationship management
        </p>
        
        <RadioGroup 
          value={priority} 
          onValueChange={(value) => setPriority(value as 'low' | 'medium' | 'high')}
          className="flex flex-col sm:flex-row gap-4"
        >
          <div className={`flex items-center space-x-2 border rounded-md p-4 cursor-pointer transition-colors ${
            priority === 'low' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-border/40 hover:bg-muted/50'
          }`}>
            <RadioGroupItem value="low" id="low" />
            <Label 
              htmlFor="low" 
              className={`cursor-pointer flex items-center gap-2 font-medium ${
                priority === 'low' ? 'text-blue-600 dark:text-blue-400' : ''
              }`}
            >
              <Flag className="h-4 w-4 text-blue-500" /> Low Priority
            </Label>
          </div>
          <div className={`flex items-center space-x-2 border rounded-md p-4 cursor-pointer transition-colors ${
            priority === 'medium' ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20' : 'border-border/40 hover:bg-muted/50'
          }`}>
            <RadioGroupItem value="medium" id="medium" />
            <Label 
              htmlFor="medium" 
              className={`cursor-pointer flex items-center gap-2 font-medium ${
                priority === 'medium' ? 'text-amber-600 dark:text-amber-400' : ''
              }`}
            >
              <Flag className="h-4 w-4 text-amber-500" /> Medium Priority
            </Label>
          </div>
          <div className={`flex items-center space-x-2 border rounded-md p-4 cursor-pointer transition-colors ${
            priority === 'high' ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-border/40 hover:bg-muted/50'
          }`}>
            <RadioGroupItem value="high" id="high" />
            <Label 
              htmlFor="high" 
              className={`cursor-pointer flex items-center gap-2 font-medium ${
                priority === 'high' ? 'text-red-600 dark:text-red-400' : ''
              }`}
            >
              <Flag className="h-4 w-4 text-red-500" /> High Priority
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium mb-2">Add Reminders</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Select reminders to help you stay in touch with 
            {selectedContacts.length === 1 
              ? " this contact" 
              : ` these ${selectedContacts.length} contacts`}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/rel8/triggers/new?returnTo=relationship")}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create New Trigger
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading reminders...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {triggers.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <AlertCircle className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">No reminders available</p>
              <p className="text-sm text-muted-foreground mt-1">
                Create triggers in Settings to use here
              </p>
            </div>
          ) : (
            triggers.map((trigger) => {
              const isSelected = selectedTriggers.some((t) => t.id === trigger.id);
              return (
                <Card
                  key={trigger.id}
                  className={`cursor-pointer transition-colors ${
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "hover:bg-muted/50 border-border/30"
                  }`}
                  onClick={() => toggleTrigger(trigger)}
                >
                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base">{trigger.name}</CardTitle>
                      {isSelected ? (
                        <Check className="h-5 w-5 text-primary" />
                      ) : null}
                    </div>
                    <CardDescription>{trigger.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="outline" className="flex items-center gap-1">
                        <CalendarIcon className="h-3 w-3" />
                        {formatExecutionDate(trigger)}
                      </Badge>
                      <Badge variant="secondary">
                        {trigger.action.replace(/_/g, ' ')}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      )}

      <div className="flex justify-between pt-6">
        {onPrevious && (
          <Button variant="outline" onClick={onPrevious}>
            Back
          </Button>
        )}
        <Button onClick={handleSubmit}>
          Continue
        </Button>
      </div>
    </div>
  );
};
