import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/hooks/useSession';
import { getProviderServiceRequests, getOrganizerServiceRequests } from '@/services/modul8Service';
import { ServiceRequest } from '@/types/modul8';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, DollarSign, User, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import StatsCard from '@/components/labr8/StatsCard';
import { CircleDollarSign, CheckCircle2, Timer, Loader2 } from 'lucide-react';
import RequestSection from '@/components/labr8/RequestSection';

interface RequestSectionProps {
  type: string;
  requests: ServiceRequest[];
  loading: boolean;
  emptyLabel: string;
  onDelete: () => void;
}

const ModernLabr8Dashboard = () => {
  const { session } = useSession();
  const navigate = useNavigate();
  const [data, setData] = useState({
    pendingRequests: [] as ServiceRequest[],
    negotiatingRequests: [] as ServiceRequest[],
    activeProjects: [] as ServiceRequest[],
    completedProjects: [] as ServiceRequest[],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!session?.user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const [providerRequests, organizerRequests] = await Promise.all([
          getProviderServiceRequests(session.user.id),
          getOrganizerServiceRequests(session.user.id),
        ]);

        const pendingRequests = [...providerRequests, ...organizerRequests].filter(req => req.status === 'pending');
        const negotiatingRequests = [...providerRequests, ...organizerRequests].filter(req => req.status === 'negotiating');
        const activeProjects = [...providerRequests, ...organizerRequests].filter(req => req.status === 'in_progress');
        const completedProjects = [...providerRequests, ...organizerRequests].filter(req => req.status === 'completed');

        setData({
          pendingRequests,
          negotiatingRequests,
          activeProjects,
          completedProjects,
        });
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: "Failed to load data",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [session?.user?.id]);

  const totalRequests = data.pendingRequests.length + data.negotiatingRequests.length + data.activeProjects.length + data.completedProjects.length;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatsCard
          label="Total Requests"
          value={totalRequests}
          description="All service requests"
          icon={<CircleDollarSign className="h-4 w-4" />}
        />
        <StatsCard
          label="Pending Requests"
          value={data.pendingRequests.length}
          description="Awaiting action"
          icon={<Timer className="h-4 w-4" />}
        />
        <StatsCard
          label="Active Projects"
          value={data.activeProjects.length}
          description="Currently in progress"
          icon={<Loader2 className="h-4 w-4 animate-spin" />}
        />
        <StatsCard
          label="Completed Projects"
          value={data.completedProjects.length}
          description="Successfully finished"
          icon={<CheckCircle2 className="h-4 w-4" />}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RequestSection
          type="pending"
          requests={data.pendingRequests}
          loading={isLoading}
          emptyLabel="No pending requests"
          onDelete={() => {}}
        />
        
        <RequestSection
          type="negotiating"
          requests={data.negotiatingRequests}
          loading={isLoading}
          emptyLabel="No ongoing negotiations"
          onDelete={() => {}}
        />
        
        <RequestSection
          type="active"
          requests={data.activeProjects}
          loading={isLoading}
          emptyLabel="No active projects"
          onDelete={() => {}}
        />
        
        <RequestSection
          type="completed"
          requests={data.completedProjects}
          loading={isLoading}
          emptyLabel="No completed projects"
          onDelete={() => {}}
        />
      </div>
    </div>
  );
};

export default ModernLabr8Dashboard;
