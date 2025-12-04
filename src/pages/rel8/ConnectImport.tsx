import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import { Rel8OnlyNavigation } from "@/components/rel8t/Rel8OnlyNavigation";
import { toast } from "@/hooks/use-toast";
import { createContact } from "@/services/rel8t/contactService";
import { DataNormalizer, NormalizedContact } from "@/utils/dataNormalizer";
import { ImportContactsStep } from "@/components/rel8t/wizard/ImportContactsStep";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ArrowLeft, Upload, Mail } from "lucide-react";
import { GoogleContactsIntegrationStep } from "@/components/rel8t/wizard/GoogleContactsIntegrationStep";

const ConnectImport = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showGoogleImport, setShowGoogleImport] = useState(false);

  const handleImportComplete = async (importedContacts: NormalizedContact[]) => {
    setIsProcessing(true);
    let successCount = 0;
    let errorCount = 0;

    try {
      for (const contact of importedContacts) {
        try {
          const serviceContact = DataNormalizer.transformToServiceContact(contact);
          await createContact(serviceContact);
          successCount++;
        } catch (error: any) {
          errorCount++;
          console.error('Error importing contact:', contact.name, error);
        }
      }

      if (successCount > 0) {
        toast({
          title: "Contacts imported successfully",
          description: `Successfully imported ${successCount} contacts.${errorCount ? ` ${errorCount} failed.` : ""}`
        });
        
        queryClient.invalidateQueries({ queryKey: ["contacts"] });
        navigate('/rel8/contacts');
      } else {
        toast({
          title: "Import failed",
          description: "No contacts were successfully imported.",
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Navbar />
      
      <div className="container mx-auto max-w-6xl px-4 py-8 pb-32">
        <div className="flex items-center justify-between mb-6 mt-6">
          <div className="flex items-center gap-3">
            <Upload className="h-7 w-7 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">Import Contacts</h1>
              <p className="text-sm text-muted-foreground">
                Upload contacts from CSV, vCard, Excel files, or Google
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={() => navigate('/rel8/connect')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Connect
          </Button>
        </div>

        {/* Import Options */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="border-primary/50 bg-primary/5">
            <CardContent className="p-4 text-center">
              <Upload className="h-6 w-6 text-primary mx-auto mb-2" />
              <h3 className="font-medium text-sm">File Import</h3>
              <p className="text-xs text-muted-foreground">CSV, vCard, Excel</p>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-primary/30"
            onClick={() => setShowGoogleImport(true)}
          >
            <CardContent className="p-4 text-center">
              <Mail className="h-6 w-6 text-primary mx-auto mb-2" />
              <h3 className="font-medium text-sm">Gmail Contacts</h3>
              <p className="text-xs text-muted-foreground">Import from Google</p>
            </CardContent>
          </Card>
        </div>

        {/* Google Contacts Import Sheet */}
        <Sheet open={showGoogleImport} onOpenChange={setShowGoogleImport}>
          <SheetContent className="sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Import Google Contacts</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <GoogleContactsIntegrationStep 
                onComplete={() => {
                  queryClient.invalidateQueries({ queryKey: ["contacts"] });
                  setShowGoogleImport(false);
                  navigate('/rel8/contacts');
                }}
              />
            </div>
          </SheetContent>
        </Sheet>
        
        <Card className="glass-morphism border-0 backdrop-blur-md">
          <CardHeader className="border-b border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
            <CardTitle className="text-lg">File Import</CardTitle>
            <CardDescription>Choose a file to import your contacts</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
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
      </div>

      {/* Sticky Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pt-2 bg-gradient-to-t from-background via-background to-transparent pointer-events-none">
        <div className="container mx-auto max-w-6xl pointer-events-auto">
          <Rel8OnlyNavigation />
        </div>
      </div>
    </div>
  );
};

export default ConnectImport;
