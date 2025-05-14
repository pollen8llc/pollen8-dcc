
import React from 'react';
import Navbar from '@/components/Navbar';
import Rel8Navigation from '@/components/rel8t/Rel8Navigation';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import TriggerManagement from '@/components/rel8t/TriggerManagement';

const Settings = () => {
  const [activeTab, setActiveTab] = React.useState('automations');
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Rel8Navigation />
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Configure your REL8 preferences
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="automations">Automations</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="automations">
            <TriggerManagement />
          </TabsContent>
          
          <TabsContent value="preferences">
            <div className="text-center py-12 border border-dashed rounded-lg">
              <h3 className="text-lg font-medium">Preferences coming soon</h3>
              <p className="text-muted-foreground mt-2">
                We're still working on this feature. Check back later!
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="integrations">
            <div className="text-center py-12 border border-dashed rounded-lg">
              <h3 className="text-lg font-medium">Integrations coming soon</h3>
              <p className="text-muted-foreground mt-2">
                We're still working on this feature. Check back later!
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
