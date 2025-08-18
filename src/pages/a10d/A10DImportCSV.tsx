import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import Navbar from '@/components/Navbar';
import { A10DNavigation } from "@/components/a10d/A10DNavigation";
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, FileSpreadsheet, CheckCircle, AlertCircle, Users, MapPin, Mail, Phone } from "lucide-react";
import { useDropzone } from 'react-dropzone';

export default function A10DImportCSV() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [step, setStep] = useState(1);
  const [preview, setPreview] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const uploadedFile = acceptedFiles[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      // Mock CSV parsing
      const mockHeaders = ['Name', 'Email', 'Phone', 'Company', 'Title', 'Location'];
      const mockPreview = [
        { Name: 'John Doe', Email: 'john@example.com', Phone: '+1234567890', Company: 'Tech Corp', Title: 'Developer', Location: 'SF' },
        { Name: 'Jane Smith', Email: 'jane@example.com', Phone: '+0987654321', Company: 'Design Inc', Title: 'Designer', Location: 'NYC' }
      ];
      setHeaders(mockHeaders);
      setPreview(mockPreview);
      setStep(2);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    multiple: false
  });

  const fieldOptions = [
    { value: 'name', label: 'Full Name', icon: Users },
    { value: 'email', label: 'Email Address', icon: Mail },
    { value: 'phone', label: 'Phone Number', icon: Phone },
    { value: 'company', label: 'Company', icon: Users },
    { value: 'title', label: 'Job Title', icon: Users },
    { value: 'location', label: 'Location', icon: MapPin },
    { value: 'skip', label: 'Skip Column', icon: AlertCircle }
  ];

  const handleImport = () => {
    // Mock import process
    setStep(3);
    setTimeout(() => {
      navigate('/a10d');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6 space-y-8">
        <A10DNavigation />
        
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            onClick={() => navigate('/a10d/import')}
            variant="outline"
            size="sm"
            className="gap-2 border-[#00eada]/30 hover:border-[#00eada] hover:bg-[#00eada]/10 transition-all duration-200 hover:shadow-lg hover:shadow-[#00eada]/20"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Import</span>
            <span className="sm:hidden">Back</span>
          </Button>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-green-600">
              <FileSpreadsheet className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">CSV Import</h1>
              <p className="text-muted-foreground">Upload and map your contact data</p>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center gap-4 mb-8">
          {[
            { step: 1, label: 'Upload', active: step >= 1, completed: step > 1 },
            { step: 2, label: 'Map Fields', active: step >= 2, completed: step > 2 },
            { step: 3, label: 'Import', active: step >= 3, completed: step > 3 }
          ].map((item) => (
            <div key={item.step} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                ${item.completed ? 'bg-green-500 text-white' : 
                  item.active ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
                {item.completed ? <CheckCircle className="w-4 h-4" /> : item.step}
              </div>
              <span className={`text-sm ${item.active ? 'text-foreground' : 'text-muted-foreground'}`}>
                {item.label}
              </span>
              {item.step < 3 && <div className="w-8 h-px bg-border" />}
            </div>
          ))}
        </div>

        {/* Step 1: File Upload */}
        {step === 1 && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload Contact File
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                  ${isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
              >
                <input {...getInputProps()} />
                <FileSpreadsheet className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                {isDragActive ? (
                  <p className="text-primary">Drop your file here...</p>
                ) : (
                  <div>
                    <p className="text-foreground font-medium mb-2">
                      Drag & drop your CSV file here, or click to browse
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Supports CSV, XLS, and XLSX files (max 10MB)
                    </p>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 rounded-lg bg-muted/50">
                  <Badge variant="secondary" className="mb-2">CSV</Badge>
                  <p className="text-xs text-muted-foreground">Comma separated</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <Badge variant="secondary" className="mb-2">XLS</Badge>
                  <p className="text-xs text-muted-foreground">Excel format</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <Badge variant="secondary" className="mb-2">XLSX</Badge>
                  <p className="text-xs text-muted-foreground">Modern Excel</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Field Mapping */}
        {step === 2 && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Map Your Fields</CardTitle>
                <p className="text-muted-foreground">
                  Match your CSV columns to contact fields
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {headers.map((header, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 rounded-lg border">
                    <div className="flex-1">
                      <Label className="font-medium">{header}</Label>
                      <p className="text-sm text-muted-foreground">
                        Sample: {preview[0]?.[header] || 'N/A'}
                      </p>
                    </div>
                    <Select 
                      value={mapping[header] || ''} 
                      onValueChange={(value) => setMapping({...mapping, [header]: value})}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Select field" />
                      </SelectTrigger>
                      <SelectContent>
                        {fieldOptions.map((option) => {
                          const Icon = option.icon;
                          return (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex items-center gap-2">
                                <Icon className="w-4 h-4" />
                                {option.label}
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button onClick={handleImport}>
                Import {preview.length} Contacts
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Import Progress */}
        {step === 3 && (
          <Card className="max-w-md mx-auto text-center">
            <CardContent className="p-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Import Successful!</h3>
              <p className="text-muted-foreground mb-4">
                {preview.length} contacts have been imported to your A10D database
              </p>
              <Button onClick={() => navigate('/a10d')}>
                View Contacts
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}