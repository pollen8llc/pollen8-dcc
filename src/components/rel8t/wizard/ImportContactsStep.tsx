
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, AlertCircle, RotateCcw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { CSVParser, ParsedCSVData } from '@/utils/csvParser';
import { VCardParser } from '@/utils/vCardParser';
import { ColumnDetector, ColumnMapping } from '@/utils/columnDetector';
import { DataNormalizer, NormalizedContact, ValidationResult } from '@/utils/dataNormalizer';
import { ColumnMappingStep } from './ColumnMappingStep';
import { ContactPreviewStep } from './ContactPreviewStep';

interface ImportContactsStepProps {
  onNext: (data: { importedContacts: NormalizedContact[] }) => void;
}

type ImportStep = 'upload' | 'mapping' | 'preview';

interface ProcessedData {
  validContacts: NormalizedContact[];
  rejectedContacts: { contact: NormalizedContact; validation: ValidationResult; rowNumber: number }[];
  duplicateContacts: { contact: NormalizedContact; duplicateOf: number; rowNumber: number }[];
}

export const ImportContactsStep: React.FC<ImportContactsStepProps> = ({ onNext }) => {
  const [currentStep, setCurrentStep] = useState<ImportStep>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<ParsedCSVData | null>(null);
  const [mappings, setMappings] = useState<ColumnMapping[]>([]);
  const [processedData, setProcessedData] = useState<ProcessedData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const uploadedFile = acceptedFiles[0];
    if (!uploadedFile) return;

    // File size check (10MB limit)
    if (uploadedFile.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 10MB.",
        variant: "destructive"
      });
      return;
    }

    setFile(uploadedFile);
    setIsProcessing(true);

    try {
      let parsed: ParsedCSVData;

      // Check if it's a vCard file
      if (uploadedFile.name.toLowerCase().endsWith('.vcf')) {
        const content = await uploadedFile.text();
        const vCardContacts = VCardParser.parseVCard(content);
        
        if (vCardContacts.length === 0) {
          toast({
            title: "Invalid vCard file",
            description: "No valid contacts found in the vCard file.",
            variant: "destructive"
          });
          return;
        }

        // Convert vCard to CSV format for processing
        const csvContent = VCardParser.convertToCSVFormat(vCardContacts);
        parsed = CSVParser.parseText(csvContent, { skipEmptyLines: true });
      } else {
        // Parse as CSV
        parsed = await CSVParser.parseFile(uploadedFile, {
          skipEmptyLines: true,
          maxFileSize: 10 * 1024 * 1024
        });
      }

      if (parsed.headers.length === 0 || parsed.rows.length === 0) {
        toast({
          title: "Invalid file",
          description: "The file appears to be empty or has no valid data.",
          variant: "destructive"
        });
        return;
      }

      setCsvData(parsed);

      // Auto-detect column mappings
      const detection = ColumnDetector.detectColumns(parsed.headers);
      setMappings(detection.mappings);

      toast({
        title: "File processed successfully",
        description: `Found ${parsed.headers.length} columns and ${parsed.rows.length} rows. ${detection.mappings.length} columns auto-mapped.`
      });

      setCurrentStep('mapping');
    } catch (error) {
      console.error('Error parsing file:', error);
      toast({
        title: "Error parsing file",
        description: "There was an error reading the file. Please check the file format.",
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
      'text/vcard': ['.vcf'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    multiple: false
  });

  const handleMappingNext = () => {
    if (!csvData) return;

    setIsProcessing(true);

    try {
      // Process contacts with current mappings
      const validContacts: NormalizedContact[] = [];
      const rejectedContacts: { contact: NormalizedContact; validation: ValidationResult; rowNumber: number }[] = [];
      const duplicateContacts: { contact: NormalizedContact; duplicateOf: number; rowNumber: number }[] = [];
      const contactHashes = new Map<string, number>();

      csvData.rows.forEach((row, rowIndex) => {
        // Map row data to fields
        const rawContact: { [key: string]: string } = {};
        mappings.forEach(mapping => {
          if (row[mapping.sourceIndex]) {
            rawContact[mapping.targetField] = row[mapping.sourceIndex];
          }
        });

        // Normalize contact data
        const normalizedContact = DataNormalizer.normalizeContact(rawContact);
        
        // Validate contact
        const validation = DataNormalizer.validateContact(normalizedContact);
        
        if (!validation.isValid) {
          rejectedContacts.push({
            contact: normalizedContact,
            validation,
            rowNumber: rowIndex + 2 // +2 because row 0 is headers and we want 1-based indexing
          });
          return;
        }

        // Check for duplicates
        const contactHash = DataNormalizer.generateContactHash(normalizedContact);
        const existingIndex = contactHashes.get(contactHash);
        
        if (existingIndex !== undefined) {
          duplicateContacts.push({
            contact: normalizedContact,
            duplicateOf: existingIndex + 2,
            rowNumber: rowIndex + 2
          });
          return;
        }

        // Add to valid contacts
        contactHashes.set(contactHash, rowIndex);
        validContacts.push(normalizedContact);
      });

      setProcessedData({
        validContacts,
        rejectedContacts,
        duplicateContacts
      });

      toast({
        title: "Contacts processed",
        description: `${validContacts.length} valid, ${rejectedContacts.length} rejected, ${duplicateContacts.length} duplicates found.`
      });

      setCurrentStep('preview');
    } catch (error) {
      console.error('Error processing contacts:', error);
      toast({
        title: "Processing error",
        description: "There was an error processing the contacts.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImport = () => {
    if (processedData && processedData.validContacts.length > 0) {
      onNext({ importedContacts: processedData.validContacts });
    }
  };

  const handleReset = () => {
    setCurrentStep('upload');
    setFile(null);
    setCsvData(null);
    setMappings([]);
    setProcessedData(null);
  };

  if (currentStep === 'mapping' && csvData) {
    return (
      <ColumnMappingStep
        headers={csvData.headers}
        sampleRows={csvData.rows.slice(0, 5)}
        mappings={mappings}
        onMappingChange={setMappings}
        onNext={handleMappingNext}
        onBack={() => setCurrentStep('upload')}
      />
    );
  }

  if (currentStep === 'preview' && processedData) {
    return (
      <ContactPreviewStep
        validContacts={processedData.validContacts}
        rejectedContacts={processedData.rejectedContacts}
        duplicateContacts={processedData.duplicateContacts}
        onImport={handleImport}
        onBack={() => setCurrentStep('mapping')}
      />
    );
  }

  // Upload step
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
          <p className="text-lg">Drop your file here...</p>
        ) : (
          <div>
            <p className="text-lg mb-2">Drag & drop your contact file here</p>
            <p className="text-sm text-muted-foreground mb-4">or click to browse files</p>
            <Badge variant="secondary">Supports CSV, TXT, vCard (.vcf), XLS, XLSX (max 10MB)</Badge>
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

      {file && !isProcessing && currentStep === 'upload' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              File Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 mb-4">
              <p><strong>File:</strong> {file.name}</p>
              <p><strong>Size:</strong> {(file.size / 1024).toFixed(2)} KB</p>
              <p><strong>Type:</strong> {file.name.toLowerCase().endsWith('.vcf') ? 'vCard' : 'CSV'}</p>
              {csvData && (
                <>
                  <p><strong>Columns:</strong> {csvData.headers.length}</p>
                  <p><strong>Rows:</strong> {csvData.rows.length}</p>
                  <p><strong>Delimiter:</strong> {csvData.delimiter === '\t' ? 'Tab' : csvData.delimiter}</p>
                </>
              )}
            </div>
            <Button onClick={handleReset} variant="outline" className="mr-2">
              <RotateCcw className="h-4 w-4 mr-2" />
              Upload Different File
            </Button>
          </CardContent>
        </Card>
      )}

      {!file && !isProcessing && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center text-center">
              <AlertCircle className="h-8 w-8 text-blue-500 mr-3" />
              <div>
                <p className="font-medium">Advanced Contact Processing</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Supports CSV, vCard, and Excel formats with intelligent column detection and data validation.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
