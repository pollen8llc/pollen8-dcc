
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/hooks/useSession';
import { getUserOrganizer, getOrganizerServiceRequests } from '@/services/modul8Service';
import { ServiceRequest } from '@/types/modul8';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, Clock, DollarSign } from 'lucide-react';
import Navbar from '@/components/Navbar';
import CompactHeader from '@/components/modul8/CompactHeader';
import { toast } from '@/hooks/use-toast';

const Modul8Projects = () => {
  const { session } = useSession();
  const navigate = useNavigate();
  
  const [organizerData, setOrganizerData] = useState(null);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [session?.user?.id]);

  const loadData = async () => {
    if (!session?.user?.id) return;
    
    try {
      const organizer = await getUserOrganizer(session.user.id);
      if (!organizer) {
        navigate('/modul8/setup/organizer');
        return;
      }
      
      const requests = await getOrganizerServiceRequests(organizer.id);
      setOrganizerData(organizer);
      setServiceRequests(requests);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load projects data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRequestClick = (requestId: string) => {
    navigate(`/modul8/dashboard/request/${requestId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-500/30';
      case 'negotiating': return 'bg-[#00eada]/10 text-[#00eada] border-[#00eada]/30';
      case 'agreed': return 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-500/30';
      case 'in_progress': return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-500/30';
      case 'completed': return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-500/30';
      case 'cancelled': return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-500/30';
      default: return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-500/30';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#00eada]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="max-w-7xl mx-auto">
          <CompactHeader
            title="Your Projects"
            subtitle="Manage and track all your service requests"
            showBackButton={true}
            onBack={() => navigate('/modul8/dashboard')}
            backLabel="Back to Dashboard"
          />

          {/* Projects List */}
          <div className="animate-fade-in">
            {serviceRequests.length === 0 ? (
              <Card className="border-l-2 border-l-[#00eada]/30">
                <CardContent className="flex flex-col items-center justify-center py-8 sm:py-12">
                  <div className="p-4 rounded-full bg-[#00eada]/10 mb-3 sm:mb-4">
                    <Building2 className="h-10 w-10 sm:h-12 sm:w-12 text-[#00eada]" />
                  </div>
                  <h3 className="text-sm sm:text-base font-semibold text-muted-foreground mb-2">
                    No projects yet
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground text-center mb-3 sm:mb-4">
                    Start by exploring service providers and engaging with them
                  </p>
                  <Button
                    onClick={() => navigate('/modul8/partners')}
                    className="bg-[#00eada] hover:bg-[#00eada]/90 text-black text-xs sm:text-sm hover:shadow-lg hover:shadow-[#00eada]/30 transition-all duration-200 hover:scale-[1.02]"
                  >
                    Browse Providers
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {serviceRequests.map((request, index) => (
                  <Card
                    key={request.id}
                    className="group hover:shadow-lg hover:shadow-[#00eada]/10 transition-all duration-200 cursor-pointer border-l-2 border-l-transparent hover:border-l-[#00eada] hover:scale-[1.01]"
                    onClick={() => handleRequestClick(request.id)}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardHeader className="pb-2 sm:pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-sm sm:text-base line-clamp-1 group-hover:text-[#00eada] transition-colors duration-200">
                          {request.title}
                        </CardTitle>
                        <Badge className={`${getStatusColor(request.status)} font-medium text-xs border transition-all duration-200`} variant="outline">
                          {request.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                      {request.description && (
                        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                          {request.description}
                        </p>
                      )}
                    </CardHeader>
                    
                    <CardContent>
                      <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                        {request.budget_range && (
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-[#00eada] group-hover:scale-110 transition-transform duration-200" />
                            <span>
                              {request.budget_range.min && request.budget_range.max
                                ? `$${request.budget_range.min.toLocaleString()} - $${request.budget_range.max.toLocaleString()}`
                                : request.budget_range.min
                                ? `From $${request.budget_range.min.toLocaleString()}`
                                : 'Contact for pricing'
                              }
                            </span>
                          </div>
                        )}
                        {request.timeline && (
                          <div className="flex items-center gap-2">
                            <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-[#00eada] group-hover:scale-110 transition-transform duration-200" />
                            <span>{request.timeline}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                          <span className="text-xs">
                            Created {new Date(request.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modul8Projects;
