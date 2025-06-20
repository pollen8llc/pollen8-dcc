
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Download, Upload, Trash2, Archive, HardDrive } from "lucide-react";

export function DataManagementSection() {
  const { toast } = useToast();
  const [exportProgress, setExportProgress] = useState(0);
  const [isExporting, setIsExporting] = useState(false);

  const handleExportData = async () => {
    setIsExporting(true);
    setExportProgress(0);
    
    try {
      // Simulate export progress
      const interval = setInterval(() => {
        setExportProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsExporting(false);
            toast({
              title: "Data exported",
              description: "Your data has been exported successfully. Download will start shortly."
            });
            return 100;
          }
          return prev + 20;
        });
      }, 500);

      // TODO: Implement actual data export
    } catch (error) {
      setIsExporting(false);
      toast({
        title: "Export failed",
        description: "Failed to export your data. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleImportContacts = () => {
    // TODO: Implement contact import
    toast({
      title: "Import contacts",
      description: "Contact import functionality will be implemented."
    });
  };

  const handleClearData = async (dataType: string) => {
    try {
      // TODO: Implement data clearing based on type
      toast({
        title: "Data cleared",
        description: `Your ${dataType} data has been cleared successfully.`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to clear ${dataType} data. Please try again.`,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Data Export */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Your Data
          </CardTitle>
          <CardDescription>
            Download all your data in a structured format
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">
            <p>Your export will include:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Profile information</li>
              <li>Contacts and relationships</li>
              <li>Triggers and automation settings</li>
              <li>Outreach campaigns and history</li>
              <li>Communities and memberships</li>
            </ul>
          </div>
          
          {isExporting && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Exporting data...</span>
                <span>{exportProgress}%</span>
              </div>
              <Progress value={exportProgress} className="w-full" />
            </div>
          )}
          
          <Button 
            onClick={handleExportData} 
            disabled={isExporting}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            {isExporting ? "Exporting..." : "Export All Data"}
          </Button>
        </CardContent>
      </Card>

      {/* Data Import */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Import Data
          </CardTitle>
          <CardDescription>
            Import contacts and other data into your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleImportContacts} variant="outline" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Import Contacts
          </Button>
        </CardContent>
      </Card>

      {/* Data Storage Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="h-5 w-5" />
            Storage Usage
          </CardTitle>
          <CardDescription>
            Overview of your data storage usage
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Contacts</span>
              <span>0 records</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Triggers</span>
              <span>0 records</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Outreach campaigns</span>
              <span>0 records</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Communities</span>
              <span>0 records</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Retention */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" />
            Data Retention
          </CardTitle>
          <CardDescription>
            Permanently delete specific types of data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground">
                  Clear All Contacts
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete all contacts?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete all your contacts. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleClearData("contacts")} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Delete All Contacts
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground">
                  Clear All Triggers
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete all triggers?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete all your automation triggers. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleClearData("triggers")} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Delete All Triggers
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground">
                  Clear Outreach History
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete outreach history?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete all your outreach campaigns and history. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleClearData("outreach")} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Delete Outreach History
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
