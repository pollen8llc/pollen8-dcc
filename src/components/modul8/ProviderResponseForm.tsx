
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ServiceRequest } from '@/types/modul8';

interface ProviderResponseData {
  quoteAmount: number;
  timeline: string;
  scopeDetails: string;
  terms: string;
  clarifications?: string;
}

interface ProviderResponseFormProps {
  serviceRequest: ServiceRequest;
  onSubmit: (data: ProviderResponseData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const ProviderResponseForm: React.FC<ProviderResponseFormProps> = ({
  serviceRequest,
  onSubmit,
  onCancel,
  isSubmitting = false
}) => {
  const [formData, setFormData] = useState<ProviderResponseData>({
    quoteAmount: 0,
    timeline: '',
    scopeDetails: '',
    terms: '',
    clarifications: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const budgetRange = serviceRequest.budget_range;
  const suggestedBudget = budgetRange?.min ? 
    `$${budgetRange.min.toLocaleString()}${budgetRange.max ? ` - $${budgetRange.max.toLocaleString()}` : '+'}` 
    : 'Not specified';

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Respond to Service Request</CardTitle>
        <div className="text-sm text-muted-foreground">
          <p><strong>Request:</strong> {serviceRequest.title}</p>
          <p><strong>Client Budget:</strong> {suggestedBudget}</p>
          <p><strong>Timeline:</strong> {serviceRequest.timeline || 'Not specified'}</p>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="quoteAmount">Your Quote ($) *</Label>
            <Input
              id="quoteAmount"
              type="number"
              value={formData.quoteAmount}
              onChange={(e) => setFormData(prev => ({ ...prev, quoteAmount: Number(e.target.value) }))}
              placeholder="Enter your quote"
              min="0"
              required
            />
            {budgetRange?.min && formData.quoteAmount > 0 && (
              <div className="text-xs">
                {formData.quoteAmount < budgetRange.min && (
                  <Badge variant="secondary" className="text-orange-600">
                    Below client's minimum budget
                  </Badge>
                )}
                {budgetRange.max && formData.quoteAmount > budgetRange.max && (
                  <Badge variant="secondary" className="text-red-600">
                    Above client's maximum budget
                  </Badge>
                )}
                {formData.quoteAmount >= budgetRange.min && 
                 (!budgetRange.max || formData.quoteAmount <= budgetRange.max) && (
                  <Badge variant="secondary" className="text-green-600">
                    Within client's budget range
                  </Badge>
                )}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="timeline">Estimated Timeline *</Label>
            <Input
              id="timeline"
              value={formData.timeline}
              onChange={(e) => setFormData(prev => ({ ...prev, timeline: e.target.value }))}
              placeholder="e.g., 2-3 weeks, Complete by July 30"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="scopeDetails">Scope & Approach *</Label>
            <Textarea
              id="scopeDetails"
              value={formData.scopeDetails}
              onChange={(e) => setFormData(prev => ({ ...prev, scopeDetails: e.target.value }))}
              placeholder="Describe your approach and what you will deliver..."
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="terms">Terms & Conditions</Label>
            <Textarea
              id="terms"
              value={formData.terms}
              onChange={(e) => setFormData(prev => ({ ...prev, terms: e.target.value }))}
              placeholder="Payment terms, revision policy, etc..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="clarifications">Questions or Clarifications</Label>
            <Textarea
              id="clarifications"
              value={formData.clarifications}
              onChange={(e) => setFormData(prev => ({ ...prev, clarifications: e.target.value }))}
              placeholder="Any questions about the scope or requirements..."
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-[#00eada] hover:bg-[#00eada]/90 text-black"
            >
              {isSubmitting ? 'Sending...' : 'Send Proposal'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProviderResponseForm;
