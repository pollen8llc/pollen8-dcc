
import React, { useState, useEffect } from "react";
import { useSession } from "@/hooks/useSession";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UnifiedHeader } from "@/components/shared/UnifiedHeader";
import { getUserOrganizer, getOrganizerServiceRequests } from "@/services/modul8Service";
import { Organizer, ServiceRequest } from "@/types/modul8";
import { toast } from "@/hooks/use-toast";
import {
  Users,
  Calendar,
  Scale,
  Megaphone,
  Code,
  Store,
  Handshake,
  Heart,
  ArrowRight,
  Building,
  AlertCircle,
  Plus,
  Activity,
  Clock,
  CheckCircle,
  DollarSign
} from "lucide-react";

const DOMAIN_AREAS = [
  {
    id: 1,
    title: "Fundraising & Sponsorship",
    icon: DollarSign,
    description: "Grant writers, fundraising consultants, sponsor prospecting",
    color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
  },
  {
    id: 2,
    title: "Event Production & Logistics",
    icon: Calendar,
    description: "Venue managers, caterers, AV techs, security, insurance",
    color: "bg-blue-500/20 text-blue-300 border-blue-500/30"
  },
  {
    id: 3,
    title: "Legal & Compliance",
    icon: Scale,
    description: "Legal advisors, accountants, permit specialists",
    color: "bg-purple-500/20 text-purple-300 border-purple-500/30"
  },
  {
    id: 4,
    title: "Marketing & Communications",
    icon: Megaphone,
    description: "Designers, developers, social media managers, PR",
    color: "bg-orange-500/20 text-orange-300 border-orange-500/30"
  },
  {
    id: 5,
    title: "Technology & Digital Infrastructure",
    icon: Code,
    description: "App/web developers, CRM consultants, livestream techs",
    color: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30"
  },
  {
    id: 6,
    title: "Vendor & Marketplace Management",
    icon: Store,
    description: "Vendor managers, logistics coordinators, payment processors",
    color: "bg-pink-500/20 text-pink-300 border-pink-500/30"
  },
  {
    id: 7,
    title: "Partnership Development",
    icon: Handshake,
    description: "Collaboration consultants, brokers, network facilitators",
    color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
  },
  {
    id: 8,
    title: "Community Engagement & Relations",
    icon: Heart,
    description: "Community managers, engagement strategists, DEI consultants",
    color: "bg-red-500/20 text-red-300 border-red-500/30"
  }
];

