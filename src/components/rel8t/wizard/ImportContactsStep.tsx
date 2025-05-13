import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  AlertCircle, 
  CheckCircle2, 
  Upload, 
  FileText, 
  X,
  Import
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface ImportContactsStepProps {
  onNext: (data: { importedContacts: any[] }) => void;
  onPrevious?: () => void;
}

interface ParsedContact {
  name: string;
  email?: string;
  phone?: string;
  organization?: string;
  role?: string;
  location?: string;
  tags?: string[];
  duplicate?: boolean;
  duplicateOf?: string;
  source?: string;
  [key: string]: any;
}

const COMMON_FIELD_MAPPINGS: {[key: string]: string} = {
  // Name variations
  'name': 'name',
  'fullname': 'name',
  'full name': 'name',
  'full_name': 'name',
  'contact name': 'name',
  'contact': 'name',
  'attendee': 'name',
  'attendee name': 'name',
  'guest': 'name',
  'guest name': 'name',
  'firstname': 'name',
  'first name': 'name',
  'fname': 'name',
  
  // Email variations
  'email': 'email',
  'email address': 'email',
  'e-mail': 'email',
  'mail': 'email',
  'contact email': 'email',
  'attendee email': 'email',
  
  // Phone variations
  'phone': 'phone',
  'phone number': 'phone',
  'telephone': 'phone',
  'tel': 'phone',
  'mobile': 'phone',
  'cell': 'phone',
  'contact phone': 'phone',
  
  // Organization variations
  'organization': 'organization',
  'organisation': 'organization',
  'company': 'organization',
  'business': 'organization',
  'employer': 'organization',
  'org': 'organization',
  'workplace': 'organization',
  
  // Role/Title variations
  'role': 'role',
  'job title': 'role',
  'job': 'role',
  'title': 'role',
  'position': 'role',
  'job role': 'role',
  'occupation': 'role',
  
  // Location variations
  'location': 'location',
  'address': 'location',
  'city': 'location',
  'state': 'location',
  'country': 'location',
  'region': 'location',
  'place': 'location',
  
  // Tags/Notes variations
  'tags': 'tags',
  'tag': 'tags',
  'categories': 'tags',
  'category': 'tags',
  'labels': 'tags',
  'notes': 'notes',
  'note': 'notes',
  'comments': 'notes',
  'description': 'notes'
};

// Detect header match by comparing header text with common variations
const matchHeader = (header: string): string | null => {
  const normalized = header.toLowerCase().trim();
  return COMMON_FIELD_MAPPINGS[normalized] || null;
};

// Special processor for Eventbrite format
const processEventbriteFormat = (data: any[]): ParsedContact[] => {
  return data.map(row => ({
    name: `${row['First Name'] || ''} ${row['Last Name'] || ''}`.trim(),
    email: row['Email'] || row['Email Address'],
    phone: row['Phone'] || row['Cell Phone'],
    organization: row['Company'] || row['Organization'],
    role: row['Job Title'] || row['Position'],
    location: row['Shipping Address'] || row['Billing Address'] || row['Address'],
    tags: ['Eventbrite'],
    source: 'Eventbrite'
  }));
};

// Special processor for Luma format
const processLumaFormat = (data: any[]): ParsedContact[] => {
  return data.map(row => ({
    name: row['Name'] || row['Guest Name'] || row['Attendee Name'] || `${row['First Name'] || ''} ${row['Last Name'] || ''}`.trim(),
    email: row['Email'] || row['Email Address'],
    phone: row['Phone'] || row['Phone Number'],
    organization: row['Organization'] || row['Company'],
    role: row['Role'] || row['Job Title'],
    location: row['Location'] || row['City'],
    tags: ['Luma'],
    source: 'Luma'
  }));
};

// Special processor for Partiful format
const processPartifulFormat = (data: any[]): ParsedContact[] => {
  return data.map(row => ({
    name: row['Name'] || row['Guest'] || `${row['First Name'] || ''} ${row['Last Name'] || ''}`.trim(),
    email: row['Email'] || row['Guest Email'],
    phone: row['Phone'],
    tags: ['Partiful'],
    source: 'Partiful'
  }));
};

