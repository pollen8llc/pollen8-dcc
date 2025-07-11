
import React from 'react';
import { ServiceRequest } from '@/types/modul8';
import { RequestHeader as SharedRequestHeader } from '@/components/shared/RequestHeader';

interface RequestHeaderProps {
  serviceRequest: ServiceRequest;
  onBack: () => void;
}

const RequestHeader: React.FC<RequestHeaderProps> = ({ serviceRequest, onBack }) => {
  return (
    <SharedRequestHeader 
      serviceRequest={serviceRequest}
      onBack={onBack}
      platformLabel="LAB-R8 Negotiation Flow"
      showServiceProviderBadge={true}
    />
  );
};

export default RequestHeader;
