
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/hooks/useSession';
import { getUserOrganizer } from '@/services/modul8Service';
import { DOMAIN_PAGES } from '@/types/modul8';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users, FolderOpen } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { toast } from '@/hooks/use-toast';
import { ModernHeader } from '@/components/modul8/ModernHeader';

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
      
      {/* Modern Header */}
      <ModernHeader
        title="Connect with specialized service providers"
        subtitle="Service Marketplace Dashboard"
        description="Browse domains, manage projects, and collaborate with top-tier professionals"
        primaryAction={{
          label: "Manage Partners",
          onClick: () => navigate('/modul8/partners'),
          icon: Users
        }}
        secondaryAction={{
          label: "View Projects",
          onClick: () => navigate('/modul8/projects'),
          icon: FolderOpen
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Service Domains Grid */}
        <div className="pb-12 sm:pb-16 lg:pb-20">
          <div className="flex items-center justify-between mb-8 sm:mb-12">
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">Service Domains</h2>
              <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mt-2 sm:mt-3">
                Choose from specialized service categories
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {DOMAIN_PAGES.map((domain) => (
              <Card
                key={domain.id}
                className="group hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 cursor-pointer border-border/50 hover:border-primary/50 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm hover:from-card to-card/60 transform hover:scale-105"
                onClick={() => handleDomainClick(domain.id)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 group-hover:from-primary/30 group-hover:to-primary/20 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                      <Building2 className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
                    </div>
                    <CardTitle className="text-lg sm:text-xl font-bold group-hover:text-primary transition-colors duration-300">
                      {domain.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm sm:text-base text-muted-foreground line-clamp-3 group-hover:text-foreground/90 transition-colors duration-300 leading-relaxed">
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
