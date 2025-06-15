
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  MessageSquare, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  ArrowRight,
  ExternalLink,
  Handshake,
  FileText,
  Target,
  Calendar,
  User,
  Building,
  AlertCircle
} from 'lucide-react';
import { ServiceRequest, Proposal, ServiceProvider } from '@/types/modul8';
import { createProposal, getRequestProposals, assignServiceProvider } from '@/services/modul8Service';
import { useSession } from '@/hooks/useSession';
import { toast } from '@/hooks/use-toast';

interface NegotiationFlowProps {
  serviceRequest: ServiceRequest;
  onUpdate: () => void;
}

const NEGOTIATION_STEPS = [
  { key: 'initiated', label: 'Initiated', icon: MessageSquare },
  { key: 'proposal', label: 'Proposal', icon: FileText },
  { key: 'negotiating', label: 'Negotiating', icon: ArrowRight },
  { key: 'agreement', label: 'Agreement', icon: CheckCircle },
  { key: 'deel', label: 'Contract', icon: Handshake }
];

const NegotiationFlow: React.FC<NegotiationFlowProps> = ({ serviceRequest, onUpdate }) => {
  const { session } = useSession();
  const [proposals, setProposals] = useState<(Proposal & { service_provider?: ServiceProvider })[]>([]);
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [proposalData, setProposalData] = useState({
    quote_amount: '',
    timeline: '',
    scope_details: '',
    terms: ''
  });
  const [loading, setLoading] = useState(false);
  const [agreeing, setAgreeing] = useState(false);

  useEffect(() => {
    loadProposals();
  }, [serviceRequest.id]);

  const loadProposals = async () => {
    try {
      const proposalsData = await getRequestProposals(serviceRequest.id);
      setProposals(proposalsData as (Proposal & { service_provider?: ServiceProvider })[]);
    } catch (error) {
      console.error('Error loading proposals:', error);
    }
  };

  const getCurrentStep = () => {
    if (serviceRequest.status === 'completed') return 4;
    if (serviceRequest.status === 'agreed') return 3;
    if (proposals.length > 0) return serviceRequest.engagement_status === 'negotiating' ? 2 : 1;
    return 0;
  };

  const getProgressPercentage = () => {
    const currentStep = getCurrentStep();
    return (currentStep / (NEGOTIATION_STEPS.length - 1)) * 100;
  };

  const renderTextWithLinks = (text: string) => {
    if (!text) return text;
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    
    return parts.map((part, index) => {
      if (urlRegex.test(part)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[#00eada] hover:text-[#00eada]/80 underline"
          >
            {part.length > 50 ? `${part.substring(0, 50)}...` : part}
            <ExternalLink className="h-3 w-3" />
          </a>
        );
      }
      return part;
    });
  };

  const handleSubmitProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) return;

    setLoading(true);
    try {
      await createProposal({
        service_request_id: serviceRequest.id,
        from_user_id: session.user.id,
        proposal_type: proposals.length === 0 ? 'initial' : 'counter',
        quote_amount: proposalData.quote_amount ? parseFloat(proposalData.quote_amount) : undefined,
        timeline: proposalData.timeline || undefined,
        scope_details: proposalData.scope_details || undefined,
        terms: proposalData.terms || undefined
      });

      toast({
        title: "Proposal Submitted! 🚀",
        description: "Your proposal has been sent to the organizer for review."
      });

      setShowProposalForm(false);
      setProposalData({ quote_amount: '', timeline: '', scope_details: '', terms: '' });
      loadProposals();
      onUpdate();
    } catch (error) {
      console.error('Error creating proposal:', error);
      toast({
        title: "Error",
        description: "Failed to submit proposal",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAgree = async () => {
    setAgreeing(true);
    try {
      const latestProposal = proposals[proposals.length - 1];
      if (!latestProposal) {
        throw new Error('No proposal found to agree to');
      }

      await assignServiceProvider(serviceRequest.id, latestProposal.from_user_id);

      toast({
        title: "Agreement Reached! 🎉",
        description: "Service provider has been assigned. You can now proceed to create the contract."
      });

      onUpdate();
    } catch (error) {
      console.error('Error reaching agreement:', error);
      toast({
        title: "Error",
        description: "Failed to reach agreement",
        variant: "destructive"
      });
    } finally {
      setAgreeing(false);
    }
  };

  const handleLockDeal = () => {
    const deelParams = new URLSearchParams({
      service_title: serviceRequest.title,
      client_name: serviceRequest.organizer?.organization_name || 'Client',
      amount: proposalData.quote_amount || '0',
      timeline: proposalData.timeline || 'TBD',
      description: serviceRequest.description || ''
    });

    const deelUrl = `https://app.deel.com/contracts/create?${deelParams.toString()}`;
    
    toast({
      title: "Redirecting to Deel",
      description: "Opening contract creation page..."
    });

    window.open(deelUrl, '_blank');
  };

  const latestProposal = proposals[proposals.length - 1];
  const canLockDeal = serviceRequest.status === 'agreed' || 
    (proposals.length > 0 && latestProposal?.status === 'accepted');
  const canAgree = proposals.length > 0 && serviceRequest.status !== 'agreed';
  
  const isOrganizer = session?.user?.id && serviceRequest.organizer?.user_id === session.user.id;
  const isServiceProvider = session?.user?.id && !isOrganizer;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Enhanced Progress Bar */}
      <Card className="border-l-4 border-l-[#00eada]">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-[#00eada]/10 rounded-full">
              <MessageSquare className="h-6 w-6 text-[#00eada]" />
            </div>
            Project Negotiation Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <Progress 
              value={getProgressPercentage()} 
              className="w-full h-3 bg-gray-100"
            />
            <div className="flex justify-between">
              {NEGOTIATION_STEPS.map((step, index) => {
                const StepIcon = step.icon;
                const isActive = index <= getCurrentStep();
                return (
                  <div 
                    key={step.key}
                    className="flex flex-col items-center space-y-2"
                  >
                    <div className={`p-3 rounded-full border-2 transition-all ${
                      isActive 
                        ? 'bg-[#00eada] border-[#00eada] text-white' 
                        : 'bg-white border-gray-300 text-gray-400'
                    }`}>
                      <StepIcon className="h-5 w-5" />
                    </div>
                    <span className={`text-sm font-medium ${
                      isActive ? 'text-[#00eada]' : 'text-gray-500'
                    }`}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Service Request Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <Target className="h-7 w-7 text-[#00eada]" />
            {serviceRequest.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {serviceRequest.description && (
            <div className="bg-muted/30 p-4 rounded-lg border">
              <p className="text-muted-foreground leading-relaxed">
                {renderTextWithLinks(serviceRequest.description)}
              </p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/10 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Budget Range</p>
                <p className="font-semibold text-green-700">
                  {serviceRequest.budget_range?.min && serviceRequest.budget_range?.max
                    ? `$${serviceRequest.budget_range.min.toLocaleString()} - $${serviceRequest.budget_range.max.toLocaleString()}`
                    : 'Budget: TBD'}
                </p>
              </div>
            </div>
            
            {serviceRequest.timeline && (
              <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Timeline</p>
                  <p className="font-semibold text-blue-700">{serviceRequest.timeline}</p>
                </div>
              </div>
            )}
          </div>

          {/* Organizer Info */}
          <div className="flex items-center gap-3 p-4 bg-purple-50 dark:bg-purple-900/10 rounded-lg">
            <Building className="h-6 w-6 text-purple-600" />
            <div>
              <p className="text-sm text-muted-foreground">Requested by</p>
              <p className="font-semibold text-purple-700">
                {serviceRequest.organizer?.organization_name || 'Organization'}
              </p>
            </div>
          </div>

          {/* Milestones */}
          {serviceRequest.milestones && Array.isArray(serviceRequest.milestones) && serviceRequest.milestones.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-[#00eada]" />
                Project Deliverables
              </h4>
              <div className="space-y-2">
                {serviceRequest.milestones.map((milestone, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-muted/20 rounded-lg border-l-2 border-l-[#00eada]">
                    <div className="w-6 h-6 rounded-full bg-[#00eada]/20 flex items-center justify-center text-xs font-medium text-[#00eada] mt-0.5">
                      {index + 1}
                    </div>
                    <p className="text-sm flex-1">
                      {typeof milestone === 'string' ? milestone : JSON.stringify(milestone)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Assigned Provider Status */}
          {serviceRequest.service_provider && (
            <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <div>
                  <h4 className="font-semibold text-green-800">Assigned Service Provider</h4>
                  <p className="text-green-700">{serviceRequest.service_provider.business_name}</p>
                  {serviceRequest.service_provider.tagline && (
                    <p className="text-sm text-green-600 mt-1">{serviceRequest.service_provider.tagline}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Enhanced Proposals Thread */}
      {proposals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <MessageSquare className="h-6 w-6 text-[#00eada]" />
              Proposal Discussion ({proposals.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {proposals.map((proposal, index) => (
              <div key={proposal.id} className="relative">
                {index > 0 && (
                  <div className="absolute -top-3 left-6 w-0.5 h-6 bg-[#00eada]/30"></div>
                )}
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      proposal.status === 'accepted' ? 'bg-green-100 text-green-600' : 'bg-[#00eada]/10 text-[#00eada]'
                    }`}>
                      {proposal.status === 'accepted' ? (
                        <CheckCircle className="h-6 w-6" />
                      ) : (
                        <FileText className="h-6 w-6" />
                      )}
                    </div>
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant={proposal.status === 'accepted' ? 'default' : 'secondary'} className="font-medium">
                          {proposal.proposal_type.charAt(0).toUpperCase() + proposal.proposal_type.slice(1)} Proposal
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {new Date(proposal.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                    
                    <div className="bg-muted/20 p-4 rounded-lg border space-y-3">
                      {proposal.quote_amount && (
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <span className="font-semibold text-lg text-green-700">
                            ${proposal.quote_amount.toLocaleString()}
                          </span>
                        </div>
                      )}
                      
                      {proposal.timeline && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-blue-600" />
                          <span className="text-blue-700"><strong>Timeline:</strong> {proposal.timeline}</span>
                        </div>
                      )}
                      
                      {proposal.scope_details && (
                        <div>
                          <p className="font-medium text-sm text-muted-foreground mb-2">Scope Details:</p>
                          <div className="text-sm leading-relaxed">
                            {renderTextWithLinks(proposal.scope_details)}
                          </div>
                        </div>
                      )}
                      
                      {proposal.terms && (
                        <div>
                          <p className="font-medium text-sm text-muted-foreground mb-2">Terms:</p>
                          <div className="text-sm leading-relaxed">
                            {renderTextWithLinks(proposal.terms)}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Enhanced Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        {!showProposalForm && !canLockDeal && isServiceProvider && (
          <Button
            onClick={() => setShowProposalForm(true)}
            className="flex items-center gap-2 bg-[#00eada] hover:bg-[#00eada]/90 text-black font-medium px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all"
            size="lg"
          >
            <MessageSquare className="h-5 w-5" />
            {proposals.length === 0 ? 'Send Initial Proposal' : 'Send Counter Proposal'}
          </Button>
        )}
        
        {canAgree && isOrganizer && (
          <Button
            onClick={handleAgree}
            disabled={agreeing}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 font-medium px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all"
            size="lg"
          >
            <CheckCircle className="h-5 w-5" />
            {agreeing ? 'Assigning Provider...' : 'Accept & Assign Provider'}
          </Button>
        )}

        {canLockDeal && (
          <Button
            onClick={handleLockDeal}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 font-medium px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all"
            size="lg"
          >
            <Handshake className="h-5 w-5" />
            Create Contract
            <ExternalLink className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Enhanced Proposal Form */}
      {showProposalForm && isServiceProvider && (
        <Card className="border-2 border-[#00eada]/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-[#00eada]" />
              Submit Your Proposal
            </CardTitle>
            <p className="text-muted-foreground">
              Provide detailed information about your approach, timeline, and pricing. You can include links to portfolios, documents, or references.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitProposal} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="quote_amount" className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    Quote Amount ($)
                  </Label>
                  <Input
                    id="quote_amount"
                    type="number"
                    value={proposalData.quote_amount}
                    onChange={(e) => setProposalData(prev => ({ ...prev, quote_amount: e.target.value }))}
                    placeholder="5000"
                    className="text-lg"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="timeline" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    Estimated Timeline
                  </Label>
                  <Input
                    id="timeline"
                    value={proposalData.timeline}
                    onChange={(e) => setProposalData(prev => ({ ...prev, timeline: e.target.value }))}
                    placeholder="2-3 weeks"
                    className="text-lg"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="scope_details" className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-[#00eada]" />
                  Scope & Deliverables
                </Label>
                <Textarea
                  id="scope_details"
                  value={proposalData.scope_details}
                  onChange={(e) => setProposalData(prev => ({ ...prev, scope_details: e.target.value }))}
                  placeholder="Describe what you will deliver and your approach. Include any relevant links to your portfolio, examples, or documentation..."
                  rows={5}
                  className="text-base"
                />
                <p className="text-xs text-muted-foreground">
                  💡 Tip: Include links to your portfolio, previous work examples, or relevant documentation
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="terms" className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-purple-600" />
                  Terms & Conditions
                </Label>
                <Textarea
                  id="terms"
                  value={proposalData.terms}
                  onChange={(e) => setProposalData(prev => ({ ...prev, terms: e.target.value }))}
                  placeholder="Payment terms, revision policy, communication preferences, contract links, etc..."
                  rows={4}
                  className="text-base"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowProposalForm(false)}
                  className="flex-1 py-3"
                  size="lg"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-[#00eada] hover:bg-[#00eada]/90 text-black font-medium py-3 shadow-md hover:shadow-lg transition-all"
                  size="lg"
                >
                  {loading ? 'Submitting...' : 'Submit Proposal'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NegotiationFlow;
