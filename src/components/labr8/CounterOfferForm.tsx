
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useProposalFlow } from '@/hooks/useProposalFlow';
import { DollarSign, Clock, FileText, MessageSquare } from 'lucide-react';

interface CounterOfferFormProps {
  serviceRequestId: string;
  fromUserId: string;
  originalProposal: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export const CounterOfferForm: React.FC<CounterOfferFormProps> = ({
  serviceRequestId,
  fromUserId,
  originalProposal,
  onSuccess,
  onCancel,
}) => {
  const { submitProposal, loading } = useProposalFlow();
  const [formData, setFormData] = useState({
    quote_amount: '',
    timeline: '',
    scope_details: '',
    terms: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await submitProposal({
        service_request_id: serviceRequestId,
        from_user_id: fromUserId,
        proposal_type: 'counter',
        quote_amount: formData.quote_amount ? Number(formData.quote_amount) : undefined,
        timeline: formData.timeline || undefined,
        scope_details: formData.scope_details || undefined,
        terms: formData.terms || undefined,
      });
      
      onSuccess();
    } catch (error) {
      // Error handling is done in the hook
      console.error('Failed to submit counter offer:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Original Request Summary */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg text-white">Original Request</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <h4 className="font-semibold text-white">{originalProposal.title}</h4>
            <p className="text-sm text-gray-300 mt-1">{originalProposal.description}</p>
          </div>
          {originalProposal.budget_range && (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <DollarSign className="h-4 w-4" />
              <span>Original Budget: {JSON.stringify(originalProposal.budget_range)}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Counter Offer Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg text-white">Your Counter Proposal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Quote Amount */}
            <div className="space-y-2">
              <Label htmlFor="quote_amount" className="text-white flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Quote Amount (USD)
              </Label>
              <Input
                id="quote_amount"
                type="number"
                placeholder="Enter your quote amount"
                value={formData.quote_amount}
                onChange={(e) => handleInputChange('quote_amount', e.target.value)}
                className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-[#00eada]"
              />
            </div>

            {/* Timeline */}
            <div className="space-y-2">
              <Label htmlFor="timeline" className="text-white flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Timeline
              </Label>
              <Input
                id="timeline"
                placeholder="e.g., 2-3 weeks, 1 month"
                value={formData.timeline}
                onChange={(e) => handleInputChange('timeline', e.target.value)}
                className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-[#00eada]"
              />
            </div>

            {/* Scope Details */}
            <div className="space-y-2">
              <Label htmlFor="scope_details" className="text-white flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Scope Details
              </Label>
              <Textarea
                id="scope_details"
                placeholder="Describe the scope of work you're proposing..."
                value={formData.scope_details}
                onChange={(e) => handleInputChange('scope_details', e.target.value)}
                rows={4}
                className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-[#00eada] resize-none"
              />
            </div>

            {/* Terms */}
            <div className="space-y-2">
              <Label htmlFor="terms" className="text-white flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Terms & Conditions
              </Label>
              <Textarea
                id="terms"
                placeholder="Any specific terms or conditions..."
                value={formData.terms}
                onChange={(e) => handleInputChange('terms', e.target.value)}
                rows={3}
                className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-[#00eada] resize-none"
              />
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
            className="border-gray-600 text-gray-300 hover:bg-white/10"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="bg-[#00eada] hover:bg-[#00c4b8] text-black font-medium"
          >
            {loading ? 'Submitting...' : 'Submit Counter Offer'}
          </Button>
        </div>
      </form>
    </div>
  );
};
