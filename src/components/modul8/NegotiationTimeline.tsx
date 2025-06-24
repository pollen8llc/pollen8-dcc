
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface NegotiationTimelineProps {
  serviceRequestId: string;
}

const NegotiationTimeline: React.FC<NegotiationTimelineProps> = ({ serviceRequestId }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Negotiation Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Timeline for service request: {serviceRequestId}</p>
        <p>Negotiation timeline functionality coming soon...</p>
      </CardContent>
    </Card>
  );
};

export default NegotiationTimeline;
