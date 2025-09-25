import React from 'react';
import { UnifiedAvatar } from './unified-avatar';

interface AvatarProps {
  children?: React.ReactNode;
  className?: string;
  userId?: string;
  size?: number;
  isAdmin?: boolean;
}

// Main Avatar component that supports both new unified pattern and old pattern with children
const Avatar: React.FC<AvatarProps> = ({ children, className, userId, size, isAdmin }) => {
  // If userId is provided, use the unified pattern directly
  if (userId) {
    return <UnifiedAvatar userId={userId} size={size} className={className} isAdmin={isAdmin} />;
  }
  
  // If children are provided, extract userId from AvatarFallback if available, otherwise render unified avatar
  if (children) {
    // Try to extract userId from AvatarFallback component
    const extractUserId = (child: React.ReactNode): string | undefined => {
      if (React.isValidElement(child) && child.props.userId) {
        return child.props.userId;
      }
      return undefined;
    };
    
    let extractedUserId: string | undefined;
    React.Children.forEach(children, (child) => {
      if (!extractedUserId) {
        extractedUserId = extractUserId(child);
      }
    });
    
    // Use extracted userId or fallback to a generic avatar
    return <UnifiedAvatar 
      userId={extractedUserId} 
      size={size || 40} 
      className={className} 
      isAdmin={isAdmin} 
    />;
  }
  
  // Fallback to default avatar
  return <UnifiedAvatar size={size || 40} className={className} isAdmin={isAdmin} />;
};

// AvatarImage component for backward compatibility - renders nothing as unified avatar handles images internally
const AvatarImage: React.FC<{ src?: string; alt?: string; className?: string }> = () => {
  return null;
};

// AvatarFallback component for backward compatibility - renders nothing but passes userId if available
const AvatarFallback: React.FC<{ 
  children?: React.ReactNode; 
  className?: string;
  userId?: string;
  useDynamicAvatar?: boolean;
}> = () => {
  return null;
};

export { Avatar, AvatarImage, AvatarFallback };