
import React from 'react';
import { ServiceRequest } from '@/types/modul8';
import { RequestHeader as SharedRequestHeader } from '@/components/shared/RequestHeader';

interface RequestHeaderProps {
  serviceRequest: ServiceRequest;
  onBack: () => void;
  currentUserRole?: 'organizer' | 'service_provider' | 'viewer';
}

const RequestHeader: React.FC<RequestHeaderProps> = ({ 
  serviceRequest, 
  onBack, 
  currentUserRole = 'organizer' 
}) => {
  return (
    <SharedRequestHeader 
      serviceRequest={serviceRequest}
      onBack={onBack}
      platformLabel="MODUL-8 Project Management"
      showServiceProviderBadge={currentUserRole === 'service_provider'}
    />
  );
};

export default RequestHeader;
