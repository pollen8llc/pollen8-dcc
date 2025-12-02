
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { CheckCircle2, AlertTriangle, Users, UserX, Settings2 } from 'lucide-react';
import { NormalizedContact, ValidationResult } from '@/utils/dataNormalizer';
import { ColumnMapping } from '@/utils/columnDetector';
import { ColumnMappingStep } from './ColumnMappingStep';

interface ContactPreviewStepProps {
  validContacts: NormalizedContact[];
  rejectedContacts: { contact: NormalizedContact; validation: ValidationResult; rowNumber: number }[];
  duplicateContacts: { contact: NormalizedContact; duplicateOf: number; rowNumber: number }[];
  onImport: () => void;
  onBack: () => void;
  headers?: string[];
  sampleRows?: string[][];
  mappings?: ColumnMapping[];
  onMappingChange?: (mappings: ColumnMapping[]) => void;
}

export const ContactPreviewStep: React.FC<ContactPreviewStepProps> = ({
  validContacts,
  rejectedContacts,
  duplicateContacts,
  onImport,
  onBack,
  headers,
  sampleRows,
  mappings,
  onMappingChange
}) => {
  const [activeTab, setActiveTab] = useState('valid');
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleMappingChange = (newMappings: ColumnMapping[]) => {
    onMappingChange?.(newMappings);
  };

  const renderContact = (contact: NormalizedContact, index: number, showRowNumber?: number) => (
    <div key={index} className="p-3 border rounded-lg space-y-2">
      <div className="flex items-center justify-between">
        <div className="font-medium">{contact.name || 'No name'}</div>
        {showRowNumber && (
          <Badge variant="outline">Row {showRowNumber}</Badge>
        )}
      </div>
      <div className="space-y-1 text-sm text-muted-foreground">
        {contact.email && <div>📧 {contact.email}</div>}
        {contact.phone && <div>📞 {contact.phone}</div>}
        {contact.organization && <div>🏢 {contact.organization}</div>}
        {contact.role && <div>💼 {contact.role}</div>}
        {contact.location && <div>📍 {contact.location}</div>}
        {contact.industry && <div>🏭 {contact.industry}</div>}
        {contact.preferred_name && <div>👤 Preferred: {contact.preferred_name}</div>}
        {contact.birthday && <div>🎂 {contact.birthday}</div>}
        {contact.rapport_status && (
          <div className="flex items-center gap-1">
            {contact.rapport_status === 'green' && '🟢'}
            {contact.rapport_status === 'yellow' && '🟡'}
            {contact.rapport_status === 'red' && '🔴'}
            Rapport: {contact.rapport_status}
          </div>
        )}
        {contact.preferred_channel && <div>💬 Prefers: {contact.preferred_channel}</div>}
        {contact.how_we_met && <div>🤝 Met: {contact.how_we_met}</div>}
        {contact.bio && <div>📝 {contact.bio.substring(0, 100)}{contact.bio.length > 100 ? '...' : ''}</div>}
        {contact.interests && contact.interests.length > 0 && (
          <div className="flex items-center gap-1 flex-wrap">
            ⭐ {contact.interests.map((interest, i) => (
              <Badge key={i} variant="secondary" className="text-xs">{interest}</Badge>
            ))}
          </div>
        )}
        {contact.tags && contact.tags.length > 0 && (
          <div className="flex items-center gap-1 flex-wrap">
            🏷️ {contact.tags.map((tag, i) => (
              <Badge key={i} variant="outline" className="text-xs">{tag}</Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderRejectedContact = (item: { contact: NormalizedContact; validation: ValidationResult; rowNumber: number }, index: number) => (
    <div key={index} className="p-3 border border-red-200 rounded-lg space-y-2">
      <div className="flex items-center justify-between">
        <div className="font-medium">{item.contact.name || 'No name'}</div>
        <Badge variant="destructive">Row {item.rowNumber}</Badge>
      </div>
      <div className="space-y-1 text-sm text-muted-foreground">
        {item.contact.email && <div>📧 {item.contact.email}</div>}
        {item.contact.phone && <div>📞 {item.contact.phone}</div>}
        {item.contact.organization && <div>🏢 {item.contact.organization}</div>}
      </div>
      <div className="space-y-1">
        {item.validation.errors.map((error, i) => (
          <div key={i} className="text-xs text-red-600 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            {error}
          </div>
        ))}
        {item.validation.warnings.map((warning, i) => (
          <div key={i} className="text-xs text-amber-600 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            {warning}
          </div>
        ))}
      </div>
    </div>
  );

  const renderDuplicateContact = (item: { contact: NormalizedContact; duplicateOf: number; rowNumber: number }, index: number) => (
    <div key={index} className="p-3 border border-yellow-200 rounded-lg space-y-2">
      <div className="flex items-center justify-between">
        <div className="font-medium">{item.contact.name || 'No name'}</div>
        <div className="flex gap-2">
          <Badge variant="outline">Row {item.rowNumber}</Badge>
          <Badge variant="secondary">Duplicate of Row {item.duplicateOf}</Badge>
        </div>
      </div>
      <div className="space-y-1 text-sm text-muted-foreground">
        {item.contact.email && <div>📧 {item.contact.email}</div>}
        {item.contact.phone && <div>📞 {item.contact.phone}</div>}
        {item.contact.organization && <div>🏢 {item.contact.organization}</div>}
      </div>
    </div>
  );

  const showMappingConfig = headers && sampleRows && mappings && onMappingChange;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Import Summary
            </CardTitle>
            {showMappingConfig && (
              <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Settings2 className="h-4 w-4" />
                    Configure Mapping
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>Column Mapping Configuration</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <ColumnMappingStep
                      headers={headers}
                      sampleRows={sampleRows}
                      mappings={mappings}
                      onMappingChange={handleMappingChange}
                      onNext={() => setIsSheetOpen(false)}
                      onBack={() => setIsSheetOpen(false)}
                      isEmbedded
                    />
                  </div>
                </SheetContent>
              </Sheet>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{validContacts.length}</div>
              <div className="text-sm text-green-800 dark:text-green-200">Valid Contacts</div>
            </div>
            <div className="text-center p-4 bg-red-50 dark:bg-red-950/20 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{rejectedContacts.length}</div>
              <div className="text-sm text-red-800 dark:text-red-200">Rejected</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{duplicateContacts.length}</div>
              <div className="text-sm text-yellow-800 dark:text-yellow-200">Duplicates</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="valid" className="relative">
            Valid Contacts
            {validContacts.length > 0 && (
              <Badge variant="default" className="ml-2">{validContacts.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="rejected" className="relative">
            Rejected
            {rejectedContacts.length > 0 && (
              <Badge variant="destructive" className="ml-2">{rejectedContacts.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="duplicates" className="relative">
            Duplicates
            {duplicateContacts.length > 0 && (
              <Badge variant="secondary" className="ml-2">{duplicateContacts.length}</Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="valid">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                Valid Contacts ({validContacts.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {validContacts.length > 0 ? (
                <ScrollArea className="h-96">
                  <div className="space-y-3">
                    {validContacts.map((contact, index) => renderContact(contact, index))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <UserX className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No valid contacts found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rejected">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                Rejected Contacts ({rejectedContacts.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {rejectedContacts.length > 0 ? (
                <ScrollArea className="h-96">
                  <div className="space-y-3">
                    {rejectedContacts.map((item, index) => renderRejectedContact(item, index))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No rejected contacts</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="duplicates">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-yellow-600" />
                Duplicate Contacts ({duplicateContacts.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {duplicateContacts.length > 0 ? (
                <ScrollArea className="h-96">
                  <div className="space-y-3">
                    {duplicateContacts.map((item, index) => renderDuplicateContact(item, index))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No duplicate contacts found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Upload Different File
        </Button>
        <Button 
          onClick={onImport}
          disabled={validContacts.length === 0}
          className="flex items-center gap-2"
        >
          <CheckCircle2 className="h-4 w-4" />
          Import {validContacts.length} Contact{validContacts.length !== 1 ? 's' : ''}
        </Button>
      </div>
    </div>
  );
};
