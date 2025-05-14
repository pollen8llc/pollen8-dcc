
import { Users, AlertCircle, UserCheck, Zap, Calendar } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getContactCount } from "@/services/rel8t/contactService";
import { getOutreachStatusCounts } from "@/services/rel8t/outreachService";
import { getActiveTriggerCount } from "@/services/rel8t/triggerService";
import { MetricCard } from "@/components/rel8t/MetricCard";
import { useNavigate } from "react-router-dom";

export function DashboardMetrics() {
  const navigate = useNavigate();

  // Get metrics data
  const { data: contactCount = 0, isLoading: contactCountLoading } = useQuery({
    queryKey: ["contact-count"],
    queryFn: getContactCount,
  });

  const { data: outreachCounts = { today: 0, upcoming: 0, overdue: 0, completed: 0 }, isLoading: outreachCountsLoading } = useQuery({
    queryKey: ["outreach-counts"],
    queryFn: getOutreachStatusCounts,
  });

  const { data: activeTriggerCount = 0, isLoading: triggerCountLoading } = useQuery({
    queryKey: ["trigger-count"],
    queryFn: getActiveTriggerCount,
  });

  // Calculate dynamic progress values
  const contactsWithoutOutreachCount = 
    Math.max(0, Number(contactCount) - 
      (Number(outreachCounts.today) + 
       Number(outreachCounts.upcoming) + 
       Number(outreachCounts.overdue) + 
       Number(outreachCounts.completed)));
  
  const outreachProgress = Number(contactCount) > 0 
    ? Math.min(100, 100 - Math.round((Number(contactsWithoutOutreachCount) / Number(contactCount)) * 100))
    : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <MetricCard
        title="Total Contacts"
        value={contactCountLoading ? "-" : contactCount}
        description={contactCountLoading ? undefined : `${contactCount} People in your network`}
        icon={<Users className="h-5 w-5" />}
        progress={75}
        isLoading={contactCountLoading}
        onActionClick={() => navigate("/rel8t/contacts")}
      />
      
      <MetricCard
        title="Today's Outreach"
        value={outreachCountsLoading ? "-" : outreachCounts.today}
        description="Due today"
        icon={<Calendar className="h-5 w-5" />}
        color={outreachCounts.today > 0 ? "warning" : "default"}
        isLoading={outreachCountsLoading}
      />
      
      <MetricCard
        title="Inactive Contacts"
        value={contactsWithoutOutreachCount}
        description={contactsWithoutOutreachCount === 1 ? "needs connection" : "need connections"}
        icon={<AlertCircle className="h-5 w-5" />}
        color={contactsWithoutOutreachCount > 0 ? "warning" : "success"}
        progress={outreachProgress}
        isLoading={outreachCountsLoading || contactCountLoading}
      />
      
      <MetricCard
        title="Active Triggers"
        value={triggerCountLoading ? "-" : activeTriggerCount}
        description="Automation rules"
        icon={<Zap className="h-5 w-5" />}
        isLoading={triggerCountLoading}
      />
    </div>
  );
}
