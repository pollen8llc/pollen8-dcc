
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ColumnMapping, ColumnDetector } from '@/utils/columnDetector';
import { CheckCircle2, AlertTriangle, Check, AlertCircle } from 'lucide-react';

interface ColumnMappingStepProps {
  headers: string[];
  sampleRows?: string[][];
  mappings: ColumnMapping[];
  onMappingChange: (mappings: ColumnMapping[]) => void;
  onNext: () => void;
  onBack: () => void;
}

// Field metadata for validation and format hints
const fieldMetadata: Record<string, {
  type: 'text' | 'date' | 'timestamp' | 'enum' | 'array';
  hint: string;
  enumValues?: string[];
}> = {
  name: { type: 'text', hint: 'Full name' },
  email: { type: 'text', hint: 'email@example.com' },
  phone: { type: 'text', hint: '+1 (555) 123-4567' },
  organization: { type: 'text', hint: 'Company name' },
  role: { type: 'text', hint: 'Job title' },
  location: { type: 'text', hint: 'City, State' },
  notes: { type: 'text', hint: 'Any text' },
  preferred_name: { type: 'text', hint: 'Nickname' },
  bio: { type: 'text', hint: 'Short biography' },
  interests: { type: 'array', hint: 'comma-separated: hiking, reading' },
  tags: { type: 'array', hint: 'comma-separated: VIP, friend' },
  industry: { type: 'text', hint: 'Technology, Finance, etc.' },
  professional_goals: { type: 'text', hint: 'Career objectives' },
  status: { type: 'text', hint: 'active, pending, inactive' },
  rapport_status: { type: 'enum', hint: 'red, yellow, or green', enumValues: ['red', 'yellow', 'green'] },
  preferred_channel: { type: 'text', hint: 'email, phone, text' },
  next_followup_date: { type: 'timestamp', hint: '2024-03-15 or any date format' },
  last_contact_date: { type: 'timestamp', hint: '2024-01-01 or any date format' },
  birthday: { type: 'date', hint: '1990-05-15 or any date format' },
  anniversary: { type: 'date', hint: '2020-06-01 or any date format' },
  anniversary_type: { type: 'text', hint: 'wedding, work, etc.' },
  upcoming_event: { type: 'text', hint: 'Event name' },
  upcoming_event_date: { type: 'timestamp', hint: '2024-06-20 or any date format' },
  how_we_met: { type: 'text', hint: 'Conference, mutual friend' },
  events_attended: { type: 'array', hint: 'comma-separated: Event1, Event2' }
};

interface ValidationStatus {
  status: 'valid' | 'warning' | 'error';
  message?: string;
}

const validateColumnData = (
  columnIndex: number,
  targetField: string,
  sampleRows: string[][]
): ValidationStatus => {
  const values = sampleRows
    .map(row => row[columnIndex])
    .filter(v => v && v.trim());

  if (values.length === 0) {
    return { status: 'valid' }; // No data to validate
  }

  const meta = fieldMetadata[targetField];
  if (!meta) {
    return { status: 'valid' };
  }

  // Date/timestamp validation
  if (meta.type === 'date' || meta.type === 'timestamp') {
    const invalidDates = values.filter(v => {
      const parsed = new Date(v);
      return isNaN(parsed.getTime());
    });
    if (invalidDates.length > 0) {
      return {
        status: 'warning',
        message: `${invalidDates.length} value(s) may not parse as dates`
      };
    }
  }

  // Enum validation
  if (meta.type === 'enum' && meta.enumValues) {
    const invalidValues = values.filter(
      v => !meta.enumValues!.includes(v.toLowerCase().trim())
    );
    if (invalidValues.length > 0) {
      return {
        status: 'warning',
        message: `Invalid: ${invalidValues.slice(0, 2).join(', ')}${invalidValues.length > 2 ? '...' : ''}`
      };
    }
  }

  // Email validation
  if (targetField === 'email') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidEmails = values.filter(v => !emailRegex.test(v));
    if (invalidEmails.length > 0) {
      return {
        status: 'warning',
        message: `${invalidEmails.length} invalid email format(s)`
      };
    }
  }

  return { status: 'valid' };
};

