
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { createContact } from "@/services/rel8t/contactService";
import { ImportContactsStep } from "@/components/rel8t/wizard/ImportContactsStep";
import { Rel8TNavigation } from "@/components/rel8t/Rel8TNavigation";

const ImportContacts = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isProcessing, setIsProcessing] = useState(false);

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
      navigate("/rel8t/contacts");
      
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="mr-2" 
            onClick={() => navigate("/rel8t/contacts")}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Contacts
          </Button>
        </div>

        <Rel8TNavigation />
        
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 mt-6">
          <div>
            <h1 className="text-3xl font-bold">Import Contacts</h1>
            <p className="text-muted-foreground">Import contacts from external sources</p>
          </div>
        </div>
        
        <div className="bg-card rounded-lg border shadow-sm p-6 md:p-8">
          <h2 className="text-xl font-semibold mb-6">Contact Import</h2>
          <ImportContactsStep 
            onNext={(data) => handleImportComplete(data.importedContacts)}
          />
        </div>
      </div>
    </div>
  );
};

export default ImportContacts;
