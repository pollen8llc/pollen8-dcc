
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Trigger } from '@/services/rel8t/triggerService';
import { Contact } from '@/services/rel8t/contactService';

interface RelationshipWizardContextType {
  selectedTrigger: Trigger | null;
  setSelectedTrigger: (trigger: Trigger | null) => void;
  preSelectedContacts: Contact[];
  setPreSelectedContacts: (contacts: Contact[]) => void;
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

  const clearWizardData = () => {
    setSelectedTrigger(null);
    setPreSelectedContacts([]);
  };

  return (
    <RelationshipWizardContext.Provider
      value={{
        selectedTrigger,
        setSelectedTrigger,
        preSelectedContacts,
        setPreSelectedContacts,
        clearWizardData,
      }}
    >
      {children}
    </RelationshipWizardContext.Provider>
  );
};
