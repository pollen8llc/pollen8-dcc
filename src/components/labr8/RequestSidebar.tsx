
import React from 'react';
import { ServiceRequest } from '@/types/modul8';
import { RequestSidebar as SharedRequestSidebar } from '@/components/shared/RequestSidebar';

interface RequestSidebarProps {
  serviceRequest: ServiceRequest;
  serviceProvider?: any;
}

const RequestSidebar: React.FC<RequestSidebarProps> = ({ serviceRequest, serviceProvider }) => {
  return (
    <SharedRequestSidebar 
      serviceRequest={serviceRequest}
      serviceProvider={serviceProvider}
      currentUserRole="service_provider"
    />
  );
};

export default RequestSidebar;
