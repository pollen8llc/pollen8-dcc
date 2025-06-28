
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/hooks/useSession';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FolderOpen, Clock, CheckCircle2, AlertCircle, Building2, Users } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { ModernHeader } from '@/components/modul8/ModernHeader';
import { getServiceRequests } from '@/services/modul8Service';
import { ServiceRequest } from '@/types/modul8';
import { toast } from '@/hooks/use-toast';

const Modul8Projects = () => {
  const { session } = useSession();
  const navigate = useNavigate();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const data = await getServiceRequests();
      setRequests(data || []);
    } catch (error) {
      console.error('Error loading requests:', error);
      toast({
        title: "Error",
        description: "Failed to load projects",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'negotiating':
        return <AlertCircle className="h-4 w-4" />;
      case 'agreed':
      case 'completed':
        return <CheckCircle2 className="h-4 w-4" />;
      default:
        return <FolderOpen className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'negotiating':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'agreed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'completed':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      default:
        return 'bg-muted text-muted-foreground';
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
      
      {/* Modern Header */}
      <ModernHeader
        title="Project Management Hub"
        subtitle="Project Dashboard"
        description="Track your active projects, monitor progress, and collaborate with service providers"
        primaryAction={{
          label: "Manage Partners",
          onClick: () => navigate('/modul8/partners'),
          icon: Users
        }}
        secondaryAction={{
          label: "Browse Domains",
          onClick: () => navigate('/modul8'),
          icon: Building2
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16 lg:pb-20">
        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {requests.length === 0 ? (
            <div className="col-span-full text-center py-16 sm:py-20 lg:py-24">
              <FolderOpen className="h-16 w-16 sm:h-20 sm:w-20 text-muted-foreground mx-auto mb-6" />
              <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">No Projects Yet</h3>
              <p className="text-base sm:text-lg text-muted-foreground mb-8 max-w-md mx-auto">
                Start your first project by engaging with service providers in our domains
              </p>
              <Button
                onClick={() => navigate('/modul8')}
                size="lg"
                className="bg-gradient-to-r from-[#00eada] to-[#00b8a8] hover:from-[#00b8a8] hover:to-[#008f82] text-white font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                Browse Service Domains
              </Button>
            </div>
          ) : (
            requests.map((request) => (
              <Card 
                key={request.id}
                className="group hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 cursor-pointer border-border/50 hover:border-primary/30 bg-gradient-to-br from-card/90 to-card/60 backdrop-blur-sm"
                onClick={() => navigate(`/modul8/request/${request.id}`)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between gap-3">
                    <CardTitle className="text-lg sm:text-xl font-bold line-clamp-2 group-hover:text-primary transition-colors duration-300">
                      {request.title}
                    </CardTitle>
                    <Badge className={`${getStatusColor(request.status)} flex items-center gap-1 text-xs font-semibold px-3 py-1`}>
                      {getStatusIcon(request.status)}
                      {request.status}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {request.description && (
                    <p className="text-sm sm:text-base text-muted-foreground line-clamp-3 group-hover:text-foreground/80 transition-colors duration-300">
                      {request.description}
                    </p>
                  )}
                  
                  {request.organizer && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Building2 className="h-4 w-4" />
                      <span>{request.organizer.organization_name}</span>
                    </div>
                  )}
                  
                  <div className="text-xs text-muted-foreground">
                    Created {new Date(request.created_at).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Modul8Projects;
