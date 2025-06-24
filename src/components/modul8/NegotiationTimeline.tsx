
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ServiceRequest } from '@/types/modul8';

interface NegotiationTimelineProps {
  serviceRequest?: ServiceRequest;
  serviceRequestId?: string;
  className?: string;
}

const NegotiationTimeline: React.FC<NegotiationTimelineProps> = ({ 
  serviceRequest, 
  serviceRequestId, 
  className 
}) => {
  const requestId = serviceRequest?.id || serviceRequestId;
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Negotiation Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Timeline for service request: {requestId}</p>
        <p>Negotiation timeline functionality coming soon...</p>
      </CardContent>
    </Card>
  );
};

export default NegotiationTimeline;
