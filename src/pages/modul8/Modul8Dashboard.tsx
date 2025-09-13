
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/hooks/useSession';
import { getUserOrganizer } from '@/services/modul8Service';
import { DOMAIN_PAGES } from '@/types/modul8';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import CompactHeader from '@/components/modul8/CompactHeader';
import { toast } from '@/hooks/use-toast';
import { useModuleCompletion } from '@/hooks/useModuleCompletion';

const Modul8Dashboard = () => {
  const navigate = useNavigate();
  const { session } = useSession();
  const [organizerData, setOrganizerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { modul8_complete, loading: completionLoading } = useModuleCompletion();

  useEffect(() => {
    loadData();
  }, [session?.user?.id, completionLoading, modul8_complete]);

  const loadData = async () => {
    if (!session?.user?.id) return;
    
  // Check MODUL8 setup status - only use database state
  if (!completionLoading && modul8_complete === false) {
    console.log('Modul8Dashboard: Redirecting to setup because modul8_complete is false', {
      userId: session?.user?.id,
      modul8_complete,
      completionLoading
    });
    navigate('/modul8/setup/organizer');  
    return;
  }
    
    if (completionLoading || modul8_complete === null) {
      return;
    }
    
    try {
      const organizer = await getUserOrganizer(session.user.id);
      if (!organizer) {
        // If no organizer found but setup is marked complete, redirect to setup to fix inconsistency
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

  const headerActions = (
    <div className="flex flex-col sm:flex-row gap-2">
      <Button
        onClick={() => navigate('/modul8/projects')}
        variant="outline"
        size="sm"
        className="text-xs sm:text-sm border-[#00eada]/30 hover:border-[#00eada] hover:bg-[#00eada]/10 transition-all duration-200 hover:shadow-md hover:shadow-[#00eada]/20"
      >
        <span className="hidden sm:inline">View Projects</span>
        <span className="sm:hidden">Projects</span>
      </Button>
      <Button
        onClick={() => navigate('/modul8/partners')}
        className="bg-[#00eada] hover:bg-[#00eada]/90 text-black text-xs sm:text-sm hover:shadow-lg hover:shadow-[#00eada]/30 transition-all duration-200 hover:scale-[1.02]"
      >
        <span className="hidden sm:inline">Manage Partners</span>
        <span className="sm:hidden">Partners</span>
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="max-w-7xl mx-auto">
          <CompactHeader
            title="Modul8 Dashboard"
            subtitle="Connect with service providers across specialized domains"
            actions={headerActions}
          />

          {/* Service Domains */}
          <div className="animate-fade-in">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-semibold">Service Domains</h2>
              <div className="h-px flex-1 bg-gradient-to-r from-[#00eada]/30 to-transparent"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
              {DOMAIN_PAGES.map((domain, index) => (
                <Card
                  key={domain.id}
                  className="group hover:shadow-lg hover:shadow-[#00eada]/10 transition-all duration-200 cursor-pointer border-l-2 border-l-transparent hover:border-l-[#00eada] hover:scale-[1.02]"
                  onClick={() => handleDomainClick(domain.id)}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardHeader className="pb-2 p-3 sm:p-4">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-[#00eada]/10 group-hover:bg-[#00eada]/20 transition-colors duration-200">
                        <Building2 className="h-3 w-3 sm:h-4 sm:w-4 text-[#00eada] group-hover:scale-110 transition-transform duration-200" />
                      </div>
                      <CardTitle className="text-xs sm:text-sm font-medium group-hover:text-[#00eada] transition-colors duration-200 line-clamp-1">
                        {domain.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-4 pt-0">
                    <p className="text-xs text-muted-foreground line-clamp-2 group-hover:text-muted-foreground/80 transition-colors duration-200">
                      {domain.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modul8Dashboard;
