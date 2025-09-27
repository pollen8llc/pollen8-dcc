import React, { useEffect, useState, memo } from 'react';
import { cn } from '@/lib/utils';
import { AvatarService } from '@/services/avatarService';
import { useUser } from '@/contexts/UserContext';

interface UnifiedAvatarProps {
  userId?: string;
  size?: number;
  className?: string;
  isAdmin?: boolean;
}

const PULSAR_SVG = `<svg width="100%" height="100%" viewBox="0 0 64 64" class="w-full h-full">
  <circle cx="32" cy="32" r="20" fill="none" stroke="hsl(var(--primary))" stroke-width="2" opacity="0.6">
    <animate attributeName="r" values="18;22;18" dur="2s" repeatCount="indefinite" />
    <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2s" repeatCount="indefinite" />
  </circle>
</svg>`;

const UnifiedAvatar: React.FC<UnifiedAvatarProps> = memo(({ 
  userId, 
  size = 40, 
  className = "",
  isAdmin = false 
}) => {
  const { currentUser } = useUser();
  const [avatarSvg, setAvatarSvg] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  
  const targetUserId = userId || currentUser?.id;
  const uniqueId = React.useMemo(() => 
    `${targetUserId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, 
    [targetUserId]
  );

  useEffect(() => {
    const loadAvatar = async () => {
      if (!targetUserId) {
        setIsLoading(false);
        return;
      }

      try {
        const avatarSelection = await AvatarService.getUserAvatarSelection(targetUserId);
        
        if (avatarSelection.selected_avatar_id) {
          const avatar = await AvatarService.getAvatarById(avatarSelection.selected_avatar_id);
          if (avatar) {
            setAvatarSvg(AvatarService.renderAvatarSvg(avatar, uniqueId));
            setIsLoading(false);
            return;
          }
        }
        
        // If no avatar found and user exists, show default Pulsar
        if (currentUser && targetUserId === currentUser.id) {
          setAvatarSvg(PULSAR_SVG.replace(/{id}/g, uniqueId));
        }
      } catch (error) {
        // Silent fail - leave blank
      }
      
      setIsLoading(false);
    };

    loadAvatar();
  }, [targetUserId, uniqueId, currentUser]);

  const containerClasses = cn(
    "relative flex shrink-0 overflow-hidden rounded-full",
    isAdmin && "ring-2 ring-primary/50",
    className
  );

  // If loading or no avatar, render blank
  if (isLoading || !avatarSvg) {
    return (
      <div 
        className={containerClasses}
        style={{ width: size, height: size }}
      />
    );
  }

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