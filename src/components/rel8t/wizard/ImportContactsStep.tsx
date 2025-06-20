
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

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
}

export const ImportContactsStep: React.FC<ImportContactsStepProps> = ({ onNext }) => {
  const [file, setFile] = useState<File | null>(null);
  const [contacts, setContacts] = useState<ParsedContact[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Enhanced CSV parsing function
  const parseCSV = (csvText: string): ParsedContact[] => {
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length === 0) return [];

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/"/g, ''));
    console.log('CSV Headers detected:', headers);

    // Common header mappings
    const headerMappings = {
      name: ['name', 'full name', 'fullname', 'contact name', 'display name', 'first name', 'fname', 'given name'],
      email: ['email', 'email address', 'e-mail', 'mail', 'primary email', 'work email', 'personal email'],
      phone: ['phone', 'phone number', 'mobile', 'cell', 'telephone', 'tel', 'mobile phone', 'work phone', 'home phone'],
      organization: ['organization', 'company', 'org', 'business', 'employer', 'work', 'company name'],
      role: ['role', 'title', 'job title', 'position', 'job', 'work title', 'designation'],
      location: ['location', 'address', 'city', 'country', 'region', 'state'],
      notes: ['notes', 'note', 'comments', 'description', 'memo', 'remarks']
    };

    // Find column indices for each field
    const columnMapping: { [key: string]: number } = {};
    
    Object.entries(headerMappings).forEach(([field, possibleHeaders]) => {
      const headerIndex = headers.findIndex(header => 
        possibleHeaders.some(possible => header.includes(possible))
      );
      if (headerIndex !== -1) {
        columnMapping[field] = headerIndex;
      }
    });

    console.log('Column mapping:', columnMapping);

    const parsedContacts: ParsedContact[] = [];

    // Process data rows
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
      
      // Skip empty rows
      if (values.every(v => !v)) continue;

      const contact: ParsedContact = {
        name: '',
        email: '',
        phone: '',
        organization: '',
        role: '',
        location: '',
        notes: ''
      };

      // Extract values based on column mapping
      Object.entries(columnMapping).forEach(([field, index]) => {
        if (values[index]) {
          contact[field as keyof ParsedContact] = values[index];
        }
      });

      // If no name mapping found, try to construct from first few columns
      if (!contact.name && values.length > 0) {
        // Try to find a name in the first few columns
        for (let j = 0; j < Math.min(3, values.length); j++) {
          const value = values[j];
          if (value && value.includes(' ') || (!contact.email && !value.includes('@'))) {
            contact.name = value;
            break;
          }
        }
      }

      // If no email mapping found, look for email pattern
      if (!contact.email) {
        const emailValue = values.find(v => v && v.includes('@') && v.includes('.'));
        if (emailValue) {
          contact.email = emailValue;
        }
      }

      // If no phone mapping found, look for phone pattern
      if (!contact.phone) {
        const phoneValue = values.find(v => v && /[\d\-\(\)\+\s]{10,}/.test(v));
        if (phoneValue) {
          contact.phone = phoneValue;
        }
      }

      // Only add contact if we have at least a name or email
      if (contact.name || contact.email) {
        // If no name but have email, use email as name
        if (!contact.name && contact.email) {
          contact.name = contact.email.split('@')[0];
        }
        parsedContacts.push(contact);
      }
    }

    return parsedContacts;
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setFile(file);
    setIsProcessing(true);

    try {
      const text = await file.text();
      const parsedContacts = parseCSV(text);
      
      console.log('Parsed contacts:', parsedContacts);
      
      if (parsedContacts.length === 0) {
        toast({
          title: "No contacts found",
          description: "The CSV file doesn't contain any recognizable contact data.",
          variant: "destructive"
        });
      } else {
        setContacts(parsedContacts);
        toast({
          title: "CSV parsed successfully",
          description: `Found ${parsedContacts.length} contacts in the file.`
        });
      }
    } catch (error) {
      console.error('Error parsing CSV:', error);
      toast({
        title: "Error parsing file",
        description: "There was an error reading the CSV file. Please check the file format.",
        variant: "destructive"
      });
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
    multiple: false
  });

  const handleImport = () => {
    if (contacts.length > 0) {
      onNext({ importedContacts: contacts });
    }
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
            <Badge variant="secondary">Supports CSV, TXT, XLS, XLSX</Badge>
          </div>
        )}
      </div>

      {isProcessing && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-3"></div>
              <span>Processing file...</span>
            </div>
          </CardContent>
        </Card>
      )}

      {file && !isProcessing && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              File Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>File:</strong> {file.name}</p>
              <p><strong>Size:</strong> {(file.size / 1024).toFixed(2)} KB</p>
              <p><strong>Contacts found:</strong> {contacts.length}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {contacts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              Preview Contacts ({contacts.length} found)
            </CardTitle>
            <CardDescription>
              Review the contacts that will be imported. You can modify them after import.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-h-64 overflow-y-auto space-y-3">
              {contacts.slice(0, 10).map((contact, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="font-medium">{contact.name || 'No name'}</div>
                  {contact.email && <div className="text-sm text-muted-foreground">{contact.email}</div>}
                  {contact.phone && <div className="text-sm text-muted-foreground">{contact.phone}</div>}
                  {contact.organization && <div className="text-sm text-muted-foreground">{contact.organization}</div>}
                </div>
              ))}
              {contacts.length > 10 && (
                <div className="text-center text-sm text-muted-foreground">
                  ... and {contacts.length - 10} more contacts
                </div>
              )}
            </div>
            
            <div className="mt-6 flex justify-end">
              <Button onClick={handleImport} className="w-full sm:w-auto">
                Import {contacts.length} Contact{contacts.length !== 1 ? 's' : ''}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {contacts.length === 0 && file && !isProcessing && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center text-center">
              <AlertCircle className="h-8 w-8 text-yellow-500 mr-3" />
              <div>
                <p className="font-medium">No contacts detected</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Make sure your CSV has columns for names and emails. Common formats are supported.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
