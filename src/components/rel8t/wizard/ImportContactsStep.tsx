
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUp, Mail, Table, Users, Check } from "lucide-react";
import { createContact, Contact } from "@/services/rel8t/contactService";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";

interface ImportContactsStepProps {
  onImportComplete: (contacts: Contact[]) => void;
}

export const ImportContactsStep: React.FC<ImportContactsStepProps> = ({
  onImportComplete
}) => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("csv");
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importedContacts, setImportedContacts] = useState<Contact[]>([]);
  const [progress, setProgress] = useState(0);
  const [importStatus, setImportStatus] = useState<"idle" | "importing" | "preview" | "complete">("idle");
  const [previewData, setPreviewData] = useState<any[]>([]);

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCsvFile(file);
      readFilePreview(file);
    }
  };

  // Read file for preview
  const readFilePreview = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split("\n");
        const headers = lines[0].split(",").map(h => h.trim());
        
        const previewRows = lines.slice(1, 6).map(line => {
          const values = line.split(",").map(v => v.trim());
          const row: any = {};
          
          headers.forEach((header, index) => {
            row[header] = values[index] || '';
          });
          
          return row;
        });
        
        setPreviewData(previewRows);
        setImportStatus("preview");
      } catch (error) {
        toast({
          title: "Error parsing CSV",
          description: "The file format is invalid. Please check your CSV file.",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };

  // Process CSV import
  const processImport = async () => {
    if (!csvFile) return;
    
    setIsImporting(true);
    setImportStatus("importing");
    setProgress(0);
    
    try {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        const text = e.target?.result as string;
        const lines = text.split("\n").filter(line => line.trim());
        const headers = lines[0].split(",").map(h => h.trim());
        
        const importedData: Contact[] = [];
        const totalRows = lines.length - 1;
        
        // Process each row (skip header)
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(",").map(v => v.trim());
          
          // Map CSV columns to contact properties
          const contactData: any = {
            name: values[headers.indexOf("name")] || `Contact ${i}`,
            email: values[headers.indexOf("email")] || undefined,
            phone: values[headers.indexOf("phone")] || undefined,
            organization: values[headers.indexOf("organization")] || undefined,
            role: values[headers.indexOf("role")] || undefined,
            notes: values[headers.indexOf("notes")] || undefined,
            tags: values[headers.indexOf("tags")] ? values[headers.indexOf("tags")].split(";").map((tag: string) => tag.trim()) : []
          };
          
          try {
            // Create the contact in the database
            const newContact = await createContact(contactData);
            if (newContact) {
              importedData.push(newContact);
            }
          } catch (error) {
            console.error("Error creating contact:", error);
          }
          
          // Update progress
          setProgress(Math.round(((i) / totalRows) * 100));
        }
        
        // Finalize import
        setImportedContacts(importedData);
        setImportStatus("complete");
        queryClient.invalidateQueries({ queryKey: ["contacts"] });
        
        toast({
          title: "Import Completed",
          description: `Successfully imported ${importedData.length} contacts.`,
        });
      };
      
      reader.readAsText(csvFile);
    } catch (error) {
      toast({
        title: "Import Failed",
        description: "An error occurred during import. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div>
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="mb-4 grid grid-cols-4 md:w-[600px]">
          <TabsTrigger value="csv">
            <Table className="mr-2 h-4 w-4" />
            CSV
          </TabsTrigger>
          <TabsTrigger value="gmail" disabled>
            <Mail className="mr-2 h-4 w-4" />
            Gmail
          </TabsTrigger>
          <TabsTrigger value="outlook" disabled>
            <Mail className="mr-2 h-4 w-4" />
            Outlook
          </TabsTrigger>
          <TabsTrigger value="crm" disabled>
            <Users className="mr-2 h-4 w-4" />
            CRM
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="csv" className="space-y-4">
          {importStatus === "idle" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Upload CSV File</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4">
                  Upload a CSV file containing your contacts. The first row should include headers
                  such as name, email, phone, organization, role, notes, tags.
                </p>
                
                <div className="border-2 border-dashed border-gray-300 rounded-md p-8 text-center">
                  <FileUp className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                  <p className="mb-4 text-sm text-muted-foreground">
                    Drag and drop your CSV file here, or click to browse
                  </p>
                  <Input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="max-w-xs mx-auto"
                  />
                  {csvFile && (
                    <p className="mt-2 text-sm">
                      Selected file: <span className="font-medium">{csvFile.name}</span>
                    </p>
                  )}
                </div>
                
                <div className="flex justify-end mt-4">
                  <Button
                    disabled={!csvFile}
                    onClick={() => readFilePreview(csvFile!)}
                  >
                    Next
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          {importStatus === "preview" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Preview Import</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4">
                  Review the first 5 rows of your CSV file below. If everything looks correct, click Import to continue.
                </p>
                
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-muted">
                        {previewData[0] && Object.keys(previewData[0]).map((header, i) => (
                          <th key={i} className="p-2 text-left text-xs font-medium">{header}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {previewData.map((row, i) => (
                        <tr key={i} className="border-b">
                          {Object.values(row).map((value: any, j) => (
                            <td key={j} className="p-2 text-xs">{value}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="flex justify-end mt-4 gap-2">
                  <Button variant="outline" onClick={() => setImportStatus("idle")}>
                    Back
                  </Button>
                  <Button onClick={processImport}>
                    Import Contacts
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          {importStatus === "importing" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Importing Contacts</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
                <p className="font-medium">Processing your contacts...</p>
                <div className="w-full bg-muted rounded-full h-2.5 mt-4">
                  <div
                    className="bg-primary h-2.5 rounded-full"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">{progress}% complete</p>
              </CardContent>
            </Card>
          )}
          
          {importStatus === "complete" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Import Completed</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                  <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <p className="font-medium">Successfully imported {importedContacts.length} contacts</p>
                <p className="text-sm text-muted-foreground my-2">
                  Your contacts have been added to your database and are ready to use.
                </p>
                
                <div className="w-full flex justify-center mt-6">
                  <Button onClick={() => onImportComplete(importedContacts)}>
                    Continue with Selected Contacts
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="gmail">
          <Card>
            <CardContent className="flex flex-col items-center py-8">
              <Mail className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="font-medium">Gmail Import Coming Soon</p>
              <p className="text-sm text-muted-foreground mt-2">
                We're working on integrating with Gmail. Please check back later.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="outlook">
          <Card>
            <CardContent className="flex flex-col items-center py-8">
              <Mail className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="font-medium">Outlook Import Coming Soon</p>
              <p className="text-sm text-muted-foreground mt-2">
                We're working on integrating with Outlook. Please check back later.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="crm">
          <Card>
            <CardContent className="flex flex-col items-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="font-medium">CRM Import Coming Soon</p>
              <p className="text-sm text-muted-foreground mt-2">
                We're working on integrating with popular CRM systems. Please check back later.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
