import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import { toast } from "@/hooks/use-toast";
import { createContact } from "@/services/rel8t/contactService";
import { DataNormalizer, NormalizedContact } from "@/utils/dataNormalizer";
import { ImportContactsStep } from "@/components/rel8t/wizard/ImportContactsStep";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileSpreadsheet } from "lucide-react";

const ImportCSV = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [isProcessing, setIsProcessing] = useState(false);

  // Determine if this is being used for REL8 or general import
  const isRel8Import = location.pathname.includes('/rel8');
  const backPath = isRel8Import ? '/rel8/contacts' : '/imports';
  const successPath = isRel8Import ? '/rel8/contacts' : '/a10d';

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
        
        // Navigate back to appropriate page after successful import
        navigate(successPath);
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-green-600">
              <FileSpreadsheet className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Import CSV</h1>
              <p className="text-muted-foreground">Import contacts from CSV, vCard, or Excel files</p>
            </div>
          </div>
          <div className="ml-auto flex gap-2">
            {isRel8Import && (
              <Button
                onClick={() => navigate('/imports')}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                More Options
              </Button>
            )}
            <Button
              onClick={() => navigate(backPath)}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back</span>
            </Button>
          </div>
        </div>
        
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
      </div>
    </div>
  );
};

export default ImportCSV;