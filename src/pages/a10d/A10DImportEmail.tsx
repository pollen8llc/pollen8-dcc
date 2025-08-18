import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Navbar from '@/components/Navbar';
import { A10DNavigation } from "@/components/a10d/A10DNavigation";
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Shield, Users, CheckCircle, AlertTriangle } from "lucide-react";

const emailProviders = [
  {
    id: 'gmail',
    name: 'Gmail',
    icon: Mail,
    color: 'from-red-500/20 to-red-600/20 border-red-500/30',
    description: 'Import from Google Gmail'
  },
  {
    id: 'outlook',
    name: 'Outlook',
    icon: Mail,
    color: 'from-blue-500/20 to-blue-600/20 border-blue-500/30',
    description: 'Import from Microsoft Outlook'
  },
  {
    id: 'yahoo',
    name: 'Yahoo Mail',
    icon: Mail,
    color: 'from-purple-500/20 to-purple-600/20 border-purple-500/30',
    description: 'Import from Yahoo Mail'
  }
];

export default function A10DImportEmail() {
  const navigate = useNavigate();
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [step, setStep] = useState(1);
  const [importing, setImporting] = useState(false);

  const handleConnect = (providerId: string) => {
    setSelectedProvider(providerId);
    setStep(2);
  };

  const handleImport = () => {
    setImporting(true);
    // Mock import process
    setTimeout(() => {
      setStep(3);
      setImporting(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6 space-y-8">
        <A10DNavigation />
        
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/a10d/import')}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Import
          </Button>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Email Import</h1>
              <p className="text-muted-foreground">Connect your email account to import contacts</p>
            </div>
          </div>
        </div>

        {/* Step 1: Provider Selection */}
        {step === 1 && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-500" />
                  Secure Email Connection
                </CardTitle>
                <p className="text-muted-foreground">
                  Choose your email provider to import contacts. We use secure OAuth authentication.
                </p>
              </CardHeader>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {emailProviders.map((provider) => {
                const Icon = provider.icon;
                return (
                  <Card 
                    key={provider.id}
                    className={`group hover:scale-105 transition-all duration-300 cursor-pointer
                                bg-gradient-to-r ${provider.color} backdrop-blur-md border`}
                    onClick={() => handleConnect(provider.id)}
                  >
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
                        <Icon className="w-8 h-8 text-foreground" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">{provider.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {provider.description}
                      </p>
                      <Button size="sm">
                        Connect Account
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium mb-1">Privacy & Security</h4>
                    <p className="text-sm text-muted-foreground">
                      We only access your contact data and never read your emails. 
                      All connections use secure OAuth2 authentication.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 2: Import Configuration */}
        {step === 2 && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Import Settings</CardTitle>
                <p className="text-muted-foreground">
                  Configure how you want to import your email contacts
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label className="text-base font-medium">Import Options</Label>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="contacts" defaultChecked />
                      <Label htmlFor="contacts" className="text-sm">
                        Import address book contacts (recommended)
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox id="frequent" />
                      <Label htmlFor="frequent" className="text-sm">
                        Import frequently emailed contacts
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox id="groups" />
                      <Label htmlFor="groups" className="text-sm">
                        Import contact groups/labels
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-base font-medium">Duplicate Handling</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="skip" name="duplicates" defaultChecked />
                      <Label htmlFor="skip" className="text-sm">Skip duplicates</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="update" name="duplicates" />
                      <Label htmlFor="update" className="text-sm">Update existing contacts</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button onClick={handleImport} disabled={importing}>
                {importing ? 'Importing...' : 'Start Import'}
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Import Complete */}
        {step === 3 && (
          <Card className="max-w-md mx-auto text-center">
            <CardContent className="p-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Import Complete!</h3>
              <p className="text-muted-foreground mb-4">
                Successfully imported 247 contacts from your email account
              </p>
              <div className="space-y-2">
                <Button onClick={() => navigate('/a10d')} className="w-full">
                  View Contacts
                </Button>
                <Button variant="outline" onClick={() => navigate('/a10d/import')} className="w-full">
                  Import More
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {importing && (
          <Card className="max-w-md mx-auto text-center">
            <CardContent className="p-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="w-8 h-8 text-primary animate-pulse" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Importing Contacts...</h3>
              <p className="text-muted-foreground">
                This may take a few moments depending on the number of contacts
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}