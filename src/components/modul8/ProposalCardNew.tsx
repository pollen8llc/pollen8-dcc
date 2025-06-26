
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
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
import { format } from 'date-fns';

interface ProposalCardNewProps {
  card: ProposalCard;
  onAccept?: () => void;
  onReject?: () => void;
  onCounter?: (data: any) => void;
  onCancel?: () => void;
  canRespond?: boolean;
  isOwner?: boolean;
  className?: string;
}

const ProposalCardNew: React.FC<ProposalCardNewProps> = ({
  card,
  onAccept,
  onReject,
  onCounter,
  onCancel,
  canRespond = false,
  isOwner = false,
  className = ''
}) => {
  const [showCounterForm, setShowCounterForm] = useState(false);
  const [counterData, setCounterData] = useState({
    notes: card.notes || '',
    scope_link: card.scope_link || '',
    terms_link: card.terms_link || '',
    asset_links: card.asset_links.join('\n')
  });
  const [responseNotes, setResponseNotes] = useState('');

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

  const handleCounter = () => {
    if (onCounter) {
      const assetLinksArray = counterData.asset_links
        .split('\n')
        .map(link => link.trim())
        .filter(link => link.length > 0);

      onCounter({
        ...counterData,
        asset_links: assetLinksArray
      });
    }
    setShowCounterForm(false);
  };

  const handleAcceptWithNotes = () => {
    if (onAccept) {
      onAccept();
    }
  };

  const handleRejectWithNotes = () => {
    if (onReject) {
      onReject();
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

        {/* Counter Form */}
        {showCounterForm && (
          <div className="border-t pt-4 space-y-4">
            <h4 className="font-medium">Create Counter Proposal</h4>
            
            <div className="space-y-2">
              <Label htmlFor="counter-notes">Notes</Label>
              <Textarea
                id="counter-notes"
                value={counterData.notes}
                onChange={(e) => setCounterData({...counterData, notes: e.target.value})}
                placeholder="Enter proposal notes..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="counter-scope">Scope Link</Label>
                <Input
                  id="counter-scope"
                  type="url"
                  value={counterData.scope_link}
                  onChange={(e) => setCounterData({...counterData, scope_link: e.target.value})}
                  placeholder="https://..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="counter-terms">Terms Link</Label>
                <Input
                  id="counter-terms"
                  type="url"
                  value={counterData.terms_link}
                  onChange={(e) => setCounterData({...counterData, terms_link: e.target.value})}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="counter-assets">Asset Links (one per line)</Label>
              <Textarea
                id="counter-assets"
                value={counterData.asset_links}
                onChange={(e) => setCounterData({...counterData, asset_links: e.target.value})}
                placeholder="https://asset1.com&#10;https://asset2.com"
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleCounter}
                className="bg-[#00eada] hover:bg-[#00eada]/90 text-black"
              >
                Submit Counter
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowCounterForm(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Actions */}
        {canRespond && card.status === 'pending' && !card.is_locked && (
          <div className="flex flex-wrap gap-3 pt-4 border-t border-border/40">
            <Button
              onClick={handleAcceptWithNotes}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Accept
            </Button>
            <Button
              onClick={() => setShowCounterForm(true)}
              variant="outline"
              className="border-[#00eada] text-[#00eada] hover:bg-[#00eada]/10"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Counter
            </Button>
            <Button
              onClick={handleRejectWithNotes}
              variant="outline"
              className="border-red-500 text-red-600 hover:bg-red-50"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject
            </Button>
          </div>
        )}

        {/* Owner Actions */}
        {isOwner && card.status === 'pending' && !card.is_locked && (
          <div className="flex gap-3 pt-4 border-t border-border/40">
            <Button
              onClick={onCancel}
              variant="outline"
              className="border-red-500 text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Cancel Card
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProposalCardNew;
