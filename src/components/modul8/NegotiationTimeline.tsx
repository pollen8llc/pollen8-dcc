
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  Clock, 
  MessageSquare, 
  Handshake,
  AlertCircle,
  XCircle
} from 'lucide-react';
import { ServiceRequest } from '@/types/modul8';

interface NegotiationTimelineProps {
  serviceRequest: ServiceRequest;
  className?: string;
}

const NegotiationTimeline: React.FC<NegotiationTimelineProps> = ({
  serviceRequest,
  className = ''
}) => {
  const getStatusIcon = (status: string, isActive: boolean = false) => {
    const iconClass = isActive ? 'text-[#00eada]' : 'text-muted-foreground';
    
    switch (status) {
      case 'pending':
        return <Clock className={`h-4 w-4 ${iconClass}`} />;
      case 'negotiating':
        return <MessageSquare className={`h-4 w-4 ${iconClass}`} />;
      case 'agreed':
        return <CheckCircle className={`h-4 w-4 ${iconClass}`} />;
      case 'in_progress':
        return <Handshake className={`h-4 w-4 ${iconClass}`} />;
      case 'declined':
        return <XCircle className={`h-4 w-4 ${iconClass}`} />;
      default:
        return <AlertCircle className={`h-4 w-4 ${iconClass}`} />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Request Sent';
      case 'negotiating':
        return 'Negotiating';
      case 'agreed':
        return 'Agreement Reached';
      case 'in_progress':
        return 'Project Active';
      case 'declined':
        return 'Declined';
      default:
        return status.replace('_', ' ').toUpperCase();
    }
  };

  const timelineSteps = [
    { status: 'pending', label: 'Request Sent', description: 'Waiting for provider response' },
    { status: 'negotiating', label: 'Negotiating', description: 'Terms being discussed' },
    { status: 'agreed', label: 'Agreement', description: 'Both parties agreed to terms' },
    { status: 'in_progress', label: 'Active Project', description: 'Work in progress' }
  ];

  const currentStepIndex = timelineSteps.findIndex(step => step.status === serviceRequest.status);
  const isDeclined = serviceRequest.status === 'declined';

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Negotiation Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            {getStatusIcon(serviceRequest.status, true)}
            <Badge 
              variant="outline" 
              className="font-medium border-[#00eada] text-[#00eada]"
            >
              {getStatusLabel(serviceRequest.status)}
            </Badge>
          </div>

          {!isDeclined ? (
            <div className="space-y-3">
              {timelineSteps.map((step, index) => {
                const isCompleted = index <= currentStepIndex;
                const isActive = index === currentStepIndex;
                
                return (
                  <div key={step.status} className="flex items-start gap-3">
                    <div className={`mt-1 ${isCompleted ? 'text-[#00eada]' : 'text-muted-foreground'}`}>
                      {getStatusIcon(step.status, isCompleted)}
                    </div>
                    <div className="flex-1">
                      <div className={`font-medium ${isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {step.label}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {step.description}
                      </div>
                    </div>
                    {isActive && (
                      <Badge variant="secondary" className="text-xs">
                        Current
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-red-50 border border-red-200">
              <XCircle className="h-5 w-5 text-red-600" />
              <div>
                <div className="font-medium text-red-800">Request Declined</div>
                <div className="text-sm text-red-600">
                  The service provider has declined this request
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default NegotiationTimeline;
