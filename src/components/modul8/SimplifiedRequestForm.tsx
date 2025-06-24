
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SimplifiedRequestFormData {
  title: string;
  description: string;
  budgetRange: string;
  expectedCompletion: string;
  priority: string;
}

interface SimplifiedRequestFormProps {
  onSubmit: (data: SimplifiedRequestFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  providerName?: string;
}

const BUDGET_RANGES = [
  { value: '500-1000', label: '$500 - $1,000' },
  { value: '1000-5000', label: '$1,000 - $5,000' },
  { value: '5000-10000', label: '$5,000 - $10,000' },
  { value: '10000-25000', label: '$10,000 - $25,000' },
  { value: '25000+', label: '$25,000+' },
  { value: 'custom', label: 'Custom Range' }
];

const COMPLETION_TIMEFRAMES = [
  { value: '1-2-weeks', label: '1-2 weeks' },
  { value: '1-month', label: '1 month' },
  { value: '2-3-months', label: '2-3 months' },
  { value: '3-6-months', label: '3-6 months' },
  { value: '6-months+', label: '6+ months' },
  { value: 'flexible', label: 'Flexible timeline' }
];

const PRIORITY_LEVELS = [
  { value: 'low', label: 'Low - No rush' },
  { value: 'medium', label: 'Medium - Standard timing' },
  { value: 'high', label: 'High - Needed soon' },
  { value: 'urgent', label: 'Urgent - ASAP' }
];

const SimplifiedRequestForm: React.FC<SimplifiedRequestFormProps> = ({
  onSubmit,
  onCancel,
  isSubmitting = false,
  providerName
}) => {
  const [formData, setFormData] = useState<SimplifiedRequestFormData>({
    title: '',
    description: '',
    budgetRange: '',
    expectedCompletion: '',
    priority: 'medium'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isFormValid = formData.title.trim() && formData.description.trim() && 
                     formData.budgetRange && formData.expectedCompletion;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">
          Request Service{providerName && ` from ${providerName}`}
        </CardTitle>
        <p className="text-muted-foreground text-center">
          Provide basic details to get started. We'll work out the specifics together.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">What do you need help with? *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Set up a fundraising CRM system"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Tell us more about your project *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe what you're looking to accomplish, any specific requirements, or context that would be helpful..."
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Budget Range *</Label>
              <Select value={formData.budgetRange} onValueChange={(value) => 
                setFormData(prev => ({ ...prev, budgetRange: value }))
              }>
                <SelectTrigger>
                  <SelectValue placeholder="Select budget range" />
                </SelectTrigger>
                <SelectContent>
                  {BUDGET_RANGES.map((range) => (
                    <SelectItem key={range.value} value={range.value}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Expected Completion *</Label>
              <Select value={formData.expectedCompletion} onValueChange={(value) => 
                setFormData(prev => ({ ...prev, expectedCompletion: value }))
              }>
                <SelectTrigger>
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  {COMPLETION_TIMEFRAMES.map((timeframe) => (
                    <SelectItem key={timeframe.value} value={timeframe.value}>
                      {timeframe.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Priority Level</Label>
            <Select value={formData.priority} onValueChange={(value) => 
              setFormData(prev => ({ ...prev, priority: value }))
            }>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PRIORITY_LEVELS.map((priority) => (
                  <SelectItem key={priority.value} value={priority.value}>
                    {priority.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="bg-muted/20 p-4 rounded-lg">
            <h4 className="font-medium mb-2">What happens next?</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Your request will be sent to the service provider</li>
              <li>• You'll be taken to a project page to discuss details</li>
              <li>• Work together to finalize scope, timeline, and pricing</li>
              <li>• Start your project once everything is agreed upon</li>
            </ul>
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
              disabled={!isFormValid || isSubmitting}
              className="flex-1 bg-[#00eada] hover:bg-[#00eada]/90 text-black"
            >
              {isSubmitting ? 'Sending Request...' : 'Send Request'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default SimplifiedRequestForm;