export const ColumnMappingStep: React.FC<ColumnMappingStepProps> = ({
  headers,
  sampleRows = [],
  mappings,
  onMappingChange,
  onNext,
  onBack
}) => {
  const availableFields = [
    'name', 'email', 'phone', 'organization', 'role', 'location', 'notes',
    'preferred_name', 'bio', 'interests', 'tags',
    'industry', 'professional_goals', 'status',
    'rapport_status', 'preferred_channel', 'next_followup_date', 'last_contact_date',
    'birthday', 'anniversary', 'anniversary_type', 'upcoming_event', 'upcoming_event_date',
    'how_we_met', 'events_attended'
  ];

  const updateMapping = (sourceIndex: number, targetField: string) => {
    const newMappings = mappings.filter(m => m.sourceIndex !== sourceIndex);
    
    if (targetField && targetField !== 'skip') {
      // Remove any existing mapping to this target field
      const filteredMappings = newMappings.filter(m => m.targetField !== targetField);
      
      filteredMappings.push({
        sourceIndex,
        targetField,
        confidence: 1.0, // Manual mapping gets full confidence
        sourceHeader: headers[sourceIndex]
      });
      
      onMappingChange(filteredMappings);
    } else {
      onMappingChange(newMappings);
    }
  };

  const getCurrentMapping = (headerIndex: number): string => {
    const mapping = mappings.find(m => m.sourceIndex === headerIndex);
    return mapping ? mapping.targetField : '';
  };

  const isFieldMapped = (field: string): boolean => {
    return mappings.some(m => m.targetField === field);
  };

  const getConfidenceBadge = (headerIndex: number) => {
    const mapping = mappings.find(m => m.sourceIndex === headerIndex);
    if (!mapping) return null;

    const confidence = mapping.confidence;
    if (confidence >= 0.8) {
      return <Badge variant="default" className="ml-2 text-xs">Auto-detected</Badge>;
    } else if (confidence >= 0.5) {
      return <Badge variant="secondary" className="ml-2 text-xs">Suggested</Badge>;
    }
    return null;
  };

  const getSampleValues = (columnIndex: number): string[] => {
    return sampleRows
      .slice(0, 3)
      .map(row => row[columnIndex])
      .filter(v => v && v.trim());
  };

  const getValidationIndicator = (headerIndex: number) => {
    const currentMapping = getCurrentMapping(headerIndex);
    if (!currentMapping || sampleRows.length === 0) return null;

    const validation = validateColumnData(headerIndex, currentMapping, sampleRows);
    
    if (validation.status === 'valid') {
      return (
        <div className="flex items-center gap-1 text-green-600">
          <Check className="h-4 w-4" />
          <span className="text-xs">Valid</span>
        </div>
      );
    } else if (validation.status === 'warning') {
      return (
        <div className="flex items-center gap-1 text-amber-600" title={validation.message}>
          <AlertCircle className="h-4 w-4" />
          <span className="text-xs truncate max-w-[150px]">{validation.message}</span>
        </div>
      );
    }
    return null;
  };

  const getFormatHint = (headerIndex: number) => {
    const currentMapping = getCurrentMapping(headerIndex);
    if (!currentMapping) return null;

    const meta = fieldMetadata[currentMapping];
    if (!meta) return null;

    return (
      <span className="text-xs text-muted-foreground">
        Format: {meta.hint}
      </span>
    );
  };

  const requiredFieldsMapped = mappings.some(m => m.targetField === 'name') || 
                               mappings.some(m => m.targetField === 'email');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            Column Mapping
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Review and adjust how CSV columns map to contact fields. At least one name or email field is required.
          </p>
          
          <div className="space-y-4">
            {headers.map((header, index) => {
              const sampleValues = getSampleValues(index);
              const currentMapping = getCurrentMapping(index);
              
              return (
                <div key={index} className="p-4 border rounded-lg space-y-2">
                  {/* Header row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium">{header}</span>
                      {getConfidenceBadge(index)}
                    </div>
                    
                    <Select
                      value={currentMapping}
                      onValueChange={(value) => updateMapping(index, value)}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Select field..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="skip">Skip this column</SelectItem>
                        {availableFields.map(field => (
                          <SelectItem 
                            key={field} 
                            value={field}
                            disabled={isFieldMapped(field) && currentMapping !== field}
                          >
                            {ColumnDetector.getFieldDisplayName(field)}
                            {isFieldMapped(field) && currentMapping !== field && ' (mapped)'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Sample values */}
                  {sampleValues.length > 0 && (
                    <div className="text-sm text-muted-foreground bg-muted/50 rounded px-2 py-1">
                      <span className="font-medium">Sample: </span>
                      {sampleValues.slice(0, 3).map((val, i) => (
                        <span key={i}>
                          <code className="bg-background px-1 rounded text-xs">{val.length > 30 ? val.slice(0, 30) + '...' : val}</code>
                          {i < sampleValues.length - 1 && i < 2 && ', '}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Validation and format hint */}
                  {currentMapping && (
                    <div className="flex items-center justify-between text-sm">
                      {getFormatHint(index)}
                      {getValidationIndicator(index)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {!requiredFieldsMapped && (
            <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <span className="text-sm text-amber-800 dark:text-amber-200">
                Please map at least one name or email field to continue.
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button 
          onClick={onNext}
          disabled={!requiredFieldsMapped}
        >
          Continue to Preview
        </Button>
      </div>
    </div>
  );
};
