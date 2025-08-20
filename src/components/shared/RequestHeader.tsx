
import React from 'react';
import { ArrowLeft, Building } from 'lucide-react';
import { BackButton } from "@/components/shared/BackButton";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ServiceRequest } from '@/types/modul8';
import { RequestStatusBadge } from './RequestStatusBadge';

interface RequestHeaderProps {
  serviceRequest: ServiceRequest;
  onBack: () => void;
  platformLabel?: string;
  showServiceProviderBadge?: boolean;
  compact?: boolean;
}

export const RequestHeader: React.FC<RequestHeaderProps> = ({
  serviceRequest,
  onBack,
  platformLabel = 'LAB-R8',
  showServiceProviderBadge = false,
  compact = false
}) => {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 ${compact ? 'mb-4 sm:mb-6' : 'mb-8'}`}>
      <BackButton
        onClick={onBack}
        label="Back to Dashboard"
        className="self-start"
      />
      
      <div className="flex-1 min-w-0">
        <h1 className={`${compact ? 'text-xl sm:text-2xl' : 'text-2xl sm:text-3xl'} font-bold truncate`}>
          {serviceRequest.title}
        </h1>
        <div className="flex flex-wrap items-center gap-2 mt-2">
          <RequestStatusBadge status={serviceRequest.status} />
          {showServiceProviderBadge && (
            <Badge className="bg-blue-100 text-blue-800 border border-blue-200 text-xs">
              <Building className="h-3 w-3 mr-1" />
              Service Provider View
            </Badge>
          )}
          <span className="text-muted-foreground text-xs sm:text-sm">
            {platformLabel} • Created {new Date(serviceRequest.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
};
