
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle, MessageSquare, Trash2 } from 'lucide-react';
import { ProposalCard } from '@/types/proposalCards';
import { useSession } from '@/hooks/useSession';

interface ProposalActionHandlerProps {
  card: ProposalCard;
  onAccept: () => void;
  onReject: () => void;
  onCounter: (data: any) => void;
  onCancel: () => void;
  serviceRequest: any;
}

export const ProposalActionHandler: React.FC<ProposalActionHandlerProps> = ({
  card,
  onAccept,
  onReject,
  onCounter,
  onCancel,
  serviceRequest
}) => {
  const { session } = useSession();
  const [showCounterForm, setShowCounterForm] = useState(false);
  const [counterData, setCounterData] = useState({
    notes: card.notes || '',
    scope_link: card.scope_link || '',
    terms_link: card.terms_link || '',
    asset_links: card.asset_links.join('\n')
  });

  // Determine user role
  const isOrganizer = session?.user?.id === serviceRequest?.organizer?.user_id;
  const isServiceProvider = session?.user?.id && serviceRequest?.service_provider?.user_id === session.user.id;
  const isCardOwner = session?.user?.id === card.submitted_by;

  // Simple status-based logic (labr8 pattern)
  const canRespond = () => {
    if (card.status !== 'pending' || card.is_locked) return false;
    
    // Can't respond to your own card
    if (isCardOwner) return false;
    
    // Must be either organizer or service provider
    return isOrganizer || isServiceProvider;
  };

  const canCancel = () => {
    return isCardOwner && card.status === 'pending' && !card.is_locked;
  };

  const handleCounter = () => {
    const assetLinksArray = counterData.asset_links
      .split('\n')
      .map(link => link.trim())
      .filter(link => link.length > 0);

    onCounter({
      ...counterData,
      asset_links: assetLinksArray
    });
    setShowCounterForm(false);
  };

  // Don't render if no actions available
  if (!canRespond() && !canCancel()) {
    return null;
  }

  return (
    <div className="space-y-4">
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

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 pt-4 border-t border-border/40">
        {/* Response Actions */}
        {canRespond() && (
          <>
            <Button
              onClick={onAccept}
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
              onClick={onReject}
              variant="outline"
              className="border-red-500 text-red-600 hover:bg-red-50"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject
            </Button>
          </>
        )}

        {/* Owner Actions */}
        {canCancel() && (
          <Button
            onClick={onCancel}
            variant="outline"
            className="border-red-500 text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Cancel Card
          </Button>
        )}
      </div>
    </div>
  );
};
