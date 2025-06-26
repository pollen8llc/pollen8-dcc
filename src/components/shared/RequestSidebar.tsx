
import React from 'react';
import { ServiceRequest } from '@/types/modul8';
import { RequestParticipants } from './RequestParticipants';
import { RequestDetails } from './RequestDetails';

interface RequestSidebarProps {
  serviceRequest: ServiceRequest;
  serviceProvider?: any;
  currentUserRole?: 'organizer' | 'service_provider' | 'viewer';
  children?: React.ReactNode;
}

export const RequestSidebar: React.FC<RequestSidebarProps> = ({
  serviceRequest,
  serviceProvider,
  currentUserRole,
  children
}) => {
  return (
    <div className="lg:col-span-1 space-y-6">
      {children}
      <RequestParticipants 
        serviceRequest={serviceRequest}
        serviceProvider={serviceProvider}
        currentUserRole={currentUserRole}
      />
      <RequestDetails serviceRequest={serviceRequest} />
    </div>
  );
};
