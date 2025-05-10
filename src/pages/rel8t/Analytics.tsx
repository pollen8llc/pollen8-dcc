
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/rel8t/MetricCard";
import { DistributionChart } from "@/components/rel8t/DistributionChart";
import { StatisticsChart } from "@/components/rel8t/StatisticsChart";
import { Users, CalendarClock, CheckCheck, AlertCircle } from "lucide-react";
import { getContactCount, getContactsByCommunityCounts } from "@/services/rel8t/contactService";
import { getOutreachStatusCounts } from "@/services/rel8t/outreachService";

const Analytics = () => {
  // Get metrics data
  const { data: contactCount = 0 } = useQuery({
    queryKey: ["contact-count"],
    queryFn: getContactCount,
  });

  const { data: outreachCounts = { today: 0, upcoming: 0, overdue: 0, completed: 0 } } = useQuery({
    queryKey: ["outreach-counts"],
    queryFn: getOutreachStatusCounts,
  });
  
  const { data: communityCounts = [] } = useQuery({
    queryKey: ["community-contact-counts"],
    queryFn: getContactsByCommunityCounts
  });

  // Prepare data for charts
  const outreachStatusData = [
    { name: "Today", value: Number(outreachCounts.today), color: "#f59e0b" },
    { name: "Upcoming", value: Number(outreachCounts.upcoming), color: "#3b82f6" },
    { name: "Overdue", value: Number(outreachCounts.overdue), color: "#ef4444" },
    { name: "Completed", value: Number(outreachCounts.completed), color: "#10b981" },
  ].filter(item => item.value > 0);

  const communityDistributionData = communityCounts.map((item, index) => {
    // Generate a unique color for each community
    const colors = [
      "#3b82f6", "#10b981", "#f59e0b", "#6366f1", 
      "#ec4899", "#8b5cf6", "#14b8a6", "#f43f5e"
    ];
    return {
      name: item.communityName,
      value: item.count,
      color: colors[index % colors.length]
    };
  });

  // Sample data for demonstration purposes
  // In a real app, this would come from the backend
  const monthlyOutreachData = [
    { name: "Jan", value: 5 },
    { name: "Feb", value: 8 },
    { name: "Mar", value: 12 },
    { name: "Apr", value: 10 },
    { name: "May", value: 14 },
    { name: "Jun", value: 20 },
  ];

  const monthlyContactsData = [
    { name: "Jan", value: 3 },
    { name: "Feb", value: 5 },
    { name: "Mar", value: 7 },
    { name: "Apr", value: 12 },
    { name: "May", value: 18 },
    { name: "Jun", value: 24 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Track and analyze your relationship metrics
          </p>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MetricCard
            title="Total Contacts"
            value={contactCount}
            icon={<Users className="h-5 w-5" />}
          />
          
          <MetricCard
            title="Outreach Due"
            value={outreachCounts.today + outreachCounts.overdue}
            icon={<CalendarClock className="h-5 w-5" />}
            color={outreachCounts.overdue > 0 ? "danger" : outreachCounts.today > 0 ? "warning" : "default"}
          />
          
          <MetricCard
            title="Completed Outreach"
            value={outreachCounts.completed}
            icon={<CheckCheck className="h-5 w-5" />}
            color="success"
          />
          
          <MetricCard
            title="Needs Attention"
            value={outreachCounts.overdue}
            icon={<AlertCircle className="h-5 w-5" />}
            color={outreachCounts.overdue > 0 ? "danger" : "success"}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <StatisticsChart
            title="Outreach Completed Over Time"
            data={monthlyOutreachData}
            color="var(--primary)"
            xAxisLabel="Month"
            yAxisLabel="Outreach"
          />
          
          <StatisticsChart
            title="Contact Growth"
            data={monthlyContactsData}
            color="#10b981"
            xAxisLabel="Month"
            yAxisLabel="New Contacts"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {outreachStatusData.length > 0 && (
            <DistributionChart
              title="Outreach Status Distribution"
              data={outreachStatusData}
            />
          )}
          
          {communityDistributionData.length > 0 && (
            <DistributionChart
              title="Contact Community Distribution"
              data={communityDistributionData}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
