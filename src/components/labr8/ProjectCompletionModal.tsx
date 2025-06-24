
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface ProjectCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}

const ProjectCompletionModal: React.FC<ProjectCompletionModalProps> = ({ isOpen, onClose, projectId }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Complete Project</DialogTitle>
        </DialogHeader>
        <div>
          <p>Project ID: {projectId}</p>
          <p>Project completion functionality coming soon...</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectCompletionModal;
