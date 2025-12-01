
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ColumnMapping, ColumnDetector } from '@/utils/columnDetector';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

interface ColumnMappingStepProps {
  headers: string[];
  mappings: ColumnMapping[];
  onMappingChange: (mappings: ColumnMapping[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export const ColumnMappingStep: React.FC<ColumnMappingStepProps> = ({
  headers,
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
      return <Badge variant="default" className="ml-2">High Confidence</Badge>;
    } else if (confidence >= 0.5) {
      return <Badge variant="secondary" className="ml-2">Medium Confidence</Badge>;
    } else {
      return <Badge variant="outline" className="ml-2">Low Confidence</Badge>;
    }
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
            {headers.map((header, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="font-medium">{header}</div>
                  {getConfidenceBadge(index)}
                </div>
                
                <Select
                  value={getCurrentMapping(index)}
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
                        disabled={isFieldMapped(field) && getCurrentMapping(index) !== field}
                      >
                        {ColumnDetector.getFieldDisplayName(field)}
                        {isFieldMapped(field) && getCurrentMapping(index) !== field && ' (already mapped)'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>

          {!requiredFieldsMapped && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <span className="text-sm text-amber-800">
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
