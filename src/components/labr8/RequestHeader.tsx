
import { ArrowLeft, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ServiceRequest } from '@/types/modul8';

interface RequestHeaderProps {
  serviceRequest: ServiceRequest;
  onBack: () => void;
}

const RequestHeader = ({ serviceRequest, onBack }: RequestHeaderProps) => {
  return (
    <div className="flex items-center gap-4 mb-8">
      <Button
        variant="outline"
        size="sm"
        onClick={onBack}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Button>
      <div className="flex-1">
        <h1 className="text-3xl font-bold">{serviceRequest.title}</h1>
        <div className="flex items-center gap-2 mt-2">
          <Badge className="bg-blue-100 text-blue-800 border border-blue-200">
            <Building className="h-4 w-4 mr-1" />
            Service Provider View
          </Badge>
          <span className="text-muted-foreground text-sm">
            LAB-R8 Negotiation Flow
          </span>
        </div>
      </div>
    </div>
  );
};

export default RequestHeader;
