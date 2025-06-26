
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  MessageSquare, 
  CheckCircle, 
  XCircle, 
  FileText,
  AlertTriangle 
} from 'lucide-react';

interface RequestStatusBadgeProps {
  status: string;
  className?: string;
}

export const RequestStatusBadge: React.FC<RequestStatusBadgeProps> = ({ 
  status, 
  className = '' 
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'negotiating':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'agreed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'declined':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'in_progress':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'completed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'negotiating':
        return <MessageSquare className="h-4 w-4" />;
      case 'agreed':
        return <CheckCircle className="h-4 w-4" />;
      case 'declined':
        return <XCircle className="h-4 w-4" />;
      case 'in_progress':
        return <FileText className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  return (
    <Badge className={`${getStatusColor(status)} border font-medium flex items-center gap-1 ${className}`}>
      {getStatusIcon(status)}
      <span className="ml-1">
        {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
      </span>
    </Badge>
  );
};
