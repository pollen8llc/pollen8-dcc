
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

/**
 * @deprecated This component is maintained for backward compatibility.
 * Community functionality has been removed from the platform.
 */
const ManagedCommunitiesGrid: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Managed Communities</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center p-4">
          <AlertTriangle className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-center">
            Community functionality has been removed from the platform
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ManagedCommunitiesGrid;