export const ImportContactsStep: React.FC<ImportContactsStepProps> = ({ 
  onNext,
  onPrevious
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [parsing, setParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [parsedContacts, setParsedContacts] = useState<ParsedContact[]>([]);
  const [duplicates, setDuplicates] = useState<number>(0);
  const [selectedFormat, setSelectedFormat] = useState<string>('auto');

  // Handle file drop
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const uploadedFile = e.dataTransfer.files[0];
      if (uploadedFile.type === 'text/csv' || uploadedFile.name.endsWith('.csv')) {
        setFile(uploadedFile);
        parseCSVFile(uploadedFile);
      } else {
        setParseError('Please upload a CSV file.');
      }
    }
  }, []);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const uploadedFile = e.target.files[0];
      if (uploadedFile.type === 'text/csv' || uploadedFile.name.endsWith('.csv')) {
        setFile(uploadedFile);
        parseCSVFile(uploadedFile);
      } else {
        setParseError('Please upload a CSV file.');
      }
    }
  };

  // Parse CSV file
  const parseCSVFile = async (csvFile: File) => {
    setParsing(true);
    setParseError(null);
    
    try {
      const text = await csvFile.text();
      const rows = text.split('\n');
      
      // Parse headers
      const headers = rows[0].split(',').map(header => header.trim().replace(/^"|"$/g, ''));
      
      // Check if data is empty
      if (rows.length <= 1) {
        throw new Error('The CSV file appears to be empty.');
      }
      
      // Parse data
      const parsedData: any[] = [];
      for (let i = 1; i < rows.length; i++) {
        if (!rows[i].trim()) continue; // Skip empty rows
        
        const values = rows[i].split(',').map(value => value.trim().replace(/^"|"$/g, ''));
        const rowData: any = {};
        
        headers.forEach((header, index) => {
          if (index < values.length) {
            rowData[header] = values[index];
          }
        });
        
        parsedData.push(rowData);
      }
      
      // Detect format and process accordingly
      let processedContacts: ParsedContact[];
      
      // Check if we should use a specific format processor
      const formatDetection = detectFormat(headers);
      const useFormat = selectedFormat === 'auto' ? formatDetection : selectedFormat;
      
      switch (useFormat) {
        case 'eventbrite':
          processedContacts = processEventbriteFormat(parsedData);
          break;
        case 'luma':
          processedContacts = processLumaFormat(parsedData);
          break;
        case 'partiful':
          processedContacts = processPartifulFormat(parsedData);
          break;
        default:
          // Generic CSV format - map headers to fields
          processedContacts = processGenericFormat(parsedData, headers);
          break;
      }
      
      // Detect duplicates
      const deduplicatedContacts = detectDuplicates(processedContacts);
      const duplicateCount = deduplicatedContacts.filter(c => c.duplicate).length;
      
      setParsedContacts(deduplicatedContacts);
      setDuplicates(duplicateCount);
      setParsing(false);
      
    } catch (error) {
      console.error('Error parsing CSV:', error);
      setParseError('Failed to parse the CSV file. Please ensure it is correctly formatted.');
      setParsing(false);
    }
  };

  // Process generic CSV format by mapping headers to known fields
  const processGenericFormat = (data: any[], headers: string[]): ParsedContact[] => {
    // Map headers to our standard fields
    const fieldMapping: {[key: string]: string} = {};
    
    headers.forEach(header => {
      const match = matchHeader(header);
      if (match) {
        fieldMapping[header] = match;
      }
    });
    
    return data.map(row => {
      const contact: ParsedContact = { name: '' };
      
      // Build contact record from mapped fields
      Object.keys(row).forEach(header => {
        const field = fieldMapping[header];
        if (field) {
          if (field === 'tags' && row[header]) {
            // Handle tags as comma or semicolon separated values
            contact.tags = row[header].split(/[,;]/).map((t: string) => t.trim()).filter((t: string) => t);
          } else {
            contact[field] = row[header];
          }
        }
      });
      
      // If we don't have a name field, try to build one from first/last name
      if (!contact.name && (row['First Name'] || row['Last Name'])) {
        contact.name = `${row['First Name'] || ''} ${row['Last Name'] || ''}`.trim();
      }
      
      // Tag as 'CSV Import' if no source is specified
      if (!contact.source) {
        contact.source = 'CSV Import';
        if (!contact.tags) contact.tags = [];
        if (!contact.tags.includes('CSV Import')) {
          contact.tags.push('CSV Import');
        }
      }
      
      return contact;
    }).filter(contact => contact.name || contact.email); // Filter out empty contacts
  };

  // Detect duplicates within the imported batch
  const detectDuplicates = (contacts: ParsedContact[]): ParsedContact[] => {
    const emailMap: {[key: string]: number} = {};
    const phoneMap: {[key: string]: number} = {};
    const nameMap: {[key: string]: number} = {};
    
    // First pass: record all unique identifiers
    contacts.forEach((contact, index) => {
      if (contact.email) {
        const normalizedEmail = contact.email.toLowerCase().trim();
        if (!emailMap[normalizedEmail]) {
          emailMap[normalizedEmail] = index;
        }
      }
      
      if (contact.phone) {
        const normalizedPhone = contact.phone.replace(/\D/g, ''); // Strip non-digits
        if (normalizedPhone && !phoneMap[normalizedPhone]) {
          phoneMap[normalizedPhone] = index;
        }
      }
      
      if (contact.name) {
        const normalizedName = contact.name.toLowerCase().trim();
        // Only use name for matching if we have a very specific name
        if (normalizedName && normalizedName.split(' ').length > 1 && !nameMap[normalizedName]) {
          nameMap[normalizedName] = index;
        }
      }
    });
    
    // Second pass: mark duplicates
    return contacts.map((contact, index) => {
      // Check for duplicates using email (most reliable)
      if (contact.email) {
        const normalizedEmail = contact.email.toLowerCase().trim();
        const firstIndex = emailMap[normalizedEmail];
        if (firstIndex !== undefined && firstIndex !== index) {
          return {
            ...contact,
            duplicate: true,
            duplicateOf: `${contacts[firstIndex].name || 'Unknown'} (${contacts[firstIndex].email})`
          };
        }
      }
      
      // Check for duplicates using phone
      if (!contact.duplicate && contact.phone) {
        const normalizedPhone = contact.phone.replace(/\D/g, '');
        if (normalizedPhone) {
          const firstIndex = phoneMap[normalizedPhone];
          if (firstIndex !== undefined && firstIndex !== index) {
            return {
              ...contact,
              duplicate: true,
              duplicateOf: `${contacts[firstIndex].name || 'Unknown'} (${contacts[firstIndex].phone})`
            };
          }
        }
      }
      
      // Use name as last resort, only if email and phone didn't match
      if (!contact.duplicate && contact.name) {
        const normalizedName = contact.name.toLowerCase().trim();
        if (normalizedName.split(' ').length > 1) { // Only match on full names
          const firstIndex = nameMap[normalizedName];
          if (firstIndex !== undefined && firstIndex !== index) {
            return {
              ...contact,
              duplicate: true,
              duplicateOf: contacts[firstIndex].name
            };
          }
        }
      }
      
      return contact;
    });
  };

  // Detect CSV format based on headers
  const detectFormat = (headers: string[]): string => {
    const headerSet = new Set(headers.map(h => h.toLowerCase().trim()));
    
    // Eventbrite format typically has these fields
    const eventbriteMarkers = ['Order #', 'Attendee Status', 'Event Name', 'Ticket Type'];
    if (eventbriteMarkers.some(marker => headerSet.has(marker.toLowerCase()))) {
      return 'eventbrite';
    }
    
    // Luma format typically has these fields
    const lumaMarkers = ['Guest ID', 'Guest Status', 'Event Name', 'Ticket Type', 'RSVP Status'];
    if (lumaMarkers.some(marker => headerSet.has(marker.toLowerCase()))) {
      return 'luma';
    }
    
    // Partiful format typically has these fields
    const partifulMarkers = ['Guest Name', 'RSVP Status', 'Party', 'Plus Ones'];
    if (partifulMarkers.some(marker => headerSet.has(marker.toLowerCase()))) {
      return 'partiful';
    }
    
    // Default to generic format
    return 'generic';
  };

  // Handle format selection
  const handleFormatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFormat(e.target.value);
    if (file) {
      // Re-parse the file with the new format
      parseCSVFile(file);
    }
  };

  // Handle proceed/next action
  const handleProceed = () => {
    // Filter out duplicates if needed and proceed
    const contacts = parsedContacts.filter(c => !c.duplicate).map(contact => {
      // Convert contact to the format expected by the next step
      const { duplicate, duplicateOf, source, ...cleanContact } = contact;
      return cleanContact;
    });
    
    onNext({ importedContacts: contacts });
  };

  // Remove a contact from the import list
  const removeContact = (index: number) => {
    setParsedContacts(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-2 flex items-center">
          <Import className="mr-2 h-5 w-5" /> Import Contacts
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Import your contacts from a CSV file. We support various formats including 
          standard CSV, Eventbrite, Luma, and Partiful exports.
        </p>
      </div>

      {/* Format selector */}
      <div className="mb-4">
        <Label htmlFor="format">CSV Format</Label>
        <div className="flex gap-2 flex-wrap mt-2">
          {[
            { value: 'auto', label: 'Auto-detect' },
            { value: 'generic', label: 'Generic CSV' },
            { value: 'eventbrite', label: 'Eventbrite' },
            { value: 'luma', label: 'Luma' },
            { value: 'partiful', label: 'Partiful' },
          ].map(option => (
            <button
              key={option.value}
              type="button"
              className={`px-3 py-1 rounded-full border text-sm transition-colors ${
                selectedFormat === option.value
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background text-foreground border-border hover:bg-muted'
              }`}
              onClick={() => {
                setSelectedFormat(option.value);
                if (file) parseCSVFile(file);
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* File upload area */}
      {!parsedContacts.length && (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center ${
            parseError ? 'border-destructive/50' : 'border-border/40'
          }`}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <div className="flex flex-col items-center justify-center">
            <FileText className="h-10 w-10 text-muted-foreground mb-2" />
            <h3 className="font-medium">Drag and drop a CSV file here</h3>
            <p className="text-sm text-muted-foreground mb-4">
              or click to browse your files
            </p>
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept=".csv"
              onChange={handleFileChange}
            />
            <Button
              variant="outline"
              onClick={() => document.getElementById('file-upload')?.click()}
              disabled={parsing}
            >
              {parsing ? 'Processing...' : 'Select CSV File'}
            </Button>
          </div>
        </div>
      )}

      {/* Error message */}
      {parseError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{parseError}</AlertDescription>
        </Alert>
      )}

      {/* Preview of parsed contacts */}
      {parsedContacts.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Preview ({parsedContacts.length} contacts)</h3>
              {duplicates > 0 && (
                <p className="text-sm text-muted-foreground">
                  {duplicates} potential duplicates found
                </p>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setFile(null);
                setParsedContacts([]);
                setParseError(null);
              }}
            >
              Clear <X className="ml-1 h-4 w-4" />
            </Button>
          </div>

          <ScrollArea className="h-[300px] border rounded-md">
            <div className="p-4 space-y-3">
              {parsedContacts.map((contact, index) => (
                <div 
                  key={index} 
                  className={`flex items-start justify-between border p-3 rounded-md ${
                    contact.duplicate ? 'border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800' : 'border-border/30'
                  }`}
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{contact.name || 'No Name'}</span>
                      {contact.duplicate && (
                        <Badge variant="outline" className="text-xs bg-amber-100 dark:bg-amber-900 border-amber-200 dark:border-amber-800">
                          Duplicate
                        </Badge>
                      )}
                      {contact.source && (
                        <Badge variant="secondary" className="text-xs">
                          {contact.source}
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {contact.email && <div>{contact.email}</div>}
                      {contact.phone && <div>{contact.phone}</div>}
                      {contact.organization && <div>{contact.organization} {contact.role && `(${contact.role})`}</div>}
                      {contact.duplicate && <div className="text-xs italic mt-1">Appears to be a duplicate of {contact.duplicateOf}</div>}
                    </div>
                  </div>
                  <button 
                    className="text-muted-foreground hover:text-destructive transition-colors"
                    onClick={() => removeContact(index)}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="flex justify-between pt-4">
            {onPrevious && (
              <Button variant="outline" onClick={onPrevious}>
                Previous
              </Button>
            )}
            <Button onClick={handleProceed}>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Continue with {parsedContacts.filter(c => !c.duplicate).length} Contacts
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImportContactsStep;
