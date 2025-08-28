
import React from 'react';
import { CommunityCreationForm } from './CommunityCreationForm';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const CommunityCreationTest: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  console.log('Current user in test component:', currentUser);

  const handleSuccess = (community: any) => {
    console.log('Community created successfully in test:', community);
    navigate('/eco8');
  };

  const handleCancel = () => {
    navigate('/eco8');
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Please log in to create a community.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Test Community Creation</h1>
          <p className="text-muted-foreground">
            Testing the rebuilt community creation form with current user: {currentUser.email}
          </p>
        </div>
        
        <CommunityCreationForm
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};
