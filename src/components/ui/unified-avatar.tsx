import React, { memo } from 'react';
import { cn } from '@/lib/utils';
import { SimpleAvatarService } from '@/services/simpleAvatarService';
import { useUser } from '@/contexts/UserContext';

interface UnifiedAvatarProps {
  userId?: string;
  size?: number;
  className?: string;
  isAdmin?: boolean;
}

const UnifiedAvatar: React.FC<UnifiedAvatarProps> = memo(({ 
  userId, 
  size = 40, 
  className = "",
  isAdmin = false 
}) => {
  const { currentUser } = useUser();
  
  const targetUserId = userId || currentUser?.id;
  
  // Get user info for generating avatar
  let firstName: string | undefined;
  let lastName: string | undefined;
  const email = currentUser?.email;
  
  // Parse name if it exists
  if (currentUser?.name) {
    const nameParts = currentUser.name.trim().split(' ');
    firstName = nameParts[0];
    lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : undefined;
  }
  
  // Generate simple initials-based avatar
  const initials = SimpleAvatarService.getInitials(firstName, lastName, email);
  const avatarSvg = SimpleAvatarService.generateInitialsAvatar(initials, size, targetUserId);

  const containerClasses = cn(
    "relative flex shrink-0 overflow-hidden rounded-full",
    isAdmin && "ring-2 ring-primary/50",
    className
  );

  return (
    <div 
      className={containerClasses}
      style={{ width: size, height: size }}
      dangerouslySetInnerHTML={{ __html: avatarSvg }}
    />
  );
});

UnifiedAvatar.displayName = 'UnifiedAvatar';

export { UnifiedAvatar };