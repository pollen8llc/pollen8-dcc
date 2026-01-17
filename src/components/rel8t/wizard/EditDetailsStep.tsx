import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Outreach } from "@/services/rel8t/outreachService";
import { format, parseISO } from "date-fns";
import { Calendar as CalendarIcon, RotateCcw, Check } from "lucide-react";
import { cn } from "@/lib/utils";

type FlipState = 'none' | 'date';

interface EditDetailsStepProps {
  outreach: Outreach;
  onNext: (data: {
    title: string;
    description: string;
    dueDate: string;
    priority: "low" | "medium" | "high";
  }) => void;
}

export const EditDetailsStep: React.FC<EditDetailsStepProps> = ({
  outreach,
  onNext,
}) => {
  const [title, setTitle] = useState(outreach.title);
  const [description, setDescription] = useState(outreach.description || "");
  const [selectedDate, setSelectedDate] = useState<Date>(
    parseISO(outreach.due_date)
  );
  const [priority, setPriority] = useState<"low" | "medium" | "high">(
    outreach.priority
  );
  const [flipState, setFlipState] = useState<FlipState>('none');

  const handleNext = () => {
    onNext({ 
      title, 
      description, 
      dueDate: format(selectedDate, "yyyy-MM-dd"), 
      priority 
    });
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  return (
    <div 
      className="relative w-full"
      style={{ perspective: "1500px" }}
    >
      <div
        className={cn(
          "relative w-full transition-transform duration-700 ease-in-out",
          "[transform-style:preserve-3d]",
          flipState === 'date' ? "min-h-[460px] sm:min-h-[500px]" : "min-h-0",
          flipState === 'date' && "[transform:rotateX(180deg)]"
        )}
      >
        {/* Front Face - Form */}
        <div
          className={cn(
            "w-full",
            "[backface-visibility:hidden]",
            flipState !== 'none' && "absolute inset-0 pointer-events-none"
          )}
        >
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add details about this outreach task..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Due Date</Label>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setFlipState('date')}
                  className={cn(
                    "w-full justify-start text-left font-normal h-10",
                    "border-primary/30 hover:bg-primary/5 hover:border-primary/50"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                  {format(selectedDate, "PPP")}
                </Button>
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button onClick={handleNext} disabled={!title}>
                Next
              </Button>
            </div>
          </div>
        </div>

        {/* Back Face - Calendar */}
        {flipState === 'date' && (
          <Card 
            className={cn(
              "absolute top-0 left-0 right-0 backdrop-blur-md bg-card/95 border-2 border-primary/10 rounded-2xl shadow-xl",
              "[backface-visibility:hidden] [transform:rotateX(180deg)]"
            )}
          >
            <CardContent className="p-3 sm:p-4 flex flex-col">
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-2 sm:mb-4 flex-shrink-0">
                <div className="min-w-0 flex-1">
                  <h2 className="text-base sm:text-lg font-semibold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    Select Date
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 truncate">
                    {format(selectedDate, "PPP")}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setFlipState('none')}
                  className="backdrop-blur-sm bg-background/50 border-primary/30 gap-1 sm:gap-2 text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3 flex-shrink-0"
                >
                  <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4" />
                  Back
                </Button>
              </div>

              {/* Calendar */}
              <div className="flex items-center justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  fixedWeeks
                  disabled={(date) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return date < today;
                  }}
                  className="pointer-events-auto"
                />
              </div>

              {/* Confirm Button */}
              <div className="pt-2 sm:pt-4 border-t border-primary/20 flex justify-end flex-shrink-0">
                <Button
                  type="button"
                  size="sm"
                  onClick={() => setFlipState('none')}
                  className="backdrop-blur-sm shadow-lg h-8 sm:h-9 text-xs sm:text-sm"
                >
                  <Check className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Confirm
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
