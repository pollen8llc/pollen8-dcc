import React, { useState, useMemo, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  getOutreach,
  OutreachFilterTab
} from "@/services/rel8t/outreachService";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Loader2, Calendar } from "lucide-react";
import { OutreachCard } from "./OutreachCard";
import { isSameDay, startOfDay } from "date-fns";

interface OutreachListProps {
  maxItems?: number;
  showTabs?: boolean;
  defaultTab?: OutreachFilterTab;
  className?: string;
}

const OutreachList = ({ 
  maxItems, 
  showTabs = true, 
  defaultTab = "upcoming", 
  className = "" 
}: OutreachListProps) => {
  const [activeTab, setActiveTab] = useState<OutreachFilterTab>(defaultTab);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  
  // Query to fetch outreach data based on active tab
  const { data: outreachItems = [], isLoading, refetch } = useQuery({
    queryKey: ["outreach", activeTab],
    queryFn: () => getOutreach(activeTab),
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

  // Filter items by selected date if a date is selected
  const filteredItems = useMemo(() => {
    if (!selectedDate) {
      return outreachItems;
    }
    return outreachItems.filter(item => 
      item.due_date && isSameDay(new Date(item.due_date), selectedDate)
    );
  }, [outreachItems, selectedDate]);

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
      <div className="relative w-full h-full flex items-center justify-center">
        <span className="relative z-10">{date.getDate()}</span>
        <div className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-white flex items-center justify-center shadow-sm">
          <span className="text-[10px] font-bold text-black px-1">{count}</span>
        </div>
      </div>
    );
  };

  return (
    <div className={className}>
      {showTabs && (
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as OutreachFilterTab)}>
          {/* Calendar - Full Width Responsive */}
          <div className="glass-morphism bg-gradient-to-br from-card/90 to-card/60 backdrop-blur-xl border border-primary/30 rounded-xl p-4 md:p-6 mb-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                {selectedDate ? `Showing tasks for ${selectedDate.toLocaleDateString()}` : 'Select a date to filter tasks'}
              </h3>
              {selectedDate && (
                <button
                  onClick={() => setSelectedDate(undefined)}
                  className="text-xs text-primary hover:underline"
                >
                  Clear filter
                </button>
              )}
            </div>
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              components={{
                DayContent: ({ date }) => renderDayContent(date)
              }}
              className="w-full mx-auto border-0 pointer-events-auto"
            />
          </div>

          <TabsList className="grid grid-cols-3 mb-6 backdrop-blur-sm bg-muted/50">
            <TabsTrigger value="upcoming" className="data-[state=active]:bg-background">
              Upcoming
            </TabsTrigger>
            <TabsTrigger value="overdue" className="data-[state=active]:bg-background">
              Overdue
            </TabsTrigger>
            <TabsTrigger value="completed" className="data-[state=active]:bg-background">
              Completed
            </TabsTrigger>
          </TabsList>
          
          {(["upcoming", "overdue", "completed"] as OutreachFilterTab[]).map(tab => (
            <TabsContent key={tab} value={tab} className="mt-0 animate-fade-in">
              {renderOutreachContent()}
            </TabsContent>
          ))}
        </Tabs>
      )}

      {!showTabs && renderOutreachContent()}
    </div>
  );

  function renderOutreachContent() {
    if (displayedItems.length === 0) {
      const emptyMessage = selectedDate 
        ? `No outreach tasks on ${selectedDate.toLocaleDateString()}`
        : activeTab === "completed" 
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

    return displayedItems.map((outreach) => (
      <OutreachCard key={outreach.id} outreach={outreach} />
    ));
  }
};

export default OutreachList;
