
import React from 'react';
import { UserProvider } from './contexts/UserContext';
import { RelationshipWizardProvider } from './contexts/RelationshipWizardContext';
import AppRoutes from './AppRoutes';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <UserProvider>
        <ErrorBoundary fallback={<div className="p-4 text-center">Error in relationship wizard context</div>}>
          <RelationshipWizardProvider>
            <ErrorBoundary fallback={<div className="p-4 text-center">Error in routing</div>}>
              <AppRoutes />
            </ErrorBoundary>
          </RelationshipWizardProvider>
        </ErrorBoundary>
      </UserProvider>
    </ErrorBoundary>
  );
}

export default App;
