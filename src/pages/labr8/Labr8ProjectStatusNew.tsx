
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

const Labr8ProjectStatusNew = () => {
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
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'negotiating':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'agreed':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'in_progress':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'cancelled':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#00eada]" />
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
            <h2 className="text-2xl font-semibold mb-2">Request Not Found</h2>
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
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/labr8/dashboard')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{serviceRequest.title}</h1>
            <div className="flex items-center gap-2 mt-2">
              <Badge className={`${getStatusColor(serviceRequest.status)} border font-medium`}>
                {serviceRequest.status.replace('_', ' ').toUpperCase()}
              </Badge>
              <Badge className="bg-blue-100 text-blue-800 border border-blue-200">
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
          {/* Sidebar - Only Participants */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Participants</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Organizer */}
                <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={serviceRequest.organizer?.logo_url} />
                    <AvatarFallback>
                      <Building className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="text-sm font-medium">
                      {serviceRequest.organizer?.organization_name || 'Client'}
                    </div>
                    <div className="text-xs text-muted-foreground">Organizer</div>
                  </div>
                </div>

                {/* Service Provider */}
                <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/10 rounded-lg">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={serviceProvider?.logo_url} />
                    <AvatarFallback>
                      <Building className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="text-sm font-medium">
                      {serviceProvider?.business_name || 'Your Business'}
                    </div>
                    <div className="text-xs text-muted-foreground">Service Provider (You)</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Proposal Thread */}
          <div className="lg:col-span-3">
            <ProposalCardThread 
              serviceRequest={serviceRequest}
              onActionComplete={loadData}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Labr8ProjectStatusNew;
