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
    config.planets.forEach((planet, index) => {
      const animationName = `orbit-${uniqueId}-${index}`;
      keyframes += `
        @keyframes ${animationName} {
          from { transform: rotate(0deg) translateX(${planet.distance}px) rotate(0deg); }
          to { transform: rotate(360deg) translateX(${planet.distance}px) rotate(-360deg); }
        }
      `;
    });
    
    styleSheet.innerHTML = keyframes;
    document.head.appendChild(styleSheet);
    
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, [config, uniqueId]);

  return (
    <div 
      className={cn(
        "relative cursor-pointer transition-all duration-300 hover:scale-110",
        className
      )}
      style={{
        width: size,
        height: size,
        padding: '12px',
        borderRadius: '50%',
        border: '2px solid',
        borderColor: config.avatarStyle.borderColor,
        background: config.avatarStyle.background,
        boxShadow: config.avatarStyle.boxShadow,
        backdropFilter: 'blur(12px)'
      }}
      onClick={onClick}
    >
      {/* Orbital paths */}
      {config.planets.map((planet, index) => (
        <div
          key={`orbit-${index}`}
          className="absolute top-1/2 left-1/2 rounded-full border border-white/10"
          style={{
            width: planet.distance * 2,
            height: planet.distance * 2,
            marginLeft: -planet.distance,
            marginTop: -planet.distance,
          }}
        />
      ))}
      
      {/* Sun */}
      <div
        className="absolute top-1/2 left-1/2 rounded-full animate-pulse z-20"
        style={{
          width: config.sunSize,
          height: config.sunSize,
          backgroundColor: config.sunColor,
          marginLeft: -config.sunSize / 2,
          marginTop: -config.sunSize / 2,
          boxShadow: `0 0 ${config.sunSize / 2}px ${config.sunColor}`
        }}
      />
      
      {/* Planets */}
      {config.planets.map((planet, index) => {
        const animationName = `orbit-${uniqueId}-${index}`;
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
                width: planet.size,
                height: planet.size,
                backgroundColor: planet.color,
                marginLeft: -planet.size / 2,
                marginTop: -planet.size / 2,
                boxShadow: `0 0 ${planet.size}px ${planet.color}`
              }}
            />
          </div>
        );
      })}
    </div>
  );
};