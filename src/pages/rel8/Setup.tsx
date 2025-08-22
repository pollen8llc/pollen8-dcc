import React from 'react';
import Navbar from "@/components/Navbar";
import { Rel8SetupWizard } from "@/components/rel8t/setup/Rel8SetupWizard";

const Setup = () => {
  return (
    <>
      <Navbar />
      <Rel8SetupWizard />
    </>
  );
};

export default Setup;