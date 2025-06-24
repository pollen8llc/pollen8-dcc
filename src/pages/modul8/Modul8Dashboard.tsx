
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DOMAIN_PAGES } from '@/types/modul8';
import { Code, Smartphone, Palette, Megaphone, FileText } from 'lucide-react';
import LoadingSpinner from '@/components/ui/loading-spinner';
import Navbar from '@/components/Navbar';

const Modul8Dashboard = () => {
  const { currentUser, isLoading } = useUser();
  const navigate = useNavigate();

  const domainIcons = {
    1: Code,
    2: Smartphone, 
    3: Palette,
    4: Megaphone,
    5: FileText
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner size="lg" text="Loading MODUL-8..." />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Please log in to access MODUL-8.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">MODUL-8 Service Directory</h1>
          <p className="text-muted-foreground">
            Connect with service providers across different domains
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DOMAIN_PAGES.map((domain) => {
            const IconComponent = domainIcons[domain.id as keyof typeof domainIcons];
            
            return (
              <Card key={domain.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{domain.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{domain.description}</p>
                  <Button 
                    onClick={() => navigate(`/modul8/domain/${domain.id}`)}
                    className="w-full"
                  >
                    Browse Providers
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Modul8Dashboard;
