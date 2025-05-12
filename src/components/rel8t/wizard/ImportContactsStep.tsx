
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUp, Mail, Table, Phone, Check, AlertCircle, Loader2 } from "lucide-react";
import { createContact, Contact } from "@/services/rel8t/contactService";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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
  const [importStatus, setImportStatus] = useState<"idle" | "importing" | "preview" | "complete" | "error">("idle");
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [importSummary, setImportSummary] = useState<{total: number, success: number, failed: number}>({
    total: 0,
    success: 0,
    failed: 0
  });
  const [authStatus, setAuthStatus] = useState<{
    google: "connected" | "disconnected" | "connecting",
    outlook: "connected" | "disconnected" | "connecting",
    phone: "connected" | "disconnected" | "connecting"
  }>({
    google: "disconnected",
    outlook: "disconnected",
    phone: "disconnected"
  });

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
        setErrorMessage("The file format is invalid. Please check your CSV file.");
        setImportStatus("error");
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
    setImportSummary({ total: 0, success: 0, failed: 0 });
    
    try {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        const text = e.target?.result as string;
        const lines = text.split("\n").filter(line => line.trim());
        const headers = lines[0].split(",").map(h => h.trim());
        
        const importedData: Contact[] = [];
        const totalRows = lines.length - 1;
        let successCount = 0;
        let failedCount = 0;
        
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
              successCount++;
            }
          } catch (error) {
            console.error("Error creating contact:", error);
            failedCount++;
          }
          
          // Update progress and summary
          setProgress(Math.round(((i) / totalRows) * 100));
          setImportSummary({
            total: totalRows,
            success: successCount,
            failed: failedCount
          });
        }
        
        // Finalize import
        setImportedContacts(importedData);
        setImportStatus("complete");
        queryClient.invalidateQueries({ queryKey: ["contacts"] });
        
        toast({
          title: "Import Completed",
          description: `Successfully imported ${successCount} contacts. ${failedCount > 0 ? `Failed to import ${failedCount} contacts.` : ''}`,
          variant: failedCount > 0 ? "destructive" : "default",
        });
      };
      
      reader.readAsText(csvFile);
    } catch (error) {
      setImportStatus("error");
      setErrorMessage("An error occurred during import. Please try again.");
      toast({
        title: "Import Failed",
        description: "An error occurred during import. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  // Mock functions for other import methods
  const connectToGmail = () => {
    setAuthStatus(prev => ({ ...prev, google: "connecting" }));
    
    // Simulate connection process
    setTimeout(() => {
      setAuthStatus(prev => ({ ...prev, google: "connected" }));
      toast({
        title: "Gmail Connected",
        description: "Successfully connected to Gmail. You can now import your contacts.",
      });
    }, 2000);
  };

  const connectToOutlook = () => {
    setAuthStatus(prev => ({ ...prev, outlook: "connecting" }));
    
    // Simulate connection process
    setTimeout(() => {
      setAuthStatus(prev => ({ ...prev, outlook: "connected" }));
      toast({
        title: "Outlook Connected",
        description: "Successfully connected to Outlook. You can now import your contacts.",
      });
    }, 2000);
  };

  const connectToPhone = () => {
    setAuthStatus(prev => ({ ...prev, phone: "connecting" }));
    
    // Simulate connection process
    setTimeout(() => {
      setAuthStatus(prev => ({ ...prev, phone: "connected" }));
      toast({
        title: "Phone Connected",
        description: "Successfully connected to your phone. You can now import your contacts.",
      });
    }, 2000);
  };

  const importFromProvider = (provider: 'google' | 'outlook' | 'phone') => {
    setIsImporting(true);
    setImportStatus("importing");
    setProgress(0);
    
    // Simulate import process
    const totalSteps = 100;
    let currentStep = 0;
    
    const progressInterval = setInterval(() => {
      if (currentStep < totalSteps) {
        currentStep += 1;
        setProgress(currentStep);
      } else {
        clearInterval(progressInterval);
        setIsImporting(false);
        setImportStatus("complete");
        setImportSummary({
          total: Math.floor(Math.random() * 50) + 10,
          success: Math.floor(Math.random() * 40) + 10,
          failed: Math.floor(Math.random() * 5)
        });
        
        toast({
          title: `${provider.charAt(0).toUpperCase() + provider.slice(1)} Import Complete`,
          description: `Successfully imported contacts from ${provider}.`,
        });
        
        // Refresh contacts list
        queryClient.invalidateQueries({ queryKey: ["contacts"] });
      }
    }, 30);
  };

  return (
    <div>
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="mb-4 grid grid-cols-4">
          <TabsTrigger value="csv">
            <Table className="mr-2 h-4 w-4" />
            CSV
          </TabsTrigger>
          <TabsTrigger value="gmail">
            <Mail className="mr-2 h-4 w-4" />
            Gmail
          </TabsTrigger>
          <TabsTrigger value="outlook">
            <Mail className="mr-2 h-4 w-4" />
            Outlook
          </TabsTrigger>
          <TabsTrigger value="phone">
            <Phone className="mr-2 h-4 w-4" />
            Phone
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
                <Loader2 className="animate-spin h-10 w-10 text-primary mb-4" />
                <p className="font-medium">Processing your contacts...</p>
                <Progress value={progress} className="w-full mt-4" />
                <div className="flex justify-between w-full mt-2 text-sm text-muted-foreground">
                  <span>Success: {importSummary.success}</span>
                  <span>Progress: {progress}%</span>
                  <span>Failed: {importSummary.failed}</span>
                </div>
              </CardContent>
            </Card>
          )}
          
          {importStatus === "error" && (
            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="text-lg text-destructive flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  Import Failed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{errorMessage}</p>
                <div className="flex justify-end">
                  <Button onClick={() => setImportStatus("idle")}>
                    Try Again
                  </Button>
                </div>
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
                <p className="font-medium">Successfully imported {importSummary.success} contacts</p>
                
                {importSummary.failed > 0 && (
                  <Badge variant="destructive" className="mt-2">
                    Failed to import {importSummary.failed} contacts
                  </Badge>
                )}
                
                <p className="text-sm text-muted-foreground my-2">
                  Your contacts have been added to your database and are ready to use.
                </p>
                
                <div className="w-full flex justify-center mt-6">
                  <Button onClick={() => onImportComplete(importedContacts)}>
                    View Contacts
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="gmail">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Import Gmail Contacts</CardTitle>
            </CardHeader>
            <CardContent>
              {authStatus.google === "disconnected" && (
                <div className="flex flex-col items-center py-4">
                  <Mail className="h-12 w-12 text-primary mb-4" />
                  <p className="font-medium mb-2">Connect to Gmail</p>
                  <p className="text-sm text-muted-foreground text-center mb-4">
                    Connect your Gmail account to import contacts from your Google account.
                  </p>
                  <Button onClick={connectToGmail}>
                    Connect Gmail Account
                  </Button>
                </div>
              )}
              
              {authStatus.google === "connecting" && (
                <div className="flex flex-col items-center py-4">
                  <Loader2 className="animate-spin h-12 w-12 text-primary mb-4" />
                  <p className="font-medium mb-2">Connecting to Gmail...</p>
                  <p className="text-sm text-muted-foreground text-center">
                    Please wait while we connect to your Gmail account.
                  </p>
                </div>
              )}
              
              {authStatus.google === "connected" && (
                <div className="flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-2" />
                      <p className="font-medium">Connected to Gmail</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setAuthStatus(prev => ({ ...prev, google: "disconnected" }))}>
                      Disconnect
                    </Button>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  {importStatus === "importing" ? (
                    <div className="flex flex-col items-center py-4">
                      <Loader2 className="animate-spin h-10 w-10 text-primary mb-4" />
                      <p className="font-medium mb-2">Importing Contacts...</p>
                      <Progress value={progress} className="w-full mt-2" />
                      <p className="text-sm text-muted-foreground mt-2">{progress}% complete</p>
                    </div>
                  ) : importStatus === "complete" ? (
                    <div className="flex flex-col items-center py-4">
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                        <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
                      </div>
                      <p className="font-medium">Successfully imported {importSummary.success} contacts</p>
                      <Button onClick={() => onImportComplete([])} className="mt-4">
                        View Contacts
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center py-4">
                      <p className="text-sm text-muted-foreground mb-4 text-center">
                        Your Gmail account is connected. Click the button below to import your contacts.
                      </p>
                      <Button onClick={() => importFromProvider('google')}>Import Gmail Contacts</Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="outlook">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Import Outlook Contacts</CardTitle>
            </CardHeader>
            <CardContent>
              {authStatus.outlook === "disconnected" && (
                <div className="flex flex-col items-center py-4">
                  <Mail className="h-12 w-12 text-primary mb-4" />
                  <p className="font-medium mb-2">Connect to Outlook</p>
                  <p className="text-sm text-muted-foreground text-center mb-4">
                    Connect your Microsoft account to import contacts from Outlook.
                  </p>
                  <Button onClick={connectToOutlook}>
                    Connect Outlook Account
                  </Button>
                </div>
              )}
              
              {authStatus.outlook === "connecting" && (
                <div className="flex flex-col items-center py-4">
                  <Loader2 className="animate-spin h-12 w-12 text-primary mb-4" />
                  <p className="font-medium mb-2">Connecting to Outlook...</p>
                  <p className="text-sm text-muted-foreground text-center">
                    Please wait while we connect to your Outlook account.
                  </p>
                </div>
              )}
              
              {authStatus.outlook === "connected" && (
                <div className="flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-2" />
                      <p className="font-medium">Connected to Outlook</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setAuthStatus(prev => ({ ...prev, outlook: "disconnected" }))}>
                      Disconnect
                    </Button>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  {importStatus === "importing" ? (
                    <div className="flex flex-col items-center py-4">
                      <Loader2 className="animate-spin h-10 w-10 text-primary mb-4" />
                      <p className="font-medium mb-2">Importing Contacts...</p>
                      <Progress value={progress} className="w-full mt-2" />
                      <p className="text-sm text-muted-foreground mt-2">{progress}% complete</p>
                    </div>
                  ) : importStatus === "complete" ? (
                    <div className="flex flex-col items-center py-4">
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                        <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
                      </div>
                      <p className="font-medium">Successfully imported {importSummary.success} contacts</p>
                      <Button onClick={() => onImportComplete([])} className="mt-4">
                        View Contacts
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center py-4">
                      <p className="text-sm text-muted-foreground mb-4 text-center">
                        Your Outlook account is connected. Click the button below to import your contacts.
                      </p>
                      <Button onClick={() => importFromProvider('outlook')}>Import Outlook Contacts</Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="phone">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Import Phone Contacts</CardTitle>
            </CardHeader>
            <CardContent>
              {authStatus.phone === "disconnected" && (
                <div className="flex flex-col items-center py-4">
                  <Phone className="h-12 w-12 text-primary mb-4" />
                  <p className="font-medium mb-2">Connect to Your Phone</p>
                  <p className="text-sm text-muted-foreground text-center mb-4">
                    Connect your phone to import contacts from your mobile device.
                  </p>
                  <Button onClick={connectToPhone}>
                    Connect Phone
                  </Button>
                </div>
              )}
              
              {authStatus.phone === "connecting" && (
                <div className="flex flex-col items-center py-4">
                  <Loader2 className="animate-spin h-12 w-12 text-primary mb-4" />
                  <p className="font-medium mb-2">Connecting to Phone...</p>
                  <p className="text-sm text-muted-foreground text-center">
                    Please wait while we connect to your phone.
                  </p>
                </div>
              )}
              
              {authStatus.phone === "connected" && (
                <div className="flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-2" />
                      <p className="font-medium">Connected to Phone</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setAuthStatus(prev => ({ ...prev, phone: "disconnected" }))}>
                      Disconnect
                    </Button>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  {importStatus === "importing" ? (
                    <div className="flex flex-col items-center py-4">
                      <Loader2 className="animate-spin h-10 w-10 text-primary mb-4" />
                      <p className="font-medium mb-2">Importing Contacts...</p>
                      <Progress value={progress} className="w-full mt-2" />
                      <p className="text-sm text-muted-foreground mt-2">{progress}% complete</p>
                    </div>
                  ) : importStatus === "complete" ? (
                    <div className="flex flex-col items-center py-4">
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                        <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
                      </div>
                      <p className="font-medium">Successfully imported {importSummary.success} contacts</p>
                      <Button onClick={() => onImportComplete([])} className="mt-4">
                        View Contacts
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center py-4">
                      <p className="text-sm text-muted-foreground mb-4 text-center">
                        Your phone is connected. Click the button below to import your contacts.
                      </p>
                      <Button onClick={() => importFromProvider('phone')}>Import Phone Contacts</Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
