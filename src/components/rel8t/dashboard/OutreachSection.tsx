
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OutreachList } from "@/components/rel8t/OutreachList";
import { OutreachFilterType } from "@/components/rel8t/OutreachList";

export function OutreachSection() {
  const [activeTab, setActiveTab] = useState<OutreachFilterType>("today");

  return (
    <>
      <h2 className="text-lg font-medium mb-4">Relationship Management</h2>
      <Tabs 
        value={activeTab} 
        onValueChange={(value) => setActiveTab(value as OutreachFilterType)} 
        className="mb-6"
      >
        <TabsList className="mb-4">
          <TabsTrigger value="today" className="relative">
            Today
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="relative">
            Upcoming
          </TabsTrigger>
          <TabsTrigger value="overdue" className="relative">
            Needs Attention
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed
          </TabsTrigger>
        </TabsList>
        
        <OutreachList defaultTab={activeTab} showTabs={false} />
      </Tabs>
    </>
  );
}