const Modul8Dashboard: React.FC = () => {
  const { session, logout } = useSession();
  const navigate = useNavigate();
  const [organizer, setOrganizer] = useState<Organizer | null>(null);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [session?.user?.id]);

  const loadData = async () => {
    if (!session?.user?.id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('Loading organizer data for user:', session.user.id);
      
      const [organizerData, requestsData] = await Promise.all([
        getUserOrganizer(session.user.id),
        getUserOrganizer(session.user.id).then(org => 
          org ? getOrganizerServiceRequests(org.id) : []
        )
      ]);
      
      console.log('Organizer data loaded:', organizerData);
      console.log('Service requests loaded:', requestsData);
      
      setOrganizer(organizerData);
      setServiceRequests(requestsData);
    } catch (err: any) {
      console.error('Error loading data:', err);
      setError(err?.message || "Failed to load dashboard data");
      toast({
        title: "Error loading data",
        description: err?.message || "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDomainClick = (domainId: number) => {
    console.log('Navigating to domain:', domainId);
    navigate(`/modul8/domain/${domainId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'negotiating': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'agreed': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'in_progress': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'completed': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'declined': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const pendingRequests = serviceRequests.filter(r => r.status === 'pending');
  const activeRequests = serviceRequests.filter(r => ['negotiating', 'agreed', 'in_progress'].includes(r.status));
  const completedRequests = serviceRequests.filter(r => r.status === 'completed');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#00eada] mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading Modul8 Dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-300 mb-4">{error}</p>
          <Button 
            onClick={loadData}
            className="bg-[#00eada] hover:bg-[#00c4b8] text-black"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!organizer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Complete Your Organization Setup</h2>
          <p className="text-gray-300 mb-4">
            You need to complete your organizer profile to access the Modul8 dashboard.
          </p>
          <Button 
            onClick={() => navigate('/modul8/setup')}
            className="bg-[#00eada] hover:bg-[#00c4b8] text-black"
          >
            Complete Setup
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <UnifiedHeader 
        platform="modul8" 
        user={session?.user}
        notificationCount={pendingRequests.length}
        unreadMessages={0}
        onLogout={logout}
      />
      
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16 border-4 border-[#00eada]/30">
              <AvatarFallback className="bg-gradient-to-br from-[#00eada] to-[#00c4b8] text-black text-lg font-bold">
                {organizer.organization_name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-white">Modul8 Console</h1>
              <p className="text-lg text-gray-300">{organizer.organization_name}</p>
              <p className="text-sm text-gray-400 mt-1">Community Operations Dashboard</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Button 
              onClick={() => navigate('/modul8/providers')}
              variant="outline" 
              className="border-gray-600 text-gray-300 hover:bg-white/10"
            >
              Browse All Providers
            </Button>
            <Button 
              onClick={() => navigate('/modul8/request/create')}
              className="bg-gradient-to-r from-[#00eada] to-[#00c4b8] hover:from-[#00c4b8] hover:to-[#00eada] text-black font-semibold flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Create Request
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Pending Requests</p>
                  <p className="text-2xl font-bold text-white">{pendingRequests.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Active Projects</p>
                  <p className="text-2xl font-bold text-white">{activeRequests.length}</p>
                </div>
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Activity className="h-6 w-6 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Completed</p>
                  <p className="text-2xl font-bold text-white">{completedRequests.length}</p>
                </div>
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Total Requests</p>
                  <p className="text-2xl font-bold text-white">{serviceRequests.length}</p>
                </div>
                <div className="w-12 h-12 bg-[#00eada]/20 rounded-lg flex items-center justify-center">
                  <Building className="h-6 w-6 text-[#00eada]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Domain Areas */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Service Domains</h2>
            <p className="text-gray-400">Select a domain to find service providers</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {DOMAIN_AREAS.map((domain) => {
              const IconComponent = domain.icon;
              return (
                <Card 
                  key={domain.id} 
                  className="glass-card glass-morphism-hover cursor-pointer transition-all duration-200 hover:scale-105"
                  onClick={() => handleDomainClick(domain.id)}
                >
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${domain.color}`}>
                          <IconComponent className="h-6 w-6" />
                        </div>
                        <ArrowRight className="h-5 w-5 text-gray-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white mb-2">{domain.title}</h3>
                        <p className="text-sm text-gray-400 line-clamp-2">{domain.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        {serviceRequests.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Recent Requests</h2>
              <Button 
                variant="ghost" 
                onClick={() => navigate('/modul8/requests')}
                className="text-gray-300 hover:text-white"
              >
                View All <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            
            <div className="grid gap-4">
              {serviceRequests.slice(0, 3).map((request) => (
                <Card key={request.id} className="glass-card glass-morphism-hover">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-white mb-2">{request.title}</h4>
                        <p className="text-sm text-gray-300 mb-3 line-clamp-2">
                          {request.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span>Created {new Date(request.created_at).toLocaleDateString()}</span>
                          {request.service_provider && (
                            <span>• Provider assigned</span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2 ml-4">
                        <Badge className={`${getStatusColor(request.status)} font-medium border`}>
                          {request.status.replace('_', ' ')}
                        </Badge>
                        <Button
                          onClick={() => navigate(`/modul8/request/${request.id}`)}
                          size="sm"
                          className="bg-[#00eada] hover:bg-[#00c4b8] text-black"
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modul8Dashboard;
