
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProjectStatusCardProps {
  title: string;
  status: string;
  progress?: number;
}

const ProjectStatusCard: React.FC<ProjectStatusCardProps> = ({ title, status, progress }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Status: {status}</p>
        {progress !== undefined && <p>Progress: {progress}%</p>}
      </CardContent>
    </Card>
  );
};

export default ProjectStatusCard;
