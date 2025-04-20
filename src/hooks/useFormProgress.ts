
import { useState, useCallback } from 'react';

export const useFormProgress = () => {
  const [activeTab, setActiveTab] = useState("basic-info");
  const [progress, setProgress] = useState(33);

  const updateProgress = useCallback((tab: string) => {
    setActiveTab(tab);
    switch (tab) {
      case "basic-info":
        setProgress(33);
        break;
      case "platforms":
        setProgress(66);
        break;
      case "social-media":
        setProgress(100);
        break;
    }
  }, []);

  return {
    activeTab,
    progress,
    updateProgress
  };
};
