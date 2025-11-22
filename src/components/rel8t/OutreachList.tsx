import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  getOutreach,
  OutreachFilterTab
} from "@/services/rel8t/outreachService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Loader2, Calendar } from "lucide-react";
import { OutreachCard } from "./OutreachCard";

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
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  // Query to fetch outreach data based on active tab
  const { data: outreachItems = [], isLoading } = useQuery({
    queryKey: ["outreach", activeTab],
    queryFn: () => getOutreach(activeTab),
    placeholderData: (previousData) => previousData,
  });

  // Display specific number of items if maxItems is provided
  const displayedItems = maxItems ? outreachItems.slice(0, maxItems) : outreachItems;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2 className="animate-spin h-6 w-6 mr-2" /> 
        Loading outreach data...
      </div>
    );
  }

  // Get dates with scheduled outreach
  const rapportDates = outreachItems
    .filter(item => item.due_date)
    .map(item => new Date(item.due_date!));

  // Custom modifier to highlight rapport days
  const modifiers = {
    rapport: rapportDates,
  };

  const modifiersClassNames = {
    rapport: "bg-[#00eada]/20 text-[#00eada] font-bold hover:bg-[#00eada]/30",
  };

  return (
    <div className={className}>
      {showTabs && (
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as OutreachFilterTab)}>
          {/* Calendar - Full Width Responsive */}
          <div className="glass-morphism bg-gradient-to-br from-card/90 to-card/60 backdrop-blur-xl border border-primary/30 rounded-xl p-4 md:p-6 mb-6 shadow-xl">
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              modifiers={modifiers}
              modifiersClassNames={modifiersClassNames}
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
      return (
        <div className="text-center py-12 border border-dashed rounded-xl">
          <Calendar className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
          <h3 className="text-lg font-medium">No outreach tasks</h3>
          <p className="text-muted-foreground mt-2">
            {activeTab === "completed" 
              ? "You haven't completed any outreach tasks yet." 
              : "No scheduled outreach tasks for this period."}
          </p>
        </div>
      );
    }

    return displayedItems.map((outreach) => (
      <OutreachCard key={outreach.id} outreach={outreach} />
    ));
  }
};

export default OutreachList;
