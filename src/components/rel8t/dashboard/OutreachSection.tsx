
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, UserCheck } from "lucide-react";
import OutreachList from "@/components/rel8t/OutreachList";
import { ActivitySummaryCards } from "@/components/rel8t/ActivitySummaryCards";

interface OutreachSectionProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  outreach: any[];
  outreachCounts: {
    today: number;
    upcoming: number;
    overdue: number;
    completed: number;
  };
  contactCount: number;
  outreachLoading: boolean;
  setOutreachDialogOpen: (open: boolean) => void;
}

export const OutreachSection: React.FC<OutreachSectionProps> = ({
  activeTab,
  setActiveTab,
  outreach,
  outreachCounts,
  contactCount,
  outreachLoading,
  setOutreachDialogOpen
}) => {
  return (
    <>
      <h2 className="text-xl font-medium mb-4">Relationship Management</h2>
      
      {/* Activity Summary Cards */}
      <ActivitySummaryCards 
        counts={{
          today: outreachCounts.today,
          upcoming: outreachCounts.upcoming,
          overdue: outreachCounts.overdue,
          contacts: contactCount
        }}
        isLoading={outreachLoading}
      />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="mb-4">
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
          <TabsTrigger value="completed">
            Completed
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="today">
          {outreachLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : outreach.length === 0 ? (
            <div className="text-center py-12 border border-dashed rounded-lg">
              <Calendar className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-2 font-semibold">No outreach for today</h3>
              <p className="text-sm text-muted-foreground mt-1">
                You don't have any relationship outreach scheduled for today.
              </p>
              <Button onClick={() => setOutreachDialogOpen(true)} className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Build a Relationship
              </Button>
            </div>
          ) : (
            <OutreachList outreach={outreach} />
          )}
        </TabsContent>
        
        <TabsContent value="upcoming">
          {outreachLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : outreach.length === 0 ? (
            <div className="text-center py-12 border border-dashed rounded-lg">
              <Calendar className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-2 font-semibold">No upcoming outreach</h3>
              <p className="text-sm text-muted-foreground mt-1">
                You don't have any upcoming relationship outreach scheduled.
              </p>
              <Button onClick={() => setOutreachDialogOpen(true)} className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Build a Relationship
              </Button>
            </div>
          ) : (
            <OutreachList outreach={outreach} />
          )}
        </TabsContent>
        
        <TabsContent value="overdue">
          {outreachLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : outreach.length === 0 ? (
            <div className="text-center py-12 border border-dashed rounded-lg">
              <UserCheck className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-2 font-semibold">No overdue outreach</h3>
              <p className="text-sm text-muted-foreground mt-1">
                You're all caught up with your relationships!
              </p>
            </div>
          ) : (
            <OutreachList outreach={outreach} />
          )}
        </TabsContent>
        
        <TabsContent value="completed">
          {outreachLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : outreach.length === 0 ? (
            <div className="text-center py-12 border border-dashed rounded-lg">
              <Calendar className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-2 font-semibold">No completed outreach</h3>
              <p className="text-sm text-muted-foreground mt-1">
                You haven't completed any relationship outreach yet.
              </p>
              <Button onClick={() => setOutreachDialogOpen(true)} className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Build a Relationship
              </Button>
            </div>
          ) : (
            <OutreachList outreach={outreach} />
          )}
        </TabsContent>
      </Tabs>
    </>
  );
};
