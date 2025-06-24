
import React from 'react';
import { useUser } from '@/contexts/UserContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mail, Clock, CheckCircle } from 'lucide-react';
import LoadingSpinner from '@/components/ui/loading-spinner';
import Navbar from '@/components/Navbar';

const ProviderInbox = () => {
  const { currentUser, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner size="lg" text="Loading inbox..." />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Please log in to access your inbox.</p>
      </div>
    );
  }

  // Mock data for demonstration
  const mockRequests = [
    {
      id: '1',
      title: 'Website Development Project',
      client: 'Tech Startup Inc.',
      status: 'pending',
      date: '2024-01-15',
      budget: '$2,500 - $5,000'
    },
    {
      id: '2', 
      title: 'Mobile App Design',
      client: 'Local Business',
      status: 'in_progress',
      date: '2024-01-12',
      budget: '$1,500 - $3,000'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Service Provider Inbox</h1>
          <p className="text-muted-foreground">
            Manage your service requests and communications
          </p>
        </div>

        <div className="grid gap-6">
          {mockRequests.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-8">
                <Mail className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No requests yet</h3>
                <p className="text-center text-muted-foreground">
                  Service requests will appear here when clients reach out to you.
                </p>
              </CardContent>
            </Card>
          ) : (
            mockRequests.map((request) => (
              <Card key={request.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{request.title}</CardTitle>
                    <Badge variant={request.status === 'pending' ? 'secondary' : 'default'}>
                      {request.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                      {request.status === 'in_progress' && <CheckCircle className="h-3 w-3 mr-1" />}
                      {request.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p><strong>Client:</strong> {request.client}</p>
                    <p><strong>Budget:</strong> {request.budget}</p>
                    <p><strong>Date:</strong> {new Date(request.date).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm">View Details</Button>
                    {request.status === 'pending' && (
                      <>
                        <Button size="sm" variant="outline">Accept</Button>
                        <Button size="sm" variant="outline">Decline</Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProviderInbox;
