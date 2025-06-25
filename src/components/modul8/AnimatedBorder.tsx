
import React from 'react';

interface AnimatedBorderProps {
  children: React.ReactNode;
  className?: string;
}

export const AnimatedBorder: React.FC<AnimatedBorderProps> = ({
  children,
  className = ''
}) => {
  return (
    <div className={`relative p-1 rounded-lg ${className}`}>
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-600 via-white to-teal-500 animate-pulse"></div>
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-teal-500 via-blue-600 to-white opacity-75 animate-spin" style={{ animationDuration: '3s' }}></div>
      <div className="relative bg-background rounded-lg">
        {children}
      </div>
    </div>
  );
};
