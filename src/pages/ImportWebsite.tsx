import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Navbar from '@/components/Navbar';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Globe, Upload, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function ImportWebsite() {
  const navigate = useNavigate();
  const [websites, setWebsites] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedCount, setProcessedCount] = useState(0);

  const handleImport = async () => {
    if (!websites.trim()) {
      toast({
        title: "No websites provided",
        description: "Please enter website URLs to import.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    // Split and process websites
    const urls = websites
      .split(/[\n,;]/)
      .map(url => url.trim())
      .filter(url => url && (url.includes('.') || url.startsWith('http')));

    // Mock processing delay
    for (let i = 0; i < urls.length; i++) {
      setProcessedCount(i + 1);
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    toast({
      title: "Website import completed",
      description: `Successfully processed ${urls.length} websites.`
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
            <div className="p-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Website Import</h1>
              <p className="text-muted-foreground">Import contacts from website scraping</p>
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
              Import from Websites
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="websites">Website URLs</Label>
              <Textarea
                id="websites"
                placeholder="Enter website URLs separated by commas, semicolons, or new lines&#10;https://example.com&#10;https://company.org&#10;https://business.net"
                value={websites}
                onChange={(e) => setWebsites(e.target.value)}
                rows={10}
                className="resize-none"
              />
              <p className="text-sm text-muted-foreground">
                Separate multiple URLs with commas, semicolons, or new lines. 
                We'll extract contact information from these websites.
              </p>
            </div>

            {isProcessing ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
                <h3 className="text-lg font-semibold mb-2">Scraping Websites</h3>
                <p className="text-muted-foreground">
                  Processed {processedCount} websites...
                </p>
              </div>
            ) : (
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => navigate('/imports')}>
                  Cancel
                </Button>
                <Button onClick={handleImport}>
                  <Upload className="w-4 h-4 mr-2" />
                  Import from Websites
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}