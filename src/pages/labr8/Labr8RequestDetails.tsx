import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSession } from '@/hooks/useSession';
import { getServiceRequestById, getUserServiceProvider } from '@/services/modul8Service';
import { getProposalCards, createCounterProposalFromCard } from '@/services/proposalCardService';
import { ServiceRequest, ServiceProvider } from '@/types/modul8';
import { ProposalCard } from '@/types/proposalCards';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Building2, DollarSign, Calendar, Clock, User } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import ProposalCardNew from '@/components/modul8/ProposalCardNew';
import StructuredProposalForm from '@/components/modul8/StructuredProposalForm';

const Labr8RequestDetails = () => {
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();
  const { session } = useSession();
  const [request, setRequest] = useState<ServiceRequest | null>(null);
  const [proposalCards, setProposalCards] = useState<ProposalCard[]>([]);
  const [serviceProvider, setServiceProvider] = useState<ServiceProvider | null>(null);
  const [loading, setLoading] = useState(true);
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [counteringCardId, setCounteringCardId] = useState<string | null>(null);

  useEffect(() => {
    loadRequestData();
  }, [requestId, session?.user?.id]);

  const loadRequestData = async () => {
    if (!requestId || !session?.user?.id) return;

    try {
      setLoading(true);
      
      // Get service provider profile
      const provider = await getUserServiceProvider(session.user.id);
      if (!provider) {
        navigate('/labr8/setup');
        return;
      }
      setServiceProvider(provider);

      // Get service request
      const serviceRequest = await getServiceRequestById(requestId);
      setRequest(serviceRequest);

      // Get proposal cards
      const cards = await getProposalCards(requestId);
      setProposalCards(cards);

    } catch (error) {
      console.error('Error loading request data:', error);
      toast({
        title: "Error",
        description: "Failed to load request details",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCounterProposal = (cardId: string) => {
    setCounteringCardId(cardId);
    setShowProposalForm(true);
  };

  const handleProposalSubmit = async (proposalData: any) => {
    try {
      if (counteringCardId) {
        // Create counter proposal
        await createCounterProposalFromCard(counteringCardId, proposalData);
        toast({
          title: "Success",
          description: "Counter proposal submitted successfully!",
        });
      }
      
      setShowProposalForm(false);
      setCounteringCardId(null);
      loadRequestData(); // Refresh data
    } catch (error) {
      console.error('Error submitting proposal:', error);
      toast({
        title: "Error",
        description: "Failed to submit proposal. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'assigned': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'negotiating': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'agreed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'declined': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'in_progress': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'completed': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      default: return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  const formatBudget = (budget: any) => {
    if (!budget || typeof budget !== 'object') return 'Budget TBD';
    const { min, max, currency = 'USD' } = budget;
    if (min && max) {
      return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}`;
    } else if (min) {
      return `From ${currency} ${min.toLocaleString()}`;
    } else if (max) {
      return `Up to ${currency} ${max.toLocaleString()}`;
    }
    return 'Budget TBD';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-muted-foreground">Request Not Found</h2>
            <p className="text-muted-foreground mt-2">The requested service request could not be found.</p>
            <Button 
              onClick={() => navigate('/labr8/dashboard')} 
              className="mt-4"
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/labr8/dashboard')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>

        {/* Request Details */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl font-bold mb-2">{request.title}</CardTitle>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  {request.organizer && (
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      <span>{request.organizer.organization_name}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    <span>{formatBudget(request.budget_range)}</span>
                  </div>
                  {request.timeline && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{request.timeline}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Created {new Date(request.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <Badge className={`${getStatusColor(request.status)} font-semibold border px-3 py-1`}>
                {request.status?.replace('_', ' ').toUpperCase() || 'PENDING'}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent>
            {request.description && (
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground">{request.description}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Proposal Cards */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold">Proposal Cards</h2>
          
          {proposalCards.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                  No Proposals Yet
                </h3>
                <p className="text-muted-foreground">
                  Proposal cards will appear here when they are submitted.
                </p>
              </CardContent>
            </Card>
          ) : (
            proposalCards.map((card) => (
              <ProposalCardNew
                key={card.id}
                card={card}
                onActionComplete={loadRequestData}
                onCounterClick={() => handleCounterProposal(card.id)}
                isServiceProvider={true} // Pass LAB-R8 context
              />
            ))
          )}
        </div>

        {/* Proposal Form Modal */}
        {showProposalForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto w-full">
              <StructuredProposalForm
                serviceRequest={request}
                onSubmit={handleProposalSubmit}
                onCancel={() => {
                  setShowProposalForm(false);
                  setCounteringCardId(null);
                }}
                isCounterProposal={!!counteringCardId}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Labr8RequestDetails;
