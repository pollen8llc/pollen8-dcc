import React, { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  getOutreach,
  OutreachFilterTab
} from "@/services/rel8t/outreachService";
import { supabase } from "@/integrations/supabase/client";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Loader2, Calendar, CalendarDays, X } from "lucide-react";
import { OutreachCard } from "./OutreachCard";
import { isSameDay, startOfDay, format } from "date-fns";
import { useIsMobile } from "@/hooks/use-mobile";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface OutreachListProps {
  maxItems?: number;
  showTabs?: boolean;
  defaultTab?: OutreachFilterTab;
  className?: string;
  showCalendar?: boolean;
}

const filterOptions = [
  { value: "all", label: "All", color: "bg-primary/20 border-primary/40 text-primary hover:bg-primary/30" },
  { value: "today", label: "Today", color: "bg-blue-500/20 border-blue-500/40 text-blue-400 hover:bg-blue-500/30" },
  { value: "upcoming", label: "Upcoming", color: "bg-emerald-500/20 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/30" },
  { value: "overdue", label: "Overdue", color: "bg-red-500/20 border-red-500/40 text-red-400 hover:bg-red-500/30" },
  { value: "completed", label: "Completed", color: "bg-amber-500/20 border-amber-500/40 text-amber-400 hover:bg-amber-500/30" },
];

