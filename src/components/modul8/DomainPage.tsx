import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { 
  DollarSign, 
  FileText, 
  Clock, 
  CheckCircle, 
  MessageSquare,
  User,
  Building,
  Link
} from 'lucide-react';
import { ServiceProvider, DOMAIN_PAGES } from '@/types/modul8';
import { getServiceProvidersByDomain } from '@/services/modul8Service';
import { useSession } from '@/hooks/useSession';
import { useNavigate } from 'react-router-dom';
import { useSmartEngage } from '@/hooks/useSmartEngage';

interface DomainPageProps {
  domainId: number;
  title: string;
  description: string;
}

const DomainPage: React.FC<DomainPageProps> = ({ domainId, title, description }) => {
  const { session } = useSession();
  const navigate = useNavigate();
  const [serviceProviders, setServiceProviders] = useState<ServiceProvider[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { handleEngage, loading: engageLoading } = useSmartEngage();

  useEffect(() => {
    loadData();
  }, [domainId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const providers = await getServiceProvidersByDomain(domainId);
      setServiceProviders(providers);
    } catch (error) {
      console.error('Error fetching service providers:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="space-y-4">
        <h2 className="text-3xl font-bold">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
      </div>

      {/* Service Providers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {serviceProviders.map((provider) => (
          <Card key={provider.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 rounded-full p-2 mr-3 group-hover:bg-primary/20 transition-colors">
                  <Avatar userId={provider.user_id} size={32} />
                </div>
                <CardTitle className="text-base font-semibold">{provider.business_name}</CardTitle>
              </div>
            </CardHeader>
            
            <CardContent>
              {provider.tagline && (
                <p className="text-sm text-muted-foreground mb-3">{provider.tagline}</p>
              )}

              <div className="space-y-2">
                {provider.pricing_range && (
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {provider.pricing_range.min && provider.pricing_range.max
                        ? `$${provider.pricing_range.min} - $${provider.pricing_range.max}`
                        : 'Pricing: Varies'}
                    </span>
                  </div>
                )}
                
                {provider.services && provider.services.length > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      Services: {provider.services.slice(0, 3).join(', ')}
                      {provider.services.length > 3 && '...'}
                    </span>
                  </div>
                )}
                
                {provider.portfolio_links && provider.portfolio_links.length > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <Link className="h-4 w-4 text-muted-foreground" />
                    <a href={provider.portfolio_links[0]} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:underline">
                      Portfolio
                    </a>
                  </div>
                )}
              </div>

              <Button
                onClick={() => handleEngage(provider.id)}
                disabled={engageLoading}
                className="w-full bg-[#00eada] hover:bg-[#00eada]/90 text-black font-medium"
              >
                {engageLoading ? 'Processing...' : 'Engage'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {loading && (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#00eada]"></div>
        </div>
      )}
      {!loading && serviceProviders.length === 0 && (
        <div className="text-center text-muted-foreground">
          <p>No service providers found in this domain yet.</p>
        </div>
      )}
    </div>
  );
};

export default DomainPage;
