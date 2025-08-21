import React from 'react';
import { Settings } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { A10DNavigation } from '@/components/a10d/A10DNavigation';
import { A10DClassificationManager } from '@/components/a10d/A10DClassificationManager';
import { A10DGroupManager } from '@/components/a10d/A10DGroupManager';

const A10DSettings: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6 space-y-8">
        <A10DNavigation />
        
        {/* Header */}
        <div className="flex items-center gap-4">
          <Settings className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">A10D Settings</h1>
            <p className="text-muted-foreground mt-1">
              Manage your A10D classifications and groups
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          <A10DClassificationManager />
          <A10DGroupManager />
        </div>
      </div>
    </div>
  );
};

export default A10DSettings;