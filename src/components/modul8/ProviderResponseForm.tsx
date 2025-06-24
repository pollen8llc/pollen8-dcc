
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProviderResponseFormProps {
  serviceRequestId: string;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const ProviderResponseForm: React.FC<ProviderResponseFormProps> = ({ 
  serviceRequestId, 
  onSubmit, 
  onCancel 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Provider Response Form</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Response form for service request: {serviceRequestId}</p>
        <p>Provider response functionality coming soon...</p>
      </CardContent>
    </Card>
  );
};

export default ProviderResponseForm;
