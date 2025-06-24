
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DollarSign, Clock, User, Building } from 'lucide-react';
import { ServiceRequest } from '@/types/modul8';
import NegotiationTimeline from '@/components/modul8/NegotiationTimeline';

interface RequestSidebarProps {
  serviceRequest: ServiceRequest;
}

const RequestSidebar = ({ serviceRequest }: RequestSidebarProps) => {
  return (
    <div className="lg:col-span-1 space-y-6">
      {/* Timeline */}
      <NegotiationTimeline 
        serviceRequest={serviceRequest}
        className="sticky top-8"
      />

      {/* Client Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Client Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {serviceRequest.organizer && (
            <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
              <Avatar className="h-10 w-10">
                <AvatarFallback>
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="text-sm font-medium">
                  {serviceRequest.organizer.organization_name}
                </div>
                <div className="text-xs text-muted-foreground">Client</div>
              </div>
            </div>
          )}

          {/* Project Details */}
          <div className="pt-4 border-t">
            <h4 className="font-medium mb-3">Project Details</h4>
            <div className="space-y-3">
              {serviceRequest.budget_range && (
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="text-sm">
                    Budget: ${serviceRequest.budget_range.min?.toLocaleString() || 'TBD'}
                    {serviceRequest.budget_range.max && 
                      ` - $${serviceRequest.budget_range.max.toLocaleString()}`
                    }
                  </span>
                </div>
              )}
              
              {serviceRequest.timeline && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">{serviceRequest.timeline}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RequestSidebar;
