
import React from 'react';
import { ServiceProvider } from '@/types/modul8';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, MapPin, ExternalLink } from 'lucide-react';

interface EnhancedProviderCardProps {
  provider: ServiceProvider;
  onSelect?: (provider: ServiceProvider) => void;
  onEngage?: (providerId: string) => Promise<void>;
  onViewProfile?: (providerId: string) => void;
  hasExistingRequest?: boolean;
}

const EnhancedProviderCard: React.FC<EnhancedProviderCardProps> = ({ 
  provider, 
  onSelect,
  onEngage,
  onViewProfile,
  hasExistingRequest
}) => {
  const handleSelect = () => {
    if (onSelect) {
      onSelect(provider);
    }
  };

  const handleEngage = async () => {
    if (onEngage) {
      await onEngage(provider.id);
    }
  };

  const handleViewProfile = () => {
    if (onViewProfile) {
      onViewProfile(provider.id);
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            {provider.logo_url && (
              <img 
                src={provider.logo_url} 
                alt={provider.business_name}
                className="w-12 h-12 rounded-lg object-cover"
              />
            )}
            <div>
              <h3 className="font-semibold text-lg">{provider.business_name}</h3>
              {provider.tagline && (
                <p className="text-sm text-muted-foreground">{provider.tagline}</p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm">4.8</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {provider.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {provider.description}
          </p>
        )}
        
        {provider.tags && provider.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {provider.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {provider.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{provider.tags.length - 3} more
              </Badge>
            )}
          </div>
        )}
        
        <div className="flex items-center justify-between pt-2">
          <div className="text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 inline mr-1" />
            Remote
          </div>
          
          <div className="flex gap-2">
            {onEngage && (
              <Button 
                size="sm" 
                onClick={handleEngage}
                disabled={hasExistingRequest}
              >
                {hasExistingRequest ? 'Already Engaged' : 'Engage'}
              </Button>
            )}
            
            <Button size="sm" variant="outline" onClick={handleViewProfile || handleSelect}>
              View Profile
              <ExternalLink className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedProviderCard;
