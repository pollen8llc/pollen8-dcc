import React, { useEffect, useState, memo } from 'react';
import { cn } from '@/lib/utils';
import { AvatarService, IonsAvatar } from '@/services/avatarService';
import { useUser } from '@/contexts/UserContext';

interface UnifiedAvatarProps {
  userId?: string;
  size?: number;
  className?: string;
  isAdmin?: boolean;
}

const PULSAR_SVG = `
<svg width="100%" height="100%" viewBox="0 0 64 64">
  <defs>
    <radialGradient id="pulsar-core-{id}" cx="50%" cy="50%" r="30%">
      <stop offset="0%" stop-color="hsl(174 100% 46%)" />
      <stop offset="70%" stop-color="hsl(174 100% 46%)" />
      <stop offset="100%" stop-color="hsl(215 25% 16%)" />
    </radialGradient>
    <linearGradient id="pulsar-beam-{id}" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="hsl(174 100% 46% / 0)" />
      <stop offset="20%" stop-color="hsl(174 100% 46% / 0.8)" />
      <stop offset="50%" stop-color="hsl(174 100% 46% / 1)" />
      <stop offset="80%" stop-color="hsl(174 100% 46% / 0.8)" />
      <stop offset="100%" stop-color="hsl(174 100% 46% / 0)" />
    </linearGradient>
  </defs>
  
  <g>
    <line x1="8" y1="32" x2="56" y2="32" stroke="url(#pulsar-beam-{id})" stroke-width="2" opacity="0.6">
      <animateTransform attributeName="transform" type="rotate" 
          values="0 32 32;360 32 32" dur="3s" repeatCount="indefinite" />
    </line>
    <line x1="32" y1="8" x2="32" y2="56" stroke="url(#pulsar-beam-{id})" stroke-width="2" opacity="0.6">
      <animateTransform attributeName="transform" type="rotate" 
          values="45 32 32;405 32 32" dur="3s" repeatCount="indefinite" />
    </line>
  </g>
  
  <circle cx="32" cy="32" r="20" fill="none" stroke="hsl(174 100% 46% / 0.3)" stroke-width="1">
    <animate attributeName="r" values="18;22;18" dur="2s" repeatCount="indefinite" />
    <animate attributeName="opacity" values="0.3;0.7;0.3" dur="2s" repeatCount="indefinite" />
  </circle>
  
  <circle cx="32" cy="32" r="6" fill="url(#pulsar-core-{id})">
    <animate attributeName="r" values="6;8;6" dur="1.5s" repeatCount="indefinite" />
  </circle>
  
  <circle cx="32" cy="32" r="3" fill="hsl(174 100% 46%)">
    <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite" />
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
        setAvatarSvg(PULSAR_SVG.replace(/{id}/g, uniqueId));
        setIsLoading(false);
        return;
      }

      try {
        // Try to get user's selected avatar
        const avatarSelection = await AvatarService.getUserAvatarSelection(targetUserId);
        
        if (avatarSelection.selected_avatar_id) {
          const avatar = await AvatarService.getAvatarById(avatarSelection.selected_avatar_id);
          if (avatar) {
            setAvatarSvg(AvatarService.renderAvatarSvg(avatar, uniqueId));
            setIsLoading(false);
            return;
          }
        }
        
        // Fallback to Pulsar (default avatar)
        setAvatarSvg(PULSAR_SVG.replace(/{id}/g, uniqueId));
      } catch (error) {
        console.error('Avatar loading failed:', error);
        // Always fallback to Pulsar on any error
        setAvatarSvg(PULSAR_SVG.replace(/{id}/g, uniqueId));
      } finally {
        setIsLoading(false);
      }
    };

    loadAvatar();
  }, [targetUserId, uniqueId]);

  const containerClasses = cn(
    "relative flex shrink-0 overflow-hidden rounded-full",
    isAdmin && "ring-2 ring-primary/50",
    className
  );

  if (isLoading) {
    return (
      <div 
        className={cn("animate-pulse bg-muted", containerClasses)}
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