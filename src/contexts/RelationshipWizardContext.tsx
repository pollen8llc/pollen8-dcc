
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Trigger } from '@/services/rel8t/triggerService';
import { Contact } from '@/services/rel8t/contactService';

type WizardStep = "select-contacts" | "select-triggers" | "review";

// Data passed from Actv8 for Build Rapport touchpoint scheduling
export interface Actv8StepData {
  stepName: string;
  stepDescription: string;
  suggestedChannel: string;
  suggestedAction: string;
  suggestedTone: string;
  pathName: string;
  pathId: string; // Development path ID (definition)
  pathInstanceId: string; // Unique instance ID for this path "run"
}

interface RelationshipWizardContextType {
  selectedTrigger: Trigger | null;
  setSelectedTrigger: (trigger: Trigger | null) => void;
  preSelectedContacts: Contact[];
  setPreSelectedContacts: (contacts: Contact[]) => void;
  wizardStep: WizardStep | null;
  setWizardStep: (step: WizardStep | null) => void;
  workingContacts: Contact[];
  setWorkingContacts: (contacts: Contact[]) => void;
  // Actv8 Build Rapport integration
  actv8ContactId: string | null;
  setActv8ContactId: (id: string | null) => void;
  actv8StepIndex: number | null;
  setActv8StepIndex: (index: number | null) => void;
  actv8StepData: Actv8StepData | null;
  setActv8StepData: (data: Actv8StepData | null) => void;
  clearWizardData: () => void;
}

const RelationshipWizardContext = createContext<RelationshipWizardContextType | undefined>(undefined);

export const useRelationshipWizard = () => {
  const context = useContext(RelationshipWizardContext);
  if (context === undefined) {
    throw new Error('useRelationshipWizard must be used within a RelationshipWizardProvider');
  }
  return context;
};

interface RelationshipWizardProviderProps {
  children: ReactNode;
}

export const RelationshipWizardProvider: React.FC<RelationshipWizardProviderProps> = ({ children }) => {
  const [selectedTrigger, setSelectedTrigger] = useState<Trigger | null>(null);
  const [preSelectedContacts, setPreSelectedContacts] = useState<Contact[]>([]);
  const [wizardStep, setWizardStep] = useState<WizardStep | null>(null);
  const [workingContacts, setWorkingContacts] = useState<Contact[]>([]);
  // Actv8 Build Rapport integration state
  const [actv8ContactId, setActv8ContactId] = useState<string | null>(null);
  const [actv8StepIndex, setActv8StepIndex] = useState<number | null>(null);
  const [actv8StepData, setActv8StepData] = useState<Actv8StepData | null>(null);

  const clearWizardData = () => {
    setSelectedTrigger(null);
    setPreSelectedContacts([]);
    setWizardStep(null);
    setWorkingContacts([]);
    // Clear actv8 data
    setActv8ContactId(null);
    setActv8StepIndex(null);
    setActv8StepData(null);
  };

  return (
    <RelationshipWizardContext.Provider
      value={{
        selectedTrigger,
        setSelectedTrigger,
        preSelectedContacts,
        setPreSelectedContacts,
        wizardStep,
        setWizardStep,
        workingContacts,
        setWorkingContacts,
        actv8ContactId,
        setActv8ContactId,
        actv8StepIndex,
        setActv8StepIndex,
        actv8StepData,
        setActv8StepData,
        clearWizardData,
      }}
    >
      {children}
    </RelationshipWizardContext.Provider>
  );
};
