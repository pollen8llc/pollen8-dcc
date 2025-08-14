
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Mail, Smartphone } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { createContact } from "@/services/rel8t/contactService";
import { DataNormalizer, NormalizedContact } from "@/utils/dataNormalizer";
import { ImportContactsStep } from "@/components/rel8t/wizard/ImportContactsStep";
import { LumaIntegrationStep } from "@/components/rel8t/wizard/LumaIntegrationStep";
import { Rel8OnlyNavigation } from "@/components/rel8t/Rel8OnlyNavigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ImportContacts = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeImportSource, setActiveImportSource] = useState("csv");

  const handleImportComplete = async (importedContacts: NormalizedContact[]) => {
    setIsProcessing(true);
    let successCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    try {
      for (const contact of importedContacts) {
        try {
          // Transform normalized contact to service contact format
          const serviceContact = DataNormalizer.transformToServiceContact(contact);
          await createContact(serviceContact);
          successCount++;
        } catch (error: any) {
          errorCount++;
          errors.push(`Failed to import ${contact.name}: ${error.message}`);
          console.error('Error importing contact:', contact.name, error);
        }
      }

      if (successCount > 0) {
        toast({
          title: "Contacts imported successfully",
          description: `Successfully imported ${successCount} contacts.${errorCount ? ` ${errorCount} failed.` : ""}`
        });
        
        // Invalidate contacts query to refresh the contacts list
        queryClient.invalidateQueries({ queryKey: ["contacts"] });
        
        // Navigate back to contacts page after successful import
        navigate("/rel8/contacts");
      } else {
        toast({
          title: "Import failed",
          description: "No contacts were successfully imported. Please check your data and try again.",
          variant: "destructive"
        });
      }
      
    } catch (error: any) {
      console.error('Import process error:', error);
      toast({
        title: "Import failed",
        description: "An error occurred during the import process.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExternalImport = (source: string) => {
    // This would typically integrate with the respective API
    // For demonstration, we'll just show a toast
    toast({
      title: `${source} Integration`,
      description: `${source} integration would be initiated here. This feature is coming soon.`
    });
  };

  const handlePhoneContactsImport = () => {
    // Switch to CSV tab for phone contacts
    setActiveImportSource("csv");
    toast({
      title: "Phone Contacts Import",
      description: "Use the CSV import above to upload your exported phone contacts file (CSV or vCard format)."
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <Rel8OnlyNavigation />
        
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 mt-6">
          <div>
            <h1 className="text-3xl font-bold">Import Contacts</h1>
            <p className="text-muted-foreground">Import contacts from external sources</p>
          </div>
        </div>
        
        <Tabs defaultValue="csv" value={activeImportSource} onValueChange={setActiveImportSource}>
          <TabsList className="grid grid-cols-5 mb-6">
            <TabsTrigger value="csv">Files (CSV/vCard)</TabsTrigger>
            <TabsTrigger value="luma">Luma</TabsTrigger>
            <TabsTrigger value="gmail">Gmail</TabsTrigger>
            <TabsTrigger value="outlook">Outlook</TabsTrigger>
            <TabsTrigger value="phone">Phone Contacts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="csv">
            <Card>
              <CardHeader>
                <CardTitle>File Import</CardTitle>
                <CardDescription>Import contacts from CSV, vCard, or Excel files</CardDescription>
              </CardHeader>
              <CardContent>
                {isProcessing ? (
                  <div className="flex items-center justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-3"></div>
                    <span>Importing contacts...</span>
                  </div>
                ) : (
                  <ImportContactsStep 
                    onNext={(data) => handleImportComplete(data.importedContacts)}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="luma">
            <Card>
              <CardHeader>
                <CardTitle>Luma Events Import</CardTitle>
                <CardDescription>Import attendee contacts from your Luma events</CardDescription>
              </CardHeader>
              <CardContent>
                {isProcessing ? (
                  <div className="flex items-center justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-3"></div>
                    <span>Importing contacts...</span>
                  </div>
                ) : (
                  <LumaIntegrationStep 
                    onNext={(data) => handleImportComplete(data.importedContacts)}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="gmail">
            <Card>
              <CardHeader>
                <CardTitle>Gmail Import</CardTitle>
                <CardDescription>Import your contacts from Gmail</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted/50 rounded-lg p-6 text-center">
                  <Mail className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="font-medium text-lg mb-2">Connect to Gmail</h3>
                  <p className="text-muted-foreground mb-4">
                    We'll securely access your Gmail contacts with your permission
                  </p>
                  <Button onClick={() => handleExternalImport("Gmail")}>
                    Connect Gmail Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="outlook">
            <Card>
              <CardHeader>
                <CardTitle>Outlook Import</CardTitle>
                <CardDescription>Import your contacts from Microsoft Outlook</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted/50 rounded-lg p-6 text-center">
                  <Mail className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="font-medium text-lg mb-2">Connect to Outlook</h3>
                  <p className="text-muted-foreground mb-4">
                    We'll securely access your Outlook contacts with your permission
                  </p>
                  <Button onClick={() => handleExternalImport("Outlook")}>
                    Connect Outlook Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="phone">
            <Card>
              <CardHeader>
                <CardTitle>Phone Contacts Import</CardTitle>
                <CardDescription>Import contacts from your mobile device</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted/50 rounded-lg p-6 text-center">
                  <Smartphone className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="font-medium text-lg mb-2">Import Phone Contacts</h3>
                  <p className="text-muted-foreground mb-4">
                    Export your contacts from your device and upload them here
                  </p>
                  <div className="space-y-4">
                    <div className="text-sm text-left bg-blue-50 p-4 rounded-lg">
                      <p className="font-medium mb-2">Instructions:</p>
                      <ol className="list-decimal list-inside space-y-1">
                        <li>Export contacts from your phone as a vCard (.vcf) or CSV file</li>
                        <li>On iPhone: Contacts → Export vCard</li>
                        <li>On Android: Contacts → Settings → Export</li>
                        <li>Email the file to yourself or save to cloud storage</li>
                        <li>Download the file to this device</li>
                        <li>Upload using the file import above</li>
                      </ol>
                    </div>
                    <Button onClick={handlePhoneContactsImport}>
                      Go to File Import
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ImportContacts;
