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
import { ArrowLeft, Upload } from "lucide-react";

const ConnectImport = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isProcessing, setIsProcessing] = useState(false);

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
                Upload contacts from CSV, vCard, or Excel files
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={() => navigate('/rel8/connect')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Connect
          </Button>
        </div>
        
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
