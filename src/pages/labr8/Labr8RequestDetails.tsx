
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/labr8/dashboard')}
            className="flex items-center gap-2 border-gray-300 hover:border-[#00eada] hover:text-[#00eada]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          
          <div className="flex-1">
            <h1 className="text-3xl font-black text-gray-900">{serviceRequest.title}</h1>
            <div className="flex items-center gap-3 mt-2">
              <Badge className={`${getStatusColor(serviceRequest.status)} border font-semibold px-3 py-1`}>
                {serviceRequest.status.replace('_', ' ').toUpperCase()}
              </Badge>
              <Badge className="bg-[#00eada]/10 text-[#00eada] border border-[#00eada]/20 font-semibold">
                <Building className="h-4 w-4 mr-1" />
                Service Provider View
              </Badge>
              <span className="text-gray-500 text-sm">
                Created {new Date(serviceRequest.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Project Details */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold text-gray-900">Project Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {serviceRequest.description && (
                  <div>
                    <div className="text-sm font-semibold text-gray-700 mb-2">Description</div>
                    <div className="text-sm text-gray-600 leading-relaxed">
                      {serviceRequest.description}
                    </div>
                  </div>
                )}

                {serviceRequest.budget_range?.min && (
                  <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">
                      ${serviceRequest.budget_range.min.toLocaleString()}
                      {serviceRequest.budget_range.max && 
                        ` - $${serviceRequest.budget_range.max.toLocaleString()}`
                      }
                    </span>
                  </div>
                )}
                
                {serviceRequest.timeline && (
                  <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">{serviceRequest.timeline}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Participants */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold text-gray-900">Participants</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Organizer */}
                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={serviceRequest.organizer?.logo_url} />
                    <AvatarFallback className="bg-blue-200 text-blue-700">
                      <Building className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-blue-900">
                      {serviceRequest.organizer?.organization_name || 'Client'}
                    </div>
                    <div className="text-xs text-blue-600 font-medium">Organizer</div>
                  </div>
                </div>

                {/* Service Provider */}
                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-[#00eada]/10 to-[#00eada]/20 rounded-xl border border-[#00eada]/30">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={serviceProvider?.logo_url} />
                    <AvatarFallback className="bg-[#00eada]/20 text-[#00eada]">
                      <Building className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-gray-900">
                      {serviceProvider?.business_name || 'Your Business'}
                    </div>
                    <div className="text-xs text-[#00eada] font-bold">Service Provider (You)</div>
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
