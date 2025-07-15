import React from 'react';
import { ArrowLeft, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ServiceRequest } from '@/types/modul8';
import { RequestStatusBadge } from '@/components/shared/RequestStatusBadge';

interface Modul8HeaderProps {
  serviceRequest: ServiceRequest;
  onBack: () => void;
  platformLabel?: string;
  showServiceProviderBadge?: boolean;
  actions?: React.ReactNode;
}

const Modul8Header: React.FC<Modul8HeaderProps> = ({
  serviceRequest,
  onBack,
  platformLabel = 'MODUL-8',
  showServiceProviderBadge = false,
  actions,
}) => {
  return (
    <header
      className="
        sticky top-0 z-30 bg-background/80 backdrop-blur
        border-b border-border
        px-3 sm:px-6 py-2 sm:py-3
        flex flex-col gap-2
        md:flex-row md:items-center md:gap-4
        shadow-sm
      "
    >
      {/* Left: Back button (mobile/tablet), Title, Status */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="md:hidden"
          aria-label="Back"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onBack}
          className="hidden md:flex items-center gap-2 text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Back to Dashboard</span>
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold truncate">
            {serviceRequest.title}
          </h1>
          <div className="flex flex-wrap items-center gap-2 mt-1">
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
      {/* Right: Actions */}
      {actions && (
        <div className="flex items-center gap-2 mt-2 md:mt-0 shrink-0">
          {actions}
        </div>
      )}
    </header>
  );
};

export default Modul8Header; 