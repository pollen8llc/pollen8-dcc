
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getOutreachStatusCounts } from "@/services/rel8t/outreachService";
import { getContactCount } from "@/services/rel8t/contactService";
import { Calendar, Users } from "lucide-react";
import { DistributionChart } from "@/components/rel8t/DistributionChart";
import { StatisticsChart } from "@/components/rel8t/StatisticsChart";
import { OutreachList } from "@/components/rel8t/OutreachList";

export function RelationshipAnalytics() {
  const { data: contactCount = 0 } = useQuery({
    queryKey: ["contact-count"],
    queryFn: getContactCount,
  });

  const { data: outreachCounts = { today: 0, upcoming: 0, overdue: 0, completed: 0 } } = useQuery({
    queryKey: ["outreach-counts"],
    queryFn: getOutreachStatusCounts,
  });

  // Sample data for charts
  const distributionData = [
    { name: "Today", value: outreachCounts.today, color: "#4338ca" },
    { name: "Upcoming", value: outreachCounts.upcoming, color: "#3b82f6" },
    { name: "Overdue", value: outreachCounts.overdue, color: "#ef4444" },
    { name: "Completed", value: outreachCounts.completed, color: "#10b981" },
  ];

  const statisticsData = [
    { name: "Mon", value: 4 },
    { name: "Tue", value: 7 },
    { name: "Wed", value: 5 },
    { name: "Thu", value: 8 },
    { name: "Fri", value: 12 },
    { name: "Sat", value: 3 },
    { name: "Sun", value: 1 },
  ];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <DistributionChart 
          data={distributionData}
          title="Contact Distribution"
        />
        
        <StatisticsChart 
          data={statisticsData}
          title="Outreach Statistics"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Calendar className="h-8 w-8 mr-3 text-primary" />
              <div className="text-2xl font-bold">{outreachCounts.today || 0}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Calendar className="h-8 w-8 mr-3 text-primary" />
              <div className="text-2xl font-bold">{outreachCounts.upcoming}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Overdue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Calendar className="h-8 w-8 mr-3 text-destructive" />
              <div className="text-2xl font-bold">{outreachCounts.overdue}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Contacts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-8 w-8 mr-3 text-primary" />
              <div className="text-2xl font-bold">{contactCount}</div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-4">Recent Completed Outreach</h3>
        <OutreachList defaultTab="completed" showTabs={false} limit={5} />
      </div>
    </>
  );
}
