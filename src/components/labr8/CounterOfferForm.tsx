
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { createProposal } from '@/services/proposalService';
import { toast } from '@/hooks/use-toast';
import { DollarSign, Clock, Link, FileText, ArrowRight } from 'lucide-react';

interface CounterOfferFormProps {
  serviceRequestId: string;
  fromUserId: string;
  originalProposal?: {
    quote_amount?: number;
    timeline?: string;
    scope_details?: string;
    terms?: string;
  };
  onSuccess: () => void;
  onCancel: () => void;
}

export function CounterOfferForm({
  serviceRequestId,
  fromUserId,
  originalProposal,
  onSuccess,
  onCancel
}: CounterOfferFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    quote_amount: originalProposal?.quote_amount || 0,
    timeline: originalProposal?.timeline || '',
    scope_details: originalProposal?.scope_details || '',
    terms: originalProposal?.terms || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createProposal({
        service_request_id: serviceRequestId,
        from_user_id: fromUserId,
        proposal_type: 'counter',
        ...formData
      });

      toast({
        title: "Counter Offer Submitted",
        description: "Your counter offer has been sent successfully.",
      });

      onSuccess();
    } catch (error) {
      console.error('Error submitting counter offer:', error);
      toast({
        title: "Error",
        description: "Failed to submit counter offer. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowRight className="h-5 w-5" />
          Submit Counter Offer
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Revise the proposal terms and submit your counter offer
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Quote Amount */}
          <div className="space-y-2">
            <Label htmlFor="quote_amount" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Quote Amount (USD)
            </Label>
            <Input
              id="quote_amount"
              type="number"
              min="0"
              step="0.01"
              value={formData.quote_amount}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                quote_amount: parseFloat(e.target.value) || 0
              }))}
              placeholder="Enter your quote amount"
              required
            />
          </div>

          {/* Timeline */}
          <div className="space-y-2">
            <Label htmlFor="timeline" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Project Timeline
            </Label>
            <Input
              id="timeline"
              value={formData.timeline}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                timeline: e.target.value
              }))}
              placeholder="e.g., 4-6 weeks, 2 months"
              required
            />
          </div>

          {/* Scope Details */}
          <div className="space-y-2">
            <Label htmlFor="scope_details" className="flex items-center gap-2">
              <Link className="h-4 w-4" />
              Scope Document Link
            </Label>
            <Input
              id="scope_details"
              value={formData.scope_details}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                scope_details: e.target.value
              }))}
              placeholder="https://docs.google.com/document/... or https://dropbox.com/..."
              type="url"
            />
            {formData.scope_details && (
              <div className="flex items-center gap-2 text-sm">
                {isValidUrl(formData.scope_details) ? (
                  <Badge variant="outline" className="text-green-600 border-green-200">
                    ✓ Valid URL
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    ✗ Invalid URL
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Terms */}
          <div className="space-y-2">
            <Label htmlFor="terms" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Terms & Conditions Link
            </Label>
            <Input
              id="terms"
              value={formData.terms}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                terms: e.target.value
              }))}
              placeholder="https://docs.google.com/document/... or https://dropbox.com/..."
              type="url"
            />
            {formData.terms && (
              <div className="flex items-center gap-2 text-sm">
                {isValidUrl(formData.terms) ? (
                  <Badge variant="outline" className="text-green-600 border-green-200">
                    ✓ Valid URL
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    ✗ Invalid URL
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-[#00eada] hover:bg-[#00c4b8] text-black"
            >
              {loading ? "Submitting..." : "Submit Counter Offer"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
