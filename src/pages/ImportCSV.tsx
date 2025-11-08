import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import { Rel8OnlyNavigation } from "@/components/rel8t/Rel8OnlyNavigation";
import { toast } from "@/hooks/use-toast";
import { createContact } from "@/services/rel8t/contactService";
import { DataNormalizer, NormalizedContact } from "@/utils/dataNormalizer";
import { ImportContactsStep } from "@/components/rel8t/wizard/ImportContactsStep";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileSpreadsheet, Upload } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Navbar />
      
      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Navigation Component for REL8 */}
        {isRel8Import && <Rel8OnlyNavigation />}
        
        {/* Minimal Header */}
        <div className="flex items-center gap-3 mb-6 mt-6">
          <Upload className="h-7 w-7 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Import Contacts</h1>
            <p className="text-sm text-muted-foreground">
              Import contacts from CSV, vCard, or Excel files
            </p>
          </div>
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
    </div>
  );
};

export default ImportCSV;