const OutreachList = ({ 
  maxItems, 
  showTabs = true, 
  defaultTab = "all", 
  className = "",
  showCalendar = false
}: OutreachListProps) => {
  const [activeFilter, setActiveFilter] = useState<OutreachFilterTab>(defaultTab);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const isMobile = useIsMobile();
  
  // Query to fetch outreach data based on active filter
  const { data: outreachItems = [], isLoading, refetch } = useQuery({
    queryKey: ["outreach", activeFilter],
    queryFn: () => getOutreach(activeFilter),
    placeholderData: (previousData) => previousData,
    refetchOnMount: true,
    staleTime: 0,
  });

  // Real-time subscription for outreach changes
  useEffect(() => {
    const channel = supabase
      .channel('outreach-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'rms_outreach'
        },
        (payload) => {
          console.log('📬 Real-time outreach update:', payload);
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  // Count tasks per date
  const taskCountsByDate = useMemo(() => {
    const counts = new Map<string, number>();
    outreachItems.forEach(item => {
      if (item.due_date) {
        const dateKey = startOfDay(new Date(item.due_date)).toISOString();
        counts.set(dateKey, (counts.get(dateKey) || 0) + 1);
      }
    });
    return counts;
  }, [outreachItems]);

  // Filter items by selected date if a date is selected, sort newest first
  const filteredItems = useMemo(() => {
    let items = outreachItems;
    if (selectedDate) {
      items = items.filter(item => 
        item.due_date && isSameDay(new Date(item.due_date), selectedDate)
      );
    }
    // Sort by created_at descending (newest first)
    return [...items].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [outreachItems, selectedDate]);

  // Get sorted dates with tasks for mobile list view
  const datesWithTasks = useMemo(() => {
    const dateMap = new Map<string, { date: Date; count: number }>();
    outreachItems.forEach(item => {
      if (item.due_date) {
        const date = startOfDay(new Date(item.due_date));
        const dateKey = date.toISOString();
        if (dateMap.has(dateKey)) {
          dateMap.get(dateKey)!.count++;
        } else {
          dateMap.set(dateKey, { date, count: 1 });
        }
      }
    });
    return Array.from(dateMap.values()).sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [outreachItems]);

  // Display specific number of items if maxItems is provided
  const displayedItems = maxItems ? filteredItems.slice(0, maxItems) : filteredItems;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2 className="animate-spin h-6 w-6 mr-2" /> 
        Loading outreach data...
      </div>
    );
  }

  // Custom day content renderer with task counts
  const renderDayContent = (date: Date) => {
    const dateKey = startOfDay(date).toISOString();
    const count = taskCountsByDate.get(dateKey);
    
    if (!count) return <>{date.getDate()}</>;
    
    return (
      <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
        <span className="relative z-10 pointer-events-none">{date.getDate()}</span>
        <div className="absolute top-0 right-0 min-w-[16px] md:min-w-[18px] h-[16px] md:h-[18px] rounded-full bg-white flex items-center justify-center shadow-sm pointer-events-none">
          <span className="text-[9px] md:text-[10px] font-bold text-black px-0.5 md:px-1 pointer-events-none">{count}</span>
        </div>
      </div>
    );
  };

  const handleClearDate = () => {
    setSelectedDate(undefined);
  };

  return (
    <div className={className}>
      {/* Filter Buttons */}
      {showTabs && (
        <div className="space-y-4 mb-6">
          {/* Selected Date Badge */}
          {selectedDate && !showCalendar && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Filtering by:</span>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/20 border border-primary/40 text-primary text-sm">
                {format(selectedDate, "MMM d, yyyy")}
                <button
                  onClick={handleClearDate}
                  className="hover:bg-primary/30 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            </div>
          )}

          {/* Collapsible Calendar */}
          {showCalendar && (
            <div className="glass-morphism bg-gradient-to-br from-card/90 to-card/60 backdrop-blur-xl border border-primary/30 rounded-xl p-3 md:p-6 shadow-xl animate-in slide-in-from-top-2 duration-300">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3 md:mb-4">
                <h3 className="text-xs md:text-sm font-medium text-muted-foreground">
                  {selectedDate ? `Showing tasks for ${selectedDate.toLocaleDateString()}` : 'Select a date to filter tasks'}
                </h3>
                {selectedDate && (
                  <button
                    onClick={handleClearDate}
                    className="text-xs text-primary hover:underline min-h-[44px] md:min-h-0 flex items-center touch-manipulation"
                  >
                    Clear filter
                  </button>
                )}
              </div>
              
              {/* Desktop/Tablet: Calendar Grid */}
              {!isMobile && (
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  components={{
                    DayContent: ({ date }) => renderDayContent(date)
                  }}
                  className="w-full mx-auto border-0"
                />
              )}
              
              {/* Mobile: List View */}
              {isMobile && (
                <div className="space-y-2">
                  <Dialog open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full min-h-[44px] justify-start touch-manipulation glassmorphic">
                        <CalendarDays className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, 'EEEE, MMMM d, yyyy') : 'Pick a date'}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="h-[100dvh] w-full max-w-full sm:max-w-[425px] sm:h-auto backdrop-blur-xl bg-card/90 border-primary/30 p-6">
                      <DialogHeader className="text-center">
                        <DialogTitle className="text-lg font-semibold">Select a date</DialogTitle>
                      </DialogHeader>
                      <div className="max-h-[60vh] overflow-y-auto space-y-2 pr-2">
                        {datesWithTasks.length === 0 ? (
                          <p className="text-center text-muted-foreground text-sm py-8">No scheduled tasks</p>
                        ) : (
                          datesWithTasks.map(({ date, count }) => {
                            const isSelected = selectedDate && isSameDay(date, selectedDate);
                            return (
                              <button
                                key={date.toISOString()}
                                onClick={() => {
                                  setSelectedDate(isSelected ? undefined : date);
                                  setIsCalendarOpen(false);
                                }}
                                className={`w-full flex items-center justify-between p-4 rounded-lg transition-all touch-manipulation min-h-[56px] backdrop-blur-md ${
                                  isSelected 
                                    ? 'bg-primary/90 text-primary-foreground shadow-lg border border-primary' 
                                    : 'bg-card/50 hover:bg-card/70 border border-primary/20'
                                }`}
                              >
                                <span className="font-medium text-left">{format(date, 'EEEE, MMMM d, yyyy')}</span>
                                <span className={`min-w-[28px] h-[28px] rounded-full flex items-center justify-center text-xs font-bold shadow-sm ${
                                  isSelected ? 'bg-primary-foreground text-primary' : 'bg-primary text-primary-foreground'
                                }`}>
                                  {count}
                                </span>
                              </button>
                            );
                          })
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </div>
          )}

          {/* Filter Grid - 5 button grid */}
          <div className="grid grid-cols-5 gap-2">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setActiveFilter(option.value as OutreachFilterTab)}
                className={cn(
                  "flex items-center justify-center px-2 py-2.5 text-xs sm:text-sm font-medium rounded-lg border transition-all duration-200",
                  activeFilter === option.value
                    ? cn(option.color, "shadow-md ring-1 ring-white/10")
                    : "bg-muted/30 border-border/30 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Outreach List */}
      {renderOutreachContent()}
    </div>
  );

  function renderOutreachContent() {
    if (displayedItems.length === 0) {
      const emptyMessage = selectedDate 
        ? `No outreach tasks on ${selectedDate.toLocaleDateString()}`
        : activeFilter === "completed" 
          ? "You haven't completed any outreach tasks yet." 
          : "No scheduled outreach tasks for this period.";
      
      return (
        <div className="text-center py-12 border border-dashed rounded-xl">
          <Calendar className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
          <h3 className="text-lg font-medium">No outreach tasks</h3>
          <p className="text-muted-foreground mt-2">{emptyMessage}</p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {displayedItems.map((outreach) => (
          <OutreachCard key={outreach.id} outreach={outreach} />
        ))}
      </div>
    );
  }
};

export default OutreachList;
