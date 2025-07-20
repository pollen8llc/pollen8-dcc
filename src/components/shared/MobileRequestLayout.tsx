
import React from 'react';
import { ServiceRequest } from '@/types/modul8';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ArrowLeft, Building, User, Menu, Clock, DollarSign } from 'lucide-react';
import { RequestStatusBadge } from './RequestStatusBadge';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobileRequestLayoutProps {
  serviceRequest: ServiceRequest;
  serviceProvider?: any;
  currentUserRole?: 'organizer' | 'service_provider' | 'viewer';
  platformLabel?: string;
  showServiceProviderBadge?: boolean;
  onBack: () => void;
  children: React.ReactNode;
  sidebarChildren?: React.ReactNode;
  deleteButton?: React.ReactNode;
}

export const MobileRequestLayout: React.FC<MobileRequestLayoutProps> = ({
  serviceRequest,
  serviceProvider,
  currentUserRole = 'viewer',
  platformLabel = 'Platform',
  showServiceProviderBadge = false,
  onBack,
  children,
  sidebarChildren,
  deleteButton
}) => {
  const isMobile = useIsMobile();

  const formatBudget = (budget: any) => {
    if (!budget || typeof budget !== 'object') return null;
    const { min, max, currency = 'USD' } = budget;
    if (min && max) {
      return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}`;
    } else if (min) {
      return `From ${currency} ${min.toLocaleString()}`;
    } else if (max) {
      return `Up to ${currency} ${max.toLocaleString()}`;
    }
    return null;
  };

  const SidebarContent = () => (
    <div className="space-y-4">
      {sidebarChildren}
      
      {/* Participants */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Participants</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Organizer */}
          <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <Avatar className="h-8 w-8">
              <AvatarImage src={serviceRequest.organizer?.logo_url} />
              <AvatarFallback className="bg-blue-500/20 text-blue-700">
                <Building className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">
                {serviceRequest.organizer?.organization_name || 'Organization'}
              </div>
              <div className="text-xs text-muted-foreground">Client</div>
            </div>
          </div>

          {/* Service Provider */}
          <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-lg">
            <Avatar className="h-8 w-8">
              <AvatarImage src={serviceProvider?.logo_url} />
              <AvatarFallback className="bg-primary/20 text-primary">
                <Building className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">
                {serviceProvider?.business_name || 'Service Provider'}
              </div>
              <div className="text-xs text-primary font-medium">
                {currentUserRole === 'service_provider' ? 'You' : 'Provider'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Project Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Project Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {formatBudget(serviceRequest.budget_range) && (
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span className="text-sm">{formatBudget(serviceRequest.budget_range)}</span>
            </div>
          )}
          
          {serviceRequest.timeline && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="text-sm">{serviceRequest.timeline}</span>
            </div>
          )}

          {serviceRequest.description && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Description</h4>
              <p className="text-sm text-muted-foreground">{serviceRequest.description}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6 max-w-7xl">
        {/* Mobile-First Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onBack}
              className="flex items-center gap-2 text-sm min-h-[44px] sm:min-h-auto"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back to Dashboard</span>
              <span className="sm:hidden">Back</span>
            </Button>
            
            {/* Mobile Menu Button */}
            {isMobile && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="min-h-[44px]">
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 overflow-y-auto">
                  <SidebarContent />
                </SheetContent>
              </Sheet>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold truncate">
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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Desktop Sidebar */}
          {!isMobile && (
            <div className="lg:col-span-1">
              <SidebarContent />
            </div>
          )}
          
          {/* Main Content */}
          <div className={`${isMobile ? 'col-span-1' : 'lg:col-span-3'}`}>
            {children}
          </div>
        </div>

        {/* Bottom Actions for Mobile */}
        {deleteButton && (
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border lg:relative lg:bottom-auto lg:left-auto lg:right-auto lg:p-0 lg:bg-transparent lg:border-t-0 lg:mt-6">
            <div className="container mx-auto max-w-7xl">
              {deleteButton}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
