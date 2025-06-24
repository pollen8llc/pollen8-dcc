
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ServiceRequest } from '@/types/modul8';

interface ProjectStatusCardProps {
  project: ServiceRequest;
  onComplete?: () => void;
  onRefresh?: () => void;
}

const ProjectStatusCard: React.FC<ProjectStatusCardProps> = ({ project, onComplete, onRefresh }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{project.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Status: {project.status}</p>
        {project.project_progress !== undefined && <p>Progress: {project.project_progress}%</p>}
      </CardContent>
    </Card>
  );
};

export default ProjectStatusCard;
