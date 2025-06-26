
import React from 'react';
import { ServiceRequest } from '@/types/modul8';
import { RequestHeader } from './RequestHeader';
import { RequestSidebar } from './RequestSidebar';

interface RequestLayoutProps {
  serviceRequest: ServiceRequest;
  serviceProvider?: any;
  currentUserRole?: 'organizer' | 'service_provider' | 'viewer';
  platformLabel?: string;
  showServiceProviderBadge?: boolean;
  showTimeline?: boolean;
  onBack: () => void;
  children: React.ReactNode;
  sidebarChildren?: React.ReactNode;
}

export const RequestLayout: React.FC<RequestLayoutProps> = ({
  serviceRequest,
  serviceProvider,
  currentUserRole = 'viewer',
  platformLabel,
  showServiceProviderBadge = false,
  onBack,
  children,
  sidebarChildren
}) => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <RequestHeader 
          serviceRequest={serviceRequest}
          onBack={onBack}
          platformLabel={platformLabel}
          showServiceProviderBadge={showServiceProviderBadge}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <RequestSidebar 
            serviceRequest={serviceRequest}
            serviceProvider={serviceProvider}
            currentUserRole={currentUserRole}
          >
            {sidebarChildren}
          </RequestSidebar>
          
          <div className="lg:col-span-3">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
