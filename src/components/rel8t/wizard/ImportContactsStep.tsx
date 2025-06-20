
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, AlertCircle, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { areDuplicateContacts, parseCSV } from '@/lib/utils';

interface ImportContactsStepProps {
  onNext: (data: { importedContacts: any[] }) => void;
}

interface ParsedContact {
  name: string;
  email?: string;
  phone?: string;
  organization?: string;
  role?: string;
  location?: string;
  notes?: string;
  _rowNumber?: number;
  _validationErrors?: string[];
  _isValid?: boolean;
}

interface ParseResult {
  validContacts: ParsedContact[];
  rejectedContacts: ParsedContact[];
  duplicates: ParsedContact[];
  totalProcessed: number;
}

export const ImportContactsStep: React.FC<ImportContactsStepProps> = ({ onNext }) => {
  const [file, setFile] = useState<File | null>(null);
  const [parseResult, setParseResult] = useState<ParseResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showRejected, setShowRejected] = useState(false);

  // Enhanced contact validation
  const validateContact = (contact: ParsedContact, rowNumber: number, allContacts: ParsedContact[]): ParsedContact => {
    const errors: string[] = [];
    
    // Name validation
    if (!contact.name || contact.name.trim().length < 2) {
      errors.push("Name must be at least 2 characters long");
    }
    
    // Email validation
    if (contact.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(contact.email)) {
        errors.push("Invalid email format");
      }
    }
    
    // Phone validation
    if (contact.phone) {
      const phoneDigits = contact.phone.replace(/\D/g, '');
      if (phoneDigits.length < 10) {
        errors.push("Phone number must have at least 10 digits");
      }
    }
    
    // Must have either email or phone
    if (!contact.email && !contact.phone) {
      errors.push("Contact must have either email or phone number");
    }
    
    // Check for duplicates within the current import
    const duplicateIndex = allContacts.findIndex((other, index) => 
      index < rowNumber - 1 && areDuplicateContacts(contact, other)
    );
    
    if (duplicateIndex !== -1) {
      errors.push(`Duplicate of row ${duplicateIndex + 1}`);
    }
    
    return {
      ...contact,
      _rowNumber: rowNumber,
      _validationErrors: errors,
      _isValid: errors.length === 0
    };
  };

  // Enhanced CSV parsing with better error handling
  const parseCSVAdvanced = (csvText: string): ParseResult => {
    try {
      // Use the utility function from lib/utils
      const rawContacts = parseCSV(csvText);
      
      if (rawContacts.length === 0) {
        throw new Error("No valid data rows found in CSV");
      }

      // Convert to ParsedContact format and validate
      const allContacts: ParsedContact[] = rawContacts.map((row, index) => ({
        name: row.name || row.Name || row['Full Name'] || row['Contact Name'] || '',
        email: row.email || row.Email || row['Email Address'] || '',
        phone: row.phone || row.Phone || row['Phone Number'] || row.Mobile || '',
        organization: row.organization || row.Organization || row.Company || '',
        role: row.role || row.Role || row.Title || row['Job Title'] || '',
        location: row.location || row.Location || row.Address || row.City || '',
        notes: row.notes || row.Notes || row.Comments || ''
      }));

      // Validate all contacts
      const validatedContacts = allContacts.map((contact, index) => 
        validateContact(contact, index + 1, allContacts)
      );

      // Separate valid and invalid contacts
      const validContacts = validatedContacts.filter(contact => contact._isValid);
      const rejectedContacts = validatedContacts.filter(contact => !contact._isValid);
      
      // Find duplicates among valid contacts
      const duplicates: ParsedContact[] = [];
      const uniqueContacts: ParsedContact[] = [];
      
      validContacts.forEach(contact => {
        const isDuplicate = uniqueContacts.some(existing => 
          areDuplicateContacts(contact, existing)
        );
        
        if (isDuplicate) {
          duplicates.push({
            ...contact,
            _validationErrors: [...(contact._validationErrors || []), "Duplicate contact"]
          });
        } else {
          uniqueContacts.push(contact);
        }
      });

      return {
        validContacts: uniqueContacts,
        rejectedContacts: [...rejectedContacts, ...duplicates],
        duplicates,
        totalProcessed: validatedContacts.length
      };
      
    } catch (error) {
      console.error('CSV parsing error:', error);
      throw new Error(`Failed to parse CSV: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setFile(file);
    setIsProcessing(true);
    setParseResult(null);

    try {
      const text = await file.text();
      
      // Check if file is empty
      if (!text.trim()) {
        throw new Error("File is empty");
      }
      
      const result = parseCSVAdvanced(text);
      
      setParseResult(result);
      
      if (result.validContacts.length === 0) {
        toast({
          title: "No valid contacts found",
          description: `All ${result.totalProcessed} contacts were rejected due to validation errors.`,
          variant: "destructive"
        });
      } else {
        toast({
          title: "CSV parsed successfully",
          description: `Found ${result.validContacts.length} valid contacts${result.rejectedContacts.length > 0 ? `, ${result.rejectedContacts.length} rejected` : ''}.`
        });
      }
      
    } catch (error) {
      console.error('Error parsing CSV:', error);
      toast({
        title: "Error parsing file",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
      setParseResult(null);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'text/plain': ['.txt'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    multiple: false,
    maxSize: 10 * 1024 * 1024 // 10MB limit
  });

  const handleImport = () => {
    if (parseResult && parseResult.validContacts.length > 0) {
      // Remove validation metadata before importing
      const cleanContacts = parseResult.validContacts.map(contact => {
        const { _rowNumber, _validationErrors, _isValid, ...cleanContact } = contact;
        return cleanContact;
      });
      onNext({ importedContacts: cleanContacts });
    }
  };

  const resetImport = () => {
    setFile(null);
    setParseResult(null);
    setShowRejected(false);
  };

  return (
    <div className="space-y-6">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        {isDragActive ? (
          <p className="text-lg">Drop your CSV file here...</p>
        ) : (
          <div>
            <p className="text-lg mb-2">Drag & drop your CSV file here</p>
            <p className="text-sm text-muted-foreground mb-4">or click to browse files</p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Badge variant="secondary">CSV, TXT, XLS, XLSX</Badge>
              <Badge variant="secondary">Max 10MB</Badge>
            </div>
          </div>
        )}
      </div>

      {isProcessing && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-3"></div>
              <span>Processing and validating contacts...</span>
            </div>
          </CardContent>
        </Card>
      )}

      {file && !isProcessing && parseResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Import Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">Valid</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600">{parseResult.validContacts.length}</div>
                </div>
                
                <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-medium">Rejected</span>
                  </div>
                  <div className="text-2xl font-bold text-red-600">{parseResult.rejectedContacts.length}</div>
                </div>
                
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm font-medium">Duplicates</span>
                  </div>
                  <div className="text-2xl font-bold text-yellow-600">{parseResult.duplicates.length}</div>
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">Total</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">{parseResult.totalProcessed}</div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowRejected(!showRejected)}
                  disabled={parseResult.rejectedContacts.length === 0}
                >
                  {showRejected ? 'Hide' : 'Show'} Rejected ({parseResult.rejectedContacts.length})
                </Button>
                <Button variant="outline" size="sm" onClick={resetImport}>
                  Import Different File
                </Button>
              </div>

              {showRejected && parseResult.rejectedContacts.length > 0 && (
                <div className="border rounded-lg p-4 bg-red-50 dark:bg-red-900/10">
                  <h4 className="font-medium text-red-800 dark:text-red-200 mb-3">Rejected Contacts</h4>
                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {parseResult.rejectedContacts.map((contact, index) => (
                      <div key={index} className="bg-white dark:bg-gray-800 p-3 rounded border">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-medium">{contact.name || 'No name'}</div>
                            {contact.email && <div className="text-sm text-gray-600">{contact.email}</div>}
                            {contact.phone && <div className="text-sm text-gray-600">{contact.phone}</div>}
                          </div>
                          <Badge variant="outline" className="text-xs">
                            Row {contact._rowNumber}
                          </Badge>
                        </div>
                        <div className="mt-2">
                          {contact._validationErrors?.map((error, errorIndex) => (
                            <div key={errorIndex} className="text-xs text-red-600 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {error}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {parseResult.validContacts.length > 0 && (
                <div className="border rounded-lg p-4 bg-green-50 dark:bg-green-900/10">
                  <h4 className="font-medium text-green-800 dark:text-green-200 mb-3">
                    Valid Contacts Preview ({parseResult.validContacts.length})
                  </h4>
                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {parseResult.validContacts.slice(0, 5).map((contact, index) => (
                      <div key={index} className="bg-white dark:bg-gray-800 p-3 rounded border">
                        <div className="font-medium">{contact.name}</div>
                        {contact.email && <div className="text-sm text-gray-600">{contact.email}</div>}
                        {contact.phone && <div className="text-sm text-gray-600">{contact.phone}</div>}
                        {contact.organization && <div className="text-sm text-gray-600">{contact.organization}</div>}
                      </div>
                    ))}
                    {parseResult.validContacts.length > 5 && (
                      <div className="text-center text-sm text-gray-500 py-2">
                        ... and {parseResult.validContacts.length - 5} more contacts
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {parseResult && parseResult.validContacts.length === 0 && !isProcessing && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center text-center">
              <AlertCircle className="h-8 w-8 text-red-500 mr-3" />
              <div>
                <p className="font-medium text-red-800 dark:text-red-200">No valid contacts found</p>
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                  All contacts in your file were rejected due to validation errors. 
                  Please check the rejected contacts above and fix the issues in your CSV file.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {parseResult && parseResult.validContacts.length > 0 && (
        <div className="flex justify-end">
          <Button onClick={handleImport} className="w-full sm:w-auto">
            Import {parseResult.validContacts.length} Valid Contact{parseResult.validContacts.length !== 1 ? 's' : ''}
          </Button>
        </div>
      )}
    </div>
  );
};
