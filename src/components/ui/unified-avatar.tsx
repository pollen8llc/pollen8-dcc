import React, { memo, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { SolarSystem } from './SolarSystem';
import { SolarSystemAvatarService } from '@/services/solarSystemAvatarService';
import { useUser } from '@/contexts/UserContext';

interface UnifiedAvatarProps {
  userId?: string;
  size?: number;
  className?: string;
  isAdmin?: boolean;
  isContactId?: boolean;
}

const UnifiedAvatar: React.FC<UnifiedAvatarProps> = memo(({ 
  userId, 
  size = 40, 
  className = "",
  isAdmin = false,
  isContactId = false
}) => {
  const { currentUser } = useUser();
  const [solarSystemId, setSolarSystemId] = useState<string>("UXI8000");
  const [loading, setLoading] = useState(true);
  
  const targetUserId = userId || currentUser?.id;

  useEffect(() => {
    const loadSolarSystem = async () => {
      if (!targetUserId) {
        setSolarSystemId(isContactId ? "UXI8000" : "UXI8018");
        setLoading(false);
        return;
      }

      // Check if the userId is already a solar system ID (starts with UXI)
      if (targetUserId.startsWith("UXI")) {
        setSolarSystemId(targetUserId);
        setLoading(false);
        return;
      }

      try {
        const systemId = await SolarSystemAvatarService.getCachedSolarSystemId(targetUserId, isContactId);
        setSolarSystemId(systemId);
      } catch (error) {
        console.error("Error loading solar system:", error);
        setSolarSystemId(isContactId ? "UXI8000" : "UXI8018"); // Contact Default vs Member Default
      } finally {
        setLoading(false);
      }
    };

    loadSolarSystem();
  }, [targetUserId, isContactId]);

  const containerClasses = cn(
    "relative flex-shrink-0 overflow-hidden rounded-full aspect-square bg-muted/20",
    isAdmin && "ring-2 ring-primary/50",
    className
  );

  if (loading) {
    // Show loading placeholder
    return (
      <div 
        className={cn(containerClasses, "bg-muted animate-pulse")}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div 
      className={containerClasses}
      style={{ width: size, height: size }}
    >
      <SolarSystem 
        systemId={solarSystemId}
        size={size}
      />
    </div>
  );
});

UnifiedAvatar.displayName = 'UnifiedAvatar';

export { UnifiedAvatar };
