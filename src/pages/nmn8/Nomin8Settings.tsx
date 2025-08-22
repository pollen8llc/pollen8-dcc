import React from 'react';
import { Settings } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Nomin8Navigation } from '@/components/nomin8/Nomin8Navigation';
import { Nomin8ClassificationManager } from '@/components/nomin8/Nomin8ClassificationManager';
import { Nomin8GroupManager } from '@/components/nomin8/Nomin8GroupManager';

const Nomin8Settings: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6 space-y-8">
        <Nomin8Navigation />
        
        {/* Header */}
        <div className="flex items-center gap-4">
          <Settings className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Nomin8 Settings</h1>
            <p className="text-muted-foreground mt-1">
              Manage your Nomin8 classifications and groups
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          <Nomin8ClassificationManager />
          <Nomin8GroupManager />
        </div>
      </div>
    </div>
  );
};

export default Nomin8Settings;