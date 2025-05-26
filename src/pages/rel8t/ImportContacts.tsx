import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Mail, Smartphone, Users } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { createContact } from "@/services/rel8t/contactService";
import { ImportContactsStep } from "@/components/rel8t/wizard/ImportContactsStep";
import { Rel8Navigation } from "@/components/rel8t/Rel8TNavigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Rel8OnlyNavigation } from "@/components/rel8t/Rel8OnlyNavigation";

const ImportContacts = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeImportSource, setActiveImportSource] = useState("csv");

  const handleImportComplete = async (importedContacts: any[]) => {
    setIsProcessing(true);
    let successCount = 0;
    let errorCount = 0;

    try {
      for (const contact of importedContacts) {
        try {
          await createContact(contact);
          successCount++;
        } catch (error) {
          errorCount++;
          // Optionally, log or collect errors for user feedback
        }
      }

      toast({
        title: "Contacts imported",
        description: `Successfully imported ${successCount} contacts.${errorCount ? ` ${errorCount} failed.` : ""}`
      });
      
      // Invalidate contacts query to refresh the contacts list
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      
      // Navigate back to contacts page after successful import
      navigate("/rel8/contacts");
      
    } catch (error) {
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <Rel8OnlyNavigation />
        
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 mt-6">
          <div>
            <h1 className="text-3xl font-bold">Import Contacts</h1>
            <p className="text-muted-foreground">Import contacts from external sources</p>
          </div>
        </div>
        
        <Tabs defaultValue="csv" value={activeImportSource} onValueChange={setActiveImportSource}>
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="csv">CSV File</TabsTrigger>
            <TabsTrigger value="gmail">Gmail</TabsTrigger>
            <TabsTrigger value="outlook">Outlook</TabsTrigger>
            <TabsTrigger value="phone">Phone Contacts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="csv">
            <Card>
              <CardHeader>
                <CardTitle>CSV Import</CardTitle>
                <CardDescription>Import contacts from a CSV file</CardDescription>
              </CardHeader>
              <CardContent>
                <ImportContactsStep 
                  onNext={(data) => handleImportComplete(data.importedContacts)}
                />
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
                  <h3 className="font-medium text-lg mb-2">Connect to Phone</h3>
                  <p className="text-muted-foreground mb-4">
                    Export your contacts from your device and upload them here
                  </p>
                  <div className="space-y-4">
                    <p className="text-sm">
                      Instructions:
                      <ol className="list-decimal list-inside text-left mt-2">
                        <li>Export contacts from your phone as a vCard or CSV file</li>
                        <li>Email the file to yourself or save to cloud storage</li>
                        <li>Download the file to this device</li>
                        <li>Upload the file below</li>
                      </ol>
                    </p>
                    <Button onClick={() => setActiveImportSource("csv")}>
                      Upload Phone Contacts
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
