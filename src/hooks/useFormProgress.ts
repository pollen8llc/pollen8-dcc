
import { useState, useCallback } from 'react';

export type FormTab = "basic-info" | "platforms" | "social-media";

export const useFormProgress = () => {
  const [activeTab, setActiveTab] = useState<FormTab>("basic-info");
  const [progress, setProgress] = useState(33);

  const updateProgress = useCallback((tab: FormTab) => {
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
