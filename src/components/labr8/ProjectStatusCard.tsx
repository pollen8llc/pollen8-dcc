
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
        <p>{project.description}</p>
        <p className="text-sm text-muted-foreground">Status: {project.status}</p>
      </CardContent>
    </Card>
  );
};

export default ProjectStatusCard;
