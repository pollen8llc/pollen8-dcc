
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSession } from '@/hooks/useSession';
import { getServiceRequests } from '@/services/modul8Service';
import { ServiceRequest } from '@/types/modul8';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  ArrowLeft, 
  Building,
  DollarSign,
  Calendar,
  Clock
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { toast } from '@/hooks/use-toast';

const Labr8ProjectDetails = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { session } = useSession();
  
  const [serviceRequest, setServiceRequest] = useState<ServiceRequest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjectData();
  }, [projectId]);

  const loadProjectData = async () => {
    if (!projectId) return;
    
    try {
      setLoading(true);
      
      const requests = await getServiceRequests();
      const request = requests.find(r => r.id === projectId);
      
      if (!request) {
        toast({
          title: "Error",
          description: "Project not found",
          variant: "destructive"
        });
        navigate('/labr8/dashboard');
        return;
      }
      
      setServiceRequest(request);
      
    } catch (error) {
      console.error('Error loading project:', error);
      toast({
        title: "Error",
        description: "Failed to load project details",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'in_progress':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'completed':
        return 'bg-green-50 text-green-700 border-green-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#00eada]"></div>
        </div>
      </div>
    );
  }

  if (!serviceRequest) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
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
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/labr8/dashboard')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>

        {/* Project Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl mb-2">{serviceRequest.title}</CardTitle>
                <Badge className={`${getStatusColor(serviceRequest.status)} font-medium`} variant="outline">
                  {serviceRequest.status.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
              
              {serviceRequest.organizer && (
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={serviceRequest.organizer.logo_url} />
                    <AvatarFallback>
                      <Building className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{serviceRequest.organizer.organization_name}</h3>
                    {serviceRequest.organizer.description && (
                      <p className="text-sm text-muted-foreground line-clamp-1">{serviceRequest.organizer.description}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardHeader>
          
          <CardContent>
            {serviceRequest.description && (
              <p className="text-muted-foreground mb-4">{serviceRequest.description}</p>
            )}
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span>Budget: Contact for details</span>
              </div>
              {serviceRequest.timeline && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{serviceRequest.timeline}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>Created {new Date(serviceRequest.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Project Status */}
        <Card>
          <CardHeader>
            <CardTitle>Project Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                Project management tools and timeline will be available here once the project begins.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Labr8ProjectDetails;
