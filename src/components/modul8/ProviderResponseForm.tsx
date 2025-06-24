
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ProviderResponseFormProps {
  serviceRequestId: string;
  onSubmit: (response: any) => void;
}

const ProviderResponseForm: React.FC<ProviderResponseFormProps> = ({ serviceRequestId, onSubmit }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Provider Response</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Service Request: {serviceRequestId}</p>
        <p>Provider response form coming soon...</p>
        <Button onClick={() => onSubmit({})}>Submit Response</Button>
      </CardContent>
    </Card>
  );
};

export default ProviderResponseForm;
