import React, { memo, useState, useEffect, useMemo } from 'react';
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
  /** Force static mode (no animations) for performance */
  static?: boolean;
}

// Simple mobile detection for performance optimization
const isMobileDevice = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768 || 
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

const UnifiedAvatar: React.FC<UnifiedAvatarProps> = memo(({ 
  userId, 
  size = 40, 
  className = "",
  isAdmin = false,
  isContactId = false,
  static: forceStatic
}) => {
  const { currentUser } = useUser();
  const [solarSystemId, setSolarSystemId] = useState<string>("UXI8000");
  const [loading, setLoading] = useState(true);
  
  const targetUserId = userId || currentUser?.id;
  
  // Use static mode on mobile for better performance
  const isStatic = useMemo(() => {
    if (forceStatic !== undefined) return forceStatic;
    return isMobileDevice();
  }, [forceStatic]);

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
    // Show loading placeholder - removed animate-pulse for performance
    return (
      <div 
        className={cn(containerClasses, "bg-muted")}
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
        static={isStatic}
      />
    </div>
  );
});

UnifiedAvatar.displayName = 'UnifiedAvatar';

export { UnifiedAvatar };
