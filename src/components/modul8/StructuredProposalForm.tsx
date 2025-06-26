
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';
import { CreateProposalCardData } from '@/types/proposalCards';

interface StructuredProposalFormProps {
  requestId: string;
  onSubmit: (data: CreateProposalCardData) => void;
  onCancel: () => void;
  isServiceProvider: boolean;
  isCounterProposal?: boolean;
  isSubmitting?: boolean;
}

const StructuredProposalForm: React.FC<StructuredProposalFormProps> = ({
  requestId,
  onSubmit,
  onCancel,
  isServiceProvider,
  isCounterProposal = false,
  isSubmitting = false
}) => {
  const [formData, setFormData] = useState({
    negotiated_title: '',
    negotiated_description: '',
    negotiated_budget_range: {
      min: 0,
      max: 0,
      currency: 'USD'
    },
    negotiated_timeline: '',
    notes: '',
    scope_link: '',
    terms_link: '',
    asset_links: [] as string[]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const proposalData: CreateProposalCardData = {
      request_id: requestId,
      negotiated_title: formData.negotiated_title,
      negotiated_description: formData.negotiated_description,
      negotiated_budget_range: formData.negotiated_budget_range,
      negotiated_timeline: formData.negotiated_timeline,
      notes: formData.notes,
      scope_link: formData.scope_link || undefined,
      terms_link: formData.terms_link || undefined,
      asset_links: formData.asset_links
    };

    onSubmit(proposalData);
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>{isCounterProposal ? 'Counter Proposal' : 'New Proposal'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Project Title *</Label>
            <Input
              id="title"
              value={formData.negotiated_title}
              onChange={(e) => setFormData(prev => ({ ...prev, negotiated_title: e.target.value }))}
              placeholder="e.g., Set up CRM system"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.negotiated_description}
              onChange={(e) => setFormData(prev => ({ ...prev, negotiated_description: e.target.value }))}
              placeholder="Describe what you need in detail..."
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budgetMin">Budget Range ($) *</Label>
              <Input
                id="budgetMin"
                type="number"
                value={formData.negotiated_budget_range.min}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  negotiated_budget_range: { 
                    ...prev.negotiated_budget_range, 
                    min: Number(e.target.value) 
                  }
                }))}
                placeholder="Min budget"
                min="0"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="budgetMax">To ($)</Label>
              <Input
                id="budgetMax"
                type="number"
                value={formData.negotiated_budget_range.max}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  negotiated_budget_range: { 
                    ...prev.negotiated_budget_range, 
                    max: Number(e.target.value) 
                  }
                }))}
                placeholder="Max budget"
                min="0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="timeline">Timeline *</Label>
            <Input
              id="timeline"
              value={formData.negotiated_timeline}
              onChange={(e) => setFormData(prev => ({ ...prev, negotiated_timeline: e.target.value }))}
              placeholder="e.g., 2-3 weeks, By end of month"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Any additional details or requirements..."
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
              {isSubmitting ? 'Sending...' : (isCounterProposal ? 'Send Counter Proposal' : 'Send Proposal')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default StructuredProposalForm;
