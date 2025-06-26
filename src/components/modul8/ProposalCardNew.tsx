
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  CheckCircle, 
  XCircle, 
  MessageSquare, 
  ExternalLink,
  Trash2,
  User,
  Calendar,
  Lock
} from 'lucide-react';
import { ProposalCard } from '@/types/proposalCards';
import { ProposalActionHandler } from './ProposalActionHandler';
import { format } from 'date-fns';

interface ProposalCardNewProps {
  card: ProposalCard;
  serviceRequest?: any;
  onAccept?: () => void;
  onReject?: () => void;
  onCounter?: (data: any) => void;
  onCancel?: () => void;
  className?: string;
}

const ProposalCardNew: React.FC<ProposalCardNewProps> = ({
  card,
  serviceRequest,
  onAccept,
  onReject,
  onCounter,
  onCancel,
  className = ''
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'countered':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      case 'countered':
        return <MessageSquare className="h-4 w-4" />;
      case 'cancelled':
        return <Trash2 className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  return (
    <Card className={`${className} border-l-4 border-l-[#00eada] relative`}>
      {card.is_locked && (
        <div className="absolute top-2 right-2">
          <Lock className="h-4 w-4 text-gray-400" />
        </div>
      )}
      
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback>
                <User className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold">
                Proposal Card #{card.card_number}
              </div>
              <div className="text-sm text-muted-foreground">
                {format(new Date(card.created_at), 'MMM dd, yyyy • HH:mm')}
              </div>
            </div>
          </div>
          
          <Badge className={`${getStatusColor(card.status)} border font-medium`}>
            {getStatusIcon(card.status)}
            <span className="ml-1">
              {card.status.charAt(0).toUpperCase() + card.status.slice(1)}
            </span>
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Card Content */}
        {card.notes && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Notes</Label>
            <div className="bg-muted/20 p-3 rounded-lg text-sm">
              {card.notes}
            </div>
          </div>
        )}

        {/* Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {card.scope_link && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Scope of Work</Label>
              <a 
                href={card.scope_link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#00eada] hover:text-[#00eada]/80 text-sm"
              >
                View Scope <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          )}

          {card.terms_link && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Terms & Conditions</Label>
              <a 
                href={card.terms_link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#00eada] hover:text-[#00eada]/80 text-sm"
              >
                View Terms <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          )}
        </div>

        {/* Asset Links */}
        {card.asset_links.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Assets & Documents</Label>
            <div className="space-y-1">
              {card.asset_links.map((link, index) => (
                <a 
                  key={index}
                  href={link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[#00eada] hover:text-[#00eada]/80 text-sm"
                >
                  Asset {index + 1} <ExternalLink className="h-3 w-3" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Standardized Action Handler */}
        {serviceRequest && (onAccept || onReject || onCounter || onCancel) && (
          <ProposalActionHandler
            card={card}
            serviceRequest={serviceRequest}
            onAccept={onAccept || (() => {})}
            onReject={onReject || (() => {})}
            onCounter={onCounter || (() => {})}
            onCancel={onCancel || (() => {})}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default ProposalCardNew;
