
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ServiceRequest } from '@/types/modul8';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { DollarSign, Clock, FileText, AlertCircle } from 'lucide-react';

const proposalSchema = z.object({
  quoteAmount: z.number().min(1, 'Quote amount must be greater than 0'),
  timeline: z.string().min(1, 'Timeline is required'),
  scopeDetails: z.string().min(10, 'Scope details must be at least 10 characters'),
  terms: z.string().min(10, 'Terms must be at least 10 characters'),
  clarifications: z.string().optional()
});

type ProposalFormData = z.infer<typeof proposalSchema>;

interface ProviderResponseFormProps {
  serviceRequest: ServiceRequest;
  onSubmit: (data: ProposalFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const ProviderResponseForm = ({ 
  serviceRequest, 
  onSubmit, 
  onCancel,
  isSubmitting = false 
}: ProviderResponseFormProps) => {
  const [step, setStep] = useState(1);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm<ProposalFormData>({
    resolver: zodResolver(proposalSchema),
    defaultValues: {
      timeline: '',
      scopeDetails: '',
      terms: '',
      clarifications: ''
    }
  });

  const quoteAmount = watch('quoteAmount');

  const onFormSubmit = async (data: ProposalFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Error submitting proposal:', error);
    }
  };

  const handleQuickFill = (percentage: number) => {
    if (serviceRequest.budget_range?.min) {
      const amount = Math.round(serviceRequest.budget_range.min * (percentage / 100));
      setValue('quoteAmount', amount);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Submit Your Proposal
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Provide detailed information about your approach and pricing
        </p>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          {/* Step 1: Quote and Timeline */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-semibold">Quote & Timeline</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quoteAmount">Quote Amount ($)</Label>
                <Input
                  id="quoteAmount"
                  type="number"
                  placeholder="Enter your quote"
                  {...register('quoteAmount', { valueAsNumber: true })}
                />
                {errors.quoteAmount && (
                  <p className="text-sm text-red-600">{errors.quoteAmount.message}</p>
                )}
                
                {serviceRequest.budget_range?.min && (
                  <div className="flex gap-2 mt-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickFill(80)}
                    >
                      80%
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickFill(100)}
                    >
                      100%
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickFill(120)}
                    >
                      120%
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="timeline">Timeline</Label>
                <Input
                  id="timeline"
                  placeholder="e.g., 4-6 weeks"
                  {...register('timeline')}
                />
                {errors.timeline && (
                  <p className="text-sm text-red-600">{errors.timeline.message}</p>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Step 2: Scope and Terms */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold">Scope & Terms</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="scopeDetails">Detailed Scope</Label>
                <Textarea
                  id="scopeDetails"
                  placeholder="Describe what you will deliver, your approach, and methodology..."
                  className="min-h-[120px]"
                  {...register('scopeDetails')}
                />
                {errors.scopeDetails && (
                  <p className="text-sm text-red-600">{errors.scopeDetails.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="terms">Terms & Conditions</Label>
                <Textarea
                  id="terms"
                  placeholder="Payment terms, deliverables schedule, revisions policy..."
                  className="min-h-[100px]"
                  {...register('terms')}
                />
                {errors.terms && (
                  <p className="text-sm text-red-600">{errors.terms.message}</p>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Step 3: Questions/Clarifications */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              <h3 className="text-lg font-semibold">Questions & Clarifications</h3>
            </div>
            
            <div>
              <Label htmlFor="clarifications">Questions for the Client (Optional)</Label>
              <Textarea
                id="clarifications"
                placeholder="Any questions about the project requirements or additional information needed..."
                className="min-h-[80px]"
                {...register('clarifications')}
              />
            </div>
          </div>

          {/* Summary */}
          {quoteAmount && (
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Proposal Summary</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Quote:</span>
                  <span className="ml-2 font-medium">${quoteAmount.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Timeline:</span>
                  <span className="ml-2 font-medium">{watch('timeline') || 'Not specified'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#00eada] hover:bg-[#00eada]/90 text-black"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Proposal'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProviderResponseForm;
