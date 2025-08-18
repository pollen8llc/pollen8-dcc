import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from '@/components/Navbar';
import { A10DNavigation } from "@/components/a10d/A10DNavigation";
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, Smartphone, Tablet, QrCode, Download, CheckCircle, AlertTriangle } from "lucide-react";

export default function A10DImportPhone() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedMethod, setSelectedMethod] = useState<string>('');

  const importMethods = [
    {
      id: 'qr',
      name: 'QR Code Sync',
      icon: QrCode,
      description: 'Scan QR code with your phone to sync contacts',
      color: 'from-blue-500/20 to-blue-600/20 border-blue-500/30',
      recommended: true
    },
    {
      id: 'app',
      name: 'Mobile App',
      icon: Smartphone,
      description: 'Download our mobile app for seamless sync',
      color: 'from-green-500/20 to-green-600/20 border-green-500/30'
    },
    {
      id: 'export',
      name: 'Export & Upload',
      icon: Download,
      description: 'Export contacts from phone and upload here',
      color: 'from-purple-500/20 to-purple-600/20 border-purple-500/30'
    }
  ];

  const handleMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId);
    setStep(2);
  };

  const handleComplete = () => {
    setStep(3);
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
            <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600">
              <Phone className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Phone Contacts</h1>
              <p className="text-muted-foreground">Sync contacts from your mobile device</p>
            </div>
          </div>
        </div>

        {/* Step 1: Method Selection */}
        {step === 1 && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Choose Import Method</CardTitle>
                <p className="text-muted-foreground">
                  Select how you'd like to import contacts from your phone
                </p>
              </CardHeader>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {importMethods.map((method) => {
                const Icon = method.icon;
                return (
                  <Card 
                    key={method.id}
                    className={`group hover:scale-105 transition-all duration-300 cursor-pointer relative
                                bg-gradient-to-r ${method.color} backdrop-blur-md border`}
                    onClick={() => handleMethodSelect(method.id)}
                  >
                    {method.recommended && (
                      <Badge 
                        className="absolute -top-2 -right-2 bg-green-500 text-white"
                      >
                        Recommended
                      </Badge>
                    )}
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
                        <Icon className="w-8 h-8 text-foreground" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">{method.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {method.description}
                      </p>
                      <Button size="sm">
                        Select Method
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: QR Code Method */}
        {step === 2 && selectedMethod === 'qr' && (
          <div className="space-y-6">
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-center">Scan QR Code</CardTitle>
                <p className="text-center text-muted-foreground">
                  Use your phone's camera to scan this QR code
                </p>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                {/* Mock QR Code */}
                <div className="w-64 h-64 mx-auto bg-gradient-to-br from-primary/10 to-primary/20 rounded-lg flex items-center justify-center">
                  <QrCode className="w-32 h-32 text-primary" />
                </div>
                
                <div className="space-y-4">
                  <div className="text-sm text-muted-foreground space-y-2">
                    <p>1. Open your phone's camera app</p>
                    <p>2. Point the camera at the QR code above</p>
                    <p>3. Tap the notification to open the sync page</p>
                    <p>4. Grant permission to access your contacts</p>
                  </div>
                  
                  <Button onClick={handleComplete} className="mt-6">
                    Complete Sync
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 2: Mobile App Method */}
        {step === 2 && selectedMethod === 'app' && (
          <div className="space-y-6">
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-center">Download Mobile App</CardTitle>
                <p className="text-center text-muted-foreground">
                  Install our mobile app for the best sync experience
                </p>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-primary/10 to-primary/20 rounded-lg flex items-center justify-center">
                  <Smartphone className="w-16 h-16 text-primary" />
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="gap-2">
                      <Download className="w-4 h-4" />
                      iOS App Store
                    </Button>
                    <Button variant="outline" className="gap-2">
                      <Download className="w-4 h-4" />
                      Google Play
                    </Button>
                  </div>
                  
                  <div className="text-sm text-muted-foreground space-y-2">
                    <p>1. Download and install the A10D mobile app</p>
                    <p>2. Sign in with the same account</p>
                    <p>3. Enable contact sync in app settings</p>
                    <p>4. Your contacts will sync automatically</p>
                  </div>
                  
                  <Button onClick={handleComplete} className="mt-6">
                    I've Installed the App
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 2: Export Method */}
        {step === 2 && selectedMethod === 'export' && (
          <div className="space-y-6">
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-center">Export & Upload</CardTitle>
                <p className="text-center text-muted-foreground">
                  Export contacts from your phone and upload them here
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium flex items-center gap-2">
                      <Smartphone className="w-5 h-5" />
                      iPhone Instructions
                    </h4>
                    <div className="text-sm space-y-2 text-muted-foreground">
                      <p>1. Open Settings → [Your Name] → iCloud</p>
                      <p>2. Turn on Contacts sync</p>
                      <p>3. Go to icloud.com → Contacts</p>
                      <p>4. Select all contacts → Export vCard</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium flex items-center gap-2">
                      <Smartphone className="w-5 h-5" />
                      Android Instructions
                    </h4>
                    <div className="text-sm space-y-2 text-muted-foreground">
                      <p>1. Open Contacts app</p>
                      <p>2. Tap Menu → Settings → Export</p>
                      <p>3. Choose "Export to .vcf file"</p>
                      <p>4. Save the file and upload below</p>
                    </div>
                  </div>
                </div>
                
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <Download className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-foreground font-medium mb-2">
                    Drop your vCard (.vcf) file here
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Or click to browse for the exported file
                  </p>
                  <Button onClick={handleComplete}>
                    Upload Contacts File
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 3: Complete */}
        {step === 3 && (
          <Card className="max-w-md mx-auto text-center">
            <CardContent className="p-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Contacts Synced!</h3>
              <p className="text-muted-foreground mb-4">
                Successfully synced 156 contacts from your phone
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
      </div>
    </div>
  );
}