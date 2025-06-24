
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ServiceRequest } from '@/types/modul8';

interface ProjectCompletionModalProps {
  project: ServiceRequest;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: () => void;
}

const ProjectCompletionModal: React.FC<ProjectCompletionModalProps> = ({
  project,
  open,
  onOpenChange,
  onComplete
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Complete Project</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>Complete project: {project.title}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectCompletionModal;
