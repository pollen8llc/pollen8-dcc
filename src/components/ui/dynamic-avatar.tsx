import React, { useEffect, useState } from 'react';
import { AvatarService, IonsAvatar } from '@/services/avatarService';
import { useUser } from '@/contexts/UserContext';

interface DynamicAvatarProps {
  userId?: string;
  size?: number;
  className?: string;
  fallbackToMagnetosphere?: boolean;
}

export const DynamicAvatar: React.FC<DynamicAvatarProps> = ({ 
  userId, 
  size = 64, 
  className = "",
  fallbackToMagnetosphere = true 
}) => {
  const { currentUser } = useUser();
  const [selectedAvatar, setSelectedAvatar] = useState<IonsAvatar | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const targetUserId = userId || currentUser?.id;
  const uniqueId = `avatar-${targetUserId}-${Math.random().toString(36).substr(2, 9)}`;

  useEffect(() => {
    const loadUserAvatar = async () => {
      if (!targetUserId) {
        setIsLoading(false);
        return;
      }

      try {
        const avatarSelection = await AvatarService.getUserAvatarSelection(targetUserId);
        
        if (avatarSelection.selected_avatar_id) {
          const avatar = await AvatarService.getAvatarById(avatarSelection.selected_avatar_id);
          setSelectedAvatar(avatar);
        } else if (fallbackToMagnetosphere) {
          // Get Magnetosphere as default
          const avatars = await AvatarService.getAllActiveAvatars();
          const magnetosphere = avatars.find(a => a.name === 'Magnetosphere');
          setSelectedAvatar(magnetosphere || null);
        }
      } catch (error) {
        console.error('Failed to load user avatar:', error);
        if (fallbackToMagnetosphere) {
          // Try to get Magnetosphere as fallback
          try {
            const avatars = await AvatarService.getAllActiveAvatars();
            const magnetosphere = avatars.find(a => a.name === 'Magnetosphere');
            setSelectedAvatar(magnetosphere || null);
          } catch (fallbackError) {
            console.error('Failed to load fallback avatar:', fallbackError);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadUserAvatar();
  }, [targetUserId, fallbackToMagnetosphere]);

  if (isLoading) {
    return (
      <div 
        className={`animate-pulse bg-muted rounded-full ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  if (!selectedAvatar) {
    // Final fallback to hardcoded Magnetosphere
    return (
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 64 64" 
        className={className}
      >
        <defs>
          <radialGradient id={`fallback-${uniqueId}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--secondary))" />
          </radialGradient>
        </defs>
        <circle cx="32" cy="32" r="8" fill={`url(#fallback-${uniqueId})`} />
        <circle cx="32" cy="32" r="16" fill="none" stroke="hsl(var(--primary) / 0.4)" strokeWidth="2">
          <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="32" cy="32" r="12" fill="none" stroke="hsl(var(--accent) / 0.3)" strokeWidth="1">
          <animate attributeName="opacity" values="0.3;0.7;0.3" dur="2s" repeatCount="indefinite" begin="0.5s" />
        </circle>
      </svg>
    );
  }

  const svgContent = AvatarService.renderAvatarSvg(selectedAvatar, uniqueId);

  return (
    <div 
      className={className}
      style={{ width: size, height: size }}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
};