
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ActivityFeed: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Feed</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">No recent activity</p>
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;
