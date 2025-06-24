
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  DollarSign, 
  Clock, 
  FileText, 
  Send,
  X
} from 'lucide-react';
import { ServiceRequest, Proposal } from '@/types/modul8';
import { createProposal } from '@/services/proposalService';
import { useSession } from '@/hooks/useSession';
import { toast } from '@/hooks/use-toast';

const proposalSchema = z.object({
  quote_amount: z.number().min(1, 'Quote amount is required'),
  timeline: z.string().min(1, 'Timeline is required'),
  scope_details: z.string().min(10, 'Please provide detailed scope information'),
  terms: z.string().optional(),
});

type ProposalFormData = z.infer<typeof proposalSchema>;

interface ProviderResponseFormProps {
  serviceRequest: ServiceRequest;
  existingProposal?: Proposal;
  proposalType?: 'initial' | 'counter' | 'revision';
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const ProviderResponseForm = ({ 
  serviceRequest, 
  existingProposal,
  proposalType = 'initial',
  onSubmit, 
  onCancel 
}: ProviderResponseFormProps) => {
  const { session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<ProposalFormData>({
    resolver: zodResolver(proposalSchema),
    defaultValues: {
      quote_amount: existingProposal?.quote_amount || undefined,
      timeline: existingProposal?.timeline || '',
      scope_details: existingProposal?.scope_details || '',
      terms: existingProposal?.terms || '',
    }
  });

  const onFormSubmit = async (data: ProposalFormData) => {
    if (!session?.user?.id) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to submit a proposal",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const proposalData = {
        service_request_id: serviceRequest.id,
        from_user_id: session.user.id,
        proposal_type: proposalType,
        quote_amount: data.quote_amount,
        timeline: data.timeline,
        scope_details: data.scope_details,
        terms: data.terms || ''
      };

      await createProposal(proposalData);

      toast({
        title: "Proposal Submitted",
        description: `Your ${proposalType} proposal has been submitted successfully`,
      });

      onSubmit(proposalData);
    } catch (error) {
      console.error('Error submitting proposal:', error);
      toast({
        title: "Error",
        description: "Failed to submit proposal. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFormTitle = () => {
    switch (proposalType) {
      case 'counter':
        return 'Submit Counter Offer';
      case 'revision':
        return 'Submit Revised Proposal';
      default:
        return 'Submit Proposal';
    }
  };

  const getFormDescription = () => {
    switch (proposalType) {
      case 'counter':
        return 'Update your proposal based on the organizer\'s feedback';
      case 'revision':
        return 'Revise your proposal with new terms';
      default:
        return 'Provide your proposal details for this project';
    }
  };

  return (
    <Card className="border-2 border-[#00eada]/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-[#00eada]">
              <Send className="h-5 w-5" />
              {getFormTitle()}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {getFormDescription()}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          {/* Project Summary */}
          <div className="bg-muted/20 p-4 rounded-lg">
            <h4 className="font-medium mb-2">{serviceRequest.title}</h4>
            <p className="text-sm text-muted-foreground">
              {serviceRequest.description}
            </p>
          </div>

          {/* Quote Amount */}
          <div className="space-y-2">
            <Label htmlFor="quote_amount" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              Quote Amount
            </Label>
            <Input
              id="quote_amount"
              type="number"
              step="0.01"
              placeholder="Enter your quote amount"
              {...register('quote_amount', { valueAsNumber: true })}
              className={errors.quote_amount ? 'border-red-500' : ''}
            />
            {errors.quote_amount && (
              <p className="text-sm text-red-600">{errors.quote_amount.message}</p>
            )}
          </div>

          {/* Timeline */}
          <div className="space-y-2">
            <Label htmlFor="timeline" className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              Timeline
            </Label>
            <Input
              id="timeline"
              placeholder="e.g., 2-3 weeks, 1 month"
              {...register('timeline')}
              className={errors.timeline ? 'border-red-500' : ''}
            />
            {errors.timeline && (
              <p className="text-sm text-red-600">{errors.timeline.message}</p>
            )}
          </div>

          {/* Scope Details */}
          <div className="space-y-2">
            <Label htmlFor="scope_details" className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-purple-600" />
              Scope & Approach
            </Label>
            <Textarea
              id="scope_details"
              placeholder="Describe your approach, deliverables, and scope of work..."
              rows={5}
              {...register('scope_details')}
              className={errors.scope_details ? 'border-red-500' : ''}
            />
            {errors.scope_details && (
              <p className="text-sm text-red-600">{errors.scope_details.message}</p>
            )}
          </div>

          {/* Terms */}
          <div className="space-y-2">
            <Label htmlFor="terms">Terms & Conditions (Optional)</Label>
            <Textarea
              id="terms"
              placeholder="Payment terms, revision policy, etc..."
              rows={3}
              {...register('terms')}
            />
          </div>

          {proposalType === 'counter' && existingProposal && (
            <Alert>
              <AlertDescription>
                <strong>Previous proposal:</strong> ${existingProposal.quote_amount?.toLocaleString()} - {existingProposal.timeline}
              </AlertDescription>
            </Alert>
          )}

          {/* Submit Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-[#00eada] hover:bg-[#00eada]/90 text-black"
            >
              {isSubmitting ? 'Submitting...' : `Submit ${proposalType === 'counter' ? 'Counter Offer' : 'Proposal'}`}
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
