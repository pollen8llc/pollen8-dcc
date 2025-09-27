
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { 
  Star, 
  MapPin, 
  ExternalLink, 
  MessageSquare,
  Building
} from 'lucide-react';
import { ServiceProvider } from '@/types/modul8';
import { Link } from 'react-router-dom';

interface EnhancedProviderCardProps {
  provider: ServiceProvider;
  onEngage: (providerId: string) => void;
  onViewProfile: (providerId: string) => void;
  hasExistingRequest?: boolean;
  className?: string;
}

const EnhancedProviderCard: React.FC<EnhancedProviderCardProps> = ({
  provider,
  onEngage,
  onViewProfile,
  hasExistingRequest = false,
  className = ''
}) => {
  const formatPricing = (pricing: any) => {
    if (!pricing || typeof pricing !== 'object') return 'Contact for pricing';
    const { min, max, currency = 'USD' } = pricing;
    if (min && max) {
      return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}`;
    } else if (min) {
      return `From ${currency} ${min.toLocaleString()}`;
    }
    return 'Contact for pricing';
  };

  return (
    <Card className={`hover:shadow-md transition-shadow ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="bg-primary/10 rounded-full p-3 mr-4 group-hover:bg-primary/20 transition-colors">
            <Avatar userId={provider.user_id} size={48} />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-lg line-clamp-1">
                  {provider.business_name}
                </h3>
                {provider.tagline && (
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {provider.tagline}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground ml-2">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>4.8</span>
              </div>
            </div>

            {provider.description && (
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {provider.description}
              </p>
            )}

            <div className="flex flex-wrap gap-2 mb-3">
              {provider.services && Array.isArray(provider.services) && 
               provider.services.slice(0, 3).map((service: any, index: number) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {typeof service === 'string' ? service : service.name || 'Service'}
                </Badge>
              ))}
              {provider.services && Array.isArray(provider.services) && 
               provider.services.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{provider.services.length - 3} more
                </Badge>
              )}
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span>Remote</span>
                </div>
                <span className="font-medium">
                  {formatPricing(provider.pricing_range)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-4 pt-4 border-t border-border/40">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <Link to={`/profile/${provider.id}`}>
              <ExternalLink className="h-3 w-3" />
              View Profile
            </Link>
          </Button>
          <Button
            onClick={() => onEngage(provider.id)}
            size="sm"
            className={`flex items-center gap-1 flex-1 ${
              hasExistingRequest 
                ? 'bg-orange-500 hover:bg-orange-600' 
                : 'bg-[#00eada] hover:bg-[#00eada]/90'
            } text-black`}
          >
            <MessageSquare className="h-3 w-3" />
            {hasExistingRequest ? 'Continue Discussion' : 'Engage'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedProviderCard;
