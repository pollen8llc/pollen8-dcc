
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/hooks/useSession';
import { getUserOrganizer } from '@/services/modul8Service';
import { DOMAIN_PAGES } from '@/types/modul8';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Building2, Briefcase, FolderOpen } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { toast } from '@/hooks/use-toast';

const Modul8Dashboard = () => {
  const { session } = useSession();
  const navigate = useNavigate();
  
  const [organizerData, setOrganizerData] = useState(null);
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
      
      setOrganizerData(organizer);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDomainClick = (domainId: number) => {
    navigate(`/modul8/dashboard/directory?domain=${domainId}`);
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
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile-First Header Design */}
        <div className="pt-6 pb-8 sm:pt-8 sm:pb-10">
          <div className="flex flex-col space-y-4 sm:space-y-6">
            {/* Logo and Brand Section */}
            <div className="flex items-center justify-center sm:justify-start">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 rounded-xl bg-gradient-to-br from-[#00eada] to-[#00b8a8] flex items-center justify-center shadow-lg">
                  <Briefcase className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-white" />
                </div>
                <div className="text-center sm:text-left">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    MODUL-8
                  </h1>
                  <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                    Service Marketplace Dashboard
                  </p>
                </div>
              </div>
            </div>

            {/* Description and Primary Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="text-center sm:text-left max-w-2xl">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-foreground mb-2">
                  Connect with specialized service providers
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Browse domains, manage projects, and collaborate with top-tier professionals
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 min-w-fit">
                <Button
                  onClick={() => navigate('/modul8/projects')}
                  variant="outline"
                  size="sm"
                  className="flex items-center justify-center gap-2 border-primary/20 text-primary hover:bg-primary/5"
                >
                  <FolderOpen className="h-4 w-4" />
                  <span className="hidden sm:inline">View Projects</span>
                  <span className="sm:hidden">Projects</span>
                </Button>
                <Button
                  onClick={() => navigate('/modul8/dashboard/request/new')}
                  size="sm"
                  className="bg-gradient-to-r from-[#00eada] to-[#00b8a8] hover:from-[#00b8a8] hover:to-[#008f82] text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Request
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Service Domains Grid */}
        <div className="pb-8 sm:pb-12">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">Service Domains</h2>
              <p className="text-sm sm:text-base text-muted-foreground mt-1">
                Choose from specialized service categories
              </p>
            </div>
            <Button
              onClick={() => navigate('/modul8/partners')}
              variant="outline"
              size="sm"
              className="hidden sm:flex items-center gap-2"
            >
              Manage Partners
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {DOMAIN_PAGES.map((domain) => (
              <Card
                key={domain.id}
                className="group hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 cursor-pointer border-border/50 hover:border-primary/30 bg-gradient-to-br from-card to-card/50"
                onClick={() => handleDomainClick(domain.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-colors duration-200">
                      <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    </div>
                    <CardTitle className="text-sm sm:text-base font-semibold group-hover:text-primary transition-colors duration-200">
                      {domain.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 group-hover:text-foreground/80 transition-colors duration-200">
                    {domain.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modul8Dashboard;
