
import React from 'react';
import { UserProvider } from './contexts/UserContext';
import { RelationshipWizardProvider } from './contexts/RelationshipWizardContext';
import AppRoutes from './AppRoutes';

function App() {
  return (
    <UserProvider>
      <RelationshipWizardProvider>
        <AppRoutes />
      </RelationshipWizardProvider>
    </UserProvider>
  );
}

export default App;
