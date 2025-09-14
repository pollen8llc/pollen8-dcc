
import React from 'react';
import { LocationSelector } from '@/components/ui/location-selector';
import { Label } from '@/components/ui/label';

interface StateSelectorProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

export const StateSelector: React.FC<StateSelectorProps> = ({
  value,
  onValueChange,
  placeholder = "Select location",
  label = "Location"
}) => {
  return (
    <LocationSelector
      value={value}
      onValueChange={onValueChange}
      placeholder={placeholder}
      label={label}
      allowCustomInput={true}
      showHierarchy={true}
    />
  );
};
