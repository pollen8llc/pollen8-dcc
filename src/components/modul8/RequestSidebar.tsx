
import React from 'react';
import { ServiceRequest } from '@/types/modul8';
import { RequestSidebar as SharedRequestSidebar } from '@/components/shared/RequestSidebar';
import NegotiationTimeline from './NegotiationTimeline';

interface RequestSidebarProps {
  serviceRequest: ServiceRequest;
  serviceProvider?: any;
  currentUserRole?: 'organizer' | 'service_provider' | 'viewer';
  showTimeline?: boolean;
}

const RequestSidebar: React.FC<RequestSidebarProps> = ({ 
  serviceRequest, 
  serviceProvider, 
  currentUserRole = 'organizer',
  showTimeline = true 
}) => {
  return (
    <SharedRequestSidebar 
      serviceRequest={serviceRequest}
      serviceProvider={serviceProvider}
      currentUserRole={currentUserRole}
    >
      {showTimeline && (
        <NegotiationTimeline 
          serviceRequest={serviceRequest}
          className="sticky top-8"
        />
      )}
    </SharedRequestSidebar>
  );
};

export default RequestSidebar;
