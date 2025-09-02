import React from 'react';
import { Rel8Header } from "@/components/rel8t/Rel8Header";
import { Rel8SetupWizard } from "@/components/rel8t/setup/Rel8SetupWizard";

const Setup = () => {
  return (
    <div className="min-h-screen bg-background">
      <Rel8Header showProfileBanner={false} />
      <Rel8SetupWizard />
    </div>
  );
};

export default Setup;