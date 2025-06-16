
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

const RequestAccessAlert = () => {
  return (
    <Alert className="mb-6">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription>
        This request has been assigned to another service provider. You can view the details but cannot respond.
      </AlertDescription>
    </Alert>
  );
};

export default RequestAccessAlert;
