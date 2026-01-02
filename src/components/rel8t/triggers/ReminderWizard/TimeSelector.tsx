import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface TimeSelectorProps {
  value: string;
  onChange: (time: string) => void;
  className?: string;
}

const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
const minutes = ['00', '15', '30', '45'];

export function TimeSelector({ value, onChange, className }: TimeSelectorProps) {
  const [hour, minute] = value ? value.split(':') : ['09', '00'];
  const hourNum = parseInt(hour);
  const isPM = hourNum >= 12;
  const displayHour = hourNum === 0 ? '12' : hourNum > 12 ? (hourNum - 12).toString().padStart(2, '0') : hour;
  
  const [selectedHour, setSelectedHour] = useState(displayHour);
  const [selectedMinute, setSelectedMinute] = useState(minute);
  const [selectedPeriod, setSelectedPeriod] = useState<'AM' | 'PM'>(isPM ? 'PM' : 'AM');
  
  const hourRef = useRef<HTMLDivElement>(null);
  const minuteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Convert to 24h and update
    let h = parseInt(selectedHour);
    if (selectedPeriod === 'PM' && h !== 12) h += 12;
    if (selectedPeriod === 'AM' && h === 12) h = 0;
    const newTime = `${h.toString().padStart(2, '0')}:${selectedMinute}`;
    if (newTime !== value) {
      onChange(newTime);
    }
  }, [selectedHour, selectedMinute, selectedPeriod, onChange, value]);

  return (
    <div className={cn("flex gap-2 items-center", className)}>
      {/* Hour Selector */}
      <div className="flex-1">
        <div 
          ref={hourRef}
          className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory"
        >
          {hours.map((h) => (
            <button
              key={h}
              type="button"
              onClick={() => setSelectedHour(h)}
              className={cn(
                "snap-center shrink-0 w-12 h-12 rounded-xl text-lg font-semibold",
                "transition-all duration-200 active:scale-95",
                selectedHour === h
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                  : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              {h}
            </button>
          ))}
        </div>
      </div>

      <span className="text-2xl font-light text-muted-foreground">:</span>

      {/* Minute Selector */}
      <div className="flex gap-1.5">
        {minutes.map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setSelectedMinute(m)}
            className={cn(
              "w-12 h-12 rounded-xl text-lg font-semibold",
              "transition-all duration-200 active:scale-95",
              selectedMinute === m
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            {m}
          </button>
        ))}
      </div>

      {/* AM/PM Toggle */}
      <div className="flex flex-col gap-1">
        {(['AM', 'PM'] as const).map((period) => (
          <button
            key={period}
            type="button"
            onClick={() => setSelectedPeriod(period)}
            className={cn(
              "w-12 h-[22px] rounded-lg text-xs font-bold",
              "transition-all duration-200 active:scale-95",
              selectedPeriod === period
                ? "bg-primary text-primary-foreground"
                : "bg-secondary/30 text-muted-foreground hover:bg-secondary/50"
            )}
          >
            {period}
          </button>
        ))}
      </div>
    </div>
  );
}
