
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSession } from '@/hooks/useSession';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  ArrowLeft, 
  Building, 
  User, 
  Calendar,
  DollarSign
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import ProposalCardThread from '@/components/modul8/ProposalCardThread';
import { ServiceRequest } from '@/types/modul8';
import { getServiceRequestById, getUserServiceProvider } from '@/services/modul8Service';
import { toast } from '@/hooks/use-toast';

const Labr8RequestDetails = () => {
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();
  const { session } = useSession();

  const [serviceRequest, setServiceRequest] = useState<ServiceRequest | null>(null);
  const [serviceProvider, setServiceProvider] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [requestId, session?.user?.id]);

  const loadData = async () => {
    if (!requestId || !session?.user?.id) return;
    
    setLoading(true);
    try {
      const [requestData, provider] = await Promise.all([
        getServiceRequestById(requestId),
        getUserServiceProvider(session.user.id)
      ]);

      if (!requestData) {
        toast({
          title: "Request Not Found",
          description: "The service request could not be found",
          variant: "destructive"
        });
        navigate('/labr8/dashboard');
        return;
      }

      if (!provider) {
        navigate('/labr8/setup');
        return;
      }

      setServiceRequest(requestData);
      setServiceProvider(provider);
    } catch (error) {
      console.error('Error loading request:', error);
      toast({
        title: "Error",
        description: "Failed to load request details",
        variant: "destructive"
      });
      navigate('/labr8/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'assigned':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'negotiating':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'agreed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'in_progress':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'completed':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary" />
        </div>
      </div>
    );
  }

  if (!serviceRequest) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2 text-foreground">Request Not Found</h2>
            <Button onClick={() => navigate('/labr8/dashboard')}>
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
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/labr8/dashboard')}
            className="flex items-center gap-2 border-border hover:border-primary hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          
          <div className="flex-1">
            <h1 className="text-3xl font-black text-foreground">{serviceRequest.title}</h1>
            <div className="flex items-center gap-3 mt-2">
              <Badge className={`${getStatusColor(serviceRequest.status)} border font-semibold px-3 py-1`}>
                {serviceRequest.status.replace('_', ' ').toUpperCase()}
              </Badge>
              <Badge className="bg-primary/10 text-primary border border-primary/20 font-semibold">
                <Building className="h-4 w-4 mr-1" />
                Service Provider View
              </Badge>
              <span className="text-muted-foreground text-sm">
                Created {new Date(serviceRequest.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Project Details */}
            <Card className="border-border/40 bg-card/60 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold text-foreground">Project Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {serviceRequest.description && (
                  <div>
                    <div className="text-sm font-semibold text-muted-foreground mb-2">Description</div>
                    <div className="text-sm text-muted-foreground leading-relaxed">
                      {serviceRequest.description}
                    </div>
                  </div>
                )}

                {serviceRequest.budget_range?.min && (
                  <div className="flex items-center gap-2 p-3 bg-primary/10 rounded-lg border border-primary/20">
                    <DollarSign className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-primary">
                      ${serviceRequest.budget_range.min.toLocaleString()}
                      {serviceRequest.budget_range.max && 
                        ` - $${serviceRequest.budget_range.max.toLocaleString()}`
                      }
                    </span>
                  </div>
                )}
                
                {serviceRequest.timeline && (
                  <div className="flex items-center gap-2 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <Calendar className="h-4 w-4 text-blue-400" />
                    <span className="text-sm font-medium text-blue-400">{serviceRequest.timeline}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Participants */}
            <Card className="border-border/40 bg-card/60 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold text-foreground">Participants</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Organizer */}
                <div className="flex items-center gap-3 p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={serviceRequest.organizer?.logo_url} />
                    <AvatarFallback className="bg-blue-500/20 text-blue-400">
                      <Building className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-blue-400">
                      {serviceRequest.organizer?.organization_name || 'Client'}
                    </div>
                    <div className="text-xs text-blue-400/70 font-medium">Organizer</div>
                  </div>
                </div>

                {/* Service Provider */}
                <div className="flex items-center gap-3 p-4 bg-primary/10 rounded-xl border border-primary/30">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={serviceProvider?.logo_url} />
                    <AvatarFallback className="bg-primary/20 text-primary">
                      <Building className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-foreground">
                      {serviceProvider?.business_name || 'Your Business'}
                    </div>
                    <div className="text-xs text-primary font-bold">Service Provider (You)</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Proposal Thread */}
          <div className="lg:col-span-3">
            <ProposalCardThread 
              requestId={serviceRequest.id}
              isServiceProvider={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Labr8RequestDetails;
