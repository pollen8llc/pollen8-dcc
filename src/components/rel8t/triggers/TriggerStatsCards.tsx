
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
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pending Emails</p>
              <h3 className="text-2xl font-bold">{pendingEmails}</h3>
              <p className="text-xs text-muted-foreground mt-1">Waiting to be sent</p>
            </div>
            <Clock className="h-8 w-8 text-amber-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Sent Emails</p>
              <h3 className="text-2xl font-bold">{sentEmails}</h3>
              <p className="text-xs text-muted-foreground mt-1">Successfully delivered</p>
            </div>
            <Check className="h-8 w-8 text-green-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Triggers</p>
              <h3 className="text-2xl font-bold">{activeTriggers}</h3>
              <p className="text-xs text-muted-foreground mt-1">Time-based automations</p>
            </div>
            <Calendar className="h-8 w-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
