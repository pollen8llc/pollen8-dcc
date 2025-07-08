
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ProposalCard } from '@/types/proposalCards';
import { 
  ExternalLink, 
  Link as LinkIcon,
  CheckCircle,
  Calendar,
  User,
  Loader2
} from 'lucide-react';
import { useSession } from '@/hooks/useSession';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface FinalizationCardProps {
  card: ProposalCard;
  organizerId?: string;
  serviceProviderId?: string;
  onActionComplete?: () => void;
}

const FinalizationCard: React.FC<FinalizationCardProps> = ({ 
  card, 
  organizerId, 
  serviceProviderId,
  onActionComplete 
}) => {
  const { session } = useSession();
  const [deelUrl, setDeelUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const currentUserId = session?.user?.id;

  // Improved role detection logic
  console.log('🔍 FinalizationCard - Role Detection Debug:', {
    currentUserId,
    organizerId,
    serviceProviderId,
    cardSubmittedBy: card.submitted_by
  });

  // Check if current user is the organizer by matching with organizerId prop
  const isCurrentUserOrganizer = organizerId && currentUserId === organizerId;
  
  // Check if current user is the service provider by matching with serviceProviderId prop
  const isCurrentUserServiceProvider = serviceProviderId && currentUserId === serviceProviderId;

  console.log('👤 FinalizationCard - User Role Status:', {
    isCurrentUserOrganizer,
    isCurrentUserServiceProvider
  });

  // Extract DEEL URL from notes with improved pattern matching
  const extractDeelUrl = (notes: string | null) => {
    if (!notes) return null;
    console.log('🔍 Checking notes for DEEL URL:', notes);
    
    // Enhanced patterns to catch different URL formats
    const patterns = [
      /DEEL Contract URL:\s*(https?:\/\/[^\s\n]+)/i,
      /deel.*?url:\s*(https?:\/\/[^\s\n]+)/i,
      /contract.*?url:\s*(https?:\/\/[^\s\n]+)/i,
      /(https?:\/\/(?:app\.)?deel\.com[^\s\n]*)/i,
      /(https?:\/\/[^\s\n]*deel[^\s\n]*)/i  // Catch any URL containing 'deel'
    ];
    
    for (const pattern of patterns) {
      const match = notes.match(pattern);
      if (match) {
        console.log('✅ Found DEEL URL:', match[1]);
        return match[1];
      }
    }
    
    console.log('❌ No DEEL URL found in notes');
    return null;
  };

  const existingDeelUrl = extractDeelUrl(card.notes);
  console.log('🔗 Existing DEEL URL:', existingDeelUrl);

  const handleGoToDeel = () => {
    window.open('https://app.deel.com', '_blank');
  };

  const handleViewDeel = () => {
    if (existingDeelUrl) {
      window.open(existingDeelUrl, '_blank');
    }
  };

  const handleSubmitDeelLink = async () => {
    if (!deelUrl.trim()) {
      toast({
        title: "URL Required",
        description: "Please enter a valid DEEL agreement URL",
        variant: "destructive"
      });
      return;
    }

    if (!isCurrentUserOrganizer) {
      toast({
        title: "Permission Denied",
        description: "Only organizers can submit DEEL contract URLs",
        variant: "destructive"
      });
      return;
    }

    try {
      setSubmitting(true);
      console.log('💾 Submitting DEEL URL:', deelUrl);
      
      // Store the DEEL URL in the notes field with clear formatting
      const deelUrlEntry = `\n\nDEEL Contract URL: ${deelUrl}`;
      const updatedNotes = (card.notes || '') + deelUrlEntry;
      
      console.log('📝 Updating notes to:', updatedNotes);
      
      const { error } = await supabase
        .from('modul8_proposal_cards')
        .update({ 
          notes: updatedNotes,
          updated_at: new Date().toISOString()
        })
        .eq('id', card.id);
        
      if (error) {
        console.error('❌ Error updating card:', error);
        throw error;
      }
      
      console.log('✅ DEEL URL submitted successfully');
      
      toast({
        title: "DEEL Link Submitted",
        description: "The agreement link has been sent to the service provider",
        variant: "default"
      });
      
      // Reset form and trigger refresh
      setDeelUrl('');
      if (onActionComplete) {
        console.log('🔄 Triggering data refresh...');
        onActionComplete();
      }
    } catch (error) {
      console.error('❌ Error submitting DEEL link:', error);
      toast({
        title: "Error",
        description: "Failed to submit DEEL link. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="mb-4 border-2 border-gray-700 bg-gray-900/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-200">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs bg-gray-800/50 border-gray-600 text-gray-300">
                Card #{card.card_number}
              </Badge>
              <Badge className="bg-emerald-600/20 text-emerald-300 border-emerald-500/30">
                Agreement Finalization
              </Badge>
            </div>
          </div>
          
          <div className="text-right text-sm text-gray-400">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(card.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Success Message */}
        <div className="bg-emerald-900/30 border border-emerald-600/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-5 w-5 text-emerald-400" />
            <h3 className="font-semibold text-emerald-300">Agreement Reached!</h3>
          </div>
          <p className="text-sm text-emerald-200">
            Both parties have accepted the proposal. The next step is to create and execute the contract via DEEL.
          </p>
        </div>

        {/* DEEL URL View Button - Show if URL exists */}
        {existingDeelUrl && (
          <div className="bg-blue-900/30 border border-blue-600/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-blue-300 mb-1">DEEL Contract Ready</h4>
                <p className="text-sm text-blue-200">The contract is ready for review and signing.</p>
              </div>
              <Button
                onClick={handleViewDeel}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                VIEW DEEL
              </Button>
            </div>
          </div>
        )}

        {/* Negotiated Terms Summary */}
        {(card.negotiated_title || card.negotiated_description || card.negotiated_budget_range || card.negotiated_timeline) && (
          <div className="bg-gray-800/50 border border-gray-700 p-4 rounded-lg space-y-3">
            <h4 className="font-medium text-sm flex items-center gap-2 text-gray-300">
              <User className="h-4 w-4" />
              Agreed Terms
            </h4>
            
            <div className="space-y-3">
              {card.negotiated_title && (
                <div>
                  <h5 className="font-medium text-xs text-gray-400 uppercase">Project Title</h5>
                  <p className="text-sm text-gray-200">{card.negotiated_title}</p>
                </div>
              )}
              
              {card.negotiated_description && (
                <div>
                  <h5 className="font-medium text-xs text-gray-400 uppercase">Description</h5>
                  <p className="text-sm text-gray-200">{card.negotiated_description}</p>
                </div>
              )}

              {card.negotiated_budget_range && (
                <div>
                  <h5 className="font-medium text-xs text-gray-400 uppercase">Budget</h5>
                  <p className="text-sm text-gray-200">
                    {card.negotiated_budget_range.min && card.negotiated_budget_range.max 
                      ? `${card.negotiated_budget_range.currency} ${card.negotiated_budget_range.min.toLocaleString()} - ${card.negotiated_budget_range.max.toLocaleString()}`
                      : card.negotiated_budget_range.min 
                        ? `${card.negotiated_budget_range.currency} ${card.negotiated_budget_range.min.toLocaleString()}+`
                        : `Budget in ${card.negotiated_budget_range.currency}`
                    }
                  </p>
                </div>
              )}

              {card.negotiated_timeline && (
                <div>
                  <h5 className="font-medium text-xs text-gray-400 uppercase">Timeline</h5>
                  <p className="text-sm text-gray-200">{card.negotiated_timeline}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* DEEL Integration Section - Only for Organizers */}
        {isCurrentUserOrganizer && !existingDeelUrl && (
          <div className="space-y-4 border-t border-gray-700 pt-4">
            <div className="flex items-center gap-2 mb-3">
              <ExternalLink className="h-5 w-5 text-blue-400" />
              <h4 className="font-semibold text-gray-200">Contract Execution via DEEL</h4>
            </div>
            
            <div className="space-y-4">
              <div className="flex gap-3">
                <Button
                  onClick={handleGoToDeel}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Go to DEEL
                </Button>
                <div className="text-sm text-gray-400 self-center">
                  Create the contract agreement on DEEL platform
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="deel-url" className="text-sm font-medium text-gray-300">
                  DEEL Agreement URL
                </Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                    <Input
                      id="deel-url"
                      placeholder="https://app.deel.com/contracts/..."
                      value={deelUrl}
                      onChange={(e) => setDeelUrl(e.target.value)}
                      className="pl-10 bg-gray-800/50 border-gray-600 text-gray-200 placeholder-gray-500"
                    />
                  </div>
                  <Button
                    onClick={handleSubmitDeelLink}
                    disabled={submitting || !deelUrl.trim()}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    {submitting ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <CheckCircle className="h-4 w-4 mr-2" />
                    )}
                    {submitting ? 'Sending...' : 'Send to Provider'}
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  Paste the DEEL contract URL to send it to the service provider for signing
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Service Provider View */}
        {isCurrentUserServiceProvider && !existingDeelUrl && (
          <div className="bg-blue-900/30 border border-blue-600/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <ExternalLink className="h-5 w-5 text-blue-400" />
              <h4 className="font-semibold text-blue-300">Waiting for Contract</h4>
            </div>
            <p className="text-sm text-blue-200">
              The organizer is preparing the DEEL contract. You will receive the agreement link shortly to review and sign.
            </p>
          </div>
        )}

        {/* Debug Information - Remove in production */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-gray-800/30 border border-gray-600/30 rounded-lg p-3 text-xs">
            <div className="text-gray-400">Debug Info:</div>
            <div className="text-gray-300">Current User: {currentUserId}</div>
            <div className="text-gray-300">Organizer ID: {organizerId}</div>
            <div className="text-gray-300">Service Provider ID: {serviceProviderId}</div>
            <div className="text-gray-300">Is Organizer: {isCurrentUserOrganizer ? 'Yes' : 'No'}</div>
            <div className="text-gray-300">Is Service Provider: {isCurrentUserServiceProvider ? 'Yes' : 'No'}</div>
            <div className="text-gray-300">Existing DEEL URL: {existingDeelUrl || 'None'}</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FinalizationCard;
