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
}

const UnifiedAvatar: React.FC<UnifiedAvatarProps> = memo(({ 
  userId, 
  size = 40, 
  className = "",
  isAdmin = false 
}) => {
  const { currentUser } = useUser();
  const [solarSystemId, setSolarSystemId] = useState<string>('UXI8000');
  
  const targetUserId = userId || currentUser?.id;

  // Get the appropriate solar system for this user
  useEffect(() => {
    const getSolarSystem = async () => {
      const systemId = await SolarSystemAvatarService.getSolarSystemForUser(targetUserId);
      setSolarSystemId(systemId);
    };

    getSolarSystem();
  }, [targetUserId]);

  const containerClasses = cn(
    "relative flex shrink-0 overflow-hidden rounded-full",
    isAdmin && "ring-2 ring-primary/50",
    className
  );

  return (
    <div className={containerClasses}>
      <SolarSystem 
        systemId={solarSystemId}
        size={size}
        className="rounded-full"
      />
    </div>
  );
});

UnifiedAvatar.displayName = 'UnifiedAvatar';

export { UnifiedAvatar };