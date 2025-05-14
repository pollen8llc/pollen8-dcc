
import { MetricCard } from "@/components/rel8t/MetricCard";
import { 
  Users, 
  AlertCircle, 
  Calendar, 
  Zap
} from "lucide-react";

interface DashboardMetricsProps {
  contactCount: number;
  outreachCounts: {
    today: number;
    upcoming: number;
    overdue: number;
    completed: number;
  };
  activeTriggerCount: number;
  contactsWithoutOutreachCount: number;
  outreachProgress: number;
  isLoading: {
    contactCount: boolean;
    outreachCounts: boolean;
    triggerCount: boolean;
  };
  onContactClick?: () => void;
}

export const DashboardMetrics: React.FC<DashboardMetricsProps> = ({
  contactCount,
  outreachCounts,
  activeTriggerCount,
  contactsWithoutOutreachCount,
  outreachProgress,
  isLoading,
  onContactClick
}) => {
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <MetricCard
        title="Total Contacts"
        value={isLoading.contactCount ? "-" : contactCount}
        description={isLoading.contactCount ? undefined : `${contactCount} People in your network`}
        icon={<Users className="h-5 w-5" />}
        progress={75}
        isLoading={isLoading.contactCount}
        onActionClick={onContactClick}
      />
      
      <MetricCard
        title="Today's Outreach"
        value={isLoading.outreachCounts ? "-" : outreachCounts.today}
        description="Due today"
        icon={<Calendar className="h-5 w-5" />}
        color={outreachCounts.today > 0 ? "warning" : "default"}
        isLoading={isLoading.outreachCounts}
      />
      
      <MetricCard
        title="Inactive Contacts"
        value={contactsWithoutOutreachCount}
        description={contactsWithoutOutreachCount === 1 ? "needs connection" : "need connections"}
        icon={<AlertCircle className="h-5 w-5" />}
        color={contactsWithoutOutreachCount > 0 ? "warning" : "success"}
        progress={outreachProgress}
        isLoading={isLoading.outreachCounts || isLoading.contactCount}
      />
      
      <MetricCard
        title="Active Triggers"
        value={isLoading.triggerCount ? "-" : activeTriggerCount}
        description="Automation rules"
        icon={<Zap className="h-5 w-5" />}
        isLoading={isLoading.triggerCount}
      />
    </div>
  );
};
