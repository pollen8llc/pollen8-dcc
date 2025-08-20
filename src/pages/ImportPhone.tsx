import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Navbar from '@/components/Navbar';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, Upload, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function ImportPhone() {
  const navigate = useNavigate();
  const [phoneNumbers, setPhoneNumbers] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedCount, setProcessedCount] = useState(0);

  const handleImport = async () => {
    if (!phoneNumbers.trim()) {
      toast({
        title: "No phone numbers provided",
        description: "Please enter phone numbers to import.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    // Split and process phone numbers
    const phones = phoneNumbers
      .split(/[\n,;]/)
      .map(phone => phone.trim())
      .filter(phone => phone && phone.length >= 10);

    // Mock processing delay
    for (let i = 0; i < phones.length; i++) {
      setProcessedCount(i + 1);
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    toast({
      title: "Phone import completed",
      description: `Successfully processed ${phones.length} phone numbers.`
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
            <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600">
              <Phone className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Phone Import</h1>
              <p className="text-muted-foreground">Import contacts from phone numbers</p>
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
              Import Phone Numbers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="phones">Phone Numbers</Label>
              <Textarea
                id="phones"
                placeholder="Enter phone numbers separated by commas, semicolons, or new lines&#10;+1-555-123-4567&#10;(555) 987-6543&#10;555.456.7890"
                value={phoneNumbers}
                onChange={(e) => setPhoneNumbers(e.target.value)}
                rows={10}
                className="resize-none"
              />
              <p className="text-sm text-muted-foreground">
                Separate multiple phone numbers with commas, semicolons, or new lines. 
                Include country codes for international numbers.
              </p>
            </div>

            {isProcessing ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
                <h3 className="text-lg font-semibold mb-2">Processing Phone Numbers</h3>
                <p className="text-muted-foreground">
                  Processed {processedCount} phone numbers...
                </p>
              </div>
            ) : (
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => navigate('/imports')}>
                  Cancel
                </Button>
                <Button onClick={handleImport}>
                  <Upload className="w-4 h-4 mr-2" />
                  Import Phone Numbers
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}