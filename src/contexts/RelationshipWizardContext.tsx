
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Trigger } from '@/services/rel8t/triggerService';

interface RelationshipWizardContextType {
  selectedTrigger: Trigger | null;
  setSelectedTrigger: (trigger: Trigger | null) => void;
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

  const clearWizardData = () => {
    setSelectedTrigger(null);
  };

  return (
    <RelationshipWizardContext.Provider
      value={{
        selectedTrigger,
        setSelectedTrigger,
        clearWizardData,
      }}
    >
      {children}
    </RelationshipWizardContext.Provider>
  );
};
