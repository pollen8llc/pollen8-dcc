import React, { useEffect, useState, memo } from 'react';
import { cn } from '@/lib/utils';
import { AvatarService, IonsAvatar } from '@/services/avatarService';
import { useUser } from '@/contexts/UserContext';
import { supabase } from '@/integrations/supabase/client';

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
        // For unauthenticated/no user, show blank 
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
        
        // If no assigned avatar found, check if user exists and assign default
        const { data: profile } = await supabase
          .from('profiles')
          .select('user_id')
          .eq('user_id', targetUserId)
          .maybeSingle();
          
        if (profile) {
          // User exists but no avatar assigned - set default Pulsar
          const pulsarId = 'f82017c3-a2b1-46c4-b1fb-d100b1c8b5ad';
          await AvatarService.updateUserSelectedAvatar(targetUserId, pulsarId);
          
          // Load the Pulsar avatar
          const pulsarAvatar = await AvatarService.getAvatarById(pulsarId);
          if (pulsarAvatar) {
            setAvatarSvg(AvatarService.renderAvatarSvg(pulsarAvatar, uniqueId));
          }
        }
      } catch (error) {
        // Silent fail - leave blank
      }
      
      setIsLoading(false);
    };

    loadAvatar();
  }, [targetUserId, uniqueId]);

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