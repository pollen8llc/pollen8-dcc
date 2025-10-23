
import React from 'react';

const CommunitySetup: React.FC = () => {
  // Redirect to /p8 for the new community setup flow
  React.useEffect(() => {
    window.location.href = '/p8';
  }, []);

  return null;
};

export default CommunitySetup;
