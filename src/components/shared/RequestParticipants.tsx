
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Building, User } from 'lucide-react';
import { ServiceRequest } from '@/types/modul8';

interface RequestParticipantsProps {
  serviceRequest: ServiceRequest;
  serviceProvider?: any;
  currentUserRole?: 'organizer' | 'service_provider' | 'viewer';
}

export const RequestParticipants: React.FC<RequestParticipantsProps> = ({
  serviceRequest,
  serviceProvider,
  currentUserRole
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Participants</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Organizer */}
        <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
          <Avatar userId={serviceRequest.organizer?.user_id} size={40} />
          <div className="flex-1">
            <div className="text-sm font-medium">
              {serviceRequest.organizer?.organization_name || 'Client'}
            </div>
            <div className="text-xs text-muted-foreground">
              Organizer {currentUserRole === 'organizer' ? '(You)' : ''}
            </div>
          </div>
        </div>

        {/* Service Provider */}
        {(serviceProvider || serviceRequest.service_provider) && (
          <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/10 rounded-lg">
            <Avatar userId={serviceProvider?.user_id || serviceRequest.service_provider?.user_id} size={40} />
            <div className="flex-1">
              <div className="text-sm font-medium">
                {serviceProvider?.business_name || serviceRequest.service_provider?.business_name || 'Service Provider'}
              </div>
              <div className="text-xs text-muted-foreground">
                Service Provider {currentUserRole === 'service_provider' ? '(You)' : ''}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
