import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { SOLAR_SYSTEMS, type SolarSystemConfig } from '@/data/solarSystemsConfig';

interface SolarSystemProps {
  systemId: string;
  size?: number;
  className?: string;
  onClick?: () => void;
}

export const SolarSystem: React.FC<SolarSystemProps> = ({ 
  systemId, 
  size = 56, 
  className = "",
  onClick 
}) => {
  const config = SOLAR_SYSTEMS[systemId];
  
  if (!config) {
    console.warn(`Solar system ${systemId} not found`);
    return null;
  }

  const uniqueId = `solar-${systemId}-${Math.random().toString(36).substr(2, 9)}`;

  useEffect(() => {
    // Generate unique keyframes for this system's planets
    const styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    
    let keyframes = '';
    const borderWidth = Math.max(2, size * 0.04);
    const innerSize = size - (borderWidth * 4);
    
    config.planets.forEach((planet, index) => {
      const animationName = `orbit-${uniqueId}-${index}`;
      const scaledDistance = planet.distance * (innerSize / 56);
      keyframes += `
        @keyframes ${animationName} {
          from { transform: rotate(0deg) translateX(${scaledDistance}px) rotate(0deg); }
          to { transform: rotate(360deg) translateX(${scaledDistance}px) rotate(-360deg); }
        }
      `;
    });
    
    styleSheet.innerHTML = keyframes;
    document.head.appendChild(styleSheet);
    
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, [config, uniqueId]);

  const borderWidth = Math.max(2, size * 0.06);
  const innerSize = size - (borderWidth * 4); // Simple calculation for inner space

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
        backdropFilter: 'blur(12px)'
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
        {/* Orbital paths */}
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
      
        {/* Sun */}
        <div
          className="absolute top-1/2 left-1/2 rounded-full z-20 animate-pulse"
          style={{
            width: config.sunSize * (innerSize / 56),
            height: config.sunSize * (innerSize / 56),
            backgroundColor: config.sunColor,
            marginLeft: -(config.sunSize * (innerSize / 56)) / 2,
            marginTop: -(config.sunSize * (innerSize / 56)) / 2,
            boxShadow: `0 0 ${(config.sunSize * (innerSize / 56)) / 2}px ${config.sunColor}`
          }}
        />
      
        {/* Planets */}
        {config.planets.map((planet, index) => {
          const animationName = `orbit-${uniqueId}-${index}`;
          const scaledDistance = planet.distance * (innerSize / 56);
          const scaledSize = planet.size * (innerSize / 56);
          return (
            <div
              key={`planet-${index}`}
              className="absolute top-1/2 left-1/2 z-10"
              style={{
                animation: `${animationName} ${planet.speed}s linear infinite`,
                animationDelay: `${planet.delay}s`,
              }}
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
};