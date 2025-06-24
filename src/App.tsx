
import React, { Suspense } from 'react';
import { UserProvider } from './contexts/UserContext';
import { RelationshipWizardProvider } from './contexts/RelationshipWizardContext';
import AppRoutes from './AppRoutes';

// Loading component for the entire app
const AppLoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
  </div>
);

function App() {
  return (
    <UserProvider>
      <RelationshipWizardProvider>
        <Suspense fallback={<AppLoadingSpinner />}>
          <AppRoutes />
        </Suspense>
      </RelationshipWizardProvider>
    </UserProvider>
  );
}

export default App;
