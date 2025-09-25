import React, { useEffect, useState } from 'react';
import { AvatarService, IonsAvatar } from '@/services/avatarService';
import { useUser } from '@/contexts/UserContext';

interface DynamicAvatarProps {
  userId?: string;
  size?: number;
  className?: string;
  fallbackToPulsar?: boolean;
}

export const DynamicAvatar: React.FC<DynamicAvatarProps> = ({ 
  userId, 
  size = 64, 
  className = "",
  fallbackToPulsar = true 
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
        } else if (fallbackToPulsar) {
          // Get Pulsar as default
          const avatars = await AvatarService.getAllActiveAvatars();
          const pulsar = avatars.find(a => a.name === 'Pulsar');
          setSelectedAvatar(pulsar || null);
        }
      } catch (error) {
        console.error('Failed to load user avatar:', error);
        if (fallbackToPulsar) {
          // Try to get Pulsar as fallback
          try {
            const avatars = await AvatarService.getAllActiveAvatars();
            const pulsar = avatars.find(a => a.name === 'Pulsar');
            setSelectedAvatar(pulsar || null);
          } catch (fallbackError) {
            console.error('Failed to load fallback avatar:', fallbackError);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadUserAvatar();
  }, [targetUserId, fallbackToPulsar]);

  if (isLoading) {
    return (
      <div 
        className={`animate-pulse bg-muted rounded-full ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  if (!selectedAvatar) {
    // Final fallback to hardcoded Pulsar
    return (
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 64 64" 
        className={className}
      >
        <defs>
          <radialGradient id={`pulsar-core-${uniqueId}`} cx="50%" cy="50%" r="30%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="70%" stopColor="hsl(var(--accent))" />
            <stop offset="100%" stopColor="hsl(var(--secondary))" />
          </radialGradient>
          <linearGradient id={`pulsar-beam-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary) / 0)" />
            <stop offset="20%" stopColor="hsl(var(--primary) / 0.8)" />
            <stop offset="50%" stopColor="hsl(var(--accent) / 1)" />
            <stop offset="80%" stopColor="hsl(var(--primary) / 0.8)" />
            <stop offset="100%" stopColor="hsl(var(--primary) / 0)" />
          </linearGradient>
        </defs>
        
        <g>
          <line x1="8" y1="32" x2="56" y2="32" stroke={`url(#pulsar-beam-${uniqueId})`} strokeWidth="2" opacity="0.6">
            <animateTransform attributeName="transform" type="rotate" 
                values="0 32 32;360 32 32" dur="3s" repeatCount="indefinite" />
          </line>
          <line x1="32" y1="8" x2="32" y2="56" stroke={`url(#pulsar-beam-${uniqueId})`} strokeWidth="2" opacity="0.6">
            <animateTransform attributeName="transform" type="rotate" 
                values="45 32 32;405 32 32" dur="3s" repeatCount="indefinite" />
          </line>
        </g>
        
        <circle cx="32" cy="32" r="20" fill="none" stroke="hsl(var(--primary) / 0.3)" strokeWidth="1">
          <animate attributeName="r" values="18;22;18" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.3;0.7;0.3" dur="2s" repeatCount="indefinite" />
        </circle>
        
        <circle cx="32" cy="32" r="6" fill={`url(#pulsar-core-${uniqueId})`}>
          <animate attributeName="r" values="6;8;6" dur="1.5s" repeatCount="indefinite" />
        </circle>
        
        <circle cx="32" cy="32" r="3" fill="hsl(var(--accent))">
          <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite" />
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