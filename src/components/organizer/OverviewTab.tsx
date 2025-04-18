
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Community } from "@/models/types";

interface OverviewTabProps {
  isLoading: boolean;
  managedCommunities: Community[] | undefined;
}

const OverviewTab = ({ isLoading, managedCommunities }: OverviewTabProps) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Overview</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        ) : managedCommunities?.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">You haven't created any communities yet</p>
            <Button 
              onClick={() => navigate("/create-community")}
              variant="outline"
            >
              Create Your First Community
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{managedCommunities?.length}</CardTitle>
                <p className="text-sm text-muted-foreground">Communities</p>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">
                  {managedCommunities?.filter(c => c.isPublic).length || 0}
                </CardTitle>
                <p className="text-sm text-muted-foreground">Public Communities</p>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">
                  {managedCommunities?.filter(c => !c.isPublic).length || 0}
                </CardTitle>
                <p className="text-sm text-muted-foreground">Private Communities</p>
              </CardHeader>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OverviewTab;
