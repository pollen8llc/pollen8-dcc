import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Navbar from '@/components/Navbar';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Upload, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function ImportEmail() {
  const navigate = useNavigate();
  const [emailAddresses, setEmailAddresses] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedCount, setProcessedCount] = useState(0);

  const handleImport = async () => {
    if (!emailAddresses.trim()) {
      toast({
        title: "No email addresses provided",
        description: "Please enter email addresses to import.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    // Split and process email addresses
    const emails = emailAddresses
      .split(/[\n,;]/)
      .map(email => email.trim())
      .filter(email => email && email.includes('@'));

    // Mock processing delay
    for (let i = 0; i < emails.length; i++) {
      setProcessedCount(i + 1);
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    toast({
      title: "Email import completed",
      description: `Successfully processed ${emails.length} email addresses.`
    });

    setTimeout(() => {
      navigate('/imports');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Email Import</h1>
              <p className="text-muted-foreground">Import contacts from email addresses</p>
            </div>
          </div>
          <Button
            onClick={() => navigate('/imports')}
            variant="outline"
            size="sm"
            className="ml-auto gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Import</span>
            <span className="sm:hidden">Back</span>
          </Button>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Import Email Addresses
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="emails">Email Addresses</Label>
              <Textarea
                id="emails"
                placeholder="Enter email addresses separated by commas, semicolons, or new lines&#10;example@domain.com&#10;another@example.com&#10;user@company.org"
                value={emailAddresses}
                onChange={(e) => setEmailAddresses(e.target.value)}
                rows={10}
                className="resize-none"
              />
              <p className="text-sm text-muted-foreground">
                Separate multiple email addresses with commas, semicolons, or new lines
              </p>
            </div>

            {isProcessing ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
                <h3 className="text-lg font-semibold mb-2">Processing Email Addresses</h3>
                <p className="text-muted-foreground">
                  Processed {processedCount} email addresses...
                </p>
              </div>
            ) : (
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => navigate('/imports')}>
                  Cancel
                </Button>
                <Button onClick={handleImport}>
                  <Upload className="w-4 h-4 mr-2" />
                  Import Email Addresses
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}