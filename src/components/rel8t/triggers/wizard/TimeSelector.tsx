import { useState } from "react";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface TimeSelectorProps {
  selectedTime: string;
  onTimeChange: (time: string) => void;
}

const PRESET_TIMES = [
  { label: "9 AM", value: "09:00" },
  { label: "10 AM", value: "10:00" },
  { label: "12 PM", value: "12:00" },
  { label: "2 PM", value: "14:00" },
  { label: "5 PM", value: "17:00" },
  { label: "7 PM", value: "19:00" },
];

const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES = ["00", "15", "30", "45"];

export function TimeSelector({ selectedTime, onTimeChange }: TimeSelectorProps) {
  const [customDialogOpen, setCustomDialogOpen] = useState(false);
  const [customHour, setCustomHour] = useState("9");
  const [customMinute, setCustomMinute] = useState("00");
  const [customPeriod, setCustomPeriod] = useState<"AM" | "PM">("AM");

  const formatTimeDisplay = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${period}`;
  };

  const isPresetSelected = (presetValue: string) => selectedTime === presetValue;
  
  const isCustomTime = !PRESET_TIMES.some(t => t.value === selectedTime);

  const handleCustomTimeConfirm = () => {
    let hour = parseInt(customHour);
    if (customPeriod === "PM" && hour !== 12) hour += 12;
    if (customPeriod === "AM" && hour === 12) hour = 0;
    const timeValue = `${hour.toString().padStart(2, "0")}:${customMinute}`;
    onTimeChange(timeValue);
    setCustomDialogOpen(false);
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground/80">What time?</label>
      
      <div className="flex flex-wrap gap-2">
        {PRESET_TIMES.map((time) => (
          <button
            key={time.value}
            onClick={() => onTimeChange(time.value)}
            className={cn(
              "px-4 py-2.5 rounded-xl text-sm font-medium",
              "border-2 transition-all duration-200",
              "hover:scale-105",
              isPresetSelected(time.value)
                ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/25"
                : "bg-background/60 backdrop-blur-sm border-border/50 hover:border-primary/50"
            )}
          >
            {time.label}
          </button>
        ))}

        <Dialog open={customDialogOpen} onOpenChange={setCustomDialogOpen}>
          <DialogTrigger asChild>
            <button
              className={cn(
                "px-4 py-2.5 rounded-xl text-sm font-medium",
                "border-2 border-dashed transition-all duration-200",
                "flex items-center gap-2",
                "hover:scale-105",
                isCustomTime
                  ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/25"
                  : "bg-background/40 backdrop-blur-sm border-border/50 hover:border-primary/50"
              )}
            >
              <Clock className="h-4 w-4" />
              {isCustomTime ? formatTimeDisplay(selectedTime) : "Custom"}
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[340px]">
            <DialogHeader>
              <DialogTitle>Select Time</DialogTitle>
            </DialogHeader>
            
            <div className="py-6">
              <div className="flex items-center justify-center gap-4">
                {/* Hour selector */}
                <div className="flex flex-col items-center gap-2">
                  <span className="text-xs text-muted-foreground">Hour</span>
                  <div className="grid grid-cols-4 gap-1.5">
                    {HOURS.map((hour) => (
                      <button
                        key={hour}
                        onClick={() => setCustomHour(hour.toString())}
                        className={cn(
                          "w-10 h-10 rounded-lg text-sm font-medium transition-all",
                          customHour === hour.toString()
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted/50 hover:bg-muted"
                        )}
                      >
                        {hour}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Minute selector */}
                <div className="flex flex-col items-center gap-2">
                  <span className="text-xs text-muted-foreground">Min</span>
                  <div className="flex flex-col gap-1.5">
                    {MINUTES.map((minute) => (
                      <button
                        key={minute}
                        onClick={() => setCustomMinute(minute)}
                        className={cn(
                          "w-12 h-10 rounded-lg text-sm font-medium transition-all",
                          customMinute === minute
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted/50 hover:bg-muted"
                        )}
                      >
                        :{minute}
                      </button>
                    ))}
                  </div>
                </div>

                {/* AM/PM toggle */}
                <div className="flex flex-col items-center gap-2">
                  <span className="text-xs text-muted-foreground">Period</span>
                  <div className="flex flex-col gap-1.5">
                    {(["AM", "PM"] as const).map((period) => (
                      <button
                        key={period}
                        onClick={() => setCustomPeriod(period)}
                        className={cn(
                          "w-12 h-10 rounded-lg text-sm font-medium transition-all",
                          customPeriod === period
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted/50 hover:bg-muted"
                        )}
                      >
                        {period}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div className="mt-6 text-center">
                <div className="text-3xl font-bold text-foreground">
                  {customHour}:{customMinute} {customPeriod}
                </div>
              </div>
            </div>

            <Button onClick={handleCustomTimeConfirm} className="w-full">
              Confirm Time
            </Button>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
