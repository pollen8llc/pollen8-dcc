import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shell } from '@/components/layout/Shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Upload, Link as LinkIcon } from 'lucide-react';

const OnboardingExisting = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);

  const platforms = [
    { id: 'discord', name: 'Discord', category: 'Communication' },
    { id: 'slack', name: 'Slack', category: 'Communication' },
    { id: 'eventbrite', name: 'Eventbrite', category: 'Events' },
    { id: 'luma', name: 'Luma', category: 'Events' },
    { id: 'mailchimp', name: 'Mailchimp', category: 'Email' },
    { id: 'airtable', name: 'Airtable', category: 'CRM' },
    { id: 'notion', name: 'Notion', category: 'Knowledge' },
    { id: 'whatsapp', name: 'WhatsApp', category: 'Communication' }
  ];

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  return (
    <Shell>
      <div className="max-w-4xl mx-auto space-y-6">
        <Button 
          variant="ghost" 
          onClick={() => step === 1 ? navigate('/ecosystem-builder') : setStep(step - 1)}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Optimize Your Network</h1>
          <p className="text-muted-foreground">
            Let's analyze your existing community and find opportunities to grow
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((num) => (
            <React.Fragment key={num}>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                step >= num ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                {num}
              </div>
              {num < 3 && <div className={`flex-1 h-1 ${step > num ? 'bg-primary' : 'bg-muted'}`} />}
            </React.Fragment>
          ))}
        </div>

        {/* Step 1: Import Data */}
        {step === 1 && (
          <Card className="p-6 space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Import Your Community Data</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Upload a CSV or connect your existing platforms to analyze your community
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <Card className="p-6 border-2 border-dashed hover:border-primary cursor-pointer transition-colors">
                <div className="flex flex-col items-center text-center space-y-3">
                  <Upload className="h-12 w-12 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Upload CSV</p>
                    <p className="text-sm text-muted-foreground">Import member list from file</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-2 border-dashed hover:border-primary cursor-pointer transition-colors">
                <div className="flex flex-col items-center text-center space-y-3">
                  <LinkIcon className="h-12 w-12 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Connect Platforms</p>
                    <p className="text-sm text-muted-foreground">Sync from existing tools</p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="space-y-4">
              <Label>Community Size (optional)</Label>
              <Input type="number" placeholder="Number of members" />
            </div>

            <Button onClick={() => setStep(2)} className="w-full">
              Continue
            </Button>
          </Card>
        )}

        {/* Step 2: Map Tech Stack */}
        {step === 2 && (
          <Card className="p-6 space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Current Tech Stack</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Select all platforms you currently use to manage your community
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {platforms.map((platform) => (
                <div key={platform.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50">
                  <Checkbox 
                    checked={selectedPlatforms.includes(platform.id)}
                    onCheckedChange={() => handlePlatformToggle(platform.id)}
                  />
                  <div className="flex-1">
                    <p className="font-medium">{platform.name}</p>
                    <p className="text-xs text-muted-foreground">{platform.category}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button onClick={() => setStep(3)} className="w-full">
              Continue
            </Button>
          </Card>
        )}

        {/* Step 3: Community Type */}
        {step === 3 && (
          <Card className="p-6 space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Tell Us About Your Community</h2>
              <p className="text-sm text-muted-foreground mb-6">
                This helps us provide better recommendations and benchmarks
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Community Type</Label>
                <select className="w-full mt-2 p-2 border rounded-lg">
                  <option>Local</option>
                  <option>Online</option>
                  <option>Hybrid</option>
                  <option>Membership-based</option>
                  <option>Chapter-based</option>
                  <option>Event-driven</option>
                </select>
              </div>

              <div>
                <Label>Primary Purpose</Label>
                <select className="w-full mt-2 p-2 border rounded-lg">
                  <option>Advocacy</option>
                  <option>Learning</option>
                  <option>Lifestyle</option>
                  <option>Business</option>
                  <option>Social</option>
                  <option>Professional</option>
                  <option>Creative</option>
                </select>
              </div>

              <div>
                <Label>Primary Location</Label>
                <Input placeholder="e.g., San Francisco, CA or Remote" />
              </div>
            </div>

            <Button onClick={() => navigate('/ecosystem-builder/dashboard/analytics')} className="w-full">
              Complete Setup
            </Button>
          </Card>
        )}
      </div>
    </Shell>
  );
};

export default OnboardingExisting;
