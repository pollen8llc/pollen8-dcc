
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';

interface ProposalFormData {
  title: string;
  description: string;
  budgetMin: number;
  budgetMax: number;
  timeline: string;
  milestones: string[];
}

interface StructuredProposalFormProps {
  onSubmit: (data: ProposalFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  initialData?: Partial<ProposalFormData>;
}

const StructuredProposalForm: React.FC<StructuredProposalFormProps> = ({
  onSubmit,
  onCancel,
  isSubmitting = false,
  initialData
}) => {
  const [formData, setFormData] = useState<ProposalFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    budgetMin: initialData?.budgetMin || 0,
    budgetMax: initialData?.budgetMax || 0,
    timeline: initialData?.timeline || '',
    milestones: initialData?.milestones || ['']
  });

  const addMilestone = () => {
    setFormData(prev => ({
      ...prev,
      milestones: [...prev.milestones, '']
    }));
  };

  const removeMilestone = (index: number) => {
    setFormData(prev => ({
      ...prev,
      milestones: prev.milestones.filter((_, i) => i !== index)
    }));
  };

  const updateMilestone = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      milestones: prev.milestones.map((milestone, i) => 
        i === index ? value : milestone
      )
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      milestones: formData.milestones.filter(m => m.trim() !== '')
    });
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Service Request Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Service Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Set up CRM system"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
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
                value={formData.budgetMin}
                onChange={(e) => setFormData(prev => ({ ...prev, budgetMin: Number(e.target.value) }))}
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
                value={formData.budgetMax}
                onChange={(e) => setFormData(prev => ({ ...prev, budgetMax: Number(e.target.value) }))}
                placeholder="Max budget"
                min="0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="timeline">Preferred Timeline *</Label>
            <Input
              id="timeline"
              value={formData.timeline}
              onChange={(e) => setFormData(prev => ({ ...prev, timeline: e.target.value }))}
              placeholder="e.g., 2-3 weeks, By end of month"
              required
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Milestones & Deliverables</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addMilestone}
                className="flex items-center gap-1"
              >
                <Plus className="h-3 w-3" />
                Add Milestone
              </Button>
            </div>
            
            <div className="space-y-3">
              {formData.milestones.map((milestone, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Badge variant="outline" className="min-w-[20px] h-6 flex items-center justify-center">
                    {index + 1}
                  </Badge>
                  <Input
                    value={milestone}
                    onChange={(e) => updateMilestone(index, e.target.value)}
                    placeholder="Describe milestone or deliverable"
                    className="flex-1"
                  />
                  {formData.milestones.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeMilestone(index)}
                      className="p-1 h-8 w-8"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
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
              {isSubmitting ? 'Sending...' : 'Send Request'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default StructuredProposalForm;
