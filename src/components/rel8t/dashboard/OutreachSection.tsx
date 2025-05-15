
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, CheckCircle2, AlertTriangle, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getOutreach, getOutreachStatusCounts } from "@/services/rel8t/outreachService";
import OutreachList from "@/components/rel8t/OutreachList";

export const OutreachSection = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("today");

  // Get outreach data counts
  const { data: outreachCounts = { today: 0, upcoming: 0, overdue: 0, completed: 0 }, isLoading: countsLoading } = useQuery({
    queryKey: ["outreach-counts"],
    queryFn: getOutreachStatusCounts,
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-medium">Relationship Activities</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate("/rel8/relationships")}
        >
          View All
        </Button>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Today</CardTitle>
              <div className="h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <Calendar className="h-3 w-3 text-blue-600 dark:text-blue-300" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-2xl font-bold">
              {countsLoading ? "-" : outreachCounts.today}
            </p>
            <p className="text-xs text-muted-foreground">
              Activities due today
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
              <div className="h-6 w-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <Clock className="h-3 w-3 text-green-600 dark:text-green-300" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-2xl font-bold">
              {countsLoading ? "-" : outreachCounts.upcoming}
            </p>
            <p className="text-xs text-muted-foreground">
              Future activities
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Overdue</CardTitle>
              <div className="h-6 w-6 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                <AlertTriangle className="h-3 w-3 text-amber-600 dark:text-amber-300" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-2xl font-bold">
              {countsLoading ? "-" : outreachCounts.overdue}
            </p>
            <p className="text-xs text-muted-foreground">
              Needs attention
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <div className="h-6 w-6 rounded-full bg-violet-100 dark:bg-violet-900 flex items-center justify-center">
                <CheckCircle2 className="h-3 w-3 text-violet-600 dark:text-violet-300" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-2xl font-bold">
              {countsLoading ? "-" : outreachCounts.completed}
            </p>
            <p className="text-xs text-muted-foreground">
              Activities done
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="today" className="relative">
              Today
              {outreachCounts.today > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-[18px] h-[18px] rounded-full bg-primary text-[10px] text-primary-foreground px-1">
                  {outreachCounts.today}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="relative">
              Upcoming
              {outreachCounts.upcoming > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-[18px] h-[18px] rounded-full bg-blue-600 text-[10px] text-white px-1">
                  {outreachCounts.upcoming}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="overdue" className="relative">
              Needs Attention
              {outreachCounts.overdue > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-[18px] h-[18px] rounded-full bg-red-600 text-[10px] text-white px-1">
                  {outreachCounts.overdue}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/rel8/wizard')}
            className="flex items-center gap-1"
          >
            <Plus className="h-3.5 w-3.5" /> New
          </Button>
        </div>
        
        <TabsContent value="today">
          <OutreachList maxItems={3} defaultTab="today" showTabs={false} />
        </TabsContent>
        
        <TabsContent value="upcoming">
          <OutreachList maxItems={3} defaultTab="upcoming" showTabs={false} />
        </TabsContent>
        
        <TabsContent value="overdue">
          <OutreachList maxItems={3} defaultTab="overdue" showTabs={false} />
        </TabsContent>
      </Tabs>
      
      <Button 
        variant="outline"
        className="w-full"
        onClick={() => navigate("/rel8/relationships")}
      >
        View All Relationship Activities
      </Button>
    </div>
  );
};
