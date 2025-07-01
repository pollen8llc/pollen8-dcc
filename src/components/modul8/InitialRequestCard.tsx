
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  CheckCircle, 
  XCircle,
  ArrowRight,
  Building,
  DollarSign,
  Calendar,
  PlayCircle,
  Clock
} from 'lucide-react';
import { ServiceRequest } from '@/types/modul8';

interface InitialRequestCardProps {
  serviceRequest: ServiceRequest;
  initialRequestResponded: boolean;
  isServiceProvider: boolean;
  submitting: boolean;
  onResponse: (responseType: 'accept' | 'reject' | 'counter') => void;
}

export const InitialRequestCard: React.FC<InitialRequestCardProps> = ({
  serviceRequest,
  initialRequestResponded,
  isServiceProvider,
  submitting,
  onResponse
}) => {
  return (
    <Card className="border-l-4 border-l-emerald-500 bg-gray-900/80 backdrop-blur-sm border-gray-800">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 font-bold px-3 py-1 flex items-center gap-1">
            <PlayCircle className="h-4 w-4" />
            Card #1
          </Badge>
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 font-bold px-3 py-1 flex items-center gap-1">
            <Clock className="h-4 w-4" />
            INITIAL REQUEST
          </Badge>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Avatar className="h-6 w-6">
              <AvatarImage src={serviceRequest.organizer?.logo_url} />
              <AvatarFallback className="bg-emerald-500/20 text-emerald-400">
                <Building className="h-3 w-3" />
              </AvatarFallback>
            </Avatar>
            <span className="font-medium text-gray-300">
              {serviceRequest.organizer?.organization_name || 'Client'}
            </span>
            <span className="text-gray-500">
              {new Date(serviceRequest.created_at).toLocaleDateString()} at {new Date(serviceRequest.created_at).toLocaleTimeString()}
            </span>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">{serviceRequest.title}</h3>
            {serviceRequest.description && (
              <p className="text-gray-300 leading-relaxed">{serviceRequest.description}</p>
            )}
          </div>
          
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <h4 className="text-sm font-semibold text-white mb-3">Proposed Project Details:</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                <DollarSign className="h-4 w-4 text-emerald-400" />
                <span className="text-sm font-medium text-emerald-400">
                  Budget: {serviceRequest.budget_range && (serviceRequest.budget_range.min || serviceRequest.budget_range.max) 
                    ? (serviceRequest.budget_range.min && serviceRequest.budget_range.max 
                      ? `$${serviceRequest.budget_range.min.toLocaleString()} - $${serviceRequest.budget_range.max.toLocaleString()}`
                      : serviceRequest.budget_range.min 
                      ? `From $${serviceRequest.budget_range.min.toLocaleString()}`
                      : serviceRequest.budget_range.max 
                      ? `Up to $${serviceRequest.budget_range.max.toLocaleString()}`
                      : 'Budget TBD')
                    : 'Budget TBD'
                  }
                </span>
              </div>
              
              {serviceRequest.timeline && (
                <div className="flex items-center gap-2 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <Calendar className="h-4 w-4 text-blue-400" />
                  <span className="text-sm font-medium text-blue-400">{serviceRequest.timeline}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {!initialRequestResponded && isServiceProvider && (
          <div className="flex gap-2 pt-4 border-t border-gray-700 mt-4">
            <Button
              onClick={() => onResponse('accept')}
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={submitting}
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Accept
            </Button>
            <Button
              onClick={() => onResponse('reject')}
              size="sm"
              variant="outline"
              className="border-red-500/30 text-red-400 hover:bg-red-500/10"
              disabled={submitting}
            >
              <XCircle className="h-4 w-4 mr-1" />
              Reject
            </Button>
            <Button
              onClick={() => onResponse('counter')}
              size="sm"
              className="bg-orange-600 hover:bg-orange-700 text-white"
              disabled={submitting}
            >
              <ArrowRight className="h-4 w-4 mr-1" />
              Counter
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
