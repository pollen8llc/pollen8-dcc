
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import { ImportContactsStep } from "@/components/rel8t/wizard/ImportContactsStep";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { createContact } from "@/services/rel8t/contactService";

const ImportContacts = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isImporting, setIsImporting] = useState(false);

  const handleImportComplete = async (importedContacts: any[]) => {
    setIsImporting(true);
    let successCount = 0;
    let errorCount = 0;

    try {
      for (const contact of importedContacts) {
        try {
          await createContact(contact);
          successCount++;
        } catch (error) {
          errorCount++;
        }
      }

      toast({
        title: "Import completed",
        description: `Successfully imported ${successCount} contacts${errorCount ? `. ${errorCount} failed.` : ''}`
      });
      
      // Invalidate contacts query to refresh the list
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      
      // Redirect to contacts page after successful import
      navigate("/rel8t/contacts");
    } catch (error) {
      toast({
        title: "Import failed",
        description: "There was an error importing contacts",
        variant: "destructive"
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            className="mr-2" 
            onClick={() => navigate("/rel8t")}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Dashboard
          </Button>
        </div>
        
        <div className="flex flex-col space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Import Contacts</h1>
            <p className="text-muted-foreground mt-1">
              Import contacts from a CSV file or other sources
            </p>
          </div>
          
          <div className="border rounded-lg p-6 bg-card">
            <ImportContactsStep 
              onNext={(data) => handleImportComplete(data.importedContacts)}
              isProcessing={isImporting}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportContacts;
