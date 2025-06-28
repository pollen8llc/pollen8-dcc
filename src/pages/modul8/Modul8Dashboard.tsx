
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

  const headerActions = (
    <>
      <Button
        onClick={() => navigate('/modul8/projects')}
        variant="outline"
        size="sm"
        className="text-sm"
      >
        View Projects
      </Button>
      <Button
        onClick={() => navigate('/modul8/partners')}
        className="bg-[#00eada] hover:bg-[#00eada]/90 text-black text-sm"
      >
        Manage Partners
      </Button>
    </>
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
          <div>
            <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">Service Domains</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {DOMAIN_PAGES.map((domain) => (
                <Card
                  key={domain.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleDomainClick(domain.id)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-[#00eada]" />
                      <CardTitle className="text-xs sm:text-sm font-medium">
                        {domain.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground line-clamp-2">
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
