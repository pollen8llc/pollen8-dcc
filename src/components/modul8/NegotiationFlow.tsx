
import React, { useState, useEffect } from 'react';
import { ServiceRequest } from '@/types/modul8';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  DollarSign, 
  MessageSquare, 
  CheckCircle, 
  XCircle, 
  ArrowRight 
} from 'lucide-react';
import ProviderResponseForm from './ProviderResponseForm';

interface NegotiationFlowProps {
  serviceRequest: ServiceRequest;
  currentUserId?: string;
  onStatusChange?: (newStatus: string) => void;
  onUpdate?: () => void;
  isServiceProvider?: boolean;
}

const NegotiationFlow: React.FC<NegotiationFlowProps> = ({ 
  serviceRequest, 
  currentUserId,
  onStatusChange,
  onUpdate,
  isServiceProvider
}) => {
  const [showResponseForm, setShowResponseForm] = useState(false);
  const [proposals, setProposals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadProposals();
  }, [serviceRequest.id]);

  const loadProposals = async () => {
    setIsLoading(true);
    // try {
    //   const loadedProposals = await getProposalsByRequestId(serviceRequest.id);
    //   setProposals(loadedProposals);
    // } catch (error) {
    //   console.error('Error loading proposals:', error);
    // } finally {
      setIsLoading(false);
    // }
  };

  const handleProviderResponse = (data: any) => {
    console.log('Provider response submitted:', data);
    setShowResponseForm(false);
    if (onUpdate) {
      onUpdate();
    }
    // Handle the response submission
  };

  const handleCancelResponse = () => {
    setShowResponseForm(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'negotiating': return 'bg-blue-500';
      case 'agreed': return 'bg-green-500';
      case 'declined': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Status Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Negotiation Status</CardTitle>
            <Badge className={getStatusColor(serviceRequest.status)}>
              {serviceRequest.status.toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Budget Range</p>
                <p className="font-medium">
                  {serviceRequest.budget_range ? 
                    `$${serviceRequest.budget_range.min || 0} - $${serviceRequest.budget_range.max || 0}` : 
                    'Not specified'
                  }
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Timeline</p>
                <p className="font-medium">
                  {serviceRequest.timeline || 'Not specified'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Proposals</p>
                <p className="font-medium">{proposals.length}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Response Form */}
      {showResponseForm && (
        <ProviderResponseForm
          serviceRequestId={serviceRequest.id}
          onSubmit={handleProviderResponse}
          onCancel={handleCancelResponse}
        />
      )}

      {/* Action Buttons */}
      {!showResponseForm && serviceRequest.status === 'pending' && (
        <div className="flex justify-center">
          <Button 
            onClick={() => setShowResponseForm(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <ArrowRight className="h-4 w-4 mr-2" />
            Submit Proposal
          </Button>
        </div>
      )}
    </div>
  );
};

export default NegotiationFlow;
