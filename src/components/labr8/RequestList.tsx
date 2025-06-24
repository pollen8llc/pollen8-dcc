
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const RequestList: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Requests</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">No requests at the moment</p>
      </CardContent>
    </Card>
  );
};

export default RequestList;
