
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Check, Calendar } from "lucide-react";

interface TriggerStatsCardsProps {
  pendingEmails: number;
  sentEmails: number;
  activeTriggers: number;
}

export function TriggerStatsCards({ 
  pendingEmails, 
  sentEmails, 
  activeTriggers 
}: TriggerStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pending Emails</p>
              <h3 className="text-2xl font-bold">{pendingEmails}</h3>
            </div>
            <Clock className="h-6 w-6 text-amber-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Sent Emails</p>
              <h3 className="text-2xl font-bold">{sentEmails}</h3>
            </div>
            <Check className="h-6 w-6 text-green-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Reminders</p>
              <h3 className="text-2xl font-bold">{activeTriggers}</h3>
            </div>
            <Calendar className="h-6 w-6 text-blue-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
