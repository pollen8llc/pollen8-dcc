import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { SOLAR_SYSTEMS, type SolarSystemConfig } from '@/data/solarSystemsConfig';

interface SolarSystemProps {
  systemId: string;
  size?: number;
  className?: string;
  onClick?: () => void;
  /** Disable animations for better mobile performance */
  static?: boolean;
}

// Generate a stable unique ID based on systemId (not random)
const getStableId = (systemId: string) => `solar-${systemId}`;

// Cache for generated stylesheets to avoid re-injection
const injectedStyles = new Set<string>();

export const SolarSystem: React.FC<SolarSystemProps> = React.memo(({ 
  systemId, 
  size = 56, 
  className = "",
  onClick,
  static: isStatic = false
}) => {
  const config = SOLAR_SYSTEMS[systemId];
  
  if (!config) {
    console.warn(`Solar system ${systemId} not found`);
    return null;
  }

  const uniqueId = getStableId(systemId);
  const borderWidth = Math.max(2, size * 0.06);
  const innerSize = size - (borderWidth * 4);

  // Inject keyframes only once per systemId (not per render)
  useMemo(() => {
    if (isStatic || injectedStyles.has(uniqueId)) return;
    
    const styleSheet = document.createElement('style');
    styleSheet.id = `style-${uniqueId}`;
    styleSheet.type = 'text/css';
    
    let keyframes = '';
    const baseInnerSize = 56; // Use base size for keyframes
    
    config.planets.forEach((planet, index) => {
      const animationName = `orbit-${uniqueId}-${index}`;
      const scaledDistance = planet.distance;
      keyframes += `
        @keyframes ${animationName} {
          from { transform: rotate(0deg) translateX(${scaledDistance}px) rotate(0deg); }
          to { transform: rotate(360deg) translateX(${scaledDistance}px) rotate(-360deg); }
        }
      `;
    });
    
    styleSheet.innerHTML = keyframes;
    document.head.appendChild(styleSheet);
    injectedStyles.add(uniqueId);
    
    // Note: We don't remove styles on unmount to allow caching
  }, [uniqueId, config, isStatic]);

  // Calculate scaled sizes
  const scaledSunSize = config.sunSize * (innerSize / 56);

  return (
    <div 
      className={cn(
        "relative rounded-full overflow-hidden flex items-center justify-center",
        className
      )}
      style={{
        width: size,
        height: size,
        border: `${borderWidth}px solid`,
        borderColor: config.avatarStyle.borderColor,
        background: config.avatarStyle.background,
        boxShadow: config.avatarStyle.boxShadow,
        backdropFilter: 'blur(12px)',
        willChange: isStatic ? 'auto' : 'transform',
        contain: 'layout style paint',
      }}
      onClick={onClick}
    >
      <div 
        className="relative rounded-full"
        style={{
          width: innerSize,
          height: innerSize
        }}
      >
        {/* Orbital paths - static, no performance impact */}
        {config.planets.map((planet, index) => {
          const scaledDistance = planet.distance * (innerSize / 56);
          return (
            <div
              key={`orbit-${index}`}
              className="absolute top-1/2 left-1/2 rounded-full border border-white/10"
              style={{
                width: scaledDistance * 2,
                height: scaledDistance * 2,
                marginLeft: -scaledDistance,
                marginTop: -scaledDistance,
              }}
            />
          );
        })}
      
        {/* Sun - removed animate-pulse for better performance */}
        <div
          className="absolute top-1/2 left-1/2 rounded-full z-20"
          style={{
            width: scaledSunSize,
            height: scaledSunSize,
            backgroundColor: config.sunColor,
            marginLeft: -scaledSunSize / 2,
            marginTop: -scaledSunSize / 2,
            boxShadow: `0 0 ${scaledSunSize / 2}px ${config.sunColor}`
          }}
        />
      
        {/* Planets */}
        {config.planets.map((planet, index) => {
          const animationName = `orbit-${uniqueId}-${index}`;
          const scaledDistance = planet.distance * (innerSize / 56);
          const scaledSize = planet.size * (innerSize / 56);
          
          // For static mode, position planets at their initial angle
          const staticStyle = isStatic ? {
            transform: `translateX(${scaledDistance}px)`,
          } : {
            animation: `${animationName} ${planet.speed}s linear infinite`,
            animationDelay: `${planet.delay}s`,
          };
          
          return (
            <div
              key={`planet-${index}`}
              className="absolute top-1/2 left-1/2 z-10"
              style={staticStyle}
            >
              <div
                className="rounded-full"
                style={{
                  width: scaledSize,
                  height: scaledSize,
                  backgroundColor: planet.color,
                  marginLeft: -scaledSize / 2,
                  marginTop: -scaledSize / 2,
                  boxShadow: `0 0 ${scaledSize}px ${planet.color}`
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
});

SolarSystem.displayName = 'SolarSystem';
