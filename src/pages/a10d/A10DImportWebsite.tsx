import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import Navbar from '@/components/Navbar';
import { A10DNavigation } from "@/components/a10d/A10DNavigation";
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Globe, Search, Users, CheckCircle, AlertTriangle, ExternalLink, Mail, Phone } from "lucide-react";

export default function A10DImportWebsite() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [url, setUrl] = useState('');
  const [scanning, setScanning] = useState(false);
  const [contacts, setContacts] = useState<any[]>([]);

  const handleScan = () => {
    setScanning(true);
    // Mock website scanning
    setTimeout(() => {
      const mockContacts = [
        {
          name: 'John Smith',
          email: 'john@company.com',
          phone: '+1234567890',
          title: 'CEO',
          company: 'Tech Corp',
          source: 'About page'
        },
        {
          name: 'Sarah Johnson',
          email: 'sarah@company.com',
          phone: '+1234567891',
          title: 'CTO',
          company: 'Tech Corp',
          source: 'Team page'
        },
        {
          name: 'Mike Davis',
          email: 'mike@company.com',
          phone: null,
          title: 'Developer',
          company: 'Tech Corp',
          source: 'Team page'
        }
      ];
      setContacts(mockContacts);
      setScanning(false);
      setStep(2);
    }, 3000);
  };

  const handleImport = () => {
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
            <div className="p-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Website Scraping</h1>
              <p className="text-muted-foreground">Extract contact information from websites</p>
            </div>
          </div>
        </div>

        {/* Step 1: URL Input */}
        {step === 1 && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Website Contact Extraction</CardTitle>
                <p className="text-muted-foreground">
                  Enter a website URL to automatically extract contact information
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label htmlFor="url">Website URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="url"
                      placeholder="https://example.com"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={handleScan} disabled={!url || scanning}>
                      {scanning ? 'Scanning...' : 'Scan Website'}
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>What we'll look for:</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox defaultChecked disabled />
                      <Label className="text-sm">Email addresses</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox defaultChecked disabled />
                      <Label className="text-sm">Phone numbers</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox defaultChecked disabled />
                      <Label className="text-sm">Names and titles</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox defaultChecked disabled />
                      <Label className="text-sm">Company information</Label>
                    </div>
                  </div>
                </div>

                <Card className="bg-orange-500/5 border-orange-500/20">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium mb-1">Responsible Scraping</h4>
                        <p className="text-sm text-muted-foreground">
                          Only scrape websites you have permission to access. We respect robots.txt 
                          and rate limits to ensure ethical data collection.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Common Use Cases</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-muted/50">
                    <Users className="w-8 h-8 mb-2 text-primary" />
                    <h4 className="font-medium mb-1">Team Pages</h4>
                    <p className="text-sm text-muted-foreground">
                      Extract contacts from company team or about pages
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <ExternalLink className="w-8 h-8 mb-2 text-primary" />
                    <h4 className="font-medium mb-1">Contact Pages</h4>
                    <p className="text-sm text-muted-foreground">
                      Gather contact information from dedicated contact pages
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <Search className="w-8 h-8 mb-2 text-primary" />
                    <h4 className="font-medium mb-1">Directory Sites</h4>
                    <p className="text-sm text-muted-foreground">
                      Extract from business directories and listings
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Scanning State */}
        {scanning && (
          <Card className="max-w-md mx-auto text-center">
            <CardContent className="p-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Search className="w-8 h-8 text-primary animate-pulse" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Scanning Website...</h3>
              <p className="text-muted-foreground">
                Analyzing {url} for contact information
              </p>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Review Results */}
        {step === 2 && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Scan Results</CardTitle>
                <p className="text-muted-foreground">
                  Found {contacts.length} contacts from {url}
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {contacts.map((contact, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="flex items-center gap-4">
                        <Checkbox defaultChecked />
                        <div>
                          <h4 className="font-medium">{contact.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {contact.title} at {contact.company}
                          </p>
                          <div className="flex items-center gap-4 mt-1">
                            {contact.email && (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Mail className="w-3 h-3" />
                                {contact.email}
                              </div>
                            )}
                            {contact.phone && (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Phone className="w-3 h-3" />
                                {contact.phone}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {contact.source}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                Scan Another Site
              </Button>
              <Button onClick={handleImport}>
                Import {contacts.length} Contacts
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
              <h3 className="text-lg font-semibold mb-2">Import Successful!</h3>
              <p className="text-muted-foreground mb-4">
                Successfully imported {contacts.length} contacts from {url}
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