
import React from 'react';
import { ServiceRequest } from '@/types/modul8';
import { ArrowLeft, Building2, Users, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RequestStatusBadge } from '@/components/shared/RequestStatusBadge';

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
    <div className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-muted/30"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-6 pb-8 sm:pt-8 sm:pb-12">
          
          {/* Back Button */}
          <div className="mb-6 sm:mb-8">
            <Button
              variant="outline"
              onClick={onBack}
              className="flex items-center gap-3 text-base font-semibold px-6 py-3 h-auto border-primary/20 text-primary hover:bg-primary/5 hover:border-primary/40 transition-all duration-300"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to Dashboard
            </Button>
          </div>

          {/* Header Content */}
          <div className="flex flex-col space-y-6 sm:space-y-8">
            
            {/* Title and Status */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-6">
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground leading-tight mb-4">
                  {serviceRequest.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                  <RequestStatusBadge status={serviceRequest.status} />
                  
                  {currentUserRole === 'service_provider' && (
                    <Badge className="bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800 flex items-center gap-2 px-3 py-1 text-sm font-semibold">
                      <Building2 className="h-4 w-4" />
                      Service Provider View
                    </Badge>
                  )}
                  
                  <span className="text-sm text-muted-foreground">
                    MODUL-8 Project • Created {new Date(serviceRequest.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              {/* Action Button */}
              <div className="flex-shrink-0">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-[#00eada] to-[#00b8a8] hover:from-[#00b8a8] hover:to-[#008f82] text-white font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center gap-3 px-8 py-3 h-auto"
                >
                  <MessageSquare className="h-5 w-5" />
                  Manage Project
                </Button>
              </div>
            </div>
            
            {/* Description */}
            {serviceRequest.description && (
              <div className="max-w-4xl">
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                  {serviceRequest.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestHeader;
