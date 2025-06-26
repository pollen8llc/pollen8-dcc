
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, DollarSign } from 'lucide-react';
import { ServiceRequest } from '@/types/modul8';

interface RequestDetailsProps {
  serviceRequest: ServiceRequest;
}

export const RequestDetails: React.FC<RequestDetailsProps> = ({ serviceRequest }) => {
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

  const budgetDisplay = formatBudget(serviceRequest.budget_range);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Project Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {budgetDisplay && (
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-green-600" />
            <span className="text-sm">{budgetDisplay}</span>
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
  );
};
