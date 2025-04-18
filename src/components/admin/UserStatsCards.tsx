
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface UserStats {
  total: number;
  admins: number;
  organizers: number;
}

interface UserStatsCardsProps {
  userStats: UserStats;
}

const UserStatsCards = ({ userStats }: UserStatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Total Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{userStats.total}</div>
          <p className="text-xs text-muted-foreground mt-1">All active accounts</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Administrators</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{userStats.admins}</div>
          <p className="text-xs text-muted-foreground mt-1">With full system access</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Organizers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{userStats.organizers}</div>
          <p className="text-xs text-muted-foreground mt-1">Community managers</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserStatsCards;
