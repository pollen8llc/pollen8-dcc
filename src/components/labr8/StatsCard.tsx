
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatsCardProps {
  title?: string;
  label?: string; // Add label as alternative to title
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  accentColor?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  label,
  value, 
  description, 
  icon, 
  accentColor 
}) => {
  const displayTitle = title || label || '';
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{displayTitle}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </CardContent>
    </Card>
  );
};

export default StatsCard;
