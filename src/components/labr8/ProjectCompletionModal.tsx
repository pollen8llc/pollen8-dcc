
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ServiceRequest } from '@/types/modul8';
import { createProjectCompletion, updateProjectProgress } from '@/services/modul8ProjectService';
import { updateServiceRequest } from '@/services/modul8Service';
import { useSession } from '@/hooks/useSession';
import { toast } from '@/hooks/use-toast';

interface ProjectCompletionModalProps {
  project: ServiceRequest;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: () => void;
}

const ProjectCompletionModal = ({ project, open, onOpenChange, onComplete }: ProjectCompletionModalProps) => {
  const { session } = useSession();
  const [loading, setLoading] = useState(false);
  const [completionNotes, setCompletionNotes] = useState('');
  const [deliverables, setDeliverables] = useState<string>('');

  const handleSubmit = async () => {
    if (!session?.user?.id || !project.service_provider_id) return;

    setLoading(true);
    try {
      // Parse deliverables (assuming comma-separated list)
      const deliverablesList = deliverables
        .split(',')
        .map(d => d.trim())
        .filter(d => d.length > 0);

      // Create completion record
      await createProjectCompletion({
        service_request_id: project.id,
        service_provider_id: project.service_provider_id,
        organizer_id: project.organizer_id,
        completion_notes: completionNotes || undefined,
        deliverables: deliverablesList
      });

      // Update project status and progress
      await updateServiceRequest(project.id, {
        status: 'pending_completion',
        project_progress: 100
      });

      toast({
        title: "Success!",
        description: "Project marked as complete and submitted for organizer review."
      });

      onComplete();
    } catch (error) {
      console.error('Error submitting completion:', error);
      toast({
        title: "Error",
        description: "Failed to submit project completion",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Project</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">{project.title}</h3>
            <p className="text-sm text-muted-foreground">
              Mark this project as complete and submit for organizer review.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="completion_notes">Completion Notes</Label>
            <Textarea
              id="completion_notes"
              placeholder="Describe what was delivered and any important notes..."
              value={completionNotes}
              onChange={(e) => setCompletionNotes(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="deliverables">Deliverables (optional)</Label>
            <Input
              id="deliverables"
              placeholder="List deliverables separated by commas"
              value={deliverables}
              onChange={(e) => setDeliverables(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              e.g., Final design files, Documentation, Source code
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded p-3">
            <p className="text-blue-800 text-sm">
              <strong>Next Steps:</strong> The organizer will review your work and either confirm completion or request revisions.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 bg-[#00eada] hover:bg-[#00eada]/90 text-black"
            >
              {loading ? 'Submitting...' : 'Complete Project'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectCompletionModal;
