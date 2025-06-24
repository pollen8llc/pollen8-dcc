
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const RequestList: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Requests</CardTitle>
      </CardHeader>
      <CardContent>
        <p>No requests available</p>
      </CardContent>
    </Card>
  );
};

export default RequestList;
